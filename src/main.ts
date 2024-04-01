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

var draggable: THREE.Object3D

window.addEventListener('click', event => {
  /*if (draggable) {
    console.log(`Dropping draggable: ${draggable.userData.name}`)
    draggable = null as any
    return 
  }*/

  var mouseVector = new THREE.Vector2(
    event.clientX / window.innerWidth * 2 - 1,
    -event.clientY / window.innerHeight * 2 + 1
  );

  initialClick = mouseVector.copy(mouseVector);
  console.log("initial click", initialClick);

  raycaster.setFromCamera(mouseVector, camera)
  const intersects = raycaster.intersectObjects(scene.children)

  if (intersects.length > 0 && intersects[0].object.userData.draggable) {
    console.log(intersects[0].object.position)
    draggable = intersects[0].object
  }
})

let mouseVector = new THREE.Vector2()

window.addEventListener('mousemove', event => {
  mouseVector = new THREE.Vector2(
    event.clientX / window.innerWidth * 2 - 1,
    -event.clientY / window.innerHeight * 2 + 1
  );
  dragged = mouseVector.copy(mouseVector);
  console.log("dragged", dragged);
})

/*const xAxis = new THREE.Vector3(1, 0, 0)
const yAxis = new THREE.Vector3(0, 0, 1)*/

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const quaternion = new THREE.Quaternion();
const degree = Math.PI / 2

function dragObject() {
  if (draggable != null) {
    raycaster.setFromCamera(mouseVector, camera)
    const intersect = raycaster.intersectObjects(scene.children)
    if (intersect.length > 0) {
      for (let sect of intersect) {
        if (!sect.object.userData.draggable) {
          continue
        }

        let target = sect.point

        const toRotate: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.MeshBasicMaterial, THREE.Object3DEventMap>[] = []
        for (var cube of cubes) {
          if (cube.position.x == draggable.position.x)
            toRotate.push(cube)
        }

        const group = new THREE.Group()
        for (var cube of toRotate) {
          group.add(cube)
        }
        scene.add(group)
        if (initialClick.x - dragged.x < 0)
          group.rotation.x = -target.x
        else 
          group.rotation.x = target.x
      }
    }
  }
}


const axis = new THREE.Vector3(0, 1, 1)

quaternion.setFromAxisAngle(axis.normalize(), THREE.MathUtils.degToRad(degree));

camera.position.z = 7.5;

function animate() {
  requestAnimationFrame(animate);
  dragObject()
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