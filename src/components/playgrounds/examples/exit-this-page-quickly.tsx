import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type ExitThisPageMode =
  | "persistentExit"
  | "assistiveLink"
  | "contentCover"
  | "neutralDestination"
  | "interruptionPage"
  | "safetyContent"
  | "historyLimit"
  | "monitoredDevice"
  | "slowNetwork"
  | "noJavascript"
  | "mobile"
  | "referrer"
  | "failedDestination";

type ExitThisPageBadMode =
  | "hiddenExit"
  | "delayedExit"
  | "backLinkExit"
  | "overpromisedSafety"
  | "relatedDestination"
  | "keyboardUnreachable"
  | "lateWarning";

const exitThisPageGoodLabels: Array<[ExitThisPageMode, string]> = [
  ["persistentExit", "Persistent exit button"],
  ["assistiveLink", "Assistive exit link"],
  ["contentCover", "Immediate content cover"],
  ["neutralDestination", "Neutral destination"],
  ["interruptionPage", "Interruption page"],
  ["safetyContent", "Safety content"],
  ["historyLimit", "Browser history limitation"],
  ["monitoredDevice", "Monitored device warning"],
  ["slowNetwork", "Slow network fallback"],
  ["noJavascript", "No-JavaScript exit"],
  ["mobile", "Mobile fixed exit"],
  ["referrer", "Referrer protection"],
  ["failedDestination", "Failed destination"]
];

const exitThisPageBadLabels: Array<[ExitThisPageBadMode, string]> = [
  ["hiddenExit", "Hidden exit"],
  ["delayedExit", "Delayed exit"],
  ["backLinkExit", "Back-link exit"],
  ["overpromisedSafety", "Overpromised safety"],
  ["relatedDestination", "Related destination"],
  ["keyboardUnreachable", "Keyboard unreachable"],
  ["lateWarning", "Late warning"]
];

function ExitThisPagePanel({ mode, idSuffix }: { mode: ExitThisPageMode; idSuffix: string }) {
  const config: Record<ExitThisPageMode, {
    chip: string;
    title: string;
    body: string;
    trigger: string;
    cover: string;
    destination: string;
    limitation: string;
    fallback: string;
    primary: string;
    secondary: string;
    tone?: "ready" | "warning" | "danger";
    compact?: boolean;
  }> = {
    persistentExit: {
      chip: "Quick exit",
      title: "Persistent exit button is visible before sensitive content",
      body: "The control stays in a consistent high-visibility position and is reached before support details, forms, or case notes.",
      trigger: "Pinned button",
      cover: "Covers immediately",
      destination: "Neutral search page",
      limitation: "Does not clear history",
      fallback: "Plain link available",
      primary: "Exit this page",
      secondary: "How this works"
    },
    assistiveLink: {
      chip: "Assistive exit link",
      title: "Secondary link gives screen-reader users the same escape",
      body: "A focusable text link appears early in the document and runs the same immediate content-covering redirect.",
      trigger: "Secondary link",
      cover: "Same overlay",
      destination: "Neutral page",
      limitation: "History remains",
      fallback: "Keyboard reachable",
      primary: "Use exit link",
      secondary: "Skip to safety info"
    },
    contentCover: {
      chip: "Immediate content cover",
      title: "Sensitive content disappears before navigation completes",
      body: "Activation replaces the service page with a neutral loading surface before network timing can expose the original content.",
      trigger: "Button activated",
      cover: "Neutral overlay shown",
      destination: "Loading neutral site",
      limitation: "No device cleanup",
      fallback: "Manual neutral URL",
      primary: "Show overlay",
      secondary: "Retry destination",
      tone: "ready"
    },
    neutralDestination: {
      chip: "Neutral destination",
      title: "Destination does not reveal the sensitive journey",
      body: "The service navigates to a general-purpose site with neutral title and copy rather than a related support or branded page.",
      trigger: "Exit",
      cover: "Page hidden",
      destination: "Weather search",
      limitation: "Browser history still records",
      fallback: "Copy neutral URL",
      primary: "Open neutral page",
      secondary: "Preview destination"
    },
    interruptionPage: {
      chip: "Interruption page",
      title: "Users learn the control before first sensitive exposure",
      body: "A pre-service page shows the exact button, destination, keyboard route, and what happens after activation.",
      trigger: "Before service",
      cover: "Explained upfront",
      destination: "Named destination",
      limitation: "Limits stated",
      fallback: "Continue or leave",
      primary: "Continue safely",
      secondary: "Leave now"
    },
    safetyContent: {
      chip: "Safety content",
      title: "Safety content explains what quick exit cannot solve",
      body: "The help page covers browser history, monitored devices, malicious software, downloads, and using a safer device.",
      trigger: "Learn more",
      cover: "Not applicable",
      destination: "Safety guidance",
      limitation: "Monitoring risk",
      fallback: "Print-free guidance",
      primary: "Read safety steps",
      secondary: "Exit this page",
      tone: "warning"
    },
    historyLimit: {
      chip: "Browser history limitation",
      title: "The product does not promise to erase browser history",
      body: "Copy says quick exit hides the current page quickly but users may need to clear history or use a safer device.",
      trigger: "Explained",
      cover: "Current page hidden",
      destination: "Neutral page",
      limitation: "History remains",
      fallback: "History help",
      primary: "View history help",
      secondary: "Exit now",
      tone: "warning"
    },
    monitoredDevice: {
      chip: "Monitored device warning",
      title: "Monitoring risk is separated from over-the-shoulder risk",
      body: "The safety message explains that quick exit will not stop spyware, network logs, account logs, or remote monitoring.",
      trigger: "Safety warning",
      cover: "Page can hide",
      destination: "Neutral page",
      limitation: "Monitoring remains",
      fallback: "Use safer device",
      primary: "Find safer options",
      secondary: "Exit now",
      tone: "warning"
    },
    slowNetwork: {
      chip: "Slow network fallback",
      title: "Slow destination still leaves a neutral screen",
      body: "If the neutral destination stalls, the page remains covered and offers a plain neutral URL to open manually.",
      trigger: "Exit pressed",
      cover: "Overlay persists",
      destination: "Still loading",
      limitation: "Network delay",
      fallback: "Manual link",
      primary: "Copy neutral URL",
      secondary: "Try again",
      tone: "ready"
    },
    noJavascript: {
      chip: "No-JavaScript exit",
      title: "Fallback link works without script",
      body: "A plain link remains available when scripts fail, while scripted activation adds the immediate cover when available.",
      trigger: "Plain link",
      cover: "Script enhanced",
      destination: "Neutral URL",
      limitation: "No overlay without JS",
      fallback: "Native link",
      primary: "Open link",
      secondary: "Copy URL"
    },
    mobile: {
      chip: "Mobile fixed exit",
      title: "Compact layout keeps the safety exit reachable",
      body: "The button stays thumb-reachable without covering form controls or requiring horizontal scrolling.",
      trigger: "Sticky mobile button",
      cover: "Full-screen cover",
      destination: "Neutral mobile page",
      limitation: "History remains",
      fallback: "Text link below",
      primary: "Exit this page",
      secondary: "Safety tips",
      compact: true
    },
    referrer: {
      chip: "Referrer protection",
      title: "Navigation avoids leaking the sensitive page by referrer",
      body: "The exit route uses a neutral destination and referrer policy so the target does not receive the sensitive service URL.",
      trigger: "Redirect",
      cover: "Hidden first",
      destination: "Neutral target",
      limitation: "Local traces remain",
      fallback: "Direct URL",
      primary: "Check policy",
      secondary: "Exit now"
    },
    failedDestination: {
      chip: "Failed destination",
      title: "Failed navigation does not reveal sensitive content again",
      body: "If the destination fails, the fallback keeps a neutral surface and offers alternate neutral links instead of restoring the service page.",
      trigger: "Destination failed",
      cover: "Neutral fallback",
      destination: "Unavailable",
      limitation: "Still in browser",
      fallback: "Alternate links",
      primary: "Open backup page",
      secondary: "Copy neutral URL",
      tone: "danger"
    }
  };
  const item = config[mode];
  const titleId = `exit-this-page-title-${idSuffix}`;
  const descId = `exit-this-page-desc-${idSuffix}`;

  return (
    <section className={`exit-this-page-panel is-${mode} ${item.tone ? `is-${item.tone}` : ""} ${item.compact ? "is-compact" : ""}`} aria-labelledby={titleId} aria-describedby={descId}>
      <div className="exit-this-page-panel-head">
        <div>
          <span>{item.chip}</span>
          <strong id={titleId}>{item.title}</strong>
        </div>
        <b>{item.trigger}</b>
      </div>
      <p id={descId}>{item.body}</p>
      <div className="exit-this-page-surface" aria-label="Sensitive service preview">
        <button type="button" className="exit-this-page-button">{item.primary}</button>
        <div>
          <strong>Support service</strong>
          <span>Sensitive page content is covered before destination load.</span>
        </div>
      </div>
      <div className="exit-this-page-evidence-grid" aria-label="Exit this page fields">
        <span><b>Trigger</b>{item.trigger}</span>
        <span><b>Cover</b>{item.cover}</span>
        <span><b>Destination</b>{item.destination}</span>
        <span><b>Limitation</b>{item.limitation}</span>
        <span><b>Fallback</b>{item.fallback}</span>
      </div>
      <div className="exit-this-page-actions">
        <button type="button" className="demo-button small primary">{item.primary}</button>
        <button type="button" className="demo-button small">{item.secondary}</button>
        <button type="button" className="demo-button small">Safety details</button>
      </div>
    </section>
  );
}

function ExitThisPageQuicklyGoodUi() {
  return (
    <div className="quality-example exit-this-page-demo">
      <ExitThisPagePanel mode="persistentExit" idSuffix="good-ui" />
      <p className="demo-status">Exit this page quickly UI keeps a visible control, immediate cover, neutral destination, and honest limitation text together.</p>
    </div>
  );
}

function ExitThisPageQuicklyBadUi() {
  return (
    <div className="bad-ui-sample exit-this-page-bad-demo is-hiddenExit">
      <div className="exit-this-page-broken" aria-label="Broken quick exit">
        <strong>Close</strong>
        <p>The only escape route is a small footer link after the sensitive service form, and it returns through browser history.</p>
        <div className="exit-this-page-broken-grid">
          <span>Hidden exit</span>
          <span>Back-link exit</span>
          <span>No safety limits</span>
        </div>
        <button type="button" className="demo-button small danger">Close page</button>
      </div>
      <p className="demo-status">The broken UI treats ordinary navigation as a safety mechanism.</p>
    </div>
  );
}

function ExitThisPageQuicklyGoodUx() {
  const [mode, setMode] = useState<ExitThisPageMode>("persistentExit");
  return (
    <div className="quality-example exit-this-page-demo">
      <div className="exit-this-page-controls" aria-label="Exit this page exercise controls">
        {exitThisPageGoodLabels.map(([key, label]) => (
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
      <ExitThisPagePanel mode={mode} idSuffix="good-ux" />
      <p className="demo-status" aria-live="polite">Exit this page state: {exitThisPageGoodLabels.find(([key]) => key === mode)?.[1]}.</p>
    </div>
  );
}

function ExitThisPageQuicklyBadUx() {
  const [mode, setMode] = useState<ExitThisPageBadMode>("hiddenExit");
  const copy: Record<ExitThisPageBadMode, {
    title: string;
    body: string;
    fieldA: string;
    fieldB: string;
    fieldC: string;
    outcome: string;
  }> = {
    hiddenExit: {
      title: "Hidden exit",
      body: "The escape link is below the sensitive form, not visible before risk appears, and easy to miss under pressure.",
      fieldA: "Footer only",
      fieldB: "Late focus",
      fieldC: "Low contrast",
      outcome: "Users cannot leave quickly when the observer risk appears."
    },
    delayedExit: {
      title: "Delayed exit",
      body: "The product waits for analytics, a confirmation modal, or an animation before hiding the sensitive page.",
      fieldA: "Analytics first",
      fieldB: "Confirm modal",
      fieldC: "Content visible",
      outcome: "The safety action is slower than the threat scenario."
    },
    backLinkExit: {
      title: "Back-link exit",
      body: "The quick exit uses browser history and may take the user through earlier sensitive pages.",
      fieldA: "History route",
      fieldB: "Prior pages",
      fieldC: "No neutral target",
      outcome: "Ordinary navigation increases exposure instead of reducing it."
    },
    overpromisedSafety: {
      title: "Overpromised safety",
      body: "Copy claims the button hides all traces, clears history, and protects monitored devices.",
      fieldA: "False privacy",
      fieldB: "History remains",
      fieldC: "Monitoring remains",
      outcome: "Users may rely on protection the pattern cannot provide."
    },
    relatedDestination: {
      title: "Related destination",
      body: "The exit opens a branded support article whose title still reveals why the user left.",
      fieldA: "Related site",
      fieldB: "Revealing title",
      fieldC: "Referrer leak",
      outcome: "The destination undermines the purpose of leaving."
    },
    keyboardUnreachable: {
      title: "Keyboard unreachable",
      body: "The floating visual button is last in DOM order and the keyboard user must tab through sensitive fields first.",
      fieldA: "Late DOM",
      fieldB: "No link",
      fieldC: "No focus ring",
      outcome: "The escape route is not equally available to keyboard and screen-reader users."
    },
    lateWarning: {
      title: "Late warning",
      body: "The service explains browser history and device monitoring only after the user has already entered sensitive content.",
      fieldA: "After entry",
      fieldB: "No interruption",
      fieldC: "No safety page",
      outcome: "Users discover limitations after they needed the information."
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example exit-this-page-bad-demo is-${mode}`}>
      <div className="exit-this-page-controls" aria-label="Exit this page misuse controls">
        {exitThisPageBadLabels.map(([key, label]) => (
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
      <div className="exit-this-page-broken" aria-label={`Broken state: ${item.title}`}>
        <strong>{item.title}</strong>
        <p>{item.body}</p>
        <div className="exit-this-page-broken-grid">
          <span>{item.fieldA}</span>
          <span>{item.fieldB}</span>
          <span>{item.fieldC}</span>
        </div>
        <button type="button" className="demo-button small danger">{mode === "delayedExit" ? "Wait, then exit" : "Leave"}</button>
      </div>
      <p className="demo-status" aria-live="polite">{item.outcome}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ExitThisPageQuicklyGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ExitThisPageQuicklyBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ExitThisPageQuicklyGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ExitThisPageQuicklyBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
