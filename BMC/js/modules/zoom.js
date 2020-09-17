// import gsap from "gsap";
// const dat = require('dat.gui');
// const gui = new dat.GUI();
const normalizeWheel = require('./facebook-normalize-wheel');
module.exports = function () {
  const zoom = document.querySelector('#zoom-in');
  const page = document.querySelector('#page');
  const rows = document.querySelectorAll('.row');

  function blurRect (w, h, blur, color) {
  	const c = document.createElement('canvas');
  	const ctx = c.getContext('2d');
  	c.width = w;
  	c.height = h;
  	ctx.fillStyle = color;
  	ctx.shadowBlur = blur;
  	ctx.shadowColor = color;
  	ctx.shadowOffsetX = w;
  	ctx.shadowOffsetY = h;
  	ctx.fillRect(-w + blur, -h + blur, w - blur * 2, h - blur * 2);
  	return c;
  }

  const br = blurRect(400, 400, 100, '#000');

  class zoomSetup {
    constructor (zoom, page, rows) {
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
      this.zero = (n) => (n <= 1) ? 1 : n;
      this.clip = (number, min, max) => {
        return Math.max(min, Math.min(number, max));
      };
      this.update = () => {
        if (!this.flag) return;
        requestAnimationFrame(this.update);
        zoom.style.transform = `scale(${this.progress})`;
        // rows.forEach((item, i) => item.style.transform = `scale(${this.clip((this.last * 2), 0, 1)})`);
      };
      this.scroll = (e) => {
        this.flag = true;
        setTimeout(() => { this.flag = false; }, 300);
        const wheelData = normalizeWheel(e);
        this.intro += (wheelData.pixelY);
        this.intro = (this.intro >= 0) ? this.intro : 0;
        console.log(wheelData.pixelY, this.intro * 0.1);

        this.progress = this.zero(this.intro);

        // this.intro = (this.intro <= 1) ? 1 : this.clip(this.intro, 1, this.limitpage);

        // this.track += speed;
        // this.track = (this.track <= 1) ? 1 : this.clip(this.track, 1, 10000);
        //
        // this.pageAcitve = (this.intro >= this.limit);

        // if (this.pageAcitve) {
        //   this.page += (speed * this.options.fraction);
        //   this.page = (this.page <= 0.2) ? 0.2 : this.clip(this.page, 0.2, this.limit);
        //
        //   this.last = this.page / 400;
        //   zoom.classList.add('hide');
        //   page.classList.add('show');
        // }
        this.update();
      };
      this.init = () => {
        window.addEventListener(normalizeWheel.getEventType(), (e) => this.scroll(e), { passive: true });
        window.addEventListener('touchmove', (e) => this.scroll(e));
      };
    }
  }

  const z = new zoomSetup(zoom, page, rows);
  z.init();
};
