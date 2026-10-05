// Small "Crafted by Zetron Tech" watermark — footer only, links to our Instagram.
export const ZETRON_INSTAGRAM = 'https://www.instagram.com/zetron.tech'

export default function Credit() {
  return (
    <a className="zt-credit" href={ZETRON_INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Crafted by Zetron Tech on Instagram">
      <span>Crafted by</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
      </svg>
      <strong>Zetron Tech</strong>
    </a>
  )
}
