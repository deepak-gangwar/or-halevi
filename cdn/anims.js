// GSAP SCROLL TRIGGER AND SPLIT TEXT ANIMATIONS
// =============================================

const cleanGSAP = () => {
  ScrollTrigger.getAll().forEach(t => t.kill(false))
  ScrollTrigger.refresh()
  window.dispatchEvent(new Event("resize"))
};

var childSplit = []
var parentSplit = []

gsap.registerPlugin(SplitText, ScrollTrigger)

function gsapSplitAnimations() {
  gsap.utils.toArray("h1,h2,h3,h4,h5,p").forEach((title) => {
    if(!title.classList.contains('hero-split')) {
      if(!title.classList.contains('js-split')) {
        childSplit = new SplitText(title, {
          type: "lines",
          linesClass: "split-child",
        })
        parentSplit = new SplitText(title, {
	  type: "lines",
          linesClass: "split-parent",
        })

        gsap.from(childSplit.lines, {
          scrollTrigger: {
            trigger: title,
            start: "bottom bottom",
            end: "bottom bottom",
          },
          duration: 1.2,
          yPercent: 220,
          ease: "power4.out",
          skewY: 7,
          stagger: 0.1,
        })
      }
	}
  });
}
// window.addEventListener('load', gsapSplitAnimations)

function gsapFirstParaAnimations() {
  gsap.utils.toArray(".js-split").forEach((title) => {
    childSplit = new SplitText(title, {
      type: "lines",
      linesClass: "split-child",
    })
    parentSplit = new SplitText(title, {
      linesClass: "split-parent",
    })

    gsap.from(childSplit.lines, {
      scrollTrigger: {
        trigger: title,
        start: "bottom bottom",
        end: "bottom bottom",
      },
      duration: 1.2,
      yPercent: 220,
      ease: "power4.out",
      skewY: 7,
      stagger: 0.1,
    }) 
  });
}
// window.addEventListener('load', gsapFirstParaAnimations)


function gsapAnimations() {
  // IMAGES ENTRANCE EFFECT
  
  gsap.utils.toArray(".fade img, video").forEach((img) => {
    gsap.fromTo(
      img,
      {
        clipPath: "inset(7% 7% 7% 7%)", 
        yPercent: 10,
        opacity: 1,
      },
      {
        scrollTrigger: {
          trigger: img,
          start: "top 100%",
          end: "bottom 0%",
          toggleActions: "play none none none",
        },
        duration: 1.8,
        clipPath: "inset(0% 0% 0% 0%)", 
        yPercent: 0,
        ease: "power4.out",
        stagger: {
          amount: 2,
        },
      }
    );
  });
  

  /*
  // PARALLAX EFFECT
  gsap.utils.toArray("[data-speed]").forEach(el => {
    gsap.to(el, {
      y: function() {return (1 - parseFloat(el.getAttribute("data-speed"))) * (ScrollTrigger.maxScroll(window) - (this.scrollTrigger ? this.scrollTrigger.start : 0))},
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top center",
        end: "max",
        invalidateOnRefresh: true,
        scrub: true
      }
    });
  });
  */

  
  if(!isMobile()) {
    gsap
    .timeline({
      scrollTrigger: {
        trigger: ".slider",
        start: "top 80%",
        end: "99% bottom",
        scrub: 1
      }
    })
    .to(".slide", {
      xPercent: -52,
      YPercent: -30,
      ease: "none"
    });
  }
  
  // Stop safari ios resizes
  //ScrollTrigger.normalizeScroll(true)
  //ScrollTrigger.config({ ignoreMobileResize: true })
}
// window.addEventListener('load', gsapAnimations)
  
function gsapPartnersAnim() {
  gsap.from(".partners-logo", {
    scrollTrigger: ".all-partners",
    start: "top top",
    end: "bottom bottom",
    duration: 1,
    yPercent: 30,
    opacity: 0,
    ease: "power4.out",
    stagger: {
      amount: 1,
    }
  });
}
//window.addEventListener('load', gsapPartnersAnim)
 
// NEXT PROJECTS ON HOVER
// ======================

function nextProjectHoverAnim(namespace) {
  let barbaNs
  if (namespace !== 'home') barbaNs = namespace
  
  if(barbaNs === 'case') {
    const container = document.getElementById('next-projects')
    const image = document.getElementById('next-project-image')
    let isHovered = false

    container.addEventListener('mouseenter', () => {
      isHovered = true
      gsap.to(image, { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", rotate:14, duration: 0.5, ease: "power4.easeInOut" })
    })

    container.addEventListener('mousemove', (event) => {
      if (isHovered) {
        const rect = container.getBoundingClientRect()
        const containerX = rect.left
        const containerY = rect.top
        const cursorX = event.clientX
        const cursorY = event.clientY
        const offsetX = cursorX - containerX
        const offsetY = cursorY - containerY
        const imageWidth = image.offsetWidth
        const imageHeight = image.offsetHeight
        const imageX = offsetX - imageWidth / 2
        const imageY = offsetY - imageHeight / 2

        gsap.to(image, { x: imageX, y: imageY, duration: 0.5, ease: "power4.easeInOut"})
        gsap.to(image, { rotation: (offsetX - containerX - container.offsetWidth / 2) / 20, duration: 0.3 })
      }
    })

    container.addEventListener('mouseleave', () => {
      isHovered = false
      gsap.to(image, { opacity: 0, clipPath: "inset(0% 100% 0% 0%)", rotate:0, duration: 0.5 })
    })
  }
}

function gsapHeroAnimations() {
  gsap.utils.toArray('.hero-split').forEach(heading => {
	const heroChildSplit = new SplitText(heading, {
      type: "lines",
      linesClass: "split-child",
    })
    const heroParentSplit = new SplitText(heading, {
      linesClass: "split-parent",
    })

    gsap.from(heroChildSplit.lines, {
      duration: 1.2,
      yPercent: 220,
      ease: "power4.out",
      skewY: 7,
      stagger: 0.1,
    })
  })
}
// window.addEventListener('load', gsapHeroAnimations)
