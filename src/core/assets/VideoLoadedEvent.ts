import { AssetLoadedEvent } from "./AssetLoadedEvent";


export interface VideoLoadedEvent extends AssetLoadedEvent
{
    video: HTMLVideoElement
}