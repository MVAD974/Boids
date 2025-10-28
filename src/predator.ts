import { Vector } from './vector';
import { Boid } from './boid';

interface Controls {
    speed: number;
    confine: boolean;
}

export class Predator {
    position: Vector;
    velocity: Vector;
    acceleration: Vector;
    maxSpeed = 5;
    maxForce = 0.2;

    constructor() {
        this.position = new Vector(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
        this.velocity = Vector.random2D();
        this.velocity.setMag(Math.random() * 2 + 3);
        this.acceleration = new Vector(0, 0);
    }

    hunt(boids: Boid[]): Vector {
        let closestDist = Infinity;
        let closestBoid: Boid | null = null;

        for (let boid of boids) {
            let d = this.position.dist(boid.position);
            if (d < closestDist) {
                closestDist = d;
                closestBoid = boid;
            }
        }

        if (closestBoid) {
            let desired = Vector.sub(closestBoid.position, this.position);
            desired.setMag(this.maxSpeed);
            let steer = Vector.sub(desired, this.velocity);
            steer.limit(this.maxForce);
            return steer;
        }

        return new Vector(0, 0);
    }

    update(boids: Boid[], controls: Controls) {
        let huntForce = this.hunt(boids);
        this.acceleration.add(huntForce);

        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(controls.speed);
        this.acceleration.mult(0);

        if (controls.confine) {
            this.confine();
        } else {
            this.edges();
        }
    }

    edges() {
        if (this.position.x > window.innerWidth) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = window.innerWidth;
        }
        if (this.position.y > window.innerHeight) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = window.innerHeight;
        }
    }

    confine() {
        const margin = 100;
        const turnForce = 0.3;

        if (this.position.x < margin) {
            this.acceleration.add(new Vector(turnForce, 0));
        } else if (this.position.x > window.innerWidth - margin) {
            this.acceleration.add(new Vector(-turnForce, 0));
        }

        if (this.position.y < margin) {
            this.acceleration.add(new Vector(0, turnForce));
        } else if (this.position.y > window.innerHeight - margin) {
            this.acceleration.add(new Vector(0, -turnForce));
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.velocity.heading());
        ctx.beginPath();
        ctx.moveTo(15, 0);
        ctx.lineTo(-7.5, -7.5);
        ctx.lineTo(-7.5, 7.5);
        ctx.closePath();
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.restore();
    }
}
