import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type LongPressMode =
  | "idle"
  | "hint"
  | "down"
  | "progress"
  | "threshold"
  | "releaseCancel"
  | "movementCancel"
  | "contextMenu"
  | "selection"
  | "preview"
  | "dragPickup"
  | "disabled"
  | "destructive"
  | "keyboard"
  | "screenReader"
  | "mobile";

type LongPressBadMode =
  | "hiddenOnly"
  | "slowTapMisfire"
  | "noCancel"
  | "scrollConflict"
  | "requiredTooltip"
  | "destructiveCommit"
  | "noEquivalent";

const longPressGoodLabels: Array<[LongPressMode, string]> = [
  ["idle", "Idle target"],
  ["hint", "Gesture hint"],
  ["down", "Press down"],
  ["progress", "Hold progress"],
  ["threshold", "Threshold reached"],
  ["releaseCancel", "Release cancel"],
  ["movementCancel", "Movement cancel"],
  ["contextMenu", "Context menu"],
  ["selection", "Selection mode"],
  ["preview", "Preview"],
  ["dragPickup", "Drag pickup"],
  ["disabled", "Disabled action"],
  ["destructive", "Destructive handoff"],
  ["keyboard", "Keyboard path"],
  ["screenReader", "Screen reader action"],
  ["mobile", "Mobile compact"]
];

const longPressBadLabels: Array<[LongPressBadMode, string]> = [
  ["hiddenOnly", "Hidden-only"],
  ["slowTapMisfire", "Slow tap misfire"],
  ["noCancel", "No cancel"],
  ["scrollConflict", "Scroll conflict"],
  ["requiredTooltip", "Required tooltip"],
  ["destructiveCommit", "Destructive commit"],
  ["noEquivalent", "No equivalent"]
];

function LongPressPanel({ mode, idSuffix }: { mode: LongPressMode; idSuffix: string }) {
  const config: Record<LongPressMode, {
    chip: string;
    title: string;
    progress: string;
    target: string;
    threshold: string;
    destination: string;
    equivalent: string;
    cancel: string;
    result: string;
    tone?: string;
    compact?: boolean;
  }> = {
    idle: {
      chip: "Idle target",
      title: "File tile has visible alternatives",
      progress: "0 ms of 500 ms",
      target: "Budget review.pdf shows name, type, owner, and More actions button.",
      threshold: "No sustained-contact gesture is active.",
      destination: "Long press can open item actions, but tap still opens preview.",
      equivalent: "More actions and keyboard context menu expose the same commands.",
      cancel: "No cancellation needed before touch starts.",
      result: "The target is usable without discovering long press."
    },
    hint: {
      chip: "Gesture hint",
      title: "Touch and hold is taught",
      progress: "Hint animation only",
      target: "Helper text says Touch and hold for actions or use More actions.",
      threshold: "Hint does not cross the hold threshold.",
      destination: "The hint names item actions rather than hiding required work.",
      equivalent: "More actions stays visible beside the tile.",
      cancel: "Hint stops when focus or pointer leaves.",
      result: "Users can discover long press without relying on hover."
    },
    down: {
      chip: "Press down",
      title: "Target feedback starts immediately",
      progress: "120 ms of 500 ms",
      target: "The tile highlights and confirms Budget review.pdf is the target.",
      threshold: "The hold has not reached threshold.",
      destination: "No menu, preview, selection, or drag pickup has started.",
      equivalent: "Tap release still opens the file preview.",
      cancel: "Release now cancels long press and can remain a tap if brief.",
      result: "Press-down feedback identifies the target before commitment."
    },
    progress: {
      chip: "Hold progress",
      title: "Dwell progress is visible",
      progress: "360 ms of 500 ms",
      target: "A hold ring grows around the file tile while contact remains still.",
      threshold: "Movement tolerance is 8 px before cancellation.",
      destination: "The destination is Item actions after threshold.",
      equivalent: "Keyboard users open the same actions with More actions.",
      cancel: "Release or movement beyond tolerance cancels.",
      result: "Users can predict whether long press will fire."
    },
    threshold: {
      chip: "Threshold reached",
      title: "Hold threshold opens actions",
      progress: "500 ms threshold reached",
      target: "Haptic and visual feedback fire once, then contact can lift.",
      threshold: "Threshold reached after sustained still contact.",
      destination: "Context menu opens for Budget review.pdf.",
      equivalent: "Visible More actions opens the same command set.",
      cancel: "Escape or outside tap closes the destination without action.",
      result: "Crossing threshold reveals a named destination."
    },
    releaseCancel: {
      chip: "Release cancel",
      title: "Early release leaves data unchanged",
      progress: "240 ms of 500 ms",
      target: "The hold ring fades and the file remains unchanged.",
      threshold: "Release happened before threshold.",
      destination: "No context menu opens.",
      equivalent: "More actions is still available.",
      cancel: "Release before threshold cancels long press.",
      result: "The product does not treat a slow tap as a command."
    },
    movementCancel: {
      chip: "Movement cancel",
      title: "Scrolling cancels the hold",
      progress: "Moved 14 px before threshold",
      target: "The list scrolls and Budget review.pdf stays unselected.",
      threshold: "Movement exceeded tolerance before dwell threshold.",
      destination: "No selection, preview, or drag pickup starts.",
      equivalent: "The user can use More actions after scrolling stops.",
      cancel: "Movement cancellation wins over long press.",
      result: "Reading and scrolling do not accidentally invoke actions."
    },
    contextMenu: {
      chip: "Context menu",
      title: "Long press opens scoped commands",
      progress: "Threshold complete",
      target: "Budget review.pdf is named at the top of the menu.",
      threshold: "Long press only invokes the menu; it does not run commands.",
      destination: "Context menu shows Copy link, Share, Rename, Delete.",
      equivalent: "Shift+F10 and More actions open the same commands.",
      cancel: "Escape returns focus to the file tile.",
      result: "Long press is an invocation, not a hidden action."
    },
    selection: {
      chip: "Selection mode",
      title: "Long press can enter selection mode",
      progress: "Threshold complete",
      target: "Budget review.pdf becomes selected and a count says 1 selected.",
      threshold: "Selection mode starts after threshold and haptic feedback.",
      destination: "Bulk toolbar shows Move, Share, Delete selected.",
      equivalent: "Checkbox and keyboard selection enter the same mode.",
      cancel: "Clear selection exits without modifying files.",
      result: "Selection scope is visible and reversible."
    },
    preview: {
      chip: "Preview",
      title: "Hold preview is temporary",
      progress: "Threshold complete",
      target: "Preview peeks Budget review.pdf without opening navigation.",
      threshold: "Contact opens preview; lifting closes unless pinned.",
      destination: "Preview surface is non-destructive and short-lived.",
      equivalent: "Preview button opens the same preview for keyboard users.",
      cancel: "Release or Escape closes preview.",
      result: "Long press preview does not replace persistent content."
    },
    dragPickup: {
      chip: "Drag pickup",
      title: "Long press can arm drag pickup",
      progress: "Hold then move",
      target: "The tile lifts after threshold and drag handles become visible.",
      threshold: "Movement before threshold scrolls; movement after threshold drags.",
      destination: "Drop targets appear only after pickup.",
      equivalent: "Move command and reorder controls provide non-gesture paths.",
      cancel: "Return to origin or Escape cancels pickup.",
      result: "Drag pickup is separated from accidental scrolling."
    },
    disabled: {
      chip: "Disabled action",
      title: "Hold explains unavailable action",
      progress: "500 ms threshold reached",
      target: "Locked file still shows More actions and lock reason.",
      threshold: "Long press opens actions but Delete is disabled.",
      destination: "Menu says Delete unavailable: retention policy.",
      equivalent: "Visible action menu shows the same disabled reason.",
      cancel: "Closing the menu changes nothing.",
      result: "Disabled long-press outcomes match visible controls."
    },
    destructive: {
      chip: "Destructive handoff",
      title: "Delete requires explicit review",
      progress: "Threshold complete",
      target: "Budget review.pdf long press reveals Delete but does not run it.",
      threshold: "Hold threshold only reveals actions.",
      destination: "Delete opens confirmation with file name and recovery limits.",
      equivalent: "Action menu Delete uses the same confirmation.",
      cancel: "Cancel keeps the file unchanged.",
      result: "Sustained contact does not commit destructive work."
    },
    keyboard: {
      chip: "Keyboard path",
      title: "Equivalent command path is complete",
      progress: "No hold required",
      target: "Keyboard focus is on Budget review.pdf.",
      threshold: "Long-press threshold is not required for keyboard users.",
      destination: "Shift+F10 or More actions opens the item menu.",
      equivalent: "Selection checkbox and Preview button cover other outcomes.",
      cancel: "Escape closes menu, preview, or selection mode.",
      result: "Keyboard users can reach every long-press outcome.",
      tone: "safe"
    },
    screenReader: {
      chip: "Screen reader action",
      title: "Assistive actions are named",
      progress: "No hold required",
      target: "Screen reader announces Budget review.pdf, actions available.",
      threshold: "Touch exploration does not trigger long press.",
      destination: "Custom actions include Preview, Select, More actions.",
      equivalent: "Visible controls have matching accessible names.",
      cancel: "Dismiss returns to the file tile.",
      result: "Sustained contact is optional for assistive technology.",
      tone: "safe"
    },
    mobile: {
      chip: "Mobile compact",
      title: "Compact layout keeps hints readable",
      progress: "500 ms threshold",
      target: "Tile, hold ring, More actions, and status fit without overlap.",
      threshold: "Large text preserves hold duration and cancellation copy.",
      destination: "Menu stacks under the tile when space is tight.",
      equivalent: "Visible More actions remains reachable.",
      cancel: "Movement tolerance text wraps below the tile.",
      result: "The long-press contract survives small screens.",
      compact: true
    }
  };
  const item = config[mode];
  const titleId = `long-press-title-${idSuffix}`;
  const descId = `long-press-desc-${idSuffix}`;

  return (
    <section className={`long-press-shell is-${mode} ${item.tone ? `is-${item.tone}` : ""} ${item.compact ? "is-compact" : ""}`} aria-labelledby={titleId} aria-describedby={descId}>
      <header className="long-press-header">
        <span>{item.chip}</span>
        <strong id={titleId}>{item.title}</strong>
      </header>
      <div className="long-press-stage" id={descId}>
        <div className="long-press-target" aria-label="Long press file target">
          <span className="long-press-ring" aria-hidden="true" />
          <div>
            <strong>Budget review.pdf</strong>
            <span>{item.target}</span>
          </div>
          <button type="button" className="demo-button small">More actions</button>
        </div>
        <div className="long-press-meter" aria-live="polite">
          <span>{item.progress}</span>
          <strong>{item.threshold}</strong>
        </div>
      </div>
      <div className="long-press-grid" aria-label="Long press evidence">
        <div><span>Hold duration</span><strong>{item.progress}</strong></div>
        <div><span>Threshold</span><strong>{item.threshold}</strong></div>
        <div><span>Destination</span><strong>{item.destination}</strong></div>
        <div><span>Equivalent path</span><strong>{item.equivalent}</strong></div>
        <div><span>Cancel rule</span><strong>{item.cancel}</strong></div>
        <div><span>Status message</span><strong>{item.result}</strong></div>
      </div>
      <p className="demo-status">{item.result}</p>
    </section>
  );
}

function LongPressGoodUi() {
  return (
    <div className="quality-example long-press-demo">
      <LongPressPanel mode="progress" idSuffix="good-ui" />
    </div>
  );
}

function LongPressBadUi() {
  return (
    <div className="bad-ui-sample long-press-bad-ui">
      <section className="long-press-shell bad" aria-label="Broken long press">
        <header className="long-press-header">
          <span>Hidden-only</span>
          <strong>Hold to delete</strong>
        </header>
        <p>The file deletes after sustained contact with no touch and hold hint, hold progress, threshold reached feedback, release cancel, movement cancel, More actions equivalent, undo, confirmation, or screen reader action.</p>
        <div className="long-press-stage bad">
          <div className="long-press-target">
            <div><strong>Budget review.pdf</strong><span>No visible actions. Slow tap may delete.</span></div>
            <span>Hold</span>
          </div>
        </div>
      </section>
      <p className="demo-status">The broken UI turns sustained contact into a hidden destructive command.</p>
    </div>
  );
}

function LongPressGoodUx() {
  const [mode, setMode] = useState<LongPressMode>("idle");
  return (
    <div className="quality-example long-press-demo">
      <div className="demo-row long-press-controls" aria-label="Long press exercise controls">
        {longPressGoodLabels.map(([key, label]) => (
          <button
            type="button"
            key={key}
            className={mode === key ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <LongPressPanel mode={mode} idSuffix="good-ux" />
      <p className="demo-status" aria-live="polite">Long press state: {longPressGoodLabels.find(([key]) => key === mode)?.[1]}.</p>
    </div>
  );
}

function LongPressBadUx() {
  const [mode, setMode] = useState<LongPressBadMode>("hiddenOnly");
  const copy: Record<LongPressBadMode, { title: string; body: string; consequence: string; metric: string }> = {
    hiddenOnly: {
      title: "Hidden-only",
      body: "Selection, preview, and item actions exist only behind a hidden touch and hold.",
      consequence: "Users who do not discover sustained contact cannot complete secondary work.",
      metric: "No hint"
    },
    slowTapMisfire: {
      title: "Slow tap misfire",
      body: "A slow tap crosses the threshold and opens actions when the user intended to open the file.",
      consequence: "Tap and long press are not separated clearly.",
      metric: "Threshold too short"
    },
    noCancel: {
      title: "No cancel",
      body: "Release before threshold and movement beyond tolerance still trigger the hold result.",
      consequence: "Users cannot reverse the gesture before commitment.",
      metric: "No release cancel"
    },
    scrollConflict: {
      title: "Scroll conflict",
      body: "Long press selects the row while the user is trying to scroll the list.",
      consequence: "Reading movement unexpectedly changes selection state.",
      metric: "Movement ignored"
    },
    requiredTooltip: {
      title: "Required tooltip",
      body: "Required instructions are hidden in a press-and-hold tooltip that disappears on release.",
      consequence: "The content is neither persistent nor keyboard reachable.",
      metric: "Wrong surface"
    },
    destructiveCommit: {
      title: "Destructive commit",
      body: "The file deletes as soon as the hold threshold is reached.",
      consequence: "Sustained contact bypasses label, confirmation, and undo.",
      metric: "Deletes on hold"
    },
    noEquivalent: {
      title: "No equivalent",
      body: "Keyboard, screen reader, switch, mouse, and assistive pointer users have no action menu or custom action.",
      consequence: "The long-press outcome excludes users.",
      metric: "Gesture only"
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example long-press-bad-ux is-${mode}`}>
      <div className="demo-row long-press-controls" aria-label="Long press misuse controls">
        {longPressBadLabels.map(([key, label]) => (
          <button
            type="button"
            key={key}
            className={mode === key ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <section className="long-press-shell bad" aria-label={`Long press failure: ${item.title}`}>
        <header className="long-press-header">
          <span>{item.title}</span>
          <strong>{item.metric}</strong>
        </header>
        <p>{item.body}</p>
        <div className="long-press-grid">
          <div><span>Hold duration</span><strong>{mode === "slowTapMisfire" ? "Too short" : "Unclear"}</strong></div>
          <div><span>Threshold</span><strong>{mode === "destructiveCommit" ? "Commits action" : "Hidden"}</strong></div>
          <div><span>Destination</span><strong>{mode === "requiredTooltip" ? "Tooltip" : "Unlabeled"}</strong></div>
          <div><span>Equivalent path</span><strong>{mode === "noEquivalent" || mode === "hiddenOnly" ? "Missing" : "Mismatch"}</strong></div>
          <div><span>Cancel rule</span><strong>{mode === "noCancel" || mode === "scrollConflict" ? "Broken" : "Unknown"}</strong></div>
          <div><span>Status message</span><strong>{item.consequence}</strong></div>
        </div>
      </section>
      <p className="demo-status" aria-live="polite">{item.consequence}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <LongPressGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <LongPressBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <LongPressGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <LongPressBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
