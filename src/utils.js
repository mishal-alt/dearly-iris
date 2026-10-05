// Only allow http(s)/file URLs for media taken from the data file.
export const safeURL = (value) => {
  try {
    const u = new URL(value, location.href)
    return ['http:', 'https:', 'file:'].includes(u.protocol) ? u.href : ''
  } catch {
    return ''
  }
}

// Theme art is shipped as webp.
export const asset = (name) => `./assets/${name.replace(/\.(png|jpe?g)$/, '.webp')}`
export const assetUrl = (name) => {
  try {
    return new URL(asset(name), location.href).href
  } catch {
    return asset(name)
  }
}

const icsEscape = (value) =>
  String(value).replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\;')
const stamp = (value) => value.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

export function downloadCalendar(data, date) {
  const configuredEnd = new Date(data.wedding.endISO)
  const end =
    Number.isFinite(configuredEnd.getTime()) && configuredEnd > date
      ? configuredEnd
      : new Date(date.getTime() + 6 * 3600000)
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Zetron Tech//Wedding//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
    `UID:${icsEscape(data.theme)}-${date.getTime()}@zetron.tech`,
    `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(date)}`, `DTEND:${stamp(end)}`,
    `SUMMARY:${icsEscape(data.couple.first + ' & ' + data.couple.second + ' wedding')}`,
    `LOCATION:${icsEscape(data.venue.name + ', ' + data.venue.address)}`,
    `DESCRIPTION:${icsEscape(data.wedding.invitationNote)}`,
    'END:VEVENT', 'END:VCALENDAR',
  ]
  const url = URL.createObjectURL(new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/calendar;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `${data.theme}-wedding.ics`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
