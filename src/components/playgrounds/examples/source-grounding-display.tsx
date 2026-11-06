import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type SourceGroundingDisplayState = "grounded" | "partial" | "unsupported" | "pending" | "notSearched" | "permission" | "stale" | "conflict" | "failed" | "quality" | "mobile";

type SourceGroundingDisplayCopy = {
  title: string;
  status: string;
  tone: "ready" | "working" | "warning" | "danger";
  scope: string;
  counts: string[];
  groups: string[];
  claims: string[];
  action: string;
};

const sourceGroundingDisplayCopy: Record<SourceGroundingDisplayState, SourceGroundingDisplayCopy> = {
  grounded: {
    title: "Grounded coverage",
    status: "Answer-wide source grounding display shows the source scope, searched sources, retrieved sources, used sources, and supported claims.",
    tone: "ready",
    scope: "Source scope: Current policy library, renewal terms, and release notes.",
    counts: ["4 searched sources", "3 retrieved sources", "2 used sources", "6 supported claims"],
    groups: ["Used: renewal policy 4.2", "Used: pricing addendum", "Unused: outdated FAQ", "Not searched: public web"],
    claims: ["Supported claim: 30-day renewal notice", "Supported claim: price changes require review", "Supported claim: auto-renewal extends term"],
    action: "Copy with grounding"
  },
  partial: {
    title: "Partially grounded",
    status: "One answer section is partially grounded, so the panel separates full support from partial support.",
    tone: "warning",
    scope: "Source scope: Current policy library only.",
    counts: ["4 searched sources", "2 retrieved sources", "2 used sources", "1 partially supported claim"],
    groups: ["Used: renewal policy 4.2", "Used: pricing addendum", "Needed: customer-specific contract", "Not searched: account documents"],
    claims: ["Supported claim: notice deadline", "Partially supported claim: discount exception", "Review needed before publish"],
    action: "Review partial claim"
  },
  unsupported: {
    title: "Unsupported claim",
    status: "The display names the unsupported claim and says no supporting source found instead of hiding it behind citations elsewhere.",
    tone: "danger",
    scope: "Source scope: Current policy library and release notes.",
    counts: ["4 searched sources", "3 retrieved sources", "2 used sources", "1 unsupported claim"],
    groups: ["Used: renewal policy 4.2", "Used: release notes May", "No supporting source found: free cancellation", "Review queue required"],
    claims: ["Unsupported claim: cancellation is free after renewal", "Jump to claim", "Regenerate or remove claim"],
    action: "Jump to unsupported claim"
  },
  pending: {
    title: "Pending grounding",
    status: "Grounding remains pending while retrieval, source matching, and final answer text are still resolving.",
    tone: "working",
    scope: "Source scope: Policy library, web references, and uploaded terms.",
    counts: ["Search running", "Retrieved sources pending", "Used sources pending", "Claim support pending"],
    groups: ["Searching policy library", "Searching uploaded terms", "Web search pending", "Final answer not settled"],
    claims: ["Pending grounding", "Streaming response active", "Copy final locked"],
    action: "Wait for grounding"
  },
  notSearched: {
    title: "Not searched",
    status: "The source grounding display shows which corpus was excluded by settings or topic scope.",
    tone: "warning",
    scope: "Source scope: Help center only; internal policy was not searched.",
    counts: ["1 searched source", "1 retrieved source", "1 used source", "2 out-of-scope claims"],
    groups: ["Searched: help center", "Not searched: internal policy", "Not searched: customer files", "Topic scope locked"],
    claims: ["Out-of-scope answer part: internal policy exception", "Change source scope", "Review required"],
    action: "Change source scope"
  },
  permission: {
    title: "Permission-limited source",
    status: "The source exists but cannot be opened or quoted by the current user, so it is not shown as verified evidence.",
    tone: "warning",
    scope: "Source scope: Enterprise knowledge sources with user-authenticated access.",
    counts: ["5 searched sources", "3 retrieved sources", "1 permission-limited source", "1 claim blocked"],
    groups: ["Used: public policy", "Permission-limited: enterprise pricing", "Excerpt hidden", "Request access available"],
    claims: ["Claim needs restricted source", "No private excerpt shown", "Request access before apply"],
    action: "Request access"
  },
  stale: {
    title: "Stale source",
    status: "A source was retrieved but its freshness warning changes the answer-wide grounding status.",
    tone: "warning",
    scope: "Source scope: Policy library with freshness checks.",
    counts: ["4 searched sources", "3 retrieved sources", "1 stale source", "2 claims need recheck"],
    groups: ["Used: renewal policy 4.2", "Stale source: 2024 FAQ", "Current source missing", "Recheck scheduled"],
    claims: ["Stale support: pricing escalation", "Stale support: notice exception", "Use current source before publish"],
    action: "Recheck source"
  },
  conflict: {
    title: "Conflicting source",
    status: "The panel shows that two used sources conflict instead of calling the answer grounded.",
    tone: "danger",
    scope: "Source scope: Policy library and legal addendum.",
    counts: ["4 searched sources", "3 retrieved sources", "2 conflicting sources", "1 claim blocked"],
    groups: ["Source A: 30-day notice", "Source B: 45-day notice", "Conflict detected", "Escalate review"],
    claims: ["Conflicting claim: notice window", "Do not publish", "Human review required"],
    action: "Open conflict"
  },
  failed: {
    title: "Retrieval failed",
    status: "The UI separates retrieval failure from no supporting source found.",
    tone: "danger",
    scope: "Source scope: Policy library and uploaded terms.",
    counts: ["Search failed", "0 retrieved sources", "0 used sources", "Grounding unavailable"],
    groups: ["Policy index timeout", "Uploaded terms not searched", "Retry source search", "Answer not verified"],
    claims: ["Grounding unavailable", "Do not apply answer", "Retry retrieval"],
    action: "Retry source search"
  },
  quality: {
    title: "Source quality warning",
    status: "Coverage exists, but one used source is low quality or outside the preferred source hierarchy.",
    tone: "warning",
    scope: "Source scope: Approved policy first, web references second.",
    counts: ["5 searched sources", "4 retrieved sources", "2 used sources", "1 source quality warning"],
    groups: ["Used: approved policy", "Used with warning: public forum", "Preferred source absent", "Reviewer note required"],
    claims: ["Supported by weaker source", "Prefer approved source", "Review before export"],
    action: "Mark for review"
  },
  mobile: {
    title: "Mobile grounding panel",
    status: "The mobile grounding panel keeps coverage counts and jump-to-claim actions reachable without losing the answer position.",
    tone: "ready",
    scope: "Source scope: Current policy library.",
    counts: ["4 searched sources", "3 retrieved sources", "2 used sources", "1 unsupported claim"],
    groups: ["Collapsed groups", "Touch target counts", "Return to answer", "Jump to claim"],
    claims: ["Supported claim count visible", "Unsupported claim visible", "Reading position preserved"],
    action: "Return to answer"
  }
};

function SourceGroundingDisplayPanel({ state }: { state: SourceGroundingDisplayState }) {
  const copy = sourceGroundingDisplayCopy[state];

  return (
    <section className={`source-grounding-shell is-${copy.tone}`} aria-label="Source grounding display">
      <header className="source-grounding-header">
        <div>
          <strong>{copy.title}</strong>
          <span>{copy.status}</span>
        </div>
        <span className="source-grounding-state">{state === "grounded" || state === "mobile" ? "Grounded" : state === "pending" ? "Pending" : state === "failed" || state === "unsupported" || state === "conflict" ? "Blocked" : "Review"}</span>
      </header>
      <p className="source-grounding-scope">{copy.scope}</p>
      <div className="source-grounding-counts" aria-label="Source coverage counts">
        {copy.counts.map((count) => <span key={count}>{count}</span>)}
      </div>
      <div className="source-grounding-grid">
        <div className="source-grounding-card">
          <strong>Searched, retrieved, and used sources</strong>
          {copy.groups.map((group) => <span key={group}>{group}</span>)}
        </div>
        <div className="source-grounding-card">
          <strong>Claim support</strong>
          {copy.claims.map((claim) => <span key={claim}>{claim}</span>)}
        </div>
      </div>
      <div className="source-grounding-actions">
        <button type="button" className="demo-button small">{copy.action}</button>
        <button type="button" className="demo-button small">Change source scope</button>
        <button type="button" className={copy.tone === "ready" ? "demo-button small primary" : "demo-button small"}>Review grounding</button>
      </div>
    </section>
  );
}

function SourceGroundingDisplayGoodUi() {
  return (
    <div className="quality-example source-grounding-demo">
      <SourceGroundingDisplayPanel state="grounded" />
      <p className="demo-status">The source grounding display separates source scope, searched sources, retrieved sources, used sources, supported claims, and unused sources before the answer is copied or applied.</p>
    </div>
  );
}

function SourceGroundingDisplayBadUi() {
  return (
    <div className="bad-ui-sample source-grounding-bad-demo is-global-badge">
      <div className="source-grounding-bad-badge">Grounded</div>
      <div className="source-grounding-broken-grid" aria-label="Broken source grounding display">
        {["Global badge", "Mixed sources", "Unsupported hidden", "Scope omitted"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p className="demo-status">The broken UI claims the whole answer is grounded but hides source scope, retrieved versus used sources, and unsupported claims.</p>
    </div>
  );
}

function SourceGroundingDisplayGoodUx() {
  const [state, setState] = useState<SourceGroundingDisplayState>("grounded");
  const [message, setMessage] = useState("Grounded coverage shows source scope, searched sources, retrieved sources, used sources, and supported claims.");

  const choose = (next: SourceGroundingDisplayState, note: string) => {
    setState(next);
    setMessage(note);
  };

  return (
    <div className="quality-example source-grounding-demo">
      <div className="source-grounding-controls" aria-label="Source grounding exercise controls">
        <button type="button" className={state === "grounded" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("grounded", "Grounded state separates source scope, searched sources, retrieved sources, used sources, and supported claims.")}>Grounded</button>
        <button type="button" className={state === "partial" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("partial", "Partially grounded state names the claim that has only partial source support.")}>Partial</button>
        <button type="button" className={state === "unsupported" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("unsupported", "Unsupported claim state shows no supporting source found and a jump-to-claim review path.")}>Unsupported</button>
        <button type="button" className={state === "pending" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("pending", "Pending grounding stays unresolved while source search and final answer text settle.")}>Pending</button>
        <button type="button" className={state === "notSearched" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("notSearched", "Not searched state discloses source scope exclusions instead of implying full coverage.")}>Not searched</button>
        <button type="button" className={state === "permission" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("permission", "Permission-limited source state explains the access gap without leaking private excerpts.")}>Permission</button>
        <button type="button" className={state === "stale" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("stale", "Stale source state warns that freshness affects the grounding status.")}>Stale</button>
        <button type="button" className={state === "conflict" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("conflict", "Conflicting source state blocks publish until the source disagreement is reviewed.")}>Conflict</button>
        <button type="button" className={state === "failed" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("failed", "Retrieval failed state is distinct from no supporting source found.")}>Retrieval failed</button>
        <button type="button" className={state === "quality" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("quality", "Source quality warning separates coverage from source quality.")}>Quality warning</button>
        <button type="button" className={state === "mobile" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("mobile", "Mobile grounding panel preserves counts, claim links, and return to answer.")}>Mobile panel</button>
      </div>
      <SourceGroundingDisplayPanel state={state} />
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function SourceGroundingDisplayBadUx() {
  type Mode = "global-badge" | "mixed-sources" | "hidden-unsupported" | "confidence-only" | "omitted-scope" | "vanished-permission" | "related-links-evidence";
  const [mode, setMode] = useState<Mode>("global-badge");
  const copy: Record<Mode, string> = {
    "global-badge": "A single Grounded badge claims answer-wide support even when source coverage is unknown.",
    "mixed-sources": "Searched, retrieved, used, cited, and related sources are mixed into one list.",
    "hidden-unsupported": "Unsupported claims stay in the answer because other claims have citations.",
    "confidence-only": "A confidence score replaces source coverage, source quality, permissions, and claim support.",
    "omitted-scope": "The UI does not disclose that internal policy or customer files were not searched.",
    "vanished-permission": "A permission-limited source disappears, making the answer look more complete than it is.",
    "related-links-evidence": "Related links are displayed as if they were grounding evidence used by the answer."
  };
  const labels: Record<Mode, string[]> = {
    "global-badge": ["Grounded", "No counts", "No claims", "No scope"],
    "mixed-sources": ["Searched", "Retrieved", "Used", "Related"],
    "hidden-unsupported": ["Claim A cited", "Claim B unsupported", "Hidden gap", "Copy ready"],
    "confidence-only": ["87% confident", "No sources", "No coverage", "No claim support"],
    "omitted-scope": ["Policy expected", "Web only", "Scope hidden", "Trust broken"],
    "vanished-permission": ["Private source", "Omitted", "No warning", "Coverage inflated"],
    "related-links-evidence": ["Learn more", "FAQ", "Blog", "Looks sourced"]
  };

  return (
    <div className={`quality-example source-grounding-bad-demo is-${mode}`}>
      <div className="source-grounding-bad-badge">{mode === "confidence-only" ? "87% confident" : "Grounded"}</div>
      <div className="source-grounding-broken-grid" aria-label="Broken source grounding display">
        {labels[mode].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <strong>{mode === "confidence-only" ? "Confidence only" : mode === "hidden-unsupported" ? "Unsupported hidden" : "Grounding failure"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row source-grounding-controls">
        <button type="button" className={mode === "global-badge" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("global-badge")}>Global badge</button>
        <button type="button" className={mode === "mixed-sources" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mixed-sources")}>Mixed sources</button>
        <button type="button" className={mode === "hidden-unsupported" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hidden-unsupported")}>Hidden unsupported</button>
        <button type="button" className={mode === "confidence-only" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("confidence-only")}>Confidence only</button>
        <button type="button" className={mode === "omitted-scope" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("omitted-scope")}>Omitted scope</button>
        <button type="button" className={mode === "vanished-permission" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("vanished-permission")}>Vanished permission</button>
        <button type="button" className={mode === "related-links-evidence" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("related-links-evidence")}>Related links as evidence</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SourceGroundingDisplayGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SourceGroundingDisplayBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SourceGroundingDisplayGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SourceGroundingDisplayBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
