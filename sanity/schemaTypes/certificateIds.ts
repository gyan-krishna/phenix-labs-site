const certificateAlphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

/** Generates a 20-character certificate identifier without adding a runtime dependency. */
export function generateCertificateId() {
  const values = new Uint32Array(20)

  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    globalThis.crypto.getRandomValues(values)
  } else {
    for (let index = 0; index < values.length; index += 1) {
      values[index] = Math.floor(Math.random() * certificateAlphabet.length)
    }
  }

  return Array.from(
    values,
    (value) => certificateAlphabet[value % certificateAlphabet.length],
  ).join('')
}
