import { useState } from "react";
import { BrokenCustomSelect, QualityPanel, StateUi, short, type PatternMeta } from './shared';

function AntiUi({ patternId, meta, good = false }: { patternId: string; meta: PatternMeta; good?: boolean }) {
  if (!good) {
    if (patternId === "dead-end-empty-state") return <div className="blank-area" aria-label="Blank empty state"></div>;
    if (patternId === "disabled-button-no-explanation") {
      return (
        <div className="disabled-action-bad-ui bad-ui-sample">
          <input value="" readOnly aria-label="Workspace name without requirement" placeholder="Workspace name" />
          <button type="button" className="demo-button" disabled>Create workspace</button>
        </div>
      );
    }
    if (patternId === "icon-only-ambiguous-action") {
      return (
        <div className="ambiguous-icon-row bad-ui-sample" aria-label="Ambiguous row actions">
          <span>Q2 risk report</span>
          <button type="button" className="mystery-icon-button">!</button>
          <button type="button" className="mystery-icon-button">▣</button>
          <button type="button" className="mystery-icon-button">↗</button>
        </div>
      );
    }
    if (patternId === "inaccessible-custom-select") {
      return (
        <div className="broken-select-panel bad-ui-sample">
          <div className="fake-select"><span>Team</span><span>v</span></div>
          <p className="demo-status">Looks selectable; no role, value, or option state.</p>
        </div>
      );
    }
    if (patternId === "infinite-spinner") {
      return (
        <div className="infinite-spinner-bad-ui bad-state-sample" aria-label="Unbounded billing loading">
          <span className="spinner-only"></span>
          <p className="demo-status">Loading...</p>
        </div>
      );
    }
    return (
      <div className="bad-ui-sample">
        <strong>{short(meta.name)}</strong>
        <button type="button">OK</button>
        <p className="demo-status">Missing context</p>
      </div>
    );
  }

  if (patternId === "dead-end-empty-state") return <StateUi patternId="empty-state" meta={meta} good />;
  if (patternId === "disabled-button-no-explanation") {
    return (
      <div className="disabled-action-good-ui">
        <label>
          <span>Workspace name</span>
          <input value="Research ops" readOnly />
        </label>
        <ul className="requirement-list" aria-label="Create workspace requirements">
          <li className="is-met">Workspace name entered</li>
          <li className="is-missing">Owner access required</li>
        </ul>
        <div className="demo-row">
          <button type="button" className="demo-button small" disabled aria-describedby="workspace-blocked-reason">Create workspace</button>
          <button type="button" className="demo-button small primary">Request owner access</button>
        </div>
        <p className="demo-status" id="workspace-blocked-reason">Ask an owner for access before creating this workspace.</p>
      </div>
    );
  }
  if (patternId === "icon-only-ambiguous-action") {
    return (
      <div className="labeled-action-row">
        <span>Q2 risk report</span>
        <button type="button" className="demo-button small danger" aria-label="Archive Q2 risk report">Archive report</button>
        <button type="button" className="demo-button small" aria-label="Download Q2 risk report">Download</button>
        <button type="button" className="demo-button small" aria-label="Share Q2 risk report">Share</button>
      </div>
    );
  }
  if (patternId === "inaccessible-custom-select") {
    return (
      <div className="quality-example">
        <label htmlFor="custom-select-native-preview">
          <span>Plan</span>
        </label>
        <p className="demo-status" id="custom-select-native-preview-hint">Native select exposes label, value, options, and platform keyboard behavior.</p>
        <select id="custom-select-native-preview" value="Team" onChange={() => undefined} aria-describedby="custom-select-native-preview-hint">
          {meta.options.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
    );
  }
  if (patternId === "infinite-spinner") {
    return (
      <div className="bounded-loading-panel" aria-busy="true" aria-describedby="bounded-loading-status">
        <div className="bounded-loading-header">
          <span className="spinner-only small"></span>
          <strong>Loading billing data</strong>
        </div>
        <p className="demo-status" id="bounded-loading-status">Still working after 12 seconds. Account ACME-42 is preserved.</p>
        <div className="demo-row">
          <button type="button" className="demo-button small primary">Retry</button>
          <button type="button" className="demo-button small">Use cached values</button>
          <button type="button" className="demo-button small">Contact support</button>
        </div>
      </div>
    );
  }
  return (
    <div className="demo-error corrected compact">
      <strong>Corrected {meta.name}</strong>
      <p>State, consequence, and recovery stay visible.</p>
      <button type="button" className="demo-button small primary">{meta.options[0]}</button>
    </div>
  );
}

function AccessibleSelectGoodUx({ meta }: { meta: PatternMeta }) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const invalid = submitted && !value;
  const hintId = "accessible-select-plan-hint";
  const errorId = "accessible-select-plan-error";

  return (
    <div className="quality-example">
      <label htmlFor="accessible-select-plan">
        <span>{meta.field}</span>
      </label>
      <p className="demo-status" id={hintId}>Choose one plan. The selected value is reviewed before continuing.</p>
      {invalid && <p className="demo-error compact" id={errorId}>Choose a plan before continuing.</p>}
      <select
        id="accessible-select-plan"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          if (submitted) setSubmitted(false);
        }}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${hintId} ${errorId}` : hintId}
        className={invalid ? "field-invalid" : undefined}
      >
        <option value="">Select a plan</option>
        {meta.options.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      <div className="demo-row">
        <button type="button" className="demo-button small primary" onClick={() => setSubmitted(true)}>Continue</button>
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            setValue("Team");
            setSubmitted(false);
          }}
        >
          Choose Team
        </button>
      </div>
      <p className="demo-status">Selected: {value || "none"}</p>
    </div>
  );
}

function DeadEndEmptyGoodUx() {
  const [cause, setCause] = useState<"first-use" | "filtered" | "permission" | "failed" | "recovered">("first-use");
  const message = cause === "filtered"
    ? "No projects match Status: archived and Owner: you."
    : cause === "permission"
      ? "Projects are hidden until an admin grants workspace access."
      : cause === "failed"
        ? "Projects could not load; retry or use cached data."
        : cause === "recovered"
          ? "Recovery succeeded; the blank dead end is gone."
          : "No projects exist in this workspace yet.";

  return (
    <div className="quality-example dead-end-recovery-demo">
      <div className="demo-row">
        <button type="button" className={cause === "first-use" ? "demo-button small primary" : "demo-button small"} onClick={() => setCause("first-use")}>First use</button>
        <button type="button" className={cause === "filtered" ? "demo-button small primary" : "demo-button small"} onClick={() => setCause("filtered")}>Filtered</button>
        <button type="button" className={cause === "permission" ? "demo-button small primary" : "demo-button small"} onClick={() => setCause("permission")}>No access</button>
        <button type="button" className={cause === "failed" ? "demo-button small primary" : "demo-button small"} onClick={() => setCause("failed")}>Failed</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
      {cause === "recovered" ? (
        <div className="mini-result-list" aria-label="Recovered projects">
          <button type="button" className="pattern-row">Migration runbook - Ready</button>
          <button type="button" className="pattern-row">Vendor audit - Ready</button>
        </div>
      ) : (
        <div className={cause === "failed" ? "demo-error compact error-state-panel" : "demo-empty compact-empty empty-state-panel"} role={cause === "failed" ? "alert" : undefined}>
          <span className={cause === "failed" ? "bad-error-dot" : "empty-state-icon"} aria-hidden="true">{cause === "failed" ? "!" : ""}</span>
          <h3>{cause === "filtered" ? "No matching projects" : cause === "permission" ? "Project access required" : cause === "failed" ? "Projects could not load" : "No projects yet"}</h3>
          <p>{message}</p>
          <div className="demo-row">
            {cause === "filtered" && <button type="button" className="demo-button small primary" onClick={() => setCause("recovered")}>Clear filters</button>}
            {cause === "permission" && <button type="button" className="demo-button small primary" onClick={() => setCause("recovered")}>Request access</button>}
            {cause === "failed" && <button type="button" className="demo-button small primary" onClick={() => setCause("recovered")}>Retry</button>}
            {cause === "first-use" && <button type="button" className="demo-button small primary" onClick={() => setCause("recovered")}>Create project</button>}
            <button type="button" className="demo-button small">Back to dashboard</button>
          </div>
        </div>
      )}
    </div>
  );
}

function DeadEndEmptyBadUx() {
  const [status, setStatus] = useState("Blank panel; no object, cause, criteria, permission, or recovery is exposed.");
  const [focusLost, setFocusLost] = useState(false);

  return (
    <div className="quality-example dead-end-bad-demo">
      <div
        className="blank-area"
        aria-label="Blank dead-end content"
        tabIndex={0}
        onClick={() => setStatus("Click changed nothing; the blank state is still unexplained.")}
        onFocus={() => setStatus("Focus reached an inert blank panel with no useful control.")}
      ></div>
      <div className="demo-row">
        <button
          type="button"
          className="demo-button small"
          disabled={focusLost}
          onClick={() => {
            setFocusLost(true);
            setStatus("Disabled create action became the only visible path, with no explanation.");
          }}
        >
          Create
        </button>
        <button type="button" className="demo-button small" onClick={() => setStatus("Filters may be active, but they are hidden from this state.")}>Maybe filtered</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function AntiGoodUx({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  if (patternId === "dead-end-empty-state") return <DeadEndEmptyGoodUx />;
  if (patternId === "disabled-button-no-explanation") return <DisabledButtonGoodUx />;
  if (patternId === "icon-only-ambiguous-action") return <IconGoodUx />;
  if (patternId === "inaccessible-custom-select") return <AccessibleSelectGoodUx meta={meta} />;
  if (patternId === "infinite-spinner") return <InfiniteSpinnerGoodUx />;
  return <CorrectedAntiUx meta={meta} />;
}

function AntiBadUx({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  if (patternId === "dead-end-empty-state") return <DeadEndEmptyBadUx />;
  if (patternId === "disabled-button-no-explanation") return <DisabledButtonBadUx />;
  if (patternId === "icon-only-ambiguous-action") return <IconBadUx />;
  if (patternId === "inaccessible-custom-select") return <BrokenCustomSelect meta={meta} />;
  if (patternId === "infinite-spinner") return <InfiniteSpinnerBadUx />;
  return <BrokenAntiUx meta={meta} />;
}

function DisabledButtonGoodUx() {
  const [name, setName] = useState("");
  const [terms, setTerms] = useState(false);
  const [access, setAccess] = useState(false);
  const [status, setStatus] = useState("Complete the visible requirements or validate on click.");
  const eligible = name.trim().length >= 3 && terms && access;
  const missing = [
    { id: "name", label: "Enter at least 3 characters for the workspace name", met: name.trim().length >= 3 },
    { id: "terms", label: "Accept billing terms", met: terms },
    { id: "access", label: "Owner access granted", met: access }
  ];

  function validateOnClick() {
    if (eligible) {
      setStatus(`Workspace "${name}" created.`);
      return;
    }
    setStatus(`Still blocked: ${missing.filter((item) => !item.met).map((item) => item.label).join("; ")}.`);
  }

  return (
    <div className="quality-example disabled-action-demo">
      <label>
        <span>Workspace name</span>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Research ops" />
      </label>
      <label className="checkbox-option">
        <input type="checkbox" checked={terms} onChange={(event) => setTerms(event.target.checked)} />
        <span>Accept billing terms</span>
      </label>
      <ul className="requirement-list" aria-label="Requirements for create workspace">
        {missing.map((item) => <li className={item.met ? "is-met" : "is-missing"} key={item.id}>{item.label}</li>)}
      </ul>
      <div className="demo-row">
        <button type="button" className="demo-button small primary" disabled={!eligible} aria-describedby="create-workspace-requirements" onClick={() => setStatus(`Workspace "${name}" created.`)}>Create workspace</button>
        <button type="button" className="demo-button small" onClick={() => setAccess(true)}>Request owner access</button>
        <button type="button" className="demo-button small" onClick={validateOnClick}>Validate on click</button>
      </div>
      <p className="demo-status" id="create-workspace-requirements" aria-live="polite">{status}</p>
    </div>
  );
}

function DisabledButtonBadUx() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Create workspace is unavailable, but the interface gives no reason.");
  return (
    <div className="quality-example disabled-action-demo">
      <label>
        <span>Workspace name</span>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Try typing" />
      </label>
      <button type="button" className="demo-button" disabled>Create workspace</button>
      <div className="demo-row">
        <button type="button" className="demo-button small" onClick={() => setStatus("Still disabled. No missing requirement, permission owner, or validation message is shown.")}>I typed a name</button>
        <button type="button" className="demo-button small" onClick={() => setStatus("Hover-only help would not be reachable for keyboard or touch users.")}>Try tooltip</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function InfiniteSpinnerGoodUx() {
  const [mode, setMode] = useState<"loading" | "slow" | "cached" | "retrying" | "loaded" | "failed" | "cancelled">("loading");
  const status = mode === "loading"
    ? "Loading billing data for account ACME-42."
    : mode === "slow"
      ? "Still working after 12 seconds. You can keep waiting, retry, use cached values, or cancel."
      : mode === "cached"
        ? "Showing cached billing values from 09:15 while live data is unavailable."
        : mode === "retrying"
          ? "Retrying billing request with account context preserved."
          : mode === "loaded"
            ? "Live billing data loaded for account ACME-42."
            : mode === "cancelled"
              ? "Billing refresh cancelled. Previous values remain visible."
              : "Billing request timed out again. Support reference BILL-901 is available.";

  return (
    <div className="quality-example bounded-loading-demo">
      <div className="invoice-summary">
        <strong>Account ACME-42</strong>
        <span>{mode === "loaded" ? "Live" : mode === "cached" ? "Cached" : mode === "failed" ? "Timed out" : mode === "cancelled" ? "Cancelled" : "Pending"}</span>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
      {mode === "loaded" || mode === "cached" || mode === "cancelled" ? (
        <div className="mini-result-list" aria-label="Billing values">
          <button type="button" className="pattern-row">{mode === "loaded" ? "Current" : "Previous"} balance - $4,820</button>
          <button type="button" className="pattern-row">{mode === "loaded" ? "Current" : "Previous"} renewal - Jul 18</button>
        </div>
      ) : (
        <div className="bounded-loading-panel" aria-busy={mode !== "failed"} aria-describedby="bounded-loading-live-status">
          <div className="bounded-loading-header">
            {mode === "failed" ? <strong>Billing data timed out</strong> : <><span className="spinner-only small"></span><strong>{mode === "retrying" ? "Retrying billing data" : "Loading billing data"}</strong></>}
          </div>
          <p className="demo-status" id="bounded-loading-live-status">
            {mode === "failed" ? "The billing service did not respond. Use cached values or contact support with BILL-901." : "Account and previous values stay available while the request is pending."}
          </p>
          <div className="demo-row">
            <button
              type="button"
              className="demo-button small primary"
              disabled={mode === "retrying"}
              onClick={() => {
                setMode("retrying");
                window.setTimeout(() => setMode("loaded"), 180);
              }}
            >
              Retry
            </button>
            <button type="button" className="demo-button small" disabled={mode === "retrying"} onClick={() => setMode("slow")}>Wait threshold</button>
            <button type="button" className="demo-button small" disabled={mode === "retrying"} onClick={() => setMode("cached")}>Use cached values</button>
            <button type="button" className="demo-button small" disabled={mode === "retrying"} onClick={() => setMode("cancelled")}>Cancel</button>
            <button type="button" className="demo-button small" disabled={mode === "retrying"} onClick={() => setMode("failed")}>Timeout</button>
          </div>
        </div>
      )}
    </div>
  );
}

function InfiniteSpinnerBadUx() {
  const [elapsed, setElapsed] = useState("0 seconds");
  return (
    <div className="quality-example infinite-spinner-bad-flow">
      <div className="infinite-spinner-bad-ui bad-state-sample" aria-busy="true">
        <span className="spinner-only"></span>
        <p className="demo-status">Loading billing data...</p>
      </div>
      <div className="demo-row">
        {["30 seconds", "2 minutes", "Still waiting"].map((item) => (
          <button type="button" className="demo-button small" key={item} onClick={() => setElapsed(item)}>{item}</button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">{elapsed}: no timeout, no cached values, no retry, no cancel.</p>
    </div>
  );
}

function CorrectedAntiUx({ meta }: { meta: PatternMeta }) {
  const [status, setStatus] = useState("Ready");
  return (
    <div className="quality-example">
      <div className="demo-error compact">
        <strong>{meta.name} corrected</strong>
        <span>Explain impact before action.</span>
      </div>
      <div className="demo-row">
        <button type="button" className="demo-button small primary" onClick={() => setStatus("Recovered with context")}>Use safer path</button>
        <button type="button" className="demo-button small" onClick={() => setStatus("Cancelled")}>Cancel</button>
      </div>
      <p className="demo-status">{status}</p>
    </div>
  );
}

function BrokenAntiUx({ meta }: { meta: PatternMeta }) {
  const [status, setStatus] = useState("No explanation.");
  return (
    <div className="quality-example">
      <button type="button" className="demo-button small" onClick={() => setStatus("Action happened without recovery")}>OK</button>
      <p className="demo-status">{short(meta.name)}: {status}</p>
    </div>
  );
}

function IconGoodUx() {
  const [status, setStatus] = useState("Choose a named action before changing the report.");
  return (
    <div className="quality-example icon-action-demo">
      <div className="labeled-action-row">
        <span>Q2 risk report</span>
        <button type="button" className="demo-button small danger" aria-label="Archive Q2 risk report" onClick={() => setStatus("Archive report selected. Confirmation or undo can now handle the consequence.")}>Archive report</button>
        <button type="button" className="demo-button small" aria-label="Download Q2 risk report" onClick={() => setStatus("Download report selected. The action was clear before activation.")}>Download</button>
        <button type="button" className="demo-button small" aria-label="Share Q2 risk report" onClick={() => setStatus("Share report selected. The affected object stayed visible.")}>Share</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function IconBadUx() {
  const [status, setStatus] = useState("Three symbols appear, but none explains the action before activation.");
  return (
    <div className="quality-example icon-action-demo">
      <div className="ambiguous-icon-row bad-ui-sample" aria-label="Ambiguous report actions">
        <span>Q2 risk report</span>
        <button type="button" className="mystery-icon-button" onClick={() => setStatus("Unknown action triggered; user still cannot tell what happened.")}>!</button>
        <button type="button" className="mystery-icon-button" onClick={() => setStatus("Report archived accidentally. No clear label appeared before activation.")}>▣</button>
        <button type="button" className="mystery-icon-button" onClick={() => setStatus("Maybe share, maybe export. The symbol did not name the consequence.")}>↗</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function GoodUiExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <AntiUi patternId={patternId} meta={meta} good />;
}

function BadUiExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <AntiUi patternId={patternId} meta={meta} />;
}

function GoodUxExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <AntiGoodUx patternId={patternId} meta={meta} />;
}

function BadUxExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <AntiBadUx patternId={patternId} meta={meta} />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
