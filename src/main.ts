import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as TWEEN from '@tweenjs/tween.js'

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
  vertexColors: true,
  side: THREE.DoubleSide
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
const start = -cubesNumber % 2
for (let i = start; i < cubesNumber-1; i+=1) {
  for (let j = start; j < cubesNumber-1; j+=1) {
    for (let k = start; k < cubesNumber-1; k+=1) {
      //const edges = new THREE.EdgesGeometry(geometry); 
      //const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 0x000000, linewidth: 10})); 
      const cube = new THREE.Mesh(geometry, material)
      /*line.material.linewidth = 10
      line.add(cube)*/
      cube.userData.draggable = true
      cube.userData.name = `Cube: ${i}, ${j}, ${k}`
      cube.position.set(i, j, k)
      cubes.push(cube)
    }
  }
}

for (var cube of cubes)
  scene.add(cube)

const raycaster = new THREE.Raycaster()

let initialClick = new THREE.Vector2()
let dragged = new THREE.Vector2()

var draggable: THREE.Object3D | null
let clicked = false

window.addEventListener('click', event => {
  /*if (draggable) {
    console.log(`Dropping draggable: ${draggable.userData.name}`)
    draggable = null as any
    return 
  }*/
  clicked = true
  var mouseVector = new THREE.Vector2(
    event.clientX / window.innerWidth * 2 - 1,
    -event.clientY / window.innerHeight * 2 + 1
  );

  initialClick = mouseVector.copy(mouseVector);

  raycaster.setFromCamera(mouseVector, camera)
  const intersects = raycaster.intersectObjects(scene.children)

  if (intersects.length > 0 && intersects[0].object.userData.draggable) {
    console.log(intersects[0].object.position)
    draggable = intersects[0].object
  }
})

let mouseVector = new THREE.Vector2()

window.addEventListener('mousemove', event => {
  if (clicked) {
    mouseVector = new THREE.Vector2(
      event.clientX / window.innerWidth * 2 - 1,
      -event.clientY / window.innerHeight * 2 + 1
    );
    dragged = mouseVector.copy(mouseVector);
  }
})

/*
const xAxis = new THREE.Vector3(1, 0, 0)
const yAxis = new THREE.Vector3(0, 0, 1)
*/

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

/*
const quaternion = new THREE.Quaternion();
const degree = Math.PI / 2
*/

function dragObject() {
  if (draggable != null) {
    raycaster.setFromCamera(mouseVector, camera)
    const intersect = raycaster.intersectObjects(scene.children)
    if (intersect.length > 0) {
      for (let sect of intersect) {
        if (!sect.object.userData.draggable) {
          continue
        }

        const toRotate: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.MeshBasicMaterial, THREE.Object3DEventMap>[] = cubes.filter(cube => cube.position.x == draggable!.position.x);
        const toRotateGroup = new THREE.Group()

        for (let cube of toRotate) {
          toRotateGroup.add(cube)
        }
        scene.add(toRotateGroup)
        
        let targetRotation = Math.PI / 2;
        if (initialClick.x - dragged.x < 0)
          rotateGroup(toRotateGroup, -targetRotation)
        else 
          rotateGroup(toRotateGroup, targetRotation);
      }
    }
  }
}

function rotateGroup(group: THREE.Group<THREE.Object3DEventMap>, targetRotation: number) {
  new TWEEN.Tween(group.rotation)
    .to({x: targetRotation }, 4000)
    .start();
}

window.addEventListener('mouseup', () => {
  clicked = false
  draggable = null; // Stop dragging when mouse is released
})

/*
const axis = new THREE.Vector3(0, 1, 1)
quaternion.setFromAxisAngle(axis.normalize(), THREE.MathUtils.degToRad(degree));
*/

camera.position.z = 7.5;

function animate() {
  requestAnimationFrame(animate);
  dragObject()
  TWEEN.update()
	renderer.render(scene, camera);
}
animate();