import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as TWEEN from '@tweenjs/tween.js'

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

const cubes: THREE.LineSegments<THREE.EdgesGeometry<THREE.BufferGeometry<THREE.NormalBufferAttributes>>, THREE.LineBasicMaterial, THREE.Object3DEventMap>[] = []

const cubesNumber = 3
const start = -cubesNumber % 2
for (let i = start; i < cubesNumber-1; i+=1) {
  for (let j = start; j < cubesNumber-1; j+=1) {
    for (let k = start; k < cubesNumber-1; k+=1) {
      const edges = new THREE.EdgesGeometry(geometry); 
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 0x000000, linewidth: 10})); 
      const cube = new THREE.Mesh(geometry, material)
      line.material.linewidth = 10
      line.add(cube)
      line.userData.draggable = true
      line.userData.name = `Cube: ${i}, ${j}, ${k}`
      line.position.set(i, j, k)
      cubes.push(line)
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

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

function dragObject() {
  console.log("clicked", clicked)
  if (draggable != null && clicked) {
    console.log("clicked", clicked)
    raycaster.setFromCamera(mouseVector, camera)
    const intersect = raycaster.intersectObjects(scene.children)
    if (intersect.length > 0) {
      for (let sect of intersect) {
        if (!sect.object.userData.draggable) {
          continue
        }
        console.log("first", draggable.position)

        const xOffset = initialClick.x - dragged.x
        const yOffset = initialClick.y - dragged.y

        const xAxis = new THREE.Vector3(1, 0, 0)
        const yAxis = new THREE.Vector3(0, 1, 0)

        const toRotateX: THREE.LineSegments<THREE.EdgesGeometry<THREE.BufferGeometry<THREE.NormalBufferAttributes>>, THREE.LineBasicMaterial, THREE.Object3DEventMap>[] = cubes.filter(cube => cube.position.x == draggable!.position.x);
        const toRotateY: THREE.LineSegments<THREE.EdgesGeometry<THREE.BufferGeometry<THREE.NormalBufferAttributes>>, THREE.LineBasicMaterial, THREE.Object3DEventMap>[] = cubes.filter(cube => cube.position.y == draggable!.position.y);
        
        const toRotateGroup = new THREE.Group()
        let targetRotation = Math.PI / 2;
        
        if (Math.abs(xOffset) > Math.abs(yOffset)) {
            for (var cube of toRotateX) {
              toRotateGroup.add(cube)
              if (toRotateX.length == 9 && xOffset != 0)
              if (xOffset < 0)
              rotateGroup(toRotateGroup, targetRotation*-1, xAxis)
            else
              rotateGroup(toRotateGroup, targetRotation, xAxis)
            }
        } else {
            for (var cube of toRotateY) {
              toRotateGroup.add(cube)
              if (toRotateY.length == 9 && yOffset != 0)
            
            if (yOffset < 0)
              rotateGroup(toRotateGroup, -targetRotation, yAxis)
            else if (yOffset > 0)
              rotateGroup(toRotateGroup, targetRotation, yAxis)
          }
        }
        scene.add(toRotateGroup)
        
        clicked = false
      }

    }
  }
}

function clearGroup(direction: 'x' | 'y', group: THREE.Group<THREE.Object3DEventMap>) {
  for (var i = group.children.length - 1; i >= 0; i--) {
    let item = group.children[i];
    item.getWorldPosition(item.position);
    item.getWorldQuaternion(item.quaternion);
    item.position.x = Math.round(item.position.x);
    item.position.y = Math.round(item.position.y);
    item.position.z = Math.round(item.position.z);
    group.remove(item);
    scene.add(item);
  }
  if (direction === 'x') {
    group.rotation.x = 0;
  } else if (direction === 'y') {
    group.rotation.y = 0;
  }
}

function rotateGroup(group: THREE.Group<THREE.Object3DEventMap>, targetRotation: number, axis: THREE.Vector3) {
  const quaternion = new THREE.Quaternion().setFromAxisAngle(axis.normalize(), targetRotation);

  new TWEEN.Tween(group.quaternion)
    .to(quaternion, 1000)
    .onComplete(() => {
      clearGroup(new THREE.Vector3(1, 0, 0) ? 'x' : 'y', group)
    })
    .start();
}

window.addEventListener('mouseup', () => {
  clicked = false
  draggable = null; 
})

camera.position.z = 7.5;

function animate() {
  requestAnimationFrame(animate);
  console.log("clicked", clicked)
  dragObject()
  TWEEN.update()
	renderer.render(scene, camera);
}
animate();