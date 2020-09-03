module.exports = function () {
  const line = document.querySelectorAll('.line');
  const container = document.querySelector('ul#sections');
  const sections = document.querySelectorAll('ul#sections li');
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
      this.progress = 0;
      this.fillblack = 0;
      this.fillwhite = 0;
      this.fill = 0;
      this.info = {
        color: 'black',
        index: 0
      };
      this.trigger = 0;
      this.choice = '';
      this.flag = false;
      this.switch = false;
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
          if (i < 1) return;
          // Section your in
          if (this.locationTracker >= this.sectionData[i].start && this.locationTracker <= this.sectionData[i].end) {
            this.progress = this.clip(this.zero(((this.locationTracker - this.sectionData[i].start) / this.logoDistance) * 100), 0, 100);
            if (this.sectionData[i].theme === 'white') this.fill = this.zero(300 - (this.progress / 100) * 300);
            if (this.sectionData[i].theme === 'black') this.fill = -this.zero((this.progress / 100) * 300);
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

// TODO: 4: get correct data on window resize
// Inital device tests worked.
