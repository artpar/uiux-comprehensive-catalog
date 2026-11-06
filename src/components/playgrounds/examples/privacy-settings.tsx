import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type PrivacySettingsMode =
  | "overview"
  | "activity"
  | "profile"
  | "ads"
  | "location"
  | "appAccess"
  | "deviceMismatch"
  | "connectedApps"
  | "dataSharing"
  | "consent"
  | "cookies"
  | "export"
  | "deleteAccount"
  | "unavailable"
  | "managed"
  | "child"
  | "region"
  | "pending"
  | "saved"
  | "failed"
  | "reset"
  | "mobile";

type PrivacySettingsBadMode =
  | "policyOnly"
  | "masterSwitch"
  | "hiddenAppAccess"
  | "consentMismatch"
  | "staleCurrent"
  | "overbroadReset"
  | "lowPrivacyDefault";

const privacySettingsGoodLabels: Array<[PrivacySettingsMode, string]> = [
  ["overview", "Privacy overview"],
  ["activity", "Activity controls"],
  ["profile", "Profile visibility"],
  ["ads", "Ad personalization"],
  ["location", "Location history"],
  ["appAccess", "App access"],
  ["deviceMismatch", "Device permission mismatch"],
  ["connectedApps", "Connected apps"],
  ["dataSharing", "Data sharing"],
  ["consent", "Consent handoff"],
  ["cookies", "Cookie handoff"],
  ["export", "Data export handoff"],
  ["deleteAccount", "Delete account handoff"],
  ["unavailable", "Unavailable data"],
  ["managed", "Managed policy"],
  ["child", "Child privacy default"],
  ["region", "Region restriction"],
  ["pending", "Pending sync"],
  ["saved", "Saved state"],
  ["failed", "Failed save"],
  ["reset", "Reset privacy group"],
  ["mobile", "Mobile compact privacy"]
];

const privacySettingsBadLabels: Array<[PrivacySettingsBadMode, string]> = [
  ["policyOnly", "Policy-only"],
  ["masterSwitch", "Master switch"],
  ["hiddenAppAccess", "Hidden app access"],
  ["consentMismatch", "Consent mismatch"],
  ["staleCurrent", "Stale current values"],
  ["overbroadReset", "Overbroad reset"],
  ["lowPrivacyDefault", "Low-privacy default"]
];

function PrivacySettingsPanel({ mode, idSuffix }: { mode: PrivacySettingsMode; idSuffix: string }) {
  const config: Record<PrivacySettingsMode, {
    chip: string;
    title: string;
    body: string;
    scope: string;
    value: string;
    data: string;
    source: string;
    status: string;
    consequence: string;
    action: string;
    secondary: string;
    tone?: "warning" | "danger" | "ready";
    compact?: boolean;
  }> = {
    overview: {
      chip: "Privacy overview",
      title: "Current privacy posture is inspectable",
      body: "The dashboard groups saved activity, profile visibility, personalization, app access, device permissions, and data sharing with effective values.",
      scope: "Account + device privacy",
      value: "4 controls on, 3 controls off",
      data: "Activity, visibility, location, app access",
      source: "Account privacy service",
      status: "Synced 10:42",
      consequence: "Changes update future collection and exposure",
      action: "Review controls",
      secondary: "Download data"
    },
    activity: {
      chip: "Activity controls",
      title: "Saved activity can be paused or cleared",
      body: "Search, browsing, voice, media, and app activity show whether history is saved, recently cleared, paused, or unavailable.",
      scope: "Account activity history",
      value: "Web & app activity paused",
      data: "Search and app/service activity",
      source: "Privacy dashboard",
      status: "Paused after save",
      consequence: "Future saving stops; existing history needs clear action",
      action: "Clear date range",
      secondary: "Resume saving"
    },
    profile: {
      chip: "Profile visibility",
      title: "People and sharing controls name the audience",
      body: "The page separates public profile visibility from account security, marketing preference, and notification delivery choices.",
      scope: "People & sharing",
      value: "Birthday hidden; avatar visible",
      data: "Profile fields shown across services",
      source: "Account profile",
      status: "Saved",
      consequence: "Public viewers no longer see birthday",
      action: "Edit visibility",
      secondary: "Preview public profile",
      tone: "ready"
    },
    ads: {
      chip: "Ad personalization",
      title: "Personalization is a data-use setting",
      body: "Ad personalization says which activity is used and distinguishes personalization from cookie consent or notification topics.",
      scope: "Account advertising settings",
      value: "Personalized ads off",
      data: "Activity signals not used for ads",
      source: "Ad settings",
      status: "Applied immediately",
      consequence: "Ads may be less relevant; activity controls unchanged",
      action: "Review ad settings",
      secondary: "See activity controls"
    },
    location: {
      chip: "Location history",
      title: "Location setting explains collection and device scope",
      body: "Location history shows whether future location is saved and points to device permission when the operating system still allows access.",
      scope: "Account location history",
      value: "Off for this account",
      data: "Location timeline and places",
      source: "Account + device check",
      status: "Device permission still on",
      consequence: "Account history stops; app can still ask device location",
      action: "Open device settings",
      secondary: "Keep account history off",
      tone: "warning"
    },
    appAccess: {
      chip: "App access",
      title: "Apps with data access are listed by category",
      body: "Camera, microphone, contacts, photos, Bluetooth, local network, and files show which apps requested access and whether access is allowed.",
      scope: "Device privacy permissions",
      value: "Calendar Sync can read contacts",
      data: "Contacts, camera, microphone, photos",
      source: "Device permission store",
      status: "Access list current",
      consequence: "Revoking blocks future access from this device",
      action: "Revoke contacts",
      secondary: "View requested apps"
    },
    deviceMismatch: {
      chip: "Device permission mismatch",
      title: "Account and device values disagree",
      body: "The privacy setting says location history is off, but the device permission still allows the app to request location.",
      scope: "Account + iOS device",
      value: "Account off, device on",
      data: "Location",
      source: "Account privacy + OS permission",
      status: "Mismatch needs handoff",
      consequence: "Open device settings to revoke platform access",
      action: "Open Privacy & Security",
      secondary: "Keep account off",
      tone: "warning"
    },
    connectedApps: {
      chip: "Connected apps",
      title: "Third-party access is revocable",
      body: "The settings list connected apps, what data they can access, last used time, and the account that granted access.",
      scope: "Connected services",
      value: "3 apps connected",
      data: "Calendar, contacts, files",
      source: "OAuth grant store",
      status: "Last used shown",
      consequence: "Revocation stops future third-party access",
      action: "Revoke Slack app",
      secondary: "Inspect scopes"
    },
    dataSharing: {
      chip: "Data sharing",
      title: "Partner sharing names recipients and purpose",
      body: "Data-sharing rows name the partner, purpose, data category, last sync, and whether sharing is managed by account policy.",
      scope: "Partner sharing",
      value: "Research partner off",
      data: "Usage diagnostics and survey data",
      source: "Consent and sharing service",
      status: "Saved",
      consequence: "Future partner sync stops",
      action: "Review partners",
      secondary: "View consent record"
    },
    consent: {
      chip: "Consent handoff",
      title: "Consent purpose links to its record",
      body: "The privacy setting shows the effective value but opens the consent prompt history for purpose, version, timestamp, and withdrawal route.",
      scope: "AI training consent",
      value: "Withdrawn",
      data: "Workspace snippets",
      source: "Consent record v3",
      status: "Withdrawal synced",
      consequence: "Future training use stops",
      action: "Open consent record",
      secondary: "Review privacy controls"
    },
    cookies: {
      chip: "Cookie handoff",
      title: "Cookie controls are linked, not merged",
      body: "Cookie choices have a separate banner and preference record, while privacy settings summarize the current tracking status.",
      scope: "Browser cookie preferences",
      value: "Analytics off; essential on",
      data: "Cookies, pixels, local storage",
      source: "Cookie preference center",
      status: "Browser-specific",
      consequence: "Changing cookies may not affect account activity history",
      action: "Open cookie settings",
      secondary: "Back to privacy"
    },
    export: {
      chip: "Data export handoff",
      title: "Export is a separate copy workflow",
      body: "The page links to data export without implying that export clears, pauses, or deletes source data.",
      scope: "Account data package",
      value: "Export available",
      data: "Profile, activity, files, messages",
      source: "Data export workflow",
      status: "No export requested",
      consequence: "Export keeps a copy; privacy settings remain unchanged",
      action: "Open data export",
      secondary: "Stay here"
    },
    deleteAccount: {
      chip: "Delete account handoff",
      title: "Account deletion is not a privacy toggle",
      body: "The destructive account closure path is linked as a separate workflow with identity, retention, billing, and recovery states.",
      scope: "Account closure",
      value: "No deletion request",
      data: "Associated account data",
      source: "Delete account workflow",
      status: "Separate verification required",
      consequence: "Deletion request closes account; privacy settings only change controls",
      action: "Open delete account",
      secondary: "Keep account"
    },
    unavailable: {
      chip: "Unavailable data",
      title: "Missing dashboard data has a reason",
      body: "The page explains that data may be unavailable because collection is off, data was recently cleared, the user is too young, or the product is unsupported.",
      scope: "Voice activity",
      value: "No data available",
      data: "Voice recordings",
      source: "Privacy dashboard",
      status: "Collection off since May 2",
      consequence: "No data appears until saving is re-enabled",
      action: "Learn why",
      secondary: "Keep off"
    },
    managed: {
      chip: "Managed policy",
      title: "Organization owns this privacy value",
      body: "A managed account row names the administrator policy and blocks local success copy until the owning policy changes.",
      scope: "Enterprise workspace",
      value: "Diagnostics required by admin",
      data: "Product diagnostics",
      source: "Aster Finance policy",
      status: "Managed",
      consequence: "Request policy change from admin",
      action: "Contact admin",
      secondary: "View policy",
      tone: "warning"
    },
    child: {
      chip: "Child privacy default",
      title: "High privacy is the starting state",
      body: "Child-account settings start from high privacy, name guardian-owned controls, and avoid broad public visibility defaults.",
      scope: "Child account",
      value: "Public profile off",
      data: "Profile, location, contacts",
      source: "Family policy",
      status: "Guardian managed",
      consequence: "Guardian approval required for visibility changes",
      action: "Request guardian approval",
      secondary: "Keep private",
      tone: "warning"
    },
    region: {
      chip: "Region restriction",
      title: "Regional privacy rule changes available controls",
      body: "Region-restricted controls explain which privacy setting is unavailable and link to the governing policy rather than showing a broken toggle.",
      scope: "EU account",
      value: "Personalization limited",
      data: "Ad and product improvement data",
      source: "Regional policy",
      status: "Restricted",
      consequence: "Some choices are fixed by region",
      action: "View regional policy",
      secondary: "Back"
    },
    pending: {
      chip: "Pending sync",
      title: "Privacy change is not yet effective everywhere",
      body: "A pending sync state names the changed control, target systems, expected timing, and whether old values still apply.",
      scope: "Account + apps",
      value: "Connected app revocation pending",
      data: "Calendar scopes",
      source: "OAuth grant store",
      status: "2 of 3 services synced",
      consequence: "Access may remain until final sync",
      action: "Refresh status",
      secondary: "View details",
      tone: "warning"
    },
    saved: {
      chip: "Saved state",
      title: "Effective value and timestamp are recorded",
      body: "Saved status confirms the privacy row, old value, new value, source, and timestamp without exposing sensitive private data in telemetry.",
      scope: "Ad personalization",
      value: "Off",
      data: "Advertising signals",
      source: "Privacy settings",
      status: "Saved at 10:44",
      consequence: "Future ad personalization disabled",
      action: "View receipt",
      secondary: "Undo change",
      tone: "ready"
    },
    failed: {
      chip: "Failed save",
      title: "Failed privacy save preserves the draft",
      body: "The failed state keeps the chosen value, explains the source system error, and offers retry without claiming the privacy change applied.",
      scope: "Profile visibility",
      value: "Draft: hide phone number",
      data: "Public profile fields",
      source: "Profile service",
      status: "Save failed",
      consequence: "Phone number remains visible to contacts until retry succeeds",
      action: "Retry save",
      secondary: "Discard draft",
      tone: "danger"
    },
    reset: {
      chip: "Reset privacy group",
      title: "Reset names affected privacy controls",
      body: "Reset affects only activity controls and lists saved activity, auto-delete, voice recordings, and recommendations before confirmation.",
      scope: "Activity controls group",
      value: "Reset preview",
      data: "Saved activity and recommendations",
      source: "Privacy settings",
      status: "Needs confirmation",
      consequence: "Does not change profile visibility or app access",
      action: "Reset activity controls",
      secondary: "Cancel"
    },
    mobile: {
      chip: "Mobile compact privacy",
      title: "Privacy controls remain readable",
      body: "Compact cards keep category, effective value, scope, unavailable reason, and handoff actions visible without hiding controls behind policy text.",
      scope: "Mobile account and device",
      value: "Activity paused; camera allowed",
      data: "Activity, camera, profile",
      source: "Account + device",
      status: "Synced",
      consequence: "Open device settings for camera changes",
      action: "Review mobile privacy",
      secondary: "Open device settings",
      compact: true
    }
  };
  const item = config[mode];
  const titleId = `privacy-settings-title-${idSuffix}`;
  const descId = `privacy-settings-desc-${idSuffix}`;

  return (
    <section className={`privacy-settings-panel is-${mode} ${item.tone ? `is-${item.tone}` : ""} ${item.compact ? "is-compact" : ""}`} aria-labelledby={titleId} aria-describedby={descId}>
      <div className="privacy-settings-panel-head">
        <div>
          <span>{item.chip}</span>
          <strong id={titleId}>{item.title}</strong>
        </div>
        <b>{item.status}</b>
      </div>
      <p id={descId}>{item.body}</p>
      <div className="privacy-settings-evidence-grid" aria-label="Privacy settings control fields">
        <span><b>Scope</b>{item.scope}</span>
        <span><b>Effective value</b>{item.value}</span>
        <span><b>Data category</b>{item.data}</span>
        <span><b>Source of truth</b>{item.source}</span>
        <span><b>Status</b>{item.status}</span>
        <span><b>Consequence</b>{item.consequence}</span>
      </div>
      <div className="privacy-settings-actions">
        <button type="button" className="demo-button small primary">{item.action}</button>
        <button type="button" className="demo-button small">{item.secondary}</button>
        <button type="button" className="demo-button small">View privacy log</button>
      </div>
    </section>
  );
}

function PrivacySettingsGoodUi() {
  return (
    <div className="quality-example privacy-settings-demo">
      <PrivacySettingsPanel mode="overview" idSuffix="good-ui" />
      <p className="demo-status">Privacy control surface UI shows data category, effective value, scope, source of truth, status, and consequences rather than a policy-only page.</p>
    </div>
  );
}

function PrivacySettingsBadUi() {
  return (
    <div className="bad-ui-sample privacy-settings-bad-demo is-policyOnly">
      <div className="privacy-settings-broken" aria-label="Broken privacy settings">
        <strong>Privacy</strong>
        <p>Read our privacy policy. No current values, activity controls, profile visibility, app access, source of truth, unavailable reasons, or save status.</p>
        <div className="privacy-settings-broken-grid">
          <span>Policy-only</span>
          <span>No controls</span>
          <span>No effective values</span>
        </div>
        <button type="button" className="demo-button small danger">Turn privacy off</button>
      </div>
      <p className="demo-status">The broken UI offers legal text instead of privacy settings users can inspect and change.</p>
    </div>
  );
}

function PrivacySettingsGoodUx() {
  const [mode, setMode] = useState<PrivacySettingsMode>("overview");
  return (
    <div className="quality-example privacy-settings-demo">
      <div className="privacy-settings-controls" aria-label="Privacy settings exercise controls">
        {privacySettingsGoodLabels.map(([key, label]) => (
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
      <PrivacySettingsPanel mode={mode} idSuffix="good-ux" />
      <p className="demo-status" aria-live="polite">Privacy settings state: {privacySettingsGoodLabels.find(([key]) => key === mode)?.[1]}.</p>
    </div>
  );
}

function PrivacySettingsBadUx() {
  const [mode, setMode] = useState<PrivacySettingsBadMode>("policyOnly");
  const copy: Record<PrivacySettingsBadMode, {
    title: string;
    body: string;
    fieldA: string;
    fieldB: string;
    fieldC: string;
    outcome: string;
  }> = {
    policyOnly: {
      title: "Policy-only",
      body: "The Privacy page links to legal text but provides no controls for activity history, profile visibility, app access, personalization, or data sharing.",
      fieldA: "Policy link",
      fieldB: "No controls",
      fieldC: "No status",
      outcome: "Users cannot change privacy posture from the privacy page."
    },
    masterSwitch: {
      title: "Master switch",
      body: "One switch says Privacy mode but hides separate collection, visibility, personalization, permission, sharing, and retention effects.",
      fieldA: "All privacy",
      fieldB: "Mixed scopes",
      fieldC: "Hidden effects",
      outcome: "Users cannot predict what changes and what stays active."
    },
    hiddenAppAccess: {
      title: "Hidden app access",
      body: "Connected apps and device permissions remain active, but the account page says data access is private.",
      fieldA: "OAuth hidden",
      fieldB: "Camera allowed",
      fieldC: "No handoff",
      outcome: "Privacy settings disagree with app and device access."
    },
    consentMismatch: {
      title: "Consent mismatch",
      body: "A consent prompt says AI training was withdrawn, while privacy settings still show personalization enabled with no source conflict.",
      fieldA: "Consent off",
      fieldB: "Setting on",
      fieldC: "No source",
      outcome: "The user cannot tell which privacy value is effective."
    },
    staleCurrent: {
      title: "Stale current values",
      body: "The page shows cached values after data was cleared and collection was turned off, but it never says the dashboard is stale.",
      fieldA: "Old activity",
      fieldB: "No timestamp",
      fieldC: "False saved",
      outcome: "Users trust privacy values that are no longer authoritative."
    },
    overbroadReset: {
      title: "Overbroad reset",
      body: "Reset privacy changes profile visibility, app access, ad personalization, location, and cookies without listing affected controls.",
      fieldA: "Reset all",
      fieldB: "No preview",
      fieldC: "No undo scope",
      outcome: "A small recovery action silently changes unrelated privacy choices."
    },
    lowPrivacyDefault: {
      title: "Low-privacy default",
      body: "A child or sensitive-data account starts with public visibility, personalization, and sharing enabled without guardian or policy review.",
      fieldA: "Public by default",
      fieldB: "Child account",
      fieldC: "No guardian",
      outcome: "Default settings expose more data than the user context warrants."
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example privacy-settings-bad-demo is-${mode}`}>
      <div className="privacy-settings-controls" aria-label="Privacy settings misuse controls">
        {privacySettingsBadLabels.map(([key, label]) => (
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
      <div className="privacy-settings-broken" aria-label={`Broken state: ${item.title}`}>
        <strong>{item.title}</strong>
        <p>{item.body}</p>
        <div className="privacy-settings-broken-grid">
          <span>{item.fieldA}</span>
          <span>{item.fieldB}</span>
          <span>{item.fieldC}</span>
        </div>
        <button type="button" className="demo-button small danger">{mode === "masterSwitch" ? "Turn privacy off" : "Continue"}</button>
      </div>
      <p className="demo-status" aria-live="polite">{item.outcome}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PrivacySettingsGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PrivacySettingsBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PrivacySettingsGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PrivacySettingsBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
