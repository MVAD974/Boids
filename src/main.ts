import { Boid } from './boid';

const canvas = document.getElementById('simulationCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const controls = {
    speed: 4,
    alignment: 1,
    cohesion: 1,
    separation: 1,
    perception: 50,
    fov: 360
};

const speedSlider = document.getElementById('speed') as HTMLInputElement;
const alignmentSlider = document.getElementById('alignment') as HTMLInputElement;
const cohesionSlider = document.getElementById('cohesion') as HTMLInputElement;
const separationSlider = document.getElementById('separation') as HTMLInputElement;
const perceptionSlider = document.getElementById('perception') as HTMLInputElement;
const fovSlider = document.getElementById('fov') as HTMLInputElement;

const speedValue = document.getElementById('speed-value') as HTMLSpanElement;
const alignmentValue = document.getElementById('alignment-value') as HTMLSpanElement;
const cohesionValue = document.getElementById('cohesion-value') as HTMLSpanElement;
const separationValue = document.getElementById('separation-value') as HTMLSpanElement;
const perceptionValue = document.getElementById('perception-value') as HTMLSpanElement;
const fovValue = document.getElementById('fov-value') as HTMLSpanElement;

speedSlider.addEventListener('input', (e) => {
    controls.speed = parseFloat((e.target as HTMLInputElement).value);
    speedValue.textContent = controls.speed.toString();
});
alignmentSlider.addEventListener('input', (e) => {
    controls.alignment = parseFloat((e.target as HTMLInputElement).value);
    alignmentValue.textContent = controls.alignment.toString();
});
cohesionSlider.addEventListener('input', (e) => {
    controls.cohesion = parseFloat((e.target as HTMLInputElement).value);
    cohesionValue.textContent = controls.cohesion.toString();
});
separationSlider.addEventListener('input', (e) => {
    controls.separation = parseFloat((e.target as HTMLInputElement).value);
    separationValue.textContent = controls.separation.toString();
});
perceptionSlider.addEventListener('input', (e) => {
    controls.perception = parseFloat((e.target as HTMLInputElement).value);
    perceptionValue.textContent = controls.perception.toString();
});
fovSlider.addEventListener('input', (e) => {
    controls.fov = parseFloat((e.target as HTMLInputElement).value);
    fovValue.textContent = controls.fov.toString();
});


const flock: Boid[] = [];

for (let i = 0; i < 100; i++) {
    flock.push(new Boid());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let boid of flock) {
        boid.update(flock, controls);
        boid.draw(ctx);
    }

    requestAnimationFrame(animate);
}

animate();
