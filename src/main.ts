import { Boid } from './boid';

const canvas = document.getElementById('simulationCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const flock: Boid[] = [];

for (let i = 0; i < 100; i++) {
    flock.push(new Boid());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let boid of flock) {
        boid.update(flock);
        boid.draw(ctx);
    }

    requestAnimationFrame(animate);
}

animate();
