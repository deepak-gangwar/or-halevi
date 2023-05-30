// WHAT IS NEEDED FROM OUTSIDE (intro, js-pt, image_wrapper, project__img)
// ===========================

// - Add data-barba="wrapper" to body
// - Add id="intro" to page container that will change
// - Also add data-barba="container" to this container
// - Also add class="is-home" to identify pages

// - Add class js-pt to the anchor/wrapper to make the image suitable for page transition
// - Specify block size and final sizes
// - Define your gsap animaitons in the class ________  


const sizes = {
    block: {
        width: 360,
        height: 360
    },
    large: {
        width: "80vw",
        height: "80vw"
    }
}

let currentHomeScrollPos = window.scrollY || window.pageYOffset

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
    item.width = item.bounds.width
    item.height = item.bounds.height
    currentHomeScrollPos = window.scrollY || window.pageYOffset
}

const pageContainer = document.getElementById("intro")
const isHomepage = pageContainer.classList.contains('is-home')
if(isHomepage) {
    const items = document.querySelectorAll('.js-pt')
    items.forEach(item => {
        item.addEventListener('click', (e) => updateCurrentItem(e))
    })
}

// used in setting tweens
const viewportWidth = window.innerWidth || document.documentElement.clientWidth
const viewportHeight = window.innerHeight || document.documentElement.clientHeight


// DEFINE ANIMATIONS FOR INDIVIDUAL PAGES
// ======================================

function pageHomeEntry(tl) {
    tl.from('.home__title', { opacity: 0, duration: 0.8 }, 0)
}

function pageHomeLeave() {}

function pageProjectEntry(tl) {
    tl.from('.controls__icon', { y: "110%", duration: 1.8, ease: "expo.inOut" }, 0)
    tl.from('.project__word', { y: "110%", duration: 1.8, ease: "expo.inOut" }, 0)
}

function pageProjectLeave() {}

let toHome = false
let toProject = false
let returnToY = item.posY  // to restore the position (scroll restoration)


// Main controller function
// ========================

function init() {

    function pageLeaveAnim() {
        const imgWrapper = item.el
        // const imgWrapper = document.querySelector('.img__wrapper')
        const projectImgWrapper = document.querySelector('.project__img')
        const page = document.querySelector('#intro')
        let isHome = page.classList.contains('is-home') ? true : false

        const tl = gsap.timeline()
        const commonOpts = {
            duration: 1.8,
            ease: "expo.inOut",
        }

        if(isHome) {
            // Center of the viewport calculation
            const scrollX = window.scrollX || window.pageXOffset
            const scrollY = window.scrollY || window.pageYOffset
            const midX = scrollX + viewportWidth / 2 - sizes.block.width / 2 - 12 - item.posX
            // this is problematic because currently only selecting first image
            const midY = -document.querySelector('.img__wrapper').getBoundingClientRect().top + viewportHeight / 2 - sizes.block.height / 2
            currentHomeScrollPos = scrollY

            tl.to('.home__title', { opacity: 0, duration: 0.8 }, 0)

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
            tl.to(imgWrapper, {
                width: sizes.large.width,
                height: sizes.large.height,
                x: viewportWidth * 0.1 - 12 - item.posX,
                y: scrollY + viewportHeight * 0.64 - item.posY,
                rotate: "0",
                ...commonOpts
            }, commonOpts.duration)

            toHome = false
            toProject = true
            returnToY = document.querySelector('.img__wrapper').getBoundingClientRect().top
        } else {
            const scrollX = window.scrollX || window.pageXOffset
            const scrollY = window.scrollY || window.pageYOffset
            const destinationX = scrollX + viewportWidth / 2 - sizes.block.width / 2
            const destinationY = scrollY + viewportHeight / 2 - sizes.block.height / 2

            // shrink width to desired block
            tl.to(projectImgWrapper, { width: sizes.block.width, height: sizes.block.height, x: destinationX, y: destinationY, rotate: "15deg", ...commonOpts }, 0)

            // transform item to original position
            tl.to(projectImgWrapper, { width: item.width, height: item.height, x: item.posX, y: returnToY, rotate: "0", ...commonOpts }, commonOpts.duration)
            // tl.to(projectImgWrapper, { width: item.width, height: item.height, x: item.posX, y: item.posY, rotate: "0", ...commonOpts }, commonOpts.duration)

            // hide the controls and project title
            tl.to('.controls__icon', { y: "110%", ...commonOpts }, 0)
            tl.to('.project__word', { y: "110%", duration: 1.8, ease: "expo.inOut" }, 0)

            toHome = true
            toProject = false
        }
        return tl
    }

    function pageEntryAnim() {
        // TODO: run this depending on page
        const tl = gsap.timeline()
        pageHomeEntry(tl)
        pageProjectEntry(tl)

        return tl
    }


    // BARBA JS PART
    // =============

    // do something before the transition starts
    barba.hooks.before(() => {})

    // do something after the transition finishes
    barba.hooks.after(() => {
        // scroll restoration
        toHome && window.scrollTo(0, currentHomeScrollPos)
        toProject && window.scrollTo(0, 0)
    })

    // scroll to the top of the page
    barba.hooks.enter(() => {
        window.scrollTo(0, 0)
    })

    barba.init({
        transitions: [{
            async leave() {
                // await because gsap animation return promise, we want that to finish
                await pageLeaveAnim()
            },
            enter() {
                pageEntryAnim()
            }
        }]
    })
}

window.addEventListener('load', function () {
    init()
})