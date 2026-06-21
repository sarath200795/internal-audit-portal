export const config = {
  "title": "Internal Audit Portal",
  "tagline": "ISO 45001 audit management — plan audits, log findings, and close CAPA on a live compliance dashboard.",
  "org": "Northwind Industrial",
  "port": 5173,
  "walkthrough": [
    {
      "route": "/",
      "title": "Compliance dashboard",
      "sub": "Open findings, overdue CAPAs, audit progress and closure rate — live."
    },
    {
      "route": "/sites",
      "title": "Sites",
      "sub": "Manage the facilities your audits are scheduled against."
    },
    {
      "route": "/findings",
      "title": "Findings register",
      "sub": "All findings by type (Major/Minor NC, OFI, Observation), filterable and searchable."
    },
    {
      "route": "/capa",
      "title": "CAPA board",
      "sub": "A Kanban board: Open → In Progress → Verified → Closed; closing a CAPA closes its finding."
    },
    {
      "route": "/admin",
      "title": "Admin",
      "sub": "Approve teammates and manage member roles and org settings."
    }
  ],
  "closing": {
    "route": "/",
    "title": "Internal Audit — plan, find, close, prove.",
    "sub": "Start by registering your organization."
  }
}
