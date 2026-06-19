import LegalLayout, { CLOSING_NOTE } from './LegalLayout'

export default function Terms() {
  return (
    <LegalLayout
      title="Terms of Service"
      lastUpdated="12 June 2026"
      intro={
        'These Terms of Service ("Terms") govern your access to and use of WE EHS (the "Service"). By creating an account or using the Service you agree to these Terms. If you use the Service on behalf of an organization, you represent that you are authorized to bind that organization.'
      }
      sections={[
        {
          heading: 'Accounts and organizations',
          bullets: [
            'The first user to register an organization becomes its administrator. Administrators approve members, manage sites and control access.',
            'You are responsible for the accuracy of your account information and for keeping your credentials confidential.',
            'You are responsible for all activity that occurs under your account.',
          ],
        },
        {
          heading: 'Acceptable use',
          bullets: [
            'Do not misuse the Service, attempt to gain unauthorized access, probe or breach security, or disrupt other users.',
            'Do not upload unlawful, infringing or malicious content, or evidence files containing data you are not entitled to share.',
            'Do not use the Service to violate any applicable law or regulation.',
          ],
        },
        {
          heading: 'Customer data and ownership',
          bullets: [
            'As between the parties, your organization owns the audit content it submits. You grant us a limited license to host and process it solely to provide the Service.',
            'We own the Service software, design and underlying technology. No rights are granted except as expressly set out here.',
          ],
        },
        {
          heading: 'Availability',
          paragraphs: [
            'We aim to keep the Service available but provide it on an "as is" and "as available" basis without warranty of uninterrupted operation. We may modify, suspend or discontinue features with reasonable notice.',
          ],
        },
        {
          heading: 'Disclaimers',
          paragraphs: [
            'The Service supports your audit and compliance activities but does not constitute legal, safety or regulatory advice. You remain responsible for your compliance obligations and for verifying audit outcomes.',
          ],
        },
        {
          heading: 'Limitation of liability',
          paragraphs: [
            'To the maximum extent permitted by law, we are not liable for indirect, incidental, special or consequential damages, or for loss of data, profits or goodwill. Our aggregate liability is limited to the amounts paid for the Service in the 12 months preceding the claim (or, for a free tier, USD 100).',
          ],
        },
        {
          heading: 'Termination',
          paragraphs: [
            'You may stop using the Service at any time. We may suspend or terminate access for breach of these Terms. Upon termination, your right to use the Service ceases; data handling follows our Data & Security page.',
          ],
        },
        {
          heading: 'Governing law',
          paragraphs: [
            'These Terms are governed by the laws of India, without regard to conflict-of-laws rules. Courts located there have exclusive jurisdiction, subject to any mandatory consumer protections.',
          ],
        },
        {
          heading: 'Changes',
          paragraphs: [
            'We may update these Terms; material changes will be notified in-app or by email. Continued use after changes constitutes acceptance.',
          ],
        },
        {
          heading: 'Contact',
          paragraphs: [
            'Questions about these Terms can be sent to sarath200795@gmail.com or by phone at +91 74570 06625.',
          ],
        },
      ]}
      closing={CLOSING_NOTE}
    />
  )
}
