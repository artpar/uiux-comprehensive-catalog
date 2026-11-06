import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type PermissionRequestMode =
  | "contextual"
  | "feature"
  | "systemReady"
  | "granted"
  | "denied"
  | "fallback"
  | "later"
  | "previouslyDenied"
  | "permanentDenied"
  | "settingsRequired"
  | "limited"
  | "whileInUse"
  | "oneTime"
  | "revoked"
  | "statusCheck"
  | "manual"
  | "mobile";

type PermissionRequestBadMode =
  | "coldStart"
  | "vagueReason"
  | "blockedOnDeny"
  | "repeatNag"
  | "fakeRequired"
  | "noSettingsPath"
  | "permissionMismatch";

const permissionRequestGoodLabels: Array<[PermissionRequestMode, string]> = [
  ["contextual", "Contextual request"],
  ["feature", "Feature-triggered ask"],
  ["systemReady", "System prompt ready"],
  ["granted", "Grant permission"],
  ["denied", "Deny permission"],
  ["fallback", "Denied fallback"],
  ["later", "Ask again later"],
  ["previouslyDenied", "Previously denied"],
  ["permanentDenied", "Permanently denied"],
  ["settingsRequired", "Settings required"],
  ["limited", "Limited access"],
  ["whileInUse", "While-in-use"],
  ["oneTime", "One-time"],
  ["revoked", "Permission revoked"],
  ["statusCheck", "Permission status check"],
  ["manual", "Manual fallback"],
  ["mobile", "Mobile compact"]
];

const permissionRequestBadLabels: Array<[PermissionRequestBadMode, string]> = [
  ["coldStart", "Cold-start prompt"],
  ["vagueReason", "Vague reason"],
  ["blockedOnDeny", "Blocked on deny"],
  ["repeatNag", "Repeat nag"],
  ["fakeRequired", "Fake required"],
  ["noSettingsPath", "No settings path"],
  ["permissionMismatch", "Permission mismatch"]
];

function PermissionRequestFrame({ mode = "contextual", idSuffix = "static" }: { mode?: PermissionRequestMode; idSuffix?: string }) {
  const config: Record<PermissionRequestMode, {
    chip: string;
    title: string;
    body: string;
    status: string;
    resource: string;
    timing: string;
    choice: string;
    fallback: string;
    primary: string;
    secondary: string;
    showSystem?: boolean;
    compact?: boolean;
  }> = {
    contextual: {
      chip: "Contextual request",
      title: "Use current location for route check-in?",
      body: "Location is requested only after Start route so the app can verify arrival at the job site.",
      status: "Contextual request ties the permission request to the field service action.",
      resource: "Location",
      timing: "After Start route",
      choice: "Continue or Not now",
      fallback: "Enter address manually",
      primary: "Continue to system prompt",
      secondary: "Not now"
    },
    feature: {
      chip: "Feature-triggered ask",
      title: "Scan receipt with camera",
      body: "Camera access starts only when the user chooses Scan receipt, and upload remains available without camera.",
      status: "Feature-triggered ask names the resource and feature before invoking the platform prompt.",
      resource: "Camera",
      timing: "After Scan receipt",
      choice: "Allow camera or upload file",
      fallback: "Upload receipt image",
      primary: "Open camera prompt",
      secondary: "Upload file"
    },
    systemReady: {
      chip: "System prompt ready",
      title: "System permission prompt is next",
      body: "The product explanation is complete; the next action invokes the OS or browser permission prompt.",
      status: "System prompt ready separates product rationale from the platform dialog.",
      resource: "Microphone",
      timing: "Before joining support call",
      choice: "Allow while using or do not allow",
      fallback: "Join with chat only",
      primary: "Show system prompt",
      secondary: "Use chat only",
      showSystem: true
    },
    granted: {
      chip: "Grant permission",
      title: "Permission granted",
      body: "Location is active for this route. The status updates before the check-in feature continues.",
      status: "Grant permission enables only the named feature and confirms the runtime state.",
      resource: "Location",
      timing: "Current route",
      choice: "Granted",
      fallback: "Settings can revoke later",
      primary: "Check in now",
      secondary: "Review settings",
      showSystem: true
    },
    denied: {
      chip: "Deny permission",
      title: "Location not allowed",
      body: "The route remains visible. Check-in can continue through manual address entry without blocking unrelated work.",
      status: "Deny permission preserves eligible work and avoids pressure.",
      resource: "Location",
      timing: "Denied by user",
      choice: "Denied",
      fallback: "Manual address",
      primary: "Enter address",
      secondary: "Keep browsing jobs"
    },
    fallback: {
      chip: "Denied fallback",
      title: "Use manual check-in instead",
      body: "The fallback records typed address and timestamp while noting that device location was not used.",
      status: "Denied fallback gives an immediate path that does not need the permission.",
      resource: "Location",
      timing: "After denial",
      choice: "Manual route",
      fallback: "Type address and site code",
      primary: "Save manual check-in",
      secondary: "Try location later"
    },
    later: {
      chip: "Ask again later",
      title: "Permission request dismissed",
      body: "The user can skip the pre-prompt now. The app waits for the next feature attempt before asking again.",
      status: "Ask again later respects cancellation before the system prompt.",
      resource: "Notifications",
      timing: "After user skips",
      choice: "Not now",
      fallback: "Use in-app inbox",
      primary: "Continue without notifications",
      secondary: "Remind me later"
    },
    previouslyDenied: {
      chip: "Previously denied",
      title: "Camera was denied before",
      body: "The product explains that the system prompt may not appear and offers upload plus settings guidance.",
      status: "Previously denied state avoids a blind prompt retry.",
      resource: "Camera",
      timing: "Second scan attempt",
      choice: "Use settings or upload",
      fallback: "Upload receipt image",
      primary: "Open settings",
      secondary: "Upload file"
    },
    permanentDenied: {
      chip: "Permanently denied",
      title: "Microphone needs settings recovery",
      body: "The system will not show another prompt. The user can open settings or join support by chat.",
      status: "Permanently denied state routes to settings and keeps a non-audio support path.",
      resource: "Microphone",
      timing: "Prompt blocked",
      choice: "Settings required",
      fallback: "Chat-only support",
      primary: "Open settings",
      secondary: "Join chat"
    },
    settingsRequired: {
      chip: "Settings required",
      title: "Turn on notifications in system settings",
      body: "OS notifications are off for this app, so channel preferences cannot deliver until settings change.",
      status: "Settings required shows the exact recovery route when the platform blocks delivery.",
      resource: "Notifications",
      timing: "OS blocked",
      choice: "Open app settings",
      fallback: "In-app inbox",
      primary: "Open settings",
      secondary: "Use inbox"
    },
    limited: {
      chip: "Limited access",
      title: "Limited photo library access",
      body: "Only selected photos are available. The app offers Select more photos and keeps upload scope visible.",
      status: "Limited access is not treated as full access.",
      resource: "Photos",
      timing: "Selected library",
      choice: "Selected photos only",
      fallback: "Choose more photos",
      primary: "Select more photos",
      secondary: "Continue with 3 photos"
    },
    whileInUse: {
      chip: "While-in-use",
      title: "Location allowed while using the app",
      body: "Route tracking runs only while the app is open and stops when the route session ends.",
      status: "While-in-use state makes permission lifetime visible.",
      resource: "Location",
      timing: "While using app",
      choice: "Allow while using",
      fallback: "Manual pause available",
      primary: "Start route",
      secondary: "Pause tracking"
    },
    oneTime: {
      chip: "One-time",
      title: "One-time location access",
      body: "This check-in can use current location once. The next route will ask again in context.",
      status: "One-time state clarifies that access will not persist.",
      resource: "Location",
      timing: "This check-in only",
      choice: "Allow once",
      fallback: "Ask again next route",
      primary: "Use once",
      secondary: "Enter address"
    },
    revoked: {
      chip: "Permission revoked",
      title: "Camera access was revoked",
      body: "The app detected a settings change and switched receipt scanning back to upload mode.",
      status: "Permission revoked state updates the feature without assuming the old grant still applies.",
      resource: "Camera",
      timing: "Changed in settings",
      choice: "Revoked",
      fallback: "Upload file",
      primary: "Upload receipt",
      secondary: "Open settings"
    },
    statusCheck: {
      chip: "Permission status check",
      title: "Permission status check complete",
      body: "Status reads granted, denied, prompt, blocked, unavailable, and policy-limited outcomes before rendering actions.",
      status: "Permission status check prevents the wrong prompt or action from being shown.",
      resource: "Location, camera, microphone",
      timing: "Before feature render",
      choice: "granted / denied / prompt",
      fallback: "Show matching action",
      primary: "Refresh status",
      secondary: "View fallback"
    },
    manual: {
      chip: "Manual fallback",
      title: "Complete check-in without device access",
      body: "The manual path collects address, site code, and reason without collecting location before permission exists.",
      status: "Manual fallback lets the user finish eligible work without the device resource.",
      resource: "Location",
      timing: "No permission",
      choice: "Manual input",
      fallback: "Address and site code",
      primary: "Save manual check-in",
      secondary: "Cancel"
    },
    mobile: {
      chip: "Mobile compact",
      title: "Allow location for this route?",
      body: "Resource, reason, system prompt timing, deny path, and manual fallback remain visible in compact width.",
      status: "Mobile compact keeps the choice and fallback readable without horizontal overflow.",
      resource: "Location",
      timing: "After Start route",
      choice: "Allow once or Not now",
      fallback: "Enter address",
      primary: "Continue",
      secondary: "Not now",
      compact: true
    }
  };

  const item = config[mode];
  const titleId = `permission-request-title-${idSuffix}`;
  const descId = `permission-request-desc-${idSuffix}`;

  return (
    <div className={`perm-request-frame is-${mode} ${item.compact ? "is-compact" : ""}`}>
      <section className="perm-request-card" aria-labelledby={titleId} aria-describedby={descId}>
        <div className="perm-request-card-head">
          <div>
            <span>{item.chip}</span>
            <strong id={titleId}>{item.title}</strong>
          </div>
          <b>{item.resource}</b>
        </div>
        <p id={descId}>{item.body}</p>
        <div className="perm-request-resource-grid" aria-label="Permission request details">
          <div><span>Device resource</span><strong>{item.resource}</strong></div>
          <div><span>Contextual timing</span><strong>{item.timing}</strong></div>
          <div><span>Choice</span><strong>{item.choice}</strong></div>
          <div><span>Fallback</span><strong>{item.fallback}</strong></div>
        </div>
        {item.showSystem && (
          <div className="perm-request-system-sheet" role="group" aria-label="System permission prompt">
            <strong>System permission prompt</strong>
            <span>{mode === "granted" ? "Allow while using selected. Feature can continue." : "Allow while using, Allow once, or Do not allow."}</span>
          </div>
        )}
        <div className="perm-request-actions">
          <button type="button" className="demo-button small primary">{item.primary}</button>
          <button type="button" className="demo-button small">{item.secondary}</button>
        </div>
      </section>
      <aside className="perm-request-record-grid" aria-label="Permission status record">
        <div><span>Permission status</span><strong>{item.chip}</strong></div>
        <div><span>Runtime path</span><strong>{item.status}</strong></div>
      </aside>
    </div>
  );
}

function PermissionRequestGoodUi() {
  return (
    <div className="quality-example perm-request-demo-shell">
      <div className="perm-request-service-preview">
        <div className="perm-request-service-top">
          <strong>Field service app</strong>
          <span>Device resource permission</span>
        </div>
        <PermissionRequestFrame mode="contextual" idSuffix="good-ui" />
      </div>
      <p className="demo-status">The UI waits for a feature-triggered ask, names the device resource, prepares the system permission prompt, and shows manual fallback before the user chooses.</p>
    </div>
  );
}

function PermissionRequestBadUi() {
  return (
    <div className="bad-ui-sample perm-request-bad-ui">
      <div className="perm-request-service-preview">
        <div className="perm-request-service-top bad">
          <strong>Welcome</strong>
          <span>Before any task starts</span>
        </div>
        <section className="perm-request-card bad" aria-label="Broken permission request">
          <div className="perm-request-card-head">
            <div>
              <span>Cold-start prompt</span>
              <strong>Allow everything for best results</strong>
            </div>
            <b>Location + camera + contacts</b>
          </div>
          <p>Enable access to improve your experience. Deny blocks setup, and no manual fallback or settings route is shown.</p>
          <div className="perm-request-resource-grid">
            <div><span>Reason</span><strong>Vague reason</strong></div>
            <div><span>Outcome</span><strong>Blocked on deny</strong></div>
            <div><span>Recovery</span><strong>No settings path</strong></div>
            <div><span>Prompt</span><strong>Permission mismatch</strong></div>
          </div>
          <div className="perm-request-actions">
            <button type="button" className="demo-button small danger">Continue</button>
            <button type="button" className="demo-button small">Maybe later</button>
          </div>
        </section>
      </div>
      <p className="demo-status">The broken UI asks too early, bundles resources, makes denial punitive, and does not match the permission to a user action.</p>
    </div>
  );
}

function PermissionRequestGoodUx() {
  const [mode, setMode] = useState<PermissionRequestMode>("contextual");
  return (
    <div className="quality-example perm-request-demo-shell">
      <div className="demo-row perm-request-controls" aria-label="Permission request exercise controls">
        {permissionRequestGoodLabels.map(([key, label]) => (
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
      <div className="perm-request-service-preview">
        <div className="perm-request-service-top">
          <strong>Field service app</strong>
          <span>Location, camera, microphone, photos, contacts, notifications, Bluetooth, clipboard, and motion sensors are requested only in context.</span>
        </div>
        <PermissionRequestFrame mode={mode} idSuffix="good-ux" />
      </div>
      <p className="demo-status" aria-live="polite">Permission request state: {permissionRequestGoodLabels.find(([key]) => key === mode)?.[1]}.</p>
    </div>
  );
}

function PermissionRequestBadUx() {
  const [mode, setMode] = useState<PermissionRequestBadMode>("coldStart");
  const copy: Record<PermissionRequestBadMode, {
    title: string;
    body: string;
    status: string;
    detail: string;
  }> = {
    coldStart: {
      title: "Cold-start prompt",
      body: "The first screen asks for location, camera, microphone, photos, contacts, notifications, Bluetooth, clipboard, and motion sensors before any feature is opened.",
      status: "Cold-start prompt burns trust before context exists.",
      detail: "No feature-triggered ask"
    },
    vagueReason: {
      title: "Vague reason",
      body: "The prompt says improve your experience but does not name the device resource, action, benefit, or fallback.",
      status: "Vague reason leaves the user unable to make an informed choice.",
      detail: "Resource unclear"
    },
    blockedOnDeny: {
      title: "Blocked on deny",
      body: "Denying optional location locks the whole account setup even though manual address entry would work.",
      status: "Blocked on deny punishes refusal and confuses device permission with account authorization.",
      detail: "Account blocked"
    },
    repeatNag: {
      title: "Repeat nag",
      body: "Every tap reopens the same permission request after denial, with no Ask again later or settings-aware state.",
      status: "Repeat nag ignores the user's prior decision.",
      detail: "Prompt loop"
    },
    fakeRequired: {
      title: "Fake required",
      body: "The UI claims precise location is required, but a picker, approximate location, or manual address would complete the task.",
      status: "Fake required overstates need and hides lower-access options.",
      detail: "Lower-access option hidden"
    },
    noSettingsPath: {
      title: "No settings path",
      body: "After permanent denial, the screen still says Try again and never shows settings required recovery.",
      status: "No settings path blocks recovery once the platform stops prompting.",
      detail: "Permanent denial dead end"
    },
    permissionMismatch: {
      title: "Permission mismatch",
      body: "The receipt scanner explanation mentions camera, but the system prompt asks for contacts and notifications.",
      status: "Permission mismatch makes the product rationale untrustworthy.",
      detail: "Resource mismatch"
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example perm-request-bad-ux is-${mode}`}>
      <div className="demo-row perm-request-controls" aria-label="Permission request misuse controls">
        {permissionRequestBadLabels.map(([key, label]) => (
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
      <div className="perm-request-service-preview">
        <div className="perm-request-service-top bad">
          <strong>Broken permission flow</strong>
          <span>{item.detail}</span>
        </div>
        <section className="perm-request-card bad" aria-label={`Broken state: ${item.title}`}>
          <div className="perm-request-card-head">
            <div>
              <span>{item.title}</span>
              <strong>{item.detail}</strong>
            </div>
            <b>Risk</b>
          </div>
          <p>{item.body}</p>
          <div className="perm-request-resource-grid">
            <div><span>Resource</span><strong>{mode === "permissionMismatch" ? "Contacts, not camera" : "Not matched to task"}</strong></div>
            <div><span>User action</span><strong>{mode === "coldStart" ? "None" : "Ignored"}</strong></div>
            <div><span>Deny outcome</span><strong>{mode === "blockedOnDeny" ? "Product blocked" : "Nag or dead end"}</strong></div>
            <div><span>Recovery</span><strong>{mode === "noSettingsPath" ? "Missing settings route" : "Fallback hidden"}</strong></div>
          </div>
          <div className="perm-request-actions">
            <button type="button" className="demo-button small danger">{mode === "repeatNag" ? "Ask again" : "Continue"}</button>
            <button type="button" className="demo-button small" disabled={mode === "blockedOnDeny" || mode === "noSettingsPath"}>Manual fallback</button>
          </div>
        </section>
      </div>
      <p className="demo-status" aria-live="polite">{item.status}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PermissionRequestGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PermissionRequestBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PermissionRequestGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PermissionRequestBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
