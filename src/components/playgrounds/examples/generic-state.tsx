import { useState } from "react";
import { QualityPanel, StateUi, ToastOnlySuccessTransactionBadPanel, ToastOnlySuccessTransactionPanel, type PatternMeta, type ToastOnlySuccessTransactionBadMode, type ToastOnlySuccessTransactionMode } from './shared';

function StateGoodUx({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  const [state, setState] = useState(patternId === "loading-skeleton" || patternId === "infinite-spinner" ? "loading" : patternId === "error-state" || patternId === "toast-only-critical-error" ? "error" : "empty");

  if (patternId === "offline-state") {
    const [mode, setMode] = useState<"online" | "offline" | "queued" | "reconnecting" | "synced" | "failed" | "readonly" | "stale">("queued");
    const config = {
      online: {
        chip: "Online",
        title: "Field report synced",
        detail: "Last server sync just now. Submit, refresh, and upload are available.",
        primary: "Submit report",
        secondary: "Refresh data",
        status: "Online state removes offline warnings and keeps normal actions available.",
        count: "0 queued"
      },
      offline: {
        chip: "No internet",
        title: "Offline: report saved on this device",
        detail: "Last server sync 10:42. Notes and cached asset history remain available.",
        primary: "Retry connection",
        secondary: "Export local copy",
        status: "Offline state explains local availability and disables only server actions.",
        count: "0 queued"
      },
      queued: {
        chip: "Queued",
        title: "3 edits and 2 photos waiting to sync",
        detail: "Draft is saved on this device. Submit unlocks after queued items upload.",
        primary: "Retry connection",
        secondary: "Review queue",
        status: "Queued state names what is local and what will sync after reconnection.",
        count: "5 queued"
      },
      reconnecting: {
        chip: "Checking",
        title: "Checking connection",
        detail: "Testing device network and server reachability before upload resumes.",
        primary: "Cancel check",
        secondary: "Keep editing",
        status: "Reconnect checks transition out of offline mode instead of leaving users with a spinner.",
        count: "5 queued"
      },
      synced: {
        chip: "Synced",
        title: "Queued changes synced",
        detail: "3 edits and 2 photos uploaded at 11:08. Server copy is current.",
        primary: "Submit report",
        secondary: "View receipt",
        status: "Synced state confirms the server accepted the queued local work.",
        count: "0 queued"
      },
      failed: {
        chip: "Sync failed",
        title: "Photos still saved on this device",
        detail: "The notes synced, but 2 photos failed to upload. Retry or export local copy.",
        primary: "Retry photos",
        secondary: "Export local copy",
        status: "Failed sync preserves local work and offers recovery instead of clearing the queue.",
        count: "2 queued"
      },
      readonly: {
        chip: "Cached",
        title: "Cached asset history is read-only",
        detail: "Last updated 10:42. You can inspect prior readings but cannot refresh while offline.",
        primary: "Retry connection",
        secondary: "Copy asset ID",
        status: "Read-only cache keeps useful data available while blocking online-only updates.",
        count: "read-only"
      },
      stale: {
        chip: "Stale",
        title: "Cached pricing may be outdated",
        detail: "Last updated yesterday at 16:20. Confirm values after reconnect before submitting.",
        primary: "Check connection",
        secondary: "Mark for review",
        status: "Stale mode labels age and risk so cached information is not mistaken for current server data.",
        count: "stale cache"
      }
    }[mode];

    return (
      <div className={`quality-example offline-state-good-ux is-${mode}`}>
        <div className="demo-row">
          {(["online", "offline", "queued", "reconnecting", "synced", "failed", "readonly", "stale"] as const).map((item) => (
            <button
              type="button"
              key={item}
              className={mode === item ? "demo-button small primary" : "demo-button small"}
              onClick={() => setMode(item)}
            >
              {item === "online" ? "Online" : item === "offline" ? "Offline" : item === "queued" ? "Queue save" : item === "reconnecting" ? "Reconnect" : item === "synced" ? "Synced" : item === "failed" ? "Sync failed" : item === "readonly" ? "Read-only" : "Stale"}
            </button>
          ))}
        </div>
        <p className="demo-status" aria-live="polite">{config.status}</p>
        <div className={`offline-card ${mode === "failed" || mode === "stale" ? "warning" : ""}`}>
          <div className="offline-topline">
            <div>
              <strong>{config.title}</strong>
              <span>{config.detail}</span>
            </div>
            <span className={`offline-chip ${mode}`}>{config.chip}</span>
          </div>
          <div className="offline-grid">
            <div>
              <strong>Available now</strong>
              <span>{mode === "online" || mode === "synced" ? "Server actions, refresh, upload, and submit." : mode === "readonly" ? "Cached history, notes, copy asset ID." : "Edit notes, inspect cached history, export local copy."}</span>
            </div>
            <div>
              <strong>Connection work</strong>
              <span>{config.count}</span>
            </div>
          </div>
          <div className="offline-queue" aria-label="Offline queue">
            <span>Inspection note</span>
            <span>{mode === "synced" || mode === "online" ? "server saved" : "saved on this device"}</span>
            <span>Photos</span>
            <span>{mode === "failed" ? "2 failed" : mode === "synced" || mode === "online" ? "uploaded" : "2 queued"}</span>
          </div>
          <div className="offline-actions">
            <button type="button" className="demo-button small primary">{config.primary}</button>
            <button type="button" className="demo-button small">{config.secondary}</button>
            <button type="button" className="demo-button small" disabled={mode !== "online" && mode !== "synced"}>Refresh server data</button>
          </div>
        </div>
      </div>
    );
  }

  if (patternId === "sync-state") {
    const [mode, setMode] = useState<"local" | "queued" | "syncing" | "synced" | "partial" | "failed" | "retrying" | "conflict">("partial");
    const config = {
      local: {
        chip: "Local saved",
        title: "Report saved on this device",
        detail: "No remote acceptance yet. Queue will start when sync resumes.",
        status: "Local saved is durable on the device, but not the same as server synced.",
        primary: "Start sync",
        rows: [
          ["Inspection note", "Local saved", "Saved 11:06"],
          ["Photos", "Local saved", "5 files on this device"],
          ["Meter reading", "Local saved", "Waiting for queue"]
        ]
      },
      queued: {
        chip: "Queued",
        title: "5 changes waiting for sync",
        detail: "Server reachable; queue starts after current job finishes.",
        status: "Queued state names work that exists locally and has not started remote transfer.",
        primary: "Sync now",
        rows: [
          ["Inspection note", "Queued", "Request 1 of 5"],
          ["Photos", "Queued", "5 uploads waiting"],
          ["Signature", "Queued", "Preserved locally"]
        ]
      },
      syncing: {
        chip: "Syncing",
        title: "Syncing 2 of 5 changes",
        detail: "Local copy remains available while the server accepts each item.",
        status: "Syncing state distinguishes transfer in progress from accepted remote save.",
        primary: "Pause sync",
        rows: [
          ["Inspection note", "Synced", "Accepted 11:08"],
          ["Photo set", "Syncing", "2 of 5 uploaded"],
          ["Meter reading", "Queued", "Next in queue"]
        ]
      },
      synced: {
        chip: "Synced",
        title: "Server copy is current",
        detail: "All 5 changes accepted at 11:09. No local-only work remains.",
        status: "Synced appears only after the remote copy accepts every queue item.",
        primary: "Open receipt",
        rows: [
          ["Inspection note", "Synced", "Accepted 11:08"],
          ["Photos", "Synced", "5 files uploaded"],
          ["Signature", "Synced", "Accepted 11:09"]
        ]
      },
      partial: {
        chip: "Partially synced",
        title: "3 synced, 1 failed, 1 needs review",
        detail: "Accepted changes stay synced while unresolved work remains visible.",
        status: "Partial success keeps completed rows and unresolved rows separate.",
        primary: "Resolve queue",
        rows: [
          ["Inspection note", "Synced", "Accepted 11:08"],
          ["Photos", "Synced", "5 files uploaded"],
          ["Signature", "Failed", "Retry keeps local file"],
          ["Supervisor comment", "Review", "Server copy changed"]
        ]
      },
      failed: {
        chip: "Sync failed",
        title: "Signature did not upload",
        detail: "Local file is preserved. Retry, export, or remove only this item.",
        status: "Failed sync is scoped to the item and does not erase accepted work.",
        primary: "Retry signature",
        rows: [
          ["Inspection note", "Synced", "Accepted 11:08"],
          ["Photos", "Synced", "5 files uploaded"],
          ["Signature", "Failed", "Network timeout"]
        ]
      },
      retrying: {
        chip: "Retrying",
        title: "Retrying failed signature",
        detail: "Attempt 2 of 3. Other synced rows will not duplicate.",
        status: "Retrying clarifies that only failed work is being sent again.",
        primary: "Cancel retry",
        rows: [
          ["Inspection note", "Synced", "No duplicate request"],
          ["Photos", "Synced", "No duplicate request"],
          ["Signature", "Retrying", "Attempt 2 of 3"]
        ]
      },
      conflict: {
        chip: "Review needed",
        title: "Server copy changed",
        detail: "Your local supervisor comment and the server comment both remain available.",
        status: "Conflict handoff preserves both copies and asks for review instead of overwriting silently.",
        primary: "Review changes",
        rows: [
          ["Local comment", "Local saved", "Created 11:06"],
          ["Server comment", "Changed", "Updated 11:07"],
          ["Resolution", "Review", "Choose or merge"]
        ]
      }
    }[mode];

    const rowTone = (status: string) => {
      const key = status.toLowerCase();
      if (key.includes("synced")) return "synced";
      if (key.includes("failed")) return "failed";
      if (key.includes("retry")) return "retrying";
      if (key.includes("review") || key.includes("changed")) return "conflict";
      if (key.includes("syncing")) return "syncing";
      return "queued";
    };

    return (
      <div className={`quality-example sync-state-good-ux is-${mode}`}>
        <div className="demo-row">
          {(["local", "queued", "syncing", "synced", "partial", "failed", "retrying", "conflict"] as const).map((item) => (
            <button
              type="button"
              key={item}
              className={mode === item ? "demo-button small primary" : "demo-button small"}
              onClick={() => setMode(item)}
            >
              {item === "local" ? "Local saved" : item === "queued" ? "Queued" : item === "syncing" ? "Syncing" : item === "synced" ? "Synced" : item === "partial" ? "Partial" : item === "failed" ? "Failed" : item === "retrying" ? "Retrying" : "Conflict"}
            </button>
          ))}
        </div>
        <p className="demo-status" aria-live="polite">{config.status}</p>
        <div className={`sync-card ${mode === "failed" || mode === "conflict" || mode === "partial" ? "warning" : ""}`}>
          <div className="sync-topline">
            <div>
              <strong>{config.title}</strong>
              <span>{config.detail}</span>
            </div>
            <span className={`sync-chip ${mode}`}>{config.chip}</span>
          </div>
          <div className="sync-progress-strip" aria-hidden="true">
            <span style={{ width: mode === "synced" ? "100%" : mode === "local" ? "8%" : mode === "queued" ? "18%" : mode === "syncing" ? "46%" : mode === "retrying" ? "58%" : "64%" }}></span>
          </div>
          <div className="sync-queue" aria-label="Sync queue">
            {config.rows.map(([item, status, detail]) => (
              <div className={`sync-row is-${rowTone(status)}`} key={`${item}-${status}`}>
                <span>{item}</span>
                <strong>{status}</strong>
                <small>{detail}</small>
              </div>
            ))}
          </div>
          <div className="sync-actions">
            <button type="button" className="demo-button small primary">{config.primary}</button>
            <button type="button" className="demo-button small">View details</button>
            <button type="button" className="demo-button small">Export local copy</button>
          </div>
        </div>
      </div>
    );
  }

  if (patternId === "conflict-state") {
    const [mode, setMode] = useState<"detected" | "compare" | "mine" | "server" | "merge" | "copy" | "resolved" | "manual">("compare");
    const config = {
      detected: {
        chip: "Conflict detected",
        title: "Supervisor comment changed elsewhere",
        detail: "Your offline edit and the server edit overlap. No value has been discarded.",
        status: "Detected state stops silent overwrite and names the affected field.",
        primary: "Review conflict",
        preview: "Choose a resolution before the report can sync."
      },
      compare: {
        chip: "Compare values",
        title: "Compare supervisor comment",
        detail: "Both values are valid and changed after the base version.",
        status: "Compare state shows sources, timestamps, and the exact overlapping value.",
        primary: "Merge manually",
        preview: "No resolved value yet."
      },
      mine: {
        chip: "Keep mine",
        title: "Preview: keep your offline edit",
        detail: "Mina's server value will be replaced for this field only.",
        status: "Keep mine states whose change will survive and whose value will be removed.",
        primary: "Save my edit",
        preview: "Valve pressure rose after restart. Schedule inspection before close."
      },
      server: {
        chip: "Keep server",
        title: "Preview: keep server value",
        detail: "Your local comment remains available until you commit or save a copy.",
        status: "Keep server preserves local work until the user confirms discard or copy.",
        primary: "Use server value",
        preview: "Valve pressure stable after restart. Inspection can happen tomorrow."
      },
      merge: {
        chip: "Manual merge",
        title: "Merged comment preview",
        detail: "Both versions are combined into one reviewed server value.",
        status: "Manual merge lets users compose the surviving value instead of picking a winner.",
        primary: "Commit merged value",
        preview: "Valve pressure rose after restart, then stabilized. Schedule inspection before close and notify Mina."
      },
      copy: {
        chip: "Save copy",
        title: "Keep both versions",
        detail: "Server value stays current; your local edit is saved as a review note.",
        status: "Save copy keeps local work recoverable without pretending the conflict is merged.",
        primary: "Save as note",
        preview: "Local edit will be attached as Field report conflict copy."
      },
      resolved: {
        chip: "Resolved",
        title: "Conflict resolved",
        detail: "Merged value committed at 11:12 with both source versions in history.",
        status: "Resolved state confirms the final value and leaves an audit trail.",
        primary: "Open history",
        preview: "Valve pressure rose after restart, then stabilized. Schedule inspection before close and notify Mina."
      },
      manual: {
        chip: "Manual tool",
        title: "Resolve in desktop editor",
        detail: "This attachment is binary and cannot be compared in the browser.",
        status: "Manual-tool state explains why the current UI cannot resolve this conflict.",
        primary: "Download both files",
        preview: "Two file versions will be downloaded for manual comparison."
      }
    }[mode];

    const rows = mode === "manual"
      ? [
        ["Your file", "report-photo-edited.jpg", "Device copy 11:06"],
        ["Server file", "report-photo.jpg", "Mina copy 11:07"]
      ]
      : [
        ["Your edit", "Valve pressure rose after restart. Schedule inspection before close.", "Device saved 11:06"],
        ["Server edit", "Valve pressure stable after restart. Inspection can happen tomorrow.", "Mina saved 11:07"]
      ];

    return (
      <div className={`quality-example conflict-state-good-ux is-${mode}`}>
        <div className="demo-row">
          {(["detected", "compare", "mine", "server", "merge", "copy", "resolved", "manual"] as const).map((item) => (
            <button
              type="button"
              key={item}
              className={mode === item ? "demo-button small primary" : "demo-button small"}
              onClick={() => setMode(item)}
            >
              {item === "detected" ? "Detected" : item === "compare" ? "Compare" : item === "mine" ? "Keep mine" : item === "server" ? "Keep server" : item === "merge" ? "Merge" : item === "copy" ? "Save copy" : item === "resolved" ? "Resolved" : "Manual tool"}
            </button>
          ))}
        </div>
        <p className="demo-status" aria-live="polite">{config.status}</p>
        <div className={`conflict-card ${mode === "resolved" ? "resolved" : mode === "manual" ? "warning" : ""}`}>
          <div className="conflict-topline">
            <div>
              <strong>{config.title}</strong>
              <span>{config.detail}</span>
            </div>
            <span className={`conflict-chip ${mode}`}>{config.chip}</span>
          </div>
          <div className="conflict-version-grid">
            {rows.map(([label, value, detail]) => (
              <div className={`conflict-value ${label.toLowerCase().includes("server") ? "theirs" : "mine"}`} key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
                <small>{detail}</small>
              </div>
            ))}
          </div>
          <div className="conflict-preview">
            <strong>Resolved preview</strong>
            <span>{config.preview}</span>
          </div>
          <div className="conflict-actions">
            <button type="button" className="demo-button small primary">{config.primary}</button>
            <button type="button" className="demo-button small">Previous conflict</button>
            <button type="button" className="demo-button small">Next conflict</button>
          </div>
        </div>
      </div>
    );
  }

  if (patternId === "permission-denied-state") {
    const [mode, setMode] = useState<"denied" | "readonly" | "action" | "request" | "pending" | "rejected" | "approved" | "switch">("denied");
    const config = {
      denied: {
        chip: "Access needed",
        title: "You need Finance viewer access",
        detail: "Signed in as alex@northwind.example. This report is restricted to Finance viewers.",
        status: "Denied state explains the boundary, account, and request path without pretending the report failed to load.",
        primary: "Request access",
        secondary: "Switch account",
        role: "Analyst member",
        need: "Finance viewer"
      },
      readonly: {
        chip: "Read-only",
        title: "You can view, but not edit",
        detail: "Finance viewer access allows reading the report. Editor access is required to change forecast values.",
        status: "Read-only state keeps allowed viewing available while naming the blocked edit permission.",
        primary: "Request editor access",
        secondary: "Keep reading",
        role: "Finance viewer",
        need: "Finance editor"
      },
      action: {
        chip: "Admin required",
        title: "Publish is restricted",
        detail: "Only Finance admins can publish the report to the executive workspace.",
        status: "Action-level denial scopes the missing permission to Publish instead of blocking the whole page.",
        primary: "Contact Finance admin",
        secondary: "Save draft copy",
        role: "Finance editor",
        need: "Finance admin"
      },
      request: {
        chip: "Request access",
        title: "Ask Priya for viewer access",
        detail: "Your message and account will be sent to the report owner for approval.",
        status: "Request state captures the requested role and reason before sending it to the owner.",
        primary: "Send request",
        secondary: "Cancel",
        role: "Analyst member",
        need: "Finance viewer"
      },
      pending: {
        chip: "Pending",
        title: "Request sent to Priya Raman",
        detail: "Sent today at 10:16. You will be notified when the owner approves or declines it.",
        status: "Pending state prevents duplicate requests and tells users where the decision sits.",
        primary: "View request",
        secondary: "Cancel request",
        role: "Request pending",
        need: "Owner approval"
      },
      rejected: {
        chip: "Declined",
        title: "Access request declined",
        detail: "Finance Ops declined viewer access. Contact your manager if this report is required.",
        status: "Declined state separates owner decision from system failure and gives a safe escalation route.",
        primary: "Contact manager",
        secondary: "Open dashboards",
        role: "Not granted",
        need: "Manager approval"
      },
      approved: {
        chip: "Approved",
        title: "Finance viewer access approved",
        detail: "Refresh or reopen the report to use the new permission.",
        status: "Approved state tells users how to retry after the authorization boundary changes.",
        primary: "Open report",
        secondary: "View request",
        role: "Finance viewer",
        need: "Granted"
      },
      switch: {
        chip: "Wrong account",
        title: "This report is shared with another account",
        detail: "northwind-finance@example.com has access. Switch accounts to continue.",
        status: "Switch-account state avoids unnecessary requests when another signed-in identity already has access.",
        primary: "Switch account",
        secondary: "Request for this account",
        role: "alex@northwind.example",
        need: "northwind-finance@example.com"
      }
    }[mode];

    return (
      <div className={`quality-example permission-state-good-ux is-${mode}`}>
        <div className="demo-row">
          {(["denied", "readonly", "action", "request", "pending", "rejected", "approved", "switch"] as const).map((item) => (
            <button
              type="button"
              key={item}
              className={mode === item ? "demo-button small primary" : "demo-button small"}
              onClick={() => setMode(item)}
            >
              {item === "denied" ? "Denied" : item === "readonly" ? "Read-only" : item === "action" ? "Action denied" : item === "request" ? "Request" : item === "pending" ? "Pending" : item === "rejected" ? "Rejected" : item === "approved" ? "Approved" : "Switch account"}
            </button>
          ))}
        </div>
        <p className="demo-status" aria-live="polite">{config.status}</p>
        <div className={`permission-card ${mode === "approved" ? "approved" : mode === "pending" || mode === "action" ? "warning" : mode === "rejected" ? "bad" : ""}`}>
          <div className="permission-topline">
            <div>
              <strong>{config.title}</strong>
              <span>{config.detail}</span>
            </div>
            <span className={`permission-chip ${mode}`}>{config.chip}</span>
          </div>
          <div className="permission-grid">
            <div className="permission-row">
              <span>Current state</span>
              <strong>{config.role}</strong>
              <small>Signed in workspace: Northwind Sales Ops.</small>
            </div>
            <div className="permission-row">
              <span>Needed next</span>
              <strong>{config.need}</strong>
              <small>{mode === "switch" ? "Switching account returns to this report." : mode === "action" ? "The draft remains editable." : "Owner path is visible because the report title is safe to reveal."}</small>
            </div>
          </div>
          <div className="permission-request-box">
            <strong>{mode === "pending" ? "Request status" : mode === "request" ? "Reason to owner" : mode === "readonly" ? "Allowed fallback" : "Access note"}</strong>
            <span>{mode === "pending" ? "Request ID ACC-2048 is waiting for owner review." : mode === "request" ? "Need to reconcile Q2 renewal forecast before Friday review." : mode === "readonly" ? "Reading, comments, and export are available; edits and publish are blocked." : mode === "rejected" ? "The decision is not a page failure; retrying will not change access." : "Owner: Priya Raman, Finance Ops."}</span>
          </div>
          <div className="permission-actions">
            <button type="button" className="demo-button small primary">{config.primary}</button>
            <button type="button" className="demo-button small">{config.secondary}</button>
            <button type="button" className="demo-button small">Open allowed area</button>
          </div>
        </div>
      </div>
    );
  }

  if (patternId === "permission-recovery") {
    type RecoveryMode = "start" | "role" | "reason" | "sent" | "pending" | "approved" | "declined" | "switch" | "policy" | "resumed";
    const [mode, setMode] = useState<RecoveryMode>("start");
    const [status, setStatus] = useState("Access is blocked; choose a recovery path before retrying the report.");
    const config: Record<RecoveryMode, { chip: string; title: string; detail: string; role: string; next: string; note: string; card: string }> = {
      start: {
        chip: "Blocked",
        title: "Recover access to Quarterly revenue report",
        detail: "Signed in as alex@northwind.example. The original report link is preserved.",
        role: "Analyst member",
        next: meta.options[0],
        note: "Choose a role request, switch account, or open an allowed dashboard.",
        card: ""
      },
      role: {
        chip: "Role",
        title: `Request ${meta.options[0]}`,
        detail: "Viewer access is enough for this report; Editor is not requested because it is not needed.",
        role: meta.options[0],
        next: "Reason required",
        note: "Least-privilege role selection prevents asking for more access than the task needs.",
        card: "warning"
      },
      reason: {
        chip: "Reason",
        title: "Explain why access is needed",
        detail: "Need Q2 renewal forecast before Friday review.",
        role: meta.options[0],
        next: meta.options[2],
        note: "The owner receives account, requested role, report target, and reason.",
        card: "warning"
      },
      sent: {
        chip: "Sent",
        title: `Request ${meta.options[1]} sent`,
        detail: `Sent to ${meta.options[2]} today at 10:16 with requested role and reason.`,
        role: "Request recorded",
        next: "Owner review",
        note: "The request now has an ID and cannot be mistaken for approval.",
        card: "warning"
      },
      pending: {
        chip: "Pending",
        title: `${meta.options[1]} is waiting for owner review`,
        detail: "A duplicate request reopens this status instead of notifying the owner again.",
        role: "Pending owner decision",
        next: "Notify when decided",
        note: "Pending state prevents duplicate requests and keeps fallback work available.",
        card: "warning"
      },
      approved: {
        chip: "Approved",
        title: `${meta.options[0]} approved`,
        detail: "The permission grant is active. The report can now be retried from the same workflow.",
        role: meta.options[0],
        next: meta.options[4],
        note: "Retry is now safe because authorization changed.",
        card: "approved"
      },
      declined: {
        chip: "Declined",
        title: "Access request declined",
        detail: "Finance Ops declined access. Contact your manager or use the allowed dashboard.",
        role: "Not granted",
        next: "Escalate or fallback",
        note: "Decline is not a load failure; repeating retry will not help.",
        card: "bad"
      },
      switch: {
        chip: "Wrong account",
        title: "Another signed-in account already has access",
        detail: "northwind-finance@example.com can open this report. Switching returns here.",
        role: meta.options[3],
        next: "Switch account",
        note: "Wrong-account recovery avoids an unnecessary owner request.",
        card: "warning"
      },
      policy: {
        chip: "Policy",
        title: "Organization policy blocks owner approval",
        detail: "External sharing is disabled for Finance reports. Ask an admin for an exception.",
        role: "Policy block",
        next: "Admin escalation",
        note: "The workflow stops impossible owner requests and routes to policy escalation.",
        card: "bad"
      },
      resumed: {
        chip: "Open",
        title: "Report opened after access changed",
        detail: "The original report link, request history, and approval state remain available.",
        role: meta.options[0],
        next: "Recovered",
        note: "Recovery completes by returning to the blocked task, not by landing on a generic dashboard.",
        card: "approved"
      }
    };
    const current = config[mode];

    function choose(next: RecoveryMode, nextStatus: string) {
      setMode(next);
      setStatus(nextStatus);
    }

    return (
      <div className={`quality-example permission-recovery-good-ux is-${mode}`}>
        <div className="demo-row permission-recovery-controls">
          <button type="button" className={mode === "start" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("start", "Access is blocked; choose a recovery path before retrying the report.")}>Start</button>
          <button type="button" className={mode === "role" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("role", "Finance viewer selected as the least-privilege role for the report.")}>Choose role</button>
          <button type="button" className={mode === "reason" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("reason", "Reason captured for the owner with the original report attached.")}>Add reason</button>
          <button type="button" className={mode === "sent" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("sent", `${meta.options[1]} sent to ${meta.options[2]}; access is still pending.`)}>Send request</button>
          <button type="button" className={mode === "pending" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("pending", "Pending request reopened; duplicate owner notification avoided.")}>Pending</button>
          <button type="button" className={mode === "approved" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("approved", "Owner approved access; retry is now allowed.")}>Approved</button>
          <button type="button" className={mode === "declined" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("declined", "Owner declined access; fallback and escalation paths remain.")}>Declined</button>
          <button type="button" className={mode === "switch" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("switch", "Switching account will return to the blocked report.")}>Switch account</button>
          <button type="button" className={mode === "policy" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("policy", "Owner request is blocked by policy; route to admin exception.")}>Policy block</button>
          <button type="button" className={mode === "resumed" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("resumed", "Original report opened after permission recovery completed.")} disabled={mode !== "approved" && mode !== "resumed"}>Retry after grant</button>
        </div>
        <div className={`permission-card ${current.card}`}>
          <div className="permission-topline">
            <div>
              <strong>{current.title}</strong>
              <span>{current.detail}</span>
            </div>
            <span className={`permission-chip ${mode}`}>{current.chip}</span>
          </div>
          <div className="permission-grid">
            <div className="permission-row">
              <span>Current recovery state</span>
              <strong>{current.role}</strong>
              <small>Signed in workspace: Northwind Sales Ops.</small>
            </div>
            <div className="permission-row">
              <span>Next safe action</span>
              <strong>{current.next}</strong>
              <small>{current.note}</small>
            </div>
          </div>
          <div className="permission-recovery-timeline" aria-label="Access recovery progress">
            <span className={mode === "start" || mode === "role" || mode === "reason" ? "is-current" : "is-done"}>Prepare</span>
            <span className={mode === "sent" || mode === "pending" ? "is-current" : mode === "approved" || mode === "declined" || mode === "resumed" ? "is-done" : ""}>Owner review</span>
            <span className={mode === "approved" || mode === "declined" || mode === "policy" ? "is-current" : mode === "resumed" ? "is-done" : ""}>Decision</span>
            <span className={mode === "resumed" ? "is-done" : ""}>Resume task</span>
          </div>
          <div className="permission-request-box">
            <strong>{mode === "pending" ? "Duplicate protection" : mode === "approved" || mode === "resumed" ? "Resume path" : mode === "declined" || mode === "policy" ? "Escalation" : "Request packet"}</strong>
            <span>{mode === "pending" ? `${meta.options[1]} remains pending with ${meta.options[2]}.` : mode === "approved" || mode === "resumed" ? `Return to ${meta.subject} with ${meta.options[0]} granted.` : mode === "declined" ? "Use allowed dashboard or contact manager; do not keep retrying the denied report." : mode === "policy" ? "Owner cannot grant this; send policy exception to Finance admins." : `Requester ${meta.options[3]}, role ${meta.options[0]}, owner ${meta.options[2]}, reason included.`}</span>
          </div>
          <div className="permission-actions">
            <button type="button" className="demo-button small primary" disabled={mode === "declined" || mode === "policy"}>{mode === "approved" || mode === "resumed" ? meta.options[4] : mode === "pending" ? "View request" : "Continue recovery"}</button>
            <button type="button" className="demo-button small">{mode === "switch" ? "Switch now" : mode === "policy" ? "Contact admin" : "Open allowed dashboard"}</button>
          </div>
        </div>
        <p className="demo-status" aria-live="polite">{status}</p>
      </div>
    );
  }

  if (patternId === "service-unavailable-page") {
    const [mode, setMode] = useState<"planned" | "unexpected" | "saved" | "unsaved" | "partial" | "closed" | "status" | "urgent">("planned");
    const config = {
      planned: {
        chip: "Maintenance",
        title: "Benefits application service unavailable",
        detail: "Planned maintenance from 22:00 to 01:00 today.",
        status: "Planned maintenance states the closure window and when users should return.",
        primary: "Check service status",
        secondary: "Return after 01:00",
        timing: "Use this service after 01:00",
        work: "Draft answers saved for 30 days"
      },
      unexpected: {
        chip: "Incident",
        title: "We cannot load the benefits service right now",
        detail: "We are investigating an unexpected problem. Reference INC-82731 if you contact support.",
        status: "Unexpected outage includes incident context and a support-safe reference instead of a bare failure.",
        primary: "View incident updates",
        secondary: "Contact support",
        timing: "Next update by 10:45",
        work: "Do not resubmit payments until status changes"
      },
      saved: {
        chip: "Draft saved",
        title: "Service closed after saving your answers",
        detail: "Your application answers were saved at 21:58 before maintenance started.",
        status: "Saved-work state tells users what is retained and how long they can recover it.",
        primary: "Continue later",
        secondary: "Download receipt",
        timing: "Continue after 01:00",
        work: "Draft BEN-2048 retained for 30 days"
      },
      unsaved: {
        chip: "Start again",
        title: "The service closed before answers were saved",
        detail: "We could not save the page you were editing. Start a new application when the service reopens.",
        status: "Unsaved-work state avoids a false saved claim and prepares users to restart.",
        primary: "Set reminder",
        secondary: "Call helpline",
        timing: "Reopens at 01:00",
        work: "Current page answers were not saved"
      },
      partial: {
        chip: "Partial outage",
        title: "Applications are closed, account updates still work",
        detail: "You cannot submit a new claim, but you can update contact details and read messages.",
        status: "Partial outage names blocked tasks and allowed tasks separately.",
        primary: "Update contact details",
        secondary: "Read messages",
        timing: "Application submissions resume at 01:00",
        work: "Account area remains available"
      },
      closed: {
        chip: "Closed",
        title: "The old claim renewal service has closed",
        detail: "Use the new renewal service for claims started after 1 June 2026.",
        status: "Permanent closure sends users to the replacement route instead of asking them to retry.",
        primary: "Use new service",
        secondary: "Contact legacy support",
        timing: "Old service is permanently closed",
        work: "Previous reports remain in archived records"
      },
      status: {
        chip: "Status update",
        title: "Benefits service status",
        detail: "Engineers restored sign in. Payment submission is still paused while queued requests are checked.",
        status: "Status-update state keeps recovery timing and affected capabilities current.",
        primary: "Refresh status",
        secondary: "Subscribe to updates",
        timing: "Updated 10:32, next update 11:00",
        work: "Saved drafts and uploaded evidence are intact"
      },
      urgent: {
        chip: "Urgent route",
        title: "Use another channel for urgent changes",
        detail: "If your change affects today's payment, call the Benefits helpline before 17:00.",
        status: "Urgent fallback handles time-sensitive needs while the online service is unavailable.",
        primary: "Call helpline",
        secondary: "Download emergency form",
        timing: "Phone support open until 17:00",
        work: "Online form submissions are paused"
      }
    }[mode];

    return (
      <div className={`quality-example service-unavailable-page-good-ux is-${mode}`}>
        <div className="demo-row">
          {(["planned", "unexpected", "saved", "unsaved", "partial", "closed", "status", "urgent"] as const).map((item) => (
            <button
              type="button"
              key={item}
              className={mode === item ? "demo-button small primary" : "demo-button small"}
              onClick={() => setMode(item)}
            >
              {item === "planned" ? "Planned" : item === "unexpected" ? "Unexpected" : item === "saved" ? "Draft saved" : item === "unsaved" ? "Not saved" : item === "partial" ? "Partial" : item === "closed" ? "Closed" : item === "status" ? "Status updates" : "Urgent support"}
            </button>
          ))}
        </div>
        <p className="demo-status" aria-live="polite">{config.status}</p>
        <div className={`service-unavailable-card ${mode === "closed" ? "closed" : mode === "unexpected" || mode === "unsaved" ? "warning" : ""}`}>
          <div className="service-unavailable-topline">
            <div>
              <strong>{config.title}</strong>
              <span>{config.detail}</span>
            </div>
            <span className={`service-unavailable-chip ${mode}`}>{config.chip}</span>
          </div>
          <div className="service-unavailable-grid">
            <div className="service-unavailable-row">
              <span>Timing</span>
              <strong>{config.timing}</strong>
              <small>{mode === "unexpected" ? "Retrying before the update is unlikely to work." : "Use this timing before trying the online route again."}</small>
            </div>
            <div className="service-unavailable-row">
              <span>Work status</span>
              <strong>{config.work}</strong>
              <small>{mode === "unsaved" ? "The page says this directly instead of implying recovery." : "Users know whether to continue, wait, or start again."}</small>
            </div>
          </div>
          <div className="service-unavailable-support">
            <strong>{mode === "closed" ? "Replacement route" : mode === "urgent" ? "Urgent support" : "Support and updates"}</strong>
            <span>{mode === "closed" ? "The new service accepts renewals and support can retrieve archived reports." : mode === "urgent" ? "The phone team can record same-day payment changes while online submissions are paused." : "Status page and helpline stay available while the service is closed."}</span>
          </div>
          <div className="service-unavailable-actions">
            <button type="button" className="demo-button small primary">{config.primary}</button>
            <button type="button" className="demo-button small">{config.secondary}</button>
            <button type="button" className="demo-button small">Return to allowed services</button>
          </div>
        </div>
      </div>
    );
  }

  if (patternId === "page-not-found-page") {
    const [mode, setMode] = useState<"typed" | "moved" | "expired" | "private" | "search" | "report" | "popular" | "signin">("typed");
    const config = {
      typed: {
        chip: "Typed URL",
        title: "Page not found",
        detail: "Benefits service could not find /benefits/chagne-bank-details.",
        status: "Typed-address state tells users to check the full address and gives a search route.",
        primary: "Search benefits",
        secondary: "Start benefits service",
        cause: "The address may be mistyped",
        recover: "Check spelling or search this service",
        privacy: "Path is safe to show because it is a public service route",
        query: "change bank details"
      },
      moved: {
        chip: "Moved page",
        title: "This page has moved",
        detail: "The old bank-details guidance was replaced by Update payment details.",
        status: "Moved-page state points to the closest known replacement instead of dumping users on a homepage.",
        primary: "Open replacement page",
        secondary: "Report old link",
        cause: "The page was removed or renamed",
        recover: "Use the replacement topic or search current guidance",
        privacy: "No sensitive account details are displayed",
        query: "payment details"
      },
      expired: {
        chip: "Expired link",
        title: "This link no longer opens that step",
        detail: "The confirmation email link expired after your application moved forward.",
        status: "Expired deep-link state routes signed-in users to the current task instead of retrying the old URL.",
        primary: "Go to current application",
        secondary: "Send a new link",
        cause: "The deep link expired",
        recover: "Continue from the account dashboard",
        privacy: "Only account-safe task context is shown",
        query: "current application"
      },
      private: {
        chip: "No disclosure",
        title: "Page not found",
        detail: "We cannot find a page at this address.",
        status: "Private-resource state avoids revealing whether a protected report exists.",
        primary: "Go to dashboard",
        secondary: "Switch account",
        cause: "The page may not exist or may not be available to this account",
        recover: "Use dashboard navigation or sign in with another account",
        privacy: "No record name, owner, or ID is exposed",
        query: ""
      },
      search: {
        chip: "Search recovery",
        title: "Search for the page you need",
        detail: "Try a few words from the page or task name.",
        status: "Search recovery turns a missing route into a useful discovery path when search exists.",
        primary: "Search",
        secondary: "Browse topics",
        cause: "The old URL did not resolve",
        recover: "Search suggests current matching pages",
        privacy: "Search results exclude private records",
        query: "bank details"
      },
      report: {
        chip: "Report link",
        title: "Help us fix this link",
        detail: "If you selected a link or button, tell us where it appeared.",
        status: "Report-link state gives support enough context to repair stale links and letters.",
        primary: "Report broken link",
        secondary: "Contact support",
        cause: "A link or button may point to a missing page",
        recover: "Send the referring page and missing path to the service team",
        privacy: "Sensitive query values are removed before reporting",
        query: "where did this link appear?"
      },
      popular: {
        chip: "Common tasks",
        title: "Page not found",
        detail: "The page is not available, but these tasks are still current.",
        status: "Popular-link state helps broad public pages recover without pretending to know the exact target.",
        primary: "View popular tasks",
        secondary: "Search site",
        cause: "The target may have been removed",
        recover: "Use common current services or topic navigation",
        privacy: "Only public task links are shown",
        query: "benefits tasks"
      },
      signin: {
        chip: "Signed-in return",
        title: "We could not reopen that page",
        detail: "Your signed-in session is active, but the old return path is not available.",
        status: "Signed-in recovery returns users to a stable dashboard and current tasks.",
        primary: "Go to account dashboard",
        secondary: "View messages",
        cause: "The return path is stale",
        recover: "Current applications and messages remain available",
        privacy: "No old route state is shown until the dashboard checks permissions",
        query: "my applications"
      }
    }[mode];

    return (
      <div className={`quality-example page-not-found-page-good-ux is-${mode}`}>
        <div className="demo-row">
          {(["typed", "moved", "expired", "private", "search", "report", "popular", "signin"] as const).map((item) => (
            <button
              type="button"
              key={item}
              className={mode === item ? "demo-button small primary" : "demo-button small"}
              onClick={() => setMode(item)}
            >
              {item === "typed" ? "Typed URL" : item === "moved" ? "Moved page" : item === "expired" ? "Expired link" : item === "private" ? "Private" : item === "search" ? "Search" : item === "report" ? "Report link" : item === "popular" ? "Popular links" : "Signed-in return"}
            </button>
          ))}
        </div>
        <p className="demo-status" aria-live="polite">{config.status}</p>
        <div className={`not-found-card ${mode === "private" ? "private" : mode === "moved" || mode === "expired" || mode === "signin" ? "routed" : ""}`}>
          <div className="not-found-topline">
            <div>
              <strong>{config.title}</strong>
              <span>{config.detail}</span>
            </div>
            <span className={`not-found-chip ${mode}`}>{config.chip}</span>
          </div>
          <div className="not-found-grid">
            <div className="not-found-row">
              <span>Likely cause</span>
              <strong>{config.cause}</strong>
              <small>{mode === "typed" ? "Check that the address is complete and spelled correctly." : "The copy names the route condition without blaming the user."}</small>
            </div>
            <div className="not-found-row">
              <span>Recovery</span>
              <strong>{config.recover}</strong>
              <small>{config.privacy}</small>
            </div>
          </div>
          <div className="not-found-search" role="search">
            <label htmlFor={`not-found-query-${mode}`}>{mode === "report" ? "Broken link details" : "Search this service"}</label>
            <div>
              <input id={`not-found-query-${mode}`} value={config.query} readOnly aria-label={mode === "report" ? "Broken link details" : "Search query"} />
              <button type="button" className="demo-button small primary">{mode === "report" ? "Send" : "Search"}</button>
            </div>
          </div>
          <div className="not-found-link-list" aria-label="Recovery links">
            <a href="#primary">{config.primary}</a>
            <a href="#secondary">{config.secondary}</a>
            <a href="#report">{mode === "private" ? "Use another account" : "Report this broken link"}</a>
          </div>
        </div>
      </div>
    );
  }

  if (patternId === "step-progress") {
    const [mode, setMode] = useState<"current" | "waiting" | "blocked" | "failed" | "skipped" | "inserted" | "compact">("blocked");
    const baseSteps = [
      { label: "Profile", status: "Complete", tone: "complete", detail: "Saved at 14:20" },
      { label: "Documents", status: mode === "failed" ? "Failed" : mode === "waiting" ? "Waiting" : mode === "current" ? "Current" : "Complete", tone: mode === "failed" ? "failed" : mode === "waiting" ? "waiting" : mode === "current" ? "current" : "complete", detail: mode === "failed" ? "Certificate rejected" : mode === "waiting" ? "Scan in progress" : mode === "current" ? "Upload certificate" : "Accepted" },
      ...(mode === "inserted" ? [{ label: "Tax details", status: "Required", tone: "current", detail: "Added because vendor is self-employed" }] : []),
      { label: "Compliance", status: mode === "blocked" ? "Blocked" : mode === "skipped" ? "Skipped" : mode === "inserted" ? "Waiting" : "Pending", tone: mode === "blocked" ? "blocked" : mode === "skipped" ? "skipped" : mode === "inserted" ? "waiting" : "pending", detail: mode === "blocked" ? "Needs accepted documents" : mode === "skipped" ? "Not required for internal vendor" : mode === "inserted" ? "Starts after tax details" : "Cannot start yet" },
      { label: "Review", status: mode === "failed" ? "Blocked" : "Pending", tone: mode === "failed" ? "blocked" : "pending", detail: mode === "failed" ? "Fix document error first" : "Not available yet" },
      { label: "Finish", status: "Pending", tone: "pending", detail: "Final confirmation locked" }
    ];
    const currentStep = baseSteps.find((step) => step.tone === "current") ?? baseSteps.find((step) => step.tone === "blocked" || step.tone === "failed" || step.tone === "waiting") ?? baseSteps[1];
    const copy = mode === "current"
      ? "Documents is current and Profile is complete because the saved proof event exists."
      : mode === "waiting"
        ? "Documents waits for a scan, so it is not marked complete before acceptance."
        : mode === "blocked"
          ? "Compliance is blocked with a reason while Review and Finish remain unavailable."
          : mode === "failed"
            ? "Document failure stays attached to the owning stage and exposes retry behavior."
            : mode === "skipped"
              ? "Skipped Compliance remains visible so omission is deliberate, not missing work."
              : mode === "inserted"
                ? "A dependent Tax details stage is inserted with a reason instead of silently changing the count."
                : "Compact mode preserves current step, completed count, and the next blocked condition.";
    const completeCount = baseSteps.filter((step) => step.tone === "complete").length;

    return (
      <div className={`quality-example step-progress-good-ux is-${mode}`}>
        <div className="demo-row">
          {(["current", "waiting", "blocked", "failed", "skipped", "inserted", "compact"] as const).map((item) => (
            <button
              type="button"
              key={item}
              className={mode === item ? "demo-button small primary" : "demo-button small"}
              onClick={() => setMode(item)}
            >
              {item === "current" ? "Current" : item === "waiting" ? "Waiting" : item === "blocked" ? "Blocked" : item === "failed" ? "Failed" : item === "skipped" ? "Skipped" : item === "inserted" ? "Inserted" : "Compact"}
            </button>
          ))}
        </div>
        <p className="demo-status" aria-live="polite">{copy}</p>
        <div className={`step-progress-card ${mode === "compact" ? "compact" : ""}`}>
          {mode === "compact" ? (
            <div className="step-progress-compact" role="status">
              <strong>{completeCount} of {baseSteps.length} complete</strong>
              <span>Current: {currentStep.label}. Next unavailable: Compliance needs accepted documents.</span>
              <button type="button" className="demo-button small">All steps</button>
            </div>
          ) : (
            <ol className="step-progress-list" aria-label="Vendor onboarding progress">
              {baseSteps.map((step, index) => (
                <li className={`is-${step.tone}`} aria-current={step.tone === "current" ? "step" : undefined} key={`${step.label}-${index}`}>
                  <span aria-hidden="true">{step.tone === "complete" ? "✓" : step.tone === "failed" ? "!" : step.tone === "skipped" ? "-" : index + 1}</span>
                  <strong>{step.label}</strong>
                  <em>{step.status}</em>
                  <small>{step.detail}</small>
                </li>
              ))}
            </ol>
          )}
          <div className={`step-progress-summary ${mode === "failed" ? "failed" : mode === "blocked" ? "blocked" : ""}`}>
            <strong>{mode === "compact" ? "Compact status remains truthful" : `${currentStep.label}: ${currentStep.status}`}</strong>
            <span>{mode === "failed" ? "Retry upload keeps Review blocked until the document is accepted." : mode === "inserted" ? "Tax details is required because the vendor type changed." : "Status comes from saved answers and system checks, not page visits."}</span>
          </div>
          <div className="demo-row">
            <button type="button" className="demo-button small primary">{mode === "failed" ? "Retry upload" : mode === "blocked" ? "Upload certificate" : "Continue current step"}</button>
            <button type="button" className="demo-button small">View details</button>
          </div>
        </div>
      </div>
    );
  }

  if (patternId === "meter") {
    const [mode, setMode] = useState<"healthy" | "warning" | "critical" | "over" | "risk" | "battery" | "unavailable">("critical");
    const config = {
      healthy: {
        label: "Account storage",
        detail: "42 GB of 100 GB used",
        value: 42,
        max: 100,
        chip: "Healthy",
        tone: "healthy",
        text: "42 GB of 100 GB used, healthy range",
        scale: ["0 GB", "70 GB warning", "90 GB critical", "100 GB"],
        copy: "Healthy storage is below warning threshold and the meter stays read-only.",
        action: "View files"
      },
      warning: {
        label: "Account storage",
        detail: "74 GB of 100 GB used",
        value: 74,
        max: 100,
        chip: "Warning",
        tone: "warning",
        text: "74 GB of 100 GB used, warning range",
        scale: ["0 GB", "70 GB warning", "90 GB critical", "100 GB"],
        copy: "Warning storage labels the threshold before uploads are blocked.",
        action: "Clean up files"
      },
      critical: {
        label: "Account storage",
        detail: "86 GB of 100 GB used",
        value: 86,
        max: 100,
        chip: "Critical",
        tone: "critical",
        text: "86 GB of 100 GB used, critical range",
        scale: ["0 GB", "70 GB warning", "90 GB critical", "100 GB"],
        copy: "Critical storage names the resource, max, unit, and action before the account reaches the limit.",
        action: "Manage storage"
      },
      over: {
        label: "Account storage",
        detail: "103 GB of 100 GB used",
        value: 100,
        max: 100,
        chip: "Over limit",
        tone: "critical",
        text: "103 GB of 100 GB used, over storage limit",
        scale: ["0 GB", "70 GB warning", "90 GB critical", "100 GB limit"],
        copy: "Over-limit state clamps the visual meter but keeps value text honest about the actual value.",
        action: "Upgrade plan"
      },
      risk: {
        label: "Fraud risk score",
        detail: "22 of 100, lower is better",
        value: 22,
        max: 100,
        chip: "Low risk",
        tone: "healthy",
        text: "Risk score 22 out of 100, lower is better",
        scale: ["0 best", "35 review", "70 high risk", "100 worst"],
        copy: "Low-better meters state the optimum direction so high color rules are not reused incorrectly.",
        action: "View factors"
      },
      battery: {
        label: "Device battery",
        detail: "14%, about 45 minutes remaining",
        value: 14,
        max: 100,
        chip: "Low",
        tone: "warning",
        text: "Battery 14 percent, about 45 minutes remaining",
        scale: ["0%", "20% low", "80% charged", "100%"],
        copy: "Battery value text includes estimated time because percent alone is incomplete.",
        action: "Turn on saver"
      },
      unavailable: {
        label: "Account storage",
        detail: "Storage reading unavailable",
        value: 0,
        max: 100,
        chip: "Unavailable",
        tone: "neutral",
        text: "Storage reading unavailable",
        scale: ["No current value", "Refresh to retry"],
        copy: "When the value source is missing, the meter is removed instead of showing a guessed gauge.",
        action: "Refresh reading"
      }
    }[mode];
    const width = mode === "unavailable" ? 0 : Math.min(100, (config.value / config.max) * 100);

    return (
      <div className={`quality-example meter-good-ux is-${mode}`}>
        <div className="demo-row">
          {(["healthy", "warning", "critical", "over", "risk", "battery", "unavailable"] as const).map((item) => (
            <button
              type="button"
              key={item}
              className={mode === item ? "demo-button small primary" : "demo-button small"}
              onClick={() => setMode(item)}
            >
              {item === "healthy" ? "Healthy" : item === "warning" ? "Warning" : item === "critical" ? "Critical" : item === "over" ? "Over limit" : item === "risk" ? "Low-better" : item === "battery" ? "Battery" : "Unavailable"}
            </button>
          ))}
        </div>
        <p className="demo-status" aria-live="polite">{config.copy}</p>
        <div className={`meter-card ${config.tone}`}>
          <div className="meter-label-row">
            <div>
              <strong id="meter-ux-label">{config.label}</strong>
              <span>{config.detail}</span>
            </div>
            <em className={`meter-chip ${config.tone}`}>{config.chip}</em>
          </div>
          {mode === "unavailable" ? (
            <div className="meter-unavailable" role="status">
              <strong>Measurement unavailable</strong>
              <span>Last reading expired. No gauge is shown without a current value.</span>
            </div>
          ) : (
            <div
              className="meter-track"
              role="meter"
              aria-labelledby="meter-ux-label"
              aria-valuemin={0}
              aria-valuemax={config.max}
              aria-valuenow={Math.min(config.value, config.max)}
              aria-valuetext={config.text}
            >
              <span style={{ width: `${width}%` }}></span>
            </div>
          )}
          <div className="meter-scale">
            {config.scale.map((item) => <span key={item}>{item}</span>)}
          </div>
          <button type="button" className="demo-button small primary">{config.action}</button>
        </div>
      </div>
    );
  }

  if (patternId === "progress-bar") {
    const [mode, setMode] = useState<"start" | "partial" | "complete" | "error" | "cancelled" | "background">("partial");
    const progress = mode === "start" ? 12 : mode === "partial" ? 64 : mode === "complete" ? 100 : mode === "error" ? 72 : mode === "background" ? 42 : 0;
    const helper = mode === "start"
      ? "6 of 50 MB transferred"
      : mode === "partial"
        ? "32 of 50 MB transferred"
        : mode === "complete"
          ? "Upload and server scan accepted"
          : mode === "error"
            ? "36 of 50 MB transferred before the network failed"
            : mode === "background"
              ? "504 of 1200 rows validated in job IMP-2048"
              : "Upload cancelled before commit";
    const status = mode === "start"
      ? "Progress starts after transfer begins and reports the measured file bytes."
      : mode === "partial"
        ? "The user sees the current percent, transferred amount, remaining estimate, and cancel action."
        : mode === "complete"
          ? "Completion appears only after transfer and server acceptance finish."
          : mode === "error"
            ? "The bar stops at the retained value and hands off to retry or cancel recovery."
            : mode === "background"
              ? "Long validation can move to background without hiding the job reference."
              : "Cancellation clears the active progress and explains what remains.";

    return (
      <div className={`quality-example progress-bar-good-ux is-${mode}`}>
        <div className="demo-row">
          {(["start", "partial", "complete", "error", "cancelled", "background"] as const).map((item) => (
            <button
              type="button"
              key={item}
              className={mode === item ? "demo-button small primary" : "demo-button small"}
              onClick={() => setMode(item)}
            >
              {item === "start" ? "12%" : item === "partial" ? "64%" : item === "complete" ? "Complete" : item === "error" ? "Error" : item === "cancelled" ? "Cancel" : "Background"}
            </button>
          ))}
        </div>
        <p className="demo-status" aria-live="polite">{status}</p>
        <div className={`progress-bar-job-card ${mode}`} aria-busy={mode === "start" || mode === "partial" || mode === "background"} aria-describedby="progress-bar-ux-helper">
          <div className="progress-bar-card-head">
            <div>
              <strong>{mode === "background" ? "Import validation IMP-2048" : "Uploading evidence.zip"}</strong>
              <span>{helper}</span>
            </div>
            <span className={mode === "error" ? "progress-bar-value error" : mode === "complete" ? "progress-bar-value success" : "progress-bar-value"}>{progress}%</span>
          </div>
          {mode === "cancelled" ? (
            <div className="progress-bar-terminal cancelled">
              <strong>Upload cancelled</strong>
              <span>evidence.zip was not attached. Other form answers remain saved.</span>
            </div>
          ) : (
            <div
              className="progress-bar-track"
              role="progressbar"
              aria-label={mode === "background" ? "Validating import IMP-2048" : "Uploading evidence.zip"}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              aria-valuetext={`${progress} percent, ${helper}`}
            >
              <span style={{ width: `${progress}%` }}></span>
            </div>
          )}
          {mode !== "cancelled" && (
            <div className="progress-bar-helper" id="progress-bar-ux-helper">
              <span>{mode === "complete" ? "Complete" : mode === "error" ? "Network failed" : mode === "background" ? "Running in background" : "Uploading"}</span>
              <span>{mode === "partial" ? "About 14 seconds left" : mode === "start" ? "Estimating time left" : mode === "complete" ? "Receipt EV-2048 ready" : mode === "error" ? "Retry keeps the selected file" : mode === "background" ? "Return from job history" : ""}</span>
            </div>
          )}
          <div className="progress-bar-actions">
            {mode === "complete" ? (
              <button type="button" className="demo-button small primary">View receipt</button>
            ) : mode === "error" ? (
              <>
                <button type="button" className="demo-button small primary" onClick={() => setMode("partial")}>Retry upload</button>
                <button type="button" className="demo-button small" onClick={() => setMode("cancelled")}>Cancel</button>
              </>
            ) : mode === "cancelled" ? (
              <button type="button" className="demo-button small primary" onClick={() => setMode("start")}>Choose file again</button>
            ) : mode === "background" ? (
              <button type="button" className="demo-button small primary">Open job history</button>
            ) : (
              <>
                <button type="button" className="demo-button small" onClick={() => setMode("cancelled")}>Cancel upload</button>
                <button type="button" className="demo-button small" onClick={() => setMode("background")}>Move to background</button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (patternId === "loading-spinner") {
    const [mode, setMode] = useState<"button" | "region" | "overlay" | "resolved" | "timeout" | "cancelled">("region");
    const status = mode === "button"
      ? "The trigger names the active payment action and stays disabled while it processes."
      : mode === "region"
        ? "Only the payment status region is busy; the spinner names PAY-2048 and nearby actions stay scoped."
        : mode === "overlay"
          ? "The component overlay blocks this payment card, not the whole product shell, and keeps cancel available."
          : mode === "resolved"
            ? "The short wait ended with a receipt and the spinner was removed."
            : mode === "timeout"
              ? "The wait crossed the threshold, so retry, cancel, and previous-status paths replaced the spinner."
              : "The wait was cancelled and the invoice state is preserved.";

    return (
      <div className={`quality-example loading-spinner-good-ux is-${mode}`}>
        <div className="demo-row">
          {(["button", "region", "overlay", "resolved", "timeout", "cancelled"] as const).map((item) => (
            <button
              type="button"
              key={item}
              className={mode === item ? "demo-button small primary" : "demo-button small"}
              onClick={() => setMode(item)}
            >
              {item === "button" ? "Button" : item === "region" ? "Region" : item === "overlay" ? "Overlay" : item === "resolved" ? "Resolve" : item === "timeout" ? "Timeout" : "Cancel"}
            </button>
          ))}
        </div>
        <p className="demo-status" aria-live="polite">{status}</p>
        <div className="loading-spinner-payment-card" aria-busy={mode === "region" || mode === "overlay"}>
          <div className="loading-spinner-card-head">
            <div>
              <strong>Payment PAY-2048</strong>
              <span>Invoice balance $240.00</span>
            </div>
            <span className={mode === "resolved" ? "loading-spinner-chip success" : mode === "timeout" ? "loading-spinner-chip warning" : "loading-spinner-chip"}>{mode === "resolved" ? "Paid" : mode === "timeout" ? "Needs action" : "Processing"}</span>
          </div>
          {mode === "resolved" ? (
            <div className="demo-success compact" role="status">
              <strong>Payment accepted</strong>
              <p>Receipt RCP-2048 was saved at 14:32.</p>
            </div>
          ) : mode === "timeout" ? (
            <div className="demo-error compact loading-spinner-timeout" role="alert">
              <strong>Still processing after 12 seconds</strong>
              <p>Payment PAY-2048 may complete in the background. Check status before submitting again.</p>
              <div className="demo-row">
                <button type="button" className="demo-button small primary" onClick={() => setMode("region")}>Check status</button>
                <button type="button" className="demo-button small" onClick={() => setMode("cancelled")}>Cancel</button>
                <button type="button" className="demo-button small">Use previous status</button>
              </div>
            </div>
          ) : mode === "cancelled" ? (
            <div className="loading-spinner-static-state">
              <strong>Invoice remains unpaid</strong>
              <span>PAY-2048 is preserved and no spinner is active.</span>
            </div>
          ) : (
            <>
              <div className="loading-spinner-status" role="status" aria-live="polite">
                <span className="spinner-only small" aria-hidden="true"></span>
                <span>{mode === "button" ? "Processing payment from Pay button" : mode === "overlay" ? "Submitting payment PAY-2048" : "Refreshing payment status PAY-2048"}</span>
              </div>
              <div className="loading-spinner-actions">
                <button type="button" className="demo-button small primary" disabled={mode === "button"}>{mode === "button" ? "Processing payment" : "Pay $240.00"}</button>
                <button type="button" className="demo-button small" onClick={() => setMode("cancelled")}>Cancel</button>
              </div>
            </>
          )}
          {mode === "overlay" && (
            <div className="loading-spinner-overlay" role="status" aria-live="polite">
              <span className="spinner-only small" aria-hidden="true"></span>
              <strong>Submitting payment PAY-2048</strong>
              <button type="button" className="demo-button small" onClick={() => setMode("cancelled")}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (patternId === "loading-skeleton") {
    const [mode, setMode] = useState<"loading" | "loaded" | "empty" | "error">("loading");
    const status = mode === "loading"
      ? "Reports are loading; the region is busy and placeholders are not interactive."
      : mode === "loaded"
        ? "Reports loaded; busy state removed and real cards are interactive."
        : mode === "empty"
          ? "Loading resolved with no reports; empty state replaces skeleton."
          : "Loading failed; persistent error state replaces skeleton.";

    return (
      <div className="quality-example">
        <div className="demo-row">
          <button type="button" className={mode === "loading" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("loading")}>Loading</button>
          <button type="button" className={mode === "loaded" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("loaded")}>Loaded</button>
          <button type="button" className={mode === "empty" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("empty")}>Empty</button>
          <button type="button" className={mode === "error" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("error")}>Error</button>
        </div>
        <p className="demo-status" aria-live="polite">{status}</p>
        {mode === "loading" && (
          <div className="skeleton-region-preview" aria-busy="true" aria-label="Reports loading">
            {[0, 1, 2].map((item) => (
              <div className="skeleton-report-card" key={item} aria-hidden="true">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-stack">
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                </div>
              </div>
            ))}
          </div>
        )}
        {mode === "loaded" && (
          <div className="mini-result-list" aria-label="Loaded reports">
            <button type="button" className="pattern-row">Risk report - Ready</button>
            <button type="button" className="pattern-row">Audit report - Ready</button>
            <button type="button" className="pattern-row">Vendor report - Ready</button>
          </div>
        )}
        {mode === "empty" && (
          <div className="demo-empty compact-empty empty-state-panel">
            <h3>No reports yet</h3>
            <p>Loading finished and no reports exist for this workspace.</p>
          </div>
        )}
        {mode === "error" && (
          <div className="demo-error compact error-state-panel" role="alert">
            <strong>Reports could not load</strong>
            <p>Skeleton stopped and recovery is now required.</p>
            <button type="button" className="demo-button small primary" onClick={() => setMode("loading")}>Try again</button>
          </div>
        )}
      </div>
    );
  }

  if (patternId === "error-state") {
    const [filter, setFilter] = useState("Q2 risk");
    const [draft, setDraft] = useState("Compare vendor exposure");
    const [mode, setMode] = useState<"failed" | "retrying" | "recovered" | "cached" | "support">("failed");
    const status = mode === "retrying"
      ? `Retrying reports with filter "${filter}". Draft preserved.`
      : mode === "recovered"
        ? `Reports loaded with filter "${filter}". Draft preserved.`
        : mode === "cached"
          ? `Showing cached reports for "${filter}". Live data is still unavailable.`
          : mode === "support"
            ? `Support reference REP-4821 saved with draft "${draft}".`
            : `Reports failed to load. Filter "${filter}" and draft are preserved.`;

    return (
      <div className="quality-example error-state-demo">
        <label>
          <span>Report filter</span>
          <input value={filter} onChange={(event) => setFilter(event.target.value)} />
        </label>
        <label>
          <span>Draft note</span>
          <input value={draft} onChange={(event) => setDraft(event.target.value)} />
        </label>
        <p className="demo-status" aria-live="polite">{status}</p>
        {mode === "recovered" || mode === "cached" ? (
          <div className="mini-result-list" aria-label={mode === "cached" ? "Cached reports" : "Recovered reports"}>
            <button type="button" className="pattern-row">{mode === "cached" ? "Cached" : "Live"} report - Vendor risk</button>
            <button type="button" className="pattern-row">{mode === "cached" ? "Cached" : "Live"} report - Audit changes</button>
          </div>
        ) : (
          <div className="demo-error compact error-state-panel" role="alert" aria-busy={mode === "retrying"}>
            <strong>{mode === "support" ? "Support request saved" : "Reports could not load"}</strong>
            <p>{mode === "support" ? "Reference REP-4821 includes the filter and draft note." : "The report service timed out. Your filter and draft note are still here."}</p>
            <div className="demo-row">
              <button
                type="button"
                className="demo-button small primary"
                disabled={mode === "retrying"}
                onClick={() => {
                  setMode("retrying");
                  window.setTimeout(() => setMode("recovered"), 180);
                }}
              >
                Retry
              </button>
              <button type="button" className="demo-button small" disabled={mode === "retrying"} onClick={() => setMode("cached")}>Use cached data</button>
              <button type="button" className="demo-button small" disabled={mode === "retrying"} onClick={() => setMode("support")}>Contact support</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (patternId === "toast-only-critical-error") {
    const [mode, setMode] = useState<"failed" | "retrying" | "paid" | "card" | "support">("failed");
    const status = mode === "retrying"
      ? "Retrying invoice INV-2048; failure message and actions remain visible."
      : mode === "paid"
        ? "Payment recovered. Invoice INV-2048 is paid and the error state is gone."
        : mode === "card"
          ? "Card update route opened. Invoice context and failed payment reason remain available."
          : mode === "support"
            ? "Billing support reference BILL-2048 is saved with the failed invoice."
            : "Payment failed. Invoice INV-2048 remains unpaid until the user recovers.";

    return (
      <div className="quality-example critical-error-demo">
        <div className="invoice-summary">
          <strong>Invoice INV-2048</strong>
          <span>{mode === "paid" ? "Paid" : "Unpaid"}</span>
        </div>
        <p className="demo-status" aria-live="polite">{status}</p>
        {mode === "paid" ? (
          <div className="demo-success compact" role="status">
            <strong>Payment complete</strong>
            <p>Receipt sent to billing@example.com.</p>
          </div>
        ) : (
          <div className="demo-error compact critical-error-panel" role="alert" aria-busy={mode === "retrying"}>
            <strong>{mode === "support" ? "Billing support contacted" : "Invoice payment failed"}</strong>
            <p>{mode === "support" ? "Reference BILL-2048 includes the invoice, decline reason, and attempted card." : "Card ending 4242 was declined. Retry, update the card, or contact billing."}</p>
            <div className="demo-row">
              <button
                type="button"
                className="demo-button small primary"
                disabled={mode === "retrying"}
                onClick={() => {
                  setMode("retrying");
                  window.setTimeout(() => setMode("paid"), 180);
                }}
              >
                Retry payment
              </button>
              <button type="button" className="demo-button small" disabled={mode === "retrying"} onClick={() => setMode("card")}>Update card</button>
              <button type="button" className="demo-button small" disabled={mode === "retrying"} onClick={() => setMode("support")}>Contact billing</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (patternId === "alert") {
    type AlertMode = "session" | "connection" | "payment" | "saved" | "resolved";
    const [mode, setMode] = useState<AlertMode>("session");
    const [expanded, setExpanded] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const alertCopy = {
      session: {
        tone: "warning",
        title: "Session expires in 2 minutes",
        body: "Save the filing draft now or renew the session before continuing.",
        action: "Save draft",
        detail: "Typed answers remain on this device, but submission will stop when the session expires.",
        urgent: true,
        dismissible: false
      },
      connection: {
        tone: "error",
        title: "Connection lost",
        body: "Changes are stored locally and cannot sync until the server reconnects.",
        action: "Retry sync",
        detail: "Last successful sync was 10:42. Export and submit stay disabled while offline.",
        urgent: true,
        dismissible: false
      },
      payment: {
        tone: "warning",
        title: "Payment method needs attention",
        body: "The invoice can be reviewed, but payment will not run until the card is updated.",
        action: "Update card",
        detail: "This task-level alert applies to the whole payment step, not to one field or row.",
        urgent: true,
        dismissible: true
      },
      saved: {
        tone: "success",
        title: "Draft saved",
        body: "The current answers are saved and the task can continue.",
        action: "View record",
        detail: "This calmer status does not use assertive alert semantics because nothing needs immediate attention.",
        urgent: false,
        dismissible: true
      },
      resolved: {
        tone: "neutral",
        title: "No active alert",
        body: "The task has no urgent condition that needs alert treatment.",
        action: "Restore session warning",
        detail: "Resolved tasks return to ordinary status instead of keeping alert chrome visible.",
        urgent: false,
        dismissible: false
      }
    }[mode];

    const changeMode = (next: AlertMode) => {
      setMode(next);
      setExpanded(false);
      setDismissed(false);
    };

    const visible = mode !== "resolved" && !(dismissed && alertCopy.dismissible);

    return (
      <div className={`quality-example alert-demo-shell is-${alertCopy.tone}`}>
        <div className="alert-work-card">
          <strong>Quarterly filing draft</strong>
          <span>{mode === "connection" ? "Local changes waiting to sync." : mode === "saved" ? "All answers saved." : "12 answers in progress."}</span>
          <button type="button" className="demo-button small primary" disabled={mode === "connection"}>{mode === "connection" ? "Submit disabled" : "Continue editing"}</button>
        </div>
        {visible ? (
          <div className={`task-alert-card ${alertCopy.tone}`}>
            <div className="task-alert-message" role={alertCopy.urgent ? "alert" : "status"} aria-live={alertCopy.urgent ? undefined : "polite"}>
              <strong>{alertCopy.title}</strong>
              <span>{alertCopy.body}</span>
            </div>
            <button type="button" onClick={() => {
              if (mode === "session" || mode === "connection") changeMode("resolved");
              else if (mode === "saved") setExpanded(true);
              else setExpanded((current) => !current);
            }}>{alertCopy.action}</button>
            <button type="button" onClick={() => setExpanded((current) => !current)} aria-expanded={expanded}>Details</button>
            {alertCopy.dismissible && <button type="button" aria-label={`Dismiss ${alertCopy.title}`} onClick={() => setDismissed(true)}>Dismiss</button>}
            {expanded && <p className="task-alert-detail">{alertCopy.detail}</p>}
          </div>
        ) : (
          <div className="task-alert-resolved" role="status" aria-live="polite">
            {dismissed ? `${alertCopy.title} dismissed because the task can recover elsewhere.` : alertCopy.body}
          </div>
        )}
        <div className="demo-row alert-controls">
          <button type="button" className="demo-button small" onClick={() => changeMode("session")}>Session</button>
          <button type="button" className="demo-button small" onClick={() => changeMode("connection")}>Connection</button>
          <button type="button" className="demo-button small" onClick={() => changeMode("payment")}>Payment</button>
          <button type="button" className="demo-button small" onClick={() => changeMode("saved")}>Saved</button>
          <button type="button" className="demo-button small primary" onClick={() => changeMode("resolved")}>Resolve</button>
        </div>
        <p className="demo-status">Alert state: {alertCopy.title}. {alertCopy.urgent ? "Urgent updates use alert semantics without taking focus." : "Lower-urgency updates use status semantics."}</p>
      </div>
    );
  }

  if (patternId === "banner") {
    type BannerMode = "maintenance" | "rollout" | "identity" | "resolved";
    type Section = "overview" | "invoices" | "payments" | "settings";
    const [mode, setMode] = useState<BannerMode>("maintenance");
    const [section, setSection] = useState<Section>("overview");
    const [expanded, setExpanded] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const bannerCopy = {
      maintenance: {
        tone: "warning",
        title: "Scheduled maintenance Saturday",
        body: "Billing exports and payment runs pause from 01:00 to 03:00 UTC.",
        action: "View schedule",
        detail: "The banner remains across Billing, Invoices, and Payments because each section depends on the same payment processing window.",
        dismissible: false,
        scope: "Billing workspace"
      },
      rollout: {
        tone: "info",
        title: "New invoice approvals are available",
        body: "Team approval rules now apply to draft invoices in this workspace.",
        action: "Learn more",
        detail: "Dismissal is saved for rollout message v3 in this workspace and will not hide future rollout versions.",
        dismissible: true,
        scope: "Billing workspace"
      },
      identity: {
        tone: "trust",
        title: "Official Acme billing service",
        body: "Check that the address ends with acme.example before entering account details.",
        action: "Check details",
        detail: "Identity banners use consistent trust language and appear on every page in the service scope.",
        dismissible: false,
        scope: "Service identity"
      },
      resolved: {
        tone: "neutral",
        title: "No active banner",
        body: "This workspace has no broad-scope notice that needs banner treatment.",
        action: "Restore maintenance",
        detail: "Resolved banners should disappear instead of leaving stale top-of-page messaging.",
        dismissible: false,
        scope: "Billing workspace"
      }
    }[mode];
    const sectionLabels: Record<Section, string> = {
      overview: "Overview",
      invoices: "Invoices",
      payments: "Payments",
      settings: "Settings"
    };
    const visible = mode !== "resolved" && !(dismissed && bannerCopy.dismissible);
    const changeMode = (next: BannerMode) => {
      setMode(next);
      setExpanded(false);
      setDismissed(false);
    };

    return (
      <div className={`quality-example banner-demo-shell is-${bannerCopy.tone}`}>
        <div className="product-shell-preview">
          <div className="product-shell-top">
            <strong>Acme Ops</strong>
            <span>{bannerCopy.scope}</span>
          </div>
          {visible ? (
            <div className={`product-banner-card ${bannerCopy.tone}`} role="region" aria-label={`${bannerCopy.scope} banner`}>
              <div>
                <strong>{bannerCopy.title}</strong>
                <span>{bannerCopy.body}</span>
              </div>
              <button type="button" onClick={() => setExpanded((current) => !current)} aria-expanded={expanded}>{bannerCopy.action}</button>
              {bannerCopy.dismissible && <button type="button" aria-label={`Dismiss ${bannerCopy.title}`} onClick={() => setDismissed(true)}>Dismiss</button>}
              {expanded && <p className="product-banner-detail">{bannerCopy.detail}</p>}
            </div>
          ) : (
            <div className="product-banner-resolved" role="status" aria-live="polite">
              {dismissed ? `${bannerCopy.title} hidden for this message version.` : bannerCopy.body}
            </div>
          )}
          <nav className="workspace-section-tabs" aria-label="Billing workspace sections">
            {(Object.keys(sectionLabels) as Section[]).map((item) => (
              <button type="button" className={section === item ? "demo-button small primary" : "demo-button small"} key={item} onClick={() => setSection(item)}>
                {sectionLabels[item]}
              </button>
            ))}
          </nav>
          <div className="product-shell-content">
            <strong>{sectionLabels[section]}</strong>
            <span>{section === "settings" ? "Settings are still in the banner scope because account setup affects billing behavior." : `The ${sectionLabels[section].toLowerCase()} section keeps the same broad-scope banner.`}</span>
          </div>
        </div>
        <div className="demo-row banner-controls">
          <button type="button" className="demo-button small" onClick={() => changeMode("maintenance")}>Maintenance</button>
          <button type="button" className="demo-button small" onClick={() => changeMode("rollout")}>Rollout</button>
          <button type="button" className="demo-button small" onClick={() => changeMode("identity")}>Identity</button>
          <button type="button" className="demo-button small primary" onClick={() => changeMode("resolved")}>Resolve</button>
        </div>
        <p className="demo-status">Banner state: {bannerCopy.title}. It applies across the {bannerCopy.scope.toLowerCase()}, not just {sectionLabels[section]}.</p>
      </div>
    );
  }

  if (patternId === "notification-banner") {
    type NotificationBannerMode = "uploaded" | "deadline" | "service" | "none";
    type PageMode = "overview" | "evidence" | "payments";
    const [mode, setMode] = useState<NotificationBannerMode>("uploaded");
    const [page, setPage] = useState<PageMode>("overview");
    const [expanded, setExpanded] = useState(false);
    const notice = {
      uploaded: {
        tone: "success",
        label: "Success",
        title: "Evidence uploaded",
        body: "Receipt EV-2048 is ready and linked to this application.",
        action: "View evidence",
        detail: "This confirms the previous page upload, but the user still needs to review evidence before submitting.",
        role: "alert" as const
      },
      deadline: {
        tone: "neutral",
        label: "Important",
        title: "You must respond by 17 June 2026",
        body: "Your application will pause if the evidence response is not sent by that date.",
        action: "Open response",
        detail: "The deadline lives elsewhere in the service, so the notice appears before this page heading as context.",
        role: "region" as const
      },
      service: {
        tone: "warning",
        label: "Important",
        title: "Evidence upload may be delayed",
        body: "New files can take up to 2 hours to appear because the evidence service is catching up.",
        action: "Check status",
        detail: "This is a service problem users need before interpreting the page, not a field-level error.",
        role: "region" as const
      },
      none: {
        tone: "none",
        label: "No notice",
        title: "No active notification banner",
        body: "The service page has no before-heading notice.",
        action: "Restore upload",
        detail: "Resolved conditions should remove the banner rather than leaving stale message chrome.",
        role: "status" as const
      }
    }[mode];
    const pageTitle = page === "overview" ? "Manage evidence" : page === "evidence" ? "Evidence record EV-2048" : "Application payments";
    const pageBody = page === "payments"
      ? "The upload success no longer appears here because payments are outside the evidence page-flow reason."
      : page === "evidence"
        ? "The same evidence flow can show the notice until the record is opened or acknowledged."
        : "The user lands here after upload and needs the previous-page outcome before reading the page.";
    const showNotice = mode !== "none" && page !== "payments";

    const changeMode = (next: NotificationBannerMode) => {
      setMode(next);
      setExpanded(false);
    };

    return (
      <div className={`quality-example notification-banner-demo-shell is-${notice.tone}`}>
        <div className="service-page-preview">
          <div className="service-crumb">Application evidence</div>
          {showNotice ? (
            <section className={`notification-banner-card ${notice.tone}`} role={notice.role} aria-label={`${notice.label}: ${notice.title}`}>
              <div className="notification-banner-title">{notice.label}</div>
              <div className="notification-banner-content">
                <strong>{notice.title}</strong>
                <span>{notice.body}</span>
                <div className="notification-banner-actions">
                  <button type="button" onClick={() => {
                    if (mode === "uploaded") setPage("evidence");
                    else setExpanded((current) => !current);
                  }}>{notice.action}</button>
                  <button type="button" onClick={() => setExpanded((current) => !current)} aria-expanded={expanded}>Details</button>
                </div>
                {expanded && <p className="notification-banner-detail">{notice.detail}</p>}
              </div>
            </section>
          ) : (
            <div className="notification-banner-resolved" role="status" aria-live="polite">{notice.body}</div>
          )}
          <h3>{pageTitle}</h3>
          <div className="service-page-card">
            <strong>{page === "payments" ? "Payment status" : "Evidence checklist"}</strong>
            <span>{pageBody}</span>
            <button type="button" className="demo-button small primary">{page === "payments" ? "Return to evidence" : "Continue review"}</button>
          </div>
        </div>
        <div className="demo-row notification-banner-controls">
          <button type="button" className={mode === "uploaded" ? "demo-button small primary" : "demo-button small"} onClick={() => changeMode("uploaded")}>Uploaded</button>
          <button type="button" className={mode === "deadline" ? "demo-button small primary" : "demo-button small"} onClick={() => changeMode("deadline")}>Deadline</button>
          <button type="button" className={mode === "service" ? "demo-button small primary" : "demo-button small"} onClick={() => changeMode("service")}>Service delay</button>
          <button type="button" className={mode === "none" ? "demo-button small primary" : "demo-button small"} onClick={() => changeMode("none")}>No banner</button>
        </div>
        <div className="demo-row notification-banner-controls">
          <button type="button" className={page === "overview" ? "demo-button small primary" : "demo-button small"} onClick={() => setPage("overview")}>Overview page</button>
          <button type="button" className={page === "evidence" ? "demo-button small primary" : "demo-button small"} onClick={() => setPage("evidence")}>Evidence record</button>
          <button type="button" className={page === "payments" ? "demo-button small primary" : "demo-button small"} onClick={() => setPage("payments")}>Payments page</button>
        </div>
        <p className="demo-status" aria-live="polite">Notification banner state: {showNotice ? notice.title : "not shown on this page"}. It is evaluated before the page heading, not across the whole workspace.</p>
      </div>
    );
  }

  if (patternId === "site-alert") {
    type SiteAlertMode = "emergency" | "outage" | "info" | "resolved";
    type SitePage = "home" | "apply" | "status" | "help";
    const [mode, setMode] = useState<SiteAlertMode>("emergency");
    const [page, setPage] = useState<SitePage>("home");
    const [expanded, setExpanded] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [updated, setUpdated] = useState(false);
    const alertCopy = {
      emergency: {
        tone: "emergency",
        title: updated ? "Emergency closure expanded" : "Emergency office closures",
        body: updated ? "North and East offices are closed through 18:00. Phone lines remain open for urgent claims." : "All offices are closed today because of severe weather. Use phone service or reschedule appointments.",
        action: "View affected offices",
        detail: "Affected offices: North, East, and River Road. Last updated 11:20 on 9 June 2026.",
        role: updated ? "alert" as const : "region" as const,
        dismissible: false
      },
      outage: {
        tone: "warning",
        title: updated ? "Online applications partly restored" : "Online applications unavailable",
        body: updated ? "Application uploads are available again. New submissions are still paused while queues recover." : "New online applications are paused while the service is unavailable.",
        action: "Check service status",
        detail: "Alternate phone service is open from 09:00 to 17:00. Last updated 10:45 on 9 June 2026.",
        role: updated ? "status" as const : "region" as const,
        dismissible: false
      },
      info: {
        tone: "info",
        title: "Public consultation deadline today",
        body: "Comments close at 23:59. This affects every consultation page on the site.",
        action: "Open consultation",
        detail: "This informational site alert can be dismissed because the deadline remains linked from the consultation status page.",
        role: "region" as const,
        dismissible: true
      },
      resolved: {
        tone: "resolved",
        title: "No active site alert",
        body: "There is no urgent sitewide condition affecting the public service.",
        action: "Restore emergency",
        detail: "Resolved site alerts should be removed from the shell instead of visually hidden.",
        role: "status" as const,
        dismissible: false
      }
    }[mode];
    const pageLabels: Record<SitePage, string> = {
      home: "Home",
      apply: "Apply",
      status: "Status",
      help: "Help"
    };
    const pageBody = {
      home: "Public service overview with routes to applications and support.",
      apply: "Application pages still show the alert before form content.",
      status: "Status pages can provide detail, but the alert still appears above the route.",
      help: "Help pages remain in scope because users may arrive here from search."
    }[page];
    const visible = mode !== "resolved" && !(dismissed && alertCopy.dismissible);
    const changeMode = (next: SiteAlertMode) => {
      setMode(next);
      setExpanded(false);
      setDismissed(false);
      setUpdated(false);
    };

    return (
      <div className={`quality-example site-alert-demo-shell is-${alertCopy.tone}`}>
        <div className="site-alert-page-preview">
          {visible ? (
            <section className={`site-alert-card ${alertCopy.tone}`} role={alertCopy.role} aria-label={`Site alert: ${alertCopy.title}`}>
              <div className="site-alert-icon" aria-hidden="true">{alertCopy.tone === "emergency" ? "!" : "i"}</div>
              <div className="site-alert-copy">
                <strong>{alertCopy.title}</strong>
                <span>{alertCopy.body}</span>
                <div className="site-alert-actions">
                  <button type="button" onClick={() => setExpanded((current) => !current)} aria-expanded={expanded}>{alertCopy.action}</button>
                  <button type="button" onClick={() => setExpanded((current) => !current)} aria-expanded={expanded}>Updates</button>
                  {alertCopy.dismissible && <button type="button" aria-label={`Dismiss ${alertCopy.title}`} onClick={() => setDismissed(true)}>Dismiss</button>}
                </div>
                {expanded && (
                  <ul className="site-alert-updates">
                    <li>{alertCopy.detail}</li>
                    <li>Alternate channel: call 0800 010 2048 for urgent support.</li>
                    <li>Next update will appear in this same site alert.</li>
                  </ul>
                )}
              </div>
            </section>
          ) : (
            <div className="site-alert-resolved" role="status" aria-live="polite">{dismissed ? `${alertCopy.title} hidden for this alert version.` : alertCopy.body}</div>
          )}
          <div className="site-alert-header">
            <strong>Benefits service</strong>
            <span>{pageLabels[page]}</span>
          </div>
          <nav className="site-alert-route-tabs" aria-label="Site pages">
            {(Object.keys(pageLabels) as SitePage[]).map((item) => (
              <button type="button" className={page === item ? "demo-button small primary" : "demo-button small"} key={item} onClick={() => setPage(item)}>
                {pageLabels[item]}
              </button>
            ))}
          </nav>
          <main className="site-alert-page-body">
            <strong>{pageLabels[page]}</strong>
            <span>{pageBody}</span>
            <button type="button" className="demo-button small primary">{page === "apply" ? "Continue application" : "Open page task"}</button>
          </main>
        </div>
        <div className="demo-row site-alert-controls">
          <button type="button" className={mode === "emergency" ? "demo-button small primary" : "demo-button small"} onClick={() => changeMode("emergency")}>Emergency</button>
          <button type="button" className={mode === "outage" ? "demo-button small primary" : "demo-button small"} onClick={() => changeMode("outage")}>Outage</button>
          <button type="button" className={mode === "info" ? "demo-button small primary" : "demo-button small"} onClick={() => changeMode("info")}>Information</button>
          <button type="button" className="demo-button small" onClick={() => setUpdated(true)}>Push update</button>
          <button type="button" className={mode === "resolved" ? "demo-button small primary" : "demo-button small"} onClick={() => changeMode("resolved")}>Resolve</button>
        </div>
        <p className="demo-status" aria-live="polite">Site alert state: {visible ? alertCopy.title : "not visible"}. It remains in the site shell across the {pageLabels[page]} route.</p>
      </div>
    );
  }

  if (patternId === "consent-prompt") {
    type ConsentMode = "pre" | "purpose" | "accepted" | "declined" | "granular" | "explicit" | "confirmation" | "withdrawal" | "renewal" | "expired" | "limited" | "mobile";
    const [mode, setMode] = useState<ConsentMode>("pre");
    const [research, setResearch] = useState(false);
    const [marketing, setMarketing] = useState(false);
    const [training, setTraining] = useState(false);
    const config = {
      pre: {
        title: "Consent not requested yet",
        body: "Optional research contact is off while the user reads the beta summary.",
        status: "Pre-consent state keeps optional processing off until a specific opt-in prompt appears.",
        chip: "Pre-consent",
        runtime: "Research contact off",
        record: "No consent record",
        primary: "Ask for consent",
        secondary: "Continue without consent"
      },
      purpose: {
        title: "Join follow-up research",
        body: "Product Research would like to use your email and survey answers to invite you to one beta interview.",
        status: "Specific purpose state names requester, data, purpose, benefit, optionality, and withdrawal route before the choice.",
        chip: "Specific purpose",
        runtime: "Waiting for affirmative opt-in",
        record: "purpose=research-follow-up, version=2026-06",
        primary: "Yes, I consent",
        secondary: "No thanks"
      },
      accepted: {
        title: "Research consent accepted",
        body: "You consented to Product Research using your email and survey answers for one beta interview invitation.",
        status: "Accept consent state uses a clear affirmative action and writes a purpose-specific consent record.",
        chip: "Accept consent",
        runtime: "Research contact allowed",
        record: "accepted, research-follow-up, 2026-06",
        primary: "View record",
        secondary: "Withdraw"
      },
      declined: {
        title: "Research consent declined",
        body: "You can still finish the beta feedback form. We will not use your answers for follow-up contact.",
        status: "Decline consent state keeps the eligible core task available and records refusal without penalty.",
        chip: "Decline consent",
        runtime: "Research contact blocked",
        record: "declined, research-follow-up, 2026-06",
        primary: "Continue form",
        secondary: "Change choice"
      },
      granular: {
        title: "Choose optional data uses",
        body: "Separate purposes stay off unless you select them.",
        status: "Granular consent state splits research, marketing, and AI training instead of bundling independent purposes.",
        chip: "Granular consent",
        runtime: "Purpose choices editable",
        record: `research=${research ? "yes" : "no"}, marketing=${marketing ? "yes" : "no"}, training=${training ? "yes" : "no"}`,
        primary: "Save choices",
        secondary: "Decline all"
      },
      explicit: {
        title: "Explicit consent statement",
        body: "I consent to Product Research using my optional health-note answer to match me with a specialist interview panel.",
        status: "Explicit consent state places the statement next to the unchecked control when sensitive use needs a clear statement.",
        chip: "Explicit consent",
        runtime: "Sensitive use off until checked",
        record: "explicit statement v3 awaiting choice",
        primary: "Save explicit consent",
        secondary: "Do not consent"
      },
      confirmation: {
        title: "Consent choice saved",
        body: "Your consent record was saved. You can withdraw it from Privacy settings at any time.",
        status: "Confirmation state shows saved purpose, version, timestamp, and withdrawal route.",
        chip: "Confirmation",
        runtime: research || marketing || training ? "Allowed purposes active" : "Optional processing off",
        record: "saved 2026-06-12, withdraw in Privacy settings",
        primary: "Open Privacy settings",
        secondary: "Return to task"
      },
      withdrawal: {
        title: "Withdraw research consent",
        body: "Withdrawing stops future research contact based on this consent. Prior lawful processing remains recorded.",
        status: "Withdrawal state makes revocation as reachable as the original opt-in and changes the runtime state.",
        chip: "Withdrawal",
        runtime: "Consent will be revoked on save",
        record: "withdrawal pending for research-follow-up",
        primary: "Withdraw consent",
        secondary: "Keep consent"
      },
      renewal: {
        title: "Consent needs renewal",
        body: "The purpose changed from one interview invitation to ongoing product research invitations.",
        status: "Renewal state asks again when purpose, data, requester, partner, or consequence changes materially.",
        chip: "Renewal",
        runtime: "Old consent cannot cover new purpose",
        record: "version 2026-04 superseded",
        primary: "Review new purpose",
        secondary: "Decline renewal"
      },
      expired: {
        title: "Consent expired",
        body: "The summer beta research consent has ended, so optional follow-up contact is stopped.",
        status: "Expired consent state stops optional processing until the user gives a fresh specific consent.",
        chip: "Expired consent",
        runtime: "Optional processing stopped",
        record: "expired, summer-beta-2026",
        primary: "Ask again",
        secondary: "Keep off"
      },
      limited: {
        title: "Consent cannot be collected here",
        body: "This account is managed by a guardian, so the prompt shows why the user cannot consent directly.",
        status: "Permission-limited state explains why consent cannot be collected directly and routes to the right authority.",
        chip: "Permission-limited",
        runtime: "Consent collection blocked",
        record: "guardian consent required",
        primary: "Contact guardian",
        secondary: "Continue without feature"
      },
      mobile: {
        title: "Mobile compact consent",
        body: "Research contact uses email and survey answers. You can say no and still submit feedback.",
        status: "Mobile compact state keeps purpose, choices, and withdrawal route readable in a narrow layout.",
        chip: "Mobile compact",
        runtime: "No optional use before opt-in",
        record: "compact prompt, same consent store",
        primary: "I consent",
        secondary: "No thanks"
      }
    }[mode];

    const chooseMode = (next: ConsentMode) => {
      if (next === "accepted") {
        setResearch(true);
        setMarketing(false);
        setTraining(false);
      }
      if (next === "declined" || next === "expired") {
        setResearch(false);
        setMarketing(false);
        setTraining(false);
      }
      setMode(next);
    };

    const saveChoices = () => {
      setMode("confirmation");
    };

    const declineAll = () => {
      setResearch(false);
      setMarketing(false);
      setTraining(false);
      setMode("declined");
    };

    return (
      <div className={`quality-example consent-prompt-demo-shell is-${mode}`}>
        <div className="consent-service-preview">
          <div className="consent-service-top">
            <strong>Research workspace</strong>
            <span>{config.chip}</span>
          </div>
          <section className={`consent-prompt-card ${mode === "confirmation" ? "saved" : ""}`} role={mode === "confirmation" ? "status" : "region"} aria-label={config.title}>
            <div>
              <strong>{config.title}</strong>
              <span>{config.body}</span>
            </div>
            <div className="consent-purpose-grid">
              <span><b>Requester</b>Product Research</span>
              <span><b>Data</b>{mode === "explicit" ? "Health-note answer" : "Email and survey answers"}</span>
              <span><b>Purpose</b>{mode === "renewal" ? "Ongoing research invitations" : "One beta interview invitation"}</span>
              <span><b>Withdrawal</b>Privacy settings anytime</span>
            </div>
            {mode === "granular" ? (
              <div className="consent-choice-list">
                <label><input type="checkbox" checked={research} onChange={(event) => setResearch(event.currentTarget.checked)} /> Follow-up research <span>One interview invitation</span></label>
                <label><input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.currentTarget.checked)} /> Product updates <span>Monthly email newsletter</span></label>
                <label><input type="checkbox" checked={training} onChange={(event) => setTraining(event.currentTarget.checked)} /> AI training <span>Use snippets to improve suggestions</span></label>
              </div>
            ) : null}
            {mode === "explicit" ? (
              <label className="consent-explicit-statement">
                <input type="checkbox" />
                <span>I consent to this sensitive-data use for specialist interview matching.</span>
              </label>
            ) : null}
            <div className="consent-prompt-actions">
              <button type="button" className="demo-button small primary" onClick={mode === "granular" || mode === "withdrawal" ? saveChoices : mode === "purpose" || mode === "pre" || mode === "mobile" ? () => chooseMode("accepted") : () => chooseMode("granular")}>{config.primary}</button>
              <button type="button" className="demo-button small" onClick={mode === "granular" || mode === "withdrawal" ? declineAll : mode === "accepted" ? () => chooseMode("withdrawal") : () => chooseMode("declined")}>{config.secondary}</button>
              <button type="button" className="demo-button small" onClick={() => chooseMode("withdrawal")}>Withdraw route</button>
              <a href="#consent-details">Read consent details</a>
            </div>
          </section>
          <div className="consent-record-grid">
            <div>
              <span>Runtime</span>
              <strong>{config.runtime}</strong>
            </div>
            <div>
              <span>Consent record</span>
              <strong>{config.record}</strong>
            </div>
          </div>
        </div>
        <div className="demo-row consent-prompt-controls">
          <button type="button" className={mode === "pre" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("pre")}>Pre-consent</button>
          <button type="button" className={mode === "purpose" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("purpose")}>Specific purpose</button>
          <button type="button" className={mode === "accepted" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("accepted")}>Accept consent</button>
          <button type="button" className={mode === "declined" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("declined")}>Decline consent</button>
          <button type="button" className={mode === "granular" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("granular")}>Granular consent</button>
          <button type="button" className={mode === "explicit" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("explicit")}>Explicit consent</button>
          <button type="button" className={mode === "confirmation" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("confirmation")}>Confirmation</button>
          <button type="button" className={mode === "withdrawal" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("withdrawal")}>Withdrawal</button>
          <button type="button" className={mode === "renewal" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("renewal")}>Renewal</button>
          <button type="button" className={mode === "expired" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("expired")}>Expired consent</button>
          <button type="button" className={mode === "limited" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("limited")}>Permission-limited</button>
          <button type="button" className={mode === "mobile" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("mobile")}>Mobile compact</button>
        </div>
        <p className="demo-status" aria-live="polite">{config.status}</p>
      </div>
    );
  }

  if (patternId === "cookie-banner") {
    type CookieMode = "first" | "accepted" | "rejected" | "manage" | "confirmation" | "returning" | "withdraw" | "nojs";
    const [mode, setMode] = useState<CookieMode>("first");
    const [analytics, setAnalytics] = useState(false);
    const [personalization, setPersonalization] = useState(false);
    const [ads, setAds] = useState(false);
    const config = {
      first: {
        title: "Cookies on Benefits service",
        body: "We use essential cookies to make this service work. We would also like to use analytics cookies to improve it.",
        status: "First visit blocks non-essential storage and presents accept, reject, and settings routes together.",
        primary: "Accept analytics cookies",
        secondary: "Reject analytics cookies",
        chip: "First visit",
        runtime: "Optional storage blocked",
        record: "No preference saved yet"
      },
      accepted: {
        title: "Analytics cookies accepted",
        body: "Analytics can run because the user chose to accept analytics cookies.",
        status: "Accept state updates the runtime and records the accepted purpose.",
        primary: "View settings",
        secondary: "Change choice",
        chip: "Accepted",
        runtime: "Analytics allowed",
        record: "analytics=yes, version=2026-06"
      },
      rejected: {
        title: "Analytics cookies rejected",
        body: "The service continues with essential cookies only.",
        status: "Reject state keeps the service usable and prevents optional storage.",
        primary: "View settings",
        secondary: "Change choice",
        chip: "Rejected",
        runtime: "Analytics blocked",
        record: "analytics=no, version=2026-06"
      },
      manage: {
        title: "Choose cookie purposes",
        body: "Essential cookies are always on. Optional purposes stay off unless selected.",
        status: "Manage settings exposes purpose-level choices without preselecting non-essential categories.",
        primary: "Save preferences",
        secondary: "Reject all optional",
        chip: "Settings",
        runtime: "Purpose controls open",
        record: "Awaiting saved purpose choices"
      },
      confirmation: {
        title: "Cookie preferences saved",
        body: "Your cookie preferences have been saved. You can change them from the Cookies link.",
        status: "Confirmation replaces the banner prompt and keeps a stable route for later changes.",
        primary: "Hide this message",
        secondary: "View cookies",
        chip: "Saved",
        runtime: analytics || personalization || ads ? "Allowed purposes active" : "Optional storage blocked",
        record: `analytics=${analytics ? "yes" : "no"}, personalization=${personalization ? "yes" : "no"}, ads=${ads ? "yes" : "no"}`
      },
      returning: {
        title: "Returning visit",
        body: "The banner is hidden because a current cookie preference is already saved.",
        status: "Returning visit applies stored consent without asking again until the version or purposes change.",
        primary: "Open cookies page",
        secondary: "Renew consent",
        chip: "Stored",
        runtime: analytics || personalization || ads ? "Stored allowed purposes active" : "Essential cookies only",
        record: "Preference loaded before optional scripts"
      },
      withdraw: {
        title: "Change cookie preferences",
        body: "Users can withdraw consent from the Cookies link without searching through unrelated privacy copy.",
        status: "Withdrawal state proves the banner is not the only route for changing cookie choices.",
        primary: "Save reject all",
        secondary: "Keep analytics",
        chip: "Withdraw",
        runtime: "Optional storage will stop after save",
        record: "Most recent choice replaces earlier consent"
      },
      nojs: {
        title: "Cookie preference form",
        body: "This server-side form works without JavaScript and submits accept or reject before optional storage is set.",
        status: "No-JavaScript state keeps the consent mechanism functional before client scripts run.",
        primary: "Submit accept",
        secondary: "Submit reject",
        chip: "No JS",
        runtime: "Server waits for form choice",
        record: "Preference saved after submit"
      }
    }[mode];

    const chooseMode = (next: CookieMode) => {
      if (next === "accepted") {
        setAnalytics(true);
        setPersonalization(false);
        setAds(false);
      }
      if (next === "rejected") {
        setAnalytics(false);
        setPersonalization(false);
        setAds(false);
      }
      if (next === "withdraw") {
        setAnalytics(true);
        setPersonalization(false);
        setAds(false);
      }
      setMode(next);
    };

    const saveManaged = () => {
      setMode("confirmation");
    };

    const rejectManaged = () => {
      setAnalytics(false);
      setPersonalization(false);
      setAds(false);
      setMode("confirmation");
    };

    return (
      <div className={`quality-example cookie-banner-demo-shell is-${mode}`}>
        <div className="cookie-service-preview">
          <div className="cookie-service-top">
            <strong>Benefits service</strong>
            <span>{config.chip}</span>
          </div>
          {mode === "returning" ? (
            <div className="cookie-banner-saved" role="status" aria-live="polite">
              <strong>{config.title}</strong>
              <span>{config.body}</span>
            </div>
          ) : (
            <section className={`cookie-banner-card ${mode === "confirmation" ? "saved" : ""}`} role={mode === "confirmation" ? "alert" : "region"} aria-label={`${config.title}`}>
              <div>
                <strong>{config.title}</strong>
                <span>{config.body}</span>
              </div>
              {mode === "manage" || mode === "withdraw" ? (
                <div className="cookie-purpose-list">
                  <label><input type="checkbox" checked readOnly /> Essential cookies <span>Required for sign-in and security</span></label>
                  <label><input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.currentTarget.checked)} /> Analytics cookies <span>Measure service use</span></label>
                  <label><input type="checkbox" checked={personalization} onChange={(event) => setPersonalization(event.currentTarget.checked)} /> Personalization cookies <span>Remember display choices</span></label>
                  <label><input type="checkbox" checked={ads} onChange={(event) => setAds(event.currentTarget.checked)} /> Advertising cookies <span>Off unless explicitly selected</span></label>
                </div>
              ) : null}
              <div className="cookie-banner-actions">
                <button type="button" className="demo-button small primary" onClick={mode === "first" ? () => chooseMode("accepted") : mode === "manage" || mode === "withdraw" ? saveManaged : mode === "confirmation" ? () => chooseMode("returning") : () => chooseMode("manage")}>{config.primary}</button>
                <button type="button" className="demo-button small" onClick={mode === "first" ? () => chooseMode("rejected") : mode === "manage" || mode === "withdraw" ? rejectManaged : () => chooseMode("rejected")}>{config.secondary}</button>
                <button type="button" className="demo-button small" onClick={() => chooseMode("manage")}>Manage settings</button>
                <a href="#cookies">View cookies</a>
              </div>
            </section>
          )}
          <div className="cookie-runtime-grid">
            <div>
              <span>Runtime</span>
              <strong>{config.runtime}</strong>
            </div>
            <div>
              <span>Preference record</span>
              <strong>{config.record}</strong>
            </div>
          </div>
        </div>
        <div className="demo-row cookie-banner-controls">
          <button type="button" className={mode === "first" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("first")}>First visit</button>
          <button type="button" className={mode === "accepted" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("accepted")}>Accept</button>
          <button type="button" className={mode === "rejected" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("rejected")}>Reject</button>
          <button type="button" className={mode === "manage" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("manage")}>Manage</button>
          <button type="button" className={mode === "confirmation" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("confirmation")}>Confirmation</button>
          <button type="button" className={mode === "returning" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("returning")}>Return visit</button>
          <button type="button" className={mode === "withdraw" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("withdraw")}>Withdraw</button>
          <button type="button" className={mode === "nojs" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("nojs")}>No JS</button>
        </div>
        <p className="demo-status" aria-live="polite">{config.status}</p>
      </div>
    );
  }

  if (patternId === "phase-beta-banner") {
    type PhaseMode = "alpha" | "private" | "public" | "feedback" | "transition" | "live";
    type PhaseRoute = "overview" | "apply" | "messages";
    const [mode, setMode] = useState<PhaseMode>("public");
    const [route, setRoute] = useState<PhaseRoute>("overview");
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const config = {
      alpha: {
        tag: "Alpha",
        title: "Prototype research",
        text: "This is an early prototype for invited research participants.",
        status: "Alpha state labels prototype testing and avoids implying public production availability.",
        feedback: "Send prototype feedback",
        record: "Limited research users, not public service",
        tone: "alpha"
      },
      private: {
        tag: "Beta",
        title: "Private beta",
        text: "This service is being tested with invited users before wider release.",
        status: "Private beta state shows controlled access while the team learns from real use.",
        feedback: "Give private beta feedback",
        record: "Invited users, support team monitoring",
        tone: "private"
      },
      public: {
        tag: "Beta",
        title: "Public beta",
        text: "This is a new service. Help us improve it by giving feedback.",
        status: "Public beta state persists across service routes and keeps feedback available.",
        feedback: "Give feedback about this page",
        record: "Open to users before live assessment",
        tone: "public"
      },
      feedback: {
        tag: "Beta",
        title: "Feedback captured with page context",
        text: `Feedback will include ${route === "overview" ? "Overview" : route === "apply" ? "Apply" : "Messages"} page context so the team can act on it.`,
        status: "Feedback state preserves the user's route and does not discard task progress.",
        feedback: "Return to service page",
        record: `Feedback route includes page=${route}`,
        tone: "feedback"
      },
      transition: {
        tag: "Beta",
        title: "Moving from private to public beta",
        text: "Access rules, support scripts, feedback routing, and phase copy are updated together.",
        status: "Transition state keeps phase copy synchronized with access and assessment status.",
        feedback: "Review phase checklist",
        record: "Assessment passed, public rollout ready",
        tone: "transition"
      },
      live: {
        tag: "",
        title: "Live service",
        text: "The service passed live assessment, so the phase banner has been removed.",
        status: "Live state removes the phase banner instead of leaving a stale Beta label.",
        feedback: "Open footer feedback",
        record: "No phase banner shown",
        tone: "live"
      }
    }[mode];
    const routeLabel = route === "overview" ? "Overview" : route === "apply" ? "Apply" : "Messages";
    const routeBody = route === "overview"
      ? "Service overview for users entering from search or a saved link."
      : route === "apply"
        ? "Application step keeps draft progress while feedback opens separately."
        : "Messages route still shows the same service phase because it is inside the beta service.";
    const showBanner = mode !== "live";
    const changeMode = (next: PhaseMode) => {
      setMode(next);
      setFeedbackOpen(false);
    };

    return (
      <div className={`quality-example phase-banner-demo-shell is-${config.tone}`}>
        <div className="phase-service-preview">
          <div className="phase-service-top">
            <strong>Benefits service</strong>
            <span>{config.title}</span>
          </div>
          <nav className="phase-service-nav" aria-label="Service sections">
            {(["overview", "apply", "messages"] as const).map((item) => (
              <button type="button" className={route === item ? "demo-button small primary" : "demo-button small"} key={item} onClick={() => setRoute(item)}>
                {item === "overview" ? "Overview" : item === "apply" ? "Apply" : "Messages"}
              </button>
            ))}
          </nav>
          {showBanner ? (
            <section className={`phase-banner-card ${config.tone}`} aria-label={`${config.tag} service phase`}>
              <strong>{config.tag}</strong>
              <span>{config.text} <a href="#feedback" onClick={(event) => {
                event.preventDefault();
                setFeedbackOpen((current) => !current);
                setMode("feedback");
              }}>{config.feedback}</a>.</span>
            </section>
          ) : (
            <div className="phase-banner-removed" role="status" aria-live="polite">{config.text}</div>
          )}
          {feedbackOpen && (
            <div className="phase-feedback-panel" role="status" aria-live="polite">
              <strong>Feedback draft</strong>
              <span>Page: {routeLabel}. Draft or selected case remains in the service.</span>
            </div>
          )}
          <div className="phase-service-body">
            <strong>{routeLabel}</strong>
            <span>{routeBody}</span>
            <button type="button" className="demo-button small primary">{route === "apply" ? "Continue application" : "Open task"}</button>
          </div>
          <div className="phase-record-grid">
            <div>
              <span>Phase record</span>
              <strong>{config.record}</strong>
            </div>
            <div>
              <span>Placement</span>
              <strong>After service navigation on every service route</strong>
            </div>
          </div>
        </div>
        <div className="demo-row phase-banner-controls">
          <button type="button" className={mode === "alpha" ? "demo-button small primary" : "demo-button small"} onClick={() => changeMode("alpha")}>Alpha</button>
          <button type="button" className={mode === "private" ? "demo-button small primary" : "demo-button small"} onClick={() => changeMode("private")}>Private beta</button>
          <button type="button" className={mode === "public" ? "demo-button small primary" : "demo-button small"} onClick={() => changeMode("public")}>Public beta</button>
          <button type="button" className={mode === "feedback" ? "demo-button small primary" : "demo-button small"} onClick={() => {
            setMode("feedback");
            setFeedbackOpen(true);
          }}>Feedback</button>
          <button type="button" className={mode === "transition" ? "demo-button small primary" : "demo-button small"} onClick={() => changeMode("transition")}>Transition</button>
          <button type="button" className={mode === "live" ? "demo-button small primary" : "demo-button small"} onClick={() => changeMode("live")}>Live removal</button>
        </div>
        <p className="demo-status" aria-live="polite">{config.status}</p>
      </div>
    );
  }

  if (patternId === "notification-center") {
    type CenterItem = {
      id: string;
      title: string;
      source: string;
      detail: string;
      time: string;
      unread: boolean;
      action: string;
      priority: "normal" | "warning" | "success";
    };
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState<"unread" | "all">("unread");
    const [unseen, setUnseen] = useState(3);
    const [items, setItems] = useState<CenterItem[]>([
      { id: "mention", title: "Mina mentioned you", source: "Pull request PR-482", detail: "Review the API contract before merge.", time: "4 min ago", unread: true, action: "Open PR", priority: "normal" },
      { id: "export", title: "Export is ready", source: "June invoices CSV", detail: "The file remains available for 7 days.", time: "12 min ago", unread: true, action: "Download", priority: "success" },
      { id: "approval", title: "Approval requested", source: "Vendor onboarding", detail: "Approve or reassign the request by Friday.", time: "1 hr ago", unread: true, action: "Review", priority: "warning" },
      { id: "viewed", title: "Case update viewed", source: "Appeal CASE-204", detail: "Already opened from the case page.", time: "Yesterday", unread: false, action: "Open case", priority: "normal" }
    ]);
    const [message, setMessage] = useState("Three new notifications are unseen; opening the center clears only the badge.");
    const [quietExports, setQuietExports] = useState(false);
    const unreadCount = items.filter((item) => item.unread).length;
    const visibleItems = filter === "unread" ? items.filter((item) => item.unread) : items;

    const openCenter = () => {
      setOpen(true);
      setUnseen(0);
      setMessage("Center opened: unseen badge cleared, unread item state preserved for triage.");
    };
    const markRead = (id: string) => {
      setItems((current) => current.map((item) => item.id === id ? { ...item, unread: false } : item));
      setMessage("One notification marked read without deleting it from All.");
    };
    const markAllRead = () => {
      setItems((current) => current.map((item) => ({ ...item, unread: false })));
      setMessage("All visible work is marked read; history remains in All.");
    };
    const suppressToast = () => {
      setItems((current) => [
        { id: `suppressed-${current.length}`, title: "Background import finished", source: "Customer import", detail: "Suppressed from toast because quiet mode is on.", time: "Now", unread: true, action: "Open import", priority: "success" },
        ...current
      ]);
      setUnseen((current) => current + 1);
      setMessage("A quiet notification was delivered to the center without interrupting the task.");
    };
    const viewRelatedObject = (id: string) => {
      setItems((current) => current.map((item) => item.id === id ? { ...item, unread: false, detail: `${item.detail} Related object viewed.` } : item));
      setMessage("Opening the related object updates the notification state predictably.");
    };

    return (
      <div className="quality-example notification-center-demo-shell">
        <div className="notification-center-shell">
          <div className="notification-center-topbar">
            <strong>Ops workspace</strong>
            <button type="button" aria-label={`Notifications, ${unseen} new, ${unreadCount} unread`} onClick={openCenter}>
              Bell {unseen > 0 && <span>{unseen}</span>}
            </button>
          </div>
          <main className="notification-center-work">
            <strong>Review queue</strong>
            <span>Primary task remains usable while notifications are triaged from the drawer.</span>
            <button type="button" className="demo-button small primary">Continue review</button>
          </main>
          {open ? (
            <aside className="notification-center-panel" aria-label="Notification center">
              <div className="notification-center-panel-head">
                <strong>Notifications</strong>
                <span>{unreadCount} unread</span>
                <button type="button" aria-label="Close notification center" onClick={() => {
                  setOpen(false);
                  setMessage("Center closed; unread state remains available from the bell.");
                }}>Close</button>
              </div>
              <div className="notification-center-tabs" role="group" aria-label="Notification filters">
                <button type="button" className={filter === "unread" ? "demo-button small primary" : "demo-button small"} onClick={() => setFilter("unread")}>Unread</button>
                <button type="button" className={filter === "all" ? "demo-button small primary" : "demo-button small"} onClick={() => setFilter("all")}>All</button>
                <button type="button" className="demo-button small" onClick={markAllRead}>Mark all read</button>
              </div>
              <div className="notification-center-list" aria-label={`${filter} notifications`}>
                {visibleItems.length ? visibleItems.map((item) => (
                  <div className={`notification-center-item ${item.unread ? "unread" : "read"} ${item.priority}`} key={item.id}>
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.source} - {item.time}</span>
                      <small>{item.detail}</small>
                    </div>
                    <button type="button" onClick={() => viewRelatedObject(item.id)}>{item.action}</button>
                    {item.unread && <button type="button" onClick={() => markRead(item.id)}>Mark read</button>}
                  </div>
                )) : (
                  <div className="notification-center-empty">No unread notifications. Switch to All for history.</div>
                )}
              </div>
              <label className="notification-center-preference">
                <input type="checkbox" checked={quietExports} onChange={(event) => {
                  setQuietExports(event.target.checked);
                  setMessage(event.target.checked ? "Export notifications will enter the center without toast interruption." : "Export notifications may use toast plus center history.");
                }} />
                Quiet export notifications
              </label>
            </aside>
          ) : (
            <div className="notification-center-closed" role="status" aria-live="polite">Center closed. {unreadCount} unread notifications remain.</div>
          )}
        </div>
        <div className="demo-row notification-center-controls">
          <button type="button" className="demo-button small primary" onClick={openCenter}>Open center</button>
          <button type="button" className="demo-button small" onClick={() => setFilter("unread")}>Unread</button>
          <button type="button" className="demo-button small" onClick={() => items[0] && markRead(items[0].id)}>Mark first read</button>
          <button type="button" className="demo-button small" onClick={suppressToast}>Suppress toast</button>
          <button type="button" className="demo-button small" onClick={() => setOpen(false)}>Close</button>
        </div>
        <p className="demo-status" aria-live="polite">{message}</p>
      </div>
    );
  }

  if (patternId === "warning-text") {
    type WarningMode = "fine" | "delete" | "eligibility" | "declaration" | "resolved";
    const [mode, setMode] = useState<WarningMode>("fine");
    const [showAccessiblePrefix, setShowAccessiblePrefix] = useState(true);
    const [confirmed, setConfirmed] = useState(false);
    const [saferOption, setSaferOption] = useState(false);
    const warning = {
      fine: {
        title: "Financial penalty",
        text: "You may be fined up to 5000 if you give false information.",
        action: "Submit declaration",
        detail: "The warning appears before the declaration because the consequence depends on the answer the user gives.",
        escalates: false
      },
      delete: {
        title: "Permanent deletion",
        text: "Deleted archive files cannot be recovered after 30 days.",
        action: "Delete archive",
        detail: "The warning prepares the user, then deletion escalates to confirmation before the action proceeds.",
        escalates: true
      },
      eligibility: {
        title: "Eligibility consequence",
        text: "Your application may be cancelled if you do not send evidence by 17 June 2026.",
        action: "Continue application",
        detail: "The warning names the omission and date before the user leaves the evidence step.",
        escalates: false
      },
      declaration: {
        title: "Legal declaration",
        text: "By continuing, you confirm you have authority to act for this organisation.",
        action: "Confirm authority",
        detail: "The warning qualifies a declaration rather than reporting a system status.",
        escalates: false
      },
      resolved: {
        title: "No severe consequence",
        text: "The selected safe option does not need warning text.",
        action: "Continue",
        detail: "When the risky condition no longer applies, warning styling is removed.",
        escalates: false
      }
    }[saferOption ? "resolved" : mode];
    const showWarning = warning.title !== "No severe consequence";
    const chooseMode = (next: WarningMode) => {
      setMode(next);
      setConfirmed(false);
      setSaferOption(false);
    };

    return (
      <div className={`quality-example warning-text-demo-shell is-${mode}`}>
        <div className="warning-text-form">
          <h4>{mode === "delete" ? "Manage archive" : "Submit application"}</h4>
          <fieldset className="warning-text-choice">
            <legend>Risk option</legend>
            <label>
              <input type="radio" name="warning-risk" checked={!saferOption} onChange={() => setSaferOption(false)} />
              Continue with consequence
            </label>
            <label>
              <input type="radio" name="warning-risk" checked={saferOption} onChange={() => {
                setSaferOption(true);
                setConfirmed(false);
              }} />
              Choose safer route
            </label>
          </fieldset>
          {showWarning ? (
            <div className="warning-text-card" role="note" aria-label={`${showAccessiblePrefix ? "Warning: " : ""}${warning.title}`}>
              <span className="warning-text-icon" aria-hidden="true">!</span>
              <strong>
                {showAccessiblePrefix && <span className="visually-hidden">Warning: </span>}
                {warning.text}
              </strong>
            </div>
          ) : (
            <div className="warning-text-resolved" role="status" aria-live="polite">No warning shown for the safe route.</div>
          )}
          <label className="warning-text-check">
            <input type="checkbox" />
            I understand the consequence before continuing.
          </label>
          <div className="warning-text-actions">
            <button
              type="button"
              className="demo-button small primary"
              onClick={() => {
                if (warning.escalates && !confirmed) {
                  setConfirmed(true);
                }
              }}
            >
              {warning.action}
            </button>
            <button type="button" className="demo-button small" onClick={() => setShowAccessiblePrefix((current) => !current)}>
              {showAccessiblePrefix ? "Hide label" : "Show label"}
            </button>
          </div>
          {confirmed && (
            <div className="warning-text-confirm" role="dialog" aria-label="Confirm archive deletion">
              <strong>Confirm deletion</strong>
              <span>Archive files cannot be recovered after 30 days.</span>
              <button type="button" className="demo-button small danger" onClick={() => setSaferOption(true)}>Confirm delete</button>
            </div>
          )}
        </div>
        <div className="demo-row warning-text-controls">
          <button type="button" className={mode === "fine" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("fine")}>Fine</button>
          <button type="button" className={mode === "delete" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("delete")}>Delete</button>
          <button type="button" className={mode === "eligibility" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("eligibility")}>Eligibility</button>
          <button type="button" className={mode === "declaration" ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode("declaration")}>Declaration</button>
          <button type="button" className={saferOption ? "demo-button small primary" : "demo-button small"} onClick={() => setSaferOption(true)}>Resolve</button>
        </div>
        <p className="demo-status" aria-live="polite">{warning.title}: {warning.detail} {showAccessiblePrefix ? "Warning wording is available before the consequence." : "The warning label is hidden in this inspection state."}</p>
      </div>
    );
  }

  if (patternId === "success-confirmation") {
    type SuccessMode = "none" | "saving" | "saved" | "uploaded" | "copied" | "viewed" | "new-task";
    const [mode, setMode] = useState<SuccessMode>("none");
    const [fileName, setFileName] = useState("bank-statement.pdf");
    const reference = mode === "saved" ? "DRAFT-482" : "EV-2048";
    const isVisible = mode === "saved" || mode === "uploaded" || mode === "copied";
    const successCopy = {
      saved: {
        title: "Draft saved",
        body: `Application draft ${reference} saved at 14:32.`,
        action: "Continue review"
      },
      uploaded: {
        title: "Evidence uploaded",
        body: `${fileName || "Evidence file"} was accepted at 14:32. Receipt ${reference} is ready.`,
        action: "View receipt"
      },
      copied: {
        title: "Reference copied",
        body: `${reference} copied. The evidence receipt remains available in the checklist.`,
        action: "View receipt"
      }
    }[mode as "saved" | "uploaded" | "copied"];
    const status =
      mode === "saving"
        ? "Saving is in progress; no success confirmation is shown until the action commits."
        : mode === "viewed"
          ? `Receipt ${reference} was opened, so the success confirmation collapsed into completed evidence state.`
          : mode === "new-task"
            ? "A new upload task started; the previous success confirmation was cleared from the task area."
            : mode === "none"
              ? "No action has completed yet, so there is no success confirmation."
              : `${successCopy.title}: object identity and proof are visible before the user continues.`;

    const saveDraft = () => {
      setMode("saving");
      window.setTimeout(() => setMode("saved"), 180);
    };
    const uploadEvidence = () => {
      setMode("saving");
      window.setTimeout(() => setMode("uploaded"), 180);
    };
    const copyReference = () => {
      if (mode === "uploaded" || mode === "saved" || mode === "copied") setMode("copied");
    };
    const viewReceipt = () => {
      if (mode === "uploaded" || mode === "copied") setMode("viewed");
    };
    const startNewTask = () => {
      setMode("new-task");
      setFileName("identity-proof.pdf");
    };

    return (
      <div className={`quality-example success-confirmation-demo-shell is-${mode}`}>
        <div className="success-confirmation-workspace">
          <h4>{mode === "new-task" ? "New evidence upload" : "Evidence upload"}</h4>
          <label className="success-confirmation-field">
            <span>File name</span>
            <input value={fileName} onChange={(event) => setFileName(event.target.value)} />
          </label>
          {mode === "saving" && (
            <div className="success-confirmation-pending" role="status" aria-live="polite">Saving evidence...</div>
          )}
          {isVisible && successCopy && (
            <div className="success-confirmation-card" role="status" aria-live="polite">
              <span className="success-confirmation-icon" aria-hidden="true">✓</span>
              <div>
                <strong>{successCopy.title}</strong>
                <span>{successCopy.body}</span>
              </div>
              <button type="button" onClick={successCopy.action === "View receipt" ? viewReceipt : undefined}>{successCopy.action}</button>
              <button type="button" onClick={copyReference}>Copy reference</button>
            </div>
          )}
          {(mode === "viewed" || mode === "new-task") && (
            <div className="success-confirmation-resolved" role="status" aria-live="polite">
              {mode === "viewed" ? `Receipt ${reference} viewed. Evidence row now shows completed.` : "Ready for the next evidence file."}
            </div>
          )}
          <div className="success-confirmation-task">
            <strong>Evidence checklist</strong>
            <span>{mode === "viewed" ? "bank-statement.pdf - completed" : mode === "new-task" ? "identity-proof.pdf - not uploaded" : "Upload bank statement to continue review."}</span>
            <button type="button" className="demo-button small primary" disabled={mode === "saving"} onClick={uploadEvidence}>Upload evidence</button>
          </div>
        </div>
        <div className="demo-row success-confirmation-controls">
          <button type="button" className={mode === "saved" ? "demo-button small primary" : "demo-button small"} onClick={saveDraft}>Save draft</button>
          <button type="button" className={mode === "uploaded" ? "demo-button small primary" : "demo-button small"} onClick={uploadEvidence}>Upload evidence</button>
          <button type="button" className={mode === "copied" ? "demo-button small primary" : "demo-button small"} onClick={copyReference}>Copy reference</button>
          <button type="button" className={mode === "viewed" ? "demo-button small primary" : "demo-button small"} onClick={viewReceipt}>View receipt</button>
          <button type="button" className={mode === "new-task" ? "demo-button small primary" : "demo-button small"} onClick={startNewTask}>New task</button>
        </div>
        <p className="demo-status" aria-live="polite">{status}</p>
      </div>
    );
  }

  if (patternId === "confirmation-page") {
    type ConfirmationMode = "review" | "submitted" | "copied" | "emailed" | "saved" | "tracking" | "bookmark" | "new";
    const [mode, setMode] = useState<ConfirmationMode>("review");
    const reference = "APP-48291";
    const submitted = mode !== "review";
    const status = {
      review: "The application is still before commit, so the receipt page is not shown.",
      submitted: `Application complete: reference ${reference}, next step, and record actions are visible.`,
      copied: `${reference} copied; the receipt remains available on the confirmation page.`,
      emailed: "Email receipt sent to mina@example.com with reference and next-step timing.",
      saved: "Record saved as a PDF with the reference, next step, and contact route.",
      tracking: "Track application opened from the receipt without returning to pre-submit review.",
      bookmark: "Bookmarked return restores the receipt and shows how to track the application.",
      new: "A new application can start without replacing the completed reference."
    }[mode];
    const showReceipt = submitted && mode !== "new";

    return (
      <div className={`quality-example confirmation-page-demo-shell is-${mode}`}>
        <div className="confirmation-page-frame">
          {!submitted ? (
            <div className="confirmation-page-review">
              <h4>Review grant application</h4>
              <dl>
                <div><dt>Applicant</dt><dd>Mina Rao</dd></div>
                <div><dt>Grant type</dt><dd>Studio improvement</dd></div>
              </dl>
              <button type="button" className="demo-button small primary" onClick={() => setMode("submitted")}>Submit application</button>
            </div>
          ) : mode === "new" ? (
            <div className="confirmation-page-section">
              <strong>New grant application</strong>
              <span>The previous receipt remains available in tracking as {reference}; this is a separate transaction.</span>
              <button type="button" className="demo-button small primary" onClick={() => setMode("review")}>Review new application</button>
            </div>
          ) : (
            <>
              <section className="confirmation-page-panel" aria-label="Application complete" tabIndex={-1}>
                <span aria-hidden="true">✓</span>
                <div>
                  <h4>Application complete</h4>
                  <p>Your reference number is <strong>{reference}</strong>.</p>
                </div>
              </section>
              <div className="confirmation-page-grid">
                <div className="confirmation-page-section">
                  <strong>What happens next</strong>
                  <span>The grants team will check your evidence and email a decision within 5 working days.</span>
                </div>
                <div className="confirmation-page-section">
                  <strong>Your submitted details</strong>
                  <span>Studio improvement grant for Mina Rao, submitted 14:32 today.</span>
                </div>
                <div className="confirmation-page-section">
                  <strong>Keep a record</strong>
                  <span>{mode === "bookmark" ? "Returned from bookmark. Receipt restored for tracking." : "Save, print, or copy the reference before closing this page."}</span>
                  <div className="confirmation-page-actions">
                    <button type="button" className={mode === "copied" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("copied")}>Copy reference</button>
                    <button type="button" className={mode === "saved" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("saved")}>Save record</button>
                  </div>
                </div>
                <div className="confirmation-page-section">
                  <strong>Need help?</strong>
                  <span>Contact grants support and quote {reference}.</span>
                  <button type="button" className={mode === "tracking" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("tracking")}>Track application</button>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="demo-row confirmation-page-controls">
          <button type="button" className={mode === "submitted" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("submitted")}>Submit</button>
          <button type="button" className={mode === "copied" ? "demo-button small primary" : "demo-button small"} onClick={() => showReceipt && setMode("copied")}>Copy reference</button>
          <button type="button" className={mode === "emailed" ? "demo-button small primary" : "demo-button small"} onClick={() => showReceipt && setMode("emailed")}>Email receipt</button>
          <button type="button" className={mode === "tracking" ? "demo-button small primary" : "demo-button small"} onClick={() => showReceipt && setMode("tracking")}>Track</button>
          <button type="button" className={mode === "bookmark" ? "demo-button small primary" : "demo-button small"} onClick={() => showReceipt && setMode("bookmark")}>Bookmark return</button>
          <button type="button" className={mode === "new" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("new")}>New application</button>
        </div>
        <p className="demo-status" aria-live="polite">{status}</p>
      </div>
    );
  }

  if (patternId === "toast-only-success-for-completed-transaction") return <ToastOnlySuccessTransactionGoodUx />;

  if (patternId === "toast-notification") {
    type ToastItem = {
      id: string;
      title: string;
      detail: string;
      tone: "success" | "info" | "warning";
      action?: string;
      durable?: boolean;
    };
    const [toasts, setToasts] = useState<ToastItem[]>([
      { id: "export", title: "Export started", detail: "April invoices are queued.", tone: "info", action: "View jobs", durable: true },
      { id: "saved", title: "Profile saved", detail: "Changes are now current.", tone: "success" }
    ]);
    const [history, setHistory] = useState<ToastItem[]>([
      { id: "history-1", title: "Weekly report ready", detail: "Available in job history.", tone: "info", durable: true }
    ]);
    const [message, setMessage] = useState("Two concise toasts are visible; export also has durable job history.");
    const visibleToasts = toasts.slice(0, 3);

    const addToast = (next: ToastItem) => {
      setToasts((current) => [next, ...current.filter((item) => item.id !== next.id)].slice(0, 3));
      if (next.durable) setHistory((current) => [next, ...current.filter((item) => item.id !== next.id)].slice(0, 4));
      setMessage(`${next.title} added. ${next.durable ? "It is also stored for later access." : "It can safely expire."}`);
    };

    const dismissToast = (id: string) => {
      const dismissed = toasts.find((item) => item.id === id);
      setToasts((current) => current.filter((item) => item.id !== id));
      setMessage(dismissed ? `${dismissed.title} dismissed without changing the underlying task.` : "Toast dismissed.");
    };

    const expireStack = () => {
      const durable = toasts.filter((item) => item.durable);
      setHistory((current) => [...durable, ...current.filter((item) => durable.every((toast) => toast.id !== item.id))].slice(0, 4));
      setToasts([]);
      setMessage(durable.length ? "Transient stack expired; durable messages remain in history." : "Transient stack expired; no required follow-up remains.");
    };

    return (
      <div className="quality-example toast-demo-shell">
        <div className="toast-work-area">
          <strong>Invoice workspace</strong>
          <span>Primary editing stays available while feedback appears.</span>
          <button type="button" className="demo-button small primary">Continue editing</button>
        </div>
        <p className="demo-status" aria-live="polite">{message}</p>
        <div className="toast-stack" role="status" aria-live="polite" aria-label="Visible toast notifications">
          {visibleToasts.length ? visibleToasts.map((toast) => (
            <div className={`toast-card ${toast.tone}`} key={toast.id}>
              <div>
                <strong>{toast.title}</strong>
                <span>{toast.detail}</span>
              </div>
              {toast.action && <button type="button" onClick={() => setMessage(`${toast.action} opened for ${toast.title.toLowerCase()}.`)}>{toast.action}</button>}
              <button type="button" aria-label={`Dismiss ${toast.title}`} onClick={() => dismissToast(toast.id)}>x</button>
            </div>
          )) : (
            <div className="toast-empty-region">No visible toasts. Important messages are still reachable below.</div>
          )}
        </div>
        <div className="toast-history" aria-label="Notification history">
          <strong>History</strong>
          {history.map((item) => <span key={item.id}>{item.title}: {item.detail}</span>)}
        </div>
        <div className="demo-row toast-controls">
          <button type="button" className="demo-button small" onClick={() => addToast({ id: "export", title: "Export started", detail: "April invoices are queued.", tone: "info", action: "View jobs", durable: true })}>Queue export</button>
          <button type="button" className="demo-button small" onClick={() => addToast({ id: "saved", title: "Profile saved", detail: "Changes are now current.", tone: "success" })}>Show saved</button>
          <button type="button" className="demo-button small" onClick={() => addToast({ id: "archive", title: "Invoice archived", detail: "Restorable for 30 seconds.", tone: "warning", action: "Undo" })}>Archive with undo</button>
          <button type="button" className="demo-button small" onClick={() => addToast({ id: "sync", title: "Sync delayed", detail: "Retrying in background.", tone: "warning", action: "View status", durable: true })}>Show sync delay</button>
          <button type="button" className="demo-button small primary" onClick={expireStack}>Expire stack</button>
        </div>
      </div>
    );
  }

  if (patternId === "inline-message") {
    type InlineMessageMode = "missing-contact" | "export-warning" | "sent" | "resolved";
    const [mode, setMode] = useState<InlineMessageMode>("missing-contact");
    const [expanded, setExpanded] = useState(false);
    const [selectedRow, setSelectedRow] = useState<"acme" | "globex">("acme");
    const rowLabel = selectedRow === "acme" ? "Acme Retail" : "Globex Services";
    const invoiceId = selectedRow === "acme" ? "INV-2048" : "INV-3180";
    const message = {
      "missing-contact": {
        tone: "warning",
        title: "Billing contact missing",
        body: `Add a billing contact before sending ${invoiceId} to ${rowLabel}.`,
        action: "Add contact",
        detail: "The invoice can be drafted, but sending is held until a reachable billing recipient is attached."
      },
      "export-warning": {
        tone: "info",
        title: "Export limited to selected invoice",
        body: `${invoiceId} will export without internal notes.`,
        action: "View details",
        detail: "Internal notes are hidden from customer-facing exports and remain visible in the workspace."
      },
      sent: {
        tone: "success",
        title: "Invoice sent",
        body: `${invoiceId} was sent to ${rowLabel}. Reference MAIL-7421 is ready to copy.`,
        action: "Copy reference",
        detail: "The reference remains beside the invoice until the row is refreshed or another send occurs."
      },
      resolved: {
        tone: "neutral",
        title: "No local message",
        body: `${invoiceId} has no warning, action, or status that needs inline feedback.`,
        action: "Restore warning",
        detail: "Resolved rows return to the normal table layout without leaving stale message chrome."
      }
    }[mode];

    const setMessageMode = (next: InlineMessageMode) => {
      setMode(next);
      setExpanded(false);
    };

    return (
      <div className="quality-example inline-message-demo">
        <div className="invoice-row-selector" role="group" aria-label="Invoice row selection">
          <button type="button" className={selectedRow === "acme" ? "demo-button small primary" : "demo-button small"} onClick={() => setSelectedRow("acme")}>Acme row</button>
          <button type="button" className={selectedRow === "globex" ? "demo-button small primary" : "demo-button small"} onClick={() => setSelectedRow("globex")}>Globex row</button>
        </div>
        <div className="invoice-row-preview">
          <strong>{invoiceId}</strong>
          <span>{rowLabel} - {selectedRow === "acme" ? "$4,820 due Friday" : "$1,240 due Monday"}</span>
          <button type="button" className="demo-button small primary" disabled={mode === "missing-contact"}>{mode === "sent" ? "Resend" : "Send invoice"}</button>
        </div>
        {mode !== "resolved" ? (
          <div className={`inline-message-card ${message.tone}`} role={mode === "missing-contact" ? "alert" : "status"} aria-live="polite">
            <div>
              <strong>{message.title}</strong>
              <span>{message.body}</span>
            </div>
            <button type="button" onClick={() => {
              if (mode === "missing-contact") setMessageMode("resolved");
              else if (mode === "sent") setExpanded(true);
              else setExpanded((current) => !current);
            }}>{message.action}</button>
            <button type="button" onClick={() => setExpanded((current) => !current)} aria-expanded={expanded}>Details</button>
            {expanded && <p className="inline-message-detail">{message.detail}</p>}
          </div>
        ) : (
          <div className="inline-message-empty" role="status" aria-live="polite">{message.body}</div>
        )}
        <div className="demo-row inline-message-controls">
          <button type="button" className="demo-button small" onClick={() => setMessageMode("missing-contact")}>Billing contact</button>
          <button type="button" className="demo-button small" onClick={() => setMessageMode("export-warning")}>Export warning</button>
          <button type="button" className="demo-button small" onClick={() => setMessageMode("sent")}>Sent reference</button>
          <button type="button" className="demo-button small primary" onClick={() => setMessageMode("resolved")}>Resolve message</button>
        </div>
        <p className="demo-status">Message state: {message.title}. It remains attached to {invoiceId}.</p>
      </div>
    );
  }

  if (patternId === "empty-state") {
    const [variant, setVariant] = useState<"first-use" | "permission" | "ready">("first-use");
    const message = variant === "permission"
      ? "Projects are empty because you need admin access before creating one."
      : variant === "ready"
        ? "First project created. Empty state is gone."
        : "No projects exist in this workspace yet.";

    return (
      <div className="quality-example">
        <div className="demo-row">
          <button type="button" className={variant === "first-use" ? "demo-button small primary" : "demo-button small"} onClick={() => setVariant("first-use")}>First use</button>
          <button type="button" className={variant === "permission" ? "demo-button small primary" : "demo-button small"} onClick={() => setVariant("permission")}>No access</button>
          <button type="button" className={variant === "ready" ? "demo-button small primary" : "demo-button small"} onClick={() => setVariant("ready")}>Has content</button>
        </div>
        <p className="demo-status" aria-live="polite">{message}</p>
        {variant === "ready" ? (
          <div className="mini-result-list" aria-label="Projects">
            <button type="button" className="pattern-row">Migration runbook - Draft</button>
          </div>
        ) : (
          <div className="demo-empty compact-empty empty-state-panel">
            <span className="empty-state-icon" aria-hidden="true"></span>
            <h3>{variant === "permission" ? "No projects available" : "No projects yet"}</h3>
            <p>{variant === "permission" ? "Ask an admin for project creation access." : "Create a project or import a CSV to start tracking work."}</p>
            <div className="demo-row">
              {variant === "permission" ? (
                <button type="button" className="demo-button small primary">Request access</button>
              ) : (
                <>
                  <button type="button" className="demo-button small primary" onClick={() => setVariant("ready")}>Create project</button>
                  <button type="button" className="demo-button small">Import CSV</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="quality-example">
      <div className="demo-row">
        <button type="button" className="demo-button small" onClick={() => setState("loading")}>Loading</button>
        <button type="button" className="demo-button small" onClick={() => setState("error")}>Error</button>
        <button type="button" className="demo-button small primary" onClick={() => setState("ready")}>Resolve</button>
      </div>
      {state === "loading" && (
        <div className="demo-mini-panel skeleton-card">
          <div className="skeleton-line"></div>
          <div className="skeleton-line short"></div>
        </div>
      )}
      {state === "error" && (
        <div className="demo-error compact">
          <strong>{meta.subject} failed</strong>
          <button type="button" className="demo-button small" onClick={() => setState("loading")}>{meta.options[0]}</button>
        </div>
      )}
      {state === "empty" && (
        <div className="demo-empty compact-empty">
          <h3>No {meta.subject.toLowerCase()} yet</h3>
          <button type="button" className="demo-button small">{meta.options[0]}</button>
        </div>
      )}
      {state === "ready" && <p className="demo-status">Recovered.</p>}
    </div>
  );
}

function StateBadUx({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  const [showToast, setShowToast] = useState(false);
  const [toastExpired, setToastExpired] = useState(false);

  if (patternId === "offline-state") {
    const [mode, setMode] = useState<"blank" | "silent" | "discard" | "fakeonline" | "disabled" | "stale">("silent");
    const copy = mode === "blank"
      ? "A blank offline page hides cached drafts and gives no reconnect or local-copy path."
      : mode === "silent"
        ? "The UI says Saved without disclosing that the change is only on this device."
        : mode === "discard"
          ? "The draft disappears after submit even though no queue or server acceptance exists."
          : mode === "fakeonline"
            ? "The connection badge says online while upload and refresh requests cannot reach the server."
            : mode === "disabled"
              ? "Every control is disabled, including safe cached reading and local editing."
              : "Cached values from yesterday are presented as current server data.";

    return (
      <div className={`quality-example offline-state-bad-ux is-${mode}`}>
        <div className="demo-row">
          {(["blank", "silent", "discard", "fakeonline", "disabled", "stale"] as const).map((item) => (
            <button
              type="button"
              key={item}
              className={mode === item ? "demo-button small primary" : "demo-button small"}
              onClick={() => setMode(item)}
            >
              {item === "blank" ? "Blank page" : item === "silent" ? "Silent save" : item === "discard" ? "Discard draft" : item === "fakeonline" ? "Fake online" : item === "disabled" ? "Disabled all" : "Stale current"}
            </button>
          ))}
        </div>
        <div className="offline-card bad">
          {mode === "blank" ? (
            <div className="offline-blank">
              <strong>You are offline</strong>
              <span>Try again later.</span>
            </div>
          ) : (
            <>
              <div className="offline-topline">
                <div>
                  <strong>{mode === "discard" ? "Report submitted" : mode === "stale" ? "Asset pressure: 82 PSI" : "Field report"}</strong>
                  <span>{mode === "fakeonline" ? "Network badge says online, but server requests fail." : mode === "disabled" ? "All actions unavailable." : mode === "silent" ? "Saved just now." : mode === "stale" ? "No timestamp or offline warning." : "Draft removed from screen."}</span>
                </div>
                <span className="offline-chip bad">{mode === "fakeonline" ? "Online" : mode === "stale" ? "Current" : "Saved"}</span>
              </div>
              <div className="offline-grid">
                <div>
                  <strong>Notes</strong>
                  <span>{mode === "discard" ? "No local copy shown." : "Valve inspection complete."}</span>
                </div>
                <div>
                  <strong>Photos</strong>
                  <span>{mode === "silent" ? "2 hidden uploads" : mode === "disabled" ? "cannot inspect" : "unknown"}</span>
                </div>
              </div>
              <div className="offline-actions">
                <button type="button" className="demo-button small primary" disabled={mode === "disabled"}>{mode === "discard" ? "Close" : "Submit"}</button>
                <button type="button" className="demo-button small" disabled={mode === "disabled"}>Refresh</button>
                <button type="button" className="demo-button small" disabled={mode === "disabled"}>Upload photos</button>
              </div>
            </>
          )}
        </div>
        <p className="demo-status" aria-live="polite">{copy}</p>
      </div>
    );
  }

  if (patternId === "sync-state") {
    const [mode, setMode] = useState<"falseSynced" | "hiddenQueue" | "spinner" | "globalPercent" | "cleared" | "conflictHidden">("falseSynced");
    const copy = mode === "falseSynced"
      ? "The status claims remote acceptance while local changes have not reached the server."
      : mode === "hiddenQueue"
        ? "Queued items are hidden, so users cannot see what is pending, failed, or safe to close."
        : mode === "spinner"
          ? "An endless spinner gives no item count, last sync time, or recovery path."
          : mode === "globalPercent"
            ? "A global percentage hides that one row failed and one row needs review."
            : mode === "cleared"
              ? "The failure is removed from the queue, making local recovery impossible."
              : "A server conflict is overwritten silently instead of preserving both copies for review.";

    return (
      <div className={`quality-example sync-state-bad-ux is-${mode}`}>
        <div className="demo-row">
          {(["falseSynced", "hiddenQueue", "spinner", "globalPercent", "cleared", "conflictHidden"] as const).map((item) => (
            <button
              type="button"
              key={item}
              className={mode === item ? "demo-button small primary" : "demo-button small"}
              onClick={() => setMode(item)}
            >
              {item === "falseSynced" ? "False synced" : item === "hiddenQueue" ? "Hidden queue" : item === "spinner" ? "Spinner" : item === "globalPercent" ? "Global percent" : item === "cleared" ? "Cleared failure" : "Hidden conflict"}
            </button>
          ))}
        </div>
        <div className="sync-card bad">
          <div className="sync-topline">
            <div>
              <strong>{mode === "cleared" ? "Sync finished" : mode === "conflictHidden" ? "Server copy updated" : "Field report"}</strong>
              <span>{mode === "spinner" ? "Syncing..." : mode === "globalPercent" ? "80 percent complete" : mode === "hiddenQueue" ? "Some changes may take a moment." : mode === "cleared" ? "Signature removed from queue." : mode === "conflictHidden" ? "Local comment replaced by server comment." : "All changes synced."}</span>
            </div>
            <span className="sync-chip bad">{mode === "spinner" ? "Working" : mode === "globalPercent" ? "80%" : "Synced"}</span>
          </div>
          {mode === "spinner" ? (
            <div className="sync-spinner-only" role="status">
              <span className="spinner-only" aria-hidden="true"></span>
              <span>Syncing</span>
            </div>
          ) : mode === "globalPercent" ? (
            <div className="sync-percent-misuse">
              <div className="progress-bar-track fake" aria-hidden="true"><span style={{ width: "80%" }}></span></div>
              <strong>80% complete</strong>
              <span>No row-level acceptance, failure, or review state is shown.</span>
            </div>
          ) : (
            <div className="sync-queue">
              {(mode === "hiddenQueue" ? [["Field report", "Saved", "Pending items not listed"]] : mode === "cleared" ? [["Inspection note", "Synced", "Accepted"], ["Photos", "Synced", "Accepted"]] : mode === "conflictHidden" ? [["Supervisor comment", "Synced", "Server copy replaced local edit"]] : [["Inspection note", "Synced", "Accepted"], ["Photos", "Done", "Upload still pending"]]).map(([item, status, detail]) => (
                <div className="sync-row muted" key={`${item}-${status}`}>
                  <span>{item}</span>
                  <strong>{status}</strong>
                  <small>{detail}</small>
                </div>
              ))}
            </div>
          )}
          <div className="sync-actions">
            <button type="button" className="demo-button small primary">{mode === "spinner" ? "Close anyway" : "Done"}</button>
            <button type="button" className="demo-button small" disabled={mode === "cleared"}>Retry</button>
          </div>
        </div>
        <p className="demo-status" aria-live="polite">{copy}</p>
      </div>
    );
  }

  if (patternId === "conflict-state") {
    const [mode, setMode] = useState<"overwrite" | "retry" | "hiddenCopy" | "reversed" | "bulkAccept" | "toastOnly">("overwrite");
    const copy = mode === "overwrite"
      ? "Newest timestamp wins and the local value disappears without a review path."
      : mode === "retry"
        ? "Retry cannot fix a conflict because the user must decide between competing values."
        : mode === "hiddenCopy"
          ? "A conflict copy exists, but the affected report does not link to it or explain where it went."
          : mode === "reversed"
            ? "Ambiguous side labels make users choose without knowing which version is server or local."
            : mode === "bulkAccept"
              ? "One bulk action resolves every conflict without showing which values will be discarded."
              : "A transient toast announces a conflict and disappears before users can compare versions.";

    return (
      <div className={`quality-example conflict-state-bad-ux is-${mode}`}>
        <div className="demo-row">
          {(["overwrite", "retry", "hiddenCopy", "reversed", "bulkAccept", "toastOnly"] as const).map((item) => (
            <button
              type="button"
              key={item}
              className={mode === item ? "demo-button small primary" : "demo-button small"}
              onClick={() => setMode(item)}
            >
              {item === "overwrite" ? "Overwrite" : item === "retry" ? "Retry only" : item === "hiddenCopy" ? "Hidden copy" : item === "reversed" ? "Reversed sides" : item === "bulkAccept" ? "Bulk accept" : "Toast only"}
            </button>
          ))}
        </div>
        <div className="conflict-card bad">
          <div className="conflict-topline">
            <div>
              <strong>{mode === "toastOnly" ? "Saved with warning" : mode === "bulkAccept" ? "6 conflicts found" : "Field report save"}</strong>
              <span>{mode === "retry" ? "Something changed. Try again." : mode === "hiddenCopy" ? "A copy may be available elsewhere." : mode === "reversed" ? "Ours and theirs changed the same value." : mode === "bulkAccept" ? "Apply recommended values to all fields." : mode === "toastOnly" ? "Conflict detected." : "Latest server value kept."}</span>
            </div>
            <span className="conflict-chip bad">{mode === "bulkAccept" ? "6" : mode === "retry" ? "Error" : "Saved"}</span>
          </div>
          {mode === "toastOnly" ? (
            <div className="conflict-toast-only" role="status">Conflict detected. Review later.</div>
          ) : (
            <div className="conflict-version-stack">
              {(mode === "reversed" ? [["Ours", "Valve pressure stable after restart.", "Unknown side"], ["Theirs", "Valve pressure rose after restart.", "Unknown side"]] : mode === "bulkAccept" ? [["All fields", "Recommended values selected", "No per-field preview"]] : mode === "hiddenCopy" ? [["Supervisor comment", "Server value kept", "Local copy stored outside this report"]] : [["Supervisor comment", "Server value kept", "Local edit not shown"]]).map(([label, value, detail]) => (
                <div className="conflict-value muted" key={`${label}-${value}`}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                  <small>{detail}</small>
                </div>
              ))}
            </div>
          )}
          <div className="conflict-actions">
            <button type="button" className="demo-button small primary">{mode === "retry" ? "Retry save" : mode === "bulkAccept" ? "Accept all" : "Continue"}</button>
            <button type="button" className="demo-button small" disabled={mode === "overwrite" || mode === "toastOnly"}>Review values</button>
          </div>
        </div>
        <p className="demo-status" aria-live="polite">{copy}</p>
      </div>
    );
  }

  if (patternId === "permission-denied-state") {
    const [mode, setMode] = useState<"blank" | "retry" | "hiddenOwner" | "leak" | "disabled" | "success">("retry");
    const copy = mode === "blank"
      ? "A blank page hides whether the user lacks access, used the wrong account, or reached a missing resource."
      : mode === "retry"
        ? "Retry cannot fix a role boundary; it only wastes time and support effort."
        : mode === "hiddenOwner"
          ? "The user has no owner, admin, request, or account path despite a known authorization denial."
          : mode === "leak"
            ? "The denial exposes a restricted report title before the user is allowed to know it exists."
            : mode === "disabled"
              ? "A disabled control blocks publishing without naming the missing role or owner path."
              : "The UI claims access was granted before an owner approval has happened.";

    return (
      <div className={`quality-example permission-state-bad-ux is-${mode}`}>
        <div className="demo-row">
          {(["blank", "retry", "hiddenOwner", "leak", "disabled", "success"] as const).map((item) => (
            <button
              type="button"
              key={item}
              className={mode === item ? "demo-button small primary" : "demo-button small"}
              onClick={() => setMode(item)}
            >
              {item === "blank" ? "Blank page" : item === "retry" ? "Retry loop" : item === "hiddenOwner" ? "Hidden owner" : item === "leak" ? "Leaks title" : item === "disabled" ? "Disabled only" : "False success"}
            </button>
          ))}
        </div>
        <div className="permission-card bad">
          {mode === "blank" ? (
            <div className="permission-blank">
              <strong>Unavailable</strong>
              <span>No account, owner, permission, or policy explanation.</span>
            </div>
          ) : (
            <>
              <div className="permission-topline">
                <div>
                  <strong>{mode === "leak" ? "Restricted acquisition report: Project Saffron" : mode === "success" ? "Request complete" : mode === "disabled" ? "Quarterly revenue report" : "Could not open report"}</strong>
                  <span>{mode === "retry" ? "Something went wrong. Try again." : mode === "hiddenOwner" ? "You do not have permission." : mode === "leak" ? "Ask the M&A owner for access." : mode === "disabled" ? "Publish is unavailable." : "You now have access."}</span>
                </div>
                <span className="permission-chip bad">{mode === "success" ? "Granted" : mode === "disabled" ? "Locked" : "Denied"}</span>
              </div>
              <div className="permission-grid">
                <div className="permission-row muted">
                  <span>{mode === "leak" ? "Confidential title" : "Access"}</span>
                  <strong>{mode === "disabled" ? "Button inactive" : mode === "success" ? "No owner decision" : "Unknown"}</strong>
                  <small>{mode === "hiddenOwner" ? "No request recipient is shown." : mode === "leak" ? "Private details are visible too early." : mode === "success" ? "The owner has not approved anything." : "The missing role is not named."}</small>
                </div>
              </div>
              <div className="permission-actions">
                <button type="button" className="demo-button small primary" disabled={mode === "disabled"}>{mode === "retry" ? "Retry" : mode === "success" ? "Open report" : "Continue"}</button>
                <button type="button" className="demo-button small" disabled={mode === "hiddenOwner" || mode === "disabled"}>Request access</button>
              </div>
            </>
          )}
        </div>
        <p className="demo-status" aria-live="polite">{copy}</p>
      </div>
    );
  }

  if (patternId === "permission-recovery") {
    type Misuse = "retryLoop" | "falseGrant" | "duplicate" | "hiddenOwner" | "policyLoop" | "leak";
    const [mode, setMode] = useState<Misuse>("retryLoop");
    const copy: Record<Misuse, string> = {
      retryLoop: "Retry repeats the same authorization denial because no role, account, or policy state changed.",
      falseGrant: "Request submission is presented as granted access before any owner decision exists.",
      duplicate: "Reload hides the pending request, so the owner receives duplicate notifications.",
      hiddenOwner: "The user cannot tell who receives the request or what role is being requested.",
      policyLoop: "Owner request is offered even though organization policy prevents that owner from granting access.",
      leak: "Recovery copy exposes a restricted report title and owner to an account that should not know it exists."
    };

    return (
      <div className={`quality-example permission-recovery-bad-ux is-${mode}`}>
        <div className="demo-row permission-recovery-controls">
          {(["retryLoop", "falseGrant", "duplicate", "hiddenOwner", "policyLoop", "leak"] as const).map((item) => (
            <button
              type="button"
              key={item}
              className={mode === item ? "demo-button small primary" : "demo-button small"}
              onClick={() => setMode(item)}
            >
              {item === "retryLoop" ? "Retry loop" : item === "falseGrant" ? "False grant" : item === "duplicate" ? "Duplicate" : item === "hiddenOwner" ? "Hidden owner" : item === "policyLoop" ? "Policy loop" : "Leak details"}
            </button>
          ))}
        </div>
        <div className="permission-card bad">
          <div className="permission-topline">
            <div>
              <strong>{mode === "leak" ? "Project Saffron acquisition model" : mode === "falseGrant" ? "Access granted" : mode === "duplicate" ? "Send request again" : "Permission recovery"}</strong>
              <span>{copy[mode]}</span>
            </div>
            <span className="permission-chip bad">{mode === "falseGrant" ? "Granted" : mode === "policyLoop" ? "Loop" : "Unsafe"}</span>
          </div>
          <div className="permission-grid">
            <div className="permission-row muted">
              <span>{mode === "leak" ? "Restricted detail" : "Request state"}</span>
              <strong>{mode === "duplicate" ? "Pending hidden" : mode === "hiddenOwner" ? "No owner route" : mode === "policyLoop" ? "Impossible owner request" : mode === "falseGrant" ? "No approval" : "Unchanged role"}</strong>
              <small>{mode === "leak" ? "Title and owner appear before access is granted." : mode === "policyLoop" ? "Finance owner cannot override external sharing policy." : mode === "duplicate" ? "Existing request ACC-2048 is not shown." : "No trustworthy request lifecycle is visible."}</small>
            </div>
            <div className="permission-row muted">
              <span>Original task</span>
              <strong>{mode === "falseGrant" ? "Opened too early" : "Return path missing"}</strong>
              <small>{mode === "retryLoop" ? "Retry sends the same denied request." : "Users cannot see when the blocked report can actually resume."}</small>
            </div>
          </div>
          <div className="permission-recovery-timeline bad" aria-label="Broken access recovery progress">
            <span className={mode === "falseGrant" ? "is-done" : ""}>Request</span>
            <span>{mode === "duplicate" ? "lost" : "unknown"}</span>
            <span>{mode === "policyLoop" ? "blocked" : "not decided"}</span>
            <span>{mode === "falseGrant" ? "claimed" : "missing"}</span>
          </div>
          <div className="permission-actions">
            <button type="button" className="demo-button small danger">{mode === "retryLoop" ? "Retry" : mode === "duplicate" ? "Send again" : mode === "falseGrant" ? "Open report" : "Continue"}</button>
            <button type="button" className="demo-button small" disabled={mode === "hiddenOwner" || mode === "policyLoop"}>View request</button>
          </div>
        </div>
        <p className="demo-status" aria-live="polite">{copy[mode]} Recovery is not proven until role, owner, status, and return path are explicit.</p>
      </div>
    );
  }

  if (patternId === "service-unavailable-page") {
    const [mode, setMode] = useState<"bare503" | "retryLoop" | "noEta" | "lostWork" | "fakeProgress" | "deadEnd">("bare503");
    const copy = mode === "bare503"
      ? "A bare code does not name the service, outage scope, timing, or support path."
      : mode === "retryLoop"
        ? "Immediate retry loops waste effort during a known closure and can duplicate risky submissions."
        : mode === "noEta"
          ? "No return time or update cadence leaves users refreshing blindly."
          : mode === "lostWork"
            ? "Saved-work claims are unsafe when the page does not know whether the draft was retained."
            : mode === "fakeProgress"
              ? "A progress bar suggests active work even though the service is closed."
              : "Sending users home hides the outage and gives no route for urgent deadlines.";

    return (
      <div className={`quality-example service-unavailable-page-bad-ux is-${mode}`}>
        <div className="demo-row">
          {(["bare503", "retryLoop", "noEta", "lostWork", "fakeProgress", "deadEnd"] as const).map((item) => (
            <button
              type="button"
              key={item}
              className={mode === item ? "demo-button small primary" : "demo-button small"}
              onClick={() => setMode(item)}
            >
              {item === "bare503" ? "Bare 503" : item === "retryLoop" ? "Retry loop" : item === "noEta" ? "No return time" : item === "lostWork" ? "Lost-work claim" : item === "fakeProgress" ? "Fake progress" : "Dead end"}
            </button>
          ))}
        </div>
        <div className="service-unavailable-card bad">
          <div className="service-unavailable-topline">
            <div>
              <strong>{mode === "bare503" ? "503" : mode === "deadEnd" ? "Welcome to services" : mode === "fakeProgress" ? "Preparing your application" : "Service unavailable"}</strong>
              <span>{mode === "retryLoop" ? "Try again now." : mode === "noEta" ? "Come back later." : mode === "lostWork" ? "Your answers should be fine." : mode === "fakeProgress" ? "Almost ready..." : mode === "deadEnd" ? "Choose another task from the homepage." : "Server error."}</span>
            </div>
            <span className="service-unavailable-chip bad">{mode === "fakeProgress" ? "90%" : "Error"}</span>
          </div>
          {mode === "fakeProgress" ? (
            <div className="service-unavailable-fake-progress" aria-label="Misleading progress">
              <div className="progress-bar-track fake" aria-hidden="true"><span style={{ width: "90%" }}></span></div>
              <strong>90% loaded</strong>
              <span>No outage window or support route is shown.</span>
            </div>
          ) : (
            <div className="service-unavailable-grid">
              <div className="service-unavailable-row muted">
                <span>{mode === "lostWork" ? "Draft" : "Next step"}</span>
                <strong>{mode === "retryLoop" ? "Refresh again" : mode === "noEta" ? "Unknown" : mode === "deadEnd" ? "Go home" : mode === "lostWork" ? "Probably saved" : "Try later"}</strong>
                <small>{mode === "lostWork" ? "No transaction state backs this message." : "No affected task, update time, or support channel is provided."}</small>
              </div>
            </div>
          )}
          <div className="service-unavailable-actions">
            <button type="button" className="demo-button small primary">{mode === "deadEnd" ? "Home" : "Refresh"}</button>
            <button type="button" className="demo-button small" disabled={mode === "bare503" || mode === "deadEnd"}>Contact support</button>
          </div>
        </div>
        <p className="demo-status" aria-live="polite">{copy}</p>
      </div>
    );
  }

  if (patternId === "page-not-found-page") {
    const [mode, setMode] = useState<"redirect" | "bare404" | "outage" | "dead" | "searchless" | "leak">("bare404");
    const copy = mode === "redirect"
      ? "An automatic homepage redirect hides the missing route and gives users no proof of what happened."
      : mode === "bare404"
        ? "A bare code gives no likely cause, search, replacement page, contact path, or report route."
        : mode === "outage"
          ? "Outage copy misleads users when the service is working and only this URL is missing."
          : mode === "dead"
            ? "A dead-end page confirms failure but leaves every recovery path outside the interface."
            : mode === "searchless"
              ? "Searchless recovery forces users to browse manually even when the target could be found by query."
              : "Private-title leaks confirm a protected resource exists and reveal details to the wrong account.";

    return (
      <div className={`quality-example page-not-found-page-bad-ux is-${mode}`}>
        <div className="demo-row">
          {(["redirect", "bare404", "outage", "dead", "searchless", "leak"] as const).map((item) => (
            <button
              type="button"
              key={item}
              className={mode === item ? "demo-button small primary" : "demo-button small"}
              onClick={() => setMode(item)}
            >
              {item === "redirect" ? "Auto redirect" : item === "bare404" ? "Bare 404" : item === "outage" ? "Outage copy" : item === "dead" ? "Dead end" : item === "searchless" ? "No search" : "Leaks private title"}
            </button>
          ))}
        </div>
        <div className="not-found-card bad">
          <div className="not-found-topline">
            <div>
              <strong>{mode === "redirect" ? "Welcome to Benefits" : mode === "outage" ? "Service unavailable" : mode === "leak" ? "Quarterly revenue report not found" : "404"}</strong>
              <span>{mode === "redirect" ? "Choose a task." : mode === "outage" ? "Try again later." : mode === "dead" ? "This page does not exist." : mode === "searchless" ? "The page is missing. Browse our site." : mode === "leak" ? "Owner: Priya Shah. Report ID REV-8812." : "Not found."}</span>
            </div>
            <span className="not-found-chip bad">{mode === "outage" ? "Down" : "Error"}</span>
          </div>
          {mode === "redirect" ? (
            <div className="not-found-redirect-note">
              <strong>Redirected from /benefits/change-bank-details</strong>
              <span>The UI never tells users the requested page failed to resolve.</span>
            </div>
          ) : (
            <div className="not-found-grid">
              <div className="not-found-row muted">
                <span>{mode === "leak" ? "Private detail" : "Recovery"}</span>
                <strong>{mode === "dead" ? "None" : mode === "searchless" ? "Browse manually" : mode === "outage" ? "Refresh later" : mode === "leak" ? "Sensitive title shown" : "Unknown"}</strong>
                <small>{mode === "leak" ? "The missing page reveals existence before checking access policy." : "No targeted route matches the reason the URL was missing."}</small>
              </div>
            </div>
          )}
          <div className="not-found-actions">
            <button type="button" className="demo-button small primary">{mode === "outage" ? "Retry" : mode === "redirect" ? "Start over" : "Home"}</button>
            <button type="button" className="demo-button small" disabled={mode === "bare404" || mode === "dead" || mode === "leak"}>{mode === "searchless" ? "Browse topics" : "Search"}</button>
          </div>
        </div>
        <p className="demo-status" aria-live="polite">{copy}</p>
      </div>
    );
  }

  if (patternId === "step-progress") {
    const [mode, setMode] = useState<"visited" | "clickable" | "dynamic" | "percent" | "coloronly" | "stale">("visited");
    const copy = mode === "visited"
      ? "Visited pages are marked complete even though acceptance events never happened."
      : mode === "clickable"
        ? "Locked future segments look like navigation buttons and fail without explaining why."
        : mode === "dynamic"
          ? "A dependent tax stage appears and changes the total without explaining what triggered it."
          : mode === "percent"
            ? "A numeric bar hides the named stage that is blocking finish."
            : mode === "coloronly"
              ? "The failed document stage is communicated only with color, not status text."
              : "Review remains complete after the user edits documents and invalidates it.";

    return (
      <div className={`quality-example step-progress-bad-ux is-${mode}`}>
        <div className="demo-row">
          {(["visited", "clickable", "dynamic", "percent", "coloronly", "stale"] as const).map((item) => (
            <button
              type="button"
              key={item}
              className={mode === item ? "demo-button small primary" : "demo-button small"}
              onClick={() => setMode(item)}
            >
              {item === "visited" ? "Visited" : item === "clickable" ? "Clickable locks" : item === "dynamic" ? "Changing total" : item === "percent" ? "Percent bar" : item === "coloronly" ? "Color only" : "Stale"}
            </button>
          ))}
        </div>
        <div className="step-progress-card bad">
          {mode === "percent" ? (
            <div className="step-progress-percent-misuse">
              <strong>Vendor onboarding</strong>
              <div className="progress-bar-track fake" aria-hidden="true"><span style={{ width: "80%" }}></span></div>
              <span>80% complete</span>
              <button type="button" className="demo-button small primary">Finish</button>
            </div>
          ) : (
            <ol className={`step-progress-list bad ${mode === "coloronly" ? "color-only" : ""}`} aria-label="Broken onboarding progress">
              {(mode === "dynamic" ? ["Profile", "Documents", "Tax details", "Compliance", "Review", "Finish"] : ["Profile", "Documents", "Compliance", "Review", "Finish"]).map((step, index) => {
                const failed = mode === "coloronly" && step === "Documents";
                const stale = mode === "stale" && step === "Review";
                const locked = mode === "clickable" && index > 1;
                return (
                  <li className={failed ? "is-failed" : stale || mode === "visited" ? "is-complete" : locked ? "is-locked" : index === 1 ? "is-current" : "is-pending"} key={`${step}-${index}`}>
                    {mode === "clickable" ? (
                      <button type="button">
                        <span aria-hidden="true">{index + 1}</span>
                        <strong>{step}</strong>
                        <em>{locked ? "Open" : index === 1 ? "Now" : "Done"}</em>
                      </button>
                    ) : (
                      <>
                        <span aria-hidden="true">{failed ? "!" : index + 1}</span>
                        <strong>{step}</strong>
                        <em>{failed && mode !== "coloronly" ? "Failed" : stale ? "Complete" : mode === "dynamic" ? `Step ${index + 1}` : "Done"}</em>
                      </>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
          <button type="button" className="demo-button small primary">{mode === "clickable" ? "Jump to Finish" : "Continue"}</button>
        </div>
        <p className="demo-status" aria-live="polite">{copy}</p>
      </div>
    );
  }

  if (patternId === "meter") {
    const [mode, setMode] = useState<"nomax" | "progress" | "draggable" | "coloronly" | "reversed" | "stale">("progress");
    const copy = mode === "nomax"
      ? "Total users has no meaningful maximum, so the gauge is decorative and misleading."
      : mode === "progress"
        ? "Upload completion is active task progress and should use progressbar semantics, not meter."
        : mode === "draggable"
          ? "A read-only storage gauge looks like users can drag the thumb to change the value."
          : mode === "coloronly"
            ? "Warning and critical ranges depend only on color, with no band labels or threshold text."
            : mode === "reversed"
              ? "The risk gauge reuses high-is-good styling even though lower risk is better."
              : "The meter keeps a stale value after the measurement source becomes unavailable.";
    const value = mode === "nomax" ? 72 : mode === "progress" ? 58 : mode === "draggable" ? 86 : mode === "coloronly" ? 91 : mode === "reversed" ? 82 : 64;
    const label = mode === "nomax" ? "Total users" : mode === "progress" ? "Uploading file" : mode === "reversed" ? "Fraud risk score" : mode === "stale" ? "Storage yesterday" : "Storage";

    return (
      <div className={`quality-example meter-bad-ux is-${mode}`}>
        <div className="demo-row">
          {(["nomax", "progress", "draggable", "coloronly", "reversed", "stale"] as const).map((item) => (
            <button
              type="button"
              key={item}
              className={mode === item ? "demo-button small primary" : "demo-button small"}
              onClick={() => setMode(item)}
            >
              {item === "nomax" ? "No max" : item === "progress" ? "Progress misuse" : item === "draggable" ? "Draggable" : item === "coloronly" ? "Color only" : item === "reversed" ? "Reversed good" : "Stale"}
            </button>
          ))}
        </div>
        <div className="meter-card bad">
          <div className="meter-label-row">
            <div>
              <strong>{label}</strong>
              <span>{mode === "nomax" ? "72,000 and rising" : mode === "progress" ? "58% uploaded" : mode === "reversed" ? "82 of 100" : mode === "stale" ? "64 GB used yesterday" : `${value}%`}</span>
            </div>
            <em className="meter-chip critical">{mode === "reversed" ? "Great" : mode === "stale" ? "Current" : "High"}</em>
          </div>
          <div
            className="meter-track bad"
            role={mode === "nomax" ? undefined : "meter"}
            aria-label={mode === "nomax" ? undefined : label}
            aria-valuemin={mode === "nomax" ? undefined : 0}
            aria-valuemax={mode === "nomax" ? undefined : 100}
            aria-valuenow={mode === "nomax" ? undefined : value}
            aria-valuetext={mode === "progress" ? "58 percent uploaded" : mode === "reversed" ? "82 risk score, incorrectly marked great" : undefined}
          >
            <span style={{ width: `${Math.min(value, 100)}%` }}></span>
            {(mode === "draggable" || mode === "progress") && <i className="meter-thumb" aria-hidden="true"></i>}
          </div>
          {mode === "coloronly" ? (
            <div className="meter-color-zones" aria-hidden="true">
              <span></span><span></span><span></span>
            </div>
          ) : (
            <div className="meter-scale">
              <span>{mode === "nomax" ? "0" : "0%"}</span>
              <span>{mode === "progress" ? "loading" : mode === "reversed" ? "unknown" : "middle"}</span>
              <span>{mode === "nomax" ? "?" : "100%"}</span>
            </div>
          )}
          <button type="button" className="demo-button small primary">{mode === "draggable" ? "Save meter" : mode === "progress" ? "Wait for upload" : "Continue"}</button>
        </div>
        <p className="demo-status" aria-live="polite">{copy}</p>
      </div>
    );
  }

  if (patternId === "progress-bar") {
    const [mode, setMode] = useState<"unlabeled" | "fake100" | "reset" | "wrongscope" | "stuck">("stuck");
    const value = mode === "unlabeled" ? 48 : mode === "fake100" ? 100 : mode === "reset" ? 25 : mode === "wrongscope" ? 82 : 99;
    const copy = mode === "unlabeled"
      ? "The bar has no operation name, value text, or affected object."
      : mode === "fake100"
        ? "The bar reaches 100% while server scanning is still pending."
        : mode === "reset"
          ? "The same upload jumps backward with no explanation of a new attempt or stage."
          : mode === "wrongscope"
            ? "A page-level bar implies the whole workspace is busy for one report export."
            : "The bar sits at 99% with no elapsed status, retry, cancel, or background path.";

    return (
      <div className={`quality-example progress-bar-bad-ux is-${mode}`}>
        <div className="demo-row">
          {(["unlabeled", "fake100", "reset", "wrongscope", "stuck"] as const).map((item) => (
            <button
              type="button"
              key={item}
              className={mode === item ? "demo-button small primary" : "demo-button small"}
              onClick={() => setMode(item)}
            >
              {item === "unlabeled" ? "Unlabeled" : item === "fake100" ? "Fake 100%" : item === "reset" ? "Reset" : item === "wrongscope" ? "Wrong scope" : "Stuck 99%"}
            </button>
          ))}
        </div>
        <div className="progress-bar-job-card bad">
          {mode === "wrongscope" && <div className="progress-bar-page-strip"><span style={{ width: `${value}%` }}></span></div>}
          <div className="progress-bar-card-head">
            <div>
              <strong>{mode === "unlabeled" ? "Working..." : mode === "wrongscope" ? "Dashboard" : "evidence.zip"}</strong>
              <span>{mode === "fake100" ? "Scanning continues after the bar claims complete" : mode === "reset" ? "Was 80%, now 25%" : mode === "stuck" ? "No change for 4 minutes" : "No attached label"}</span>
            </div>
            <span className="progress-bar-value error">{value}%</span>
          </div>
          <div
            className="progress-bar-track fake"
            role={mode === "unlabeled" ? undefined : "progressbar"}
            aria-label={mode === "unlabeled" ? undefined : "Misleading upload progress"}
            aria-valuemin={mode === "unlabeled" ? undefined : 0}
            aria-valuemax={mode === "unlabeled" ? undefined : 100}
            aria-valuenow={mode === "unlabeled" ? undefined : value}
          >
            <span style={{ width: `${value}%` }}></span>
          </div>
          <div className="progress-bar-actions">
            <button type="button" className="demo-button small primary">Continue</button>
            <button type="button" className="demo-button small">Refresh page</button>
          </div>
        </div>
        <p className="demo-status" aria-live="polite">{copy}</p>
      </div>
    );
  }

  if (patternId === "loading-spinner") {
    const [mode, setMode] = useState<"unlabeled" | "global" | "duplicate" | "mixed" | "stuck">("duplicate");
    const copy = mode === "unlabeled"
      ? "The spinner gives no operation name, no affected object, and no way to tell whether payment is still active."
      : mode === "global"
        ? "A full-page block interrupts unrelated work for a small payment-row refresh."
        : mode === "duplicate"
          ? "The user can submit PAY-2048 again while the first request is still busy."
          : mode === "mixed"
            ? "Spinner, skeleton, and a vague bar compete for the same payment region."
            : "The spinner remains after two minutes with no timeout, retry, cancel, or previous status.";

    return (
      <div className={`quality-example loading-spinner-bad-ux is-${mode}`}>
        <div className="demo-row">
          {(["unlabeled", "global", "duplicate", "mixed", "stuck"] as const).map((item) => (
            <button
              type="button"
              key={item}
              className={mode === item ? "demo-button small primary" : "demo-button small"}
              onClick={() => setMode(item)}
            >
              {item === "unlabeled" ? "Unlabeled" : item === "global" ? "Page block" : item === "duplicate" ? "Duplicate" : item === "mixed" ? "Mixed" : "Stuck"}
            </button>
          ))}
        </div>
        <div className="loading-spinner-payment-card bad">
          {mode === "global" && <div className="loading-spinner-global-block"><span className="spinner-only"></span><strong>Loading</strong></div>}
          <div className="loading-spinner-card-head">
            <div>
              <strong>Payment PAY-2048</strong>
              <span>Invoice balance $240.00</span>
            </div>
            <span className="loading-spinner-chip warning">{mode === "stuck" ? "2 min" : "Busy"}</span>
          </div>
          {mode === "mixed" ? (
            <div className="loading-spinner-mixed">
              <div className="skeleton-line"></div>
              <span className="spinner-only small" aria-hidden="true"></span>
              <div className="loading-spinner-fake-bar"><span></span></div>
            </div>
          ) : (
            <div className="loading-spinner-status bad">
              <span className="spinner-only" aria-hidden="true"></span>
              <span>{mode === "unlabeled" ? "" : mode === "stuck" ? "Please wait..." : "Loading"}</span>
            </div>
          )}
          <div className="loading-spinner-actions">
            <button type="button" className="demo-button small primary" onClick={() => setMode("duplicate")}>Pay $240.00</button>
            <button type="button" className="demo-button small">Open dashboard</button>
          </div>
        </div>
        <p className="demo-status" aria-live="polite">{copy}</p>
      </div>
    );
  }

  if (patternId === "banner") {
    const [mode, setMode] = useState<"stacked" | "sticky" | "local" | "stale" | "repeats">("stacked");
    const copy = {
      stacked: "Several unrelated banners compete above the page heading, so no priority is clear.",
      sticky: "A sticky banner covers the workspace action row while the user scrolls.",
      local: "A single invoice warning is promoted to a workspace banner and loses its affected row.",
      stale: "Maintenance ended, but the banner still tells users exports are paused.",
      repeats: "A dismissed rollout banner returns on every section because dismissal is not tied to message version."
    }[mode];

    return (
      <div className={`quality-example banner-bad-ux is-${mode}`}>
        <div className="product-shell-preview">
          <div className="product-shell-top">Acme Ops</div>
          {mode === "stacked" ? (
            <div className="bad-banner-stack">
              <div>Important</div>
              <div>New features</div>
              <div>Payment failed</div>
            </div>
          ) : (
            <div className={`bad-product-banner ${mode}`}>
              {mode === "sticky" ? "Please read this before continuing" : mode === "local" ? "Invoice INV-2048 missing contact" : mode === "stale" ? "Exports paused for Saturday maintenance" : "New invoice approvals are available again"}
            </div>
          )}
          <div className="product-shell-content">
            <strong>{mode === "local" ? "Invoice list" : "Billing overview"}</strong>
            <span>{mode === "sticky" ? "Primary actions are partly covered." : "Workspace content must compete with the banner."}</span>
            <button type="button" className="demo-button small primary">{mode === "local" ? "Send invoice" : "Continue"}</button>
          </div>
        </div>
        <div className="demo-row banner-controls">
          <button type="button" className="demo-button small" onClick={() => setMode("stacked")}>Stacked</button>
          <button type="button" className="demo-button small" onClick={() => setMode("sticky")}>Sticky</button>
          <button type="button" className="demo-button small" onClick={() => setMode("local")}>Local issue</button>
          <button type="button" className="demo-button small" onClick={() => setMode("stale")}>Stale</button>
          <button type="button" className="demo-button small" onClick={() => setMode("repeats")}>Repeats</button>
        </div>
        <p className="demo-status" aria-live="polite">{copy}</p>
      </div>
    );
  }

  if (patternId === "notification-banner") {
    const [mode, setMode] = useState<"validation" | "hidden" | "toast" | "global" | "stale">("validation");
    const copy = {
      validation: "A submitted-form validation error is put in a notification banner with no field links.",
      hidden: "The notice appears after the heading and task card, so users start the page without the service context.",
      toast: "The previous-page success message disappears as a toast after redirect.",
      global: "A product-wide outage is repeated as one page notification instead of a broader scoped banner.",
      stale: "The upload success remains on unrelated pages after the evidence record has been reviewed."
    }[mode];

    return (
      <div className={`quality-example notification-banner-bad-ux is-${mode}`}>
        <div className="service-page-preview">
          <div className="service-crumb">Application evidence</div>
          {mode !== "hidden" && mode !== "toast" && (
            <div className={`bad-notification-banner ${mode}`}>
              {mode === "validation" ? "Fix errors before continuing" : mode === "global" ? "All Acme services unavailable today" : "Evidence uploaded"}
            </div>
          )}
          <h3>{mode === "stale" ? "Application payments" : "Manage evidence"}</h3>
          <div className="service-page-card">
            <strong>{mode === "validation" ? "Evidence form" : "Evidence checklist"}</strong>
            <span>{mode === "hidden" ? "The notice is below this task card." : "The page content competes with the misplaced notice."}</span>
            <button type="button" className="demo-button small primary">Continue</button>
          </div>
          {mode === "hidden" && <div className="bad-notification-banner hidden">You must respond by 17 June 2026</div>}
          {mode === "toast" && <div className="alert-toast-misuse">Evidence uploaded</div>}
        </div>
        <div className="demo-row notification-banner-controls">
          <button type="button" className="demo-button small" onClick={() => setMode("validation")}>Validation</button>
          <button type="button" className="demo-button small" onClick={() => setMode("hidden")}>Hidden</button>
          <button type="button" className="demo-button small" onClick={() => setMode("toast")}>Toast</button>
          <button type="button" className="demo-button small" onClick={() => setMode("global")}>Global</button>
          <button type="button" className="demo-button small" onClick={() => setMode("stale")}>Stale</button>
        </div>
        <p className="demo-status" aria-live="polite">{copy}</p>
      </div>
    );
  }

  if (patternId === "site-alert") {
    const [mode, setMode] = useState<"home" | "stacked" | "validation" | "overcolor" | "stale">("home");
    const copy = {
      home: "The emergency message appears only on Home, so deep-linked Apply and Help users miss it.",
      stacked: "Several unrelated site alerts compete at the top of every page and hide the route context.",
      validation: "A submitted form error is published as a sitewide alert and appears on unrelated routes.",
      overcolor: "A routine newsletter notice uses emergency styling and creates unnecessary alarm.",
      stale: "A closure alert remains after offices reopen, so users distrust current service status."
    }[mode];

    return (
      <div className={`quality-example site-alert-bad-ux is-${mode}`}>
        <div className="site-alert-page-preview">
          {mode === "stacked" ? (
            <div className="bad-site-alert-stack">
              <div>Emergency closure</div>
              <div>Newsletter sign-up</div>
              <div>Fix form errors</div>
            </div>
          ) : mode !== "home" ? (
            <div className={`bad-site-alert ${mode}`}>
              {mode === "validation" ? "Fix the National Insurance number field" : mode === "overcolor" ? "Newsletter sign-up closes today" : "Offices closed because of severe weather"}
            </div>
          ) : null}
          <div className="site-alert-header">
            <strong>Benefits service</strong>
            <span>{mode === "home" ? "Apply deep link" : "All pages"}</span>
          </div>
          <main className="site-alert-page-body">
            <strong>{mode === "home" ? "Apply for support" : "Application status"}</strong>
            <span>{mode === "home" ? "This deep-linked page has no alert even though offices are closed." : "Local content competes with a misplaced or stale sitewide message."}</span>
            <button type="button" className="demo-button small primary">Continue</button>
          </main>
        </div>
        <div className="demo-row site-alert-controls">
          <button type="button" className={mode === "home" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("home")}>Home-only</button>
          <button type="button" className={mode === "stacked" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("stacked")}>Stacked</button>
          <button type="button" className={mode === "validation" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("validation")}>Validation</button>
          <button type="button" className={mode === "overcolor" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("overcolor")}>Overcolored</button>
          <button type="button" className={mode === "stale" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("stale")}>Stale</button>
        </div>
        <p className="demo-status" aria-live="polite">{copy}</p>
      </div>
    );
  }

  if (patternId === "consent-prompt") {
    type Mode = "continue-to-agree" | "preselected" | "bundled-purpose" | "hidden-decline" | "processed-before-consent" | "no-withdrawal" | "record-only";
    const [mode, setMode] = useState<Mode>("continue-to-agree");
    const copy: Record<Mode, string> = {
      "continue-to-agree": "Continue-to-agree treats navigation or inactivity as consent instead of requiring clear affirmative action.",
      preselected: "Preselected optional choices use default bias for research, marketing, and AI training before the user chooses.",
      "bundled-purpose": "Bundled-purpose combines marketing, research, partner sharing, personalization, and AI training into one vague agreement.",
      "hidden-decline": "Hidden-decline makes refusal harder than acceptance and undermines freely given consent.",
      "processed-before-consent": "Processed-before-consent starts optional sharing before the prompt records an affirmative choice.",
      "no-withdrawal": "No-withdrawal lets users opt in but gives no stable route to revoke consent later.",
      "record-only": "Record-only stores accepted=true without purpose, requester, copy version, data type, timestamp, or withdrawal state."
    };

    return (
      <div className={`quality-example consent-prompt-bad-ux is-${mode}`}>
        <div className="consent-service-preview">
          <div className="consent-service-top">
            <strong>Research workspace</strong>
            <span>{mode === "processed-before-consent" ? "Processing active" : "Consent failure"}</span>
          </div>
          <section className={`consent-prompt-card bad ${mode}`} aria-label="Broken consent prompt">
            <div>
              <strong>{mode === "no-withdrawal" ? "Thanks for helping us improve" : mode === "record-only" ? "Consent stored" : "Improve your experience"}</strong>
              <span>{mode === "continue-to-agree" ? "Continue to agree to optional research and offers." : mode === "preselected" ? "These optional choices are already selected for you." : mode === "bundled-purpose" ? "Agree to all optional product improvement uses." : mode === "hidden-decline" ? "Accept now, or find other options in the privacy policy." : mode === "processed-before-consent" ? "Your survey answer has already been shared with the research system." : mode === "no-withdrawal" ? "Your choice is saved permanently." : "The database has a boolean consent flag but no purpose details."}</span>
            </div>
            {mode === "preselected" ? (
              <div className="consent-choice-list bad">
                <label><input type="checkbox" checked readOnly /> Research follow-up <span>Already selected</span></label>
                <label><input type="checkbox" checked readOnly /> Marketing emails <span>Already selected</span></label>
                <label><input type="checkbox" checked readOnly /> AI training <span>Already selected</span></label>
              </div>
            ) : null}
            <div className="consent-prompt-actions">
              <button type="button" className="demo-button small primary">{mode === "record-only" ? "Set accepted=true" : "Accept all"}</button>
              {mode === "hidden-decline" ? <a href="#privacy">Other options</a> : null}
              {mode === "continue-to-agree" ? <button type="button" className="demo-button small">Continue</button> : null}
              {mode !== "hidden-decline" && mode !== "continue-to-agree" ? <button type="button" className="demo-button small">Save</button> : null}
            </div>
          </section>
          <div className="consent-record-grid bad">
            <div>
              <span>Runtime</span>
              <strong>{mode === "processed-before-consent" ? "Optional processing already started" : mode === "no-withdrawal" ? "No withdrawal route" : "Choice quality weak"}</strong>
            </div>
            <div>
              <span>Record</span>
              <strong>{mode === "record-only" ? "accepted=true" : "Cannot prove specific opt-in"}</strong>
            </div>
          </div>
        </div>
        <div className="demo-row consent-prompt-controls">
          <button type="button" className={mode === "continue-to-agree" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("continue-to-agree")}>Continue-to-agree</button>
          <button type="button" className={mode === "preselected" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("preselected")}>Preselected</button>
          <button type="button" className={mode === "bundled-purpose" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("bundled-purpose")}>Bundled-purpose</button>
          <button type="button" className={mode === "hidden-decline" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hidden-decline")}>Hidden-decline</button>
          <button type="button" className={mode === "processed-before-consent" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("processed-before-consent")}>Processed-before-consent</button>
          <button type="button" className={mode === "no-withdrawal" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("no-withdrawal")}>No-withdrawal</button>
          <button type="button" className={mode === "record-only" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("record-only")}>Record-only</button>
        </div>
        <p className="demo-status" aria-live="polite">{copy[mode]}</p>
      </div>
    );
  }

  if (patternId === "cookie-banner") {
    const [mode, setMode] = useState<"acceptOnly" | "prechecked" | "preload" | "contrast" | "sticky" | "noWithdraw">("acceptOnly");
    const copy = {
      acceptOnly: "Accept-only banners do not give users a real first-layer way to refuse non-essential cookies.",
      prechecked: "Preselected optional purposes turn settings into implied consent rather than a deliberate choice.",
      preload: "Tracking-before-consent means the banner is disconnected from the runtime behavior it claims to control.",
      contrast: "Misleading contrast makes reject look unavailable while accept remains prominent.",
      sticky: "A sticky consent wall obscures focused content and makes access depend on clearing the banner.",
      noWithdraw: "No withdrawal route leaves users unable to change consent after the first visit."
    }[mode];

    return (
      <div className={`quality-example cookie-banner-bad-ux is-${mode}`}>
        <div className="cookie-service-preview">
          <div className="cookie-service-top">
            <strong>Benefits service</strong>
            <span>{mode === "preload" ? "Scripts running" : "Consent prompt"}</span>
          </div>
          <section className={`cookie-banner-card bad ${mode}`} aria-label="Broken cookie consent">
            <div>
              <strong>{mode === "preload" ? "Cookies notice" : mode === "sticky" ? "Accept cookies to continue" : "We use cookies"}</strong>
              <span>{mode === "acceptOnly" ? "We use cookies to improve your experience." : mode === "prechecked" ? "Choose which optional purposes to keep enabled." : mode === "preload" ? "Analytics has already recorded this page view." : mode === "contrast" ? "Accept all or use the small grey refusal link." : mode === "sticky" ? "The service is blocked until you make this go away." : "Your earlier choice is stored permanently."}</span>
            </div>
            {mode === "prechecked" ? (
              <div className="cookie-purpose-list bad">
                <label><input type="checkbox" checked readOnly /> Analytics cookies <span>Already selected</span></label>
                <label><input type="checkbox" checked readOnly /> Advertising cookies <span>Already selected</span></label>
                <label><input type="checkbox" checked readOnly /> Partner cookies <span>Already selected</span></label>
              </div>
            ) : null}
            <div className="cookie-banner-actions">
              <button type="button" className="demo-button small primary">{mode === "noWithdraw" ? "Continue" : "Accept all"}</button>
              {mode === "acceptOnly" ? <a href="#settings">Manage settings</a> : null}
              {mode === "contrast" ? <button type="button" className="demo-button small ghosted">Reject all</button> : null}
              {mode === "sticky" ? <button type="button" className="demo-button small">Later</button> : null}
              {mode !== "acceptOnly" && mode !== "contrast" && mode !== "sticky" ? <button type="button" className="demo-button small">Save</button> : null}
            </div>
          </section>
          <div className={`cookie-runtime-panel ${mode === "preload" || mode === "prechecked" ? "bad" : ""}`}>
            <strong>{mode === "preload" ? "Optional tags already fired" : mode === "noWithdraw" ? "No cookies link in footer" : "Consent risk"}</strong>
            <span>{mode === "preload" ? "Analytics, advertising, and heatmap scripts loaded before consent." : mode === "prechecked" ? "Settings default to acceptance for optional purposes." : mode === "sticky" ? "Focused content can be covered by the fixed overlay." : mode === "noWithdraw" ? "Users cannot review or withdraw the stored choice." : "The visible controls steer users toward acceptance."}</span>
          </div>
        </div>
        <div className="demo-row cookie-banner-controls">
          <button type="button" className={mode === "acceptOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("acceptOnly")}>Accept-only</button>
          <button type="button" className={mode === "prechecked" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("prechecked")}>Preselected</button>
          <button type="button" className={mode === "preload" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("preload")}>Tracking first</button>
          <button type="button" className={mode === "contrast" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("contrast")}>Deceptive contrast</button>
          <button type="button" className={mode === "sticky" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("sticky")}>Sticky block</button>
          <button type="button" className={mode === "noWithdraw" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noWithdraw")}>No withdrawal</button>
        </div>
        <p className="demo-status" aria-live="polite">{copy}</p>
      </div>
    );
  }

  if (patternId === "phase-beta-banner") {
    const [mode, setMode] = useState<"stale" | "publicAlpha" | "outage" | "featureBadge" | "routeBlindFeedback" | "dismissible">("stale");
    const copy = {
      stale: "A stale Beta label undermines confidence because no owner removes it when the service becomes live.",
      publicAlpha: "A public Alpha banner makes a prototype look like a usable public service before the team is ready.",
      outage: "Outage copy in the phase slot hides operational urgency behind a maturity label.",
      featureBadge: "Feature-level Beta copy does not explain the maturity of the whole service or collect service feedback.",
      routeBlindFeedback: "Route-blind feedback loses the page and step that made the phase banner useful to the team.",
      dismissible: "A dismissible phase marker lets deep-linked and returning users miss the service maturity signal."
    }[mode];
    const title = {
      stale: "Beta",
      publicAlpha: "Alpha",
      outage: "Beta",
      featureBadge: "New beta tool",
      routeBlindFeedback: "Beta",
      dismissible: "Beta"
    }[mode];
    const message = {
      stale: "This stable live service still says it is being tested.",
      publicAlpha: "Use this public application service now.",
      outage: "Payments are unavailable today.",
      featureBadge: "Try the redesigned calculator.",
      routeBlindFeedback: "Send comments through the main contact form.",
      dismissible: "This is a new service. You can hide this message."
    }[mode];

    return (
      <div className={`quality-example phase-banner-bad-ux is-${mode}`}>
        <div className="phase-service-preview">
          <div className="phase-service-top bad">
            <strong>Benefits service</strong>
            <span>{mode === "outage" ? "Operational status" : "Phase misuse"}</span>
          </div>
          <nav className="phase-service-nav" aria-label="Broken service sections">
            <span>Overview</span>
            <span>Apply</span>
            <span>Messages</span>
          </nav>
          <section className={`phase-banner-card bad ${mode}`} aria-label="Broken phase banner">
            <strong>{title}</strong>
            <span>{message}</span>
            {mode === "dismissible" ? <button type="button" className="demo-button small">Dismiss</button> : null}
          </section>
          <div className="phase-service-body">
            <strong>{mode === "publicAlpha" ? "Public application" : mode === "outage" ? "Apply for support" : "Benefits dashboard"}</strong>
            <span>{mode === "routeBlindFeedback" ? "Feedback opens without page, step, or draft context." : mode === "featureBadge" ? "The whole service is live, but one tool is being promoted as beta." : "The phase signal is not synchronized with access, status, and ownership."}</span>
          </div>
          <div className="phase-record-grid">
            <div>
              <span>Phase record</span>
              <strong>{mode === "stale" ? "Live assessment passed last quarter" : mode === "publicAlpha" ? "Prototype exposed to public users" : mode === "outage" ? "Incident hidden in phase slot" : mode === "featureBadge" ? "Feature badge, not service phase" : mode === "routeBlindFeedback" ? "No route data captured" : "Hidden after first view"}</strong>
            </div>
            <div>
              <span>User impact</span>
              <strong>{mode === "outage" ? "Urgent status is easy to miss" : mode === "dismissible" ? "Later routes lack phase context" : "Maturity and feedback expectations are unclear"}</strong>
            </div>
          </div>
        </div>
        <div className="demo-row phase-banner-controls">
          <button type="button" className={mode === "stale" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("stale")}>Stale beta</button>
          <button type="button" className={mode === "publicAlpha" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("publicAlpha")}>Public alpha</button>
          <button type="button" className={mode === "outage" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("outage")}>Outage misuse</button>
          <button type="button" className={mode === "featureBadge" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("featureBadge")}>Feature badge</button>
          <button type="button" className={mode === "routeBlindFeedback" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("routeBlindFeedback")}>Route-blind feedback</button>
          <button type="button" className={mode === "dismissible" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("dismissible")}>Dismissible</button>
        </div>
        <p className="demo-status" aria-live="polite">{copy}</p>
      </div>
    );
  }

  if (patternId === "notification-center") {
    const [mode, setMode] = useState<"badge" | "lost" | "critical" | "duplicates" | "stale">("badge");
    const copy = {
      badge: "The badge count never clears because unseen, unread, and total counts are treated as one number.",
      lost: "Expired toasts disappear with no center record, so users cannot recover an export reference.",
      critical: "A checkout-blocking payment failure is hidden in the center instead of appearing in the task.",
      duplicates: "Repeated low-value messages inflate the center and make real work hard to triage.",
      stale: "Resolved notifications still show active actions for completed or inaccessible objects."
    }[mode];

    return (
      <div className={`quality-example notification-center-bad-ux is-${mode}`}>
        <div className="notification-center-shell">
          <div className="notification-center-topbar bad">
            <strong>Ops workspace</strong>
            <button type="button" aria-label="Notifications, count unclear">Bell {mode === "lost" ? "0" : "42"}</button>
          </div>
          <aside className="notification-center-panel bad" aria-label="Broken notification center">
            <div className="notification-center-panel-head">
              <strong>{mode === "critical" ? "Notifications" : "Updates"}</strong>
              <span>{mode === "lost" ? "No history" : "42"}</span>
            </div>
            <div className="bad-notification-center-list">
              {mode === "duplicates" ? (
                <>
                  <div>Done</div>
                  <div>Done</div>
                  <div>Done</div>
                  <div>Done</div>
                </>
              ) : mode === "critical" ? (
                <div>Payment failed, but checkout screen says continue.</div>
              ) : mode === "stale" ? (
                <div>Approve vendor request that was already withdrawn.</div>
              ) : mode === "lost" ? (
                <div>Export toast expired. No download record remains.</div>
              ) : (
                <div>42 items, no unread filter or read state.</div>
              )}
            </div>
          </aside>
        </div>
        <div className="demo-row notification-center-controls">
          <button type="button" className={mode === "badge" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("badge")}>Badge stuck</button>
          <button type="button" className={mode === "lost" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("lost")}>Lost history</button>
          <button type="button" className={mode === "critical" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("critical")}>Hidden critical</button>
          <button type="button" className={mode === "duplicates" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("duplicates")}>Duplicates</button>
          <button type="button" className={mode === "stale" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("stale")}>Stale</button>
        </div>
        <p className="demo-status" aria-live="polite">{copy}</p>
      </div>
    );
  }

  if (patternId === "warning-text") {
    const [mode, setMode] = useState<"buried" | "color" | "overuse" | "after" | "validation">("buried");
    const copy = {
      buried: "The fine warning is written like ordinary hint text and appears after supporting copy.",
      color: "Color is the only warning signal, so the consequence loses meaning without visual styling.",
      overuse: "Every hint uses warning styling, making the severe legal consequence indistinguishable.",
      after: "The consequence appears only after submission, when users can no longer change the answer.",
      validation: "A failed-submit correction is shown as warning text instead of linked error recovery."
    }[mode];

    return (
      <div className={`quality-example warning-text-bad-ux is-${mode}`}>
        <div className="warning-text-form bad">
          <h4>{mode === "validation" ? "Application form" : "Submit application"}</h4>
          {mode === "overuse" ? (
            <div className="bad-warning-stack">
              <div>Warning: select all that apply.</div>
              <div>Warning: reference numbers have 8 digits.</div>
              <div>Warning: you may be fined for false information.</div>
            </div>
          ) : mode === "color" ? (
            <p className="bad-warning-color-only">You may be fined if you give false information.</p>
          ) : mode === "after" ? null : mode === "validation" ? (
            <div className="warning-text-card bad-validation">
              <span className="warning-text-icon" aria-hidden="true">!</span>
              <strong>Enter your National Insurance number.</strong>
            </div>
          ) : (
            <p className="bad-warning-buried">You can use this service to apply online. You may be fined if you give false information.</p>
          )}
          <label className="warning-text-check">
            <input type="checkbox" />
            I confirm the details are correct.
          </label>
          <button type="button" className="demo-button small primary">Submit</button>
          {mode === "after" && <div className="warning-text-card bad-after"><span className="warning-text-icon" aria-hidden="true">!</span><strong>You may be fined if this is wrong.</strong></div>}
        </div>
        <div className="demo-row warning-text-controls">
          <button type="button" className={mode === "buried" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("buried")}>Buried</button>
          <button type="button" className={mode === "color" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("color")}>Color only</button>
          <button type="button" className={mode === "overuse" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("overuse")}>Overused</button>
          <button type="button" className={mode === "after" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("after")}>After action</button>
          <button type="button" className={mode === "validation" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("validation")}>Validation</button>
        </div>
        <p className="demo-status" aria-live="polite">{copy}</p>
      </div>
    );
  }

  if (patternId === "success-confirmation") {
    const [mode, setMode] = useState<"vague" | "premature" | "disappears" | "no-next" | "stale">("vague");
    const copy = {
      vague: "The success message says Done but does not identify the changed object or proof.",
      premature: "The UI shows success while the upload is still pending, so failure can contradict the confirmation.",
      disappears: "The only receipt reference is put in a message that vanishes before users can copy it.",
      "no-next": "The upload is confirmed, but there is no route to view, copy, or continue from the receipt.",
      stale: "A success message for the previous customer remains visible after users switch tasks."
    }[mode];

    return (
      <div className={`quality-example success-confirmation-bad-ux is-${mode}`}>
        <div className="success-confirmation-workspace bad">
          <h4>{mode === "stale" ? "Customer B evidence" : "Evidence upload"}</h4>
          {mode === "vague" ? (
            <div className="bad-success-strip">Done</div>
          ) : mode === "premature" ? (
            <div className="bad-success-panel premature">
              <strong>Upload complete</strong>
              <span>Server response still pending...</span>
            </div>
          ) : mode === "disappears" ? (
            <div className="bad-success-toast">Receipt EV-2048 created</div>
          ) : mode === "no-next" ? (
            <div className="bad-success-panel">
              <strong>Evidence uploaded</strong>
              <span>Receipt EV-2048 created.</span>
            </div>
          ) : (
            <div className="bad-success-panel stale">
              <strong>Customer A evidence uploaded</strong>
              <span>Receipt EV-1021 is still shown in Customer B.</span>
            </div>
          )}
          <div className="success-confirmation-task">
            <strong>{mode === "stale" ? "Customer B checklist" : "Evidence checklist"}</strong>
            <span>{mode === "premature" ? "Upload progress 62 percent." : mode === "disappears" ? "Receipt will not be available after toast expiry." : "The task area does not provide reliable success proof."}</span>
            <button type="button" className="demo-button small primary">{mode === "no-next" ? "Continue" : "Upload"}</button>
          </div>
        </div>
        <div className="demo-row success-confirmation-controls">
          <button type="button" className={mode === "vague" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("vague")}>Vague</button>
          <button type="button" className={mode === "premature" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("premature")}>Premature</button>
          <button type="button" className={mode === "disappears" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("disappears")}>Disappears</button>
          <button type="button" className={mode === "no-next" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("no-next")}>No next step</button>
          <button type="button" className={mode === "stale" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("stale")}>Stale</button>
        </div>
        <p className="demo-status" aria-live="polite">{copy}</p>
      </div>
    );
  }

  if (patternId === "confirmation-page") {
    const [mode, setMode] = useState<"toast" | "editable" | "overloaded" | "no-next" | "error">("toast");
    const copy = {
      toast: "The transaction ends with a disposable message, so users cannot later find proof.",
      editable: "The committed receipt still offers pre-submit Change links, creating false edit expectations.",
      overloaded: "Too many equal actions bury the completion proof and next-step timing.",
      "no-next": "The page confirms completion but omits who responds, when, and how to contact support.",
      error: "A failed permission request is styled as a completed transaction."
    }[mode];

    return (
      <div className={`quality-example confirmation-page-bad-ux is-${mode}`}>
        <div className="confirmation-page-frame bad">
          {mode === "toast" ? (
            <div className="bad-confirmation-toast">Application sent</div>
          ) : mode === "editable" ? (
            <>
              <div className="confirmation-page-panel muted">
                <span aria-hidden="true">✓</span>
                <div>
                  <h4>Application complete</h4>
                  <p>Reference APP-48291.</p>
                </div>
              </div>
              <div className="bad-confirmation-links">
                <button type="button">Change applicant</button>
                <button type="button">Change evidence</button>
                <button type="button">Change declaration</button>
              </div>
            </>
          ) : mode === "overloaded" ? (
            <div className="bad-confirmation-overload">
              <div>Application complete</div>
              <div>Newsletter</div>
              <div>Upgrade plan</div>
              <div>Partner offers</div>
              <div>Explore dashboard</div>
            </div>
          ) : mode === "no-next" ? (
            <div className="confirmation-page-panel muted">
              <span aria-hidden="true">✓</span>
              <div>
                <h4>Complete</h4>
                <p>Reference APP-48291.</p>
              </div>
            </div>
          ) : (
            <div className="confirmation-page-panel error">
              <span aria-hidden="true">!</span>
              <div>
                <h4>Request complete</h4>
                <p>You do not have permission to submit this application.</p>
              </div>
            </div>
          )}
          <div className="confirmation-page-section compact">
            <strong>{mode === "error" ? "Permission state" : "Receipt area"}</strong>
            <span>{mode === "no-next" ? "No owner, timing, tracking path, or contact route is given." : "The page no longer behaves like a reliable endpoint receipt."}</span>
          </div>
        </div>
        <div className="demo-row confirmation-page-controls">
          <button type="button" className={mode === "toast" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("toast")}>Toast only</button>
          <button type="button" className={mode === "editable" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("editable")}>Still editable</button>
          <button type="button" className={mode === "overloaded" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("overloaded")}>Overloaded</button>
          <button type="button" className={mode === "no-next" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("no-next")}>No next step</button>
          <button type="button" className={mode === "error" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("error")}>Error misuse</button>
        </div>
        <p className="demo-status" aria-live="polite">{copy}</p>
      </div>
    );
  }

  if (patternId === "alert") {
    const [mode, setMode] = useState<"toast" | "silent" | "vague" | "modal" | "scope">("toast");
    const copy = {
      toast: "The session warning disappears like a toast, leaving unsaved work at risk.",
      silent: "Connection loss changes the interface visually but provides no alert or status announcement.",
      vague: "The alert names a severity but not the affected task, consequence, or next step.",
      modal: "A modal-style acknowledgement interrupts the task even though no decision is needed.",
      scope: "A product-wide outage is repeated inside one task instead of using a broader notice surface."
    }[mode];

    return (
      <div className={`quality-example alert-bad-ux is-${mode}`}>
        <div className="alert-work-card">
          <strong>{mode === "scope" ? "All services" : "Quarterly filing draft"}</strong>
          <span>{mode === "silent" ? "Submit button quietly disabled." : "Current task remains in progress."}</span>
          <button type="button" className="demo-button small primary" disabled={mode === "silent"}>{mode === "silent" ? "Submit disabled" : "Continue"}</button>
        </div>
        {mode === "modal" ? (
          <div className="alert-modal-misuse" role="dialog" aria-label="Unhelpful acknowledgement">
            <strong>Alert</strong>
            <p>Something needs attention.</p>
            <button type="button" className="demo-button small">OK</button>
          </div>
        ) : (
          <div className={`alert-toast-misuse ${mode}`}>
            {mode === "toast" ? "Session expires soon" : mode === "scope" ? "Service outage across every workspace" : mode === "silent" ? "" : "Warning"}
          </div>
        )}
        <div className="demo-row alert-controls">
          <button type="button" className="demo-button small" onClick={() => setMode("toast")}>Expires</button>
          <button type="button" className="demo-button small" onClick={() => setMode("silent")}>Silent</button>
          <button type="button" className="demo-button small" onClick={() => setMode("vague")}>Vague</button>
          <button type="button" className="demo-button small" onClick={() => setMode("modal")}>Modal OK</button>
          <button type="button" className="demo-button small" onClick={() => setMode("scope")}>Wrong scope</button>
        </div>
        <p className="demo-status" aria-live="polite">{copy}</p>
      </div>
    );
  }

  if (patternId === "toast-only-success-for-completed-transaction") return <ToastOnlySuccessTransactionBadUx />;

  if (patternId === "toast-notification") {
    const [mode, setMode] = useState<"spam" | "critical" | "vague" | "covered">("spam");
    const copy = {
      spam: "Every autosave tick creates another toast, so users learn to ignore status feedback.",
      critical: "A payment failure and support code are placed in a disappearing toast with no persistent recovery.",
      vague: "The message says Done without naming the object, action, or result.",
      covered: "The toast stack covers the Continue button and blocks the task it should not interrupt."
    }[mode];

    return (
      <div className={`quality-example toast-demo-shell toast-bad-ux is-${mode}`}>
        <div className="toast-work-area">
          <strong>Invoice workspace</strong>
          <span>{mode === "covered" ? "Primary action is hidden under status messages." : "Status layer competes with the task."}</span>
          <button type="button" className="demo-button small primary">Continue</button>
        </div>
        <div className="toast-stack bad" aria-label="Problem toast behavior">
          {mode === "critical" ? (
            <div className="toast-card bad critical">Payment failed. Code PAY-9482. Retry, update card, or contact billing before leaving.</div>
          ) : mode === "vague" ? (
            <div className="toast-card bad">Done</div>
          ) : (
            ["Saved", "Saved", "Saved", "Synced"].map((item, index) => <div className="toast-card bad" key={`${item}-${index}`}>{item}</div>)
          )}
        </div>
        <div className="demo-row toast-controls">
          <button type="button" className="demo-button small" onClick={() => setMode("spam")}>Spam</button>
          <button type="button" className="demo-button small" onClick={() => setMode("critical")}>Critical only</button>
          <button type="button" className="demo-button small" onClick={() => setMode("vague")}>Vague</button>
          <button type="button" className="demo-button small" onClick={() => setMode("covered")}>Covers task</button>
        </div>
        <p className="demo-status" aria-live="polite">{copy}</p>
      </div>
    );
  }

  if (patternId === "inline-message") {
    const [mode, setMode] = useState<"detached" | "field" | "blocking" | "stale">("detached");
    const copy = {
      detached: "A local invoice warning appears above the page and does not identify the affected row.",
      field: "A field-format correction is presented as a section message instead of beside the input.",
      blocking: "A failed invoice load is reduced to a small note without retry, fallback, or support action.",
      stale: "The contact is fixed, but the inline message remains and keeps the row looking risky."
    }[mode];

    return (
      <div className={`quality-example inline-message-bad-ux is-${mode}`}>
        <div className="inline-message-detached">
          {mode === "field" ? "Amount must use dollars and cents." : mode === "blocking" ? "Could not load invoice." : mode === "stale" ? "Billing contact missing." : "Important: check this before continuing."}
        </div>
        <div className="invoice-row-preview">
          <strong>{mode === "blocking" ? "Invoice unavailable" : "INV-2048"}</strong>
          <span>{mode === "stale" ? "Acme Retail - contact added" : "Acme Retail"}</span>
          <button type="button" className="demo-button small primary">{mode === "blocking" ? "Open" : "Send"}</button>
        </div>
        {mode === "field" && (
          <label className="inline-message-field-misuse">
            Amount
            <input value="4820" readOnly />
          </label>
        )}
        <div className="demo-row inline-message-controls">
          <button type="button" className="demo-button small" onClick={() => setMode("detached")}>Detached</button>
          <button type="button" className="demo-button small" onClick={() => setMode("field")}>Field issue</button>
          <button type="button" className="demo-button small" onClick={() => setMode("blocking")}>Blocking failure</button>
          <button type="button" className="demo-button small" onClick={() => setMode("stale")}>Stale</button>
        </div>
        <p className="demo-status" aria-live="polite">{copy}</p>
      </div>
    );
  }

  if (patternId === "loading-skeleton") {
    const [message, setMessage] = useState("Still loading. No timeout, no status change, fake rows can receive focus.");
    return (
      <div className="quality-example">
        <div className="skeleton-bad-ui bad-state-sample">
          {["Open report", "Export CSV", "Delete"].map((item) => (
            <button type="button" className="fake-skeleton-control" key={item} onClick={() => setMessage(`${item} was a placeholder, not real content.`)}>
              {item}
            </button>
          ))}
        </div>
        <p className="demo-status">{message}</p>
      </div>
    );
  }

  if (patternId === "error-state") {
    const [message, setMessage] = useState("Draft: Compare vendor exposure");
    return (
      <div className="quality-example">
        <button type="button" className="demo-button small" onClick={() => setMessage("Something went wrong. Draft cleared.")}>Load reports</button>
        <div className="demo-toast error-toast-preview">Something went wrong</div>
        <p className="demo-status">{message}</p>
      </div>
    );
  }

  if (patternId === "empty-state") {
    const [message, setMessage] = useState("Blank area; user cannot tell if it is loading, filtered, failed, or empty.");
    return (
      <div className="quality-example">
        <div className="bad-state-sample empty-state-bad-ui" onClick={() => setMessage("Click did nothing; no object name, cause, or next step exists.")}>
          <div className="blank-table-line"></div>
          <div className="blank-table-line"></div>
          <div className="blank-table-line"></div>
        </div>
        <p className="demo-status">{message}</p>
      </div>
    );
  }

  return (
    <div className="quality-example">
      {patternId === "toast-only-critical-error" ? (
        <div className="toast-only-flow">
          <div className="invoice-summary">
            <strong>Invoice INV-2048</strong>
            <span>Unpaid</span>
          </div>
          <div className="demo-row">
            <button
              type="button"
              className="demo-button small"
              onClick={() => {
                setShowToast(true);
                setToastExpired(false);
              }}
            >
              Pay invoice
            </button>
            <button
              type="button"
              className="demo-button small"
              disabled={!showToast}
              onClick={() => {
                setShowToast(false);
                setToastExpired(true);
              }}
            >
              Toast expires
            </button>
          </div>
          {showToast && <div className="demo-toast error-toast-preview" role="alert">Payment failed</div>}
          <p className="demo-status" aria-live="polite">
            {toastExpired ? "Toast is gone; invoice still unpaid and no recovery action remains." : showToast ? "Only a temporary toast explains the failed payment." : "Invoice has a pay button, but no persistent failure surface."}
          </p>
        </div>
      ) : (
        <>
          <div className="bad-state-sample">
            {patternId === "loading-skeleton" || patternId === "infinite-spinner" ? <span className="spinner-only"></span> : <span>{patternId === "empty-state" ? "" : "Error"}</span>}
          </div>
          <p className="demo-status">{meta.subject}: no next action.</p>
        </>
      )}
    </div>
  );
}

const toastOnlySuccessGoodModes: Array<{ mode: ToastOnlySuccessTransactionMode; label: string }> = [
  { mode: "receipt", label: "Receipt" },
  { mode: "supplementalToast", label: "Supplemental toast" },
  { mode: "toastExpired", label: "Toast expired" },
  { mode: "copyReference", label: "Copy reference" },
  { mode: "saveReceipt", label: "Save receipt" },
  { mode: "emailReceipt", label: "Email receipt" },
  { mode: "trackStatus", label: "Track" },
  { mode: "bookmarkReturn", label: "Bookmark return" },
  { mode: "startAnother", label: "Start another" },
  { mode: "duplicateGuard", label: "Duplicate-submit" },
  { mode: "pendingNotSuccess", label: "Pending-not-success" },
  { mode: "failedNotSuccess", label: "Failed-not-success" },
  { mode: "printReceipt", label: "Print receipt" },
  { mode: "amendCancel", label: "Amend or cancel" },
  { mode: "mobileReceipt", label: "Mobile receipt" }
];

const toastOnlySuccessBadModes: Array<{ mode: ToastOnlySuccessTransactionBadMode; label: string }> = [
  { mode: "disappearedProof", label: "Disappeared proof" },
  { mode: "noReference", label: "No reference" },
  { mode: "dashboardRedirect", label: "Dashboard redirect" },
  { mode: "falseCommit", label: "False commit" },
  { mode: "screenReaderTimeout", label: "Screen reader" },
  { mode: "duplicateSubmit", label: "Duplicate submit" },
  { mode: "genericDone", label: "Generic done" },
  { mode: "lostBookingDetails", label: "Lost booking details" }
];

function ToastOnlySuccessTransactionGoodUx() {
  const [mode, setMode] = useState<ToastOnlySuccessTransactionMode>("receipt");
  return (
    <div className="quality-example toast-only-success-demo">
      <ToastOnlySuccessTransactionPanel mode={mode} idSuffix="good-ux" />
      <div className="demo-row toast-only-success-controls">
        {toastOnlySuccessGoodModes.map((item) => (
          <button
            type="button"
            className={mode === item.mode ? "demo-button small primary" : "demo-button small"}
            key={item.mode}
            onClick={() => setMode(item.mode)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">
        {mode}: reference, receipt, what happens next, screen reader persistence, and transaction recovery stay available.
      </p>
    </div>
  );
}

function ToastOnlySuccessTransactionBadUx() {
  const [mode, setMode] = useState<ToastOnlySuccessTransactionBadMode>("disappearedProof");
  return (
    <div className="quality-example toast-only-success-bad-ux">
      <ToastOnlySuccessTransactionBadPanel mode={mode} />
      <div className="demo-row toast-only-success-controls">
        {toastOnlySuccessBadModes.map((item) => (
          <button
            type="button"
            className={mode === item.mode ? "demo-button small primary" : "demo-button small"}
            key={item.mode}
            onClick={() => setMode(item.mode)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">
        {mode}: toast-only success hides proof, reference, receipt, or duplicate-submit protection.
      </p>
    </div>
  );
}

function GoodUiExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <StateUi patternId={patternId} meta={meta} good />;
}

function BadUiExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <StateUi patternId={patternId} meta={meta} />;
}

function GoodUxExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <StateGoodUx patternId={patternId} meta={meta} />;
}

function BadUxExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <StateBadUx patternId={patternId} meta={meta} />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
