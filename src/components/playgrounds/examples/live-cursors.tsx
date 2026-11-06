import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type LiveCursorsMode = "pointer" | "caret" | "selection" | "chat" | "follow" | "hideMine" | "reduced" | "stale" | "disconnected" | "privacy" | "transform";

function LiveCursorsFrame({
  mode = "pointer",
  idSuffix = "demo"
}: {
  mode?: LiveCursorsMode;
  idSuffix?: string;
}) {
  const titleId = `live-cursors-title-${idSuffix}`;
  const reduced = mode === "reduced";
  const hideMine = mode === "hideMine";
  const stale = mode === "stale";
  const disconnected = mode === "disconnected";
  const privacy = mode === "privacy";
  const transform = mode === "transform";
  const follow = mode === "follow";
  const chat = mode === "chat";
  const caret = mode === "caret";
  const selection = mode === "selection";
  const status = disconnected ? "Disconnected" : stale ? "Stale cursor" : privacy ? "Hidden region" : follow ? "Following Dana" : "Live awareness";
  return (
    <div className={`live-cursors-frame live-cursors-surface is-${mode}`}>
      <section className="live-cursors-canvas" aria-labelledby={titleId}>
        <div className="live-cursors-toolbar">
          <span>Shared canvas</span>
          <strong>{status}</strong>
          <span>{transform ? "Zoom 125%" : "Zoom 100%"}</span>
        </div>
        <h4 id={titleId}>Refund flow map</h4>
        <div className={`live-cursors-board ${reduced ? "is-reduced" : ""} ${transform ? "is-transformed" : ""}`}>
          <div className="flow-node node-a">Start refund</div>
          <div className={`flow-node node-b ${selection ? "is-selected" : ""}`}>Review exception</div>
          <div className="flow-node node-c">Notify customer</div>
          <div className="flow-line line-a" />
          <div className="flow-line line-b" />
          {!hideMine ? (
            <div className="local-cursor" style={{ left: "13%", top: "72%" }}>
              <span />
              <b>You</b>
            </div>
          ) : null}
          {!reduced ? (
            <div className={`remote-cursor cursor-priya ${stale ? "is-stale" : ""} ${disconnected ? "is-disconnected" : ""}`} style={{ left: transform ? "48%" : "42%", top: transform ? "33%" : "28%" }}>
              <span />
              <b>Priya</b>
              <small>{stale ? "last update 18s" : disconnected ? "offline" : "live"}</small>
            </div>
          ) : null}
          {!privacy && !reduced ? (
            <div className={`remote-cursor cursor-dana ${follow ? "is-followed" : ""}`} style={{ left: "67%", top: "58%" }}>
              <span />
              <b>Dana</b>
              <small>{follow ? "followed" : "live"}</small>
            </div>
          ) : null}
          {caret ? (
            <div className="remote-caret" style={{ left: "56%", top: "46%" }}>
              <span />
              <b>Maya editing label</b>
            </div>
          ) : null}
          {selection ? (
            <div className="remote-selection">Dana selected Review exception</div>
          ) : null}
          {chat ? (
            <div className="cursor-chat" style={{ left: "59%", top: "16%" }}>Try the shorter handoff path?</div>
          ) : null}
          {privacy ? (
            <div className="privacy-zone">Restricted area: pointer hidden</div>
          ) : null}
          {reduced ? (
            <div className="reduced-cursors">3 collaborator cursors hidden. Follow one person to show detail.</div>
          ) : null}
        </div>
      </section>
      <section className="live-cursors-detail" aria-label="Cursor awareness state">
        <div className="live-cursors-card">
          <span>{status}</span>
          <strong>{privacy ? "Private region is masked before broadcasting." : stale ? "Cursor fades when awareness is old." : disconnected ? "Remote cursor is removed after disconnect." : transform ? "Coordinates are mapped through zoom and pan." : follow ? "Viewport follows Dana without stealing edit focus." : "Pointer state is ephemeral, not document history."}</strong>
          <p>{chat ? "Cursor chat is temporary until someone converts it to a comment." : "Cursor payload carries identity, coordinates, target, freshness, and visibility preference."}</p>
        </div>
        <div className="live-cursors-facts">
          <span>{hideMine ? "Your pointer hidden" : "Your pointer visible"}</span>
          <span>{reduced ? "Reduced mode" : "Labels visible"}</span>
          <span>{transform ? "Transform synced" : "Canvas anchored"}</span>
        </div>
      </section>
    </div>
  );
}

function LiveCursorsGoodUi() {
  return (
    <div className="quality-example live-cursors-demo">
      <LiveCursorsFrame />
      <p className="demo-status">The shared canvas shows labelled remote cursors, local pointer visibility, freshness, and coordinate anchoring without blocking the flow nodes.</p>
    </div>
  );
}

function LiveCursorsBadUi() {
  return (
    <div className="bad-ui-sample live-cursors-bad-demo is-colorOnly">
      <strong>Shared board</strong>
      <div className="live-cursors-bad-board">
        <span className="bad-pointer one">▲</span>
        <span className="bad-pointer two">▲</span>
        <span className="bad-pointer three">▲</span>
        <b>Approve refund</b>
      </div>
      <p className="demo-status">The broken UI shows unlabeled colored pointers that cover controls and give no owner, freshness, privacy, or hide behavior.</p>
    </div>
  );
}

function LiveCursorsGoodUx() {
  const [mode, setMode] = useState<LiveCursorsMode>("pointer");
  const [message, setMessage] = useState("Remote pointers are labelled, live, and anchored to the shared canvas.");
  function choose(nextMode: LiveCursorsMode, nextMessage: string) {
    setMode(nextMode);
    setMessage(nextMessage);
  }
  return (
    <div className="quality-example live-cursors-demo">
      <LiveCursorsFrame mode={mode} idSuffix="good-ux" />
      <div className="demo-row live-cursors-controls" aria-label="Live cursors exercise controls">
        <button type="button" className={mode === "pointer" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("pointer", "Remote pointers are labelled, live, and anchored to the shared canvas.")}>Pointer</button>
        <button type="button" className={mode === "caret" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("caret", "Remote text caret shows where Maya is editing without changing the saved text.")}>Text caret</button>
        <button type="button" className={mode === "selection" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("selection", "Object selection awareness shows Dana's selected node without becoming a comment.")}>Selection</button>
        <button type="button" className={mode === "chat" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("chat", "Cursor chat is temporary unless converted into durable feedback.")}>Cursor chat</button>
        <button type="button" className={mode === "follow" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("follow", "Follow mode tracks Dana's pointer intentionally without stealing editing focus.")}>Follow</button>
        <button type="button" className={mode === "hideMine" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("hideMine", "Hide my pointer stops broadcasting your location while keeping the canvas usable.")}>Hide mine</button>
        <button type="button" className={mode === "reduced" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("reduced", "Reduced mode hides extra cursors and offers a calmer focus state.")}>Reduce</button>
        <button type="button" className={mode === "stale" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("stale", "Stale cursors fade and show last update rather than freezing as live.")}>Stale</button>
        <button type="button" className={mode === "disconnected" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("disconnected", "Disconnected collaborator cursors are marked offline and removed after timeout.")}>Disconnected</button>
        <button type="button" className={mode === "privacy" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("privacy", "Privacy-hidden regions mask pointer location before broadcasting.")}>Privacy</button>
        <button type="button" className={mode === "transform" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("transform", "Transformed canvas state keeps cursor coordinates aligned after zoom and pan.")}>Transform</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function LiveCursorsBadUx() {
  type Mode = "frozen" | "unlabeled" | "blocking" | "privacyLeak" | "historyNoise" | "offset";
  const [mode, setMode] = useState<Mode>("frozen");
  const copy: Record<Mode, string> = {
    frozen: "A disconnected cursor freezes on the canvas and still looks live.",
    unlabeled: "Three colored arrows have no names, roles, labels, or screen-reader equivalent.",
    blocking: "Cursor labels cover the exact handle a user is trying to edit.",
    privacyLeak: "An external user's pointer reveals interest in a restricted region.",
    historyNoise: "Every cursor move is added to notifications and the activity log.",
    offset: "After zooming, the remote cursor points at the wrong object."
  };
  const cells: Record<Mode, string[]> = {
    frozen: ["Priya live?", "No timeout", "Frozen arrow"],
    unlabeled: ["Blue", "Green", "Purple"],
    blocking: ["Label over button", "Cannot click", "No reduce mode"],
    privacyLeak: ["Private block", "Pointer shown", "Guest visible"],
    historyNoise: ["Moved cursor", "Moved cursor", "Moved cursor"],
    offset: ["Zoom 125%", "Cursor shifted", "Wrong node"]
  };
  return (
    <div className={`quality-example live-cursors-bad-demo is-${mode}`}>
      <strong>{mode === "historyNoise" ? "Cursor event log" : mode === "offset" ? "Zoomed canvas" : "Live cursor layer"}</strong>
      <div className="live-cursors-bad-grid">
        {cells[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row live-cursors-controls">
        <button type="button" className={mode === "frozen" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("frozen")}>Frozen</button>
        <button type="button" className={mode === "unlabeled" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("unlabeled")}>Unlabeled</button>
        <button type="button" className={mode === "blocking" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("blocking")}>Blocking</button>
        <button type="button" className={mode === "privacyLeak" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("privacyLeak")}>Privacy leak</button>
        <button type="button" className={mode === "historyNoise" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("historyNoise")}>History noise</button>
        <button type="button" className={mode === "offset" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("offset")}>Offset</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <LiveCursorsGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <LiveCursorsBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <LiveCursorsGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <LiveCursorsBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
