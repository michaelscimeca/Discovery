'use strict';
import { TweenMax, Elastic } from 'gsap';
module.exports = function () {
  const cursor = document.querySelector('#cursor');
  const body = document.querySelector('body');
  const items = document.querySelectorAll('[data-grab="link"]');
  class Mouse {
    constructor (cursor, items) {
      this.current = {
        x: 0,
        y: 0
      };
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
        items.forEach((e, i) => {
          this.domData.push({
            element: e,
            index: i,
            proximity: e.dataset.proximity,
            type: e.dataset.grab,
            height: e.getBoundingClientRect().height,
            width: e.getBoundingClientRect().width,
            x: e.getBoundingClientRect().x,
            y: e.getBoundingClientRect().y,
            cX: e.getBoundingClientRect().x + (e.getBoundingClientRect().width / 2) - (this.size / 2),
            cY: e.getBoundingClientRect().y + (e.getBoundingClientRect().height / 2) - (this.size / 2)
          });
        });
        console.log(this.domData);
      };
      this.resize = () => {
        this.build();
      };
      this.calculateDistance = (e, x, y) => {
        const elm = e.getBoundingClientRect();
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

        this.runRAF = true;
        setTimeout(() => { this.runRAF = false; }, 300);
        this.update();
      };
      this.update = () => {
        if (!this.runRAF) return;
        this.domData.forEach((item, i) => {
          this.distance = this.calculateDistance(item.element, this.mX, this.mX);
          if (this.distance <= item.proximity) {
            this.current = {
              y: item.cY,
              x: item.cX,
              width: item.width,
              height: item.height
            };
          } else if (this.distance >= item.proximity) {
            this.current = {
              y: this.mcY,
              x: this.mcX,
              width: this.size,
              height: this.size
            };
          }
        });
        TweenMax.to(cursor, 0.5, {
          y: this.current.y,
          x: this.current.x,
          height: this.current.height,
          width: this.current.width
        });
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
