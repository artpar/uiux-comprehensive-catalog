import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

function DisclosureDetailsGoodUi() {
  return (
    <div className="quality-example disclosure-static-preview">
      <label className="demo-label">
        Annual income
        <input value="42000" readOnly />
      </label>
      <details className="details-preview" open>
        <summary>How we calculate household income</summary>
        <p>Use income before tax for everyone in the household who is over 18.</p>
      </details>
      <p className="demo-status">One nearby disclosure reveals a short optional explanation without replacing the form flow.</p>
    </div>
  );
}

function DisclosureDetailsBadUi() {
  return (
    <div className="bad-ui-sample disclosure-static-preview bad">
      <div className="disclosure-bad-trigger">More</div>
      <div className="disclosure-bad-box">
        <strong>Hidden eligibility</strong>
        <span>The only rule that changes the answer is buried behind a vague non-button trigger.</span>
      </div>
      <p className="demo-status">The broken treatment hides required context and gives no reliable open state or keyboard behavior.</p>
    </div>
  );
}

function DisclosureDetailsGoodUx() {
  const [open, setOpen] = useState(false);
  const [income, setIncome] = useState("42000");
  const [message, setMessage] = useState("The explanation is closed; the summary still names the hidden content.");
  const [validationVisible, setValidationVisible] = useState(false);

  function toggleDisclosure(nextOpen: boolean) {
    setOpen(nextOpen);
    setMessage(nextOpen
      ? "Disclosure opened in place; focus remains on the summary and the income answer is preserved."
      : "Disclosure closed; the summary still predicts the hidden calculation help.");
  }

  function openFromValidation() {
    setValidationVisible(true);
    setOpen(true);
    setMessage("Validation opened the hidden explanation and kept the nearby income answer intact.");
  }

  return (
    <div className="quality-example disclosure-demo">
      <label className="demo-label">
        Annual income before tax
        <input
          aria-describedby="income-help-summary"
          value={income}
          onChange={(event) => {
            setIncome(event.target.value);
            setMessage("Income answer changed and remains when the disclosure opens or closes.");
          }}
        />
      </label>
      {validationVisible && (
        <div className="disclosure-validation" role="alert">
          <strong>Check household income</strong>
          <span>Open the calculation help and include income from adults in the household.</span>
        </div>
      )}
      <details
        className="details-preview"
        open={open}
        onToggle={(event) => toggleDisclosure(event.currentTarget.open)}
      >
        <summary id="income-help-summary">How we calculate household income</summary>
        <div className="details-body">
          <p>Use income before tax for everyone in the household who is over 18. Do not include disability benefits.</p>
          <div className="details-example">
            <strong>Example</strong>
            <span>Two adults earning 24000 and 18000 should enter 42000.</span>
          </div>
        </div>
      </details>
      <div className="demo-row disclosure-controls">
        <button type="button" className="demo-button small" onClick={() => toggleDisclosure(true)}>Open help</button>
        <button type="button" className="demo-button small" onClick={() => toggleDisclosure(false)}>Close help</button>
        <button type="button" className="demo-button small primary" onClick={openFromValidation}>Open from validation</button>
        <button type="button" className="demo-button small" onClick={() => {
          setOpen((current) => {
            const next = !current;
            setMessage(next ? "Enter or Space toggled the disclosure open." : "Enter or Space toggled the disclosure closed.");
            return next;
          });
        }}>Enter / Space toggle</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function DisclosureDetailsBadUx() {
  type BadMode = "vagueSummary" | "hiddenRequirement" | "navigationLink" | "fakeControl" | "stateLoss" | "overstuffed";
  const [mode, setMode] = useState<BadMode>("vagueSummary");
  const copy: Record<BadMode, string> = {
    vagueSummary: "The summary says Details, so users cannot tell whether the hidden text matters.",
    hiddenRequirement: "The only eligibility rule is hidden and no validation path opens it.",
    navigationLink: "The trigger looks like an in-place reveal but unexpectedly leaves the page.",
    fakeControl: "A styled div pretends to be a disclosure and cannot be toggled reliably from the keyboard.",
    stateLoss: "Opening the help clears the nearby answer instead of preserving task state.",
    overstuffed: "The disclosure contains a long mini-workflow that should be a page, panel, or always-visible section."
  };

  return (
    <div className={`quality-example disclosure-bad-demo is-${mode}`}>
      <label className="demo-label">
        Annual income
        <input value={mode === "stateLoss" ? "" : "42000"} readOnly />
      </label>
      <div className="disclosure-bad-trigger">
        {mode === "navigationLink" ? "Read guidance" : mode === "fakeControl" ? "Show help" : mode === "hiddenRequirement" ? "More" : "Details"}
      </div>
      <div className="disclosure-bad-box">
        <strong>{mode === "overstuffed" ? "Full application workflow" : mode === "hiddenRequirement" ? "Required eligibility rule" : "Unreliable disclosure"}</strong>
        <span>{copy[mode]}</span>
        {mode === "overstuffed" && (
          <div className="disclosure-overstuffed-grid">
            {["Upload file", "Choose adviser", "Book appointment", "Submit appeal"].map((item) => <span key={item}>{item}</span>)}
          </div>
        )}
      </div>
      <div className="demo-row disclosure-controls">
        <button type="button" className={mode === "vagueSummary" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("vagueSummary")}>Vague summary</button>
        <button type="button" className={mode === "hiddenRequirement" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenRequirement")}>Hidden requirement</button>
        <button type="button" className={mode === "navigationLink" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("navigationLink")}>Navigation link</button>
        <button type="button" className={mode === "fakeControl" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("fakeControl")}>Fake control</button>
        <button type="button" className={mode === "stateLoss" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("stateLoss")}>State loss</button>
        <button type="button" className={mode === "overstuffed" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("overstuffed")}>Overstuffed</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DisclosureDetailsGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DisclosureDetailsBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DisclosureDetailsGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DisclosureDetailsBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
