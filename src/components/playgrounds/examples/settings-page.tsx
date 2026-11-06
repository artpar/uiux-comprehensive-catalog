import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type SettingsPageMode = "overview" | "security" | "deepLink" | "search" | "noResults" | "mobile" | "unavailable" | "highRisk" | "returnPath" | "longLabels";

const settingsPageCopy: Record<SettingsPageMode, {
  title: string;
  scope: string;
  status: string;
  summary: string;
  search: string;
  selected: string;
  returnLabel: string;
  note: string;
  cards: Array<{ label: string; value: string; kind: "current" | "normal" | "warning" | "locked" }>;
}> = {
  overview: {
    title: "Workspace settings",
    scope: "Workspace",
    status: "Section overview",
    summary: "The landing page groups account, workspace, security, notifications, integrations, and advanced sections before any row editing starts.",
    search: "",
    selected: "Overview",
    returnLabel: "Back to Project Atlas",
    note: "The page shell tells users where they are and what sections exist.",
    cards: [
      { label: "Account", value: "Profile, language, sign-in", kind: "normal" },
      { label: "Workspace", value: "Members, roles, defaults", kind: "normal" },
      { label: "Security", value: "MFA, tokens, audit log", kind: "current" }
    ]
  },
  security: {
    title: "Security settings",
    scope: "Workspace",
    status: "Selected section",
    summary: "The selected section has its own heading, summary, and section marker while the broader Settings destination stays visible.",
    search: "",
    selected: "Security",
    returnLabel: "Back to Project Atlas",
    note: "Selected-section state is a page-orientation concern before individual settings behavior.",
    cards: [
      { label: "Sign-in policy", value: "Workspace scope", kind: "current" },
      { label: "API tokens", value: "3 active", kind: "normal" },
      { label: "Audit log", value: "Admin only", kind: "locked" }
    ]
  },
  deepLink: {
    title: "Security settings",
    scope: "Deep link",
    status: "Arrived from email",
    summary: "A deep link lands on the requested section with the page title, section list, and scope visible instead of an orphaned form.",
    search: "",
    selected: "Security",
    returnLabel: "Return to invite email",
    note: "Deep links preserve settings context and return origin.",
    cards: [
      { label: "MFA requirement", value: "Linked target", kind: "current" },
      { label: "Section path", value: "Settings / Security", kind: "normal" },
      { label: "Return route", value: "Invite email", kind: "normal" }
    ]
  },
  search: {
    title: "Settings search",
    scope: "Workspace",
    status: "2 results",
    summary: "Search results name the owning section and can take users to a section without losing the settings page frame.",
    search: "retention",
    selected: "Search",
    returnLabel: "Back to Project Atlas",
    note: "Find-in-settings is navigation, not a value editor.",
    cards: [
      { label: "Data retention", value: "Security / Audit log", kind: "current" },
      { label: "Message retention", value: "Notifications / Digest", kind: "normal" },
      { label: "Result path", value: "Section visible", kind: "normal" }
    ]
  },
  noResults: {
    title: "Settings search",
    scope: "Workspace",
    status: "No matches",
    summary: "No-results state keeps the section map visible and suggests nearby labels rather than sending users to help or global search.",
    search: "wallpaper",
    selected: "Search",
    returnLabel: "Back to Project Atlas",
    note: "No match is recoverable inside the settings page.",
    cards: [
      { label: "No setting found", value: "Try display density", kind: "warning" },
      { label: "Browse sections", value: "Still available", kind: "normal" },
      { label: "Search scope", value: "Settings only", kind: "normal" }
    ]
  },
  mobile: {
    title: "Workspace settings",
    scope: "Mobile",
    status: "Section picker",
    summary: "Small screens keep the selected section visible and provide a labelled picker for moving between settings sections.",
    search: "",
    selected: "Notifications",
    returnLabel: "Back to Project Atlas",
    note: "Mobile layout keeps the page hierarchy rather than hiding it in an unlabeled drawer.",
    cards: [
      { label: "Current section", value: "Notifications", kind: "current" },
      { label: "Section picker", value: "8 sections", kind: "normal" },
      { label: "Return action", value: "Project Atlas", kind: "normal" }
    ]
  },
  unavailable: {
    title: "Billing settings",
    scope: "Workspace",
    status: "Permission limited",
    summary: "Unavailable sections stay listed with ownership and access reason, so users do not assume the section is missing.",
    search: "",
    selected: "Billing",
    returnLabel: "Back to Project Atlas",
    note: "Permission-limited settings sections need a visible explanation.",
    cards: [
      { label: "Billing", value: "Owner role required", kind: "locked" },
      { label: "Invoices", value: "View-only", kind: "locked" },
      { label: "Request access", value: "Ask workspace owner", kind: "normal" }
    ]
  },
  highRisk: {
    title: "Account settings",
    scope: "Personal account",
    status: "Separated risk area",
    summary: "Account closure, legal changes, and irreversible actions are separated from ordinary app settings with a clear heading.",
    search: "",
    selected: "Account",
    returnLabel: "Back to Project Atlas",
    note: "High-risk destinations should not sit beside harmless display settings.",
    cards: [
      { label: "Profile and language", value: "Ordinary settings", kind: "normal" },
      { label: "Export account data", value: "Separate flow", kind: "warning" },
      { label: "Close account", value: "High-risk area", kind: "warning" }
    ]
  },
  returnPath: {
    title: "Workspace settings",
    scope: "Opened from task",
    status: "Return route saved",
    summary: "Opening settings from a project preserves a return path to the project rather than sending every user to a generic home page.",
    search: "",
    selected: "Workspace",
    returnLabel: "Back to Project Atlas",
    note: "Return behavior is part of the page contract.",
    cards: [
      { label: "Origin", value: "Project Atlas", kind: "current" },
      { label: "Section", value: "Workspace defaults", kind: "normal" },
      { label: "Back action", value: "Project route", kind: "normal" }
    ]
  },
  longLabels: {
    title: "Organization administration settings",
    scope: "Organization",
    status: "Long labels wrapped",
    summary: "Long translated section names wrap without overlapping counts, selected markers, search results, or section actions.",
    search: "",
    selected: "Regional compliance and external sharing controls",
    returnLabel: "Back to organization dashboard",
    note: "Readable labels matter more than fixed-width navigation ornament.",
    cards: [
      { label: "Regional compliance and external sharing controls", value: "Selected", kind: "current" },
      { label: "Identity provider and single sign-on routing", value: "Configured", kind: "normal" },
      { label: "Notification delivery and escalation policies", value: "8 items", kind: "normal" }
    ]
  }
};

function SettingsPageFrame({
  mode = "overview",
  idSuffix = "default"
}: {
  mode?: SettingsPageMode;
  idSuffix?: string;
}) {
  const copy = settingsPageCopy[mode];
  const sections = [
    "Overview",
    "Account",
    "Workspace",
    "Security",
    "Notifications",
    "Privacy",
    "Integrations",
    "Billing"
  ];
  return (
    <div className={`settings-page-frame is-${mode}`}>
      <div className="settings-page-topbar">
        <span>{copy.returnLabel}</span>
        <strong>{copy.scope}</strong>
      </div>
      <aside className="settings-page-rail" aria-label="Settings page sections">
        {sections.map((section) => (
          <span key={section} className={copy.selected === section || (copy.selected !== "Search" && copy.selected.includes(section)) ? "is-current" : ""}>
            {section}
          </span>
        ))}
      </aside>
      <section className="settings-page-main" aria-labelledby={`settings-page-title-${idSuffix}`}>
        <div className="settings-page-heading">
          <span>{copy.status}</span>
          <strong>{copy.selected}</strong>
        </div>
        <h4 id={`settings-page-title-${idSuffix}`}>{copy.title}</h4>
        <p>{copy.summary}</p>
        <label className="settings-page-search">
          <span>Find in settings</span>
          <input value={copy.search} placeholder="Search sections and settings" readOnly />
        </label>
        <div className="settings-page-cards" role="list" aria-label="Settings page section cards">
          {copy.cards.map((card) => (
            <div key={card.label} role="listitem" className={`is-${card.kind}`}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </div>
          ))}
        </div>
        <div className={mode === "unavailable" || mode === "highRisk" || mode === "noResults" ? "settings-page-note is-warning" : "settings-page-note"}>
          {copy.note}
        </div>
      </section>
    </div>
  );
}

function SettingsPageGoodUi() {
  return (
    <div className="quality-example settings-page-demo">
      <SettingsPageFrame mode="security" idSuffix="good-ui" />
      <p className="demo-status">The page shell shows destination title, section rail, selected section, search, scope, cards, and a return path before individual settings are edited.</p>
    </div>
  );
}

function SettingsPageBadUi() {
  return (
    <div className="bad-ui-sample settings-page-bad-demo is-linkDump">
      <strong>Settings</strong>
      <div className="settings-page-bad-grid">
        {["Invoices", "Help", "Delete", "Theme", "Security", "Tour"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p className="demo-status">The broken page is an unstructured destination list with no selected section, search scope, return path, or risk separation.</p>
    </div>
  );
}

function SettingsPageGoodUx() {
  const [mode, setMode] = useState<SettingsPageMode>("overview");
  const [message, setMessage] = useState("Overview shows the settings destination, section groups, scope, and return route.");
  const controls: Array<{ mode: SettingsPageMode; label: string; message: string }> = [
    { mode: "overview", label: "Overview", message: "Overview shows the settings destination, section groups, scope, and return route." },
    { mode: "security", label: "Security", message: "Selected section state keeps Security highlighted while preserving the Settings page frame." },
    { mode: "deepLink", label: "Deep link", message: "Deep links land with page title, section context, target row, and return origin visible." },
    { mode: "search", label: "Search", message: "Settings search names the owning section and keeps users inside the settings destination." },
    { mode: "noResults", label: "No results", message: "No-results recovery keeps browsing sections available and suggests nearby settings language." },
    { mode: "mobile", label: "Mobile", message: "Mobile state keeps selected section and a labelled section picker available." },
    { mode: "unavailable", label: "Unavailable", message: "Unavailable sections remain discoverable with permission reason and access route." },
    { mode: "highRisk", label: "High risk", message: "High-risk account destinations are separated from ordinary settings sections." },
    { mode: "returnPath", label: "Return path", message: "Return path remembers the product area that opened settings." },
    { mode: "longLabels", label: "Long labels", message: "Long localized labels wrap without hiding selected state or section summaries." }
  ];
  return (
    <div className="quality-example settings-page-demo">
      <SettingsPageFrame mode={mode} idSuffix="good-ux" />
      <div className="demo-row settings-page-controls" aria-label="Settings page exercise controls">
        {controls.map((control) => (
          <button
            key={control.mode}
            type="button"
            className={mode === control.mode ? "demo-button small primary" : "demo-button small"}
            onClick={() => {
              setMode(control.mode);
              setMessage(control.message);
            }}
          >
            {control.label}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function SettingsPageBadUx() {
  type Mode = "linkDump" | "hiddenSection" | "tabOverflow" | "globalConfusion" | "orphanDeepLink" | "riskyMix";
  const [mode, setMode] = useState<Mode>("linkDump");
  const copy: Record<Mode, string> = {
    linkDump: "The page mixes links, invoices, help, account closure, and ordinary settings with no section hierarchy.",
    hiddenSection: "Mobile users open one category and lose the list of Account, Security, Privacy, and Notifications sections.",
    tabOverflow: "Dozens of unrelated settings categories are squeezed into horizontal tabs, hiding important sections.",
    globalConfusion: "Global product navigation and settings section navigation look identical, so users lose orientation.",
    orphanDeepLink: "A deep link opens a single form with no settings title, section list, scope label, or return route.",
    riskyMix: "Irreversible account closure sits beside harmless display settings without separation or warning context."
  };
  const labels: Record<Mode, string[]> = {
    linkDump: ["Help", "Invoices", "Theme", "Delete"],
    hiddenSection: ["Security open", "No section list", "Back maze"],
    tabOverflow: ["Account", "Workspace", "Security", "Privacy", "Billing", "More..."],
    globalConfusion: ["Projects", "Settings", "Security", "Reports"],
    orphanDeepLink: ["MFA form", "No title", "No return"],
    riskyMix: ["Dark mode", "Close account", "Language"]
  };
  const controls: Array<{ mode: Mode; label: string }> = [
    { mode: "linkDump", label: "Link dump" },
    { mode: "hiddenSection", label: "Hidden section" },
    { mode: "tabOverflow", label: "Tab overflow" },
    { mode: "globalConfusion", label: "Global confusion" },
    { mode: "orphanDeepLink", label: "Orphan deep link" },
    { mode: "riskyMix", label: "Risky mix" }
  ];
  return (
    <div className={`quality-example settings-page-bad-demo is-${mode}`}>
      <strong>{mode === "orphanDeepLink" ? "Deep link" : mode === "riskyMix" ? "Account settings" : "Broken settings page"}</strong>
      <div className="settings-page-bad-grid">
        {labels[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row settings-page-controls">
        {controls.map((control) => (
          <button
            key={control.mode}
            type="button"
            className={mode === control.mode ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(control.mode)}
          >
            {control.label}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SettingsPageGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SettingsPageBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SettingsPageGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SettingsPageBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
