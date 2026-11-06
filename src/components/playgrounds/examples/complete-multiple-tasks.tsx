import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type CompleteMultipleTasksStage = "start" | "returning" | "inProgress" | "blocked" | "needsAttention" | "optional" | "edit" | "allComplete" | "review" | "submitted";

function CompleteMultipleTasksFrame({
  stage = "start",
  idSuffix = "demo"
}: {
  stage?: CompleteMultipleTasksStage;
  idSuffix?: string;
}) {
  const heading: Record<CompleteMultipleTasksStage, string> = {
    start: "Application incomplete",
    returning: "Resume your childcare licence",
    inProgress: "Work history in progress",
    blocked: "Review is blocked",
    needsAttention: "Evidence needs attention",
    optional: "Optional reference skipped",
    edit: "Editing completed details",
    allComplete: "All required tasks complete",
    review: "Ready to review and send",
    submitted: "Application sent"
  };
  const summary: Record<CompleteMultipleTasksStage, string> = {
    start: "You have completed 1 of 6 required sections.",
    returning: "Saved yesterday at 16:10. Resume the first incomplete task: Work history.",
    inProgress: "Work history is saved as in progress, not treated as completed just because it was opened.",
    blocked: "Review and send cannot start until Upload evidence is complete.",
    needsAttention: "Uploaded evidence has expired and changed the task back to Needs attention.",
    optional: "Reference letter is optional and does not block review.",
    edit: "Completed contact details can be reopened and edited.",
    allComplete: "You have completed 6 of 6 required sections.",
    review: "Review is now available before the final Apply action.",
    submitted: "The hub hands off to confirmation after Apply succeeds."
  };
  const taskSets: Record<CompleteMultipleTasksStage, Array<{ group: string; tasks: Array<{ name: string; hint: string; status: string; tone: string; blocked?: string }> }>> = {
    start: [
      { group: "Check before you start", tasks: [{ name: "Eligibility check", hint: "Confirm the service is right for you", status: "Completed", tone: "done" }] },
      { group: "Application details", tasks: [
        { name: "Your contact details", hint: "Name, address, phone, and email", status: "Not started", tone: "todo" },
        { name: "Work history", hint: "Five years of childcare roles", status: "Not started", tone: "todo" },
        { name: "Upload evidence", hint: "Identity and qualification documents", status: "Cannot start yet", tone: "blocked", blocked: "Complete contact details first" },
        { name: "Review and send", hint: "Check all answers before applying", status: "Cannot start yet", tone: "blocked", blocked: "Finish required tasks first" }
      ] }
    ],
    returning: [
      { group: "Application details", tasks: [
        { name: "Your contact details", hint: "Last updated yesterday", status: "Completed", tone: "done" },
        { name: "Work history", hint: "Resume from employer 3", status: "In progress", tone: "progress" },
        { name: "Upload evidence", hint: "Identity and qualification documents", status: "Not started", tone: "todo" },
        { name: "Review and send", hint: "Check all answers before applying", status: "Cannot start yet", tone: "blocked", blocked: "Upload evidence first" }
      ] }
    ],
    inProgress: [
      { group: "Application details", tasks: [
        { name: "Your contact details", hint: "Name, address, phone, and email", status: "Completed", tone: "done" },
        { name: "Work history", hint: "Employer 3 saved for later", status: "In progress", tone: "progress" },
        { name: "Upload evidence", hint: "Identity and qualification documents", status: "Not started", tone: "todo" },
        { name: "Review and send", hint: "Check all answers before applying", status: "Cannot start yet", tone: "blocked", blocked: "2 required sections left" }
      ] }
    ],
    blocked: [
      { group: "Application details", tasks: [
        { name: "Your contact details", hint: "Name, address, phone, and email", status: "Completed", tone: "done" },
        { name: "Work history", hint: "Five years of childcare roles", status: "Completed", tone: "done" },
        { name: "Upload evidence", hint: "Identity and qualification documents", status: "Not started", tone: "todo" },
        { name: "Review and send", hint: "Check all answers before applying", status: "Cannot start yet", tone: "blocked", blocked: "Upload evidence first" }
      ] }
    ],
    needsAttention: [
      { group: "Application details", tasks: [
        { name: "Your contact details", hint: "Name, address, phone, and email", status: "Completed", tone: "done" },
        { name: "Work history", hint: "Five years of childcare roles", status: "Completed", tone: "done" },
        { name: "Upload evidence", hint: "Passport expired since last visit", status: "Needs attention", tone: "attention" },
        { name: "Review and send", hint: "Check all answers before applying", status: "Cannot start yet", tone: "blocked", blocked: "Replace expired evidence" }
      ] }
    ],
    optional: [
      { group: "Application details", tasks: [
        { name: "Your contact details", hint: "Name, address, phone, and email", status: "Completed", tone: "done" },
        { name: "Work history", hint: "Five years of childcare roles", status: "Completed", tone: "done" },
        { name: "Upload evidence", hint: "Identity and qualification documents", status: "Completed", tone: "done" },
        { name: "Reference letter", hint: "Optional supporting evidence", status: "Optional", tone: "optional" },
        { name: "Review and send", hint: "Check all answers before applying", status: "Not started", tone: "todo" }
      ] }
    ],
    edit: [
      { group: "Application details", tasks: [
        { name: "Your contact details", hint: "Reopened to update phone number", status: "In progress", tone: "progress" },
        { name: "Work history", hint: "Five years of childcare roles", status: "Completed", tone: "done" },
        { name: "Upload evidence", hint: "Identity and qualification documents", status: "Completed", tone: "done" },
        { name: "Review and send", hint: "Check all answers before applying", status: "Cannot start yet", tone: "blocked", blocked: "Finish edited contact details" }
      ] }
    ],
    allComplete: [
      { group: "Application details", tasks: [
        { name: "Your contact details", hint: "Name, address, phone, and email", status: "Completed", tone: "done" },
        { name: "Work history", hint: "Five years of childcare roles", status: "Completed", tone: "done" },
        { name: "Upload evidence", hint: "Identity and qualification documents", status: "Completed", tone: "done" },
        { name: "Review and send", hint: "Check all answers before applying", status: "Not started", tone: "todo" }
      ] }
    ],
    review: [
      { group: "Application details", tasks: [
        { name: "Your contact details", hint: "Name, address, phone, and email", status: "Completed", tone: "done" },
        { name: "Work history", hint: "Five years of childcare roles", status: "Completed", tone: "done" },
        { name: "Upload evidence", hint: "Identity and qualification documents", status: "Completed", tone: "done" },
        { name: "Review and send", hint: "Ready for final check", status: "Ready", tone: "ready" }
      ] }
    ],
    submitted: [
      { group: "Application details", tasks: [
        { name: "Application sent", hint: "Reference CL-2048", status: "Completed", tone: "done" }
      ] }
    ]
  };
  const canApply = stage === "review" || stage === "submitted";
  return (
    <div className={`complete-tasks-frame is-${stage}`}>
      <section className="complete-tasks-panel" aria-labelledby={`complete-tasks-title-${idSuffix}`}>
        <div className="complete-tasks-heading">
          <span>Childcare licence</span>
          <strong>{heading[stage]}</strong>
        </div>
        <h4 id={`complete-tasks-title-${idSuffix}`}>Complete your application</h4>
        <p>{summary[stage]}</p>
        <nav className="complete-tasks-list" aria-label="Application tasks">
          {taskSets[stage].map((group) => (
            <div className="complete-tasks-group" key={group.group}>
              <h5>{group.group}</h5>
              {group.tasks.map((task) => (
                <a className={`complete-tasks-row is-${task.tone}`} href="#" key={task.name}>
                  <span>
                    <b>{task.name}</b>
                    <small>{task.blocked || task.hint}</small>
                  </span>
                  <em>{task.status}</em>
                </a>
              ))}
            </div>
          ))}
        </nav>
      </section>
      <aside className="complete-tasks-action" aria-label="Completion summary">
        <strong>{canApply ? "Ready for final step" : "Before you apply"}</strong>
        <dl>
          <div>
            <dt>Progress</dt>
            <dd>{stage === "start" ? "1 of 6" : stage === "returning" || stage === "inProgress" ? "2 of 6" : stage === "review" || stage === "submitted" || stage === "allComplete" ? "6 of 6" : "4 of 6"}</dd>
          </div>
          <div>
            <dt>Resume</dt>
            <dd>{stage === "returning" ? "Work history" : stage === "needsAttention" ? "Upload evidence" : stage === "review" ? "Review and send" : "First incomplete"}</dd>
          </div>
          <div>
            <dt>Submit</dt>
            <dd>{canApply ? "Available" : "Blocked"}</dd>
          </div>
        </dl>
        <button type="button" className={canApply ? "demo-button small primary" : "demo-button small"} disabled={!canApply}>{stage === "submitted" ? "View confirmation" : "Apply"}</button>
        <p>{canApply ? "The final action is only available after required sections are complete." : "The disabled final action names the task that still needs work."}</p>
      </aside>
    </div>
  );
}

function CompleteMultipleTasksGoodUi() {
  return (
    <div className="quality-example complete-tasks-demo">
      <CompleteMultipleTasksFrame />
      <p className="demo-status">The hub groups task sections, stores status, exposes blockers, and keeps final submission unavailable until required sections are complete.</p>
    </div>
  );
}

function CompleteMultipleTasksBadUi() {
  return (
    <div className="bad-ui-sample complete-tasks-bad-demo is-linear">
      <strong>Application steps</strong>
      <div className="complete-tasks-bad-grid">
        {["Step 1", "Step 2", "Step 3", "Step 4", "Submit now", "No saved status"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p className="demo-status">The broken surface uses a linear step display for a saved multi-section transaction and gives no reliable completion state.</p>
    </div>
  );
}

function CompleteMultipleTasksGoodUx() {
  const [stage, setStage] = useState<CompleteMultipleTasksStage>("start");
  const [message, setMessage] = useState("The first visit shows grouped tasks, initial statuses, dependencies, and a blocked final action.");
  function choose(nextStage: CompleteMultipleTasksStage, nextMessage: string) {
    setStage(nextStage);
    setMessage(nextMessage);
  }
  return (
    <div className="quality-example complete-tasks-demo">
      <CompleteMultipleTasksFrame stage={stage} idSuffix="good-ux" />
      <div className="demo-row complete-tasks-controls" aria-label="Complete multiple tasks exercise controls">
        <button type="button" className={stage === "start" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("start", "First visit shows not-started tasks, blocked dependencies, and a disabled Apply action.")}>Start</button>
        <button type="button" className={stage === "returning" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("returning", "Returning session shows saved time and a resume cue for Work history.")}>Return</button>
        <button type="button" className={stage === "inProgress" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("inProgress", "Opening a section does not count as completion; Work history stays In progress.")}>In progress</button>
        <button type="button" className={stage === "blocked" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("blocked", "Review and send stays visible but blocked until Upload evidence is complete.")}>Blocked</button>
        <button type="button" className={stage === "needsAttention" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("needsAttention", "Expired evidence moves a previously finished section to Needs attention.")}>Needs attention</button>
        <button type="button" className={stage === "optional" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("optional", "Optional reference letter is visible but does not block review readiness.")}>Optional</button>
        <button type="button" className={stage === "edit" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("edit", "Completed contact details reopen for editing and temporarily block review.")}>Edit completed</button>
        <button type="button" className={stage === "allComplete" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("allComplete", "All required sections are complete, so Review and send is the next task.")}>All complete</button>
        <button type="button" className={stage === "review" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("review", "Review becomes available before the final Apply action.")}>Review ready</button>
        <button type="button" className={stage === "submitted" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("submitted", "After Apply succeeds, the hub hands off to a confirmation reference.")}>Submitted</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function CompleteMultipleTasksBadUx() {
  type Mode = "linear" | "summaryMisuse" | "hiddenBlocker" | "clickableStatus" | "tooManyStatuses" | "lockedEdit";
  const [mode, setMode] = useState<Mode>("linear");
  const copy: Record<Mode, string> = {
    linear: "A fixed step indicator hides saved section status and makes returning users hunt for missing work.",
    summaryMisuse: "The hub becomes an answer summary, so users review data instead of seeing what tasks remain.",
    hiddenBlocker: "Review looks available, then fails because evidence was required but hidden.",
    clickableStatus: "Status pills look like buttons, so users click Not started instead of the task row.",
    tooManyStatuses: "Seven status labels compete for attention and users cannot tell what blocks Apply.",
    lockedEdit: "Completed contact details cannot be reopened, so users must abandon or restart."
  };
  const labels: Record<Mode, string[]> = {
    linear: ["Step 1", "Step 2", "Step 3"],
    summaryMisuse: ["Name: Mina", "Phone: 555", "No tasks"],
    hiddenBlocker: ["Review", "Apply", "Error"],
    clickableStatus: ["Task", "Not started", "Pill click"],
    tooManyStatuses: ["Started", "Pending", "Queued"],
    lockedEdit: ["Completed", "Locked", "Restart"]
  };
  return (
    <div className={`quality-example complete-tasks-bad-demo is-${mode}`}>
      <strong>{mode === "summaryMisuse" ? "Application summary" : mode === "lockedEdit" ? "Completed task" : "Application progress"}</strong>
      <div className="complete-tasks-bad-grid">
        {labels[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row complete-tasks-controls">
        <button type="button" className={mode === "linear" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("linear")}>Linear steps</button>
        <button type="button" className={mode === "summaryMisuse" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("summaryMisuse")}>Summary misuse</button>
        <button type="button" className={mode === "hiddenBlocker" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenBlocker")}>Hidden blocker</button>
        <button type="button" className={mode === "clickableStatus" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("clickableStatus")}>Clickable status</button>
        <button type="button" className={mode === "tooManyStatuses" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("tooManyStatuses")}>Too many statuses</button>
        <button type="button" className={mode === "lockedEdit" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("lockedEdit")}>Locked edit</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CompleteMultipleTasksGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CompleteMultipleTasksBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CompleteMultipleTasksGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CompleteMultipleTasksBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
