import { useEffect } from 'react'

/**
 * Starts the scroll reveal (.reveal -> .arriving) and the schedule highlight
 * (li.is-current) once the invitation has been opened.
 */
export function useReveal(active, { reduced, motionPausedRef }) {
  useEffect(() => {
    if (!active || !('IntersectionObserver' in window)) return
    const reveal = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!reduced.matches && !motionPausedRef.current) entry.target.classList.add('arriving')
            reveal.unobserve(entry.target)
          }
        }),
      { threshold: 0.12 },
    )
    document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el))
    const timeline = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            document.querySelectorAll('.timeline li').forEach((el) => el.classList.remove('is-current'))
            entry.target.classList.add('is-current')
          }
        }),
      { rootMargin: '-30% 0px -45% 0px' },
    )
    document.querySelectorAll('.timeline li').forEach((el) => timeline.observe(el))
    return () => {
      reveal.disconnect()
      timeline.disconnect()
    }
  }, [active, reduced, motionPausedRef])
}
