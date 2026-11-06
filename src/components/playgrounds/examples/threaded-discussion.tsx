import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type ThreadedDiscussionMode = "parent" | "branch" | "unread" | "answer" | "follow" | "mute" | "directLink" | "loadOlder" | "collapse" | "mobile";

function ThreadedDiscussionFrame({
  mode = "parent",
  idSuffix = "demo"
}: {
  mode?: ThreadedDiscussionMode;
  idSuffix?: string;
}) {
  const titleId = `threaded-discussion-title-${idSuffix}`;
  const followed = mode === "follow" || mode === "directLink" || mode === "answer";
  const muted = mode === "mute";
  const answer = mode === "answer";
  const unread = mode === "unread" || mode === "directLink";
  const collapsed = mode === "collapse";
  const older = mode === "loadOlder";
  const mobile = mode === "mobile";
  const branchReplies = [
    { author: "Dana", time: "10:34", body: "Finance can approve release if the surcharge dispute is logged before 15:00.", state: answer ? "Marked answer" : "Reply", depth: 1 },
    { author: "Maya", time: "10:39", body: "I added the dispute note and linked the carrier quote.", state: unread ? "Unread" : "Read", depth: 2 },
    { author: "Priya", time: "10:46", body: "Confirmed. Release can proceed once support posts the customer note.", state: "Nested reply", depth: 2 }
  ];
  return (
    <div className={`threaded-discussion-frame threaded-discussion-surface is-${mode}${mobile ? " is-mobile" : ""}`}>
      <section className="threaded-topic" aria-labelledby={titleId}>
        <div className="threaded-topic-head">
          <span>Q&A discussion</span>
          <strong>{answer ? "Answered" : unread ? "2 unread" : "Open"}</strong>
        </div>
        <h4 id={titleId}>Can we release the shipment before finance confirms the surcharge?</h4>
        <p>Parent topic by Noah Kim. Keep release, finance, and support replies in this thread so the channel stays readable.</p>
        <div className="threaded-topic-stats">
          <span>{older ? "18 replies loaded" : "12 replies"}</span>
          <span>{followed ? "Following thread" : muted ? "Muted thread" : "Not following"}</span>
          <span>{answer ? "Answer highlighted" : "No answer yet"}</span>
        </div>
      </section>
      <section className="threaded-panel" aria-label="Thread replies">
        <div className="threaded-controls-bar">
          <button type="button" className="demo-button small">Reply to topic</button>
          <button type="button" className={followed ? "demo-button small primary" : "demo-button small"}>{followed ? "Following" : "Follow"}</button>
          <button type="button" className={muted ? "demo-button small primary" : "demo-button small"}>{muted ? "Muted" : "Mute"}</button>
        </div>
        {older ? <button type="button" className="threaded-load">Loaded 6 older replies above this boundary</button> : null}
        <article className={`threaded-reply is-depth-0 ${mode === "directLink" ? "is-linked" : ""}`}>
          <div className="threaded-reply-meta">
            <b>Riya</b>
            <time>10:22</time>
            <em>Top-level reply</em>
          </div>
          <p>Finance needs the dispute note before release. I started a branch with the exact requirement.</p>
          <div className="threaded-reply-actions">
            <button type="button" className="demo-button small">Reply</button>
            <button type="button" className="demo-button small">Copy link</button>
            <button type="button" className="demo-button small">Collapse branch</button>
          </div>
        </article>
        <div className={`threaded-branch ${collapsed ? "is-collapsed" : ""}`} aria-label="Finance requirement branch">
          <div className="threaded-branch-head">
            <strong>{collapsed ? "Finance branch collapsed" : "Finance requirement branch"}</strong>
            <span>{collapsed ? "3 replies hidden" : unread ? "1 unread reply" : "3 replies"}</span>
          </div>
          {!collapsed ? branchReplies.map((reply, index) => (
            <article className={`threaded-reply is-depth-${reply.depth} ${reply.state === "Marked answer" ? "is-answer" : ""} ${reply.state === "Unread" ? "is-unread" : ""}`} key={`${reply.author}-${index}`}>
              <div className="threaded-reply-meta">
                <b>{reply.author}</b>
                <time>{reply.time}</time>
                <em>{reply.state}</em>
              </div>
              <p>{reply.body}</p>
              <div className="threaded-reply-actions">
                <button type="button" className="demo-button small">Reply to {reply.author}</button>
                <button type="button" className="demo-button small">{reply.state === "Marked answer" ? "Unmark answer" : "Mark answer"}</button>
              </div>
            </article>
          )) : null}
        </div>
        <form className="threaded-composer" aria-label="Thread reply composer">
          <label htmlFor={`threaded-reply-${idSuffix}`}>Replying to {mode === "branch" || mode === "answer" ? "Dana's branch" : "parent topic"}</label>
          <textarea id={`threaded-reply-${idSuffix}`} value={mode === "branch" ? "Draft: support will update the customer note after finance confirms." : ""} readOnly placeholder="Add a thread reply" rows={3} />
          <label className="threaded-broadcast"><input type="checkbox" readOnly checked={mode === "branch"} /> Also send to main channel</label>
        </form>
      </section>
    </div>
  );
}

function ThreadedDiscussionGoodUi() {
  return (
    <div className="quality-example threaded-discussion-demo">
      <ThreadedDiscussionFrame />
      <p className="demo-status">The discussion keeps a parent topic visible, shows branch context, and separates thread-level follow and mute controls from reply actions.</p>
    </div>
  );
}

function ThreadedDiscussionBadUi() {
  return (
    <div className="bad-ui-sample threaded-discussion-bad-demo is-flatReplies">
      <strong>Replies</strong>
      <div className="threaded-discussion-bad-grid">
        {["Can release?", "Finance says maybe", "I agree", "What quote?", "Resolved?", "New reply"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p className="demo-status">The broken surface is a flat pile of replies with no parent topic, branch target, unread location, or answer state.</p>
    </div>
  );
}

function ThreadedDiscussionGoodUx() {
  const [mode, setMode] = useState<ThreadedDiscussionMode>("parent");
  const [message, setMessage] = useState("The parent topic stays visible while users read and reply inside the branch.");
  function choose(nextMode: ThreadedDiscussionMode, nextMessage: string) {
    setMode(nextMode);
    setMessage(nextMessage);
  }
  return (
    <div className="quality-example threaded-discussion-demo">
      <ThreadedDiscussionFrame mode={mode} idSuffix="good-ux" />
      <div className="demo-row threaded-discussion-controls" aria-label="Threaded discussion exercise controls">
        <button type="button" className={mode === "parent" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("parent", "Parent topic context remains visible before users reply.")}>Parent</button>
        <button type="button" className={mode === "branch" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("branch", "Branch reply targets Dana's reply and can optionally broadcast back to the channel.")}>Branch reply</button>
        <button type="button" className={mode === "unread" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("unread", "Unread state identifies the changed branch, not just the whole discussion.")}>Unread branch</button>
        <button type="button" className={mode === "answer" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("answer", "A nested reply can be marked as the answer and remains visible in the branch.")}>Mark answer</button>
        <button type="button" className={mode === "follow" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("follow", "Follow changes notification state for this thread without changing the channel.")}>Follow</button>
        <button type="button" className={mode === "mute" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("mute", "Mute stops thread reply notifications without hiding the discussion.")}>Mute</button>
        <button type="button" className={mode === "directLink" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("directLink", "A direct reply link highlights the target while preserving parent topic context.")}>Direct link</button>
        <button type="button" className={mode === "loadOlder" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("loadOlder", "Older replies load above a named boundary without moving the active branch.")}>Load older</button>
        <button type="button" className={mode === "collapse" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("collapse", "Collapsed branches keep reply count and topic context visible.")}>Collapse</button>
        <button type="button" className={mode === "mobile" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("mobile", "Mobile mode reduces indentation and keeps quoted branch context readable.")}>Mobile depth</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function ThreadedDiscussionBadUx() {
  type Mode = "flatReplies" | "lostParent" | "hiddenAnswer" | "unreadWhole" | "deepIndent" | "wrongAction";
  const [mode, setMode] = useState<Mode>("flatReplies");
  const copy: Record<Mode, string> = {
    flatReplies: "Replies are flattened into chronological order, so users cannot tell who answered whom.",
    lostParent: "A direct link opens a reply without the original topic or parent message context.",
    hiddenAnswer: "The marked answer is inside a collapsed branch and the topic still looks unresolved.",
    unreadWhole: "Unread count applies to the whole thread but does not identify the changed branch.",
    deepIndent: "Nested replies keep indenting until mobile users can read only a few words per line.",
    wrongAction: "Mute and resolve controls affect the whole channel instead of this thread."
  };
  const cells: Record<Mode, string[]> = {
    flatReplies: ["Riya 10:22", "Dana 10:34", "Maya 10:39"],
    lostParent: ["Reply only", "No topic", "No branch"],
    hiddenAnswer: ["Collapsed", "Answer hidden", "Still open"],
    unreadWhole: ["Thread unread", "12 replies", "Which one?"],
    deepIndent: ["Level 1", "Level 2", "Level 5"],
    wrongAction: ["Mute channel", "Resolve all", "Reply moved"]
  };
  return (
    <div className={`quality-example threaded-discussion-bad-demo is-${mode}`}>
      <strong>{mode === "lostParent" ? "Linked reply" : mode === "hiddenAnswer" ? "Collapsed branch" : "Discussion replies"}</strong>
      <div className="threaded-discussion-bad-grid">
        {cells[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row threaded-discussion-controls">
        <button type="button" className={mode === "flatReplies" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("flatReplies")}>Flat replies</button>
        <button type="button" className={mode === "lostParent" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("lostParent")}>Lost parent</button>
        <button type="button" className={mode === "hiddenAnswer" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenAnswer")}>Hidden answer</button>
        <button type="button" className={mode === "unreadWhole" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("unreadWhole")}>Unread whole</button>
        <button type="button" className={mode === "deepIndent" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("deepIndent")}>Deep indent</button>
        <button type="button" className={mode === "wrongAction" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("wrongAction")}>Wrong action</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ThreadedDiscussionGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ThreadedDiscussionBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ThreadedDiscussionGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ThreadedDiscussionBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
