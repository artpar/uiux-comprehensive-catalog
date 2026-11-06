import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type TimelineEvent = {
  id: string;
  date: string;
  time: string;
  title: string;
  actor: string;
  status: "done" | "current" | "future" | "warning" | "system";
  type: "Claimant" | "Caseworker" | "System" | "Expected";
  summary: string;
  detail: string;
};

const timelineEvents: TimelineEvent[] = [
  {
    id: "tl-105",
    date: "11 Jun 2026",
    time: "09:20",
    title: "Decision pending",
    actor: "Caseworker Maya",
    status: "current",
    type: "Caseworker",
    summary: "Review started after evidence checks passed.",
    detail: "The claim is waiting for final entitlement calculation. No claimant action is required today."
  },
  {
    id: "tl-104",
    date: "10 Jun 2026",
    time: "16:45",
    title: "Evidence received",
    actor: "Upload service",
    status: "done",
    type: "System",
    summary: "Bank statement and tenancy letter were attached to the claim.",
    detail: "Two files passed virus scan and were linked to evidence request EV-204."
  },
  {
    id: "tl-103",
    date: "09 Jun 2026",
    time: "11:10",
    title: "Evidence requested",
    actor: "Caseworker Noah",
    status: "warning",
    type: "Caseworker",
    summary: "Proof of rent was requested with a 14-day response window.",
    detail: "The request was sent by email and in-app message. The due date remains visible on the claim."
  },
  {
    id: "tl-102",
    date: "08 Jun 2026",
    time: "14:05",
    title: "Application submitted",
    actor: "Asha Patel",
    status: "done",
    type: "Claimant",
    summary: "Claim submitted with reference BEN-48291.",
    detail: "The claimant received a confirmation page and email receipt with the same reference number."
  }
];

const timelineFutureEvent: TimelineEvent = {
  id: "tl-106",
  date: "14 Jun 2026",
  time: "Expected",
  title: "Review scheduled",
  actor: "Benefits service",
  status: "future",
  type: "Expected",
  summary: "A scheduled review will run if no further evidence is requested.",
  detail: "This is an expected milestone, not completed history."
};

const timelineOlderEvent: TimelineEvent = {
  id: "tl-098",
  date: "05 Jun 2026",
  time: "10:30",
  title: "Identity check completed",
  actor: "Verification service",
  status: "system",
  type: "System",
  summary: "Automated identity check passed before the claim was submitted.",
  detail: "The full verification record remains in the source system, not inside this timeline summary."
};

function TimelineItem({
  event,
  expanded,
  onToggle
}: {
  event: TimelineEvent;
  expanded?: boolean;
  onToggle?: (id: string) => void;
}) {
  const titleId = `timeline-${event.id}-title`;

  return (
    <li className={`timeline-event is-${event.status}`}>
      <div className="timeline-marker" aria-hidden="true" />
      <article aria-labelledby={titleId}>
        <div className="timeline-event-head">
          <time>{event.date} - {event.time}</time>
          <span className={`timeline-type is-${event.type.toLowerCase()}`}>{event.type}</span>
        </div>
        <button type="button" className="timeline-title" id={titleId} aria-expanded={expanded} onClick={() => onToggle?.(event.id)}>
          <span>{event.title}</span>
          <small>{event.status === "future" ? "Expected next" : event.status === "current" ? "Current milestone" : event.status}</small>
        </button>
        <p>{event.summary}</p>
        <div className="timeline-meta">
          <span>{event.actor}</span>
          <span>{event.id}</span>
        </div>
        {expanded ? <div className="timeline-detail">{event.detail}</div> : null}
      </article>
    </li>
  );
}

function TimelineGoodUi() {
  const visibleEvents = [timelineFutureEvent, ...timelineEvents];
  return (
    <div className="quality-example timeline-demo">
      <div className="timeline-toolbar" id="timeline-ui-label">
        <strong>Claim timeline</strong>
        <span>Newest first</span>
        <span>Current milestone labelled</span>
      </div>
      <ol className="timeline-list" aria-labelledby="timeline-ui-label">
        {visibleEvents.map((event) => (
          <TimelineItem key={event.id} event={event} expanded={event.id === "tl-105"} />
        ))}
      </ol>
      <p className="demo-status">The timeline keeps date, actor, event title, status, future marker, and concise detail tied to one claim history.</p>
    </div>
  );
}

function TimelineBadUi() {
  return (
    <div className="bad-ui-sample timeline-bad-demo is-noDates">
      <div className="timeline-broken" aria-label="Broken timeline">
        <div><b>Done</b><span>No date, no actor, and no event source.</span></div>
        <div><b>More</b><span>Future appointment looks identical to completed history.</span></div>
        <div><b>Update</b><span>A dense audit record is reduced to an unexplained icon.</span></div>
      </div>
      <p className="demo-status">The broken version uses timeline decoration without chronological evidence, current state, or event identity.</p>
    </div>
  );
}

function TimelineGoodUx() {
  type Order = "newest" | "oldest";
  const [order, setOrder] = useState<Order>("newest");
  const [expanded, setExpanded] = useState("tl-105");
  const [systemOnly, setSystemOnly] = useState(false);
  const [olderLoaded, setOlderLoaded] = useState(false);
  const [showFuture, setShowFuture] = useState(true);
  const [message, setMessage] = useState("Timeline is newest first with future and current milestones labelled separately.");

  const ordered = [
    ...(showFuture ? [timelineFutureEvent] : []),
    ...timelineEvents,
    ...(olderLoaded ? [timelineOlderEvent] : [])
  ]
    .filter((event) => !systemOnly || event.type === "System")
    .sort((a, b) => order === "newest" ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id));

  const toggleEvent = (id: string) => {
    setExpanded((current) => current === id ? "" : id);
    setMessage(`${id} ${expanded === id ? "collapsed" : "expanded"} without changing event order or date grouping.`);
  };

  return (
    <div className="quality-example timeline-demo">
      <div className="timeline-toolbar" id="timeline-ux-label">
        <strong>Benefit claim history</strong>
        <span>{order === "newest" ? "Newest first" : "Oldest first"}</span>
        <span>{systemOnly ? "System filter" : "All event types"}</span>
        <span>{olderLoaded ? "Older range loaded" : "Recent range"}</span>
        {showFuture ? <span>Future milestone visible</span> : null}
      </div>
      <ol className="timeline-list" aria-labelledby="timeline-ux-label">
        {ordered.map((event) => (
          <TimelineItem key={event.id} event={event} expanded={expanded === event.id} onToggle={toggleEvent} />
        ))}
      </ol>
      <div className="demo-row timeline-controls" aria-label="Timeline exercise controls">
        <button type="button" className={order === "newest" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setOrder("newest");
          setMessage("Newest-first order restored, with future expected events still labelled.");
        }}>Newest first</button>
        <button type="button" className={order === "oldest" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setOrder("oldest");
          setMessage("Oldest-first order selected; the order label changed with the sequence.");
        }}>Oldest first</button>
        <button type="button" className="demo-button small" onClick={() => toggleEvent(expanded || "tl-105")}>Expand current</button>
        <button type="button" className={systemOnly ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setSystemOnly((value) => !value);
          setMessage(!systemOnly ? "Filtered to system events and exposed that other date ranges are hidden." : "All event types restored.");
        }}>System filter</button>
        <button type="button" className={olderLoaded ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setOlderLoaded(true);
          setMessage("Older claim history loaded below the current range without losing the expanded event.");
        }}>Load older</button>
        <button type="button" className={showFuture ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setShowFuture((value) => !value);
          setMessage(!showFuture ? "Expected future milestone restored with distinct future labelling." : "Future milestone hidden; visible history remains past and current events only.");
        }}>Future marker</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function TimelineBadUx() {
  type Mode = "noDates" | "futureAsDone" | "auditLoss" | "feedMisuse" | "hiddenRange" | "stepperConfusion";
  const [mode, setMode] = useState<Mode>("noDates");
  const copy: Record<Mode, string> = {
    noDates: "Events have markers but no dates, times, actors, or source labels.",
    futureAsDone: "A future review is styled as completed history and users assume it already happened.",
    auditLoss: "Field-level audit evidence is compressed into a short timeline summary.",
    feedMisuse: "Live stream items are styled as a timeline but still insert unpredictably.",
    hiddenRange: "Filtering hides four date groups without a hidden-range count or restore control.",
    stepperConfusion: "Current form progress is shown as a timeline, so validation and blocked steps disappear."
  };

  return (
    <div className={`quality-example timeline-bad-demo is-${mode}`}>
      <div className="timeline-broken" aria-label="Broken timeline behavior">
        <div><b>{mode === "stepperConfusion" ? "Step 2" : "Update"}</b><span>{copy[mode]}</span></div>
        <div><b>{mode === "futureAsDone" ? "Review scheduled" : "Record"}</b><span>{mode === "auditLoss" ? "Changed fields, actor ID, and export proof are missing." : "Order and event ownership are unclear."}</span></div>
        <div><b>{mode === "feedMisuse" ? "New post just arrived" : "More"}</b><span>{mode === "hiddenRange" ? "Older events vanished under a filter." : "The visual line carries meaning that text does not explain."}</span></div>
      </div>
      <div className="demo-row timeline-controls">
        <button type="button" className={mode === "noDates" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noDates")}>No dates</button>
        <button type="button" className={mode === "futureAsDone" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("futureAsDone")}>Future as done</button>
        <button type="button" className={mode === "auditLoss" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("auditLoss")}>Audit loss</button>
        <button type="button" className={mode === "feedMisuse" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("feedMisuse")}>Feed misuse</button>
        <button type="button" className={mode === "hiddenRange" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenRange")}>Hidden range</button>
        <button type="button" className={mode === "stepperConfusion" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("stepperConfusion")}>Stepper confusion</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <TimelineGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <TimelineBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <TimelineGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <TimelineBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
