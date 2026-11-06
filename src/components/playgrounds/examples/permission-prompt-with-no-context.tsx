import { useState } from "react";
import { QualityPanel, patternMeta, type PatternMeta } from './shared';

type PermissionPromptNoContextGoodMode =
  | "coldStartAudit"
  | "vagueRationale"
  | "resourceMismatch"
  | "bundledPermissions"
  | "featureCorrection"
  | "leastAccess"
  | "denyNoPunish"
  | "settingsRecovery"
  | "mobileCompact";

type PermissionPromptNoContextBadMode =
  | "repeatNag"
  | "blockedOnDeny"
  | "noFallback"
  | "deceptiveSetup";

const permissionPromptNoContextGoodLabels: Array<[PermissionPromptNoContextGoodMode, string]> = [
  ["coldStartAudit", "Cold-start prompt"],
  ["vagueRationale", "Vague rationale"],
  ["resourceMismatch", "Resource mismatch"],
  ["bundledPermissions", "Bundled permissions"],
  ["featureCorrection", "Feature-triggered correction"],
  ["leastAccess", "Least-access alternative"],
  ["denyNoPunish", "Deny without punishment"],
  ["settingsRecovery", "Settings recovery"],
  ["mobileCompact", "Mobile compact"]
];

const permissionPromptNoContextBadLabels: Array<[PermissionPromptNoContextBadMode, string]> = [
  ["repeatNag", "Repeat nag"],
  ["blockedOnDeny", "Blocked on deny"],
  ["noFallback", "No fallback"],
  ["deceptiveSetup", "Deceptive setup"]
];

type ContextlessPermissionCopy = {
  chip: string;
  title: string;
  body: string;
  resource: string;
  timing: string;
  choice: string;
  fallback: string;
  status: string;
  tone: "ready" | "warning" | "danger";
};

const contextlessPermissionGoodCopy: Record<PermissionPromptNoContextGoodMode, ContextlessPermissionCopy> = {
  coldStartAudit: {
    chip: "Cold-start prompt",
    title: "Prompt removed from launch",
    body: "The first-run screen no longer asks for location, notifications, contacts, or photos before the user starts a related task.",
    resource: "None requested yet",
    timing: "App launch",
    choice: "Continue setup",
    fallback: "Ask when feature starts",
    status: "Cold-start prompt is flagged as the anti-pattern and held until context exists.",
    tone: "danger"
  },
  vagueRationale: {
    chip: "Vague rationale",
    title: "Replace vague copy with resource-specific context",
    body: "Improve your experience is replaced with camera access for receipt scanning, including why the scan needs camera and what upload fallback exists.",
    resource: "Camera",
    timing: "After Scan receipt",
    choice: "Use camera or upload file",
    fallback: "Upload file",
    status: "The prompt names resource, feature, benefit, fallback, and denial outcome before the system prompt.",
    tone: "warning"
  },
  resourceMismatch: {
    chip: "Resource mismatch",
    title: "System prompt must match visible feature",
    body: "A scan receipt action cannot trigger contacts or notifications. The corrected prompt requests only camera for the selected scanner task.",
    resource: "Camera only",
    timing: "Scanner opened",
    choice: "Continue to camera prompt",
    fallback: "Upload file",
    status: "Resource mismatch is blocked before invoking the browser or OS permission prompt.",
    tone: "danger"
  },
  bundledPermissions: {
    chip: "Bundled permissions",
    title: "Split setup bundle into feature-triggered asks",
    body: "Location, notifications, contacts, and photos are no longer one setup bundle; each ask waits for its own feature and recovery path.",
    resource: "Separate resources",
    timing: "Per feature",
    choice: "Ask separately",
    fallback: "Per-resource fallback",
    status: "Bundled permissions are separated so users can make informed choices.",
    tone: "warning"
  },
  featureCorrection: {
    chip: "Feature-triggered correction",
    title: "Ask after the user starts the feature",
    body: "The user taps Find nearby stores, sees why approximate location helps sorting, and can enter ZIP code instead.",
    resource: "Approximate location",
    timing: "After Find nearby",
    choice: "Use location or enter ZIP",
    fallback: "ZIP code",
    status: "Feature-triggered correction turns the anti-pattern into a valid permission request.",
    tone: "ready"
  },
  leastAccess: {
    chip: "Least-access alternative",
    title: "Use a lower-access route when it satisfies the task",
    body: "The receipt flow offers upload file and platform picker before asking for full photo library or camera access.",
    resource: "Picker or upload",
    timing: "Before full access",
    choice: "Choose file",
    fallback: "Manual entry",
    status: "Least-access alternative prevents unnecessary powerful-feature prompts.",
    tone: "ready"
  },
  denyNoPunish: {
    chip: "Deny without punishment",
    title: "Denial does not block unrelated work",
    body: "Declining contacts still lets the user type an email address, finish invite setup, and keep using the account.",
    resource: "Contacts",
    timing: "After Import contacts",
    choice: "Not now",
    fallback: "Type email",
    status: "Deny without punishment keeps unrelated navigation and task progress available.",
    tone: "ready"
  },
  settingsRecovery: {
    chip: "Settings recovery",
    title: "Show recovery after prior denial",
    body: "A previously denied notification prompt shows browser settings instructions and email alerts instead of reopening a blocked prompt.",
    resource: "Notifications",
    timing: "Previously denied",
    choice: "Open settings",
    fallback: "Email alerts",
    status: "Settings recovery replaces a prompt loop after permanent or browser-level denial.",
    tone: "warning"
  },
  mobileCompact: {
    chip: "Mobile compact",
    title: "Keep context visible on compact screens",
    body: "The compact sheet keeps resource, triggering feature, system prompt timing, not-now choice, and fallback visible before the platform prompt.",
    resource: "Location",
    timing: "After Start route",
    choice: "Continue or Not now",
    fallback: "Enter address",
    status: "Mobile compact preserves context and fallback without horizontal overflow.",
    tone: "ready"
  }
};

function ContextlessPermissionPanel({ mode, meta }: { mode: PermissionPromptNoContextGoodMode; meta: PatternMeta }) {
  const item = contextlessPermissionGoodCopy[mode];
  return (
    <section className={`contextless-permission-card is-${item.tone}`} aria-label="Permission prompt context audit">
      <header className="contextless-permission-head">
        <div>
          <span>{item.chip}</span>
          <strong>{item.title}</strong>
        </div>
        <b>{item.resource}</b>
      </header>
      <p>{item.body}</p>
      <div className="contextless-permission-grid" aria-label="Permission context details">
        <div><span>Surface</span><strong>{meta.subject}</strong></div>
        <div><span>Timing</span><strong>{item.timing}</strong></div>
        <div><span>Choice</span><strong>{item.choice}</strong></div>
        <div><span>Fallback</span><strong>{item.fallback}</strong></div>
      </div>
      <div className="contextless-permission-actions">
        <button type="button" className="demo-button small primary">{mode === "featureCorrection" ? "Continue to system prompt" : "Use contextual ask"}</button>
        <button type="button" className="demo-button small">{item.fallback}</button>
      </div>
    </section>
  );
}

function PermissionPromptNoContextGoodUi() {
  const meta = patternMeta["permission-prompt-with-no-context"];
  return (
    <div className="quality-example contextless-permission-demo">
      <ContextlessPermissionPanel mode="featureCorrection" meta={meta} />
      <p className="demo-status">The corrected UI waits until the user starts the resource-dependent feature, names the resource, explains the timing, and keeps a lower-access fallback visible before the system prompt.</p>
    </div>
  );
}

function PermissionPromptNoContextBadUi() {
  return (
    <div className="bad-ui-sample contextless-permission-bad-demo is-deceptiveSetup">
      <section className="contextless-permission-card is-danger" aria-label="Contextless permission prompt">
        <header className="contextless-permission-head">
          <div>
            <span>Deceptive setup</span>
            <strong>Enable full experience</strong>
          </div>
          <b>Location + contacts + photos</b>
        </header>
        <p>The first screen asks for broad access before any feature is selected and offers no clear reason, not-now path, or manual fallback.</p>
        <div className="contextless-permission-grid">
          <div><span>Timing</span><strong>Before context</strong></div>
          <div><span>Reason</span><strong>Vague</strong></div>
          <div><span>Deny outcome</span><strong>Blocked setup</strong></div>
          <div><span>Fallback</span><strong>Hidden</strong></div>
        </div>
      </section>
      <p className="demo-status">The broken UI asks too early, bundles resources, hides fallback, and makes denial look unsafe.</p>
    </div>
  );
}

function PermissionPromptNoContextGoodUx({ meta }: { meta: PatternMeta }) {
  const [mode, setMode] = useState<PermissionPromptNoContextGoodMode>("coldStartAudit");
  const item = contextlessPermissionGoodCopy[mode];

  return (
    <div className="quality-example contextless-permission-demo">
      <div className="demo-row contextless-permission-controls" aria-label="Permission prompt with no context correction controls">
        {permissionPromptNoContextGoodLabels.map(([key, label]) => (
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
      <ContextlessPermissionPanel mode={mode} meta={meta} />
      <p className="demo-status" aria-live="polite">{item.status}</p>
    </div>
  );
}

function PermissionPromptNoContextBadUx() {
  const [mode, setMode] = useState<PermissionPromptNoContextBadMode>("repeatNag");
  const copy: Record<PermissionPromptNoContextBadMode, ContextlessPermissionCopy> = {
    repeatNag: {
      chip: "Repeat nag",
      title: "Same prompt returns after denial",
      body: "Every tap opens the same notification prompt even though the user already declined and needs settings or email fallback instead.",
      resource: "Notifications",
      timing: "After denial",
      choice: "Ask again",
      fallback: "Missing",
      status: "Repeat nag ignores the user's prior decision and damages trust.",
      tone: "danger"
    },
    blockedOnDeny: {
      chip: "Blocked on deny",
      title: "Optional permission blocks account setup",
      body: "The user denies contacts access and cannot finish onboarding, even though manual invite entry would complete the task.",
      resource: "Contacts",
      timing: "Onboarding",
      choice: "Allow or stop",
      fallback: "Disabled",
      status: "Blocked on deny confuses optional device access with required account authorization.",
      tone: "danger"
    },
    noFallback: {
      chip: "No fallback",
      title: "Denied camera leaves a dead end",
      body: "The receipt scanner denies camera and shows only Try again, with no upload file, manual entry, or picker route.",
      resource: "Camera",
      timing: "After denial",
      choice: "Try again",
      fallback: "None",
      status: "No fallback turns a recoverable denial into a task dead end.",
      tone: "danger"
    },
    deceptiveSetup: {
      chip: "Deceptive setup",
      title: "Setup asks for resources before features",
      body: "A setup checklist requests location, photos, contacts, and notifications as full functionality without naming feature purpose or denial outcome.",
      resource: "Multiple resources",
      timing: "Before feature use",
      choice: "Enable all",
      fallback: "Hidden",
      status: "Deceptive setup bundles unrelated prompts and hides informed choice.",
      tone: "danger"
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example contextless-permission-bad-demo is-${mode}`}>
      <div className="demo-row contextless-permission-controls" aria-label="Permission prompt with no context failure controls">
        {permissionPromptNoContextBadLabels.map(([key, label]) => (
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
      <section className="contextless-permission-card is-danger" aria-label={`Permission failure: ${item.chip}`}>
        <header className="contextless-permission-head">
          <div>
            <span>{item.chip}</span>
            <strong>{item.title}</strong>
          </div>
          <b>{item.resource}</b>
        </header>
        <p>{item.body}</p>
        <div className="contextless-permission-grid">
          <div><span>Timing</span><strong>{item.timing}</strong></div>
          <div><span>Choice</span><strong>{item.choice}</strong></div>
          <div><span>Deny outcome</span><strong>{mode === "blockedOnDeny" ? "Account blocked" : "Prompt loop"}</strong></div>
          <div><span>Fallback</span><strong>{item.fallback}</strong></div>
        </div>
        <div className="contextless-permission-actions">
          <button type="button" className="demo-button small danger">{mode === "repeatNag" ? "Ask again" : "Continue"}</button>
          <button type="button" className="demo-button small" disabled>Manual fallback</button>
        </div>
      </section>
      <p className="demo-status" aria-live="polite">{item.status}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PermissionPromptNoContextGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PermissionPromptNoContextBadUi />;
}

function GoodUxExample({ meta }: { patternId: string; meta: PatternMeta }) {
  return <PermissionPromptNoContextGoodUx meta={meta} />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PermissionPromptNoContextBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
