// import gsap from "gsap";
const normalizeWheel = require('./facebook-normalize-wheel');
// const dat = require('dat.gui');
// const gui = new dat.GUI();
module.exports = function () {
  const zoom = document.querySelector('#zoom-in');
  const page = document.querySelector('#page');
  const rows = document.querySelectorAll('.row');

  class zoomSetup {
    constructor(zoom, page, rows) {
      this.intro = 1;
      this.page = 0.2;
      this.pageScaleSpeed = 0.001;
      this.limit = 200;
      this.limitpage = 600;
      this.flag = false;
      this.pageAcitve = false;
      this.track = 0;
      this.options = {
        speed: 1,
        fraction: 0.2
      };
      this.last = 0;
      this.clip = (number, min, max) => {
        return Math.max(min, Math.min(number, max));
      };
      this.finish = () => this.pageAcitve = (this.intro >= this.limit) ? true : false;
      this.update = () => {
        if(!this.flag) return;
        requestAnimationFrame(this.update);
        zoom.style.transform = `scale(${this.intro})`;
        rows.forEach((item, i) => item.style.transform = `scale(${this.clip((this.last * 2), 0, 1)})`);
      };
      this.scroll = (e) => {
        this.flag = true;
        setTimeout(() => this.flag = false, 300);
        const wheelData = normalizeWheel(e);
        let speed = (wheelData.pixelY) ? wheelData.pixelY : 30;
        this.intro += (speed * this.options.fraction);
        this.intro = (this.intro <= 1) ? 1 : this.clip(this.intro, 1, this.limitpage);

        this.track += speed;
        this.track = (this.track <= 1) ? 1 : this.clip(this.track, 1, 10000);

        this.finish();
        this.update();

        if(this.pageAcitve) {
          this.page += (speed * this.options.fraction);
          this.page = (this.page <= 0.2) ? 0.2 : this.clip(this.page, 0.2, this.limit);

          this.last = this.page / 400;
          zoom.classList.add('hide');
          page.classList.add('show');
        }
      };
      this.init = () => {
        window.addEventListener(normalizeWheel.getEventType(), (e) => this.scroll(e), {passive: true});
        window.addEventListener('touchmove', (e) => this.scroll(e));
      }
    }
  }

  let z = new zoomSetup(zoom, page, rows);
  z.init();
};
