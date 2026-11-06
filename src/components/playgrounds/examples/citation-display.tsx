import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type CitationDisplayState = "verified" | "open" | "multi" | "pending" | "stale" | "missing" | "permission" | "mismatch" | "copied" | "mobile";

type CitationDisplayCopy = {
  title: string;
  status: string;
  tone: "ready" | "working" | "warning" | "danger";
  markerLabel: string;
  claim: string;
  sourceTitle: string;
  excerpt: string;
  meta: string[];
  chips: string[];
  action: string;
};

const citationDisplayCopy: Record<CitationDisplayState, CitationDisplayCopy> = {
  verified: {
    title: "Verified source",
    status: "Citation 1 is selected and the source preview shows the exact excerpt that supports the claim.",
    tone: "ready",
    markerLabel: "Citation 1 verified source",
    claim: "The renewal notice window closes 30 days before the contract end date.",
    sourceTitle: "Contract renewal policy, section 4.2",
    excerpt: "Customers must send renewal notice at least 30 days before the current term expires.",
    meta: ["Verified source", "Updated 2026-04-18", "Section 4.2", "Open source available"],
    chips: ["Inline citation", "Selected citation", "Claim-to-source mapping", "Source preview"],
    action: "Open source"
  },
  open: {
    title: "Open source ready",
    status: "The open source action is scoped to the selected citation, not to the whole answer.",
    tone: "ready",
    markerLabel: "Citation 1 open source",
    claim: "The renewal notice window closes 30 days before the contract end date.",
    sourceTitle: "Contract renewal policy, section 4.2",
    excerpt: "Customers must send renewal notice at least 30 days before the current term expires.",
    meta: ["Open source", "Same claim", "Scroll target saved", "Return to claim"],
    chips: ["Source preview", "Open source", "Return target", "Source metadata"],
    action: "Open source"
  },
  multi: {
    title: "Multi-source claim",
    status: "One claim is supported by two citations, and the preview lets users switch between them.",
    tone: "ready",
    markerLabel: "Citation 1 and 2 verified sources",
    claim: "Auto-renewal extends the commitment unless notice is sent before the deadline.",
    sourceTitle: "Contract renewal policy plus customer terms addendum",
    excerpt: "The contract renews for one term unless either party gives written notice before the notice deadline.",
    meta: ["2 verified sources", "Policy + addendum", "Same claim", "Switch source"],
    chips: ["Multi-source", "Claim-level evidence", "Source ordering", "Preview switching"],
    action: "Switch source"
  },
  pending: {
    title: "Pending citation",
    status: "The answer text is visible, but the citation remains pending until retrieval and final answer text settle.",
    tone: "working",
    markerLabel: "Citation pending",
    claim: "The assistant is checking whether price changes apply at renewal.",
    sourceTitle: "Retrieval in progress",
    excerpt: "Source excerpt pending. The claim cannot be treated as verified yet.",
    meta: ["Pending citation", "Streaming response", "Retrieval active", "Copy source locked"],
    chips: ["Pending citation", "Partial answer", "Source check", "Final mapping pending"],
    action: "Wait for source"
  },
  stale: {
    title: "Stale citation",
    status: "The answer was regenerated after the source was selected, so the citation must be rechecked.",
    tone: "warning",
    markerLabel: "Citation stale after answer revision",
    claim: "The revised answer says a 45-day notice window may apply.",
    sourceTitle: "Old source attached to prior 30-day claim",
    excerpt: "Customers must send renewal notice at least 30 days before the current term expires.",
    meta: ["Stale citation", "Answer revised", "Recheck needed", "Open source limited"],
    chips: ["Stale citation", "Regenerated answer", "Mapping changed", "Needs review"],
    action: "Recheck citation"
  },
  missing: {
    title: "Missing source",
    status: "The citation marker stays visible but is labelled missing, with retry and report paths.",
    tone: "danger",
    markerLabel: "Citation missing source",
    claim: "The generated answer references a pricing schedule that could not be retrieved.",
    sourceTitle: "Missing source record",
    excerpt: "No excerpt is available because the source ID no longer resolves.",
    meta: ["Missing source", "Retry source", "Report issue", "Do not verify"],
    chips: ["Missing source", "Unverified claim", "Retry", "Report mismatch"],
    action: "Retry source"
  },
  permission: {
    title: "Permission-limited source",
    status: "The source exists, but the current user cannot open it; the UI does not pretend it is inspectable.",
    tone: "warning",
    markerLabel: "Citation permission-limited source",
    claim: "Internal enterprise terms may restrict renewal discounts.",
    sourceTitle: "Enterprise pricing policy",
    excerpt: "Excerpt hidden because this account does not have document access.",
    meta: ["Permission-limited", "Source exists", "Excerpt hidden", "Request access"],
    chips: ["Permission-limited", "Access blocked", "No private excerpt", "Request access"],
    action: "Request access"
  },
  mismatch: {
    title: "Source mismatch",
    status: "The preview warns that the cited excerpt does not support the selected claim.",
    tone: "danger",
    markerLabel: "Citation source mismatch",
    claim: "The answer says cancellation is free after renewal.",
    sourceTitle: "Cancellation fee schedule",
    excerpt: "Early termination fees apply after renewal unless waived by written agreement.",
    meta: ["Source mismatch", "Claim unsupported", "Report mismatch", "Regenerate needed"],
    chips: ["Source mismatch", "Unsupported claim", "Evidence conflict", "Review required"],
    action: "Report mismatch"
  },
  copied: {
    title: "Copy citation",
    status: "Copy names what was copied and keeps source context attached to the selected claim.",
    tone: "ready",
    markerLabel: "Citation copied",
    claim: "The renewal notice window closes 30 days before the contract end date.",
    sourceTitle: "Contract renewal policy, section 4.2",
    excerpt: "Customers must send renewal notice at least 30 days before the current term expires.",
    meta: ["Copied citation", "Source title included", "Claim retained", "Excerpt excluded"],
    chips: ["Copy citation", "Copied source context", "Selected claim", "Verified source"],
    action: "Copied"
  },
  mobile: {
    title: "Mobile source panel",
    status: "The source preview stacks under the selected claim and keeps a return target to the citation.",
    tone: "ready",
    markerLabel: "Citation mobile source panel",
    claim: "The renewal notice window closes 30 days before the contract end date.",
    sourceTitle: "Contract renewal policy, section 4.2",
    excerpt: "Customers must send renewal notice at least 30 days before the current term expires.",
    meta: ["Mobile source panel", "Reading position kept", "Touch target", "Return to claim"],
    chips: ["Mobile source panel", "Selected citation", "Return to claim", "Open source"],
    action: "Return to claim"
  }
};

function CitationDisplayPanel({ state }: { state: CitationDisplayState }) {
  const copy = citationDisplayCopy[state];

  return (
    <section className={`citation-display-shell is-${copy.tone}`} aria-label="Citation display policy answer">
      <article className="citation-display-answer" aria-label="Generated answer with inline citation display">
        <header>
          <strong>Citation display</strong>
          <span>{copy.status}</span>
        </header>
        <p>
          {copy.claim}{" "}
          <button type="button" className={`citation-display-cite is-${copy.tone}`} aria-pressed="true" aria-label={copy.markerLabel}>
            [1]
          </button>
          {state === "multi" ? (
            <button type="button" className="citation-display-cite is-ready" aria-label="Citation 2 verified source">[2]</button>
          ) : null}
        </p>
        <p>
          Selected citation markers are small, but the source preview carries the evidence, date, permission state, and open source action.
        </p>
      </article>

      <aside className="citation-display-source-panel" aria-label="Selected source preview">
        <div className="citation-display-source-title">
          <span>{copy.title}</span>
          <strong>{copy.sourceTitle}</strong>
        </div>
        <blockquote>{copy.excerpt}</blockquote>
        <div className="citation-display-meta" aria-label="Source metadata">
          {copy.meta.map((item) => <span key={item}>{item}</span>)}
        </div>
        <div className="citation-display-chips" aria-label="Citation display state">
          {copy.chips.map((chip) => <span key={chip}>{chip}</span>)}
        </div>
        <div className="citation-display-actions">
          <button type="button" className="demo-button small">{copy.action}</button>
          <button type="button" className={state === "copied" ? "demo-button small primary" : "demo-button small"}>Copy citation</button>
        </div>
      </aside>
    </section>
  );
}

function CitationDisplayGoodUi() {
  return (
    <div className="quality-example citation-display-demo">
      <CitationDisplayPanel state="verified" />
      <p className="demo-status">The citation display ties an inline citation marker to a selected source preview, exact claim, verified source excerpt, metadata, and open source action.</p>
    </div>
  );
}

function CitationDisplayBadUi() {
  return (
    <div className="bad-ui-sample citation-display-bad-demo is-link-dump">
      <p className="citation-display-broken-answer">Renewal notice is due soon [1]. Pricing may change [2]. Auto-renewal applies [3].</p>
      <div className="citation-display-broken-grid" aria-label="Broken citation display">
        {["Link dump", "Vague source", "Dead cite", "Decorative numbers"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p className="demo-status">The broken UI shows citation-looking numbers and a source list, but no source preview, no selected citation, and no claim-to-source mapping.</p>
    </div>
  );
}

function CitationDisplayGoodUx() {
  const [state, setState] = useState<CitationDisplayState>("verified");
  const [message, setMessage] = useState("Verified source is selected, with source preview, excerpt, and open source action tied to the claim.");

  const choose = (next: CitationDisplayState, note: string) => {
    setState(next);
    setMessage(note);
  };

  return (
    <div className="quality-example citation-display-demo">
      <div className="citation-display-controls" aria-label="Citation display exercise controls">
        <button type="button" className={state === "verified" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("verified", "Verified source shows exact source preview and claim-to-source mapping.")}>Verified</button>
        <button type="button" className={state === "open" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("open", "Open source is scoped to the selected citation and preserves return context.")}>Open source</button>
        <button type="button" className={state === "multi" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("multi", "Multi-source claim shows two verified citations supporting the same claim.")}>Multi-source</button>
        <button type="button" className={state === "pending" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("pending", "Pending citation stays unresolved during streaming or retrieval and does not look verified.")}>Pending</button>
        <button type="button" className={state === "stale" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("stale", "Stale citation is labelled after answer revision and requires recheck.")}>Stale</button>
        <button type="button" className={state === "missing" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("missing", "Missing source is separated from verified evidence and exposes retry or report paths.")}>Missing</button>
        <button type="button" className={state === "permission" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("permission", "Permission-limited source explains that the source exists but cannot be opened by this user.")}>Permission</button>
        <button type="button" className={state === "mismatch" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("mismatch", "Source mismatch warns that the excerpt does not support the selected claim.")}>Mismatch</button>
        <button type="button" className={state === "copied" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("copied", "Copy citation confirms source context was copied for the selected claim.")}>Copy citation</button>
        <button type="button" className={state === "mobile" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("mobile", "Mobile source panel stacks under the claim and keeps a return target.")}>Mobile panel</button>
      </div>
      <CitationDisplayPanel state={state} />
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function CitationDisplayBadUx() {
  type Mode = "link-dump" | "vague-source" | "dead-cite" | "citation-drift" | "tooltip-only" | "hidden-permission" | "over-cited" | "decorative-numbers";
  const [mode, setMode] = useState<Mode>("link-dump");
  const copy: Record<Mode, string> = {
    "link-dump": "Sources appear below the answer, but users cannot tell which source supports which claim.",
    "vague-source": "A citation says Source 1 without title, excerpt, date, permission, or open source action.",
    "dead-cite": "The citation marker opens nothing and does not explain whether the source is missing.",
    "citation-drift": "A regenerated answer keeps the old citation even though the claim changed.",
    "tooltip-only": "The source detail is hidden in a short hover layer that touch and keyboard users cannot inspect.",
    "hidden-permission": "A blocked internal source looks verified instead of permission-limited.",
    "over-cited": "Every phrase has a marker, making important evidence impossible to scan.",
    "decorative-numbers": "Superscript numbers look official but have no source record behind them."
  };
  const labels: Record<Mode, string[]> = {
    "link-dump": ["Claim A", "Sources list", "No mapping", "Open random"],
    "vague-source": ["Source 1", "No title", "No excerpt", "No date"],
    "dead-cite": ["[1]", "No preview", "No retry", "No status"],
    "citation-drift": ["Old source", "New claim", "Stale hidden", "Trust broken"],
    "tooltip-only": ["Hover only", "Tiny text", "No focus", "Vanishes"],
    "hidden-permission": ["Private doc", "Looks verified", "Excerpt leaks", "No access path"],
    "over-cited": ["[1][2]", "[3][4]", "[5][6]", "Scan lost"],
    "decorative-numbers": ["1", "2", "3", "No source"]
  };

  return (
    <div className={`quality-example citation-display-bad-demo is-${mode}`}>
      <p className="citation-display-broken-answer">The answer makes sourced-looking claims about renewal, pricing, and cancellation.</p>
      <div className="citation-display-broken-grid" aria-label="Broken citation display">
        {labels[mode].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <strong>{mode === "citation-drift" ? "Citation drift" : mode === "tooltip-only" ? "Tooltip only" : "Citation failure"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row citation-display-controls">
        <button type="button" className={mode === "link-dump" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("link-dump")}>Link dump</button>
        <button type="button" className={mode === "vague-source" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("vague-source")}>Vague source</button>
        <button type="button" className={mode === "dead-cite" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("dead-cite")}>Dead cite</button>
        <button type="button" className={mode === "citation-drift" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("citation-drift")}>Citation drift</button>
        <button type="button" className={mode === "tooltip-only" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("tooltip-only")}>Tooltip only</button>
        <button type="button" className={mode === "hidden-permission" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hidden-permission")}>Hidden permission</button>
        <button type="button" className={mode === "over-cited" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("over-cited")}>Over-cited</button>
        <button type="button" className={mode === "decorative-numbers" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("decorative-numbers")}>Decorative numbers</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CitationDisplayGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CitationDisplayBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CitationDisplayGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CitationDisplayBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
