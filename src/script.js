
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

smoothScroll();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("webgl"),
  alpha: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


const ambientLight = new THREE.AmbientLight(0xffffff, 5);
scene.add(ambientLight);



const loaderWidth = document.getElementById("loader");
const percentage = document.getElementById("percentage-loader");
const gltfLoader = new GLTFLoader();
let beeModel, mixer;
gltfLoader.load("model/bee.glb", (gltf) => {
  beeModel = gltf.scene;
  beeModel.position.set(0, -1.5, 0);
  beeModel.rotation.y = Math.PI / 2;
  beeModel.scale.set(1.5, 1.5, 1.5);

  if (window.innerWidth <= 390) {
    beeModel.scale.set(1, 1, 1);
  }

  mixer = new THREE.AnimationMixer(beeModel);
  mixer.clipAction(gltf.animations[0]).play();

  scene.add(beeModel);
  animate();
  startAnimation();
}, (xhr) => {
  const progress = (xhr.loaded / xhr.total) * 100;
  loaderWidth.style.width = progress + "%";
  percentage.innerText = `Loading...  ${progress.toFixed(0)}%`
  console.log(`Model loading: ${progress.toFixed(0)}%`);
  if(progress > 99){
    gsap.to("#loader-section",{
      left:"100%",
      duration:2,
    });
  }
},
  (err) => {
    console.log("Something went wrong : "+err);
  });


window.addEventListener("resize", (e) => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});


function startAnimation() {

  if (window.innerWidth <= 390) {
    const tl1 = gsap.timeline({
      scrollTrigger: {
        start: "25% 100%",
        end: "25% 0%",
        scrub: true,
      },
    });
    tl1.to(beeModel.position, {
      x: 0.8,
    }, 0);
    tl1.to(beeModel.rotation, {
      y: Math.PI + Math.PI / 2
    }, 0);
    tl1.to(beeModel.scale, {
      x: 0.5, y: 0.5, z: 0.5
    }, 0);

    const tl2 = gsap.timeline({
      scrollTrigger: {
        start: "55% 100%",
        end: "55% 0%",
        scrub: true,
      },
    });

    tl2.to(beeModel.position, {
      x: -0.8
    }, 0);
    tl2.to(beeModel.rotation, {
      y: Math.PI / 2
    }, 0);
  }
  else {
    const tl1 = gsap.timeline({
      scrollTrigger: {
        start: "25% 100%",
        end: "25% 0%",
        scrub: true,
      },
    });
    tl1.to(beeModel.position, {
      x: 2,
    }, 0);
    tl1.to(beeModel.rotation, {
      y: Math.PI + Math.PI / 2
    }, 0);
    tl1.to(beeModel.scale, {
      x: 1, y: 1, z: 1
    }, 0);

    const tl2 = gsap.timeline({
      scrollTrigger: {
        start: "55% 100%",
        end: "55% 0%",
        scrub: true,
      },
    });

    tl2.to(beeModel.position, {
      x: -2
    }, 0);
    tl2.to(beeModel.rotation, {
      y: Math.PI / 2
    }, 0);
  }
}


function animate() {
  if (mixer) mixer.update(0.02);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}


function smoothScroll() {
  const lenis = new Lenis();

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}
