import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type ConfirmEmailStage = "sent" | "blocking" | "nonblocking" | "code" | "resend" | "change" | "expired" | "used" | "verified" | "trouble";

function ConfirmEmailFrame({
  stage = "sent",
  email = "maya@acme.example",
  idSuffix = "sample"
}: {
  stage?: ConfirmEmailStage;
  email?: string;
  idSuffix?: string;
}) {
  const headingId = `confirm-email-title-${idSuffix}`;
  const status: Record<ConfirmEmailStage, { kicker: string; title: string; body: string; tone: "neutral" | "warn" | "danger" | "success" }> = {
    sent: {
      kicker: "Message sent",
      title: "Check your email",
      body: "A confirmation link was sent to the displayed address and expires in 30 minutes.",
      tone: "success"
    },
    blocking: {
      kicker: "Blocking loop",
      title: "Confirm before activating the account",
      body: "The service explains why mailbox access is required before the account opens.",
      tone: "warn"
    },
    nonblocking: {
      kicker: "Limited access",
      title: "Continue while email is pending",
      body: "The user can continue with limited access while verified-email state remains pending.",
      tone: "neutral"
    },
    code: {
      kicker: "Security code",
      title: "Enter the 6-digit email code",
      body: "Short code entry supports paste and one-time-code autocomplete.",
      tone: "neutral"
    },
    resend: {
      kicker: "Resend limit",
      title: "New email available in 02:00",
      body: "Resend timing is server-backed and does not change the verified state.",
      tone: "warn"
    },
    change: {
      kicker: "Change address",
      title: "Send confirmation to a new address",
      body: "Changing the address invalidates previous links and starts a fresh pending state.",
      tone: "neutral"
    },
    expired: {
      kicker: "Expired link",
      title: "This confirmation link expired",
      body: "The page offers a new message instead of showing a raw token error.",
      tone: "warn"
    },
    used: {
      kicker: "Used link",
      title: "This confirmation link was already used",
      body: "Already-used links cannot verify a different address and route users to current status.",
      tone: "danger"
    },
    verified: {
      kicker: "Verified email",
      title: "Email address confirmed",
      body: "Verified-email state is stored separately from address formatting and account sign-in.",
      tone: "success"
    },
    trouble: {
      kicker: "Delivery trouble",
      title: "Email not arriving?",
      body: "The user can check the address, resend later, change address, or get support.",
      tone: "warn"
    }
  };
  const current = status[stage];
  const showCode = stage === "code";
  const pending = stage !== "verified";

  return (
    <div className={`confirm-email-frame is-${stage}`}>
      <section className="confirm-email-address" aria-label="Pending email address">
        <strong>{pending ? "Pending email" : "Verified email"}</strong>
        <span>{email}</span>
        <span>Purpose: account activation</span>
        <span>State: {pending ? "not confirmed" : "confirmed"}</span>
      </section>
      <section className={`confirm-email-status is-${current.tone}`} aria-labelledby={headingId}>
        <span className="confirm-email-kicker">{current.kicker}</span>
        <h4 id={headingId}>{current.title}</h4>
        <p>{current.body}</p>
        {showCode && (
          <label className="confirm-email-code">
            <span>Email confirmation code</span>
            <input inputMode="numeric" autoComplete="one-time-code" value="482913" readOnly />
          </label>
        )}
        <div className="confirm-email-policy">
          <span>Expiry: {stage === "expired" ? "elapsed" : "30 min"}</span>
          <span>Loop: {stage === "nonblocking" ? "limited access" : stage === "blocking" ? "blocking" : "recoverable"}</span>
          <span>Old links: {stage === "change" || stage === "verified" ? "invalidated" : "pending"}</span>
        </div>
        {stage === "verified" && <p className="confirm-email-inline-note">Account activation can continue. Pending warning cleared.</p>}
        <div className="confirm-email-actions">
          <button type="button" className="demo-button primary">{stage === "verified" ? "Continue to account" : stage === "expired" || stage === "used" ? "Request new email" : "Open email app"}</button>
          <button type="button" className="demo-button small">Resend email</button>
          <button type="button" className="demo-button small">Change address</button>
        </div>
      </section>
    </div>
  );
}

function ConfirmEmailGoodUi() {
  return (
    <div className="quality-example confirm-email-demo">
      <ConfirmEmailFrame stage="sent" idSuffix="good-ui" />
      <p className="demo-status">The sent state shows the exact address, expiry, resend, and change-address actions before the user leaves for email.</p>
    </div>
  );
}

function ConfirmEmailBadUi() {
  return (
    <div className="bad-ui-sample confirm-email-bad-demo is-hiddenAddress">
      <strong>Check your inbox</strong>
      <div className="confirm-email-bad-grid">
        <span>No address shown</span>
        <span>No expiry</span>
        <span>No change path</span>
      </div>
      <p className="demo-status">The page hides where the message went, so a mistyped address becomes hard to recover from.</p>
    </div>
  );
}

function ConfirmEmailGoodUx() {
  const [stage, setStage] = useState<ConfirmEmailStage>("sent");
  const [email, setEmail] = useState("maya@acme.example");
  const [message, setMessage] = useState("Email confirmation proves access to the captured mailbox before account activation continues.");

  function choose(nextStage: ConfirmEmailStage, nextMessage: string, nextEmail = email) {
    setStage(nextStage);
    setEmail(nextEmail);
    setMessage(nextMessage);
  }

  return (
    <div className="quality-example confirm-email-demo">
      <ConfirmEmailFrame stage={stage} email={email} idSuffix="good-ux" />
      <div className="demo-row confirm-email-controls" aria-label="Confirm email exercise controls">
        <button type="button" className={stage === "sent" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("sent", "Sent state names the mailbox, expiry, resend, and change-address route.")}>Sent</button>
        <button type="button" className={stage === "blocking" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("blocking", "Blocking loops explain why activation cannot continue until the email is verified.")}>Blocking</button>
        <button type="button" className={stage === "nonblocking" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("nonblocking", "Non-blocking loops allow limited progress while verified-email state remains pending.")}>Non-blocking</button>
        <button type="button" className={stage === "code" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("code", "Code confirmation supports paste and one-time-code autocomplete when a code is used.")}>Code</button>
        <button type="button" className={stage === "resend" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("resend", "Resend wait gives a clear next step without changing verified state.")}>Resend wait</button>
        <button type="button" className={stage === "change" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("change", "Changing the address invalidates old confirmation links and sends a new message.", "maya.rao@acme.example")}>Change address</button>
        <button type="button" className={stage === "expired" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("expired", "Expired links recover through request-new-message instead of raw token errors.")}>Expired</button>
        <button type="button" className={stage === "used" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("used", "Already-used links cannot verify another address and show current status recovery.")}>Used link</button>
        <button type="button" className={stage === "verified" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("verified", "Verified state clears pending warnings and resumes account activation.")}>Verified</button>
        <button type="button" className={stage === "trouble" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("trouble", "Delivery trouble gives resend, change-address, and support routes.")}>Trouble</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function ConfirmEmailBadUx() {
  type Mode = "hiddenAddress" | "noResend" | "deadExpired" | "falseVerified" | "unneededBlock" | "staleLink" | "accountReveal";
  const [mode, setMode] = useState<Mode>("hiddenAddress");
  const copy: Record<Mode, string> = {
    hiddenAddress: "The pending page hides the address, so a typo cannot be spotted.",
    noResend: "The email never arrives and there is no resend, wait time, change-address, or support route.",
    deadExpired: "Expired links show a raw token error and no request-new-message action.",
    falseVerified: "The service marks the email verified immediately after format validation.",
    unneededBlock: "A low-risk receipt flow blocks completion until the mailbox is confirmed.",
    staleLink: "An old link still confirms an address after the user changed it.",
    accountReveal: "Activation copy reveals that another account already owns the email address."
  };
  const labels: Record<Mode, string[]> = {
    hiddenAddress: ["Check inbox", "Address hidden", "No change"],
    noResend: ["Still waiting", "No resend", "No support"],
    deadExpired: ["Token expired", "Stack trace", "No recovery"],
    falseVerified: ["Looks valid", "Marked verified", "No email opened"],
    unneededBlock: ["Receipt blocked", "No risk", "Extra loop"],
    staleLink: ["Old link works", "New address set", "Wrong mailbox"],
    accountReveal: ["Email exists", "Use sign in", "Account exposed"]
  };

  return (
    <div className={`quality-example confirm-email-bad-demo is-${mode}`}>
      <strong>{mode === "deadExpired" ? "Invalid token" : mode === "falseVerified" ? "Email verified" : "Email confirmation problem"}</strong>
      <div className="confirm-email-bad-grid">
        {labels[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row confirm-email-controls">
        <button type="button" className={mode === "hiddenAddress" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenAddress")}>Hidden address</button>
        <button type="button" className={mode === "noResend" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noResend")}>No resend</button>
        <button type="button" className={mode === "deadExpired" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("deadExpired")}>Dead expired</button>
        <button type="button" className={mode === "falseVerified" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("falseVerified")}>False verified</button>
        <button type="button" className={mode === "unneededBlock" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("unneededBlock")}>Unneeded block</button>
        <button type="button" className={mode === "staleLink" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleLink")}>Stale link</button>
        <button type="button" className={mode === "accountReveal" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("accountReveal")}>Account reveal</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ConfirmEmailGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ConfirmEmailBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ConfirmEmailGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ConfirmEmailBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
