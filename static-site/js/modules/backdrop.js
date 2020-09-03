import gsap from 'gsap';
module.exports = function () {
  const line = document.querySelectorAll('.line');
  const triggerline = document.querySelector('.triggerline');
  const container = document.querySelector('ul#sections');
  const sections = document.querySelectorAll('ul#sections li');
  const bar = document.querySelector('#vertical-bar');
  const mask = document.querySelector('.logo rect');
  const logo = document.querySelector('.logo');
  class createSections {
    constructor (container, sections, logo, mask, app, line) {
      this.container = container;
      this.sections = sections;
      this.containerWidth = 0;
      this.sectionData = [];
      this.inView = 0;
      this.logo = logo;
      this.offsetLogo = 38;
      this.logoData = this.logo.getBoundingClientRect();
      this.logoDistance = this.logoData.width;
      this.mask = mask;
      this.percentage = 0;
      this.fill = 0;
      this.trigger = 0;
      this.flag = false;
      this.clip = (number, min, max) => {
        return Math.max(min, Math.min(number, max));
      };
      this.zero = (n) => (n <= 0) ? 0 : n;
      this.grabSection = (section, i) => {
        this.sectionData[i] = {
          el: section,
          theme: section.classList[1],
          width: section.getBoundingClientRect().width,
          start: section.getBoundingClientRect().left,
          end: section.getBoundingClientRect().right,
          index: i
        };
      };
      this.style = (el, x) => {
        el.style.transform = `translateX(${x}px)`;
      };
      this.update = () => {
        if (!this.flag) return;
        this.style(triggerline, this.locationTracker);
        this.style(this.mask, this.fill);
        requestAnimationFrame(this.update);
      };
      this.calculate = () => {
        // Create Width
        this.containerWidth = 0;
        this.sections.forEach((section, i) => this.containerWidth += section.offsetWidth);
        this.container.style.width = `${this.containerWidth}px`;
        // Grab Section Info
        this.sections.forEach((section, i) => this.grabSection(section, i));
      };
      this.resize = () => {
        this.calculate();
      };
      this.scroll = () => {
        this.flag = true;
        setTimeout(() => this.flag = false, 300);
        // Track location
        this.locationTracker = (window.pageXOffset + window.innerWidth) - this.offsetLogo;
        this.sectionData.forEach((section, i) => {
          this.trigger = this.sectionData[i].start;
          this.ends = this.sectionData[i].end;
          this.percentage = ((this.locationTracker - this.trigger) / this.logoDistance) * 100;
          this.progress = this.clip(this.zero(this.percentage), 0, 100);

          if (this.locationTracker >= this.trigger && this.locationTracker <= this.ends) {
            if (this.sectionData[i].theme === 'white') {
              // this.fill = Math.floor((this.progress / 100) * 300);
            } else if (this.sectionData[i].theme === 'black') {
              this.fill = Math.floor(-(this.progress / 100) * 300);
            }
          }
        });
        this.update();
      };
      this.init();
    }

    init () {
      this.calculate();
      this.scroll();
      window.addEventListener('resize', (e) => this.resize());
      window.addEventListener('scroll', (e) => this.scroll());
    }
  }

  new createSections(container, sections, logo, mask, line);
};

// TODO: 1: get correct data on window resize
// TODO: 2: setup all sections to handle logo Transition

// Inital device tests worked.
