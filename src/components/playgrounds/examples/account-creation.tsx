import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type AccountCreationStage = "need" | "details" | "verify" | "existing" | "return";

function AccountCreationFrame({
  stage = "need",
  reused = true,
  verified = false,
  deferred = false
}: {
  stage?: AccountCreationStage;
  reused?: boolean;
  verified?: boolean;
  deferred?: boolean;
}) {
  const stageText: Record<AccountCreationStage, string> = {
    need: "Save your permit draft",
    details: "Create an account",
    verify: "Check your email",
    existing: "We sent a secure link",
    return: "Draft saved"
  };
  return (
    <div className={`account-create-frame is-${stage}`}>
      <section className="account-create-context" aria-label="Draft context">
        <strong>Permit draft</strong>
        <span>8 of 12 sections complete</span>
        <span>Last edited 2 minutes ago</span>
      </section>
      <section className="account-create-panel" aria-labelledby="account-create-title">
        <span className="account-create-kicker">{stage === "return" ? "Saved account" : stage === "existing" ? "Neutral response" : "Account needed"}</span>
        <h4 id="account-create-title">{stageText[stage]}</h4>
        <p>
          {stage === "need"
            ? "Create an account only if you want to save this draft, return later, and receive status updates."
            : stage === "details"
              ? "We will use the email already entered for this permit. Create a new password for this account."
              : stage === "verify"
                ? "A verification link was sent. You can resend it or change the email address."
                : stage === "existing"
                  ? "If an account exists for this email, the same link will help you sign in or recover access."
                  : "Your account is ready and this permit draft is still open."}
        </p>
        <div className="account-create-fields">
          <label>
            <span>Email address for this account</span>
            <input type="email" value={reused ? "maya.rivera@example.com" : ""} readOnly />
          </label>
          <label>
            <span>Create a password</span>
            <input type="password" value={stage === "details" ? "generated password accepted" : ""} readOnly />
          </label>
        </div>
        <div className="account-create-actions">
          <button type="button" className="demo-button primary">{verified ? "Return to draft" : stage === "verify" ? "Resend link" : "Create account"}</button>
          <button type="button" className="demo-button small">{stage === "existing" ? "Open email" : "Already have an account? Sign in"}</button>
        </div>
        {deferred && <p className="account-create-note">Profile photo, notification preferences, and onboarding are offered after the account is created.</p>}
      </section>
    </div>
  );
}

function AccountCreationGoodUi() {
  return (
    <div className="quality-example account-create-demo">
      <AccountCreationFrame />
      <p className="demo-status">The form explains why an account is needed, reuses the draft email, labels new credentials clearly, and separates sign in from creation.</p>
    </div>
  );
}

function AccountCreationBadUi() {
  return (
    <div className="bad-ui-sample account-create-bad-demo is-confusing">
      <strong>Join or log in</strong>
      <div className="account-create-two-col">
        <section>
          <h4>Sign up</h4>
          <span>Email</span>
          <span>Password</span>
        </section>
        <section>
          <h4>Sign in</h4>
          <span>Email</span>
          <span>Password</span>
        </section>
      </div>
      <p className="demo-status">Two nearly identical panels make it unclear whether users are creating new credentials or entering existing ones.</p>
    </div>
  );
}

function AccountCreationGoodUx() {
  const [stage, setStage] = useState<AccountCreationStage>("need");
  const [reused, setReused] = useState(true);
  const [verified, setVerified] = useState(false);
  const [deferred, setDeferred] = useState(false);
  const [message, setMessage] = useState("Account creation appears only when saving the draft needs persistent access.");

  function choose(nextStage: AccountCreationStage, nextMessage: string) {
    setStage(nextStage);
    setMessage(nextMessage);
  }

  return (
    <div className="quality-example account-create-demo">
      <AccountCreationFrame stage={stage} reused={reused} verified={verified} deferred={deferred} />
      <div className="demo-row account-create-controls" aria-label="Account creation exercise controls">
        <button type="button" className={stage === "need" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("need", "Need state explains why an account is required before asking for credentials.")}>Why account</button>
        <button type="button" className={reused ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setReused(true);
          choose("details", "Email already entered in the draft is reused instead of making the user type it again.");
        }}>Reuse email</button>
        <button type="button" className={stage === "verify" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setVerified(false);
          choose("verify", "Verification state offers resend and change-email routes without losing the draft.");
        }}>Verify</button>
        <button type="button" className={stage === "existing" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("existing", "Existing-account handling uses a neutral email-link message instead of revealing account existence.")}>Existing account</button>
        <button type="button" className={deferred ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setDeferred(true);
          choose("details", "Profile setup and marketing preferences are deferred until after the account exists.");
        }}>Defer extras</button>
        <button type="button" className={stage === "return" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setVerified(true);
          choose("return", "Successful creation returns to the saved draft instead of an empty account dashboard.");
        }}>Return to draft</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function AccountCreationBadUx() {
  type Mode = "forced" | "confusing" | "enumeration" | "repeat" | "captcha" | "lostDraft";
  const [mode, setMode] = useState<Mode>("forced");
  const copy: Record<Mode, string> = {
    forced: "A one-off permit blocks users with account creation before they know whether the service fits.",
    confusing: "Create-account and sign-in forms share the same labels, so existing users enter the wrong mode.",
    enumeration: "The page says This email already has an account, exposing account existence.",
    repeat: "The user must retype the same email, name, and phone already entered in the draft.",
    captcha: "A CAPTCHA is the only route forward, blocking users who cannot complete the visual puzzle.",
    lostDraft: "After account creation, the user lands on a blank dashboard and the permit draft is gone."
  };
  return (
    <div className={`quality-example account-create-bad-demo is-${mode}`}>
      <strong>{mode === "captcha" ? "Prove you are human" : mode === "lostDraft" ? "Welcome to your account" : "Create account now"}</strong>
      <div className="account-create-bad-flow">
        {(mode === "repeat" ? ["Name", "Email again", "Phone again"] : mode === "confusing" ? ["Email", "Password", "Sign up or in"] : ["Email", "Password", "Continue"]).map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row account-create-controls">
        <button type="button" className={mode === "forced" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("forced")}>Forced first</button>
        <button type="button" className={mode === "confusing" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("confusing")}>Mode confusion</button>
        <button type="button" className={mode === "enumeration" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("enumeration")}>Reveals account</button>
        <button type="button" className={mode === "repeat" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("repeat")}>Repeat details</button>
        <button type="button" className={mode === "captcha" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("captcha")}>CAPTCHA block</button>
        <button type="button" className={mode === "lostDraft" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("lostDraft")}>Lost draft</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AccountCreationGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AccountCreationBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AccountCreationGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AccountCreationBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
