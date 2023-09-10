import { WorldEvent } from "../ecs/WorldEvent";
import { BundleLoadedEvent } from "../assets/BundleLoadedEvent";
import { ImageLoadedEvent } from "../assets/ImageLoadedEvent";
import { AudioLoadedEvent } from "../assets/AudioLoadedEvent";
import { VideoLoadedEvent } from "../assets/VideoLoadedEvent";
import { FontLoadedEvent } from "../assets/FontLoadedEvent";
import { JsonLoadedEvent } from "../assets/JsonLoadedEvent";
import { XmlLoadedEvent } from "../assets/XmlLoadedEvent";
import { HtmlLoadedEvent } from "../assets/HtmlLoadedEvent";
import { CssLoadedEvent } from "../assets/CssLoadedEvent";
import { ScriptLoadedEvent } from "../assets/ScriptLoadedEvent";


export type EventNames = keyof GameEvents;
export type EventHandler<Name extends EventNames = any> = (event: GameEvents[Name]) => void;


export interface GameEvents
{
    "entityChanged": WorldEvent,
    "bundleLoaded": BundleLoadedEvent,
    "imageLoaded": ImageLoadedEvent,
    "audioLoaded": AudioLoadedEvent,
    "videoLoaded": VideoLoadedEvent,
    "fontLoaded": FontLoadedEvent,
    "jsonLoaded": JsonLoadedEvent,
    "xmlLoaded": XmlLoadedEvent,
    "htmlLoaded": HtmlLoadedEvent,
    "cssLoaded": CssLoadedEvent,
    "scriptLoaded": ScriptLoadedEvent
}