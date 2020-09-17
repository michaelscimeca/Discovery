'use strict';
// import gsap from 'gsap';
module.exports = function () {
  const cursor = document.querySelector('#cursor');
  const body = document.querySelector('body');
  const detection = document.querySelector('#detection');
  const elements = document.querySelectorAll('[data-grab="link"]');
  const domData = [];

  // Build Data
  function build () {
    elements.forEach((element, i) => {
      domData.push({
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
  }
  build();

  // Data Output
  // console.log(domData);

  class Mouse {
    constructor () {
      this.runRAF = false;
      this.mX = 0;
      this.MY = 0;
      this.distance = 0;
      this.update = (e) => {
        if (!this.runRAF) return;
        cursor.style.transform = `translate(${e.x}px, ${e.y}px)`;
        requestAnimationFrame(this.update);
      };
      this.calculateDistance = (element, mouseX, mouseY) => {
        // console.log(element.info.element)
        const e = element.getBoundingClientRect();
        return Math.floor(
          Math.sqrt(
            Math.pow(mouseX - (e.left + (e.width / 2)), 2) +
            Math.pow(mouseY - (e.top + (e.height / 2)), 2)
          )
        ) - Math.round(e.width / 2);
      };
      this.cursorMovement = (e) => {
        this.runRAF = true;
        setTimeout(() => { this.runRAF = false; }, 300);
        this.update(e);
        this.mX = e.pageX;
        this.mY = e.pageY;
        domData.forEach((elm, i) => {
          this.distance = this.calculateDistance(elm.info.element, this.mX, this.mY);
          console.log(this.distance < 100);

          if (this.distance < 100) {
            cursor.classList.add('triggered');
          } else {
            cursor.classList.remove('triggered');
          }
        });
      };
      this.init = () => {
        window.addEventListener('mousemove', (e) => this.cursorMovement(e));
      };
    }
  }

  function resize () {
    build();
  }
  window.addEventListener('resize', resize);

  const mouse = new Mouse(elements, 100);
  mouse.init();

  // function cursorIn (e) {
  //   cursor.classList.add('active');
  // }
  // function cursorOut (e) {
  //   cursor.classList.remove('active');
  // }

  // window.addEventListener('mousemove', (e) => cursorMovement(e));
  // body.addEventListener('mouseenter', (e) => cursorIn(e));
  // body.addEventListener('mouseleave', (e) => cursorOut(e));
};
