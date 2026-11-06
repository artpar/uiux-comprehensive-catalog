import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type SessionTimeoutExpiredMode =
  | "expired"
  | "hidden"
  | "savedDraft"
  | "reauth"
  | "validateReturn"
  | "restored"
  | "noRecovery"
  | "startAgain"
  | "multiTab"
  | "idp"
  | "mobile";

type SessionTimeoutExpiredBadMode =
  | "privateLeak"
  | "staleControls"
  | "accessDeniedCopy"
  | "lostReturn"
  | "falseSaved"
  | "tokenLog"
  | "retryLoop";

const sessionTimeoutExpiredGoodLabels: Array<[SessionTimeoutExpiredMode, string]> = [
  ["expired", "Expired"],
  ["hidden", "Hidden private content"],
  ["savedDraft", "Saved draft"],
  ["reauth", "Reauthenticate"],
  ["validateReturn", "Validate return"],
  ["restored", "Restored task"],
  ["noRecovery", "No recovery"],
  ["startAgain", "Start again"],
  ["multiTab", "Multiple-tab timeout"],
  ["idp", "Identity-provider timeout"],
  ["mobile", "Mobile compact"]
];

const sessionTimeoutExpiredBadLabels: Array<[SessionTimeoutExpiredBadMode, string]> = [
  ["privateLeak", "Private leak"],
  ["staleControls", "Stale controls"],
  ["accessDeniedCopy", "Access-denied copy"],
  ["lostReturn", "Lost return"],
  ["falseSaved", "False saved"],
  ["tokenLog", "Token log"],
  ["retryLoop", "Retry loop"]
];

function SessionTimeoutExpiredFrame({ mode, idSuffix }: { mode: SessionTimeoutExpiredMode; idSuffix: string }) {
  const config: Record<SessionTimeoutExpiredMode, {
    chip: string;
    title: string;
    body: string;
    reference: string;
    draft: string;
    contentState: string;
    returnTarget: string;
    primary: string;
    secondary: string;
    tertiary: string;
    outcome: string;
    compact?: boolean;
    blocked?: boolean;
  }> = {
    expired: {
      chip: "Expired session",
      title: "Your session ended after inactivity",
      body: "Private claim details are hidden until you sign in again. The recovery reference is safe to show.",
      reference: "Reference SES-2048",
      draft: "Saved at 10:42",
      contentState: "Private answers hidden",
      returnTarget: "Claim review",
      primary: "Sign in again",
      secondary: "Start again",
      tertiary: "Help with reference",
      outcome: "The page is signed out, protected, and still gives the user a safe path back."
    },
    hidden: {
      chip: "Hidden private content",
      title: "Protected content is locked",
      body: "Names, income values, uploads, and action controls are removed from view and from the active task area.",
      reference: "Masked claim ****2048",
      draft: "Server draft exists",
      contentState: "Sensitive DOM replaced",
      returnTarget: "Same form step after sign-in",
      primary: "Reauthenticate",
      secondary: "Leave safely",
      tertiary: "View policy",
      outcome: "The timeout state protects shared-device privacy instead of putting a modal over readable content.",
      blocked: true
    },
    savedDraft: {
      chip: "Saved draft",
      title: "Draft can be restored after sign-in",
      body: "The latest server-saved copy is available, but private fields stay hidden until the session is renewed.",
      reference: "Reference SES-2048",
      draft: "Saved draft 10:42",
      contentState: "Recoverable after auth",
      returnTarget: "Evidence upload",
      primary: "Sign in to restore",
      secondary: "Start a new claim",
      tertiary: "Copy reference",
      outcome: "The state separates safe draft evidence from protected values."
    },
    reauth: {
      chip: "Reauthentication required",
      title: "Verify before continuing",
      body: "The existing session is no longer valid. Verification creates a fresh session before data is restored.",
      reference: "Current account masked",
      draft: "Return target held",
      contentState: "Actions disabled",
      returnTarget: "Claim review",
      primary: "Verify identity",
      secondary: "Cancel",
      tertiary: "Use another account",
      outcome: "Reauthentication is the next step; the expired page does not keep privileged controls alive."
    },
    validateReturn: {
      chip: "Validate return",
      title: "Checking the return target",
      body: "After sign-in, the product verifies account, permission, route, draft, and policy before restoring content.",
      reference: "SES-2048",
      draft: "Draft token validated",
      contentState: "Still hidden",
      returnTarget: "Allowed claim step",
      primary: "Continue after check",
      secondary: "Choose dashboard",
      tertiary: "Contact support",
      outcome: "The flow avoids restoring the wrong account or an unsafe return URL."
    },
    restored: {
      chip: "Restored task",
      title: "You are back on the claim review",
      body: "The new session is active, the draft was restored, and focus can return to the interrupted step.",
      reference: "SES-2048 restored",
      draft: "Server saved 10:42",
      contentState: "Private fields available",
      returnTarget: "Claim review",
      primary: "Continue claim",
      secondary: "Review saved draft",
      tertiary: "Sign out",
      outcome: "Restoration happens only after the session is confirmed."
    },
    noRecovery: {
      chip: "No recovery",
      title: "This work cannot be restored",
      body: "The previous session ended before a recoverable draft was saved. No private data is kept on this device.",
      reference: "No draft reference",
      draft: "Not saved",
      contentState: "Cleared by policy",
      returnTarget: "Start page",
      primary: "Start again",
      secondary: "Sign in",
      tertiary: "Get help",
      outcome: "The UI does not promise a saved draft that does not exist.",
      blocked: true
    },
    startAgain: {
      chip: "Restart path",
      title: "Start a new claim safely",
      body: "The previous page is locked. Starting again clears stale controls and uses a new authenticated session.",
      reference: "New reference pending",
      draft: "Previous work unavailable",
      contentState: "Old actions removed",
      returnTarget: "New claim",
      primary: "Start again",
      secondary: "Sign in first",
      tertiary: "Help",
      outcome: "Restart is explicit when recovery is not possible."
    },
    multiTab: {
      chip: "Multiple-tab timeout",
      title: "This tab was signed out",
      body: "Another tab ended the session. This tab locks private content and asks for a fresh session check.",
      reference: "Tab B: SES-2048",
      draft: "Draft status unknown",
      contentState: "Locked in this tab",
      returnTarget: "Recheck before restore",
      primary: "Check session",
      secondary: "Close this tab",
      tertiary: "Open saved draft",
      outcome: "Multiple tabs do not disagree silently about whether protected content is available."
    },
    idp: {
      chip: "Identity-provider timeout",
      title: "Your identity session ended",
      body: "The service session cannot continue until the identity provider confirms authentication again.",
      reference: "Account masked",
      draft: "Return target held",
      contentState: "Protected content hidden",
      returnTarget: "Claim review after IdP",
      primary: "Sign in with identity provider",
      secondary: "Use another account",
      tertiary: "Exit",
      outcome: "The state explains the federated timeout without exposing protected values."
    },
    mobile: {
      chip: "Mobile compact",
      title: "Session ended",
      body: "Reason, safe reference, saved status, primary sign-in action, and restart path remain readable in compact width.",
      reference: "SES-2048",
      draft: "Saved draft 10:42",
      contentState: "Private content hidden",
      returnTarget: "Claim review",
      primary: "Sign in",
      secondary: "Start again",
      tertiary: "Help",
      outcome: "Compact layout preserves the timeout distinction and recovery path.",
      compact: true
    }
  };
  const item = config[mode];
  const titleId = `session-timeout-title-${idSuffix}`;
  const descId = `session-timeout-desc-${idSuffix}`;

  return (
    <div className={`session-timeout-expired-frame is-${mode} ${item.compact ? "is-compact" : ""} ${item.blocked ? "is-blocked" : ""}`}>
      <section className="session-timeout-expired-card" aria-labelledby={titleId} aria-describedby={descId}>
        <div className="session-timeout-expired-head">
          <span>{item.chip}</span>
          <strong id={titleId}>{item.title}</strong>
        </div>
        <p id={descId}>{item.body}</p>
        <div className="session-timeout-expired-private" aria-label="Protected content replacement">
          <span>Protected content</span>
          <strong>{item.contentState}</strong>
        </div>
        <div className="session-timeout-expired-grid" aria-label="Session timeout recovery evidence">
          <div><span>Safe reference</span><strong>{item.reference}</strong></div>
          <div><span>Draft state</span><strong>{item.draft}</strong></div>
          <div><span>Return target</span><strong>{item.returnTarget}</strong></div>
          <div><span>Session state</span><strong>{mode === "restored" ? "Fresh session" : "Signed out"}</strong></div>
        </div>
        <div className="session-timeout-expired-actions">
          <button type="button" className="demo-button small primary">{item.primary}</button>
          <button type="button" className={item.blocked ? "demo-button small danger" : "demo-button small"}>{item.secondary}</button>
          <button type="button" className="demo-button small">{item.tertiary}</button>
        </div>
      </section>
      <aside className="session-timeout-expired-outcome" aria-label="Timeout recovery outcome">
        <span>{mode === "restored" ? "Restoration confirmed" : item.blocked ? "Policy boundary" : "Recovery contract"}</span>
        <strong>{item.outcome}</strong>
      </aside>
    </div>
  );
}

function SessionTimeoutExpiredGoodUi() {
  return (
    <div className="quality-example session-timeout-expired-demo-shell">
      <SessionTimeoutExpiredFrame mode="expired" idSuffix="good-ui" />
      <p className="demo-status">The UI says the session already ended, hides private claim details, shows only safe recovery evidence, and makes sign-in the primary path.</p>
    </div>
  );
}

function SessionTimeoutExpiredBadUi() {
  return (
    <div className="bad-ui-sample session-timeout-expired-bad-ui">
      <section className="session-timeout-expired-card bad" aria-label="Broken session timeout state">
        <div className="session-timeout-expired-head">
          <span>Timeout</span>
          <strong>Access denied</strong>
        </div>
        <p>The page still shows protected claim values and active Submit, Export, and Delete controls behind the message.</p>
        <div className="session-timeout-expired-grid">
          <div><span>Private content</span><strong>Still visible</strong></div>
          <div><span>Return target</span><strong>Lost</strong></div>
          <div><span>Recovery</span><strong>Retry expired request</strong></div>
          <div><span>Logging</span><strong>Raw URL retained</strong></div>
        </div>
        <div className="session-timeout-expired-actions">
          <button type="button" className="demo-button small primary">Retry</button>
          <button type="button" className="demo-button small danger">Submit anyway</button>
        </div>
      </section>
      <p className="demo-status">The broken UI confuses timeout with authorization failure, leaks content, and keeps stale authenticated controls active.</p>
    </div>
  );
}

function SessionTimeoutExpiredGoodUx() {
  const [mode, setMode] = useState<SessionTimeoutExpiredMode>("expired");
  return (
    <div className="quality-example session-timeout-expired-demo-shell">
      <div className="demo-row session-timeout-expired-controls" aria-label="Session timeout recovery controls">
        {sessionTimeoutExpiredGoodLabels.map(([key, label]) => (
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
      <SessionTimeoutExpiredFrame mode={mode} idSuffix="good-ux" />
      <p className="demo-status" aria-live="polite">Session timeout state: {sessionTimeoutExpiredGoodLabels.find(([key]) => key === mode)?.[1]}.</p>
    </div>
  );
}

function SessionTimeoutExpiredBadUx() {
  const [mode, setMode] = useState<SessionTimeoutExpiredBadMode>("privateLeak");
  const copy: Record<SessionTimeoutExpiredBadMode, {
    title: string;
    body: string;
    content: string;
    control: string;
    outcome: string;
  }> = {
    privateLeak: {
      title: "Private leak",
      body: "A timeout dialog appears while income answers, uploads, and account details remain readable behind it.",
      content: "Private values visible",
      control: "Overlay only",
      outcome: "Shared-device privacy fails because content is not actually hidden."
    },
    staleControls: {
      title: "Stale controls",
      body: "Submit, Export, Approve, and Delete remain enabled even though the session token is expired.",
      content: "Protected controls active",
      control: "Submit anyway",
      outcome: "Expired actions can retry, duplicate, or fail after the session is gone."
    },
    accessDeniedCopy: {
      title: "Access-denied copy",
      body: "The message says request access, but the user only needs to authenticate again.",
      content: "Wrong recovery model",
      control: "Request access",
      outcome: "Expired authentication is confused with authorization denial."
    },
    lostReturn: {
      title: "Lost return",
      body: "Sign-in succeeds, but the user lands on a dashboard with no reference to the interrupted claim.",
      content: "Return target missing",
      control: "Dashboard only",
      outcome: "The user must reconstruct work that could have been restored."
    },
    falseSaved: {
      title: "False saved",
      body: "The timeout page promises a saved draft although the latest work was local-only and expired.",
      content: "Save evidence absent",
      control: "Restore unavailable",
      outcome: "The state creates false confidence and later data loss."
    },
    tokenLog: {
      title: "Token log",
      body: "Support diagnostics record a full protected URL, session token, and form values.",
      content: "Secrets in logs",
      control: "Copy debug payload",
      outcome: "The timeout recovery path creates a new security exposure."
    },
    retryLoop: {
      title: "Retry loop",
      body: "The page offers Retry instead of sign-in, so every request repeats with expired credentials.",
      content: "Expired request repeated",
      control: "Retry",
      outcome: "The user cannot establish a fresh session or recover the task."
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example session-timeout-expired-bad-ux is-${mode}`}>
      <div className="demo-row session-timeout-expired-controls" aria-label="Session timeout misuse controls">
        {sessionTimeoutExpiredBadLabels.map(([key, label]) => (
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
      <section className="session-timeout-expired-card bad" aria-label={`Broken state: ${item.title}`}>
        <div className="session-timeout-expired-head">
          <span>{item.title}</span>
          <strong>Session timeout mishandled</strong>
        </div>
        <p>{item.body}</p>
        <div className="session-timeout-expired-grid">
          <div><span>Content state</span><strong>{item.content}</strong></div>
          <div><span>Primary control</span><strong>{item.control}</strong></div>
          <div><span>Auth state</span><strong>Expired</strong></div>
          <div><span>Return state</span><strong>{mode === "lostReturn" ? "Missing" : "Untrusted"}</strong></div>
        </div>
        <div className="session-timeout-expired-actions">
          <button type="button" className="demo-button small danger">{item.control}</button>
          <button type="button" className="demo-button small">Dismiss</button>
        </div>
      </section>
      <p className="demo-status" aria-live="polite">{item.outcome}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SessionTimeoutExpiredGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SessionTimeoutExpiredBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SessionTimeoutExpiredGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SessionTimeoutExpiredBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
