import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.167.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/loaders/DRACOLoader.js';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 600, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, 600);
renderer.toneMapping = THREE.NeutralToneMapping;
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

// Set up the Loading Manager
const loadingManager = new THREE.LoadingManager();

const progressBar = document.getElementById('progress-bar');
const progressBarContainer = document.querySelector('.progress-bar-container');

loadingManager.onStart = function (url, item, total) {
  console.log(`Started loading: ${url}`);
};

loadingManager.onProgress = function (url, loaded, total) {
  progressBar.value = (loaded / total) * 100;
  console.log(`Loading progress: ${Math.round(progressBar.value)}%`);
};

loadingManager.onLoad = function () {
  progressBarContainer.style.display = 'none';
};

loadingManager.onError = function (url) {
  console.error(`Got a problem loading: ${url}`);
};

// Load HDR environment map
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

const loadHDR = () => {
  return new Promise((resolve, reject) => {
    const hdrLoader = new RGBELoader(loadingManager);
    hdrLoader.load('../img/studio.hdr', function (texture) {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
      scene.background = envMap;
      scene.environment = envMap;
      texture.dispose();
      pmremGenerator.dispose();
      resolve();
    }, undefined, reject);
  });
};

// Lighting
const ambient = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambient);

const dLight = new THREE.DirectionalLight(0xffffff, 0.5);
dLight.position.set(0, 0, 6);
scene.add(dLight);

const hLight = new THREE.PointLight(0XFFFFFF, 1);
hLight.position.set(0, 3, 0);
scene.add(hLight);

// Load Models
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');

const loadModel = (path, position) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader(loadingManager);
    loader.setDRACOLoader(dracoLoader);
    loader.load(path, function (gltf) {
      gltf.scene.rotation.set(0, Math.PI, 0);
      gltf.scene.position.set(position.x, position.y, position.z);
      gltf.scene.receiveShadow = true;
      scene.add(gltf.scene);
      resolve();
    }, undefined, reject);
  });
};

const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.enabled = false;

camera.position.set(-7, 2, -8);
camera.lookAt(scene.position);

function animate() {
  controls.update(); 
  renderer.render(scene, camera);
}

// Load all resources and start rendering
Promise.all([
  loadHDR(),
  loadModel('../models/compressed.glb', { x: 2, y: 3, z: 0 }),
  loadModel('../models/compressed_D.glb', { x: 0, y: 0, z: 0 }),
  loadModel('../models/compressed_S.glb', { x: -2, y: 3, z: 0 })
]).then(() => {
  renderer.setAnimationLoop(animate);
}).catch(error => {
  console.error('An error occurred while loading resources:', error);
});
