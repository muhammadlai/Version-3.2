import * as THREE from 'three';

export class Combat {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.bullets = [];

        document.addEventListener('click', () => this.shoot());
    }

    shoot() {
        const bulletGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
        bullet.position.copy(this.player.controls.getObject().position);
        bullet.direction = new THREE.Vector3();
        this.player.controls.getDirection(bullet.direction);
        this.bullets.push(bullet);
        this.scene.add(bullet);
    }

    update(delta) {
        this.bullets.forEach((b, i) => {
            b.position.addScaledVector(b.direction, delta * 50);
            if (b.position.length() > 200) {
                this.scene.remove(b);
                this.bullets.splice(i, 1);
            }
        });
    }
}
