import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type AuditLogMode =
  | "privileged"
  | "restrictedScope"
  | "retention"
  | "legalHold"
  | "exportEvidence"
  | "apiQuery"
  | "siem"
  | "tamper"
  | "duplicate"
  | "corrected"
  | "redacted"
  | "licenseLimited"
  | "outOfRetention"
  | "permissionLimited"
  | "systemActor"
  | "serviceAccount"
  | "mobile";

type AuditLogBadMode =
  | "activityFeed"
  | "missingAuditId"
  | "editableEvidence"
  | "hiddenScope"
  | "exportMismatch"
  | "rawSecretAudit"
  | "healthyWhileDelayed";

const auditLogGoodLabels: Array<[AuditLogMode, string]> = [
  ["privileged", "Privileged action record"],
  ["restrictedScope", "Restricted admin scope"],
  ["retention", "Retention policy"],
  ["legalHold", "Legal hold"],
  ["exportEvidence", "Export evidence"],
  ["apiQuery", "API query"],
  ["siem", "SIEM stream"],
  ["tamper", "Tamper check"],
  ["duplicate", "Duplicate ingestion"],
  ["corrected", "Corrected record"],
  ["redacted", "Redacted record"],
  ["licenseLimited", "License-limited event"],
  ["outOfRetention", "Out-of-retention event"],
  ["permissionLimited", "Permission-limited view"],
  ["systemActor", "System actor"],
  ["serviceAccount", "Service account actor"],
  ["mobile", "Mobile compact audit"]
];

const auditLogBadLabels: Array<[AuditLogBadMode, string]> = [
  ["activityFeed", "Activity-feed masquerade"],
  ["missingAuditId", "Missing audit ID"],
  ["editableEvidence", "Editable evidence"],
  ["hiddenScope", "Hidden scope"],
  ["exportMismatch", "Export mismatch"],
  ["rawSecretAudit", "Raw secret audit"],
  ["healthyWhileDelayed", "Healthy while delayed"]
];

function AuditLogEvidencePanel({ mode, idSuffix }: { mode: AuditLogMode; idSuffix: string }) {
  const config: Record<AuditLogMode, {
    chip: string;
    title: string;
    body: string;
    actor: string;
    action: string;
    object: string;
    scope: string;
    retention: string;
    integrity: string;
    exportState: string;
    result: string;
    primary: string;
    secondary: string;
    tone?: "warning" | "danger" | "ready";
    compact?: boolean;
  }> = {
    privileged: {
      chip: "Privileged action record",
      title: "Role escalation recorded",
      body: "Audit ID aud-2026-0612-8841 ties the owner-role change to actor session, target account, source IP, and before/after values.",
      actor: "maya.chen@example.com - session",
      action: "Changed role: Member -> Owner",
      object: "Aster Finance workspace",
      scope: "Enterprise owner scope",
      retention: "10-year policy eligible",
      integrity: "Hash verified",
      exportState: "Evidence package ready",
      result: "Success",
      primary: "Open evidence",
      secondary: "Copy audit ID",
      tone: "ready"
    },
    restrictedScope: {
      chip: "Restricted admin scope",
      title: "Some audit records are hidden",
      body: "Administrative-unit scope shows 48 visible records, 7 redacted records, and 12 records outside this reviewer's assignment.",
      actor: "Restricted admin",
      action: "Search privileged actions",
      object: "Three assigned units",
      scope: "Restricted by administrative unit",
      retention: "180-day search window",
      integrity: "Coverage gap disclosed",
      exportState: "Scoped export only",
      result: "Partial",
      primary: "Request broader scope",
      secondary: "Export visible",
      tone: "warning"
    },
    retention: {
      chip: "Retention policy",
      title: "Retention boundary shown",
      body: "Audit records in Microsoft Entra and SharePoint are retained for one year; older events require archive or premium policy access.",
      actor: "Compliance owner",
      action: "Review retention class",
      object: "Audit record family",
      scope: "Standard plus premium policy",
      retention: "180 days / 1 year / legal hold",
      integrity: "Policy timestamp shown",
      exportState: "Archive route available",
      result: "Covered",
      primary: "Open retention policy",
      secondary: "Search archive"
    },
    legalHold: {
      chip: "Legal hold",
      title: "Audit evidence is held",
      body: "The record is retained beyond normal expiry because legal hold LH-392 applies to the investigation.",
      actor: "Legal investigator",
      action: "Applied legal hold",
      object: "Role-change audit set",
      scope: "Case INV-448",
      retention: "Hold overrides expiry",
      integrity: "Hold event audited",
      exportState: "Export requires case note",
      result: "Held",
      primary: "Open hold",
      secondary: "Add note"
    },
    exportEvidence: {
      chip: "Export evidence",
      title: "Export matches visible query",
      body: "Export job exp-559 includes the same query, timezone, redaction level, field set, and 48 visible records shown on screen.",
      actor: "Compliance reviewer",
      action: "Exported audit search",
      object: "Privileged action query",
      scope: "Restricted admin scope",
      retention: "Within 180 days",
      integrity: "Export hash generated",
      exportState: "CSV and manifest ready",
      result: "Ready",
      primary: "Download package",
      secondary: "Copy export ID",
      tone: "ready"
    },
    apiQuery: {
      chip: "API query",
      title: "API cursor and rate limit visible",
      body: "The audit API query shows cursor position, UTC timestamp semantics, actor filter, rate-limit remaining, and retry time.",
      actor: "Integration service",
      action: "Queried audit API",
      object: "Enterprise audit endpoint",
      scope: "read:audit_log scope",
      retention: "180-day API window",
      integrity: "Cursor signed",
      exportState: "Page 3 of 9",
      result: "Paged",
      primary: "Copy API query",
      secondary: "Retry after limit"
    },
    siem: {
      chip: "SIEM stream",
      title: "Security stream is healthy",
      body: "The SIEM handoff shows last delivered audit ID, lag, failed batch count, and retry queue before analysts rely on downstream search.",
      actor: "Audit pipeline",
      action: "Streamed records",
      object: "SIEM destination",
      scope: "All enterprise events",
      retention: "Retained upstream",
      integrity: "Last hash acknowledged",
      exportState: "Lag 42 seconds",
      result: "Healthy",
      primary: "Open stream",
      secondary: "View retries",
      tone: "ready"
    },
    tamper: {
      chip: "Tamper check",
      title: "Integrity check failed",
      body: "A missing sequence and hash mismatch are shown as investigation states rather than empty results.",
      actor: "Audit verifier",
      action: "Checked chain",
      object: "Audit batch 2026-06-12",
      scope: "Enterprise stream",
      retention: "Held for incident",
      integrity: "Hash mismatch",
      exportState: "Export blocked",
      result: "Needs review",
      primary: "Open incident",
      secondary: "Copy batch ID",
      tone: "danger"
    },
    duplicate: {
      chip: "Duplicate ingestion",
      title: "Duplicate event marked",
      body: "At-least-once delivery produced a repeated audit ID, so the UI marks duplicate ingestion before counts are used.",
      actor: "Audit pipeline",
      action: "Replayed event",
      object: "aud-2026-0612-8841",
      scope: "Streaming pipeline",
      retention: "Original retained",
      integrity: "Duplicate of prior hash",
      exportState: "Deduplicated export",
      result: "Duplicate",
      primary: "Open original",
      secondary: "Hide duplicate"
    },
    corrected: {
      chip: "Corrected record",
      title: "Correction is self-audited",
      body: "A corrected IP enrichment adds a new correction record and preserves the original event body.",
      actor: "Audit enrichment service",
      action: "Corrected IP details",
      object: "aud-2026-0612-8841",
      scope: "Enrichment only",
      retention: "Original and correction retained",
      integrity: "Correction linked",
      exportState: "Both records exported",
      result: "Corrected",
      primary: "Compare records",
      secondary: "Copy correction ID"
    },
    redacted: {
      chip: "Redacted record",
      title: "Sensitive fields redacted",
      body: "Actor email, IP detail, and object title are hidden by role while audit ID, event type, result, and redaction reason remain visible.",
      actor: "Redacted by policy",
      action: "Viewed protected object",
      object: "Redacted object",
      scope: "Restricted reviewer",
      retention: "Policy retained",
      integrity: "Redaction reason logged",
      exportState: "Redacted export",
      result: "Redacted",
      primary: "Request access",
      secondary: "Export redacted"
    },
    licenseLimited: {
      chip: "License-limited event",
      title: "Event family not captured",
      body: "The UI states that this premium event type requires licensing before records are generated.",
      actor: "System",
      action: "High-value event unavailable",
      object: "Mail item access",
      scope: "License boundary",
      retention: "Not generated",
      integrity: "Coverage gap",
      exportState: "No record to export",
      result: "Unavailable",
      primary: "View requirements",
      secondary: "Search available events",
      tone: "warning"
    },
    outOfRetention: {
      chip: "Out-of-retention event",
      title: "Record is outside retention",
      body: "The query reaches beyond the retention window; the UI shows archive and policy paths instead of claiming no event happened.",
      actor: "Compliance reviewer",
      action: "Searched old event",
      object: "Deleted project",
      scope: "Beyond live retention",
      retention: "Expired from live index",
      integrity: "Archive needed",
      exportState: "Archive request",
      result: "Out of retention",
      primary: "Request archive",
      secondary: "Open policy",
      tone: "warning"
    },
    permissionLimited: {
      chip: "Permission-limited view",
      title: "Audit shape visible, values hidden",
      body: "The reviewer can see that evidence exists, why values are hidden, and which access route can reveal them.",
      actor: "Hidden actor",
      action: "API key updated",
      object: "Hidden project",
      scope: "Permission-limited",
      retention: "Retained",
      integrity: "Record exists",
      exportState: "Request access before full export",
      result: "Limited",
      primary: "Request access",
      secondary: "Copy audit ID"
    },
    systemActor: {
      chip: "System actor",
      title: "System event distinguished",
      body: "The row labels non-user activity as a system event so reviewers do not attribute it to a person.",
      actor: "Atlassian system",
      action: "Applied policy",
      object: "Authentication policy",
      scope: "Organization",
      retention: "Policy retained",
      integrity: "Generated by system",
      exportState: "Exportable",
      result: "Success",
      primary: "Open event",
      secondary: "Filter system actors"
    },
    serviceAccount: {
      chip: "Service account actor",
      title: "API-key actor context shown",
      body: "The actor is an API key used by a service account, with owner, session context, and source IP details available.",
      actor: "deploy-bot API key",
      action: "Updated project key scope",
      object: "proj_finance_live",
      scope: "Service account",
      retention: "180-day API window",
      integrity: "Actor key linked",
      exportState: "API evidence ready",
      result: "Success",
      primary: "Open key evidence",
      secondary: "Copy audit ID"
    },
    mobile: {
      chip: "Mobile compact audit",
      title: "Audit evidence remains readable",
      body: "Audit ID, actor, action, scope, retention, integrity, and export state wrap without hiding governed evidence.",
      actor: "maya.chen@example.com",
      action: "Changed role",
      object: "Aster Finance",
      scope: "Enterprise",
      retention: "10-year eligible",
      integrity: "Hash verified",
      exportState: "Ready",
      result: "Success",
      primary: "Open",
      secondary: "Copy ID",
      compact: true
    }
  };
  const item = config[mode];
  const titleId = `audit-log-title-${idSuffix}`;
  const descId = `audit-log-desc-${idSuffix}`;

  return (
    <section className={`audit-log-panel is-${mode} ${item.tone ? `is-${item.tone}` : ""} ${item.compact ? "is-compact" : ""}`} aria-labelledby={titleId} aria-describedby={descId}>
      <div className="audit-log-panel-head">
        <div>
          <span>{item.chip}</span>
          <strong id={titleId}>{item.title}</strong>
        </div>
        <b>{item.result}</b>
      </div>
      <p id={descId}>{item.body}</p>
      <div className="audit-log-evidence-grid" aria-label="Audit evidence fields">
        <span><b>Audit ID</b>aud-2026-0612-8841</span>
        <span><b>Actor</b>{item.actor}</span>
        <span><b>Action</b>{item.action}</span>
        <span><b>Object</b>{item.object}</span>
        <span><b>Scope</b>{item.scope}</span>
        <span><b>Retention</b>{item.retention}</span>
        <span><b>Integrity</b>{item.integrity}</span>
        <span><b>Export/API/SIEM</b>{item.exportState}</span>
      </div>
      <div className="audit-log-actions">
        <button type="button" className="demo-button small primary">{item.primary}</button>
        <button type="button" className="demo-button small">{item.secondary}</button>
        <button type="button" className="demo-button small">Copy evidence manifest</button>
      </div>
    </section>
  );
}

function AuditLogGoodUi() {
  return (
    <div className="quality-example audit-log-demo">
      <AuditLogEvidencePanel mode="privileged" idSuffix="good-ui" />
      <p className="demo-status">The UI exposes governed evidence fields: audit ID, actor session, privileged action, object, retention class, integrity check, export package, and copyable evidence manifest.</p>
    </div>
  );
}

function AuditLogBadUi() {
  return (
    <div className="bad-ui-sample audit-log-bad-demo is-missingAuditId">
      <div className="audit-log-broken" aria-label="Broken audit log">
        <strong>Admin changed something</strong>
        <span>No audit ID, actor type, before/after value, retention class, legal hold, export job, or tamper status.</span>
        <button type="button" className="demo-button small danger">Delete row</button>
      </div>
      <p className="demo-status">The broken UI looks like a recent activity item and cannot support governed audit evidence.</p>
    </div>
  );
}

function AuditLogGoodUx() {
  const [mode, setMode] = useState<AuditLogMode>("privileged");
  return (
    <div className="quality-example audit-log-demo">
      <div className="audit-log-controls" aria-label="Audit log exercise controls">
        {auditLogGoodLabels.map(([key, label]) => (
          <button
            type="button"
            key={key}
            className={mode === key ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <AuditLogEvidencePanel mode={mode} idSuffix="good-ux" />
      <p className="demo-status" aria-live="polite">Audit log state: {auditLogGoodLabels.find(([key]) => key === mode)?.[1]}.</p>
    </div>
  );
}

function AuditLogBadUx() {
  const [mode, setMode] = useState<AuditLogBadMode>("activityFeed");
  const copy: Record<AuditLogBadMode, {
    title: string;
    body: string;
    fieldA: string;
    fieldB: string;
    fieldC: string;
    outcome: string;
  }> = {
    activityFeed: {
      title: "Activity-feed masquerade",
      body: "Recent updates are called an audit log even though records can be dismissed, reordered, and cleared like a feed.",
      fieldA: "No retention",
      fieldB: "No custody",
      fieldC: "No export proof",
      outcome: "Reviewers cannot rely on the stream as governed evidence."
    },
    missingAuditId: {
      title: "Missing audit ID",
      body: "Rows show changed settings but no stable audit ID, actor session, object, result, source, or request context.",
      fieldA: "No audit ID",
      fieldB: "Actor unknown",
      fieldC: "No before/after",
      outcome: "Incident notes cannot reference a durable record."
    },
    editableEvidence: {
      title: "Editable evidence",
      body: "Privileged admins can rename, delete, or mark audit rows read without policy or a self-auditing event.",
      fieldA: "Delete row",
      fieldB: "Edit label",
      fieldC: "No self-audit",
      outcome: "The audit surface undermines its own evidence."
    },
    hiddenScope: {
      title: "Hidden scope",
      body: "Restricted admin scope excludes records, but the page says zero results without hidden or redacted counts.",
      fieldA: "0 results",
      fieldB: "Scope hidden",
      fieldC: "Redaction unknown",
      outcome: "Users infer that no event happened when evidence is merely outside scope."
    },
    exportMismatch: {
      title: "Export mismatch",
      body: "The export package uses another date range, timezone, redaction level, and field set than the visible query.",
      fieldA: "Screen: 48",
      fieldB: "Export: 183",
      fieldC: "No manifest",
      outcome: "The evidence package cannot be reconciled with the reviewed search."
    },
    rawSecretAudit: {
      title: "Raw secret audit",
      body: "The audit detail logs raw API keys, private files, AI prompts, or tokens into a broad admin view.",
      fieldA: "Raw token",
      fieldB: "Prompt exposed",
      fieldC: "No redaction",
      outcome: "The audit log creates a new sensitive-data exposure."
    },
    healthyWhileDelayed: {
      title: "Healthy while delayed",
      body: "The SIEM pipeline is hours behind, but the UI still says stream healthy and shows no lag or failed batch count.",
      fieldA: "Lag hidden",
      fieldB: "Batches failed",
      fieldC: "Healthy badge",
      outcome: "Analysts rely on incomplete downstream evidence."
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example audit-log-bad-demo is-${mode}`}>
      <div className="audit-log-controls" aria-label="Audit log misuse controls">
        {auditLogBadLabels.map(([key, label]) => (
          <button
            type="button"
            key={key}
            className={mode === key ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="audit-log-broken" aria-label={`Broken state: ${item.title}`}>
        <strong>{item.title}</strong>
        <p>{item.body}</p>
        <div className="audit-log-broken-grid">
          <span>{item.fieldA}</span>
          <span>{item.fieldB}</span>
          <span>{item.fieldC}</span>
        </div>
        <button type="button" className="demo-button small danger">{mode === "editableEvidence" ? "Delete evidence" : "Continue"}</button>
      </div>
      <p className="demo-status" aria-live="polite">{item.outcome}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AuditLogGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AuditLogBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AuditLogGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AuditLogBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
