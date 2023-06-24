// LENIS SMOOTH SCROLL
// ===================

let lenis, scrolledAmt

function getScrollAmt() {
  if(isMobile()) return window.scrollY
  else return scrolledAmt
}

function smoothScroll() {
  lenis = new Lenis({
    duration: 1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    //wheelMultiplier: 2,
    smoothWheel: true
  })

  function raf(time) {
    lenis.raf(time)
    ScrollTrigger.update()
    requestAnimationFrame(raf)
  }
  
  lenis.on('scroll', ({ scroll }) => { scrolledAmt = scroll })
  requestAnimationFrame(raf)
}


if(!isMobile()) smoothScroll()
//window.addEventListener('load', smoothScroll)
