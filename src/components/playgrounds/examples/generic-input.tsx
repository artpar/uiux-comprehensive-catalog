import { useEffect, useRef, useState, type DragEvent } from "react";
import { QualityPanel, type PatternMeta } from './shared';

function InputUi({ patternId, meta, good = false }: { patternId: string; meta: PatternMeta; good?: boolean }) {
  if (patternId === "complete-complex-form" && good) {
    return (
      <div className="quality-example complex-form-demo">
        <div className="complex-form-shell">
          <aside className="complex-section-nav" aria-label="Complex form sections preview">
            {meta.options.map((section, index) => (
              <span className={index < 2 ? "is-complete" : index === 2 ? "is-current" : ""} key={section}>
                <strong>{section}</strong>
                <em>{index < 2 ? "Complete" : index === 2 ? "Needs attention" : "Not checked"}</em>
              </span>
            ))}
          </aside>
          <section className="complex-form-panel">
            <span>Section 3 of 5</span>
            <h4>Approvals</h4>
            <p>Related approval controls stay together, required fields are marked, and validation is aligned with the field that owns it.</p>
            <fieldset>
              <legend>Approval routing</legend>
              <label>
                <span>Minimum approvers required</span>
                <input value="2" readOnly />
              </label>
              <label>
                <span>Escalation owner (required)</span>
                <input value="ops-lead@example.com" readOnly />
              </label>
            </fieldset>
          </section>
        </div>
        <p className="demo-status">A complex form keeps many related settings on one inspectable surface with section status, grouped fields, and aligned validation.</p>
      </div>
    );
  }

  if (patternId === "complete-complex-form") {
    return (
      <div className="bad-ui-sample complex-form-bad-ui">
        <div className="complex-bad-grid">
          {["Nm", "Rule", "Appr", "Mail", "Adv", "JSON", "Opt", "Save"].map((item) => (
            <input key={item} aria-label={item} placeholder={item} />
          ))}
        </div>
        <button type="button" className="demo-button small">Submit all</button>
        <p className="demo-status">Many unrelated controls are packed into a grid with abbreviations, no fieldsets, no section status, and no visible recovery path.</p>
      </div>
    );
  }

  if (patternId === "multi-step-form" && good) {
    return (
      <div className="quality-example multi-step-form-demo">
        <div className="multi-form-card">
          <ol className="multi-form-steps" aria-label="Application steps preview">
            {meta.options.map((step, index) => (
              <li className={index < 2 ? "is-complete" : index === 2 ? "is-current" : "is-locked"} key={step}>
                <span>{index + 1}</span>
                <strong>{step}</strong>
              </li>
            ))}
          </ol>
          <section className="multi-form-step-panel">
            <span>Step 3 of 5</span>
            <h4>Upload documents</h4>
            <p>Eligibility and contact details are saved. Continue is available after the required document is attached.</p>
            <div className="demo-row multi-form-actions">
              <button type="button" className="demo-button small">Back</button>
              <button type="button" className="demo-button small primary">Continue</button>
            </div>
          </section>
        </div>
        <p className="demo-status">The page shows the current step, saved previous steps, locked future steps, and separate Back and Continue controls.</p>
      </div>
    );
  }

  if (patternId === "multi-step-form") {
    return (
      <div className="bad-ui-sample multi-form-bad-ui">
        <div className="bad-nav-row">
          {["1 done", "2 done", "3 done", "4 done", "5 done"].map((item) => <span key={item}>{item}</span>)}
        </div>
        <h4>Step</h4>
        <input aria-label="Unclear step field" placeholder="details" />
        <button type="button" className="demo-button small">Next</button>
        <p className="demo-status">All steps look complete before data is saved, and the page does not say which transaction step owns the field.</p>
      </div>
    );
  }

  if (patternId === "wizard" && good) {
    return (
      <div className="quality-example wizard-demo">
        <div className="wizard-shell">
          <header className="wizard-header">
            <span>Guided setup</span>
            <h4>Connect workspace data</h4>
            <button type="button" className="demo-button small">Cancel</button>
          </header>
          <div className="wizard-layout">
            <ol className="wizard-nav" aria-label="Wizard steps preview">
              {meta.options.map((step, index) => (
                <li className={index === 1 ? "is-current" : index < 1 ? "is-complete" : "is-disabled"} key={step}>
                  <span>{index + 1}</span>
                  <strong>{step}</strong>
                </li>
              ))}
            </ol>
            <section className="wizard-panel">
              <span>Step 2 of 5</span>
              <h4>Configure access</h4>
              <p>Connector choice is locked in, credentials are local to this step, and Test connection is required before Review unlocks.</p>
              <div className="wizard-preview">
                <strong>Preview</strong>
                <span>Zendesk tickets to Support triage board</span>
              </div>
              <div className="demo-row multi-form-actions">
                <button type="button" className="demo-button small">Back</button>
                <button type="button" className="demo-button small primary">Test connection</button>
              </div>
            </section>
          </div>
        </div>
        <p className="demo-status">Wizard chrome provides a guided assistant shell with step navigation, Cancel, step-specific action text, and a preview of generated setup.</p>
      </div>
    );
  }

  if (patternId === "wizard") {
    return (
      <div className="bad-ui-sample wizard-bad-ui">
        <div className="bad-nav-row">
          {["Step", "Step", "Step", "Done"].map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}
        </div>
        <h4>Setup</h4>
        <input aria-label="Mixed wizard field" placeholder="Paste everything here" />
        <button type="button" className="demo-button small">Finish</button>
        <p className="demo-status">The shell looks sequential but hides dependencies, has no Cancel or review, and lets users finish before setup is tested.</p>
      </div>
    );
  }

  if (patternId === "single-page-form" && good) {
    return (
      <div className="quality-example single-page-form-demo">
        <form className="single-form-card" aria-label="Contact details preview">
          <h4>{meta.field}</h4>
          <p id="single-form-ui-note">A red asterisk means the field is required.</p>
          <fieldset aria-describedby="single-form-ui-note">
            <legend>Your details</legend>
            <label>
              <span>Full name *</span>
              <input value="Asha Patel" readOnly />
            </label>
            <label>
              <span>Email address *</span>
              <input value="asha@example.com" readOnly />
            </label>
          </fieldset>
          <fieldset>
            <legend>Contact preference</legend>
            <label className="checkbox-label">
              <input type="radio" name="single-form-ui-pref" defaultChecked readOnly />
              Email
            </label>
            <label className="checkbox-label">
              <input type="radio" name="single-form-ui-pref" readOnly />
              Phone
            </label>
          </fieldset>
          <button type="button" className="demo-button small primary">Save details</button>
        </form>
        <p className="demo-status">Related fields stay together in one vertical form with grouped controls and one final submit action.</p>
      </div>
    );
  }

  if (patternId === "single-page-form") {
    return (
      <div className="bad-ui-sample single-form-bad-ui">
        <h4>Everything</h4>
        <div className="single-form-two-column">
          {["Nm", "Addr", "Pay", "Upload", "Legal", "Notes"].map((item) => (
            <input key={item} aria-label={item} placeholder={item} />
          ))}
        </div>
        <button type="button" className="demo-button small">Go</button>
        <p className="demo-status">Unrelated fields, unclear labels, no required rules, and visual order that does not support recovery.</p>
      </div>
    );
  }

  if (patternId === "single-question-page" && good) {
    return (
      <div className="quality-example question-page-demo">
        <a className="question-back-link" href="#quality-demo" onClick={(event) => event.preventDefault()}>Back</a>
        <div className="question-page-card">
          <span className="question-progress">Section 2 of 5</span>
          <h4>{meta.field}</h4>
          <p id="question-page-ui-hint">Tell us whether you already have a file ready. You can upload it on the next page.</p>
          <fieldset aria-describedby="question-page-ui-hint">
            <legend className="sr-only">{meta.field}</legend>
            {meta.options.map((option, index) => (
              <label className="checkbox-label" key={option}>
                <input type="radio" name="question-ui-preview" defaultChecked={index === 0} readOnly />
                {option}
              </label>
            ))}
          </fieldset>
          <button type="button" className="demo-button small primary">Continue</button>
        </div>
        <p className="demo-status">One page asks one decision, with heading, hint, related answer controls, Back, and Continue in one flow.</p>
      </div>
    );
  }

  if (patternId === "single-question-page") {
    return (
      <div className="bad-ui-sample question-page-bad-ui">
        <h4>Details</h4>
        <input aria-label="Name" placeholder="Name" defaultValue="A. Patel" />
        <input aria-label="Address" placeholder="Address" defaultValue="12 Market Road" />
        <select aria-label="Evidence status" defaultValue="yes">
          <option value="yes">Yes</option>
          <option value="card">Payment card</option>
        </select>
        <button type="button" className="demo-button small">Next</button>
        <p className="demo-status">Several unrelated questions sit under a vague heading, so users cannot tell what this page is asking.</p>
      </div>
    );
  }

  if (patternId === "textarea" && good) {
    return (
      <div className="quality-example textarea-demo">
        <label className="textarea-field">
          <span>{meta.field}</span>
          <small id="textarea-ui-hint">Do not include personal or financial information.</small>
          <textarea value={meta.options[0]} readOnly rows={5} aria-describedby="textarea-ui-hint textarea-ui-count" />
        </label>
        <div className="textarea-count-row" id="textarea-ui-count">
          <span>128 characters remaining</span>
          <em>5 visible rows - line breaks preserved</em>
        </div>
        <p className="demo-status">The writing area shows enough rows to review multiple lines before submitting.</p>
      </div>
    );
  }

  if (patternId === "textarea") {
    return (
      <div className="bad-ui-sample textarea-bad-ui">
        <input aria-label="More detail hidden in one line" defaultValue="I called the office on Monday. They asked me to upload evidence..." />
        <span className="text-input-floating-error">Too much</span>
        <p className="demo-status">A paragraph answer is squeezed into one line, with no visible rows, hint, or usable limit message.</p>
      </div>
    );
  }

  if (patternId === "character-count" && good) {
    return (
      <div className="quality-example character-count-demo">
        <label className="character-count-field">
          <span>{meta.field}</span>
          <small id="character-count-ui-hint">Keep the public summary short enough for the grant listing.</small>
          <textarea value={meta.options[0]} readOnly rows={4} aria-describedby="character-count-ui-hint character-count-ui-count" />
        </label>
        <div className="character-count-message" id="character-count-ui-count">
          <span>49 characters remaining</span>
          <em>Maximum 120 characters</em>
        </div>
        <p className="demo-status">The count is tied to a real publishing limit and stays near the limited field.</p>
      </div>
    );
  }

  if (patternId === "character-count") {
    return (
      <div className="bad-ui-sample character-count-bad-ui">
        <textarea aria-label="Public summary with hidden limit" defaultValue="A long public summary that only fails after the final submit step." rows={2} />
        <button type="button" className="demo-button small">Submit</button>
        <p className="demo-status">The backend limit is hidden until submit, so users cannot recover before losing time.</p>
      </div>
    );
  }

  if (patternId === "text-input" && good) {
    return (
      <div className="quality-example text-input-demo">
        <label className="text-input-field">
          <span>{meta.field}</span>
          <small id="text-input-ui-hint">Use a short label you will recognize later.</small>
          <input value="Appeal draft" readOnly aria-describedby="text-input-ui-hint" />
        </label>
        <div className="text-input-width-row" aria-label="Expected answer widths">
          <label>
            <span>Short code</span>
            <input className="text-input-short" value="AB-42" readOnly />
          </label>
          <label>
            <span>Project title</span>
            <input value="Housing evidence upload" readOnly />
          </label>
        </div>
        <p className="demo-status">Persistent label, hint, focused shape, and answer-width cues stay visible after entry.</p>
      </div>
    );
  }

  if (patternId === "text-input") {
    return (
      <div className="bad-ui-sample text-input-bad-ui">
        <input aria-label="Reference" placeholder="Reference name" defaultValue="Appeal draft" />
        <span className="text-input-floating-error">Bad</span>
        <div className="text-input-bad-long-field">
          <input aria-label="Detailed explanation" defaultValue="I need to explain several facts but this is one hidden line..." />
        </div>
        <p className="demo-status">The visible instruction disappeared, error copy is detached, and the field width implies the wrong answer.</p>
      </div>
    );
  }

  if (patternId === "inline-edit" && good) {
    return (
      <div className="quality-example inline-edit-demo">
        <div className="inline-edit-read-row">
          <span>{meta.field}</span>
          <strong>{meta.options[0]}</strong>
          <button type="button" className="demo-button small">Edit owner</button>
        </div>
        <div className="inline-edit-edit-row" aria-label="Inline edit preview">
          <label>
            <span>{meta.field}</span>
            <input value="Ops lead" readOnly />
          </label>
          <button type="button" className="demo-button small primary">Save</button>
          <button type="button" className="demo-button small">Cancel</button>
        </div>
        <p className="demo-status">The displayed value switches into a local input with adjacent Save and Cancel while the row stays in context.</p>
      </div>
    );
  }

  if (patternId === "inline-edit") {
    return (
      <div className="bad-ui-sample inline-edit-bad-ui">
        <div className="inline-edit-bad-grid">
          {["Owner", "Status", "Tier", "Region"].map((item) => (
            <input key={item} aria-label={item} defaultValue={item === "Owner" ? "Maya Chen" : item} />
          ))}
        </div>
        <button type="button" className="demo-button small">Apply all</button>
        <p className="demo-status">Every value is always editable, with no read mode, dirty state, per-field cancel, or indication of what changed.</p>
      </div>
    );
  }

  if (patternId === "autosave-form" && good) {
    return (
      <div className="quality-example autosave-form-demo">
        <div className="autosave-status is-saved">
          <strong>Draft saved just now</strong>
          <span>We save this application on every safe change.</span>
        </div>
        <label className="autosave-field">
          <span>{meta.options[0]}</span>
          <input value="Community garden launch" readOnly />
        </label>
        <label className="autosave-field is-pending">
          <span>{meta.options[1]}</span>
          <select value="Environment" disabled>
            <option>Environment</option>
          </select>
          <small>Pending autosave</small>
        </label>
        <p className="demo-status">Autosave status is visible before users leave; each changed field owns its save state.</p>
      </div>
    );
  }

  if (patternId === "autosave-form") {
    return (
      <div className="bad-ui-sample autosave-form-bad-ui">
        <input aria-label="Project title" defaultValue="Community garden launch" />
        <textarea aria-label="Impact statement" defaultValue="Long answer..." rows={2} />
        <span>Saved</span>
        <button type="button" className="demo-button small">Continue</button>
        <p className="demo-status">A stale saved label hides which answer failed, whether the draft is recoverable, and whether Continue is safe.</p>
      </div>
    );
  }

  if (patternId === "draft-state" && good) {
    return (
      <div className="quality-example draft-state-demo">
        <div className="draft-state-banner">
          <strong>Unpublished draft</strong>
          <span>Saved today at 10:42. Viewers still see the published article.</span>
        </div>
        <div className="draft-version-row">
          <span>Published</span>
          <strong>Community grants open March 1</strong>
        </div>
        <div className="draft-version-row is-draft">
          <span>Draft</span>
          <strong>Community grants open March 15</strong>
        </div>
        <div className="demo-row draft-state-actions">
          <button type="button" className="demo-button small">Resume draft</button>
          <button type="button" className="demo-button small">Compare</button>
          <button type="button" className="demo-button small primary">Publish</button>
        </div>
        <p className="demo-status">The UI separates the recoverable draft from the version that viewers currently see.</p>
      </div>
    );
  }

  if (patternId === "draft-state") {
    return (
      <div className="bad-ui-sample draft-state-bad-ui">
        <input aria-label="Article title" defaultValue="Community grants open March 15" />
        <span>Saved</span>
        <div className="demo-row draft-state-actions">
          <button type="button" className="demo-button small">Save</button>
          <button type="button" className="demo-button small">Delete</button>
        </div>
        <p className="demo-status">A vague saved label hides whether this is a draft, published content, or shared unpublished work.</p>
      </div>
    );
  }

  if (patternId === "dependent-fields" && good) {
    return (
      <div className="quality-example dependent-fields-demo">
        <label className="dependent-field">
          <span>{meta.options[0]}</span>
          <select value="Network" disabled>
            <option>Network</option>
          </select>
        </label>
        <label className="dependent-field is-linked">
          <span>{meta.options[1]}</span>
          <select value="VPN" disabled>
            <option>VPN</option>
          </select>
          <small>Options are filtered by Category: Network.</small>
        </label>
        <p className="dependent-status is-valid">Network + VPN is a valid pair; changing Category will clear Subcategory.</p>
      </div>
    );
  }

  if (patternId === "dependent-fields") {
    return (
      <div className="bad-ui-sample dependent-fields-bad-ui">
        <select aria-label="Category" defaultValue="Facilities">
          <option>Facilities</option>
          <option>Network</option>
        </select>
        <select aria-label="Subcategory" defaultValue="VPN">
          <option>VPN</option>
          <option>Lighting</option>
        </select>
        <button type="button" className="demo-button small">Submit</button>
        <p className="demo-status">The dependent field keeps an impossible value after the controller changes.</p>
      </div>
    );
  }

  if (patternId === "conditional-reveal-fields" && good) {
    return (
      <div className="quality-example conditional-reveal-demo">
        <fieldset className="conditional-reveal-options">
          <legend>{meta.field}</legend>
          <label className="conditional-reveal-option">
            <input type="radio" name="contact-method-good-ui" defaultChecked />
            <span>{meta.options[0]}</span>
          </label>
          <label className="conditional-reveal-panel">
            <span>Email address</span>
            <input value="maya@example.com" readOnly />
            <small>Shown because Email is selected.</small>
          </label>
          <label className="conditional-reveal-option">
            <input type="radio" name="contact-method-good-ui" />
            <span>{meta.options[1]}</span>
          </label>
          <label className="conditional-reveal-option">
            <input type="radio" name="contact-method-good-ui" />
            <span>{meta.options[2]}</span>
          </label>
        </fieldset>
        <p className="conditional-reveal-status is-ready">Only the selected answer reveals a related follow-up field.</p>
      </div>
    );
  }

  if (patternId === "required-field-hidden-by-conditional-logic" && good) {
    return <RequiredHiddenGoodUi />;
  }

  if (patternId === "validation-that-clears-user-input" && good) {
    return <ValidationClearsGoodUi />;
  }

  if (patternId === "conditional-reveal-fields") {
    return (
      <div className="bad-ui-sample conditional-reveal-bad-ui">
        <select aria-label="Contact method" defaultValue="none">
          <option value="none">No contact</option>
          <option value="email">Email</option>
        </select>
        <input type="hidden" value="old@example.com" readOnly />
        <button type="button" className="demo-button small">Submit</button>
        <p className="demo-status">The hidden required email value still blocks or leaks after No contact is selected.</p>
      </div>
    );
  }

  if (patternId === "required-field-hidden-by-conditional-logic") {
    return <RequiredHiddenBadUi />;
  }

  if (patternId === "validation-that-clears-user-input") {
    return <ValidationClearsBadUi />;
  }

  if (patternId === "input-mask" && good) {
    return (
      <div className="quality-example input-mask-demo">
        <label className="input-mask-field">
          <span>{meta.field}</span>
          <input value={meta.options[0]} readOnly aria-describedby="input-mask-ui-hint input-mask-ui-raw" />
          <small id="input-mask-ui-hint">Format: 4 letters, 6 digits, 1 check digit.</small>
        </label>
        <p className="input-mask-canonical" id="input-mask-ui-raw">Canonical value: ABCD1234567</p>
        <p className="input-mask-status is-valid">Grouped characters match the container reference printed on the release note.</p>
      </div>
    );
  }

  if (patternId === "input-mask") {
    return (
      <div className="bad-ui-sample input-mask-bad-ui">
        <input aria-label="Masked phone" defaultValue="(___) ___-____" />
        <button type="button" className="demo-button small">Submit</button>
        <p className="demo-status">A rigid domestic mask rejects valid pasted international numbers and leaves only placeholders as guidance.</p>
      </div>
    );
  }

  if (patternId === "input-prefix-suffix" && good) {
    return (
      <div className="quality-example input-affix-demo">
        <label className="input-affix-field">
          <span>Adjustment amount in dollars</span>
          <div className="input-affix-control">
            <span className="input-affix-token" aria-hidden="true">$</span>
            <input value="1,250" readOnly aria-describedby="input-affix-ui-hint" />
          </div>
          <small id="input-affix-ui-hint">Enter the amount only; the dollar prefix is not part of the stored value.</small>
        </label>
        <p className="input-affix-status is-valid">Stored value: 1250 USD.</p>
      </div>
    );
  }

  if (patternId === "input-prefix-suffix") {
    return (
      <div className="bad-ui-sample input-affix-bad-ui">
        <span className="input-affix-token">$</span>
        <input aria-label="Amount" defaultValue="$1,250" />
        <button type="button" className="demo-button small">Submit</button>
        <p className="demo-status">The label hides the unit and the symbol is duplicated inside the submitted value.</p>
      </div>
    );
  }

  if (patternId === "date-input" && good) {
    return (
      <div className="quality-example date-input-demo">
        <fieldset className="date-input-fieldset">
          <legend>{meta.field}</legend>
          <small id="date-input-ui-hint">For example, 27 3 2007</small>
          <div className="date-input-parts" aria-describedby="date-input-ui-hint">
            <label>
              <span>Day</span>
              <input value="7" readOnly inputMode="numeric" />
            </label>
            <label>
              <span>Month</span>
              <input value="Jan" readOnly inputMode="numeric" />
            </label>
            <label>
              <span>Year</span>
              <input value="1984" readOnly inputMode="numeric" />
            </label>
          </div>
        </fieldset>
        <p className="date-input-status is-valid">Month name accepted and normalized to canonical date 1984-01-07.</p>
      </div>
    );
  }

  if (patternId === "date-input") {
    return (
      <div className="bad-ui-sample date-input-bad-ui">
        <input aria-label="Date" defaultValue="DD/MM/YYYY" />
        <button type="button" className="demo-button small">Submit</button>
        <p className="demo-status">A single masked field hides the real question, rejects month names, and cannot explain which part is wrong.</p>
      </div>
    );
  }

  if (patternId === "date-picker" && good) {
    return (
      <div className="quality-example date-picker-demo">
        <label className="date-picker-field">
          <span>{meta.field}</span>
          <small id="date-picker-ui-hint">mm/dd/yyyy. Calendar shows available weekdays only.</small>
          <div className="date-picker-input-row">
            <input value="07/14/2026" readOnly aria-describedby="date-picker-ui-hint" />
            <button type="button" className="demo-button small" aria-label="Open appointment date calendar">Open</button>
          </div>
        </label>
        <div className="date-picker-calendar" aria-label="July 2026 appointment calendar">
          <div className="date-picker-calendar-header">
            <button type="button" className="demo-button tiny" aria-label="Previous month">Prev</button>
            <strong>July 2026</strong>
            <button type="button" className="demo-button tiny" aria-label="Next month">Next</button>
          </div>
          <div className="date-picker-weekdays" aria-hidden="true">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>
          <div className="date-picker-grid" role="grid" aria-label="Available appointment dates">
            {["", "", "", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18"].map((day, index) => (
              <span key={`${day}-${index}`} className={!day ? "date-picker-day is-empty" : day === "14" ? "date-picker-day is-selected" : ["4", "5", "11", "12", "18"].includes(day) ? "date-picker-day is-unavailable" : "date-picker-day"}>
                {day}
              </span>
            ))}
          </div>
        </div>
        <p className="date-picker-status is-valid">Tuesday July 14 is selected; weekends are shown but unavailable.</p>
      </div>
    );
  }

  if (patternId === "date-picker") {
    return (
      <div className="bad-ui-sample date-picker-bad-ui">
        <input aria-label="Date of birth" defaultValue="Today" />
        <div className="date-picker-grid bad" aria-hidden="true">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((day) => (
            <span key={day} className="date-picker-day">{day}</span>
          ))}
        </div>
        <button type="button" className="demo-button small">Keep paging backward</button>
        <p className="demo-status">A remembered birthday is hidden behind current-month navigation, unlabeled cells, and no manual fallback.</p>
      </div>
    );
  }

  if (patternId === "date-range-picker" && good) {
    return (
      <div className="quality-example date-range-demo">
        <div className="date-range-fields">
          <label>
            <span>Since</span>
            <input value="2026-08-03" readOnly aria-describedby="date-range-ui-hint" />
          </label>
          <label>
            <span>Until</span>
            <input value="2026-08-14" readOnly aria-describedby="date-range-ui-hint" />
          </label>
        </div>
        <small id="date-range-ui-hint">YYYY-MM-DD. Apply after both boundaries are correct.</small>
        <div className="date-range-calendar" aria-label="August 2026 report range calendar">
          <div className="date-picker-calendar-header">
            <button type="button" className="demo-button tiny" aria-label="Previous month">Prev</button>
            <strong>August 2026</strong>
            <button type="button" className="demo-button tiny" aria-label="Next month">Next</button>
          </div>
          <div className="date-picker-weekdays" aria-hidden="true">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>
          <div className="date-picker-grid" role="grid" aria-label="Selected reporting period">
            {["", "", "", "", "", "", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"].map((day, index) => (
              <span key={`${day}-${index}`} className={!day ? "date-picker-day is-empty" : day === "3" ? "date-picker-day is-range-start" : day === "14" ? "date-picker-day is-range-end" : Number(day) > 3 && Number(day) < 14 ? "date-picker-day is-in-range" : "date-picker-day"}>
                {day}
              </span>
            ))}
          </div>
        </div>
        <p className="date-range-status is-valid">Range includes August 3 through August 14, with Apply still under user control.</p>
      </div>
    );
  }

  if (patternId === "date-range-picker") {
    return (
      <div className="bad-ui-sample date-range-bad-ui">
        <input aria-label="Date" defaultValue="08/14/2026 - 08/03/2026" />
        <div className="date-picker-grid bad" aria-hidden="true">
          {["3", "4", "5", "6", "7", "8", "9", "10", "11"].map((day) => (
            <span key={day} className="date-picker-day">{day}</span>
          ))}
        </div>
        <button type="button" className="demo-button small">Auto refresh</button>
        <p className="demo-status">One unlabeled field stores a reversed range and refreshes results while the user is still exploring.</p>
      </div>
    );
  }

  if (patternId === "time-picker" && good) {
    return (
      <div className="quality-example time-picker-demo">
        <label className="time-picker-field">
          <span>{meta.field}</span>
          <small id="time-picker-ui-hint">Type to filter 30-minute slots. Clinic hours are 9:00 AM to 5:00 PM.</small>
          <input value="9:30 AM" readOnly aria-describedby="time-picker-ui-hint time-picker-ui-canonical" />
        </label>
        <div className="time-picker-controls">
          <label>
            <span>Period</span>
            <select defaultValue="AM" aria-label="Period">
              <option>AM</option>
              <option>PM</option>
            </select>
          </label>
          <label>
            <span>Timezone</span>
            <select defaultValue="America/New_York" aria-label="Timezone">
              <option>America/New_York</option>
              <option>America/Chicago</option>
            </select>
          </label>
        </div>
        <div className="time-picker-options" aria-label="Filtered appointment times">
          <span>9:00 AM</span>
          <strong>9:30 AM</strong>
          <span>10:00 AM</span>
          <span className="is-unavailable">12:00 PM unavailable</span>
        </div>
        <p className="time-picker-canonical" id="time-picker-ui-canonical">Stored value: 09:30:00 America/New_York.</p>
      </div>
    );
  }

  if (patternId === "time-picker") {
    return (
      <div className="bad-ui-sample time-picker-bad-ui">
        <input aria-label="Time" defaultValue="930" />
        <button type="button" className="demo-button small">Book now</button>
        <p className="demo-status">The field stores an ambiguous value without AM/PM, timezone, increments, or correction guidance.</p>
      </div>
    );
  }

  if (patternId === "file-upload" && good) {
    return (
      <div className="quality-example file-upload-demo">
        <label className="file-upload-field">
          <span>{meta.field}</span>
          <small id="file-upload-ui-hint">PDF, PNG, or JPG up to 10 MB. Upload happens before final submit.</small>
          <button type="button" className="demo-button small" aria-describedby="file-upload-ui-hint file-upload-ui-state">Choose file</button>
        </label>
        <div className="file-upload-card is-uploaded" id="file-upload-ui-state">
          <strong>bank-statement.pdf</strong>
          <span>PDF - 2.4 MB - Uploaded</span>
          <button type="button" className="demo-button tiny">Remove</button>
        </div>
        <p className="file-upload-status is-uploaded">This file will be included when the application is submitted.</p>
      </div>
    );
  }

  if (patternId === "file-upload") {
    return (
      <div className="bad-ui-sample file-upload-bad-ui">
        <button type="button" className="demo-button small">Browse</button>
        <span>file1</span>
        <button type="button" className="demo-button small">Continue</button>
        <p className="demo-status">The control hides accepted formats, size limit, selected filename, upload state, and recovery actions.</p>
      </div>
    );
  }

  if (patternId === "drag-and-drop-upload" && good) {
    return (
      <div className="quality-example drag-drop-demo">
        <div className="drag-drop-zone is-over" role="button" tabIndex={0} aria-describedby="drag-drop-ui-hint drag-drop-ui-state">
          <strong>{meta.field}</strong>
          <span id="drag-drop-ui-hint">Drag PDF, PNG, or JPG files here, or choose files.</span>
          <button type="button" className="demo-button small">Choose files</button>
        </div>
        <div className="drag-drop-file-list" id="drag-drop-ui-state">
          <span>lease.pdf - queued</span>
          <span>income-proof.png - queued</span>
        </div>
        <p className="drag-drop-status is-over">The drop zone is active only while files are over the target.</p>
      </div>
    );
  }

  if (patternId === "drag-and-drop-upload") {
    return (
      <div className="bad-ui-sample drag-drop-bad-ui">
        <div className="drag-drop-zone bad" aria-hidden="true">Drop</div>
        <span>Whole page accepts drops</span>
        <p className="demo-status">The page gives no file-picker fallback, no accepted formats, and no safe recovery if the user misses the target.</p>
      </div>
    );
  }

  if (patternId === "bulk-import" && good) {
    return (
      <div className="quality-example bulk-import-demo">
        <div className="bulk-import-stage-row" aria-label="Import stages">
          <span className="is-complete">Template</span>
          <span className="is-complete">Upload</span>
          <span className="is-current">Map</span>
          <span>Validate</span>
          <span>Confirm</span>
          <span>Report</span>
        </div>
        <div className="bulk-import-summary is-ready">
          <strong>{meta.field}</strong>
          <span>team-members.csv - 1,200 rows - 4 headers detected - create and update mode</span>
        </div>
        <div className="bulk-import-map-preview">
          <span>Email maps to Email address</span>
          <span>Name maps to Full name</span>
          <span>Role maps to Access role</span>
          <span>Department maps to Team</span>
        </div>
        <p className="bulk-import-status">Required fields are mapped before validation or import can start.</p>
      </div>
    );
  }

  if (patternId === "bulk-import") {
    return (
      <div className="bad-ui-sample bulk-import-bad-ui">
        <button type="button" className="demo-button small">Upload spreadsheet</button>
        <span>Importing...</span>
        <p className="demo-status">The UI skips templates, mapping, row preview, duplicate rules, confirmation, and downloadable error recovery.</p>
      </div>
    );
  }

  if (patternId === "review-before-submit" && good) {
    return (
      <div className="quality-example review-submit-demo">
        <div className="review-submit-summary is-ready">
          <strong>{meta.field}</strong>
          <span>Grouped answers are editable until Send claim is pressed.</span>
        </div>
        <div className="review-submit-section">
          <h4>Contact details</h4>
          <div className="review-submit-row">
            <span>Email</span>
            <strong>alex@example.com</strong>
            <button type="button" className="demo-button tiny">Change email</button>
          </div>
          <div className="review-submit-row">
            <span>Phone</span>
            <strong>Not provided</strong>
            <button type="button" className="demo-button tiny">Change phone</button>
          </div>
        </div>
        <button type="button" className="demo-button small primary">Send claim</button>
      </div>
    );
  }

  if (patternId === "review-before-submit") {
    return (
      <div className="bad-ui-sample review-submit-bad-ui">
        <strong>Review</strong>
        <p>Everything looks fine.</p>
        <button type="button" className="demo-button small primary">Continue</button>
        <p className="demo-status">The page hides captured answers, change routes, skipped answers, and the fact that Continue submits the claim.</p>
      </div>
    );
  }

  if (patternId === "address-entry" && good) {
    return (
      <div className="quality-example address-entry-demo">
        <div className="address-entry-summary is-selected">
          <strong>{meta.field}</strong>
          <span>Postcode lookup selected an editable address; manual entry remains available.</span>
        </div>
        <div className="address-entry-search">
          <label>
            <span>Postcode</span>
            <input value="SW1A 1AA" readOnly autoComplete="postal-code" />
          </label>
          <button type="button" className="demo-button small">Find addresses</button>
        </div>
        <div className="address-entry-suggestions" aria-label="Address suggestions">
          <button type="button" className="is-selected">Flat 2, 12 Market Road</button>
          <button type="button">12 Market Road</button>
          <button type="button">12A Market Road</button>
        </div>
        <div className="address-entry-grid">
          <label>
            <span>Address line 1</span>
            <input value="12 Market Road" readOnly autoComplete="address-line1" />
          </label>
          <label>
            <span>Address line 2</span>
            <input value="Flat 2" readOnly autoComplete="address-line2" />
          </label>
          <label>
            <span>Town or city</span>
            <input value="London" readOnly autoComplete="address-level2" />
          </label>
          <label>
            <span>Country</span>
            <input value="United Kingdom" readOnly autoComplete="country-name" />
          </label>
        </div>
      </div>
    );
  }

  if (patternId === "address-entry") {
    return (
      <div className="bad-ui-sample address-entry-bad-ui">
        <label>
          <span>Address</span>
          <input defaultValue="12 Market Road" />
        </label>
        <button type="button" className="demo-button small primary">Use first match</button>
        <p className="demo-status">The form hides country, locality, postcode, apartment details, manual entry, and address-not-found recovery.</p>
      </div>
    );
  }

  if (patternId === "bank-details" && good) {
    return (
      <div className="quality-example bank-details-demo">
        <div className="bank-details-summary is-verified">
          <strong>{meta.field}</strong>
          <span>Details are captured in separate secure fields and reviewed with masked account digits.</span>
        </div>
        <div className="bank-details-grid">
          <label>
            <span>Name on the account</span>
            <input value="Alex Chen" readOnly autoComplete="name" />
          </label>
          <label>
            <span>Sort code</span>
            <input value="12-34-56" readOnly inputMode="numeric" />
          </label>
          <label>
            <span>Account number</span>
            <input value="12345678" readOnly inputMode="numeric" />
          </label>
          <label>
            <span>Building society roll number (optional)</span>
            <input value="AB 12/345" readOnly />
          </label>
        </div>
        <div className="bank-details-review">
          <span>Review before payout</span>
          <strong>Alex Chen - sort code 12-34-56 - account ending 5678 - name match</strong>
        </div>
      </div>
    );
  }

  if (patternId === "bank-details") {
    return (
      <div className="bad-ui-sample bank-details-bad-ui">
        <label>
          <span>Bank details</span>
          <textarea defaultValue={"Alex Chen\n12345678\n12-34-56"} />
        </label>
        <button type="button" className="demo-button small primary">Email accounts team</button>
        <p className="demo-status">The form uses one unstructured field, insecure handoff, no roll-number support, no verification, and no masked review.</p>
      </div>
    );
  }

  if (patternId === "payment-card-entry" && good) {
    return (
      <div className="quality-example payment-card-demo">
        <div className="payment-card-summary is-tokenized">
          <strong>{meta.field}</strong>
          <span>Hosted card fields tokenize the PAN and CVC before the app shows a masked payment review.</span>
        </div>
        <div className="payment-card-preview" aria-label="Detected card preview">
          <div>
            <span>Visa</span>
            <strong>**** 4242</strong>
          </div>
          <div>
            <span>Expiry</span>
            <strong>12/30</strong>
          </div>
        </div>
        <div className="payment-card-grid">
          <label>
            <span>Card number</span>
            <input value="4242 4242 4242 4242" readOnly inputMode="numeric" autoComplete="cc-number" />
          </label>
          <label>
            <span>Expiry</span>
            <input value="12/30" readOnly inputMode="numeric" autoComplete="cc-exp" />
          </label>
          <label>
            <span>CVC</span>
            <input value="***" readOnly inputMode="numeric" autoComplete="cc-csc" />
          </label>
          <label>
            <span>ZIP code</span>
            <input value="10001" readOnly inputMode="numeric" autoComplete="postal-code" />
          </label>
        </div>
        <div className="payment-card-token">
          <span>Review before charge</span>
          <strong>Visa ending 4242 - token pm_live_preview - CVC not retained</strong>
        </div>
      </div>
    );
  }

  if (patternId === "payment-card-entry") {
    return (
      <div className="bad-ui-sample payment-card-bad-ui">
        <label>
          <span>Card details</span>
          <textarea defaultValue={"4242 4242 4242 4242\n12/30\n123\nZIP 10001"} />
        </label>
        <button type="button" className="demo-button small primary">Save full card</button>
        <p className="demo-status">The form captures full PAN and CVC in one app-owned field, cannot detect brand or expiry errors, and exposes raw card data on review.</p>
      </div>
    );
  }

  if (patternId === "checkout" && good) return <CheckoutGoodUi />;

  if (patternId === "checkout") return <CheckoutBadUi />;

  if (patternId === "payment-collection" && good) return <PaymentCollectionGoodUi />;

  if (patternId === "payment-collection") return <PaymentCollectionBadUi />;

  if (patternId === "password-input" && good) {
    return (
      <div className="quality-example password-input-demo">
        <div className="password-input-summary is-ready">
          <strong>{meta.field}</strong>
          <span>Hidden by default, password-manager friendly, and clear about show or hide state.</span>
        </div>
        <div className="password-input-form">
          <label>
            <span>Email address</span>
            <input value="ada@example.com" readOnly autoComplete="username" />
          </label>
          <label>
            <span>Password</span>
            <div className="password-input-control">
              <input value="correct horse battery staple" readOnly type="password" spellCheck={false} autoComplete="current-password" autoCapitalize="none" />
              <button type="button" className="demo-button small">Show</button>
            </div>
          </label>
        </div>
        <div className="password-input-review">
          <span>Submit behavior</span>
          <strong>Returns to type password before submit; failed login clears the secret and uses a combined account-details error.</strong>
        </div>
      </div>
    );
  }

  if (patternId === "password-input") {
    return (
      <div className="bad-ui-sample password-input-bad-ui">
        <label>
          <span>Password</span>
          <input type="text" defaultValue="hunter2-password" />
        </label>
        <button type="button" className="demo-button small primary">Sign in</button>
        <p className="demo-status">The field is visible text, blocks password managers, keeps failed secrets on screen, and says exactly that the password was wrong.</p>
      </div>
    );
  }

  if (patternId === "password-creation" && good) {
    return (
      <div className="quality-example password-creation-demo">
        <div className="password-creation-summary is-accepted">
          <strong>{meta.field}</strong>
          <span>Supports generated passwords, paste, long passphrases, and blocked-password feedback.</span>
        </div>
        <div className="password-creation-form">
          <label>
            <span>New password</span>
            <div className="password-creation-control">
              <input value="river lantern map orbit" readOnly type="password" spellCheck={false} autoComplete="new-password" autoCapitalize="none" />
              <button type="button" className="demo-button small">Show</button>
            </div>
          </label>
        </div>
        <div className="password-creation-meter">
          <span>Accepted</span>
          <strong>Long passphrase, not commonly used, no symbol rule required.</strong>
        </div>
      </div>
    );
  }

  if (patternId === "password-creation") {
    return (
      <div className="bad-ui-sample password-creation-bad-ui">
        <label>
          <span>Create password</span>
          <input type="password" defaultValue="Password123!" />
        </label>
        <ul>
          <li>Uppercase letter: yes</li>
          <li>Number: yes</li>
          <li>Symbol: yes</li>
        </ul>
        <p className="demo-status">The checklist accepts a predictable password, blocks spaces and paste, and caps generated values at 12 characters.</p>
      </div>
    );
  }

  if (patternId === "email-address-entry" && good) {
    return (
      <div className="quality-example email-address-demo">
        <div className="email-address-summary is-reviewed">
          <strong>{meta.field}</strong>
          <span>Purpose, email keyboard, autocomplete, paste support, and review before sending.</span>
        </div>
        <label className="email-address-field">
          <span>Email address</span>
          <small>We will only use this to send your receipt.</small>
          <input value="alex+receipts@example.co.uk" readOnly type="email" autoComplete="email" spellCheck={false} />
        </label>
        <div className="email-address-review">
          <span>Review before send</span>
          <strong>Receipt will go to alex+receipts@example.co.uk</strong>
        </div>
      </div>
    );
  }

  if (patternId === "email-address-entry") {
    return (
      <div className="bad-ui-sample email-address-bad-ui">
        <label>
          <span>Contact</span>
          <input type="text" defaultValue="alex+receipts@example.co.uk" />
        </label>
        <label>
          <span>Type it again</span>
          <input type="text" defaultValue="alexreceipts@example.co.uk" />
        </label>
        <p className="demo-status">The form uses plain text fields, blocks paste, removes plus tags, and asks for repeat entry instead of review.</p>
      </div>
    );
  }

  if (patternId === "phone-number-entry" && good) {
    return (
      <div className="quality-example phone-number-demo">
        <div className="phone-number-summary is-reviewed">
          <strong>{meta.field}</strong>
          <span>Type tel, autocomplete tel, familiar spacing, purpose text, and review before contact.</span>
        </div>
        <label className="phone-number-field">
          <span>UK mobile or international phone number</span>
          <small>We will call only if we need to rearrange the appointment.</small>
          <input value="07700 900 982" readOnly type="tel" autoComplete="tel" inputMode="tel" />
        </label>
        <div className="phone-number-review">
          <span>Review before contact</span>
          <strong>Stored as +447700900982 - display kept as 07700 900 982 - voice call allowed</strong>
        </div>
      </div>
    );
  }

  if (patternId === "phone-number-entry") {
    return (
      <div className="bad-ui-sample phone-number-bad-ui">
        <label>
          <span>Phone</span>
          <input type="text" defaultValue="(07700) 900-982" />
        </label>
        <button type="button" className="demo-button small primary">Force SMS verification</button>
        <p className="demo-status">The form hard-codes one domestic mask, strips the leading zero, cannot handle extensions or international numbers, and assumes every user can receive SMS.</p>
      </div>
    );
  }

  if (patternId === "name-entry" && good) {
    return (
      <div className="quality-example name-entry-demo">
        <div className="name-entry-summary is-reviewed">
          <strong>{meta.field}</strong>
          <span>Single full-name field, autocomplete name, spellcheck off, wide enough for long names.</span>
        </div>
        <label className="name-entry-field">
          <span>Full name</span>
          <small>Use the name you want us to use in this service.</small>
          <input value="María-José Carreño Quiñones" readOnly type="text" autoComplete="name" spellCheck={false} />
        </label>
        <div className="name-entry-review">
          <span>Review before correspondence</span>
          <strong>Display: María-José Carreño Quiñones - address as María-José</strong>
        </div>
      </div>
    );
  }

  if (patternId === "name-entry") {
    return (
      <div className="bad-ui-sample name-entry-bad-ui">
        <label>
          <span>Title</span>
          <select defaultValue="Ms">
            <option>Mr</option>
            <option>Mrs</option>
            <option>Miss</option>
            <option>Ms</option>
          </select>
        </label>
        <label>
          <span>First name</span>
          <input type="text" defaultValue="María-José Carreño" />
        </label>
        <label>
          <span>Last name</span>
          <input type="text" defaultValue="Quiñones" />
        </label>
        <p className="demo-status">The form forces title, first-name, last-name, and ASCII assumptions instead of asking what name is needed.</p>
      </div>
    );
  }

  return (
    <div className="quality-example">
      <label>
        <span>{meta.field}</span>
        <input value={meta.options[0]} readOnly />
      </label>
    </div>
  );
}

function InputGoodUx({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  if (patternId === "complete-complex-form") return <CompleteComplexFormGoodUx meta={meta} />;
  if (patternId === "multi-step-form") return <MultiStepFormGoodUx meta={meta} />;
  if (patternId === "wizard") return <WizardGoodUx meta={meta} />;
  if (patternId === "single-page-form") return <SinglePageFormGoodUx />;
  if (patternId === "single-question-page") return <SingleQuestionPageGoodUx meta={meta} />;
  if (patternId === "character-count") return <CharacterCountGoodUx meta={meta} />;
  if (patternId === "date-input") return <DateInputGoodUx meta={meta} />;
  if (patternId === "date-picker") return <DatePickerGoodUx meta={meta} />;
  if (patternId === "date-range-picker") return <DateRangePickerGoodUx meta={meta} />;
  if (patternId === "time-picker") return <TimePickerGoodUx meta={meta} />;
  if (patternId === "file-upload") return <FileUploadGoodUx meta={meta} />;
  if (patternId === "drag-and-drop-upload") return <DragAndDropUploadGoodUx meta={meta} />;
  if (patternId === "bulk-import") return <BulkImportGoodUx meta={meta} />;
  if (patternId === "review-before-submit") return <ReviewBeforeSubmitGoodUx meta={meta} />;
  if (patternId === "address-entry") return <AddressEntryGoodUx meta={meta} />;
  if (patternId === "bank-details") return <BankDetailsGoodUx meta={meta} />;
  if (patternId === "payment-card-entry") return <PaymentCardEntryGoodUx meta={meta} />;
  if (patternId === "checkout") return <CheckoutGoodUx meta={meta} />;
  if (patternId === "payment-collection") return <PaymentCollectionGoodUx meta={meta} />;
  if (patternId === "password-input") return <PasswordInputGoodUx meta={meta} />;
  if (patternId === "password-creation") return <PasswordCreationGoodUx />;
  if (patternId === "email-address-entry") return <EmailAddressEntryGoodUx meta={meta} />;
  if (patternId === "phone-number-entry") return <PhoneNumberEntryGoodUx meta={meta} />;
  if (patternId === "name-entry") return <NameEntryGoodUx meta={meta} />;
  if (patternId === "textarea") return <TextareaGoodUx meta={meta} />;
  if (patternId === "text-input") return <TextInputGoodUx meta={meta} />;
  if (patternId === "inline-edit") return <InlineEditGoodUx meta={meta} />;
  if (patternId === "autosave-form") return <AutosaveFormGoodUx meta={meta} />;
  if (patternId === "draft-state") return <DraftStateGoodUx meta={meta} />;
  if (patternId === "dependent-fields") return <DependentFieldsGoodUx meta={meta} />;
  if (patternId === "conditional-reveal-fields") return <ConditionalRevealFieldsGoodUx meta={meta} />;
  if (patternId === "required-field-hidden-by-conditional-logic") return <RequiredHiddenGoodUx />;
  if (patternId === "validation-that-clears-user-input") return <ValidationClearsGoodUx />;
  if (patternId === "input-mask") return <InputMaskGoodUx meta={meta} />;
  if (patternId === "input-prefix-suffix") return <InputPrefixSuffixGoodUx meta={meta} />;

  const [value, setValue] = useState(meta.options[0] ?? "");
  return (
    <div className="quality-example">
      <label>
        <span>{meta.field}</span>
        <input value={value} onChange={(event) => setValue(event.target.value)} />
      </label>
      <p className="demo-status" aria-live="polite">Current value: {value || "empty"}</p>
    </div>
  );
}

function InputBadUx({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  if (patternId === "complete-complex-form") return <CompleteComplexFormBadUx meta={meta} />;
  if (patternId === "multi-step-form") return <MultiStepFormBadUx meta={meta} />;
  if (patternId === "wizard") return <WizardBadUx meta={meta} />;
  if (patternId === "single-page-form") return <SinglePageFormBadUx />;
  if (patternId === "single-question-page") return <SingleQuestionPageBadUx meta={meta} />;
  if (patternId === "character-count") return <CharacterCountBadUx meta={meta} />;
  if (patternId === "date-input") return <DateInputBadUx meta={meta} />;
  if (patternId === "date-picker") return <DatePickerBadUx meta={meta} />;
  if (patternId === "date-range-picker") return <DateRangePickerBadUx meta={meta} />;
  if (patternId === "time-picker") return <TimePickerBadUx meta={meta} />;
  if (patternId === "file-upload") return <FileUploadBadUx meta={meta} />;
  if (patternId === "drag-and-drop-upload") return <DragAndDropUploadBadUx meta={meta} />;
  if (patternId === "bulk-import") return <BulkImportBadUx meta={meta} />;
  if (patternId === "review-before-submit") return <ReviewBeforeSubmitBadUx meta={meta} />;
  if (patternId === "address-entry") return <AddressEntryBadUx meta={meta} />;
  if (patternId === "bank-details") return <BankDetailsBadUx meta={meta} />;
  if (patternId === "payment-card-entry") return <PaymentCardEntryBadUx meta={meta} />;
  if (patternId === "checkout") return <CheckoutBadUx meta={meta} />;
  if (patternId === "payment-collection") return <PaymentCollectionBadUx meta={meta} />;
  if (patternId === "password-input") return <PasswordInputBadUx meta={meta} />;
  if (patternId === "password-creation") return <PasswordCreationBadUx meta={meta} />;
  if (patternId === "email-address-entry") return <EmailAddressEntryBadUx meta={meta} />;
  if (patternId === "phone-number-entry") return <PhoneNumberEntryBadUx meta={meta} />;
  if (patternId === "name-entry") return <NameEntryBadUx meta={meta} />;
  if (patternId === "textarea") return <TextareaBadUx />;
  if (patternId === "text-input") return <TextInputBadUx />;
  if (patternId === "inline-edit") return <InlineEditBadUx meta={meta} />;
  if (patternId === "autosave-form") return <AutosaveFormBadUx meta={meta} />;
  if (patternId === "draft-state") return <DraftStateBadUx meta={meta} />;
  if (patternId === "dependent-fields") return <DependentFieldsBadUx meta={meta} />;
  if (patternId === "conditional-reveal-fields") return <ConditionalRevealFieldsBadUx meta={meta} />;
  if (patternId === "required-field-hidden-by-conditional-logic") return <RequiredHiddenBadUx />;
  if (patternId === "validation-that-clears-user-input") return <ValidationClearsBadUx />;
  if (patternId === "input-mask") return <InputMaskBadUx meta={meta} />;
  if (patternId === "input-prefix-suffix") return <InputPrefixSuffixBadUx meta={meta} />;

  return (
    <div className="quality-example">
      <input aria-label={`${meta.field} without guidance`} defaultValue={meta.options[0] ?? ""} />
      <p className="demo-status">No visible label, hint, validation timing, or recovery path.</p>
    </div>
  );
}

function InlineEditGoodUx({ meta }: { meta: PatternMeta }) {
  const [saved, setSaved] = useState(meta.options[0]);
  const [draft, setDraft] = useState(meta.options[0]);
  const [editing, setEditing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pendingAway, setPendingAway] = useState(false);
  const [message, setMessage] = useState("Read mode shows the saved owner with a named edit action.");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const dirty = draft !== saved;
  const error = submitted && draft.trim().length < 3 ? "Enter at least 3 characters before saving." : "";

  const startEdit = () => {
    setDraft(saved);
    setEditing(true);
    setSubmitted(false);
    setPendingAway(false);
    setMessage("Edit mode replaced the displayed value with one focused input plus Save and Cancel.");
  };

  const save = () => {
    setSubmitted(true);
    setPendingAway(false);
    if (!dirty) {
      setMessage("Save stays unavailable until the draft differs from the original value.");
      return;
    }
    if (draft.trim().length < 3) {
      setMessage("Validation stays beside the inline field and the draft remains editable.");
      return;
    }
    const nextValue = draft.trim();
    setSaved(nextValue);
    setDraft(nextValue);
    setEditing(false);
    setSubmitted(false);
    setMessage(`Saved inline and returned to read mode: ${nextValue}.`);
  };

  const cancel = () => {
    setDraft(saved);
    setEditing(false);
    setSubmitted(false);
    setPendingAway(false);
    setMessage("Cancel restored the original displayed value without leaving the row.");
  };

  const clickAway = () => {
    if (!editing) {
      setMessage("Nothing is being edited, so leaving the row does not change the value.");
      return;
    }
    if (!dirty) {
      setEditing(false);
      setMessage("Click-away with no changes exits edit mode safely.");
      return;
    }
    setPendingAway(true);
    setMessage("Dirty click-away is blocked until the user keeps editing or discards the draft.");
  };

  return (
    <div className="quality-example inline-edit-demo">
      <div className={editing ? "inline-edit-read-row is-editing" : "inline-edit-read-row"}>
        <span>{meta.field}</span>
        {!editing ? (
          <>
            <strong>{saved}</strong>
            <button type="button" className="demo-button small" onClick={startEdit}>Edit owner</button>
          </>
        ) : (
          <div className="inline-edit-edit-row">
            <label className={error ? "text-input-field has-error" : "text-input-field"}>
              <span>{meta.field}</span>
              {error && <strong>{error}</strong>}
              <input
                ref={inputRef}
                value={draft}
                aria-invalid={Boolean(error) || undefined}
                onChange={(event) => {
                  setDraft(event.target.value);
                  setSubmitted(false);
                  setPendingAway(false);
                  setMessage("Draft changed locally; Save is available and Cancel still restores the original.");
                }}
              />
            </label>
            <button type="button" className="demo-button small primary" disabled={!dirty} onClick={save}>Save</button>
            <button type="button" className="demo-button small" onClick={cancel}>Cancel</button>
          </div>
        )}
      </div>
      {pendingAway && (
        <div className="inline-edit-warning" role="alert">
          <strong>Unsaved inline edit</strong>
          <span>Discard "{draft}" and restore "{saved}"?</span>
          <div className="demo-row inline-edit-actions">
            <button type="button" className="demo-button small danger" onClick={cancel}>Discard changes</button>
            <button
              type="button"
              className="demo-button small"
              onClick={() => {
                setPendingAway(false);
                setMessage("Kept editing the dirty inline value.");
              }}
            >
              Keep editing
            </button>
          </div>
        </div>
      )}
      <div className="demo-row inline-edit-actions">
        <button type="button" className="demo-button small" onClick={startEdit}>Enter edit mode</button>
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            setEditing(true);
            setDraft("Al");
            setSubmitted(true);
            setPendingAway(false);
            setMessage("Invalid drafts stay in the inline editor until corrected.");
          }}
        >
          Make invalid
        </button>
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            setEditing(true);
            setDraft("Ops lead");
            setSubmitted(false);
            setPendingAway(false);
            setMessage("Changed value is held as a dirty draft before save.");
          }}
        >
          Change value
        </button>
        <button type="button" className="demo-button small" onClick={clickAway}>Click away</button>
        <button type="button" className="demo-button small primary" onClick={save}>Save draft</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function InlineEditBadUx({ meta }: { meta: PatternMeta }) {
  const [owner, setOwner] = useState(meta.options[0]);
  const [status, setStatus] = useState("Everything is editable all the time, so read state and dirty state are indistinguishable.");
  const [warning, setWarning] = useState("No changes tracked");

  return (
    <div className="quality-example inline-edit-demo">
      <div className="inline-edit-bad-ui">
        <div className="inline-edit-bad-grid">
          <input aria-label="Owner" value={owner} onChange={(event) => setOwner(event.target.value)} />
          <input aria-label="Status" defaultValue="Running" />
          <input aria-label="Tier" defaultValue="Production" />
          <input aria-label="Region" defaultValue="us-east-1" />
        </div>
        <div className="demo-row inline-edit-actions">
          <button
            type="button"
            className="demo-button small"
            onClick={() => {
              setOwner("");
              setWarning("Sorted row moved");
              setStatus("Sorting changed the edited row and cleared the owner before the user confirmed.");
            }}
          >
            Sort table
          </button>
          <button
            type="button"
            className="demo-button small"
            onClick={() => {
              setWarning("Saved all cells");
              setStatus("A global save committed every visible input without showing which values changed.");
            }}
          >
            Apply all
          </button>
          <button
            type="button"
            className="demo-button small danger"
            onClick={() => {
              setOwner(meta.options[0]);
              setWarning("Draft discarded");
              setStatus("Leaving the row silently restored the original value with no dirty-state choice.");
            }}
          >
            Leave page
          </button>
        </div>
        <div className="single-form-error-summary bad">{warning}</div>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

type AutosaveStatus = "saved" | "pending" | "saving" | "failed";

function AutosaveFormGoodUx({ meta }: { meta: PatternMeta }) {
  const [title, setTitle] = useState("Community garden launch");
  const [category, setCategory] = useState("Environment");
  const [impact, setImpact] = useState("We will build raised beds with neighborhood volunteers.");
  const [pendingField, setPendingField] = useState<string | null>(null);
  const [status, setStatus] = useState<AutosaveStatus>("saved");
  const [message, setMessage] = useState("Draft saved just now. Autosave preserves progress, but final submit is still separate.");
  const [lastSaved, setLastSaved] = useState("just now");
  const [leaveWarning, setLeaveWarning] = useState(false);

  const markPending = (field: string) => {
    setPendingField(field);
    setStatus("pending");
    setLeaveWarning(false);
    setMessage(`${field} has unsaved changes waiting for autosave.`);
  };

  const startAutosave = (field = pendingField ?? "Latest field") => {
    setPendingField(field);
    setStatus("saving");
    setLeaveWarning(false);
    setMessage(`Saving ${field.toLowerCase()} in the background.`);
  };

  const finishAutosave = () => {
    setPendingField(null);
    setStatus("saved");
    setLastSaved("a few seconds ago");
    setLeaveWarning(false);
    setMessage("Draft saved a few seconds ago. The saved status refers to the latest change.");
  };

  const failAutosave = () => {
    setPendingField("Impact statement");
    setStatus("failed");
    setLeaveWarning(false);
    setMessage("Failed to autosave Impact statement. The typed draft remains visible and retry is available.");
  };

  const retryAutosave = () => {
    startAutosave(pendingField ?? "Impact statement");
    setMessage("Retrying the failed autosave without clearing the draft.");
  };

  const tryLeave = () => {
    if (status === "pending" || status === "saving" || status === "failed") {
      setLeaveWarning(true);
      setMessage("Leaving is blocked until the pending or failed autosave is handled.");
      return;
    }
    setMessage("Safe to leave: the latest autosaved draft is recoverable.");
  };

  const statusLabel = status === "saved"
    ? `Draft saved ${lastSaved}`
    : status === "saving"
      ? `Saving ${pendingField ?? "latest change"}`
      : status === "failed"
        ? `Autosave failed for ${pendingField ?? "latest change"}`
        : `${pendingField ?? "Latest change"} pending autosave`;

  return (
    <div className="quality-example autosave-form-demo">
      <div className={`autosave-status is-${status}`} role={status === "failed" ? "alert" : "status"} aria-live="polite">
        <strong>{statusLabel}</strong>
        <span id="autosave-good-message">We save safe application progress automatically; Submit still sends the final application.</span>
        {status === "failed" && <button type="button" className="demo-button small" onClick={retryAutosave}>Retry autosave</button>}
      </div>
      <div className="autosave-form-grid">
        <label className={pendingField === "Project title" ? "autosave-field is-pending" : "autosave-field"}>
          <span>{meta.options[0]}</span>
          <input
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              markPending("Project title");
            }}
            onBlur={() => pendingField === "Project title" && startAutosave("Project title")}
          />
          {pendingField === "Project title" && <small>{status === "saving" ? "Saving after blur" : "Waiting for autosave"}</small>}
        </label>
        <label className={pendingField === "Funding category" ? "autosave-field is-pending" : "autosave-field"}>
          <span>{meta.options[1]}</span>
          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setPendingField("Funding category");
              setStatus("saving");
              setLeaveWarning(false);
              setMessage("Safe selection change starts autosave immediately.");
            }}
          >
            <option>Environment</option>
            <option>Arts</option>
            <option>Youth services</option>
          </select>
          {pendingField === "Funding category" && <small>Selection is being saved now</small>}
        </label>
      </div>
      <label className={pendingField === "Impact statement" ? "autosave-field is-pending" : "autosave-field"}>
        <span>{meta.options[2]}</span>
        <textarea
          value={impact}
          rows={3}
          onChange={(event) => {
            setImpact(event.target.value);
            markPending("Impact statement");
          }}
          onBlur={() => pendingField === "Impact statement" && startAutosave("Impact statement")}
        />
        {pendingField === "Impact statement" && <small>{status === "failed" ? "Retry required before leaving" : "Draft queued for autosave"}</small>}
      </label>
      {leaveWarning && (
        <div className="autosave-leave-warning" role="alert">
          <strong>Progress is not safely saved</strong>
          <span>Handle {pendingField ?? "the latest change"} before leaving this form.</span>
          <div className="demo-row autosave-actions">
            <button type="button" className="demo-button small primary" onClick={retryAutosave}>Retry now</button>
            <button
              type="button"
              className="demo-button small"
              onClick={() => {
                setLeaveWarning(false);
                setMessage("Stayed on the form with the draft intact.");
              }}
            >
              Stay on page
            </button>
          </div>
        </div>
      )}
      <div className="demo-row autosave-actions">
        <button type="button" className="demo-button small" onClick={() => markPending("Project title")}>Edit title</button>
        <button type="button" className="demo-button small" onClick={() => startAutosave()}>Start autosave</button>
        <button type="button" className="demo-button small" onClick={finishAutosave}>Finish save</button>
        <button type="button" className="demo-button small" onClick={failAutosave}>Fail autosave</button>
        <button type="button" className="demo-button small" onClick={tryLeave}>Try to leave</button>
        <button type="button" className="demo-button small primary" aria-describedby="autosave-good-message">Submit final</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function AutosaveFormBadUx({ meta }: { meta: PatternMeta }) {
  const [title, setTitle] = useState("Community garden launch");
  const [status, setStatus] = useState("Saved");
  const [message, setMessage] = useState("A stale saved label is shown even though no latest-change ownership is tracked.");

  return (
    <div className="quality-example autosave-form-demo">
      <div className="autosave-form-bad-ui">
        <span className="autosave-stale-status">{status}</span>
        <input
          aria-label={meta.options[0]}
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setStatus("Saved");
            setMessage("Typing changed the latest value, but the UI still says Saved from an older request.");
          }}
        />
        <textarea aria-label={meta.options[2]} defaultValue="Long answer that might be lost..." rows={3} />
        <div className="demo-row autosave-actions">
          <button
            type="button"
            className="demo-button small"
            onClick={() => {
              setStatus("Saved");
              setMessage("Continue was allowed even though the form never proved the latest answer was persisted.");
            }}
          >
            Continue
          </button>
          <button
            type="button"
            className="demo-button small danger"
            onClick={() => {
              setTitle("");
              setStatus("Autosave failed");
              setMessage("The failed autosave cleared the field and offered no retry queue.");
            }}
          >
            Simulate failure
          </button>
          <button
            type="button"
            className="demo-button small"
            onClick={() => {
              setStatus("Left page");
              setMessage("The page was left while save status was ambiguous.");
            }}
          >
            Leave page
          </button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

type DraftLifecycleState = "published-with-draft" | "editing-draft" | "comparing" | "published" | "discard-confirm" | "discarded" | "stale-link";

function DraftStateGoodUx({ meta }: { meta: PatternMeta }) {
  const [state, setState] = useState<DraftLifecycleState>("published-with-draft");
  const [draftTitle, setDraftTitle] = useState("Community grants open March 15");
  const [message, setMessage] = useState("A saved draft exists for this article. Viewers still see the published version.");
  const publishedTitle = "Community grants open March 1";
  const hasDraft = state !== "published" && state !== "discarded" && state !== "stale-link";

  const showResume = () => {
    setState("editing-draft");
    setMessage("Resumed the unpublished draft. The editor keeps the draft label and last-saved time visible.");
  };

  const showCompare = () => {
    setState("comparing");
    setMessage("Comparison shows what will change before publishing or discarding.");
  };

  const publishDraft = () => {
    setState("published");
    setMessage(`Published "${draftTitle}". The draft is now the visible article and available to viewers.`);
  };

  const askDiscard = () => {
    setState("discard-confirm");
    setMessage("Discard requires confirmation because this draft contains shared unpublished changes.");
  };

  const discardDraft = () => {
    setState("discarded");
    setDraftTitle(publishedTitle);
    setMessage("Draft discarded. The article returned to the last published version.");
  };

  const openStaleLink = () => {
    setState("stale-link");
    setMessage("The old draft link no longer opens an editor; recovery points back to the active article.");
  };

  const statusLabel =
    state === "published"
      ? "Published"
      : state === "discarded"
        ? "No draft"
        : state === "stale-link"
          ? "Draft unavailable"
          : "Unpublished draft";
  const draftActionsDisabled = !hasDraft;

  return (
    <div className="quality-example draft-state-demo">
      <div className={`draft-state-banner is-${state}`} role={state === "stale-link" ? "alert" : "status"} aria-live="polite">
        <strong>{statusLabel}</strong>
        <span>{hasDraft ? "Saved today at 10:42. Viewers still see the published article until you publish." : "No unpublished draft is currently editable."}</span>
      </div>

      {state === "stale-link" ? (
        <div className="draft-unavailable-panel">
          <strong>Draft is no longer available</strong>
          <span>This link points to a draft that was published, discarded, deleted, or is no longer accessible.</span>
          <button
            type="button"
            className="demo-button small primary"
            onClick={() => {
              setState("published-with-draft");
              setDraftTitle("Community grants open March 15");
              setMessage("Returned to the active article, where the available draft can be resumed or discarded.");
            }}
          >
            Back to active article
          </button>
        </div>
      ) : (
        <>
          <div className="draft-version-grid">
            <div className="draft-version-row">
              <span>{meta.options[0]}</span>
              <strong>{publishedTitle}</strong>
              <small>Visible to viewers</small>
            </div>
            <div className={hasDraft ? "draft-version-row is-draft" : "draft-version-row is-empty"}>
              <span>{hasDraft ? meta.options[1] : "No unpublished draft"}</span>
              {hasDraft ? (
                <>
                  <input
                    aria-label="Draft article title"
                    value={draftTitle}
                    readOnly={state !== "editing-draft"}
                    onChange={(event) => {
                      setDraftTitle(event.target.value);
                      setMessage("Draft title changed. It remains unpublished until Publish is used.");
                    }}
                  />
                  <small>{state === "editing-draft" ? "Editable draft mode" : "Recoverable draft version"}</small>
                </>
              ) : (
                <>
                  <strong>{publishedTitle}</strong>
                  <small>Draft workspace is clear</small>
                </>
              )}
            </div>
          </div>

          {state === "comparing" && (
            <div className="draft-compare-panel">
              <strong>Changes before publish</strong>
              <span>Opening date changes from March 1 to March 15.</span>
              <span>Shared edits by Priya Rao are included in this unpublished draft.</span>
            </div>
          )}

          {state === "discard-confirm" && (
            <div className="draft-discard-panel" role="alert">
              <strong>Discard shared draft?</strong>
              <span>This removes the unpublished March 15 change and Priya Rao's edit. The published article stays unchanged.</span>
              <div className="demo-row draft-state-actions">
                <button type="button" className="demo-button small danger" onClick={discardDraft}>Discard draft</button>
                <button
                  type="button"
                  className="demo-button small"
                  onClick={() => {
                    setState("editing-draft");
                    setMessage("Kept the draft open with shared changes intact.");
                  }}
                >
                  Keep editing
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <div className="demo-row draft-state-actions">
        <button type="button" className="demo-button small" onClick={showResume} disabled={draftActionsDisabled}>Resume draft</button>
        <button type="button" className="demo-button small" onClick={showCompare} disabled={draftActionsDisabled}>Compare changes</button>
        <button type="button" className="demo-button small primary" onClick={publishDraft} disabled={draftActionsDisabled}>Publish</button>
        <button type="button" className="demo-button small" onClick={askDiscard} disabled={draftActionsDisabled}>Discard</button>
        <button type="button" className="demo-button small" onClick={openStaleLink}>Open old draft link</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function DraftStateBadUx({ meta }: { meta: PatternMeta }) {
  const [title, setTitle] = useState("Community grants open March 15");
  const [status, setStatus] = useState("Saved");
  const [message, setMessage] = useState("The editor hides whether this saved version is a draft or the live article.");

  return (
    <div className="quality-example draft-state-demo">
      <div className="draft-state-bad-ui">
        <span className="draft-state-ambiguous-status">{status}</span>
        <input
          aria-label={meta.options[1]}
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setStatus("Saved");
            setMessage("Typing still shows Saved, but the UI never says who can see the change.");
          }}
        />
        <div className="demo-row draft-state-actions">
          <button
            type="button"
            className="demo-button small"
            onClick={() => {
              setStatus("Saved");
              setMessage("Save gave no clue whether it saved a draft or published the article.");
            }}
          >
            Save
          </button>
          <button
            type="button"
            className="demo-button small primary"
            onClick={() => {
              setStatus("Published?");
              setMessage("The publish result is ambiguous because the editor never separated draft from live content.");
            }}
          >
            Done
          </button>
          <button
            type="button"
            className="demo-button small danger"
            onClick={() => {
              setTitle("");
              setStatus("Deleted");
              setMessage("Delete removed unpublished work without saying whether shared changes were included.");
            }}
          >
            Delete
          </button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

const dependentOptions: Record<string, string[]> = {
  Network: ["VPN", "Wi-Fi", "Firewall"],
  Facilities: ["Lighting", "Access card", "Heating"],
  Hardware: ["Laptop", "Monitor", "Dock"],
  Other: []
};

type DependentMode = "ready" | "cleared" | "loading" | "error" | "submitted";

function DependentFieldsGoodUx({ meta }: { meta: PatternMeta }) {
  const [category, setCategory] = useState("Network");
  const [subcategory, setSubcategory] = useState("VPN");
  const [mode, setMode] = useState<DependentMode>("ready");
  const [message, setMessage] = useState("Subcategory options are filtered by Category: Network.");
  const options = dependentOptions[category] ?? [];
  const hasValidPair = Boolean(category && subcategory && options.includes(subcategory));
  const needsSubcategory = category !== "Other";

  const changeCategory = (nextCategory: string) => {
    const previous = subcategory;
    const nextOptions = dependentOptions[nextCategory] ?? [];
    setCategory(nextCategory);
    setMode("cleared");
    if (previous && !nextOptions.includes(previous)) {
      setSubcategory("");
      setMessage(`${previous} was cleared because it is not valid for Category: ${nextCategory}.`);
      return;
    }
    setMessage(`Subcategory options now match Category: ${nextCategory}.`);
  };

  const loadDependentOptions = () => {
    setMode("loading");
    setSubcategory("");
    setMessage(`Loading subcategory choices for ${category}; the dependent field is not ready yet.`);
  };

  const finishLoading = () => {
    setMode("ready");
    setMessage(`Loaded ${options.length} valid subcategory choices for ${category}.`);
  };

  const submit = () => {
    if (!category) {
      setMode("error");
      setMessage("Choose Category before Subcategory can be evaluated.");
      return;
    }
    if (needsSubcategory && !hasValidPair) {
      setMode("error");
      setMessage(`Choose a valid Subcategory for Category: ${category}.`);
      return;
    }
    setMode("submitted");
    setMessage(needsSubcategory ? `Submitted valid pair: ${category} + ${subcategory}.` : "Submitted Category: Other with no dependent subcategory required.");
  };

  const subcategoryHelp =
    mode === "loading"
      ? "Subcategory choices are loading."
      : !category
        ? "Choose a category first."
        : options.length === 0
          ? "No subcategory is required for this category."
          : mode === "cleared"
            ? `Choose a new subcategory for ${category}.`
            : `Options are filtered by Category: ${category}.`;

  return (
    <div className="quality-example dependent-fields-demo">
      <div className={`dependent-status is-${mode}`} role={mode === "error" ? "alert" : "status"} aria-live="polite">
        <strong>{hasValidPair ? "Valid dependent pair" : mode === "submitted" ? "Dependency accepted" : "Dependent field needs review"}</strong>
        <span>{message}</span>
      </div>
      <div className="dependent-fields-grid">
        <label className="dependent-field">
          <span>{meta.options[0]}</span>
          <select value={category} onChange={(event) => changeCategory(event.target.value)}>
            <option value="">Choose category</option>
            <option>Network</option>
            <option>Facilities</option>
            <option>Hardware</option>
            <option>Other</option>
          </select>
          <small>Controls which subcategory values are valid.</small>
        </label>
        <label className={subcategory ? "dependent-field is-linked" : "dependent-field is-waiting"}>
          <span>{meta.options[1]}</span>
          <select
            value={subcategory}
            aria-describedby="dependent-subcategory-help"
            aria-invalid={mode === "error" && needsSubcategory && !hasValidPair ? true : undefined}
            onChange={(event) => {
              setSubcategory(event.target.value);
              setMode("ready");
              setMessage(`${event.target.value} selected from the ${category} subset.`);
            }}
          >
            <option value="">{mode === "loading" ? "Loading choices..." : options.length === 0 ? "No subcategory needed" : "Choose subcategory"}</option>
            {options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <small id="dependent-subcategory-help">{subcategoryHelp}</small>
        </label>
      </div>
      {mode === "error" && (
        <div className="dependent-error" role="alert">
          <strong>Fix dependent fields</strong>
          <span>{message}</span>
        </div>
      )}
      <div className="demo-row dependent-actions">
        <button type="button" className="demo-button small" onClick={() => changeCategory("Facilities")}>Change to Facilities</button>
        <button type="button" className="demo-button small" onClick={loadDependentOptions}>Simulate loading</button>
        <button type="button" className="demo-button small" onClick={finishLoading}>Finish loading</button>
        <button type="button" className="demo-button small" onClick={() => changeCategory("Other")}>No child options</button>
        <button type="button" className="demo-button small primary" onClick={submit}>Submit pair</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function DependentFieldsBadUx({ meta }: { meta: PatternMeta }) {
  const [category, setCategory] = useState("Network");
  const [subcategory, setSubcategory] = useState("VPN");
  const [message, setMessage] = useState("The form never explains that Subcategory depends on Category.");

  return (
    <div className="quality-example dependent-fields-demo">
      <div className="dependent-fields-bad-ui">
        <label>
          <span>{meta.options[0]}</span>
          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setMessage(`Category changed to ${event.target.value}, but stale Subcategory ${subcategory || "blank"} was kept.`);
            }}
          >
            <option>Network</option>
            <option>Facilities</option>
            <option>Hardware</option>
          </select>
        </label>
        <label>
          <span>{meta.options[1]}</span>
          <select value={subcategory} onChange={(event) => setSubcategory(event.target.value)}>
            <option>VPN</option>
            <option>Lighting</option>
            <option>Laptop</option>
          </select>
        </label>
        <div className="demo-row dependent-actions">
          <button
            type="button"
            className="demo-button small"
            onClick={() => {
              setCategory("Facilities");
              setMessage("Facilities + VPN is now an impossible pair, but the UI still presents it as saved.");
            }}
          >
            Keep stale pair
          </button>
          <button
            type="button"
            className="demo-button small primary"
            onClick={() => setMessage(`Submitted ${category} + ${subcategory} without dependency validation.`)}
          >
            Submit
          </button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

type RequiredHiddenGoodMode =
  | "requirementMap"
  | "triggerSelected"
  | "triggerCleared"
  | "submitRecovery"
  | "serverRestored"
  | "draftSynced"
  | "reviewBranch"
  | "nestedEscalated"
  | "assistiveNotice"
  | "mobileCollapsed";

type RequiredHiddenBadMode =
  | "hiddenBlocker"
  | "staleTrigger"
  | "disabledRequired"
  | "deadLink"
  | "serverOnly"
  | "afterSubmitReveal"
  | "nestedSurprise"
  | "mobileTrap"
  | "silentReveal";

const requiredHiddenGoodCopy: Record<RequiredHiddenGoodMode, string> = {
  requirementMap: "Requirement map shows which trigger makes evidence required before submit.",
  triggerSelected: "Trigger selected reveals the required evidence reference directly below the selected answer.",
  triggerCleared: "Trigger cleared removes the evidence requirement, value, error, and review row.",
  submitRecovery: "Submit recovery opens the branch, preserves the trigger, and links the error summary to the visible field.",
  serverRestored: "Server restored returns backend conditional errors with branch context so the UI can reveal the field.",
  draftSynced: "Draft synced restores the selected trigger and required field together instead of restoring one without the other.",
  reviewBranch: "Review branch sends users to the newly required evidence question before final submit.",
  nestedEscalated: "Nested escalated moves several required branch questions to a separate page instead of hiding them locally.",
  assistiveNotice: "Assistive notice announces that a required follow-up appeared after the selected answer.",
  mobileCollapsed: "Mobile collapsed shows a section error and opens the panel before focusing the missing field."
};

const requiredHiddenBadCopy: Record<RequiredHiddenBadMode, string> = {
  hiddenBlocker: "Hidden blocker: submit fails because Evidence reference is required but the field is invisible.",
  staleTrigger: "Stale trigger: an old draft keeps the accommodation branch required after No accommodation is selected.",
  disabledRequired: "Disabled required: a disabled evidence field is still counted as required.",
  deadLink: "Dead link: the error summary points to a hidden or missing target.",
  serverOnly: "Server-only: backend validation requires a field the UI never exposed.",
  afterSubmitReveal: "After-submit reveal: users only learn about the required branch after final submit fails.",
  nestedSurprise: "Nested surprise: a local reveal hides several required questions and no branch progress.",
  mobileTrap: "Mobile trap: the missing required field sits inside a closed mobile panel with no section error.",
  silentReveal: "Silent reveal: a required field appears visually, but keyboard and screen reader users are not notified."
};

function RequiredHiddenGoodUi() {
  return (
    <div className="quality-example required-hidden-static">
      <section className="required-hidden-form" aria-label="Benefits eligibility form">
        <div className="required-hidden-map">
          <strong>Active requirement map</strong>
          <span>Accommodation request equals Needs accommodation, so Evidence reference is required.</span>
        </div>
        <fieldset className="required-hidden-options">
          <legend>Accommodation request</legend>
          <label><input type="radio" name="required-hidden-ui" /> No accommodation</label>
          <label><input type="radio" name="required-hidden-ui" defaultChecked /> Needs accommodation</label>
          <label className="required-hidden-field" htmlFor="required-hidden-good-ui-evidence">
            <span>Evidence reference <em>Required because Needs accommodation is selected</em></span>
            <input id="required-hidden-good-ui-evidence" value="EV-4412" readOnly />
          </label>
        </fieldset>
      </section>
      <p className="demo-status">The required field is visible next to its trigger, and the rule explains why it is required.</p>
    </div>
  );
}

function RequiredHiddenBadUi() {
  return (
    <div className="bad-ui-sample required-hidden-static bad">
      <section className="required-hidden-bad-panel" aria-label="Broken hidden required form">
        <strong>Submit blocked</strong>
        <span>Evidence reference is required by conditional logic, but the field is hidden and the trigger is not shown.</span>
        <button type="button">Submit application</button>
        <div className="required-hidden-ghost" aria-hidden="true">Hidden required input: Evidence reference</div>
      </section>
      <p className="demo-status">The broken form validates an invisible field and gives users no visible recovery route.</p>
    </div>
  );
}

function RequiredHiddenGoodPanel({ mode }: { mode: RequiredHiddenGoodMode }) {
  const isError = mode === "submitRecovery" || mode === "serverRestored" || mode === "mobileCollapsed";
  const isCleared = mode === "triggerCleared";
  const isEscalated = mode === "nestedEscalated" || mode === "reviewBranch";

  return (
    <section className={`required-hidden-form is-${mode}`} aria-label="Required branch validation state">
      <div className={isError ? "required-hidden-error-summary" : "required-hidden-map"}>
        <strong>{isError ? "Fix the visible required field" : isEscalated ? "Route required branch before submit" : "Active requirement map"}</strong>
        <span>{requiredHiddenGoodCopy[mode]}</span>
        {isError && <a href="#required-hidden-good-evidence">Enter evidence reference</a>}
      </div>
      <fieldset className="required-hidden-options">
        <legend>Accommodation request</legend>
        <label><input type="radio" name="required-hidden-good" checked={isCleared} readOnly /> No accommodation</label>
        <label><input type="radio" name="required-hidden-good" checked={!isCleared} readOnly /> Needs accommodation</label>
        {!isCleared && !isEscalated && (
          <label className={isError ? "required-hidden-field has-error" : "required-hidden-field"} htmlFor="required-hidden-good-evidence">
            <span>Evidence reference <em>Required because Needs accommodation is selected</em></span>
            {isError && <strong id="required-hidden-good-evidence-error">Enter evidence reference.</strong>}
            <input
              id="required-hidden-good-evidence"
              value={mode === "draftSynced" ? "Draft EV-1188" : mode === "triggerSelected" ? "" : "EV-4412"}
              readOnly
              aria-invalid={isError ? true : undefined}
              aria-describedby={isError ? "required-hidden-good-evidence-error required-hidden-good-evidence-help" : "required-hidden-good-evidence-help"}
            />
            <small id="required-hidden-good-evidence-help">This field is active only while Needs accommodation is selected.</small>
          </label>
        )}
        {isEscalated && (
          <div className="required-hidden-route">
            <strong>{mode === "reviewBranch" ? "New required question before final submit" : "Branch moved to its own page"}</strong>
            <span>{mode === "reviewBranch" ? "Review change created a required evidence answer." : "Several accommodation questions need a focused step."}</span>
            <button type="button" className="demo-button small primary">Continue to evidence question</button>
          </div>
        )}
      </fieldset>
      <div className="required-hidden-branch-status">
        <span>Trigger visible</span>
        <span>{isCleared ? "Hidden branch excluded" : "Required branch visible"}</span>
        <span>Error target recoverable</span>
      </div>
    </section>
  );
}

function RequiredHiddenGoodUx() {
  const [mode, setMode] = useState<RequiredHiddenGoodMode>("requirementMap");

  return (
    <div className="quality-example required-hidden-demo">
      <RequiredHiddenGoodPanel mode={mode} />
      <div className="demo-row required-hidden-controls">
        {(Object.keys(requiredHiddenGoodCopy) as RequiredHiddenGoodMode[]).map((key) => (
          <button
            key={key}
            type="button"
            className={mode === key ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(key)}
          >
            {{
              requirementMap: "Requirement map",
              triggerSelected: "Trigger selected",
              triggerCleared: "Trigger cleared",
              submitRecovery: "Submit recovery",
              serverRestored: "Server restored",
              draftSynced: "Draft synced",
              reviewBranch: "Review branch",
              nestedEscalated: "Nested escalated",
              assistiveNotice: "Assistive notice",
              mobileCollapsed: "Mobile collapsed"
            }[key]}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">{requiredHiddenGoodCopy[mode]}</p>
    </div>
  );
}

function RequiredHiddenBadPanel({ mode }: { mode: RequiredHiddenBadMode }) {
  return (
    <section className={`required-hidden-bad-panel is-${mode}`} aria-label="Hidden required field failure">
      <strong>
        {mode === "serverOnly"
          ? "Backend-only requirement"
          : mode === "mobileTrap"
            ? "Closed mobile section"
            : "Invisible validation blocker"}
      </strong>
      <span>{requiredHiddenBadCopy[mode]}</span>
      {mode === "deadLink" ? (
        <div className="required-hidden-error-summary bad">
          <strong>There is a problem</strong>
          <a href="#missing-hidden-evidence">Evidence reference is required</a>
        </div>
      ) : mode === "disabledRequired" ? (
        <label className="required-hidden-field bad">
          <span>Evidence reference <em>Required</em></span>
          <input value="" disabled />
        </label>
      ) : mode === "nestedSurprise" ? (
        <div className="required-hidden-nested">
          <span>Accommodation details</span>
          <span>Evidence reference</span>
          <span>Reviewer contact</span>
        </div>
      ) : (
        <button type="button">Submit application</button>
      )}
      <div className="required-hidden-ghost" aria-hidden="true">Hidden required input stays active</div>
    </section>
  );
}

function RequiredHiddenBadUx() {
  const [mode, setMode] = useState<RequiredHiddenBadMode>("hiddenBlocker");

  return (
    <div className={`quality-example required-hidden-bad-demo is-${mode}`}>
      <RequiredHiddenBadPanel mode={mode} />
      <div className="demo-row required-hidden-controls">
        {(Object.keys(requiredHiddenBadCopy) as RequiredHiddenBadMode[]).map((key) => (
          <button
            key={key}
            type="button"
            className={mode === key ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(key)}
          >
            {{
              hiddenBlocker: "Hidden blocker",
              staleTrigger: "Stale trigger",
              disabledRequired: "Disabled required",
              deadLink: "Dead link",
              serverOnly: "Server-only",
              afterSubmitReveal: "After-submit reveal",
              nestedSurprise: "Nested surprise",
              mobileTrap: "Mobile trap",
              silentReveal: "Silent reveal"
            }[key]}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">{requiredHiddenBadCopy[mode]}</p>
    </div>
  );
}

type ValidationClearsGoodMode =
  | "preservedInvalid"
  | "siblingKept"
  | "serverRehydrated"
  | "retrySameValue"
  | "rawPreserved"
  | "textareaDraft"
  | "uploadNamesKept"
  | "sessionReturn"
  | "sensitiveException"
  | "resetSeparate";

type ValidationClearsBadMode =
  | "fullReset"
  | "fieldWipe"
  | "siblingLoss"
  | "serverBlank"
  | "formatterLoss"
  | "textareaLoss"
  | "uploadLoss"
  | "sessionLoss"
  | "overbroadSecretClear";

const validationClearsGoodCopy: Record<ValidationClearsGoodMode, string> = {
  preservedInvalid: "Preserved invalid value keeps maya@@example visible so one character can be fixed.",
  siblingKept: "Sibling fields kept means phone, statement, and selected options survive the email error.",
  serverRehydrated: "Server validation rehydrated the submitted payload before focusing the error summary.",
  retrySameValue: "Retry same value sends the preserved local statement again instead of a blank default.",
  rawPreserved: "Raw value preserved keeps the pasted account number while explaining the accepted format.",
  textareaDraft: "Textarea draft keeps long over-limit text and marks the excess instead of deleting it.",
  uploadNamesKept: "Upload names kept preserves accepted files while explaining only the rejected file.",
  sessionReturn: "Session return restores safe local fields after reauthentication.",
  sensitiveException: "Sensitive exception clears only the password and explains why other fields remain.",
  resetSeparate: "Reset separate is a deliberate action distinct from Submit and validation."
};

const validationClearsBadCopy: Record<ValidationClearsBadMode, string> = {
  fullReset: "Full reset: one validation error returns every field to blank defaults.",
  fieldWipe: "Field wipe: the invalid email field is emptied, so the user must retype from memory.",
  siblingLoss: "Sibling loss: phone and statement are cleared even though only email failed.",
  serverBlank: "Server blank: server validation rebuilt the form from defaults instead of submitted values.",
  formatterLoss: "Formatter loss: parsing failed and deleted the raw pasted number.",
  textareaLoss: "Textarea loss: an over-limit error replaced the long draft with an empty field.",
  uploadLoss: "Upload loss: one rejected file cleared all selected filenames.",
  sessionLoss: "Session loss: reauthentication returns to a blank application form.",
  overbroadSecretClear: "Overbroad secret clear: password-clearing rules wiped ordinary profile fields too."
};

function ValidationClearsGoodUi() {
  return (
    <div className="quality-example validation-clears-static">
      <section className="validation-clears-form" aria-label="Grant application validation">
        <div className="validation-clears-summary">
          <strong>There is a problem</strong>
          <a href="#validation-clears-good-email">Enter an email address in the correct format</a>
        </div>
        <label className="validation-clears-field has-error" htmlFor="validation-clears-good-email">
          <span>Email <em>Preserved after validation</em></span>
          <strong id="validation-clears-good-email-error">Enter an email address in the correct format.</strong>
          <input id="validation-clears-good-email" value="maya@@example" readOnly aria-invalid="true" aria-describedby="validation-clears-good-email-error" />
        </label>
        <label className="validation-clears-field" htmlFor="validation-clears-good-phone">
          <span>Phone</span>
          <input id="validation-clears-good-phone" value="+44 20 7946 0958" readOnly />
        </label>
      </section>
      <p className="demo-status">Validation preserves the failing value and the valid sibling field for direct correction.</p>
    </div>
  );
}

function ValidationClearsBadUi() {
  return (
    <div className="bad-ui-sample validation-clears-static bad">
      <section className="validation-clears-bad-panel" aria-label="Broken validation form">
        <strong>Invalid email</strong>
        <span>The form reloaded from blank defaults after validation failed.</span>
        <input name="validation-clears-bad-email" aria-label="Email cleared by validation" value="" readOnly />
        <input name="validation-clears-bad-phone" aria-label="Phone also cleared" value="" readOnly />
        <button type="button">Submit again</button>
      </section>
      <p className="demo-status">The broken treatment turns a one-field correction into full re-entry.</p>
    </div>
  );
}

function ValidationClearsGoodPanel({ mode }: { mode: ValidationClearsGoodMode }) {
  const isSensitive = mode === "sensitiveException";
  const isReset = mode === "resetSeparate";

  return (
    <section className={`validation-clears-form is-${mode}`} aria-label="Preserved validation state">
      <div className={mode === "serverRehydrated" ? "validation-clears-summary" : "validation-clears-preserve-note"}>
        <strong>{mode === "serverRehydrated" ? "Server returned field errors" : isSensitive ? "Only sensitive value cleared" : isReset ? "Reset is separate" : "Values preserved"}</strong>
        <span>{validationClearsGoodCopy[mode]}</span>
        {mode === "serverRehydrated" && <a href="#validation-clears-email">Fix email address</a>}
      </div>
      <div className="validation-clears-grid">
        <label className={mode === "preservedInvalid" || mode === "serverRehydrated" ? "validation-clears-field has-error" : "validation-clears-field"} htmlFor="validation-clears-email">
          <span>Email <em>{mode === "preservedInvalid" ? "Invalid but preserved" : "Safe field"}</em></span>
          {(mode === "preservedInvalid" || mode === "serverRehydrated") && <strong id="validation-clears-email-error">Use one @ symbol and a domain.</strong>}
          <input
            id="validation-clears-email"
            value={isSensitive ? "maya@example.com" : "maya@@example"}
            readOnly
            aria-invalid={mode === "preservedInvalid" || mode === "serverRehydrated" ? true : undefined}
            aria-describedby={mode === "preservedInvalid" || mode === "serverRehydrated" ? "validation-clears-email-error" : undefined}
          />
        </label>
        <label className="validation-clears-field" htmlFor="validation-clears-phone">
          <span>Phone</span>
          <input id="validation-clears-phone" value="+44 20 7946 0958" readOnly />
        </label>
        <label className="validation-clears-field wide" htmlFor="validation-clears-statement">
          <span>Impact statement <em>{mode === "textareaDraft" ? "214 characters over limit" : "Draft preserved"}</em></span>
          <textarea
            id="validation-clears-statement"
            value={mode === "textareaDraft" ? "This programme serves 38 families across three districts. The draft is over the limit, but the text is still here so the applicant can trim the strongest points instead of starting again." : "This programme serves 38 families across three districts."}
            readOnly
          />
        </label>
        {mode === "rawPreserved" && <div className="validation-clears-token">Raw account value preserved: 12 34 56 78901234</div>}
        {mode === "uploadNamesKept" && <div className="validation-clears-token">Files kept: budget.pdf, evidence-letter.pdf; rejected: script.exe</div>}
        {mode === "sessionReturn" && <div className="validation-clears-token">Restored after sign-in: local draft from 10:42</div>}
        {isSensitive && <div className="validation-clears-token warning">Password cleared for security; email, phone, and statement stayed.</div>}
        {isReset && <button type="button" className="demo-button small">Reset form deliberately</button>}
      </div>
    </section>
  );
}

function ValidationClearsGoodUx() {
  const [mode, setMode] = useState<ValidationClearsGoodMode>("preservedInvalid");

  return (
    <div className="quality-example validation-clears-demo">
      <ValidationClearsGoodPanel mode={mode} />
      <div className="demo-row validation-clears-controls">
        {(Object.keys(validationClearsGoodCopy) as ValidationClearsGoodMode[]).map((key) => (
          <button
            key={key}
            type="button"
            className={mode === key ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(key)}
          >
            {{
              preservedInvalid: "Preserved invalid",
              siblingKept: "Sibling fields kept",
            serverRehydrated: "Server validation rehydrated",
              retrySameValue: "Retry same value",
              rawPreserved: "Raw value preserved",
              textareaDraft: "Textarea draft",
              uploadNamesKept: "Upload names kept",
              sessionReturn: "Session return",
              sensitiveException: "Sensitive exception",
              resetSeparate: "Reset separate"
            }[key]}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">{validationClearsGoodCopy[mode]}</p>
    </div>
  );
}

function ValidationClearsBadPanel({ mode }: { mode: ValidationClearsBadMode }) {
  return (
    <section className={`validation-clears-bad-panel is-${mode}`} aria-label="Validation data loss failure">
      <strong>
        {mode === "serverBlank"
          ? "Server returned blank defaults"
          : mode === "uploadLoss"
            ? "Selected files vanished"
            : "Validation erased input"}
      </strong>
      <span>{validationClearsBadCopy[mode]}</span>
      {mode === "textareaLoss" ? (
        <textarea name="validation-clears-lost-statement" value="" readOnly aria-label="Statement cleared by validation" />
      ) : mode === "uploadLoss" ? (
        <div className="validation-clears-lost-files">
          <span>budget.pdf removed</span>
          <span>evidence-letter.pdf removed</span>
          <span>script.exe rejected</span>
        </div>
      ) : (
        <div className="validation-clears-blank-fields">
          <input name="validation-clears-lost-email" aria-label="Email blank after validation" value={mode === "siblingLoss" ? "maya@@example" : ""} readOnly />
          <input name="validation-clears-lost-phone" aria-label="Phone blank after validation" value="" readOnly />
          <input name="validation-clears-lost-statement-field" aria-label="Statement blank after validation" value="" readOnly />
        </div>
      )}
      <button type="button">Try again</button>
    </section>
  );
}

function ValidationClearsBadUx() {
  const [mode, setMode] = useState<ValidationClearsBadMode>("fullReset");

  return (
    <div className={`quality-example validation-clears-bad-demo is-${mode}`}>
      <ValidationClearsBadPanel mode={mode} />
      <div className="demo-row validation-clears-controls">
        {(Object.keys(validationClearsBadCopy) as ValidationClearsBadMode[]).map((key) => (
          <button
            key={key}
            type="button"
            className={mode === key ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(key)}
          >
            {{
              fullReset: "Full reset",
              fieldWipe: "Field wipe",
              siblingLoss: "Sibling loss",
              serverBlank: "Server blank",
              formatterLoss: "Formatter loss",
              textareaLoss: "Textarea loss",
              uploadLoss: "Upload loss",
              sessionLoss: "Session loss",
              overbroadSecretClear: "Overbroad secret clear"
            }[key]}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">{validationClearsBadCopy[mode]}</p>
    </div>
  );
}

type RevealChoice = "email" | "phone" | "none";

type RevealMode = "ready" | "revealed" | "hidden" | "error" | "submitted";

function ConditionalRevealFieldsGoodUx({ meta }: { meta: PatternMeta }) {
  const [choice, setChoice] = useState<RevealChoice>("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState<RevealMode>("revealed");
  const [message, setMessage] = useState("Email selected. The related Email address field is revealed directly under the option.");

  const choose = (nextChoice: RevealChoice) => {
    setChoice(nextChoice);
    if (nextChoice === "email") {
      setPhone("");
      setMode("revealed");
      setMessage("Email selected. Phone value cleared and Email address is now the only required follow-up.");
      return;
    }
    if (nextChoice === "phone") {
      setEmail("");
      setMode("revealed");
      setMessage("Phone selected. Email value cleared and Phone number is now the only required follow-up.");
      return;
    }
    setEmail("");
    setPhone("");
    setMode("hidden");
    setMessage("No contact selected. Conditional follow-up fields are hidden and excluded from submission.");
  };

  const submit = () => {
    if (choice === "email" && !email.trim()) {
      setMode("error");
      setMessage("Enter Email address because Email is selected.");
      return;
    }
    if (choice === "phone" && !phone.trim()) {
      setMode("error");
      setMessage("Enter Phone number because Phone is selected.");
      return;
    }
    setMode("submitted");
    setMessage(choice === "none" ? "Submitted No contact with no hidden follow-up values." : `Submitted ${choice} follow-up only.`);
  };

  const revealTitle = choice === "email" ? "Email address" : "Phone number";
  const activeValue = choice === "email" ? email : phone;
  const hasError = mode === "error";

  return (
    <div className="quality-example conditional-reveal-demo">
      <div className={`conditional-reveal-status is-${mode}`} role={hasError ? "alert" : "status"} aria-live="polite">
        <strong>{hasError ? "Revealed field needs an answer" : choice === "none" ? "No follow-up active" : `${revealTitle} revealed`}</strong>
        <span>{message}</span>
      </div>
      <fieldset className="conditional-reveal-options">
        <legend>{meta.field}</legend>
        <label className="conditional-reveal-option">
          <input type="radio" name="contact-method" checked={choice === "email"} onChange={() => choose("email")} />
          <span>{meta.options[0]}</span>
        </label>
        {choice === "email" && (
          <label className={hasError ? "conditional-reveal-panel has-error" : "conditional-reveal-panel"} htmlFor="conditional-email">
            <span>Email address</span>
            {hasError && <strong id="conditional-email-error">Enter an email address.</strong>}
            <input
              id="conditional-email"
              value={email}
              aria-invalid={hasError ? true : undefined}
              aria-describedby={hasError ? "conditional-email-help conditional-email-error" : "conditional-email-help"}
              onChange={(event) => {
                setEmail(event.target.value);
                setMode("ready");
                setMessage("Email address is in the active revealed field.");
              }}
            />
            <small id="conditional-email-help">Shown because Email is selected; hidden phone values are cleared.</small>
          </label>
        )}
        <label className="conditional-reveal-option">
          <input type="radio" name="contact-method" checked={choice === "phone"} onChange={() => choose("phone")} />
          <span>{meta.options[1]}</span>
        </label>
        {choice === "phone" && (
          <label className={hasError ? "conditional-reveal-panel has-error" : "conditional-reveal-panel"} htmlFor="conditional-phone">
            <span>Phone number</span>
            {hasError && <strong id="conditional-phone-error">Enter a phone number.</strong>}
            <input
              id="conditional-phone"
              value={phone}
              aria-invalid={hasError ? true : undefined}
              aria-describedby={hasError ? "conditional-phone-help conditional-phone-error" : "conditional-phone-help"}
              onChange={(event) => {
                setPhone(event.target.value);
                setMode("ready");
                setMessage("Phone number is in the active revealed field.");
              }}
            />
            <small id="conditional-phone-help">Shown because Phone is selected; hidden email values are cleared.</small>
          </label>
        )}
        <label className="conditional-reveal-option">
          <input type="radio" name="contact-method" checked={choice === "none"} onChange={() => choose("none")} />
          <span>{meta.options[2]}</span>
        </label>
      </fieldset>
      <div className="demo-row conditional-reveal-actions">
        <button type="button" className="demo-button small" onClick={() => choose("email")}>Reveal email</button>
        <button type="button" className="demo-button small" onClick={() => choose("phone")}>Reveal phone</button>
        <button type="button" className="demo-button small" onClick={() => choose("none")}>Hide follow-up</button>
        <button type="button" className="demo-button small primary" onClick={submit}>Submit choice</button>
      </div>
      <p className="demo-status" aria-live="polite">
        Active value: {choice === "none" ? "none" : activeValue || `${revealTitle} is empty`}
      </p>
    </div>
  );
}

function ConditionalRevealFieldsBadUx({ meta }: { meta: PatternMeta }) {
  const [choice, setChoice] = useState<RevealChoice>("none");
  const [hiddenEmail, setHiddenEmail] = useState("old@example.com");
  const [message, setMessage] = useState("No contact is selected, but a hidden email field still has a stale value.");

  return (
    <div className="quality-example conditional-reveal-demo">
      <div className="conditional-reveal-bad-ui">
        <label>
          <span>{meta.field}</span>
          <select
            value={choice}
            onChange={(event) => {
              setChoice(event.target.value as RevealChoice);
              setMessage(`${event.target.value} selected, but the hidden email value was kept.`);
            }}
          >
            <option value="email">{meta.options[0]}</option>
            <option value="phone">{meta.options[1]}</option>
            <option value="none">{meta.options[2]}</option>
          </select>
        </label>
        <label className="conditional-reveal-hidden-field">
          <span>Hidden required email</span>
          <input value={hiddenEmail} onChange={(event) => setHiddenEmail(event.target.value)} />
          <small>This field is visually hidden in the product but still validates and submits.</small>
        </label>
        <div className="demo-row conditional-reveal-actions">
          <button
            type="button"
            className="demo-button small"
            onClick={() => {
              setChoice("none");
              setMessage("The question is hidden, but old@example.com remains in the payload.");
            }}
          >
            Hide question
          </button>
          <button
            type="button"
            className="demo-button small primary"
            onClick={() => setMessage(`Submitted ${choice} with hidden email value: ${hiddenEmail || "blank required field"}.`)}
          >
            Submit stale value
          </button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

type InputMaskMode = "ready" | "pasted" | "invalid" | "error" | "submitted" | "cleared";

function formatContainerReference(raw: string) {
  const value = raw.toUpperCase();
  let letters = "";
  let digits = "";
  let ignored = 0;

  for (const char of value.replace(/\s+/g, "")) {
    if (letters.length < 4) {
      if (/[A-Z]/.test(char)) {
        letters += char;
      } else if (/[0-9]/.test(char)) {
        ignored += 1;
      } else {
        ignored += 1;
      }
      continue;
    }
    if (digits.length < 7 && /[0-9]/.test(char)) {
      digits += char;
    } else if (!/[ -]/.test(char)) {
      ignored += 1;
    }
  }

  const serial = digits.slice(0, 6);
  const checkDigit = digits.slice(6, 7);
  const parts = [letters, serial, checkDigit].filter(Boolean);
  const missingLetters = Math.max(0, 4 - letters.length);
  const missingDigits = Math.max(0, 7 - digits.length);

  return {
    display: parts.join(" "),
    canonical: `${letters}${digits}`,
    ignored,
    isComplete: letters.length === 4 && digits.length === 7,
    missing: missingLetters > 0 ? `${missingLetters} letter${missingLetters === 1 ? "" : "s"}` : `${missingDigits} digit${missingDigits === 1 ? "" : "s"}`
  };
}

function InputMaskGoodUx({ meta }: { meta: PatternMeta }) {
  const [displayValue, setDisplayValue] = useState("ABCD 123456 7");
  const [mode, setMode] = useState<InputMaskMode>("ready");
  const [message, setMessage] = useState("The mask groups the typed value and preserves a canonical stored value.");
  const formatted = formatContainerReference(displayValue);

  const updateValue = (raw: string, nextMode: InputMaskMode = "ready") => {
    const next = formatContainerReference(raw);
    setDisplayValue(next.display);
    setMode(next.ignored > 0 ? "invalid" : nextMode);
    if (next.ignored > 0) {
      setMessage(`${next.ignored} unsupported character${next.ignored === 1 ? "" : "s"} ignored; letters must come before seven digits.`);
      return;
    }
    if (!next.display) {
      setMessage("Mask cleared. Format guidance remains visible before entry.");
      setMode("cleared");
      return;
    }
    setMessage(next.isComplete ? "Value is fully grouped and ready to submit." : `Partial value preserved; missing ${next.missing}.`);
  };

  const submit = () => {
    if (!formatted.isComplete) {
      setMode("error");
      setMessage(`Enter a complete container reference; missing ${formatted.missing}.`);
      return;
    }
    setMode("submitted");
    setMessage(`Submitted formatted value ${formatted.display}; stored as ${formatted.canonical}.`);
  };

  const hasError = mode === "error";

  return (
    <div className="quality-example input-mask-demo">
      <div className={`input-mask-status is-${mode}`} role={hasError ? "alert" : "status"} aria-live="polite">
        <strong>{hasError ? "Mask incomplete" : mode === "invalid" ? "Unsupported characters ignored" : "Container mask active"}</strong>
        <span>{message}</span>
      </div>
      <label className={hasError ? "input-mask-field has-error" : "input-mask-field"} htmlFor="input-mask-container">
        <span>{meta.field}</span>
        <input
          id="input-mask-container"
          value={displayValue}
          inputMode="text"
          autoCapitalize="characters"
          spellCheck={false}
          aria-invalid={hasError ? true : undefined}
          aria-describedby={hasError ? "input-mask-help input-mask-raw input-mask-error" : "input-mask-help input-mask-raw"}
          onChange={(event) => updateValue(event.target.value)}
        />
        <small id="input-mask-help">Format: 4 letters, 6 digits, 1 check digit. Separators are added for review.</small>
        {hasError && <strong id="input-mask-error">Enter four letters followed by seven digits.</strong>}
      </label>
      <div className="input-mask-canonical" id="input-mask-raw">
        <span>Display value</span>
        <strong>{formatted.display || "empty"}</strong>
        <span>Canonical stored value</span>
        <strong>{formatted.canonical || "empty"}</strong>
      </div>
      <div className="demo-row input-mask-actions">
        <button type="button" className="demo-button small" onClick={() => updateValue("abcd1234567", "pasted")}>Paste compact</button>
        <button type="button" className="demo-button small" onClick={() => updateValue("ABCD 123456 7", "pasted")}>Paste formatted</button>
        <button type="button" className="demo-button small" onClick={() => updateValue("ABCD 123", "ready")}>Make incomplete</button>
        <button type="button" className="demo-button small" onClick={() => updateValue("AB$D-12X34567", "invalid")}>Try invalid chars</button>
        <button type="button" className="demo-button small" onClick={() => updateValue("", "cleared")}>Clear mask</button>
        <button type="button" className="demo-button small primary" onClick={submit}>Submit reference</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function InputMaskBadUx({ meta }: { meta: PatternMeta }) {
  const [phone, setPhone] = useState("(___) ___-____");
  const [message, setMessage] = useState("The mask starts with placeholders but gives no persistent format or exception guidance.");

  return (
    <div className="quality-example input-mask-demo">
      <div className="input-mask-bad-ui">
        <label>
          <span>Phone number</span>
          <input
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              setMessage("The field accepts placeholder noise and gives no canonical value.");
            }}
            aria-label={`${meta.options[2]} in a rigid domestic mask`}
          />
        </label>
        <div className="demo-row input-mask-actions">
          <button
            type="button"
            className="demo-button small"
            onClick={() => {
              setPhone("(___) ___-____");
              setMessage(`Rejected pasted value ${meta.options[2]} because it does not fit a domestic mask.`);
            }}
          >
            Paste international
          </button>
          <button
            type="button"
            className="demo-button small primary"
            onClick={() => setMessage(`Submitted ${phone} without saying which characters are data and which are placeholders.`)}
          >
            Submit
          </button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

type AffixMode = "currency" | "percent";

type AffixStatus = "ready" | "normalized" | "error" | "submitted" | "switched";

function parseAffixValue(raw: string, mode: AffixMode) {
  const unitWordPattern = mode === "currency" ? /\b(dollars?|usd)\b/i : /\b(percent|percentage)\b/i;
  const normalized = raw
    .trim()
    .replace(/,/g, "")
    .replace(/\$/g, "")
    .replace(/%/g, "")
    .replace(/\b(dollars?|usd|percent|percentage)\b/gi, "")
    .trim();
  const numeric = Number(normalized);
  const duplicateAffix = raw.includes("$") || raw.includes("%") || unitWordPattern.test(raw);
  return {
    clean: normalized,
    duplicateAffix,
    isValid: normalized.length > 0 && Number.isFinite(numeric) && numeric > 0,
    numeric
  };
}

function InputPrefixSuffixGoodUx({ meta }: { meta: PatternMeta }) {
  const [mode, setMode] = useState<AffixMode>("currency");
  const [value, setValue] = useState("1250");
  const [status, setStatus] = useState<AffixStatus>("ready");
  const [message, setMessage] = useState("Dollar prefix is visible, but only the numeric value is editable and stored.");
  const parsed = parseAffixValue(value, mode);
  const unit = mode === "currency" ? "USD" : "percent";
  const label = mode === "currency" ? "Adjustment amount in dollars" : "Discount rate in percent";
  const hasError = status === "error";

  const updateValue = (raw: string) => {
    const parsedNext = parseAffixValue(raw, mode);
    setValue(parsedNext.clean);
    if (parsedNext.duplicateAffix) {
      setStatus("normalized");
      setMessage(`${mode === "currency" ? "Currency symbol" : "Percent sign"} removed from the typed value; the affix already supplies it.`);
      return;
    }
    setStatus("ready");
    setMessage(parsedNext.clean ? `Clean ${unit} value is ${parsedNext.clean}.` : "Enter the value only; the affix remains outside the input.");
  };

  const switchMode = (nextMode: AffixMode) => {
    setMode(nextMode);
    setStatus("switched");
    setMessage(nextMode === "currency" ? "Switched to dollar prefix; label and payload unit updated." : "Switched to percent suffix; label and payload unit updated.");
  };

  const submit = () => {
    const latest = parseAffixValue(value, mode);
    if (!latest.isValid) {
      setStatus("error");
      setMessage(`Enter a ${mode === "currency" ? "dollar amount" : "percentage"} greater than zero.`);
      return;
    }
    setStatus("submitted");
    setMessage(`Submitted clean value ${latest.clean} with unit ${unit}; visible affix was not stored in the value.`);
  };

  return (
    <div className="quality-example input-affix-demo">
      <div className={`input-affix-status is-${status}`} role={hasError ? "alert" : "status"} aria-live="polite">
        <strong>{hasError ? "Affixed input needs a value" : status === "normalized" ? "Duplicate affix normalized" : "Affix outside value"}</strong>
        <span>{message}</span>
      </div>
      <label className={hasError ? "input-affix-field has-error" : "input-affix-field"} htmlFor="input-affix-good">
        <span>{label}</span>
        <div className="input-affix-control">
          {mode === "currency" && <span className="input-affix-token" aria-hidden="true">$</span>}
          <input
            id="input-affix-good"
            value={value}
            inputMode="decimal"
            aria-invalid={hasError ? true : undefined}
            aria-describedby={hasError ? "input-affix-help input-affix-payload input-affix-error" : "input-affix-help input-affix-payload"}
            onChange={(event) => updateValue(event.target.value)}
          />
          {mode === "percent" && <span className="input-affix-token" aria-hidden="true">%</span>}
        </div>
        <small id="input-affix-help">
          {mode === "currency"
            ? "Enter the amount only. The dollar prefix is visible but not submitted as part of the value."
            : "Enter the number only. The percent suffix is visible but not submitted as part of the value."}
        </small>
        {hasError && <strong id="input-affix-error">Enter a positive {mode === "currency" ? "dollar amount" : "percentage"}.</strong>}
      </label>
      <div className="input-affix-payload" id="input-affix-payload">
        <span>Typed value</span>
        <strong>{value || "empty"}</strong>
        <span>Payload</span>
        <strong>{parsed.isValid ? `${parsed.clean} ${unit}` : `unit: ${unit}`}</strong>
      </div>
      <div className="demo-row input-affix-actions">
        <button type="button" className="demo-button small" onClick={() => updateValue(meta.options[0])}>Type $1,250</button>
        <button type="button" className="demo-button small" onClick={() => updateValue(meta.options[2])}>Type 12%</button>
        <button type="button" className="demo-button small" onClick={() => switchMode("currency")}>Dollar prefix</button>
        <button type="button" className="demo-button small" onClick={() => switchMode("percent")}>Percent suffix</button>
        <button type="button" className="demo-button small" onClick={() => updateValue("")}>Clear</button>
        <button type="button" className="demo-button small primary" onClick={submit}>Submit value</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function InputPrefixSuffixBadUx({ meta }: { meta: PatternMeta }) {
  const [value, setValue] = useState("$1,250");
  const [message, setMessage] = useState("The label says Amount, so the visible dollar prefix is the only unit cue.");

  return (
    <div className="quality-example input-affix-demo">
      <div className="input-affix-bad-ui">
        <label>
          <span>Amount</span>
          <div className="input-affix-control bad">
            <span className="input-affix-token">$</span>
            <input value={value} onChange={(event) => setValue(event.target.value)} aria-label={`${meta.field} with duplicated symbol`} />
            <span className="input-affix-token">USD</span>
          </div>
        </label>
        <div className="demo-row input-affix-actions">
          <button
            type="button"
            className="demo-button small"
            onClick={() => {
              setValue("$1,250 USD");
              setMessage("The UI let the user type both visible affixes into the submitted string.");
            }}
          >
            Duplicate affix
          </button>
          <button
            type="button"
            className="demo-button small primary"
            onClick={() => setMessage(`Submitted raw value ${value}; backend must guess which characters are value and which are decoration.`)}
          >
            Submit raw
          </button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function TextInputGoodUx({ meta }: { meta: PatternMeta }) {
  const [value, setValue] = useState("Appeal draft");
  const [submitted, setSubmitted] = useState(false);
  const [readonly, setReadonly] = useState(false);
  const [message, setMessage] = useState("The label and hint stay visible while the user edits the short answer.");
  const trimmed = value.trim();
  const hasError = submitted && trimmed.length === 0;
  const isLong = trimmed.length > 28;

  const submit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setSubmitted(true);
    if (!trimmed) {
      setMessage("Enter a reference name before continuing. The blank field keeps focusable recovery.");
      return;
    }
    setMessage(`Saved exactly as typed: "${value}".`);
  };

  return (
    <form className="quality-example text-input-demo" onSubmit={submit}>
      <label className={hasError ? "text-input-field has-error" : "text-input-field"}>
        <span>{meta.field}</span>
        <small id="text-input-good-hint">Use a short label, for example Appeal draft.</small>
        {hasError && <strong id="text-input-good-error">Enter a reference name</strong>}
        <input
          aria-describedby={hasError ? "text-input-good-hint text-input-good-error" : "text-input-good-hint"}
          aria-invalid={hasError || undefined}
          readOnly={readonly}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            if (submitted) setMessage("Updated value is preserved while the error state is recalculated.");
          }}
        />
      </label>
      <div className="text-input-status-grid">
        <div>
          <span>Expected length</span>
          <strong>{isLong ? "Looks long for one line" : "Short answer"}</strong>
        </div>
        <div>
          <span>Editable state</span>
          <strong>{readonly ? "Readonly preview" : "Editable"}</strong>
        </div>
      </div>
      <div className="demo-row text-input-actions">
        <button type="submit" className="demo-button small primary">Submit</button>
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            setValue("Renewal note pasted from email");
            setSubmitted(false);
            setReadonly(false);
            setMessage("Pasted text is preserved and reviewable before submit.");
          }}
        >
          Paste answer
        </button>
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            setValue("");
            setSubmitted(true);
            setReadonly(false);
            setMessage("Required validation appears after attempted submit, not before entry.");
          }}
        >
          Empty then validate
        </button>
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            setValue("Appeal draft");
            setSubmitted(false);
            setReadonly(false);
            setMessage("Valid sample restored without losing the label or hint.");
          }}
        >
          Restore valid
        </button>
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            setReadonly((current) => !current);
            setMessage(readonly ? "Field is editable again." : "Readonly state shows the value without pretending it can be changed.");
          }}
        >
          Toggle readonly
        </button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </form>
  );
}

function TextInputBadUx() {
  const [value, setValue] = useState("Appeal draft");
  const [message, setMessage] = useState("The placeholder acts as the only instruction and disappears once typing starts.");
  const [error, setError] = useState("Required");

  return (
    <div className="quality-example text-input-demo">
      <input
        aria-label="Unclear text field"
        placeholder="Reference name"
        value={value}
        onFocus={() => {
          setError("Required");
          setMessage("Validation appeared on focus before the user had a chance to answer.");
        }}
        onChange={(event) => setValue(event.target.value)}
      />
      <div className="text-input-status-grid bad">
        <div>
          <span>Detached error</span>
          <strong>{error}</strong>
        </div>
        <div>
          <span>Stored value</span>
          <strong>{value || "blank"}</strong>
        </div>
      </div>
      <div className="demo-row text-input-actions">
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            setError("Required");
            setMessage("The field complains before edit intent is clear.");
          }}
        >
          Validate now
        </button>
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            setValue("Renewal note");
            setError("Too long");
            setMessage("Pasted text was silently truncated from a longer answer.");
          }}
        >
          Paste long answer
        </button>
        <button
          type="button"
          className="demo-button small danger"
          onClick={() => {
            setValue("");
            setError("Lost");
            setMessage("The recovery path cleared the user's typed value.");
          }}
        >
          Clear after error
        </button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function CompleteComplexFormGoodUx({ meta }: { meta: PatternMeta }) {
  const [section, setSection] = useState(0);
  const [policyName, setPolicyName] = useState("Vendor access policy");
  const [threshold, setThreshold] = useState("10000");
  const [approvers, setApprovers] = useState("1");
  const [escalationOwner, setEscalationOwner] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [validated, setValidated] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("Each section can be edited in place; validation summarizes cross-section issues before save.");
  const sections = meta.options;
  const thresholdNumber = Number(threshold);
  const approverNumber = Number(approvers);
  const highValueNeedsTwo = thresholdNumber >= 5000 && approverNumber < 2;
  const errors = {
    basics: policyName.trim() ? "" : "Enter a policy name.",
    rules: thresholdNumber > 0 ? "" : "Enter a positive spend threshold.",
    approvals: highValueNeedsTwo
      ? "High-value policies require at least 2 approvers."
      : escalationOwner.includes("@")
        ? ""
        : "Enter an escalation owner email.",
    review: reviewed ? "" : "Review the section summary before saving."
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const sectionStatus = (index: number) => {
    if (index === section) return "Current";
    if (!validated) return index < 2 ? "Edited" : "Not checked";
    if (index === 0) return errors.basics ? "Error" : "Complete";
    if (index === 1) return errors.rules ? "Error" : "Complete";
    if (index === 2) return errors.approvals ? "Error" : "Complete";
    if (index === 3) return notifications ? "Complete" : "Optional";
    return errors.review ? "Needs review" : "Complete";
  };

  const validateAll = () => {
    setValidated(true);
    setSaved(false);
    if (hasErrors) {
      setMessage("Validation found section-level issues and kept all entered values visible.");
      if (errors.basics) setSection(0);
      else if (errors.rules) setSection(1);
      else if (errors.approvals) setSection(2);
      else setSection(4);
      return;
    }
    setSection(4);
    setMessage("All sections are valid; review the complete configuration before saving.");
  };

  const saveForm = () => {
    setValidated(true);
    if (hasErrors) {
      setMessage("Save is blocked until required fields, cross-section rules, and review are complete.");
      return;
    }
    setSaved(true);
    setMessage("Complex form saved with section status, dependencies, and review intact.");
  };

  return (
    <div className="quality-example complex-form-demo">
      <div className="complex-form-shell">
        <aside className="complex-section-nav" aria-label="Complex form sections">
          {sections.map((item, index) => {
            const status = sectionStatus(index);
            return (
              <button
                type="button"
                key={item}
                className={index === section ? "is-current" : status === "Error" ? "is-error" : status === "Complete" ? "is-complete" : ""}
                onClick={() => {
                  setSection(index);
                  setMessage(`Moved to ${item}; unsaved values remain in the same form draft.`);
                }}
                aria-current={index === section ? "step" : undefined}
              >
                <strong>{item}</strong>
                <em>{status}</em>
              </button>
            );
          })}
        </aside>
        <section className="complex-form-panel" aria-live="polite">
          <span>Section {section + 1} of {sections.length}</span>
          <h4>{sections[section]}</h4>
          {validated && hasErrors && (
            <div className="single-form-error-summary" role="alert">
              <strong>Fix {Object.values(errors).filter(Boolean).length} issue(s) before saving</strong>
              {[errors.basics, errors.rules, errors.approvals, errors.review].filter(Boolean).map((error) => (
                <button type="button" className="link-button" key={error}>{error}</button>
              ))}
            </div>
          )}
          {section === 0 && (
            <fieldset>
              <legend>Basic policy details</legend>
              <label className={validated && errors.basics ? "single-form-field has-error" : "single-form-field"}>
                <span>Policy name (required)</span>
                {validated && errors.basics && <strong>{errors.basics}</strong>}
                <input value={policyName} onChange={(event) => setPolicyName(event.target.value)} />
              </label>
            </fieldset>
          )}
          {section === 1 && (
            <fieldset>
              <legend>Rule conditions</legend>
              <label className={validated && errors.rules ? "single-form-field has-error" : "single-form-field"}>
                <span>Spend threshold (required)</span>
                {validated && errors.rules && <strong>{errors.rules}</strong>}
                <input value={threshold} onChange={(event) => {
                  setThreshold(event.target.value);
                  setReviewed(false);
                  setSaved(false);
                }} />
              </label>
              <small>Threshold drives the approval rule in the Approvals section.</small>
            </fieldset>
          )}
          {section === 2 && (
            <fieldset>
              <legend>Approval routing</legend>
              <label className={validated && highValueNeedsTwo ? "single-form-field has-error" : "single-form-field"}>
                <span>Minimum approvers (required)</span>
                {validated && highValueNeedsTwo && <strong>Use at least 2 approvers for this threshold.</strong>}
                <input value={approvers} onChange={(event) => setApprovers(event.target.value)} />
              </label>
              <label className={validated && !escalationOwner.includes("@") ? "single-form-field has-error" : "single-form-field"}>
                <span>Escalation owner (required)</span>
                {validated && !escalationOwner.includes("@") && <strong>Enter an email address.</strong>}
                <input value={escalationOwner} onChange={(event) => setEscalationOwner(event.target.value)} />
              </label>
            </fieldset>
          )}
          {section === 3 && (
            <fieldset>
              <legend>Notifications</legend>
              <label className="checkbox-label">
                <input type="checkbox" checked={notifications} onChange={(event) => setNotifications(event.target.checked)} />
                Email approvers when a request is waiting
              </label>
              <small>Most fields in this enterprise configuration form are optional; required labels are explicit.</small>
            </fieldset>
          )}
          {section === 4 && (
            <div className="complex-review">
              <strong>Review configuration</strong>
              <span>Name: {policyName || "Missing"}</span>
              <span>Threshold: {thresholdNumber > 0 ? `$${threshold}` : "Missing"}</span>
              <span>Approvers: {approvers}</span>
              <span>Escalation: {escalationOwner || "Missing"}</span>
              <button
                type="button"
                className="demo-button small"
                onClick={() => {
                  setReviewed(true);
                  setMessage("Review confirmed; save can run when no section errors remain.");
                }}
              >
                Confirm review
              </button>
            </div>
          )}
          <div className="demo-row complex-form-actions">
            <button type="button" className="demo-button small" onClick={validateAll}>Validate all sections</button>
            <button type="button" className="demo-button small primary" onClick={saveForm}>Save configuration</button>
            <button
              type="button"
              className="demo-button small"
              onClick={() => {
                setApprovers("2");
                setEscalationOwner("ops-lead@example.com");
                setReviewed(false);
                setSaved(false);
                setSection(2);
                setMessage("Approval errors fixed in place; review is marked stale until confirmed again.");
              }}
            >
              Fix approvals
            </button>
          </div>
        </section>
      </div>
      <p className="demo-status" aria-live="polite">{saved ? "Saved. " : ""}{message}</p>
    </div>
  );
}

function CompleteComplexFormBadUx({ meta }: { meta: PatternMeta }) {
  const [active, setActive] = useState("all");
  const [owner, setOwner] = useState("ops-lead@example.com");
  const [message, setMessage] = useState("Everything is crowded into one dense surface with no section status or recovery.");
  const [error, setError] = useState("Unknown error");

  return (
    <div className="quality-example complex-form-demo">
      <div className="complex-form-bad-flow">
        <div className="bad-nav-row">
          {meta.options.map((section) => <span key={section}>{section.slice(0, 3)}</span>)}
        </div>
        <div className="complex-bad-grid">
          {["Name", "Limit", "Appr", "Esc", "Mail", "JSON", "Mode", "Owner"].map((item) => (
            <input
              key={item}
              aria-label={item}
              value={item === "Owner" ? owner : item}
              placeholder={item}
              onChange={(event) => item === "Owner" && setOwner(event.target.value)}
            />
          ))}
        </div>
        <div className="single-form-error-summary bad">{error}</div>
        <div className="demo-row complex-form-actions">
          <button
            type="button"
            className="demo-button small"
            onClick={() => {
              setError("3 errors somewhere");
              setMessage("Submit reported generic section errors but did not identify fields or preserve a fix order.");
            }}
          >
            Submit all
          </button>
          <button
            type="button"
            className="demo-button small"
            onClick={() => {
              setActive(active === "all" ? "advanced" : "all");
              setOwner("");
              setError("Advanced fields reset");
              setMessage("Switching dense sections cleared the escalation owner value.");
            }}
          >
            Toggle advanced
          </button>
          <button
            type="button"
            className="demo-button small danger"
            onClick={() => {
              setOwner("");
              setError("Saved invalid draft");
              setMessage("Save allowed an invalid cross-section state and erased a required owner.");
            }}
          >
            Force save
          </button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function WizardGoodUx({ meta }: { meta: PatternMeta }) {
  const [current, setCurrent] = useState(0);
  const [connector, setConnector] = useState("Zendesk");
  const [apiKey, setApiKey] = useState("");
  const [tested, setTested] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [canceled, setCanceled] = useState(false);
  const [message, setMessage] = useState("Choose a connector, then configure and test it before review unlocks.");
  const stepLabels = meta.options;
  const isComplete = (index: number) => {
    if (index === 0) return Boolean(connector);
    if (index === 1) return apiKey.trim().length >= 8;
    if (index === 2) return tested;
    if (index === 3) return reviewed;
    return finished;
  };
  const firstIncomplete = stepLabels.findIndex((_, index) => !isComplete(index));
  const maxAvailable = firstIncomplete === -1 ? stepLabels.length - 1 : Math.min(firstIncomplete, stepLabels.length - 1);

  const chooseStep = (index: number) => {
    if (index > maxAvailable) {
      setMessage(`${stepLabels[index]} is disabled until the wizard prerequisites pass.`);
      return;
    }
    setCurrent(index);
    setMessage(`Moved to ${stepLabels[index]} without losing the connector setup draft.`);
  };

  const continueWizard = () => {
    if (current === 0 && !connector) {
      setMessage("Choose a connector before configuring access.");
      return;
    }
    if (current === 1 && apiKey.trim().length < 8) {
      setMessage("Enter an access token before the test step unlocks.");
      return;
    }
    if (current === 2 && !tested) {
      setMessage("Run the connection test before Review unlocks.");
      return;
    }
    if (current === 3 && !reviewed) {
      setMessage("Review the generated setup before Finish is available.");
      return;
    }
    if (current === 4) {
      setFinished(true);
      setMessage("Connector setup finished after all wizard prerequisites passed.");
      return;
    }
    setCurrent((value) => Math.min(value + 1, stepLabels.length - 1));
    setMessage(`${stepLabels[current]} completed; ${stepLabels[Math.min(current + 1, stepLabels.length - 1)]} is now active.`);
  };

  return (
    <div className="quality-example wizard-demo">
      <div className={canceled ? "wizard-shell is-canceled" : "wizard-shell"}>
        <header className="wizard-header">
          <span>Guided setup</span>
          <h4>{meta.subject}</h4>
          <button
            type="button"
            className="demo-button small"
            onClick={() => {
              setCanceled(true);
              setMessage("Cancel opened a safe exit state before discarding the setup draft.");
            }}
          >
            Cancel
          </button>
        </header>
        <div className="wizard-layout">
          <ol className="wizard-nav" aria-label="Connector setup wizard steps">
            {stepLabels.map((step, index) => {
              const complete = isComplete(index);
              const disabled = index > maxAvailable;
              return (
                <li
                  key={step}
                  className={index === current ? "is-current" : complete ? "is-complete" : disabled ? "is-disabled" : ""}
                >
                  <button type="button" onClick={() => chooseStep(index)} aria-current={index === current ? "step" : undefined}>
                    <span>{index + 1}</span>
                    <strong>{step}</strong>
                    <em>{index === current ? "Current" : complete ? "Done" : disabled ? "Disabled" : "Ready"}</em>
                  </button>
                </li>
              );
            })}
          </ol>
          <section className="wizard-panel" aria-live="polite">
            <span>Step {current + 1} of {stepLabels.length}</span>
            <h4>{stepLabels[current]}</h4>
            {current === 0 && (
              <fieldset>
                <legend>Connector type</legend>
                {["Zendesk", "Salesforce", "CSV import"].map((option) => (
                  <label className="checkbox-label" key={option}>
                    <input
                      type="radio"
                      name="wizard-connector"
                      checked={connector === option}
                      onChange={() => {
                        setConnector(option);
                        setTested(false);
                        setReviewed(false);
                        setFinished(false);
                        setMessage(`${option} selected; later test and review steps will be recalculated.`);
                      }}
                    />
                    {option}
                  </label>
                ))}
              </fieldset>
            )}
            {current === 1 && (
              <label className="multi-form-field">
                <span>Access token</span>
                <input
                  value={apiKey}
                  onChange={(event) => {
                    setApiKey(event.target.value);
                    setTested(false);
                    setReviewed(false);
                    setFinished(false);
                  }}
                />
              </label>
            )}
            {current === 2 && (
              <div className={tested ? "wizard-preview is-good" : "wizard-preview"}>
                <strong>{tested ? "Connection passed" : "Connection not tested"}</strong>
                <span>{connector} will sync open tickets every 15 minutes.</span>
                <button
                  type="button"
                  className="demo-button small"
                  onClick={() => {
                    setTested(true);
                    setReviewed(false);
                    setFinished(false);
                    setMessage("Connection test passed; Review is now available.");
                  }}
                >
                  Run test
                </button>
              </div>
            )}
            {current === 3 && (
              <div className="wizard-review">
                <strong>Review generated setup</strong>
                <span>Connector: {connector}</span>
                <span>Token: {apiKey ? "Stored securely" : "Missing"}</span>
                <span>Test: {tested ? "Passed" : "Required"}</span>
                <button
                  type="button"
                  className="demo-button small"
                  onClick={() => {
                    setReviewed(true);
                    setMessage("Review confirmed; Finish is now enabled.");
                  }}
                >
                  Confirm review
                </button>
              </div>
            )}
            {current === 4 && (
              <div className="wizard-review">
                <strong>{finished ? "Setup active" : "Ready to finish"}</strong>
                <span>{finished ? `${connector} sync is now enabled.` : "All wizard prerequisites passed."}</span>
              </div>
            )}
            {canceled && <div className="single-form-error-summary">Cancel state: setup draft is paused until the user confirms exit.</div>}
            <div className="demo-row multi-form-actions">
              <button
                type="button"
                className="demo-button small"
                onClick={() => {
                  setCurrent((value) => Math.max(value - 1, 0));
                  setMessage("Back kept the wizard draft and returned to the previous guided step.");
                }}
              >
                Back
              </button>
              <button type="button" className="demo-button small primary" onClick={continueWizard}>
                {current === 4 ? "Finish" : current === 2 ? "Continue after test" : "Next"}
              </button>
              <button
                type="button"
                className="demo-button small"
                onClick={() => {
                  setCanceled(true);
                  setMessage("Cancel opened a safe exit state before discarding the setup draft.");
                }}
              >
                Cancel setup
              </button>
            </div>
          </section>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function WizardBadUx({ meta }: { meta: PatternMeta }) {
  const [step, setStep] = useState(0);
  const [token, setToken] = useState("zk_live_support");
  const [status, setStatus] = useState("Untested setup");
  const [message, setMessage] = useState("The wizard looks guided, but finish is available before prerequisites are complete.");

  return (
    <div className="quality-example wizard-demo">
      <div className="wizard-shell bad">
        <header className="wizard-header bad">
          <span>Setup</span>
          <h4>Generic wizard</h4>
          <button
            type="button"
            className="demo-button small danger"
            onClick={() => {
              setToken("");
              setStatus("Draft discarded");
              setMessage("Cancel closed the wizard immediately and discarded the configured token.");
            }}
          >
            Cancel
          </button>
        </header>
        <div className="wizard-layout">
          <div className="bad-nav-row wizard-bad-steps">
            {meta.options.map((item, index) => <span key={item} className={index === step ? "is-current" : ""}>{index + 1} visited</span>)}
          </div>
          <section className="wizard-panel bad">
            <span>Step {step + 1}</span>
            <h4>{meta.options[step] ?? "Unknown"}</h4>
            <input aria-label="Wizard token" value={token} onChange={(event) => setToken(event.target.value)} />
            <div className="single-form-error-summary bad">{status}</div>
            <div className="demo-row multi-form-actions">
              <button
                type="button"
                className="demo-button small"
                onClick={() => {
                  setStep(4);
                  setStatus("Finished without test");
                  setMessage("Finish ran even though connector type, test, and review were incomplete.");
                }}
              >
                Finish now
              </button>
              <button
                type="button"
                className="demo-button small"
                onClick={() => {
                  setStep(3);
                  setStatus("Hidden dependency");
                  setMessage("Review appeared after a hidden credential step that users never saw.");
                }}
              >
                Reveal hidden review
              </button>
              <button
                type="button"
                className="demo-button small danger"
                onClick={() => {
                  setStep(0);
                  setToken("");
                  setStatus("Back cleared setup");
                  setMessage("Back returned to the first step and erased the entered credential.");
                }}
              >
                Back
              </button>
            </div>
          </section>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function MultiStepFormGoodUx({ meta }: { meta: PatternMeta }) {
  const [current, setCurrent] = useState(0);
  const [eligible, setEligible] = useState("Yes");
  const [contact, setContact] = useState("asha@example.com");
  const [documentAttached, setDocumentAttached] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [staleDocuments, setStaleDocuments] = useState(false);
  const [message, setMessage] = useState("Eligibility is saved; continue to move through saved steps.");
  const stepLabels = meta.options;
  const isStepComplete = (index: number) => {
    if (index === 0) return Boolean(eligible);
    if (index === 1) return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact);
    if (index === 2) return documentAttached && !staleDocuments;
    if (index === 3) return reviewed;
    return submitted;
  };
  const firstIncomplete = stepLabels.findIndex((_, index) => !isStepComplete(index));
  const maxAvailable = firstIncomplete === -1 ? stepLabels.length - 1 : Math.min(firstIncomplete, stepLabels.length - 1);

  const goToStep = (index: number) => {
    if (index > maxAvailable) {
      setMessage(`${stepLabels[index]} is locked until previous step data is saved.`);
      return;
    }
    setCurrent(index);
    setMessage(`Moved to ${stepLabels[index]} with previous answers preserved.`);
  };

  const continueStep = () => {
    if (current === 0 && !eligible) {
      setMessage("Choose eligibility before continuing.");
      return;
    }
    if (current === 1 && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact)) {
      setMessage("Enter a valid email before unlocking Documents.");
      return;
    }
    if (current === 2 && (!documentAttached || staleDocuments)) {
      setMessage(staleDocuments ? "Documents are stale after the eligibility change; review the evidence before continuing." : "Attach evidence before continuing to Review.");
      return;
    }
    if (current === 3 && !reviewed) {
      setMessage("Confirm the review before final submission.");
      return;
    }
    if (current === 4) {
      setSubmitted(true);
      setMessage("Application submitted after all saved steps and review passed.");
      return;
    }
    setCurrent((value) => Math.min(value + 1, stepLabels.length - 1));
    setMessage(`${stepLabels[current]} saved; ${stepLabels[Math.min(current + 1, stepLabels.length - 1)]} is now current.`);
  };

  return (
    <div className="quality-example multi-step-form-demo">
      <div className="multi-form-card">
        <ol className="multi-form-steps" aria-label="Saved form steps">
          {stepLabels.map((step, index) => {
            const complete = isStepComplete(index);
            const locked = index > maxAvailable;
            const stale = index === 2 && staleDocuments;
            return (
              <li
                key={step}
                className={index === current ? "is-current" : complete ? "is-complete" : stale ? "is-stale" : locked ? "is-locked" : ""}
              >
                <button type="button" onClick={() => goToStep(index)} aria-current={index === current ? "step" : undefined}>
                  <span>{index + 1}</span>
                  <strong>{step}</strong>
                  <em>{index === current ? "Current" : stale ? "Needs review" : complete ? "Saved" : locked ? "Locked" : "Available"}</em>
                </button>
              </li>
            );
          })}
        </ol>
        <section className="multi-form-step-panel" aria-live="polite">
          <span>Step {current + 1} of {stepLabels.length}</span>
          <h4>{stepLabels[current]}</h4>
          {current === 0 && (
            <fieldset>
              <legend>Are you eligible?</legend>
              {["Yes", "No"].map((option) => (
                <label className="checkbox-label" key={option}>
                  <input
                    type="radio"
                    name="multi-form-eligibility"
                    checked={eligible === option}
                    onChange={() => {
                      setEligible(option);
                      setSubmitted(false);
                      if (option === "No") {
                        setDocumentAttached(false);
                        setStaleDocuments(true);
                        setReviewed(false);
                        setMessage("Changing eligibility invalidated the document and review steps.");
                      } else {
                        setMessage("Eligibility answer saved on this step.");
                      }
                    }}
                  />
                  {option}
                </label>
              ))}
            </fieldset>
          )}
          {current === 1 && (
            <label className="multi-form-field">
              <span>Email address</span>
              <input value={contact} onChange={(event) => setContact(event.target.value)} />
            </label>
          )}
          {current === 2 && (
            <div className={staleDocuments ? "multi-form-document is-stale" : "multi-form-document"}>
              <strong>{documentAttached ? "Evidence attached" : "No evidence attached"}</strong>
              <span>{staleDocuments ? "Eligibility changed; review this evidence before continuing." : "Attach one file before review."}</span>
              <button
                type="button"
                className="demo-button small"
                onClick={() => {
                  setDocumentAttached(true);
                  setStaleDocuments(false);
                  setMessage("Document step saved and is compatible with the current eligibility answer.");
                }}
              >
                Attach evidence
              </button>
            </div>
          )}
          {current === 3 && (
            <div className="multi-form-review">
              <strong>Check your answers</strong>
              <span>Eligibility: {eligible}</span>
              <span>Contact: {contact}</span>
              <span>Documents: {documentAttached && !staleDocuments ? "Evidence attached" : "Needs review"}</span>
              <button
                type="button"
                className="demo-button small"
                onClick={() => {
                  setReviewed(true);
                  setMessage("Review confirmed; final submit is available.");
                }}
              >
                Confirm review
              </button>
              <button
                type="button"
                className="demo-button small"
                onClick={() => {
                  setCurrent(0);
                  setMessage("Change link returned to Eligibility with previous answers pre-populated.");
                }}
              >
                Change eligibility
              </button>
            </div>
          )}
          {current === 4 && (
            <div className="multi-form-review">
              <strong>{submitted ? "Submitted" : "Ready to submit"}</strong>
              <span>{submitted ? "Final state reached after saved steps and review." : "Review is complete; submit the application."}</span>
            </div>
          )}
          <div className="demo-row multi-form-actions">
            <button
              type="button"
              className="demo-button small"
              onClick={() => {
                setCurrent((value) => Math.max(value - 1, 0));
                setMessage("Back preserved answers from the current and previous steps.");
              }}
            >
              Back
            </button>
            <button type="button" className="demo-button small primary" onClick={continueStep}>
              {current === 4 ? "Submit" : "Continue"}
            </button>
            <button
              type="button"
              className="demo-button small"
              onClick={() => {
                setCurrent(0);
                setEligible(eligible === "Yes" ? "No" : "Yes");
                setDocumentAttached(false);
                setStaleDocuments(true);
                setReviewed(false);
                setSubmitted(false);
                setMessage("Earlier answer changed; downstream document and review steps now need attention.");
              }}
            >
              Change earlier answer
            </button>
          </div>
        </section>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function MultiStepFormBadUx({ meta }: { meta: PatternMeta }) {
  const [step, setStep] = useState(3);
  const [contact, setContact] = useState("asha@example.com");
  const [message, setMessage] = useState("The flow reports progress from page visits instead of saved valid answers.");
  const [status, setStatus] = useState("All steps complete");

  return (
    <div className="quality-example multi-step-form-demo">
      <div className="multi-form-card bad">
        <div className="bad-nav-row multi-form-bad-steps">
          {meta.options.map((item, index) => (
            <span key={item} className={index === step ? "is-current" : ""}>{index + 1} done</span>
          ))}
        </div>
        <section className="multi-form-step-panel bad">
          <span>Step {step + 1}</span>
          <h4>{meta.options[step] ?? "Unknown"}</h4>
          <input aria-label="Saved contact" value={contact} onChange={(event) => setContact(event.target.value)} />
          <div className="single-form-error-summary bad">{status}</div>
          <div className="demo-row multi-form-actions">
            <button
              type="button"
              className="demo-button small"
              onClick={() => {
                setStep(4);
                setStatus("Skipped required documents");
                setMessage("Review opened even though the required Documents step was never saved.");
              }}
            >
              Skip to review
            </button>
            <button
              type="button"
              className="demo-button small"
              onClick={() => {
                setStatus("Progress count changed");
                setMessage("A conditional answer inserted another step after progress already promised 5 steps.");
              }}
            >
              Insert hidden step
            </button>
            <button
              type="button"
              className="demo-button small danger"
              onClick={() => {
                setContact("");
                setStatus("Saved data lost");
                setMessage("Browser refresh cleared earlier saved answers, so the user must restart the transaction.");
              }}
            >
              Refresh page
            </button>
          </div>
        </section>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function SinglePageFormGoodUx() {
  const [name, setName] = useState("Asha Patel");
  const [email, setEmail] = useState("asha.example.com");
  const [phone, setPhone] = useState("");
  const [preference, setPreference] = useState("Email");
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("Related contact fields can be reviewed together before one save.");
  const nameError = submitted && name.trim().length === 0;
  const emailInvalid = !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const phoneInvalid = preference === "Phone" && phone.trim().length < 7;
  const emailError = submitted && emailInvalid;
  const phoneError = submitted && phoneInvalid;
  const hasErrors = nameError || emailError || phoneError;

  const submit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const nextHasErrors = name.trim().length === 0 || emailInvalid || phoneInvalid;
    setSubmitted(true);
    setSaved(false);
    if (nextHasErrors) {
      setMessage("Two field errors are linked from the summary and all entered values are still visible.");
      return;
    }
    setSaved(true);
    setMessage(`Saved contact details for ${name || "this user"} with ${preference.toLowerCase()} preference.`);
  };

  return (
    <form className="quality-example single-page-form-demo" onSubmit={submit}>
      <div className="single-form-card">
        <h4>Contact details</h4>
        <p id="single-form-hint">A red asterisk means the field is required.</p>
        {submitted && hasErrors && (
          <div className="single-form-error-summary" role="alert" aria-label="Form errors">
            <strong>There is a problem</strong>
            {emailError && <button type="button" onClick={() => setMessage("Email error link selected; value was preserved for editing.")}>Enter an email address in the correct format</button>}
            {phoneError && <button type="button" onClick={() => setMessage("Phone error link selected; unrelated fields stayed filled.")}>Enter a phone number for phone contact</button>}
            {nameError && <button type="button" onClick={() => setMessage("Name error link selected; other contact values stayed filled.")}>Enter a full name</button>}
          </div>
        )}
        <fieldset>
          <legend>Your details</legend>
          <label className={submitted && !name.trim() ? "single-form-field has-error" : "single-form-field"}>
            <span>Full name *</span>
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className={emailError ? "single-form-field has-error" : "single-form-field"}>
            <span>Email address *</span>
            {emailError && <strong>Enter an email address in the correct format</strong>}
            <input value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className={phoneError ? "single-form-field has-error" : "single-form-field"}>
            <span>Phone number {preference === "Phone" ? "*" : "(optional)"}</span>
            {phoneError && <strong>Enter a phone number for phone contact</strong>}
            <input value={phone} onChange={(event) => setPhone(event.target.value)} />
          </label>
        </fieldset>
        <fieldset>
          <legend>Contact preference</legend>
          {["Email", "Phone"].map((option) => (
            <label className="checkbox-label" key={option}>
              <input
                type="radio"
                name="single-form-pref"
                checked={preference === option}
                onChange={() => {
                  setPreference(option);
                  setMessage(`${option} selected; the form keeps other details on the same page.`);
                }}
              />
              {option}
            </label>
          ))}
        </fieldset>
        <div className="demo-row single-form-actions">
          <button type="submit" className="demo-button small primary">Save details</button>
          <button
            type="button"
            className="demo-button small"
            onClick={() => {
              setName("Asha Patel");
              setEmail("asha@example.com");
              setPhone("555-0134");
              setPreference("Phone");
              setSubmitted(false);
              setSaved(false);
              setMessage("Valid sample filled without leaving the page.");
            }}
          >
            Fill valid sample
          </button>
          <button
            type="button"
            className="demo-button small"
            onClick={() => {
              setEmail("asha.example.com");
              setPhone("");
              setPreference("Phone");
              setSubmitted(true);
              setSaved(false);
              setMessage("Failed submit keeps name, bad email, blank phone, and preference visible for correction.");
            }}
          >
            Trigger errors
          </button>
        </div>
      </div>
      <div className="single-form-state-grid">
        <div>
          <span>Submission state</span>
          <strong>{saved ? "Saved" : submitted && hasErrors ? "Needs correction" : "Editable"}</strong>
        </div>
        <div>
          <span>Values preserved</span>
          <strong>{name && (email || phone) ? "Yes" : "Check entries"}</strong>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </form>
  );
}

function SinglePageFormBadUx() {
  const [name, setName] = useState("Asha Patel");
  const [email, setEmail] = useState("asha.example.com");
  const [payment, setPayment] = useState("card ending 4242");
  const [message, setMessage] = useState("A long mixed form hides unrelated tasks behind one submit button.");
  const [banner, setBanner] = useState("Fix errors");

  return (
    <div className="quality-example single-page-form-demo">
      <div className="single-form-card bad">
        <h4>Everything</h4>
        <div className="single-form-two-column">
          <label>
            <span>Nm</span>
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label>
            <span>Pay</span>
            <input value={payment} onChange={(event) => setPayment(event.target.value)} />
          </label>
          <label>
            <span>Email?</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>
            <span>Legal</span>
            <input placeholder="agree" />
          </label>
        </div>
        <div className="single-form-error-summary bad">{banner}</div>
        <div className="demo-row single-form-actions">
          <button
            type="button"
            className="demo-button small"
            onClick={() => {
              setBanner("Fix errors");
              setMessage("The banner gives no links, so users must scan unrelated fields to find the problem.");
            }}
          >
            Submit mixed form
          </button>
          <button
            type="button"
            className="demo-button small"
            onClick={() => {
              setMessage("Visual columns make the next field ambiguous; keyboard order does not match scanning order.");
            }}
          >
            Tab through
          </button>
          <button
            type="button"
            className="demo-button small danger"
            onClick={() => {
              setName("");
              setEmail("");
              setPayment("");
              setBanner("Cleared");
              setMessage("One failed field cleared unrelated contact and payment values.");
            }}
          >
            Clear after error
          </button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function SingleQuestionPageGoodUx({ meta }: { meta: PatternMeta }) {
  const [answer, setAnswer] = useState("Yes");
  const [detail, setDetail] = useState("Bank statement PDF");
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState<"question" | "review">("question");
  const [message, setMessage] = useState("The page asks one question before moving to the next service step.");
  const hasError = submitted && !answer;

  const continueQuestion = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setSubmitted(true);
    if (!answer) {
      setMessage("Choose an answer before continuing. The page stays on this question and preserves any typed detail.");
      return;
    }
    setStep("review");
    setMessage(`Saved answer "${answer}" and moved to the next page without clearing this question.`);
  };

  return (
    <form className="quality-example question-page-demo" onSubmit={continueQuestion}>
      <a
        className="question-back-link"
        href="#quality-demo"
        onClick={(event) => {
          event.preventDefault();
          setStep("question");
          setMessage(`Back returned to this question with "${answer || "no answer"}" still available.`);
        }}
      >
        Back
      </a>
      <div className={hasError ? "question-page-card has-error" : "question-page-card"}>
        <span className="question-progress">{step === "question" ? "Question 3 of 8" : "Next page preview"}</span>
        <h4>{meta.field}</h4>
        <p id="single-question-hint">This answer decides whether the upload page appears next.</p>
        {hasError && <strong id="single-question-error">Select whether you have evidence to upload</strong>}
        {step === "question" ? (
          <>
            <fieldset aria-describedby={hasError ? "single-question-hint single-question-error" : "single-question-hint"}>
              <legend className="sr-only">{meta.field}</legend>
              {meta.options.map((option) => (
                <label className="checkbox-label" key={option}>
                  <input
                    type="radio"
                    name="single-question-answer"
                    checked={answer === option}
                    onChange={() => {
                      setAnswer(option);
                      setSubmitted(false);
                      setMessage(`${option} selected on the same focused question page.`);
                    }}
                  />
                  {option}
                </label>
              ))}
            </fieldset>
            {answer === "Yes" && (
              <label className="question-detail-field">
                <span>What kind of evidence?</span>
                <input
                  value={detail}
                  onChange={(event) => {
                    setDetail(event.target.value);
                    setMessage("Conditional detail stays on this page because it answers the same question.");
                  }}
                />
              </label>
            )}
            <div className="demo-row question-actions">
              <button type="submit" className="demo-button small primary">Continue</button>
              <button
                type="button"
                className="demo-button small"
                onClick={() => {
                  setAnswer("");
                  setSubmitted(true);
                  setStep("question");
                  setMessage("Validation stays scoped to the current question and keeps recovery controls visible.");
                }}
              >
                Continue empty
              </button>
            </div>
          </>
        ) : (
          <div className="question-review-card">
            <strong>Upload evidence</strong>
            <span>Previous answer: {answer}{answer === "Yes" && detail ? ` - ${detail}` : ""}</span>
            <button
              type="button"
              className="demo-button small"
              onClick={() => {
                setStep("question");
                setMessage("Returned from the next page and restored the question answer.");
              }}
            >
              Change answer
            </button>
          </div>
        )}
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </form>
  );
}

function SingleQuestionPageBadUx({ meta }: { meta: PatternMeta }) {
  const [name, setName] = useState("A. Patel");
  const [address, setAddress] = useState("12 Market Road");
  const [evidence, setEvidence] = useState("Yes");
  const [message, setMessage] = useState("The page asks multiple unrelated questions under one vague Details heading.");
  const [error, setError] = useState("Fix details");

  return (
    <div className="quality-example question-page-demo">
      <div className="question-page-card bad">
        <span className="question-progress">Step 3</span>
        <h4>Details</h4>
        <label>
          <span>Name</span>
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label>
          <span>Address</span>
          <input value={address} onChange={(event) => setAddress(event.target.value)} />
        </label>
        <label>
          <span>{meta.field}</span>
          <select value={evidence} onChange={(event) => setEvidence(event.target.value)}>
            {meta.options.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <div className="question-error-strip">{error}</div>
        <div className="demo-row question-actions">
          <button
            type="button"
            className="demo-button small"
            onClick={() => {
              setError("Missing field");
              setMessage("The generic error does not say whether name, address, or evidence caused the problem.");
            }}
          >
            Submit mixed page
          </button>
          <button
            type="button"
            className="demo-button small"
            onClick={() => {
              setMessage("The browser Back path is ambiguous because this screen hid several conceptual questions behind one route.");
            }}
          >
            Press Back
          </button>
          <button
            type="button"
            className="demo-button small danger"
            onClick={() => {
              setName("");
              setAddress("");
              setEvidence("");
              setError("Lost answers");
              setMessage("Validation cleared unrelated answers instead of keeping the current question recoverable.");
            }}
          >
            Clear after error
          </button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

type CountMode = "characters" | "words";

type CountStatus = "calm" | "near" | "over" | "trimmed" | "submitted" | "mode";

function countUnits(value: string, mode: CountMode) {
  if (mode === "characters") return value.length;
  return value.trim().length === 0 ? 0 : value.trim().split(/\s+/).length;
}

function unitLabel(mode: CountMode, amount: number) {
  const singular = mode === "characters" ? "character" : "word";
  return amount === 1 ? singular : `${singular}s`;
}

function trimToLimit(value: string, mode: CountMode, limit: number) {
  if (mode === "characters") return value.slice(0, limit);
  return value.trim().split(/\s+/).slice(0, limit).join(" ");
}

function CharacterCountGoodUx({ meta }: { meta: PatternMeta }) {
  const [mode, setMode] = useState<CountMode>("characters");
  const [value, setValue] = useState(meta.options[0] ?? "");
  const [status, setStatus] = useState<CountStatus>("calm");
  const [message, setMessage] = useState("The limit is visible, but the counter stays calm until the draft approaches it.");
  const limit = mode === "characters" ? 120 : 8;
  const threshold = mode === "characters" ? 20 : 3;
  const count = countUnits(value, mode);
  const remaining = limit - count;
  const isOver = remaining < 0;
  const isNear = !isOver && remaining <= threshold;
  const countText = isOver
    ? `${Math.abs(remaining)} ${unitLabel(mode, Math.abs(remaining))} too many`
    : isNear
      ? `${remaining} ${unitLabel(mode, remaining)} remaining`
      : `You can enter up to ${limit} ${unitLabel(mode, limit)}`;
  const fieldStatus = isOver ? "over" : isNear ? "near" : status;

  const updateValue = (nextValue: string) => {
    const nextCount = countUnits(nextValue, mode);
    const nextRemaining = limit - nextCount;
    setValue(nextValue);
    if (nextRemaining < 0) {
      setStatus("over");
      setMessage(`Draft preserved. Remove ${Math.abs(nextRemaining)} ${unitLabel(mode, Math.abs(nextRemaining))} before submitting.`);
      return;
    }
    if (nextRemaining <= threshold) {
      setStatus("near");
      setMessage(`${nextRemaining} ${unitLabel(mode, nextRemaining)} remaining. The limit is now prominent enough to guide editing.`);
      return;
    }
    setStatus("calm");
    setMessage("The limit is visible, but no urgent countdown is shown while plenty of room remains.");
  };

  const switchMode = (nextMode: CountMode) => {
    const nextLimit = nextMode === "characters" ? 120 : 8;
    const nextCount = countUnits(value, nextMode);
    const nextRemaining = nextLimit - nextCount;
    setMode(nextMode);
    setStatus(nextRemaining < 0 ? "over" : "mode");
    setMessage(nextMode === "characters" ? "Switched to character limit; validation and count now use characters." : "Switched to word limit; validation and count now use words.");
  };

  const submit = () => {
    if (isOver) {
      setStatus("over");
      setMessage(`Cannot submit yet. Remove ${Math.abs(remaining)} ${unitLabel(mode, Math.abs(remaining))}; the full draft is still editable.`);
      return;
    }
    if (count === 0) {
      setStatus("over");
      setMessage(`Enter a summary before submitting; the ${mode} limit is not a replacement for required-field validation.`);
      return;
    }
    setStatus("submitted");
    setMessage(`Submitted ${count} ${unitLabel(mode, count)} within the ${limit} ${unitLabel(mode, limit)} limit.`);
  };

  return (
    <div className="quality-example character-count-demo">
      <div className={`character-count-status is-${fieldStatus}`} role={isOver ? "alert" : "status"} aria-live="polite">
        <strong>{isOver ? "Over the limit" : isNear ? "Limit nearby" : "Limit available"}</strong>
        <span>{message}</span>
      </div>
      <label className={isOver ? "character-count-field has-error" : "character-count-field"} htmlFor="character-count-good">
        <span>{meta.field}</span>
        <small id="character-count-good-hint">Keep the public summary short enough for the grant listing.</small>
        <textarea
          id="character-count-good"
          rows={4}
          value={value}
          aria-invalid={isOver ? true : undefined}
          aria-describedby="character-count-good-hint character-count-good-message"
          onChange={(event) => updateValue(event.target.value)}
        />
      </label>
      <div className={`character-count-message is-${fieldStatus}`} id="character-count-good-message">
        <span>{countText}</span>
        <em>{`${count} / ${limit} ${unitLabel(mode, limit)}`}</em>
      </div>
      <div className="demo-row character-count-actions">
        <button type="button" className="demo-button small" onClick={() => updateValue("This summary is close to the publishing limit and leaves just a small amount of space for final edits.")}>Near limit</button>
        <button type="button" className="demo-button small" onClick={() => updateValue("This summary is intentionally too long for the public grant listing because it keeps adding operational detail, delivery caveats, and extra context that should move into the full application rather than the short summary.")}>Paste over limit</button>
        <button type="button" className="demo-button small" onClick={() => switchMode("characters")}>Character mode</button>
        <button type="button" className="demo-button small" onClick={() => {
          switchMode("words");
          setValue(meta.options[1] ?? "");
        }}>Word mode</button>
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            const trimmed = trimToLimit(value, mode, limit);
            setValue(trimmed);
            setStatus("trimmed");
            setMessage(`Trimmed to ${countUnits(trimmed, mode)} ${unitLabel(mode, countUnits(trimmed, mode))}; the user can still undo or edit.`);
          }}
        >
          Trim to limit
        </button>
        <button type="button" className="demo-button small primary" onClick={submit}>Submit summary</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function CharacterCountBadUx({ meta }: { meta: PatternMeta }) {
  const [value, setValue] = useState("We need funding to replace unsafe entrance lighting before winter and add night-time security checks for residents.");
  const [message, setMessage] = useState("The limit is hidden until the final submit step.");
  const [stored, setStored] = useState("No count shown");

  return (
    <div className="quality-example character-count-demo">
      <div className="character-count-bad-ui">
        <textarea
          aria-label={`${meta.field} with hidden hard limit`}
          rows={3}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <div className="textarea-status-grid bad">
          <div>
            <span>Visible limit</span>
            <strong>{stored}</strong>
          </div>
          <div>
            <span>Draft length</span>
            <strong>{value.length} characters</strong>
          </div>
        </div>
        <div className="demo-row character-count-actions">
          <button
            type="button"
            className="demo-button small"
            onClick={() => {
              setStored("Rejected after submit");
              setMessage("The backend says the summary is too long but never showed a remaining count while the user wrote.");
            }}
          >
            Submit hidden limit
          </button>
          <button
            type="button"
            className="demo-button small primary"
            onClick={() => {
              setValue(value.slice(0, 60));
              setStored("Silently truncated");
              setMessage("The product cut the draft without showing what was removed or letting the user edit first.");
            }}
          >
            Silent truncate
          </button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

type DateInputStatus = "ready" | "normalized" | "error" | "submitted" | "picker";

type DateParts = {
  day: string;
  month: string;
  year: string;
};

const monthNameMap: Record<string, number> = {
  jan: 1,
  january: 1,
  feb: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12
};

function padDatePart(value: number) {
  return String(value).padStart(2, "0");
}

function parseDateInputParts(parts: DateParts) {
  const dayRaw = parts.day.trim();
  const monthRaw = parts.month.trim();
  const yearRaw = parts.year.trim();
  const missing = [
    !dayRaw && "day",
    !monthRaw && "month",
    !yearRaw && "year"
  ].filter(Boolean) as string[];

  if (missing.length > 0) {
    return {
      canonical: "",
      isValid: false,
      normalizedMonth: "",
      message: `The date must include a ${missing.join(", ")}.`
    };
  }

  const day = Number(dayRaw);
  const month = /^\d+$/.test(monthRaw) ? Number(monthRaw) : monthNameMap[monthRaw.toLowerCase()];
  const year = Number(yearRaw);

  if (!Number.isInteger(day) || day < 1 || day > 31) {
    return { canonical: "", isValid: false, normalizedMonth: "", message: "Day must be a number from 1 to 31." };
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    return { canonical: "", isValid: false, normalizedMonth: "", message: "Month must be a number from 1 to 12, or a month name." };
  }
  if (!Number.isInteger(year) || year < 1000 || year > 9999) {
    return { canonical: "", isValid: false, normalizedMonth: "", message: "Year must be 4 digits." };
  }

  const candidate = new Date(Date.UTC(year, month - 1, day));
  const isRealDate =
    candidate.getUTCFullYear() === year &&
    candidate.getUTCMonth() === month - 1 &&
    candidate.getUTCDate() === day;

  if (!isRealDate) {
    return { canonical: "", isValid: false, normalizedMonth: padDatePart(month), message: `${day} ${monthRaw} ${year} is not a real date.` };
  }

  const latestAllowed = new Date(Date.UTC(2026, 5, 9));
  if (candidate > latestAllowed) {
    return { canonical: "", isValid: false, normalizedMonth: padDatePart(month), message: "The date must be on or before 9 June 2026." };
  }

  return {
    canonical: `${year}-${padDatePart(month)}-${padDatePart(day)}`,
    isValid: true,
    normalizedMonth: padDatePart(month),
    message: `Valid date normalized to ${year}-${padDatePart(month)}-${padDatePart(day)}.`
  };
}

function DateInputGoodUx({ meta }: { meta: PatternMeta }) {
  const [parts, setParts] = useState<DateParts>({ day: "7", month: "Jan", year: "1984" });
  const [status, setStatus] = useState<DateInputStatus>("ready");
  const [message, setMessage] = useState("The date question is grouped once, with separate editable day, month, and year parts.");
  const parsed = parseDateInputParts(parts);
  const hasError = status === "error";

  const setPart = (key: keyof DateParts, value: string) => {
    setParts((current) => ({ ...current, [key]: value }));
    setStatus("ready");
    setMessage("Part values are preserved while the user edits one field.");
  };

  const submit = () => {
    const result = parseDateInputParts(parts);
    if (!result.isValid) {
      setStatus("error");
      setMessage(result.message);
      return;
    }
    setStatus(result.normalizedMonth !== parts.month.trim() ? "normalized" : "submitted");
    setMessage(result.normalizedMonth !== parts.month.trim() ? `Month "${parts.month}" normalized to ${result.normalizedMonth}; submitted ${result.canonical}.` : `Submitted canonical date ${result.canonical}.`);
  };

  return (
    <div className="quality-example date-input-demo">
      <div className={`date-input-status is-${status}`} role={hasError ? "alert" : "status"} aria-live="polite">
        <strong>{hasError ? "Date needs correction" : status === "normalized" ? "Month normalized" : "Grouped date input"}</strong>
        <span>{message}</span>
      </div>
      <fieldset className={hasError ? "date-input-fieldset has-error" : "date-input-fieldset"} aria-describedby={hasError ? "date-input-good-hint date-input-good-error date-input-canonical" : "date-input-good-hint date-input-canonical"}>
        <legend>{meta.field}</legend>
        <small id="date-input-good-hint">For example, 27 3 2007. You can type a month number or name.</small>
        {hasError && <strong id="date-input-good-error">{message}</strong>}
        <div className="date-input-parts">
          <label htmlFor="date-input-day">
            <span>Day</span>
            <input id="date-input-day" value={parts.day} inputMode="numeric" autoComplete="bday-day" onChange={(event) => setPart("day", event.target.value)} />
          </label>
          <label htmlFor="date-input-month">
            <span>Month</span>
            <input id="date-input-month" value={parts.month} inputMode="numeric" autoComplete="bday-month" onChange={(event) => setPart("month", event.target.value)} />
          </label>
          <label htmlFor="date-input-year">
            <span>Year</span>
            <input id="date-input-year" value={parts.year} inputMode="numeric" autoComplete="bday-year" onChange={(event) => setPart("year", event.target.value)} />
          </label>
        </div>
      </fieldset>
      <div className="date-input-canonical" id="date-input-canonical">
        <span>Visible parts</span>
        <strong>{parts.day || "day"} / {parts.month || "month"} / {parts.year || "year"}</strong>
        <span>Canonical value</span>
        <strong>{parsed.isValid ? parsed.canonical : "not valid yet"}</strong>
      </div>
      <div className="demo-row date-input-actions">
        <button type="button" className="demo-button small" onClick={() => {
          setParts({ day: meta.options[0], month: meta.options[1], year: meta.options[2] });
          setStatus("ready");
          setMessage("Sample known date restored with a month name.");
        }}>Type 7 Jan 1984</button>
        <button type="button" className="demo-button small" onClick={() => {
          setParts({ day: "6", month: "3", year: "" });
          setStatus("error");
          setMessage("The date must include a year.");
        }}>Missing year</button>
        <button type="button" className="demo-button small" onClick={() => {
          setParts({ day: "31", month: "Feb", year: "2026" });
          setStatus("error");
          setMessage("31 Feb 2026 is not a real date.");
        }}>31 Feb</button>
        <button type="button" className="demo-button small" onClick={() => {
          setParts({ day: "10", month: "6", year: "2026" });
          setStatus("error");
          setMessage("The date must be on or before 9 June 2026.");
        }}>Future date</button>
        <button type="button" className="demo-button small" onClick={() => {
          setStatus("picker");
          setMessage("A picker would be better for scheduling availability, not for this known document date.");
        }}>Compare picker</button>
        <button type="button" className="demo-button small primary" onClick={submit}>Submit date</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function DateInputBadUx({ meta }: { meta: PatternMeta }) {
  const [value, setValue] = useState("DD/MM/YYYY");
  const [message, setMessage] = useState("The format text is inside a single field and disappears as soon as the user types.");
  const [state, setState] = useState("Masked");

  return (
    <div className="quality-example date-input-demo">
      <div className="date-input-bad-ui">
        <input value={value} onChange={(event) => setValue(event.target.value)} aria-label={`${meta.field} as one masked value`} />
        <div className="textarea-status-grid bad">
          <div>
            <span>Recovery</span>
            <strong>{state}</strong>
          </div>
          <div>
            <span>Stored value</span>
            <strong>{value}</strong>
          </div>
        </div>
        <div className="demo-row date-input-actions">
          <button type="button" className="demo-button small" onClick={() => {
            setValue("07/J");
            setState("Focus jumped");
            setMessage("Auto-tab behavior moved focus before the user could finish typing Jan.");
          }}>Auto-tab mask</button>
          <button type="button" className="demo-button small" onClick={() => {
            setState("Picker forced");
            setMessage("The user already knows the date but must navigate a calendar instead of typing it.");
          }}>Force picker</button>
          <button type="button" className="demo-button small primary" onClick={() => {
            setState("Vague error");
            setMessage("The form says Invalid date but does not name day, month, year, or impossible-date failure.");
          }}>Submit vague error</button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

type DatePickerStatus = "open" | "selected" | "typed" | "error" | "submitted" | "cleared";

const datePickerMonths = [
  { label: "July 2026", year: 2026, monthIndex: 6 },
  { label: "August 2026", year: 2026, monthIndex: 7 }
];

const datePickerWeekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const datePickerMinIso = "2026-07-10";

const datePickerMaxIso = "2026-08-21";

const datePickerBlackouts = new Set(["2026-07-17", "2026-08-14"]);

type DatePickerCell = {
  day: number;
  iso: string;
  isToday: boolean;
  isUnavailable: boolean;
  unavailableReason: string;
};

function datePickerIso(year: number, monthIndex: number, day: number) {
  return `${year}-${padDatePart(monthIndex + 1)}-${padDatePart(day)}`;
}

function datePickerDisplay(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${month}/${day}/${year}`;
}

function parseDatePickerDisplay(value: string) {
  const parts = value.trim().match(/^(\d{1,2})\/?(\d{1,2})\/?(\d{4})$/);
  if (!parts) return { iso: "", message: "Use mm/dd/yyyy, for example 07/16/2026." };
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  const year = Number(parts[3]);
  const candidate = new Date(Date.UTC(year, month - 1, day));
  const real =
    candidate.getUTCFullYear() === year &&
    candidate.getUTCMonth() === month - 1 &&
    candidate.getUTCDate() === day;
  if (!real) return { iso: "", message: "Enter a real calendar date." };
  return { iso: datePickerIso(year, month - 1, day), message: "" };
}

function datePickerAvailability(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  if (iso < datePickerMinIso) return "Before booking window";
  if (iso > datePickerMaxIso) return "After booking window";
  if (weekday === 0 || weekday === 6) return "Weekend unavailable";
  if (datePickerBlackouts.has(iso)) return "No appointments left";
  return "";
}

function buildDatePickerCells(month: { year: number; monthIndex: number }) {
  const firstWeekday = new Date(Date.UTC(month.year, month.monthIndex, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(month.year, month.monthIndex + 1, 0)).getUTCDate();
  const cells: Array<DatePickerCell | null> = Array.from({ length: firstWeekday }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    const iso = datePickerIso(month.year, month.monthIndex, day);
    const unavailableReason = datePickerAvailability(iso);
    cells.push({
      day,
      iso,
      isToday: iso === "2026-07-09",
      isUnavailable: unavailableReason.length > 0,
      unavailableReason
    });
  }
  return cells;
}

function DatePickerGoodUx({ meta }: { meta: PatternMeta }) {
  const [visibleMonth, setVisibleMonth] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const [selectedIso, setSelectedIso] = useState(meta.options[0]);
  const [typedValue, setTypedValue] = useState(datePickerDisplay(meta.options[0]));
  const [status, setStatus] = useState<DatePickerStatus>("open");
  const [message, setMessage] = useState("Calendar opened on the booking window; unavailable dates are visible before selection.");

  const month = datePickerMonths[visibleMonth];
  const cells = buildDatePickerCells(month);
  const statusIsError = status === "error";

  const chooseIso = (iso: string) => {
    const reason = datePickerAvailability(iso);
    if (reason) {
      setStatus("error");
      setMessage(`${datePickerDisplay(iso)} cannot be booked: ${reason}.`);
      return;
    }
    setSelectedIso(iso);
    setTypedValue(datePickerDisplay(iso));
    setStatus("selected");
    setMessage(`Selected ${datePickerDisplay(iso)} from ${month.label}; form is not submitted yet.`);
  };

  const submit = () => {
    const parsed = parseDatePickerDisplay(typedValue);
    if (!parsed.iso) {
      setStatus("error");
      setMessage(parsed.message);
      return;
    }
    const reason = datePickerAvailability(parsed.iso);
    if (reason) {
      setStatus("error");
      setMessage(`${typedValue} is not available: ${reason}.`);
      return;
    }
    setSelectedIso(parsed.iso);
    setTypedValue(datePickerDisplay(parsed.iso));
    setStatus("submitted");
    setMessage(`Submitted canonical appointment date ${parsed.iso}.`);
  };

  return (
    <div className="quality-example date-picker-demo">
      <div className={`date-picker-status is-${status}`} role={statusIsError ? "alert" : "status"} aria-live="polite">
        <strong>{statusIsError ? "Date unavailable" : isOpen ? "Calendar picker open" : "Calendar picker closed"}</strong>
        <span>{message}</span>
      </div>
      <label className={statusIsError ? "date-picker-field has-error" : "date-picker-field"} htmlFor="date-picker-good-input">
        <span>{meta.field}</span>
        <small id="date-picker-good-hint">mm/dd/yyyy. Weekday appointments only between July 10 and August 21, 2026.</small>
        <div className="date-picker-input-row">
          <input id="date-picker-good-input" value={typedValue} aria-describedby="date-picker-good-hint date-picker-good-canonical" onChange={(event) => {
            setTypedValue(event.target.value);
            setStatus("typed");
            setMessage("Typed value is preserved and checked against the same booking rules on submit.");
          }} />
          <button type="button" className="demo-button small" aria-expanded={isOpen} onClick={() => {
            setIsOpen((current) => !current);
            setStatus("open");
            setMessage(isOpen ? "Calendar closed; the typed date remains editable." : "Calendar reopened with the selected date preserved.");
          }}>{isOpen ? "Close" : "Open"}</button>
        </div>
      </label>

      {isOpen && (
        <div className="date-picker-calendar" role="dialog" aria-label={`${month.label} appointment calendar`}>
          <div className="date-picker-calendar-header">
            <button type="button" className="demo-button tiny" disabled={visibleMonth === 0} onClick={() => {
              setVisibleMonth(0);
              setStatus("open");
              setMessage("Moved to July 2026; selected date and typed value are preserved.");
            }}>Prev</button>
            <strong>{month.label}</strong>
            <button type="button" className="demo-button tiny" disabled={visibleMonth === datePickerMonths.length - 1} onClick={() => {
              setVisibleMonth(1);
              setStatus("open");
              setMessage("Moved to August 2026; available weekdays remain selectable.");
            }}>Next</button>
          </div>
          <div className="date-picker-weekdays" aria-hidden="true">
            {datePickerWeekdays.map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="date-picker-grid" role="grid" aria-label={`${month.label} dates`}>
            {cells.map((cell, index) => {
              if (!cell) return <span key={`blank-${index}`} className="date-picker-day is-empty" aria-hidden="true" />;
              const className = [
                "date-picker-day",
                cell.isToday ? "is-today" : "",
                selectedIso === cell.iso ? "is-selected" : "",
                cell.isUnavailable ? "is-unavailable" : ""
              ].filter(Boolean).join(" ");
              return (
                <button
                  key={cell.iso}
                  type="button"
                  role="gridcell"
                  className={className}
                  aria-pressed={selectedIso === cell.iso}
                  aria-label={`${datePickerDisplay(cell.iso)}${cell.isUnavailable ? `, ${cell.unavailableReason}` : ""}`}
                  onClick={() => chooseIso(cell.iso)}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="date-picker-canonical" id="date-picker-good-canonical">
        <span>Visible value</span>
        <strong>{typedValue || "empty"}</strong>
        <span>Canonical value</span>
        <strong>{selectedIso || "not selected"}</strong>
      </div>

      <div className="demo-row date-picker-actions">
        <button type="button" className="demo-button small" onClick={() => {
          setVisibleMonth(1);
          chooseIso(meta.options[1]);
        }}>Choose Aug 11</button>
        <button type="button" className="demo-button small" onClick={() => {
          setVisibleMonth(0);
          chooseIso(meta.options[2]);
        }}>Try Saturday</button>
        <button type="button" className="demo-button small" onClick={() => {
          setTypedValue("07/16/2026");
          setSelectedIso("2026-07-16");
          setStatus("typed");
          setMessage("Typed fallback accepted a weekday inside the booking window.");
        }}>Type 07/16/2026</button>
        <button type="button" className="demo-button small" onClick={() => {
          setTypedValue("");
          setSelectedIso("");
          setStatus("cleared");
          setMessage("Date cleared; the field remains labelled and the calendar can reopen.");
        }}>Clear</button>
        <button type="button" className="demo-button small primary" onClick={submit}>Submit date</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function DatePickerBadUx({ meta }: { meta: PatternMeta }) {
  const [value, setValue] = useState("Today");
  const [month, setMonth] = useState("June 2026");
  const [message, setMessage] = useState("The picker is used for a remembered birthday, starts on the current month, and offers no reliable typed entry.");

  return (
    <div className="quality-example date-picker-demo">
      <div className="date-picker-bad-ui">
        <label>
          <span>{meta.field} repurposed as date of birth</span>
          <input value={value} onChange={(event) => setValue(event.target.value)} />
        </label>
        <div className="date-picker-calendar bad" aria-label={`${month} broken calendar`}>
          <div className="date-picker-calendar-header">
            <button type="button" className="demo-button tiny" onClick={() => {
              setMonth("May 2026");
              setMessage("Month changed but focus and selected date were not preserved.");
            }}>Prev</button>
            <strong>{month}</strong>
            <button type="button" className="demo-button tiny" onClick={() => {
              setMonth("July 2026");
              setMessage("The calendar keeps moving near today instead of the user's birth year.");
            }}>Next</button>
          </div>
          <div className="date-picker-grid bad" aria-hidden="true">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((day) => (
              <span key={day} className="date-picker-day">{day}</span>
            ))}
          </div>
        </div>
        <div className="demo-row date-picker-actions">
          <button type="button" className="demo-button small" onClick={() => {
            setValue("06/06/2026");
            setMessage("A Saturday appears selectable, then fails only after the user commits.");
          }}>Pick disabled day</button>
          <button type="button" className="demo-button small" onClick={() => {
            setMonth("Year picker");
            setMessage("The user must operate a separate year view for a date they already know.");
          }}>Navigate decades</button>
          <button type="button" className="demo-button small primary" onClick={() => {
            setMessage("The day auto-submitted before the rest of the form could be reviewed.");
          }}>Auto-submit day</button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

type DateRangeStatus = "open" | "start" | "end" | "preset" | "typed" | "error" | "applied" | "cancelled";

type DateRange = {
  start: string;
  end: string;
};

const dateRangeMinIso = "2026-08-01";

const dateRangeMaxIso = "2026-08-31";

const dateRangeMaxDays = 14;

function isoToUtcDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function daysBetweenInclusive(startIso: string, endIso: string) {
  const diff = isoToUtcDate(endIso).getTime() - isoToUtcDate(startIso).getTime();
  return Math.floor(diff / 86400000) + 1;
}

function parseRangeIso(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
    return { iso: "", message: "Use YYYY-MM-DD, for example 2026-08-14." };
  }
  const [year, month, day] = value.trim().split("-").map(Number);
  const candidate = new Date(Date.UTC(year, month - 1, day));
  const real =
    candidate.getUTCFullYear() === year &&
    candidate.getUTCMonth() === month - 1 &&
    candidate.getUTCDate() === day;
  if (!real) return { iso: "", message: "Enter a real calendar date." };
  return { iso: value.trim(), message: "" };
}

function validateDateRange(range: DateRange) {
  const start = parseRangeIso(range.start);
  if (!start.iso) return { valid: false, message: `Start date: ${start.message}` };
  const end = parseRangeIso(range.end);
  if (!end.iso) return { valid: false, message: `End date: ${end.message}` };
  if (start.iso < dateRangeMinIso) return { valid: false, message: "Start date must be on or after 2026-08-01." };
  if (end.iso > dateRangeMaxIso) return { valid: false, message: "End date must be on or before 2026-08-31." };
  if (end.iso < start.iso) return { valid: false, message: `End date ${end.iso} is before start date ${start.iso}.` };
  const days = daysBetweenInclusive(start.iso, end.iso);
  if (days > dateRangeMaxDays) return { valid: false, message: `Range is ${days} days; choose ${dateRangeMaxDays} days or fewer.` };
  return { valid: true, message: `Range covers ${days} inclusive days.` };
}

function buildDateRangeCells() {
  const cells: Array<{ day: number; iso: string } | null> = Array.from({ length: 6 }, () => null);
  for (let day = 1; day <= 31; day += 1) {
    cells.push({ day, iso: `2026-08-${padDatePart(day)}` });
  }
  return cells;
}

function DateRangePickerGoodUx({ meta }: { meta: PatternMeta }) {
  const [draftRange, setDraftRange] = useState<DateRange>({ start: meta.options[0], end: meta.options[1] });
  const [appliedRange, setAppliedRange] = useState<DateRange>({ start: meta.options[0], end: meta.options[1] });
  const [activeBoundary, setActiveBoundary] = useState<"start" | "end">("end");
  const [status, setStatus] = useState<DateRangeStatus>("open");
  const [message, setMessage] = useState("Start and end are visible as separate editable boundaries before Apply.");
  const validation = validateDateRange(draftRange);
  const cells = buildDateRangeCells();
  const hasError = status === "error";

  const updateBoundary = (boundary: "start" | "end", value: string) => {
    setDraftRange((current) => ({ ...current, [boundary]: value }));
    setActiveBoundary(boundary);
    setStatus("typed");
    setMessage(`${boundary === "start" ? "Start" : "End"} boundary changed; the other boundary is preserved.`);
  };

  const chooseDay = (iso: string) => {
    if (activeBoundary === "start") {
      setDraftRange((current) => ({ ...current, start: iso, end: current.end < iso ? iso : current.end }));
      setActiveBoundary("end");
      setStatus("start");
      setMessage(`Start set to ${iso}. Choose an end date to complete the range.`);
      return;
    }
    setDraftRange((current) => ({ ...current, end: iso }));
    setStatus("end");
    setMessage(`End set to ${iso}. Review the highlighted span before Apply.`);
  };

  const applyRange = () => {
    const result = validateDateRange(draftRange);
    if (!result.valid) {
      setStatus("error");
      setMessage(result.message);
      return;
    }
    setAppliedRange(draftRange);
    setStatus("applied");
    setMessage(`Applied ${draftRange.start} to ${draftRange.end}. ${result.message}`);
  };

  const setLastSevenDays = () => {
    const nextRange = { start: "2026-08-08", end: "2026-08-14" };
    setDraftRange(nextRange);
    setActiveBoundary("end");
    setStatus("preset");
    setMessage("Preset Last 7 days filled both endpoints and highlighted the included days.");
  };

  return (
    <div className="quality-example date-range-demo">
      <div className={`date-range-status is-${status}`} role={hasError ? "alert" : "status"} aria-live="polite">
        <strong>{hasError ? "Range needs correction" : status === "applied" ? "Range applied" : "Date range draft"}</strong>
        <span>{message}</span>
      </div>

      <div className={hasError ? "date-range-fields has-error" : "date-range-fields"}>
        <label htmlFor="date-range-start">
          <span>Since</span>
          <input id="date-range-start" value={draftRange.start} aria-describedby="date-range-good-hint date-range-good-summary" onFocus={() => setActiveBoundary("start")} onChange={(event) => updateBoundary("start", event.target.value)} />
        </label>
        <label htmlFor="date-range-end">
          <span>Until</span>
          <input id="date-range-end" value={draftRange.end} aria-describedby="date-range-good-hint date-range-good-summary" onFocus={() => setActiveBoundary("end")} onChange={(event) => updateBoundary("end", event.target.value)} />
        </label>
      </div>
      <small id="date-range-good-hint">YYYY-MM-DD. Maximum {dateRangeMaxDays} inclusive days in August 2026.</small>

      <div className="date-range-presets" aria-label="Common date ranges">
        <button type="button" className={status === "preset" ? "demo-button small primary" : "demo-button small"} onClick={setLastSevenDays}>Last 7 days</button>
        <button type="button" className="demo-button small" onClick={() => {
          setDraftRange({ start: "2026-08-01", end: "2026-08-14" });
          setActiveBoundary("end");
          setStatus("preset");
          setMessage("First half preset selected; Apply is still required before reports update.");
        }}>First half</button>
        <button type="button" className="demo-button small" onClick={() => {
          setDraftRange({ start: "2026-08-14", end: "2026-08-03" });
          setActiveBoundary("end");
          setStatus("error");
          setMessage("End date 2026-08-03 is before start date 2026-08-14.");
        }}>Reverse range</button>
        <button type="button" className="demo-button small" onClick={() => {
          setDraftRange({ start: "2026-08-01", end: "2026-08-31" });
          setActiveBoundary("end");
          setStatus("error");
          setMessage("Range is 31 days; choose 14 days or fewer.");
        }}>Too long</button>
      </div>

      <div className="date-range-calendar" role="dialog" aria-label="August 2026 date range calendar">
        <div className="date-picker-calendar-header">
          <button type="button" className="demo-button tiny" aria-label="Previous month" disabled>Prev</button>
          <strong>August 2026</strong>
          <button type="button" className="demo-button tiny" aria-label="Next month" disabled>Next</button>
        </div>
        <div className="date-picker-weekdays" aria-hidden="true">
          {datePickerWeekdays.map((day) => <span key={day}>{day}</span>)}
        </div>
        <div className="date-picker-grid" role="grid" aria-label="August 2026 report range">
          {cells.map((cell, index) => {
            if (!cell) return <span key={`blank-${index}`} className="date-picker-day is-empty" aria-hidden="true" />;
            const isStart = cell.iso === draftRange.start;
            const isEnd = cell.iso === draftRange.end;
            const isBetween = validation.valid && cell.iso > draftRange.start && cell.iso < draftRange.end;
            const isOutside = cell.iso < dateRangeMinIso || cell.iso > dateRangeMaxIso;
            const className = [
              "date-picker-day",
              isStart ? "is-range-start" : "",
              isEnd ? "is-range-end" : "",
              isBetween ? "is-in-range" : "",
              isOutside ? "is-unavailable" : ""
            ].filter(Boolean).join(" ");
            return (
              <button
                key={cell.iso}
                type="button"
                role="gridcell"
                className={className}
                aria-label={`${cell.iso}${isStart ? ", selected start" : ""}${isEnd ? ", selected end" : ""}${isBetween ? ", in selected range" : ""}`}
                onClick={() => chooseDay(cell.iso)}
                onMouseEnter={() => {
                  if (activeBoundary === "end" && cell.iso >= draftRange.start) {
                    setMessage(`Preview would include ${daysBetweenInclusive(draftRange.start, cell.iso)} days through ${cell.iso}.`);
                  }
                }}
              >
                {cell.day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="date-range-summary" id="date-range-good-summary">
        <span>Draft range</span>
        <strong>{draftRange.start} to {draftRange.end}</strong>
        <span>Applied range</span>
        <strong>{appliedRange.start} to {appliedRange.end}</strong>
        <span>Duration</span>
        <strong>{validation.valid ? validation.message : "not valid yet"}</strong>
      </div>

      <div className="demo-row date-range-actions">
        <button type="button" className="demo-button small" onClick={() => {
          setActiveBoundary("start");
          setMessage("Start boundary is active; the next calendar date will replace the start.");
        }}>Set start next</button>
        <button type="button" className="demo-button small" onClick={() => {
          setDraftRange(appliedRange);
          setStatus("cancelled");
          setMessage("Cancelled draft edits and restored the previously applied range.");
        }}>Cancel</button>
        <button type="button" className="demo-button small primary" onClick={applyRange}>Apply range</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function DateRangePickerBadUx({ meta }: { meta: PatternMeta }) {
  const [value, setValue] = useState("08/14/2026 - 08/03/2026");
  const [message, setMessage] = useState("The control stores two dates in one field and hides which boundary is wrong.");
  const [state, setState] = useState("Auto-applied");

  return (
    <div className="quality-example date-range-demo">
      <div className="date-range-bad-ui">
        <label>
          <span>{meta.field}</span>
          <input value={value} onChange={(event) => setValue(event.target.value)} />
        </label>
        <div className="textarea-status-grid bad">
          <div>
            <span>Update timing</span>
            <strong>{state}</strong>
          </div>
          <div>
            <span>Stored string</span>
            <strong>{value}</strong>
          </div>
        </div>
        <div className="demo-row date-range-actions">
          <button type="button" className="demo-button small" onClick={() => {
            setState("Negative span");
            setMessage("The end date is before the start date, but the dashboard still refreshed.");
          }}>Use reversed</button>
          <button type="button" className="demo-button small" onClick={() => {
            setState("No range band");
            setMessage("Only endpoints are marked, so users cannot verify included days.");
          }}>Hide included days</button>
          <button type="button" className="demo-button small primary" onClick={() => {
            setState("Auto-refreshing");
            setMessage("Results changed while the user was only hovering possible end dates.");
          }}>Auto apply hover</button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

type TimePickerStatus = "ready" | "filtered" | "selected" | "period" | "timezone" | "typed" | "error" | "submitted";

const timePickerSlots = [
  { display: "9:00 AM", hour: 9, minute: 0, available: true },
  { display: "9:30 AM", hour: 9, minute: 30, available: true },
  { display: "10:00 AM", hour: 10, minute: 0, available: true },
  { display: "10:30 AM", hour: 10, minute: 30, available: true },
  { display: "11:00 AM", hour: 11, minute: 0, available: true },
  { display: "11:30 AM", hour: 11, minute: 30, available: true },
  { display: "12:00 PM", hour: 12, minute: 0, available: false },
  { display: "12:30 PM", hour: 12, minute: 30, available: false },
  { display: "1:00 PM", hour: 13, minute: 0, available: true },
  { display: "1:30 PM", hour: 13, minute: 30, available: true },
  { display: "2:00 PM", hour: 14, minute: 0, available: true },
  { display: "2:30 PM", hour: 14, minute: 30, available: true },
  { display: "3:00 PM", hour: 15, minute: 0, available: true },
  { display: "3:30 PM", hour: 15, minute: 30, available: true },
  { display: "4:00 PM", hour: 16, minute: 0, available: true },
  { display: "4:30 PM", hour: 16, minute: 30, available: true },
  { display: "5:00 PM", hour: 17, minute: 0, available: true }
];

function canonicalTime(hour: number, minute: number) {
  return `${padDatePart(hour)}:${padDatePart(minute)}:00`;
}

function parseTimePickerText(value: string, period: string) {
  const trimmed = value.trim().toUpperCase();
  const match = trimmed.match(/^(\d{1,2})(?::?(\d{2}))?\s*(AM|PM)?$/);
  if (!match) return { valid: false, hour: 0, minute: 0, message: "Enter a time such as 9:30 AM or choose a slot." };
  const rawHour = Number(match[1]);
  const minute = match[2] ? Number(match[2]) : 0;
  const parsedPeriod = match[3] ?? period;
  if (rawHour < 1 || rawHour > 12 || minute < 0 || minute > 59) {
    return { valid: false, hour: 0, minute: 0, message: "Hour must be 1 to 12 and minutes must be 00 to 59." };
  }
  let hour = rawHour % 12;
  if (parsedPeriod === "PM") hour += 12;
  if (minute % 30 !== 0) {
    return { valid: false, hour, minute, message: "Minutes must be 00 or 30 for clinic appointments." };
  }
  if (hour < 9 || hour > 17 || (hour === 17 && minute > 0)) {
    return { valid: false, hour, minute, message: "Choose a time between 9:00 AM and 5:00 PM." };
  }
  const blocked = timePickerSlots.find((slot) => slot.hour === hour && slot.minute === minute && !slot.available);
  if (blocked) {
    return { valid: false, hour, minute, message: `${blocked.display} is unavailable.` };
  }
  return { valid: true, hour, minute, message: `Valid appointment time ${canonicalTime(hour, minute)}.` };
}

function TimePickerGoodUx({ meta }: { meta: PatternMeta }) {
  const [query, setQuery] = useState(meta.options[0]);
  const [period, setPeriod] = useState("AM");
  const [timezone, setTimezone] = useState(meta.options[2]);
  const [selected, setSelected] = useState({ display: meta.options[0], canonical: meta.options[1] });
  const [status, setStatus] = useState<TimePickerStatus>("ready");
  const [message, setMessage] = useState("Type to filter valid 30-minute clinic slots, then review AM/PM and timezone before submitting.");

  const normalizedQuery = query.toLowerCase().replace(/\s+/g, "");
  const filteredSlots = timePickerSlots.filter((slot) => {
    const normalizedSlot = slot.display.toLowerCase().replace(/\s+/g, "");
    return !normalizedQuery || normalizedSlot.includes(normalizedQuery) || normalizedSlot.replace(":", "").includes(normalizedQuery);
  }).slice(0, 7);
  const hasError = status === "error";

  const chooseSlot = (slot: (typeof timePickerSlots)[number]) => {
    if (!slot.available) {
      setStatus("error");
      setMessage(`${slot.display} is unavailable. Choose another 30-minute slot.`);
      return;
    }
    const nextPeriod = slot.hour >= 12 ? "PM" : "AM";
    setPeriod(nextPeriod);
    setQuery(slot.display);
    setSelected({ display: slot.display, canonical: canonicalTime(slot.hour, slot.minute) });
    setStatus("selected");
    setMessage(`${slot.display} selected. Form is not submitted until you confirm the timezone.`);
  };

  const submit = () => {
    const result = parseTimePickerText(query, period);
    if (!result.valid) {
      setStatus("error");
      setMessage(result.message);
      return;
    }
    const canonical = canonicalTime(result.hour, result.minute);
    setSelected({ display: query, canonical });
    setStatus("submitted");
    setMessage(`Submitted ${canonical} ${timezone}.`);
  };

  return (
    <div className="quality-example time-picker-demo">
      <div className={`time-picker-status is-${status}`} role={hasError ? "alert" : "status"} aria-live="polite">
        <strong>{hasError ? "Time needs correction" : status === "submitted" ? "Time submitted" : "Time picker ready"}</strong>
        <span>{message}</span>
      </div>
      <label className={hasError ? "time-picker-field has-error" : "time-picker-field"} htmlFor="time-picker-good-input">
        <span>{meta.field}</span>
        <small id="time-picker-good-hint">Type to filter 30-minute slots from 9:00 AM to 5:00 PM.</small>
        <input id="time-picker-good-input" value={query} aria-describedby="time-picker-good-hint time-picker-good-canonical" onChange={(event) => {
          setQuery(event.target.value);
          setStatus("filtered");
          setMessage(`Filtering options for "${event.target.value}".`);
        }} />
      </label>

      <div className="time-picker-controls">
        <label>
          <span>AM/PM</span>
          <select value={period} onChange={(event) => {
            setPeriod(event.target.value);
            setStatus("period");
            setMessage(`Period changed to ${event.target.value}; minutes and timezone are preserved.`);
          }}>
            <option>AM</option>
            <option>PM</option>
          </select>
        </label>
        <label>
          <span>Timezone</span>
          <select value={timezone} onChange={(event) => {
            setTimezone(event.target.value);
            setStatus("timezone");
            setMessage(`Timezone changed to ${event.target.value}; local clock time is preserved.`);
          }}>
            <option value="America/New_York">Eastern</option>
            <option value="America/Chicago">Central</option>
            <option value="America/Los_Angeles">Pacific</option>
          </select>
        </label>
      </div>

      <div className="time-picker-options" aria-label="Filtered appointment times">
        {filteredSlots.length === 0 ? (
          <span className="is-empty">No matching appointment times.</span>
        ) : filteredSlots.map((slot) => (
          <button
            type="button"
            key={slot.display}
            className={slot.display === selected.display ? "is-selected" : slot.available ? "" : "is-unavailable"}
            aria-label={`${slot.display}${slot.available ? "" : ", unavailable"}`}
            onClick={() => chooseSlot(slot)}
          >
            {slot.display}{slot.available ? "" : " unavailable"}
          </button>
        ))}
      </div>

      <div className="time-picker-canonical" id="time-picker-good-canonical">
        <span>Display value</span>
        <strong>{query || "empty"}</strong>
        <span>Canonical time</span>
        <strong>{selected.canonical}</strong>
        <span>Timezone</span>
        <strong>{timezone}</strong>
      </div>

      <div className="demo-row time-picker-actions">
        <button type="button" className="demo-button small" onClick={() => {
          setQuery("9");
          setStatus("filtered");
          setMessage("Filtering shows nearby 9 AM appointment choices.");
        }}>Filter 9</button>
        <button type="button" className="demo-button small" onClick={() => {
          setQuery("09:45");
          setStatus("error");
          setMessage("Minutes must be 00 or 30 for clinic appointments.");
        }}>Try 09:45</button>
        <button type="button" className="demo-button small" onClick={() => {
          setQuery("6:00 PM");
          setPeriod("PM");
          setStatus("error");
          setMessage("Choose a time between 9:00 AM and 5:00 PM.");
        }}>After hours</button>
        <button type="button" className="demo-button small" onClick={() => chooseSlot(timePickerSlots[6])}>Try noon</button>
        <button type="button" className="demo-button small primary" onClick={submit}>Submit time</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function TimePickerBadUx({ meta }: { meta: PatternMeta }) {
  const [value, setValue] = useState("930");
  const [message, setMessage] = useState("The field does not say whether 930 means 9:30 AM, 9:30 PM, or a timezone-specific time.");
  const [state, setState] = useState("Ambiguous");

  return (
    <div className="quality-example time-picker-demo">
      <div className="time-picker-bad-ui">
        <label>
          <span>{meta.field}</span>
          <input value={value} onChange={(event) => setValue(event.target.value)} />
        </label>
        <div className="textarea-status-grid bad">
          <div>
            <span>Interpretation</span>
            <strong>{state}</strong>
          </div>
          <div>
            <span>Stored value</span>
            <strong>{value}</strong>
          </div>
        </div>
        <div className="demo-row time-picker-actions">
          <button type="button" className="demo-button small" onClick={() => {
            setValue("2:00");
            setState("No period");
            setMessage("The service could book 2:00 AM or 2:00 PM because no AM/PM selector exists.");
          }}>No AM/PM</button>
          <button type="button" className="demo-button small" onClick={() => {
            setValue("09:45");
            setState("Bad step");
            setMessage("The value is off the 30-minute schedule but the field only says Invalid time.");
          }}>Bad step</button>
          <button type="button" className="demo-button small primary" onClick={() => {
            setState("Auto-submitted");
            setMessage("The form booked immediately when the user highlighted an option.");
          }}>Auto-submit</button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

type UploadStatus = "empty" | "selected" | "uploading" | "uploaded" | "error" | "removed" | "submitted";

type DemoUploadFile = {
  name: string;
  type: string;
  sizeMb: number;
};

const allowedUploadTypes = ["PDF", "PNG", "JPG"];

function formatFileSize(sizeMb: number) {
  return `${sizeMb.toFixed(sizeMb % 1 === 0 ? 0 : 1)} MB`;
}

function FileUploadGoodUx({ meta }: { meta: PatternMeta }) {
  const [file, setFile] = useState<DemoUploadFile | null>({ name: "bank-statement.pdf", type: "PDF", sizeMb: 2.4 });
  const [status, setStatus] = useState<UploadStatus>("selected");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("A selected file is listed before upload starts, with size and type visible.");

  const hasError = status === "error";
  const validFile = file && allowedUploadTypes.includes(file.type) && file.sizeMb <= 10;

  const chooseFile = (nextFile: DemoUploadFile) => {
    setFile(nextFile);
    setProgress(0);
    if (!allowedUploadTypes.includes(nextFile.type)) {
      setStatus("error");
      setMessage(`${nextFile.name} is a ${nextFile.type} file. Upload a PDF, PNG, or JPG.`);
      return;
    }
    if (nextFile.sizeMb > 10) {
      setStatus("error");
      setMessage(`${nextFile.name} is ${formatFileSize(nextFile.sizeMb)}. Maximum file size is 10 MB.`);
      return;
    }
    setStatus("selected");
    setMessage(`${nextFile.name} selected. It is not submitted until upload and final review finish.`);
  };

  const startUpload = () => {
    if (!file) {
      setStatus("error");
      setMessage("Choose a PDF, PNG, or JPG file before uploading.");
      return;
    }
    if (!validFile) {
      setStatus("error");
      setMessage("Fix the file type or size before uploading.");
      return;
    }
    setStatus("uploading");
    setProgress(62);
    setMessage(`${file.name} is uploading. Keep this page open.`);
  };

  const finishUpload = () => {
    if (!file || !validFile) {
      setStatus("error");
      setMessage("The selected file still needs correction before it can be uploaded.");
      return;
    }
    setStatus("uploaded");
    setProgress(100);
    setMessage(`${file.name} uploaded and ready for final form submission.`);
  };

  const removeFile = () => {
    const removedName = file?.name ?? "selected file";
    setFile(null);
    setProgress(0);
    setStatus("removed");
    setMessage(`${removedName} removed. Other answers on the form are unchanged.`);
  };

  const retryUpload = () => {
    if (!file) {
      chooseFile({ name: "bank-statement.pdf", type: "PDF", sizeMb: 2.4 });
      setMessage("A replacement PDF is selected for retry.");
      return;
    }
    setStatus("uploading");
    setProgress(48);
    setMessage(`Retrying upload for ${file.name}; filename and form answers stay visible.`);
  };

  const submitWithFile = () => {
    if (status !== "uploaded" || !file) {
      setStatus("error");
      setMessage("Upload a valid file before submitting this application.");
      return;
    }
    setStatus("submitted");
    setMessage(`Submitted with ${file.name} attached.`);
  };

  return (
    <div className="quality-example file-upload-demo">
      <div className={`file-upload-status is-${status}`} role={hasError ? "alert" : "status"} aria-live="polite">
        <strong>{hasError ? "Upload needs correction" : status === "submitted" ? "Application submitted" : "File upload status"}</strong>
        <span>{message}</span>
      </div>

      <label className={hasError ? "file-upload-field has-error" : "file-upload-field"} htmlFor="file-upload-good-input">
        <span>{meta.field}</span>
        <small id="file-upload-good-hint">PDF, PNG, or JPG up to 10 MB. Upload happens before final submit.</small>
        <input id="file-upload-good-input" type="file" aria-describedby="file-upload-good-hint file-upload-good-summary" />
      </label>

      <div className={file ? `file-upload-card is-${status}` : "file-upload-card is-empty"} id="file-upload-good-summary">
        {file ? (
          <>
            <strong>{file.name}</strong>
            <span>{file.type} - {formatFileSize(file.sizeMb)}</span>
            <span>{status === "uploading" ? `Uploading ${progress}%` : status === "uploaded" || status === "submitted" ? "Uploaded" : status === "error" ? "Needs correction" : "Selected locally"}</span>
            <button type="button" className="demo-button tiny" onClick={removeFile}>Remove</button>
          </>
        ) : (
          <>
            <strong>No file selected</strong>
            <span>Choose one required evidence file.</span>
          </>
        )}
      </div>

      <div className="file-upload-progress" aria-label="Upload progress">
        <span style={{ width: `${status === "uploaded" || status === "submitted" ? 100 : progress}%` }} />
      </div>

      <div className="demo-row file-upload-actions">
        <button type="button" className="demo-button small" onClick={() => chooseFile({ name: "bank-statement.pdf", type: "PDF", sizeMb: 2.4 })}>Select PDF</button>
        <button type="button" className="demo-button small" onClick={startUpload}>Start upload</button>
        <button type="button" className="demo-button small" onClick={finishUpload}>Finish upload</button>
        <button type="button" className="demo-button small" onClick={() => chooseFile({ name: "statement.heic", type: "HEIC", sizeMb: 3.1 })}>Wrong type</button>
        <button type="button" className="demo-button small" onClick={() => chooseFile({ name: "full-account-scan.pdf", type: "PDF", sizeMb: 28 })}>Too large</button>
        <button type="button" className="demo-button small" onClick={retryUpload}>Retry</button>
        <button type="button" className="demo-button small primary" onClick={submitWithFile}>Submit with file</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function FileUploadBadUx({ meta }: { meta: PatternMeta }) {
  const [filename, setFilename] = useState("scan-final-final2");
  const [state, setState] = useState("Maybe selected");
  const [message, setMessage] = useState("The upload UI hides requirements and does not distinguish selected from uploaded.");

  return (
    <div className="quality-example file-upload-demo">
      <div className="file-upload-bad-ui">
        <label>
          <span>{meta.field}</span>
          <input aria-label="Unclear file upload" value={filename} onChange={(event) => setFilename(event.target.value)} />
        </label>
        <div className="textarea-status-grid bad">
          <div>
            <span>State</span>
            <strong>{state}</strong>
          </div>
          <div>
            <span>File text</span>
            <strong>{filename || "blank"}</strong>
          </div>
        </div>
        <div className="demo-row file-upload-actions">
          <button type="button" className="demo-button small" onClick={() => {
            setState("Missing requirements");
            setMessage("The user is told Upload failed only after selecting a format the service never allowed.");
          }}>Fail after browse</button>
          <button type="button" className="demo-button small" onClick={() => {
            setFilename("");
            setState("Cleared");
            setMessage("A recoverable error cleared the selected file and gives no retry path.");
          }}>Clear on error</button>
          <button type="button" className="demo-button small primary" onClick={() => {
            setState("False done");
            setMessage("The local filename is treated as final submission even though no upload or review completed.");
          }}>Continue anyway</button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

type DragDropStatus = "idle" | "over" | "dropped" | "rejected" | "left" | "fallback" | "uploading" | "uploaded" | "removed";

type DroppedDemoFile = {
  name: string;
  type: string;
  sizeMb: number;
  state: "queued" | "uploading" | "uploaded";
};

function DragAndDropUploadGoodUx({ meta }: { meta: PatternMeta }) {
  const [status, setStatus] = useState<DragDropStatus>("idle");
  const [files, setFiles] = useState<DroppedDemoFile[]>([]);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Drop zone is idle. Users can drag files here or activate Choose files.");

  const zoneClass = `drag-drop-zone is-${status}`;
  const hasFiles = files.length > 0;

  const queueFiles = (nextFiles: DroppedDemoFile[], source: "drop" | "fallback") => {
    setFiles(nextFiles);
    setProgress(0);
    setStatus(source === "drop" ? "dropped" : "fallback");
    setMessage(source === "drop" ? `${nextFiles.length} files dropped and queued for review.` : `${nextFiles.length} files selected through the fallback file picker.`);
  };

  const dragOver = () => {
    setStatus("over");
    setMessage("Files are over the target; releasing here will queue them without submitting.");
  };

  const rejectDrag = () => {
    setStatus("rejected");
    setMessage("That drag contains a link, not a file. Drop PDF, PNG, or JPG files only.");
  };

  const leaveTarget = () => {
    setStatus("left");
    setMessage("Drag cancelled by leaving the target. No file was queued.");
  };

  const uploadQueued = () => {
    if (!hasFiles) {
      setStatus("rejected");
      setMessage("Drop or choose at least one file before uploading.");
      return;
    }
    setFiles((current) => current.map((file) => ({ ...file, state: "uploading" })));
    setProgress(64);
    setStatus("uploading");
    setMessage("Queued files are uploading; final form submit is still separate.");
  };

  const finishUpload = () => {
    if (!hasFiles) {
      setStatus("rejected");
      setMessage("No files are queued yet.");
      return;
    }
    setFiles((current) => current.map((file) => ({ ...file, state: "uploaded" })));
    setProgress(100);
    setStatus("uploaded");
    setMessage("Dropped files uploaded and remain reviewable before final submit.");
  };

  const removeFirst = () => {
    const removed = files[0]?.name ?? "queued file";
    setFiles((current) => current.slice(1));
    setStatus("removed");
    setMessage(`${removed} removed. Other queued files and form answers remain.`);
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragOver();
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    if (status !== "over") dragOver();
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (event.currentTarget === event.target) {
      leaveTarget();
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const dropped = [...event.dataTransfer.files].map((file) => ({
      name: file.name,
      type: file.type.includes("png") ? "PNG" : file.type.includes("jpeg") ? "JPG" : "PDF",
      sizeMb: Math.max(0.1, file.size / 1024 / 1024),
      state: "queued" as const
    }));
    if (dropped.length === 0) {
      rejectDrag();
      return;
    }
    queueFiles(dropped, "drop");
  };

  return (
    <div className="quality-example drag-drop-demo">
      <div className={`drag-drop-status is-${status}`} role={status === "rejected" ? "alert" : "status"} aria-live="polite">
        <strong>{status === "rejected" ? "Drop rejected" : status === "uploaded" ? "Files uploaded" : "Drop zone status"}</strong>
        <span>{message}</span>
      </div>

      <div
        className={zoneClass}
        role="button"
        tabIndex={0}
        aria-describedby="drag-drop-good-hint drag-drop-good-list"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <strong>{meta.field}</strong>
        <span id="drag-drop-good-hint">Drag PDF, PNG, or JPG files here, or choose files. Maximum 3 files, 10 MB each.</span>
        <button
          type="button"
          className="demo-button small"
          onClick={() => queueFiles([
            { name: "lease.pdf", type: "PDF", sizeMb: 1.8, state: "queued" },
            { name: "income-proof.png", type: "PNG", sizeMb: 3.2, state: "queued" }
          ], "fallback")}
        >
          Choose files
        </button>
      </div>

      <div className={hasFiles ? "drag-drop-file-list" : "drag-drop-file-list is-empty"} id="drag-drop-good-list">
        {hasFiles ? files.map((file) => (
          <div key={file.name} className={`drag-drop-file is-${file.state}`}>
            <strong>{file.name}</strong>
            <span>{file.type} - {formatFileSize(file.sizeMb)} - {file.state}</span>
          </div>
        )) : (
          <span>No files queued.</span>
        )}
      </div>

      <div className="file-upload-progress" aria-label="Dropped file upload progress">
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="demo-row drag-drop-actions">
        <button type="button" className="demo-button small" onClick={dragOver}>Drag over</button>
        <button
          type="button"
          className="demo-button small"
          onClick={() => queueFiles([
            { name: "lease.pdf", type: "PDF", sizeMb: 1.8, state: "queued" },
            { name: "income-proof.png", type: "PNG", sizeMb: 3.2, state: "queued" }
          ], "drop")}
        >
          Drop files
        </button>
        <button type="button" className="demo-button small" onClick={rejectDrag}>Drop link</button>
        <button type="button" className="demo-button small" onClick={leaveTarget}>Leave zone</button>
        <button type="button" className="demo-button small" onClick={uploadQueued}>Upload queued</button>
        <button type="button" className="demo-button small" onClick={finishUpload}>Finish upload</button>
        <button type="button" className="demo-button small" onClick={removeFirst}>Remove first</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function DragAndDropUploadBadUx({ meta }: { meta: PatternMeta }) {
  const [state, setState] = useState("Invisible target");
  const [message, setMessage] = useState("The page acts like a drop target but gives no reliable fallback or cancellation path.");

  return (
    <div className="quality-example drag-drop-demo">
      <div className="drag-drop-bad-ui">
        <div className="drag-drop-zone bad" aria-hidden="true">
          <strong>{meta.field}</strong>
          <span>Drag files here</span>
        </div>
        <div className="textarea-status-grid bad">
          <div>
            <span>Drop behavior</span>
            <strong>{state}</strong>
          </div>
          <div>
            <span>Fallback</span>
            <strong>None</strong>
          </div>
        </div>
        <div className="demo-row drag-drop-actions">
          <button type="button" className="demo-button small" onClick={() => {
            setState("Browser opened file");
            setMessage("Dropping outside the tiny target navigated to the file and lost unsaved form data.");
          }}>Miss target</button>
          <button type="button" className="demo-button small" onClick={() => {
            setState("Mobile blocked");
            setMessage("A mobile user sees drag instructions but no Choose files button.");
          }}>Try mobile</button>
          <button type="button" className="demo-button small primary" onClick={() => {
            setState("Auto-submitted");
            setMessage("The file was submitted immediately after drop with no review, remove, or undo.");
          }}>Auto-submit drop</button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

type BulkImportPhase = "uploaded" | "mapped" | "mapping-error" | "validated" | "duplicates" | "partial" | "confirmed" | "importing" | "complete" | "exported";

type BulkImportMapping = {
  source: string;
  target: string;
  required: boolean;
  status: "mapped" | "missing" | "ignored";
  sample: string;
};

function BulkImportGoodUx({ meta }: { meta: PatternMeta }) {
  const [phase, setPhase] = useState<BulkImportPhase>("uploaded");
  const [progress, setProgress] = useState(0);
  const [importValidRowsOnly, setImportValidRowsOnly] = useState(false);
  const [message, setMessage] = useState("File parsed but no records have been created. Review mappings before validation.");
  const [mappings, setMappings] = useState<BulkImportMapping[]>([
    { source: "Email", target: "Email address", required: true, status: "mapped", sample: "alex@example.com" },
    { source: "Name", target: "Full name", required: true, status: "mapped", sample: "Alex Kim" },
    { source: "Role", target: "Access role", required: true, status: "mapped", sample: "Manager" },
    { source: "Dept", target: "Not imported", required: false, status: "missing", sample: "Finance" }
  ]);

  const hasValidationResults = !["uploaded", "mapped", "mapping-error"].includes(phase);
  const invalidRows = hasValidationResults ? 62 : 0;
  const duplicateRows = phase === "duplicates" || phase === "partial" || phase === "confirmed" || phase === "importing" || phase === "complete" || phase === "exported" ? 20 : 0;
  const importedRows = phase === "complete" || phase === "exported" ? 1138 : 0;
  const hasMissingRequired = mappings.some((mapping) => mapping.required && mapping.status !== "mapped");
  const isAlert = phase === "mapping-error";

  const resetFile = () => {
    setPhase("uploaded");
    setProgress(0);
    setImportValidRowsOnly(false);
    setMappings([
      { source: "Email", target: "Email address", required: true, status: "mapped", sample: "alex@example.com" },
      { source: "Name", target: "Full name", required: true, status: "mapped", sample: "Alex Kim" },
      { source: "Role", target: "Access role", required: true, status: "mapped", sample: "Manager" },
      { source: "Dept", target: "Not imported", required: false, status: "missing", sample: "Finance" }
    ]);
    setMessage("team-members.csv parsed again. Nothing has been imported yet.");
  };

  const autoMapColumns = () => {
    setMappings((current) => current.map((mapping) => mapping.source === "Dept" ? { ...mapping, target: "Department", status: "mapped" } : mapping));
    setPhase("mapped");
    setMessage("Auto-map matched Dept to Department and kept all required fields visible.");
  };

  const removeRequiredMapping = () => {
    setMappings((current) => current.map((mapping) => mapping.source === "Role" ? { ...mapping, target: "Not imported", status: "missing" } : mapping));
    setPhase("mapping-error");
    setMessage("Access role is required. Map Role before validation or the import cannot start.");
  };

  const fixRequiredMapping = () => {
    setMappings((current) => current.map((mapping) => mapping.source === "Role" ? { ...mapping, target: "Access role", status: "mapped" } : mapping));
    setPhase("mapped");
    setMessage("Required Role mapping restored. The importer can validate rows again.");
  };

  const validateRows = () => {
    if (hasMissingRequired) {
      setPhase("mapping-error");
      setMessage("Validation is blocked until every required target field has a source column.");
      return;
    }
    setPhase("validated");
    setProgress(0);
    setMessage("Validation found 1,138 valid rows, 42 missing roles, and 20 duplicate external IDs.");
  };

  const reviewDuplicates = () => {
    setPhase("duplicates");
    setMessage("Duplicate review uses external_id as the match key and will skip conflicting rows unless confirmed.");
  };

  const allowValidRowsOnly = () => {
    setImportValidRowsOnly(true);
    setPhase("partial");
    setMessage("Valid-row-only mode will import 1,138 rows and export 62 rows for repair.");
  };

  const confirmImport = () => {
    if (!importValidRowsOnly) {
      setPhase("validated");
      setMessage("Choose whether invalid rows block the import or are excluded before confirming.");
      return;
    }
    setPhase("confirmed");
    setMessage("Ready to import: 960 new, 178 updates, 62 excluded, 20 duplicates skipped, no welcome emails.");
  };

  const runImport = () => {
    if (phase !== "confirmed") {
      setMessage("Confirm counts and side effects before starting the irreversible import job.");
      return;
    }
    setPhase("importing");
    setProgress(72);
    setMessage("Import job running. Mapping and validation choices are saved to import history.");
  };

  const finishImport = () => {
    setPhase("complete");
    setProgress(100);
    setMessage("Import complete: 1,138 records changed, 62 rows excluded, result report available.");
  };

  const exportErrors = () => {
    setPhase("exported");
    setMessage("Downloaded error report with row numbers, source values, target fields, and repair reasons.");
  };

  return (
    <div className="quality-example bulk-import-demo">
      <div className={`bulk-import-summary is-${phase}`} role={isAlert ? "alert" : "status"} aria-live="polite">
        <strong>{phase === "complete" || phase === "exported" ? "Import report" : phase === "mapping-error" ? "Mapping needs correction" : "Bulk import status"}</strong>
        <span>{message}</span>
      </div>

      <div className="bulk-import-stage-row" aria-label="Import stages">
        {["Template", "Upload", "Map", "Validate", "Confirm", "Report"].map((stage, index) => {
          const currentIndex = phase === "uploaded" ? 1 : phase === "mapped" || phase === "mapping-error" ? 2 : phase === "validated" || phase === "duplicates" || phase === "partial" ? 3 : phase === "confirmed" || phase === "importing" ? 4 : 5;
          return <span key={stage} className={index < currentIndex ? "is-complete" : index === currentIndex ? "is-current" : undefined}>{stage}</span>;
        })}
      </div>

      <div className="bulk-import-file-card">
        <div>
          <strong>{meta.field}</strong>
          <span>{meta.options[0]} - 1,200 rows - 4 columns - UTF-8 CSV</span>
        </div>
        <button type="button" className="demo-button tiny" onClick={resetFile}>Replace file</button>
      </div>

      <div className="bulk-import-metrics" aria-label="Import counts">
        <div>
          <span>Valid rows</span>
          <strong>{hasValidationResults ? "1,138" : "Not checked"}</strong>
        </div>
        <div>
          <span>Invalid rows</span>
          <strong>{invalidRows}</strong>
        </div>
        <div>
          <span>Duplicates</span>
          <strong>{duplicateRows}</strong>
        </div>
        <div>
          <span>Imported</span>
          <strong>{importedRows}</strong>
        </div>
      </div>

      <div className="bulk-import-map-preview" role="table" aria-label="Column mapping preview">
        {mappings.map((mapping) => (
          <div key={mapping.source} className={`bulk-import-map-row is-${mapping.status}`} role="row">
            <span role="cell">{mapping.source}</span>
            <strong role="cell">{mapping.target}</strong>
            <small role="cell">{mapping.required ? "required" : "optional"} - sample: {mapping.sample}</small>
          </div>
        ))}
      </div>

      <div className="bulk-import-errors" aria-label="Validation issues">
        <div>
          <strong>Row 28</strong>
          <span>Role is blank. Choose a valid access role before importing this row.</span>
        </div>
        <div>
          <strong>Row 304</strong>
          <span>external_id E-482 already exists. Skip duplicate or update existing record.</span>
        </div>
        <div>
          <strong>Row 918</strong>
          <span>Department "Fin Ops" is not a known team. Map to Finance Operations or export for repair.</span>
        </div>
      </div>

      <div className="file-upload-progress" aria-label="Import progress">
        <span style={{ width: `${progress}%` }} />
      </div>

      <label className="bulk-import-toggle">
        <input type="checkbox" checked={importValidRowsOnly} onChange={allowValidRowsOnly} />
        <span>Import valid rows and export invalid rows for repair</span>
      </label>

      <div className="demo-row bulk-import-actions">
        <button type="button" className="demo-button small" onClick={autoMapColumns}>Auto-map</button>
        <button type="button" className="demo-button small" onClick={removeRequiredMapping}>Break required map</button>
        <button type="button" className="demo-button small" onClick={fixRequiredMapping}>Fix map</button>
        <button type="button" className="demo-button small" onClick={validateRows}>Validate rows</button>
        <button type="button" className="demo-button small" onClick={reviewDuplicates}>Review duplicates</button>
        <button type="button" className="demo-button small" onClick={allowValidRowsOnly}>Valid rows only</button>
        <button type="button" className="demo-button small" onClick={confirmImport}>Confirm counts</button>
        <button type="button" className="demo-button small primary" onClick={runImport}>Start import</button>
        <button type="button" className="demo-button small" onClick={finishImport}>Finish job</button>
        <button type="button" className="demo-button small" onClick={exportErrors}>Export errors</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function BulkImportBadUx({ meta }: { meta: PatternMeta }) {
  const [state, setState] = useState("Uploaded");
  const [message, setMessage] = useState("The importer treats a structured spreadsheet like an opaque file upload.");

  return (
    <div className="quality-example bulk-import-demo">
      <div className="bulk-import-bad-ui">
        <div className="bulk-import-file-card bad">
          <div>
            <strong>{meta.field}</strong>
            <span>team-members-final-v7.csv</span>
          </div>
          <button type="button" className="demo-button tiny">Upload</button>
        </div>
        <div className="textarea-status-grid bad">
          <div>
            <span>State</span>
            <strong>{state}</strong>
          </div>
          <div>
            <span>Mapping</span>
            <strong>Hidden</strong>
          </div>
        </div>
        <div className="demo-row bulk-import-actions">
          <button type="button" className="demo-button small" onClick={() => {
            setState("Auto-imported");
            setMessage("Records changed immediately after upload with no mapping, duplicate review, or confirmation.");
          }}>Auto-import</button>
          <button type="button" className="demo-button small" onClick={() => {
            setState("Generic failure");
            setMessage("The user sees invalid CSV but no row numbers, column names, or corrected-file export.");
          }}>Show error</button>
          <button type="button" className="demo-button small primary" onClick={() => {
            setState("Overwrite unknown");
            setMessage("Blank cells overwrite existing data because update behavior was not shown before commit.");
          }}>Overwrite data</button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

type ReviewSubmitState = "review" | "editing-contact" | "returned" | "stale" | "rechecked" | "submitted";

function ReviewBeforeSubmitGoodUx({ meta }: { meta: PatternMeta }) {
  const [state, setState] = useState<ReviewSubmitState>("review");
  const [email, setEmail] = useState("alex@example.com");
  const [phoneProvided, setPhoneProvided] = useState(false);
  const [eligible, setEligible] = useState(true);
  const [evidenceFresh, setEvidenceFresh] = useState(true);
  const [message, setMessage] = useState("Review captured answers before sending. Change links keep return context.");

  const stale = !evidenceFresh;
  const submitBlocked = stale || state === "editing-contact";

  const changeContact = () => {
    setState("editing-contact");
    setMessage("Email answer opened with the saved value pre-populated. Saving returns directly to review.");
  };

  const saveContact = () => {
    setState("returned");
    setMessage(`${email} saved. Returned directly to review without repeating unrelated pages.`);
  };

  const changeEligibility = () => {
    setEligible((current) => !current);
    setEvidenceFresh(false);
    setState("stale");
    setMessage("Eligibility changed, so the evidence answer is stale and final submit is blocked.");
  };

  const recheckEvidence = () => {
    setEvidenceFresh(true);
    setState("rechecked");
    setMessage("Evidence section reviewed again. The final send action is available.");
  };

  const markPhoneNotProvided = () => {
    setPhoneProvided(false);
    setMessage("Optional phone remains visible as Not provided so the absence can be reviewed.");
  };

  const submitClaim = () => {
    if (submitBlocked) {
      setMessage(stale ? "Review stale evidence before sending the claim." : "Save the open answer before sending.");
      return;
    }
    setState("submitted");
    setMessage("Claim sent. The next page is a confirmation receipt, not another editable review.");
  };

  return (
    <div className="quality-example review-submit-demo" aria-label={meta.field}>
      <div className={`review-submit-summary is-${state}`} role={submitBlocked ? "alert" : "status"} aria-live="polite">
        <strong>{state === "submitted" ? "Claim sent" : submitBlocked ? "Review needs attention" : "Ready to send"}</strong>
        <span>{message}</span>
      </div>

      {state === "editing-contact" ? (
        <div className="review-submit-edit">
          <label htmlFor="review-submit-email">
            <span>Email address</span>
            <input id="review-submit-email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <div className="demo-row review-submit-actions">
            <button type="button" className="demo-button small primary" onClick={saveContact}>Save and return to review</button>
            <button type="button" className="demo-button small" onClick={() => {
              setState("review");
              setMessage("Cancelled the edit. Review answers are unchanged.");
            }}>Cancel change</button>
          </div>
        </div>
      ) : (
        <>
          <div className="review-submit-section">
            <h4>Applicant</h4>
            <div className="review-submit-row">
              <span>Eligible for housing support</span>
              <strong>{eligible ? "Yes" : "No, needs alternate route"}</strong>
              <button type="button" className="demo-button tiny" onClick={changeEligibility}>Change eligibility</button>
            </div>
            <div className="review-submit-row">
              <span>National Insurance number</span>
              <strong>QQ 12 34 56 C</strong>
              <button type="button" className="demo-button tiny">Change NI number</button>
            </div>
          </div>

          <div className="review-submit-section">
            <h4>Contact details</h4>
            <div className="review-submit-row">
              <span>Email address</span>
              <strong>{email}</strong>
              <button type="button" className="demo-button tiny" onClick={changeContact}>Change email</button>
            </div>
            <div className="review-submit-row">
              <span>Phone number</span>
              <strong>{phoneProvided ? "07700 900123" : "Not provided"}</strong>
              <button type="button" className="demo-button tiny" onClick={markPhoneNotProvided}>Keep not provided</button>
            </div>
          </div>

          <div className={stale ? "review-submit-section is-stale" : "review-submit-section"}>
            <h4>Evidence</h4>
            <div className="review-submit-row">
              <span>Rent evidence</span>
              <strong>{stale ? "Needs review after eligibility change" : "lease.pdf"}</strong>
              <button type="button" className="demo-button tiny" onClick={recheckEvidence}>Review evidence</button>
            </div>
          </div>

          <label className="review-submit-declaration">
            <input type="checkbox" checked readOnly />
            <span>I confirm these answers are correct to the best of my knowledge.</span>
          </label>
        </>
      )}

      <div className="demo-row review-submit-actions">
        <button type="button" className="demo-button small" onClick={changeContact}>Change contact</button>
        <button type="button" className="demo-button small" onClick={changeEligibility}>Change eligibility</button>
        <button type="button" className="demo-button small" onClick={recheckEvidence}>Recheck evidence</button>
        <button type="button" className="demo-button small" onClick={markPhoneNotProvided}>Show not provided</button>
        <button type="button" className="demo-button small primary" onClick={submitClaim}>Send claim</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function ReviewBeforeSubmitBadUx({ meta }: { meta: PatternMeta }) {
  const [state, setState] = useState("Generic review");
  const [message, setMessage] = useState("This page appears to be a review but hides answers, change routes, and submit consequences.");

  return (
    <div className="quality-example review-submit-demo">
      <div className="review-submit-bad-ui">
        <strong>{meta.field}</strong>
        <p>Everything looks fine.</p>
        <div className="textarea-status-grid bad">
          <div>
            <span>State</span>
            <strong>{state}</strong>
          </div>
          <div>
            <span>Answers shown</span>
            <strong>None</strong>
          </div>
        </div>
        <div className="demo-row review-submit-actions">
          <button type="button" className="demo-button small" onClick={() => {
            setState("Lost context");
            setMessage("Changing one answer sends the user back through every later page before review appears again.");
          }}>Change address</button>
          <button type="button" className="demo-button small" onClick={() => {
            setState("Stale submitted");
            setMessage("Eligibility changed, but hidden evidence stayed submit-ready.");
          }}>Change eligibility</button>
          <button type="button" className="demo-button small primary" onClick={() => {
            setState("Submitted by Continue");
            setMessage("Continue submitted the claim even though users expected another step.");
          }}>Continue</button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

type AddressEntryMode = "lookup" | "results" | "selected" | "manual" | "international" | "invalid" | "fixed" | "submitted";

type DemoAddress = {
  line1: string;
  line2: string;
  town: string;
  region: string;
  postalCode: string;
  country: string;
};

const selectedDemoAddress: DemoAddress = {
  line1: "12 Market Road",
  line2: "Flat 2",
  town: "London",
  region: "",
  postalCode: "SW1A 1AA",
  country: "United Kingdom"
};

const blankDemoAddress: DemoAddress = {
  line1: "",
  line2: "Flat 2",
  town: "",
  region: "",
  postalCode: "",
  country: "United Kingdom"
};

function AddressEntryGoodUx({ meta }: { meta: PatternMeta }) {
  const [mode, setMode] = useState<AddressEntryMode>("lookup");
  const [postcode, setPostcode] = useState(meta.options[1] ?? "SW1A 1AA");
  const [address, setAddress] = useState<DemoAddress>(selectedDemoAddress);
  const [message, setMessage] = useState("Search by postcode or enter the address manually. Manual entry is always available.");
  const isInternational = address.country !== "United Kingdom";
  const hasError = mode === "invalid";

  const findAddresses = () => {
    setMode("results");
    setMessage(`Found 3 possible addresses for ${postcode.replace(/\s+/g, " ").trim().toUpperCase()}. Choose one or enter manually.`);
  };

  const selectFlat = () => {
    setAddress(selectedDemoAddress);
    setMode("selected");
    setMessage("Flat 2 selected and expanded into editable address parts. Apartment details are preserved.");
  };

  const enterManual = () => {
    setMode("manual");
    setMessage("Manual entry keeps the current postcode and lets the user edit every address part.");
  };

  const addressNotFound = () => {
    setAddress(blankDemoAddress);
    setMode("manual");
    setMessage("Address not found. Enter the address manually rather than blocking the user.");
  };

  const switchCountry = () => {
    setAddress({
      line1: "Calle de Atocha 27",
      line2: "Piso 3",
      town: "Madrid",
      region: "Comunidad de Madrid",
      postalCode: "28012",
      country: "Spain"
    });
    setPostcode("28012");
    setMode("international");
    setMessage("Country changed to Spain. Labels, required fields, and postal-code expectations update together.");
  };

  const validateAddress = () => {
    if (!address.line1.trim() || !address.town.trim() || (!isInternational && !address.postalCode.trim())) {
      setMode("invalid");
      setMessage("Enter address line 1, town or city, and postcode for a UK address.");
      return;
    }
    setMode("fixed");
    setMessage("Address parts are complete. Proposed normalization can be reviewed before submit.");
  };

  const fixAddress = () => {
    setAddress(selectedDemoAddress);
    setPostcode("SW1A 1AA");
    setMode("fixed");
    setMessage("Missing address parts restored without clearing Flat 2 or the user's other answers.");
  };

  const submitAddress = () => {
    if (!address.line1.trim() || !address.town.trim() || (!isInternational && !address.postalCode.trim())) {
      validateAddress();
      return;
    }
    setMode("submitted");
    setMessage(`Submitted structured payload: ${address.line1}; ${address.line2 || "no line 2"}; ${address.town}; ${address.postalCode || "no postal code"}; ${address.country}.`);
  };

  const updateAddress = (field: keyof DemoAddress, value: string) => {
    setAddress((current) => ({ ...current, [field]: value }));
    if (mode === "invalid") setMode("manual");
  };

  return (
    <div className="quality-example address-entry-demo">
      <div className={`address-entry-summary is-${mode}`} role={hasError ? "alert" : "status"} aria-live="polite">
        <strong>{hasError ? "Address needs correction" : mode === "submitted" ? "Address submitted" : "Address entry status"}</strong>
        <span>{message}</span>
      </div>

      <div className="address-entry-search">
        <label htmlFor="address-entry-postcode">
          <span>Postcode lookup</span>
          <input
            id="address-entry-postcode"
            value={postcode}
            onChange={(event) => setPostcode(event.target.value)}
            autoComplete="postal-code"
            aria-describedby="address-entry-hint"
          />
        </label>
        <button type="button" className="demo-button small" onClick={findAddresses}>Find addresses</button>
        <button type="button" className="demo-button small" onClick={enterManual}>Enter manually</button>
      </div>
      <p id="address-entry-hint" className="demo-status">Lookup covers UK addresses; use manual entry for international or missing addresses.</p>

      {mode === "results" && (
        <div className="address-entry-suggestions" aria-label="Address suggestions">
          <button type="button" onClick={selectFlat}>Flat 2, 12 Market Road, London SW1A 1AA</button>
          <button type="button" onClick={() => {
            setAddress({ ...selectedDemoAddress, line2: "" });
            setMode("selected");
            setMessage("12 Market Road selected. The user can still add a flat, suite, or unit.");
          }}>12 Market Road, London SW1A 1AA</button>
          <button type="button" onClick={() => {
            setAddress({ ...selectedDemoAddress, line1: "12A Market Road", line2: "" });
            setMode("selected");
            setMessage("12A Market Road selected and expanded into editable parts.");
          }}>12A Market Road, London SW1A 1AA</button>
        </div>
      )}

      <div className="address-entry-grid">
        <label className={hasError && !address.line1.trim() ? "has-error" : undefined} htmlFor="address-line-1-good">
          <span>Address line 1</span>
          {hasError && !address.line1.trim() && <strong>Enter address line 1</strong>}
          <input id="address-line-1-good" value={address.line1} onChange={(event) => updateAddress("line1", event.target.value)} autoComplete="address-line1" />
        </label>
        <label htmlFor="address-line-2-good">
          <span>Address line 2, flat, suite, or unit</span>
          <input id="address-line-2-good" value={address.line2} onChange={(event) => updateAddress("line2", event.target.value)} autoComplete="address-line2" />
        </label>
        <label className={hasError && !address.town.trim() ? "has-error" : undefined} htmlFor="address-town-good">
          <span>{isInternational ? "City, town, or locality" : "Town or city"}</span>
          {hasError && !address.town.trim() && <strong>Enter town or city</strong>}
          <input id="address-town-good" value={address.town} onChange={(event) => updateAddress("town", event.target.value)} autoComplete="address-level2" />
        </label>
        <label htmlFor="address-region-good">
          <span>{isInternational ? "Region, province, or state (optional)" : "County (optional)"}</span>
          <input id="address-region-good" value={address.region} onChange={(event) => updateAddress("region", event.target.value)} autoComplete="address-level1" />
        </label>
        <label className={hasError && !isInternational && !address.postalCode.trim() ? "has-error" : undefined} htmlFor="address-postcode-good">
          <span>{isInternational ? "Postal code" : "Postcode"}</span>
          {hasError && !isInternational && !address.postalCode.trim() && <strong>Enter postcode</strong>}
          <input id="address-postcode-good" value={address.postalCode} onChange={(event) => {
            setPostcode(event.target.value);
            updateAddress("postalCode", event.target.value);
          }} autoComplete="postal-code" />
        </label>
        <label htmlFor="address-country-good">
          <span>Country</span>
          <input id="address-country-good" value={address.country} onChange={(event) => updateAddress("country", event.target.value)} autoComplete="country-name" />
        </label>
      </div>

      <div className="address-entry-payload" aria-label="Structured address payload">
        <div><span>Line 1</span><strong>{address.line1 || "Missing"}</strong></div>
        <div><span>Line 2</span><strong>{address.line2 || "Not provided"}</strong></div>
        <div><span>Locality</span><strong>{address.town || "Missing"}</strong></div>
        <div><span>Postal code</span><strong>{address.postalCode || (isInternational ? "Optional for this country" : "Missing")}</strong></div>
        <div><span>Country</span><strong>{address.country}</strong></div>
        <div><span>Verification</span><strong>{mode === "submitted" ? "Accepted by user" : mode === "fixed" ? "Ready for review" : "Editable"}</strong></div>
      </div>

      <div className="demo-row address-entry-actions">
        <button type="button" className="demo-button small" onClick={findAddresses}>Find addresses</button>
        <button type="button" className="demo-button small" onClick={selectFlat}>Select Flat 2</button>
        <button type="button" className="demo-button small" onClick={addressNotFound}>Address not found</button>
        <button type="button" className="demo-button small" onClick={switchCountry}>Switch country</button>
        <button type="button" className="demo-button small" onClick={() => {
          setAddress(blankDemoAddress);
          setMode("manual");
          setMessage("Address fields cleared for error recovery; Flat 2 remains available as the unit detail the user already knew.");
        }}>Make incomplete</button>
        <button type="button" className="demo-button small" onClick={validateAddress}>Validate</button>
        <button type="button" className="demo-button small" onClick={fixAddress}>Fix address</button>
        <button type="button" className="demo-button small primary" onClick={submitAddress}>Submit address</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function AddressEntryBadUx({ meta }: { meta: PatternMeta }) {
  const [state, setState] = useState("First match ready");
  const [message, setMessage] = useState("The broken flow treats address entry as one opaque lookup field.");

  return (
    <div className="quality-example address-entry-demo">
      <div className="address-entry-bad-ui">
        <label>
          <span>{meta.field}</span>
          <input defaultValue="12 Market Road" aria-label="One-line address without structured fields" />
        </label>
        <div className="textarea-status-grid bad">
          <div>
            <span>Lookup state</span>
            <strong>{state}</strong>
          </div>
          <div>
            <span>Unit details</span>
            <strong>Discarded</strong>
          </div>
        </div>
        <div className="demo-row address-entry-actions">
          <button type="button" className="demo-button small" onClick={() => {
            setState("Auto-selected");
            setMessage("The first result was committed without letting the user choose between Flat 2, 12, and 12A.");
          }}>Use first match</button>
          <button type="button" className="demo-button small" onClick={() => {
            setState("Country blocked");
            setMessage("The form requires a UK postcode and blocks a valid international address.");
          }}>Enter non-UK</button>
          <button type="button" className="demo-button small" onClick={() => {
            setState("No manual path");
            setMessage("Lookup failed, but there is no manual entry route for a new building or missing record.");
          }}>Lookup missing</button>
          <button type="button" className="demo-button small primary" onClick={() => {
            setState("Submitted blob");
            setMessage("Only one address string was stored, so town, postcode, country, and apartment are not reliable downstream.");
          }}>Continue</button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

type BankDetailsState = "entry" | "invalid" | "verified" | "close-match" | "no-match" | "pending" | "saved";

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function formatSortCode(value: string) {
  const digits = digitsOnly(value).slice(0, 6);
  return digits.replace(/(\d{2})(?=\d)/g, "$1-").replace(/-$/, "");
}

function BankDetailsGoodUx({ meta }: { meta: PatternMeta }) {
  const [state, setState] = useState<BankDetailsState>("entry");
  const [accountName, setAccountName] = useState(meta.options[0] ?? "Alex Chen");
  const [sortCode, setSortCode] = useState(meta.options[1] ?? "12-34-56");
  const [accountNumber, setAccountNumber] = useState(meta.options[2] ?? "12345678");
  const [rollNumber, setRollNumber] = useState(meta.options[3] ?? "AB 12/345");
  const [message, setMessage] = useState("Enter details securely. Roll number is optional unless the user has one.");

  const normalizedSortCode = formatSortCode(sortCode);
  const normalizedAccountNumber = digitsOnly(accountNumber).slice(0, 8);
  const hasNameError = state === "invalid" && accountName.trim().length === 0;
  const hasSortCodeError = state === "invalid" && digitsOnly(sortCode).length !== 6;
  const hasAccountError = state === "invalid" && normalizedAccountNumber.length !== 8;
  const hasError = hasNameError || hasSortCodeError || hasAccountError;
  const accountEnding = normalizedAccountNumber.length >= 4 ? normalizedAccountNumber.slice(-4) : "missing";

  const pasteSample = () => {
    setSortCode("12 34 56");
    setAccountNumber("0012 3456");
    setRollNumber("AB 12/345");
    setState("entry");
    setMessage("Pasted spacing normalized visibly; leading zeros and roll-number characters are preserved.");
  };

  const makeIncomplete = () => {
    setAccountName("");
    setSortCode("12-3");
    setAccountNumber("1234");
    setState("entry");
    setMessage("Incomplete values are still visible so the user can repair them.");
  };

  const validate = () => {
    if (!accountName.trim() || digitsOnly(sortCode).length !== 6 || normalizedAccountNumber.length !== 8) {
      setState("invalid");
      setMessage("Fix name on the account, six-digit sort code, and eight-digit account number.");
      return;
    }
    setSortCode(normalizedSortCode);
    setAccountNumber(normalizedAccountNumber);
    setState("verified");
    setMessage("Account format passed and name check returned a match. Review masked details before payout.");
  };

  const closeMatch = () => {
    setState("close-match");
    setMessage("Account name is a close match for A Chen. The user must confirm or edit before continuing.");
  };

  const noMatch = () => {
    setState("no-match");
    setMessage("The account name does not match this sort code and account number. Correct the details or use another account.");
  };

  const pendingMicroDeposit = () => {
    setState("pending");
    setMessage("Instant verification was unavailable. A micro-deposit code is pending before the account can be used.");
  };

  const fixDetails = () => {
    setAccountName("Alex Chen");
    setSortCode("12-34-56");
    setAccountNumber("12345678");
    setRollNumber("AB 12/345");
    setState("verified");
    setMessage("Details corrected and verified. The optional roll number stays separate from the account number.");
  };

  const saveDetails = () => {
    if (state !== "verified" && state !== "close-match") {
      setMessage("Verify or explicitly review a close match before saving bank details.");
      return;
    }
    setState("saved");
    setMessage(`Saved for payout: ${accountName || "missing name"} - sort code ${normalizedSortCode || "missing"} - account ending ${accountEnding}.`);
  };

  return (
    <div className="quality-example bank-details-demo">
      <div className={`bank-details-summary is-${state}`} role={hasError || state === "no-match" ? "alert" : "status"} aria-live="polite">
        <strong>{hasError ? "Bank details need correction" : state === "saved" ? "Bank details saved" : state === "pending" ? "Verification pending" : "Bank details status"}</strong>
        <span>{message}</span>
      </div>

      <div className="bank-details-grid">
        <label className={hasNameError ? "has-error" : undefined} htmlFor="bank-account-name">
          <span>Name on the account</span>
          {hasNameError && <strong>Enter the name on the account</strong>}
          <input id="bank-account-name" value={accountName} onChange={(event) => setAccountName(event.target.value)} autoComplete="name" />
        </label>
        <label className={hasSortCodeError ? "has-error" : undefined} htmlFor="bank-sort-code">
          <span>Sort code</span>
          {hasSortCodeError && <strong>Enter a 6 digit sort code</strong>}
          <input
            id="bank-sort-code"
            value={sortCode}
            onChange={(event) => setSortCode(event.target.value)}
            onBlur={() => setSortCode(formatSortCode(sortCode))}
            inputMode="numeric"
            aria-describedby="bank-sort-code-hint"
          />
          <small id="bank-sort-code-hint">For example, 12-34-56. Spaces or hyphens are accepted.</small>
        </label>
        <label className={hasAccountError ? "has-error" : undefined} htmlFor="bank-account-number">
          <span>Account number</span>
          {hasAccountError && <strong>Enter an 8 digit account number</strong>}
          <input
            id="bank-account-number"
            value={accountNumber}
            onChange={(event) => setAccountNumber(event.target.value)}
            onBlur={() => setAccountNumber(digitsOnly(accountNumber).slice(0, 8))}
            inputMode="numeric"
          />
        </label>
        <label htmlFor="bank-roll-number">
          <span>Building society roll number (optional)</span>
          <input id="bank-roll-number" value={rollNumber} onChange={(event) => setRollNumber(event.target.value)} />
        </label>
      </div>

      <div className="bank-details-verification" aria-label="Verification outcome">
        <div>
          <span>Account name check</span>
          <strong>{state === "close-match" ? "Close match: A Chen" : state === "no-match" ? "No match" : state === "pending" ? "Not checked yet" : state === "invalid" ? "Blocked by field errors" : "Match"}</strong>
        </div>
        <div>
          <span>Account validation</span>
          <strong>{state === "invalid" ? "Blocked by field errors" : state === "pending" ? "Micro-deposit pending" : state === "no-match" ? "Needs correction" : state === "saved" ? "Saved securely" : "Ready for review"}</strong>
        </div>
        <div>
          <span>Roll number</span>
          <strong>{rollNumber.trim() || "Not provided"}</strong>
        </div>
      </div>

      <div className="bank-details-review">
        <span>Masked review</span>
        <strong>{accountName || "Missing name"} - sort code {normalizedSortCode || "missing"} - account ending {accountEnding} - {rollNumber.trim() ? "roll number provided" : "no roll number"}</strong>
      </div>

      <div className="demo-row bank-details-actions">
        <button type="button" className="demo-button small" onClick={pasteSample}>Paste sample</button>
        <button type="button" className="demo-button small" onClick={makeIncomplete}>Make incomplete</button>
        <button type="button" className="demo-button small" onClick={validate}>Validate account</button>
        <button type="button" className="demo-button small" onClick={closeMatch}>Close match</button>
        <button type="button" className="demo-button small" onClick={noMatch}>No match</button>
        <button type="button" className="demo-button small" onClick={pendingMicroDeposit}>Micro-deposit pending</button>
        <button type="button" className="demo-button small" onClick={fixDetails}>Fix details</button>
        <button type="button" className="demo-button small primary" onClick={saveDetails}>Save for payout</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function BankDetailsBadUx({ meta }: { meta: PatternMeta }) {
  const [state, setState] = useState("Unstructured");
  const [message, setMessage] = useState("The broken flow asks for bank details in one field and outside a secure verification path.");

  return (
    <div className="quality-example bank-details-demo">
      <div className="bank-details-bad-ui">
        <label>
          <span>{meta.field}</span>
          <textarea defaultValue={"Alex Chen\nSort code 12-34-56\nAccount 12345678"} aria-label="Unstructured bank details" />
        </label>
        <div className="textarea-status-grid bad">
          <div>
            <span>State</span>
            <strong>{state}</strong>
          </div>
          <div>
            <span>Verification</span>
            <strong>Assumed</strong>
          </div>
        </div>
        <div className="demo-row bank-details-actions">
          <button type="button" className="demo-button small" onClick={() => {
            setState("Email requested");
            setMessage("The user is told to email account details to support, outside the secure service flow.");
          }}>Ask by email</button>
          <button type="button" className="demo-button small" onClick={() => {
            setState("Leading zero stripped");
            setMessage("The generic number field changed 00123456 to 123456, so the account is no longer what the user entered.");
          }}>Strip zeros</button>
          <button type="button" className="demo-button small" onClick={() => {
            setState("Roll number lost");
            setMessage("The building society roll number was merged into notes and never sent to the payment provider.");
          }}>Lose roll number</button>
          <button type="button" className="demo-button small primary" onClick={() => {
            setState("Paid without match");
            setMessage("The payout was submitted without account-name match, validation state, or recognizable masked review.");
          }}>Pay anyway</button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

type PaymentCardState = "entry" | "invalid" | "expired" | "cvc-error" | "tokenized" | "wallet" | "submitted";

function PaymentCardEntryGoodUx({ meta }: { meta: PatternMeta }) {
  const [cardNumber, setCardNumber] = useState(meta.options[0]);
  const [expiry, setExpiry] = useState(meta.options[1]);
  const [cvc, setCvc] = useState(meta.options[2]);
  const [postalCode, setPostalCode] = useState(meta.options[3]);
  const [state, setState] = useState<PaymentCardState>("entry");
  const [message, setMessage] = useState("Hosted card fields are ready. Paste a card number, then validate before tokenization.");

  const digitsOnly = (value: string) => value.replace(/\D/g, "");
  const numberDigits = digitsOnly(cardNumber);
  const detectBrand = (digits: string) => {
    if (/^3[47]/.test(digits)) return "American Express";
    if (/^4/.test(digits)) return "Visa";
    if (/^(5[1-5]|2[2-7])/.test(digits)) return "Mastercard";
    if (digits.length >= 6) return "Unsupported";
    return "Unknown";
  };
  const brand = detectBrand(numberDigits);
  const cvcLabel = brand === "American Express" ? "CID" : "CVC";
  const expectedCvcLength = brand === "American Express" ? 4 : 3;
  const lastFour = numberDigits.slice(-4) || "----";
  const groupedCardNumber = (value: string) => {
    const digits = digitsOnly(value).slice(0, brand === "American Express" ? 15 : 19);
    if (detectBrand(digits) === "American Express") {
      return [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10, 15)].filter(Boolean).join(" ");
    }
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };
  const passesLuhn = (digits: string) => {
    let sum = 0;
    let doubleNext = false;
    for (let index = digits.length - 1; index >= 0; index -= 1) {
      let value = Number(digits[index]);
      if (doubleNext) {
        value *= 2;
        if (value > 9) value -= 9;
      }
      sum += value;
      doubleNext = !doubleNext;
    }
    return digits.length >= 12 && sum % 10 === 0;
  };
  const expiryStatus = (value: string) => {
    const match = value.trim().match(/^(\d{1,2})\s*\/\s*(\d{2}|\d{4})$/);
    if (!match) return "invalid";
    const month = Number(match[1]);
    const rawYear = Number(match[2]);
    const year = rawYear < 100 ? 2000 + rawYear : rawYear;
    if (month < 1 || month > 12) return "invalid";
    if (year < 2026 || (year === 2026 && month < 6)) return "past";
    return "future";
  };
  const hasCardError = state === "invalid" && (!passesLuhn(numberDigits) || brand === "Unsupported");
  const hasExpiryError = state === "expired";
  const hasCvcError = state === "cvc-error";
  const hasPostalError = state === "invalid" && postalCode.trim().length < 3;
  const statusClass = state === "submitted" || state === "tokenized" || state === "wallet" ? "is-tokenized" : state === "entry" ? "is-entry" : "is-invalid";

  const pasteVisa = () => {
    setCardNumber("4242 4242 4242 4242");
    setExpiry("12/30");
    setCvc("123");
    setPostalCode("10001");
    setState("entry");
    setMessage("Visa detected from the card number. CVC expects 3 digits and ZIP code is ready for AVS.");
  };

  const pasteAmex = () => {
    setCardNumber("3782 822463 10005");
    setExpiry("11/30");
    setCvc("1234");
    setPostalCode("10001");
    setState("entry");
    setMessage("American Express detected. The security code label changes to CID and expects 4 digits.");
  };

  const makeInvalid = () => {
    setCardNumber("4242 4242 4242 4241");
    setExpiry("12/30");
    setCvc("123");
    setPostalCode("");
    setState("invalid");
    setMessage("Card number checksum failed and postal code is missing. Keep values visible so the user can correct them.");
  };

  const makeExpired = () => {
    setCardNumber("4242 4242 4242 4242");
    setExpiry("02/24");
    setCvc("123");
    setPostalCode("10001");
    setState("expired");
    setMessage("Expiry is in the past. The correction belongs on expiry, not in a vague payment failure.");
  };

  const validateCard = () => {
    const normalized = groupedCardNumber(cardNumber);
    const digits = digitsOnly(normalized);
    const detected = detectBrand(digits);
    setCardNumber(normalized);
    if (detected === "Unsupported" || !passesLuhn(digits)) {
      setState("invalid");
      setMessage("Enter a supported card number. The form checks length, brand, and Luhn before charging.");
      return false;
    }
    if (expiryStatus(expiry) !== "future") {
      setState("expired");
      setMessage("Enter an expiry month and year that has not passed.");
      return false;
    }
    const requiredCvcLength = detected === "American Express" ? 4 : 3;
    if (digitsOnly(cvc).length !== requiredCvcLength) {
      setState("cvc-error");
      setMessage(`${detected} expects a ${requiredCvcLength} digit ${detected === "American Express" ? "CID" : "CVC"}.`);
      return false;
    }
    if (postalCode.trim().length < 3) {
      setState("invalid");
      setMessage("Enter the billing postal code required by this checkout before tokenization.");
      return false;
    }
    setState("entry");
    setMessage(`${detected} ending ${digits.slice(-4)} is ready to tokenize. Full card number and ${detected === "American Express" ? "CID" : "CVC"} stay in hosted fields.`);
    return true;
  };

  const tokenizeCard = () => {
    if (!validateCard()) return;
    setState("tokenized");
    setMessage(`Processor token created for ${detectBrand(digitsOnly(cardNumber))} ending ${digitsOnly(cardNumber).slice(-4)}. CVC is not retained by the app.`);
  };

  const useWallet = () => {
    setCardNumber("4242 4242 4242 4242");
    setExpiry("12/30");
    setCvc("123");
    setPostalCode("10001");
    setState("wallet");
    setMessage("Wallet returned a network token for Visa ending 4242. Manual hosted card fields remain available as a fallback.");
  };

  const chargeCard = () => {
    if (state !== "tokenized" && state !== "wallet") {
      setMessage("Tokenize the card or choose a wallet before charging.");
      return;
    }
    setState("submitted");
    setMessage(`Charged $48.00 to ${brand === "Unknown" ? "Visa" : brand} ending ${lastFour}. Review never displays the full card number or CVC.`);
  };

  return (
    <div className="quality-example payment-card-demo">
      <div className={`payment-card-summary ${statusClass}`} role={state === "invalid" || state === "expired" || state === "cvc-error" ? "alert" : "status"} aria-live="polite">
        <strong>{state === "submitted" ? "Payment submitted" : state === "tokenized" ? "Card tokenized" : state === "wallet" ? "Wallet selected" : state === "entry" ? "Card entry ready" : "Card details need correction"}</strong>
        <span>{message}</span>
      </div>

      <div className="payment-card-preview" aria-label="Masked card review">
        <div>
          <span>Brand</span>
          <strong>{brand}</strong>
        </div>
        <div>
          <span>Last four</span>
          <strong>{lastFour}</strong>
        </div>
        <div>
          <span>Token state</span>
          <strong>{state === "tokenized" || state === "submitted" ? "Processor token" : state === "wallet" ? "Wallet token" : "Not tokenized"}</strong>
        </div>
      </div>

      <div className="payment-card-grid">
        <label className={hasCardError ? "has-error" : undefined} htmlFor="payment-card-number">
          <span>Card number</span>
          {hasCardError && <strong>Enter a supported card number with a valid checksum</strong>}
          <input
            id="payment-card-number"
            value={cardNumber}
            onChange={(event) => setCardNumber(event.target.value)}
            onBlur={() => setCardNumber(groupedCardNumber(cardNumber))}
            inputMode="numeric"
            autoComplete="cc-number"
          />
        </label>
        <label className={hasExpiryError ? "has-error" : undefined} htmlFor="payment-card-expiry">
          <span>Expiry</span>
          {hasExpiryError && <strong>Enter a future expiry in MM/YY format</strong>}
          <input id="payment-card-expiry" value={expiry} onChange={(event) => setExpiry(event.target.value)} inputMode="numeric" autoComplete="cc-exp" />
        </label>
        <label className={hasCvcError ? "has-error" : undefined} htmlFor="payment-card-cvc">
          <span>{cvcLabel}</span>
          {hasCvcError && <strong>{cvcLabel} must be {expectedCvcLength} digits for this brand</strong>}
          <input id="payment-card-cvc" value={cvc} onChange={(event) => setCvc(event.target.value.replace(/\D/g, "").slice(0, 4))} inputMode="numeric" autoComplete="cc-csc" />
        </label>
        <label className={hasPostalError ? "has-error" : undefined} htmlFor="payment-card-postal">
          <span>Billing ZIP or postal code</span>
          {hasPostalError && <strong>Enter the billing postal code</strong>}
          <input id="payment-card-postal" value={postalCode} onChange={(event) => setPostalCode(event.target.value)} inputMode="numeric" autoComplete="postal-code" />
        </label>
      </div>

      <div className="payment-card-token">
        <span>Masked review</span>
        <strong>{brand === "Unknown" ? "Card" : brand} ending {lastFour} - expiry {expiry || "missing"} - ZIP {postalCode || "missing"} - {state === "tokenized" || state === "submitted" ? "token pm_live_preview" : state === "wallet" ? "wallet token" : "not ready to charge"}</strong>
      </div>

      <div className="demo-row payment-card-actions">
        <button type="button" className="demo-button small" onClick={pasteVisa}>Paste Visa</button>
        <button type="button" className="demo-button small" onClick={pasteAmex}>Paste Amex</button>
        <button type="button" className="demo-button small" onClick={makeInvalid}>Make invalid</button>
        <button type="button" className="demo-button small" onClick={makeExpired}>Expired card</button>
        <button type="button" className="demo-button small" onClick={validateCard}>Validate card</button>
        <button type="button" className="demo-button small" onClick={tokenizeCard}>Tokenize card</button>
        <button type="button" className="demo-button small" onClick={useWallet}>Use wallet</button>
        <button type="button" className="demo-button small primary" onClick={chargeCard}>Charge masked card</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function PaymentCardEntryBadUx({ meta }: { meta: PatternMeta }) {
  const [state, setState] = useState("Raw details");
  const [message, setMessage] = useState("The broken flow asks for full card details in one app-owned field and treats card-data exposure as normal review.");

  return (
    <div className="quality-example payment-card-demo">
      <div className="payment-card-bad-ui">
        <label>
          <span>{meta.field}</span>
          <textarea defaultValue={"Card 4242 4242 4242 4242\nExpiry 12/30\nCVC 123\nZIP 10001"} aria-label="Unstructured card details" />
        </label>
        <div className="textarea-status-grid bad">
          <div>
            <span>State</span>
            <strong>{state}</strong>
          </div>
          <div>
            <span>Review</span>
            <strong>Full card shown</strong>
          </div>
        </div>
        <div className="demo-row payment-card-actions">
          <button type="button" className="demo-button small" onClick={() => {
            setState("Full PAN stored");
            setMessage("The app stores the full card number in ordinary form state instead of using hosted card fields.");
          }}>Store full PAN</button>
          <button type="button" className="demo-button small" onClick={() => {
            setState("CVC logged");
            setMessage("The security code is copied into logs and review text even though it should not be retained after authorization.");
          }}>Log CVC</button>
          <button type="button" className="demo-button small" onClick={() => {
            setState("Brand unknown");
            setMessage("The rigid form cannot distinguish Visa, Amex, unsupported brands, expiry errors, or different CVC lengths.");
          }}>Ignore brand</button>
          <button type="button" className="demo-button small primary" onClick={() => {
            setState("Charged unclear card");
            setMessage("The charge was attempted without tokenization, masked review, authentication recovery, or card-specific error handling.");
          }}>Charge anyway</button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

type CheckoutStage = "cart" | "guest" | "delivery" | "discount" | "payment" | "review" | "processing" | "declined" | "changed" | "expired" | "placed";

function CheckoutFrame({
  stage = "cart",
  idSuffix = "sample"
}: {
  stage?: CheckoutStage;
  idSuffix?: string;
}) {
  const headingId = `checkout-title-${idSuffix}`;
  const stageCopy: Record<CheckoutStage, { title: string; body: string; tone: "neutral" | "warn" | "danger" | "success"; total: string; delivery: string; payment: string; action: string }> = {
    cart: {
      title: "Review your order",
      body: "Cart items, shipping, tax, discount, and total stay visible before checkout continues.",
      tone: "neutral",
      total: "$148.40",
      delivery: "Standard - Fri 14 Jun",
      payment: "Not selected",
      action: "Continue as guest"
    },
    guest: {
      title: "Continue without an account",
      body: "Guest checkout collects email for receipt and defers account creation until after order placement.",
      tone: "success",
      total: "$148.40",
      delivery: "Standard - Fri 14 Jun",
      payment: "Not selected",
      action: "Continue to delivery"
    },
    delivery: {
      title: "Choose delivery",
      body: "Changing delivery updates arrival date and the total before payment is requested.",
      tone: "neutral",
      total: "$158.40",
      delivery: "Express - Wed 12 Jun",
      payment: "Not selected",
      action: "Continue to payment"
    },
    discount: {
      title: "Promotion code expired",
      body: "The invalid discount is explained near the order summary and the total remains accurate.",
      tone: "warn",
      total: "$158.40",
      delivery: "Express - Wed 12 Jun",
      payment: "Not selected",
      action: "Review total"
    },
    payment: {
      title: "Payment method ready",
      body: "Checkout owns masked payment state and final charge timing, while card fields stay in the payment component.",
      tone: "success",
      total: "$158.40",
      delivery: "Express - Wed 12 Jun",
      payment: "Visa ending 4242",
      action: "Review order"
    },
    review: {
      title: "Place your order",
      body: "The final review shows the exact total, delivery promise, masked payment method, and terms before commit.",
      tone: "neutral",
      total: "$158.40",
      delivery: "Express - Wed 12 Jun",
      payment: "Visa ending 4242",
      action: "Place order"
    },
    processing: {
      title: "Placing order ORD-2048",
      body: "The final button is disabled while payment authorization and order creation are in flight.",
      tone: "warn",
      total: "$158.40",
      delivery: "Express - Wed 12 Jun",
      payment: "Authorizing",
      action: "Processing"
    },
    declined: {
      title: "Payment was declined",
      body: "Cart, shipping, discount, and order reference stay intact so the user can change payment and retry.",
      tone: "danger",
      total: "$158.40",
      delivery: "Express - Wed 12 Jun",
      payment: "Declined",
      action: "Change payment"
    },
    changed: {
      title: "Price changed before order",
      body: "Inventory and price changes require acknowledgement before the user can place the order.",
      tone: "warn",
      total: "$164.20",
      delivery: "Express - Wed 12 Jun",
      payment: "Visa ending 4242",
      action: "Acknowledge total"
    },
    expired: {
      title: "Checkout expired",
      body: "A recoverable expired state restores safe cart details and asks for fresh delivery and payment checks.",
      tone: "warn",
      total: "$148.40",
      delivery: "Needs refresh",
      payment: "Needs refresh",
      action: "Resume checkout"
    },
    placed: {
      title: "Order placed",
      body: "Checkout controls stop and the user is handed to confirmation with receipt and delivery expectations.",
      tone: "success",
      total: "$158.40",
      delivery: "Express - Wed 12 Jun",
      payment: "Charged Visa ending 4242",
      action: "View confirmation"
    }
  };
  const current = stageCopy[stage];

  return (
    <div className={`checkout-frame is-${stage}`}>
      <section className="checkout-summary" aria-label="Order summary">
        <strong>Order summary</strong>
        <div className="checkout-line">
          <span>Trail backpack</span>
          <strong>$120.00</strong>
        </div>
        <div className="checkout-line">
          <span>Insulated bottle</span>
          <strong>$18.40</strong>
        </div>
        <div className="checkout-line">
          <span>Shipping</span>
          <strong>{stage === "delivery" || stage === "discount" || stage === "payment" || stage === "review" || stage === "processing" || stage === "declined" || stage === "changed" || stage === "placed" ? "$10.00" : "Free"}</strong>
        </div>
        <div className="checkout-total">
          <span>Total due</span>
          <strong>{current.total}</strong>
        </div>
      </section>
      <section className={`checkout-status is-${current.tone}`} aria-labelledby={headingId}>
        <span className="checkout-kicker">{stage === "placed" ? "Confirmation handoff" : stage === "processing" ? "Duplicate guard" : "Checkout"}</span>
        <h4 id={headingId}>{current.title}</h4>
        <p>{current.body}</p>
        <div className="checkout-state-grid">
          <span>Account: {stage === "guest" ? "Guest receipt" : "Guest available"}</span>
          <span>Delivery: {current.delivery}</span>
          <span>Payment: {current.payment}</span>
          <span>Order ref: ORD-2048</span>
        </div>
        <div className="checkout-actions">
          <button type="button" className="demo-button primary" disabled={stage === "processing"}>{current.action}</button>
          <button type="button" className="demo-button small">Edit cart</button>
          <button type="button" className="demo-button small">Change delivery</button>
          <button type="button" className="demo-button small">Change payment</button>
        </div>
      </section>
    </div>
  );
}

function CheckoutGoodUi() {
  return (
    <div className="quality-example checkout-demo">
      <CheckoutFrame stage="review" idSuffix="good-ui" />
      <p className="demo-status">The review surface keeps total, delivery, masked payment, order reference, and explicit Place order action synchronized.</p>
    </div>
  );
}

function CheckoutBadUi() {
  return (
    <div className="bad-ui-sample checkout-bad-demo is-hiddenTotal">
      <strong>Almost done</strong>
      <div className="checkout-bad-grid">
        <span>Total hidden</span>
        <span>Account required</span>
        <span>Pay button active</span>
      </div>
      <p className="demo-status">The broken checkout hides final cost, blocks guest purchase, and allows duplicate payment while the order is unclear.</p>
    </div>
  );
}

function CheckoutGoodUx({ meta }: { meta: PatternMeta }) {
  const [stage, setStage] = useState<CheckoutStage>("cart");
  const [message, setMessage] = useState("Checkout keeps the order summary, delivery, payment, and final commitment in sync.");

  function choose(nextStage: CheckoutStage, nextMessage: string) {
    setStage(nextStage);
    setMessage(nextMessage);
  }

  return (
    <div className="quality-example checkout-demo">
      <CheckoutFrame stage={stage} idSuffix="good-ux" />
      <div className="demo-row checkout-controls" aria-label={`${meta.name} exercise controls`}>
        <button type="button" className={stage === "cart" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("cart", "Cart summary shows items, shipping, tax, discount, and total before checkout continues.")}>Cart</button>
        <button type="button" className={stage === "guest" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("guest", "Guest checkout remains available and account creation can be deferred until after purchase.")}>Guest</button>
        <button type="button" className={stage === "delivery" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("delivery", "Delivery changes update cost and arrival date before payment is requested.")}>Delivery</button>
        <button type="button" className={stage === "discount" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("discount", "Expired discounts are explained near the total and do not silently change the order.")}>Discount error</button>
        <button type="button" className={stage === "payment" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("payment", "Payment method is summarized as masked state while secure card fields remain separate.")}>Payment</button>
        <button type="button" className={stage === "review" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("review", "Final review shows exact amount, delivery promise, payment summary, and Place order action.")}>Review</button>
        <button type="button" className={stage === "processing" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("processing", "Processing state disables duplicate place-order while payment and order creation run.")}>Processing</button>
        <button type="button" className={stage === "declined" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("declined", "Payment decline preserves cart, shipping, discount, and order reference for retry.")}>Declined</button>
        <button type="button" className={stage === "changed" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("changed", "Inventory or price changes require acknowledgement before final order placement.")}>Changed total</button>
        <button type="button" className={stage === "expired" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("expired", "Expired checkout restores safe cart context and refreshes delivery and payment details.")}>Expired</button>
        <button type="button" className={stage === "placed" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("placed", "Successful order placement hands off to confirmation instead of leaving checkout editable.")}>Placed</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function CheckoutBadUx({ meta }: { meta: PatternMeta }) {
  type Mode = "forcedAccount" | "surpriseFee" | "lostCart" | "duplicateSubmit" | "vagueFailure" | "staleInventory" | "earlyConfirmation";
  const [mode, setMode] = useState<Mode>("forcedAccount");
  const copy: Record<Mode, string> = {
    forcedAccount: "Checkout blocks purchase behind account creation even though guest receipt would complete the order.",
    surpriseFee: "Shipping and tax appear only after card entry, changing the charge without a clear review.",
    lostCart: "A payment decline clears cart, address, shipping, and discount state.",
    duplicateSubmit: "The Place order button stays active during authorization and can create two orders.",
    vagueFailure: "Address, shipping, discount, inventory, and payment problems collapse into one checkout failed message.",
    staleInventory: "Checkout lets the user place an order for an item that changed price or stock state.",
    earlyConfirmation: "A confirmation screen appears before payment and inventory are actually committed."
  };
  const labels: Record<Mode, string[]> = {
    forcedAccount: ["Create account", "Guest hidden", "Cart paused"],
    surpriseFee: ["Card entered", "+$18 fee", "No review"],
    lostCart: ["Declined", "Cart empty", "Start over"],
    duplicateSubmit: ["Authorizing", "Button active", "Two orders"],
    vagueFailure: ["Failed", "Unknown step", "No recovery"],
    staleInventory: ["Old price", "Out of stock", "Still placed"],
    earlyConfirmation: ["Looks done", "Payment pending", "No receipt"]
  };

  return (
    <div className={`quality-example checkout-bad-demo is-${mode}`}>
      <strong>{mode === "duplicateSubmit" ? "Duplicate order risk" : mode === "earlyConfirmation" ? "False confirmation" : `${meta.name} failure`}</strong>
      <div className="checkout-bad-grid">
        {labels[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row checkout-controls">
        <button type="button" className={mode === "forcedAccount" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("forcedAccount")}>Forced account</button>
        <button type="button" className={mode === "surpriseFee" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("surpriseFee")}>Surprise fee</button>
        <button type="button" className={mode === "lostCart" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("lostCart")}>Lost cart</button>
        <button type="button" className={mode === "duplicateSubmit" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("duplicateSubmit")}>Duplicate submit</button>
        <button type="button" className={mode === "vagueFailure" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("vagueFailure")}>Vague failure</button>
        <button type="button" className={mode === "staleInventory" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleInventory")}>Stale inventory</button>
        <button type="button" className={mode === "earlyConfirmation" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("earlyConfirmation")}>Early confirmation</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

type PaymentCollectionStage = "request" | "method" | "handoff" | "action" | "processing" | "declined" | "canceled" | "expired" | "retry" | "paid" | "refunded" | "reconcile";

function PaymentCollectionFrame({
  stage = "request",
  idSuffix = "sample"
}: {
  stage?: PaymentCollectionStage;
  idSuffix?: string;
}) {
  const headingId = `payment-collection-title-${idSuffix}`;
  const stageCopy: Record<PaymentCollectionStage, { title: string; body: string; tone: "neutral" | "warn" | "danger" | "success"; status: string; action: string; method: string }> = {
    request: {
      title: "Pay permit fee",
      body: "Amount, currency, service reference, and what payment unlocks are visible before provider handoff.",
      tone: "neutral",
      status: "Not attempted",
      action: "Continue to payment",
      method: "Card, wallet, bank"
    },
    method: {
      title: "Choose a payment method",
      body: "Method choice stays separate from raw credential capture and keeps the same payment reference.",
      tone: "neutral",
      status: "Method needed",
      action: "Use secure payment",
      method: "Card selected"
    },
    handoff: {
      title: "Secure provider handoff",
      body: "The service explains who processes the payment and what happens after bank or wallet authentication.",
      tone: "warn",
      status: "Leaving service",
      action: "Continue securely",
      method: "Hosted page"
    },
    action: {
      title: "Bank authentication required",
      body: "Requires-action state tells users not to retry while authentication is open.",
      tone: "warn",
      status: "Requires action",
      action: "Open bank app",
      method: "3DS challenge"
    },
    processing: {
      title: "Checking payment status",
      body: "Processing state disables duplicate pay while the backend verifies provider status.",
      tone: "warn",
      status: "Processing",
      action: "Checking",
      method: "Card ending 4242"
    },
    declined: {
      title: "Payment was declined",
      body: "Decline keeps amount and reference intact, then offers retry with the same context or another method.",
      tone: "danger",
      status: "Requires payment method",
      action: "Try another method",
      method: "Card declined"
    },
    canceled: {
      title: "Payment was canceled",
      body: "Cancel is distinct from decline and pending so users know no money was taken.",
      tone: "warn",
      status: "Canceled",
      action: "Resume payment",
      method: "Provider canceled"
    },
    expired: {
      title: "Payment session expired",
      body: "Expired state preserves the service reference and starts a fresh attempt without stale credentials.",
      tone: "warn",
      status: "Expired",
      action: "Create new attempt",
      method: "Needs refresh"
    },
    retry: {
      title: "Retry with idempotency",
      body: "Retry reuses the service reference and guards against duplicate charge while a new method is tried.",
      tone: "neutral",
      status: "Retry allowed",
      action: "Retry payment",
      method: "Wallet"
    },
    paid: {
      title: "Payment received",
      body: "Receipt appears only after trusted provider status supports success.",
      tone: "success",
      status: "Succeeded",
      action: "View receipt",
      method: "Paid by wallet"
    },
    refunded: {
      title: "Partial refund issued",
      body: "Refund state is visible after payment so support and user agree on current money movement.",
      tone: "success",
      status: "Partially refunded",
      action: "View refund",
      method: "Wallet"
    },
    reconcile: {
      title: "Status needs reconciliation",
      body: "Asynchronous provider updates and support lookup use the same reference instead of asking users to pay again.",
      tone: "warn",
      status: "Pending reconciliation",
      action: "Check status",
      method: "Provider pending"
    }
  };
  const current = stageCopy[stage];

  return (
    <div className={`payment-collection-frame is-${stage}`}>
      <section className="payment-collection-summary" aria-label="Payment request">
        <strong>Payment request</strong>
        <span>Reference: APP-2048-FEE</span>
        <span>Amount due: $84.00</span>
        <span>For: building permit application</span>
        <span>Idempotency: pay_APP_2048_fee</span>
      </section>
      <section className={`payment-collection-status is-${current.tone}`} aria-labelledby={headingId}>
        <span className="payment-collection-kicker">{current.status}</span>
        <h4 id={headingId}>{current.title}</h4>
        <p>{current.body}</p>
        <div className="payment-collection-state-grid">
          <span>Method: {current.method}</span>
          <span>Status: {current.status}</span>
          <span>Duplicate guard: {stage === "processing" || stage === "retry" ? "active" : "ready"}</span>
          <span>Receipt: {stage === "paid" || stage === "refunded" ? "available" : "not issued"}</span>
        </div>
        <div className="payment-collection-actions">
          <button type="button" className="demo-button primary" disabled={stage === "processing"}>{current.action}</button>
          <button type="button" className="demo-button small">Try another method</button>
          <button type="button" className="demo-button small">Check status</button>
          <button type="button" className="demo-button small">Contact support</button>
        </div>
      </section>
    </div>
  );
}

function PaymentCollectionGoodUi() {
  return (
    <div className="quality-example payment-collection-demo">
      <PaymentCollectionFrame stage="request" idSuffix="good-ui" />
      <p className="demo-status">The payment request anchors amount, reference, provider handoff, duplicate guard, and status before the user pays.</p>
    </div>
  );
}

function PaymentCollectionBadUi() {
  return (
    <div className="bad-ui-sample payment-collection-bad-demo is-hiddenAmount">
      <strong>Pay now</strong>
      <div className="payment-collection-bad-grid">
        <span>No amount</span>
        <span>No reference</span>
        <span>Status unknown</span>
      </div>
      <p className="demo-status">The broken payment page asks for money without the amount, reference, provider context, or status recovery.</p>
    </div>
  );
}

function PaymentCollectionGoodUx({ meta }: { meta: PatternMeta }) {
  const [stage, setStage] = useState<PaymentCollectionStage>("request");
  const [message, setMessage] = useState("Payment collection keeps amount, reference, status, and duplicate safety tied together.");

  function choose(nextStage: PaymentCollectionStage, nextMessage: string) {
    setStage(nextStage);
    setMessage(nextMessage);
  }

  return (
    <div className="quality-example payment-collection-demo">
      <PaymentCollectionFrame stage={stage} idSuffix="good-ux" />
      <div className="demo-row payment-collection-controls" aria-label={`${meta.name} exercise controls`}>
        <button type="button" className={stage === "request" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("request", "Request state shows amount, reference, payer context, accepted methods, and secure handoff.")}>Request</button>
        <button type="button" className={stage === "method" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("method", "Method choice stays separate from sensitive credential capture and keeps the same reference.")}>Method</button>
        <button type="button" className={stage === "handoff" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("handoff", "Provider handoff explains who processes payment and how the user returns.")}>Handoff</button>
        <button type="button" className={stage === "action" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("action", "Requires-action state tells users not to retry while bank authentication is active.")}>Requires action</button>
        <button type="button" className={stage === "processing" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("processing", "Processing disables duplicate pay while trusted status is verified.")}>Processing</button>
        <button type="button" className={stage === "declined" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("declined", "Decline keeps amount and reference intact and offers another method.")}>Declined</button>
        <button type="button" className={stage === "canceled" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("canceled", "Canceled is shown separately from decline or processing so users know no money was taken.")}>Canceled</button>
        <button type="button" className={stage === "expired" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("expired", "Expired sessions preserve the service reference and create a fresh attempt.")}>Expired</button>
        <button type="button" className={stage === "retry" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("retry", "Retry uses the same reference and duplicate guard while trying a different method.")}>Retry</button>
        <button type="button" className={stage === "paid" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("paid", "Receipt appears only after trusted provider status supports success.")}>Paid</button>
        <button type="button" className={stage === "refunded" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("refunded", "Refund status remains visible so users and support share one money-movement state.")}>Refunded</button>
        <button type="button" className={stage === "reconcile" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("reconcile", "Reconciliation uses the same reference instead of asking users to pay again.")}>Reconcile</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function PaymentCollectionBadUx({ meta }: { meta: PatternMeta }) {
  type Mode = "hiddenAmount" | "duplicateCharge" | "lostReference" | "vagueFailure" | "prematureReceipt" | "rawDetails" | "noReconciliation";
  const [mode, setMode] = useState<Mode>("hiddenAmount");
  const copy: Record<Mode, string> = {
    hiddenAmount: "The user is asked to pay without amount, currency, reference, or what the payment unlocks.",
    duplicateCharge: "The pay action stays active during processing and can create two charges.",
    lostReference: "Provider return loses the application fee reference, so status cannot be matched.",
    vagueFailure: "Decline, cancel, expiry, and provider outage all collapse into one payment failed message.",
    prematureReceipt: "The page shows a receipt before provider or backend status confirms success.",
    rawDetails: "The service collects card and bank details directly instead of delegating sensitive capture.",
    noReconciliation: "A pending provider event has no status lookup, support reference, refund view, or safe retry rule."
  };
  const labels: Record<Mode, string[]> = {
    hiddenAmount: ["Pay now", "No amount", "No reference"],
    duplicateCharge: ["Processing", "Button active", "Two charges"],
    lostReference: ["Returned", "Ref missing", "Cannot match"],
    vagueFailure: ["Failed", "Unknown cause", "No method route"],
    prematureReceipt: ["Looks paid", "Webhook pending", "False success"],
    rawDetails: ["Full card", "Bank login", "Logs risk"],
    noReconciliation: ["Pending", "No lookup", "Pay again"]
  };

  return (
    <div className={`quality-example payment-collection-bad-demo is-${mode}`}>
      <strong>{mode === "duplicateCharge" ? "Duplicate payment risk" : mode === "prematureReceipt" ? "False receipt" : `${meta.name} failure`}</strong>
      <div className="payment-collection-bad-grid">
        {labels[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row payment-collection-controls">
        <button type="button" className={mode === "hiddenAmount" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenAmount")}>Hidden amount</button>
        <button type="button" className={mode === "duplicateCharge" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("duplicateCharge")}>Duplicate charge</button>
        <button type="button" className={mode === "lostReference" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("lostReference")}>Lost reference</button>
        <button type="button" className={mode === "vagueFailure" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("vagueFailure")}>Vague failure</button>
        <button type="button" className={mode === "prematureReceipt" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("prematureReceipt")}>Premature receipt</button>
        <button type="button" className={mode === "rawDetails" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("rawDetails")}>Raw details</button>
        <button type="button" className={mode === "noReconciliation" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noReconciliation")}>No reconciliation</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

type PasswordInputState = "ready" | "visible" | "caps-lock" | "invalid" | "rate-limited" | "signed-in";

function PasswordInputGoodUx({ meta }: { meta: PatternMeta }) {
  const [email, setEmail] = useState(meta.options[0]);
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [state, setState] = useState<PasswordInputState>("ready");
  const [message, setMessage] = useState("Password is hidden. Paste, autofill, and password-manager values are accepted.");

  const hasPasswordError = state === "invalid" && password.length === 0;
  const statusClass = state === "signed-in" ? "is-success" : state === "invalid" || state === "rate-limited" ? "is-invalid" : state === "visible" ? "is-visible" : "is-ready";

  const toggleVisibility = () => {
    setIsVisible((current) => {
      const next = !current;
      setState(next ? "visible" : "ready");
      setMessage(next ? "Your password is visible. Hide it before continuing if someone can see your screen." : "Your password is hidden.");
      return next;
    });
  };

  const pasteManagerValue = () => {
    setPassword(meta.options[1]);
    setState("ready");
    setMessage("Password-manager value pasted without blocking, truncation, or character rules.");
  };

  const simulateCapsLock = () => {
    setPassword("CORRECT HORSE BATTERY STAPLE");
    setState("caps-lock");
    setMessage("Caps Lock may be on. The warning helps correction without changing the secret.");
  };

  const submitEmpty = () => {
    setPassword("");
    setIsVisible(false);
    setState("invalid");
    setMessage("Enter your password.");
  };

  const failLogin = () => {
    setPassword("");
    setIsVisible(false);
    setState("invalid");
    setMessage("Check your email address and password. The password field was cleared after the failed attempt.");
  };

  const rateLimit = () => {
    setPassword("");
    setIsVisible(false);
    setState("rate-limited");
    setMessage("Too many attempts. Wait 10 minutes or use account recovery; the message does not reveal which credential was wrong.");
  };

  const signIn = () => {
    if (!password) {
      submitEmpty();
      return;
    }
    setIsVisible(false);
    setState("signed-in");
    setMessage("Signed in. The field returned to type password before submit and the secret is not shown on the next step.");
  };

  return (
    <div className="quality-example password-input-demo">
      <div className={`password-input-summary ${statusClass}`} role={state === "invalid" || state === "rate-limited" ? "alert" : "status"} aria-live="polite">
        <strong>{state === "signed-in" ? "Signed in" : state === "visible" ? "Password visible" : state === "caps-lock" ? "Keyboard warning" : state === "rate-limited" ? "Attempts limited" : state === "invalid" ? "Password needs attention" : "Password hidden"}</strong>
        <span>{message}</span>
      </div>

      <div className="password-input-form">
        <label htmlFor="password-input-email">
          <span>Email address</span>
          <input id="password-input-email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" />
        </label>
        <label className={hasPasswordError ? "has-error" : undefined} htmlFor="password-input-password">
          <span>Password</span>
          {hasPasswordError && <strong>Enter your password</strong>}
          <div className="password-input-control">
            <input
              id="password-input-password"
              type={isVisible ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              spellCheck={false}
              autoComplete="current-password"
              autoCapitalize="none"
              aria-describedby={state === "caps-lock" ? "password-input-status password-input-caps" : "password-input-status"}
            />
            <button type="button" className="demo-button small" aria-controls="password-input-password" aria-label={isVisible ? "Hide password" : "Show password"} onClick={toggleVisibility}>
              {isVisible ? "Hide" : "Show"}
            </button>
          </div>
        </label>
      </div>

      <div className="password-input-review" id="password-input-status">
        <span>Credential handling</span>
        <strong>{isVisible ? "Visible until hidden or submitted" : "Hidden by default"} - autocomplete current-password - paste allowed - failed attempts clear the secret</strong>
      </div>
      {state === "caps-lock" && (
        <div className="password-input-caps" id="password-input-caps">
          <strong>Caps Lock may be on</strong>
          <span>The warning does not alter the typed password.</span>
        </div>
      )}

      <div className="demo-row password-input-actions">
        <button type="button" className="demo-button small" onClick={pasteManagerValue}>Paste manager value</button>
        <button type="button" className="demo-button small" onClick={toggleVisibility}>{isVisible ? "Hide password" : "Show password"}</button>
        <button type="button" className="demo-button small" onClick={simulateCapsLock}>Caps Lock warning</button>
        <button type="button" className="demo-button small" onClick={submitEmpty}>Submit empty</button>
        <button type="button" className="demo-button small" onClick={failLogin}>Fail login</button>
        <button type="button" className="demo-button small" onClick={rateLimit}>Too many attempts</button>
        <button type="button" className="demo-button small primary" onClick={signIn}>Sign in safely</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function PasswordInputBadUx({ meta }: { meta: PatternMeta }) {
  const [state, setState] = useState("Visible text");
  const [message, setMessage] = useState("The broken sign-in form treats the password as ordinary text and makes safe password-manager use harder.");

  return (
    <div className="quality-example password-input-demo">
      <div className="password-input-bad-ui">
        <label>
          <span>{meta.field}</span>
          <input type="text" defaultValue="hunter2-password" aria-label="Visible password text" />
        </label>
        <div className="textarea-status-grid bad">
          <div>
            <span>State</span>
            <strong>{state}</strong>
          </div>
          <div>
            <span>Error style</span>
            <strong>Password-specific leak</strong>
          </div>
        </div>
        <div className="demo-row password-input-actions">
          <button type="button" className="demo-button small" onClick={() => {
            setState("Paste blocked");
            setMessage("The field blocks paste, so generated passwords and password managers are harder to use.");
          }}>Block paste</button>
          <button type="button" className="demo-button small" onClick={() => {
            setState("Account enumerated");
            setMessage("The error says Password incorrect, confirming that the email address exists.");
          }}>Reveal wrong part</button>
          <button type="button" className="demo-button small" onClick={() => {
            setState("Still visible");
            setMessage("The password remains visible after submit and after the failed attempt.");
          }}>Keep visible</button>
          <button type="button" className="demo-button small primary" onClick={() => {
            setState("Logged raw secret");
            setMessage("The raw password was included in analytics and support context instead of being confined to authentication.");
          }}>Log secret</button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

type PasswordCreationState = "ready" | "visible" | "too-short" | "blocked" | "breached" | "accepted" | "submitted";

function PasswordCreationGoodUx() {
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [state, setState] = useState<PasswordCreationState>("ready");
  const [message, setMessage] = useState("Create a new password. Generated passwords, paste, spaces, and long passphrases are accepted.");

  const lower = password.toLowerCase();
  const lengthOk = password.length >= 15;
  const commonBlocked = ["password123", "password123!", "summer2026", "letmein"].includes(lower);
  const breachedBlocked = lower === "correct horse battery staple";
  const serviceNameBlocked = lower.includes("catalog");
  const accepted = lengthOk && !commonBlocked && !breachedBlocked && !serviceNameBlocked;
  const statusClass = state === "accepted" || state === "submitted" ? "is-accepted" : state === "visible" || state === "ready" ? "is-ready" : "is-invalid";

  const assess = (value = password) => {
    const next = value.toLowerCase();
    if (value.length < 15) {
      setState("too-short");
      setMessage("Use at least 15 characters or a generated password.");
      return false;
    }
    if (["password123", "password123!", "summer2026", "letmein"].includes(next) || next.includes("catalog")) {
      setState("blocked");
      setMessage(next.includes("catalog") ? "Do not use the service name in your password." : "This password is commonly used. Choose a less predictable password.");
      return false;
    }
    if (next === "correct horse battery staple") {
      setState("breached");
      setMessage("This passphrase appears in exposed-password data. Choose a different one.");
      return false;
    }
    setState("accepted");
    setMessage("Password accepted: long enough, not commonly used, and no character-class checklist required.");
    return true;
  };

  const pasteGenerated = () => {
    const generated = "Mango-river-47-lantern-quiet-orbit";
    setPassword(generated);
    setIsVisible(false);
    setState("accepted");
    setMessage("Generated password pasted and accepted without truncation.");
  };

  const usePassphrase = () => {
    const passphrase = "river lantern map orbit";
    setPassword(passphrase);
    setIsVisible(false);
    assess(passphrase);
  };

  const makeTooShort = () => {
    setPassword("short pass");
    setIsVisible(false);
    setState("too-short");
    setMessage("Use at least 15 characters or a generated password.");
  };

  const useCommon = () => {
    setPassword("Password123!");
    setIsVisible(false);
    setState("blocked");
    setMessage("This password is commonly used. Choose a less predictable password.");
  };

  const useBreached = () => {
    setPassword("correct horse battery staple");
    setIsVisible(false);
    setState("breached");
    setMessage("This passphrase appears in exposed-password data. Choose a different one.");
  };

  const useServiceName = () => {
    setPassword("CatalogAccount2026");
    setIsVisible(false);
    setState("blocked");
    setMessage("Do not use the service name in your password.");
  };

  const toggleVisibility = () => {
    setIsVisible((current) => {
      const next = !current;
      setState(next ? "visible" : accepted ? "accepted" : "ready");
      setMessage(next ? "Your new password is visible. Hide it if someone can see your screen." : "Your new password is hidden.");
      return next;
    });
  };

  const submitPassword = () => {
    if (!assess()) return;
    setIsVisible(false);
    setState("submitted");
    setMessage("Password saved. The next step can offer MFA or passwordless setup without showing the new password.");
  };

  return (
    <div className="quality-example password-creation-demo">
      <div className={`password-creation-summary ${statusClass}`} role={state === "too-short" || state === "blocked" || state === "breached" ? "alert" : "status"} aria-live="polite">
        <strong>{state === "submitted" ? "Password saved" : state === "accepted" ? "Password accepted" : state === "visible" ? "Password visible" : state === "too-short" ? "Password too short" : state === "blocked" ? "Password blocked" : state === "breached" ? "Password exposed" : "Create password"}</strong>
        <span>{message}</span>
      </div>

      <div className="password-creation-form">
        <label className={state === "too-short" || state === "blocked" || state === "breached" ? "has-error" : undefined} htmlFor="password-creation-new">
          <span>New password</span>
          {(state === "too-short" || state === "blocked" || state === "breached") && <strong>{message}</strong>}
          <div className="password-creation-control">
            <input
              id="password-creation-new"
              type={isVisible ? "text" : "password"}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setState("ready");
                setMessage("Keep typing or paste a generated password; validation will explain any rejection.");
              }}
              spellCheck={false}
              autoComplete="new-password"
              autoCapitalize="none"
              aria-describedby="password-creation-policy password-creation-meter"
            />
            <button type="button" className="demo-button small" aria-controls="password-creation-new" aria-label={isVisible ? "Hide new password" : "Show new password"} onClick={toggleVisibility}>
              {isVisible ? "Hide" : "Show"}
            </button>
          </div>
        </label>
      </div>

      <div className="password-creation-meter" id="password-creation-meter">
        <span>Status</span>
        <strong>{accepted ? "Ready to save" : password ? "Needs correction" : "Waiting for password"} - {password ? `${password.length} characters` : "0 characters"} - spaces allowed - no symbol checklist</strong>
      </div>

      <div className="password-creation-policy" id="password-creation-policy">
        <div>
          <span>Length</span>
          <strong>{lengthOk ? "15+ characters" : "Needs 15+"}</strong>
        </div>
        <div>
          <span>Blocked list</span>
          <strong>{commonBlocked || serviceNameBlocked ? "Blocked" : "No local match"}</strong>
        </div>
        <div>
          <span>Exposed data</span>
          <strong>{breachedBlocked ? "Seen before" : "No demo match"}</strong>
        </div>
      </div>

      <div className="demo-row password-creation-actions">
        <button type="button" className="demo-button small" onClick={pasteGenerated}>Paste generated</button>
        <button type="button" className="demo-button small" onClick={usePassphrase}>Use passphrase</button>
        <button type="button" className="demo-button small" onClick={makeTooShort}>Too short</button>
        <button type="button" className="demo-button small" onClick={useCommon}>Common password</button>
        <button type="button" className="demo-button small" onClick={useBreached}>Breached sample</button>
        <button type="button" className="demo-button small" onClick={useServiceName}>Use service name</button>
        <button type="button" className="demo-button small" onClick={toggleVisibility}>{isVisible ? "Hide password" : "Show password"}</button>
        <button type="button" className="demo-button small primary" onClick={submitPassword}>Save password</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function PasswordCreationBadUx({ meta }: { meta: PatternMeta }) {
  const [state, setState] = useState("Checklist only");
  const [message, setMessage] = useState("The broken form rewards predictable substitutions and blocks safer generated passwords.");

  return (
    <div className="quality-example password-creation-demo">
      <div className="password-creation-bad-ui">
        <label>
          <span>{meta.field}</span>
          <input type="password" defaultValue="Password123!" aria-label="Weak new password" />
        </label>
        <div className="password-creation-policy bad">
          <div>
            <span>Uppercase</span>
            <strong>Yes</strong>
          </div>
          <div>
            <span>Number</span>
            <strong>Yes</strong>
          </div>
          <div>
            <span>Symbol</span>
            <strong>Yes</strong>
          </div>
        </div>
        <div className="demo-row password-creation-actions">
          <button type="button" className="demo-button small" onClick={() => {
            setState("Paste blocked");
            setMessage("The form blocks a generated password from the password manager.");
          }}>Block paste</button>
          <button type="button" className="demo-button small" onClick={() => {
            setState("Spaces rejected");
            setMessage("The form rejects a strong passphrase because it contains spaces.");
          }}>Reject spaces</button>
          <button type="button" className="demo-button small" onClick={() => {
            setState("Truncated");
            setMessage("The form silently cuts a long generated password at 12 characters.");
          }}>Truncate generated</button>
          <button type="button" className="demo-button small primary" onClick={() => {
            setState("Accepted Password123");
            setMessage("The checklist accepts Password123! because it has uppercase, number, and symbol, despite being predictable.");
          }}>Accept weak password</button>
        </div>
        <div className="textarea-status-grid bad">
          <div>
            <span>State</span>
            <strong>{state}</strong>
          </div>
          <div>
            <span>Strength model</span>
            <strong>Character classes only</strong>
          </div>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

type EmailAddressState = "empty" | "valid" | "invalid" | "typo" | "reviewed" | "pending" | "verified";

function EmailAddressEntryGoodUx({ meta }: { meta: PatternMeta }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<EmailAddressState>("empty");
  const [message, setMessage] = useState("Enter the email address that should receive the receipt.");
  const normalizedEmail = email.trim();
  const likelyTypo = normalizedEmail.toLowerCase().endsWith("@gmial.com") || normalizedEmail.toLowerCase().endsWith("@homtail.com");
  const suggestedEmail = normalizedEmail.toLowerCase().endsWith("@gmial.com")
    ? normalizedEmail.replace(/@gmial\.com$/i, "@gmail.com")
    : normalizedEmail.replace(/@homtail\.com$/i, "@hotmail.com");
  const validFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) && !normalizedEmail.includes(",");
  const hasError = state === "invalid";
  const statusClass = state === "verified" || state === "reviewed" ? "is-reviewed" : state === "pending" || state === "typo" ? "is-warning" : state === "invalid" ? "is-invalid" : "is-ready";

  const pastePlusAddress = () => {
    setEmail(meta.options[0]);
    setState("valid");
    setMessage("Pasted address kept the plus tag, subdomain, and domain exactly as entered.");
  };

  const makeMalformed = () => {
    setEmail("not an email address");
    setState("invalid");
    setMessage("Enter an email address in the correct format, like name@example.com.");
  };

  const warnTypo = () => {
    setEmail(meta.options[1]);
    setState("typo");
    setMessage("This looks like gmial.com. The user can change to gmail.com or keep the original address.");
  };

  const useSuggestion = () => {
    if (!likelyTypo) {
      setMessage("No provider typo suggestion is active.");
      return;
    }
    setEmail(suggestedEmail);
    setState("valid");
    setMessage(`Changed to ${suggestedEmail}. Review the exact address before sending.`);
  };

  const keepOriginal = () => {
    if (!likelyTypo) {
      setMessage("No provider typo warning is active.");
      return;
    }
    setState("valid");
    setMessage(`Keeping ${normalizedEmail}. Uncommon domains can be genuine.`);
  };

  const validateEmail = () => {
    if (!normalizedEmail) {
      setState("invalid");
      setMessage("Enter an email address.");
      return false;
    }
    if (!validFormat) {
      setState("invalid");
      setMessage(normalizedEmail.includes(",") ? "Enter one email address only." : "Enter an email address in the correct format, like name@example.com.");
      return false;
    }
    if (likelyTypo) {
      setState("typo");
      setMessage("Check the domain. This may be a mistyped email provider.");
      return false;
    }
    setState("valid");
    setMessage("Email format accepted. Review the exact address before sending.");
    return true;
  };

  const reviewAddress = () => {
    if (!validateEmail()) return;
    setState("reviewed");
    setMessage(`Review: receipt will be sent to ${normalizedEmail}.`);
  };

  const confirmationPending = () => {
    if (!validateEmail()) return;
    setState("pending");
    setMessage(`Confirmation link sent to ${normalizedEmail}; use this only when mailbox access is essential.`);
  };

  const markVerified = () => {
    if (state !== "pending") {
      setMessage("Send a confirmation link before marking mailbox access as verified.");
      return;
    }
    setState("verified");
    setMessage(`Mailbox access verified for ${normalizedEmail}.`);
  };

  return (
    <div className="quality-example email-address-demo">
      <div className={`email-address-summary ${statusClass}`} role={state === "invalid" ? "alert" : "status"} aria-live="polite">
        <strong>{state === "verified" ? "Email verified" : state === "pending" ? "Confirmation pending" : state === "reviewed" ? "Address reviewed" : state === "typo" ? "Check email domain" : state === "invalid" ? "Email needs correction" : "Email address"}</strong>
        <span>{message}</span>
      </div>

      <label className={hasError ? "email-address-field has-error" : "email-address-field"} htmlFor="email-address-entry-input">
        <span>Email address</span>
        <small>We will only use this to send your receipt.</small>
        {hasError && <strong>{message}</strong>}
        <input
          id="email-address-entry-input"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setState("empty");
            setMessage("Keep typing or paste the address; validation will preserve the value.");
          }}
          type="email"
          autoComplete="email"
          spellCheck={false}
          aria-describedby="email-address-purpose email-address-status"
        />
      </label>

      {state === "typo" && (
        <div className="email-address-warning" role="status">
          <span>Possible typo</span>
          <strong>Did you mean {suggestedEmail}?</strong>
          <div className="demo-row email-address-actions">
            <button type="button" className="demo-button small" onClick={useSuggestion}>Use suggestion</button>
            <button type="button" className="demo-button small" onClick={keepOriginal}>Keep original</button>
          </div>
        </div>
      )}

      <div className="email-address-review" id="email-address-status">
        <span>Review and contactability</span>
        <strong>{normalizedEmail || "No address entered"} - {validFormat ? "email-shaped" : "not ready"} - {state === "verified" ? "mailbox access verified" : state === "pending" ? "confirmation pending" : "not access-verified"}</strong>
      </div>

      <div className="demo-row email-address-actions">
        <button type="button" className="demo-button small" onClick={pastePlusAddress}>Paste plus address</button>
        <button type="button" className="demo-button small" onClick={makeMalformed}>Make malformed</button>
        <button type="button" className="demo-button small" onClick={warnTypo}>Provider typo</button>
        <button type="button" className="demo-button small" onClick={validateEmail}>Validate format</button>
        <button type="button" className="demo-button small" onClick={reviewAddress}>Review address</button>
        <button type="button" className="demo-button small" onClick={confirmationPending}>Send confirmation</button>
        <button type="button" className="demo-button small primary" onClick={markVerified}>Mark verified</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function EmailAddressEntryBadUx({ meta }: { meta: PatternMeta }) {
  const [state, setState] = useState("Plain text");
  const [message, setMessage] = useState("The broken form treats email as ordinary text and invents friction instead of review.");

  return (
    <div className="quality-example email-address-demo">
      <div className="email-address-bad-ui">
        <label>
          <span>{meta.field}</span>
          <input type="text" defaultValue="alex+receipts@example.co.uk" aria-label="Email as plain text" />
        </label>
        <label>
          <span>Repeat email</span>
          <input type="text" defaultValue="alexreceipts@example.co.uk" aria-label="Repeated email" />
        </label>
        <div className="textarea-status-grid bad">
          <div>
            <span>State</span>
            <strong>{state}</strong>
          </div>
          <div>
            <span>Recovery</span>
            <strong>No review path</strong>
          </div>
        </div>
        <div className="demo-row email-address-actions">
          <button type="button" className="demo-button small" onClick={() => {
            setState("Paste blocked");
            setMessage("The field blocks paste even though users often copy email from password managers or profiles.");
          }}>Block paste</button>
          <button type="button" className="demo-button small" onClick={() => {
            setState("Plus tag rejected");
            setMessage("The form rejects alex+receipts@example.co.uk even though plus-addressed mailboxes can be valid.");
          }}>Reject plus tag</button>
          <button type="button" className="demo-button small" onClick={() => {
            setState("Silently corrected");
            setMessage("The service silently changed gmial.com to gmail.com and may send email to the wrong mailbox.");
          }}>Silent correction</button>
          <button type="button" className="demo-button small primary" onClick={() => {
            setState("Forced repeat");
            setMessage("The user must retype the address instead of reviewing and changing one preserved value.");
          }}>Force repeat</button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

type PhoneNumberState = "empty" | "valid" | "invalid" | "sms-only" | "no-phone" | "reviewed" | "pending" | "verified";

function PhoneNumberEntryGoodUx({ meta }: { meta: PatternMeta }) {
  const [value, setValue] = useState("");
  const [state, setState] = useState<PhoneNumberState>("empty");
  const [message, setMessage] = useState("Enter a phone number only if this is a good way to contact you.");
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");
  const extensionMatch = trimmed.match(/\b(?:ext|extension|x)\s*(\d{1,6})\b/i);
  const hasExtension = Boolean(extensionMatch);
  const localUkMobile = /^07\d{9}$/.test(digits);
  const localUkLandline = /^0[123]\d{9}$/.test(digits);
  const international = /^\+\d[\d\s().-]{6,24}$/.test(trimmed) && digits.length >= 8 && digits.length <= 15;
  const validFormat = localUkMobile || localUkLandline || international || (hasExtension && digits.length >= 10 && digits.length <= 21);
  const canonical = trimmed.startsWith("+")
    ? `+${digits.slice(0, 15)}${hasExtension ? ` ext ${extensionMatch?.[1]}` : ""}`
    : localUkMobile || localUkLandline
      ? `+44${digits.slice(1)}${hasExtension ? ` ext ${extensionMatch?.[1]}` : ""}`
      : hasExtension
        ? `${digits.slice(0, -((extensionMatch?.[1] ?? "").length))} ext ${extensionMatch?.[1]}`
        : digits;
  const hasError = state === "invalid" || state === "sms-only";
  const statusClass = state === "verified" || state === "reviewed" ? "is-reviewed" : state === "pending" || state === "no-phone" ? "is-warning" : hasError ? "is-invalid" : "is-ready";

  const pasteUkMobile = () => {
    setValue(meta.options[0]);
    setState("valid");
    setMessage("Pasted UK mobile preserved the familiar spaces and prepared a dialable +44 value for the backend.");
  };

  const pasteInternational = () => {
    setValue(meta.options[1]);
    setState("valid");
    setMessage("International number kept the plus sign and country code without forcing a domestic mask.");
  };

  const addExtension = () => {
    setValue(meta.options[2]);
    setState("valid");
    setMessage("Extension kept as explicit dialing instructions instead of being stripped from the main number.");
  };

  const makeInvalid = () => {
    setValue("123");
    setState("invalid");
    setMessage("Enter a phone number, like 07700 900 982 or +44 808 157 0192.");
  };

  const noPhone = () => {
    setState("no-phone");
    setMessage("No phone number recorded. Offer email, letter, relay, or support contact instead of blocking progress.");
  };

  const requireSmsOnly = () => {
    setValue("020 7946 0018");
    setState("sms-only");
    setMessage("This looks callable but not necessarily SMS-capable. Do not require text-message verification without another route.");
  };

  const validatePhone = () => {
    if (!trimmed) {
      setState("invalid");
      setMessage("Enter a phone number or choose another contact method.");
      return false;
    }
    if (!validFormat) {
      setState("invalid");
      setMessage("Enter a phone number, like 07700 900 982 or +44 808 157 0192.");
      return false;
    }
    setState("valid");
    setMessage("Phone number format accepted. Review how and when it will be used.");
    return true;
  };

  const reviewNumber = () => {
    if (!validatePhone()) return;
    setState("reviewed");
    setMessage(`Review: contact by phone at ${trimmed}; backend value ${canonical}.`);
  };

  const sendCode = () => {
    if (!validatePhone()) return;
    if (!localUkMobile && !international) {
      setState("sms-only");
      setMessage("Do not send an SMS code unless the number and contact preference can receive texts.");
      return;
    }
    setState("pending");
    setMessage(`Confirmation code sent to ${trimmed}; use only when phone access must be proven.`);
  };

  const markVerified = () => {
    if (state !== "pending") {
      setMessage("Send a confirmation code before marking phone access as verified.");
      return;
    }
    setState("verified");
    setMessage(`Phone access verified for ${trimmed}.`);
  };

  return (
    <div className="quality-example phone-number-demo">
      <div className={`phone-number-summary ${statusClass}`} role={hasError ? "alert" : "status"} aria-live="polite">
        <strong>{state === "verified" ? "Phone verified" : state === "pending" ? "Confirmation pending" : state === "reviewed" ? "Number reviewed" : state === "no-phone" ? "Alternative contact" : hasError ? "Phone needs correction" : "Phone number"}</strong>
        <span>{message}</span>
      </div>

      <label className={hasError ? "phone-number-field has-error" : "phone-number-field"} htmlFor="phone-number-entry-input">
        <span>UK mobile or international phone number</span>
        <small id="phone-number-purpose">We will call only if we need to rearrange the appointment. You can choose another contact method.</small>
        {hasError && <strong>{message}</strong>}
        <input
          id="phone-number-entry-input"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setState("empty");
            setMessage("Keep the number in the format you recognise; spaces and plus signs are allowed.");
          }}
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          aria-describedby="phone-number-purpose phone-number-status"
        />
      </label>

      <div className="phone-number-review" id="phone-number-status">
        <span>Review and contactability</span>
        <strong>{trimmed || "No number entered"} - {validFormat ? "callable shape" : "not ready"} - {state === "verified" ? "phone access verified" : state === "pending" ? "confirmation pending" : state === "no-phone" ? "alternative contact needed" : "not access-verified"} - backend {canonical || "empty"}</strong>
      </div>

      <div className="demo-row phone-number-actions">
        <button type="button" className="demo-button small" onClick={pasteUkMobile}>Paste UK mobile</button>
        <button type="button" className="demo-button small" onClick={pasteInternational}>Use international</button>
        <button type="button" className="demo-button small" onClick={addExtension}>Add extension</button>
        <button type="button" className="demo-button small" onClick={makeInvalid}>Make invalid</button>
        <button type="button" className="demo-button small" onClick={noPhone}>No phone</button>
        <button type="button" className="demo-button small" onClick={requireSmsOnly}>SMS risk</button>
        <button type="button" className="demo-button small" onClick={reviewNumber}>Review number</button>
        <button type="button" className="demo-button small" onClick={sendCode}>Send code</button>
        <button type="button" className="demo-button small primary" onClick={markVerified}>Mark verified</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function PhoneNumberEntryBadUx({ meta }: { meta: PatternMeta }) {
  const [state, setState] = useState("Domestic mask");
  const [message, setMessage] = useState("The broken flow treats phone numbers as one domestic digit string and assumes SMS access.");

  return (
    <div className="quality-example phone-number-demo">
      <div className="phone-number-bad-ui">
        <label>
          <span>{meta.field}</span>
          <input type="text" defaultValue="07700-900-982" aria-label="Phone in fixed mask" />
        </label>
        <div className="textarea-status-grid bad">
          <div>
            <span>State</span>
            <strong>{state}</strong>
          </div>
          <div>
            <span>Contact choice</span>
            <strong>SMS only</strong>
          </div>
        </div>
        <div className="demo-row phone-number-actions">
          <button type="button" className="demo-button small" onClick={() => {
            setState("International blocked");
            setMessage("The domestic mask rejects +44 808 157 0192 even though the service says international numbers are allowed.");
          }}>Block international</button>
          <button type="button" className="demo-button small" onClick={() => {
            setState("Leading zero stripped");
            setMessage("The service stored the number as a numeric value and removed the leading zero.");
          }}>Strip leading zero</button>
          <button type="button" className="demo-button small" onClick={() => {
            setState("Extension lost");
            setMessage("The field discards extension 204, so the caller cannot reach the right desk.");
          }}>Drop extension</button>
          <button type="button" className="demo-button small primary" onClick={() => {
            setState("SMS forced");
            setMessage("The flow blocks users who cannot receive SMS, have a landline, share a phone, or need another contact method.");
          }}>Force SMS</button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

type NameEntryState = "empty" | "valid" | "invalid" | "official" | "preferred" | "previous" | "transcription" | "reviewed";

function NameEntryGoodUx({ meta }: { meta: PatternMeta }) {
  const [fullName, setFullName] = useState("");
  const [addressAs, setAddressAs] = useState("");
  const [latinTranscription, setLatinTranscription] = useState("");
  const [previousName, setPreviousName] = useState("");
  const [state, setState] = useState<NameEntryState>("empty");
  const [message, setMessage] = useState("Enter the name this service should store. We will not split it unless there is a service need.");
  const trimmed = fullName.trim();
  const hasError = state === "invalid";
  const hasNonLatin = /[^\u0000-\u00ff]/.test(trimmed);
  const hasNameCharacters = /[\p{L}\p{N}]/u.test(trimmed);
  const statusClass = state === "reviewed" || state === "preferred" ? "is-reviewed" : state === "official" || state === "previous" || state === "transcription" ? "is-warning" : hasError ? "is-invalid" : "is-ready";

  const useGlobalName = () => {
    setFullName(meta.options[0]);
    setAddressAs("María-José");
    setState("valid");
    setMessage("Name kept with accent, hyphen, spaces, and two family-name parts.");
  };

  const useNativeScript = () => {
    setFullName(meta.options[1]);
    setLatinTranscription("Yasuhiro Kobayashi");
    setState("transcription");
    setMessage("Native-script name accepted; ask for Latin transcription only if staff or systems need it.");
  };

  const useOfficialName = () => {
    setFullName(meta.options[2]);
    setAddressAs("Dr van der Waals");
    setState("official");
    setMessage("Official-name mode explains that the name must match documents and still preserves casing.");
  };

  const makeSingleLetter = () => {
    setFullName("Q");
    setAddressAs("Q");
    setState("valid");
    setMessage("Single-letter names are allowed; do not block them as initials.");
  };

  const makeInvalid = () => {
    setFullName("");
    setState("invalid");
    setMessage("Enter your full name.");
  };

  const addPreferred = () => {
    if (!trimmed) {
      setFullName(meta.options[0]);
    }
    setAddressAs("María-José");
    setState("preferred");
    setMessage("Preferred form of address captured separately instead of assuming a given-name part.");
  };

  const addPreviousName = () => {
    setPreviousName("Samira Patel");
    setState("previous");
    setMessage("Previous name uses neutral wording instead of maiden name or gendered assumptions.");
  };

  const validateName = () => {
    if (!trimmed) {
      setState("invalid");
      setMessage("Enter your full name.");
      return false;
    }
    if (!hasNameCharacters) {
      setState("invalid");
      setMessage("Enter a name using letters, numbers, spaces, punctuation, or characters from your writing system.");
      return false;
    }
    setState("valid");
    setMessage("Name accepted without case changes, title requirement, or forced first-name and last-name split.");
    return true;
  };

  const reviewName = () => {
    if (!validateName()) return;
    setState("reviewed");
    setMessage(`Review: store ${trimmed}${addressAs ? `; address as ${addressAs}` : ""}${latinTranscription ? `; Latin transcription ${latinTranscription}` : ""}.`);
  };

  return (
    <div className="quality-example name-entry-demo">
      <div className={`name-entry-summary ${statusClass}`} role={hasError ? "alert" : "status"} aria-live="polite">
        <strong>{state === "reviewed" ? "Name reviewed" : state === "preferred" ? "Preferred address captured" : state === "transcription" ? "Transcription captured" : state === "official" ? "Official name requested" : state === "previous" ? "Previous name captured" : hasError ? "Name needs correction" : "Name entry"}</strong>
        <span>{message}</span>
      </div>

      <label className={hasError ? "name-entry-field has-error" : "name-entry-field"} htmlFor="name-entry-full">
        <span>{state === "official" ? "Name as shown on your official document" : "Full name"}</span>
        <small id="name-entry-purpose">{state === "official" ? "Use the name exactly as it appears on your passport, licence, or official record." : "Use the name you want this service to store. Names may include spaces, accents, punctuation, and one-letter parts."}</small>
        {hasError && <strong>{message}</strong>}
        <input
          id="name-entry-full"
          value={fullName}
          onChange={(event) => {
            setFullName(event.target.value);
            setState("empty");
            setMessage("Keep typing; the value will be preserved exactly as entered.");
          }}
          type="text"
          autoComplete="name"
          spellCheck={false}
          aria-describedby="name-entry-purpose name-entry-status"
          dir={hasNonLatin ? "auto" : undefined}
        />
      </label>

      <div className="name-entry-support-grid">
        <label>
          <span>What should we call you?</span>
          <input value={addressAs} onChange={(event) => setAddressAs(event.target.value)} autoComplete="nickname" spellCheck={false} />
        </label>
        <label>
          <span>Latin transcription, if needed</span>
          <input value={latinTranscription} onChange={(event) => setLatinTranscription(event.target.value)} spellCheck={false} />
        </label>
        <label>
          <span>Previous name</span>
          <input value={previousName} onChange={(event) => setPreviousName(event.target.value)} autoComplete="name" spellCheck={false} />
        </label>
      </div>

      <div className="name-entry-review" id="name-entry-status">
        <span>Review and storage</span>
        <strong>{trimmed || "No name entered"} - {hasNameCharacters ? "name-shaped" : "not ready"} - {state === "official" ? "official-document name" : "service display name"} - {hasNonLatin ? "native script present" : "Latin or mixed script"}</strong>
      </div>

      <div className="demo-row name-entry-actions">
        <button type="button" className="demo-button small" onClick={useGlobalName}>Use long name</button>
        <button type="button" className="demo-button small" onClick={useNativeScript}>Use native script</button>
        <button type="button" className="demo-button small" onClick={useOfficialName}>Official-name mode</button>
        <button type="button" className="demo-button small" onClick={makeSingleLetter}>Single-letter name</button>
        <button type="button" className="demo-button small" onClick={makeInvalid}>Make missing</button>
        <button type="button" className="demo-button small" onClick={addPreferred}>Preferred address</button>
        <button type="button" className="demo-button small" onClick={addPreviousName}>Previous name</button>
        <button type="button" className="demo-button small" onClick={validateName}>Validate name</button>
        <button type="button" className="demo-button small primary" onClick={reviewName}>Review name</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function NameEntryBadUx({ meta }: { meta: PatternMeta }) {
  const [state, setState] = useState("Split fields");
  const [message, setMessage] = useState("The broken flow assumes every person has a title, first name, middle initial, and last name.");

  return (
    <div className="quality-example name-entry-demo">
      <div className="name-entry-bad-ui">
        <label>
          <span>Title</span>
          <select defaultValue="Mrs" aria-label="Required title">
            <option>Mr</option>
            <option>Mrs</option>
            <option>Miss</option>
            <option>Ms</option>
          </select>
        </label>
        <label>
          <span>First name</span>
          <input type="text" defaultValue={meta.options[0].split(" ")[0]} aria-label="First name only" />
        </label>
        <label>
          <span>Last name</span>
          <input type="text" defaultValue="Quinones" aria-label="Last name only ASCII" />
        </label>
        <div className="textarea-status-grid bad">
          <div>
            <span>State</span>
            <strong>{state}</strong>
          </div>
          <div>
            <span>Storage</span>
            <strong>ASCII parts</strong>
          </div>
        </div>
        <div className="demo-row name-entry-actions">
          <button type="button" className="demo-button small" onClick={() => {
            setState("Title forced");
            setMessage("The title list forces gender and marital-status disclosure and still misses many titles.");
          }}>Force title</button>
          <button type="button" className="demo-button small" onClick={() => {
            setState("Family name required");
            setMessage("The required last-name field blocks users with a single name and encourages garbage values.");
          }}>Require last name</button>
          <button type="button" className="demo-button small" onClick={() => {
            setState("ASCII only");
            setMessage("The field strips accents and native-script characters from the user's actual name.");
          }}>Strip accents</button>
          <button type="button" className="demo-button small primary" onClick={() => {
            setState("Auto-capitalized");
            setMessage("The system changes van der Waals to Van Der Waals and McNamara to Mcnamara.");
          }}>Auto-capitalize</button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function TextareaGoodUx({ meta }: { meta: PatternMeta }) {
  const limit = 160;
  const [value, setValue] = useState(meta.options[0] ?? "");
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("Multiple lines remain visible and editable while the user writes.");
  const remaining = limit - value.length;
  const emptyError = submitted && value.trim().length === 0;
  const tooLongError = submitted && remaining < 0;
  const hasError = emptyError || tooLongError;

  const submit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setSubmitted(true);
    if (value.trim().length === 0) {
      setMessage("Enter more detail. The textarea stays open for recovery.");
      return;
    }
    if (remaining < 0) {
      setMessage(`Draft preserved. Remove ${Math.abs(remaining)} characters before submitting.`);
      return;
    }
    setMessage(`Saved ${value.split(/\n/).length} ${value.includes("\n") ? "lines" : "line"} without changing the wording.`);
  };

  return (
    <form className="quality-example textarea-demo" onSubmit={submit}>
      <label className={hasError ? "textarea-field has-error" : "textarea-field"}>
        <span>{meta.field}</span>
        <small id="textarea-good-hint">Do not include personal or financial information.</small>
        {hasError && (
          <strong id="textarea-good-error">
            {emptyError ? "Enter more detail" : `${meta.field} must be ${limit} characters or less`}
          </strong>
        )}
        <textarea
          aria-describedby={hasError ? "textarea-good-hint textarea-good-count textarea-good-error" : "textarea-good-hint textarea-good-count"}
          aria-invalid={hasError || undefined}
          rows={5}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            if (submitted) setMessage("Draft text is preserved while length and required state are recalculated.");
          }}
        />
      </label>
      <div className={remaining < 0 ? "textarea-count-row is-over" : "textarea-count-row"} id="textarea-good-count" aria-live="polite">
        <span>{remaining >= 0 ? `${remaining} characters remaining` : `${Math.abs(remaining)} characters too many`}</span>
        <em>{value.split(/\n/).length} visible {value.split(/\n/).length === 1 ? "line" : "lines"} - line breaks preserved</em>
      </div>
      <div className="demo-row textarea-actions">
        <button type="submit" className="demo-button small primary">Submit</button>
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            setValue(`${value.trim()}\nI have screenshots and dates if needed.`.trim());
            setSubmitted(false);
            setMessage("Added another line without replacing the existing draft.");
          }}
        >
          Add paragraph
        </button>
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            setValue("");
            setSubmitted(true);
            setMessage("Required validation appears after submit and keeps the textarea available.");
          }}
        >
          Empty then validate
        </button>
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            setValue("This long draft keeps the user's full explanation visible while the product asks them to shorten it. It is intentionally too long so the recovery state can show a count and preserve the full text.");
            setSubmitted(true);
            setMessage("Over-limit draft is preserved so the user can edit it down.");
          }}
        >
          Make too long
        </button>
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            setValue(meta.options[0] ?? "");
            setSubmitted(false);
            setMessage("Sample draft restored with line breaks intact.");
          }}
        >
          Restore draft
        </button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </form>
  );
}

function TextareaBadUx() {
  const [value, setValue] = useState("I called the office on Monday. They asked me to upload evidence.");
  const [status, setStatus] = useState("A long-answer task is forced into a one-line field.");
  const [stored, setStored] = useState("Hidden limit");

  return (
    <div className="quality-example textarea-demo">
      <input
        aria-label="Paragraph answer forced into one line"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <div className="textarea-status-grid bad">
        <div>
          <span>Limit message</span>
          <strong>{stored}</strong>
        </div>
        <div>
          <span>Draft state</span>
          <strong>{value ? "Partly hidden" : "Lost"}</strong>
        </div>
      </div>
      <div className="demo-row textarea-actions">
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            setValue("I called the office on Monday.");
            setStored("Truncated");
            setStatus("Pasted paragraphs were cut down without a visible count or review area.");
          }}
        >
          Paste paragraphs
        </button>
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            setStored("Too long");
            setStatus("The length failure appears only after submit, but the control still hides most of the answer.");
          }}
        >
          Submit too long
        </button>
        <button
          type="button"
          className="demo-button small danger"
          onClick={() => {
            setValue("");
            setStored("Draft cleared");
            setStatus("The user's long drafted answer was cleared after validation failed.");
          }}
        >
          Clear after error
        </button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function GoodUiExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <InputUi patternId={patternId} meta={meta} good />;
}

function BadUiExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <InputUi patternId={patternId} meta={meta} />;
}

function GoodUxExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <InputGoodUx patternId={patternId} meta={meta} />;
}

function BadUxExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <InputBadUx patternId={patternId} meta={meta} />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
