import { Line } from "./Line";
import { Shape } from "./Shape";
import { Vector } from "./Vector";


export class Circle extends Shape
{
    private position: Vector;
    private radius: number;


    constructor(x: number, y: number, radius: number)
    {
        super();
        this.position = new Vector(x, y);
        this.radius = radius;
    }


    public contains(point: Vector): boolean
    {
        const distance = point.distanceBetween(this.getCenter());
        return distance <= this.radius;
    }

    public intersects(other: Shape): boolean
    {
        if(other instanceof Line) {
            return this.intersectsWithLine(other as Line);
        }

        return false;
    }

    private intersectsWithLine(other: Line): boolean
    {
        const center = this.getCenter();
        const start = other.getStart();
        const end = other.getEnd();

        if(this.contains(start) || this.contains(end)) return true;

        const direction = start.subtract(end);
        const dot = direction.dot(center);
        const closest = start.add(direction.multiply(dot));

        if(!other.contains(closest)) return false;

        const distance = center.distanceBetween(closest);

        return distance <= this.radius;
    }


    public getArea(): number
    {
        return Math.PI * this.radius * this.radius;
    }

    public getPerimeter(): number
    {
        return 2 * this.radius * Math.PI;
    }

    public getCenter(): Vector
    {
        const offset = new Vector(this.radius, this.radius);
        return this.position.add(offset);
    }


    public getPosition(): Vector
    {
        return this.position;
    }
    
    public getRadius(): number
    {
        return this.radius;
    }

    public getDiameter(): number
    {
        return this.radius * 2;
    }
}