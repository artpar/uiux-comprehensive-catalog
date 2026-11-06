import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type StartPageMode = "default" | "fit" | "need" | "started" | "resume" | "alternative" | "unavailable";

function StartPageFrame({
  mode = "default",
  started = false
}: {
  mode?: StartPageMode;
  started?: boolean;
}) {
  const headline =
    mode === "unavailable"
      ? "Apply for a building permit is closed today"
      : "Apply for a building permit";
  const status =
    mode === "started"
      ? "First question ready"
      : mode === "resume"
        ? "Draft found"
        : mode === "alternative"
          ? "Assisted route"
          : mode === "unavailable"
            ? "Service paused"
            : "Start page";
  return (
    <div className={`start-page-frame is-${mode}`}>
      <nav className="start-page-breadcrumb" aria-label="Service location">
        <span>Home</span>
        <span>Planning</span>
        <strong>Building permits</strong>
      </nav>
      <section className="start-page-main" aria-labelledby="start-page-demo-title">
        <span className="start-page-status">{status}</span>
        <h4 id="start-page-demo-title">{headline}</h4>
        <p className="start-page-lede">Use this service to apply for permission before starting structural work on your home.</p>
        {mode === "unavailable" ? (
          <div className="start-page-notice" role="status">
            <strong>Online applications reopen Monday at 9:00.</strong>
            <span>Emergency safety work can still be reported by phone.</span>
          </div>
        ) : (
          <>
            <section className="start-page-facts" aria-label="Before you start">
              <div>
                <strong>Who can use it</strong>
                <span>{mode === "fit" ? "Homeowners and authorised agents in River City." : "Homeowners or authorised agents."}</span>
              </div>
              <div>
                <strong>You will need</strong>
                <span>{mode === "need" ? "Site plan, contractor licence, parcel ID, and payment card." : "Parcel ID and contractor details."}</span>
              </div>
              <div>
                <strong>Time and cost</strong>
                <span>About 12 minutes. Fee starts at $45.</span>
              </div>
            </section>
            <div className="start-page-actions">
              <button type="button" className="demo-button primary">{started ? "Continue application" : "Start now"}</button>
              <button type="button" className="demo-button small">Resume saved draft</button>
            </div>
          </>
        )}
        <section className="start-page-alt" aria-label="Other ways to apply">
          <strong>{mode === "alternative" ? "Use assisted service" : "Other ways to apply"}</strong>
          <span>{mode === "alternative" ? "Call 555-0188 or visit the permit counter with the same documents." : "Phone and counter service are available for people who cannot apply online."}</span>
        </section>
      </section>
      <aside className="start-page-aside" aria-label="Related guidance">
        <strong>Related guidance</strong>
        <span>Check zoning rules</span>
        <span>Permit fee table</span>
        <span>Building inspection stages</span>
      </aside>
    </div>
  );
}

function StartPageGoodUi() {
  return (
    <div className="quality-example start-page-demo">
      <StartPageFrame />
      <p className="demo-status">The start page names one service, explains fit and requirements before the action, keeps resume secondary, and preserves wider service context.</p>
    </div>
  );
}

function StartPageBadUi() {
  return (
    <div className="bad-ui-sample start-page-bad-demo is-equalActions">
      <strong>Welcome to permits</strong>
      <div className="start-page-bad-hero">Build faster with our new online experience</div>
      <div className="start-page-bad-actions">
        {["Start", "Learn", "News", "Browse", "Contact"].map((label) => <button type="button" className="demo-button small" key={label}>{label}</button>)}
      </div>
      <p className="demo-status">Several equal actions and promotional copy hide the specific service, requirements, resume route, and first service step.</p>
    </div>
  );
}

function StartPageGoodUx() {
  const [mode, setMode] = useState<StartPageMode>("default");
  const [started, setStarted] = useState(false);
  const [message, setMessage] = useState("Start page explains the service, requirements, time, cost, and one primary action before the transaction begins.");

  function choose(nextMode: StartPageMode, nextMessage: string, nextStarted = started) {
    setMode(nextMode);
    setStarted(nextStarted);
    setMessage(nextMessage);
  }

  return (
    <div className="quality-example start-page-demo">
      <StartPageFrame mode={mode} started={started} />
      <div className="demo-row start-page-controls" aria-label="Start page exercise controls">
        <button type="button" className={mode === "fit" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("fit", "Fit check names the eligible audience before users enter the service.")}>Check fit</button>
        <button type="button" className={mode === "need" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("need", "Required documents and payment are visible before the start action.")}>Show documents</button>
        <button type="button" className={mode === "started" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("started", "Start now moves into the first service question with context intact.", true)}>Start now</button>
        <button type="button" className={mode === "resume" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("resume", "Resume route returns to an existing draft instead of creating a duplicate.", true)}>Resume draft</button>
        <button type="button" className={mode === "alternative" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("alternative", "Alternative access stays available for users who cannot apply online.")}>Other access</button>
        <button type="button" className={mode === "unavailable" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("unavailable", "Paused state removes the start action and gives timing plus an emergency route.", false)}>Paused</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function StartPageBadUx() {
  type Mode = "buriedNeed" | "equalActions" | "noResume" | "eligibilityMaze" | "deadEnd" | "wrongDestination";
  const [mode, setMode] = useState<Mode>("buriedNeed");
  const copy: Record<Mode, string> = {
    buriedNeed: "Users click Start now before seeing required documents, then fail inside the service.",
    equalActions: "Five equal buttons make the service entry point compete with news, browsing, and contact paths.",
    noResume: "Returning users can only start again, creating duplicate applications.",
    eligibilityMaze: "The entry page asks a long branching questionnaire before the real service begins.",
    deadEnd: "Wrong users get no alternative route back to the correct topic or channel.",
    wrongDestination: "Start now sends users to a dashboard instead of the first permit question."
  };
  return (
    <div className={`quality-example start-page-bad-demo is-${mode}`}>
      <strong>{mode === "eligibilityMaze" ? "Before we begin" : "Apply for everything"}</strong>
      <div className="start-page-bad-actions">
        {(mode === "equalActions" ? ["Start", "News", "Browse permits", "Guide", "Contact"] : ["Start now", "Account", "Learn more"]).map((label) => (
          <button type="button" className="demo-button small" key={label}>{label}</button>
        ))}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row start-page-controls">
        <button type="button" className={mode === "buriedNeed" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("buriedNeed")}>Hidden need</button>
        <button type="button" className={mode === "equalActions" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("equalActions")}>Equal actions</button>
        <button type="button" className={mode === "noResume" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noResume")}>No resume</button>
        <button type="button" className={mode === "eligibilityMaze" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("eligibilityMaze")}>Eligibility maze</button>
        <button type="button" className={mode === "deadEnd" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("deadEnd")}>Dead end</button>
        <button type="button" className={mode === "wrongDestination" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("wrongDestination")}>Wrong target</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <StartPageGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <StartPageBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <StartPageGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <StartPageBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
