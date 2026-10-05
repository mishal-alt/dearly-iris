import Decor from './Decor'

export default function Etiquette({ data }) {
  return (
    <section className="paper-section floral etiquette motion-scene" aria-label="Guest details">
      <article className="reveal"><h2 className="script">Dress code</h2><p>{data.details.dressCode}</p></article>
      <div className="rule" aria-hidden="true"></div>
      <article className="reveal"><h2 className="script">Your presence, our present</h2><p>{data.details.giftPreference}</p></article>
      <Decor index={5} />
    </section>
  )
}
