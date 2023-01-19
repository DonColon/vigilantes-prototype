export type InputStateType = typeof InputState[keyof typeof InputState];


export const InputState = {

    STILL_RELEASED: "StillReleased",
    JUST_PRESSED: "JustPressed",
    STILL_PRESSED: "StillPressed",
    JUST_RELEASED: "JustReleased",

} as const;