import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { WEDDING_DATA as data } from './data'
import { INVITATION_THEMES } from './themes'
import { asset, assetUrl, downloadCalendar, safeURL } from './utils'
import { useAmbience } from './hooks/useAmbience'
import { useReveal } from './hooks/useReveal'
import Entrance from './components/Entrance'
import Hero from './components/Hero'
import Intro from './components/Intro'
import Countdown from './components/Countdown'
import Schedule from './components/Schedule'
import Venue from './components/Venue'
import Etiquette from './components/Etiquette'
import Rsvp from './components/Rsvp'
import Closing from './components/Closing'

const theme = INVITATION_THEMES[data.theme]
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
const source = (name) => (data.media[name] ? safeURL(data.media[name]) : '')
const date = new Date(data.wedding.dateISO)
const validDate = !Number.isNaN(date.getTime())

const initialEntrance = {
  leaving: false,
  opening: false,
  hidden: false,
  endSrc: '',
  openDisabled: false,
  skipHidden: true,
  videoHidden: true,
}

export default function App() {
  const openingRef = useRef(null)
  const heroRef = useRef(null)
  const audioRef = useRef(null)
  const mainRef = useRef(null)
  const skipRef = useRef(null)

  const openedRef = useRef(false)
  const leavingRef = useRef(false)
  const musicAttempted = useRef(false)
  const openingTimer = useRef()
  const fadeTimer = useRef()
  const statusTimer = useRef()

  const [entrance, setEntrance] = useState(initialEntrance)
  const [entered, setEntered] = useState(false)
  const [controlsHidden, setControlsHidden] = useState(true)
  const [musicHidden, setMusicHidden] = useState(true)
  const [musicOn, setMusicOn] = useState(false)
  const [motionPaused, setMotionPaused] = useState(reduced.matches)
  const [reducedNow, setReducedNow] = useState(reduced.matches)
  const [heroHidden, setHeroHidden] = useState(true)
  const [status, setStatus] = useState('')
  const motionPausedRef = useRef(motionPaused)
  motionPausedRef.current = motionPaused

  // Theme variables, body classes, title — before first paint.
  useLayoutEffect(() => {
    const root = document.documentElement
    ;['paper', 'ink', 'accent'].forEach((key) => root.style.setProperty(`--${key}`, theme[key]))
    root.style.setProperty('--botanical', `url("${assetUrl('botanical.webp')}")`)
    root.style.setProperty('--timeline-flower', `url("${assetUrl('timeline-flower.webp')}")`)
    document.body.classList.add(`theme-${data.theme}`, 'locked')
    document.title = `${data.couple.first} & ${data.couple.second} | Wedding invitation`
  }, [])

  // The invitation stays inert until the envelope has been opened.
  useLayoutEffect(() => {
    mainRef.current.inert = !entered
  }, [entered])

  const ambience = useAmbience({ theme: data.theme, reduced })
  useReveal(entered, { reduced, motionPausedRef })

  const notify = useCallback((message) => {
    setStatus(message)
    clearTimeout(statusTimer.current)
    statusTimer.current = setTimeout(() => setStatus(''), 4500)
  }, [])

  const finishOpening = useCallback(() => {
    if (leavingRef.current) return
    leavingRef.current = true
    clearTimeout(openingTimer.current)
    setEntrance((s) => ({ ...s, leaving: true }))
    setEntered(true)
    setControlsHidden(false)
    setMusicHidden(!source('music'))
    document.body.classList.remove('locked')
    fadeTimer.current = setTimeout(() => {
      setEntrance((s) => ({ ...s, hidden: true }))
      openingRef.current?.pause()
    }, reduced.matches ? 0 : 900)
  }, [])

  // Media wiring + opening video / audio events.
  useEffect(() => {
    const opening = openingRef.current
    const hero = heroRef.current
    const audio = audioRef.current
    if (source('openingVideo')) {
      opening.src = source('openingVideo')
      opening.poster = source('openingPoster') || asset('envelope-first.webp')
      opening.preload = 'auto'
    }
    if (source('heroVideo')) {
      hero.src = source('heroVideo')
      hero.poster = source('heroPoster') || asset('hero-first.webp')
    }
    if (source('music')) {
      audio.src = source('music')
      audio.volume = 0.45
    }
    const onAudioError = () => {
      setMusicOn(false)
      if (openedRef.current) notify('Music could not be loaded. You can still enjoy the invitation.')
    }
    const onOpeningTime = () => {
      if (Number.isFinite(opening.duration) && opening.currentTime >= opening.duration - 0.8) finishOpening()
    }
    const onOpeningError = () => { if (openedRef.current) finishOpening() }
    const onHeroError = () => setHeroHidden(true)
    audio.addEventListener('error', onAudioError)
    opening.addEventListener('ended', finishOpening)
    opening.addEventListener('error', onOpeningError)
    opening.addEventListener('timeupdate', onOpeningTime)
    hero.addEventListener('error', onHeroError)
    return () => {
      audio.removeEventListener('error', onAudioError)
      opening.removeEventListener('ended', finishOpening)
      opening.removeEventListener('error', onOpeningError)
      opening.removeEventListener('timeupdate', onOpeningTime)
      hero.removeEventListener('error', onHeroError)
    }
  }, [finishOpening, notify])

  // Reduced-motion preference changes.
  useEffect(() => {
    const onChange = (event) => {
      setMotionPaused(event.matches)
      setReducedNow(event.matches)
      if (event.matches && openedRef.current) finishOpening()
    }
    reduced.addEventListener('change', onChange)
    return () => reduced.removeEventListener('change', onChange)
  }, [finishOpening])

  // Keep ambience + hero video in step with the motion state.
  useEffect(() => {
    const hero = heroRef.current
    if (!entered) {
      ambience.setPaused(true)
      hero.pause()
      return
    }
    const stopped = motionPaused || reducedNow
    ambience.setPaused(stopped)
    const hide = stopped || !source('heroVideo')
    setHeroHidden(hide)
    if (stopped) hero.pause()
    else if (source('heroVideo')) hero.play().catch(() => setHeroHidden(true))
  }, [entered, motionPaused, reducedNow, ambience])

  useEffect(() => {
    if (entered) document.getElementById('names')?.focus({ preventScroll: true })
  }, [entered])

  useEffect(() => {
    if (!entrance.skipHidden) skipRef.current?.focus()
  }, [entrance.skipHidden])

  useEffect(() => () => {
    clearTimeout(openingTimer.current)
    clearTimeout(fadeTimer.current)
    clearTimeout(statusTimer.current)
  }, [])

  async function openInvitation() {
    if (openedRef.current) return
    openedRef.current = true
    setEntrance((s) => ({ ...s, openDisabled: true }))
    const hero = heroRef.current
    const opening = openingRef.current
    if (source('heroVideo') && !reduced.matches) {
      hero.preload = 'auto'
      hero.load()
    }
    if (source('music')) {
      setControlsHidden(false)
      setMusicHidden(false)
      // Start inside the opening gesture without delaying video on an audio download.
      if (!musicAttempted.current) {
        musicAttempted.current = true
        audioRef.current.play().then(() => setMusicOn(true)).catch(() => {})
      }
    }
    if (source('openingVideo') && !reduced.matches) {
      opening.hidden = false
      setEntrance((s) => ({ ...s, skipHidden: false, videoHidden: false }))
      openingTimer.current = setTimeout(finishOpening, 20000)
      try {
        await opening.play()
      } catch {
        finishOpening()
      }
    } else if (reduced.matches) {
      finishOpening()
    } else {
      setEntrance((s) => ({ ...s, endSrc: asset('envelope-last.webp'), opening: true }))
      openingTimer.current = setTimeout(finishOpening, 1800)
    }
  }

  function reopen() {
    clearTimeout(fadeTimer.current)
    clearTimeout(openingTimer.current)
    window.scrollTo({ top: 0, behavior: 'instant' })
    openedRef.current = false
    leavingRef.current = false
    const opening = openingRef.current
    const hero = heroRef.current
    opening.pause()
    opening.currentTime = 0
    hero.pause()
    hero.currentTime = 0
    setEntered(false)
    setEntrance((s) => ({ ...initialEntrance, endSrc: s.endSrc }))
    setControlsHidden(true)
    document.body.classList.add('locked')
    setTimeout(() => document.getElementById('open')?.focus(), 0)
  }

  async function toggleMusic() {
    const audio = audioRef.current
    if (audio.paused) {
      try {
        await audio.play()
        setMusicOn(true)
      } catch {
        notify('Music could not be played. Please try again.')
      }
    } else {
      audio.pause()
      setMusicOn(false)
    }
  }

  const stopped = motionPaused || reducedNow

  return (
    <>
      <Entrance
        data={data}
        theme={theme}
        state={entrance}
        refs={{ opening: openingRef, skip: skipRef }}
        onOpen={openInvitation}
        onSkip={finishOpening}
      />
      <main className="invitation" id="invitation" ref={mainRef}>
        <Hero data={data} theme={theme} heroRef={heroRef} heroHidden={heroHidden} />
        <Intro data={data} />
        <Countdown data={data} />
        <Schedule data={data} />
        <Venue
          data={data}
          calendarDisabled={!validDate}
          onCalendar={() => {
            downloadCalendar(data, date)
            notify('Your calendar invitation has been downloaded.')
          }}
        />
        <Etiquette data={data} />
        <Rsvp data={data} />
        <Closing data={data} onReopen={reopen} />
      </main>
      <div className="media-controls" id="media-controls" hidden={controlsHidden}>
        <button
          className="media-button"
          id="motion"
          aria-pressed={String(stopped)}
          hidden={!entered}
          disabled={reducedNow}
          onClick={() => { if (!reduced.matches) setMotionPaused((v) => !v) }}
        >
          {reducedNow ? 'Reduced motion' : motionPaused ? 'Play motion' : 'Pause motion'}
        </button>
        <button className="media-button" id="music" aria-pressed={String(musicOn)} hidden={musicHidden} onClick={toggleMusic}>
          {musicOn ? 'Pause music' : 'Play music'}
        </button>
      </div>
      <audio id="audio" ref={audioRef} loop preload="none" />
      <p id="status" className="status" role="status" hidden={!status}>{status}</p>
    </>
  )
}
