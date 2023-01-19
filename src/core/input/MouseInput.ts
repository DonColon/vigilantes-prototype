export type MouseInputType = typeof MouseInput[keyof typeof MouseInput];


export const MouseInput = {

    LEFT:  0,
    RIGHT:  2,
    WHEEL:  1,
    WHEEL_UP:  5,
    WHEEL_DOWN:  6,
    
    FORWARD:  4,
    BACKWARD:  3,

} as const;