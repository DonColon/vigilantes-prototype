import { test, expect } from "vitest";
import { Vector } from "../../../src/core/math/Vector";
import { Rectangle } from "../../../src/core/math/Rectangle";
import { Polygon } from "../../../src/core/math/Polygon";
import { Circle } from "../../../src/core/math/Circle";

test("Rectangle contains point", () => {
	const value = new Rectangle(0, 0, 10, 5);
    const positiveValue = new Vector(5, 3);
    const negativeValue = new Vector(100, 100);

    let result = value.contains(positiveValue);
    expect(result).toBeTruthy();

    result = value.contains(negativeValue);
    expect(result).toBeFalsy();
});

test("Rectangle intersects with circle", () => {
	const value = new Rectangle(0, 0, 10, 5);
    const edgeCaseWidth = new Circle(11, 3, 8);
    const edgeCaseHeight = new Circle(5, 6, 8);

    let result = value.intersects(edgeCaseWidth);
    expect(result).toBeTruthy();

    result = value.intersects(edgeCaseHeight);
    expect(result).toBeTruthy();
});

test("Rectangle intersects with rectangle", () => {
	const value = new Rectangle(0, 0, 10, 5);
    const positiveValue = new Rectangle(-2, -2, 10, 5);
    const negativeValue = new Rectangle(100, 100, 10, 5);

    let result = value.intersects(positiveValue);
    expect(result).toBeTruthy();

    result = value.intersects(negativeValue);
    expect(result).toBeFalsy();
});

test("Rectangle intersects with polygon", () => {
	const value = new Rectangle(0, 0, 10, 5);

    const positiveValue = new Polygon([
        new Vector(1, -2),
        new Vector(1, 2),
        new Vector(0, 8)
    ]);

    const negativeValue = new Polygon([
        new Vector(50, 50),
        new Vector(100, 100),
        new Vector(50, 150)
    ]);
    
    let result = value.intersects(positiveValue);
    expect(result).toBeTruthy();

    result = value.intersects(negativeValue);
    expect(result).toBeFalsy();
});

test("Rectangle intersects with null", () => {
	const value = new Rectangle(0, 0, 10, 5);
    const errorValue = null;
    
    const result = value.intersects(errorValue);
    expect(result).toBeFalsy();
});

test("Get area of rectangle", () => {
	const value = new Rectangle(0, 0, 10, 5);
    const result = value.getArea();

    expect(result).toBe(50);
});

test("Get perimeter of rectangle", () => {
	const value = new Rectangle(0, 0, 10, 5)
    const result = value.getPerimeter();

    expect(result).toBe(30);
});

test("Get center of rectangle", () => {
	const value = new Rectangle(0, 0, 10, 5)
    const result = value.getCenter();

    expect(result.x).toBe(5);
    expect(result.y).toBe(2.5);
    expect(result.z).toBe(0);
});

test("Get position of rectangle", () => {
	const value = new Rectangle(0, 0, 10, 5)
    const result = value.getPosition();

    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
    expect(result.z).toBe(0);
});

test("Get dimension of rectangle", () => {
	const value = new Rectangle(0, 0, 10, 5)
    const result = value.getDimension();

    expect(result.width).toBe(10);
    expect(result.height).toBe(5);
});

test("Get width of rectangle", () => {
	const value = new Rectangle(0, 0, 10, 5)
    const result = value.getWidth();

    expect(result).toBe(10);
});

test("Get height of rectangle", () => {
	const value = new Rectangle(0, 0, 10, 5)
    const result = value.getHeight();

    expect(result).toBe(5);
});