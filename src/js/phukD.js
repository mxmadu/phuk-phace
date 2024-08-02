import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.167.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/loaders/DRACOLoader.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 0.35;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();


const loadingManager = new THREE.LoadingManager();
// loadingManager.onStart = function(url, item, total){
// 	console.log(`Started loading: ${url}`);
	
  const progressBar = document.getElementById('progress-bar');
	loadingManager.onProgress = function(url, loaded, total){
    progressBar.value = (loaded / total) * 100;
    
	console.log(`Started loading: ${url}`);
  }

  const progressBarContainer = document.querySelector('.progress-bar-container');
  loadingManager.onLoad = function(){
  progressBarContainer.style.display = 'none';
  }

  loadingManager.onError = function(url){
    console.error(`Got a problem loading: ${url}`);
    }
	


const hdrLoader = new RGBELoader(loadingManager);
hdrLoader.load('https://mxmadu.github.io/phuk/img/studio.hdr', function(texture) {
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    scene.background = envMap;
    scene.environment = envMap;
    texture.dispose();
    pmremGenerator.dispose();
});

const ambient = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambient);

const dLight = new THREE.DirectionalLight(0xffffff, 0.5);
dLight.position.set(0, 0, 6);
scene.add(dLight);

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');

const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.setDRACOLoader(dracoLoader);

let model;
gltfLoader.load('https://mxmadu.github.io/phuk/models/compressed_D.glb', function(gltf) {
  model = gltf.scene;
  model.rotation.set(0, Math.PI, 0);
  model.receiveShadow = true;
  scene.add(model);

    // Touchpoints array
    window.touchpoints = [
      {
        position: new THREE.Vector3(0.06, -0.03, -2.03), 
        header: '&lt;LARGE_NOSE&gt;',
        text: 'Large noses find themselves on villainous faces more often than the heroic ones. When they are given a hooked shape, it is often meant to denote that a character is Jewish or Arab, an anti-semitic stereotype implying shifty behavior, greed or malicious intent as inherent to one\’s nature.',
        images: [
            { src: 'https://mxmadu.github.io/phuk/img/blackbeard.jpeg', alt: 'Blackbeard from One Piece grinning nefariously, tan skin, large nose, missing upper and lower teeth', caption: '&lt;Blackbeard_in_one_piece&gt;' },
            { src: 'https://mxmadu.github.io/phuk/img/captain_hook.jpeg', alt: 'Captain Hook in Peter Pan with a red coat and massive, deep purple hat. He left hand is a golden hook and he has a large nose and pointy mustache, he is grinning mischeviously', caption: '&lt;Captain_hook_in_peter_pan&gt;' }
        ],
        footer: '',
    },
    {
        position: new THREE.Vector3(0.9, 0.3, -1.4), 
        header: '&lt;SCAR&gt;',
        text: 'Scars are used as early signs to let viewers know who the \‘bad\’ guy is. While this visual signifies the rugged or tough nature of a character, in many narratives it is usually the cause of or the marker of the moment that begins the character\’s descent into evil.',
        images: [
            { src: 'https://mxmadu.github.io/phuk/img/woodes.jpg', alt: 'Woodes woodes from Assassin\'s Creed, short brown hair a huge scar all over his left cheek,', caption: '&lt;Woodes_woodes_in_assassin\'s_creed&gt;' },
            { src: 'https://mxmadu.github.io/phuk/img/silco.jpeg', alt: 'Silco in Arcane, short black hair, a long narrow face and nose, one green eye and one prosthetic eye as well as 3 long scars going from his left temple to his upper lip', caption: '&lt;Silco_in_arcane_&gt;' }
        ],
        footer: '',
    },
    {
      position: new THREE.Vector3(-0.7, -0.03, -1.5), 
      header: '&lt;DARK_SKIN_TONE&gt;',
      text: 'Dark(er) skin tones have been used to ascribe \‘evil\’ or otherwise \’unsavory\’ characteristics to villains, to emphasize contrast with the hero who is depicted as much fairer. Other depictions in media associate darker skin with lower intelligence, penchant for violence or seedy behavior.',
      images: [
          { src: 'https://mxmadu.github.io/phuk/img/drow.jpeg', alt: 'Drow from Dungeons and Dragons. They have charcoal-black skin and white hair, pointy ears, long faces and noses. This one is pictured in a long, geometrically-shaped dress and holding a whip of snakes in its left hand', caption: '&lt;Drow*_in_dungeons_and_dragons&gt;' },
          { src: 'https://mxmadu.github.io/phuk/img/scar.jpg', alt: 'Scar from the Lion King, he has a long angular face, green eyes, a purple scar down his left eye and a wicked grin', caption: '&lt;Scar_in_the_lion_king&gt;' }
      ],
      footer: '*In 2020, Wizards of the Coast altered the dark elves to make them not inherently evil, giving players the choice to play them as either good or bad.',
  },
      {
        position: new THREE.Vector3(0.02, 1.1, -1.4), 
        header: '&lt;HAIR_LOSS&gt;',
        text: 'Bald hair or conditions resulting in hair loss like alopecia are often ascribed to villains across media. They are often portrayed as antisocial and apathetic evil geniuses, with the worsening of their conditioning often coinciding with their downward spiral.',
        images: [
            { src: 'https://mxmadu.github.io/phuk/img/eggman.jpeg', alt: 'Dr. Eggman, bald and round, wears a red coat and black pants that blend into boots', caption: '&lt;Dr._Eggman_in_sonic_the_hedgehog&gt;' },
            { src: 'https://mxmadu.github.io/phuk/img/scott_evil.jpeg', alt: 'Scott Evil in Austin Powers, balding in the front but with spiky hair all over', caption: '&lt;Scott_Evil_in_Austin_Powers&gt;*' }
        ],
        footer: '*Scott starts out with a head full of hair but by Goldmember (2001) becomes fully evil and therefore fully bald.',
    },
    {
      position: new THREE.Vector3(0.6, -0.5, -1.3), 
      header: '&lt;NARROW_FACE&gt;',
      text: 'Narrow\/angular faces are presented in stark contrast to protagonists who are usually depicted with rounder features. This includes sharper cheekbones, pointy chins, almond-shaped eyes (leftover from anti-Asian propaganda in Western media) all to create the impression that the character is untrustworthy and conniving.',
      images: [
          { src: 'https://mxmadu.github.io/phuk/img/moira.jpeg', alt: 'Moira from Overwatch, a red-head with a long, angular face', caption: '&lt;Moira_in_overwatch&gt;' },
          { src: 'https://mxmadu.github.io/phuk/img/rasputin.jpg', alt: 'Rasputin in Anastasia, long narrow face, dark hair and is depicted with some green smoke/light swirling around his head', caption: '&lt;rasputin_in_anastasia&gt;' }
      ],
      footer:'',
    },
    {
    position: new THREE.Vector3(0.3, 0.3, -1.4), 
    header: '&lt;DISABILITY&gt;',
    text: 'Antagonists are too often given one or more disabilities (blindness, prosthetic limbs, genetic conditions, etc.) which are meant to represent personality flaws and give the impression that the character is vengeful and malignant, either by nature or due to some supernatural (or historical) event.',
    images: [
        { src: 'https://mxmadu.github.io/phuk/img/kriplespac.jpeg', alt: 'Professor Von Kriplespac, from Conker\'s Bad Fur Day, a rodent-like creature with a robotic arm and mechanical eye sitting in a jet-powered, joy-stick-controlled chair', caption: '&lt;Professor_von_kriplespac_in_conker\'s_bad_fur_day&gt;'},
        { src: 'https://mxmadu.github.io/phuk/img/aemond.jpg', alt: 'Aemond Targaryen from House of The Dragon, long blonde hair, long face and a scar down his left eye covered by an eye patch', caption: '&lt;Aemond_Targaryen_in_house_of_the_Dragon&gt;' }
    ],
    footer: '',

    },
  ];
  

    window.touchpoints.forEach(point => {
        const div = document.createElement('div');
        div.className = 'touchpoint';
        div.style.position = 'absolute';
        div.style.width = '20px';
        div.style.height = '20px';
        div.style.backgroundImage = 'url("https://mxmadu.github.io/phuk/img/touchpoint.png")';
        div.style.backgroundSize = 'cover';
        div.style.backgroundColor = 'transparent';
        div.style.cursor = 'pointer';
        div.title = point.info;
        div.addEventListener('click', (event) => {
            showInfoBox(event, point);
        });
        document.body.appendChild(div);
        point.element = div;
    });

    console.log('Touchpoints added:', window.touchpoints);

}, undefined, function(error) {
    console.error(error);
});

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0, -6);
camera.lookAt(scene.position);

function handleKeydown(event) {
  if (!model) return; 

  switch (event.key) {
    case 'ArrowUp':
      model.rotation.x -= 0.05;
      break;
    case 'ArrowDown':
      model.rotation.x += 0.05;
      break;
    case 'ArrowLeft':
      model.rotation.y -= 0.05;
      break;
    case 'ArrowRight':
      model.rotation.y += 0.05;
      break;
  }
}

window.addEventListener('keydown', handleKeydown);


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const infoBox = document.createElement('div');

infoBox.id = 'infoBox';
infoBox.style.backgroundColor = 'black';
infoBox.style.padding = '10px';
infoBox.style.border = '1px solid #5EFF12';
infoBox.style.display = 'none';
infoBox.style.zIndex = '1001';
infoBox.style.overflowY = 'auto'; 

document.body.appendChild(infoBox);


const line = document.createElement('div');
line.id = 'line';
line.style.position = 'absolute';
line.style.width = '1px';
line.style.backgroundColor = ' #5EFF12';
line.style.display = 'none';
document.body.appendChild(line);

const closeImage = new Image();
closeImage.src = 'https://mxmadu.github.io/phuk/img/close.png';
closeImage.style.position = 'absolute';
closeImage.style.width = '25px';
closeImage.style.height = '25px';
closeImage.style.cursor = 'pointer';
closeImage.style.display = 'none';
document.body.appendChild(closeImage);

const clickToleranceRadius = 20; 
function showInfoBox(event, point) {
  const headerText = point.header;
  const contentText = point.text;
  const images = point.images;
  const footerText = point.footer;

  infoBox.innerHTML = `
      <div style="float: right; display: flex; align-items: center;">
          <span style="margin-right: 10px; color: #5EFF12; font-family: 'Space Mono', monospace; font-size: 16px; cursor: pointer;" class="close-button">&lt;CLOSE&gt;</span>
          <img src="https://mxmadu.github.io/phuk/img/close.png" style="width: 20px; height: 20px; cursor: pointer;" class="close-button" />
      </div>
      <br>
      <br>
      <div class="modal-header">
          ${headerText}
      </div>
      <div class="modal-content">
          <p>${contentText}</p>
          <br>
          <br>
          <div class="images" style="display: flex; flex-wrap: wrap;">
              ${images.map(image => `
                  <div class="image" style="margin-right: 10px; margin-bottom: 10px;">
                      <img src="${image.src}" alt="${image.alt}" style="max-width: 100%; height: auto;" />
                      <p class="caption" style="margin-top: 5px; margin-bottom: 5px;">${image.caption}</p>
                  </div>
              `).join('')}
          </div>
          <div class="modal-footer">
                <p>${footerText}<p>
          </div>
      </div>
  `;

  infoBox.style.display = 'block';

  document.querySelectorAll('.close-button').forEach(btn => {
      btn.addEventListener('click', () => {
          infoBox.style.display = 'none';
          line.style.display = 'none';
      });
  });

  const rect = event.target.getBoundingClientRect();
  const touchpointX = rect.left + rect.width / 2;
  const touchpointY = rect.top + rect.height / 2;

  if (window.innerWidth > 768) {
    const infoBoxWidth = infoBox.offsetWidth;
    const infoBoxHeight = infoBox.offsetHeight;

    let left = touchpointX - infoBoxWidth / 2;
    let top = touchpointY;

    const padding = 20;

    if (left < padding) {
        left = padding;
    } else if (left + infoBoxWidth + padding > window.innerWidth) {
        left = window.innerWidth - infoBoxWidth - padding;
    }

    if (top + infoBoxHeight > window.innerHeight) {
        top = window.innerHeight - infoBoxHeight - padding;
    }

    infoBox.style.left = `${left}px`;
    infoBox.style.top = `${top}px`;
  }

}



function handleClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    mouse.set(mouseX, mouseY);
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const intersect = intersects[0];
        const point = intersect.point;
        console.log(`3D coordinates: (${point.x}, ${point.y}, ${point.z})`);

        window.touchpoints.forEach(touchpoint => {
            const elementRect = touchpoint.element.getBoundingClientRect();
            const elementX = elementRect.left + elementRect.width / 2;
            const elementY = elementRect.top + elementRect.height / 2;

            const dx = event.clientX - elementX;
            const dy = event.clientY - elementY;

            if (Math.sqrt(dx * dx + dy * dy) <= clickToleranceRadius) {
                showInfoBox(event, touchpoint);
            }
        });
    }
}

window.addEventListener('click', handleClick, false);

function updateTouchpoints() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (window.touchpoints) {
        window.touchpoints.forEach(point => {
            const vector = point.position.clone();
            vector.project(camera);
            const x = (vector.x * 0.5 + 0.5) * width;
            const y = (vector.y * -0.5 + 0.5) * height;
            point.element.style.left = `${x}px`;
            point.element.style.top = `${y}px`;
        });
    }
}


window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

window.addEventListener('dblclick', () => {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

  if (!fullscreenElement) {
      if (canvas.requestFullscreen) {
          canvas.requestFullscreen()
      }
      else if (canvas.webkitRequestFullscreen) {
          canvas.webkitRequestFullscreen()
      }
  }
  else {
      if (document.exitFullscreen) {
          document.exitFullscreen()
      }
      else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen()
      }
  }
})

function animate() {
    controls.update();
    updateTouchpoints();
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
