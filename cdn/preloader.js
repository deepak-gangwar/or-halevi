var preloader = document.querySelector(".preloader"),
  underlay = preloader.querySelector(".preloader__underlay"),
  wrapper = preloader.querySelector(".preloader__wrap"),
  percent = preloader.querySelector(".preloader__num"),
  loadbar = preloader.querySelector("#preloader__num2")

disableScroll()
function preloaderAnim() {
  disableScroll()
  if (!isMobile()) lenis.stop()
  // document.body.classList.remove('is-loading')
  const preloaderTl = new gsap.timeline()

  // for text
  // preloaderTl.to(loadbar, { width: "100%", duration: 1.7, ease: "expo.inOut" })

  // for svg image
  preloaderTl.fromTo(
    loadbar,
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

  if (window.innerWidth > 650) {
    // preloaderTl.to(wrapper, { top: "calc(5vw - 12px)", left: "50%", translateX: "-50%", duration: 2, ease: "expo.inOut" }, "label1")
    preloaderTl.to(wrapper, { top: "0", left: "50%", translateX: "-50%", duration: 2, ease: "expo.inOut" }, "label1")
  } else {
    // preloaderTl.to(wrapper, { top: "calc(5vw + 21px)", left: "50%", translateX: "-50%", duration: 2, ease: "expo.inOut" }, "label1")
    preloaderTl.to(wrapper, { top: "calc(5vw + 21px)", left: "50%", translateX: "-50%", duration: 2, ease: "expo.inOut" }, "label1")
  }

  const exoApeShape = `polygon(0 0px, 100% 0px, 100% ${1.1 * window.innerHeight}px, 0 ${window.innerHeight}px`
  const shape = `polygon(0 0px, 100% 0px, 100% ${window.innerHeight}px, 0 ${window.innerHeight}px`
  preloaderTl.fromTo(
    underlay,
    { clipPath: shape },
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
  preloaderTl.to(preloader, { opacity: 0, duration: 0.5 }, "label2")
  preloaderTl.to('.logo', { opacity: 1, duration: 0.5 }, "label2")
  preloaderTl.set('.hero-split', { opacity: 1, duration: 0 })
  preloaderTl.call(() => { gsapAnimations() })
  preloaderTl.call(() => { gsapHeroAnimations() })
  // preloaderTl.call(() => { preloader.remove() })
  preloaderTl.call(() => { enableScroll() })
  preloaderTl.call(() => { if (!isMobile()) lenis.start() })
}

window.addEventListener('load', preloaderAnim)
