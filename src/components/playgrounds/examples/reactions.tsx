import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type ReactionsMode = "default" | "mine" | "picker" | "who" | "custom" | "skinTone" | "overflow" | "notReactable" | "workflow" | "activity";

const reactionModeCopy: Record<ReactionsMode, {
  title: string;
  status: string;
  detail: string;
  warning: string;
}> = {
  default: {
    title: "Message reactions",
    status: "3 reaction types",
    detail: "Reaction chips stay attached to the source message and show counts without creating a reply.",
    warning: "Reactions are informal feedback, not approval or assignment."
  },
  mine: {
    title: "Your reaction selected",
    status: "Your 👍 highlighted",
    detail: "The user's own reaction is highlighted and clicking it removes only that user's reaction.",
    warning: "Count updates after the remove action succeeds."
  },
  picker: {
    title: "Add reaction picker",
    status: "Picker open",
    detail: "Searchable emoji options include accessible names, recent emoji, and custom emoji labels.",
    warning: "The add control is reachable without hover."
  },
  who: {
    title: "Who reacted",
    status: "People visible",
    detail: "The disclosure names Maya, Priya, and Rahul for 👍 while respecting hidden reactor policy.",
    warning: "Counts are not useful if users cannot inspect who reacted."
  },
  custom: {
    title: "Custom emoji reaction",
    status: "Custom label shown",
    detail: "The custom :shipit: emoji has a text label and follows workspace moderation policy.",
    warning: "Custom emoji names need accessible and policy-safe meanings."
  },
  skinTone: {
    title: "Skin tone preserved",
    status: "👋🏽 wave",
    detail: "Skin tone preference is shown in the accessible emoji name and saved per user.",
    warning: "Identity modifiers are part of the reaction label."
  },
  overflow: {
    title: "Reaction overflow grouped",
    status: "+18 collapsed",
    detail: "High-volume reactions collapse while keeping the user's own reaction and workflow-trigger emoji visible.",
    warning: "Reaction storms should not bury comments or message content."
  },
  notReactable: {
    title: "Item not reactable",
    status: "Disabled by policy",
    detail: "A locked compliance message explains why reactions cannot be added.",
    warning: "Disabled reactions need a reason, not a missing control."
  },
  workflow: {
    title: "Workflow-trigger reaction",
    status: "❗ creates ticket",
    detail: "The UI warns that reacting with ❗ will trigger a helpdesk escalation in this channel.",
    warning: "Automation triggers require scope, frequency, and eligibility disclosure."
  },
  activity: {
    title: "Activity feed grouping",
    status: "Grouped reactions",
    detail: "Five low-priority reactions are summarized as one activity event instead of flooding catch-up.",
    warning: "Mentions and failures stay higher priority than reaction bursts."
  }
};

function ReactionsFrame({
  mode = "default",
  idSuffix = "demo",
  reacted = mode === "mine"
}: {
  mode?: ReactionsMode;
  idSuffix?: string;
  reacted?: boolean;
}) {
  const copy = reactionModeCopy[mode];
  const titleId = `reactions-title-${idSuffix}`;
  const locked = mode === "notReactable";
  const workflow = mode === "workflow";
  const reactions = [
    { emoji: "👍", name: "thumbs up", count: reacted ? 7 : 6, mine: reacted, people: "Maya, Priya, Rahul, 3 others" },
    { emoji: "👀", name: "eyes", count: 2, mine: false, people: "Nora and Omar" },
    { emoji: "🚀", name: "rocket", count: 1, mine: false, people: "Build bot" },
    ...(mode === "custom" ? [{ emoji: "🚢", name: "shipit custom emoji", count: 4, mine: true, people: "Release team" }] : []),
    ...(mode === "skinTone" ? [{ emoji: "👋🏽", name: "wave medium skin tone", count: 1, mine: true, people: "You" }] : []),
    ...(workflow ? [{ emoji: "❗", name: "red exclamation workflow trigger", count: 1, mine: false, people: "Escalation policy" }] : [])
  ];
  return (
    <div className={`reactions-frame is-${mode}`}>
      <section className="reactions-message" aria-labelledby={titleId}>
        <div className="reactions-message-head">
          <span>Incident channel</span>
          <strong>{copy.status}</strong>
        </div>
        <h4 id={titleId}>{copy.title}</h4>
        <p>Can someone confirm whether the refund processor recovered after the 09:20 deploy?</p>
        <div className="reactions-chip-row" aria-label="Message reactions">
          {reactions.map((reaction) => (
            <button
              type="button"
              className={`reactions-chip ${reaction.mine ? "is-mine" : ""} ${workflow && reaction.emoji === "❗" ? "is-workflow" : ""}`}
              aria-pressed={reaction.mine}
              aria-label={`${reaction.name}, ${reaction.count} ${reaction.count === 1 ? "reaction" : "reactions"}${reaction.mine ? ", you reacted" : ""}`}
              key={reaction.name}
              disabled={locked}
            >
              <span aria-hidden="true">{reaction.emoji}</span>
              <b>{reaction.count}</b>
            </button>
          ))}
          <button type="button" className="reactions-add" disabled={locked}>Add reaction</button>
          {mode === "overflow" ? <button type="button" className="reactions-overflow">+18</button> : null}
        </div>
        {mode === "picker" ? (
          <div className="reactions-picker" role="listbox" aria-label="Emoji reaction picker">
            {["thumbs up", "eyes", "heart", "rocket", "shipit", "wave medium skin tone"].map((name, index) => (
              <button type="button" className={index === 0 ? "is-active" : ""} key={name}>{name}</button>
            ))}
          </div>
        ) : null}
      </section>
      <aside className="reactions-detail" aria-label="Reaction detail">
        <strong>{mode === "who" ? "Who reacted to 👍" : workflow ? "Workflow warning" : locked ? "Policy state" : "Reaction rule"}</strong>
        <p>{copy.detail}</p>
        {mode === "who" ? (
          <ul>
            <li>Maya Chen</li>
            <li>Priya Shah</li>
            <li>Rahul Patel</li>
          </ul>
        ) : null}
        <div className={workflow || locked ? "reactions-warning is-strong" : "reactions-warning"}>
          <span>{copy.warning}</span>
        </div>
      </aside>
    </div>
  );
}

function ReactionsGoodUi() {
  return (
    <div className="quality-example reactions-demo">
      <ReactionsFrame />
      <p className="demo-status">The reaction row shows emoji names, counts, selected state, add access, and who-reacted disclosure without turning emoji into approval.</p>
    </div>
  );
}

function ReactionsBadUi() {
  return (
    <div className="bad-ui-sample reactions-bad-demo is-hiddenActors">
      <strong>Approved?</strong>
      <div className="reactions-bad-grid">
        {["👍 14", "✅", "No names", "Hover only"].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <p className="demo-status">The broken row makes emoji look like a decision, hides who reacted, and gives no keyboard path to add or remove.</p>
    </div>
  );
}

function ReactionsGoodUx() {
  const [mode, setMode] = useState<ReactionsMode>("default");
  const [reacted, setReacted] = useState(false);
  const [message, setMessage] = useState("Reactions are lightweight feedback attached to the message, with counts and a separate Add reaction path.");
  function choose(nextMode: ReactionsMode, nextMessage: string) {
    setMode(nextMode);
    setMessage(nextMessage);
  }
  return (
    <div className="quality-example reactions-demo">
      <ReactionsFrame mode={mode} idSuffix="good-ux" reacted={reacted || mode === "mine"} />
      <div className="demo-row reactions-controls" aria-label="Reactions exercise controls">
        <button type="button" className={mode === "default" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("default", "Reactions are lightweight feedback attached to the message, with counts and a separate Add reaction path.")}>Default</button>
        <button type="button" className={reacted || mode === "mine" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          const nextReacted = !(reacted || mode === "mine");
          setReacted(nextReacted);
          choose(nextReacted ? "mine" : "default", nextReacted ? "Your thumbs-up is highlighted and can be removed by activating the same chip." : "Your thumbs-up was removed and the count returned to the shared total.");
        }}>{reacted ? "Remove mine" : "React mine"}</button>
        <button type="button" className={mode === "picker" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("picker", "The picker is searchable, named, and reachable without pointer hover.")}>Picker</button>
        <button type="button" className={mode === "who" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("who", "Who-reacted disclosure names visible people and explains hidden identities where needed.")}>Who reacted</button>
        <button type="button" className={mode === "custom" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("custom", "Custom emoji needs a readable label and moderation policy.")}>Custom</button>
        <button type="button" className={mode === "skinTone" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("skinTone", "Skin tone and identity modifiers remain part of the accessible emoji name.")}>Skin tone</button>
        <button type="button" className={mode === "overflow" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("overflow", "Overflow collapses noisy reactions without hiding your own reaction or workflow-trigger emoji.")}>Overflow</button>
        <button type="button" className={mode === "notReactable" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("notReactable", "Locked messages explain why reactions are disabled instead of hiding the control.")}>Not reactable</button>
        <button type="button" className={mode === "workflow" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("workflow", "The ❗ reaction warns that it creates a helpdesk escalation before users rely on it.")}>Workflow</button>
        <button type="button" className={mode === "activity" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("activity", "Activity feed groups low-priority reaction bursts so mentions and failures remain visible.")}>Activity</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function ReactionsBadUx() {
  type Mode = "approvalConfusion" | "hoverOnly" | "hiddenActors" | "surpriseWorkflow" | "inaccessibleEmoji" | "reactionStorm";
  const [mode, setMode] = useState<Mode>("approvalConfusion");
  const copy: Record<Mode, string> = {
    approvalConfusion: "A thumbs-up is treated as formal approval without approver eligibility, version, or audit trail.",
    hoverOnly: "The add reaction control appears only on pointer hover, blocking keyboard and touch users.",
    hiddenActors: "The count says 12 but users cannot inspect who reacted or whether their own reaction is included.",
    surpriseWorkflow: "A casual ❗ reaction silently creates a helpdesk ticket and posts to another channel.",
    inaccessibleEmoji: "A custom emoji has no readable name, so assistive tech exposes only an image and a count.",
    reactionStorm: "Thirty reactions expand under the message and bury the comment that explains the incident."
  };
  const labels: Record<Mode, string[]> = {
    approvalConfusion: ["👍", "Approved", "No audit"],
    hoverOnly: ["Hover", "No tab stop", "No touch path"],
    hiddenActors: ["❤️ 12", "Who?", "Mine?"],
    surpriseWorkflow: ["❗", "Ticket made", "No warning"],
    inaccessibleEmoji: [":party_blob:", "Image", "No name"],
    reactionStorm: ["18 emoji", "12 more", "Comment buried"]
  };
  return (
    <div className={`quality-example reactions-bad-demo is-${mode}`}>
      <strong>{mode === "surpriseWorkflow" ? "Workflow reaction" : mode === "reactionStorm" ? "Reaction storm" : "Broken reactions"}</strong>
      <div className="reactions-bad-grid">
        {labels[mode].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row reactions-controls">
        <button type="button" className={mode === "approvalConfusion" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("approvalConfusion")}>Approval confusion</button>
        <button type="button" className={mode === "hoverOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hoverOnly")}>Hover only</button>
        <button type="button" className={mode === "hiddenActors" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenActors")}>Hidden actors</button>
        <button type="button" className={mode === "surpriseWorkflow" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("surpriseWorkflow")}>Surprise workflow</button>
        <button type="button" className={mode === "inaccessibleEmoji" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("inaccessibleEmoji")}>No emoji name</button>
        <button type="button" className={mode === "reactionStorm" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("reactionStorm")}>Reaction storm</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ReactionsGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ReactionsBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ReactionsGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ReactionsBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
