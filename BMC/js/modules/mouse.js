'use strict';
// import gsap from 'gsap';
module.exports = function () {
  const cursor = document.querySelector('#cursor');
  const body = document.querySelector('body');
  // const detection = document.querySelector('#detection');
  const elements = document.querySelectorAll('[data-grab="link"]');

  class Mouse {
    constructor () {
      this.runRAF = false;
      this.mX = 0;
      this.mY = 0;
      this.distance = 0;
      this.domData = [];
      this.build = () => {
        elements.forEach((element, i) => {
          this.domData.push({
            info: {
              element: element,
              index: i,
              proximity: element.dataset.proximity,
              type: element.dataset.grab,
              height: element.getBoundingClientRect().height,
              width: element.getBoundingClientRect().width,
              x: element.getBoundingClientRect().x,
              y: element.getBoundingClientRect().y
            }
          });
        });
      };
      this.resize = () => {
        this.build();
      };
      this.calculateDistance = (element, mouseX, mouseY) => {
        const e = element.getBoundingClientRect();
        return Math.floor(
          Math.sqrt(
            Math.pow(mouseX - (e.left + (e.width / 2)), 2) +
            Math.pow(mouseY - (e.top + (e.height / 2)), 2)
          )
        ) - Math.round(e.width / 2);
      };
      this.cursorIn = (e) => {
        cursor.classList.add('active');
      };
      this.cursorOut = (e) => {
        cursor.classList.remove('active');
      };
      this.update = (e) => {
        if (!this.runRAF) return;
        cursor.style.transform = `translate(${e.x}px, ${e.y}px)`;
        requestAnimationFrame(this.update);
      };
      this.cursorMovement = (e) => {
        this.runRAF = true;
        setTimeout(() => { this.runRAF = false; }, 300);
        this.update(e);
        this.mX = e.pageX;
        this.mY = e.pageY;
        this.domData.forEach((elm, i) => {
          this.distance = this.calculateDistance(elm.info.element, this.mX, this.mY);
          if (this.distance < elm.info.proximity) {
            cursor.classList.add('triggered');
          }
        });
      };
      this.init = () => {
        this.build();
        window.addEventListener('mousemove', (e) => this.cursorMovement(e));
        window.addEventListener('resize', this.resize);
        body.addEventListener('mouseenter', (e) => this.cursorIn(e));
        body.addEventListener('mouseleave', (e) => this.cursorOut(e));
      };
    }
  }

  const mouse = new Mouse(elements, 100);
  mouse.init();



  // window.addEventListener('mousemove', (e) => cursorMovement(e));
  // body.addEventListener('mouseenter', (e) => cursorIn(e));
  // body.addEventListener('mouseleave', (e) => cursorOut(e));
};
