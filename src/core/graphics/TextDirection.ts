export type TextDirectionType = typeof TextDirection[keyof typeof TextDirection];


export const TextDirection = {

    LTR: "ltr",
    RTL: "rtl",
    INHERIT: "inherit",

} as const;