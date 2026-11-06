import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type TouchGestureMode =
  | "overview"
  | "target"
  | "hint"
  | "down"
  | "preview"
  | "cancel"
  | "commit"
  | "pinchAlt"
  | "scrollConflict"
  | "spacing"
  | "system"
  | "assistive"
  | "landscape";

type TouchGestureBadMode =
  | "gestureOnlyZoom"
  | "hiddenSwipe"
  | "tinyTargets"
  | "scrollHijack"
  | "noCancellation"
  | "systemConflict"
  | "hoverHint";

const touchGestureGoodLabels: Array<[TouchGestureMode, string]> = [
  ["overview", "Touch gesture"],
  ["target", "Tap target"],
  ["hint", "Gesture hint"],
  ["down", "Touch down"],
  ["preview", "Movement preview"],
  ["cancel", "Threshold not met"],
  ["commit", "Committed gesture"],
  ["pinchAlt", "Pinch zoom alternative"],
  ["scrollConflict", "Scroll conflict"],
  ["spacing", "Target spacing"],
  ["system", "System gesture boundary"],
  ["assistive", "Assistive touch path"],
  ["landscape", "Mobile landscape"]
];

const touchGestureBadLabels: Array<[TouchGestureBadMode, string]> = [
  ["gestureOnlyZoom", "Gesture-only zoom"],
  ["hiddenSwipe", "Hidden swipe"],
  ["tinyTargets", "Tiny targets"],
  ["scrollHijack", "Scroll hijack"],
  ["noCancellation", "No cancellation"],
  ["systemConflict", "System conflict"],
  ["hoverHint", "Hover hint"]
];

function TouchGesturePanel({ mode, idSuffix }: { mode: TouchGestureMode; idSuffix: string }) {
  const config: Record<TouchGestureMode, {
    chip: string;
    title: string;
    surface: string;
    feedback: string;
    alternative: string;
    state: string;
    result: string;
    tone?: string;
    compact?: boolean;
  }> = {
    overview: {
      chip: "Touch gesture",
      title: "Gallery gesture contract",
      surface: "Swipe changes photo, pinch zooms, drag pans after zoom, tap controls remain visible.",
      feedback: "Start, move, threshold, cancel, commit, and reset states are explicit.",
      alternative: "Previous, Next, Zoom in, Zoom out, and Reset buttons.",
      state: "Gesture and controls available",
      result: "The gesture is useful but not required."
    },
    target: {
      chip: "Tap target",
      title: "Readable touch targets",
      surface: "Previous, Next, Zoom, Reset, and Details controls keep clear spacing.",
      feedback: "Pressed state names the active control before activation.",
      alternative: "The same functions are reachable through keyboard focus.",
      state: "Target size and spacing checked",
      result: "Accidental adjacent activation is reduced."
    },
    hint: {
      chip: "Gesture hint",
      title: "Discoverable gesture",
      surface: "A short hint says Swipe or use Next, and pinch or use Zoom controls.",
      feedback: "Hint appears as text, not hover-only help.",
      alternative: "Visible controls sit next to the gesture surface.",
      state: "Gesture hint visible",
      result: "Users do not need to guess hidden gestures."
    },
    down: {
      chip: "Touch down",
      title: "Gesture starts on intended region",
      surface: "Touch starts inside the photo canvas, not on toolbar, caption, or browser edge.",
      feedback: "Canvas highlights the active object and locks the gesture region.",
      alternative: "Toolbar controls remain separate.",
      state: "Start target identified",
      result: "Unrelated content does not start the gesture."
    },
    preview: {
      chip: "Movement preview",
      title: "Threshold preview before commit",
      surface: "Photo follows the finger 38 px and previews Next photo only after threshold.",
      feedback: "Distance, direction, and next outcome are visible while moving.",
      alternative: "Next button previews the same destination.",
      state: "Below commit threshold",
      result: "Users can see what will happen before release."
    },
    cancel: {
      chip: "Threshold not met",
      title: "Gesture canceled cleanly",
      surface: "Swipe returns under threshold before release.",
      feedback: "Photo snaps back and position stays 2 of 5.",
      alternative: "Cancel or Escape leaves the same unchanged state.",
      state: "Canceled",
      result: "The model remains unchanged when the gesture is canceled.",
      tone: "safe"
    },
    commit: {
      chip: "Committed gesture",
      title: "Gesture commits after release",
      surface: "Swipe crosses threshold and releases over the canvas.",
      feedback: "Position updates to 3 of 5 and status announces Next photo.",
      alternative: "Next button produces the same result.",
      state: "Committed",
      result: "Commit happens at a clear release boundary."
    },
    pinchAlt: {
      chip: "Pinch zoom alternative",
      title: "Multipoint gesture has controls",
      surface: "Pinch zoom changes scale from 100% to 160%.",
      feedback: "Zoom percent and pan boundary are shown.",
      alternative: "Zoom in, Zoom out, and Reset work with one pointer.",
      state: "Single-pointer alternative available",
      result: "Pinch is not the only way to zoom."
    },
    scrollConflict: {
      chip: "Scroll conflict",
      title: "Scroll and swipe priority is defined",
      surface: "Vertical movement scrolls captions; horizontal movement on the image changes photo.",
      feedback: "Diagonal movement below angle threshold keeps scrolling.",
      alternative: "Page controls handle navigation without gesture.",
      state: "Conflict resolved",
      result: "A short diagonal scroll does not trigger a swipe action."
    },
    spacing: {
      chip: "Target spacing",
      title: "Adjacent controls avoid mis-tap",
      surface: "Zoom, Reset, and Details controls have enough size and separation.",
      feedback: "Pressed state stays inside the selected control.",
      alternative: "Equivalent controls are available in the overflow menu.",
      state: "Spacing checked",
      result: "Touch users can activate the intended control."
    },
    system: {
      chip: "System gesture boundary",
      title: "Edge gesture is reserved",
      surface: "The carousel does not capture the first 24 px edge-back zone.",
      feedback: "A visible Next control replaces edge-only navigation.",
      alternative: "Browser and OS gestures stay available.",
      state: "System boundary respected",
      result: "The app does not override platform navigation.",
      tone: "safe"
    },
    assistive: {
      chip: "Assistive touch path",
      title: "Screen reader and pointer path",
      surface: "Controls expose names: Previous photo, Next photo, Zoom in, Reset zoom.",
      feedback: "Status text announces zoom and photo position.",
      alternative: "Switch, keyboard, and single-pointer users can complete the same task.",
      state: "Assistive path available",
      result: "Gesture outcomes do not depend on simultaneous fingers."
    },
    landscape: {
      chip: "Mobile landscape",
      title: "Gesture still works in compact height",
      surface: "Canvas, caption, controls, and status fit without overlapping.",
      feedback: "Controls stay reachable outside the system gesture areas.",
      alternative: "Buttons wrap under the canvas.",
      state: "Landscape checked",
      result: "The gesture contract survives rotation.",
      compact: true
    }
  };
  const item = config[mode];
  const titleId = `touch-gesture-title-${idSuffix}`;
  const descId = `touch-gesture-desc-${idSuffix}`;

  return (
    <section className={`touch-gesture-shell is-${mode} ${item.tone ? `is-${item.tone}` : ""} ${item.compact ? "is-compact" : ""}`} aria-labelledby={titleId} aria-describedby={descId}>
      <header className="touch-gesture-header">
        <span>{item.chip}</span>
        <strong id={titleId}>{item.title}</strong>
      </header>
      <div className="touch-gesture-device" id={descId}>
        <div className="touch-gesture-canvas" aria-label="Photo gesture surface">
          <span className="touch-gesture-finger" aria-hidden="true" />
          <strong>Photo 2 of 5</strong>
          <p>{item.surface}</p>
        </div>
        <div className="touch-gesture-controls" aria-label="Equivalent gesture controls">
          <button type="button" className="demo-button small">Previous</button>
          <button type="button" className="demo-button small primary">Next</button>
          <button type="button" className="demo-button small">Zoom in</button>
          <button type="button" className="demo-button small">Reset</button>
        </div>
      </div>
      <div className="touch-gesture-grid" aria-label="Touch gesture evidence">
        <div><span>Feedback</span><strong>{item.feedback}</strong></div>
        <div><span>Alternative</span><strong>{item.alternative}</strong></div>
        <div><span>State</span><strong>{item.state}</strong></div>
        <div><span>Result</span><strong>{item.result}</strong></div>
      </div>
      <p className="demo-status">{item.result}</p>
    </section>
  );
}

function TouchGestureGoodUi() {
  return (
    <div className="quality-example touch-gesture-demo">
      <TouchGesturePanel mode="overview" idSuffix="good-ui" />
    </div>
  );
}

function TouchGestureBadUi() {
  return (
    <div className="bad-ui-sample touch-gesture-bad-ui">
      <section className="touch-gesture-shell bad" aria-label="Broken touch gesture">
        <header className="touch-gesture-header">
          <span>Gesture-only zoom</span>
          <strong>Pinch required</strong>
        </header>
        <p>The viewer hides plus, minus, reset, target size, threshold, cancellation, and single-pointer alternatives.</p>
        <div className="touch-gesture-canvas bad">
          <strong>Map locked at 100%</strong>
          <p>Use two fingers to zoom. No buttons are provided.</p>
        </div>
      </section>
      <p className="demo-status">The broken UI depends on a multipoint gesture for basic behavior.</p>
    </div>
  );
}

function TouchGestureGoodUx() {
  const [mode, setMode] = useState<TouchGestureMode>("overview");
  return (
    <div className="quality-example touch-gesture-demo">
      <div className="demo-row touch-gesture-mode-controls" aria-label="Touch gesture exercise controls">
        {touchGestureGoodLabels.map(([key, label]) => (
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
      <TouchGesturePanel mode={mode} idSuffix="good-ux" />
      <p className="demo-status" aria-live="polite">Touch gesture state: {touchGestureGoodLabels.find(([key]) => key === mode)?.[1]}.</p>
    </div>
  );
}

function TouchGestureBadUx() {
  const [mode, setMode] = useState<TouchGestureBadMode>("gestureOnlyZoom");
  const copy: Record<TouchGestureBadMode, { title: string; body: string; consequence: string }> = {
    gestureOnlyZoom: {
      title: "Gesture-only zoom",
      body: "Pinch is the only way to zoom; there are no plus, minus, reset, or single-pointer controls.",
      consequence: "Users who cannot perform multipoint gestures cannot operate the view."
    },
    hiddenSwipe: {
      title: "Hidden swipe",
      body: "The only way to reveal actions is a hidden horizontal swipe with no hint or visible buttons.",
      consequence: "Users never discover the action or trigger it accidentally."
    },
    tinyTargets: {
      title: "Tiny targets",
      body: "Zoom, close, and delete targets are small, adjacent, and visually similar.",
      consequence: "Touch users activate the wrong control."
    },
    scrollHijack: {
      title: "Scroll hijack",
      body: "A short diagonal scroll is treated as a destructive swipe action.",
      consequence: "Routine reading gestures change data unexpectedly."
    },
    noCancellation: {
      title: "No cancellation",
      body: "Once movement begins, release anywhere commits the gesture.",
      consequence: "Users cannot reverse before threshold or release boundary."
    },
    systemConflict: {
      title: "System conflict",
      body: "The app captures the platform edge-back region for carousel navigation.",
      consequence: "Browser, operating-system, and assistive gestures are blocked."
    },
    hoverHint: {
      title: "Hover hint",
      body: "The gesture instructions appear only on desktop hover.",
      consequence: "Touch users never receive the gesture hint."
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example touch-gesture-bad-ux is-${mode}`}>
      <div className="demo-row touch-gesture-mode-controls" aria-label="Touch gesture misuse controls">
        {touchGestureBadLabels.map(([key, label]) => (
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
      <section className="touch-gesture-shell bad" aria-label={`Touch gesture failure: ${item.title}`}>
        <header className="touch-gesture-header">
          <span>{item.title}</span>
          <strong>Gesture failure</strong>
        </header>
        <div className="touch-gesture-canvas bad">
          <strong>{item.title}</strong>
          <p>{item.body}</p>
        </div>
        <div className="touch-gesture-grid">
          <div><span>Single pointer</span><strong>{mode === "gestureOnlyZoom" ? "Missing" : "Unclear"}</strong></div>
          <div><span>Cancellation</span><strong>{mode === "noCancellation" ? "Unavailable" : "Untested"}</strong></div>
          <div><span>Target size</span><strong>{mode === "tinyTargets" ? "Too small" : "Not checked"}</strong></div>
          <div><span>System gestures</span><strong>{mode === "systemConflict" ? "Overridden" : "Unknown"}</strong></div>
        </div>
      </section>
      <p className="demo-status" aria-live="polite">{item.consequence}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <TouchGestureGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <TouchGestureBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <TouchGestureGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <TouchGestureBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
