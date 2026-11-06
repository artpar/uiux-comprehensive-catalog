import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type EscalateToHumanState =
  | "userRequested"
  | "systemSuggested"
  | "routeChoice"
  | "liveAgent"
  | "createTicket"
  | "requestCallback"
  | "specialistQueue"
  | "supervisorReview"
  | "businessHours"
  | "expectedWait"
  | "queuePosition"
  | "sharedContext"
  | "consentToShare"
  | "verificationRequired"
  | "transferPending"
  | "humanJoined"
  | "ticketCreated"
  | "callbackScheduled"
  | "noAgentAvailable"
  | "failedTransfer"
  | "cancelEscalation"
  | "handbackToAi"
  | "mobile";

const escalateToHumanCopy: Record<EscalateToHumanState, {
  label: string;
  message: string;
  route: string;
  wait: string;
  context: string;
  consent: string;
  queue: string;
  fallback: string;
  status: string;
  tone: "neutral" | "working" | "ready" | "warning" | "danger";
}> = {
  userRequested: {
    label: "User requested human",
    message: "The user asked to talk to a human after two failed AI answers.",
    route: "Billing live agent",
    wait: "About 2 minutes",
    context: "Transcript, account ID, failed attempts",
    consent: "Ask before sharing",
    queue: "Human route available",
    fallback: "Create ticket if the queue closes",
    status: "Route offered",
    tone: "ready"
  },
  systemSuggested: {
    label: "System suggested escalation",
    message: "The assistant suggests escalation because confidence is low and account authority is needed.",
    route: "Account specialist",
    wait: "3 to 5 minutes",
    context: "Summary, sources, tool result",
    consent: "Context review visible",
    queue: "Specialist queue open",
    fallback: "Continue with AI for low-risk questions",
    status: "Suggested",
    tone: "working"
  },
  routeChoice: {
    label: "Route choice",
    message: "The surface separates live agent, create ticket, request callback, specialist queue, and supervisor review.",
    route: "Choose route",
    wait: "Live 2 min, ticket 4 hr",
    context: "Same package for each route",
    consent: "Required before transfer",
    queue: "Eligible routes shown",
    fallback: "Outside-hours ticket fallback",
    status: "Choosing",
    tone: "neutral"
  },
  liveAgent: {
    label: "Live agent",
    message: "Live agent escalation names the destination and whether a person can join now.",
    route: "Live agent",
    wait: "2 minutes",
    context: "Transcript and verification note",
    consent: "User approved",
    queue: "Position 2",
    fallback: "Ticket if wait exceeds 5 minutes",
    status: "Queued",
    tone: "working"
  },
  createTicket: {
    label: "Create ticket",
    message: "Create ticket gives an asynchronous human route when live staff are unavailable.",
    route: "Priority support ticket",
    wait: "SLA 4 business hours",
    context: "Transcript, attachments, account",
    consent: "Approved for support",
    queue: "Ticket draft ready",
    fallback: "Email updates enabled",
    status: "Ticket ready",
    tone: "ready"
  },
  requestCallback: {
    label: "Request callback",
    message: "Request callback captures the channel, time window, and what context will be shared.",
    route: "Phone callback",
    wait: "Next slot 14:30",
    context: "Issue summary and account",
    consent: "Phone consent captured",
    queue: "Callback slot held",
    fallback: "Ticket if missed",
    status: "Slot held",
    tone: "ready"
  },
  specialistQueue: {
    label: "Specialist queue",
    message: "Specialist queue explains why a general agent is not enough.",
    route: "Billing specialist queue",
    wait: "6 minutes",
    context: "Billing flags and transcript",
    consent: "Sensitive fields redacted",
    queue: "Specialist capacity open",
    fallback: "Supervisor review if blocked",
    status: "Specialist queued",
    tone: "working"
  },
  supervisorReview: {
    label: "Supervisor review",
    message: "Supervisor review is reserved for authority, exception, or appeal decisions.",
    route: "Supervisor review",
    wait: "By end of day",
    context: "Decision summary and evidence",
    consent: "Review package visible",
    queue: "Review requested",
    fallback: "Human approval gate if action needed",
    status: "Review requested",
    tone: "working"
  },
  businessHours: {
    label: "Business hours",
    message: "Business hours explain why live transfer is disabled and which route remains open.",
    route: "Outside-hours ticket",
    wait: "Opens 09:00",
    context: "Saved for morning team",
    consent: "Consent before ticket",
    queue: "Live closed",
    fallback: "Create ticket now",
    status: "Hours disclosed",
    tone: "warning"
  },
  expectedWait: {
    label: "Expected wait",
    message: "Expected wait is visible before transfer so users can choose live, ticket, or callback.",
    route: "Live agent",
    wait: "About 2 minutes",
    context: "Shared after consent",
    consent: "Pending",
    queue: "Position 3",
    fallback: "Callback available",
    status: "Wait shown",
    tone: "neutral"
  },
  queuePosition: {
    label: "Queue position",
    message: "Queue position updates the pending transfer instead of showing a vague spinner.",
    route: "Live agent",
    wait: "1 minute",
    context: "Transfer package ready",
    consent: "Approved",
    queue: "Position 1",
    fallback: "Cancel escalation",
    status: "Almost ready",
    tone: "working"
  },
  sharedContext: {
    label: "Shared context",
    message: "Shared context lists what the human will receive and what stays redacted.",
    route: "Billing specialist",
    wait: "3 minutes",
    context: "Transcript, account status, no card data",
    consent: "Review and edit allowed",
    queue: "Package attached",
    fallback: "Send summary only",
    status: "Context visible",
    tone: "ready"
  },
  consentToShare: {
    label: "Consent to share",
    message: "Consent to share appears before transcript, files, account data, or AI outputs move to support.",
    route: "Live agent",
    wait: "2 minutes",
    context: "Transcript and uploaded invoice",
    consent: "Consent required",
    queue: "Waiting on consent",
    fallback: "Share summary only",
    status: "Consent pending",
    tone: "warning"
  },
  verificationRequired: {
    label: "Verification required",
    message: "Verification required blocks routing until identity or account ownership is confirmed.",
    route: "Secure billing route",
    wait: "After verification",
    context: "No sensitive fields yet",
    consent: "After verification",
    queue: "Held",
    fallback: "Continue public help",
    status: "Verify first",
    tone: "danger"
  },
  transferPending: {
    label: "Transfer pending",
    message: "Transfer pending names the route, owner, queue, and cancel option while waiting.",
    route: "Live billing agent",
    wait: "2 minutes",
    context: "Approved package sent",
    consent: "Approved",
    queue: "Assigning",
    fallback: "Cancel escalation",
    status: "Pending",
    tone: "working"
  },
  humanJoined: {
    label: "Human joined",
    message: "Human joined confirms the person is present and what context they already received.",
    route: "Maya, billing agent",
    wait: "Joined now",
    context: "Transcript and account issue",
    consent: "Shared as approved",
    queue: "Accepted",
    fallback: "Handback to AI for simple tasks",
    status: "Human joined",
    tone: "ready"
  },
  ticketCreated: {
    label: "Ticket created",
    message: "Ticket created gives a reference ID, SLA, context package, and return path.",
    route: "Ticket #48291",
    wait: "4 business hours",
    context: "Transcript, files, priority reason",
    consent: "Shared with support",
    queue: "Assigned to billing",
    fallback: "Return to AI",
    status: "Created",
    tone: "ready"
  },
  callbackScheduled: {
    label: "Callback scheduled",
    message: "Callback scheduled confirms time, channel, context, and how to reschedule or cancel.",
    route: "Phone callback",
    wait: "14:30 to 14:45",
    context: "Issue summary attached",
    consent: "Phone consent recorded",
    queue: "Scheduled",
    fallback: "Open ticket if missed",
    status: "Scheduled",
    tone: "ready"
  },
  noAgentAvailable: {
    label: "No agent available",
    message: "No agent available disables live transfer and offers honest asynchronous options.",
    route: "Live unavailable",
    wait: "No live capacity",
    context: "Saved for ticket",
    consent: "Required for ticket",
    queue: "Capacity full",
    fallback: "Create ticket or callback",
    status: "Unavailable",
    tone: "warning"
  },
  failedTransfer: {
    label: "Failed transfer",
    message: "Failed transfer explains what happened and preserves the route, context, and recovery choices.",
    route: "Live transfer failed",
    wait: "Retry available",
    context: "Package saved",
    consent: "Still valid",
    queue: "Connection failed",
    fallback: "Retry, ticket, or callback",
    status: "Failed",
    tone: "danger"
  },
  cancelEscalation: {
    label: "Cancel escalation",
    message: "Cancel escalation stays available while queued and explains whether context has been sent.",
    route: "Live agent",
    wait: "2 minutes",
    context: "Not yet sent",
    consent: "Can revoke",
    queue: "Queued",
    fallback: "Continue with AI",
    status: "Cancelable",
    tone: "neutral"
  },
  handbackToAi: {
    label: "Handback to AI",
    message: "Handback to AI is explicit after the human resolves authority-sensitive work.",
    route: "Back to AI assistant",
    wait: "Immediate",
    context: "Human resolution summary",
    consent: "No new sharing",
    queue: "Human closed",
    fallback: "Reopen ticket",
    status: "Handback",
    tone: "ready"
  },
  mobile: {
    label: "Mobile escalation",
    message: "Mobile escalation keeps route choice, wait, shared context, consent, and cancel visible in a compact layout.",
    route: "Live or ticket",
    wait: "2 min or 4 hr",
    context: "Tap to review",
    consent: "Inline checkbox",
    queue: "Compact status",
    fallback: "Cancel visible",
    status: "Mobile ready",
    tone: "ready"
  }
};

function EscalateToHumanPanel({ state }: { state: EscalateToHumanState }) {
  const copy = escalateToHumanCopy[state];
  const routes = ["Live agent", "Create ticket", "Request callback"];

  return (
    <section className={`escalate-human-shell is-${copy.tone}`} aria-label="Escalate to human route">
      <header className="escalate-human-header">
        <div>
          <strong>{copy.label}</strong>
          <span>{copy.message}</span>
        </div>
        <span className="escalate-human-state">{copy.status}</span>
      </header>
      <div className="escalate-human-conversation">
        <span>Current AI conversation</span>
        <p>AI could not resolve a locked billing account after two attempts. Human help is now available.</p>
      </div>
      <div className="escalate-human-routes" role="list" aria-label="Human route choices">
        {routes.map((route) => (
          <span key={route} role="listitem" className={copy.route.toLowerCase().includes(route.toLowerCase().split(" ")[0]) ? "is-selected" : ""}>{route}</span>
        ))}
      </div>
      <div className="escalate-human-grid">
        <span><b>Destination</b>{copy.route}</span>
        <span><b>Expected wait</b>{copy.wait}</span>
        <span><b>Shared context</b>{copy.context}</span>
        <span><b>Consent</b>{copy.consent}</span>
        <span><b>Queue status</b>{copy.queue}</span>
        <span><b>Fallback</b>{copy.fallback}</span>
      </div>
      <div className="escalate-human-actions">
        <button type="button" className="demo-button small primary">Transfer to human</button>
        <button type="button" className="demo-button small">Create ticket</button>
        <button type="button" className="demo-button small">Cancel escalation</button>
      </div>
    </section>
  );
}

function EscalateToHumanGoodUi() {
  return (
    <div className="quality-example escalate-human-demo">
      <EscalateToHumanPanel state="routeChoice" />
      <p className="demo-status">The escalate to human surface names the trigger reason, route choice, live agent, create ticket, request callback, specialist queue, supervisor review, business hours, expected wait, shared context, consent to share, queue position, transfer status, fallback, cancel escalation, and handback to AI path.</p>
    </div>
  );
}

function EscalateToHumanBadUi() {
  return (
    <div className="bad-ui-sample escalate-human-bad-demo is-fake-transfer">
      <div className="escalate-human-bad-card">Transfer started</div>
      <div className="escalate-human-broken-grid" aria-label="Broken human escalation">
        <span>Fake-transfer</span>
        <span>No destination</span>
        <span>Hidden-wait</span>
        <span>Context-drop</span>
      </div>
      <p>The broken UI claims a human transfer without route choice, live agent availability, expected wait, consent to share, queue status, fallback, or cancellation.</p>
    </div>
  );
}

function EscalateToHumanGoodUx() {
  const [state, setState] = useState<EscalateToHumanState>("userRequested");
  const [message, setMessage] = useState("User requested human captures the explicit request and offers an honest human route.");
  const choose = (next: EscalateToHumanState, note: string) => {
    setState(next);
    setMessage(note);
  };

  const states: Array<[EscalateToHumanState, string, string]> = [
    ["userRequested", "User requested human", "User requested human captures the explicit request and offers an honest human route."],
    ["systemSuggested", "System suggested escalation", "System suggested escalation appears when the AI reaches a low-confidence or policy-limited point."],
    ["routeChoice", "Route choice", "Route choice compares live agent, create ticket, request callback, specialist queue, and supervisor review."],
    ["liveAgent", "Live agent", "Live agent names whether a person can join now."],
    ["createTicket", "Create ticket", "Create ticket provides an asynchronous human route."],
    ["requestCallback", "Request callback", "Request callback captures channel, time, and context."],
    ["specialistQueue", "Specialist queue", "Specialist queue explains why a specialist route is needed."],
    ["supervisorReview", "Supervisor review", "Supervisor review handles authority-sensitive exceptions."],
    ["businessHours", "Business hours", "Business hours honestly disable closed live routes."],
    ["expectedWait", "Expected wait", "Expected wait lets users choose whether to wait or use another route."],
    ["queuePosition", "Queue position", "Queue position replaces vague transfer spinners."],
    ["sharedContext", "Shared context", "Shared context lists what the human receives."],
    ["consentToShare", "Consent to share", "Consent to share appears before transcript or account details are shared."],
    ["verificationRequired", "Verification required", "Verification required protects restricted account data."],
    ["transferPending", "Transfer pending", "Transfer pending shows the owner, queue, and cancel option."],
    ["humanJoined", "Human joined", "Human joined confirms a real person accepted the case."],
    ["ticketCreated", "Ticket created", "Ticket created shows reference ID, SLA, and return path."],
    ["callbackScheduled", "Callback scheduled", "Callback scheduled confirms time, channel, and reschedule controls."],
    ["noAgentAvailable", "No agent available", "No agent available disables live routes and offers an honest fallback."],
    ["failedTransfer", "Failed transfer", "Failed transfer preserves context and offers retry, ticket, or callback."],
    ["cancelEscalation", "Cancel escalation", "Cancel escalation stays available while queued."],
    ["handbackToAi", "Handback to AI", "Handback to AI is explicit after human support completes its part."],
    ["mobile", "Mobile escalation", "Mobile escalation keeps route choice, wait, context, consent, and cancel visible."]
  ];

  return (
    <div className="quality-example escalate-human-demo">
      <div className="escalate-human-controls" aria-label="Escalate to human exercise controls">
        {states.map(([next, label, note]) => (
          <button key={next} type="button" className={state === next ? "demo-button small primary" : "demo-button small"} onClick={() => choose(next, note)}>{label}</button>
        ))}
      </div>
      <EscalateToHumanPanel state={state} />
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function EscalateToHumanBadUx() {
  type Mode = "bot-loop" | "fake-transfer" | "hidden-wait" | "context-drop" | "privacy-surprise" | "unavailable-live" | "no-cancel";
  const [mode, setMode] = useState<Mode>("bot-loop");
  const copy: Record<Mode, string> = {
    "bot-loop": "Bot-loop restarts AI answers after the user asks for a person.",
    "fake-transfer": "Fake-transfer says a human transfer started but gives no destination, owner, or status.",
    "hidden-wait": "Hidden-wait hides business hours, expected wait, queue position, and fallback.",
    "context-drop": "Context-drop sends the user to a human with no transcript, summary, or failed-attempt history.",
    "privacy-surprise": "Privacy-surprise shares transcript, account data, files, or AI output without disclosure.",
    "unavailable-live": "Unavailable-live presents a closed or full live route as available.",
    "no-cancel": "No-cancel traps the user in a pending transfer with no cancel escalation or route change."
  };
  const labels: Record<Mode, string[]> = {
    "bot-loop": ["Bot-loop", "Human ignored", "AI restarted", "No route"],
    "fake-transfer": ["Fake-transfer", "No destination", "No owner", "No status"],
    "hidden-wait": ["Hidden-wait", "No hours", "No queue", "No fallback"],
    "context-drop": ["Context-drop", "No transcript", "Repeat details", "No summary"],
    "privacy-surprise": ["Privacy-surprise", "Transcript shared", "No consent", "No redaction"],
    "unavailable-live": ["Unavailable-live", "Closed queue", "Capacity full", "Still enabled"],
    "no-cancel": ["No-cancel", "Pending forever", "No change route", "No exit"]
  };

  return (
    <div className={`quality-example escalate-human-bad-demo is-${mode}`}>
      <div className="escalate-human-bad-card">{mode === "fake-transfer" ? "Transfer started" : "AI support"}</div>
      <div className="escalate-human-broken-grid" aria-label="Broken human escalation">
        {labels[mode].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <strong>{mode === "privacy-surprise" ? "Consent to share is missing" : "Human escalation failure"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row escalate-human-controls">
        <button type="button" className={mode === "bot-loop" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("bot-loop")}>Bot-loop</button>
        <button type="button" className={mode === "fake-transfer" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("fake-transfer")}>Fake-transfer</button>
        <button type="button" className={mode === "hidden-wait" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hidden-wait")}>Hidden-wait</button>
        <button type="button" className={mode === "context-drop" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("context-drop")}>Context-drop</button>
        <button type="button" className={mode === "privacy-surprise" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("privacy-surprise")}>Privacy-surprise</button>
        <button type="button" className={mode === "unavailable-live" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("unavailable-live")}>Unavailable-live</button>
        <button type="button" className={mode === "no-cancel" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("no-cancel")}>No-cancel</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <EscalateToHumanGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <EscalateToHumanBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <EscalateToHumanGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <EscalateToHumanBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
