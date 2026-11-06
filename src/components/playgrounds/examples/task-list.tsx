import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type TaskListStage = "names" | "hints" | "status" | "blocked" | "groups" | "returned" | "mobile" | "doneLow";

function TaskListFrame({
  stage = "names",
  idSuffix = "demo"
}: {
  stage?: TaskListStage;
  idSuffix?: string;
}) {
  const grouped = stage === "groups";
  const mobile = stage === "mobile";
  const rows = [
    {
      group: grouped ? "Required details" : "Application tasks",
      name: stage === "names" ? "Contact details" : "Your contact details",
      hint: stage === "hints" ? "Name, address, phone number, and email address" : "Name, address, phone",
      status: "Completed",
      tone: "done",
      visible: true
    },
    {
      group: grouped ? "Required details" : "Application tasks",
      name: "Work history",
      hint: "Five years of roles",
      status: stage === "returned" ? "Needs attention" : stage === "status" ? "In progress" : "Not started",
      tone: stage === "returned" ? "attention" : stage === "status" ? "progress" : "todo",
      visible: true
    },
    {
      group: grouped ? "Evidence" : "Application tasks",
      name: "Upload evidence",
      hint: stage === "returned" ? "Passport image was rejected" : "Passport or qualification",
      status: stage === "blocked" ? "Cannot start yet" : "Needs attention",
      tone: stage === "blocked" ? "blocked" : "attention",
      visible: true
    },
    {
      group: grouped ? "Final check" : "Application tasks",
      name: "Review and send",
      hint: stage === "blocked" ? "Available after evidence is accepted" : "Check answers before sending",
      status: stage === "blocked" ? "Cannot start yet" : "Not started",
      tone: stage === "blocked" ? "blocked" : "todo",
      visible: true
    }
  ];
  const groupedRows = rows.reduce<Record<string, typeof rows>>((acc, row) => {
    if (!acc[row.group]) acc[row.group] = [];
    acc[row.group].push(row);
    return acc;
  }, {});
  const title: Record<TaskListStage, string> = {
    names: "Short task names scan first",
    hints: "Hints explain the work",
    status: "Status belongs to the row",
    blocked: "Unavailable tasks stay visible",
    groups: "Related tasks are grouped",
    returned: "Returned work updates the row",
    mobile: "Rows wrap without clipping",
    doneLow: "Completed status stays quiet"
  };
  const summary: Record<TaskListStage, string> = {
    names: "The task name is the primary link, with a separate status label.",
    hints: "Hints clarify what the task contains without turning the row into a summary.",
    status: "The status is text, not a separate control competing with the row link.",
    blocked: "Blocked rows remain in the list and name the reason users cannot start.",
    groups: "Section headings organize related rows while every task keeps the same anatomy.",
    returned: "Needs attention moves the user straight to the row that must be fixed.",
    mobile: "Names, hints, and statuses wrap onto stable rows on narrow screens.",
    doneLow: "Completed rows use lower emphasis so remaining work stays prominent."
  };
  return (
    <div className={`task-list-frame task-list-surface is-${stage}${mobile ? " is-mobile" : ""}`}>
      <section className="task-list-panel" aria-labelledby={`task-list-title-${idSuffix}`}>
        <div className="task-list-kicker">Childcare licence</div>
        <h4 id={`task-list-title-${idSuffix}`}>{title[stage]}</h4>
        <p>{summary[stage]}</p>
        <nav className="task-list-board" aria-label="Application task list">
          {Object.entries(groupedRows).map(([group, groupRows]) => (
            <div className="task-list-group" key={group}>
              <h5>{group}</h5>
              {groupRows.map((row) => (
                <a className={`task-list-row is-${row.tone}${stage === "doneLow" && row.tone === "done" ? " is-muted" : ""}`} href="#" key={row.name}>
                  <span className="task-list-copy">
                    <b>{row.name}</b>
                    <small>{row.hint}</small>
                  </span>
                  <em>{row.status}</em>
                </a>
              ))}
            </div>
          ))}
        </nav>
      </section>
      <aside className="task-list-note" aria-label="Task list behavior">
        <strong>{stage === "blocked" ? "Blocked reason" : stage === "returned" ? "Return cue" : "Row contract"}</strong>
        <p>{stage === "blocked" ? "Review and send remains visible but explains that accepted evidence unlocks it." : stage === "returned" ? "The list does not rely on a separate alert; the affected task row owns the Needs attention state." : "The row is the link. The status label describes state and does not become a competing button."}</p>
      </aside>
    </div>
  );
}

function TaskListGoodUi() {
  return (
    <div className="quality-example task-list-demo">
      <TaskListFrame />
      <p className="demo-status">The component presents task names, concise hints, row links, and status text without becoming a full transaction dashboard.</p>
    </div>
  );
}

function TaskListBadUi() {
  return (
    <div className="bad-ui-sample task-list-bad-demo is-recordList">
      <strong>Application records</strong>
      <div className="task-list-bad-grid">
        {["Sort", "Filter", "Task ID", "Owner", "Status button", "Export"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p className="demo-status">This turns task rows into a record table, so users inspect metadata instead of choosing the next section to complete.</p>
    </div>
  );
}

function TaskListGoodUx() {
  const [stage, setStage] = useState<TaskListStage>("names");
  const [message, setMessage] = useState("Short task names, concise hints, and separate status text make the next action scannable.");
  function choose(nextStage: TaskListStage, nextMessage: string) {
    setStage(nextStage);
    setMessage(nextMessage);
  }
  return (
    <div className="quality-example task-list-demo">
      <TaskListFrame stage={stage} idSuffix="good-ux" />
      <div className="demo-row task-list-controls" aria-label="Task list exercise controls">
        <button type="button" className={stage === "names" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("names", "Short user-facing names carry the row; technical labels stay out of the task list.")}>Names</button>
        <button type="button" className={stage === "hints" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("hints", "Hints say what the task contains without repeating the title or replacing the task page.")}>Hints</button>
        <button type="button" className={stage === "status" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("status", "Status text is visible beside the row and does not become a competing action.")}>Status</button>
        <button type="button" className={stage === "blocked" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("blocked", "Unavailable rows stay visible and name the dependency that unlocks them.")}>Blocked</button>
        <button type="button" className={stage === "groups" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("groups", "Groups organize related tasks while preserving the same row anatomy.")}>Groups</button>
        <button type="button" className={stage === "returned" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("returned", "Returned work updates the affected row to Needs attention.")}>Returned</button>
        <button type="button" className={stage === "mobile" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("mobile", "The row layout wraps the status below long copy instead of clipping it.")}>Mobile wrap</button>
        <button type="button" className={stage === "doneLow" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("doneLow", "Completed rows are still readable but lower emphasis than remaining work.")}>Done quiet</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function TaskListBadUx() {
  type Mode = "longHint" | "clickableStatus" | "colorOnly" | "recordList" | "hiddenBlocked" | "summaryRow";
  const [mode, setMode] = useState<Mode>("longHint");
  const copy: Record<Mode, string> = {
    longHint: "The hint becomes a paragraph, so users must read every row before finding the task.",
    clickableStatus: "The status chip looks clickable and competes with the whole-row task link.",
    colorOnly: "State relies on color without readable status text.",
    recordList: "The list becomes a sortable data table rather than a set of tasks to complete.",
    hiddenBlocked: "Review disappears until later, so users cannot understand what is blocking them.",
    summaryRow: "Answer summaries replace task names and hide where users should go next."
  };
  const cells: Record<Mode, string[]> = {
    longHint: ["Contact details", "This section includes all personal and household information required before your evidence can be reviewed", "Completed"],
    clickableStatus: ["Work history", "Open task", "Not started"],
    colorOnly: ["Green", "Blue", "Orange"],
    recordList: ["Task ID", "Owner", "Export CSV"],
    hiddenBlocked: ["Contact details", "Work history", "Upload evidence"],
    summaryRow: ["Mina Patel", "555-0149", "Passport.pdf"]
  };
  return (
    <div className={`quality-example task-list-bad-demo is-${mode}`}>
      <strong>{mode === "recordList" ? "Task inventory" : mode === "summaryRow" ? "Application summary" : "Application tasks"}</strong>
      <div className="task-list-bad-grid">
        {cells[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row task-list-controls">
        <button type="button" className={mode === "longHint" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("longHint")}>Long hint</button>
        <button type="button" className={mode === "clickableStatus" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("clickableStatus")}>Clickable status</button>
        <button type="button" className={mode === "colorOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("colorOnly")}>Color only</button>
        <button type="button" className={mode === "recordList" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("recordList")}>Record list</button>
        <button type="button" className={mode === "hiddenBlocked" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenBlocked")}>Hidden blocked</button>
        <button type="button" className={mode === "summaryRow" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("summaryRow")}>Summary row</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <TaskListGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <TaskListBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <TaskListGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <TaskListBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
