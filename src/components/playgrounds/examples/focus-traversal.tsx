import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type FocusTraversalMode =
  | "initial"
  | "skipEntry"
  | "forward"
  | "reverse"
  | "visibleFocus"
  | "hiddenRemoved"
  | "programmatic"
  | "overlayOpen"
  | "overlayReturn"
  | "validation"
  | "dynamicRemoval"
  | "responsive"
  | "composite"
  | "trapEscape";

type FocusTraversalBadMode =
  | "positiveTabindex"
  | "hiddenFocus"
  | "noRing"
  | "scrollOnly"
  | "lostReturn"
  | "trapLoop"
  | "virtualizedLoss";

const focusTraversalGoodLabels: Array<[FocusTraversalMode, string]> = [
  ["initial", "Initial focus"],
  ["skipEntry", "Skip entry"],
  ["forward", "Forward Tab"],
  ["reverse", "Reverse Shift+Tab"],
  ["visibleFocus", "Visible focus"],
  ["hiddenRemoved", "Hidden content removed"],
  ["programmatic", "Programmatic focus"],
  ["overlayOpen", "Overlay open"],
  ["overlayReturn", "Overlay return"],
  ["validation", "Validation error"],
  ["dynamicRemoval", "Dynamic removal"],
  ["responsive", "Responsive order"],
  ["composite", "Composite boundary"],
  ["trapEscape", "Trap escape"]
];

const focusTraversalBadLabels: Array<[FocusTraversalBadMode, string]> = [
  ["positiveTabindex", "Positive tabindex"],
  ["hiddenFocus", "Hidden focus"],
  ["noRing", "No focus ring"],
  ["scrollOnly", "Scroll only"],
  ["lostReturn", "Lost return"],
  ["trapLoop", "Trap loop"],
  ["virtualizedLoss", "Virtualized loss"]
];

function FocusTraversalPanel({ mode, idSuffix }: { mode: FocusTraversalMode; idSuffix: string }) {
  const config: Record<FocusTraversalMode, {
    chip: string;
    title: string;
    current: string;
    previous: string;
    next: string;
    source: string;
    hidden: string;
    returnTarget: string;
    status: string;
    tone?: string;
    compact?: boolean;
  }> = {
    initial: {
      chip: "Initial focus",
      title: "Checkout starts at the page heading",
      current: "H1: Review your order",
      previous: "Browser chrome or skip link",
      next: "Contact email field",
      source: "DOM order matches reading order",
      hidden: "Closed help and drawer controls are not reachable",
      returnTarget: "Route change sets focus once, then normal Tab continues",
      status: "Initial focus gives keyboard users a stable starting point."
    },
    skipEntry: {
      chip: "Skip entry",
      title: "Repeated navigation can be bypassed",
      current: "Skip to checkout",
      previous: "First body focus target",
      next: "Main checkout heading",
      source: "Skip link appears before repeated navigation",
      hidden: "Navigation remains available after the bypass",
      returnTarget: "Next Tab starts inside main content",
      status: "The bypass changes focus, not only scroll position.",
      tone: "safe"
    },
    forward: {
      chip: "Forward Tab",
      title: "Forward traversal follows task order",
      current: "Delivery address",
      previous: "Contact email",
      next: "Payment method",
      source: "Contact, delivery, payment, review, submit",
      hidden: "Inactive promo drawer removed from Tab order",
      returnTarget: "Submit follows review, not footer links",
      status: "Tab order preserves meaning and operability."
    },
    reverse: {
      chip: "Reverse Shift+Tab",
      title: "Reverse path is predictable",
      current: "Payment method",
      previous: "Delivery address",
      next: "Review order",
      source: "Shift+Tab walks the same path backward",
      hidden: "No offscreen mobile menu receives focus",
      returnTarget: "Previous control remains visible",
      status: "Users can back up without losing context."
    },
    visibleFocus: {
      chip: "Visible focus",
      title: "Focused control is clearly marked",
      current: "Continue to review button",
      previous: "Payment method",
      next: "Order summary link",
      source: "Focus ring is not clipped by sticky footer",
      hidden: "Decorative wrappers are not focusable",
      returnTarget: "Status update does not steal focus",
      status: "The keyboard focus indicator is visible.",
      tone: "safe"
    },
    hiddenRemoved: {
      chip: "Hidden content removed",
      title: "Collapsed panels stay out of sequence",
      current: "Add promo code button",
      previous: "Order summary",
      next: "Continue to review",
      source: "Collapsed promo fields are not in Tab order",
      hidden: "Closed drawer, inactive tab, and collapsed panel are inert",
      returnTarget: "Opening the panel moves focus to Promo code",
      status: "Hidden content cannot trap or surprise focus."
    },
    programmatic: {
      chip: "Programmatic focus",
      title: "Status can receive deliberate focus",
      current: "Saved delivery address status",
      previous: "Save address button",
      next: "Payment method",
      source: "Status container uses programmatic focus only",
      hidden: "Status is not a normal Tab stop",
      returnTarget: "Next Tab continues to payment",
      status: "Programmatic focus confirms the state change without adding noise."
    },
    overlayOpen: {
      chip: "Overlay open",
      title: "Help drawer owns first focus target",
      current: "Delivery help heading",
      previous: "Help button opened drawer",
      next: "Close help",
      source: "Drawer focus path is declared",
      hidden: "Background controls are inert while modal drawer is open",
      returnTarget: "Help button stored as invoker",
      status: "Opening a constrained region places focus intentionally."
    },
    overlayReturn: {
      chip: "Overlay return",
      title: "Closing returns to the invoker",
      current: "Delivery help button",
      previous: "Close help button",
      next: "Delivery address field",
      source: "Return target remains in the same task section",
      hidden: "Drawer controls removed after close",
      returnTarget: "Invoker gets focus after Escape or Close",
      status: "Focus return preserves the user's place.",
      tone: "safe"
    },
    validation: {
      chip: "Validation error",
      title: "Failed submit moves focus to errors",
      current: "Error summary",
      previous: "Submit order",
      next: "Email error link",
      source: "Summary before fields, links target fields",
      hidden: "Valid sections do not steal focus",
      returnTarget: "Error link moves focus to Contact email",
      status: "Validation changes both scroll and keyboard focus."
    },
    dynamicRemoval: {
      chip: "Dynamic removal",
      title: "Removed result has a recovery target",
      current: "3 delivery options updated status",
      previous: "Removed Express option",
      next: "Standard delivery option",
      source: "Filter update announces result change",
      hidden: "Removed option cannot retain focus",
      returnTarget: "Focus moves to status then next option",
      status: "Dynamic content changes do not drop focus."
    },
    responsive: {
      chip: "Responsive order",
      title: "Mobile stack preserves reading order",
      current: "Payment method",
      previous: "Delivery address",
      next: "Review order",
      source: "DOM order matches stacked visual order",
      hidden: "Desktop sidebar controls are not duplicated in Tab order",
      returnTarget: "Mobile footer action follows review content",
      status: "Responsive layout does not reorder focus unexpectedly.",
      compact: true
    },
    composite: {
      chip: "Composite boundary",
      title: "Tab enters and exits a toolbar once",
      current: "Delivery toolbar",
      previous: "Delivery address",
      next: "Payment method",
      source: "Arrow keys move inside the toolbar",
      hidden: "Internal buttons are not all separate page Tab stops",
      returnTarget: "Tab leaves the composite to the next task",
      status: "Composite focus stays bounded and explainable."
    },
    trapEscape: {
      chip: "Trap escape",
      title: "Constrained focus has an exit",
      current: "Embedded address lookup",
      previous: "Address lookup input",
      next: "Manual address link",
      source: "Lookup documents Escape and close path",
      hidden: "No iframe or plugin trap captures Tab forever",
      returnTarget: "Escape returns to Manual address",
      status: "Users can leave constrained regions with the keyboard."
    }
  };
  const item = config[mode];
  const titleId = `focus-traversal-title-${idSuffix}`;
  const descId = `focus-traversal-desc-${idSuffix}`;

  return (
    <section className={`focus-traversal-shell is-${mode} ${item.tone ? `is-${item.tone}` : ""} ${item.compact ? "is-compact" : ""}`} aria-labelledby={titleId} aria-describedby={descId}>
      <header className="focus-traversal-header">
        <span>{item.chip}</span>
        <strong id={titleId}>{item.title}</strong>
      </header>
      <div className="focus-traversal-path" id={descId} aria-label="Sequential focus path">
        <div className="focus-traversal-node">
          <span>Previous</span>
          <strong>{item.previous}</strong>
        </div>
        <div className="focus-traversal-node is-current">
          <span>Current focus</span>
          <strong>{item.current}</strong>
        </div>
        <div className="focus-traversal-node">
          <span>Next</span>
          <strong>{item.next}</strong>
        </div>
      </div>
      <div className="focus-traversal-grid" aria-label="Focus traversal evidence">
        <div><span>Tab order</span><strong>{item.source}</strong></div>
        <div><span>Hidden content</span><strong>{item.hidden}</strong></div>
        <div><span>Return target</span><strong>{item.returnTarget}</strong></div>
        <div><span>Visible focus</span><strong>Current focus target has a visible indicator.</strong></div>
      </div>
      <p className="demo-status">{item.status}</p>
    </section>
  );
}

function FocusTraversalGoodUi() {
  return (
    <div className="quality-example focus-traversal-demo">
      <FocusTraversalPanel mode="forward" idSuffix="good-ui" />
    </div>
  );
}

function FocusTraversalBadUi() {
  return (
    <div className="bad-ui-sample focus-traversal-bad-ui">
      <section className="focus-traversal-shell bad" aria-label="Broken focus traversal">
        <header className="focus-traversal-header">
          <span>Positive tabindex</span>
          <strong>Focus jumps across the page</strong>
        </header>
        <p>The UI uses tabindex 7, 2, and 12 to force visual order. Focus jumps from footer to promo field to header, hidden drawer links are reachable, the focus ring is suppressed, and closing the drawer loses return focus.</p>
        <div className="focus-traversal-path bad">
          <div className="focus-traversal-node"><span>Previous</span><strong>Footer support link</strong></div>
          <div className="focus-traversal-node is-current"><span>Current focus</span><strong>Hidden drawer item</strong></div>
          <div className="focus-traversal-node"><span>Next</span><strong>Billing field</strong></div>
        </div>
      </section>
      <p className="demo-status">The broken UI makes sequential focus unpredictable and partly invisible.</p>
    </div>
  );
}

function FocusTraversalGoodUx() {
  const [mode, setMode] = useState<FocusTraversalMode>("initial");
  return (
    <div className="quality-example focus-traversal-demo">
      <div className="demo-row focus-traversal-controls" aria-label="Focus traversal exercise controls">
        {focusTraversalGoodLabels.map(([key, label]) => (
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
      <FocusTraversalPanel mode={mode} idSuffix="good-ux" />
      <p className="demo-status" aria-live="polite">Focus traversal state: {focusTraversalGoodLabels.find(([key]) => key === mode)?.[1]}.</p>
    </div>
  );
}

function FocusTraversalBadUx() {
  const [mode, setMode] = useState<FocusTraversalBadMode>("positiveTabindex");
  const copy: Record<FocusTraversalBadMode, { title: string; body: string; consequence: string; metric: string }> = {
    positiveTabindex: {
      title: "Positive tabindex",
      body: "The page uses positive tabindex values to jump from footer actions to promo fields and then back to header navigation.",
      consequence: "Focus order breaks the user's task model.",
      metric: "tabindex 7"
    },
    hiddenFocus: {
      title: "Hidden focus",
      body: "Closed drawer links, inactive tab panels, and collapsed help controls remain reachable with Tab.",
      consequence: "Users land on controls they cannot see or operate.",
      metric: "Hidden tab stop"
    },
    noRing: {
      title: "No focus ring",
      body: "The CSS removes outlines, and sticky panels cover the only visible focus indicator.",
      consequence: "Users cannot tell which control owns keyboard focus.",
      metric: "Indicator missing"
    },
    scrollOnly: {
      title: "Scroll only",
      body: "Error links scroll visually to fields but leave keyboard focus on the summary.",
      consequence: "The next Tab resumes from the wrong place.",
      metric: "Focus not moved"
    },
    lostReturn: {
      title: "Lost return",
      body: "Closing the drawer sends focus to the top of the page instead of the Filter button.",
      consequence: "Users must retrace repeated navigation.",
      metric: "Return target lost"
    },
    trapLoop: {
      title: "Trap loop",
      body: "A lookup iframe loops between two controls and never exposes Escape, Close, or Manual address.",
      consequence: "Keyboard users cannot leave the region.",
      metric: "No keyboard exit"
    },
    virtualizedLoss: {
      title: "Virtualized loss",
      body: "Filtering removes the focused result row and no status, next item, or stable container receives focus.",
      consequence: "Focus disappears after dynamic content changes.",
      metric: "Focus lost"
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example focus-traversal-bad-ux is-${mode}`}>
      <div className="demo-row focus-traversal-controls" aria-label="Focus traversal misuse controls">
        {focusTraversalBadLabels.map(([key, label]) => (
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
      <section className="focus-traversal-shell bad" aria-label={`Focus traversal failure: ${item.title}`}>
        <header className="focus-traversal-header">
          <span>{item.title}</span>
          <strong>{item.metric}</strong>
        </header>
        <p>{item.body}</p>
        <div className="focus-traversal-grid">
          <div><span>Tab order</span><strong>{mode === "positiveTabindex" ? "Forced by positive tabindex" : "Unpredictable"}</strong></div>
          <div><span>Visible focus</span><strong>{mode === "noRing" ? "Missing" : "Unreliable"}</strong></div>
          <div><span>Hidden content</span><strong>{mode === "hiddenFocus" ? "Still focusable" : "Not audited"}</strong></div>
          <div><span>Return target</span><strong>{mode === "lostReturn" || mode === "trapLoop" ? "Broken" : item.consequence}</strong></div>
        </div>
      </section>
      <p className="demo-status" aria-live="polite">{item.consequence}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <FocusTraversalGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <FocusTraversalBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <FocusTraversalGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <FocusTraversalBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
