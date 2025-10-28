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
    fov: 360,
    confine: false
};

const speedSlider = document.getElementById('speed') as HTMLInputElement;
const alignmentSlider = document.getElementById('alignment') as HTMLInputElement;
const cohesionSlider = document.getElementById('cohesion') as HTMLInputElement;
const separationSlider = document.getElementById('separation') as HTMLInputElement;
const perceptionSlider = document.getElementById('perception') as HTMLInputElement;
const fovSlider = document.getElementById('fov') as HTMLInputElement;
const debugToggle = document.getElementById('debug') as HTMLInputElement;
const confineToggle = document.getElementById('confine') as HTMLInputElement;

const classicBtn = document.getElementById('classic') as HTMLButtonElement;
const coordinatedBtn = document.getElementById('coordinated') as HTMLButtonElement;
const scatteredBtn = document.getElementById('scattered') as HTMLButtonElement;
const nervousBtn = document.getElementById('nervous') as HTMLButtonElement;
const toggleControlsBtn = document.getElementById('toggle-controls') as HTMLButtonElement;

const controlsPanel = document.getElementById('controls');

const speedValue = document.getElementById('speed-value') as HTMLSpanElement;
const alignmentValue = document.getElementById('alignment-value') as HTMLSpanElement;
const cohesionValue = document.getElementById('cohesion-value') as HTMLSpanElement;
const separationValue = document.getElementById('separation-value') as HTMLSpanElement;
const perceptionValue = document.getElementById('perception-value') as HTMLSpanElement;
const fovValue = document.getElementById('fov-value') as HTMLSpanElement;

function updateSliders() {
    speedSlider.value = controls.speed.toString();
    speedValue.textContent = controls.speed.toString();
    alignmentSlider.value = controls.alignment.toString();
    alignmentValue.textContent = controls.alignment.toString();
    cohesionSlider.value = controls.cohesion.toString();
    cohesionValue.textContent = controls.cohesion.toString();
    separationSlider.value = controls.separation.toString();
    separationValue.textContent = controls.separation.toString();
    perceptionSlider.value = controls.perception.toString();
    perceptionValue.textContent = controls.perception.toString();
    fovSlider.value = controls.fov.toString();
    fovValue.textContent = controls.fov.toString();
}

toggleControlsBtn.addEventListener('click', () => {
    controlsPanel?.classList.toggle('hidden');
});

classicBtn.addEventListener('click', () => {
    controls.speed = 4;
    controls.alignment = 1;
    controls.cohesion = 1;
    controls.separation = 1;
    controls.perception = 50;
    controls.fov = 360;
    updateSliders();
});

coordinatedBtn.addEventListener('click', () => {
    controls.speed = 5;
    controls.alignment = 1.5;
    controls.cohesion = 1;
    controls.separation = 0.5;
    controls.perception = 100;
    controls.fov = 270;
    updateSliders();
});

scatteredBtn.addEventListener('click', () => {
    controls.speed = 3;
    controls.alignment = 0.5;
    controls.cohesion = 0.5;
    controls.separation = 2;
    controls.perception = 20;
    controls.fov = 360;
    updateSliders();
});

nervousBtn.addEventListener('click', () => {
    controls.speed = 8;
    controls.alignment = 1;
    controls.cohesion = 2;
    controls.separation = 2;
    controls.perception = 70;
    controls.fov = 180;
    updateSliders();
});

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
debugToggle.addEventListener('change', (e) => {
    const specialBoid = flock[0];
    specialBoid.debug = (e.target as HTMLInputElement).checked;
});
confineToggle.addEventListener('change', (e) => {
    controls.confine = (e.target as HTMLInputElement).checked;
});


const flock: Boid[] = [];

for (let i = 0; i < 100; i++) {
    flock.push(new Boid());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let boid of flock) {
        boid.update(flock, controls);
        boid.draw(ctx, controls, flock);
    }

    requestAnimationFrame(animate);
}

animate();
