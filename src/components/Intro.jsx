import Decor from './Decor'

export default function Intro({ data }) {
  return (
    <section className="paper-section floral intro motion-scene" id="our-invitation" aria-label="Our invitation">
      <h2 className="script reveal">{data.couple.subtitle}</h2>
      <div className="rule" aria-hidden="true"></div>
      <p className="reveal">{data.wedding.salutation}</p>
      <p className="invitation-note reveal">{data.wedding.invitationNote}</p>
      <Decor index={1} />
    </section>
  )
}
