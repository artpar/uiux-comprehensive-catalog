import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type HapticFeedbackMode =
  | "unsupported"
  | "disabled"
  | "reduced"
  | "lightPress"
  | "selection"
  | "dragThreshold"
  | "snapDetent"
  | "boundary"
  | "success"
  | "warning"
  | "errorReinforcement"
  | "destructiveCommit"
  | "suppression"
  | "cancelPattern"
  | "webPattern"
  | "preferencePreview"
  | "quietContext";

type HapticFeedbackBadMode =
  | "hapticOnlyError"
  | "sameStrongPulse"
  | "vibrationProgress"
  | "ignoredSettings"
  | "decorativeBuzz"
  | "delayedBuzz"
  | "alarmLoop";

const hapticFeedbackGoodLabels: Array<[HapticFeedbackMode, string]> = [
  ["unsupported", "Unsupported"],
  ["disabled", "Disabled"],
  ["reduced", "Reduced"],
  ["lightPress", "Light press"],
  ["selection", "Selection"],
  ["dragThreshold", "Drag threshold"],
  ["snapDetent", "Snap detent"],
  ["boundary", "Boundary"],
  ["success", "Success"],
  ["warning", "Warning"],
  ["errorReinforcement", "Error reinforce"],
  ["destructiveCommit", "Destructive commit"],
  ["suppression", "Suppression"],
  ["cancelPattern", "Cancel pattern"],
  ["webPattern", "Web pattern"],
  ["preferencePreview", "Preference preview"],
  ["quietContext", "Quiet context"]
];

const hapticFeedbackBadLabels: Array<[HapticFeedbackBadMode, string]> = [
  ["hapticOnlyError", "Haptic-only error"],
  ["sameStrongPulse", "Same strong pulse"],
  ["vibrationProgress", "Vibration progress"],
  ["ignoredSettings", "Ignored settings"],
  ["decorativeBuzz", "Decorative buzz"],
  ["delayedBuzz", "Delayed buzz"],
  ["alarmLoop", "Alarm loop"]
];

function HapticMeter({ intensity }: { intensity: number }) {
  return (
    <div className="haptic-meter" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={index < intensity ? "active" : ""}></span>
      ))}
    </div>
  );
}

function HapticFeedbackPanel({ mode = "selection", idSuffix = "static" }: { mode?: HapticFeedbackMode; idSuffix?: string }) {
  const config: Record<HapticFeedbackMode, {
    chip: string;
    title: string;
    event: string;
    effect: string;
    backup: string;
    setting: string;
    timing: string;
    status: string;
    intensity: number;
    tone?: "safe" | "warn" | "neutral";
    suppressed?: boolean;
  }> = {
    unsupported: {
      chip: "Unsupported",
      title: "No haptic hardware or API",
      event: "Button press",
      effect: "No vibration",
      backup: "Pressed state and text",
      setting: "Capability unavailable",
      timing: "No-op",
      status: "The task remains understandable when vibration hardware or web support is missing.",
      intensity: 0,
      tone: "neutral",
      suppressed: true
    },
    disabled: {
      chip: "Disabled",
      title: "System haptics are off",
      event: "Selection change",
      effect: "Suppressed",
      backup: "Selected row highlight",
      setting: "Respect user setting",
      timing: "No pulse",
      status: "The product respects disabled haptics and keeps the visible state complete.",
      intensity: 0,
      tone: "neutral",
      suppressed: true
    },
    reduced: {
      chip: "Reduced",
      title: "Reduced feedback keeps only critical cues",
      event: "Drag threshold",
      effect: "Soft tap",
      backup: "Target highlight",
      setting: "Reduced haptics",
      timing: "At threshold",
      status: "Reduced mode lowers intensity and removes decorative effects.",
      intensity: 1,
      tone: "safe"
    },
    lightPress: {
      chip: "Light press",
      title: "Press feedback is brief and local",
      event: "Primary button down",
      effect: "Light tap",
      backup: "Pressed visual state",
      setting: "Platform default",
      timing: "On touch down",
      status: "A light press reinforces direct touch without implying success.",
      intensity: 1,
      tone: "safe"
    },
    selection: {
      chip: "Selection",
      title: "Selection change has a distinct tick",
      event: "Picker value changed",
      effect: "Selection tick",
      backup: "Value label updated",
      setting: "Enabled",
      timing: "Per changed value",
      status: "Selection haptics are distinct from success, warning, and error effects.",
      intensity: 2,
      tone: "safe"
    },
    dragThreshold: {
      chip: "Threshold",
      title: "Drag threshold confirms commit zone",
      event: "Card crosses drop target",
      effect: "Medium impact",
      backup: "Insertion marker appears",
      setting: "Enabled",
      timing: "Once per threshold",
      status: "The pulse is debounced and synchronized with visible drop eligibility.",
      intensity: 3,
      tone: "safe"
    },
    snapDetent: {
      chip: "Detent",
      title: "Snap point feels physical",
      event: "Slider reaches step 5",
      effect: "Detent tick",
      backup: "Step value visible",
      setting: "Enabled",
      timing: "At snap point",
      status: "Detent feedback reinforces a stable value without hiding the visible value.",
      intensity: 2,
      tone: "safe"
    },
    boundary: {
      chip: "Boundary",
      title: "Limit reached has a small boundary cue",
      event: "End of reorder list",
      effect: "Short stop",
      backup: "Cannot move further message",
      setting: "Enabled",
      timing: "At edge",
      status: "Boundary feedback explains a physical limit while visible copy remains available.",
      intensity: 2,
      tone: "neutral"
    },
    success: {
      chip: "Success",
      title: "Success haptic follows visible completion",
      event: "Saved locally",
      effect: "Soft success tap",
      backup: "Saved status text",
      setting: "Enabled",
      timing: "With success state",
      status: "Success is not communicated by touch alone; the saved state remains visible.",
      intensity: 2,
      tone: "safe"
    },
    warning: {
      chip: "Warning",
      title: "Warning pulse is rare and paired with copy",
      event: "Swipe near delete threshold",
      effect: "Warning pattern",
      backup: "Delete label revealed",
      setting: "Enabled",
      timing: "Before commit",
      status: "The warning pulse draws attention to visible risk without committing the action.",
      intensity: 4,
      tone: "warn"
    },
    errorReinforcement: {
      chip: "Error",
      title: "Error haptic reinforces visible recovery",
      event: "Invalid one-time code",
      effect: "Short error pulse",
      backup: "Field error and retry",
      setting: "Enabled",
      timing: "With error message",
      status: "The haptic is only reinforcement; the field error owns recovery.",
      intensity: 3,
      tone: "warn"
    },
    destructiveCommit: {
      chip: "Commit",
      title: "Destructive commit is after explicit choice",
      event: "Delete confirmed",
      effect: "Firm impact",
      backup: "Deleted with undo",
      setting: "Enabled",
      timing: "After confirm",
      status: "The pulse follows an explicit confirmation and visible undo, not the initial warning.",
      intensity: 4,
      tone: "warn"
    },
    suppression: {
      chip: "Suppression",
      title: "Repeated effects are debounced",
      event: "Slider rests on same value",
      effect: "No repeat",
      backup: "Value remains selected",
      setting: "Enabled",
      timing: "Suppressed duplicate",
      status: "Repeated touches on the same state do not create fatigue or false progress.",
      intensity: 0,
      tone: "neutral",
      suppressed: true
    },
    cancelPattern: {
      chip: "Cancel",
      title: "Long vibration pattern can be stopped",
      event: "User cancels alert",
      effect: "Pattern canceled",
      backup: "Alert dismissed",
      setting: "Enabled",
      timing: "Cancel immediately",
      status: "Cancellation stops tactile output when the related state is no longer active.",
      intensity: 0,
      tone: "safe",
      suppressed: true
    },
    webPattern: {
      chip: "Web pattern",
      title: "Web vibration pattern is short and optional",
      event: "Scan failed",
      effect: "80 ms pulse",
      backup: "Visible retry guidance",
      setting: "Browser dependent",
      timing: "After visible failure",
      status: "The web path accepts no-op behavior and avoids relying on vibration support.",
      intensity: 2,
      tone: "neutral"
    },
    preferencePreview: {
      chip: "Preview",
      title: "Preference preview names the effect",
      event: "Test haptic button",
      effect: "Selection preview",
      backup: "Preview label",
      setting: "User-controlled",
      timing: "Only on request",
      status: "Users can preview and tune haptics without triggering live task actions.",
      intensity: 2,
      tone: "safe"
    },
    quietContext: {
      chip: "Quiet context",
      title: "Quiet mode suppresses nonessential haptics",
      event: "Background refresh",
      effect: "No buzz",
      backup: "Status in notification center",
      setting: "Focus mode",
      timing: "Suppressed",
      status: "Quiet contexts suppress nonessential tactile output while preserving status history.",
      intensity: 0,
      tone: "neutral",
      suppressed: true
    }
  };
  const item = config[mode];
  const titleId = `haptic-feedback-title-${idSuffix}`;
  const descId = `haptic-feedback-desc-${idSuffix}`;

  return (
    <section className={`haptic-feedback-shell is-${item.tone ?? "neutral"} ${item.suppressed ? "is-suppressed" : ""}`} aria-labelledby={titleId} aria-describedby={descId}>
      <header className="haptic-feedback-header">
        <div>
          <span>{item.chip}</span>
          <strong id={titleId}>{item.title}</strong>
        </div>
        <button type="button" className="haptic-feedback-action">Preview effect</button>
      </header>
      <div className="haptic-feedback-stage" id={descId}>
        <div className="haptic-device" aria-label="Simulated haptic device">
          <HapticMeter intensity={item.intensity} />
          <strong>{item.suppressed ? "Suppressed" : item.effect}</strong>
          <small>{item.timing}</small>
        </div>
        <div className="haptic-feedback-grid">
          <div><span>Event</span><strong>{item.event}</strong></div>
          <div><span>Effect</span><strong>{item.effect}</strong></div>
          <div><span>Visible backup</span><strong>{item.backup}</strong></div>
          <div><span>Setting</span><strong>{item.setting}</strong></div>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{item.status}</p>
    </section>
  );
}

function HapticFeedbackGoodUi() {
  return (
    <div className="quality-example haptic-feedback-demo">
      <HapticFeedbackPanel mode="dragThreshold" idSuffix="good-ui" />
    </div>
  );
}

function HapticFeedbackBadUi() {
  return (
    <div className="bad-ui-sample haptic-feedback-bad-ui">
      <section className="haptic-feedback-shell bad" aria-label="Broken haptic feedback interface">
        <header className="haptic-feedback-header">
          <div>
            <span>Buzz everywhere</span>
            <strong>Same strong vibration for every event</strong>
          </div>
          <button type="button" className="haptic-feedback-action danger">Vibrate</button>
        </header>
        <p>The interface uses one intense pulse for tap, success, error, delete, and progress, ignores disabled haptics, and gives no visible error message.</p>
        <div className="haptic-feedback-grid compact">
          <div><span>Meaning</span><strong>Ambiguous</strong></div>
          <div><span>Intensity</span><strong>Always strong</strong></div>
          <div><span>Settings</span><strong>Ignored</strong></div>
          <div><span>Fallback</span><strong>Missing text</strong></div>
        </div>
      </section>
      <p className="demo-status">The broken UI makes vibration carry required meaning and creates fatigue.</p>
    </div>
  );
}

function HapticFeedbackGoodUx() {
  const [mode, setMode] = useState<HapticFeedbackMode>("selection");

  return (
    <div className="quality-example haptic-feedback-demo">
      <div className="demo-row haptic-feedback-controls" aria-label="Haptic feedback exercise controls">
        {hapticFeedbackGoodLabels.map(([key, label]) => (
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
      <HapticFeedbackPanel mode={mode} idSuffix="good-ux" />
      <p className="demo-status" aria-live="polite">Haptic feedback state: {hapticFeedbackGoodLabels.find(([key]) => key === mode)?.[1]}.</p>
    </div>
  );
}

function HapticFeedbackBadUx() {
  const [mode, setMode] = useState<HapticFeedbackBadMode>("hapticOnlyError");
  const copy: Record<HapticFeedbackBadMode, { title: string; body: string; consequence: string; metric: string }> = {
    hapticOnlyError: {
      title: "Haptic-only error",
      body: "A failed security code only vibrates the phone; the field shows no error text, retry count, or recovery action.",
      consequence: "Users who miss, disable, or cannot feel haptics lose required recovery information.",
      metric: "No visible error"
    },
    sameStrongPulse: {
      title: "Same strong pulse",
      body: "Selection, success, warning, failure, and delete all use one heavy vibration.",
      consequence: "The tactile vocabulary becomes meaningless and fatiguing.",
      metric: "One pattern"
    },
    vibrationProgress: {
      title: "Vibration progress",
      body: "A long import buzzes every second instead of showing percent complete, stages, or cancel.",
      consequence: "Haptics become imprecise progress feedback and drain attention.",
      metric: "No progress UI"
    },
    ignoredSettings: {
      title: "Ignored settings",
      body: "The product vibrates even when system haptics, focus mode, or product haptic preferences are off.",
      consequence: "User control and quiet-context expectations are violated.",
      metric: "Settings bypassed"
    },
    decorativeBuzz: {
      title: "Decorative buzz",
      body: "Cards buzz on hover-like decoration and passive page animations with no interaction meaning.",
      consequence: "Users get startled by effects that do not explain state or action.",
      metric: "No event meaning"
    },
    delayedBuzz: {
      title: "Delayed buzz",
      body: "A vibration fires after a slow network response but the visible button state already returned to idle.",
      consequence: "The tactile effect feels disconnected from the action that caused it.",
      metric: "Timing mismatch"
    },
    alarmLoop: {
      title: "Alarm-like loop",
      body: "A recoverable warning loops a long vibration pattern until users leave the page.",
      consequence: "The feedback feels like an alarm and can cause discomfort.",
      metric: "Looping pattern"
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example haptic-feedback-bad-ux is-${mode}`}>
      <div className="demo-row haptic-feedback-controls" aria-label="Haptic feedback misuse controls">
        {hapticFeedbackBadLabels.map(([key, label]) => (
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
      <section className="haptic-feedback-shell bad" aria-label={`Haptic feedback failure: ${item.title}`}>
        <header className="haptic-feedback-header">
          <div>
            <span>{item.title}</span>
            <strong>{item.metric}</strong>
          </div>
          <button type="button" className="haptic-feedback-action danger">Buzz</button>
        </header>
        <p>{item.body}</p>
        <div className="haptic-feedback-grid compact">
          <div><span>Meaning</span><strong>{mode === "sameStrongPulse" ? "Ambiguous" : "Weak"}</strong></div>
          <div><span>Visible backup</span><strong>{mode === "hapticOnlyError" ? "Missing" : "Insufficient"}</strong></div>
          <div><span>Settings</span><strong>{mode === "ignoredSettings" ? "Ignored" : "Unclear"}</strong></div>
          <div><span>Suppression</span><strong>{mode === "alarmLoop" ? "Absent" : "Not proven"}</strong></div>
        </div>
      </section>
      <p className="demo-status" aria-live="polite">{item.consequence}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <HapticFeedbackGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <HapticFeedbackBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <HapticFeedbackGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <HapticFeedbackBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
