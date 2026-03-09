import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

let scene, camera, renderer, controls;
let player = { velocity: new THREE.Vector3(), canJump: false };
const objects = [];

init();
animate();

function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    // Fog for depth
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.02);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('game-container').appendChild(renderer.domElement);

    // Controls
    controls = new PointerLockControls(camera, document.body);
    document.body.addEventListener('click', () => controls.lock());

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(200, 200);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);
    objects.push(floor);

    // Neon cubes (buildings)
    for (let i = 0; i < 50; i++) {
        const geometry = new THREE.BoxGeometry(5, Math.random() * 50 + 5, 5);
        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(`hsl(${Math.random() * 360}, 100%, 50%)`),
            emissive: new THREE.Color(`hsl(${Math.random() * 360}, 100%, 20%)`)
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(Math.random() * 100 - 50, geometry.parameters.height / 2, Math.random() * 100 - 50);
        scene.add(cube);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    const neonLight = new THREE.PointLight(0xff00ff, 1, 50);
    neonLight.position.set(0, 20, 0);
    scene.add(neonLight);

    // Window resize
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Basic movement
const keys = {};
document.addEventListener('keydown', (e) => keys[e.code] = true);
document.addEventListener('keyup', (e) => keys[e.code] = false);

function animate() {
    requestAnimationFrame(animate);

    const delta = 0.1;

    // Movement
    if (controls.isLocked) {
        const speed = 0.5;
        if (keys['KeyW']) controls.moveForward(speed);
        if (keys['KeyS']) controls.moveForward(-speed);
        if (keys['KeyA']) controls.moveRight(-speed);
        if (keys['KeyD']) controls.moveRight(speed);
        if (keys['Space'] && player.canJump) {
            player.velocity.y += 10;
            player.canJump = false;
        }

        // Gravity
        player.velocity.y -= 0.5 * delta;
        controls.getObject().position.y += player.velocity.y * delta;
        if (controls.getObject().position.y < 2) {
            player.velocity.y = 0;
            controls.getObject().position.y = 2;
            player.canJump = true;
        }
    }

    renderer.render(scene, camera);
}
