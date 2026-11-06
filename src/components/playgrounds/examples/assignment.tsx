import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type AssignmentStage = "current" | "unassigned" | "self" | "multiple" | "team" | "bot" | "automatic" | "reassign" | "bulk" | "permission" | "sync";

const assignmentStageCopy: Record<AssignmentStage, {
  title: string;
  assignee: string;
  role: string;
  status: string;
  detail: string;
  side: string;
  notice: string;
}> = {
  current: {
    title: "Ticket TCK-482 owner",
    assignee: "Maya Chen",
    role: "Responsible assignee",
    status: "Assigned",
    detail: "Maya owns the next customer response. Watchers and reviewers stay separate.",
    side: "Assigned-to-me: Maya",
    notice: "Maya was notified when the ticket moved from unassigned to assigned."
  },
  unassigned: {
    title: "Unassigned ticket",
    assignee: "No assignee",
    role: "Needs owner",
    status: "Unassigned",
    detail: "The item remains visible in the unassigned queue until someone takes responsibility.",
    side: "Queue: Unassigned support",
    notice: "Unassigned is explicit, not hidden behind a blank people field."
  },
  self: {
    title: "Assign to me",
    assignee: "You",
    role: "Responsible assignee",
    status: "Self-assigned",
    detail: "The action records that you took responsibility and moves the ticket into your work.",
    side: "Assigned-to-me: You",
    notice: "Self-assignment updates the ticket, queue, activity feed, and personal work list."
  },
  multiple: {
    title: "Multiple assignees allowed",
    assignee: "Priya Shah + Rahul Patel",
    role: "2 of 10 assignees",
    status: "Shared responsibility",
    detail: "The product states the multi-assignee policy so users do not confuse owner with watcher.",
    side: "Limit: 10 assignees",
    notice: "Both assignees are notified and shown as responsible for the issue."
  },
  team: {
    title: "Team assignment",
    assignee: "Billing triage",
    role: "Team owner",
    status: "Assigned to team",
    detail: "Team ownership routes work to a shared queue without naming one individual yet.",
    side: "Queue: Billing triage",
    notice: "Team members see the assignment in the team queue."
  },
  bot: {
    title: "Automation owner",
    assignee: "Copilot agent",
    role: "Bot assignee",
    status: "Working",
    detail: "Bot assignment explains what autonomous work starts and where human review returns.",
    side: "Output: Pull request",
    notice: "The bot will open a pull request and request review when finished."
  },
  automatic: {
    title: "Automatic owner",
    assignee: "Component default: Mina Patel",
    role: "Auto-assigned",
    status: "Rule applied",
    detail: "The UI names the component default rule instead of pretending a person chose Mina.",
    side: "Rule: Payments component",
    notice: "Space admins can change the default owner behind this automatic choice."
  },
  reassign: {
    title: "Reassign with handoff",
    assignee: "Priya Shah",
    role: "New responsible assignee",
    status: "Reassigned",
    detail: "Previous owner Maya and the handoff note stay visible after responsibility changes.",
    side: "Previous: Maya Chen",
    notice: "Handoff note: customer asked for refund policy proof."
  },
  bulk: {
    title: "Bulk assignment preview",
    assignee: "Rahul Patel",
    role: "Assign 5 visible tickets",
    status: "Preview required",
    detail: "The action names selected count, hidden filtered rows, existing owners, and exceptions.",
    side: "5 selected, 1 ineligible",
    notice: "Bulk assignment waits for review before notifying assignees."
  },
  permission: {
    title: "Candidate cannot act",
    assignee: "Nora Lee",
    role: "Ineligible candidate",
    status: "Blocked",
    detail: "Nora lacks access to the confidential project, so assignment is blocked before save.",
    side: "Access required",
    notice: "Assignment does not silently grant permission."
  },
  sync: {
    title: "Assignment saved",
    assignee: "Maya Chen",
    role: "Responsible assignee",
    status: "Synchronized",
    detail: "Assigned-to-me, queue count, notification, and activity feed all agree on the owner.",
    side: "Queue count: 17",
    notice: "Activity recorded: Alex assigned TCK-482 to Maya."
  }
};

function AssignmentFrame({
  stage = "current",
  idSuffix = "demo"
}: {
  stage?: AssignmentStage;
  idSuffix?: string;
}) {
  const copy = assignmentStageCopy[stage];
  const candidates = [
    { name: "Maya Chen", meta: "Support lead, has access", state: stage === "current" || stage === "sync" ? "Current" : "Eligible" },
    { name: "Priya Shah", meta: "Refund specialist, 6 open", state: stage === "reassign" ? "Selected" : "Eligible" },
    { name: "Rahul Patel", meta: "Engineering owner, 3 open", state: stage === "bulk" ? "Bulk target" : "Eligible" },
    { name: "Nora Lee", meta: "No confidential access", state: stage === "permission" ? "Blocked" : "Ineligible" }
  ];
  const selectedNames = stage === "multiple" ? ["Priya Shah", "Rahul Patel"] : stage === "team" ? ["Billing triage"] : stage === "bot" ? ["Copilot agent"] : [copy.assignee];
  return (
    <div className={`assignment-frame is-${stage}`}>
      <section className="assignment-card" aria-labelledby={`assignment-title-${idSuffix}`}>
        <div className="assignment-heading">
          <span>Support ticket</span>
          <strong>{copy.status}</strong>
        </div>
        <h4 id={`assignment-title-${idSuffix}`}>{copy.title}</h4>
        <div className="assignment-current" aria-label="Current assignment">
          <span>{copy.role}</span>
          <strong>{copy.assignee}</strong>
          <p>{copy.detail}</p>
        </div>
        <div className="assignment-selected" aria-label="Selected assignees">
          {selectedNames.map((name, index) => (
            <span key={`${name}-${index}`}>{name}</span>
          ))}
        </div>
        <div className="assignment-actions">
          <button type="button" className="demo-button small">Assign to me</button>
          <button type="button" className="demo-button small">Change assignee</button>
          <button type="button" className="demo-button small">Clear</button>
        </div>
      </section>
      <aside className="assignment-picker" aria-label="Assignment picker preview">
        <div className="assignment-search">
          <span>Search eligible people or teams</span>
          <strong>{stage === "permission" ? "Nora blocked" : stage === "automatic" ? "Automatic rule" : "4 candidates"}</strong>
        </div>
        <div className="assignment-candidates">
          {candidates.map((candidate) => (
            <div className={`assignment-candidate is-${candidate.state.toLowerCase().replace(/[^a-z]+/g, "-")}`} key={candidate.name}>
              <span>{candidate.name}</span>
              <small>{candidate.meta}</small>
              <em>{candidate.state}</em>
            </div>
          ))}
        </div>
        <div className="assignment-side-note">
          <strong>{copy.side}</strong>
          <p>{copy.notice}</p>
        </div>
      </aside>
    </div>
  );
}

function AssignmentGoodUi() {
  return (
    <div className="quality-example assignment-demo">
      <AssignmentFrame />
      <p className="demo-status">The assignment control names the accountable owner, separates watchers and reviewers, shows candidate eligibility, and states the notification outcome.</p>
    </div>
  );
}

function AssignmentBadUi() {
  return (
    <div className="bad-ui-sample assignment-bad-demo is-mixedRoles">
      <strong>People</strong>
      <div className="assignment-bad-grid">
        {["Maya", "Rahul", "Reviewer", "Watcher", "@Priya", "Owner?"].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <p className="demo-status">The broken people strip hides who owns the work and mixes assignee, reviewer, watcher, and mention roles.</p>
    </div>
  );
}

function AssignmentGoodUx() {
  const [stage, setStage] = useState<AssignmentStage>("current");
  const [message, setMessage] = useState("Maya is the responsible assignee; reviewers, watchers, and mentions remain separate.");
  function choose(nextStage: AssignmentStage, nextMessage: string) {
    setStage(nextStage);
    setMessage(nextMessage);
  }
  return (
    <div className="quality-example assignment-demo">
      <AssignmentFrame stage={stage} idSuffix="good-ux" />
      <div className="demo-row assignment-controls" aria-label="Assignment exercise controls">
        <button type="button" className={stage === "current" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("current", "Maya is the responsible assignee; reviewers, watchers, and mentions remain separate.")}>Current</button>
        <button type="button" className={stage === "unassigned" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("unassigned", "Unassigned is an explicit queue state, not a blank people field.")}>Unassigned</button>
        <button type="button" className={stage === "self" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("self", "Self assignment records that you took responsibility and updates your assigned work.")}>Self assign</button>
        <button type="button" className={stage === "multiple" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("multiple", "Multiple assignees are allowed here and the limit is visible before save.")}>Multiple</button>
        <button type="button" className={stage === "team" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("team", "Team assignment routes work into the Billing triage queue without pretending one person owns it.")}>Team</button>
        <button type="button" className={stage === "bot" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("bot", "Bot assignment explains the autonomous work and the human review return point.")}>Bot</button>
        <button type="button" className={stage === "automatic" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("automatic", "Automatic assignment names the component default rule and admin-owned source.")}>Automatic</button>
        <button type="button" className={stage === "reassign" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("reassign", "Reassignment keeps previous owner and handoff note visible.")}>Reassign</button>
        <button type="button" className={stage === "bulk" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("bulk", "Bulk assignment previews selected count, hidden rows, existing owners, and ineligible exceptions.")}>Bulk preview</button>
        <button type="button" className={stage === "permission" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("permission", "The picker blocks Nora because assignment does not silently grant confidential access.")}>Permission</button>
        <button type="button" className={stage === "sync" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("sync", "Assigned-to-me, queue count, notification, and activity all agree after save.")}>Sync</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function AssignmentBadUx() {
  type Mode = "mentionOnly" | "noAccess" | "mixedRoles" | "staleAuto" | "hiddenBulk" | "lostHandoff";
  const [mode, setMode] = useState<Mode>("mentionOnly");
  const copy: Record<Mode, string> = {
    mentionOnly: "A comment mentions Rahul, but no assignment record, notification, or assigned-to-me entry is created.",
    noAccess: "Nora is assigned to a confidential ticket she cannot open, and the UI still reports success.",
    mixedRoles: "Assignee, reviewer, approver, watcher, and mention names sit in one unlabeled people list.",
    staleAuto: "Automatic assignment still routes component work to a former maintainer.",
    hiddenBulk: "Bulk assign changes hidden filtered tickets without showing count, current owners, or exceptions.",
    lostHandoff: "Reassignment overwrites Maya with Priya and drops the previous owner and handoff note."
  };
  const labels: Record<Mode, string[]> = {
    mentionOnly: ["@Rahul", "Please handle", "No owner"],
    noAccess: ["Nora", "No access", "Saved"],
    mixedRoles: ["Maya", "Reviewer", "Watcher", "Approver", "Mention"],
    staleAuto: ["Auto", "Old owner", "Component drift"],
    hiddenBulk: ["23 selected", "5 visible", "No preview"],
    lostHandoff: ["Maya gone", "Priya now", "No note"]
  };
  return (
    <div className={`quality-example assignment-bad-demo is-${mode}`}>
      <strong>{mode === "hiddenBulk" ? "Bulk assign" : mode === "staleAuto" ? "Automatic assignment" : "Broken assignment"}</strong>
      <div className="assignment-bad-grid">
        {labels[mode].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row assignment-controls">
        <button type="button" className={mode === "mentionOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mentionOnly")}>Mention only</button>
        <button type="button" className={mode === "noAccess" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noAccess")}>No access</button>
        <button type="button" className={mode === "mixedRoles" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mixedRoles")}>Mixed roles</button>
        <button type="button" className={mode === "staleAuto" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleAuto")}>Stale auto</button>
        <button type="button" className={mode === "hiddenBulk" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenBulk")}>Hidden bulk</button>
        <button type="button" className={mode === "lostHandoff" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("lostHandoff")}>Lost handoff</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AssignmentGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AssignmentBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AssignmentGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AssignmentBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
