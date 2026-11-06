import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type VoiceCommandMode =
  | "unavailable"
  | "permission"
  | "wake"
  | "listening"
  | "partial"
  | "recognized"
  | "lowConfidence"
  | "alternatives"
  | "disambiguation"
  | "matched"
  | "confirmation"
  | "executed"
  | "undo"
  | "dictation"
  | "offline"
  | "equivalent";

type VoiceCommandBadMode =
  | "invisibleListening"
  | "partialExecution"
  | "hiddenPhrase"
  | "dictationConfusion"
  | "noFallback"
  | "noConfirmation"
  | "transcriptLeak";

const voiceCommandGoodLabels: Array<[VoiceCommandMode, string]> = [
  ["unavailable", "Unavailable"],
  ["permission", "Permission"],
  ["wake", "Wake"],
  ["listening", "Listening"],
  ["partial", "Partial transcript"],
  ["recognized", "Recognized phrase"],
  ["lowConfidence", "Low confidence"],
  ["alternatives", "Alternatives"],
  ["disambiguation", "Disambiguation"],
  ["matched", "Matched command"],
  ["confirmation", "Risky confirmation"],
  ["executed", "Executed"],
  ["undo", "Undo"],
  ["dictation", "Dictation boundary"],
  ["offline", "Offline fallback"],
  ["equivalent", "Equivalent path"]
];

const voiceCommandBadLabels: Array<[VoiceCommandBadMode, string]> = [
  ["invisibleListening", "Invisible listening"],
  ["partialExecution", "Partial execution"],
  ["hiddenPhrase", "Hidden phrase"],
  ["dictationConfusion", "Dictation confusion"],
  ["noFallback", "No fallback"],
  ["noConfirmation", "No confirmation"],
  ["transcriptLeak", "Transcript leak"]
];

function VoiceCommandPanel({ mode, idSuffix }: { mode: VoiceCommandMode; idSuffix: string }) {
  const config: Record<VoiceCommandMode, {
    chip: string;
    title: string;
    phrase: string;
    command: string;
    target: string;
    confidence: string;
    status: string;
    next: string;
    privacy: string;
    fallback: string;
    tone?: "safe" | "warn" | "neutral";
  }> = {
    unavailable: {
      chip: "Unsupported",
      title: "Voice unavailable, task still works",
      phrase: "Voice command not supported in this browser",
      command: "Use visible controls",
      target: "Incident filter panel",
      confidence: "n/a",
      status: "The task stays available through tap, keyboard, and command list controls.",
      next: "Open command list",
      privacy: "No microphone capture",
      fallback: "Keyboard and touch path visible",
      tone: "neutral"
    },
    permission: {
      chip: "Permission",
      title: "Microphone request explains scope",
      phrase: "Press and say a command",
      command: "Request microphone",
      target: "This incident console only",
      confidence: "Before recognition",
      status: "Permission is requested only after explicit user intent.",
      next: "Allow, deny, or use keyboard",
      privacy: "Session-only capture notice",
      fallback: "Deny keeps the command buttons enabled",
      tone: "safe"
    },
    wake: {
      chip: "Wake",
      title: "Explicit start state prevents surprise capture",
      phrase: "Press Voice command",
      command: "Start listening",
      target: "Command overlay",
      confidence: "Not listening",
      status: "The microphone is idle until the user starts a bounded listening session.",
      next: "Listening timeout begins",
      privacy: "Idle microphone indicator",
      fallback: "Keyboard starts command search"
    },
    listening: {
      chip: "Listening",
      title: "Active microphone state is visible",
      phrase: "Listening for: filter, open, read, send, cancel",
      command: "Awaiting phrase",
      target: "Current alert queue",
      confidence: "Live",
      status: "A waveform, timeout, stop control, and command examples are visible.",
      next: "Stop or wait for transcript",
      privacy: "Listening timer 0:05",
      fallback: "Stop listening",
      tone: "safe"
    },
    partial: {
      chip: "Partial",
      title: "Partial transcript is not executed",
      phrase: "filter cri...",
      command: "No command yet",
      target: "Uncommitted transcript",
      confidence: "Partial",
      status: "Partial recognition updates text but cannot run a command.",
      next: "Wait for final phrase",
      privacy: "Transcript not stored",
      fallback: "Type command instead"
    },
    recognized: {
      chip: "Recognized",
      title: "Final phrase is shown before action",
      phrase: "filter critical alerts",
      command: "Filter critical",
      target: "Alert queue",
      confidence: "92%",
      status: "The recognized phrase, matched command, and target are visible together.",
      next: "Apply filter",
      privacy: "Intent stored, raw audio discarded",
      fallback: "Edit transcript",
      tone: "safe"
    },
    lowConfidence: {
      chip: "Low confidence",
      title: "Uncertain recognition asks for repair",
      phrase: "archive case",
      command: "Maybe: archive case or open case",
      target: "Case 418",
      confidence: "54%",
      status: "Low confidence blocks execution and offers retry, type, or choose alternative.",
      next: "Choose a phrase",
      privacy: "No command log yet",
      fallback: "Use action menu",
      tone: "warn"
    },
    alternatives: {
      chip: "Alternatives",
      title: "Recognition alternatives are selectable",
      phrase: "read summary",
      command: "Read summary / Red summary / Open summary",
      target: "Incident 482",
      confidence: "78%",
      status: "The user chooses between alternatives before the app speaks or changes state.",
      next: "Select recognized intent",
      privacy: "Alternatives expire after session",
      fallback: "Open summary button"
    },
    disambiguation: {
      chip: "Disambiguation",
      title: "Same phrase, multiple targets",
      phrase: "open alert",
      command: "Open alert",
      target: "Alert 17 or Alert 71",
      confidence: "88%",
      status: "The phrase matches two visible rows, so the UI asks which alert to open.",
      next: "Say row number or tap target",
      privacy: "No target selected yet",
      fallback: "Arrow keys choose row"
    },
    matched: {
      chip: "Matched",
      title: "Command name and scope are explicit",
      phrase: "read incident summary",
      command: "Read summary aloud",
      target: "Incident 482",
      confidence: "95%",
      status: "The command is bounded to the current incident and does not affect other records.",
      next: "Run safe command",
      privacy: "Transcript minimized",
      fallback: "Read summary button"
    },
    confirmation: {
      chip: "Confirm",
      title: "Risky command requires read-back",
      phrase: "send report",
      command: "Send report",
      target: "Incident 482 to Compliance",
      confidence: "91%",
      status: "The app repeats command and target before sending anything outside the product.",
      next: "Confirm send or cancel",
      privacy: "Audit logs intent only",
      fallback: "Review form submit",
      tone: "warn"
    },
    executed: {
      chip: "Executed",
      title: "Execution reports result",
      phrase: "filter critical alerts",
      command: "Filter critical",
      target: "Alert queue",
      confidence: "92%",
      status: "The filter is applied, results count is announced, and focus remains in the queue.",
      next: "Show 12 critical alerts",
      privacy: "Command event stored",
      fallback: "Clear filter button",
      tone: "safe"
    },
    undo: {
      chip: "Undo",
      title: "Reversible command exposes recovery",
      phrase: "archive alert 17",
      command: "Archive alert",
      target: "Alert 17",
      confidence: "89%",
      status: "The completed command offers Undo with the same scope as the visible archive button.",
      next: "Undo archive",
      privacy: "Audit shows archive and undo",
      fallback: "Restore from activity log"
    },
    dictation: {
      chip: "Dictation",
      title: "Dictation mode does not run global commands",
      phrase: "send it later",
      command: "Insert dictated text",
      target: "Notes field",
      confidence: "93%",
      status: "Because the notes field owns input, spoken prose remains text instead of becoming Send.",
      next: "Continue dictation",
      privacy: "Field text saved only with form",
      fallback: "Type note"
    },
    offline: {
      chip: "Offline",
      title: "Offline state keeps controls available",
      phrase: "Network recognition unavailable",
      command: "Voice paused",
      target: "Incident console",
      confidence: "n/a",
      status: "The app explains offline recognition limits and offers local controls.",
      next: "Retry when online",
      privacy: "No cloud recognition request",
      fallback: "Touch and keyboard path",
      tone: "neutral"
    },
    equivalent: {
      chip: "Equivalent path",
      title: "Voice is optional, not required",
      phrase: "filter critical alerts",
      command: "Filter critical",
      target: "Alert queue",
      confidence: "Same outcome",
      status: "The same command is available through a button, keyboard focus, and command palette.",
      next: "Choose preferred input",
      privacy: "No voice required",
      fallback: "Visible Filter critical button",
      tone: "safe"
    }
  };
  const item = config[mode];
  const titleId = `voice-command-title-${idSuffix}`;
  const descId = `voice-command-desc-${idSuffix}`;
  const meterValue = Number.parseInt(item.confidence, 10);

  return (
    <section className={`voice-command-shell is-${item.tone ?? "standard"}`} aria-labelledby={titleId} aria-describedby={descId}>
      <header className="voice-command-header">
        <div>
          <span>{item.chip}</span>
          <strong id={titleId}>{item.title}</strong>
        </div>
        <button type="button" className="voice-command-mic" aria-label={mode === "listening" ? "Stop listening" : "Start voice command"}>
          {mode === "listening" ? "Stop" : "Voice"}
        </button>
      </header>
      <div className={`voice-command-wave ${mode === "listening" ? "is-active" : ""}`} aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="voice-command-transcript" id={descId}>
        <span>Heard</span>
        <strong>{item.phrase}</strong>
      </div>
      <div className="voice-command-grid">
        <div><span>Matched command</span><strong>{item.command}</strong></div>
        <div><span>Target</span><strong>{item.target}</strong></div>
        <div><span>Confidence</span><strong>{item.confidence}</strong></div>
        <div><span>Next step</span><strong>{item.next}</strong></div>
        <div><span>Privacy</span><strong>{item.privacy}</strong></div>
        <div><span>Fallback</span><strong>{item.fallback}</strong></div>
      </div>
      {!Number.isNaN(meterValue) ? (
        <div className="voice-command-meter" aria-label={`Recognition confidence ${item.confidence}`}>
          <span style={{ width: `${Math.min(Math.max(meterValue, 0), 100)}%` }}></span>
        </div>
      ) : null}
      <p className="demo-status">{item.status}</p>
    </section>
  );
}

function VoiceCommandGoodUi() {
  return (
    <div className="quality-example voice-command-demo">
      <VoiceCommandPanel mode="recognized" idSuffix="good-ui" />
    </div>
  );
}

function VoiceCommandBadUi() {
  return (
    <div className="bad-ui-sample voice-command-bad-ui">
      <section className="voice-command-shell bad" aria-label="Broken voice command interface">
        <header className="voice-command-header">
          <div>
            <span>Silent mic</span>
            <strong>No transcript, target, or stop control</strong>
          </div>
          <button type="button" className="voice-command-mic ghost" aria-label="Microphone">Mic</button>
        </header>
        <p>The interface listens after page load, hides confidence and alternatives, expects the hidden phrase download CSV for a visible Export data button, and executes account changes without read-back.</p>
        <div className="voice-command-grid">
          <div><span>Heard</span><strong>Not shown</strong></div>
          <div><span>Command</span><strong>Runs immediately</strong></div>
          <div><span>Target</span><strong>Unknown record</strong></div>
          <div><span>Fallback</span><strong>Missing</strong></div>
        </div>
      </section>
      <p className="demo-status">The broken UI makes microphone capture and command consequence invisible.</p>
    </div>
  );
}

function VoiceCommandGoodUx() {
  const [mode, setMode] = useState<VoiceCommandMode>("permission");
  return (
    <div className="quality-example voice-command-demo">
      <div className="demo-row voice-command-controls" aria-label="Voice command exercise controls">
        {voiceCommandGoodLabels.map(([key, label]) => (
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
      <VoiceCommandPanel mode={mode} idSuffix="good-ux" />
      <p className="demo-status" aria-live="polite">Voice command state: {voiceCommandGoodLabels.find(([key]) => key === mode)?.[1]}.</p>
    </div>
  );
}

function VoiceCommandBadUx() {
  const [mode, setMode] = useState<VoiceCommandBadMode>("invisibleListening");
  const copy: Record<VoiceCommandBadMode, { title: string; body: string; consequence: string; metric: string }> = {
    invisibleListening: {
      title: "Invisible listening",
      body: "The page starts microphone capture without an active indicator, timer, transcript, or Stop control.",
      consequence: "Users cannot tell whether private speech is being captured.",
      metric: "No listening state"
    },
    partialExecution: {
      title: "Partial execution",
      body: "The recognizer hears 'archive...' and runs Archive before the final phrase or target is known.",
      consequence: "Partial recognition changes data before the user can repair it.",
      metric: "Runs on partial"
    },
    hiddenPhrase: {
      title: "Hidden phrase",
      body: "The visible button says Export data, but voice users must say the undocumented phrase download CSV.",
      consequence: "Speech-input users cannot speak what they see.",
      metric: "Label mismatch"
    },
    dictationConfusion: {
      title: "Dictation confusion",
      body: "A notes field treats 'send it later' as a global Send command instead of inserted prose.",
      consequence: "Dictation and command mode collide.",
      metric: "Mode leak"
    },
    noFallback: {
      title: "No fallback",
      body: "Microphone denied, unsupported language, and noisy-room states all hide the command controls.",
      consequence: "Voice failure blocks task completion.",
      metric: "Voice-only"
    },
    noConfirmation: {
      title: "No confirmation",
      body: "The phrase 'delete draft' immediately removes content without reading back the target or offering cancel.",
      consequence: "Recognition errors become destructive actions.",
      metric: "No read-back"
    },
    transcriptLeak: {
      title: "Transcript leak",
      body: "The app saves raw spoken text, including names and medical notes, in analytics logs.",
      consequence: "Sensitive speech persists beyond the command intent.",
      metric: "Raw transcript"
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example voice-command-bad-ux is-${mode}`}>
      <div className="demo-row voice-command-controls" aria-label="Voice command misuse controls">
        {voiceCommandBadLabels.map(([key, label]) => (
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
      <section className="voice-command-shell bad" aria-label={`Voice command failure: ${item.title}`}>
        <header className="voice-command-header">
          <div>
            <span>{item.title}</span>
            <strong>{item.metric}</strong>
          </div>
          <button type="button" className="voice-command-mic ghost" aria-label="Broken microphone trigger">Mic</button>
        </header>
        <p>{item.body}</p>
        <div className="voice-command-grid">
          <div><span>Listening</span><strong>{mode === "invisibleListening" ? "Hidden" : "Unclear"}</strong></div>
          <div><span>Transcript</span><strong>{mode === "transcriptLeak" ? "Stored raw" : "Not reviewable"}</strong></div>
          <div><span>Confirmation</span><strong>{mode === "noConfirmation" ? "Bypassed" : "Weak"}</strong></div>
          <div><span>Fallback</span><strong>{mode === "noFallback" ? "Missing" : "Unreliable"}</strong></div>
        </div>
      </section>
      <p className="demo-status" aria-live="polite">{item.consequence}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <VoiceCommandGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <VoiceCommandBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <VoiceCommandGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <VoiceCommandBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
