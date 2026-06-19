import LegalLayout, { CLOSING_NOTE } from './LegalLayout'

export default function Cookies() {
  return (
    <LegalLayout
      title="Cookie & Local Storage Policy"
      lastUpdated="12 June 2026"
      intro="This page explains the cookies and similar technologies the Service uses. We keep these to the minimum needed to run the application."
      sections={[
        {
          heading: 'Strictly necessary storage',
          bullets: [
            'Authentication: Firebase Authentication stores tokens in your browser (local storage / cookies) to keep you signed in securely. The Service cannot function without these.',
            'Preferences: small amounts of local storage may hold UI state.',
          ],
        },
        {
          heading: 'Analytics',
          paragraphs: [
            'If analytics are enabled by your organization, Firebase/Google Analytics may set identifiers to measure usage. These are not used for advertising. You can object via your administrator.',
          ],
        },
        {
          heading: 'No advertising cookies',
          paragraphs: [
            'We do not use third-party advertising or cross-site tracking cookies.',
          ],
        },
        {
          heading: 'Managing cookies',
          paragraphs: [
            'You can clear cookies and local storage in your browser settings, but doing so will sign you out and may reset preferences. Because authentication storage is strictly necessary, blocking it will prevent sign-in.',
          ],
        },
        {
          heading: 'Contact',
          paragraphs: [
            'Questions about this policy can be sent to sarath200795@gmail.com or by phone at +91 74570 06625.',
          ],
        },
      ]}
      closing={CLOSING_NOTE}
    />
  )
}
