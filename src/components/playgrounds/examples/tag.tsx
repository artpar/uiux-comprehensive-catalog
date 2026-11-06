import { useState, type ReactNode } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type TagState = "pending" | "approved" | "needsEvidence" | "stale";

const tagRows: Array<{
  id: string;
  title: string;
  owner: string;
  category: string;
  source: string;
  status: TagState;
}> = [
  {
    id: "claim-1842",
    title: "Claim 1842",
    owner: "Mina Patel",
    category: "Disability",
    source: "Uploaded by you",
    status: "pending"
  },
  {
    id: "claim-1907",
    title: "Claim 1907",
    owner: "Iris Chen",
    category: "Education",
    source: "Form",
    status: "approved"
  },
  {
    id: "claim-2031",
    title: "Claim 2031",
    owner: "Owen Diaz",
    category: "Medical record",
    source: "Scanned",
    status: "needsEvidence"
  }
];

const tagStatusCopy: Record<TagState, { label: string; tone: string; sr: string }> = {
  pending: {
    label: "Pending review",
    tone: "info",
    sr: "Status, pending review"
  },
  approved: {
    label: "Approved",
    tone: "success",
    sr: "Status, approved"
  },
  needsEvidence: {
    label: "Needs evidence",
    tone: "warning",
    sr: "Status, needs evidence"
  },
  stale: {
    label: "Pending review",
    tone: "stale",
    sr: "Status, pending review, stale"
  }
};

function TagPill({
  children,
  tone = "neutral",
  statusText
}: {
  children: ReactNode;
  tone?: string;
  statusText?: string;
}) {
  return (
    <span className={`tag-pill is-${tone}`}>
      {statusText ? <span className="sr-only">{statusText}: </span> : null}
      {children}
    </span>
  );
}

function TagQueue({
  primaryStatus = "pending",
  tooMany = false,
  stale = false
}: {
  primaryStatus?: TagState;
  tooMany?: boolean;
  stale?: boolean;
}) {
  const rows = tagRows.map((row, index) => {
    const status = index === 0 ? (stale ? "stale" : primaryStatus) : row.status;
    const statusMeta = tagStatusCopy[status];
    const extraTags = tooMany ? ["West", "Priority 2", "Phone", "Appeal", "Manual", "Escalated"] : [];

    return (
      <article key={row.id} className={`tag-row ${index === 0 ? "is-current" : ""}`}>
        <div className="tag-row-main">
          <strong>{row.title}</strong>
          <span>{row.owner}</span>
        </div>
        <div className="tag-stack" aria-label={`${row.title} labels`}>
          <TagPill tone="neutral">{row.category}</TagPill>
          <TagPill tone="neutral">{row.source}</TagPill>
          <TagPill tone={statusMeta.tone} statusText={statusMeta.sr}>{statusMeta.label}</TagPill>
          {extraTags.map((label) => <TagPill key={label} tone="neutral">{label}</TagPill>)}
        </div>
      </article>
    );
  });

  return <div className="tag-queue">{rows}</div>;
}

function TagGoodUi() {
  return (
    <div className="quality-example tag-demo">
      <TagQueue />
      <p className="demo-status">Static category tags and semantic status tags stay attached to each claim row without looking clickable or replacing the row title.</p>
    </div>
  );
}

function TagBadUi() {
  return (
    <div className="bad-ui-sample tag-bad-demo is-buttonLike">
      <div className="tag-bad-row">
        <span className="tag-pill is-danger fake-control">Click to approve</span>
        <span className="tag-pill is-success fake-control">Open</span>
        <span className="tag-pill is-warning fake-control">Fix now</span>
      </div>
      <p className="demo-status">The broken tags use verbs, button-like styling, and action promises, but they are still static text.</p>
    </div>
  );
}

function TagGoodUx() {
  const [primaryStatus, setPrimaryStatus] = useState<TagState>("pending");
  const [tooMany, setTooMany] = useState(false);
  const [stale, setStale] = useState(false);
  const [message, setMessage] = useState("Claim 1842 has neutral category tags and a current Pending review status tag.");

  return (
    <div className="quality-example tag-demo">
      <TagQueue primaryStatus={primaryStatus} tooMany={tooMany} stale={stale} />
      <div className="demo-row tag-controls" aria-label="Tag exercise controls">
        <button type="button" className={primaryStatus === "pending" && !stale ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setPrimaryStatus("pending");
          setStale(false);
          setMessage("Claim 1842 is back to Pending review and the status tag matches the row detail.");
        }}>Pending</button>
        <button type="button" className={primaryStatus === "approved" && !stale ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setPrimaryStatus("approved");
          setStale(false);
          setMessage("Status updated to Approved with success styling and stable row placement.");
        }}>Approve</button>
        <button type="button" className={primaryStatus === "needsEvidence" && !stale ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setPrimaryStatus("needsEvidence");
          setStale(false);
          setMessage("Status updated to Needs evidence, making the priority visible without turning the tag into an alert.");
        }}>Needs evidence</button>
        <button type="button" className={stale ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setStale((current) => !current);
          setMessage(stale ? "Stale marker cleared after the row status was reconciled with the source record." : "Stale review state shows that the visible tag no longer proves the canonical workflow state.");
        }}>Toggle stale</button>
        <button type="button" className={tooMany ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setTooMany((current) => !current);
          setMessage(tooMany ? "Extra metadata tags removed so the row is scannable again." : "Too many tags crowd the row; this should move to columns, filters, or details.");
        }}>Tag limit</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function TagBadUx() {
  type Mode = "buttonLike" | "colorOnly" | "filterChip" | "titleTag" | "messageReplacement" | "tagCloud";
  const [mode, setMode] = useState<Mode>("buttonLike");
  const copy: Record<Mode, string> = {
    buttonLike: "Static tags look like controls, so users expect click, focus, and keyboard behavior that does not exist.",
    colorOnly: "The tag text stays vague while color carries the real status meaning.",
    filterChip: "An active filter is rendered as a static tag with no clear remove or clear-all control.",
    titleTag: "The tag is used as the object title, so the actual record identity disappears.",
    messageReplacement: "A one-word tag replaces the inline reason and recovery action users need.",
    tagCloud: "Every metadata field becomes a tag, making the row harder to scan than plain columns."
  };

  return (
    <div className={`quality-example tag-bad-demo is-${mode}`}>
      <div className="tag-bad-row" aria-label="Broken tag example">
        {mode === "tagCloud" ? (
          ["Claim", "West", "Phone", "Appeal", "P2", "Aged", "Manual", "Queue", "Team"].map((label) => <span key={label} className="tag-pill is-neutral">{label}</span>)
        ) : mode === "colorOnly" ? (
          <>
            <span className="tag-pill is-success">Level 1</span>
            <span className="tag-pill is-warning">Level 1</span>
            <span className="tag-pill is-danger">Level 1</span>
          </>
        ) : mode === "filterChip" ? (
          <>
            <span className="tag-pill is-neutral">Status: denied</span>
            <span className="tag-pill is-neutral">Owner: me</span>
          </>
        ) : mode === "titleTag" ? (
          <span className="tag-pill is-info fake-title">Claim 1842</span>
        ) : mode === "messageReplacement" ? (
          <span className="tag-pill is-warning">Blocked</span>
        ) : (
          <>
            <span className="tag-pill is-danger fake-control">Approve</span>
            <span className="tag-pill is-warning fake-control">Escalate</span>
          </>
        )}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row tag-controls">
        <button type="button" className={mode === "buttonLike" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("buttonLike")}>Button-like</button>
        <button type="button" className={mode === "colorOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("colorOnly")}>Color only</button>
        <button type="button" className={mode === "filterChip" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("filterChip")}>Filter chip</button>
        <button type="button" className={mode === "titleTag" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("titleTag")}>Title tag</button>
        <button type="button" className={mode === "messageReplacement" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("messageReplacement")}>Message replacement</button>
        <button type="button" className={mode === "tagCloud" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("tagCloud")}>Tag cloud</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <TagGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <TagBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <TagGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <TagBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
