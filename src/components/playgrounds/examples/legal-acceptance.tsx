import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type LegalAcceptanceMode =
  | "termsCheckbox"
  | "embeddedTerms"
  | "termsLink"
  | "requiredValidation"
  | "acceptedRecord"
  | "declineRoute"
  | "updatedTerms"
  | "changeSummary"
  | "gracePeriod"
  | "accessBlocked"
  | "downloadCopy"
  | "languageVariant"
  | "auditRecord"
  | "failedRecord"
  | "mobile";

type LegalAcceptanceBadMode =
  | "impliedAcceptance"
  | "precheckedTerms"
  | "bundledConsent"
  | "hiddenTerms"
  | "disabledOnly"
  | "tinyScrollbox"
  | "noVersionRecord";

const legalAcceptanceGoodLabels: Array<[LegalAcceptanceMode, string]> = [
  ["termsCheckbox", "Terms checkbox"],
  ["embeddedTerms", "Embedded terms"],
  ["termsLink", "Terms link"],
  ["requiredValidation", "Required validation"],
  ["acceptedRecord", "Accepted record"],
  ["declineRoute", "Decline route"],
  ["updatedTerms", "Updated terms"],
  ["changeSummary", "Change summary"],
  ["gracePeriod", "Grace period"],
  ["accessBlocked", "Access blocked"],
  ["downloadCopy", "Download copy"],
  ["languageVariant", "Language variant"],
  ["auditRecord", "Audit record"],
  ["failedRecord", "Failed record write"],
  ["mobile", "Mobile compact legal gate"]
];

const legalAcceptanceBadLabels: Array<[LegalAcceptanceBadMode, string]> = [
  ["impliedAcceptance", "Implied acceptance"],
  ["precheckedTerms", "Prechecked terms"],
  ["bundledConsent", "Bundled consent"],
  ["hiddenTerms", "Hidden terms"],
  ["disabledOnly", "Disabled-only"],
  ["tinyScrollbox", "Tiny scrollbox"],
  ["noVersionRecord", "No version record"]
];

function LegalAcceptancePanel({ mode, idSuffix }: { mode: LegalAcceptanceMode; idSuffix: string }) {
  const config: Record<LegalAcceptanceMode, {
    chip: string;
    title: string;
    body: string;
    document: string;
    version: string;
    required: string;
    action: string;
    record: string;
    consequence: string;
    primary: string;
    secondary: string;
    tone?: "ready" | "warning" | "danger";
    compact?: boolean;
  }> = {
    termsCheckbox: {
      chip: "Legal acceptance",
      title: "Terms checkbox names the document",
      body: "The checkout agreement starts unchecked and names the conditions of sale before Place order can run.",
      document: "Conditions of sale",
      version: "v2026.06",
      required: "Required before order",
      action: "Check I agree",
      record: "Not accepted yet",
      consequence: "Cannot place order",
      primary: "Agree to terms",
      secondary: "Read terms"
    },
    embeddedTerms: {
      chip: "Embedded terms",
      title: "Embedded terms keep review in context",
      body: "The terms pane has headings, keyboard scrolling, expand, search, download, and close paths without losing checkout data.",
      document: "Service agreement",
      version: "Effective 2026-07-01",
      required: "Must review",
      action: "Expand terms",
      record: "Awaiting acceptance",
      consequence: "Checkout paused",
      primary: "Expand full terms",
      secondary: "Download PDF"
    },
    termsLink: {
      chip: "Terms link",
      title: "Terms link preserves task state",
      body: "The full legal document opens in a side panel or new tab while preserving form values and return focus.",
      document: "Terms of service",
      version: "Version 12",
      required: "Required",
      action: "Open linked terms",
      record: "Link available",
      consequence: "Return to same step",
      primary: "Open terms",
      secondary: "Copy link"
    },
    requiredValidation: {
      chip: "Required validation",
      title: "Missing acceptance validates at the checkbox",
      body: "Place order moves focus to the unchecked agreement and says the terms must be accepted before payment.",
      document: "Checkout terms",
      version: "v2026.06",
      required: "Missing",
      action: "Place order attempted",
      record: "No record",
      consequence: "Payment not submitted",
      primary: "Accept terms",
      secondary: "Keep reviewing",
      tone: "warning"
    },
    acceptedRecord: {
      chip: "Accepted record",
      title: "Accepted record shows version and timestamp",
      body: "After acceptance, the receipt records user, document, version, locale, surface, and timestamp.",
      document: "Conditions of sale",
      version: "v2026.06",
      required: "Satisfied",
      action: "Accepted",
      record: "2026-06-12 13:40 IST",
      consequence: "Order can proceed",
      primary: "Place order",
      secondary: "View record",
      tone: "ready"
    },
    declineRoute: {
      chip: "Decline route",
      title: "Decline route explains consequences",
      body: "Declining terms exits checkout, keeps the cart, and explains support or limited-mode options without recording acceptance.",
      document: "Sale terms",
      version: "v2026.06",
      required: "Declined",
      action: "Decline",
      record: "Decline recorded",
      consequence: "Order not placed",
      primary: "Return to cart",
      secondary: "Contact support",
      tone: "warning"
    },
    updatedTerms: {
      chip: "Updated terms",
      title: "Updated terms require reacceptance",
      body: "A returning user sees the prior acceptance, new effective date, and whether access pauses until reaccepted.",
      document: "Workspace terms of use",
      version: "v2026.07 replaces v2025.11",
      required: "Reaccept required",
      action: "Review update",
      record: "Previous version expired",
      consequence: "Admin access paused",
      primary: "Review new terms",
      secondary: "Compare versions",
      tone: "warning"
    },
    changeSummary: {
      chip: "Change summary",
      title: "Change summary makes updates scannable",
      body: "The update names billing, dispute, and acceptable-use changes before the user opens the full document.",
      document: "Service agreement",
      version: "Change summary",
      required: "Required soon",
      action: "Review changes",
      record: "Pending",
      consequence: "Grace period active",
      primary: "Open full terms",
      secondary: "Download redline"
    },
    gracePeriod: {
      chip: "Grace period",
      title: "Grace period states deadline and access",
      body: "The user can keep working until the deadline, sees the exact date, and can accept early from the banner.",
      document: "Terms of use",
      version: "v2026.07",
      required: "Due 2026-07-01",
      action: "Accept before deadline",
      record: "Pending reacceptance",
      consequence: "Access blocks after deadline",
      primary: "Accept now",
      secondary: "Remind me later"
    },
    accessBlocked: {
      chip: "Access blocked",
      title: "Blocked access names the missing agreement",
      body: "A sign-in gate blocks a cloud app until the user accepts the displayed policy document.",
      document: "Admin portal terms",
      version: "v2026.07",
      required: "Required now",
      action: "Accept to access",
      record: "Not current",
      consequence: "Cloud app blocked",
      primary: "Accept terms",
      secondary: "Decline",
      tone: "danger"
    },
    downloadCopy: {
      chip: "Download copy",
      title: "Users can retain a copy",
      body: "Download, print, and copy-link actions are available before and after acceptance.",
      document: "Connected account agreement",
      version: "v2026.06",
      required: "Available",
      action: "Download PDF",
      record: "Copy retained",
      consequence: "No task loss",
      primary: "Download copy",
      secondary: "Print"
    },
    languageVariant: {
      chip: "Language variant",
      title: "Language variant keeps the legal document identifiable",
      body: "The terms show the selected language, fallback language, and whether the translation is informational or controlling.",
      document: "Terms of service",
      version: "English controls; Spanish translation",
      required: "Language selected",
      action: "Switch language",
      record: "Locale es-MX",
      consequence: "Same version accepted",
      primary: "Switch language",
      secondary: "Open English"
    },
    auditRecord: {
      chip: "Audit record",
      title: "Audit record is inspectable",
      body: "Admins can report who accepted which document version on which device and surface.",
      document: "Terms of use",
      version: "v2026.07",
      required: "Reportable",
      action: "Acceptance report",
      record: "User, device, timestamp",
      consequence: "Compliance evidence",
      primary: "View report",
      secondary: "Export CSV",
      tone: "ready"
    },
    failedRecord: {
      chip: "Failed record write",
      title: "Failed record write does not grant access",
      body: "If the acceptance record cannot be saved, the UI keeps the document reviewed but does not claim acceptance.",
      document: "Workspace terms",
      version: "v2026.07",
      required: "Record failed",
      action: "Retry save",
      record: "Not saved",
      consequence: "Access still blocked",
      primary: "Retry recording",
      secondary: "Contact support",
      tone: "danger"
    },
    mobile: {
      chip: "Mobile compact legal gate",
      title: "Compact gate keeps terms and consequence visible",
      body: "The mobile sheet keeps document title, version, checkbox, full terms link, decline route, and validation in a readable stack.",
      document: "Mobile terms",
      version: "v2026.06",
      required: "Required",
      action: "Check agreement",
      record: "Pending",
      consequence: "Continue disabled until accepted",
      primary: "Accept terms",
      secondary: "Read full terms",
      compact: true
    }
  };
  const item = config[mode];
  const titleId = `legal-acceptance-title-${idSuffix}`;
  const descId = `legal-acceptance-desc-${idSuffix}`;

  return (
    <section className={`legal-acceptance-panel is-${mode} ${item.tone ? `is-${item.tone}` : ""} ${item.compact ? "is-compact" : ""}`} aria-labelledby={titleId} aria-describedby={descId}>
      <div className="legal-acceptance-panel-head">
        <div>
          <span>{item.chip}</span>
          <strong id={titleId}>{item.title}</strong>
        </div>
        <b>{item.required}</b>
      </div>
      <p id={descId}>{item.body}</p>
      <div className="legal-acceptance-evidence-grid" aria-label="Legal acceptance fields">
        <span><b>Document</b>{item.document}</span>
        <span><b>Version</b>{item.version}</span>
        <span><b>Required</b>{item.required}</span>
        <span><b>Action</b>{item.action}</span>
        <span><b>Record</b>{item.record}</span>
        <span><b>Consequence</b>{item.consequence}</span>
      </div>
      <div className="legal-acceptance-actions">
        <button type="button" className="demo-button small primary">{item.primary}</button>
        <button type="button" className="demo-button small">{item.secondary}</button>
        <button type="button" className="demo-button small">Audit details</button>
      </div>
    </section>
  );
}

function LegalAcceptanceGoodUi() {
  return (
    <div className="quality-example legal-acceptance-demo">
      <LegalAcceptancePanel mode="termsCheckbox" idSuffix="good-ui" />
      <p className="demo-status">Legal acceptance UI names the document, version, requirement, action, record, and consequence before commitment.</p>
    </div>
  );
}

function LegalAcceptanceBadUi() {
  return (
    <div className="bad-ui-sample legal-acceptance-bad-demo is-impliedAcceptance">
      <div className="legal-acceptance-broken" aria-label="Broken legal acceptance">
        <strong>Continue</strong>
        <p>Payment says users agree by continuing, but the terms link is hidden below the order summary and no acceptance record is created.</p>
        <div className="legal-acceptance-broken-grid">
          <span>Implied only</span>
          <span>Terms hidden</span>
          <span>No record</span>
        </div>
        <button type="button" className="demo-button small danger">Pay now</button>
      </div>
      <p className="demo-status">The broken UI treats payment as legal acceptance without a clear agreement action.</p>
    </div>
  );
}

function LegalAcceptanceGoodUx() {
  const [mode, setMode] = useState<LegalAcceptanceMode>("termsCheckbox");
  return (
    <div className="quality-example legal-acceptance-demo">
      <div className="legal-acceptance-controls" aria-label="Legal acceptance exercise controls">
        {legalAcceptanceGoodLabels.map(([key, label]) => (
          <button
            type="button"
            key={key}
            className={mode === key ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <LegalAcceptancePanel mode={mode} idSuffix="good-ux" />
      <p className="demo-status" aria-live="polite">Legal acceptance state: {legalAcceptanceGoodLabels.find(([key]) => key === mode)?.[1]}.</p>
    </div>
  );
}

function LegalAcceptanceBadUx() {
  const [mode, setMode] = useState<LegalAcceptanceBadMode>("impliedAcceptance");
  const copy: Record<LegalAcceptanceBadMode, {
    title: string;
    body: string;
    fieldA: string;
    fieldB: string;
    fieldC: string;
    outcome: string;
  }> = {
    impliedAcceptance: {
      title: "Implied acceptance",
      body: "The product claims the user accepted terms because they browsed, signed in, or paid, but no explicit agreement action occurred.",
      fieldA: "Continued use",
      fieldB: "No checkbox",
      fieldC: "No event",
      outcome: "The acceptance evidence is weak and surprising."
    },
    precheckedTerms: {
      title: "Prechecked terms",
      body: "The terms checkbox starts checked and the user can complete checkout without noticing the agreement.",
      fieldA: "Checked by default",
      fieldB: "No review",
      fieldC: "Pay enabled",
      outcome: "The UI records agreement without clear user action."
    },
    bundledConsent: {
      title: "Bundled consent",
      body: "The legal checkbox also opts the user into marketing, analytics, AI training, and partner sharing.",
      fieldA: "Terms",
      fieldB: "Marketing",
      fieldC: "Tracking",
      outcome: "Legal acceptance is confused with optional consent."
    },
    hiddenTerms: {
      title: "Hidden terms",
      body: "The required terms link appears after the commit button and opens a page that loses checkout state.",
      fieldA: "Footer link",
      fieldB: "Late disclosure",
      fieldC: "State lost",
      outcome: "Users cannot review terms before commitment."
    },
    disabledOnly: {
      title: "Disabled-only",
      body: "Continue is disabled until terms are accepted, but no error or requirement explains what is missing.",
      fieldA: "Disabled button",
      fieldB: "No message",
      fieldC: "No focus",
      outcome: "Keyboard and screen-reader users cannot recover."
    },
    tinyScrollbox: {
      title: "Tiny scrollbox",
      body: "The full agreement is trapped in a small scroll area with no headings, download, print, search, or language option.",
      fieldA: "Tiny pane",
      fieldB: "No download",
      fieldC: "No search",
      outcome: "The terms are technically present but not realistically reviewable."
    },
    noVersionRecord: {
      title: "No version record",
      body: "The system stores accepted true without document title, version, locale, user, timestamp, or source surface.",
      fieldA: "Boolean only",
      fieldB: "No version",
      fieldC: "No timestamp",
      outcome: "Later audits cannot prove what was accepted."
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example legal-acceptance-bad-demo is-${mode}`}>
      <div className="legal-acceptance-controls" aria-label="Legal acceptance misuse controls">
        {legalAcceptanceBadLabels.map(([key, label]) => (
          <button
            type="button"
            key={key}
            className={mode === key ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="legal-acceptance-broken" aria-label={`Broken state: ${item.title}`}>
        <strong>{item.title}</strong>
        <p>{item.body}</p>
        <div className="legal-acceptance-broken-grid">
          <span>{item.fieldA}</span>
          <span>{item.fieldB}</span>
          <span>{item.fieldC}</span>
        </div>
        <button type="button" className="demo-button small danger">{mode === "noVersionRecord" ? "Store true" : "Continue"}</button>
      </div>
      <p className="demo-status" aria-live="polite">{item.outcome}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <LegalAcceptanceGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <LegalAcceptanceBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <LegalAcceptanceGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <LegalAcceptanceBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
