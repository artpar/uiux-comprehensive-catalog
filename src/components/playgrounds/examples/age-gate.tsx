import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type AgeGateMode =
  | "prompt"
  | "neutralEntry"
  | "ageBand"
  | "adultAllowed"
  | "underageAdapted"
  | "parentConsent"
  | "ageAssurance"
  | "dataMinimization"
  | "regionThreshold"
  | "retryCorrection"
  | "knownAge"
  | "appeal"
  | "expiredSession"
  | "verificationUnavailable"
  | "mobile";

type AgeGateBadMode =
  | "adultDefault"
  | "contentLeak"
  | "overcollection"
  | "noParentRoute"
  | "unlimitedRetry"
  | "bundledConsent"
  | "providerConfusion";

const ageGateGoodLabels: Array<[AgeGateMode, string]> = [
  ["prompt", "Age prompt"],
  ["neutralEntry", "Neutral age entry"],
  ["ageBand", "Age band selection"],
  ["adultAllowed", "Adult allowed"],
  ["underageAdapted", "Underage adapted"],
  ["parentConsent", "Parent consent required"],
  ["ageAssurance", "Age assurance handoff"],
  ["dataMinimization", "Data minimization"],
  ["regionThreshold", "Region threshold"],
  ["retryCorrection", "Retry correction"],
  ["knownAge", "Known account age"],
  ["appeal", "Appeal route"],
  ["expiredSession", "Expired session"],
  ["verificationUnavailable", "Verification unavailable"],
  ["mobile", "Mobile compact age gate"]
];

const ageGateBadLabels: Array<[AgeGateBadMode, string]> = [
  ["adultDefault", "Adult default"],
  ["contentLeak", "Content leak"],
  ["overcollection", "Overcollection"],
  ["noParentRoute", "No parent route"],
  ["unlimitedRetry", "Unlimited retry"],
  ["bundledConsent", "Bundled consent"],
  ["providerConfusion", "Provider confusion"]
];

function AgeGatePanel({ mode, idSuffix }: { mode: AgeGateMode; idSuffix: string }) {
  const config: Record<AgeGateMode, {
    chip: string;
    title: string;
    body: string;
    evidence: string;
    threshold: string;
    collection: string;
    result: string;
    recovery: string;
    privacy: string;
    primary: string;
    secondary: string;
    tone?: "ready" | "warning" | "danger";
    compact?: boolean;
  }> = {
    prompt: {
      chip: "Age gate",
      title: "Age prompt explains the threshold",
      body: "The gate appears before age-sensitive access and says why age is needed for this feature.",
      evidence: "Date of birth",
      threshold: "18+ in this region",
      collection: "Birth date only",
      result: "Eligibility unknown",
      recovery: "Cancel or learn why",
      privacy: "Used for age check",
      primary: "Continue",
      secondary: "Why we ask"
    },
    neutralEntry: {
      chip: "Neutral age entry",
      title: "Neutral entry avoids adult-default bias",
      body: "Day, month, and year fields are blank, labels are persistent, and neither adult nor child route is preselected.",
      evidence: "DOB fields",
      threshold: "No default answer",
      collection: "Only required fields",
      result: "Ready to check",
      recovery: "Clear or cancel",
      privacy: "No preview shown",
      primary: "Check age",
      secondary: "Cancel"
    },
    ageBand: {
      chip: "Age band selection",
      title: "Age band is enough for low-risk adaptation",
      body: "A child-safe personalization flow asks for an age band rather than exact birth date or identity evidence.",
      evidence: "Under 13, 13-15, 16-17, 18+",
      threshold: "Band-based defaults",
      collection: "Coarse age band",
      result: "Defaults adapted",
      recovery: "Change band with support",
      privacy: "No exact birth date",
      primary: "Save age band",
      secondary: "Use child-safe defaults",
      tone: "ready"
    },
    adultAllowed: {
      chip: "Adult allowed",
      title: "Allowed state opens the right surface",
      body: "The result confirms eligibility, keeps the adult rating visible, and moves focus to the unlocked content heading.",
      evidence: "Birth date checked",
      threshold: "18+ met",
      collection: "Eligibility flag",
      result: "Access allowed",
      recovery: "Manage account age",
      privacy: "Session remembered",
      primary: "Open content",
      secondary: "Review setting",
      tone: "ready"
    },
    underageAdapted: {
      chip: "Underage adapted",
      title: "Underage result blocks without leaking content",
      body: "Restricted previews are withheld, a child-safe version is offered, and the threshold is explained without encouraging guessing.",
      evidence: "Declared under threshold",
      threshold: "18+ required",
      collection: "Eligibility only",
      result: "Restricted content blocked",
      recovery: "Child-safe route",
      privacy: "No mature preview",
      primary: "Open child-safe version",
      secondary: "Ask parent",
      tone: "warning"
    },
    parentConsent: {
      chip: "Parent consent required",
      title: "Parent route is separate from marketing consent",
      body: "The child can continue only through a parent or guardian authorization route that names the child-data purpose.",
      evidence: "Parent email",
      threshold: "Under 13",
      collection: "Parent contact",
      result: "Consent pending",
      recovery: "Resend or edit parent",
      privacy: "No marketing bundle",
      primary: "Send parent request",
      secondary: "Use offline option",
      tone: "warning"
    },
    ageAssurance: {
      chip: "Age assurance handoff",
      title: "Age assurance handoff names provider and data",
      body: "A higher-risk feature sends users to a verification provider and explains what returns to the product.",
      evidence: "Provider check",
      threshold: "Verified 18+",
      collection: "Provider handles evidence",
      result: "Pending verification",
      recovery: "Cancel or choose another method",
      privacy: "Return eligibility only",
      primary: "Verify with provider",
      secondary: "Use another method",
      tone: "warning"
    },
    dataMinimization: {
      chip: "Data minimization",
      title: "Data minimization copy matches the risk",
      body: "The gate says exact birth date is not stored when only the age-band outcome is needed.",
      evidence: "Age band",
      threshold: "Child-safe defaults",
      collection: "Minimum evidence",
      result: "Age band saved",
      recovery: "Privacy settings",
      privacy: "Birth date discarded",
      primary: "Use selected band",
      secondary: "Read privacy note",
      tone: "ready"
    },
    regionThreshold: {
      chip: "Region threshold",
      title: "Region threshold is visible",
      body: "The same feature shows the local threshold and explains why eligibility may differ by country or region.",
      evidence: "Country + age",
      threshold: "16+ or 18+ by region",
      collection: "Region and age band",
      result: "Threshold applied",
      recovery: "Change region source",
      privacy: "No location tracking",
      primary: "Continue with region",
      secondary: "Review threshold"
    },
    retryCorrection: {
      chip: "Retry correction",
      title: "Correction is honest, not guessable",
      body: "A mistyped birth date can be corrected through support, but repeated instant retries are limited.",
      evidence: "Submitted DOB",
      threshold: "18+ required",
      collection: "Submitted value",
      result: "Correction needed",
      recovery: "Request correction",
      privacy: "Attempt limit shown",
      primary: "Request correction",
      secondary: "Use child-safe route",
      tone: "warning"
    },
    knownAge: {
      chip: "Known account age",
      title: "Known account age avoids repeated prompts",
      body: "A signed-in account with a verified age flag bypasses repeated prompts while keeping the source visible.",
      evidence: "Account age flag",
      threshold: "Verified 18+",
      collection: "Existing account data",
      result: "Gate satisfied",
      recovery: "Manage account",
      privacy: "No new collection",
      primary: "Continue",
      secondary: "View account age",
      tone: "ready"
    },
    appeal: {
      chip: "Appeal route",
      title: "Appeal route handles disputed results",
      body: "A denied user can ask for review without seeing restricted content or being told to try another birth date.",
      evidence: "Eligibility decision",
      threshold: "Denied",
      collection: "Support case only",
      result: "Review available",
      recovery: "Appeal decision",
      privacy: "Case data listed",
      primary: "Appeal decision",
      secondary: "Use safe mode"
    },
    expiredSession: {
      chip: "Expired session",
      title: "Expired session refreshes the gate",
      body: "After a risk or policy change, the age gate asks again and explains why the prior session is no longer enough.",
      evidence: "Prior eligibility",
      threshold: "Refresh required",
      collection: "Recheck only",
      result: "Session expired",
      recovery: "Recheck age",
      privacy: "Previous data retained per policy",
      primary: "Recheck",
      secondary: "Cancel",
      tone: "warning"
    },
    verificationUnavailable: {
      chip: "Verification unavailable",
      title: "Provider outage is not treated as underage",
      body: "When verification is unavailable, the UI preserves the task, offers another method, and avoids labeling the user underage.",
      evidence: "Provider unavailable",
      threshold: "Unknown",
      collection: "No new evidence",
      result: "Cannot verify now",
      recovery: "Try another method",
      privacy: "No failed-age claim",
      primary: "Choose another method",
      secondary: "Try later",
      tone: "danger"
    },
    mobile: {
      chip: "Mobile compact age gate",
      title: "Mobile gate keeps reason, threshold, and route visible",
      body: "The compact sheet keeps the reason, age entry, parent route, privacy note, and denial state in a readable stack.",
      evidence: "DOB or band",
      threshold: "18+",
      collection: "Minimum needed",
      result: "Ready",
      recovery: "Parent or correction",
      privacy: "Short notice + link",
      primary: "Check age",
      secondary: "Parent route",
      compact: true
    }
  };
  const item = config[mode];
  const titleId = `age-gate-title-${idSuffix}`;
  const descId = `age-gate-desc-${idSuffix}`;

  return (
    <section className={`age-gate-panel is-${mode} ${item.tone ? `is-${item.tone}` : ""} ${item.compact ? "is-compact" : ""}`} aria-labelledby={titleId} aria-describedby={descId}>
      <div className="age-gate-panel-head">
        <div>
          <span>{item.chip}</span>
          <strong id={titleId}>{item.title}</strong>
        </div>
        <b>{item.result}</b>
      </div>
      <p id={descId}>{item.body}</p>
      <div className="age-gate-evidence-grid" aria-label="Age gate fields">
        <span><b>Evidence</b>{item.evidence}</span>
        <span><b>Threshold</b>{item.threshold}</span>
        <span><b>Collection</b>{item.collection}</span>
        <span><b>Result</b>{item.result}</span>
        <span><b>Recovery</b>{item.recovery}</span>
        <span><b>Privacy</b>{item.privacy}</span>
      </div>
      <div className="age-gate-actions">
        <button type="button" className="demo-button small primary">{item.primary}</button>
        <button type="button" className="demo-button small">{item.secondary}</button>
        <button type="button" className="demo-button small">Privacy details</button>
      </div>
    </section>
  );
}

function AgeGateGoodUi() {
  return (
    <div className="quality-example age-gate-demo">
      <AgeGatePanel mode="neutralEntry" idSuffix="good-ui" />
      <p className="demo-status">Age gate UI shows reason, threshold, evidence, result, recovery, and privacy treatment before age-sensitive access.</p>
    </div>
  );
}

function AgeGateBadUi() {
  return (
    <div className="bad-ui-sample age-gate-bad-demo is-adultDefault">
      <div className="age-gate-broken" aria-label="Broken age gate">
        <strong>Are you 18?</strong>
        <p>The Yes path is highlighted, mature previews are visible behind the dialog, and the gate never explains why age is needed.</p>
        <div className="age-gate-broken-grid">
          <span>Yes preselected</span>
          <span>No threshold</span>
          <span>Preview visible</span>
        </div>
        <button type="button" className="demo-button small danger">Yes, enter</button>
      </div>
      <p className="demo-status">The broken UI nudges the adult answer and leaks age-restricted content before eligibility is known.</p>
    </div>
  );
}

function AgeGateGoodUx() {
  const [mode, setMode] = useState<AgeGateMode>("prompt");
  return (
    <div className="quality-example age-gate-demo">
      <div className="age-gate-controls" aria-label="Age gate exercise controls">
        {ageGateGoodLabels.map(([key, label]) => (
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
      <AgeGatePanel mode={mode} idSuffix="good-ux" />
      <p className="demo-status" aria-live="polite">Age gate state: {ageGateGoodLabels.find(([key]) => key === mode)?.[1]}.</p>
    </div>
  );
}

function AgeGateBadUx() {
  const [mode, setMode] = useState<AgeGateBadMode>("adultDefault");
  const copy: Record<AgeGateBadMode, {
    title: string;
    body: string;
    fieldA: string;
    fieldB: string;
    fieldC: string;
    outcome: string;
  }> = {
    adultDefault: {
      title: "Adult default",
      body: "The adult path is preselected and visually promoted, so the UI trains users to pick the answer that unlocks access.",
      fieldA: "Yes highlighted",
      fieldB: "No reason",
      fieldC: "No neutral path",
      outcome: "The age answer is biased and unreliable."
    },
    contentLeak: {
      title: "Content leak",
      body: "Mature thumbnails, search snippets, and recommendations appear behind the gate before eligibility is known.",
      fieldA: "Preview visible",
      fieldB: "Snippet exposed",
      fieldC: "Gate too late",
      outcome: "The protected content is already disclosed."
    },
    overcollection: {
      title: "Overcollection",
      body: "A low-risk age-band decision demands an ID scan, face image, full birth date, and parent phone number.",
      fieldA: "ID scan",
      fieldB: "Face image",
      fieldC: "No deletion note",
      outcome: "The gate creates more privacy risk than the feature requires."
    },
    noParentRoute: {
      title: "No parent route",
      body: "An under-13 user is blocked with Try again later, but no parent, guardian, child-safe, correction, or appeal route exists.",
      fieldA: "Denied",
      fieldB: "No parent",
      fieldC: "No safe mode",
      outcome: "The flow becomes a dead end or encourages lying."
    },
    unlimitedRetry: {
      title: "Unlimited retry",
      body: "Every failed birth date returns immediately to the empty fields with no correction policy or attempt limit.",
      fieldA: "Retry now",
      fieldB: "No limit",
      fieldC: "Guessable",
      outcome: "Users can brute-force a passing birth year."
    },
    bundledConsent: {
      title: "Bundled consent",
      body: "Parent authorization also accepts cookies, personalized ads, newsletters, and terms in one unchecked explanation.",
      fieldA: "Parent consent",
      fieldB: "Ads",
      fieldC: "Cookies",
      outcome: "Age authorization is confused with unrelated consent."
    },
    providerConfusion: {
      title: "Provider confusion",
      body: "A verification provider outage is shown as You are underage, with no alternate method or pending state.",
      fieldA: "Provider down",
      fieldB: "Underage label",
      fieldC: "No fallback",
      outcome: "A technical failure becomes a false eligibility decision."
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example age-gate-bad-demo is-${mode}`}>
      <div className="age-gate-controls" aria-label="Age gate misuse controls">
        {ageGateBadLabels.map(([key, label]) => (
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
      <div className="age-gate-broken" aria-label={`Broken state: ${item.title}`}>
        <strong>{item.title}</strong>
        <p>{item.body}</p>
        <div className="age-gate-broken-grid">
          <span>{item.fieldA}</span>
          <span>{item.fieldB}</span>
          <span>{item.fieldC}</span>
        </div>
        <button type="button" className="demo-button small danger">{mode === "contentLeak" ? "View preview" : "Continue"}</button>
      </div>
      <p className="demo-status" aria-live="polite">{item.outcome}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AgeGateGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AgeGateBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AgeGateGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AgeGateBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
