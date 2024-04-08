import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const width = window.innerWidth
const height = window.innerHeight

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)

const renderer = new THREE.WebGLRenderer({
  antialias: true,
})
renderer.setSize(width, height, false)
document.body.appendChild(renderer.domElement)

let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;

const geometry = new THREE.BoxGeometry(1, 1, 1).toNonIndexed()
const material = new THREE.MeshBasicMaterial({
  color: "white"
})
const cube = new THREE.Mesh(geometry, material)
cube.userData.draggable = true;

camera.position.z = 2;

scene.add(cube)

const raycaster = new THREE.Raycaster()
var draggable: THREE.Object3D | null = null

window.addEventListener('click', event => {
    var mouseVector = new THREE.Vector2(
        event.clientX / window.innerWidth * 2 - 1,
        -event.clientY / window.innerHeight * 2 + 1
    );

    raycaster.setFromCamera(mouseVector, camera)
    const intersects = raycaster.intersectObjects(scene.children)
    console.log(intersects)
    for (var sect of intersects) {
        console.log(sect.point)
        console.log(sect.faceIndex)
    }
    if (intersects.length > 0 && intersects[0].object.userData.draggable) {
        draggable = intersects[0].object
    }
})

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();