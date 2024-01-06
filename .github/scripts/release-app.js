import pkg from "../../package.json" assert { type: "json" };

export default async ({ core, context, github }) => {
	const appVersion = `v${pkg.version}`;
	const { owner, repo } = context.repo;

	const { data: [latestRelease]  } = await github.rest.repos.listReleases({
		owner,
		repo,
		per_page: 1
	});

	let isFirstRelease = false;
	let previousVersion = appVersion;

	if (latestRelease) {
		previousVersion = latestRelease.tag_name;
		core.info(`Previous release version: ${previousVersion}`);
	} else {
		isFirstRelease = true;
		core.info(`First release version: ${appVersion}`);
	}

	if (!isFirstRelease && appVersion <= previousVersion) {
		core.info("Version has not changed");
		core.setOutput("released", false);
		process.exit();
	}

	const releaseName = `${createDisplayName(repo)} ${appVersion}`;
	const { data: release } = await github.rest.repos.createRelease({
		owner,
		repo,
		tag_name: appVersion,
		name: releaseName,
		target_commitish: process.env.GITHUB_SHA,
	});

	core.info(`Created release ${appVersion}`);
	core.setOutput("released", true);
	core.setOutput("upload_url", release.upload_url);
	core.setOutput("release_id", release.id);

	const artifactName = `${repo}-build-${appVersion}`;
	core.info(`Download build artifact ${artifactName}`);

	const { data: { artifacts: [artifactMetadata] }  } = await github.rest.actions.listArtifactsForRepo({
		owner,
		repo,
		name: artifactName,
		per_page: 1
	});

	const { data: artifact } = await github.rest.actions.downloadArtifact({
		owner,
		repo,
		artifact_id: artifactMetadata.id,
		archive_format: "zip"
	});

	core.info(`Upload build artifact ${artifactName}`);
	const assetLabel = `${createDisplayName(repo)} Build ${appVersion}`;
	const assetName = `${artifactName}.zip`;

	await github.request({
		method: "POST",
		url: release.upload_url,
		headers: {
			"content-type": "application/zip"
		},
		data: artifact,
		name: assetName,
		label: assetLabel
	});

	core.info(`Created release asset ${assetName}`);
};

function createDisplayName(repo) {
	return repo.split("-").map(value => capitalize(value)).join(" ");
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
