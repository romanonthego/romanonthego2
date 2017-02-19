export default function(path) {
  const base = GLOBALS.BASE_URL || ''

  return `${base}${path}`
}
