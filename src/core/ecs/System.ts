import { QueryList } from "./Query";


export interface SystemConstructor
{
    new(priority: number): System,
}


export abstract class System
{
    protected abstract queries: QueryList;
    protected priority: number;
    protected enabled: boolean;


    constructor(priority: number)
    {
        this.priority = priority;
        this.enabled = true;
        this.initialize();
    }


    public static byPriority(value: System, other: System): number
    {
        return value.priority - other.priority;
    }


    public abstract initialize(): void;
    public abstract execute(elapsed: number, frame: number): void;


    public getPriority(): number
    {
        return this.priority;
    }

    public isEnabled(): boolean
    {
        return this.enabled;
    }

    public enable()
    {
        this.enabled = true;
    }

    public disable()
    {
        this.enabled = false;
    }
}