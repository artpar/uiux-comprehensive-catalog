import { useState } from "react";
import { QualityPanel, type PatternMeta } from './shared';

type DarkConsentMode =
  | "acceptDominant"
  | "hiddenReject"
  | "preselectedPurpose"
  | "bundledPurposes"
  | "consentWall"
  | "processingBeforeChoice"
  | "repeatedNag"
  | "hardWithdrawal"
  | "equalChoice"
  | "granularChoice"
  | "withdrawalFixed"
  | "mobileCompact";

const darkConsentControls: Array<{ mode: DarkConsentMode; label: string }> = [
  { mode: "acceptDominant", label: "Accept-dominant" },
  { mode: "hiddenReject", label: "Hidden reject" },
  { mode: "preselectedPurpose", label: "Preselected purpose" },
  { mode: "bundledPurposes", label: "Bundled purposes" },
  { mode: "consentWall", label: "Consent wall" },
  { mode: "processingBeforeChoice", label: "Processing before choice" },
  { mode: "repeatedNag", label: "Repeated nag" },
  { mode: "hardWithdrawal", label: "Hard withdrawal" },
  { mode: "equalChoice", label: "Equal-choice correction" },
  { mode: "granularChoice", label: "Granular correction" },
  { mode: "withdrawalFixed", label: "Withdrawal correction" },
  { mode: "mobileCompact", label: "Mobile compact" }
];

const darkConsentCopy: Record<DarkConsentMode, {
  title: string;
  status: string;
  summary: string;
  runtime: string;
  record: string;
  risk: string;
}> = {
  acceptDominant: {
    title: "Accept all is promoted",
    status: "Accept-dominant",
    summary: "Accept all is large and first while refusal is visually weaker, so the interface steers the decision.",
    runtime: "Optional tags wait for a choice only in the corrected design.",
    record: "Consent prompt and cookie banner evidence cannot prove fair refusal.",
    risk: "Accept takes one click; reject is de-emphasized."
  },
  hiddenReject: {
    title: "Reject is buried",
    status: "Hidden reject",
    summary: "Reject all appears only after opening another layer or a policy link while accept stays visible.",
    runtime: "Cookie consent should not start until the first layer offers a real reject route.",
    record: "The stored accept claim omits the hidden refusal path.",
    risk: "Reject is outside the same decision level."
  },
  preselectedPurpose: {
    title: "Optional purposes are already on",
    status: "Preselected purpose",
    summary: "Marketing, analytics, partner sharing, or AI training starts selected before the user acts.",
    runtime: "Optional purposes must stay off until selected.",
    record: "A preference center later cannot repair a biased first choice.",
    risk: "Default state pushes acceptance."
  },
  bundledPurposes: {
    title: "Separate purposes are bundled",
    status: "Bundled purposes",
    summary: "Legal acceptance, marketing, research contact, personalization, and partner sharing are collapsed into one agree action.",
    runtime: "Required terms stay separate from optional consent.",
    record: "Purpose-level consent evidence is missing.",
    risk: "Users cannot choose one purpose without another."
  },
  consentWall: {
    title: "Service access is punished after refusal",
    status: "Consent wall",
    summary: "The product blocks eligible content or progress unless optional tracking or sharing is accepted.",
    runtime: "Refusal should preserve eligible service access.",
    record: "The record reflects pressure, not freely given consent.",
    risk: "Core work is withheld for optional processing."
  },
  processingBeforeChoice: {
    title: "Processing starts before choice",
    status: "Processing before choice",
    summary: "Advertising tags, partner pixels, or AI training begin before the user accepts the matching purpose.",
    runtime: "Runtime gates must block optional processing until consent exists.",
    record: "The evidence record conflicts with actual processing order.",
    risk: "Runtime behavior contradicts the consent surface."
  },
  repeatedNag: {
    title: "Refusal triggers repeated prompts",
    status: "Repeated nag",
    summary: "A declined choice returns on every route until the user accepts.",
    runtime: "Rejected state should be honored until renewal or material change.",
    record: "Repeated prompting turns refusal into a temporary obstacle.",
    risk: "Nagging pressures users after a valid refusal."
  },
  hardWithdrawal: {
    title: "Withdrawal is harder than accepting",
    status: "Hard withdrawal",
    summary: "Users can accept in one click but must search policy pages or contact support to withdraw.",
    runtime: "Withdrawal should stop future processing through the same runtime control.",
    record: "The old consent remains active after the user tries to revoke it.",
    risk: "Revocation effort is materially higher than acceptance."
  },
  equalChoice: {
    title: "Equal-choice correction",
    status: "Equal-choice correction",
    summary: "Accept all, Reject all, and Manage choices are shown with comparable weight and effort.",
    runtime: "Optional cookies and data uses remain blocked until a matching choice exists.",
    record: "Consent prompt, cookie banner, and cookie consent records include refusal as first-class evidence.",
    risk: "Manipulation flags cleared for first-layer choice parity."
  },
  granularChoice: {
    title: "Granular correction",
    status: "Granular correction",
    summary: "Analytics, personalization, marketing, research, AI training, and partner sharing are separate off-by-default purposes.",
    runtime: "Only selected purposes run, and each maps to a named record.",
    record: "Preference center and privacy settings reuse the same purpose labels.",
    risk: "Bundling and preselection flags cleared."
  },
  withdrawalFixed: {
    title: "Withdrawal correction",
    status: "Withdrawal correction",
    summary: "A stable privacy settings route lets users withdraw using the same purpose names used at acceptance.",
    runtime: "Future tags, sharing, marketing, and training stop after withdrawal.",
    record: "The record captures withdrawn purpose, timestamp, surface, and enforcement result.",
    risk: "Hard-withdrawal flag cleared."
  },
  mobileCompact: {
    title: "Mobile compact correction",
    status: "Mobile compact",
    summary: "Reject, manage, purpose details, and withdrawal remain visible and wrapped in a compact viewport.",
    runtime: "No mobile-only burying of reject or manage choices.",
    record: "Mobile evidence uses the same purpose and refusal events as desktop.",
    risk: "Responsive layout preserves consent fairness."
  }
};

function DarkPatternConsentPanel({ mode, variant, meta }: { mode: DarkConsentMode; variant: "good" | "bad"; meta?: PatternMeta }) {
  const copy = darkConsentCopy[mode];
  const corrected = mode === "equalChoice" || mode === "granularChoice" || mode === "withdrawalFixed" || mode === "mobileCompact";
  const isBad = variant === "bad" || !corrected;

  return (
    <div className={`dark-consent-demo ${isBad ? "is-risk" : "is-corrected"} is-${mode}`}>
      <div className="dark-consent-shell">
        <div className="dark-consent-top">
          <strong>{meta?.subject ?? "Privacy consent surface"}</strong>
          <span>{copy.status}</span>
        </div>
        <section className={`dark-consent-card ${isBad ? "bad" : "good"}`} aria-label={`${copy.status} consent audit`}>
          <div className="dark-consent-heading">
            <span>{isBad ? "Consent fairness audit" : "Corrected consent flow"}</span>
            <strong>{copy.title}</strong>
            <p>{copy.summary}</p>
          </div>

          {mode === "preselectedPurpose" || mode === "granularChoice" ? (
            <div className={`dark-consent-purpose-list ${mode === "preselectedPurpose" ? "bad" : ""}`}>
              <label><input type="checkbox" checked={mode === "preselectedPurpose"} readOnly /> Analytics <span>{mode === "preselectedPurpose" ? "Already selected" : "Off until selected"}</span></label>
              <label><input type="checkbox" checked={false} readOnly /> Marketing <span>Optional and separate</span></label>
              <label><input type="checkbox" checked={mode === "preselectedPurpose"} readOnly /> Partner sharing <span>{mode === "preselectedPurpose" ? "Already selected" : "Blocked by default"}</span></label>
              <label><input type="checkbox" checked={false} readOnly /> AI training <span>Independent purpose</span></label>
            </div>
          ) : mode === "bundledPurposes" ? (
            <div className="dark-consent-bundle">
              <strong>Agree to terms, updates, analytics, research, AI training, personalization, and partner sharing</strong>
              <span>Legal acceptance is mixed with optional consent, so separate purposes cannot be proven.</span>
            </div>
          ) : null}

          <div className="dark-consent-actions">
            {isBad ? (
              <>
                <button type="button" className="demo-button small primary">Accept all</button>
                {mode === "hiddenReject" ? <a href="#privacy-options">Other options</a> : null}
                {mode === "acceptDominant" || mode === "consentWall" ? <button type="button" className="demo-button small muted">Manage</button> : null}
                {mode !== "hiddenReject" && mode !== "consentWall" ? <button type="button" className="demo-button small muted">Reject all</button> : null}
              </>
            ) : (
              <>
                <button type="button" className="demo-button small primary">Accept all</button>
                <button type="button" className="demo-button small">Reject all</button>
                <button type="button" className="demo-button small">Manage choices</button>
                {mode === "withdrawalFixed" ? <button type="button" className="demo-button small">Withdraw purpose</button> : null}
              </>
            )}
          </div>
        </section>
        <div className="dark-consent-evidence-grid">
          <div>
            <span>Runtime</span>
            <strong>{copy.runtime}</strong>
          </div>
          <div>
            <span>Evidence</span>
            <strong>{copy.record}</strong>
          </div>
          <div>
            <span>Boundary</span>
            <strong>Consent prompt, Cookie consent, Cookie banner, Legal acceptance, Preference center, Privacy settings</strong>
          </div>
          <div>
            <span>Finding</span>
            <strong>{copy.risk}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function DarkPatternConsentGoodUi() {
  return <DarkPatternConsentPanel mode="equalChoice" variant="good" />;
}

function DarkPatternConsentBadUi() {
  return <DarkPatternConsentPanel mode="acceptDominant" variant="bad" />;
}

function DarkPatternConsentGoodUx({ meta }: { meta: PatternMeta }) {
  const [mode, setMode] = useState<DarkConsentMode>("acceptDominant");

  return (
    <div className={`quality-example dark-consent-good-ux is-${mode}`}>
      <DarkPatternConsentPanel mode={mode} variant={mode === "acceptDominant" || mode === "hiddenReject" || mode === "preselectedPurpose" || mode === "bundledPurposes" || mode === "consentWall" || mode === "processingBeforeChoice" || mode === "repeatedNag" || mode === "hardWithdrawal" ? "bad" : "good"} meta={meta} />
      <div className="demo-row dark-consent-controls" aria-label="Dark-pattern consent audit states">
        {darkConsentControls.map(({ mode: itemMode, label }) => (
          <button
            type="button"
            key={itemMode}
            className={mode === itemMode ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(itemMode)}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">{darkConsentCopy[mode].summary}</p>
    </div>
  );
}

function DarkPatternConsentBadUx() {
  const [mode, setMode] = useState<DarkConsentMode>("hiddenReject");
  const failureModes = darkConsentControls.slice(0, 8);

  return (
    <div className={`quality-example dark-consent-bad-ux is-${mode}`}>
      <DarkPatternConsentPanel mode={mode} variant="bad" />
      <div className="demo-row dark-consent-failure-controls" aria-label="Manipulative consent failure states">
        {failureModes.map(({ mode: itemMode, label }) => (
          <button
            type="button"
            key={itemMode}
            className={mode === itemMode ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(itemMode)}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">{darkConsentCopy[mode].risk} The record should not count as freely given consent.</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DarkPatternConsentGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DarkPatternConsentBadUi />;
}

function GoodUxExample({ meta }: { patternId: string; meta: PatternMeta }) {
  return <DarkPatternConsentGoodUx meta={meta} />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DarkPatternConsentBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
