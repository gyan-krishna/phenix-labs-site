/**
 * A deliberately local, versioned blocklist for common disposable-email providers.
 * It is a signal, not an identity-verification service; update it as abuse patterns change.
 */
const disposableEmailDomains = new Set([
  '10minutemail.com',
  '10minutemail.net',
  '20minutemail.com',
  'burnermail.io',
  'dispostable.com',
  'dropmail.me',
  'emailondeck.com',
  'emailtemp.org',
  'fakeinbox.com',
  'fakemail.net',
  'getnada.com',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.org',
  'inboxbear.com',
  'inboxkitten.com',
  'maildrop.cc',
  'mailinator.com',
  'mailinator.net',
  'mailnesia.com',
  'mohmal.com',
  'mytemp.email',
  'nada.email',
  'sharklasers.com',
  'tempmail.com',
  'tempmail.dev',
  'tempmail.io',
  'tempmailo.com',
  'temp-mail.org',
  'tempail.com',
  'tempinbox.com',
  'tempmailaddress.com',
  'throwawaymail.com',
  'throwawaymail.net',
  'tmpmail.net',
  'tmpmail.org',
  'trashmail.com',
  'trashmail.io',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
])

export function isDisposableEmail(email: string) {
  const domain = email.trim().toLowerCase().split('@')[1]
  if (!domain) return false
  const labels = domain.split('.')
  return labels.some((_, index) => disposableEmailDomains.has(labels.slice(index).join('.')))
}
