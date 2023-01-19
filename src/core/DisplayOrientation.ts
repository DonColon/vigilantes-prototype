export type DisplayOrientationType = typeof DisplayOrientation[keyof typeof DisplayOrientation];


export const DisplayOrientation = {

    ANY: "any",
    NATURAL: "natural",

    LANDSCAPE: "landscape",
    LANDSCAPE_PRIMARY: "landscape-primary",
    LANDSCAPE_SECONDARY: "landscape-secondary",

    PORTRAIT: "portrait",
    PORTRAIT_PRIMARY: "portrait-primary",
    PORTRAIT_SECONDARY: "portrait-secondary",

} as const;