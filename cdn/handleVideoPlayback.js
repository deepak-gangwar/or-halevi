// PLAY VIDEO WHEN IN VIEWPORT
// ===========================
  
function handleVideoPlayback() {
  let playStates = new Map()
  const videos = document.querySelectorAll("video")
  const observerOptions = { rootMargin: "0px 0px 500px 0px" }

  const onIntersectionChange = (video, entry) => {
    if (!entry.isIntersecting) {
      video.pause()
      playStates.set(video, false)
    } else {
      video.play()
      playStates.set(video, true)
    }
  }

  const onVisibilityChange = () => {
    videos.forEach(video => {
      const playState = playStates.get(video)
      if (document.hidden || !playState) {
        video.pause()
      } else {
        video.play()
      }
    })
  }

  videos.forEach(video => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        onIntersectionChange(video, entry)
      })
    }, observerOptions)

    observer.observe(video)
    playStates.set(video, false)
  })

  document.addEventListener("visibilitychange", onVisibilityChange)
}

window.addEventListener('load', handleVideoPlayback)
