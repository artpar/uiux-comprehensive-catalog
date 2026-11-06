import { useState } from "react";
import { QualityPanel, type PatternMeta } from './shared';

type AiAnswerWithoutSourcesState =
  | "sourced"
  | "notSearched"
  | "noSourceFound"
  | "retrievalFailed"
  | "permissionLimited"
  | "pendingSources"
  | "draftKnowledge"
  | "sourceNeeded"
  | "humanVerification"
  | "copyGated";

type AiAnswerWithoutSourcesCopy = {
  title: string;
  badge: string;
  tone: "ready" | "working" | "warning" | "danger";
  answer: string;
  sourceStatus: string;
  evidence: string[];
  recovery: string[];
  primaryAction: string;
  copyAllowed: boolean;
};

const aiAnswerWithoutSourcesCopy: Record<AiAnswerWithoutSourcesState, AiAnswerWithoutSourcesCopy> = {
  sourced: {
    title: "Sourced answer",
    badge: "Sources verified",
    tone: "ready",
    answer: "Renewal notice must be sent at least 30 days before the current term ends.",
    sourceStatus: "Two policy sources support the claim and the selected source can be opened.",
    evidence: ["Policy section 4.2", "Pricing addendum", "2 sources used", "Claim mapped"],
    recovery: ["Open source", "Inspect citation", "Copy with sources"],
    primaryAction: "Copy sourced answer",
    copyAllowed: true
  },
  notSearched: {
    title: "Not searched",
    badge: "Search needed",
    tone: "warning",
    answer: "The answer is a draft because source search has not run for the selected policy scope.",
    sourceStatus: "No source search has been attempted for the policy library, customer files, or web references.",
    evidence: ["Not searched", "Source scope empty", "No citations", "Apply locked"],
    recovery: ["Search sources", "Choose source scope", "Ask human"],
    primaryAction: "Search sources",
    copyAllowed: false
  },
  noSourceFound: {
    title: "No supporting source found",
    badge: "No source found",
    tone: "danger",
    answer: "The answer claims a renewal discount exception, but no supporting source was found.",
    sourceStatus: "Search completed across selected sources and returned no evidence for the highlighted claim.",
    evidence: ["No supporting source found", "Unsupported claim", "Search complete", "Review required"],
    recovery: ["Revise answer", "Upload source", "Ask human"],
    primaryAction: "Ask human",
    copyAllowed: false
  },
  retrievalFailed: {
    title: "Retrieval failed",
    badge: "Source search failed",
    tone: "danger",
    answer: "The answer cannot be treated as sourced because the policy index timed out.",
    sourceStatus: "Retrieval failed before evidence could be searched or attached.",
    evidence: ["Retrieval failed", "0 retrieved sources", "Error visible", "Retry available"],
    recovery: ["Retry retrieval", "Change source scope", "Save draft"],
    primaryAction: "Retry retrieval",
    copyAllowed: false
  },
  permissionLimited: {
    title: "Permission-limited",
    badge: "Access blocked",
    tone: "warning",
    answer: "A restricted source may support part of the answer, but this user cannot inspect it.",
    sourceStatus: "Source exists but cannot be opened, quoted, or treated as verified by the current user.",
    evidence: ["Permission-limited", "Excerpt hidden", "Request access", "No private leak"],
    recovery: ["Request access", "Ask owner", "Use public source"],
    primaryAction: "Request access",
    copyAllowed: false
  },
  pendingSources: {
    title: "Pending source search",
    badge: "Sources pending",
    tone: "working",
    answer: "The draft is still waiting for source search, source matching, and final answer checks.",
    sourceStatus: "Source retrieval is running, so the answer remains partial and copy/apply is locked.",
    evidence: ["Pending source search", "Search running", "Citations pending", "Final copy locked"],
    recovery: ["Stop search", "Wait for sources", "Keep draft"],
    primaryAction: "Wait for sources",
    copyAllowed: false
  },
  draftKnowledge: {
    title: "Draft from model knowledge",
    badge: "Unsourced draft",
    tone: "warning",
    answer: "The assistant can suggest likely policy language, but it marks the text as model knowledge only.",
    sourceStatus: "No attached evidence supports the draft, so it must be verified before use.",
    evidence: ["Draft from model knowledge", "No source attached", "Needs verification", "Copy warning"],
    recovery: ["Search sources", "Upload source", "Send to review"],
    primaryAction: "Search sources",
    copyAllowed: false
  },
  sourceNeeded: {
    title: "Source needed",
    badge: "Evidence required",
    tone: "danger",
    answer: "This answer affects a customer policy decision, so the workflow requires a source before apply.",
    sourceStatus: "A source requirement is explicit before the user can publish, copy, or apply the response.",
    evidence: ["Source needed", "Policy impact", "Apply gated", "Fallback route"],
    recovery: ["Upload source", "Search sources", "Escalate"],
    primaryAction: "Upload source",
    copyAllowed: false
  },
  humanVerification: {
    title: "Human verification",
    badge: "Reviewer needed",
    tone: "warning",
    answer: "The answer stays in review because the available evidence is ambiguous or incomplete.",
    sourceStatus: "The workflow routes the claim to a human reviewer instead of letting an unsourced answer pass.",
    evidence: ["Human verification", "Reviewer queue", "Decision blocked", "Audit note required"],
    recovery: ["Send to reviewer", "Add note", "Revise answer"],
    primaryAction: "Send to reviewer",
    copyAllowed: false
  },
  copyGated: {
    title: "Copy/apply gated",
    badge: "Copy locked",
    tone: "danger",
    answer: "The answer can be kept as a draft, but copy and apply remain unavailable until source status changes.",
    sourceStatus: "Copy/apply gating prevents unsourced text from leaving the review surface without warning.",
    evidence: ["Copy/apply gated", "Unsourced answer", "Warning retained", "Audit preserved"],
    recovery: ["Find source", "Copy draft with warning", "Cancel"],
    primaryAction: "Find source",
    copyAllowed: false
  }
};

function AiAnswerWithoutSourcesPanel({ state, subject }: { state: AiAnswerWithoutSourcesState; subject: string }) {
  const copy = aiAnswerWithoutSourcesCopy[state];

  return (
    <section className={`ai-no-sources-shell is-${copy.tone}`} aria-label="AI answer source status">
      <header className="ai-no-sources-header">
        <div>
          <strong>{copy.title}</strong>
          <span>{subject}</span>
        </div>
        <span className="ai-no-sources-badge">{copy.badge}</span>
      </header>
      <article className="ai-no-sources-answer" aria-label="Generated answer">
        <span>Generated answer</span>
        <p>{copy.answer}</p>
      </article>
      <div className="ai-no-sources-status" aria-label="Source status">
        <strong>Source status</strong>
        <p>{copy.sourceStatus}</p>
      </div>
      <div className="ai-no-sources-grid" aria-label="Source evidence and recovery">
        <div>
          <strong>Evidence</strong>
          {copy.evidence.map((item) => <span key={item}>{item}</span>)}
        </div>
        <div>
          <strong>Recovery route</strong>
          {copy.recovery.map((item) => <span key={item}>{item}</span>)}
        </div>
      </div>
      <div className="ai-no-sources-actions">
        <button type="button" className="demo-button small">{copy.primaryAction}</button>
        <button type="button" className={copy.copyAllowed ? "demo-button small primary" : "demo-button small"} disabled={!copy.copyAllowed}>Copy answer</button>
        <button type="button" className="demo-button small" disabled={!copy.copyAllowed}>Apply to case</button>
      </div>
    </section>
  );
}

function AiAnswerWithoutSourcesGoodUi() {
  return (
    <div className="quality-example ai-no-sources-demo">
      <AiAnswerWithoutSourcesPanel state="notSearched" subject="Customer policy answer" />
      <p className="demo-status">The UI makes source status a first-class part of the answer, separates not searched from no supporting source found and retrieval failed, and keeps copy/apply unavailable until evidence is resolved.</p>
    </div>
  );
}

function AiAnswerWithoutSourcesBadUi() {
  return (
    <div className="bad-ui-sample ai-no-sources-bad-demo is-confidentNoSource">
      <div className="ai-no-sources-broken-answer">
        <strong>Policy answer</strong>
        <p>Renewal discounts are available after auto-renewal. Copy this response into the case.</p>
        <span>Looks complete</span>
      </div>
      <div className="ai-no-sources-broken-grid" aria-label="Broken source status">
        {["Confident no-source", "No source status", "Copy enabled", "Apply enabled"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p className="demo-status">The broken UI presents a confident answer without source status, recovery, or warning-preserving copy/apply controls.</p>
    </div>
  );
}

function AiAnswerWithoutSourcesGoodUx({ meta }: { meta: PatternMeta }) {
  const [state, setState] = useState<AiAnswerWithoutSourcesState>("sourced");
  const [message, setMessage] = useState("Sourced answer is copyable because source search, evidence mapping, and source inspection are complete.");

  const choose = (next: AiAnswerWithoutSourcesState, note: string) => {
    setState(next);
    setMessage(note);
  };

  return (
    <div className="quality-example ai-no-sources-demo">
      <div className="ai-no-sources-controls" aria-label="AI answer without sources exercise controls">
        <button type="button" className={state === "sourced" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("sourced", "Sourced answer allows copy only after source evidence and claim mapping are visible.")}>Sourced answer</button>
        <button type="button" className={state === "notSearched" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("notSearched", "Not searched state says source search has not run and offers search or scope controls.")}>Not searched</button>
        <button type="button" className={state === "noSourceFound" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("noSourceFound", "No supporting source found is a completed search with no evidence, not a retrieval outage.")}>No supporting source found</button>
        <button type="button" className={state === "retrievalFailed" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("retrievalFailed", "Retrieval failed state exposes the search error and retry path before copy or apply.")}>Retrieval failed</button>
        <button type="button" className={state === "permissionLimited" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("permissionLimited", "Permission-limited source is disclosed without leaking restricted excerpts or calling the answer verified.")}>Permission-limited</button>
        <button type="button" className={state === "pendingSources" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("pendingSources", "Pending source search keeps final copy locked while retrieval and matching settle.")}>Pending source search</button>
        <button type="button" className={state === "draftKnowledge" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("draftKnowledge", "Draft from model knowledge is labelled as unsourced and routed to source search or review.")}>Draft from model knowledge</button>
        <button type="button" className={state === "sourceNeeded" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("sourceNeeded", "Source needed state makes evidence mandatory for a policy-impacting answer.")}>Source needed</button>
        <button type="button" className={state === "humanVerification" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("humanVerification", "Human verification routes ambiguous or incomplete evidence to a reviewer.")}>Human verification</button>
        <button type="button" className={state === "copyGated" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("copyGated", "Copy/apply gated keeps unsourced text from leaving the surface without the warning.")}>Copy/apply gated</button>
      </div>
      <AiAnswerWithoutSourcesPanel state={state} subject={meta.subject} />
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function AiAnswerWithoutSourcesBadUx() {
  type Mode = "confidentNoSource" | "relatedLinksEvidence" | "hiddenRetrievalFailure" | "permissionOmitted" | "citationPromisedMissing" | "staleSourceClaim" | "copyStripsWarning";
  const [mode, setMode] = useState<Mode>("confidentNoSource");
  const copy: Record<Mode, string> = {
    confidentNoSource: "A polished answer sounds final even though no source search, citation, or source status is present.",
    relatedLinksEvidence: "Related links appear under the answer as if they were evidence used to generate the claim.",
    hiddenRetrievalFailure: "Retrieval failed in the background, but the UI still offers Copy and Apply without a source warning.",
    permissionOmitted: "A restricted source is omitted entirely, so users cannot see that verification depends on unavailable access.",
    citationPromisedMissing: "The answer says citations are available, but the promised source marker opens nothing.",
    staleSourceClaim: "A stale source label is hidden while the answer presents an outdated policy as current.",
    copyStripsWarning: "Copy removes the unsourced-warning banner and leaves only the confident answer text."
  };
  const labels: Record<Mode, string[]> = {
    confidentNoSource: ["Confident no-source", "No search", "No citation", "Copy ready"],
    relatedLinksEvidence: ["Related links as evidence", "Learn more", "FAQ", "Not used"],
    hiddenRetrievalFailure: ["Hidden retrieval failure", "Timeout hidden", "Apply enabled", "No retry"],
    permissionOmitted: ["Permission omitted", "Private source", "Disappeared", "No request"],
    citationPromisedMissing: ["Citation promised missing", "[1]", "Opens nothing", "No status"],
    staleSourceClaim: ["Stale source claim", "Old policy", "Current badge", "No recheck"],
    copyStripsWarning: ["Copy strips warning", "Draft copied", "Warning gone", "Audit lost"]
  };

  return (
    <div className={`quality-example ai-no-sources-bad-demo is-${mode}`}>
      <div className="ai-no-sources-broken-answer" aria-label="Unsourced AI answer failure">
        <strong>{mode === "copyStripsWarning" ? "Copied answer" : "Policy answer"}</strong>
        <p>{mode === "relatedLinksEvidence" ? "The answer lists links below, but none are mapped to the claim or source search." : "Renewal discount exceptions are available after auto-renewal. Apply this response to the customer case."}</p>
        <span>{mode === "hiddenRetrievalFailure" ? "Retrieval status hidden" : "Source status absent"}</span>
      </div>
      <div className="ai-no-sources-broken-grid" aria-label="Broken AI answer source handling">
        {labels[mode].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <strong>{mode === "relatedLinksEvidence" ? "Related links as evidence" : mode === "copyStripsWarning" ? "Copy strips warning" : "Unsourced answer failure"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row ai-no-sources-controls">
        <button type="button" className={mode === "confidentNoSource" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("confidentNoSource")}>Confident no-source</button>
        <button type="button" className={mode === "relatedLinksEvidence" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("relatedLinksEvidence")}>Related links as evidence</button>
        <button type="button" className={mode === "hiddenRetrievalFailure" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenRetrievalFailure")}>Hidden retrieval failure</button>
        <button type="button" className={mode === "permissionOmitted" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("permissionOmitted")}>Permission omitted</button>
        <button type="button" className={mode === "citationPromisedMissing" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("citationPromisedMissing")}>Citation promised missing</button>
        <button type="button" className={mode === "staleSourceClaim" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleSourceClaim")}>Stale source claim</button>
        <button type="button" className={mode === "copyStripsWarning" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("copyStripsWarning")}>Copy strips warning</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AiAnswerWithoutSourcesGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AiAnswerWithoutSourcesBadUi />;
}

function GoodUxExample({ meta }: { patternId: string; meta: PatternMeta }) {
  return <AiAnswerWithoutSourcesGoodUx meta={meta} />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AiAnswerWithoutSourcesBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
