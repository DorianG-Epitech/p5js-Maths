import P5, { Vector } from 'p5'
import {
    Sphere, Box,
} from './models'

type displayMode = 'SINGLE_RAY' | 'MULTIPLE_RAYS'

const MIN_DIST = 1
const MAX_DIST = 3600
const spheres: Sphere[] = [
    new Sphere(new Vector(300, 250), 100),
    new Sphere(new Vector(350, 350), 100),
]
const squares: Box[] = [
    new Box(new Vector(200, 350), new Vector(200, 200)),
    new Box(new Vector(250, 100), new Vector(100, 100)),
]

const sketch = (p5: P5) => {
    var currentMode: displayMode = 'SINGLE_RAY'
    var baseOrigin = new Vector(100, 100)

    p5.setup = () => {
        setupButton();
        p5.createCanvas(600, 600);
        p5.frameRate(60);
    }
    
    p5.draw = () => {
        p5.background(0);
        
        // Draw the spheres
        spheres.forEach(sphere => sphere.draw(p5));
        squares.forEach(square => square.draw(p5));
        
        var direction: Vector;
        if (currentMode === 'SINGLE_RAY') {
            baseOrigin = new Vector(p5.mouseX, p5.mouseY)
            p5.stroke(255);
            p5.strokeWeight(1);
            for (var i = 0; i < Math.PI * 2; i += 0.01) {
                direction = new Vector(Math.cos(i), Math.sin(i))
                rayTracing(direction, false, true, false);
            }
        } else {
            direction = new Vector(p5.mouseX, p5.mouseY).sub(baseOrigin.copy()).normalize()
            var intersectDist = rayTracing(direction, true, true, true);
            p5.line(baseOrigin.x, baseOrigin.y, baseOrigin.x + direction.x * intersectDist, baseOrigin.y + direction.y * intersectDist);
        }
    }

    const setupButton = () => {
        const button = p5.createButton(currentMode === 'SINGLE_RAY' ? 'Multiple rays' : 'Single ray');
        button.position(10, 10);
        button.mousePressed(() => {
            currentMode = currentMode === 'SINGLE_RAY' ? 'MULTIPLE_RAYS' : 'SINGLE_RAY';
            button.html(currentMode === 'SINGLE_RAY' ? 'Multiple rays' : 'Single ray');
            baseOrigin = new Vector(p5.random(0, p5.width), p5.random(0, p5.height))
        });
    }
    
    function smoothMin(a: number, b: number, k: number): number {
        var h = Math.max(k - Math.abs(a - b), 0) / k;
        return Math.min(a, b) - h * h * h * k * (1 / 6);
    }
    
    function getDistance(origin: Vector): number {
        var distances = [];
        distances = distances.concat(spheres.map(sphere => sphere.distance(origin, p5)));
        distances = distances.concat(squares.map(square => square.distance(origin, p5)));
        return distances.reduce((a, b) => smoothMin(a, b, 1));
    }
    
    function getNormal(origin: Vector): Vector {
        var d = getDistance(origin)
        var normal = new Vector(
            (getDistance(new Vector(origin.x + 0.01, origin.y)) - d) / 0.01,
            (getDistance(new Vector(origin.x, origin.y + 0.01)) - d) / 0.01,
        )
        return normal.normalize()
    }
    
    function rayTracing(direction: Vector, displayCircle: boolean = false, displayPoint: boolean = false, displayNormal: boolean = false): number {
        let hitDistance: number
        let globalDistance: number = 0
        let currentOrigin = baseOrigin.copy()
        let normal: Vector
        
        do {
            hitDistance = getDistance(currentOrigin)
            globalDistance += hitDistance
            
            if (displayCircle) {
                p5.stroke(255, 0, 0)
                p5.strokeWeight(0.5)
                p5.ellipse(currentOrigin.x, currentOrigin.y, hitDistance * 2)
            }
            currentOrigin = new Vector(
                currentOrigin.x + direction.x * hitDistance,
                currentOrigin.y + direction.y * hitDistance,
            )
        } while (hitDistance > MIN_DIST && hitDistance < MAX_DIST);
        normal = getNormal(currentOrigin)
        
        if (displayPoint) {
            p5.stroke(0, 255, 0)
            p5.strokeWeight(2)
            p5.point(currentOrigin.x, currentOrigin.y)
        }
        
        if (displayNormal) {
            p5.stroke(0, 0, 255)
            p5.strokeWeight(1)
            p5.line(currentOrigin.x, currentOrigin.y, currentOrigin.x + normal.x * 100, currentOrigin.y + normal.y * 100)
        }
        return globalDistance;
    }
}

export default sketch;