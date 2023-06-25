var loader__preloader = document.querySelector(".preloader"),
  loader__underlay = preloader.querySelector(".preloader__underlay"),
  loader__wrapper = preloader.querySelector(".preloader__wrap"),
  loader__percent = preloader.querySelector(".preloader__num"),
  loader__loadbar = preloader.querySelector("#preloader__num2")

disableScroll()

function preloaderAnim() {
  disableScroll()
  if (!isMobile()) lenis.stop()
  // document.body.classList.remove('is-loading')
  
  const preloaderTl = new gsap.timeline()

  preloaderTl.fromTo(
    loader__loadbar,
    {
      clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)"
    },
    {
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
      delay: 0.5,
      duration: 2,
      ease: "expo.inOut"
    }
  )

  let yVal = window.innerWidth > 650 ? "-11px" : 0
  preloaderTl.to(loader__wrapper, { top: yVal, left: "50%", translateX: "-50%", duration: 2, ease: "expo.inOut" }, "label1")

  preloaderTl.fromTo(
    loader__underlay,
    { clipPath: `polygon(0 0px, 100% 0px, 100% ${window.innerHeight}px, 0 ${window.innerHeight}px` },
    {
      clipPath: "polygon(0 0px, 100% 0px, 100% 0px, 0 0px)",
      // delay: 1,
      duration: 2,
      ease: "expo.inOut",
    },
    "label1"
  )

  preloaderTl.set('.hero-split', { opacity: 0, duration: 0 }, 0)
  preloaderTl.set('.logo', { opacity: 0, duration: 0 }, 0)
  preloaderTl.to(loader__preloader, { opacity: 0, duration: 0.5 }, "label2")
  preloaderTl.to('.logo', { opacity: 1, duration: 0.5 }, "label2")
  preloaderTl.set('.hero-split', { opacity: 1, duration: 0 })
  preloaderTl.call(() => { gsapAnimations() })
  preloaderTl.call(() => { gsapHeroAnimations() })
  preloaderTl.call(() => { preloader.remove() })
  preloaderTl.call(() => { enableScroll() })
  preloaderTl.call(() => { if (!isMobile()) lenis.start() })
}

window.addEventListener('load', preloaderAnim)
