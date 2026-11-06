import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type LoginStage = "ready" | "verifying" | "failed" | "attempts" | "throttled" | "locked" | "unlock" | "success" | "notice";

function LoginAttemptFrame({
  stage = "ready",
  attempts = 3,
  wait = "2 minutes",
  unlocked = false,
  securityNotice = false,
  idSuffix = "sample"
}: {
  stage?: LoginStage;
  attempts?: number;
  wait?: string;
  unlocked?: boolean;
  securityNotice?: boolean;
  idSuffix?: string;
}) {
  const headingId = `login-outcome-title-${idSuffix}`;
  const status: Record<LoginStage, { title: string; body: string; tone: "neutral" | "warn" | "danger" | "success" }> = {
    ready: {
      title: "Ready to verify",
      body: "Credentials are ready to submit. The password will be protected after any failed attempt.",
      tone: "neutral"
    },
    verifying: {
      title: "Checking credentials",
      body: "The request is in progress, so duplicate login submissions are paused.",
      tone: "neutral"
    },
    failed: {
      title: "Could not verify details",
      body: "Use a neutral account-details error and keep retry, recovery, and passkey routes available.",
      tone: "warn"
    },
    attempts: {
      title: `${attempts} attempts remaining`,
      body: "Attempt feedback comes from server policy and avoids naming which credential failed.",
      tone: "warn"
    },
    throttled: {
      title: `Try again in ${wait}`,
      body: "A server-backed retry delay protects the account while still giving a clear next step.",
      tone: "warn"
    },
    locked: {
      title: "Login temporarily locked",
      body: "The login route offers unlock, recovery, and support rather than only disabling the form.",
      tone: "danger"
    },
    unlock: {
      title: "Unlock email sent",
      body: "Self-service unlock explains the email route without confirming sensitive account details.",
      tone: "success"
    },
    success: {
      title: "Session created",
      body: "Retry warnings are cleared and the authenticated destination can open.",
      tone: "success"
    },
    notice: {
      title: "Security notice",
      body: "Recent login details appear after success when policy says users should verify account activity.",
      tone: "success"
    }
  };
  const current = status[stage];
  return (
    <div className={`login-frame is-${stage}`}>
      <section className="login-credential" aria-label="Submitted credentials">
        <strong>Login attempt</strong>
        <label>
          <span>Email or username</span>
          <input autoComplete="username" value="maya@acme.example" readOnly />
        </label>
        <label>
          <span>Password</span>
          <input autoComplete="current-password" type="password" value={stage === "ready" || stage === "verifying" ? "saved-password" : ""} readOnly />
        </label>
      </section>
      <section className={`login-outcome is-${current.tone}`} aria-labelledby={headingId}>
        <span className="login-kicker">{stage === "success" || stage === "notice" ? "Authenticated" : stage === "locked" ? "Policy boundary" : "Attempt outcome"}</span>
        <h4 id={headingId}>{current.title}</h4>
        <p>{current.body}</p>
        <div className="login-policy-list">
          <span>Server counter: {stage === "success" ? "reset" : `${attempts} left`}</span>
          <span>Password value: {stage === "ready" || stage === "verifying" ? "hidden" : "cleared"}</span>
          <span>Retry: {stage === "throttled" ? wait : stage === "locked" ? "unlock needed" : "allowed"}</span>
        </div>
        {unlocked && <p className="login-inline-note">Unlock route sent to the registered email. Support remains available for inaccessible email.</p>}
        {securityNotice && <p className="login-inline-note">Last successful login: Today, 09:42 from Chrome on macOS.</p>}
        <div className="login-actions">
          <button type="button" className="demo-button primary">{stage === "success" || stage === "notice" ? "Open workspace" : stage === "locked" ? "Unlock account" : "Try login again"}</button>
          <button type="button" className="demo-button small">Use passkey</button>
          <button type="button" className="demo-button small">Forgot password</button>
        </div>
      </section>
    </div>
  );
}

function LoginGoodUi() {
  return (
    <div className="quality-example login-demo">
      <LoginAttemptFrame stage="attempts" attempts={2} idSuffix="good-ui" />
      <p className="demo-status">The login attempt keeps the identifier, clears the secret after failure, gives safe attempt feedback, and keeps recovery routes available.</p>
    </div>
  );
}

function LoginBadUi() {
  return (
    <div className="bad-ui-sample login-bad-demo is-revealReason">
      <strong>Password is wrong for maya@acme.example</strong>
      <div className="login-bad-grid">
        <span>Email exists</span>
        <span>Password failed</span>
        <span>Button disabled</span>
      </div>
      <p className="demo-status">The login result reveals account status, names the failed credential, and gives no safe recovery or retry policy.</p>
    </div>
  );
}

function LoginGoodUx() {
  const [stage, setStage] = useState<LoginStage>("ready");
  const [attempts, setAttempts] = useState(3);
  const [unlocked, setUnlocked] = useState(false);
  const [securityNotice, setSecurityNotice] = useState(false);
  const [message, setMessage] = useState("Login starts from a ready-to-submit attempt and treats the result as security-sensitive state.");

  function choose(nextStage: LoginStage, nextMessage: string, nextAttempts = attempts) {
    setStage(nextStage);
    setAttempts(nextAttempts);
    setMessage(nextMessage);
  }

  return (
    <div className="quality-example login-demo">
      <LoginAttemptFrame stage={stage} attempts={attempts} unlocked={unlocked} securityNotice={securityNotice} idSuffix="good-ux" />
      <div className="demo-row login-controls" aria-label="Login attempt exercise controls">
        <button type="button" className={stage === "verifying" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("verifying", "Verifying state prevents duplicate submissions while the server checks the login attempt.")}>Submit</button>
        <button type="button" className={stage === "failed" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("failed", "Generic failure preserves recovery options without exposing the exact credential problem.", 2)}>Generic failure</button>
        <button type="button" className={stage === "attempts" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("attempts", "Remaining attempts are server-backed and do not say whether the account or password was wrong.", 1)}>Attempts left</button>
        <button type="button" className={stage === "throttled" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("throttled", "Throttling shows a retry wait time instead of silently disabling login.", 1)}>Throttle</button>
        <button type="button" className={stage === "locked" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("locked", "Temporary lockout offers unlock, recovery, and support instead of dead-ending the user.", 0)}>Lockout</button>
        <button type="button" className={unlocked ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setUnlocked(true);
          choose("unlock", "Self-service unlock gives a safe route back without exposing extra account status.", 0);
        }}>Unlock email</button>
        <button type="button" className={stage === "success" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setUnlocked(false);
          setSecurityNotice(false);
          choose("success", "Successful login clears warnings, resets retry state, and creates the session.", 3);
        }}>Success</button>
        <button type="button" className={securityNotice ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setSecurityNotice(true);
          choose("notice", "Security notice appears after successful login when recent activity should be verified.", 3);
        }}>Security notice</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function LoginBadUx() {
  type Mode = "revealReason" | "silentDisable" | "clientCounter" | "captchaOnly" | "noUnlock" | "staleWarning" | "logsSecret";
  const [mode, setMode] = useState<Mode>("revealReason");
  const copy: Record<Mode, string> = {
    revealReason: "Different messages reveal which accounts exist and which password failed.",
    silentDisable: "The login button is disabled after failures with no wait time, retry reason, or recovery route.",
    clientCounter: "A client-only counter says one attempt remains even though the server has already throttled login.",
    captchaOnly: "A visual CAPTCHA is the only route after failure and has no accessible alternative.",
    noUnlock: "Temporary lockout gives no self-service unlock, support route, or expected retry time.",
    staleWarning: "Success leaves old failed-attempt warnings visible, so users cannot tell whether the session is clean.",
    logsSecret: "Analytics records the password field and exact failure reason during the login attempt."
  };
  const labels: Record<Mode, string[]> = {
    revealReason: ["Email exists", "Password wrong", "Try again"],
    silentDisable: ["Button disabled", "No wait time", "No recovery"],
    clientCounter: ["1 attempt left", "Server blocked", "Timer fake"],
    captchaOnly: ["Select buses", "No audio", "No support"],
    noUnlock: ["Locked", "No unlock", "Contact unknown"],
    staleWarning: ["Logged in", "Warning remains", "Counter stuck"],
    logsSecret: ["Password captured", "Reason logged", "Replay risk"]
  };
  return (
    <div className={`quality-example login-bad-demo is-${mode}`}>
      <strong>{mode === "captchaOnly" ? "Complete this challenge" : mode === "staleWarning" ? "Login succeeded?" : "Login failed"}</strong>
      <div className="login-bad-grid">
        {labels[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row login-controls">
        <button type="button" className={mode === "revealReason" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("revealReason")}>Reveals reason</button>
        <button type="button" className={mode === "silentDisable" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("silentDisable")}>Silent disable</button>
        <button type="button" className={mode === "clientCounter" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("clientCounter")}>Client counter</button>
        <button type="button" className={mode === "captchaOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("captchaOnly")}>CAPTCHA only</button>
        <button type="button" className={mode === "noUnlock" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noUnlock")}>No unlock</button>
        <button type="button" className={mode === "staleWarning" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleWarning")}>Stale warning</button>
        <button type="button" className={mode === "logsSecret" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("logsSecret")}>Logs secret</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <LoginGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <LoginBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <LoginGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <LoginBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
