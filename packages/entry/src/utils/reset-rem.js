/**
 * reset the rem peoperty of the document object.
 * @param {number} basicSize - rem basic size
 * @param {number} designWidth - The size of the design
 * @returns
 */
const resetRem = (basicSize, designWidth) => {
  var docEI = document.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientataionchange' : 'resize',
    recalc = function () {
      var clientWidth = docEI.clientWidth
      if (!clientWidth) return
      docEI.style.fontSize = basicSize * (clientWidth / designWidth) + 'px'
    }

  if (!document.addEventListener) return
  window.addEventListener(resizeEvt, recalc, false)
  document.addEventListener('DOMContentLoaded', recalc, false)
}

export default resetRem
