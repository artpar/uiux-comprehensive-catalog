import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type ResponsiveNavigationAdaptationMode =
  | "compact"
  | "mediumRail"
  | "expandedSide"
  | "denseOverflow"
  | "moreDrawer"
  | "routePreserved"
  | "filterPreserved"
  | "draftPreserved"
  | "badgePreserved"
  | "keyboardInset"
  | "safeArea"
  | "splitScreen"
  | "landscape"
  | "drawerResize"
  | "focusRecovery"
  | "longLabels"
  | "utilitySeparate";

type ResponsiveNavigationAdaptationBadMode =
  | "missingDestination"
  | "renamedLabels"
  | "duplicateSurfaces"
  | "resetOnResize"
  | "hiddenFocus"
  | "iconOnlyMystery"
  | "actionInNav";

const responsiveNavigationGoodLabels: Array<[ResponsiveNavigationAdaptationMode, string]> = [
  ["compact", "Compact"],
  ["mediumRail", "Medium rail"],
  ["expandedSide", "Expanded side"],
  ["denseOverflow", "Dense overflow"],
  ["moreDrawer", "More drawer"],
  ["routePreserved", "Route preserved"],
  ["filterPreserved", "Filter preserved"],
  ["draftPreserved", "Draft preserved"],
  ["badgePreserved", "Badge preserved"],
  ["keyboardInset", "Keyboard inset"],
  ["safeArea", "Safe area"],
  ["splitScreen", "Split screen"],
  ["landscape", "Landscape"],
  ["drawerResize", "Drawer resize"],
  ["focusRecovery", "Focus recovery"],
  ["longLabels", "Long labels"],
  ["utilitySeparate", "Utility separate"]
];

const responsiveNavigationBadLabels: Array<[ResponsiveNavigationAdaptationBadMode, string]> = [
  ["missingDestination", "Missing destination"],
  ["renamedLabels", "Renamed labels"],
  ["duplicateSurfaces", "Duplicate surfaces"],
  ["resetOnResize", "Reset on resize"],
  ["hiddenFocus", "Hidden focus"],
  ["iconOnlyMystery", "Icon mystery"],
  ["actionInNav", "Action in nav"]
];

type ResponsiveNavigationAdaptationItem = {
  chip: string;
  title: string;
  shell: "compact" | "rail" | "expanded" | "drawer";
  width: string;
  visible: string[];
  overflow: string;
  current: string;
  detail: string;
  status: string;
  focus: string;
  tone?: "safe" | "warn" | "neutral";
};

function ResponsiveNavigationAdaptationPanel({ mode, idSuffix }: { mode: ResponsiveNavigationAdaptationMode; idSuffix: string }) {
  const config: Record<ResponsiveNavigationAdaptationMode, ResponsiveNavigationAdaptationItem> = {
    compact: {
      chip: "Compact",
      title: "Bottom bar keeps five primary destinations",
      shell: "compact",
      width: "390 px",
      visible: ["Home", "Work", "Reports", "Alerts", "More"],
      overflow: "Settings and Admin in More",
      current: "Reports",
      detail: "Reports filter: Open incidents",
      status: "Compact width keeps thumb-reachable destinations visible and sends lower-priority items to a labelled More entry.",
      focus: "Tab: bar -> More -> content",
      tone: "safe"
    },
    mediumRail: {
      chip: "Medium",
      title: "Rail preserves labels, badges, and selected route",
      shell: "rail",
      width: "720 px",
      visible: ["Home", "Work", "Reports", "Alerts", "Settings"],
      overflow: "Admin in drawer",
      current: "Reports",
      detail: "Reports filter: Open incidents",
      status: "The same destinations move to a rail without changing names or resetting the current destination.",
      focus: "Focus moves to Reports rail item",
      tone: "safe"
    },
    expandedSide: {
      chip: "Expanded",
      title: "Side navigation exposes the full destination set",
      shell: "expanded",
      width: "1180 px",
      visible: ["Home", "Work", "Reports", "Alerts", "Settings", "Admin"],
      overflow: "None",
      current: "Reports",
      detail: "Reports filter: Open incidents",
      status: "Expanded width uses persistent side navigation so no destination is hidden or renamed.",
      focus: "Reports side item remains current",
      tone: "safe"
    },
    denseOverflow: {
      chip: "Overflow",
      title: "More owns secondary destinations",
      shell: "compact",
      width: "390 px + 7 destinations",
      visible: ["Home", "Work", "Reports", "Alerts", "More"],
      overflow: "Settings, Admin, Billing",
      current: "Reports",
      detail: "Reports filter: Open incidents",
      status: "Destination count overflow has a rule: keep frequent destinations visible and move lower-priority destinations into More.",
      focus: "More has expanded state",
      tone: "neutral"
    },
    moreDrawer: {
      chip: "Drawer",
      title: "More opens a labelled drawer",
      shell: "drawer",
      width: "Compact with drawer open",
      visible: ["Home", "Work", "Reports", "Alerts", "Settings", "Admin"],
      overflow: "Drawer close returns to More",
      current: "Reports",
      detail: "More drawer: Settings, Admin, Billing",
      status: "The compact overflow drawer is temporary, labelled, dismissible, and returns focus to the More trigger.",
      focus: "Escape returns focus to More",
      tone: "neutral"
    },
    routePreserved: {
      chip: "Route",
      title: "Nested route survives breakpoint transition",
      shell: "rail",
      width: "Phone to tablet",
      visible: ["Home", "Work", "Reports", "Alerts", "Settings"],
      overflow: "Admin in drawer",
      current: "Reports / SLA",
      detail: "Nested route: /reports/sla",
      status: "The active child route remains selected after compact bottom navigation becomes a rail.",
      focus: "Current route is still announced",
      tone: "safe"
    },
    filterPreserved: {
      chip: "Filters",
      title: "Local filters stay with the destination",
      shell: "expanded",
      width: "Desktop resize",
      visible: ["Home", "Work", "Reports", "Alerts", "Settings", "Admin"],
      overflow: "None",
      current: "Reports",
      detail: "Filter: Open incidents, Region: West",
      status: "Responsive adaptation changes the shell while preserving the report filters that belong to the route.",
      focus: "Focus can move to content",
      tone: "safe"
    },
    draftPreserved: {
      chip: "Draft",
      title: "Unsaved work is not cleared by resize",
      shell: "rail",
      width: "Tablet split",
      visible: ["Home", "Work", "Reports", "Alerts", "Settings"],
      overflow: "Admin in drawer",
      current: "Work",
      detail: "Draft incident: 4 unsaved fields",
      status: "A layout transition keeps the work draft available rather than treating resize as navigation.",
      focus: "Draft field keeps context",
      tone: "safe"
    },
    badgePreserved: {
      chip: "Badges",
      title: "Alert count survives the surface change",
      shell: "expanded",
      width: "Expanded",
      visible: ["Home", "Work", "Reports", "Alerts 3", "Settings", "Admin"],
      overflow: "None",
      current: "Alerts",
      detail: "Unread alerts: 3",
      status: "Badge state follows the destination from bottom bar to rail to side navigation.",
      focus: "Alerts current item includes count",
      tone: "neutral"
    },
    keyboardInset: {
      chip: "Keyboard",
      title: "Compact navigation clears the software keyboard",
      shell: "compact",
      width: "390 px + keyboard",
      visible: ["Home", "Work", "Reports", "Alerts", "More"],
      overflow: "Settings in More",
      current: "Work",
      detail: "Search field focused above keyboard",
      status: "The bottom navigation respects keyboard inset and does not cover the focused field or destination bar.",
      focus: "Search -> bar remains reachable",
      tone: "neutral"
    },
    safeArea: {
      chip: "Safe area",
      title: "System gesture area is protected",
      shell: "compact",
      width: "390 px with bottom inset",
      visible: ["Home", "Work", "Reports", "Alerts", "More"],
      overflow: "Settings in More",
      current: "Reports",
      detail: "Bottom safe area: 24 px",
      status: "Compact navigation leaves room for system gestures and home indicator spacing.",
      focus: "Touch targets stay clear",
      tone: "neutral"
    },
    splitScreen: {
      chip: "Split",
      title: "Split screen uses rail instead of cramped bottom nav",
      shell: "rail",
      width: "620 px split screen",
      visible: ["Home", "Work", "Reports", "Alerts", "Settings"],
      overflow: "Admin in drawer",
      current: "Reports",
      detail: "Content width: constrained",
      status: "The app adapts to available container width rather than assuming tablet means expanded navigation.",
      focus: "Rail remains first nav landmark",
      tone: "safe"
    },
    landscape: {
      chip: "Landscape",
      title: "Landscape trades bottom bar for rail",
      shell: "rail",
      width: "Phone landscape",
      visible: ["Home", "Work", "Reports", "Alerts", "More"],
      overflow: "Settings in More",
      current: "Reports",
      detail: "Vertical height preserved",
      status: "Landscape avoids consuming scarce vertical space with a bottom bar.",
      focus: "Same labels in rail",
      tone: "neutral"
    },
    drawerResize: {
      chip: "Resize",
      title: "Open drawer converts safely to side navigation",
      shell: "expanded",
      width: "Drawer open -> desktop",
      visible: ["Home", "Work", "Reports", "Alerts", "Settings", "Admin"],
      overflow: "Drawer removed",
      current: "Settings",
      detail: "Focus moved to Settings side item",
      status: "When the drawer is no longer modal, focus transfers to the equivalent visible destination.",
      focus: "No offscreen focus",
      tone: "safe"
    },
    focusRecovery: {
      chip: "Focus",
      title: "Focused item maps to its adapted equivalent",
      shell: "rail",
      width: "Resize while tabbing",
      visible: ["Home", "Work", "Reports", "Alerts", "Settings"],
      overflow: "Admin in drawer",
      current: "Settings",
      detail: "Focused: Settings rail item",
      status: "The focused Settings item is not lost when the compact More drawer becomes a rail item.",
      focus: "Focus recovered",
      tone: "safe"
    },
    longLabels: {
      chip: "Labels",
      title: "Long labels wrap without changing meaning",
      shell: "expanded",
      width: "Localized desktop",
      visible: ["Home", "Field work orders", "Regional performance reports", "Alerts", "Settings", "Admin"],
      overflow: "None",
      current: "Regional performance reports",
      detail: "Localized label kept consistent",
      status: "Responsive adaptation keeps labels recognizable instead of swapping to unrelated short words.",
      focus: "Full label is accessible",
      tone: "neutral"
    },
    utilitySeparate: {
      chip: "Utilities",
      title: "Utilities stay separate from destinations",
      shell: "expanded",
      width: "Desktop",
      visible: ["Home", "Work", "Reports", "Alerts", "Settings", "Admin"],
      overflow: "Utilities: Help, Account",
      current: "Reports",
      detail: "Help and Account are not primary destinations",
      status: "Responsive rules keep account, help, and search utilities out of the primary destination model.",
      focus: "Utilities after primary nav",
      tone: "safe"
    }
  };
  const item = config[mode];
  const titleId = `responsive-nav-title-${idSuffix}`;
  const descId = `responsive-nav-desc-${idSuffix}`;

  return (
    <section className={`responsive-nav-shell is-${item.tone ?? "neutral"} is-${item.shell}`} aria-labelledby={titleId} aria-describedby={descId}>
      <header className="responsive-nav-header">
        <div>
          <span>{item.chip}</span>
          <strong id={titleId}>{item.title}</strong>
        </div>
        <span className="responsive-nav-width">{item.width}</span>
      </header>
      <div className="responsive-nav-stage" id={descId}>
        <nav className={`responsive-nav-surface ${item.shell}`} aria-label="Adaptive destination preview">
          {item.visible.map((label) => {
            const isCurrent = label.startsWith(item.current.split(" / ")[0]);
            return (
              <button type="button" key={label} className={isCurrent ? "current" : ""} aria-current={isCurrent ? "page" : undefined}>
                <span>{label.slice(0, 1)}</span>
                <strong>{label}</strong>
              </button>
            );
          })}
        </nav>
        <div className="responsive-nav-content">
          <div><span>Current</span><strong>{item.current}</strong></div>
          <div><span>Overflow</span><strong>{item.overflow}</strong></div>
          <div><span>State</span><strong>{item.detail}</strong></div>
          <div><span>Focus</span><strong>{item.focus}</strong></div>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{item.status}</p>
    </section>
  );
}

function ResponsiveNavigationAdaptationGoodUi() {
  return (
    <div className="quality-example responsive-nav-demo">
      <ResponsiveNavigationAdaptationPanel mode="mediumRail" idSuffix="good-ui" />
    </div>
  );
}

function ResponsiveNavigationAdaptationBadUi() {
  return (
    <div className="bad-ui-sample responsive-nav-bad-ui">
      <section className="responsive-nav-shell bad" aria-label="Broken responsive navigation adaptation">
        <header className="responsive-nav-header">
          <div>
            <span>Breakpoint drift</span>
            <strong>Phone, tablet, and desktop disagree</strong>
          </div>
          <span className="responsive-nav-width">390 to 1180 px</span>
        </header>
        <div className="responsive-nav-stage">
          <nav className="responsive-nav-surface compact" aria-label="Broken compact destinations">
            {["H", "W", "B", "G"].map((label) => (
              <button type="button" key={label}><span>{label}</span><strong>{label}</strong></button>
            ))}
          </nav>
          <div className="responsive-nav-content">
            <div><span>Missing</span><strong>Reports removed</strong></div>
            <div><span>Renamed</span><strong>Work becomes Spaces</strong></div>
            <div><span>Duplicate</span><strong>Drawer and side nav both current</strong></div>
            <div><span>Focus</span><strong>Hidden in closed drawer</strong></div>
          </div>
        </div>
      </section>
      <p className="demo-status">The broken UI changes information architecture instead of adapting the same navigation model.</p>
    </div>
  );
}

function ResponsiveNavigationAdaptationGoodUx() {
  const [mode, setMode] = useState<ResponsiveNavigationAdaptationMode>("compact");

  return (
    <div className="quality-example responsive-nav-demo">
      <div className="demo-row responsive-nav-controls" aria-label="Responsive navigation adaptation controls">
        {responsiveNavigationGoodLabels.map(([key, label]) => (
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
      <ResponsiveNavigationAdaptationPanel mode={mode} idSuffix="good-ux" />
      <p className="demo-status" aria-live="polite">Responsive navigation adaptation state: {responsiveNavigationGoodLabels.find(([key]) => key === mode)?.[1]}.</p>
    </div>
  );
}

function ResponsiveNavigationAdaptationBadUx() {
  const [mode, setMode] = useState<ResponsiveNavigationAdaptationBadMode>("missingDestination");
  const copy: Record<ResponsiveNavigationAdaptationBadMode, { title: string; body: string; consequence: string; signal: string }> = {
    missingDestination: {
      title: "Missing destination",
      body: "Reports is visible on desktop but disappears from the compact layout instead of moving into More.",
      consequence: "Users cannot continue the same task after changing device size.",
      signal: "Removed"
    },
    renamedLabels: {
      title: "Renamed labels",
      body: "The phone bar says Work, the rail says Projects, and the desktop side navigation says Spaces for the same route.",
      consequence: "Users cannot build a stable mental model across breakpoints.",
      signal: "Label drift"
    },
    duplicateSurfaces: {
      title: "Duplicate surfaces",
      body: "A compact screen shows bottom navigation and an open drawer with the same primary destinations.",
      consequence: "Two surfaces can disagree about the current destination.",
      signal: "Two navs"
    },
    resetOnResize: {
      title: "Reset on resize",
      body: "Rotating the device sends the user back to Home and clears the Reports filter.",
      consequence: "Resize behaves like a destructive route change.",
      signal: "State lost"
    },
    hiddenFocus: {
      title: "Hidden focus",
      body: "Focus stays inside a closed mobile drawer after the layout changes to desktop side navigation.",
      consequence: "Keyboard and screen-reader users are stranded in invisible navigation.",
      signal: "Offscreen"
    },
    iconOnlyMystery: {
      title: "Icon-only mystery",
      body: "Compact navigation drops all labels and uses unfamiliar icons for Work, Reports, Alerts, and Settings.",
      consequence: "The adaptation saves space by removing comprehension.",
      signal: "No labels"
    },
    actionInNav: {
      title: "Action in nav",
      body: "The compact bar replaces Settings with Save and Delete commands to save room in the header.",
      consequence: "Users cannot tell destinations from current-view actions.",
      signal: "Mixed scope"
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example responsive-nav-bad-ux is-${mode}`}>
      <div className="demo-row responsive-nav-controls" aria-label="Responsive navigation adaptation failure controls">
        {responsiveNavigationBadLabels.map(([key, label]) => (
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
      <section className="responsive-nav-shell bad" aria-label={`Responsive navigation adaptation failure: ${item.title}`}>
        <header className="responsive-nav-header">
          <div>
            <span>{item.title}</span>
            <strong>{item.signal}</strong>
          </div>
          <span className="responsive-nav-width">Breakpoint failure</span>
        </header>
        <p>{item.body}</p>
        <div className="responsive-nav-content compact">
          <div><span>Destination model</span><strong>{mode === "missingDestination" || mode === "renamedLabels" ? "Changed" : "Ambiguous"}</strong></div>
          <div><span>Current state</span><strong>{mode === "resetOnResize" ? "Reset" : "Unclear"}</strong></div>
          <div><span>Focus</span><strong>{mode === "hiddenFocus" ? "Hidden" : "Weak"}</strong></div>
          <div><span>Scope</span><strong>{mode === "actionInNav" ? "Mixed" : "Unstable"}</strong></div>
        </div>
      </section>
      <p className="demo-status" aria-live="polite">{item.consequence}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ResponsiveNavigationAdaptationGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ResponsiveNavigationAdaptationBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ResponsiveNavigationAdaptationGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ResponsiveNavigationAdaptationBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
