'use strict';
import { TweenMax, Elastic } from 'gsap';
const Granim = require('granim');
module.exports = function () {
  const cursor = document.querySelector('#cursor');
  const cursorDrag = document.querySelector('#cursor-drag');

  // const shadow = document.querySelector('#shadow');

  const body = document.querySelector('body');
  const items = document.querySelectorAll('[data-grab="link"]');

  class Mouse {
    constructor (cursor, items) {
      this.options = {
        activeTest: false,
        borderColor: 'white',
        boxColor: 'black'
      };
      this.test = (data) => {
        const addElement = (kind, classname, attach, y, x, circle, size) => {
          const n = document.createElement(kind);
          n.className = classname;
          attach.appendChild(n);
          const styles = {
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: this.options.boxColor,
            transform: `translate(${y}px, ${x}px)`,
            width: '10px',
            height: '10px'
          };
          n.style.setProperty('--offset', `-${circle / 2}px`);
          n.style.setProperty('--circle', `${circle}px`);
          n.style.setProperty('--border-color', `${this.options.borderColor}`);
          Object.assign(n.style, styles);
        };
        data.forEach((dot, i) =>
          addElement(
            'div',
            'dot',
            body,
            (dot.cX),
            (dot.cY),
            (dot.proximity * 2) + dot.width,
            dot.width
          )
        );
      };
      this.mX = 0;
      this.mY = 0;
      this.mcX = 0;
      this.mcY = 0;
      this.domData = [];
      this.dots = [];
      this.current = {
        x: 0,
        y: 0
      };
      this.distance = 0;
      this.runRAF = false;
      this.size = cursor.getBoundingClientRect().width;
      this.recenter = (c) => {
        return c - (this.size / 2);
      };
      this.dot = function () {
        this.x = 0;
        this.y = 0;
        this.node = (() => {
          const n = document.createElement('div');
          n.className = 'trail';
          cursorDrag.appendChild(n);
          return n;
        })();
      };
      this.draw = (x, y) => {
        let scale = 1;
        let nextDot = {};
        let rotate = 0;
        this.dots.forEach((dot, index, dots) => {
          nextDot = dots[index + 1] || dots[0];
          scale = scale - 0.05;
          dot.x = x;
          dot.y = y;
          rotate = Math.floor((Math.random() * 10) + 1) * index;
          TweenMax.to(nextDot.node, 0.5, {
            y: y,
            x: x,
            scale: scale,
            height: this.current.height,
            width: this.current.width,
            rotation: rotate
          });
          // nextDot.node.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
          // nextDot.node.style.width = `${this.current.width}px`;
          // nextDot.node.style.height = `${this.current.height}px`;

          x += (nextDot.x - dot.x) * 0.4;
          y += (nextDot.y - dot.y) * 0.4;
        });
      };
      this.build = () => {
        items.forEach((e, i) => {
          this.domData.push({
            element: e,
            index: i,
            proximity: e.dataset.proximity,
            type: e.dataset.grab,
            expand: 30,
            height: e.getBoundingClientRect().height,
            width: e.getBoundingClientRect().width,
            elementSize: Math.max(e.getBoundingClientRect().height, e.getBoundingClientRect().width),
            x: e.getBoundingClientRect().x,
            y: e.getBoundingClientRect().y,
            cX: e.getBoundingClientRect().x + (e.getBoundingClientRect().width / 2) - (this.size / 2),
            cY: e.getBoundingClientRect().y + (e.getBoundingClientRect().height / 2) - (this.size / 2),
            detect: (x, y) => {
              const elm = e.getBoundingClientRect();
              const distance = Math.floor(
                Math.sqrt(
                  Math.pow(x - (elm.left + (elm.width / 2)), 2) +
                Math.pow(y - (elm.top + (elm.height / 2)), 2)
                )
              ) - Math.round(elm.width / 2);
              const inRange = (distance <= e.dataset.proximity);
              const returns = {
                element: (inRange) ? e : '',
                distance: distance,
                inRange: (distance <= e.dataset.proximity),
                height: e.getBoundingClientRect().height,
                width: e.getBoundingClientRect().width,
                type: e.dataset.grab,
                index: e.dataset.index,
                cX: e.getBoundingClientRect().x + (e.getBoundingClientRect().width / 2) - (this.size / 2),
                cY: e.getBoundingClientRect().y + (e.getBoundingClientRect().height / 2) - (this.size / 2),
                x: e.getBoundingClientRect().x,
                y: e.getBoundingClientRect().y
              };
              return returns;
            }
          });
        });

        for (let i = 0; i < 12; i++) {
          const d = new this.dot();
          this.dots.push(d);
        }

        if (this.options.activeTest) this.test(this.domData);
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
          const info = item.detect(this.mX, this.mY);
          if (info.inRange) {
            info.element.classList.add('trigger');
            this.current = {
              x: info.cX - (item.elementSize / 2) - (item.expand / 2) + (this.size / 2),
              y: info.cY - (item.elementSize / 2) - (item.expand / 2) + (this.size / 2),
              width: item.elementSize + item.expand,
              height: item.elementSize + item.expand
            };
          } else {
            this.domData.forEach((item, i) => item.element.classList.remove('trigger'));
            this.current = {
              x: this.mcX,
              y: this.mcY,
              width: this.size,
              height: this.size
            };
          }
        });

        // TweenMax.to(cursor, 0.5, {
        //   y: this.current.y,
        //   x: this.current.x,
        //   height: this.current.height,
        //   width: this.current.width
        // });

        this.draw(this.current.x, this.current.y);

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

  const mouse = new Mouse(cursorDrag, items);
  mouse.init();

  // dots is an array of Dot objects,
  // mouse is an object used to track the X and Y position
  // of the mouse, set with a mousemove event listener below
};
