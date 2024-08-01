import * as THREE from 'three';
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from '/node_modules/three/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 600, 0.1, 1000);


// let modelPaths = ['../models/PHUK_PHACE_A.glb','../models/PHUK_PHACE_D.glb','../models/PHUK_PHACE_S.glb']
let currentPathIndex = 0;
let currentModel;
// loadModel(currentPathIndex);



const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, 600);
console.log('Window Inner Width: ', window.innerWidth + 'Window Inner Height:' + window.innerHeight);
renderer.toneMapping = THREE.NeutralToneMapping
renderer.toneMappingExposure = 0.25;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.domElement.style.zIndex = '-10'; 
document.body.appendChild(renderer.domElement);

const div = document.getElementById('slay-queens');
div.appendChild(renderer.domElement);


document.addEventListener("DOMContentLoaded", () => {
  console.log("Hello World!");
});
// window.addEventListener('resize', () => {
//   const width = window.innerWidth;
//   const height = window.innerHeight;
//   renderer.setSize(width, height);
//   camera.aspect = width / height;
//   camera.updateProjectionMatrix();
// });

// Load HDR environment map
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

const hdrLoader = new RGBELoader();
hdrLoader.load('../img/studio.hdr', function (texture) {
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    scene.background = envMap;
    scene.environment = envMap;
    texture.dispose();
    pmremGenerator.dispose();
});

//lighting

const ambient = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambient);

const dLight = new THREE.DirectionalLight(0xffffff, 0.5);
dLight.position.set(0, 0, 6);
// dLight.castShadow = true;
scene.add(dLight);

const hLight = new THREE.PointLight(0XFFFFFF, 1);
hLight.position.set(0, 3, 0);
scene.add(hLight);



// Add a cube to the scene
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

const loaderA = new GLTFLoader();

loaderA.load( '../models/PHUK_PHACE_A.glb', function ( gltf ) {
  gltf.scene.rotation.set(0, Math.PI, 0); // Rotate the model to show the front face
  gltf.scene.position.set(2, 3, 0); // Move the model down along the Y axis
  loaderA.receiveShadow = true;

	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );

const loaderD = new GLTFLoader();

loaderD.load( '../models/PHUK_PHACE_D.glb', function ( gltf ) {
  gltf.scene.rotation.set(0, Math.PI, 0);
  gltf.scene.position.set(0, 0, 0); // Move the model down along the Y axis
 
  loaderD.receiveShadow = true;


	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );

const loaderS = new GLTFLoader();


loaderS.load( '../models/PHUK_PHACE_S.glb', function ( gltf ) {
    gltf.scene.rotation.set(0, Math.PI, 0); // Rotate the model to show the front face
    gltf.scene.position.set(-2, 3, 0); // Move the model down along the Y axis
    loaderS.receiveShadow = true;
  
      scene.add( gltf.scene );
  
  }, undefined, function ( error ) {
  
      console.error( error );
  
  } );

const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.enabled = false;


camera.position.set(-7, 2, -8);
camera.lookAt(scene.position);





function animate() {
    // loaderS.rotation.x += 0.01;
    // loaderS.rotation.y += 0.01;
    controls.update(); 
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
