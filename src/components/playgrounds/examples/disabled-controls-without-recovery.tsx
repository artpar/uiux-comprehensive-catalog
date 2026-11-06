import { useState } from "react";
import { QualityPanel, type PatternMeta } from './shared';

function DisabledControlsRecoveryGoodUi() {
  return (
    <div className="disabled-recovery-card" aria-label="Recoverable disabled controls">
      <div className="disabled-recovery-topline">
        <div>
          <strong>Invite teammate</strong>
          <span>Two requirements are blocking the send action.</span>
        </div>
        <span className="disabled-recovery-chip warning">Blocked with route</span>
      </div>
      <div className="disabled-recovery-map" aria-label="Invite prerequisites">
        <div className="is-done">
          <span>1</span>
          <strong>Email entered</strong>
          <small>maya@example.com is valid.</small>
        </div>
        <div className="is-missing">
          <span>2</span>
          <strong>Billing contact missing</strong>
          <small>Add a billing contact before sending external invites.</small>
        </div>
        <div className="is-missing">
          <span>3</span>
          <strong>Owner approval needed</strong>
          <small>Priya can approve external collaborator access.</small>
        </div>
      </div>
      <div className="disabled-recovery-actions">
        <button type="button" className="demo-button small" disabled>Invite teammate</button>
        <button type="button" className="demo-button small primary">Add billing contact</button>
        <button type="button" className="demo-button small">Request owner approval</button>
      </div>
      <p className="demo-status">The inactive primary action is paired with visible requirements and reachable recovery controls.</p>
    </div>
  );
}

function DisabledControlsRecoveryBadUi() {
  return (
    <div className="disabled-recovery-card bad" aria-label="Dead disabled controls">
      <div className="disabled-recovery-topline">
        <div>
          <strong>Invite teammate</strong>
          <span>External collaborator</span>
        </div>
        <span className="disabled-recovery-chip bad">Unavailable</span>
      </div>
      <input value="maya@example.com" readOnly aria-label="Invite email without recovery" />
      <div className="disabled-recovery-actions">
        <button type="button" className="demo-button small" disabled title="Not available">Invite teammate</button>
        <button type="button" className="demo-button small" disabled>Save draft</button>
      </div>
      <p className="demo-status">The UI shows disabled controls but no requirement, owner, retry, fallback, or support route.</p>
    </div>
  );
}

function DisabledControlsRecoveryGoodUx({ meta }: { meta: PatternMeta }) {
  type GoodMode = "prerequisiteMap" | "missingFields" | "permissionRequest" | "dependencyUnlock" | "savingRetry" | "offlineFallback" | "roleLimited" | "adminManaged" | "expiredSession" | "alternativeRoute";
  const [mode, setMode] = useState<GoodMode>("prerequisiteMap");
  const states: Record<GoodMode, { label: string; chip: string; title: string; detail: string; primary: string; secondary: string; status: string; items: [string, string, string][]; tone?: string }> = {
    prerequisiteMap: {
      label: "Prerequisite map",
      chip: "Checklist",
      title: "Invite blocked by two visible requirements",
      detail: "Email is valid. Billing contact and owner approval remain.",
      primary: meta.options[1],
      secondary: meta.options[2],
      status: "Prerequisite map states what is done, what is missing, and which controls recover the task.",
      items: [["Email", "Met", "maya@example.com is valid."], ["Billing", "Missing", "Add a billing contact."], ["Approval", "Missing", "Priya can approve access."]]
    },
    missingFields: {
      label: "Missing fields",
      chip: "Validate",
      title: "Submit can explain missing answers",
      detail: "The product can keep the action enabled and return actionable validation.",
      primary: "Review fields",
      secondary: meta.options[3],
      status: "Missing fields are better handled by visible field targets or submit validation than a silent disabled action.",
      items: [["Team", "Missing", "Select Engineering or Sales."], ["Role", "Missing", "Choose Viewer or Editor."], ["Message", "Optional", "Draft is preserved."]]
    },
    permissionRequest: {
      label: "Permission request",
      chip: "Access",
      title: "Owner approval required",
      detail: "Signed in as alex@northwind.example. External invites need Workspace owner approval.",
      primary: meta.options[2],
      secondary: "Switch account",
      status: "Permission request states current account, required role, owner route, and pending outcome.",
      items: [["Current role", "Member", "Can invite internal users."], ["Needed role", "Owner approval", "Required for external collaborators."], ["Owner", "Priya Raman", "Receives request and reason."]]
    },
    dependencyUnlock: {
      label: "Dependency unlock",
      chip: "Setup",
      title: "Billing setup unlocks invites",
      detail: "External invites depend on an active billing contact.",
      primary: "Open billing setup",
      secondary: meta.options[3],
      status: "Dependency unlock names the upstream setup step and preserves this invite as a draft.",
      items: [["Billing contact", "Missing", "Open setup in a new step."], ["Invite draft", "Saved", "Email and role carry over."], ["Return path", "Ready", "Come back to send after setup."]]
    },
    savingRetry: {
      label: "Saving retry",
      chip: "Processing",
      title: "Saving invite draft",
      detail: "Duplicate send is blocked only while the draft is being saved.",
      primary: "Retry save",
      secondary: "Cancel save",
      status: "Short disabled processing includes progress, timeout, retry, and cancel controls.",
      items: [["Draft", "Queued", "Local copy retained."], ["Network", "Slow", "Retry appears after timeout."], ["Primary action", "Paused", "Send returns after save completes."]]
    },
    offlineFallback: {
      label: "Offline fallback",
      chip: "Offline",
      title: "You are offline",
      detail: "The invite cannot send now, but the draft can be stored and synced later.",
      primary: "Save offline draft",
      secondary: "Copy invite link",
      status: "Offline fallback keeps a completion path available instead of leaving the send control inert.",
      items: [["Connection", "Offline", "Send waits for reconnect."], ["Draft", "Available", "Saved locally with timestamp."], ["Fallback", "Available", "Copy details for manual follow-up."]]
    },
    roleLimited: {
      label: "Role limited",
      chip: "Read-only",
      title: "Member role can review but not invite",
      detail: "Read-only workspace work remains available while invite access is requested.",
      primary: meta.options[2],
      secondary: "Open member list",
      status: "Role-limited state preserves allowed work and offers access recovery for the blocked action.",
      items: [["Allowed", "View members", "Read-only list remains open."], ["Blocked", "Invite external", "Owner approval required."], ["Recovery", "Request sent", "Pending status is tracked."]]
    },
    adminManaged: {
      label: "Admin managed",
      chip: "Policy",
      title: "External invites are admin managed",
      detail: "Workspace policy is controlled by IT. Owners cannot override it.",
      primary: meta.options[4],
      secondary: "Open policy details",
      status: "Admin-managed recovery routes to the owner who can change policy instead of a local retry loop.",
      items: [["Policy", "Managed", "IT controls external collaborators."], ["Local edit", "Unavailable", "Owners cannot unlock it here."], ["Escalation", "Admin route", "Contact path includes workspace ID."]]
    },
    expiredSession: {
      label: "Expired session",
      chip: "Sign in",
      title: "Session expired before sending",
      detail: "The invite draft is preserved. Sign in again to continue from this panel.",
      primary: "Sign in again",
      secondary: meta.options[3],
      status: "Expired-session recovery preserves work and returns focus to the original blocked task after sign-in.",
      items: [["Session", "Expired", "Identity must be refreshed."], ["Draft", "Preserved", "Email, role, and message retained."], ["Return", "Ready", "Send resumes after sign-in."]]
    },
    alternativeRoute: {
      label: "Alternative route",
      chip: "Fallback",
      title: "Use a support-assisted invite",
      detail: "External invite service is unavailable. Support can send with reference INV-2048.",
      primary: "Open support route",
      secondary: "Download invite details",
      status: "Alternative route changes method while preserving reference, draft data, and expected timing.",
      items: [["Primary route", "Unavailable", "Invite service incident."], ["Reference", "INV-2048", "Support can continue."], ["Timing", "4 business hours", "Tradeoff is visible."]]
    }
  };
  const current = states[mode];

  return (
    <div className={`quality-example disabled-recovery-good-ux is-${mode}`}>
      <div className="demo-row disabled-recovery-controls">
        {(Object.keys(states) as GoodMode[]).map((item) => (
          <button type="button" key={item} className={mode === item ? "demo-button small primary" : "demo-button small"} onClick={() => setMode(item)}>
            {states[item].label}
          </button>
        ))}
      </div>
      <div className={`disabled-recovery-card ${current.tone ?? ""}`}>
        <div className="disabled-recovery-topline">
          <div>
            <strong>{current.title}</strong>
            <span>{current.detail}</span>
          </div>
          <span className="disabled-recovery-chip">{current.chip}</span>
        </div>
        <div className="disabled-recovery-map">
          {current.items.map(([label, value, detail]) => (
            <div key={label} className={value === "Met" || value === "Saved" || value === "Available" || value === "Ready" ? "is-done" : "is-missing"}>
              <span>{label.slice(0, 1)}</span>
              <strong>{label}: {value}</strong>
              <small>{detail}</small>
            </div>
          ))}
        </div>
        <div className="disabled-recovery-actions">
          <button type="button" className="demo-button small" disabled>{meta.options[0]}</button>
          <button type="button" className="demo-button small primary">{current.primary}</button>
          <button type="button" className="demo-button small">{current.secondary}</button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{current.status}</p>
    </div>
  );
}

function DisabledControlsRecoveryBadUx() {
  type BadMode = "deadDisabled" | "hiddenReason" | "tooltipOnly" | "infiniteDisabled" | "permissionDeadEnd" | "staleDisabled" | "invalidHidden" | "mobileTrap";
  const [mode, setMode] = useState<BadMode>("deadDisabled");
  const states: Record<BadMode, { label: string; title: string; detail: string; status: string; disabled: string; secondary: string; item: string }> = {
    deadDisabled: {
      label: "Dead disabled",
      title: "Invite teammate",
      detail: "The primary action is greyed out with no visible reason.",
      status: "Users cannot tell what condition blocks progress or who can resolve it.",
      disabled: "Invite teammate",
      secondary: "No next step",
      item: "No cause, owner, or recovery path is present."
    },
    hiddenReason: {
      label: "Hidden reason",
      title: "Setup incomplete",
      detail: "Billing setup is required, but the message is buried in account settings.",
      status: "A real requirement exists, but it is not visible where the control is blocked.",
      disabled: "Send invite",
      secondary: "Account settings",
      item: "Requirement hidden away from the blocked task."
    },
    tooltipOnly: {
      label: "Tooltip only",
      title: "Invite unavailable",
      detail: "The only explanation is a title tooltip attached to a disabled button.",
      status: "Touch, keyboard, and assistive technology users may never discover the required recovery step.",
      disabled: "Invite teammate",
      secondary: "Hover for help",
      item: "Required information depends on hover."
    },
    infiniteDisabled: {
      label: "Infinite disabled",
      title: "Saving workspace",
      detail: "The action stays disabled during processing with no timeout or retry.",
      status: "Processing is indistinguishable from a permanent block when progress and retry are missing.",
      disabled: "Saving...",
      secondary: "Please wait",
      item: "No timeout, cancel, retry, or completion state."
    },
    permissionDeadEnd: {
      label: "Permission dead end",
      title: "Owner access required",
      detail: "The UI names access but offers no request, owner, account switch, or fallback.",
      status: "Permission is not recoverable when the owner route and pending lifecycle are absent.",
      disabled: "Invite teammate",
      secondary: "Access required",
      item: "No owner, role, request, or safe fallback."
    },
    staleDisabled: {
      label: "Stale disabled",
      title: "All requirements complete",
      detail: "The prerequisite checklist is complete, but the action remains inactive.",
      status: "Stale disabled state breaks trust because recovery succeeds without changing the control.",
      disabled: "Invite teammate",
      secondary: "Refresh page",
      item: "Eligibility was not recomputed after recovery."
    },
    invalidHidden: {
      label: "Invalid hidden",
      title: "Continue blocked",
      detail: "A hidden required field is invalid, but no field target or summary points to it.",
      status: "Users cannot correct invalid data that is both hidden and required.",
      disabled: "Continue",
      secondary: "Check form",
      item: "Required invalid field is not visible or linked."
    },
    mobileTrap: {
      label: "Mobile trap",
      title: "Invite on mobile",
      detail: "The disabled reason appears only on desktop hover and is clipped on narrow screens.",
      status: "Mobile users see an inert control with no touch-accessible explanation or route.",
      disabled: "Invite",
      secondary: "Desktop only",
      item: "Responsive state drops recovery controls."
    }
  };
  const current = states[mode];

  return (
    <div className={`quality-example disabled-recovery-bad-ux is-${mode}`}>
      <div className="demo-row disabled-recovery-controls">
        {(Object.keys(states) as BadMode[]).map((item) => (
          <button type="button" key={item} className={mode === item ? "demo-button small primary" : "demo-button small"} onClick={() => setMode(item)}>
            {states[item].label}
          </button>
        ))}
      </div>
      <div className="disabled-recovery-card bad">
        <div className="disabled-recovery-topline">
          <div>
            <strong>{current.title}</strong>
            <span>{current.detail}</span>
          </div>
          <span className="disabled-recovery-chip bad">Blocked</span>
        </div>
        <div className="disabled-recovery-map bad">
          <div className="is-missing">
            <span>!</span>
            <strong>{current.secondary}</strong>
            <small>{current.item}</small>
          </div>
        </div>
        <div className="disabled-recovery-actions">
          <button type="button" className="demo-button small" disabled title={mode === "tooltipOnly" ? "Ask an owner to unlock invites" : undefined}>{current.disabled}</button>
          <button type="button" className="demo-button small" disabled>Recover</button>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{current.status}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DisabledControlsRecoveryGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DisabledControlsRecoveryBadUi />;
}

function GoodUxExample({ meta }: { patternId: string; meta: PatternMeta }) {
  return <DisabledControlsRecoveryGoodUx meta={meta} />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DisabledControlsRecoveryBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
