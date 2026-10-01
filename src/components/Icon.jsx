const ICONS = {
  logo: (
    <>
      <path d="M4 16.5V7.5a3 3 0 0 1 3-3h1.8" />
      <path d="M20 16.5V7.5a3 3 0 0 0-3-3h-1.8" />
      <path d="M12 6.5v4.2l3 1.8" />
      <circle cx="12" cy="12" r="9" />
    </>
  ),
  users: (
    <>
      <path d="M16 19v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V19" />
      <circle cx="9" cy="7" r="3.2" />
      <path d="M22 19v-1.5a4 4 0 0 0-3-3.87" />
      <path d="M16.5 4.2a4 4 0 0 1 0 7.6" />
    </>
  ),
  funnel: (
    <>
      <path d="M3.5 5h17l-6.6 7.8V19l-3.8 2v-8.2L3.5 5Z" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="3" />
      <path d="M3.5 10h17" />
      <path d="M9 3v4M15 3v4" />
      <path d="M8.75 15.25l2.25 2.25 4.25-4.5" />
    </>
  ),
  badge: (
    <>
      <path d="M12 2.75l2.4 1.7 2.9-.15 1 2.72 2.35 1.7-.9 2.77.9 2.78-2.35 1.7-1 2.72-2.9-.15L12 21.25l-2.4-1.7-2.9.15-1-2.72-2.35-1.7.9-2.78-.9-2.77 2.35-1.7 1-2.72 2.9.15L12 2.75Z" />
      <path d="M9 12.25l2 2 4-4.25" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-3.9-3.9" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5.5v13M5.5 12h13" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.25V12l3.25 2" />
    </>
  ),
  star: <path d="M12 3.75l2.6 5.27 5.82.85-4.21 4.1.99 5.79L12 17.07l-5.2 2.69.99-5.79-4.21-4.1 5.82-.85L12 3.75Z" />,
  trendUp: (
    <>
      <path d="M4 16.5l5-5 3.5 3.5L20 7.5" />
      <path d="M15.5 7.5H20V12" />
    </>
  ),
  filter: (
    <>
      <path d="M4 6.5h16M7 12h10M10 17.5h4" />
    </>
  ),
  chevronDown: <path d="M6 9.5l6 6 6-6" />,
  check: <path d="M4.5 12.5l5 5 10-11" />,
  trash: (
    <>
      <path d="M4.5 6.5h15M9.5 6.5V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v1.5" />
      <path d="M6.5 6.5l.8 12a2 2 0 0 0 2 1.9h5.4a2 2 0 0 0 2-1.9l.8-12" />
      <path d="M10.5 10.5v6M13.5 10.5v6" />
    </>
  ),
  alert: (
    <>
      <path d="M10.3 3.9L2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4.5" />
      <path d="M12 17h.01" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12M18 6L6 18" />
    </>
  ),
}

export default function Icon({ name, size = 18, className = '', ...rest }) {
  const glyph = ICONS[name]
  if (!glyph) return null

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {glyph}
    </svg>
  )
}