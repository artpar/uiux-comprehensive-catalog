import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type HandoffSummaryMode = "default" | "aiHuman" | "shift" | "generated" | "accepted" | "clarify" | "stale" | "redacted" | "declined" | "reassigned" | "handback" | "mobile";

const handoffSummaryCopy: Record<HandoffSummaryMode, {
  title: string;
  status: string;
  receiver: string;
  situation: string;
  background: string;
  assessment: string;
  recommendation: string;
  note: string;
}> = {
  default: {
    title: "Billing escalation handoff",
    status: "Ready for receiver",
    receiver: "Priya Rao - Billing Tier 2",
    situation: "Customer cannot renew because invoice INV-8842 is locked after two failed card updates.",
    background: "AI agent verified email, collected last four digits, and linked the failed payment event.",
    assessment: "Account is active, renewal expires today, and billing permission is required for unlock.",
    recommendation: "Open invoice, confirm card owner, unlock retry, then update the customer in chat.",
    note: "Generated 3 minutes ago from chat, ticket, and billing log sources."
  },
  aiHuman: {
    title: "AI to live agent",
    status: "Escalated by AI",
    receiver: "Live support queue",
    situation: "Customer asked for a human after password reset failed twice and MFA device is lost.",
    background: "Bot collected account email, device type, and reset attempt timestamps.",
    assessment: "Identity proof is incomplete; account-lock risk is high.",
    recommendation: "Verify identity manually, avoid sending another reset link, and record recovery path.",
    note: "Transcript and collected variables are attached."
  },
  shift: {
    title: "Shift handoff",
    status: "Night shift takeover",
    receiver: "Operations night lead",
    situation: "Checkout latency is elevated in APAC but below incident threshold.",
    background: "Cache warmup reduced errors from 4.1% to 1.2%; database queue is still growing.",
    assessment: "Watch queue depth and payment gateway timeout rate for the next 45 minutes.",
    recommendation: "Page SRE if timeout rate exceeds 2% for 10 minutes.",
    note: "Sender remains available for 15 minutes after transfer."
  },
  generated: {
    title: "Generated summary",
    status: "AI draft",
    receiver: "Priya Rao - Billing Tier 2",
    situation: "Customer needs renewal unlock for INV-8842.",
    background: "Summary covers 23 of 27 messages and 2 billing events.",
    assessment: "One customer attachment was skipped because it could not be opened.",
    recommendation: "Review skipped attachment before accepting the handoff.",
    note: "AI-generated; edited facts require source review."
  },
  accepted: {
    title: "Accepted handoff",
    status: "Priya owns next action",
    receiver: "Priya Rao - Billing Tier 2",
    situation: "Billing Tier 2 accepted the renewal unlock case.",
    background: "Assigned-to-me, queue, and customer notification were updated.",
    assessment: "Current owner has billing access and source links are available.",
    recommendation: "Complete unlock by 16:00 and reply in the existing chat.",
    note: "Responsibility confirmed and logged."
  },
  clarify: {
    title: "Clarification requested",
    status: "Waiting on sender",
    receiver: "Priya Rao - Billing Tier 2",
    situation: "Receiver needs the customer's authorization code before accepting.",
    background: "Summary says verification passed but the code is missing from the visible transcript.",
    assessment: "Handoff should not be accepted until the missing proof is confirmed.",
    recommendation: "Ask sender for the code or route to identity support.",
    note: "Clarification keeps context with the same transfer record."
  },
  stale: {
    title: "Stale summary",
    status: "Source changed",
    receiver: "Priya Rao - Billing Tier 2",
    situation: "Customer added a new message after the summary was generated.",
    background: "Billing log changed and a teammate opened the invoice.",
    assessment: "Accepting now could miss a newer payment attempt.",
    recommendation: "Refresh summary and re-check source links before accepting.",
    note: "Stale source warning blocks acceptance."
  },
  redacted: {
    title: "Redacted handoff",
    status: "Limited receiver access",
    receiver: "External billing partner",
    situation: "Renewal is blocked, but customer identity details are hidden by policy.",
    background: "Transcript contains restricted account and card metadata.",
    assessment: "Partner can see case status and next step, not private transcript details.",
    recommendation: "Request temporary billing scope or route to internal Tier 2.",
    note: "Redaction reason is visible instead of leaking hidden content."
  },
  declined: {
    title: "Declined handoff",
    status: "Wrong queue",
    receiver: "Billing Tier 2",
    situation: "Receiver declined because this is an identity recovery case, not billing unlock.",
    background: "The transfer reason and transcript remain attached.",
    assessment: "Queue mismatch should route to Identity Support.",
    recommendation: "Reassign to Identity Support with the same summary and reason.",
    note: "Decline preserves route history."
  },
  reassigned: {
    title: "Reassigned handoff",
    status: "Identity Support owns",
    receiver: "Identity Support queue",
    situation: "Billing handoff was rerouted after receiver found missing identity proof.",
    background: "Prior Billing review and clarification request remain visible.",
    assessment: "New receiver needs identity verification context first.",
    recommendation: "Complete manual identity verification, then return to Billing if unlock is still needed.",
    note: "Reassignment keeps summary and previous receiver context."
  },
  handback: {
    title: "Handed back to AI",
    status: "Live agent done",
    receiver: "AI first responder",
    situation: "Live agent unlocked invoice and needs automation to collect updated payment details.",
    background: "Manual unlock completed; customer is still in the same chat.",
    assessment: "Bot can safely guide card update now that billing lock is removed.",
    recommendation: "Resume payment collection flow and escalate again if card fails.",
    note: "Handback changes first responder with source context preserved."
  },
  mobile: {
    title: "Mobile handoff card",
    status: "Condensed",
    receiver: "Priya Rao - Billing Tier 2",
    situation: "Mobile view keeps sender, receiver, current status, risk, and next action above links.",
    background: "Transcript and billing log links collapse below structured summary.",
    assessment: "No critical handoff detail is hidden behind horizontal scrolling.",
    recommendation: "Accept, clarify, or decline from the same card.",
    note: "Small screens preserve action ownership and source access."
  }
};

function HandoffSummaryFrame({
  mode = "default",
  idSuffix = "demo"
}: {
  mode?: HandoffSummaryMode;
  idSuffix?: string;
}) {
  const copy = handoffSummaryCopy[mode];
  const titleId = `handoff-summary-title-${idSuffix}`;
  const warning = mode === "stale" || mode === "redacted" || mode === "clarify" || mode === "generated";
  return (
    <div className={`handoff-summary-frame is-${mode}`}>
      <section className="handoff-summary-card" aria-labelledby={titleId}>
        <div className="handoff-summary-head">
          <span>Ticket SUP-4182</span>
          <strong>{copy.status}</strong>
        </div>
        <h4 id={titleId}>{copy.title}</h4>
        <div className="handoff-summary-route" aria-label="Handoff route">
          <div>
            <span>From</span>
            <strong>{mode === "shift" ? "Day shift lead" : mode === "aiHuman" ? "AI first responder" : "Omar Singh"}</strong>
          </div>
          <div>
            <span>To</span>
            <strong>{copy.receiver}</strong>
          </div>
          <div>
            <span>Reason</span>
            <strong>{mode === "shift" ? "Shift change" : mode === "redacted" ? "Access-limited transfer" : "Escalation"}</strong>
          </div>
        </div>
        <div className="handoff-summary-sbar" aria-label="Structured handoff summary">
          <div><span>Situation</span><p>{copy.situation}</p></div>
          <div><span>Background</span><p>{copy.background}</p></div>
          <div><span>Assessment</span><p>{copy.assessment}</p></div>
          <div><span>Recommendation</span><p>{copy.recommendation}</p></div>
        </div>
      </section>
      <aside className="handoff-summary-panel" aria-label="Handoff actions and sources">
        <div className={warning ? "handoff-summary-note is-warning" : "handoff-summary-note"}>{copy.note}</div>
        <div className="handoff-summary-sources">
          <span>Sources</span>
          <button type="button">Open transcript</button>
          <button type="button">Open ticket</button>
          <button type="button">Open billing log</button>
        </div>
        <div className="handoff-summary-actions">
          <button type="button" className="demo-button small primary" disabled={mode === "stale" || mode === "redacted"}>Accept</button>
          <button type="button" className="demo-button small">Ask clarification</button>
          <button type="button" className="demo-button small">Refresh</button>
          <button type="button" className="demo-button small danger">Decline</button>
        </div>
      </aside>
    </div>
  );
}

function HandoffSummaryGoodUi() {
  return (
    <div className="quality-example handoff-summary-demo">
      <HandoffSummaryFrame mode="default" />
      <p className="demo-status">The handoff names route, receiver, reason, structured current context, next action, risks, generated time, and source links.</p>
    </div>
  );
}

function HandoffSummaryBadUi() {
  return (
    <div className="bad-ui-sample handoff-summary-bad-demo is-assignmentOnly">
      <strong>Transfer</strong>
      <div className="handoff-summary-bad-grid">
        {["Assigned to Priya", "Open chat", "Good luck"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p className="demo-status">The broken transfer has no current status, previous attempts, risks, next action, receiver confirmation, source coverage, or access warning.</p>
    </div>
  );
}

function HandoffSummaryGoodUx() {
  const [mode, setMode] = useState<HandoffSummaryMode>("default");
  const [message, setMessage] = useState("The receiver sees the transfer route, current situation, background, assessment, recommendation, and source links before accepting.");
  function choose(nextMode: HandoffSummaryMode, nextMessage: string) {
    setMode(nextMode);
    setMessage(nextMessage);
  }
  return (
    <div className="quality-example handoff-summary-demo">
      <HandoffSummaryFrame mode={mode} idSuffix="good-ux" />
      <div className="demo-row handoff-summary-controls" aria-label="Handoff summary exercise controls">
        <button type="button" className={mode === "default" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("default", "The receiver sees the transfer route, current situation, background, assessment, recommendation, and source links before accepting.")}>Default</button>
        <button type="button" className={mode === "aiHuman" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("aiHuman", "AI-to-human handoff includes transcript, collected variables, prior attempts, and escalation reason.")}>AI to human</button>
        <button type="button" className={mode === "shift" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("shift", "Shift handoff uses receiver-owned monitoring action, deadline, and contingency trigger.")}>Shift</button>
        <button type="button" className={mode === "generated" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("generated", "Generated summary discloses source coverage and skipped attachment before acceptance.")}>Generated</button>
        <button type="button" className={mode === "accepted" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("accepted", "Accepted handoff updates owner, queue, notification, and activity state.")}>Accepted</button>
        <button type="button" className={mode === "clarify" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("clarify", "Clarification request keeps transfer context while asking the sender for missing proof.")}>Clarify</button>
        <button type="button" className={mode === "stale" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("stale", "Stale source warning blocks acceptance until the summary is refreshed.")}>Stale</button>
        <button type="button" className={mode === "redacted" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("redacted", "Redacted handoff shows what is hidden and how to route access safely.")}>Redacted</button>
        <button type="button" className={mode === "declined" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("declined", "Declined handoff preserves reason and points to the correct queue.")}>Declined</button>
        <button type="button" className={mode === "reassigned" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("reassigned", "Reassigned handoff keeps prior receiver context and summary history.")}>Reassigned</button>
        <button type="button" className={mode === "handback" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("handback", "Handback changes first responder back to automation after the live agent completes the manual step.")}>Handback</button>
        <button type="button" className={mode === "mobile" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("mobile", "Mobile card keeps action owner, risks, source links, and accept or clarify controls readable.")}>Mobile</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function HandoffSummaryBadUx() {
  type Mode = "assignmentOnly" | "transcriptDump" | "staleSummary" | "privacyLeak" | "noNextAction" | "unverifiableAi";
  const [mode, setMode] = useState<Mode>("assignmentOnly");
  const copy: Record<Mode, string> = {
    assignmentOnly: "The receiver only sees an assignee change and must reconstruct the situation from scratch.",
    transcriptDump: "The transfer dumps the entire transcript without current status, attempts, or next action.",
    staleSummary: "The summary looks current even though the customer added new information after generation.",
    privacyLeak: "Restricted account and payment details leak to a receiver who only needed redacted context.",
    noNextAction: "The summary describes background but never says who does what next or by when.",
    unverifiableAi: "The AI summary sounds confident but has no source links, coverage, timestamp, or omission warning."
  };
  const labels: Record<Mode, string[]> = {
    assignmentOnly: ["Assigned", "No reason", "No context"],
    transcriptDump: ["86 messages", "Read all", "No summary"],
    staleSummary: ["Generated 09:10", "New reply 09:18", "Still green"],
    privacyLeak: ["Full card data", "External team", "No redaction"],
    noNextAction: ["Background", "Maybe billing", "No owner"],
    unverifiableAi: ["Solved maybe", "No sources", "No timestamp"]
  };
  return (
    <div className={`quality-example handoff-summary-bad-demo is-${mode}`}>
      <strong>{mode === "privacyLeak" ? "Privacy leak" : mode === "unverifiableAi" ? "Unverifiable AI summary" : "Broken handoff"}</strong>
      <div className="handoff-summary-bad-grid">
        {labels[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row handoff-summary-controls">
        <button type="button" className={mode === "assignmentOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("assignmentOnly")}>Assignment only</button>
        <button type="button" className={mode === "transcriptDump" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("transcriptDump")}>Transcript dump</button>
        <button type="button" className={mode === "staleSummary" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleSummary")}>Stale summary</button>
        <button type="button" className={mode === "privacyLeak" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("privacyLeak")}>Privacy leak</button>
        <button type="button" className={mode === "noNextAction" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noNextAction")}>No next action</button>
        <button type="button" className={mode === "unverifiableAi" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("unverifiableAi")}>Unverifiable AI</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <HandoffSummaryGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <HandoffSummaryBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <HandoffSummaryGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <HandoffSummaryBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
