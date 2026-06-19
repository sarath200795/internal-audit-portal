import LegalLayout, { CLOSING_NOTE } from './LegalLayout'

export default function Privacy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated="12 June 2026"
      intro={
        'This Privacy Policy explains how WE EHS ("we", "us") collects, uses, discloses and safeguards information when you use the application (the "Service"). We act as a data processor on behalf of the organization that registers you (the "Customer"), who is the data controller of audit records you submit.'
      }
      sections={[
        {
          heading: 'Information we collect',
          bullets: [
            'Account data: your name, email address, organization, role and approval status.',
            'Audit content: audit plans, sites, findings, corrective actions and any evidence files you upload.',
            'Technical data: authentication tokens and basic device/log information needed to operate and secure the Service.',
          ],
        },
        {
          heading: 'How we use information',
          bullets: [
            'To provide the Service — authenticate you, scope access to your organization, and store the audit records you create.',
            'To secure the Service — detect, prevent and investigate abuse, fraud and security incidents.',
            'To comply with legal obligations and enforce our Terms of Service.',
          ],
          paragraphs: [
            'We do not sell your personal information and we do not use audit content for advertising.',
          ],
        },
        {
          heading: 'Legal bases',
          paragraphs: [
            'Where applicable law (e.g. GDPR) requires a legal basis, we rely on performance of a contract, our legitimate interests in operating a secure service, and compliance with legal obligations. Customers are responsible for the lawful basis of the audit content they upload.',
          ],
        },
        {
          heading: 'Sharing and sub-processors',
          bullets: [
            'We use Google Firebase (Authentication and Cloud Firestore) to host authentication and data. Google acts as a sub-processor and may process data in its data centers.',
            'We share data with other members of your own organization according to role-based access controls (auditors, auditees, administrators).',
            'We may disclose information if required by law or to protect rights, safety and security.',
          ],
        },
        {
          heading: 'International transfers',
          paragraphs: [
            'Data may be processed in regions where our infrastructure providers operate. Where required, transfers are protected by appropriate safeguards such as Standard Contractual Clauses.',
          ],
        },
        {
          heading: 'Your rights',
          paragraphs: [
            'Subject to applicable law you may request access, correction, deletion or export of your personal data, and may object to or restrict certain processing. Because we act for your organization, please direct requests to your administrator or contact us at sarath200795@gmail.com.',
          ],
        },
        {
          heading: 'Security',
          paragraphs: [
            'We use industry-standard measures including encryption in transit, authenticated access, and org-scoped authorization rules. No method of transmission or storage is completely secure; see our Data & Security page for details.',
          ],
        },
        {
          heading: 'Children',
          paragraphs: [
            'The Service is intended for workplace use by adults and is not directed to children under 16.',
          ],
        },
        {
          heading: 'Changes',
          paragraphs: [
            'We may update this Policy from time to time. Material changes will be notified within the Service or by email. Continued use after changes constitutes acceptance.',
          ],
        },
        {
          heading: 'Contact',
          paragraphs: [
            'Questions about this Policy can be sent to sarath200795@gmail.com or by phone at +91 74570 06625.',
          ],
        },
      ]}
      closing={CLOSING_NOTE}
    />
  )
}
