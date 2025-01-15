import { test, expect } from "vitest";
import { Vector } from "../../../src/core/math/Vector";
import { Circle } from "../../../src/core/math/Circle";
import { Rectangle } from "../../../src/core/math/Rectangle";
import { Polygon } from "../../../src/core/math/Polygon";

test("Create circle from three points", () => {
	const start = new Vector(0, 6);
    const center = new Vector(6, 0);
    const end = new Vector(2, 2);

    const result = Circle.ofPoints(start, center, end);
    const position = result.getPosition();
    const radius = result.getRadius();
    
    expect(position.x).toBe(7);
    expect(position.y).toBe(7);
    expect(position.z).toBe(0);
    expect(radius).approximately(7.0710, 0.1);
});

test("Circle intersects with circle", () => {
	const value = new Circle(6, 6, 6);
    const positiveValue = new Circle(0, 0, 3);
    const negativeValue = new Circle(100, 100, 6);

    let result = value.intersects(positiveValue);
    expect(result).toBeTruthy();

    result = value.intersects(negativeValue);
    expect(result).toBeFalsy();
});

test("Circle intersects with rectangle", () => {
	const value = new Circle(0, 0, 4);
    const positiveValue = new Rectangle(-2, -2, 10, 5);
    const negativeValue = new Rectangle(100, 100, 10, 5);

    let result = value.intersects(positiveValue);
    expect(result).toBeTruthy();

    result = value.intersects(negativeValue);
    expect(result).toBeFalsy();
});

test("Circle intersects with polygon", () => {
	const value = new Circle(0, 0, 4);

    const positiveValue = new Polygon([
        new Vector(1, -2),
        new Vector(1, 2),
        new Vector(0, 8)
    ]);

    const negativeValue = new Polygon([
        new Vector(5, 5),
        new Vector(10, 10),
        new Vector(5, 15)
    ]);
    
    let result = value.intersects(positiveValue);
    expect(result).toBeTruthy();

    result = value.intersects(negativeValue);
    expect(result).toBeFalsy();
});

test("Circle intersects with null", () => {
	const value = new Circle(0, 0, 4);
    const errorValue = null;
    
    const result = value.intersects(errorValue);
    expect(result).toBeFalsy();
});

test("Get border point of circle", () => {
	const value = new Circle(6, 6, 6);
    const result = value.getBorderPoint(90);

    expect(result.x).approximately(6, 0.1);
    expect(result.y).toBe(0);
    expect(result.z).toBe(0);
});

test("Get area of circle", () => {
	const value = new Circle(0, 0, 6);
    const result = value.getArea();

    expect(result).approximately(113.0973, 0.1);
});

test("Get perimeter of circle", () => {
	const value = new Circle(0, 0, 6);
    const result = value.getPerimeter();

    expect(result).approximately(37.6991, 0.1);
});

test("Get diameter of circle", () => {
	const value = new Circle(0, 0, 6);
    const result = value.getDiameter();

    expect(result).toBe(12);
});