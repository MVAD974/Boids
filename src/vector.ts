export class Vector {
    x: number;
    y: number;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(v: Vector) {
        this.x += v.x;
        this.y += v.y;
    }

    sub(v: Vector) {
        this.x -= v.x;
        this.y -= v.y;
    }

    mult(n: number) {
        this.x *= n;
        this.y *= n;
    }

    div(n: number) {
        this.x /= n;
        this.y /= n;
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const len = this.mag();
        if (len !== 0) this.mult(1 / len);
    }

    setMag(n: number) {
        this.normalize();
        this.mult(n);
    }

    limit(max: number) {
        const mSq = this.mag() * this.mag();
        if (mSq > max * max) {
            this.div(Math.sqrt(mSq));
            this.mult(max);
        }
    }

    heading() {
        return Math.atan2(this.y, this.x);
    }

    dist(v: Vector) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static sub(v1: Vector, v2: Vector): Vector {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }

    static random2D(): Vector {
        return new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1);
    }
}
