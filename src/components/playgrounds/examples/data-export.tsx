import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type DataExportMode =
  | "categories"
  | "dateRange"
  | "format"
  | "destination"
  | "identity"
  | "permission"
  | "requested"
  | "queued"
  | "estimating"
  | "packaging"
  | "background"
  | "partial"
  | "ready"
  | "download"
  | "transfer"
  | "expired"
  | "regenerate"
  | "failed"
  | "canceled"
  | "rateLimited"
  | "unsupported"
  | "storageFull"
  | "postDownload"
  | "mobile";

type DataExportBadMode =
  | "exportAllMystery"
  | "deleteConfusion"
  | "visibleRowsOnly"
  | "permanentLink"
  | "silentPartial"
  | "wrongAccount"
  | "rawSecretManifest";

const dataExportGoodLabels: Array<[DataExportMode, string]> = [
  ["categories", "Category selection"],
  ["dateRange", "Date range"],
  ["format", "Format choice"],
  ["destination", "Destination"],
  ["identity", "Identity check"],
  ["permission", "Permission check"],
  ["requested", "Export requested"],
  ["queued", "Queued"],
  ["estimating", "Estimate size"],
  ["packaging", "Packaging archive"],
  ["background", "Background job"],
  ["partial", "Partial export"],
  ["ready", "Ready package"],
  ["download", "Secure download"],
  ["transfer", "Transfer destination"],
  ["expired", "Expired link"],
  ["regenerate", "Regenerate link"],
  ["failed", "Failed export"],
  ["canceled", "Canceled export"],
  ["rateLimited", "Rate limited"],
  ["unsupported", "Unsupported format"],
  ["storageFull", "Storage full"],
  ["postDownload", "Post-download"],
  ["mobile", "Mobile compact export"]
];

const dataExportBadLabels: Array<[DataExportBadMode, string]> = [
  ["exportAllMystery", "Export-all mystery"],
  ["deleteConfusion", "Delete confusion"],
  ["visibleRowsOnly", "Visible rows only"],
  ["permanentLink", "Permanent link"],
  ["silentPartial", "Silent partial"],
  ["wrongAccount", "Wrong-account download"],
  ["rawSecretManifest", "Raw-secret manifest"]
];

function DataExportPanel({ mode, idSuffix }: { mode: DataExportMode; idSuffix: string }) {
  const config: Record<DataExportMode, {
    chip: string;
    title: string;
    body: string;
    scope: string;
    account: string;
    dateRange: string;
    format: string;
    destination: string;
    packageState: string;
    verification: string;
    expiry: string;
    primary: string;
    secondary: string;
    tone?: "warning" | "danger" | "ready";
    compact?: boolean;
  }> = {
    categories: {
      chip: "Category selection",
      title: "Choose eligible data categories",
      body: "Profile data, activity history, uploaded files, messages, billing records, and audit events are listed with unavailable categories explained before export starts.",
      scope: "Profile data + activity history selected",
      account: "maya.chen@example.com",
      dateRange: "All retained data",
      format: "JSON archive or CSV per category",
      destination: "Download package",
      packageState: "Draft export scope",
      verification: "Unavailable: deleted comments outside retention",
      expiry: "No package yet",
      primary: "Continue",
      secondary: "Select none"
    },
    dateRange: {
      chip: "Date range",
      title: "Export window is explicit",
      body: "The export uses account timezone for display and UTC timestamps in the manifest so users can reconcile package contents.",
      scope: "Activity history and messages",
      account: "Workspace: Aster Finance",
      dateRange: "Jan 1, 2025 - Jun 12, 2026",
      format: "JSON archive",
      destination: "Download package",
      packageState: "Range ready",
      verification: "Manifest will include UTC bounds",
      expiry: "No package yet",
      primary: "Apply range",
      secondary: "Use all retained"
    },
    format: {
      chip: "Format choice",
      title: "Machine-readable options shown",
      body: "JSON is available for full portability, CSV is available for tabular categories, and unavailable binary attachments are named before request.",
      scope: "Profile data, activity history, files",
      account: "maya.chen@example.com",
      dateRange: "All retained data",
      format: "JSON archive selected",
      destination: "Download package",
      packageState: "Format compatible",
      verification: "CSV limited to table-like records",
      expiry: "No package yet",
      primary: "Use JSON archive",
      secondary: "Compare formats"
    },
    destination: {
      chip: "Destination",
      title: "Download or transfer destination selected",
      body: "The workflow separates a local download from transfer to cloud archive and shows which destination can receive organization data.",
      scope: "Organization data export",
      account: "Aster Finance workspace",
      dateRange: "Last 12 months",
      format: "ZIP with JSON manifest",
      destination: "Cloud archive: gs://aster-export",
      packageState: "Destination authorized",
      verification: "Transfer destination checked",
      expiry: "Archive retained 14 days",
      primary: "Confirm destination",
      secondary: "Use browser download"
    },
    identity: {
      chip: "Identity check",
      title: "Sensitive export requires reauthentication",
      body: "The export includes private files and billing records, so the UI asks the current account to verify before the job is created.",
      scope: "Private files and billing",
      account: "maya.chen@example.com",
      dateRange: "All retained data",
      format: "Encrypted ZIP",
      destination: "Download package",
      packageState: "Identity check required",
      verification: "Reauthenticate this account",
      expiry: "No package until verified",
      primary: "Verify identity",
      secondary: "Change scope",
      tone: "warning"
    },
    permission: {
      chip: "Permission check",
      title: "Admin export scope is permission-gated",
      body: "The requester can export workspace settings but needs owner approval for member messages and private files.",
      scope: "Workspace settings visible, messages blocked",
      account: "Admin: Priya Shah",
      dateRange: "Last 90 days",
      format: "JSON archive",
      destination: "Cloud archive",
      packageState: "Approval required",
      verification: "Owner approval pending",
      expiry: "No package until approved",
      primary: "Request approval",
      secondary: "Export permitted categories",
      tone: "warning"
    },
    requested: {
      chip: "Export requested",
      title: "Export job EXP-2048 created",
      body: "The receipt keeps selected categories, account, workspace, date range, format, destination, requester, and timestamp visible.",
      scope: "Profile data, activity history, messages",
      account: "maya.chen@example.com",
      dateRange: "Jan 1, 2025 - Jun 12, 2026",
      format: "JSON archive",
      destination: "Download package",
      packageState: "EXP-2048 requested",
      verification: "Receipt copied to job history",
      expiry: "Ready link will expire in 7 days",
      primary: "Open job",
      secondary: "Copy request ID",
      tone: "ready"
    },
    queued: {
      chip: "Queued",
      title: "Export queued behind large archives",
      body: "Queue position, expected wait, notification route, and cancel action are shown without losing the chosen scope.",
      scope: "Workspace data export",
      account: "Aster Finance workspace",
      dateRange: "Last 12 months",
      format: "ZIP with JSON manifest",
      destination: "Cloud archive",
      packageState: "Queued, position 4",
      verification: "Email and in-app notification enabled",
      expiry: "Package expiry starts when ready",
      primary: "Notify me",
      secondary: "Cancel export"
    },
    estimating: {
      chip: "Estimate size",
      title: "Size and wait estimate updating",
      body: "The estimate includes files, messages, and redacted audit rows so the user can choose a smaller scope before packaging.",
      scope: "Messages, files, audit records",
      account: "Aster Finance workspace",
      dateRange: "Last 24 months",
      format: "ZIP archive",
      destination: "Download package",
      packageState: "Estimating 18.4 GB",
      verification: "Large export warning visible",
      expiry: "Ready link expires after 72 hours",
      primary: "Reduce scope",
      secondary: "Continue"
    },
    packaging: {
      chip: "Packaging archive",
      title: "Archive is being compressed",
      body: "The progress state names the current category and keeps manifest, checksum, and omitted category expectations visible.",
      scope: "Profile data, activity, messages",
      account: "maya.chen@example.com",
      dateRange: "All retained data",
      format: "ZIP of JSON files",
      destination: "Download package",
      packageState: "Packaging messages, 64%",
      verification: "Manifest building",
      expiry: "Expires 7 days after ready",
      primary: "View details",
      secondary: "Cancel export"
    },
    background: {
      chip: "Background job",
      title: "Large export can be left safely",
      body: "The status page, email route, and notification center link let the user leave and return without losing the export job.",
      scope: "Organization data export",
      account: "Aster Finance workspace",
      dateRange: "All retained data",
      format: "Cloud archive",
      destination: "gs://aster-export",
      packageState: "Running in background",
      verification: "Status page saved",
      expiry: "Archive expiry shown after completion",
      primary: "Open status page",
      secondary: "Send email update"
    },
    partial: {
      chip: "Partial export",
      title: "Export completed with omissions",
      body: "The package is usable, but the manifest names failed chat history, redacted fields, and records outside retention with retry actions.",
      scope: "Profile data, files ready; chat delayed",
      account: "maya.chen@example.com",
      dateRange: "All retained data",
      format: "JSON archive",
      destination: "Download package",
      packageState: "Partial package EXP-2048",
      verification: "Manifest lists 214 omitted records",
      expiry: "Link expires Jun 19, 2026",
      primary: "Download partial",
      secondary: "Retry failed category",
      tone: "warning"
    },
    ready: {
      chip: "Ready package",
      title: "Export package EXP-2048 is ready",
      body: "Package ID, selected scope, size, format, expiry, manifest, checksum, and account-bound download are shown before the user clicks.",
      scope: "Profile data + activity history + messages",
      account: "maya.chen@example.com",
      dateRange: "Jan 1, 2025 - Jun 12, 2026",
      format: "JSON archive, 2.4 GB",
      destination: "Download package",
      packageState: "EXP-2048 ready",
      verification: "manifest.json + SHA-256 checksum",
      expiry: "Expires Jun 19, 2026 at 10:30",
      primary: "Download archive",
      secondary: "View manifest",
      tone: "ready"
    },
    download: {
      chip: "Secure download",
      title: "Account-bound download link",
      body: "The link can only be used by the verified account and the UI warns that the archive may contain sensitive personal data.",
      scope: "Personal data archive",
      account: "Verified account only",
      dateRange: "All retained data",
      format: "Encrypted ZIP",
      destination: "Browser download",
      packageState: "One-time download token issued",
      verification: "Checksum copied after download",
      expiry: "Token expires in 15 minutes",
      primary: "Download archive",
      secondary: "Copy checksum",
      tone: "ready"
    },
    transfer: {
      chip: "Transfer destination",
      title: "Cloud transfer receipt shown",
      body: "The export distinguishes source export success from transfer success and gives a retry route for destination failures.",
      scope: "Organization export",
      account: "Aster Finance workspace",
      dateRange: "Last 12 months",
      format: "ZIP archive",
      destination: "Cloud archive",
      packageState: "Transferred to gs://aster-export",
      verification: "Destination receipt received",
      expiry: "Cloud archive follows admin retention",
      primary: "Open destination",
      secondary: "Copy receipt",
      tone: "ready"
    },
    expired: {
      chip: "Expired link",
      title: "Download link expired",
      body: "The package is no longer downloadable, but the scope, package ID, and regenerate path remain visible.",
      scope: "Profile data + activity history",
      account: "maya.chen@example.com",
      dateRange: "All retained data",
      format: "JSON archive",
      destination: "Download package",
      packageState: "EXP-2048 expired",
      verification: "Package removed from download storage",
      expiry: "Expired Jun 11, 2026",
      primary: "Regenerate link",
      secondary: "Start new export",
      tone: "warning"
    },
    regenerate: {
      chip: "Regenerate link",
      title: "New link requires identity check",
      body: "The UI keeps the same package manifest and asks the account holder to verify before issuing a new short-lived URL.",
      scope: "Same package scope",
      account: "maya.chen@example.com",
      dateRange: "Original export range",
      format: "JSON archive",
      destination: "Download package",
      packageState: "Regeneration pending",
      verification: "Identity check required",
      expiry: "New link expires in 15 minutes",
      primary: "Verify and regenerate",
      secondary: "View old manifest"
    },
    failed: {
      chip: "Failed export",
      title: "Export failed during packaging",
      body: "The failed category, error time, support reference, and retry route are shown instead of a generic empty package.",
      scope: "Messages category failed",
      account: "maya.chen@example.com",
      dateRange: "All retained data",
      format: "JSON archive",
      destination: "Download package",
      packageState: "Failed: archive service timeout",
      verification: "Support code EXP-2048-F",
      expiry: "No package generated",
      primary: "Retry export",
      secondary: "Contact support",
      tone: "danger"
    },
    canceled: {
      chip: "Canceled export",
      title: "Export canceled before package creation",
      body: "The workflow states that no archive was produced and keeps the previous scope available for a new request.",
      scope: "Profile data and files",
      account: "maya.chen@example.com",
      dateRange: "Last 90 days",
      format: "JSON archive",
      destination: "Download package",
      packageState: "Canceled by requester",
      verification: "No download token issued",
      expiry: "No package retained",
      primary: "Start again",
      secondary: "Copy canceled receipt"
    },
    rateLimited: {
      chip: "Rate limited",
      title: "Too many export requests",
      body: "The state gives the next available request time and explains that existing ready packages remain downloadable.",
      scope: "Personal data export",
      account: "maya.chen@example.com",
      dateRange: "All retained data",
      format: "JSON archive",
      destination: "Download package",
      packageState: "Rate limited until 16:00",
      verification: "Existing package EXP-2039 still available",
      expiry: "Current link expires Jun 18, 2026",
      primary: "Open existing package",
      secondary: "Remind me later",
      tone: "warning"
    },
    unsupported: {
      chip: "Unsupported format",
      title: "Selected format cannot include files",
      body: "The UI blocks CSV for binary attachments and offers JSON archive or category-specific CSV instead.",
      scope: "Files and messages selected",
      account: "maya.chen@example.com",
      dateRange: "All retained data",
      format: "CSV unsupported for files",
      destination: "Download package",
      packageState: "Format blocked",
      verification: "Reason shown before request",
      expiry: "No package yet",
      primary: "Use JSON archive",
      secondary: "Remove files",
      tone: "warning"
    },
    storageFull: {
      chip: "Storage full",
      title: "Destination storage is full",
      body: "Source export can be retried after changing destination, reducing categories, or freeing cloud archive space.",
      scope: "Organization data export",
      account: "Aster Finance workspace",
      dateRange: "Last 12 months",
      format: "ZIP archive",
      destination: "Cloud archive",
      packageState: "Destination storage full",
      verification: "No data transferred",
      expiry: "Source package retained 48 hours",
      primary: "Change destination",
      secondary: "Reduce scope",
      tone: "danger"
    },
    postDownload: {
      chip: "Post-download",
      title: "Download receipt separates export from deletion",
      body: "The completion state says the archive was downloaded and that source data was not deleted, anonymized, imported, or transferred.",
      scope: "Profile data + activity history",
      account: "maya.chen@example.com",
      dateRange: "All retained data",
      format: "JSON archive",
      destination: "Browser download",
      packageState: "Downloaded Jun 12, 2026",
      verification: "Checksum verified",
      expiry: "Link still expires Jun 19, 2026",
      primary: "View receipt",
      secondary: "Delete package link",
      tone: "ready"
    },
    mobile: {
      chip: "Mobile compact export",
      title: "Package status remains readable",
      body: "Category selection, package ID, expiry, manifest, checksum, and secure download actions wrap into a compact flow without hiding scope.",
      scope: "Profile data + activity history",
      account: "maya.chen@example.com",
      dateRange: "Last 12 months",
      format: "JSON archive",
      destination: "Download",
      packageState: "EXP-2048 ready",
      verification: "Manifest + checksum",
      expiry: "Expires Jun 19",
      primary: "Download",
      secondary: "Manifest",
      compact: true,
      tone: "ready"
    }
  };
  const item = config[mode];
  const titleId = `data-export-title-${idSuffix}`;
  const descId = `data-export-desc-${idSuffix}`;

  return (
    <section className={`data-export-panel is-${mode} ${item.tone ? `is-${item.tone}` : ""} ${item.compact ? "is-compact" : ""}`} aria-labelledby={titleId} aria-describedby={descId}>
      <div className="data-export-panel-head">
        <div>
          <span>{item.chip}</span>
          <strong id={titleId}>{item.title}</strong>
        </div>
        <b>{item.packageState}</b>
      </div>
      <p id={descId}>{item.body}</p>
      <div className="data-export-evidence-grid" aria-label="Data export package fields">
        <span><b>Package ID</b>EXP-2048</span>
        <span><b>Scope</b>{item.scope}</span>
        <span><b>Account/workspace</b>{item.account}</span>
        <span><b>Date range</b>{item.dateRange}</span>
        <span><b>Format</b>{item.format}</span>
        <span><b>Destination</b>{item.destination}</span>
        <span><b>Manifest/checksum</b>{item.verification}</span>
        <span><b>Expiry</b>{item.expiry}</span>
      </div>
      <div className="data-export-actions">
        <button type="button" className="demo-button small primary">{item.primary}</button>
        <button type="button" className="demo-button small">{item.secondary}</button>
        <button type="button" className="demo-button small">Copy manifest</button>
      </div>
    </section>
  );
}

function DataExportGoodUi() {
  return (
    <div className="quality-example data-export-demo">
      <DataExportPanel mode="ready" idSuffix="good-ui" />
      <p className="demo-status">Export package workflow UI makes export scope, account, date range, format, destination, package ID, expiry, manifest, checksum, and secure download state visible before download.</p>
    </div>
  );
}

function DataExportBadUi() {
  return (
    <div className="bad-ui-sample data-export-bad-demo is-exportAllMystery">
      <div className="data-export-broken" aria-label="Broken data export">
        <strong>Export all data</strong>
        <p>No category selection, account, date range, format, destination, package ID, expiry, manifest, checksum, permission check, or partial export state.</p>
        <div className="data-export-broken-grid">
          <span>One huge ZIP</span>
          <span>Permanent link</span>
          <span>Delete account nearby</span>
        </div>
        <button type="button" className="demo-button small danger">Export and delete</button>
      </div>
      <p className="demo-status">The broken UI hides what is included and confuses export with deletion.</p>
    </div>
  );
}

function DataExportGoodUx() {
  const [mode, setMode] = useState<DataExportMode>("ready");
  return (
    <div className="quality-example data-export-demo">
      <div className="data-export-controls" aria-label="Data export exercise controls">
        {dataExportGoodLabels.map(([key, label]) => (
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
      <DataExportPanel mode={mode} idSuffix="good-ux" />
      <p className="demo-status" aria-live="polite">Data export state: {dataExportGoodLabels.find(([key]) => key === mode)?.[1]}.</p>
    </div>
  );
}

function DataExportBadUx() {
  const [mode, setMode] = useState<DataExportBadMode>("exportAllMystery");
  const copy: Record<DataExportBadMode, {
    title: string;
    body: string;
    fieldA: string;
    fieldB: string;
    fieldC: string;
    outcome: string;
  }> = {
    exportAllMystery: {
      title: "Export-all mystery",
      body: "A single Export all data button gives no category selection, date range, account, workspace, format, destination, package ID, expiry, manifest, or checksum.",
      fieldA: "Scope unknown",
      fieldB: "Format unknown",
      fieldC: "No manifest",
      outcome: "Users cannot verify what the package contains."
    },
    deleteConfusion: {
      title: "Delete confusion",
      body: "Export is placed beside Delete account with copy that suggests downloading data will remove the source records.",
      fieldA: "Export and delete",
      fieldB: "Source state unclear",
      fieldC: "No receipt",
      outcome: "Users may misunderstand export, deletion, privacy settings, and consent withdrawal."
    },
    visibleRowsOnly: {
      title: "Visible rows only",
      body: "A visible table CSV is labelled full account export even though filters, pages, hidden columns, and data grid edits are excluded.",
      fieldA: "25 rows",
      fieldB: "Full account label",
      fieldC: "Filters hidden",
      outcome: "The package is a table download, not a data export."
    },
    permanentLink: {
      title: "Permanent link",
      body: "A sensitive archive URL has no expiry, identity check, account binding, regeneration flow, or secure download warning.",
      fieldA: "Never expires",
      fieldB: "Anyone with link",
      fieldC: "No reauth",
      outcome: "Private data can leak after the export job is forgotten."
    },
    silentPartial: {
      title: "Silent partial",
      body: "The job says complete even though messages failed, files were redacted, and records outside retention were omitted.",
      fieldA: "Complete badge",
      fieldB: "Missing messages",
      fieldC: "No retry",
      outcome: "Users trust an incomplete archive because failures are hidden."
    },
    wrongAccount: {
      title: "Wrong-account download",
      body: "An admin can download another user's archive without role explanation, approval, audit trail, notification, or redaction boundary.",
      fieldA: "Admin download",
      fieldB: "Owner hidden",
      fieldC: "No approval",
      outcome: "The export bypasses the account and workspace security model."
    },
    rawSecretManifest: {
      title: "Raw-secret manifest",
      body: "The manifest prints raw tokens, private prompts, file previews, and secret values instead of safe category names and counts.",
      fieldA: "Raw token",
      fieldB: "Prompt body",
      fieldC: "Secret preview",
      outcome: "The manifest becomes a sensitive-data reveal surface."
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example data-export-bad-demo is-${mode}`}>
      <div className="data-export-controls" aria-label="Data export misuse controls">
        {dataExportBadLabels.map(([key, label]) => (
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
      <div className="data-export-broken" aria-label={`Broken state: ${item.title}`}>
        <strong>{item.title}</strong>
        <p>{item.body}</p>
        <div className="data-export-broken-grid">
          <span>{item.fieldA}</span>
          <span>{item.fieldB}</span>
          <span>{item.fieldC}</span>
        </div>
        <button type="button" className="demo-button small danger">{mode === "deleteConfusion" ? "Export and delete" : "Continue"}</button>
      </div>
      <p className="demo-status" aria-live="polite">{item.outcome}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DataExportGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DataExportBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DataExportGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DataExportBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
