import gsap from "gsap";
module.exports = function () {
  const line = document.querySelectorAll('.line');

  const container = document.querySelector('ul#sections');
  const sections = document.querySelectorAll('ul#sections li');
  const bar = document.querySelector('#vertical-bar');
  const logoMask = document.querySelector('.logo rect');
  const logo = document.querySelector('.logo');

  class createSections {
    constructor(container, sections, bar, line, logo, logoMask) {
      this.logo = logo;
      this.logoMask = logoMask;
      this.container = container;
      this.sections = sections
      this.totalWidth = 0;
      this.sectionHold = [];
      this.bar = bar;
      this.line = line;
      this.percentage = 0;
      this.fill = 0;
      this.location = (window.pageXOffset + window.innerWidth) - 45;
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

    // resize() {
    //   this.sections.forEach((section, i) => {
    //     this.sectionHold[i] = {
    //       width: section.offsetWidth,
    //       start: section.getBoundingClientRect().left,
    //       end: section.getBoundingClientRect().right
    //     }
    //   });
    //
    //   this.sections.forEach((section, i) => this.totalWidth += section.offsetWidth);
    //   this.container.style.width = `${this.totalWidth}px`;
    //   this.sections.forEach((item, i) => this.line[i].style.left = `${this.sectionHold[i].start}px`);
    // }
    scroll () {
      let n = 0;
      for (let i = 0; i < this.sectionHold.length; i++) {
        let t = (window.pageXOffset + window.innerWidth) - n;
        let logoLocation = Math.abs((logoelm.getBoundingClientRect().x - (window.innerWidth)) + logoelm.getBoundingClientRect().width);
        logoLocation = window.innerWidth - logoLocation;
        // this.line[1].style.left = `${logoLocation}px`;

        this.location = (t > 0) ? (window.pageXOffset + window.innerWidth) - n : 0;
        let trigger = this.sectionHold[1].start - n;
        this.percentage = ((this.location - trigger) / 86) * 100;

        // this.line[i].style.left = `${this.sectionHold[i].start}px`);
        // console.log(this.percentage)
        this.fill = (this.percentage / 300) * 900;
        // console.log(Math.abs(this.fill), Math.abs(this.percentage))
        // // console.log(((window.pageXOffset + window.innerWidth - this.sectionHold[1].start) / 86) * 100)
        gsap.to(this.logoMask, { x: Math.abs(this.fill) });

      }
    }
    init() {
      this.totalWidth = this.sections[0].offsetWidth * this.sections.length;
      // this.sections.forEach((section, i) => this.totalWidth += section.offsetWidth);
      this.container.style.width = `${this.totalWidth}px`;
      this.sections.forEach((item, i) => this.grab(item, i));

      // window.addEventListener('resize', (e) => this.resize());
      window.addEventListener('scroll', (e) => this.scroll())

      this.sections.forEach((item, i) => this.line[i].style.left = `${this.sectionHold[i].start}px`);
    }
  }

  const sectionList = new createSections(container, sections, bar, line, logo);
  sectionList.init();
};
