import { useRef, useState } from 'react'

/* Email RSVP: opens the guest's mail app; no responses are sent or stored by the site. */
export default function Rsvp({ data }) {
  const rsvp = data.rsvp || {}
  const names = `${data.couple.first} & ${data.couple.second}`
  const email = String(rsvp.email || '').trim()
  const validEmail = /^[^\s@<>?,;:%]+@[^\s@<>?,;:%]+\.[^\s@<>?,;:%]+$/.test(email)

  const form = useRef(null)
  const nameRef = useRef(null)
  const [attendance, setAttendance] = useState('')
  const [count, setCount] = useState('1')
  const [help, setHelp] = useState(
    validEmail
      ? 'Your email app will open with your reply. Please send the email to confirm your RSVP.'
      : 'You’re welcome to fill in your details. Email RSVP will be available once the host adds their address.',
  )
  const attending = attendance === 'yes'

  const onSubmit = (event) => {
    event.preventDefault()
    const name = nameRef.current
    name.setCustomValidity(name.value.trim() ? '' : 'Please enter your full name.')
    if (!form.current.reportValidity()) return
    if (!validEmail) {
      setHelp('The host’s RSVP email is not available yet. Your reply has not been sent.')
      return
    }
    const guest = name.value.trim()
    const body = `Dear ${names},\n\nThank you for your kind invitation.\n\nGuest name: ${guest}\nResponse: ${attending ? 'Joyfully accepts' : 'Regretfully declines'}\nNumber of guests attending: ${attending ? count : '0'}\n\nWith warm wishes,\n${guest}`
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Wedding RSVP — ${names}`)}&body=${encodeURIComponent(body)}`
    setHelp('Your reply is ready in your email app. Please press Send there to confirm your RSVP.')
  }

  return (
    <section className="paper-section floral rsvp-section motion-scene" aria-labelledby="rsvp-title">
      <div className="rsvp-card reveal">
        <span className="rsvp-kicker">Kindly reply</span>
        <svg className="rsvp-envelope" viewBox="0 0 48 36" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
          <rect x="2" y="3" width="44" height="30" rx="2" />
          <path d="m3 5 21 16L45 5M3 32l14-14m28 14L31 18" />
        </svg>
        <h2 className="script" id="rsvp-title">{rsvp.heading || 'A place for you'}</h2>
        <p>{rsvp.note || 'We would love to celebrate with you. Kindly let us know if you can join us.'}</p>
        {rsvp.deadline ? <p className="rsvp-deadline">Kindly reply by {rsvp.deadline}</p> : null}
        <form className="rsvp-form" id="rsvp-form" ref={form} onSubmit={onSubmit} noValidate={false}>
          <label htmlFor="rsvp-name">Your full name</label>
          <input id="rsvp-name" name="guestName" ref={nameRef} autoComplete="name" maxLength={120} placeholder="First and last name" required onInput={(e) => e.target.setCustomValidity('')} />
          <label htmlFor="rsvp-attendance">Will you be joining us?</label>
          <select id="rsvp-attendance" name="attendance" required value={attendance} onChange={(e) => setAttendance(e.target.value)}>
            <option value="">Please select your response</option>
            <option value="yes">Joyfully accepts</option>
            <option value="no">Regretfully declines</option>
          </select>
          <div id="rsvp-party" hidden={!attending}>
            <label htmlFor="rsvp-count">Number of guests attending</label>
            <input id="rsvp-count" name="guestCount" type="number" min="1" max="100" step="1" value={count} onChange={(e) => setCount(e.target.value)} disabled={!attending} required={attending} aria-describedby="rsvp-count-help" />
            <small id="rsvp-count-help">Including yourself</small>
          </div>
          <button type="submit" className="action rsvp-link">Prepare RSVP email</button>
          <p className="rsvp-help" role="status">{help}</p>
        </form>
      </div>
    </section>
  )
}
