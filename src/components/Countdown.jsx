import { useEffect, useState } from 'react'

const pad = (n) => String(n).padStart(2, '0')

export default function Countdown({ data }) {
  const date = new Date(data.wedding.dateISO)
  const validDate = !Number.isNaN(date.getTime())
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const remaining = validDate ? Math.max(0, date.getTime() - now) : 0
  const seconds = Math.floor(remaining / 1000)
  const values = {
    days: Math.floor(seconds / 86400),
    hours: Math.floor(seconds / 3600) % 24,
    minutes: Math.floor(seconds / 60) % 60,
    seconds: seconds % 60,
  }
  const begun = validDate && !remaining

  return (
    <section className="paper-section countdown-section torn motion-scene" aria-labelledby="countdown-title">
      <h2 className="script" id="countdown-title">{begun ? 'Our celebration has begun' : 'Until we say “I do”'}</h2>
      <div className="countdown" id="countdown" role="timer" aria-label="Time until the wedding" hidden={!validDate}>
        {[['days', 'Days'], ['hours', 'Hours'], ['minutes', 'Minutes'], ['seconds', 'Seconds']].map(([key, label]) => (
          <div key={key}>
            <strong data-count={key}>{pad(values[key])}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <p className="countdown-note" id="countdown-note">{begun ? 'Thank you for being part of our story.' : data.wedding.longDate}</p>
    </section>
  )
}
