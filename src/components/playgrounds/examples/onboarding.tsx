import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type OnboardingStage = "welcome" | "goal" | "setup" | "workspace";

function OnboardingFrame({
  stage = "welcome",
  goal = "Invite teammates",
  skipped = false,
  sample = false
}: {
  stage?: OnboardingStage;
  goal?: string;
  skipped?: boolean;
  sample?: boolean;
}) {
  const stepIndex: Record<OnboardingStage, number> = {
    welcome: 1,
    goal: 2,
    setup: 3,
    workspace: 4
  };
  const step = stepIndex[stage];
  return (
    <div className={`onboarding-frame is-${stage}`}>
      <aside className="onboarding-rail" aria-label="Onboarding progress">
        {["Welcome", "Choose goal", "Create start", "Workspace"].map((label, index) => (
          <span key={label} className={index + 1 === step ? "is-current" : index + 1 < step ? "is-done" : ""}>
            {index + 1}. {label}
          </span>
        ))}
      </aside>
      <section className="onboarding-panel" aria-labelledby="onboarding-demo-title">
        <span className="onboarding-kicker">{skipped ? "Resumable setup" : "First run"}</span>
        <h4 id="onboarding-demo-title">
          {stage === "workspace" ? "Team workspace ready" : stage === "setup" ? "Create a useful starting point" : stage === "goal" ? "What do you want to do first?" : "Set up your team workspace"}
        </h4>
        <p>
          {stage === "workspace"
            ? `${sample ? "Sample board created" : "Workspace created"} for ${goal}. The next action is available in the real interface.`
            : stage === "setup"
              ? "Create a sample board now, or skip teaching and come back from the setup checklist."
              : stage === "goal"
                ? "Choose one goal so the first screen opens with the right checklist and sample content."
                : "A short setup helps you reach your first useful workspace without learning every feature first."}
        </p>
        <div className="onboarding-choice-row">
          {["Invite teammates", "Track a project", "Import tasks"].map((label) => (
            <span key={label} className={goal === label ? "is-selected" : ""}>{label}</span>
          ))}
        </div>
        <div className="onboarding-workspace-preview">
          <strong>{stage === "workspace" ? goal : "Preview after setup"}</strong>
          <span>{sample ? "3 sample tasks · checklist 2 of 4 complete" : skipped ? "Setup checklist saved for later" : "No permanent data until you create or skip"}</span>
          <button type="button" className="demo-button small">{stage === "workspace" ? "Add first task" : "Create sample board"}</button>
        </div>
      </section>
    </div>
  );
}

function OnboardingGoodUi() {
  return (
    <div className="quality-example onboarding-demo">
      <OnboardingFrame />
      <p className="demo-status">The onboarding path states the benefit, shows progress, offers a safe exit, and previews the real first workspace action.</p>
    </div>
  );
}

function OnboardingBadUi() {
  return (
    <div className="bad-ui-sample onboarding-bad-demo is-marketingOnly">
      <div className="onboarding-slide-strip">
        {["Automate", "Collaborate", "Analyze", "Scale", "Win"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>Five promotional slides require Next before any workspace, goal, setup, sample content, or skip path appears.</p>
      <p className="demo-status">This is product advertising disguised as onboarding, and it delays the first useful action.</p>
    </div>
  );
}

function OnboardingGoodUx() {
  const [stage, setStage] = useState<OnboardingStage>("welcome");
  const [goal, setGoal] = useState("Invite teammates");
  const [skipped, setSkipped] = useState(false);
  const [sample, setSample] = useState(false);
  const [message, setMessage] = useState("Welcome explains the setup benefit and keeps optional teaching skippable.");

  return (
    <div className="quality-example onboarding-demo">
      <OnboardingFrame stage={stage} goal={goal} skipped={skipped} sample={sample} />
      <div className="demo-row onboarding-controls" aria-label="Onboarding exercise controls">
        <button type="button" className={stage === "welcome" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setStage("welcome");
          setMessage("Welcome explains the setup benefit and keeps optional teaching skippable.");
        }}>Welcome</button>
        <button type="button" className={goal === "Track a project" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setStage("goal");
          setGoal("Track a project");
          setMessage("Goal selection personalizes the starting workspace instead of showing every feature.");
        }}>Choose goal</button>
        <button type="button" className={sample ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setStage("setup");
          setSample(true);
          setSkipped(false);
          setMessage("Sample board created as a reversible starting point before landing in the workspace.");
        }}>Create sample</button>
        <button type="button" className={skipped ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setSkipped(true);
          setStage("setup");
          setMessage("Optional teaching skipped; setup progress remains available from the checklist.");
        }}>Skip teaching</button>
        <button type="button" className="demo-button small" onClick={() => {
          setSkipped(false);
          setStage("setup");
          setMessage("Setup resumed from the saved checklist instead of starting over.");
        }}>Resume setup</button>
        <button type="button" className={stage === "workspace" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setStage("workspace");
          setMessage("Onboarding finishes in the real workspace with the Add first task action available.");
        }}>Finish</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function OnboardingBadUx() {
  type Mode = "forcedTour" | "marketingOnly" | "noResume" | "blankLanding" | "permissionFirst" | "disconnectedTutorial";
  const [mode, setMode] = useState<Mode>("forcedTour");
  const copy: Record<Mode, string> = {
    forcedTour: "A required tour blocks users who already know what they came to do.",
    marketingOnly: "The flow promotes features but creates no workspace, goal, sample content, or first task.",
    noResume: "Skipping dismisses the guidance forever, so users cannot recover the checklist later.",
    blankLanding: "Completion drops users on a blank dashboard with no next action.",
    permissionFirst: "The first screen asks for notifications and contacts before explaining the value.",
    disconnectedTutorial: "Instructions are shown away from the real controls, so users must remember them later."
  };
  return (
    <div className={`quality-example onboarding-bad-demo is-${mode}`}>
      <strong>{mode === "blankLanding" ? "Welcome back" : mode === "permissionFirst" ? "Allow everything" : "Product tour"}</strong>
      <div className="onboarding-slide-strip">
        {["Slide 1", "Slide 2", "Slide 3", "Slide 4"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row onboarding-controls">
        <button type="button" className={mode === "forcedTour" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("forcedTour")}>Forced tour</button>
        <button type="button" className={mode === "marketingOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("marketingOnly")}>Marketing only</button>
        <button type="button" className={mode === "noResume" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noResume")}>No resume</button>
        <button type="button" className={mode === "blankLanding" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("blankLanding")}>Blank landing</button>
        <button type="button" className={mode === "permissionFirst" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("permissionFirst")}>Permission first</button>
        <button type="button" className={mode === "disconnectedTutorial" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("disconnectedTutorial")}>Detached tutorial</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <OnboardingGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <OnboardingBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <OnboardingGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <OnboardingBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
