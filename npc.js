import * as THREE from 'three';

export class NPCManager {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.npcs = [];

        for (let i = 0; i < 5; i++) {
            const geometry = new THREE.BoxGeometry(1.5, 2, 1);
            const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
            const npc = new THREE.Mesh(geometry, material);
            npc.position.set(Math.random() * 50 - 25, 1, Math.random() * 50 - 25);
            scene.add(npc);
            this.npcs.push(npc);
        }
    }

    update(delta) {
        this.npcs.forEach(npc => {
            // Simple AI: Move towards player
            const direction = new THREE.Vector3();
            direction.subVectors(this.player.controls.getObject().position, npc.position).normalize();
            npc.position.add(direction.multiplyScalar(delta * 3));
        });
    }
}
