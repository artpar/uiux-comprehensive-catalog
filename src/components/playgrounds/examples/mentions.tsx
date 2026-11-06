import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type MentionsMode = "compose" | "suggestions" | "selected" | "ambiguous" | "permission" | "broad" | "suppressed" | "directLink" | "actionItem" | "removed";

function MentionsFrame({
  mode = "compose",
  idSuffix = "demo"
}: {
  mode?: MentionsMode;
  idSuffix?: string;
}) {
  const titleId = `mentions-title-${idSuffix}`;
  const suggestionOpen = mode === "suggestions" || mode === "ambiguous" || mode === "permission" || mode === "broad";
  const selected = mode === "selected" || mode === "directLink" || mode === "actionItem" || mode === "suppressed";
  const removed = mode === "removed";
  const broad = mode === "broad";
  const permission = mode === "permission";
  const ambiguous = mode === "ambiguous";
  const suppressed = mode === "suppressed";
  const direct = mode === "directLink";
  const actionItem = mode === "actionItem";
  const suggestions = broad
    ? [
      { name: "@channel", handle: "42 members", type: "Broad audience", state: "Requires confirmation" },
      { name: "@here", handle: "19 active", type: "Active members", state: "Available" },
      { name: "@incident-oncall", handle: "5 members", type: "User group", state: "Policy allowed" }
    ]
    : ambiguous
      ? [
        { name: "Alex Kim", handle: "@alex.ops", type: "Person", state: "Incident team" },
        { name: "Alex Kim", handle: "@alex.finance", type: "Person", state: "Finance guest" },
        { name: "Alex King", handle: "@aking", type: "Person", state: "Support" }
      ]
      : [
        { name: "Priya Rao", handle: "@priya", type: "Person", state: "Can view" },
        { name: "Platform on-call", handle: "@platform-oncall", type: "Team", state: "5 members" },
        { name: "Dana Lee", handle: "@dana", type: "Person", state: permission ? "Needs invite" : "Can view" }
      ];
  const tokenLabel = actionItem ? "@Dana Lee" : suppressed ? "@Platform on-call" : "@Priya Rao";
  const notification = permission
    ? "Dana lacks access. Invite, request access, or remove the mention before sending."
    : broad
      ? "@channel will notify 42 members. Confirm before posting."
      : suppressed
        ? "Platform on-call is mentioned, but thread notifications are muted for two members."
        : direct
          ? "Notification opens this exact incident note and highlights the mention."
          : actionItem
            ? "Mention also creates an action item assigned to Dana."
            : selected
              ? "Priya will be notified and linked to this exact note."
              : "Type @ to choose a real recipient before sending.";
  return (
    <div className={`mentions-frame mentions-surface is-${mode}`}>
      <section className="mentions-editor" aria-labelledby={titleId}>
        <div className="mentions-editor-head">
          <span>Private incident note</span>
          <strong>{permission ? "Access warning" : broad ? "Audience warning" : selected ? "Recipient bound" : "Composing"}</strong>
        </div>
        <h4 id={titleId}>Escalation note</h4>
        <div className={`mentions-richtext ${direct ? "is-direct" : ""}`} role="textbox" aria-label="Incident note editor" aria-multiline="true" tabIndex={0}>
          <span>Confirm whether </span>
          {selected || direct || actionItem || suppressed ? <b className="mention-token">{tokenLabel}</b> : removed ? <span className="mention-removed">mention removed</span> : <span className="mention-draft">@</span>}
          <span> should review the refund exception before the customer update.</span>
        </div>
        {suggestionOpen ? (
          <div className="mentions-suggestions" role="listbox" aria-label="Mention suggestions">
            {suggestions.map((item, index) => (
              <button type="button" role="option" aria-selected={index === 0} className={index === 0 ? "is-active" : ""} key={`${item.name}-${item.handle}`}>
                <span className="mention-avatar" aria-hidden="true">{item.name.replace("@", "").charAt(0)}</span>
                <span><b>{item.name}</b><small>{item.handle}</small></span>
                <em>{item.type}</em>
                <strong>{item.state}</strong>
              </button>
            ))}
          </div>
        ) : null}
        <div className="mentions-composer-actions">
          <button type="button" className="demo-button small primary">{broad ? "Confirm and send" : permission ? "Invite and mention" : "Send note"}</button>
          <button type="button" className="demo-button small">{selected ? "Edit mention" : "Cancel"}</button>
          <button type="button" className="demo-button small danger">Remove mention</button>
        </div>
      </section>
      <section className="mentions-outcome" aria-label="Mention delivery state">
        <div className="mentions-delivery-card">
          <span>{actionItem ? "Action item" : broad ? "Broad audience" : permission ? "Access check" : suppressed ? "Suppressed" : "Notification"}</span>
          <strong>{notification}</strong>
          <p>{ambiguous ? "Duplicate names require choosing the exact person before send." : "The token stores recipient ID, visible label, target type, and delivery state."}</p>
        </div>
        <div className="mentions-facts">
          <span>{removed ? "No recipient" : "Stable ID saved"}</span>
          <span>{permission ? "Invite required" : "Access checked"}</span>
          <span>{direct ? "Deep link ready" : "Context linked"}</span>
        </div>
        {actionItem ? (
          <div className="mentions-task">
            <b>Dana Lee</b>
            <span>Action item: Review refund exception by 15:00</span>
            <button type="button" className="demo-button small">Mark done</button>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function MentionsGoodUi() {
  return (
    <div className="quality-example mentions-demo">
      <MentionsFrame mode="suggestions" />
      <p className="demo-status">The mention editor shows caret-scoped suggestions with target type, handle, access state, keyboard highlight, and stable recipient token behavior.</p>
    </div>
  );
}

function MentionsBadUi() {
  return (
    <div className="bad-ui-sample mentions-bad-demo is-plainText">
      <strong>Incident note</strong>
      <p>@alex please handle this. @channel maybe review.</p>
      <div className="mentions-bad-grid">
        <span>No recipient IDs</span>
        <span>No access check</span>
        <span>No audience warning</span>
      </div>
      <p className="demo-status">The broken editor styles @words as attention cues but does not bind a recipient, disambiguate people, validate access, or route notifications.</p>
    </div>
  );
}

function MentionsGoodUx() {
  const [mode, setMode] = useState<MentionsMode>("compose");
  const [message, setMessage] = useState("The composer waits for a real recipient selection before it can notify anyone.");
  function choose(nextMode: MentionsMode, nextMessage: string) {
    setMode(nextMode);
    setMessage(nextMessage);
  }
  return (
    <div className="quality-example mentions-demo">
      <MentionsFrame mode={mode} idSuffix="good-ux" />
      <div className="demo-row mentions-controls" aria-label="Mentions exercise controls">
        <button type="button" className={mode === "compose" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("compose", "The composer waits for a selected target instead of treating every @word as a notification.")}>Trigger @</button>
        <button type="button" className={mode === "suggestions" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("suggestions", "Scoped suggestions show people and teams with handles, target type, and access state.")}>Suggestions</button>
        <button type="button" className={mode === "selected" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("selected", "The selected mention becomes a token bound to a stable recipient ID.")}>Select person</button>
        <button type="button" className={mode === "ambiguous" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("ambiguous", "Duplicate display names require the sender to choose the exact person before sending.")}>Ambiguous name</button>
        <button type="button" className={mode === "permission" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("permission", "Missing access is caught before send with invite, request access, or remove choices.")}>Missing access</button>
        <button type="button" className={mode === "broad" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("broad", "Broad audience mentions show audience size and require confirmation.")}>Broad warn</button>
        <button type="button" className={mode === "suppressed" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("suppressed", "Delivery state explains when notifications are suppressed by thread or preference rules.")}>Suppressed</button>
        <button type="button" className={mode === "directLink" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("directLink", "Mention notifications deep-link to the exact note and highlight the mention context.")}>Deep link</button>
        <button type="button" className={mode === "actionItem" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("actionItem", "When a mention assigns work, the task state is visible outside the sentence.")}>Action item</button>
        <button type="button" className={mode === "removed" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("removed", "Removing a token removes the recipient binding and notification outcome.")}>Remove token</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function MentionsBadUx() {
  type Mode = "plainText" | "wrongPerson" | "noAccess" | "blastAll" | "genericLink" | "fakeAssignment";
  const [mode, setMode] = useState<Mode>("plainText");
  const copy: Record<Mode, string> = {
    plainText: "The editor highlights @text but does not bind a recipient ID or notification target.",
    wrongPerson: "Three Alex users match, but the wrong person is notified without disambiguation.",
    noAccess: "Dana is mentioned in a private note she cannot open, and the sender gets no warning.",
    blastAll: "@channel sends to everyone immediately with no audience size or confirmation step.",
    genericLink: "The notification opens the incident overview instead of the exact mention sentence.",
    fakeAssignment: "The note says @Dana owns it, but no task, owner, due state, or completion path exists."
  };
  const cells: Record<Mode, string[]> = {
    plainText: ["@alex text", "No ID", "No notify"],
    wrongPerson: ["Alex Kim", "Alex Kim", "Picked first"],
    noAccess: ["Private note", "Dana blocked", "No warning"],
    blastAll: ["@channel", "412 people", "Sent now"],
    genericLink: ["Mention alert", "Open record", "Find context"],
    fakeAssignment: ["@Dana", "Owner?", "No task"]
  };
  return (
    <div className={`quality-example mentions-bad-demo is-${mode}`}>
      <strong>{mode === "blastAll" ? "Broadcast note" : mode === "genericLink" ? "Mention notification" : "Mention editor"}</strong>
      <div className="mentions-bad-grid">
        {cells[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row mentions-controls">
        <button type="button" className={mode === "plainText" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("plainText")}>Plain text</button>
        <button type="button" className={mode === "wrongPerson" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("wrongPerson")}>Wrong person</button>
        <button type="button" className={mode === "noAccess" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noAccess")}>No access warn</button>
        <button type="button" className={mode === "blastAll" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("blastAll")}>Blast all</button>
        <button type="button" className={mode === "genericLink" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("genericLink")}>Generic link</button>
        <button type="button" className={mode === "fakeAssignment" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("fakeAssignment")}>Fake assignment</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <MentionsGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <MentionsBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <MentionsGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <MentionsBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
