import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type PasswordResetStage = "request" | "sent" | "resend" | "code" | "expired" | "used" | "newPassword" | "sessions" | "complete" | "support";

function PasswordResetFrame({
  stage = "request",
  wait = "04:58",
  revokeSessions = true,
  idSuffix = "sample"
}: {
  stage?: PasswordResetStage;
  wait?: string;
  revokeSessions?: boolean;
  idSuffix?: string;
}) {
  const headingId = `password-reset-title-${idSuffix}`;
  const status: Record<PasswordResetStage, { kicker: string; title: string; body: string; tone: "neutral" | "warn" | "danger" | "success" }> = {
    request: {
      kicker: "Recovery request",
      title: "Enter your account email",
      body: "The form accepts an identifier but will not reveal whether an account exists.",
      tone: "neutral"
    },
    sent: {
      kicker: "Delivery confirmation",
      title: "Check your email",
      body: "If an account uses this email, reset instructions have been sent.",
      tone: "success"
    },
    resend: {
      kicker: "Rate limit",
      title: `Resend available in ${wait}`,
      body: "The wait time is server-backed and applies without exposing account status.",
      tone: "warn"
    },
    code: {
      kicker: "Reset artifact",
      title: "Enter the 6-digit code",
      body: "Codes can be pasted, expire quickly, and are checked against the active request.",
      tone: "neutral"
    },
    expired: {
      kicker: "Expired artifact",
      title: "This reset link expired",
      body: "The user can request a new reset link instead of hitting a dead end.",
      tone: "warn"
    },
    used: {
      kicker: "Revoked artifact",
      title: "This reset link was already used",
      body: "Single-use links are rejected and the recovery path restarts safely.",
      tone: "danger"
    },
    newPassword: {
      kicker: "Trusted reset session",
      title: "Create a new password",
      body: "The reset token has been validated; the new secret follows password creation rules.",
      tone: "neutral"
    },
    sessions: {
      kicker: "Session cleanup",
      title: revokeSessions ? "Sign out other sessions" : "Keep current devices signed in",
      body: "The policy for remembered devices and active sessions is visible before completion.",
      tone: revokeSessions ? "warn" : "neutral"
    },
    complete: {
      kicker: "Reset complete",
      title: "Password changed",
      body: "Reset artifacts are invalidated and the account receives a security notification.",
      tone: "success"
    },
    support: {
      kicker: "Recovery support",
      title: "Need another recovery route?",
      body: "Support is available for inaccessible email without revealing private account details.",
      tone: "neutral"
    }
  };
  const current = status[stage];
  const showRequest = stage === "request" || stage === "sent" || stage === "resend" || stage === "support";
  const showArtifact = stage === "code" || stage === "expired" || stage === "used";

  return (
    <div className={`password-reset-frame is-${stage}`}>
      <section className="password-reset-request" aria-label="Reset request">
        <strong>Reset request</strong>
        {showRequest ? (
          <label>
            <span>Email or username</span>
            <input autoComplete="username" value="maya@acme.example" readOnly />
          </label>
        ) : (
          <div className="password-reset-token">
            <span>Recovery artifact</span>
            <strong>{showArtifact ? "Single-use link or 6-digit code" : "Validated reset session"}</strong>
          </div>
        )}
      </section>
      <section className={`password-reset-status is-${current.tone}`} aria-labelledby={headingId}>
        <span className="password-reset-kicker">{current.kicker}</span>
        <h4 id={headingId}>{current.title}</h4>
        <p>{current.body}</p>
        <div className="password-reset-policy">
          <span>Visible result: neutral</span>
          <span>Artifact: {showArtifact ? "checked server-side" : stage === "request" ? "not issued" : "protected"}</span>
          <span>Sessions: {stage === "sessions" || stage === "complete" ? (revokeSessions ? "reviewed" : "policy kept") : "unchanged"}</span>
        </div>
        {stage === "newPassword" && (
          <label className="password-reset-new-password">
            <span>New password</span>
            <input type="password" autoComplete="new-password" value="generated-passphrase-92" readOnly />
          </label>
        )}
        {stage === "complete" && <p className="password-reset-inline-note">Security email sent. Reset token and old recovery code are no longer usable.</p>}
        <div className="password-reset-actions">
          <button type="button" className="demo-button primary">{stage === "request" ? "Send reset instructions" : stage === "newPassword" ? "Change password" : stage === "complete" ? "Return to sign in" : "Request new link"}</button>
          <button type="button" className="demo-button small">{stage === "sessions" ? "Review devices" : "Need help"}</button>
        </div>
      </section>
    </div>
  );
}

function PasswordResetGoodUi() {
  return (
    <div className="quality-example password-reset-demo">
      <PasswordResetFrame stage="sent" idSuffix="good-ui" />
      <p className="demo-status">The reset request confirms delivery neutrally, keeps resend and support routes visible, and does not reveal whether the account exists.</p>
    </div>
  );
}

function PasswordResetBadUi() {
  return (
    <div className="bad-ui-sample password-reset-bad-demo is-accountReveal">
      <strong>No account found for maya@acme.example</strong>
      <div className="password-reset-bad-grid">
        <span>Email checked</span>
        <span>Account missing</span>
        <span>Try another</span>
      </div>
      <p className="demo-status">The reset request confirms account status and teaches attackers which identifiers are registered.</p>
    </div>
  );
}

function PasswordResetGoodUx() {
  const [stage, setStage] = useState<PasswordResetStage>("request");
  const [revokeSessions, setRevokeSessions] = useState(true);
  const [message, setMessage] = useState("Password reset starts with a neutral recovery request and only shows the new-password step after the reset artifact is trusted.");

  function choose(nextStage: PasswordResetStage, nextMessage: string) {
    setStage(nextStage);
    setMessage(nextMessage);
  }

  return (
    <div className="quality-example password-reset-demo">
      <PasswordResetFrame stage={stage} revokeSessions={revokeSessions} idSuffix="good-ux" />
      <div className="demo-row password-reset-controls" aria-label="Password reset exercise controls">
        <button type="button" className={stage === "request" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("request", "The request form collects an identifier while preserving account privacy.")}>Request</button>
        <button type="button" className={stage === "sent" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("sent", "Delivery confirmation stays neutral for known and unknown accounts.")}>Sent</button>
        <button type="button" className={stage === "resend" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("resend", "Resend timing is server-backed so repeated requests cannot flood the recovery channel.")}>Resend wait</button>
        <button type="button" className={stage === "code" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("code", "The code state treats the reset artifact as a protected verifier with paste and attempt limits.")}>Code entry</button>
        <button type="button" className={stage === "expired" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("expired", "Expired links recover by requesting a fresh artifact instead of showing a dead error.")}>Expired</button>
        <button type="button" className={stage === "used" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("used", "Already-used links are revoked and cannot be replayed.")}>Used link</button>
        <button type="button" className={stage === "newPassword" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("newPassword", "Only a validated reset session can show the new-password form.")}>New password</button>
        <button type="button" className={stage === "sessions" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("sessions", "Session cleanup is surfaced before completion so users understand device impact.")}>Sessions</button>
        <button type="button" className={revokeSessions ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setRevokeSessions((value) => !value);
          choose("sessions", "Session policy changes the cleanup copy without changing reset-token validation.");
        }}>Toggle revoke</button>
        <button type="button" className={stage === "complete" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("complete", "Completion invalidates reset artifacts and sends a security notification.")}>Complete</button>
        <button type="button" className={stage === "support" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("support", "Support covers inaccessible recovery channels without confirming private account details.")}>Support</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function PasswordResetBadUx() {
  type Mode = "accountReveal" | "reusableToken" | "noExpiry" | "autoSignin" | "emailedPassword" | "deadLink" | "noRateLimit";
  const [mode, setMode] = useState<Mode>("accountReveal");
  const copy: Record<Mode, string> = {
    accountReveal: "The request says which email addresses have accounts.",
    reusableToken: "The same reset link works again after the password has changed.",
    noExpiry: "The link has no visible or enforced expiry, so old mail can reset the account later.",
    autoSignin: "The user is signed in automatically after reset with no session or device review.",
    emailedPassword: "The service emails a temporary password instead of using a protected reset session.",
    deadLink: "An expired link opens a blank error with no request-new-link action.",
    noRateLimit: "The resend button can flood the recovery mailbox and code entry has no attempt limit."
  };
  const labels: Record<Mode, string[]> = {
    accountReveal: ["No account found", "Email checked", "Try another"],
    reusableToken: ["Used twice", "Old link works", "Replay possible"],
    noExpiry: ["No expiry", "Old email valid", "No revocation"],
    autoSignin: ["Reset done", "Signed in now", "Devices hidden"],
    emailedPassword: ["Password: Temp123", "Inbox secret", "No reset session"],
    deadLink: ["Invalid token", "Blank page", "No recovery"],
    noRateLimit: ["Resend again", "Unlimited codes", "Mailbox flooded"]
  };

  return (
    <div className={`quality-example password-reset-bad-demo is-${mode}`}>
      <strong>{mode === "emailedPassword" ? "Here is your new password" : mode === "deadLink" ? "Invalid reset link" : "Password reset problem"}</strong>
      <div className="password-reset-bad-grid">
        {labels[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row password-reset-controls">
        <button type="button" className={mode === "accountReveal" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("accountReveal")}>Account reveal</button>
        <button type="button" className={mode === "reusableToken" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("reusableToken")}>Reusable token</button>
        <button type="button" className={mode === "noExpiry" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noExpiry")}>No expiry</button>
        <button type="button" className={mode === "autoSignin" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("autoSignin")}>Auto sign-in</button>
        <button type="button" className={mode === "emailedPassword" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("emailedPassword")}>Emailed password</button>
        <button type="button" className={mode === "deadLink" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("deadLink")}>Dead link</button>
        <button type="button" className={mode === "noRateLimit" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noRateLimit")}>No rate limit</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PasswordResetGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PasswordResetBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PasswordResetGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PasswordResetBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
