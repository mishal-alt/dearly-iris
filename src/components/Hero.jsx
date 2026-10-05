import { asset, safeURL } from '../utils'
import Decor from './Decor'

export default function Hero({ data, theme, heroRef, heroHidden }) {
  const { first, second, heroNote } = data.couple
  return (
    <section className="hero motion-scene" aria-label="Wedding invitation">
      <img
        className="hero-art"
        src={data.media.heroPoster ? safeURL(data.media.heroPoster) : asset('hero-first.webp')}
        alt={theme.scene}
        decoding="async"
      />
      <video className="hero-video" id="hero-video" ref={heroRef} muted loop playsInline preload="none" hidden={heroHidden} />
      <div className="hero-copy">
        <p className="occasion">The wedding of</p>
        <p className="date">{data.wedding.dateLabel}</p>
        <h1 className="names" id="names" tabIndex={-1}>
          <span>{first}</span><i>&amp;</i><span>{second}</span>
        </h1>
        <p className="hero-note">{heroNote}</p>
        <a className="hero-link" href="#our-invitation">With love, you are invited</a>
      </div>
      <Decor index={0} eager />
    </section>
  )
}
