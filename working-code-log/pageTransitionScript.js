// PAGE TRANSITION LOGIC
// =====================

const heightVal = window.innerWidth < 650 ? "120vw" : "80vw"
const sizes = {
  // NOTE: You can define your custom block size here (can be pixel value eg. 360)
  block: {
    width: window.innerWidth > window.innerHeight ? window.innerHeight / 1.7 : window.innerWidth / 1.7,
    height: window.innerWidth > window.innerHeight ? window.innerHeight / 1.7 : window.innerWidth / 1.7
  },
  large: {
    width: "80vw",
    height: heightVal
  }
}

let currentHomeScrollPos = window.scrollY || window.pageYOffset
let currentItemClasses = undefined

// to store the current position wrt gallery 
const item = {
  el: null,
  bounds: 0,
  posX: 0,
  posY: 0,
  width: 0,
  height: 0,
}

// update the current item
function updateCurrentItem(e) {
  const target = e.target.parentElement
  // this gives the image wrapper which is clicked for page transition
  item.el = target
  item.bounds = item.el.getBoundingClientRect()
  item.posX = item.bounds.x
  item.posY = item.bounds.y + window.scrollY
  item.top = item.bounds.top
  item.width = item.bounds.width
  item.height = item.bounds.height
  currentHomeScrollPos = window.scrollY || window.pageYOffset
  currentItemClasses = item.el.classList
}

function addEvents() {
  // gallery images for seamless page transitions
  const items = document.querySelectorAll('.js-pt')
  items.forEach(item => {
    item.addEventListener('click', (e) => updateCurrentItem(e))
  })
}
addEvents()
  
// to combine these two functions pass in data.next from the caller and use if 

let prevTransition = 'none'
let doSeamless = true
let doNextFade = false
function addNavEvents() {
  const items = document.querySelectorAll('.js-pt-nav')
  items.forEach(item => {
    item.addEventListener('click', (e) => { 
      doSeamless = false
      doNextFade = true 
    })
  })
}
addNavEvents()


// DEFINE ANIMATIONS FOR INDIVIDUAL PAGES
// ======================================

function pageHomeEntry(tl) {
  const images = document.querySelectorAll('.img__wrapper')
  images.forEach(image => {
    if (image.classList.toString() === currentItemClasses.toString()) tl.set(image, { zIndex: 10, duration: 0 }, 0)
    //if (image.classList.toString() !== currentItemClasses.toString()) tl.from(image, { opacity: 0, duration: 0.8 }, 0)
  })
  tl.add(() => document.querySelector('.overlay').remove())
  
  const gallery = document.querySelector('.gallery')
  const galleryOverlay = document.createElement('div')
  galleryOverlay.classList.add('gallery-overlay')
  gallery.insertAdjacentElement("beforebegin", galleryOverlay)
  tl.to(galleryOverlay, { opacity: 0, duration: 1.2 }, 0.2)
  tl.to(galleryOverlay, { height: 0, duration: 0 }, 1.4)
  
  
  tl.from('.home__title', { opacity: 0, duration: 1 }, 0)
  tl.to(item.el, { pointerEvents: 'all', duration: 0 }, 0)
  
  if (!isMobile()) {
    cursor?.reassignTriggers()
  	cursor?.addEventListeners()
  }
  
  
  // fade-in image subtitles on mobile
  if(isMobile()) {
    const titles = document.querySelectorAll('.subtitle__wrapper')
    titles.forEach(title => {
      gsap.from(title, { opacity: 0, duration: 0.8 })
    })
    
    const slides = document.querySelectorAll('.img__wrapper')
    slides.forEach(slide => {
      if (slide.classList.toString() === currentItemClasses.toString()) gsap.set(slide, { zIndex: 10, duration: 0 })
      if (slide.classList.toString() !== currentItemClasses.toString()) gsap.from(slide, { opacity: 0, duration: 0.8 })
    })
  }
}

function pageProjectEntry(tl) {
  tl.from('.controls', { opacity: 0, yPercent: "110", duration: 2, delay: -1, ease: "expo.inOut" }, 0)
  tl.from('.project__word', { yPercent: "250", duration: 2, ease: "expo.inOut", onComplete: () => {lenis.start()}}, 0)
}


let returnToY = item.posY  // to restore the position (scroll restoration)

let startFromCasePage = false
let hasTransitionRunOnce = false
//let doSeamless = false

const pageContainer = document.querySelector("#intro")
const isCasePage = pageContainer.classList.contains('is-page2')

function checkForCaseStart() {
  if (isCasePage && !hasTransitionRunOnce) startFromCasePage = true
}

window.addEventListener('load', checkForCaseStart)

// Main controller function
// ========================

function init() {

  function pageLeaveAnim() {
    hasTransitionRunOnce = true

    const imgWrapper = item.el
    const projectImgWrapper = document.querySelector('.project__img')
    const page = document.querySelector('#intro')
    let isHome = page.classList.contains('is-home') ? true : false

    const tl = gsap.timeline()
    const commonOpts = { duration: 1, ease: "expo.inOut" }

    if (isHome) {
      // Center of the viewport calculation
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const scrollX = window.scrollX || window.pageXOffset
      const scrollY = window.scrollY || window.pageYOffset
      const midX = scrollX + viewportWidth / 2 - sizes.block.width / 2 - item.posX
      const midY = - item.top + viewportHeight / 2 - sizes.block.height / 2
      currentHomeScrollPos = scrollY

      if(!isMobile()) lenis.stop()
      disableScroll()
      
      tl.to('.container', { opacity: 0, duration: 0.6, }, 0)
      tl.to(item.el, { pointerEvents: 'none', duration: 0 }, 0)

      const images = document.querySelectorAll('.img__wrapper')
      images.forEach(image => {
        if (image !== item.el) tl.to(image, { opacity: 0, duration: 0.8 }, 0)
      })

      // move image to the center, make it a block with some rotation
      tl.to(imgWrapper, {
        width: sizes.block.width,
        height: sizes.block.height,
        x: midX,
        y: midY,
        rotate: "15deg",
        ...commonOpts
      }, 0)

      // scale up the image to larger dimension and translate to final position
      const yVal = window.innerWidth < 650 ? viewportWidth * 0.55 - item.top : viewportWidth * 0.35 - item.top
      
      tl.to(imgWrapper, {
        width: sizes.large.width,
        height: sizes.large.height,
        x: viewportWidth * 0.1 - item.posX,
        y: yVal,
        rotate: "0",
        ...commonOpts
      }, commonOpts.duration)
      
      // fade-out image subtitles on mobile
      if(isMobile()) {
        const titles = document.querySelectorAll('.subtitle__wrapper')
        titles.forEach(title => {
          gsap.to(title, { opacity: 0, duration: 0.8 })
        })
      }

      returnToY = item.top

    } else {

      const viewportWidth = window.innerWidth || document.documentElement.clientWidth
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const scrollX = window.scrollX || window.pageXOffset
      const scrollY = window.scrollY || window.pageYOffset
      const destinationX = scrollX + viewportWidth / 2 - sizes.block.width / 2
      const destinationY = scrollY + viewportHeight / 2 - sizes.block.height / 2

      if(!isMobile()) lenis.stop()
      disableScroll()
      
      // overlay to blur other content of the page
      const overlay = document.createElement('div')
      const mainWrap = document.querySelector('.main-wrapper')
      overlay.classList.add('overlay')
      mainWrap.appendChild(overlay)
      
      tl.set(projectImgWrapper, { zIndex: "10", duration: 0 })
      tl.set(overlay, { height: "100%", duration: 0 })
      tl.from(overlay, { opacity: "0", duration: 0.6 }, 0)
      

      // shrink width to desired block
      tl.to(projectImgWrapper, { width: sizes.block.width, height: sizes.block.height, x: destinationX, y: destinationY, rotate: "15deg", ...commonOpts }, 0)

      // transform item to original position (scrolledAmt is needed only for lenis)
      tl.to(projectImgWrapper, { width: item.width, height: item.height, x: item.posX, y: (returnToY + getScrollAmt()), rotate: "0", ...commonOpts }, commonOpts.duration)

      // hide the controls and project title
      tl.to('.controls', { opacity: 0, yPercent: "100", ...commonOpts }, 0)
      tl.to('.project__word', { yPercent: "100", duration: 1, ease: "expo.inOut" }, 0)
      //tl.set(overlay, { height: 0, opacity: 0, duration: 0 })
    }
    return tl
  }

  function pageEntryAnim(current, next) {
    const tl = gsap.timeline()
    if (current.container.dataset.barbaNamespace === "case") pageHomeEntry(tl)
    if (current.container.dataset.barbaNamespace === "home") pageProjectEntry(tl)
    enableScroll()
    addEvents()
    addNavEvents()
    return tl
  }


  // BARBA JS PART
  // =============
  
  barba.hooks.beforeOnce((data) => {
    barbaNs = document.getElementById("intro").dataset.barbaNamespace
    nextProjectHoverAnim(barbaNs)
    if(!isMobile() && barbaNs === 'home') createCursor()
  })

  // barba.hooks.before((data) => { if (data.current.namespace === "case" && !hasTransitionRunOnce) console.log('run fade') })

  barba.hooks.after((data) => {
    //if (data.current.namespace === "case") window.scrollTo(0, currentHomeScrollPos)
    if (prevTransition === 'nextfade' && data.current.namespace === "case" && data.next.namespace === "home") window.scrollTo(0, 0)
    if (prevTransition === 'seamless' && data.current.namespace === "case" && data.next.namespace === "home") window.scrollTo(0, currentHomeScrollPos)
    if (data.current.namespace === "case" && data.next.namespace === "case") window.scrollTo(0, 0)
    if (data.current.namespace === "home") window.scrollTo(0, 0)
    // if (data.next.url.path === "/") createCursor()
  })
  
  barba.hooks.afterEnter((data) => {
    gsapHeroAnimations()
    if(data.next.namespace === 'case') setTimeout(() => { nextProjectHoverAnim(namespace = data.next.namespace) }, 1000)
    //if (!isMobile() && data.next.namespace === "home") {
    //  cursor.off()
    //  cursor.removeEventListeners()
    //  createCursor()
    //}
    
    //if (!isMobile() && data.next.namespace === "home") setTimeout(() => { createCursor() }, 1000)

    handleVideoPlayback()
    const vids = document.querySelectorAll("video")
    vids.forEach(vid => { 
      var playPromise = vid.play()
      if (playPromise !== undefined) { 
        playPromise.then(_ => {}).catch(error => {})
      }
    })
  })

  // scroll to the top of the page
  barba.hooks.enter(() => {
    window.scrollTo(0, 0)
    cleanGSAP()
    gsapAnimations()

    if(!isMobile()) lenis.stop()
    disableScroll()
    setTimeout(() => { if(!isMobile()) smoothScroll() }, 600)
  })

  barba.init({
    transitions: [
      // this one is just to make use of the barba.hooks.beforeOnce etc.
      {
        once() { /*console.log('this will be ignored')*/ },
        beforeOnce(data) {
          // Add the things in here that should run on first browser load
          // This includes the window load event listener function calls
        },
        afterOnce() { /*console.log('shows up AFTER once transition')*/ }
      },
      {
        name: 'seamless',
        from: {
          custom: ({ trigger }) => {
            return doSeamless
          },
        },
        async leave() {
          prevTransition = 'seamless'
          if (!isMobile()) {
            cursor.off()
            cursor.removeEventListeners()
          }
          await pageLeaveAnim()
        },
        enter({ current, next }) { pageEntryAnim(current, next) }
      },

      {
        name: 'fade',
        from: {
          custom: ({ trigger }) => {
            return startFromCasePage
          },
        },
        async leave() {
          prevTransition = 'fade'
          if(!isMobile()) lenis.stop()
          disableScroll()
          await gsap.to(document.body, { opacity: 0, duration: 0.6 })
        },
        enter() {
          startFromCasePage = false
          doSeamless = true
          addEvents()
          if(!isMobile()) createCursor()
          gsap.to(document.body, { opacity: 1, duration: 0.6 })

          lenis?.destroy()
          enableScroll()
          setTimeout(() => { if(!isMobile()) smoothScroll() }, 1500)
        },
      },
      
      {
        name: 'nextfade',
        from: {
          custom: ({ trigger }) => {
            return doNextFade
          },
        },
        async leave() {
          prevTransition = 'nextfade'
          if(!isMobile()) lenis.stop()
          disableScroll()
          await gsap.to(document.body, { opacity: 0, duration: 0.6 })
        },
        enter() {
          doNextFade = false
          startFromCasePage = true
          //doSeamless = true
          //addEvents()
          addNavEvents()
          //if(!isMobile()) createCursor()
          gsap.to(document.body, { opacity: 1, duration: 0.6 })

          lenis?.destroy()
          enableScroll()
          if(isMobile()) enableScroll()
          setTimeout(() => { if(!isMobile()) smoothScroll() }, 1500)
        },
      }
    ]
  })
}

// only called for the first time when site is loaded, no matter the start page.
window.addEventListener('load', init)
