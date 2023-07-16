import { GameError } from "core/GameError";
import { AssetManifest } from "./AssetManifest";
import { AudioAsset, CssAsset, FontAsset, HtmlAsset, ImageAsset, JavaScriptAsset, JsonAsset, VideoAsset, XmlAsset } from "./Asset";


export class AssetLoader
{
    private audioContext: AudioContext;
    private domParser: DOMParser;


    constructor(private manifest: AssetManifest)
    {
        this.audioContext = new AudioContext();
        this.domParser = new DOMParser();
    }


    public async load(bundleName: string)
    {
        const bundle = this.manifest.bundles[bundleName];

        if(!bundle) {
            throw new GameError(`Bundle ${bundleName} does not exist in asset manifest`);
        }

        const assetRoot = this.manifest.assetRoot;

        for(const asset of bundle) {
            asset.url = (assetRoot) ? assetRoot.concat(asset.url) : asset.url;

            if(asset.type === "audio") {
                await this.loadAudio(asset);
            }
            else if(asset.type === "image") {
                await this.loadImage(asset);
            }
            else if(asset.type === "video") {
                await this.loadVideo(asset);
            }
            else if(asset.type === "font") {
                await this.loadFont(asset);
            }
            else if(asset.type === "json") {
                await this.loadJson(asset);
            }
            else if(asset.type === "xml") {
                await this.loadXml(asset);
            }
            else if(asset.type === "html") {
                await this.loadHtml(asset);
            }
            else if(asset.type === "css") {
                await this.loadCss(asset);
            }
            else if(asset.type === "javascript") {
                await this.loadJavaScript(asset);
            }
        }

        eventSystem.dispatch("bundleLoaded", { bundle: bundleName });
    }


    private async loadAudio(asset: AudioAsset)
    {
        const response = await fetch(asset.url);
        const data = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(data);

        const audioTrack = { 
            buffer: audioBuffer, 
            channel: asset.subtype 
        };

        eventSystem.dispatch("audioLoaded", { assetID: asset.id, track: audioTrack });
    }

    private async loadImage(asset: ImageAsset)
    {
        if(asset.subtype === "Sprite") {
            this.loadSprite(asset);
        }
    }

    private async loadSprite(asset: ImageAsset)
    {
        const image = new Image();
        image.src = asset.url;
        await image.decode();

        eventSystem.dispatch("imageLoaded", { assetID: asset.id, image: image });
    }

    private async loadVideo(asset: VideoAsset)
    {
        return new Promise((resolve, reject) => {
            const video = document.createElement("video");
            video.autoplay = true;
            video.src = asset.url;
            video.onload = resolve;
            video.onerror = reject;
            video.load();

            eventSystem.dispatch("videoLoaded", { assetID: asset.id, video: video });
        });
    }

    private async loadFont(asset: FontAsset)
    {
        const response = await fetch(asset.url);
        const buffer = await response.arrayBuffer();
        const font = new FontFace(asset.id, buffer);
        await font.load();

        eventSystem.dispatch("fontLoaded", { assetID: asset.id, font: font });
    }

    private async loadJson(asset: JsonAsset)
    {
        const response = await fetch(asset.url);
        const json = await response.json();

        eventSystem.dispatch("jsonLoaded", { assetID: asset.id, json: json });
    }

    private async loadXml(asset: XmlAsset)
    {
        const response = await fetch(asset.url);
        const text = await response.text();
        const xml = this.domParser.parseFromString(text, "application/xml") as XMLDocument;

        eventSystem.dispatch("xmlLoaded", { assetID: asset.id, xml: xml });
    }

    private async loadHtml(asset: HtmlAsset)
    {
        const response = await fetch(asset.url);
        const text = await response.text();
        const html = this.domParser.parseFromString(text, "text/html");

        eventSystem.dispatch("htmlLoaded", { assetID: asset.id, html: html });
    }

    private async loadCss(asset: CssAsset)
    {
        return new Promise((resolve, reject) => {
            const css = document.createElement("link");
            css.rel = "stylesheet";
            css.href = asset.url;
            css.onload = resolve;
            css.onerror = reject;

            eventSystem.dispatch("cssLoaded", { assetID: asset.id, css: css });
        });
    }

    private async loadJavaScript(asset: JavaScriptAsset)
    {

        if(asset.subtype === "Script") {
            await this.loadScript(asset);
        } 
        else if(asset.subtype === "Module") {
            await this.loadModule(asset);
        }
    }

    private async loadScript(asset: JavaScriptAsset)
    {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.async = true;
            script.src = asset.url;
            script.onload = resolve;
            script.onerror = reject;
            
            eventSystem.dispatch("scriptLoaded", { assetID: asset.id, script: script });
        });
    }

    private async loadModule(asset: JavaScriptAsset)
    {
        const module = await import(asset.url);
        eventSystem.dispatch("moduleLoaded", { assetID: asset.id, module: module });
    }
}