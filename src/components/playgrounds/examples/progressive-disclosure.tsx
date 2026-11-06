import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

function ProgressiveDisclosureGoodUi() {
  return (
    <div className="quality-example progressive-static-preview">
      <div className="progressive-main-card">
        <div>
          <strong>Nightly backup</strong>
          <span>Daily at 02:00 - 30 day retention - 82 GB estimate</span>
        </div>
        <button type="button" className="demo-button small primary">Start backup</button>
      </div>
      <details className="progressive-advanced-preview">
        <summary>Advanced retention and encryption settings</summary>
        <div className="progressive-advanced-grid">
          <span>Retention: 30 days</span>
          <span>Encryption: Recommended</span>
          <span>Bandwidth: Automatic</span>
        </div>
      </details>
      <p className="demo-status">The default path is complete, and the advanced controls are named, related, and available without crowding the first view.</p>
    </div>
  );
}

function ProgressiveDisclosureBadUi() {
  return (
    <div className="bad-ui-sample progressive-static-preview bad">
      <div className="progressive-main-card bad">
        <div>
          <strong>Backup</strong>
          <span>Required encryption, retention, logs, billing, and deletion scope are hidden below.</span>
        </div>
        <button type="button">Run</button>
      </div>
      <div className="progressive-vague-trigger">More</div>
      <div className="progressive-bad-buried">
        <span>Required encryption off</span>
        <span>Retention changes cost</span>
        <span>Delete old snapshots</span>
      </div>
      <p className="demo-status">The broken treatment hides required decisions and gives no visible summary of hidden settings before commit.</p>
    </div>
  );
}

function ProgressiveDisclosureGoodUx() {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [retention, setRetention] = useState(30);
  const [encrypted, setEncrypted] = useState(true);
  const [bandwidth, setBandwidth] = useState("Automatic");
  const [validationOpen, setValidationOpen] = useState(false);
  const [status, setStatus] = useState("Recommended backup is ready without opening advanced settings.");
  const changed = retention !== 30 || !encrypted || bandwidth !== "Automatic";
  const hasRisk = retention > 90 && !encrypted;

  const openAdvanced = (message: string) => {
    setAdvancedOpen(true);
    setStatus(message);
  };

  const collapseAdvanced = () => {
    setAdvancedOpen(false);
    setStatus(changed
      ? "Advanced settings collapsed; changed retention, encryption, or bandwidth remains summarized near Start backup."
      : "Advanced settings collapsed; recommended defaults remain active.");
  };

  const resetAdvanced = () => {
    setRetention(30);
    setEncrypted(true);
    setBandwidth("Automatic");
    setValidationOpen(false);
    setStatus("Advanced settings reset to recommended defaults without clearing destination or schedule.");
  };

  const startBackup = () => {
    if (hasRisk) {
      setValidationOpen(true);
      setAdvancedOpen(true);
      setStatus("Start blocked: long retention without encryption was revealed before commit.");
      return;
    }
    setStatus(changed
      ? "Backup started with advanced changes visible in the summary."
      : "Backup started with recommended settings.");
  };

  return (
    <div className="quality-example progressive-demo">
      <section className="progressive-default-path" aria-labelledby="progressive-backup-title">
        <div>
          <h3 id="progressive-backup-title">Nightly backup</h3>
          <p>Destination Vault A - daily at 02:00 - estimated 82 GB.</p>
        </div>
        <button type="button" className="demo-button small primary" onClick={startBackup}>Start backup</button>
      </section>
      {changed && (
        <div className={hasRisk ? "progressive-summary is-risk" : "progressive-summary"} role="status">
          <strong>Advanced settings changed</strong>
          <span>{retention} day retention, encryption {encrypted ? "on" : "off"}, bandwidth {bandwidth}.</span>
          <button type="button" className="demo-button small" onClick={() => openAdvanced("Advanced settings reopened from the changed summary.")}>Edit advanced</button>
        </div>
      )}
      {validationOpen && (
        <div className="progressive-validation" role="alert">
          <strong>Encryption required</strong>
          <span>Retention over 90 days must keep encryption on. The responsible advanced setting is open below.</span>
        </div>
      )}
      <div className="progressive-reveal-row">
        <button
          type="button"
          className="demo-button small"
          aria-expanded={advancedOpen}
          onClick={() => advancedOpen ? collapseAdvanced() : openAdvanced("Advanced retention and encryption controls revealed in place.")}
        >
          {advancedOpen ? "Hide advanced settings" : "Advanced retention and encryption"}
        </button>
        <button
          type="button"
          className="demo-button small"
          aria-expanded={diagnosticsOpen}
          onClick={() => {
            setDiagnosticsOpen((open) => !open);
            setStatus(diagnosticsOpen ? "Diagnostics collapsed; retry path remains visible." : "Troubleshooting diagnostics revealed after user intent.");
          }}
        >
          {diagnosticsOpen ? "Hide diagnostics" : "Troubleshooting details"}
        </button>
      </div>
      {advancedOpen && (
        <section className="progressive-advanced-panel" aria-labelledby="progressive-advanced-title">
          <div>
            <h4 id="progressive-advanced-title">Advanced backup settings</h4>
            <p>These controls affect storage cost, retention, and transfer behavior.</p>
          </div>
          <label>
            <span>Retention days</span>
            <input
              type="number"
              value={retention}
              min={7}
              max={365}
              onChange={(event) => {
                setRetention(Number(event.target.value));
                setStatus("Retention changed; the advanced summary will stay visible if this section is collapsed.");
              }}
            />
          </label>
          <label className="progressive-check">
            <input
              type="checkbox"
              checked={encrypted}
              onChange={(event) => {
                setEncrypted(event.target.checked);
                setStatus(event.target.checked ? "Encryption enabled for retained snapshots." : "Encryption turned off; risk will be surfaced before backup starts.");
              }}
            />
            <span>Encrypt retained snapshots</span>
          </label>
          <div className="progressive-bandwidth">
            <span>Bandwidth</span>
            {["Automatic", "Limit 10 MB/s"].map((option) => (
              <button
                key={option}
                type="button"
                className={bandwidth === option ? "demo-button small primary" : "demo-button small"}
                onClick={() => {
                  setBandwidth(option);
                  setStatus(`${option} bandwidth selected; advanced change remains reviewable.`);
                }}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="progressive-reveal-row">
            <button type="button" className="demo-button small" onClick={collapseAdvanced}>Collapse advanced</button>
            <button type="button" className="demo-button small" onClick={resetAdvanced}>Reset to recommended</button>
          </div>
        </section>
      )}
      {diagnosticsOpen && (
        <section className="progressive-diagnostics" aria-label="Backup diagnostics">
          <strong>Last dry run</strong>
          <span>4 warnings, 0 blocked files, next retry window 02:30.</span>
          <button type="button" className="demo-button small">Copy diagnostic log</button>
        </section>
      )}
      <div className="demo-row progressive-controls">
        <button type="button" className="demo-button small" onClick={() => openAdvanced("Advanced settings opened from the exercise controls.")}>Open advanced</button>
        <button type="button" className="demo-button small" onClick={() => { setRetention(180); setStatus("Retention set to 180 days; changed summary will remain visible after collapse."); }}>Set 180 days</button>
        <button type="button" className="demo-button small" onClick={() => { setEncrypted(false); setStatus("Encryption turned off; backup will reveal the risky hidden state before commit."); }}>Turn off encryption</button>
        <button type="button" className="demo-button small" onClick={collapseAdvanced}>Collapse advanced</button>
        <button type="button" className="demo-button small" onClick={resetAdvanced}>Reset defaults</button>
        <button type="button" className="demo-button small" onClick={() => { setDiagnosticsOpen(true); setStatus("Diagnostics revealed only after troubleshooting intent."); }}>Reveal diagnostics</button>
        <button type="button" className="demo-button small primary" onClick={startBackup}>Start backup</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function ProgressiveDisclosureBadUx() {
  type Mode = "hiddenRequired" | "vagueTrigger" | "buriedChange" | "nestedLevels" | "noReset" | "focusJump";
  const [mode, setMode] = useState<Mode>("hiddenRequired");
  const copy: Record<Mode, string> = {
    hiddenRequired: "A required encryption setting is hidden until submit fails, and the error does not reveal the owning control.",
    vagueTrigger: "The trigger says More, so users cannot predict whether it hides cost, risk, help, or commands.",
    buriedChange: "An advanced cost-changing retention value remains active after collapse with no summary near Run.",
    nestedLevels: "Several nested reveals bury one setting under Advanced, Expert, Storage, and More.",
    noReset: "Users can change expert options but cannot restore recommended defaults.",
    focusJump: "Opening the section throws focus into the middle of hidden controls and skips the trigger context."
  };

  return (
    <div className={`quality-example progressive-bad-demo is-${mode}`}>
      <section className="progressive-default-path bad">
        <div>
          <h3>Backup</h3>
          <p>{mode === "buriedChange" ? "Retention silently changed to 365 days." : "Default path appears complete, but hidden state still controls the outcome."}</p>
        </div>
        <button type="button">{mode === "hiddenRequired" ? "Submit" : "Run"}</button>
      </section>
      <div className="progressive-vague-trigger">{mode === "vagueTrigger" ? "More" : mode === "nestedLevels" ? "Advanced > Expert > Storage > More" : "Advanced"}</div>
      <div className="progressive-bad-buried">
        {mode === "hiddenRequired" && <span>Required encryption: off</span>}
        {mode === "buriedChange" && <span>Retention: 365 days, extra cost active</span>}
        {mode === "nestedLevels" && <span>One storage setting sits four levels deep.</span>}
        {mode === "noReset" && <span>Custom bandwidth and retention cannot be restored.</span>}
        {mode === "focusJump" && <button type="button">Focus landed here</button>}
        {mode === "vagueTrigger" && <span>Mixed help, cost, diagnostics, and deletion controls.</span>}
      </div>
      <div className="demo-row progressive-controls">
        <button type="button" className={mode === "hiddenRequired" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenRequired")}>Hidden required</button>
        <button type="button" className={mode === "vagueTrigger" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("vagueTrigger")}>Vague trigger</button>
        <button type="button" className={mode === "buriedChange" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("buriedChange")}>Buried change</button>
        <button type="button" className={mode === "nestedLevels" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("nestedLevels")}>Nested levels</button>
        <button type="button" className={mode === "noReset" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noReset")}>No reset</button>
        <button type="button" className={mode === "focusJump" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("focusJump")}>Focus jump</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ProgressiveDisclosureGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ProgressiveDisclosureBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ProgressiveDisclosureGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ProgressiveDisclosureBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
