import gsap from "gsap";
const normalizeWheel = require('./facebook-normalize-wheel');
const dat = require('dat.gui');
import * as THREE from 'three';
import TextSprite from 'three.textsprite';
import TextTexture from '@seregpie/three.text-texture';
const OrbitControls = require('three-orbit-controls')(THREE)
const Stats = require('stats-js');

module.exports = function () {
  let clip = function(number, min, max) {
      return Math.max(min, Math.min(number, max));
    }
    const zoom = document.querySelector('#zoom-in');
    const page = document.querySelector('#page');
    let scale = 1;
    let limit = 3220;
    window.addEventListener(normalizeWheel.getEventType(), (e) => {
      const wheelData = normalizeWheel(e);
      scale += wheelData.pixelY;
      scale = (scale <= 1) ? 1 : clip(scale, 1, limit);
      zoom.style.transform = `scale(${scale * 0.1})`
      console.log(scale >= 22, scale, 22)

      if (scale >= 2300) {
        page.classList.add('show');
        zoom.classList.add('hide');

      } else {
        page.classList.remove('show');
        zoom.classList.remove('hide');
      }
    });

//   const renderer = new THREE.WebGLRenderer({antialias: true});
//   renderer.setSize( window.innerWidth, window.innerHeight );
//   document.body.appendChild( renderer.domElement );
//
//   const scene = new THREE.Scene();
//   const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
//   camera.position.z = 75;
//   let texture = new TextTexture({
//     fillStyle: '#FFF',
//     fontFamily: '"Helvetica", Times, serif',
//     fontSize: 16,
//     fontStyle: 'normal',
//     text: [
//       'Twinkle, twinkle, little star,',
//     ].join('\n'),
//   });
//   let material = new THREE.SpriteMaterial({map: texture});
//   let sprite = new THREE.Sprite(material);
//   let spriteScale = 10;
//   texture.redraw();
//   sprite.scale
//     .set(texture.image.width / texture.image.height, 1, 1)
//     .multiplyScalar(spriteScale);
//   scene.add(sprite);
//
// var animate = function () {
//     requestAnimationFrame( animate );
//     // sprite.position.z += 1;
//     // if (counts <= 25) {
//       // camera.position.z = cameraZ -= controls.speed;
//     // } else {
//       // camera.position.z += controls.speed;
//     // }
//     camera.updateProjectionMatrix();
//     renderer.render( scene, camera );
//   };
//
//   animate();

};


// module.exports = function () {
//   const zoom = document.querySelector('.zoom-in');
//   const page = document.querySelector('#zoom-module #page');
//   const wrap = document.querySelector('#transform-wrap');
//   let direction = 1;
//   let track = 0;
//   let clip = function(number, min, max) {
//     return Math.max(min, Math.min(number, max));
//   }
//   let ipadTrack = 0;
//
//   // window.addEventListener("touchstart", startTouch, false);
//   // window.addEventListener("touchmove", moveTouch, false);
//
//   // Swipe Up / Down / Left / Right
//   var initialX = null;
//   var initialY = null;
//
//   // function startTouch(e) {
//   //   initialX = e.touches[0].clientX;
//   //   initialY = e.touches[0].clientY;
//   // };
//   //
//   // function moveTouch(e) {
//   //   if (initialX === null) {
//   //     return;
//   //   }
//   //   if (initialY === null) {
//   //     return;
//   //   }
//   //
//   //   var currentX = e.touches[0].clientX;
//   //   var currentY = e.touches[0].clientY;
//   //
//   //   var diffX = initialX - currentX;
//   //   var diffY = initialY - currentY;
//   //
//   //   if (Math.abs(diffX) > Math.abs(diffY)) {
//   //     if (diffX > 0) {
//   //       // swiped left
//   //       console.log("swiped left");
//   //     } else {
//   //     } 
//   //   } else {
//   //     if (diffY > 0) {
//   //       direction = 'up';
//   //     } else {
//   //       direction = 'down';
//   //     } 
//   //   }
//   //
//   //   initialX = null;
//   //   initialY = null;
//   //
//   //   e.preventDefault();
//   // };
//   //
//
//   class MinMaxGUIHelper {
//   constructor(obj, minProp, maxProp, minDif) {
//     this.obj = obj;
//     this.minProp = minProp;
//     this.maxProp = maxProp;
//     this.minDif = minDif;
//   }
//   get min() {
//     return this.obj[this.minProp];
//   }
//   set min(v) {
//     this.obj[this.minProp] = v;
//     this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
//   }
//   get max() {
//     return this.obj[this.maxProp];
//   }
//   set max(v) {
//     this.obj[this.maxProp] = v;
//     this.min = this.min;  // this will call the min setter
//   }
// }
//
//   const gui = new dat.GUI();
//   // let controlss = new function() {
//   //   this.speed = 1;
//   //   this.distance = 1;
//   // }
//   // gui.add(controls, 'speed', 0, 100);
//   // gui.add(controls, 'distance', 0, 100);
//
//
//   let counts = 1;
//   let cameraZ = 40;
//   const fov = 45;
//   const aspect = 2;  // the canvas default
//   const near = 0.1;
//   const far = 100;
//
//
//
//
//
//   var renderer = new THREE.WebGLRenderer();
//   renderer.setSize( window.innerWidth, window.innerHeight );
//   document.body.appendChild( renderer.domElement );
//
//   var scene = new THREE.Scene();
//   const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
//   camera.position.set(0, 1, 20);
//
//
//   var helper = new THREE.CameraHelper( camera );
//   scene.add( helper );
//   const controls = new OrbitControls(camera, renderer.domElement);
//   controls.target.set(0, 5, 0);
//   controls.update();
//
//   window.addEventListener('resize', () => {
//     renderer.setSize( window.innerWidth, window.innerHeight );
//   });
//   gui.add(camera, 'fov', 1, 180).onChange(updateCamera);
//   const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
//   gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
//   gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera);
//
//   function updateCamera() {
//     camera.updateProjectionMatrix();
//   }
//   scene.add( camera );
//   // camera.position.z = 400;
//
//   let sprite = new TextSprite({
//     material: {
//       color: 0xffbbff,
//     },
//     redrawInterval: 1,
//     textSize: 12,
//     texture: {
//       fontFamily: 'Arial, Helvetica, sans-serif',
//       text: 'ZOOM',
//     },
//   });
//
//   console.log(sprite)
//   scene.add(sprite);
//
//   // let controls = new OrbitControls(camera)
//
//
//   var animate = function () {
//     requestAnimationFrame( animate );
//     // sprite.position.z += 1;
//     // if (counts <= 25) {
//       // camera.position.z = cameraZ -= controls.speed;
//     // } else {
//       // camera.position.z += controls.speed;
//     // }
//     camera.updateProjectionMatrix();
//     renderer.render( scene, camera );
//   };
//
//   animate();
//
//
//
//
//   // window.addEventListener('touchmove', (e) => {
//   //   if(direction === 'down') counts -= 25;
//   //   if(direction === 'up') counts += 25
//   //   counts = (counts <= -1001) ? -1001 : clip(counts, -1001, 11400);
//   // });
//
//   let limit = 14000;
//   window.addEventListener(normalizeWheel.getEventType(), (e) => {
//     const wheelData = normalizeWheel(e);
//     counts += wheelData.pixelY;
//     counts = (counts <= -1001) ? -1001 : clip(counts, -1001, 11400);
//     console.log(counts)
//
//     // if (counts >= limit) {
//     //   page.classList.add('show');
//     //   setTimeout(() => wrap.classList.add('show'), 200);
//     // }
//   });
//
// };
