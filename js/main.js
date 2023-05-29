// see what page we are currently on and select targets based on that

const gallery = {
    top: document.querySelector('.gallery').getBoundingClientRect().y
}

const sizes = {
    block: {
        width: "200px",
        height: "200px"
    },
    large: {
        width: "80vw",
        height: "80vw"
    }
}

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
    item.posY = item.bounds.y
    item.width = item.bounds.width
    item.height = item.bounds.height
}

const pageContainer = document.getElementById("intro")
const isHomepage = pageContainer.classList.contains('is-home')
if(isHomepage) {
    const items = document.querySelectorAll('.js-pt')
    items.forEach(item => {
        item.addEventListener('click', (e) => updateCurrentItem(e))
    })
}





function init() {

    function loaderIn() {
        const imgWrapper = document.querySelector('.img_wrapper')
        const projectImgWrapper = document.querySelector('.project_image')
        const page = document.querySelector('#intro')
        let isHome = page.classList.contains('is-home') ? true : false

        const viewportWidth = window.innerWidth || document.documentElement.clientWidth
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight
        const scrollX = window.scrollX || window.pageXOffset
        const scrollY = window.scrollY || window.pageYOffset

        const tl = gsap.timeline()
        const commonOpts = {
            duration: 1.8,
            ease: "expo.inOut",
        }

        if(isHome) {
            // Center of the viewport calculation
            const midX = scrollX + viewportWidth / 2 - item.width / 2 - 12
            const midY = scrollY + viewportHeight / 2 - item.height / 2 - gallery.top

            // move image to the center, make it a block with some rotation
            tl.to(imgWrapper, { 
                width: sizes.block.width,
                height: sizes.block.height,
                x: midX, 
                y: midY, 
                rotate: "15deg", 
                ...commonOpts 
            })
            
            // scale up the image to larger dimension and translate to final position
            tl.to(imgWrapper, 
                {
                    width: sizes.large.width,
                    height: sizes.large.height,
                    x: viewportWidth * 0.1 - 12,
                    y: scrollY + viewportHeight * 0.64 - item.posY,
                    rotate: "0",
                    ...commonOpts
                })
        } else {
            const destinationX = scrollX + viewportWidth / 2 - sizes.block.width;
            const destinationY = scrollY + viewportHeight / 2 - sizes.block.height;

            // shrink width to desired block
            tl.to(projectImgWrapper, {
                width: sizes.block.width,
                height: sizes.block.height,
                x: destinationX,
                y: destinationY,
                rotate: "15deg",  
                ...commonOpts
            }, 0)

            // transform item to original position
            tl.to(projectImgWrapper, { x: item.posX, y: item.posY, rotate: "0", ...commonOpts }, commonOpts.duration)

            // hide the controls
            tl.to('.controls__icon', { y: "110%", ...commonOpts }, 0)
            
        }
        return tl
    }

    function loaderAway() {
        // TODO: run this when on project page
        return gsap.from('.controls__icon', { y: "110%", duration: 1.8, ease: "expo.inOut" })
    }


    // BARBA JS PART
    // =============

    // do something before the transition starts
    barba.hooks.before(() => {
        document.querySelector('html').classList.add('is-transitioning')
        barba.wrapper.classList.add('is-animating')
    });

    // do something after the transition finishes
    barba.hooks.after(() => {
        document.querySelector('html').classList.remove('is-transitioning')
        barba.wrapper.classList.remove('is-animating')
    });

    // scroll to the top of the page
    barba.hooks.enter(() => {
        const page = document.querySelector('#intro')
        let isHome = page.classList.contains('is-home') ? true : false
        if(isHome) {
            window.scrollTo(0, 0)
        }
    });

    barba.init({
        transitions: [{
            async leave() {
                // await because gsap animation return promise, we want that to finish
                await loaderIn()
            },
            enter() {
                loaderAway()
            }
        }]
    })
}

window.addEventListener('load', function () {
    init()
})