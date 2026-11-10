# AV Pre-VDC marketing source review

Marketing name: the product is now presented as **AV Synthesis**. This review keeps the source application's own name because the inspected project was never modified or renamed.

Verified 2026-10-06 against read-only AV Pre-VDC snapshot, project 2ffd9259-7321-4a62-8103-ba34a97f1014, commit 22df9bf0. No application files changed.

## Confirmed sources
- Requirements: src/components/requirements-register.tsx; src/lib/information.functions.ts.
- Findings/consolidated conditions: src/components/issue-findings.tsx; src/lib/review-categories.ts.
- Human-reviewed assumptions: src/components/assumptions-register.tsx.
- RFI drafts/review: src/components/rfi-register.tsx; src/lib/rfi.functions.ts.
- Responsibility, assignment, impact: src/components/responsibility.tsx; src/components/accountability.tsx; src/lib/responsibility-model.ts. Do not market as a canonical RACI chart.
- Affected activities/Upcoming Work: src/components/schedule-links.tsx; src/lib/schedule-parse.ts. No CPM or delay predictions.
- Readiness categories: src/components/readiness.tsx; src/lib/readiness.ts. No numerical readiness score.
- Trade Intelligence/reporting: V3.0–V3.2 implementation records and scope classification.
- Revision history/notes/changelog: src/components/revision-history.tsx; src/components/revision-notes.tsx; src/lib/changelog.ts.
- Regulatory review: V4.2 implementation records and docs/v4.2a-*.md. Potential conflict / verification required, not code violation or compliance certification.
- Search AV: src/components/search-av.tsx; src/lib/search.functions.ts. Project scoped, read-only, evidence cited.
- Evidence/human review: src/components/analysis-notice.tsx; src/lib/legal/drafts.ts. AV interpretation is distinct from source evidence and human override wins.

## Review gaps / release gates
- No genuine UI screenshots are committed in the inspected app. The provided AV Pre-VDC brand image is used, not a fabricated UI. Approved product screenshots should be supplied or captured in an authorized live walkthrough.
- Production URL and customer-ready billing are not confirmed. No Start/Sign In/checkout destination is exposed. Set the centralized application URL only after production access is verified.
- Final monthly allowances, add-on prices and storage terms are not supplied. Capacity principles are user-defined commercial policy, not a claim that billing is implemented.
- ISO 19650 / IDS carry manual-acceptance caveats; no full support claim is marketed.
- No external construction-platform integrations, model validation or automatic code-compliance claims.
- Existing AV spatial software is labeled In Development; confirm individual release status before changing it. AV Scan was named by the user but has no existing standalone product content in this marketing checkout; preserved by name without invented capabilities.
- Client route metadata and sitemap are implemented. Fully server-rendered route text for non-JavaScript crawlers is not provided by the existing SPA architecture.