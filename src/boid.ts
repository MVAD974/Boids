import { Vector } from './vector';

interface Controls {
    speed: number;
    alignment: number;
    cohesion: number;
    separation: number;
    perception: number;
    fov: number;
}

export class Boid {
    position: Vector;
    velocity: Vector;
    acceleration: Vector;
    maxForce = 0.1;

    constructor() {
        this.position = new Vector(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
        this.velocity = Vector.random2D();
        this.velocity.setMag(Math.random() * 2 + 2);
        this.acceleration = new Vector(0, 0);
    }

    align(boids: Boid[], controls: Controls): Vector {
        let steering = new Vector(0, 0);
        let total = 0;
        for (let other of boids) {
            let d = this.position.dist(other.position);
            if (other !== this && d < controls.perception) {
                const angle = this.velocity.angleBetween(Vector.sub(other.position, this.position));
                if (angle < (controls.fov / 2) * (Math.PI / 180)) {
                    steering.add(other.velocity);
                    total++;
                }
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(controls.speed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    cohesion(boids: Boid[], controls: Controls): Vector {
        let steering = new Vector(0, 0);
        let total = 0;
        for (let other of boids) {
            let d = this.position.dist(other.position);
            if (other !== this && d < controls.perception) {
                const angle = this.velocity.angleBetween(Vector.sub(other.position, this.position));
                if (angle < (controls.fov / 2) * (Math.PI / 180)) {
                    steering.add(other.position);
                    total++;
                }
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.sub(this.position);
            steering.setMag(controls.speed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    separation(boids: Boid[], controls: Controls): Vector {
        let steering = new Vector(0, 0);
        let total = 0;
        for (let other of boids) {
            let d = this.position.dist(other.position);
            if (other !== this && d < controls.perception) {
                const angle = this.velocity.angleBetween(Vector.sub(other.position, this.position));
                if (angle < (controls.fov / 2) * (Math.PI / 180)) {
                    let diff = Vector.sub(this.position, other.position);
                    diff.div(d * d);
                    steering.add(diff);
                    total++;
                }
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(controls.speed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    flock(boids: Boid[], controls: Controls) {
        let alignment = this.align(boids, controls);
        let cohesion = this.cohesion(boids, controls);
        let separation = this.separation(boids, controls);

        alignment.mult(controls.alignment);
        cohesion.mult(controls.cohesion);
        separation.mult(controls.separation);

        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
    }

    update(boids: Boid[], controls: Controls) {
        this.flock(boids, controls);

        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(controls.speed);
        this.acceleration.mult(0);

        this.edges();
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

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.velocity.heading());
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(-5, -5);
        ctx.lineTo(-5, 5);
        ctx.closePath();
        ctx.fillStyle = '#ddd';
        ctx.fill();
        ctx.restore();
    }
}
