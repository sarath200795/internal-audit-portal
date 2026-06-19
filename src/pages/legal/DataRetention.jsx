import LegalLayout, { CLOSING_NOTE } from './LegalLayout'

export default function DataRetention() {
  return (
    <LegalLayout
      title="Data Retention & Security"
      lastUpdated="12 June 2026"
      intro="This page describes how long we keep data and the safeguards protecting it. It supplements our Privacy Policy."
      sections={[
        {
          heading: 'What we store',
          bullets: [
            'Account records (name, email, role, status) for as long as your account is active.',
            'Audit records (plans, findings, corrective actions, evidence) for as long as your organization retains them, or as required by your compliance obligations.',
          ],
        },
        {
          heading: 'Retention periods',
          bullets: [
            'Active data is retained while your organization uses the Service.',
            'On account deletion, associated personal data is removed or anonymized within 30 days, except where longer retention is required by law.',
            'Administrators can delete members, sites and audit records at any time; deletions are immediate in the live database.',
          ],
        },
        {
          heading: 'Security measures',
          bullets: [
            'Encryption in transit (HTTPS/TLS) for all traffic between your browser and our infrastructure.',
            'Authenticated access via Firebase Authentication; passwords are never stored by the application.',
            'Authorization enforced by org-scoped Firestore security rules so members only access their own organization’s data.',
            'Role-based access controls separate administrator, auditor and auditee capabilities.',
          ],
        },
        {
          heading: 'Evidence files',
          paragraphs: [
            'Evidence attachments are stored inline with audit records and are size-limited. Do not upload data you are not authorized to retain.',
          ],
        },
        {
          heading: 'Incident response',
          paragraphs: [
            'We maintain procedures to detect and respond to security incidents and will notify affected Customers without undue delay where required by law. Report concerns to sarath200795@gmail.com or +91 74570 06625.',
          ],
        },
        {
          heading: 'Backups',
          paragraphs: [
            'Hosted data benefits from our infrastructure provider’s durability and redundancy. Customers are encouraged to export critical records (e.g. PDF audit reports) for their own retention.',
          ],
        },
      ]}
      closing={CLOSING_NOTE}
    />
  )
}
