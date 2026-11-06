import { useRef, useState } from "react";
import { QualityPanel, type PatternMeta } from './shared';

function ValidationUi({ patternId, meta, good = false }: { patternId: string; meta: PatternMeta; good?: boolean }) {
  if (!good) {
    return (
      <div className="bad-ui-sample">
        <input aria-label={`${meta.field} unlabeled`} placeholder="value" />
        <span className="bad-error-dot">!</span>
      </div>
    );
  }

  if (patternId === "inline-validation") {
    return (
      <div className="quality-example">
        <label htmlFor="quality-inline-email-preview">
          <span>{meta.field}</span>
        </label>
        <p className="demo-status" id="quality-inline-email-hint">Use a work email address.</p>
        <p className="demo-error compact" id="quality-inline-email-error">Enter an email address in the correct format.</p>
        <input
          id="quality-inline-email-preview"
          value="name"
          readOnly
          aria-invalid="true"
          aria-describedby="quality-inline-email-hint quality-inline-email-error"
          className="field-invalid"
        />
      </div>
    );
  }

  return (
    <div className="quality-example">
      {patternId === "error-summary" && (
        <div className="demo-error compact error-summary-box">
          <strong>There is a problem</strong>
          <a href="#quality-summary-email-preview">Enter an email address in the correct format.</a>
          <a href="#quality-summary-plan-preview">Choose a plan before continuing.</a>
        </div>
      )}
      <label htmlFor="quality-summary-email-preview">
        <span>{meta.field}</span>
      </label>
      <p className="demo-error compact" id="quality-summary-email-error">Enter an email address in the correct format.</p>
      <input
        id="quality-summary-email-preview"
        value="name"
        readOnly
        aria-invalid="true"
        aria-describedby="quality-summary-email-error"
        className="field-invalid"
      />
      <label htmlFor="quality-summary-plan-preview">
        <span>Plan</span>
      </label>
      <p className="demo-error compact" id="quality-summary-plan-error">Choose a plan before continuing.</p>
      <select
        id="quality-summary-plan-preview"
        value=""
        disabled
        aria-invalid="true"
        aria-describedby="quality-summary-plan-error"
        className="field-invalid"
      >
        <option value="">Select a plan</option>
      </select>
    </div>
  );
}

function ValidationGoodUx({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  const isInline = patternId === "inline-validation";
  const [email, setEmail] = useState(isInline ? "name" : "");
  const [plan, setPlan] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState(false);
  const summaryRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const planRef = useRef<HTMLSelectElement | null>(null);
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const showInlineFeedback = isInline && (touched || submitted);
  const invalid = isInline ? showInlineFeedback && !validEmail : submitted && !email.includes("@");
  const planInvalid = !isInline && submitted && !plan;
  const corrected = isInline && showInlineFeedback && validEmail;

  function submit() {
    setSubmitted(true);
    window.setTimeout(() => {
      if (!isInline) {
        summaryRef.current?.focus();
        return;
      }
      if (!validEmail) inputRef.current?.focus();
    }, 0);
  }

  function focusField(field: "email" | "plan") {
    if (field === "email") inputRef.current?.focus();
    if (field === "plan") planRef.current?.focus();
  }

  return (
    <div className="quality-example">
      {patternId === "error-summary" && (invalid || planInvalid) && (
        <div className="demo-error compact error-summary-box" role="alert" ref={summaryRef} tabIndex={-1}>
          <strong>There is a problem</strong>
          {invalid && (
            <button type="button" className="link-button" onClick={() => focusField("email")}>Enter an email address in the correct format.</button>
          )}
          {planInvalid && (
            <button type="button" className="link-button" onClick={() => focusField("plan")}>Choose a plan before continuing.</button>
          )}
        </div>
      )}
      <label htmlFor="quality-email-live">
        <span>{meta.field}</span>
      </label>
      <p className="demo-status" id="quality-email-live-hint">Use a work email address, such as name@example.com.</p>
      <input
        id="quality-email-live"
        ref={inputRef}
        value={email}
        onBlur={() => setTouched(true)}
        onChange={(event) => {
          setEmail(event.target.value);
          if (submitted) setSubmitted(false);
        }}
        aria-invalid={invalid}
        aria-describedby={invalid ? "quality-email-live-hint quality-email-live-error" : "quality-email-live-hint"}
        className={invalid ? "field-invalid" : undefined}
      />
      {patternId === "inline-validation" && invalid && (
        <p className="demo-error compact" id="quality-email-live-error">Enter an email address in the correct format.</p>
      )}
      {corrected && <p className="demo-status">Email format accepted.</p>}
      {patternId === "error-summary" && invalid && (
        <p className="demo-error compact" id="quality-email-live-error">Enter an email address in the correct format.</p>
      )}
      {patternId === "error-summary" && (
        <>
          <label htmlFor="quality-plan-live">
            <span>Plan</span>
          </label>
          {planInvalid && <p className="demo-error compact" id="quality-plan-live-error">Choose a plan before continuing.</p>}
          <select
            id="quality-plan-live"
            ref={planRef}
            value={plan}
            onChange={(event) => {
              setPlan(event.target.value);
              if (submitted) setSubmitted(false);
            }}
            aria-invalid={planInvalid}
            aria-describedby={planInvalid ? "quality-plan-live-error" : undefined}
            className={planInvalid ? "field-invalid" : undefined}
          >
            <option value="">Select a plan</option>
            <option value="team">Team</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </>
      )}
      <div className="demo-actions">
        <button type="button" className="demo-button small primary" onClick={submit}>Continue</button>
        {isInline && (
          <button type="button" className="demo-button small" onClick={() => setEmail("ada@example.com")}>Use valid email</button>
        )}
        {!isInline && (
          <button
            type="button"
            className="demo-button small"
            onClick={() => {
              setEmail("ada@example.com");
              setPlan("team");
              setSubmitted(false);
            }}
          >
            Fill valid details
          </button>
        )}
      </div>
    </div>
  );
}

function ValidationBadUx({ meta }: { meta: PatternMeta }) {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  return (
    <div className="quality-example">
      <input value={value} onChange={(event) => setValue(event.target.value)} aria-label={`${meta.field} without inline error`} />
      <button type="button" className="demo-button small" onClick={() => { setValue(""); setMessage("Invalid."); }}>Continue</button>
      <p className="demo-status">{message || "Errors appear after input is lost."}</p>
    </div>
  );
}

function GoodUiExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <ValidationUi patternId={patternId} meta={meta} good />;
}

function BadUiExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <ValidationUi patternId={patternId} meta={meta} />;
}

function GoodUxExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <ValidationGoodUx patternId={patternId} meta={meta} />;
}

function BadUxExample({ meta }: { patternId: string; meta: PatternMeta }) {
  return <ValidationBadUx meta={meta} />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
