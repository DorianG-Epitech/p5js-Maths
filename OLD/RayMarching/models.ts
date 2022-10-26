import P5, { Vector } from 'p5'

export class Sphere {
    position: Vector
    radius: number

    constructor(position: Vector, radius: number) {
        this.position = position
        this.radius = radius
    }

    draw(p5: P5) {
        p5.noFill();
        p5.stroke(255);
        p5.strokeWeight(0.5);
        p5.ellipse(this.position.x, this.position.y, this.radius * 2)
    }

    distance(point: Vector, p5: P5): number {
        return p5.dist(point.x, point.y, this.position.x, this.position.y) - this.radius
    }
}

export class Box {
    position: Vector
    size: Vector

    constructor(position: Vector, size: Vector) {
        this.position = position
        this.size = size
    }

    draw(p5: P5) {
        p5.noFill();
        p5.stroke(255);
        p5.strokeWeight(0.5);
        p5.rect(this.position.x, this.position.y, this.size.x, this.size.y)
    }

    distance(origin: Vector, p5: P5): number {
        let x = Math.max(this.position.x, Math.min(origin.x, this.position.x + this.size.x))
        let y = Math.max(this.position.y, Math.min(origin.y, this.position.y + this.size.y))
        return p5.dist(origin.x, origin.y, x, y)
    }
}