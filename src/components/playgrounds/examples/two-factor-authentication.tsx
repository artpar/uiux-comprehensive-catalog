import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type TwoFactorStage = "code" | "push" | "hardware" | "wrong" | "expired" | "resend" | "alternate" | "recovery" | "trusted" | "success" | "manage";

function TwoFactorFrame({
  stage = "code",
  attempts = 2,
  trustDevice = false,
  idSuffix = "sample"
}: {
  stage?: TwoFactorStage;
  attempts?: number;
  trustDevice?: boolean;
  idSuffix?: string;
}) {
  const headingId = `two-factor-title-${idSuffix}`;
  const status: Record<TwoFactorStage, { kicker: string; title: string; body: string; tone: "neutral" | "warn" | "danger" | "success" }> = {
    code: {
      kicker: "Authenticator app",
      title: "Enter your 6-digit code",
      body: "Code entry supports paste and one-time-code autofill while keeping payroll settings blocked.",
      tone: "neutral"
    },
    push: {
      kicker: "Push approval",
      title: "Approve on your phone",
      body: "The waiting state names the enrolled device and keeps alternate methods available.",
      tone: "neutral"
    },
    hardware: {
      kicker: "Security key",
      title: "Touch your security key",
      body: "Hardware-key prompts keep cancel, recovery, and alternate-factor routes reachable.",
      tone: "neutral"
    },
    wrong: {
      kicker: "Challenge failed",
      title: `${attempts} attempts remaining`,
      body: "Wrong-code feedback comes from server policy and does not echo the submitted code.",
      tone: "warn"
    },
    expired: {
      kicker: "Expired code",
      title: "This code is no longer valid",
      body: "The user can request a new code or use another enrolled factor.",
      tone: "warn"
    },
    resend: {
      kicker: "Resend limit",
      title: "New code available in 01:30",
      body: "Resend timing is visible and server-backed so the channel cannot be flooded.",
      tone: "warn"
    },
    alternate: {
      kicker: "Alternate method",
      title: "Choose another enrolled factor",
      body: "Only factors already bound to the account are offered during the challenge.",
      tone: "neutral"
    },
    recovery: {
      kicker: "Recovery code",
      title: "Use one single-use recovery code",
      body: "Backup codes are treated as secrets and trigger account notification after use.",
      tone: "warn"
    },
    trusted: {
      kicker: "Trusted device",
      title: trustDevice ? "Trust this browser for 30 days" : "Ask every time on this browser",
      body: "The remembered-browser choice is explicit, scoped, and revocable from account settings.",
      tone: trustDevice ? "success" : "neutral"
    },
    success: {
      kicker: "Verified",
      title: "Additional factor accepted",
      body: "Challenge state clears and the user returns to payroll settings.",
      tone: "success"
    },
    manage: {
      kicker: "Factor management",
      title: "Replace a lost authenticator",
      body: "Factor changes require reauthentication or existing-factor proof before enrollment changes.",
      tone: "danger"
    }
  };
  const current = status[stage];
  const codeVisible = stage === "code" || stage === "wrong" || stage === "expired" || stage === "resend";

  return (
    <div className={`two-factor-frame is-${stage}`}>
      <section className="two-factor-context" aria-label="Protected action">
        <strong>Protected action</strong>
        <span>Payroll settings</span>
        <span>Account: maya@acme.example</span>
        <span>Primary password: verified</span>
      </section>
      <section className={`two-factor-challenge is-${current.tone}`} aria-labelledby={headingId}>
        <span className="two-factor-kicker">{current.kicker}</span>
        <h4 id={headingId}>{current.title}</h4>
        <p>{current.body}</p>
        {codeVisible && (
          <label className="two-factor-code">
            <span>One-time code</span>
            <input inputMode="numeric" autoComplete="one-time-code" value={stage === "wrong" ? "148920" : ""} placeholder="000000" readOnly />
          </label>
        )}
        {stage === "push" && <div className="two-factor-device">Waiting for Pixel 8 approval. Request expires in 45 seconds.</div>}
        {stage === "hardware" && <div className="two-factor-device">Security key requested through this browser session.</div>}
        {stage === "alternate" && (
          <div className="two-factor-methods">
            <span>Authenticator app</span>
            <span>Security key</span>
            <span>Recovery code</span>
          </div>
        )}
        {stage === "recovery" && <p className="two-factor-inline-note">Recovery code accepted once; add a replacement factor after access is restored.</p>}
        <div className="two-factor-policy">
          <span>Attempts: {stage === "success" ? "cleared" : `${attempts} left`}</span>
          <span>Bypass: blocked</span>
          <span>Trust: {trustDevice ? "30 days" : "not enabled"}</span>
        </div>
        <div className="two-factor-actions">
          <button type="button" className="demo-button primary">{stage === "success" ? "Open payroll settings" : "Verify factor"}</button>
          <button type="button" className="demo-button small">Try another method</button>
          <button type="button" className="demo-button small">Use recovery code</button>
        </div>
      </section>
    </div>
  );
}

function TwoFactorGoodUi() {
  return (
    <div className="quality-example two-factor-demo">
      <TwoFactorFrame stage="code" idSuffix="good-ui" />
      <p className="demo-status">The challenge names the protected action, requests a specific additional factor, supports one-time-code autofill, and keeps alternate methods visible.</p>
    </div>
  );
}

function TwoFactorBadUi() {
  return (
    <div className="bad-ui-sample two-factor-bad-demo is-unclear">
      <strong>Security check</strong>
      <div className="two-factor-bad-grid">
        <span>Enter code</span>
        <span>No factor named</span>
        <span>No recovery</span>
      </div>
      <p className="demo-status">The prompt does not say which device or factor is needed and offers no safe alternate route.</p>
    </div>
  );
}

function TwoFactorGoodUx() {
  const [stage, setStage] = useState<TwoFactorStage>("code");
  const [attempts, setAttempts] = useState(2);
  const [trustDevice, setTrustDevice] = useState(false);
  const [message, setMessage] = useState("The second factor blocks payroll settings until an enrolled factor succeeds.");

  function choose(nextStage: TwoFactorStage, nextMessage: string, nextAttempts = attempts) {
    setStage(nextStage);
    setAttempts(nextAttempts);
    setMessage(nextMessage);
  }

  return (
    <div className="quality-example two-factor-demo">
      <TwoFactorFrame stage={stage} attempts={attempts} trustDevice={trustDevice} idSuffix="good-ux" />
      <div className="demo-row two-factor-controls" aria-label="Two-factor authentication exercise controls">
        <button type="button" className={stage === "code" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("code", "Authenticator-code entry supports paste and one-time-code autocomplete.", 2)}>Code</button>
        <button type="button" className={stage === "push" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("push", "Push approval names the enrolled device and keeps fallback methods available.", 2)}>Push</button>
        <button type="button" className={stage === "hardware" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("hardware", "Hardware key waiting state keeps cancel and alternate-factor routes reachable.", 2)}>Security key</button>
        <button type="button" className={stage === "wrong" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("wrong", "Wrong-code feedback shows server-backed attempts without echoing the code.", 1)}>Wrong code</button>
        <button type="button" className={stage === "expired" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("expired", "Expired-code recovery offers resend or another enrolled method.", 1)}>Expired</button>
        <button type="button" className={stage === "resend" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("resend", "Resend wait prevents channel flooding while giving a clear next step.", 1)}>Resend wait</button>
        <button type="button" className={stage === "alternate" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("alternate", "Alternate factor selection is limited to methods already enrolled on the account.", 2)}>Alternate</button>
        <button type="button" className={stage === "recovery" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("recovery", "Recovery-code use is single-use and followed by notification and factor replacement.", 1)}>Recovery code</button>
        <button type="button" className={stage === "trusted" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("trusted", "Trusted-device copy explains browser scope, duration, and revocation.", 2)}>Trusted device</button>
        <button type="button" className={trustDevice ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setTrustDevice((value) => !value);
          choose("trusted", "The remembered-browser choice changes only after the user explicitly opts in.", 2);
        }}>Toggle trust</button>
        <button type="button" className={stage === "success" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("success", "Successful verification clears challenge state and returns to the protected action.", 2)}>Success</button>
        <button type="button" className={stage === "manage" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("manage", "Factor replacement requires stronger proof and cannot be reached by password alone.", 2)}>Manage factor</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function TwoFactorBadUx() {
  type Mode = "bypass" | "noRecovery" | "reusableCode" | "unsafeTrust" | "smsOnly" | "weakChange" | "logsCode";
  const [mode, setMode] = useState<Mode>("bypass");
  const copy: Record<Mode, string> = {
    bypass: "The protected route opens in another tab without a completed second factor.",
    noRecovery: "A lost phone leaves the user with no recovery code, alternate factor, or support route.",
    reusableCode: "The same backup code works more than once and has no notification after use.",
    unsafeTrust: "Remember this device is already checked on a shared computer.",
    smsOnly: "SMS is the only second factor even when the user has no signal or needs stronger assurance.",
    weakChange: "The enrolled phone number can be changed with only the account password.",
    logsCode: "Analytics records the one-time code and exact failure reason."
  };
  const labels: Record<Mode, string[]> = {
    bypass: ["URL changed", "Payroll opens", "No factor"],
    noRecovery: ["Phone lost", "No backup", "Support hidden"],
    reusableCode: ["Code reused", "No alert", "No lockout"],
    unsafeTrust: ["Checked by default", "Shared browser", "No revocation"],
    smsOnly: ["No signal", "No app code", "No key"],
    weakChange: ["Password only", "Phone replaced", "Account takeover"],
    logsCode: ["Code captured", "Failure logged", "Replay risk"]
  };

  return (
    <div className={`quality-example two-factor-bad-demo is-${mode}`}>
      <strong>{mode === "bypass" ? "Second factor skipped" : mode === "weakChange" ? "Change MFA phone" : "MFA failure"}</strong>
      <div className="two-factor-bad-grid">
        {labels[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row two-factor-controls">
        <button type="button" className={mode === "bypass" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("bypass")}>Bypass route</button>
        <button type="button" className={mode === "noRecovery" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noRecovery")}>No recovery</button>
        <button type="button" className={mode === "reusableCode" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("reusableCode")}>Reusable backup</button>
        <button type="button" className={mode === "unsafeTrust" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("unsafeTrust")}>Unsafe trust</button>
        <button type="button" className={mode === "smsOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("smsOnly")}>SMS only</button>
        <button type="button" className={mode === "weakChange" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("weakChange")}>Weak change</button>
        <button type="button" className={mode === "logsCode" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("logsCode")}>Logs code</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <TwoFactorGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <TwoFactorBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <TwoFactorGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <TwoFactorBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
