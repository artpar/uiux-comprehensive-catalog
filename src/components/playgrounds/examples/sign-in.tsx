import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type SignInStage = "destination" | "credentials" | "passkey" | "sso" | "error" | "stepup" | "return";

function SignInFrame({
  stage = "destination",
  genericError = false,
  passkey = false,
  stepup = false,
  returned = false
}: {
  stage?: SignInStage;
  genericError?: boolean;
  passkey?: boolean;
  stepup?: boolean;
  returned?: boolean;
}) {
  const title: Record<SignInStage, string> = {
    destination: "Sign in to continue",
    credentials: "Use your saved credentials",
    passkey: "Use a passkey",
    sso: "Continue with company SSO",
    error: "Check your account details",
    stepup: "Verify this sign-in",
    return: "Budget review restored"
  };
  return (
    <div className={`sign-in-frame is-${stage}`}>
      <section className="sign-in-destination" aria-label="Protected destination">
        <strong>Q2 budget review</strong>
        <span>Private document</span>
        <span>{returned ? "Signed in as maya@acme.example" : "Authentication required"}</span>
      </section>
      <section className="sign-in-panel" aria-labelledby="sign-in-demo-title">
        <span className="sign-in-kicker">{returned ? "Session ready" : stepup ? "Step-up required" : "Returning account"}</span>
        <h4 id="sign-in-demo-title">{title[stage]}</h4>
        <p>
          {stage === "destination"
            ? "Sign in to open the private document. We will return you to this review after authentication."
            : stage === "credentials"
              ? "Credential fields use username and current-password semantics so saved credentials can fill them."
              : stage === "passkey"
                ? "Passkey and saved-password suggestions can appear from the credential field when available."
                : stage === "sso"
                  ? "Company SSO uses the same return destination after the identity provider sends the user back."
                  : stage === "error"
                    ? "The error stays neutral and keeps recovery routes available without revealing account status."
                    : stage === "stepup"
                      ? "Additional verification is requested before opening the protected document."
                      : "The user returns to the requested document instead of a generic dashboard."}
        </p>
        <div className="sign-in-fields">
          <label>
            <span>Email or username</span>
            <input autoComplete="username webauthn" value="maya@acme.example" readOnly />
          </label>
          <label>
            <span>Password</span>
            <input autoComplete="current-password" type="password" value={stage === "credentials" ? "saved-password" : ""} readOnly />
          </label>
        </div>
        {genericError && <p className="sign-in-error" role="alert">We could not sign you in with those details. Try again or use a recovery option.</p>}
        {stepup && (
          <label className="sign-in-code">
            <span>One-time code</span>
            <input autoComplete="one-time-code" value="482191" readOnly />
          </label>
        )}
        <div className="sign-in-actions">
          <button type="button" className="demo-button primary">{returned ? "Open budget review" : stepup ? "Verify and continue" : "Sign in"}</button>
          <button type="button" className="demo-button small">{passkey ? "Use saved passkey" : "Use passkey"}</button>
          <button type="button" className="demo-button small">Company SSO</button>
        </div>
        <div className="sign-in-secondary">
          <a href="#recover">Forgot password?</a>
          <a href="#create">Create account</a>
          <a href="#help">Need help?</a>
        </div>
      </section>
    </div>
  );
}

function SignInGoodUi() {
  return (
    <div className="quality-example sign-in-demo">
      <SignInFrame />
      <p className="demo-status">The sign-in surface names the protected destination, supports saved credentials, separates passkey and SSO routes, and keeps recovery secondary.</p>
    </div>
  );
}

function SignInBadUi() {
  return (
    <div className="bad-ui-sample sign-in-bad-demo is-equalRoutes">
      <strong>Welcome back</strong>
      <div className="sign-in-bad-grid">
        {["Sign in", "Create account", "Reset password", "Browse plans", "Support"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p className="demo-status">Equal routes hide the protected destination, make account creation compete with returning access, and do not explain recovery or SSO paths.</p>
    </div>
  );
}

function SignInGoodUx() {
  const [stage, setStage] = useState<SignInStage>("destination");
  const [genericError, setGenericError] = useState(false);
  const [passkey, setPasskey] = useState(false);
  const [stepup, setStepup] = useState(false);
  const [returned, setReturned] = useState(false);
  const [message, setMessage] = useState("Sign in preserves the private document destination before asking for credentials.");

  function choose(nextStage: SignInStage, nextMessage: string) {
    setStage(nextStage);
    setMessage(nextMessage);
  }

  return (
    <div className="quality-example sign-in-demo">
      <SignInFrame stage={stage} genericError={genericError} passkey={passkey} stepup={stepup} returned={returned} />
      <div className="demo-row sign-in-controls" aria-label="Sign in exercise controls">
        <button type="button" className={stage === "destination" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("destination", "Destination context explains why authentication is required and what will reopen after success.")}>Destination</button>
        <button type="button" className={stage === "credentials" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("credentials", "Username and current-password semantics allow saved credentials and password managers to work.")}>Saved credentials</button>
        <button type="button" className={passkey ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setPasskey(true);
          choose("passkey", "Passkey access is offered as an authenticator option without replacing recovery routes.");
        }}>Use passkey</button>
        <button type="button" className={stage === "sso" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("sso", "SSO route keeps the same return destination through the identity-provider redirect.")}>Company SSO</button>
        <button type="button" className={genericError ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setGenericError(true);
          choose("error", "Failure copy stays generic and does not reveal whether the identifier, password, lock, or disabled account caused it.");
        }}>Generic error</button>
        <button type="button" className={stepup ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setStepup(true);
          choose("stepup", "Step-up verification requests a one-time code before opening the protected document.");
        }}>Step up</button>
        <button type="button" className={returned ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setReturned(true);
          setGenericError(false);
          choose("return", "Successful sign in returns to the Q2 budget review instead of a generic dashboard.");
        }}>Continue</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function SignInBadUx() {
  type Mode = "revealAccount" | "lostReturn" | "blockManager" | "equalRoutes" | "captchaOnly" | "staleSession";
  const [mode, setMode] = useState<Mode>("revealAccount");
  const copy: Record<Mode, string> = {
    revealAccount: "The failure message says the account exists but the password is wrong, enabling enumeration.",
    lostReturn: "Successful authentication sends the user to Account home and loses the private document link.",
    blockManager: "The form disables paste and uses nonstandard fields so saved credentials and passkeys do not appear.",
    equalRoutes: "Create account, reset password, SSO, and sign in compete equally with no destination context.",
    captchaOnly: "A visual CAPTCHA is the only path after a failed attempt, blocking users who need another challenge.",
    staleSession: "Expired-session recovery shows a fresh sign-in page while private content remains visible behind it."
  };
  const labels: Record<Mode, string[]> = {
    revealAccount: ["Email exists", "Wrong password", "Try again"],
    lostReturn: ["Signed in", "Account home", "Document missing"],
    blockManager: ["Autocomplete off", "Paste blocked", "Passkey hidden"],
    equalRoutes: ["Sign in", "Create", "Recover"],
    captchaOnly: ["Select buses", "No audio", "Continue disabled"],
    staleSession: ["Session expired", "Private doc visible", "No saved state"]
  };
  return (
    <div className={`quality-example sign-in-bad-demo is-${mode}`}>
      <strong>{mode === "captchaOnly" ? "Security check required" : mode === "lostReturn" ? "Welcome to your account" : "Sign in problem"}</strong>
      <div className="sign-in-bad-grid">
        {labels[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row sign-in-controls">
        <button type="button" className={mode === "revealAccount" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("revealAccount")}>Reveals account</button>
        <button type="button" className={mode === "lostReturn" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("lostReturn")}>Lost return</button>
        <button type="button" className={mode === "blockManager" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("blockManager")}>Blocks manager</button>
        <button type="button" className={mode === "equalRoutes" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("equalRoutes")}>Equal routes</button>
        <button type="button" className={mode === "captchaOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("captchaOnly")}>CAPTCHA only</button>
        <button type="button" className={mode === "staleSession" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleSession")}>Stale session</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SignInGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SignInBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SignInGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SignInBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
