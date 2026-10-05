import { asset, safeURL } from '../utils'

export default function Entrance({ data, theme, state, refs, onOpen, onSkip }) {
  const { first, second } = data.couple
  return (
    <div className={`entrance${state.leaving ? ' leaving' : ''}${state.opening ? ' opening' : ''}`} id="entrance" hidden={state.hidden}>
      <img
        className="envelope"
        src={data.media.openingPoster ? safeURL(data.media.openingPoster) : asset('envelope-first.webp')}
        alt={`${theme.name} floral embossed envelope with a wax seal`}
        fetchpriority="high"
      />
      <img className="envelope envelope-end" id="envelope-end" src={state.endSrc || undefined} alt="" hidden={!state.endSrc} />
      <button className="open-invitation" id="open" aria-label="Open the wedding invitation" disabled={state.openDisabled} onClick={onOpen}>
        <span className="open-caption">
          Open your invitation<small>{first} &amp; {second}</small>
        </span>
      </button>
      <video className="opening-video" id="opening-video" ref={refs.opening} muted playsInline preload="none" hidden={state.videoHidden} />
      <button className="skip-opening" id="skip" ref={refs.skip} hidden={state.skipHidden} onClick={onSkip}>Skip opening</button>
    </div>
  )
}
