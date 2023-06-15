// UTILITY TO CHECK IF WE ARE ON MOBILE DEVICE
// ===========================================
  
function isMobile() {
  if (!(/iPhone|iPad|iPod|Android|webOS|BlackBerry|Opera Mini|IEMobile/i.test(navigator.userAgent))) {
    return false
  } else {
    return true
  }
}
