export default async ({ core, context, github }) => {
	const { owner, repo } = context.repo;

    const [ latestRelease ] = await github.rest.repos.listReleases({
        owner,
        repo,
        per_page: 1
    });

    console.log(latestRelease);
};