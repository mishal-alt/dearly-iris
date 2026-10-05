import { useEffect, useRef } from 'react'

const DEPTH = { 'aubergine-magnolia': 30, 'petrol-dahlia': 24, 'cobalt-iris': 36, 'cinnamon-camellia': 26 }

/**
 * Scroll-driven parallax for the scenes (.hero, .paper-section, .closing).
 * Event-driven: only visible scenes are measured. Returns { setPaused }.
 * Port of the original motion.js (decor sprigs are rendered by <Decor/> instead).
 */
export function useAmbience({ theme, reduced }) {
  const api = useRef({ setPaused: () => {} })

  useEffect(() => {
    const scenes = [...document.querySelectorAll('.hero,.paper-section,.closing')]
    const visible = new Set()
    const depth = DEPTH[theme] || 26
    let paused = true
    let frame = 0

    const disabled = () => paused || reduced.matches || document.hidden

    function paint() {
      frame = 0
      if (disabled()) return
      const height = window.innerHeight
      const positions = [...visible].map((scene) => {
        const rect = scene.getBoundingClientRect()
        const progress = Math.max(-1, Math.min(1, (height / 2 - rect.top - rect.height / 2) / ((height + rect.height) / 2)))
        return [scene, progress]
      })
      positions.forEach(([scene, progress]) => {
        scene.style.setProperty('--parallax-y', `${(progress * depth).toFixed(2)}px`)
        scene.style.setProperty('--scene-y', `${(progress * depth * 0.65).toFixed(2)}px`)
      })
    }
    function requestPaint() {
      if (!disabled() && !frame) frame = window.requestAnimationFrame(paint)
    }
    function sync() {
      const stop = disabled()
      document.body.classList[stop ? 'add' : 'remove']('motion-paused')
      if (stop) {
        window.cancelAnimationFrame(frame)
        frame = 0
        scenes.forEach((scene) => {
          scene.style.setProperty('--parallax-y', '0px')
          scene.style.setProperty('--scene-y', '0px')
        })
      } else requestPaint()
    }

    let observer
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          target.classList[isIntersecting ? 'add' : 'remove']('motion-visible')
          if (isIntersecting) visible.add(target)
          else visible.delete(target)
        })
        requestPaint()
      })
      scenes.forEach((scene) => observer.observe(scene))
    } else {
      scenes.forEach((scene) => {
        visible.add(scene)
        scene.classList.add('motion-visible')
      })
    }
    window.addEventListener('scroll', requestPaint, { passive: true })
    window.addEventListener('resize', requestPaint, { passive: true })
    document.addEventListener('visibilitychange', sync)
    sync()
    api.current.setPaused = (value) => {
      paused = value
      sync()
    }
    return () => {
      observer?.disconnect()
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestPaint)
      window.removeEventListener('resize', requestPaint)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [theme, reduced])

  return api.current
}
