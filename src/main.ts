import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const width = window.innerWidth - 20
const height = window.innerHeight - 20

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)

const renderer = new THREE.WebGLRenderer({
  antialias: true,
})
renderer.setSize(width, height, false)
renderer.setAnimationLoop(animate)
document.body.appendChild(renderer.domElement)

let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;

const geometry = new THREE.BoxGeometry(1, 1, 1).toNonIndexed()
const material = new THREE.MeshBasicMaterial({
  vertexColors: true
})

const positionAttribute = geometry.getAttribute("position")
const colors = [0xb71b1b, 0x201b9b, 0xffffff, 0xe0dc12, 0xf16916, 0x0ba334]
const threeColors = []
const color = new THREE.Color()
let index = 0

for (let i = 0; i < positionAttribute.count; i+=6) {
  color.setHex(colors[index])

  threeColors.push(color.r, color.g, color.b)
  threeColors.push(color.r, color.g, color.b)
  threeColors.push(color.r, color.g, color.b)

  threeColors.push(color.r, color.g, color.b)
  threeColors.push(color.r, color.g, color.b)
  threeColors.push(color.r, color.g, color.b)
  index++
}

geometry.setAttribute('color', new THREE.Float32BufferAttribute(threeColors, 3))

const cubes: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.MeshBasicMaterial, THREE.Object3DEventMap>[] = []

const cubesNumber = 3
for (let i = 0; i < cubesNumber; i++) {
  for (let j = 0; j < cubesNumber; j++) {
    for (let k = 0; k < cubesNumber; k++) {
      const edges = new THREE.EdgesGeometry(geometry); 
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 0x000000, linewidth: 10})); 
      const cube = new THREE.Mesh(geometry, material)
      line.material.linewidth = 10
      cube.add(line)
      cube.position.set(i, j, k)
      cubes.push(cube)
    }
  }
}

for (var cube of cubes)
  scene.add(cube)

const quaternion = new THREE.Quaternion();
const axis = new THREE.Vector3(0, 1, 1)
const degree = 45
quaternion.setFromAxisAngle(axis.normalize(), THREE.MathUtils.degToRad(degree));

camera.position.z = 7.5;

function animate() {
  requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();

/*
group.add(cube1);
group.add(cube2);
group.add(cube3);
group.add(cube4);
group.add(cube5);
group.add(cube6);
group.add(cube7);
group.add(cube8);
group.add(cube9);
group.add(cube10);
group.add(cube11);
group.add(cube12);
group.add(cube13);
group.add(cube14);
group.add(cube15);
group.add(cube16);
group.add(cube17);
group.add(cube18);
group.add(cube19);
group.add(cube20);
group.add(cube21);
group.add(cube22);
group.add(cube23);
group.add(cube24);
group.add(cube25);
group.add(cube26);
group.add(cube27);
*/

/*
const cube1 = new THREE.Mesh(geometry, material)
cube1.position.set(-1, 0, 0)
cube1.add(edges)

const cube2 = new THREE.Mesh(geometry, material)
cube2.position.set(0, 0, 0)
cube2.add(edges)

const cube3 = new THREE.Mesh(geometry, material)
cube3.position.set(1, 0, 0)
cube3.add(edges)

const cube4 = new THREE.Mesh(geometry, material)
cube4.position.set(-1, 1, 0)
cube4.add(edges)

const cube5 = new THREE.Mesh(geometry, material)
cube5.position.set(0, 1, 0)
cube5.add(edges)

const cube6 = new THREE.Mesh(geometry, material)
cube6.position.set(1, 1, 0)
cube6.add(edges)

const cube7 = new THREE.Mesh(geometry, material)
cube7.position.set(-1, -1, 0)
cube7.add(edges)

const cube8 = new THREE.Mesh(geometry, material)
cube8.position.set(0, -1, 0)
cube8.add(edges)

const cube9 = new THREE.Mesh(geometry, material)
cube9.position.set(1, -1, 0)
cube9.add(edges)

const cube10 = new THREE.Mesh(geometry, material)
cube10.position.set(-1, 0, 1)
cube10.add(edges)

const cube11 = new THREE.Mesh(geometry, material)
cube11.position.set(0, 0, 1)
cube1.add(edges)

const cube12 = new THREE.Mesh(geometry, material)
cube12.position.set(1, 0, 1)
cube1.add(edges)

const cube13 = new THREE.Mesh(geometry, material)
cube13.position.set(-1, 1, 1)
cube1.add(edges)

const cube14 = new THREE.Mesh(geometry, material)
cube14.position.set(0, 1, 1)
cube1.add(edges)

const cube15 = new THREE.Mesh(geometry, material)
cube15.position.set(1, 1, 1)
cube1.add(edges)

const cube16 = new THREE.Mesh(geometry, material)
cube16.position.set(-1, -1, 1)
cube1.add(edges)

const cube17 = new THREE.Mesh(geometry, material)
cube17.position.set(0, -1, 1)
cube1.add(edges)

const cube18 = new THREE.Mesh(geometry, material)
cube18.position.set(1, -1, 1)
cube1.add(edges)

const cube19 = new THREE.Mesh(geometry, material)
cube19.position.set(-1, 0, -1)
cube1.add(edges)

const cube20 = new THREE.Mesh(geometry, material)
cube20.position.set(0, 0, -1)
cube1.add(edges)

const cube21 = new THREE.Mesh(geometry, material)
cube21.position.set(1, 0, -1)
cube1.add(edges)

const cube22 = new THREE.Mesh(geometry, material)
cube22.position.set(-1, 1, -1)
cube1.add(edges)

const cube23 = new THREE.Mesh(geometry, material)
cube23.position.set(0, 1, -1)
cube1.add(edges)

const cube24 = new THREE.Mesh(geometry, material)
cube24.position.set(1, 1, -1)
cube1.add(edges)

const cube25 = new THREE.Mesh(geometry, material)
cube25.position.set(-1, -1, -1)
cube1.add(edges)

const cube26 = new THREE.Mesh(geometry, material)
cube26.position.set(0, -1, -1)
cube1.add(edges)

const cube27 = new THREE.Mesh(geometry, material)
cube27.position.set(1, -1, -1)
cube1.add(edges)
*/ 