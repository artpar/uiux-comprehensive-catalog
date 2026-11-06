import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type KeyboardShortcutMode =
  | "hint"
  | "platform"
  | "registry"
  | "scope"
  | "textSuppression"
  | "disabled"
  | "conflict"
  | "executed"
  | "confirmation"
  | "remap"
  | "characterOff"
  | "ariaExposure"
  | "help"
  | "mobile";

type KeyboardShortcutBadMode =
  | "hiddenOnly"
  | "globalCharacter"
  | "platformMismatch"
  | "staleHint"
  | "disabledFires"
  | "conflictOverride"
  | "riskyInstant";

const keyboardShortcutGoodLabels: Array<[KeyboardShortcutMode, string]> = [
  ["hint", "Shortcut hint"],
  ["platform", "Platform variant"],
  ["registry", "Command registry"],
  ["scope", "Active scope"],
  ["textSuppression", "Text-field suppression"],
  ["disabled", "Disabled shortcut"],
  ["conflict", "Conflict detected"],
  ["executed", "Executed command"],
  ["confirmation", "Risky confirmation"],
  ["remap", "Remap shortcut"],
  ["characterOff", "Character-key off"],
  ["ariaExposure", "aria-keyshortcuts"],
  ["help", "Shortcut help"],
  ["mobile", "Mobile fallback"]
];

const keyboardShortcutBadLabels: Array<[KeyboardShortcutBadMode, string]> = [
  ["hiddenOnly", "Hidden only"],
  ["globalCharacter", "Global character key"],
  ["platformMismatch", "Platform mismatch"],
  ["staleHint", "Stale hint"],
  ["disabledFires", "Disabled fires"],
  ["conflictOverride", "Conflict override"],
  ["riskyInstant", "Risky instant"]
];

function KeyboardShortcutPanel({ mode, idSuffix }: { mode: KeyboardShortcutMode; idSuffix: string }) {
  const config: Record<KeyboardShortcutMode, {
    chip: string;
    title: string;
    command: string;
    chord: string;
    scope: string;
    state: string;
    conflict: string;
    exposure: string;
    recovery: string;
    result: string;
    tone?: string;
    compact?: boolean;
  }> = {
    hint: {
      chip: "Shortcut hint",
      title: "Save is visible and accelerated",
      command: "Save draft",
      chord: "Command+S / Control+S",
      scope: "Document editor",
      state: "Enabled when draft has changes",
      conflict: "Does not replace toolbar Save",
      exposure: "Shown on Save button, File menu, and shortcut help",
      recovery: "Undo is unrelated; save status confirms result",
      result: "The key command is discoverable beside the visible command."
    },
    platform: {
      chip: "Platform variant",
      title: "Shortcut label matches current OS",
      command: "Save draft",
      chord: "macOS: Command+S; Windows: Control+S",
      scope: "Editor window",
      state: "Same command registry entry",
      conflict: "Platform reserved keys are not reused",
      exposure: "Hints render with the user's platform variant",
      recovery: "Restore defaults keeps platform defaults",
      result: "Users do not see the wrong modifier for their platform."
    },
    registry: {
      chip: "Command registry",
      title: "One command owns every surface",
      command: "Export selected rows",
      chord: "Shift+E",
      scope: "Table selection",
      state: "Enabled with selected rows",
      conflict: "Command palette, toolbar, menu, and shortcut help agree",
      exposure: "Shortcut row links to the same command ID",
      recovery: "Changing the key updates all visible hints",
      result: "Shortcut hints cannot drift from command behavior."
    },
    scope: {
      chip: "Active scope",
      title: "Shortcut only works in the right context",
      command: "Open preview panel",
      chord: "P",
      scope: "Focused media viewer only",
      state: "Inactive in comments and forms",
      conflict: "Single character key is focus-scoped",
      exposure: "Preview panel exposes the shortcut while focused",
      recovery: "Escape returns focus to the viewer",
      result: "Scope prevents accidental global activation."
    },
    textSuppression: {
      chip: "Text-field suppression",
      title: "Typing owns character keys",
      command: "Archive message",
      chord: "A",
      scope: "Message list, not textarea",
      state: "Suppressed inside reply editor",
      conflict: "Text entry, composition, and dictation win",
      exposure: "Reply editor does not show list shortcuts",
      recovery: "Focus leaving editor re-enables list shortcuts",
      result: "Writing text cannot archive the current message."
    },
    disabled: {
      chip: "Disabled shortcut",
      title: "Unavailable commands do not fire",
      command: "Export selected rows",
      chord: "Shift+E",
      scope: "Data table",
      state: "Disabled: no rows selected",
      conflict: "Keyboard handler checks command availability",
      exposure: "Toolbar and shortcut help show the disabled reason",
      recovery: "Select rows to enable Export",
      result: "A disabled visual command and disabled shortcut match."
    },
    conflict: {
      chip: "Conflict detected",
      title: "Duplicate chord is blocked",
      command: "Open quick switcher",
      chord: "Control+K",
      scope: "Global product",
      state: "Remap pending",
      conflict: "Already used by Insert link in editor scope",
      exposure: "Conflict warning names both commands and scopes",
      recovery: "Choose Control+Shift+K or keep default",
      result: "Shortcut conflicts are resolved before save."
    },
    executed: {
      chip: "Executed command",
      title: "Shortcut gives status feedback",
      command: "Save draft",
      chord: "Command+S",
      scope: "Document editor",
      state: "Saving then saved",
      conflict: "Browser save is intentionally owned by app editor",
      exposure: "Status message says Saved 10:42",
      recovery: "Focus remains in editor",
      result: "The command outcome is visible and accessible.",
      tone: "safe"
    },
    confirmation: {
      chip: "Risky confirmation",
      title: "Delete shortcut opens review",
      command: "Delete selected file",
      chord: "Delete",
      scope: "File list with one selected file",
      state: "Confirmation required",
      conflict: "Shortcut never bypasses destructive review",
      exposure: "Dialog names the selected file and recovery",
      recovery: "Cancel or Move to trash with Undo",
      result: "Risky shortcuts use the same review path as buttons."
    },
    remap: {
      chip: "Remap shortcut",
      title: "User changes a shortcut safely",
      command: "Open command palette",
      chord: "Command+K -> Command+Shift+P",
      scope: "Global product",
      state: "Waiting for new key chord",
      conflict: "Duplicate and reserved chords are checked",
      exposure: "Updated shortcut appears in help and trigger label",
      recovery: "Restore default remains available",
      result: "Remapping keeps the command registry synchronized."
    },
    characterOff: {
      chip: "Character-key off",
      title: "Single-key shortcuts can be disabled",
      command: "Archive message",
      chord: "A",
      scope: "Focused message list",
      state: "Character shortcuts off",
      conflict: "Speech input and accidental keypress risk reduced",
      exposure: "Settings explains focus-only or off modes",
      recovery: "Users can restore defaults",
      result: "Character-key shortcut risk is user-controllable."
    },
    ariaExposure: {
      chip: "aria-keyshortcuts",
      title: "Assistive tech can discover the key",
      command: "Open comments panel",
      chord: "Control+Alt+C",
      scope: "Comments button",
      state: "Button exposes aria-keyshortcuts",
      conflict: "Only the implemented shortcut is exposed",
      exposure: "Visible label and accessibility metadata match",
      recovery: "Focus moves to comments heading after activation",
      result: "Shortcut discovery is not visual-only.",
      tone: "safe"
    },
    help: {
      chip: "Shortcut help",
      title: "Help lists scope and conflicts",
      command: "Shortcut reference",
      chord: "?",
      scope: "Global help when focus is not in text entry",
      state: "Open shortcut help overlay",
      conflict: "Question mark suppressed in text fields",
      exposure: "Searchable help groups global, editor, and table shortcuts",
      recovery: "Escape closes and restores focus",
      result: "Users can learn, search, and exit shortcut help."
    },
    mobile: {
      chip: "Mobile fallback",
      title: "Touch users keep visible controls",
      command: "Save draft",
      chord: "Hardware keyboard optional",
      scope: "Tablet editor",
      state: "Save button remains primary",
      conflict: "Touch keyboard does not hide command availability",
      exposure: "Shortcut hint appears only when hardware keyboard is present",
      recovery: "Status and undo are reachable by touch",
      result: "Shortcuts supplement, not replace, touch controls.",
      compact: true
    }
  };
  const item = config[mode];
  const titleId = `keyboard-shortcut-title-${idSuffix}`;
  const descId = `keyboard-shortcut-desc-${idSuffix}`;

  return (
    <section className={`keyboard-shortcut-shell is-${mode} ${item.tone ? `is-${item.tone}` : ""} ${item.compact ? "is-compact" : ""}`} aria-labelledby={titleId} aria-describedby={descId}>
      <header className="keyboard-shortcut-header">
        <span>{item.chip}</span>
        <strong id={titleId}>{item.title}</strong>
      </header>
      <div className="keyboard-shortcut-command" id={descId}>
        <button type="button" className="demo-button small primary" aria-keyshortcuts={mode === "ariaExposure" ? item.chord : undefined}>{item.command}</button>
        <kbd>{item.chord}</kbd>
        <span>{item.state}</span>
      </div>
      <div className="keyboard-shortcut-grid" aria-label="Keyboard shortcut evidence">
        <div><span>Command</span><strong>{item.command}</strong></div>
        <div><span>Key chord</span><strong>{item.chord}</strong></div>
        <div><span>Active scope</span><strong>{item.scope}</strong></div>
        <div><span>Conflict rule</span><strong>{item.conflict}</strong></div>
        <div><span>Discovery</span><strong>{item.exposure}</strong></div>
        <div><span>Recovery</span><strong>{item.recovery}</strong></div>
      </div>
      <p className="demo-status">{item.result}</p>
    </section>
  );
}

function KeyboardShortcutGoodUi() {
  return (
    <div className="quality-example keyboard-shortcut-demo">
      <KeyboardShortcutPanel mode="hint" idSuffix="good-ui" />
    </div>
  );
}

function KeyboardShortcutBadUi() {
  return (
    <div className="bad-ui-sample keyboard-shortcut-bad-ui">
      <section className="keyboard-shortcut-shell bad" aria-label="Broken keyboard shortcut">
        <header className="keyboard-shortcut-header">
          <span>Hidden only</span>
          <strong>Submit has no visible command</strong>
        </header>
        <p>The page depends on Control+Enter, but there is no button, shortcut hint, command help, platform variant, focus scope, disabled state, remap, status message, or touch fallback.</p>
        <div className="keyboard-shortcut-command bad">
          <kbd>Ctrl+Enter</kbd>
          <span>Secret submit shortcut</span>
        </div>
        <div className="keyboard-shortcut-grid">
          <div><span>Visible command</span><strong>Missing</strong></div>
          <div><span>Scope</span><strong>Unknown</strong></div>
          <div><span>Conflict rule</span><strong>Untested</strong></div>
          <div><span>Feedback</span><strong>None</strong></div>
        </div>
      </section>
      <p className="demo-status">The broken UI turns a primary workflow into hidden keyboard behavior.</p>
    </div>
  );
}

function KeyboardShortcutGoodUx() {
  const [mode, setMode] = useState<KeyboardShortcutMode>("hint");
  return (
    <div className="quality-example keyboard-shortcut-demo">
      <div className="demo-row keyboard-shortcut-controls" aria-label="Keyboard shortcut exercise controls">
        {keyboardShortcutGoodLabels.map(([key, label]) => (
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
      <KeyboardShortcutPanel mode={mode} idSuffix="good-ux" />
      <p className="demo-status" aria-live="polite">Keyboard shortcut state: {keyboardShortcutGoodLabels.find(([key]) => key === mode)?.[1]}.</p>
    </div>
  );
}

function KeyboardShortcutBadUx() {
  const [mode, setMode] = useState<KeyboardShortcutBadMode>("hiddenOnly");
  const copy: Record<KeyboardShortcutBadMode, { title: string; body: string; consequence: string; metric: string }> = {
    hiddenOnly: {
      title: "Hidden only",
      body: "Submit, save, and search depend on undocumented shortcuts with no visible commands or shortcut help.",
      consequence: "Users who do not know the key sequence cannot finish the task.",
      metric: "No visible command"
    },
    globalCharacter: {
      title: "Global character key",
      body: "The D key deletes a selected record while users type, dictate, or use a screen reader command.",
      consequence: "Character-key shortcuts fire accidentally outside their intended scope.",
      metric: "Single key global"
    },
    platformMismatch: {
      title: "Platform mismatch",
      body: "The UI shows Control+S on macOS and Command+S on Windows, so users cannot trust shortcut hints.",
      consequence: "Platform expectations and visible labels diverge.",
      metric: "Wrong modifier"
    },
    staleHint: {
      title: "Stale hint",
      body: "Shortcut help lists Control+K, the command palette uses Command+P, and the toolbar shows no current key.",
      consequence: "Users learn shortcuts that no longer match command behavior.",
      metric: "Drift"
    },
    disabledFires: {
      title: "Disabled fires",
      body: "Export selected rows is disabled with no selection, but Shift+E still starts an empty export.",
      consequence: "Keyboard and visual command state disagree.",
      metric: "Bypass"
    },
    conflictOverride: {
      title: "Conflict override",
      body: "The app steals browser find, screen reader commands, and text-editor shortcuts without conflict warnings.",
      consequence: "Users lose expected platform and assistive-technology behavior.",
      metric: "No conflict check"
    },
    riskyInstant: {
      title: "Risky instant",
      body: "Delete permanently removes a shared file from a single key press with no confirmation, undo, or audit detail.",
      consequence: "A shortcut bypasses the same safety path as the visible command.",
      metric: "No review"
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example keyboard-shortcut-bad-ux is-${mode}`}>
      <div className="demo-row keyboard-shortcut-controls" aria-label="Keyboard shortcut misuse controls">
        {keyboardShortcutBadLabels.map(([key, label]) => (
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
      <section className="keyboard-shortcut-shell bad" aria-label={`Keyboard shortcut failure: ${item.title}`}>
        <header className="keyboard-shortcut-header">
          <span>{item.title}</span>
          <strong>{item.metric}</strong>
        </header>
        <p>{item.body}</p>
        <div className="keyboard-shortcut-grid">
          <div><span>Visible command</span><strong>{mode === "hiddenOnly" ? "Missing" : "Mismatch"}</strong></div>
          <div><span>Active scope</span><strong>{mode === "globalCharacter" ? "Global character key" : "Unclear"}</strong></div>
          <div><span>Platform variant</span><strong>{mode === "platformMismatch" ? "Wrong modifier" : "Unverified"}</strong></div>
          <div><span>Conflict rule</span><strong>{mode === "conflictOverride" ? "Overrides platform" : "Weak"}</strong></div>
          <div><span>Disabled state</span><strong>{mode === "disabledFires" ? "Still fires" : "Not synchronized"}</strong></div>
          <div><span>Safety path</span><strong>{mode === "riskyInstant" ? "Bypassed" : item.consequence}</strong></div>
        </div>
      </section>
      <p className="demo-status" aria-live="polite">{item.consequence}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <KeyboardShortcutGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <KeyboardShortcutBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <KeyboardShortcutGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <KeyboardShortcutBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
