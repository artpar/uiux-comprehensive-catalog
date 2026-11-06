import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type PreferenceCenterMode =
  | "overview"
  | "channels"
  | "topics"
  | "notifications"
  | "privacy"
  | "cookies"
  | "language"
  | "required"
  | "managed"
  | "unsaved"
  | "saved"
  | "failed"
  | "withdraw"
  | "restore"
  | "conflict"
  | "mobile";

const preferenceCenterCopy: Record<PreferenceCenterMode, {
  status: string;
  title: string;
  detail: string;
  primaryCategory: string;
  primaryValue: string;
  note: string;
  rows: Array<{ label: string; value: string; state: "on" | "off" | "required" | "managed" | "pending" | "warning" }>;
}> = {
  overview: {
    status: "Effective status",
    title: "Account preference center",
    detail: "The overview summarizes channels, topics, privacy, cookies, language, and required service messages with current source and last saved time.",
    primaryCategory: "All categories",
    primaryValue: "8 active choices",
    note: "Overview is a return surface, not a first-visit prompt.",
    rows: [
      { label: "Promotional email", value: "Monthly", state: "on" },
      { label: "SMS offers", value: "Off", state: "off" },
      { label: "Security notices", value: "Required", state: "required" }
    ]
  },
  channels: {
    status: "Channel choices",
    title: "Communication channels",
    detail: "Email, SMS, push, and in-app contact choices are shown separately so one opt-out cannot hide another active channel.",
    primaryCategory: "Channels",
    primaryValue: "Email on, SMS off",
    note: "Channel controls name the future messages each destination affects.",
    rows: [
      { label: "Email updates", value: "Product and learning", state: "on" },
      { label: "SMS marketing", value: "Disabled", state: "off" },
      { label: "Push promos", value: "Account only", state: "pending" }
    ]
  },
  topics: {
    status: "Topic interests",
    title: "Topics and interests",
    detail: "Users choose product releases, education, community events, and offers without changing contactability or cookie consent.",
    primaryCategory: "Topics",
    primaryValue: "3 selected",
    note: "Topics describe content, while channels describe delivery.",
    rows: [
      { label: "Product releases", value: "Selected", state: "on" },
      { label: "Learning events", value: "Selected", state: "on" },
      { label: "Sales offers", value: "Paused", state: "off" }
    ]
  },
  notifications: {
    status: "Delivery summary",
    title: "Notification preferences summary",
    detail: "Notification delivery remains a linked section with quiet hours, digest, and push permission summarized without replacing the broader preference center.",
    primaryCategory: "Notifications",
    primaryValue: "Digest enabled",
    note: "Notification delivery is one area inside the hub.",
    rows: [
      { label: "Mentions", value: "Immediate", state: "on" },
      { label: "Product digest", value: "Weekly", state: "pending" },
      { label: "Quiet hours", value: "10 PM to 7 AM", state: "on" }
    ]
  },
  privacy: {
    status: "Consent scope",
    title: "Privacy and data sharing",
    detail: "Analytics, ad personalization, partner sharing, and profile enrichment show purpose, scope, owner, and withdrawal availability.",
    primaryCategory: "Privacy",
    primaryValue: "Ad personalization off",
    note: "Privacy choices include purpose and data-use scope.",
    rows: [
      { label: "Analytics", value: "Allowed", state: "on" },
      { label: "Ad personalization", value: "Withdrawn", state: "off" },
      { label: "Partner sharing", value: "Region blocked", state: "warning" }
    ]
  },
  cookies: {
    status: "Cookie controls",
    title: "Cookie and tracking choices",
    detail: "Cookie purposes can be reviewed after the banner, with necessary cookies separated from analytics and personalization purposes.",
    primaryCategory: "Cookies",
    primaryValue: "Analytics allowed",
    note: "The preference center is the durable path to revise banner choices.",
    rows: [
      { label: "Strictly necessary", value: "Always on", state: "required" },
      { label: "Analytics cookies", value: "Allowed", state: "on" },
      { label: "Advertising cookies", value: "Off", state: "off" }
    ]
  },
  language: {
    status: "Locale",
    title: "Language and region",
    detail: "Language, region, and units are visible preference categories when they affect communications and consent text.",
    primaryCategory: "Language",
    primaryValue: "English, United States",
    note: "Locale choices do not silently change legal consent scope.",
    rows: [
      { label: "Language", value: "English", state: "on" },
      { label: "Region", value: "United States", state: "on" },
      { label: "Legal text", value: "US policy", state: "managed" }
    ]
  },
  required: {
    status: "Cannot opt out",
    title: "Required service messages",
    detail: "Security, billing, account ownership, legal, and transactional messages stay listed so users do not mistake them for optional marketing.",
    primaryCategory: "Required",
    primaryValue: "5 message types",
    note: "Required rows explain why disable controls are unavailable.",
    rows: [
      { label: "Security alerts", value: "Required", state: "required" },
      { label: "Billing receipts", value: "Required", state: "required" },
      { label: "Terms notices", value: "Required", state: "required" }
    ]
  },
  managed: {
    status: "Policy managed",
    title: "Managed enterprise preferences",
    detail: "Organization policy owns regional retention notices and employee product updates, so controls show the owner instead of pretending to save.",
    primaryCategory: "Managed values",
    primaryValue: "2 locked rows",
    note: "Managed values show the source and escalation path.",
    rows: [
      { label: "Employee updates", value: "Managed by HR", state: "managed" },
      { label: "Audit notices", value: "Organization policy", state: "managed" },
      { label: "Learning digest", value: "User controlled", state: "on" }
    ]
  },
  unsaved: {
    status: "Unsaved changes",
    title: "Unsaved preference edits",
    detail: "Changed categories are collected in a review bar so the user can save, discard, or inspect exactly what will change.",
    primaryCategory: "Review changes",
    primaryValue: "4 pending edits",
    note: "Draft values remain visible until saved or discarded.",
    rows: [
      { label: "SMS marketing", value: "Will turn off", state: "pending" },
      { label: "Analytics", value: "Will withdraw", state: "pending" },
      { label: "Language", value: "Will switch to Spanish", state: "pending" }
    ]
  },
  saved: {
    status: "Saved just now",
    title: "Preferences saved",
    detail: "Save confirmation names changed categories, timestamp, and remaining required messages instead of using a vague success banner.",
    primaryCategory: "Saved result",
    primaryValue: "4 changes recorded",
    note: "Saved state confirms optional changes and required exceptions.",
    rows: [
      { label: "SMS marketing", value: "Off", state: "off" },
      { label: "Analytics", value: "Withdrawn", state: "off" },
      { label: "Security notices", value: "Still required", state: "required" }
    ]
  },
  failed: {
    status: "Save failed",
    title: "Preserved failed save",
    detail: "One category failed to sync, but the draft remains in place and the error names the affected owner system.",
    primaryCategory: "Failed category",
    primaryValue: "CRM conflict",
    note: "Failed saves preserve choices and show a retry path.",
    rows: [
      { label: "SMS marketing", value: "Draft off", state: "warning" },
      { label: "Email topics", value: "Saved", state: "on" },
      { label: "CRM source", value: "Needs retry", state: "warning" }
    ]
  },
  withdraw: {
    status: "Confirm withdrawal",
    title: "Withdraw consent",
    detail: "Withdrawal lists analytics, ads, partner sharing, and personalization effects before the user confirms.",
    primaryCategory: "Withdraw",
    primaryValue: "3 purposes",
    note: "Withdrawal is explicit and separate from required service messages.",
    rows: [
      { label: "Analytics", value: "Withdraw", state: "warning" },
      { label: "Ad personalization", value: "Withdraw", state: "warning" },
      { label: "Service notices", value: "Remain required", state: "required" }
    ]
  },
  restore: {
    status: "Restore defaults",
    title: "Restore communication defaults",
    detail: "Restore names only the preference group affected, leaving privacy withdrawals and required messages untouched.",
    primaryCategory: "Restore",
    primaryValue: "Channels only",
    note: "Restore scope is narrow and reversible before save.",
    rows: [
      { label: "Email frequency", value: "Default monthly", state: "pending" },
      { label: "SMS marketing", value: "Stay off", state: "off" },
      { label: "Cookie consent", value: "No change", state: "on" }
    ]
  },
  conflict: {
    status: "Source conflict",
    title: "CRM and account disagree",
    detail: "The account says SMS is off while CRM has SMS on; the UI names the source of truth and waits for sync resolution.",
    primaryCategory: "Source of truth",
    primaryValue: "Account wins",
    note: "Conflicts must be visible before confirmation.",
    rows: [
      { label: "Account profile", value: "SMS off", state: "off" },
      { label: "CRM record", value: "SMS on", state: "warning" },
      { label: "Effective value", value: "Off after sync", state: "pending" }
    ]
  },
  mobile: {
    status: "Mobile categories",
    title: "Condensed preference center",
    detail: "Small screens keep category status, required messages, managed values, and save state visible through stacked category cards.",
    primaryCategory: "Mobile",
    primaryValue: "Cards expanded",
    note: "Mobile layout does not hide consent scope.",
    rows: [
      { label: "Channels", value: "2 active", state: "on" },
      { label: "Privacy", value: "1 withdrawn", state: "off" },
      { label: "Required", value: "Listed", state: "required" }
    ]
  }
};

function PreferenceCenterFrame({
  mode = "overview",
  idSuffix = "demo"
}: {
  mode?: PreferenceCenterMode;
  idSuffix?: string;
}) {
  const copy = preferenceCenterCopy[mode];
  const titleId = `preference-center-title-${idSuffix}`;
  const categories = [
    { label: "Overview", active: mode === "overview", meta: "8 categories" },
    { label: "Channels", active: mode === "channels", meta: "Email, SMS, push" },
    { label: "Topics", active: mode === "topics", meta: "3 selected" },
    { label: "Privacy", active: mode === "privacy" || mode === "withdraw", meta: "Consent scope" },
    { label: "Cookies", active: mode === "cookies", meta: "Purposes" },
    { label: "Language", active: mode === "language", meta: "en-US" },
    { label: "Required", active: mode === "required", meta: "Always sent" },
    { label: "Managed", active: mode === "managed" || mode === "conflict", meta: "Policy and sync" }
  ];
  const className = `preference-center-frame is-${mode}`;
  return (
    <div className={className}>
      <nav className="preference-center-nav" aria-label="Preference categories">
        {categories.map((category) => (
          <span key={category.label} className={category.active ? "is-current" : ""}>
            <strong>{category.label}</strong>
            <em>{category.meta}</em>
          </span>
        ))}
      </nav>
      <section className="preference-center-panel" aria-labelledby={titleId}>
        <div className="preference-center-heading">
          <span>{copy.status}</span>
          <strong>{copy.primaryValue}</strong>
        </div>
        <h4 id={titleId}>{copy.title}</h4>
        <p>{copy.detail}</p>
        <div className="preference-center-summary" aria-label="Preference category summary">
          <span>{copy.primaryCategory}</span>
          <strong>Source: Account profile</strong>
          <em>Saved: Today 14:06</em>
        </div>
        <div className="preference-center-list" role="list" aria-label="Preference values">
          {copy.rows.map((row) => (
            <div key={row.label} role="listitem" className={`is-${row.state}`}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
              <em>{row.state}</em>
            </div>
          ))}
        </div>
        <div className={mode === "failed" || mode === "conflict" || mode === "withdraw" ? "preference-center-note is-warning" : "preference-center-note"}>
          {copy.note}
        </div>
        <div className="preference-center-actions">
          <button type="button" className="demo-button small">Discard</button>
          <button type="button" className="demo-button small">Withdraw</button>
          <button type="button" className="demo-button small primary">Save preferences</button>
        </div>
      </section>
    </div>
  );
}

function PreferenceCenterGoodUi() {
  return (
    <div className="quality-example preference-center-demo">
      <PreferenceCenterFrame mode="overview" />
      <p className="demo-status">The hub summarizes categories, effective status, sources, required messages, and save actions across communication and consent choices.</p>
    </div>
  );
}

function PreferenceCenterBadUi() {
  return (
    <div className="bad-ui-sample preference-center-bad-demo is-everythingSwitch">
      <strong>Preferences</strong>
      <div className="preference-center-bad-grid">
        {["Everything off", "Required?", "Cookies somewhere", "No source"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p className="demo-status">The broken page collapses channels, topics, consent, language, and required messages into one ambiguous switch.</p>
    </div>
  );
}

function PreferenceCenterGoodUx() {
  const [mode, setMode] = useState<PreferenceCenterMode>("overview");
  const [message, setMessage] = useState("Overview names category status, source, and required-message exceptions before any editing.");
  function choose(nextMode: PreferenceCenterMode, nextMessage: string) {
    setMode(nextMode);
    setMessage(nextMessage);
  }
  const controls: Array<{ mode: PreferenceCenterMode; label: string; message: string }> = [
    { mode: "overview", label: "Overview", message: "Overview names category status, source, and required-message exceptions before any editing." },
    { mode: "channels", label: "Channels", message: "Channels separate email, SMS, push, and in-app contact instead of hiding them behind one switch." },
    { mode: "topics", label: "Topics", message: "Topic interests change content selection without changing delivery channels or privacy consent." },
    { mode: "notifications", label: "Notifications", message: "Notification delivery is summarized as one section inside the broader preference center." },
    { mode: "privacy", label: "Privacy", message: "Privacy rows show data use, consent purpose, owner, and withdrawal availability." },
    { mode: "cookies", label: "Cookies", message: "Cookie controls provide a durable route to revise consent gathered from the banner." },
    { mode: "language", label: "Language", message: "Language and region preferences are visible when they affect communication and consent copy." },
    { mode: "required", label: "Required", message: "Required service messages are listed separately so marketing opt-out is not overstated." },
    { mode: "managed", label: "Managed", message: "Managed rows name the administrator or policy source instead of pretending the user can save them." },
    { mode: "unsaved", label: "Unsaved", message: "Unsaved edits are preserved and grouped for review before saving." },
    { mode: "saved", label: "Saved", message: "Saved state names changed categories and remaining required exceptions." },
    { mode: "failed", label: "Failed", message: "Failed save preserves draft choices and names the owner system that could not update." },
    { mode: "withdraw", label: "Withdraw", message: "Withdrawal confirms affected consent purposes and keeps required messages distinct." },
    { mode: "restore", label: "Restore", message: "Restore defaults applies only to the named preference group, not privacy withdrawals." },
    { mode: "conflict", label: "Conflict", message: "Source conflict explains CRM versus account values and the effective result after sync." },
    { mode: "mobile", label: "Mobile", message: "Mobile layout keeps category cards, consent scope, required rows, and save state visible." }
  ];
  return (
    <div className="quality-example preference-center-demo">
      <PreferenceCenterFrame mode={mode} idSuffix="good-ux" />
      <div className="demo-row preference-center-controls" aria-label="Preference center exercise controls">
        {controls.map((control) => (
          <button
            key={control.mode}
            type="button"
            className={mode === control.mode ? "demo-button small primary" : "demo-button small"}
            onClick={() => choose(control.mode, control.message)}
          >
            {control.label}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function PreferenceCenterBadUx() {
  type Mode = "everythingSwitch" | "hiddenRequired" | "consentDrift" | "noSaveState" | "policyMystery" | "categoryDump";
  const [mode, setMode] = useState<Mode>("everythingSwitch");
  const copy: Record<Mode, string> = {
    everythingSwitch: "One master switch claims every preference is off while email, SMS, cookies, and topics have different consequences.",
    hiddenRequired: "Transactional and security messages remain required, but the page never says they will still arrive.",
    consentDrift: "Cookie consent and account privacy values disagree, and the UI does not reveal which one is effective.",
    noSaveState: "Several categories change but there is no pending, saved, failed, or discarded state.",
    policyMystery: "A managed row rejects edits without naming the administrator, policy, or escalation route.",
    categoryDump: "Dozens of mixed preferences appear in one long form with no category status, source, or mobile scan path."
  };
  const labels: Record<Mode, string[]> = {
    everythingSwitch: ["All off", "Email?", "SMS?", "Cookies?"],
    hiddenRequired: ["Marketing off", "Security hidden", "Billing hidden", "Legal hidden"],
    consentDrift: ["Banner denied", "Account allowed", "CRM unknown", "No effective value"],
    noSaveState: ["Changed", "Changed", "Changed", "No status"],
    policyMystery: ["Locked", "Why?", "Who owns it?", "No route"],
    categoryDump: ["Email", "Color", "Tax", "Ads", "Language", "Team", "Cookies", "Receipts"]
  };
  const buttons: Array<{ mode: Mode; label: string }> = [
    { mode: "everythingSwitch", label: "Everything switch" },
    { mode: "hiddenRequired", label: "Hidden required" },
    { mode: "consentDrift", label: "Consent drift" },
    { mode: "noSaveState", label: "No save" },
    { mode: "policyMystery", label: "Policy mystery" },
    { mode: "categoryDump", label: "Category dump" }
  ];
  return (
    <div className={`quality-example preference-center-bad-demo is-${mode}`}>
      <strong>{mode === "categoryDump" ? "Preference dump" : "Broken preference center"}</strong>
      <div className="preference-center-bad-grid">
        {labels[mode].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row preference-center-controls">
        {buttons.map((button) => (
          <button
            key={button.mode}
            type="button"
            className={mode === button.mode ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(button.mode)}
          >
            {button.label}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PreferenceCenterGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PreferenceCenterBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PreferenceCenterGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PreferenceCenterBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
