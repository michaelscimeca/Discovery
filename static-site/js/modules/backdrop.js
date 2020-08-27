import gsap from "gsap";
module.exports = function () {
  const line = document.querySelectorAll('.line');

  const container = document.querySelector('ul#sections');
  const sections = document.querySelectorAll('ul#sections li');
  const bar = document.querySelector('#vertical-bar');
  const logoMask = document.querySelector('.logo rect');
  const logo = document.querySelector('.logo');

  class createSections {
    constructor(container, sections, bar, line, logo, logoMask, app) {
      this.app = app;
      this.logo = logo;
      this.logoMask = logoMask;
      this.container = container;
      this.sections = sections
      this.totalWidth = 0;
      this.sectionHold = [];
      this.bar = bar;
      this.line = line;
      this.percentage = 0;
      this.convert = 0;
      this.fill = 0;
      this.location = (window.pageXOffset + window.innerWidth) - this.offsetLogo;
      this.trigger = 0;
      this.offsetLogo = 33;
      this.distance = 55;
    }
    grab(section, i) {
      this.sectionHold[i] = {
        el: section,
        theme: section.classList[1],
        width: section.offsetWidth,
        start: section.getBoundingClientRect().left,
        end: section.getBoundingClientRect().right
      }
    }
    scroll () {
      for (let i = 0; i < this.sectionHold.length; i++) {
        this.location = (window.pageXOffset + window.innerWidth) - this.offsetLogo;
        // TODO: Needs to run through all sections for triggers.
        this.trigger = this.sectionHold[1].start;

        this.percentage = ((this.location - this.trigger) / this.distance) * 100;
        this.convert = (this.percentage / 100) * 300;
        this.fill = (this.convert <= 0) ? 0 : this.convert;
        // Transition
        gsap.to(this.logoMask, { x: -Math.abs(this.fill)});
      }
    }
    init() {
      this.totalWidth = this.sections[0].offsetWidth * this.sections.length;
      // this.sections.forEach((section, i) => this.totalWidth += section.offsetWidth);
      this.container.style.width = `${this.totalWidth}px`;
      this.sections.forEach((item, i) => this.grab(item, i));

      // window.addEventListener('resize', (e) => this.resize());
      window.addEventListener('scroll', (e) => this.scroll())

      // this.sections.forEach((item, i) => this.line[i].style.left = `${this.sectionHold[i].start}px`);
    }
  }

  const sectionList = new createSections(container, sections, bar, line, logo, logoMask, app);
  sectionList.init();
};

// TODO: 1: get correct data on window resize
// TODO: 2: setup all sections to handle logo Transition

// Inital device tests worked.
