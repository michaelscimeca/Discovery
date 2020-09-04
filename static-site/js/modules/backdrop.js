module.exports = function () {
  const container = document.querySelector('ul#sections');
  const sections = document.querySelectorAll('ul#sections li');
  const mask = document.querySelector('.logo rect');
  const logo = document.querySelector('.logo');

  class createSections {
    constructor (container, sections, logo, mask) {
      this.container = container;
      this.sections = sections;
      this.containerWidth = 0;
      this.sectionData = [];
      this.logo = logo;
      this.offsetLogo = 38;
      this.logoDistance = this.logo.getBoundingClientRect().width;
      this.mask = mask;
      this.progress = 0;
      this.fill = 0;
      this.runRAF = false;
      this.clip = (number, min, max) => {
        return Math.max(min, Math.min(number, max));
      };
      this.zero = (n) => (n <= 0) ? 0 : n;
      this.grabSectionData = (section, i) => {
        this.sectionData[i] = {
          el: section,
          theme: section.classList[1],
          width: section.getBoundingClientRect().width,
          start: section.getBoundingClientRect().left,
          end: section.getBoundingClientRect().right,
          index: i
        };
      };
      this.calculate = () => {
        this.containerWidth = 0;
        this.sections.forEach((section, i) => { this.containerWidth += section.offsetWidth; });
        this.container.style.width = `${this.containerWidth}px`;
        this.sections.forEach((section, i) => this.grabSectionData(section, i));
      };
      this.resize = () => {
        this.calculate();
      };
      this.scroll = () => {
        this.runRAF = true;
        setTimeout(() => { this.runRAF = false; }, 300);
        this.locationTracker = (window.pageXOffset + window.innerWidth) - this.offsetLogo;
        this.sectionData.forEach((section, i) => {
          if (i < 1) return;
          if (this.locationTracker >= this.sectionData[i].start && this.locationTracker <= this.sectionData[i].end) {
            this.progress = this.clip(this.zero(((this.locationTracker - this.sectionData[i].start) / this.logoDistance) * 100), 0, 100);
            if (this.sectionData[i].theme === 'white') this.fill = this.zero(300 - (this.progress / 100) * 300);
            if (this.sectionData[i].theme === 'black') this.fill = -this.zero((this.progress / 100) * 300);
          }
        });
        this.update();
      };
      this.update = () => {
        if (!this.runRAF) return;
        this.mask.style.transform = `translateX(${this.fill}px)`;
        requestAnimationFrame(this.update);
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
  new createSections(container, sections, logo, mask);
};

// TODO: 4: get correct data on window resize
// Inital device tests worked.
