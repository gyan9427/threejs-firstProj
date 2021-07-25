import './style.css'
import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.130.1-bsY6rEPcA1ZYyZeKdbHd/mode=imports,min/optimized/three.js';

import threejsOrbitControls from 'https://cdn.skypack.dev/threejs-orbit-controls';

import * as dat from 'dat.gui';

const gui = new dat.GUI()
const world = {
  plane: {
    width:10,
    height:10,
    widthSegments:10,
    heightSegments:10,
  }
}
gui.add(world.plane,'width',1,20).onChange(()=>{
  generatePlane()
})
gui.add(world.plane,'height',1,20).onChange(()=>{
  generatePlane();
})
gui.add(world.plane,'widthSegments',1,20).onChange(()=>{
  generatePlane();
})
gui.add(world.plane,'heightSegments',1,20).onChange(()=>{
  generatePlane();
})
function generatePlane(){
  planeMesh.geometry.dispose()
  planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width,world.plane.height,world.plane.widthSegments,world.plane.heightSegments)
  const {array} = planeMesh.geometry.attributes.position

  for (let i=0;i<array.length;i+=3){
    const x = array[i]
    const y = array[i+1]
    const z = array[i+2]

    array[i +2] = z + Math.random();

  }
}



  const raycaster = new THREE.Raycaster()
  console.log(raycaster)
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75,innerWidth/innerHeight, 0.1,1000);
  const light = new THREE.DirectionalLight(0xffffff,1);
  const backLight = new THREE.DirectionalLight(0xffffff,1);

  const renderer = new THREE.WebGLRenderer()

  renderer.setSize(innerWidth,innerHeight)
  renderer.setPixelRatio(devicePixelRatio)
  document.body.appendChild(renderer.domElement);

  const planeGeometry = new THREE.PlaneGeometry(5,5,10,10)
  const planeMaterial = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    flatShading: THREE.FlatShading,
    vertexColors: true,
  })
  const planeMesh = new THREE.Mesh(planeGeometry,planeMaterial)

  const colors = []
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0,1,1);
  }
  
  planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array([colors]),3)) 

  light.position.set(0,0,1)
  backLight.position.set(0,0,-1)
  scene.add(light)
  scene.add(backLight)
  scene.add(planeMesh)

  new threejsOrbitControls(camera,renderer.domElement)
  camera.position.z = 5
  const mouse = {
    x: undefined,
    y: undefined
  }

  function animate(){
    requestAnimationFrame(animate)
    renderer.render(scene,camera)
    
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObject(planeMesh)
    // console.log(intersects)
    if(intersects.length > 0) {
      console.log('intersecting')
    }
  }

  
  animate()
  
  addEventListener('mousemove', (event)=>{
    mouse.x = (event.clientX/innerWidth)*2 - 1
    mouse.y = ((event.clientY/innerHeight)*2 - 1) * (-1)
  })