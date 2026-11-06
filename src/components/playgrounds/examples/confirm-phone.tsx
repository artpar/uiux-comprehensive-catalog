import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type ConfirmPhoneStage =
  | "sent"
  | "blocking"
  | "nonblocking"
  | "smsCode"
  | "voiceCode"
  | "resend"
  | "change"
  | "wrong"
  | "expired"
  | "rateLimited"
  | "verified"
  | "trouble";

function ConfirmPhoneFrame({
  stage = "sent",
  phone = "+44 7700 900982",
  idSuffix = "sample"
}: {
  stage?: ConfirmPhoneStage;
  phone?: string;
  idSuffix?: string;
}) {
  const headingId = `confirm-phone-title-${idSuffix}`;
  const status: Record<ConfirmPhoneStage, { kicker: string; title: string; body: string; tone: "neutral" | "warn" | "danger" | "success"; channel: string }> = {
    sent: {
      kicker: "Code sent",
      title: "Check your phone",
      body: "A 5-digit security code was sent to the displayed number and expires in 15 minutes.",
      tone: "success",
      channel: "SMS"
    },
    blocking: {
      kicker: "Blocking loop",
      title: "Confirm before recovery continues",
      body: "The service explains why phone access is required before this recovery route can be saved.",
      tone: "warn",
      channel: "SMS"
    },
    nonblocking: {
      kicker: "Limited access",
      title: "Continue while phone is pending",
      body: "The user can finish low-risk setup while verified-phone state remains pending.",
      tone: "neutral",
      channel: "SMS"
    },
    smsCode: {
      kicker: "SMS code",
      title: "Enter the text-message code",
      body: "The field supports paste, spaces, hyphens, numeric keyboards, and one-time-code autocomplete.",
      tone: "neutral",
      channel: "SMS"
    },
    voiceCode: {
      kicker: "Voice call",
      title: "Listen for the voice code",
      body: "A call can read the same short-lived code when SMS is unavailable or inappropriate.",
      tone: "neutral",
      channel: "Voice"
    },
    resend: {
      kicker: "Resend wait",
      title: "Request another code in 01:30",
      body: "The wait is server-backed and the page explains whether the current code still works.",
      tone: "warn",
      channel: "SMS"
    },
    change: {
      kicker: "Change number",
      title: "Send a fresh code to the new number",
      body: "Changing the phone invalidates codes for the old number before a new message is sent.",
      tone: "neutral",
      channel: "SMS"
    },
    wrong: {
      kicker: "Incorrect code",
      title: "Enter a correct security code",
      body: "Specific error copy preserves the input and keeps recovery actions available.",
      tone: "danger",
      channel: "SMS"
    },
    expired: {
      kicker: "Expired code",
      title: "The security code has expired",
      body: "The page offers a new code instead of exposing raw token or replay details.",
      tone: "warn",
      channel: "SMS"
    },
    rateLimited: {
      kicker: "Attempt limit",
      title: "Too many incorrect codes",
      body: "A time delay, support route, and current wait time protect the flow without a dead end.",
      tone: "danger",
      channel: "SMS"
    },
    verified: {
      kicker: "Verified phone",
      title: "Phone number confirmed",
      body: "Verified-phone state is stored separately from number format and authentication strength.",
      tone: "success",
      channel: "SMS"
    },
    trouble: {
      kicker: "No access",
      title: "Cannot receive the code?",
      body: "The user can try voice, change the number, use a backup route, or contact support.",
      tone: "warn",
      channel: "SMS or voice"
    }
  };
  const current = status[stage];
  const showCode = stage === "smsCode" || stage === "voiceCode" || stage === "wrong" || stage === "expired" || stage === "rateLimited";
  const pending = stage !== "verified";

  return (
    <div className={`confirm-phone-frame is-${stage}`}>
      <section className="confirm-phone-address" aria-label="Pending phone number">
        <strong>{pending ? "Pending phone" : "Verified phone"}</strong>
        <span>{phone}</span>
        <span>Channel: {current.channel}</span>
        <span>Purpose: account recovery</span>
        <span>State: {pending ? "not confirmed" : "confirmed"}</span>
      </section>
      <section className={`confirm-phone-status is-${current.tone}`} aria-labelledby={headingId}>
        <span className="confirm-phone-kicker">{current.kicker}</span>
        <h4 id={headingId}>{current.title}</h4>
        <p>{current.body}</p>
        {showCode && (
          <label className="confirm-phone-code">
            <span>Phone security code</span>
            <input inputMode="numeric" autoComplete="one-time-code" value={stage === "wrong" ? "90210" : "49281"} readOnly aria-invalid={stage === "wrong" || stage === "expired" || stage === "rateLimited" ? "true" : undefined} />
          </label>
        )}
        <div className="confirm-phone-policy">
          <span>Expiry: {stage === "expired" ? "elapsed" : "15 min"}</span>
          <span>Attempts: {stage === "rateLimited" ? "paused" : "limited"}</span>
          <span>Old codes: {stage === "change" || stage === "verified" ? "invalidated" : "scoped"}</span>
          <span>Alternative: {stage === "voiceCode" || stage === "trouble" ? "voice/support" : "available"}</span>
        </div>
        {stage === "verified" && <p className="confirm-phone-inline-note">Recovery phone confirmed. Pending warning cleared.</p>}
        <div className="confirm-phone-actions">
          <button type="button" className="demo-button primary">{stage === "verified" ? "Continue to recovery" : stage === "expired" || stage === "rateLimited" ? "Request new code" : "Continue"}</button>
          <button type="button" className="demo-button small">Request new code</button>
          <button type="button" className="demo-button small">Try voice call</button>
          <button type="button" className="demo-button small">Change number</button>
        </div>
      </section>
    </div>
  );
}

function ConfirmPhoneGoodUi() {
  return (
    <div className="quality-example confirm-phone-demo">
      <ConfirmPhoneFrame stage="sent" idSuffix="good-ui" />
      <p className="demo-status">The sent state names the number, channel, code expiry, resend route, voice option, and change-number path before the user waits for SMS.</p>
    </div>
  );
}

function ConfirmPhoneBadUi() {
  return (
    <div className="bad-ui-sample confirm-phone-bad-demo is-hiddenNumber">
      <strong>Enter code</strong>
      <div className="confirm-phone-bad-grid">
        <span>Number hidden</span>
        <span>No channel</span>
        <span>No resend</span>
      </div>
      <p className="demo-status">The page hides where the code went and gives no way to fix a mistyped number or switch away from SMS.</p>
    </div>
  );
}

function ConfirmPhoneGoodUx() {
  const [stage, setStage] = useState<ConfirmPhoneStage>("sent");
  const [phone, setPhone] = useState("+44 7700 900982");
  const [message, setMessage] = useState("Phone confirmation proves that the captured number can receive a short-lived code.");

  function choose(nextStage: ConfirmPhoneStage, nextMessage: string, nextPhone = phone) {
    setStage(nextStage);
    setPhone(nextPhone);
    setMessage(nextMessage);
  }

  return (
    <div className="quality-example confirm-phone-demo">
      <ConfirmPhoneFrame stage={stage} phone={phone} idSuffix="good-ux" />
      <div className="demo-row confirm-phone-controls" aria-label="Confirm phone exercise controls">
        <button type="button" className={stage === "sent" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("sent", "Sent state names the phone route, code length, expiry, resend, and change-number route.")}>Sent</button>
        <button type="button" className={stage === "blocking" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("blocking", "Blocking loops explain why recovery cannot continue until phone access is confirmed.")}>Blocking</button>
        <button type="button" className={stage === "nonblocking" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("nonblocking", "Non-blocking loops allow limited progress while verified-phone state remains pending.")}>Non-blocking</button>
        <button type="button" className={stage === "smsCode" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("smsCode", "SMS code entry supports paste and one-time-code autocomplete while keeping the input as text.")}>SMS code</button>
        <button type="button" className={stage === "voiceCode" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("voiceCode", "Voice fallback keeps confirmation available when SMS cannot be used.")}>Voice code</button>
        <button type="button" className={stage === "resend" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("resend", "Resend wait gives a clear next step and explains current-code behavior.")}>Resend wait</button>
        <button type="button" className={stage === "change" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("change", "Changing the number invalidates old codes and sends a fresh challenge.", "+44 7700 900441")}>Change number</button>
        <button type="button" className={stage === "wrong" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("wrong", "Incorrect-code errors stay specific and keep recovery actions available.")}>Wrong code</button>
        <button type="button" className={stage === "expired" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("expired", "Expired codes recover through request-new-code without exposing raw token details.")}>Expired</button>
        <button type="button" className={stage === "rateLimited" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("rateLimited", "Attempt limits show wait time and support instead of silently locking the user out.")}>Rate limit</button>
        <button type="button" className={stage === "verified" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("verified", "Verified-phone state clears pending warnings and resumes the recovery task.")}>Verified</button>
        <button type="button" className={stage === "trouble" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("trouble", "No-access states offer voice, backup, support, or another contact route.")}>No access</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function ConfirmPhoneBadUx() {
  type Mode = "hiddenNumber" | "noResend" | "smsOnly" | "falseVerified" | "staleCode" | "logsCode" | "accountReveal";
  const [mode, setMode] = useState<Mode>("hiddenNumber");
  const copy: Record<Mode, string> = {
    hiddenNumber: "The user cannot tell whether the code was sent to the right number.",
    noResend: "The text never arrives and there is no wait time, new-code action, voice fallback, or support path.",
    smsOnly: "A landline or no-signal user is forced into SMS with no voice or non-phone route.",
    falseVerified: "The service marks the phone verified after number-format validation alone.",
    staleCode: "An old code still confirms the account after the phone number changes.",
    logsCode: "The security code and full phone number are copied into logs and support tooling.",
    accountReveal: "Request-new-code copy reveals that a phone number belongs to an existing account."
  };
  const labels: Record<Mode, string[]> = {
    hiddenNumber: ["Check phone", "Number hidden", "No change"],
    noResend: ["Still waiting", "No resend", "No help"],
    smsOnly: ["Landline", "No signal", "Blocked"],
    falseVerified: ["Format valid", "Marked verified", "No code"],
    staleCode: ["Old code works", "New phone set", "Wrong route"],
    logsCode: ["Code logged", "Full number", "Replay risk"],
    accountReveal: ["Number exists", "Use sign in", "Account exposed"]
  };

  return (
    <div className={`quality-example confirm-phone-bad-demo is-${mode}`}>
      <strong>{mode === "smsOnly" ? "SMS-only block" : mode === "falseVerified" ? "Phone verified" : "Phone confirmation problem"}</strong>
      <div className="confirm-phone-bad-grid">
        {labels[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row confirm-phone-controls">
        <button type="button" className={mode === "hiddenNumber" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenNumber")}>Hidden number</button>
        <button type="button" className={mode === "noResend" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noResend")}>No resend</button>
        <button type="button" className={mode === "smsOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("smsOnly")}>SMS only</button>
        <button type="button" className={mode === "falseVerified" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("falseVerified")}>False verified</button>
        <button type="button" className={mode === "staleCode" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleCode")}>Stale code</button>
        <button type="button" className={mode === "logsCode" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("logsCode")}>Logs code</button>
        <button type="button" className={mode === "accountReveal" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("accountReveal")}>Account reveal</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ConfirmPhoneGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ConfirmPhoneBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ConfirmPhoneGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ConfirmPhoneBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
