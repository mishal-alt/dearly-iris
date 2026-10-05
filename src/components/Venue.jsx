import { asset, safeURL } from '../utils'
import Decor from './Decor'

export default function Venue({ data, onCalendar, calendarDisabled }) {
  const { venue } = data
  const mapsURL = venue.mapsUrl ? safeURL(venue.mapsUrl) : ''
  const href = mapsURL || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.name + ' ' + venue.address)}`
  return (
    <section className="paper-section venue-section torn motion-scene" aria-labelledby="venue-title">
      <h2 className="script reveal" id="venue-title">Where we celebrate</h2>
      <img className="venue-scene reveal" src={asset('hero-first.webp')} alt="" loading="lazy" />
      <p className="venue-caption">{venue.sceneCaption}</p>
      <div className="location-frame reveal">
        <h3 className="venue-name">{venue.name}</h3>
        <div className="rule" aria-hidden="true"></div>
        <address className="venue-address">{venue.address}</address>
        <p>{venue.timeLabel}</p>
        <div className="actions">
          <a className="action" id="maps" target="_blank" rel="noopener noreferrer" href={href} hidden={!mapsURL && !venue.address.trim()}>Open in maps</a>
          <button className="action secondary" id="calendar" disabled={calendarDisabled} onClick={onCalendar}>Add to calendar</button>
        </div>
      </div>
      <p className="travel-note">{venue.note}</p>
      <Decor index={4} />
    </section>
  )
}
