import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type PermissionSharingMode = "direct" | "groups" | "inherited" | "role" | "anonymous" | "service" | "deployKey" | "revoke" | "review" | "audit";

const permissionSharingCopy: Record<PermissionSharingMode, {
  banner: string;
  active: string;
  row: string;
  effect: string;
  detail: string;
  warning: string;
}> = {
  direct: {
    banner: "Direct grants visible",
    active: "Direct",
    row: "Maya Chen - Write",
    effect: "Can push and review pull requests",
    detail: "Maya has a direct Write grant on the repository.",
    warning: "Direct access can be changed here."
  },
  groups: {
    banner: "Group access explains effective role",
    active: "Groups",
    row: "Finance Reviewers - Triage",
    effect: "14 people can manage issues without code write access",
    detail: "Maya also receives Triage through Finance Reviewers.",
    warning: "Removing Maya directly will not remove group access."
  },
  inherited: {
    banner: "Inherited parent access is read-only here",
    active: "Inherited",
    row: "Aster org members - Read",
    effect: "Inherited from organization base permission",
    detail: "This row is labelled inherited and routes to organization settings.",
    warning: "Parent access must be changed at the parent scope."
  },
  role: {
    banner: "Role change shows capability delta",
    active: "Role change",
    row: "Rahul Patel - Maintain",
    effect: "Gains branch settings, still cannot manage access",
    detail: "Before/after summary separates Maintain from Admin.",
    warning: "Admin remains required for access management."
  },
  anonymous: {
    banner: "Anonymous access requires review",
    active: "Anonymous",
    row: "Anonymous users - View",
    effect: "Anyone with the space URL can view published pages",
    detail: "Public visibility is separated from named user and group grants.",
    warning: "Anonymous access broadens visibility outside known accounts."
  },
  service: {
    banner: "Service account access is included",
    active: "Service",
    row: "ci-export-bot - Read",
    effect: "Can read repository contents for nightly exports",
    detail: "Machine access appears in the same review surface as people.",
    warning: "Human removal does not remove service credentials."
  },
  deployKey: {
    banner: "Deploy key write access is exposed",
    active: "Deploy key",
    row: "prod-deploy-key - Write",
    effect: "Private key holder can write even if users are removed",
    detail: "The access graph includes keys that bypass ordinary member rows.",
    warning: "Rotate or remove key to complete revocation."
  },
  revoke: {
    banner: "Revoke checks remaining access",
    active: "Revoke",
    row: "Remove Maya direct grant",
    effect: "Still has Triage through Finance Reviewers",
    detail: "The warning names the remaining access route before save.",
    warning: "Access is not fully revoked until group access changes too."
  },
  review: {
    banner: "Pending changes ready for review",
    active: "Review",
    row: "3 changes pending",
    effect: "1 grant, 1 role change, 1 revoke warning",
    detail: "High-risk changes require confirmation before save.",
    warning: "Review names who gains, loses, or keeps access."
  },
  audit: {
    banner: "Saved with audit note",
    active: "Audit",
    row: "Audit event PERM-4921",
    effect: "Actor, target, old role, new role, and reason recorded",
    detail: "The result summary provides a durable trail for investigation.",
    warning: "Audit context is part of the permission change, not a separate note."
  }
};

function PermissionSharingFrame({
  mode = "direct",
  idSuffix = "demo"
}: {
  mode?: PermissionSharingMode;
  idSuffix?: string;
}) {
  const copy = permissionSharingCopy[mode];
  const titleId = `permission-sharing-title-${idSuffix}`;
  const risky = mode === "anonymous" || mode === "deployKey" || mode === "revoke" || mode === "review";
  const saved = mode === "audit";
  const rows = [
    { name: "Maya Chen", source: mode === "groups" || mode === "revoke" ? "Direct + group" : "Direct", role: mode === "revoke" ? "Remove direct" : "Write", status: mode === "revoke" ? "Access remains" : "Active" },
    { name: "Finance Reviewers", source: "Group", role: "Triage", status: "14 members" },
    { name: "Aster org members", source: "Inherited", role: "Read", status: "Parent scope" },
    { name: mode === "deployKey" ? "prod-deploy-key" : "ci-export-bot", source: mode === "deployKey" ? "Deploy key" : "Service", role: mode === "deployKey" ? "Write" : "Read", status: mode === "deployKey" ? "Credential" : "Automation" }
  ];
  return (
    <div className={`permission-sharing-frame permission-sharing-surface is-${mode}`}>
      <section className="permission-sharing-panel" aria-labelledby={titleId}>
        <div className="permission-sharing-header">
          <span>Repository: revenue-api</span>
          <strong>{copy.banner}</strong>
        </div>
        <h4 id={titleId}>Manage repository permissions</h4>
        <div className="permission-sharing-summary" aria-label="Effective access summary">
          <span>People: 28</span>
          <span>Groups: 3</span>
          <span>Inherited: Read</span>
          <span>{risky ? "Review required" : saved ? "Saved" : "No public access"}</span>
        </div>
        <div className="permission-sharing-table" role="table" aria-label="Effective permission rows">
          <div role="row" className="permission-sharing-row is-head">
            <span role="columnheader">Principal</span>
            <span role="columnheader">Source</span>
            <span role="columnheader">Role</span>
            <span role="columnheader">Status</span>
          </div>
          {rows.map((row) => (
            <div role="row" className={`permission-sharing-row ${row.source.toLowerCase().replace(/[^a-z]+/g, "-")}`} key={`${row.name}-${row.source}`}>
              <span role="cell">{row.name}</span>
              <span role="cell">{row.source}</span>
              <span role="cell">{row.role}</span>
              <span role="cell">{row.status}</span>
            </div>
          ))}
        </div>
        <div className="permission-sharing-actions">
          <button type="button" className="demo-button small">Add principal</button>
          <button type="button" className="demo-button small">Review changes</button>
          <button type="button" className="demo-button small primary">{saved ? "Saved" : "Save permissions"}</button>
        </div>
      </section>
      <aside className="permission-sharing-detail" aria-label="Permission sharing detail">
        <div className="permission-sharing-card">
          <span>{copy.active}</span>
          <strong>{copy.row}</strong>
          <p>{copy.effect}</p>
        </div>
        <div className="permission-sharing-warning">
          <b>{copy.warning}</b>
          <span>{copy.detail}</span>
        </div>
        <div className="permission-sharing-delta">
          <span>{mode === "role" ? "Write -> Maintain" : mode === "audit" ? "Saved as PERM-4921" : mode === "review" ? "3 pending changes" : "Effective access recalculated"}</span>
        </div>
      </aside>
    </div>
  );
}

function PermissionSharingGoodUi() {
  return (
    <div className="quality-example permission-sharing-demo">
      <PermissionSharingFrame />
      <p className="demo-status">The access surface separates direct, group, inherited, and machine grants and explains effective access before any permission change is saved.</p>
    </div>
  );
}

function PermissionSharingBadUi() {
  return (
    <div className="bad-ui-sample permission-sharing-bad-demo is-directOnly">
      <strong>People with access</strong>
      <div className="permission-sharing-bad-box">
        <span>Maya Chen</span>
        <button type="button" className="demo-button small primary">Remove</button>
      </div>
      <p className="demo-status">The broken UI shows one visible person row but hides group, inherited, anonymous, and machine access routes.</p>
    </div>
  );
}

function PermissionSharingGoodUx() {
  const [mode, setMode] = useState<PermissionSharingMode>("direct");
  const [message, setMessage] = useState("Direct grants are visible beside group and inherited access.");
  function choose(nextMode: PermissionSharingMode, nextMessage: string) {
    setMode(nextMode);
    setMessage(nextMessage);
  }
  return (
    <div className="quality-example permission-sharing-demo">
      <PermissionSharingFrame mode={mode} idSuffix="good-ux" />
      <div className="demo-row permission-sharing-controls" aria-label="Permission sharing exercise controls">
        <button type="button" className={mode === "direct" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("direct", "Direct grants are visible beside group and inherited access.")}>Direct</button>
        <button type="button" className={mode === "groups" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("groups", "Group access explains why a person keeps effective permission after direct removal.")}>Groups</button>
        <button type="button" className={mode === "inherited" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("inherited", "Inherited access is labelled and points to the parent scope that owns it.")}>Inherited</button>
        <button type="button" className={mode === "role" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("role", "Role change shows before and after capabilities before save.")}>Role change</button>
        <button type="button" className={mode === "anonymous" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("anonymous", "Anonymous access is treated as a high-risk public visibility change.")}>Anonymous</button>
        <button type="button" className={mode === "service" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("service", "Service account access is reviewed with human grants.")}>Service</button>
        <button type="button" className={mode === "deployKey" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("deployKey", "Deploy key write access is visible in the same effective access review.")}>Deploy key</button>
        <button type="button" className={mode === "revoke" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("revoke", "Revoke warns that access remains through a group until that route changes.")}>Revoke</button>
        <button type="button" className={mode === "review" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("review", "Review names every pending grant, role change, and remaining access route.")}>Review</button>
        <button type="button" className={mode === "audit" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("audit", "Audit note records actor, target, old role, new role, and reason.")}>Audit</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function PermissionSharingBadUx() {
  type Mode = "directOnly" | "hiddenGroup" | "unclearRole" | "noReview" | "partialSave" | "noAudit";
  const [mode, setMode] = useState<Mode>("directOnly");
  const copy: Record<Mode, string> = {
    directOnly: "Removing the visible direct row implies access is gone while inherited access remains.",
    hiddenGroup: "The UI hides the Finance Reviewers group that still grants Triage access.",
    unclearRole: "The label Member does not explain whether users can edit, export, delete, or manage access.",
    noReview: "Anonymous access is enabled with no review of public visibility or affected scope.",
    partialSave: "One role change saves and another fails, but the result does not say which permission changed.",
    noAudit: "Permission changes are applied without actor, target, old role, new role, or reason."
  };
  const cells: Record<Mode, string[]> = {
    directOnly: ["Maya", "Remove", "Done"],
    hiddenGroup: ["Finance group hidden", "Maya still in group", "Access remains"],
    unclearRole: ["Member", "?", "Can export?"],
    noReview: ["Anonymous", "On", "Saved"],
    partialSave: ["2 changes", "Saved?", "Unknown"],
    noAudit: ["Changed", "No reason", "No event ID"]
  };
  return (
    <div className={`quality-example permission-sharing-bad-demo is-${mode}`}>
      <strong>{mode === "noAudit" ? "Untraceable permission change" : "Broken permission sharing"}</strong>
      <div className="permission-sharing-bad-grid">
        {cells[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row permission-sharing-controls">
        <button type="button" className={mode === "directOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("directOnly")}>Direct only</button>
        <button type="button" className={mode === "hiddenGroup" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenGroup")}>Hidden group</button>
        <button type="button" className={mode === "unclearRole" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("unclearRole")}>Unclear role</button>
        <button type="button" className={mode === "noReview" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noReview")}>No review</button>
        <button type="button" className={mode === "partialSave" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("partialSave")}>Partial save</button>
        <button type="button" className={mode === "noAudit" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noAudit")}>No audit</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PermissionSharingGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PermissionSharingBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PermissionSharingGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PermissionSharingBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
