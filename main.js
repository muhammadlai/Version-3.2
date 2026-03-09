import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { Player } from './player.js';
import { NPCManager } from './npc.js';
import { Combat } from './combat.js';
import { Environment } from './environment.js';

let scene, camera, renderer, controls, clock;
let player, npcs, combat, environment;

init();
animate();

function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.02);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('game-container').appendChild(renderer.domElement);

    controls = new PointerLockControls(camera, document.body);
    document.body.addEventListener('click', () => controls.lock());

    clock = new THREE.Clock();

    // Environment
    environment = new Environment(scene);

    // Player
    player = new Player(scene, camera, controls);

    // NPCs
    npcs = new NPCManager(scene, player);

    // Combat
    combat = new Combat(scene, player);

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    player.update(delta);
    npcs.update(delta);
    combat.update(delta);
    environment.update(delta);

    renderer.render(scene, camera);
}
