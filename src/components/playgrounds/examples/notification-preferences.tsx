import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type NotificationPreferencesMode = "default" | "mentions" | "digest" | "quiet" | "critical" | "mobile" | "blocked" | "admin" | "preview" | "keywords" | "reset" | "saved";

const notificationPreferenceCopy: Record<NotificationPreferencesMode, {
  title: string;
  status: string;
  channel: string;
  frequency: string;
  detail: string;
  exception: string;
}> = {
  default: {
    title: "Notification rules",
    status: "Current saved values",
    channel: "In-app, email, push",
    frequency: "Immediate for mentions; digest for watches",
    detail: "Users see which event types map to each delivery channel before changing anything.",
    exception: "Security and incident alerts stay immediate."
  },
  mentions: {
    title: "Mention delivery",
    status: "Mentions prioritized",
    channel: "Banner, push, in-app",
    frequency: "Immediate",
    detail: "Mentions keep stronger delivery than low-value watched-object updates.",
    exception: "Quiet hours allow direct mentions from incident channels."
  },
  digest: {
    title: "Digest updates",
    status: "Daily digest",
    channel: "Email only",
    frequency: "09:00 daily",
    detail: "Repository watches and space edits move to digest without delaying mentions.",
    exception: "Assignments and security notices bypass digest."
  },
  quiet: {
    title: "Quiet hours",
    status: "18:00-08:00",
    channel: "Push and desktop banners paused",
    frequency: "After-hours muted",
    detail: "Quiet hours name affected devices and channels instead of implying all notification history stops.",
    exception: "Critical incident alerts still break through."
  },
  critical: {
    title: "Critical exceptions",
    status: "Breakthrough on",
    channel: "Push, banner, email",
    frequency: "Immediate",
    detail: "Urgent security, billing, and incident messages stay visible even under aggressive mute rules.",
    exception: "Users cannot silence legally required delivery here."
  },
  mobile: {
    title: "Mobile override",
    status: "Mobile quieter",
    channel: "Push mentions only",
    frequency: "Immediate for mentions",
    detail: "Mobile rules differ from desktop and say exactly what still reaches the phone.",
    exception: "Desktop banners remain on during work hours."
  },
  blocked: {
    title: "OS permission blocked",
    status: "System block",
    channel: "Push unavailable",
    frequency: "Preference saved but inactive",
    detail: "The app shows the user's preference and the external setting that prevents delivery.",
    exception: "Open system settings to restore push delivery."
  },
  admin: {
    title: "Admin-managed rule",
    status: "Managed by workspace",
    channel: "Security email required",
    frequency: "Immediate",
    detail: "Managed rows explain ownership instead of looking broken or user-editable.",
    exception: "Only workspace owners can change this rule."
  },
  preview: {
    title: "Preview privacy",
    status: "Preview hidden",
    channel: "Banner and push",
    frequency: "All immediate notifications",
    detail: "Message previews can be hidden without turning off the notification itself.",
    exception: "Sender and channel remain visible for triage."
  },
  keywords: {
    title: "Keyword alerts",
    status: "3 keywords",
    channel: "In-app and push",
    frequency: "Immediate",
    detail: "Keyword alerts are named separately from mentions and muted-channel rules.",
    exception: "Keywords do not override private-channel access."
  },
  reset: {
    title: "Restore notification defaults",
    status: "Preview reset",
    channel: "All notification channels",
    frequency: "Default cadence",
    detail: "Reset lists affected notification rules without touching privacy or display settings.",
    exception: "Admin-managed rows are not reset."
  },
  saved: {
    title: "Saved preferences",
    status: "Saved just now",
    channel: "Updated channels",
    frequency: "Updated frequencies",
    detail: "The confirmation names changed event types and channels so users know what happened.",
    exception: "Failed rows would remain editable."
  }
};

function NotificationPreferencesFrame({
  mode = "default",
  idSuffix = "demo"
}: {
  mode?: NotificationPreferencesMode;
  idSuffix?: string;
}) {
  const copy = notificationPreferenceCopy[mode];
  const titleId = `notification-preferences-title-${idSuffix}`;
  const blocked = mode === "blocked";
  const admin = mode === "admin";
  const rows = [
    { type: "Mentions", inApp: "On", email: mode === "digest" ? "Immediate" : "On", push: mode === "mobile" ? "Mobile only" : "On" },
    { type: "Watched updates", inApp: "On", email: mode === "digest" ? "Daily digest" : "Digest", push: mode === "quiet" ? "Quiet hours" : "Off" },
    { type: "Security", inApp: "On", email: admin ? "Required" : "On", push: blocked ? "Blocked" : "Critical" }
  ];
  return (
    <div className={`notification-preferences-frame is-${mode}`}>
      <section className="notification-preferences-panel" aria-labelledby={titleId}>
        <div className="notification-preferences-head">
          <span>{copy.status}</span>
          <strong>{copy.frequency}</strong>
        </div>
        <h4 id={titleId}>{copy.title}</h4>
        <div className="notification-preferences-matrix" role="table" aria-label="Notification delivery matrix">
          <div role="row" className="notification-preferences-row is-head">
            <span role="columnheader">Type</span>
            <span role="columnheader">In-app</span>
            <span role="columnheader">Email</span>
            <span role="columnheader">Push</span>
          </div>
          {rows.map((row) => (
            <div role="row" className="notification-preferences-row" key={row.type}>
              <span role="rowheader">{row.type}</span>
              <strong>{row.inApp}</strong>
              <strong>{row.email}</strong>
              <strong className={row.push === "Blocked" ? "is-blocked" : ""}>{row.push}</strong>
            </div>
          ))}
        </div>
      </section>
      <aside className="notification-preferences-detail" aria-label="Notification preference detail">
        <div>
          <span>Channels</span>
          <strong>{copy.channel}</strong>
        </div>
        <p>{copy.detail}</p>
        <div className={blocked || admin || mode === "critical" ? "notification-preferences-note is-strong" : "notification-preferences-note"}>
          <span>{copy.exception}</span>
        </div>
      </aside>
    </div>
  );
}

function NotificationPreferencesGoodUi() {
  return (
    <div className="quality-example notification-preferences-demo">
      <NotificationPreferencesFrame />
      <p className="demo-status">The preference matrix maps notification types to channels, frequency, current state, and critical exceptions.</p>
    </div>
  );
}

function NotificationPreferencesBadUi() {
  return (
    <div className="bad-ui-sample notification-preferences-bad-demo is-masterOff">
      <strong>Notifications</strong>
      <div className="notification-preferences-bad-grid">
        {["Off", "Important", "Some emails", "No exceptions"].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <p className="demo-status">The broken control hides event types, channels, devices, and which urgent notifications still arrive.</p>
    </div>
  );
}

function NotificationPreferencesGoodUx() {
  const [mode, setMode] = useState<NotificationPreferencesMode>("default");
  const [message, setMessage] = useState("Current saved values show which event types deliver through in-app, email, and push channels.");
  function choose(nextMode: NotificationPreferencesMode, nextMessage: string) {
    setMode(nextMode);
    setMessage(nextMessage);
  }
  return (
    <div className="quality-example notification-preferences-demo">
      <NotificationPreferencesFrame mode={mode} idSuffix="good-ux" />
      <div className="demo-row notification-preferences-controls" aria-label="Notification preferences exercise controls">
        <button type="button" className={mode === "default" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("default", "Current saved values show which event types deliver through in-app, email, and push channels.")}>Default</button>
        <button type="button" className={mode === "mentions" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("mentions", "Mention delivery remains immediate and visibly stronger than watched-object noise.")}>Mentions</button>
        <button type="button" className={mode === "digest" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("digest", "Digest applies to watched updates while assignments and security notices stay immediate.")}>Digest</button>
        <button type="button" className={mode === "quiet" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("quiet", "Quiet hours pause push and banners but name the critical exception.")}>Quiet hours</button>
        <button type="button" className={mode === "critical" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("critical", "Critical exceptions explain which notifications break through aggressive mute rules.")}>Critical</button>
        <button type="button" className={mode === "mobile" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("mobile", "Mobile override differs from desktop and says what still reaches the phone.")}>Mobile</button>
        <button type="button" className={mode === "blocked" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("blocked", "OS permission blocks push even though the in-app preference is preserved.")}>OS block</button>
        <button type="button" className={mode === "admin" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("admin", "Admin-managed security email is labelled as required and not user-editable.")}>Admin</button>
        <button type="button" className={mode === "preview" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("preview", "Preview privacy hides message snippets without disabling the notification.")}>Preview</button>
        <button type="button" className={mode === "keywords" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("keywords", "Keyword alerts are distinct from mentions and do not bypass access rules.")}>Keywords</button>
        <button type="button" className={mode === "reset" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("reset", "Reset previews notification-only defaults and leaves other settings alone.")}>Reset</button>
        <button type="button" className={mode === "saved" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("saved", "Saved confirmation names the changed event types, channels, and frequencies.")}>Save</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function NotificationPreferencesBadUx() {
  type Mode = "masterOff" | "vagueImportant" | "splitChannels" | "quietCritical" | "osMismatch" | "duplicateDelivery";
  const [mode, setMode] = useState<Mode>("masterOff");
  const copy: Record<Mode, string> = {
    masterOff: "One master switch hides what still arrives for security, billing, assignments, or incident alerts.",
    vagueImportant: "Important notifications are enabled, but the UI never lists included event types.",
    splitChannels: "Email is off in one place while push and banners stay enabled elsewhere.",
    quietCritical: "Quiet hours suppress incident alerts that require immediate response.",
    osMismatch: "Push appears enabled even though browser or OS permissions block delivery.",
    duplicateDelivery: "One mention arrives by mention rule, watched-object rule, digest, and email routing."
  };
  const labels: Record<Mode, string[]> = {
    masterOff: ["All off", "Maybe security?", "No detail"],
    vagueImportant: ["Important", "Some", "Recommended"],
    splitChannels: ["Email off", "Push on", "Banner on"],
    quietCritical: ["Quiet", "Incident muted", "No bypass"],
    osMismatch: ["Push on", "OS blocked", "No warning"],
    duplicateDelivery: ["Mention", "Watch", "Digest"]
  };
  return (
    <div className={`quality-example notification-preferences-bad-demo is-${mode}`}>
      <strong>{mode === "duplicateDelivery" ? "Duplicate delivery" : mode === "quietCritical" ? "Quiet critical alert" : "Broken preferences"}</strong>
      <div className="notification-preferences-bad-grid">
        {labels[mode].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row notification-preferences-controls">
        <button type="button" className={mode === "masterOff" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("masterOff")}>Master off</button>
        <button type="button" className={mode === "vagueImportant" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("vagueImportant")}>Vague important</button>
        <button type="button" className={mode === "splitChannels" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("splitChannels")}>Split channels</button>
        <button type="button" className={mode === "quietCritical" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("quietCritical")}>Quiet critical</button>
        <button type="button" className={mode === "osMismatch" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("osMismatch")}>OS mismatch</button>
        <button type="button" className={mode === "duplicateDelivery" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("duplicateDelivery")}>Duplicate delivery</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <NotificationPreferencesGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <NotificationPreferencesBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <NotificationPreferencesGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <NotificationPreferencesBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
