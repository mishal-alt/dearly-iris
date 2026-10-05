// Decorative drifting sprig; never intercepts gestures or enters the accessibility tree.
export default function Decor({ index, eager = false }) {
  return (
    <div className="motion-decor" aria-hidden="true">
      <span className={`botanical-drift ${index % 2 ? 'drift-right' : 'drift-left'}`}>
        <img
          src="./assets/motion-sprig.webp"
          alt=""
          width="320"
          height="480"
          decoding="async"
          loading={eager ? 'eager' : 'lazy'}
        />
      </span>
    </div>
  )
}
