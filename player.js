import * as THREE from 'three';

export class Player {
    constructor(scene, camera, controls) {
        this.scene = scene;
        this.camera = camera;
        this.controls = controls;
        this.velocity = new THREE.Vector3();
        this.canJump = false;
        this.speed = 10;

        this.keys = {};
        document.addEventListener('keydown', (e) => this.keys[e.code] = true);
        document.addEventListener('keyup', (e) => this.keys[e.code] = false);
    }

    update(delta) {
        if (!this.controls.isLocked) return;

        const speed = this.speed * delta;
        if (this.keys['KeyW']) this.controls.moveForward(speed);
        if (this.keys['KeyS']) this.controls.moveForward(-speed);
        if (this.keys['KeyA']) this.controls.moveRight(-speed);
        if (this.keys['KeyD']) this.controls.moveRight(speed);

        if (this.keys['Space'] && this.canJump) {
            this.velocity.y = 15;
            this.canJump = false;
        }

        this.velocity.y -= 30 * delta; // gravity
        this.controls.getObject().position.y += this.velocity.y * delta;
        if (this.controls.getObject().position.y < 2) {
            this.velocity.y = 0;
            this.controls.getObject().position.y = 2;
            this.canJump = true;
        }
    }
}
