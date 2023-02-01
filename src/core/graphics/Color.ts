import { ColorSpaces } from "./ColorSpaces";


type ColorSettings = ColorSpaces.HEX & ColorSpaces.RGB & ColorSpaces.HSL & ColorSpaces.HWB;


export class Color
{
    private constructor(private settings: ColorSettings) {}


    public static hex(code: string): Color
    {
        const { red, green, blue, alpha } = ColorSpaces.hex2rgb(code);
        const { hue, saturation, lightness} = ColorSpaces.rgb2hsl(red, green, blue, alpha);
        const { whiteness, blackness } = ColorSpaces.hsl2hwb(hue, saturation, lightness, alpha);

        return new Color({ code, red, green, blue, hue, saturation, lightness, whiteness, blackness, alpha });
    }

    public static rgb(red: number, green: number, blue: number, alpha?: number): Color
    {
        const code = ColorSpaces.rgb2hex(red, green, blue, alpha);
        const { hue, saturation, lightness } = ColorSpaces.rgb2hsl(red, green, blue, alpha);
        const { whiteness, blackness } = ColorSpaces.hsl2hwb(hue, saturation, lightness, alpha);

        return new Color({ code, red, green, blue, hue, saturation, lightness, whiteness, blackness, alpha });
    }

    public static hsl(hue: number, saturation: number, lightness: number, alpha?: number): Color
    {
        const { red, green, blue } = ColorSpaces.hsl2rgb(hue, saturation, lightness, alpha);
        const { whiteness, blackness } = ColorSpaces.hsl2hwb(hue, saturation, lightness, alpha);
        const code = ColorSpaces.rgb2hex(red, green, blue, alpha);

        return new Color({ code, red, green, blue, hue, saturation, lightness, whiteness, blackness, alpha });
    }

    public static hwb(hue: number, whiteness: number, blackness: number, alpha?: number): Color
    {
        const { saturation, lightness } = ColorSpaces.hwb2hsl(hue, whiteness, blackness, alpha);
        const { red, green, blue } = ColorSpaces.hsl2rgb(hue, saturation, lightness, alpha);
        const code = ColorSpaces.rgb2hex(red, green, blue, alpha);

        return new Color({ code, red, green, blue, hue, saturation, lightness, whiteness, blackness, alpha });
    }


    public static css(property: string): Color | null
    {
        if(property.startsWith("#")) {
            return Color.hex(property);
        }
        else if(property.startsWith("rgb")) {
            const args = property.match(/\d*\.?\d+/g);

            if(args !== null) {
                const [red, green, blue, alpha] = args.map(Number);
                return Color.rgb(red, green, blue, alpha);
            }
        }
        else if(property.startsWith("hsl")) {
            const args = property.match(/\d*\.?\d+/g);

            if(args !== null) {
                const [hue, saturation, lightness, alpha] = args.map(Number);
                return Color.hsl(hue, saturation, lightness, alpha);
            }
        }
        else if(property.startsWith("hwb")) {
            const args = property.match(/\d*\.?\d+/g);

            if(args !== null) {
                const [hue, whiteness, blackness, alpha] = args.map(Number);
                return Color.hwb(hue, whiteness, blackness, alpha);
            }
        }

        return null;
    }


    public mix(other: Color, percentage: number = 0.5): Color
    {
        const r = (1 - percentage) * this.settings.red + percentage * other.settings.red;
        const g = (1 - percentage) * this.settings.green + percentage * other.settings.green;
        const b = (1 - percentage) * this.settings.blue + percentage * other.settings.blue;

        if(this.settings.alpha && other.settings.alpha) {
            const a = (1 - percentage) * this.settings.alpha + percentage * other.settings.alpha;
            return Color.rgb(r, g, b, a);
        }

        return Color.rgb(r, g, b);
    }

    public invert(): Color
    {
        const { red, green, blue, alpha } = this.settings;

        const r = 255 - red;
        const g = 255 - green;
        const b = 255 - blue;

        return Color.rgb(r, g, b, alpha);
    }

    public complement(): Color
    {
        const { hue, saturation, lightness, alpha } = this.settings;
        const h = (hue + 180) % 360;
        return Color.hsl(h, saturation, lightness, alpha);
    }

    public saturate(value: number): Color
    {
        if(value < 0 || value > 100) {
            throw new RangeError("value must be percentage");
        }

        const { hue, saturation, lightness, alpha } = this.settings;

        let s = saturation + value;
        if(s > 100) s = 100;

        return Color.hsl(hue, s, lightness, alpha);
    }

    public desaturate(value: number): Color
    {
        if(value < 0 || value > 100) {
            throw new RangeError("value must be percentage");
        }

        const { hue, saturation, lightness, alpha } = this.settings;

        let s = saturation - value;
        if(s < 0) s = 0;

        return Color.hsl(hue, s, lightness, alpha);
    }

    public grayscale(): Color
    {
        const { hue, lightness, alpha } = this.settings;
        return Color.hsl(hue, 0, lightness, alpha);
    }

    public lighten(value: number): Color
    {
        if(value < 0 || value > 100) {
            throw new RangeError("value must be percentage");
        }

        const { hue, saturation, lightness, alpha } = this.settings;

        let l = lightness + value;
        if(l > 100) l = 100;

        return Color.hsl(hue, saturation, l, alpha);
    }

    public darken(value: number): Color
    {
        if(value < 0 || value > 100) {
            throw new RangeError("value must be percentage");
        }

        const { hue, saturation, lightness, alpha } = this.settings;

        let l = lightness - value;
        if(l < 0) l = 0;

        return Color.hsl(hue, saturation, l, alpha);
    }

    public opacify(value: number): Color
    {
        if(value < 0 || value > 100) {
            throw new RangeError("value must be percentage");
        }

        const { hue, saturation, lightness, alpha } = this.settings;

        let a = alpha || 100;
        a += value;

        if(a > 100) a = 100;

        return Color.hsl(hue, saturation, lightness, a);
    }

    public transparentize(value: number): Color
    {
        if(value < 0 || value > 100) {
            throw new RangeError("value must be percentage");
        }

        const { hue, saturation, lightness, alpha } = this.settings;

        let a = alpha || 100;
        a -= value;

        if(a > 100) a = 100;

        return Color.hsl(hue, saturation, lightness, a);
    }


    public asCss(property: "hex" | "rgb" | "hsl" | "hwb"): string
    {
        if(property === "hex") {
            return this.settings.code;
        }
        else if(property === "rgb") {
            const { red, green, blue, alpha } = this.settings;

            if(alpha) {
                return `rgb(${red} ${green} ${blue} / ${alpha})`;
            } else {
                return `rgb(${red} ${green} ${blue})`;
            }
        }
        else if(property === "hsl") {
            const { hue, saturation, lightness, alpha } = this.settings;

            if(alpha) {
                return `hsl(${hue} ${saturation} ${lightness} / ${alpha})`;
            } else {
                return `hsl(${hue} ${saturation} ${lightness})`;
            }
        }
        else if(property === "hwb") {
            const { hue, whiteness, blackness, alpha } = this.settings;

            if(alpha) {
                return `hwb(${hue} ${whiteness} ${blackness} / ${alpha})`;
            } else {
                return `hwb(${hue} ${whiteness} ${blackness})`;
            }
        }

        throw new SyntaxError("Should not happen");
    }


    public asHEX(): string
    {
        return this.settings.code;
    }

    public asRGB(): ColorSpaces.RGB
    {
        return {
            red: this.settings.red,
            green: this.settings.green,
            blue: this.settings.blue,
            alpha: this.settings.alpha
        };
    }

    public asHSL(): ColorSpaces.HSL
    {
        return {
            hue: this.settings.hue,
            saturation: this.settings.saturation,
            lightness: this.settings.lightness,
            alpha: this.settings.alpha   
        };
    }

    public asHWB(): ColorSpaces.HWB
    {
        return {
            hue: this.settings.hue,
            whiteness: this.settings.whiteness,
            blackness: this.settings.blackness,
            alpha: this.settings.alpha
        };
    }
}