'use strict'
import bodymovin from 'lottie-web';
const normalizeWheel = require('./facebook-normalize-wheel');
module.exports = function () {
  const object = document.querySelector('#lottie');
  const path ='../img/CubeTest_WithBodymovinPlug.json';
  class lottiSetup {
    constructor(object, path) {
      this.flag = false;
      this.anim = bodymovin.loadAnimation({
        container: object,
        path: path,
        renderer: 'svg',
        loop: false,
        autoplay: false
      })
      this.currentFrame = 0;
      this.update = () => {
        if(!this.flag) return;
        requestAnimationFrame(this.update);
        console.log(this.clip((this.currentFrame), 0, this.anim.totalFrames))
        this.anim.goToAndStop(this.clip((this.currentFrame), 0, this.anim.totalFrames), true)
      };
    }
    clip(number, min, max) {
      return Math.max(min, Math.min(number, max));
    };
    scroll(e) {
      this.flag = true;
      setTimeout(() => this.flag = false, 300);
      const wheelData = normalizeWheel(e);
      this.currentFrame += (wheelData.pixelY) ? wheelData.pixelY * 0.2 : 4;
      this.currentFrame = (this.currentFrame >= this.anim.totalFrames) ? this.anim.totalFrames : this.currentFrame;
      this.update();

      if (this.currentFrame === this.anim.totalFrames) {
        console.log('finished')
      }
    }
    init() {
      console.log('init')
      window.addEventListener(normalizeWheel.getEventType(), (e) => this.scroll(e));
      window.addEventListener('touchmove', (e) => this.scroll(e));

    }
  }
  const l = new lottiSetup(object, path).init();
};
