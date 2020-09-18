'use strict';
import { TweenLite, TweenMax, Elastic } from 'gsap';
module.exports = function () {
  const cursor = document.querySelector('#cursor');
  const body = document.querySelector('body');
  const items = document.querySelectorAll('[data-grab="link"]');
  class Mouse {
    constructor (cursor, items) {
      this.freeze = false;
      this.mX = 0;
      this.mY = 0;
      this.mcX = 0;
      this.mcY = 0;
      this.size = cursor.getBoundingClientRect().width;
      this.recenter = (c) => {
        return c - (this.size / 2);
      };
      this.runRAF = false;
      this.distance = 0;
      this.domData = [];
      this.build = () => {
        items.forEach((element, i) => {
          this.domData.push({
            element: element,
            index: i,
            proximity: element.dataset.proximity,
            type: element.dataset.grab,
            height: element.getBoundingClientRect().height,
            width: element.getBoundingClientRect().width,
            x: element.getBoundingClientRect().x,
            y: element.getBoundingClientRect().y,
            cX: element.getBoundingClientRect().x + (element.getBoundingClientRect().width / 2) - (this.size / 2),
            cY: element.getBoundingClientRect().y + (element.getBoundingClientRect().height / 2) - (this.size / 2)
          });
        });
      };
      this.resize = () => {
        this.build();
      };
      this.calculateDistance = (element, x, y) => {
        const elm = element.getBoundingClientRect();
        return Math.floor(
          Math.sqrt(
            Math.pow(x - (elm.left + (elm.width / 2)), 2) +
            Math.pow(y - (elm.top + (elm.height / 2)), 2)
          )
        ) - Math.round(elm.width / 2);
      };
      this.cursorIn = (e) => {
        cursor.classList.add('active');
      };
      this.cursorOut = (e) => {
        cursor.classList.remove('active');
      };
      this.cursorMovement = (e) => {
        this.mX = e.pageX;
        this.mY = e.pageY;
        this.mcX = this.recenter(this.mX);
        this.mcY = this.recenter(this.mY);

        this.domData.forEach((item, i) => {
          this.distance = this.calculateDistance(item.element, this.mX, this.mY);
          if (this.distance <= item.proximity) {
            this.freeze = true;
            TweenMax.to(cursor, 0.5, {
              y: item.cY,
              x: item.cX,
              onComplete () {
                this.freeze = false;
                console.log(this.freeze)
              }
            });
          } else {
            // console.log('false')
            console.log(this.freeze,'d')
            if (!this.freeze) {
              TweenMax.to(cursor, 0.5, { y: this.mcY, x: this.mcX });
            }
          }
        });

        // for (let i = 0; i < this.domData.length; i++) {
        //   // if (this.distance < this.domData[i].proximity) {
        //   //    TweenMax.to(cursor, 0.5, {y: this.domData[i].cY, x: this.domData[i].cX});
        //   // } else {
        //   //    TweenMax.to(cursor, 0.5, {y: this.mcY, x: this.mcX});
        //   //   // cursor.style.transform = `translate(${this.mcX}px, ${this.mcY}px)`;
        //   // }
        // }
        this.update();
        this.runRAF = true;
        setTimeout(() => { this.runRAF = false; }, 300);
      };
      this.update = () => {
        if (!this.runRAF) return;
        //
        // for (let i = 0; i < this.domData.length; i++) {
        //   this.distance = this.calculateDistance(this.domData[i].element, this.mX, this.mY);
        //   if (this.distance < this.domData[i].proximity) {
        //     console.log(this.domData[i].cX, this.domData[i].element)
        //     // TweenLite.to(cursor, {
        //     //   duration: 0.5,
        //     //   x: this.domData[i].cX,
        //     //   y: this.domData[i].cY
        //     // });
        //
        //     cursor.style.transform = `translate(${this.domData[i].cX}px, ${this.recenter(this.domData[i].cY)}px)`;
        //   } else {
        //     cursor.style.transform = `translate(${this.mcX}px, ${this.mcY}px)`;
        //   }
        // }
        requestAnimationFrame(this.update);
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

  const mouse = new Mouse(cursor, items);
  mouse.init();
};
