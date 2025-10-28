import { Vector } from './vector';

interface Controls {
    speed: number;
    alignment: number;
    cohesion: number;
    separation: number;
    perception: number;
    fov: number;
    confine: boolean;
}

export class Boid {
    position: Vector;
    velocity: Vector;
    acceleration: Vector;
    maxForce = 0.1;
    debug = false;

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
        const turnForce = 0.2;

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

    draw(ctx: CanvasRenderingContext2D, controls: Controls, boids: Boid[]) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.velocity.heading());
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(-5, -5);
        ctx.lineTo(-5, 5);
        ctx.closePath();
        ctx.fillStyle = this.debug ? 'red' : '#ddd';
        ctx.fill();
        ctx.restore();

        if (this.debug) {
            ctx.save();
            ctx.translate(this.position.x, this.position.y);

            // Draw perception radius
            ctx.beginPath();
            ctx.arc(0, 0, controls.perception, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.stroke();

            // Draw field of view
            ctx.save();
            ctx.rotate(this.velocity.heading());
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, controls.perception, -controls.fov / 2 * (Math.PI / 180), controls.fov / 2 * (Math.PI / 180));
            ctx.closePath();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.fill();
            ctx.restore();

            // Draw line to closest boid
            let closest: Boid | null = null;
            let closestDist = Infinity;
            for (let other of boids) {
                if (other !== this) {
                    let d = this.position.dist(other.position);
                    if (d < closestDist) {
                        closestDist = d;
                        closest = other;
                    }
                }
            }
            if (closest) {
                ctx.beginPath();
                ctx.moveTo(0, 0);
                const localClosest = Vector.sub(closest.position, this.position);
                ctx.lineTo(localClosest.x, localClosest.y);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.stroke();
            }

            ctx.restore();
        }
    }
}
