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
  side: THREE.DoubleSide,
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
      const edges = new THREE.EdgesGeometry(geometry); 
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 0x000000, linewidth: 10})); 
      const cube = new THREE.Mesh(geometry, material)
      line.material.linewidth = 10
      line.add(cube)
      //line.userData.draggable = true
      cube.userData.draggable = true
      line.userData.name = `Line: ${i}, ${j}, ${k}`
      cube.position.set(i, j, k)

      cube.scale.x = 0.9; // SCALE
      cube.scale.y = 0.9; // SCALE
      cube.scale.z = 0.9;
      cubes.push(cube)
    }
  }
}

for (var cube of cubes)
  scene.add(cube)

// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );

const raycaster = new THREE.Raycaster()

var draggable: THREE.Object3D | null = null
let clicked = false

let oldX = 0
let oldY = 0
let clickedX = 0
let clickedY = 0

window.addEventListener('click', event => {
  clicked = true;

  const mouseVector = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  raycaster.setFromCamera(mouseVector, camera);

  const intersects = raycaster.intersectObjects(scene.children);
  
  if ( intersects.length > 0 ) {            
    for (var sect of intersects) {
      if (sect.object.userData.draggable) {
        draggable = sect.object
        console.log("draggable", draggable.position)
      break
      }
  }
  }

  clickedX = mouseVector.x
  clickedY = mouseVector.y
});

let mouseVector = new THREE.Vector2()
let direction = ""
let horizontal = false

window.addEventListener('mousemove', (event) => {
  mouseVector = new THREE.Vector2(
    event.clientX / window.innerWidth * 2 - 1,
    -event.clientY / window.innerHeight * 2 + 1
  );

  if (clicked) {
  
  if (Math.abs(event.movementX) > Math.abs(event.movementY)) {
    horizontal = true
    if (event.movementX < oldX) direction = "left"
    else if (event.movementX > oldX) direction = "right"
  } else {
    horizontal = false
    if (event.movementY < oldY) direction = "top"
    else if (event.movementY > oldY) direction = "bottom"
  }
  oldX = event.movementX
  oldY = event.movementY
}

  console.log(direction)
  dragObject()
  clicked = false
  draggable = null; 
})


function dragObject() {
  if (draggable != null) {
    
    let plusX = Math.abs(Math.round(clickedX+1) - clickedX)
    let minusX = Math.abs(Math.round(clickedX-1) - clickedX)

    let plusY = Math.abs(clickedY + 1 - Math.round(clickedY));
    let minusY = Math.abs(clickedY - 1 - Math.round(clickedY));

    if (Math.abs(Math.round(clickedX+1) - clickedX) > Math.abs(Math.round(clickedX-1) - clickedX)) console.log(plusX-clickedX, "plusX is bigger than minusX"); else console.log(minusX-clickedX, "minusX is bigger than plusX")

    if (plusY > minusY) console.log(plusY-clickedY, "plusy is bigger than minusy"); else console.log(minusY-clickedY, "minusy is bigger than plusy")

    raycaster.setFromCamera(mouseVector, camera)
    const intersect = raycaster.intersectObjects(scene.children)
      
    if (intersect.length > 0) {
      for (let sect of intersect) {
        if (!sect.object.userData.draggable) {
          continue
        }

        const xAxis = new THREE.Vector3(1, 0, 0)
        const yAxis = new THREE.Vector3(0, 1, 0)
        const zAxis = new THREE.Vector3(0, 0, 1)

        const toRotateX: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.MeshBasicMaterial, THREE.Object3DEventMap>[] = cubes.filter(cube => cube.position.x == draggable!.position.x);
        const toRotateY: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.MeshBasicMaterial, THREE.Object3DEventMap>[] = cubes.filter(cube => cube.position.y == draggable!.position.y);

        const front: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.MeshBasicMaterial, THREE.Object3DEventMap>[] = cubes.filter(cube => cube.position.z == 1)
        const back: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.MeshBasicMaterial, THREE.Object3DEventMap>[] = cubes.filter(cube => cube.position.z == -1)
        const left: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.MeshBasicMaterial, THREE.Object3DEventMap>[] = cubes.filter(cube => cube.position.x == -1)
        const right: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.MeshBasicMaterial, THREE.Object3DEventMap>[] = cubes.filter(cube => cube.position.x == 1)
        // const bottom: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.MeshBasicMaterial, THREE.Object3DEventMap>[] = cubes.filter(cube => cube.position.y == -1)
        // const top: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.MeshBasicMaterial, THREE.Object3DEventMap>[] = cubes.filter(cube => cube.position.z == 1)
        const center_side: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.MeshBasicMaterial, THREE.Object3DEventMap>[] = cubes.filter(cube => cube.position.z == 0)
        const center_face: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.MeshBasicMaterial, THREE.Object3DEventMap>[] = cubes.filter(cube => cube.position.x == 0)
        const toRotateGroup = new THREE.Group()

        let targetRotation = Math.PI / 2;

        if (horizontal) {
            for (var cube of toRotateY) {
              toRotateGroup.add(cube)
              
              if (toRotateY.length == 9)
              if (direction == "right")
              rotateGroup(toRotateGroup, targetRotation, yAxis)
            else if (direction == "left")
             
              rotateGroup(toRotateGroup, targetRotation*-1, yAxis)
            }
        } else if (!horizontal) { 
            if (direction == 'top') {
              // LEFT SIDE HANDLING
              if (draggable.position.x == -1 && draggable.position.z != -1) {
                if (plusX < minusX) {
                  if (draggable.position.z == 1) {
                    for (var cube of front) 
                      toRotateGroup.add(cube)
                  }
                    
                  else if (draggable.position.z == 0) 
                    for (var cube of center_side) 
                      toRotateGroup.add(cube)
                  
                  rotateGroup(toRotateGroup, -targetRotation, zAxis)
                }
                else {
                  if (draggable.position.z == 0) {
                    for (var cube of center_side) 
                      toRotateGroup.add(cube)
                    rotateGroup(toRotateGroup, -targetRotation, zAxis)
                  }
                  else {
                    for (var cube of left) 
                      toRotateGroup.add(cube)
                  rotateGroup(toRotateGroup, -targetRotation, xAxis)
                  }
                }
              } 

              // RIGHT SIDE HANDLING
              else if (draggable.position.x == 1 && draggable.position.z != -1) {
                if (plusX > minusX) {
                  if (draggable.position.z == 1) {
                    for (var cube of front) 
                      toRotateGroup.add(cube)
                  }
                    
                  else if (draggable.position.z == 0) {
                    for (var cube of center_side) 
                      toRotateGroup.add(cube)
                  }
                  
                  rotateGroup(toRotateGroup, targetRotation, zAxis)
                } else {
                    for (var cube of right) 
                      toRotateGroup.add(cube)
                  rotateGroup(toRotateGroup, -targetRotation, xAxis)
                }
              } 

              // BACK SIDE HANDLING
              else if (draggable.position.z == -1) {
                if (draggable.position.x == 0) {
                  for (var cube of center_face)
                    toRotateGroup.add(cube)
                  if (minusY > plusY) rotateGroup(toRotateGroup, targetRotation, xAxis)
                  else rotateGroup(toRotateGroup, -targetRotation, xAxis)
                }
                else if (draggable.position.x == 1) {
                  if (plusX < minusX) {
                    for (var cube of back)
                      toRotateGroup.add(cube)
                    rotateGroup(toRotateGroup, targetRotation, zAxis)
                  } else {
                    for (var cube of right)
                      toRotateGroup.add(cube)
                    rotateGroup(toRotateGroup, targetRotation, xAxis)
                  }
                } else if (draggable.position.x == -1) {
                  if (plusX > minusX) {
                    for (var cube of back)
                      toRotateGroup.add(cube)
                    rotateGroup(toRotateGroup, -targetRotation, zAxis)
                  } else {
                    for (var cube of left)
                      toRotateGroup.add(cube)
                    rotateGroup(toRotateGroup, targetRotation, xAxis)
                  }
                }
              }
                else {
                  for (var cube of toRotateX)
                    toRotateGroup.add(cube)
                  rotateGroup(toRotateGroup, -targetRotation*draggable.position.z, xAxis)
                }
              }
            
            else if (direction == "bottom") 
              // LEFT SIDE
              if (draggable.position.x == 0 && draggable.position.z == 1) {
                for (var cube of center_face)
                  toRotateGroup.add(cube)
                rotateGroup(toRotateGroup, targetRotation, xAxis)
              }
              else if (draggable.position.x == -1 && draggable.position.z != -1) {
                if (plusX < minusX) {
                  if (draggable.position.z == 1) 
                    for (var cube of front) 
                      toRotateGroup.add(cube)

                  if (draggable.position.z == 0)
                    for (var cube of center_side) 
                      toRotateGroup.add(cube)
                    
                  rotateGroup(toRotateGroup, targetRotation, zAxis)
                } 
                else {
                    for (var cube of left) 
                      toRotateGroup.add(cube)
                    rotateGroup(toRotateGroup, targetRotation, xAxis)
                  
                }
                
              }

            // RIGHT SIDE HANDLING
            else if (draggable.position.x == 1 && draggable.position.z != -1)
              if (plusX > minusX) {
                if (draggable.position.z == 1) {
                  for (var cube of front) 
                    toRotateGroup.add(cube)
                }

                if (draggable.position.z == 0) {
                  for (var cube of center_side) 
                    toRotateGroup.add(cube)
                }

                rotateGroup(toRotateGroup, -targetRotation, zAxis)
            } else {
              for (var cube of right) 
                toRotateGroup.add(cube)
              rotateGroup(toRotateGroup, targetRotation, xAxis)
            }

            // BACK SIDE HANDLING
            else if (draggable.position.z == -1 && draggable.position.x != -1) {
              if (draggable.position.x == 0) {
                for (var cube of center_face)
                  toRotateGroup.add(cube)
                if (minusY > plusY) rotateGroup(toRotateGroup, -targetRotation, xAxis)
                else if (plusY > minusY) rotateGroup(toRotateGroup, targetRotation, xAxis)
              }
              else if (plusX < minusX) {
              
                for (var cube of back)
                  toRotateGroup.add(cube)

                rotateGroup(toRotateGroup, -targetRotation, zAxis)
              } else {
                if (draggable.position.x == 1)
                  for (var cube of right)
                    toRotateGroup.add(cube)

                rotateGroup(toRotateGroup, -targetRotation, xAxis)
              }
            } else if (draggable.position.x == -1) {
              if (plusX > minusX) {
                for (var cube of back)
                  toRotateGroup.add(cube)
                rotateGroup(toRotateGroup, targetRotation, zAxis)
              } else {
                for (var cube of left)
                  toRotateGroup.add(cube)
                rotateGroup(toRotateGroup, -targetRotation, xAxis)
              }
            }
            else {
              for (var cube of toRotateX)
                toRotateGroup.add(cube)
              rotateGroup(toRotateGroup, targetRotation*draggable.position.z, xAxis)
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
  clicked = false
  const quaternion = new THREE.Quaternion().setFromAxisAngle(axis.normalize(), targetRotation);
  
  new TWEEN.Tween(group.quaternion)
    .to(quaternion, 400)
    .onComplete(() => {
      clearGroup(new THREE.Vector3(1, 0, 0) ? 'x' : 'y', group)
      clicked = true
    })
    .start();
}

camera.position.z = 7.5;

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update()
	renderer.render(scene, camera);
}
animate();

/*

x = -1 => LEFT 
z = 1 => FRONT
x = 1 => RIGHT
z = -1 => BACK
y = 1 => TOP
y = -1 => BOTTOM
x = 0 => center_side FACE
z = 0 => center_side SIDE

Object { x: -1, y: -1, z: -1 } LEFT BACK
Object { x: -1, y: -1, z: 0 } LEFT
Object { x: -1, y: -1, z: 1 } FRONT LEFT
Object { x: -1, y: 0, z: -1 } LEFT BACK
Object { x: -1, y: 0, z: 0 } LEFT
Object { x: -1, y: 0, z: 1 } FRONT LEFT
Object { x: -1, y: 1, z: -1 } LEFT BACK
Object { x: -1, y: 1, z: 0 } LEFT
Object { x: -1, y: 1, z: 1 } FRONT LEFT

Object { x: 0, y: -1, z: -1 } BACK
Object { x: 0, y: -1, z: 0 }
Object { x: 0, y: -1, z: 1 } FRONT
Object { x: 0, y: 0, z: -1 } BACK
Object { x: 0, y: 0, z: 0 }
Object { x: 0, y: 0, z: 1 } FRONT
Object { x: 0, y: 1, z: -1 } BACK
Object { x: 0, y: 1, z: 0 }
Object { x: 0, y: 1, z: 1 } FRONT

Object { x: 1, y: -1, z: -1 } RIGHT BACK
Object { x: 1, y: -1, z: 0 } RIGHT
Object { x: 1, y: -1, z: 1 } FRONT RIGHT
Object { x: 1, y: 0, z: -1 } RIGHT BACK
Object { x: 1, y: 0, z: 0 } RIGHT
Object { x: 1, y: 0, z: 1 } FRONT
Object { x: 1, y: 1, z: -1 } RIGHT BACK
Object { x: 1, y: 1, z: 0 } RIGHT
Object { x: 1, y: 1, z: 1 } FRONT RIGHT

*/