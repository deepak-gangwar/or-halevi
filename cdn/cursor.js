// CUSTOM CURSOR
// =============

class Cursor {
  constructor() {
    this.bind()

    this.triggers = document.querySelectorAll('.img__wrapper')
    this.trigger = document.querySelector('.img__wrapper')
    this.cursor = {
      el: document.querySelector('.cursor'),
      bound: document.querySelector('.cursor').getBoundingClientRect().width,
      current: [0, 0],
      target: [0, 0],
      scale: 0.01,
    }

    this.ease = 0.1
    this.mouse = [0, 0]
    this.isHovering = false

    this.rAF = undefined

    this.init()
  }

  bind() {
    ['getPos', 'hideOnScroll', 'on', 'off', 'update', 'reassignTriggers'].forEach(fn => this[fn] = this[fn].bind(this))
  }

  reassignTriggers() {
    this.triggers = document.querySelectorAll('.img__wrapper')
  }

  createObserver() {
    if ("IntersectionObserver" in window) {
      let options = {
        root: null,
        rootMargin: "0px",
        threshold: 0
      }

      const observer = new IntersectionObserver(this.hideOnScroll, options)
      observer.observe(this.trigger)
    }
  }

  hideOnScroll(entries, observer) {
    this.off()
    // entries.forEach(entry => {
    //     if(entry.isIntersecting) {
    //         // do something
    //     }
    // })
  }

  getPos(e) {
    this.mouse[0] = e.clientX
    this.mouse[1] = e.clientY
  }

  on() {
    this.isHovering = true
    this.cursor.el.style.opacity = 1
    this.cursor.scale = 1
  }

  off() {
    this.isHovering = false
    this.cursor.el.style.opacity = 0
    this.cursor.scale = 0.01
  }

  update() {
    this.cursor.current[0] += (this.mouse[0] - this.cursor.current[0]) * this.ease
    this.cursor.current[1] += (this.mouse[1] - this.cursor.current[1]) * this.ease

    this.cursor.target[0] = this.cursor.current[0] - this.cursor.bound / 2
    this.cursor.target[1] = this.cursor.current[1] - this.cursor.bound / 2

    this.cursor.el.style.transform = `translate3d(${this.cursor.target[0]}px, ${this.cursor.target[1]}px, 0) scale(${this.cursor.scale})`

    this.requestAnimationFrame(this.update)
  }

  requestAnimationFrame() {
    this.rAF = requestAnimationFrame(this.update)
  }

  cancelAnimationFrame() {
    cancelAnimationFrame(this.rAF)
  }

  addEventListeners() {
    // this.trigger.addEventListener('mouseenter', this.on, false)
    // this.trigger.addEventListener('mouseleave', this.off, false)
    this.triggers.forEach(trigger => {
      trigger.addEventListener('mouseenter', this.on, false)
    })
    this.triggers.forEach(trigger => {
      trigger.addEventListener('mouseleave', this.off, false)
    })

    window.addEventListener('mousemove', this.getPos, false)
  }

  removeEventListeners() {
    // this.trigger.removeEventListener('mouseenter', this.on, false)
    // this.trigger.removeEventListener('mouseleave', this.off, false)
    this.triggers.forEach(trigger => {
      trigger.removeEventListener('mouseenter', this.on, false)
    })
    this.triggers.forEach(trigger => {
      trigger.removeEventListener('mouseleave', this.off, false)
    })

    window.removeEventListener('mousemove', this.getPos, false)
  }

  destroy() {
    this.cursor = {}
    this.removeEventListeners()
    this.cancelAnimationFrame()
  }

  init() {
    this.createObserver()
    this.addEventListeners()
    this.update()
  }
}

//const cursor = new Cursor()
let cursor
function createCursor() {
  if (!startFromCasePage) cursor = new Cursor()
}

//if(!isMobile()) window.addEventListener('load', createCursor)
