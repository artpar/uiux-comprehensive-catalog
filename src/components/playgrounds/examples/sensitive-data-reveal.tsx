import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type SensitiveRevealMode =
  | "masked"
  | "reveal"
  | "hide"
  | "hold"
  | "timed"
  | "reauth"
  | "partial"
  | "full"
  | "copyHidden"
  | "clipboard"
  | "audit"
  | "redaction"
  | "shoulder"
  | "expired"
  | "screenReader"
  | "mobile";

type SensitiveRevealBadMode =
  | "autoRevealed"
  | "permanentVisible"
  | "copiedSilently"
  | "wrongField"
  | "noHide"
  | "afterBlur"
  | "logsRaw";

const sensitiveRevealGoodLabels: Array<[SensitiveRevealMode, string]> = [
  ["masked", "Masked state"],
  ["reveal", "Reveal action"],
  ["hide", "Hide action"],
  ["hold", "Hold-to-reveal"],
  ["timed", "Timed reveal"],
  ["reauth", "Reauthentication"],
  ["partial", "Partial reveal"],
  ["full", "Full reveal"],
  ["copyHidden", "Copy while hidden"],
  ["clipboard", "Clipboard warning"],
  ["audit", "Audit event"],
  ["redaction", "Redaction boundary"],
  ["shoulder", "Shoulder-surfing warning"],
  ["expired", "Expired reveal"],
  ["screenReader", "Screen reader announcement"],
  ["mobile", "Mobile compact"]
];

const sensitiveRevealBadLabels: Array<[SensitiveRevealBadMode, string]> = [
  ["autoRevealed", "Auto-revealed secret"],
  ["permanentVisible", "Permanent visible"],
  ["copiedSilently", "Copied silently"],
  ["wrongField", "Wrong field revealed"],
  ["noHide", "No hide action"],
  ["afterBlur", "Reveals after blur"],
  ["logsRaw", "Logs raw secret"]
];

function SensitiveDataRevealFrame({ mode = "masked", idSuffix = "static" }: { mode?: SensitiveRevealMode; idSuffix?: string }) {
  const config: Record<SensitiveRevealMode, {
    chip: string;
    title: string;
    body: string;
    value: string;
    visibility: string;
    policy: string;
    status: string;
    primary: string;
    secondary: string;
    visible?: boolean;
    compact?: boolean;
  }> = {
    masked: {
      chip: "Masked state",
      title: "Production API key",
      body: "The key is masked by default with only a safe suffix visible.",
      value: "sk_live_••••••••••••9H2Q",
      visibility: "Hidden except suffix",
      policy: "Reveal requires role and reason",
      status: "Masked state protects the secret until a deliberate reveal action.",
      primary: "Reveal API key",
      secondary: "Copy while hidden"
    },
    reveal: {
      chip: "Reveal action",
      title: "Reveal production API key?",
      body: "The button names the exact field that will become visible before exposure.",
      value: "sk_live_••••••••••••9H2Q",
      visibility: "Ready to reveal",
      policy: "Reason captured",
      status: "Reveal action is explicit and tied to one sensitive value.",
      primary: "Reveal API key",
      secondary: "Cancel"
    },
    hide: {
      chip: "Hide action",
      title: "Production API key is visible",
      body: "The hide action is reachable while the full value is visible.",
      value: "sk_live_ops_4H7K_9H2Q",
      visibility: "Visible now",
      policy: "Auto-hide in 30 seconds",
      status: "Hide action gives immediate control after reveal.",
      primary: "Hide API key",
      secondary: "Copy visible value",
      visible: true
    },
    hold: {
      chip: "Hold-to-reveal",
      title: "Hold to peek at recovery code",
      body: "A short peek helps transcription without leaving the code visible.",
      value: "•••• •••• 48QK",
      visibility: "Visible only while held",
      policy: "Keyboard timed alternative available",
      status: "Hold-to-reveal supports short-lived inspection without permanent exposure.",
      primary: "Hold to reveal",
      secondary: "Timed reveal"
    },
    timed: {
      chip: "Timed reveal",
      title: "Token visible for 30 seconds",
      body: "A countdown and auto-mask reduce accidental persistence.",
      value: "tok_prod_3917_8KQ2",
      visibility: "Visible, 23 seconds left",
      policy: "Auto-hide on timeout",
      status: "Timed reveal shows duration and masks again automatically.",
      primary: "Hide now",
      secondary: "Extend after reauth",
      visible: true
    },
    reauth: {
      chip: "Reauthentication",
      title: "Verify again to reveal tax ID",
      body: "Full reveal of customer tax ID requires step-up verification and reason capture.",
      value: "•••-••-2490",
      visibility: "Partial only",
      policy: "Reauthentication required",
      status: "Reauthentication gates high-risk full reveal.",
      primary: "Verify to reveal",
      secondary: "Keep partial"
    },
    partial: {
      chip: "Partial reveal",
      title: "Customer SSN verification",
      body: "The support task needs only last four digits, so full value is never loaded.",
      value: "•••-••-2490",
      visibility: "Last four only",
      policy: "Full value redacted",
      status: "Partial reveal gives enough verification without exposing the complete identifier.",
      primary: "Confirm last four",
      secondary: "Request exception"
    },
    full: {
      chip: "Full reveal",
      title: "Secret variable revealed",
      body: "Full reveal is allowed after role check, reason, and audit event creation.",
      value: "DATABASE_URL=postgres://ops:••@prod",
      visibility: "Full value visible",
      policy: "Audited access",
      status: "Full reveal appears only when the policy permits complete exposure.",
      primary: "Hide now",
      secondary: "Rotate secret",
      visible: true
    },
    copyHidden: {
      chip: "Copy while hidden",
      title: "Copy API key without displaying it",
      body: "The copy action can transfer the value while the screen stays masked.",
      value: "sk_live_••••••••••••9H2Q",
      visibility: "Hidden on screen",
      policy: "Clipboard warning shown",
      status: "Copy while hidden avoids visual exposure but still treats clipboard as risky.",
      primary: "Copy hidden value",
      secondary: "Show instead"
    },
    clipboard: {
      chip: "Clipboard warning",
      title: "Secret copied to clipboard",
      body: "Clipboard history may retain the token. Paste it only into the intended destination.",
      value: "sk_live_••••••••••••9H2Q",
      visibility: "Hidden after copy",
      policy: "Clipboard clears after 60 seconds if supported",
      status: "Clipboard warning makes the hidden copy consequence visible.",
      primary: "Clear clipboard",
      secondary: "View audit event"
    },
    audit: {
      chip: "Audit event",
      title: "Reveal recorded",
      body: "The audit event stores actor, reason, timestamp, field, and access ID without the raw value.",
      value: "sk_live_••••••••••••9H2Q",
      visibility: "Hidden",
      policy: "Access ID SEC-4821",
      status: "Audit event proves access without logging the raw secret.",
      primary: "Open audit event",
      secondary: "Hide details"
    },
    redaction: {
      chip: "Redaction boundary",
      title: "Full card number cannot be revealed",
      body: "Policy allows last four only; the full number is not sent to this client.",
      value: "•••• •••• •••• 1129",
      visibility: "Last four only",
      policy: "Full value unavailable",
      status: "Redaction boundary enforces policy beyond visual masking.",
      primary: "Request access",
      secondary: "Use last four"
    },
    shoulder: {
      chip: "Shoulder-surfing warning",
      title: "Check your surroundings",
      body: "This reveal may expose a production secret on shared screens or in a public workspace.",
      value: "sk_live_••••••••••••9H2Q",
      visibility: "Hidden until confirmed",
      policy: "Shared-screen warning",
      status: "Shoulder-surfing warning appears before high-risk reveal.",
      primary: "Reveal anyway",
      secondary: "Cancel"
    },
    expired: {
      chip: "Expired reveal",
      title: "Reveal expired",
      body: "The value was hidden after timeout and must be revealed again for another viewing window.",
      value: "tok_prod_••••••••8KQ2",
      visibility: "Hidden again",
      policy: "Expired after 30 seconds",
      status: "Expired reveal returns to a masked state and keeps focus stable.",
      primary: "Reveal again",
      secondary: "Done"
    },
    screenReader: {
      chip: "Screen reader announcement",
      title: "Sensitive value hidden",
      body: "Status announces shown, hidden, copied, expired, denied, and redacted outcomes without reading the raw value unexpectedly.",
      value: "recovery-code-••••-48QK",
      visibility: "Hidden",
      policy: "Status text excludes raw value",
      status: "Screen reader announcement communicates state without surprise disclosure.",
      primary: "Show code",
      secondary: "Hear status"
    },
    mobile: {
      chip: "Mobile compact",
      title: "Reveal bank account number?",
      body: "Masked value, reveal, hide, copy, timeout, and policy status remain readable in compact width.",
      value: "••••••••3917",
      visibility: "Masked",
      policy: "Timed reveal",
      status: "Mobile compact keeps sensitive controls wrapped and separated.",
      primary: "Reveal",
      secondary: "Copy hidden",
      compact: true
    }
  };

  const item = config[mode];
  const titleId = `sensitive-reveal-title-${idSuffix}`;
  const descId = `sensitive-reveal-desc-${idSuffix}`;

  return (
    <div className={`sensitive-reveal-frame is-${mode} ${item.compact ? "is-compact" : ""}`}>
      <section className={item.visible ? "sensitive-reveal-card is-visible" : "sensitive-reveal-card"} aria-labelledby={titleId} aria-describedby={descId}>
        <div className="sensitive-reveal-head">
          <div>
            <span>{item.chip}</span>
            <strong id={titleId}>{item.title}</strong>
          </div>
          <b>{item.visibility}</b>
        </div>
        <p id={descId}>{item.body}</p>
        <div className="sensitive-reveal-value" aria-label={`${item.title} value`}>
          <code>{item.value}</code>
          <span>{item.visible ? "Sensitive value visible now" : "Sensitive value masked"}</span>
        </div>
        <div className="sensitive-reveal-grid" aria-label="Sensitive reveal policy">
          <div><span>Field</span><strong>{item.title}</strong></div>
          <div><span>Policy</span><strong>{item.policy}</strong></div>
          <div><span>Visibility</span><strong>{item.visibility}</strong></div>
          <div><span>Protection</span><strong>{item.status}</strong></div>
        </div>
        <div className="sensitive-reveal-actions">
          <button type="button" className="demo-button small primary">{item.primary}</button>
          <button type="button" className="demo-button small">{item.secondary}</button>
        </div>
      </section>
      <aside className="sensitive-reveal-audit" aria-label="Reveal audit summary">
        <div><span>Audit event</span><strong>{mode === "audit" || mode === "full" ? "Recorded without raw value" : "Pending reveal action"}</strong></div>
        <div><span>Clipboard warning</span><strong>{mode === "clipboard" || mode === "copyHidden" ? "Visible before and after copy" : "Shown only when copying"}</strong></div>
      </aside>
    </div>
  );
}

function SensitiveDataRevealGoodUi() {
  return (
    <div className="quality-example sensitive-reveal-demo-shell">
      <div className="sensitive-reveal-console">
        <div className="sensitive-reveal-top">
          <strong>Security console</strong>
          <span>Masked sensitive value</span>
        </div>
        <SensitiveDataRevealFrame mode="masked" idSuffix="good-ui" />
      </div>
      <p className="demo-status">The UI starts in a masked state, names the sensitive field, separates reveal, hide, copy, timeout, clipboard warning, and audit event behavior.</p>
    </div>
  );
}

function SensitiveDataRevealBadUi() {
  return (
    <div className="bad-ui-sample sensitive-reveal-bad-ui">
      <div className="sensitive-reveal-console">
        <div className="sensitive-reveal-top bad">
          <strong>Secret settings</strong>
          <span>Auto-revealed secret</span>
        </div>
        <section className="sensitive-reveal-card bad" aria-label="Broken sensitive-data reveal">
          <div className="sensitive-reveal-head">
            <div>
              <span>Permanent visible</span>
              <strong>Production API key</strong>
            </div>
            <b>No hide action</b>
          </div>
          <p>The secret is visible on load, copied silently, and logged raw in support metadata.</p>
          <div className="sensitive-reveal-value bad">
            <code>sk_live_raw_4H7K_9H2Q</code>
            <span>Raw value exposed</span>
          </div>
          <div className="sensitive-reveal-grid">
            <div><span>Failure</span><strong>Wrong field revealed</strong></div>
            <div><span>Blur</span><strong>Reveals after blur</strong></div>
            <div><span>Logs</span><strong>Logs raw secret</strong></div>
            <div><span>Copy</span><strong>Copied silently</strong></div>
          </div>
          <div className="sensitive-reveal-actions">
            <button type="button" className="demo-button small danger">Copy</button>
          </div>
        </section>
      </div>
      <p className="demo-status">The broken UI exposes the raw secret by default, lacks a hide action, and treats copy and logging as harmless.</p>
    </div>
  );
}

function SensitiveDataRevealGoodUx() {
  const [mode, setMode] = useState<SensitiveRevealMode>("masked");
  return (
    <div className="quality-example sensitive-reveal-demo-shell">
      <div className="demo-row sensitive-reveal-controls" aria-label="Sensitive data reveal exercise controls">
        {sensitiveRevealGoodLabels.map(([key, label]) => (
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
      <div className="sensitive-reveal-console">
        <div className="sensitive-reveal-top">
          <strong>Security console</strong>
          <span>Password, API key, token, recovery code, bank account, card number, tax identifier, and health identifier reveals stay policy-bound.</span>
        </div>
        <SensitiveDataRevealFrame mode={mode} idSuffix="good-ux" />
      </div>
      <p className="demo-status" aria-live="polite">Sensitive-data reveal state: {sensitiveRevealGoodLabels.find(([key]) => key === mode)?.[1]}.</p>
    </div>
  );
}

function SensitiveDataRevealBadUx() {
  const [mode, setMode] = useState<SensitiveRevealBadMode>("autoRevealed");
  const copy: Record<SensitiveRevealBadMode, { title: string; body: string; detail: string; status: string }> = {
    autoRevealed: {
      title: "Auto-revealed secret",
      body: "The production token appears in plain text on page load before the user asks for it.",
      detail: "Visible on load",
      status: "Auto-revealed secret creates immediate shoulder-surfing and screenshot risk."
    },
    permanentVisible: {
      title: "Permanent visible",
      body: "After reveal, the value stays visible across navigation and has no timeout.",
      detail: "No expiry",
      status: "Permanent visible treats temporary inspection as lasting disclosure."
    },
    copiedSilently: {
      title: "Copied silently",
      body: "Copy places the raw token on the clipboard without warning, status, or clear action label.",
      detail: "Clipboard hidden",
      status: "Copied silently hides clipboard exposure from the user."
    },
    wrongField: {
      title: "Wrong field revealed",
      body: "The user tries to reveal the staging key, but the production key is shown instead.",
      detail: "Field mismatch",
      status: "Wrong field revealed breaks the field-specific reveal contract."
    },
    noHide: {
      title: "No hide action",
      body: "The interface has Show but no Hide, so the user cannot quickly re-mask the value.",
      detail: "Show only",
      status: "No hide action leaves users without control after exposure."
    },
    afterBlur: {
      title: "Reveals after blur",
      body: "Moving focus away changes the field from masked to visible, exposing the value while the user is elsewhere.",
      detail: "Focus leak",
      status: "Reveals after blur turns ordinary navigation into disclosure."
    },
    logsRaw: {
      title: "Logs raw secret",
      body: "The support event, analytics payload, console output, and audit record include the raw secret.",
      detail: "Telemetry leak",
      status: "Logs raw secret defeats the purpose of controlled reveal."
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example sensitive-reveal-bad-ux is-${mode}`}>
      <div className="demo-row sensitive-reveal-controls" aria-label="Sensitive data reveal misuse controls">
        {sensitiveRevealBadLabels.map(([key, label]) => (
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
      <div className="sensitive-reveal-console">
        <div className="sensitive-reveal-top bad">
          <strong>Broken reveal flow</strong>
          <span>{item.detail}</span>
        </div>
        <section className="sensitive-reveal-card bad" aria-label={`Broken state: ${item.title}`}>
          <div className="sensitive-reveal-head">
            <div>
              <span>{item.title}</span>
              <strong>{item.detail}</strong>
            </div>
            <b>Unsafe</b>
          </div>
          <p>{item.body}</p>
          <div className="sensitive-reveal-value bad">
            <code>{mode === "wrongField" ? "sk_live_PROD_9H2Q" : mode === "logsRaw" ? "audit.raw=sk_live_4H7K_9H2Q" : "sk_live_raw_4H7K_9H2Q"}</code>
            <span>{item.status}</span>
          </div>
          <div className="sensitive-reveal-grid">
            <div><span>Masked state</span><strong>{mode === "autoRevealed" ? "Skipped" : "Unreliable"}</strong></div>
            <div><span>Hide action</span><strong>{mode === "noHide" ? "Missing" : "Not trustworthy"}</strong></div>
            <div><span>Clipboard warning</span><strong>{mode === "copiedSilently" ? "Missing" : "Not enforced"}</strong></div>
            <div><span>Audit event</span><strong>{mode === "logsRaw" ? "Raw secret logged" : "No safe evidence"}</strong></div>
          </div>
          <div className="sensitive-reveal-actions">
            <button type="button" className="demo-button small danger">{mode === "copiedSilently" ? "Copy raw value" : "Continue"}</button>
            <button type="button" className="demo-button small" disabled={mode === "noHide" || mode === "permanentVisible"}>Hide value</button>
          </div>
        </section>
      </div>
      <p className="demo-status" aria-live="polite">{item.status}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SensitiveDataRevealGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SensitiveDataRevealBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SensitiveDataRevealGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SensitiveDataRevealBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
