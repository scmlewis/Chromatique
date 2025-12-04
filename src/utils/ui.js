export function addRipple(e) {
  try {
    const btn = e.currentTarget || e.target
    btn.style.position = btn.style.position || 'relative'
    const ripple = document.createElement('span')
    const rect = btn.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 1.2
    ripple.style.position = 'absolute'
    ripple.style.width = ripple.style.height = `${size}px`
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`
    ripple.style.borderRadius = '50%'
    ripple.style.background = 'rgba(255,255,255,0.12)'
    ripple.style.transform = 'scale(0)'
    ripple.style.pointerEvents = 'none'
    ripple.style.transition = 'transform 400ms cubic-bezier(.2,.9,.25,1), opacity 400ms'
    ripple.className = 'ripple-el'
    btn.appendChild(ripple)
    requestAnimationFrame(() => { ripple.style.transform = 'scale(1)'; ripple.style.opacity = '0' })
    setTimeout(() => { try { btn.removeChild(ripple) } catch (e) {} }, 450)
  } catch (e) { /* ignore */ }
}
