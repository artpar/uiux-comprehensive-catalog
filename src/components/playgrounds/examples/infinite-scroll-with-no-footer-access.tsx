import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type InfiniteScrollFooterMode =
  | "boundedAutoLoad"
  | "loadMore"
  | "jumpFooter"
  | "footerVisible"
  | "endState"
  | "failedLoad"
  | "returnPosition"
  | "keyboardBypass"
  | "mobileFooter"
  | "legalLinks";

type InfiniteScrollFooterBadMode =
  | "autoPush"
  | "footerOnlyLegal"
  | "keyboardTrap"
  | "spinnerLoop"
  | "lostPosition"
  | "mobileMiss"
  | "virtualFocusLoss"
  | "noLoadMore";

const infiniteFooterGoodModes: Array<{ mode: InfiniteScrollFooterMode; label: string }> = [
  { mode: "boundedAutoLoad", label: "Bounded auto-load" },
  { mode: "loadMore", label: "Load more" },
  { mode: "jumpFooter", label: "Jump to footer" },
  { mode: "footerVisible", label: "Footer visible" },
  { mode: "endState", label: "End state" },
  { mode: "failedLoad", label: "Failed load" },
  { mode: "returnPosition", label: "Return position" },
  { mode: "keyboardBypass", label: "Keyboard bypass" },
  { mode: "mobileFooter", label: "Mobile footer" },
  { mode: "legalLinks", label: "Legal links" }
];

const infiniteFooterBadModes: Array<{ mode: InfiniteScrollFooterBadMode; label: string }> = [
  { mode: "autoPush", label: "Auto-load pushes footer" },
  { mode: "footerOnlyLegal", label: "Footer-only legal links" },
  { mode: "keyboardTrap", label: "Keyboard endless trap" },
  { mode: "spinnerLoop", label: "Spinner loop" },
  { mode: "lostPosition", label: "Lost return position" },
  { mode: "mobileMiss", label: "Mobile footer miss" },
  { mode: "virtualFocusLoss", label: "Virtual focus loss" },
  { mode: "noLoadMore", label: "No load-more escape" }
];

function InfiniteScrollFooterGoodUi() {
  return (
    <div className="quality-example infinite-footer-demo">
      <InfiniteScrollFooterGoodPanel mode="boundedAutoLoad" />
      <p className="demo-status">Auto-load stops at a deliberate boundary, then the footer and Load more control remain reachable.</p>
    </div>
  );
}

function InfiniteScrollFooterBadUi() {
  return (
    <div className="bad-ui-sample infinite-footer-demo infinite-footer-bad-ux">
      <InfiniteScrollFooterBadPanel mode="autoPush" />
      <p className="demo-status">Every near-bottom scroll inserts another batch before the footer can be reached.</p>
    </div>
  );
}

function InfiniteScrollFooterGoodPanel({ mode }: { mode: InfiniteScrollFooterMode }) {
  const details: Record<InfiniteScrollFooterMode, {
    loaded: string;
    boundary: string;
    status: string;
    footer: string;
    primary: string;
    compact?: boolean;
    failed?: boolean;
    end?: boolean;
  }> = {
    boundedAutoLoad: {
      loaded: "60 products loaded",
      boundary: "Auto-load paused after 3 batches",
      status: "The next batch requires an explicit Load more action.",
      footer: "Privacy, Accessibility, Contact, Cookies",
      primary: "Load more products"
    },
    loadMore: {
      loaded: "80 products loaded",
      boundary: "Batch 4 is complete",
      status: "Load more inserts one requested batch without moving focus.",
      footer: "Returns, Help, Terms, Language",
      primary: "Load more products"
    },
    jumpFooter: {
      loaded: "60 products loaded",
      boundary: "Footer shortcut available",
      status: "Jump to footer moves focus to footer utilities before any more loading.",
      footer: "Footer target focused",
      primary: "Jump to footer"
    },
    footerVisible: {
      loaded: "60 products loaded",
      boundary: "Footer remains in document flow",
      status: "The footer is visible below the loading boundary.",
      footer: "Privacy, Terms, Accessibility, Contact",
      primary: "Back to results"
    },
    endState: {
      loaded: "96 of 96 products loaded",
      boundary: "End of result set",
      status: "The page says the end was reached instead of showing a spinner forever.",
      footer: "Sitemap, Cookies, Legal, Feedback",
      primary: "Back to top",
      end: true
    },
    failedLoad: {
      loaded: "60 products loaded",
      boundary: "More items failed to load",
      status: "Retry is local and footer links stay available.",
      footer: "Help, Contact, Privacy, Terms",
      primary: "Retry loading more",
      failed: true
    },
    returnPosition: {
      loaded: "60 products loaded",
      boundary: "Returned to item 43",
      status: "Opening a product and going back restores the same loaded boundary.",
      footer: "Footer still below current batch",
      primary: "Open saved position"
    },
    keyboardBypass: {
      loaded: "60 products loaded",
      boundary: "Keyboard bypass enabled",
      status: "Tab reaches Jump to footer before the card list repeats.",
      footer: "Footer landmark reachable",
      primary: "Jump to footer"
    },
    mobileFooter: {
      loaded: "40 products loaded",
      boundary: "Mobile batch paused",
      status: "Compact controls leave footer links tappable above the next load.",
      footer: "Help, Returns, Legal",
      primary: "Load more",
      compact: true
    },
    legalLinks: {
      loaded: "60 products loaded",
      boundary: "Required links repeated",
      status: "Privacy, Terms, Cookies, and Accessibility are not footer-only.",
      footer: "Privacy, Terms, Cookies, Accessibility",
      primary: "Open privacy settings"
    }
  };

  const info = details[mode];
  const items = ["Rain jacket", "Trail shoes", "Bike light", "Repair kit", "Day pack", "Waterproof map"];

  return (
    <div className={info.compact ? "infinite-footer-shell is-mobile" : "infinite-footer-shell"}>
      <div className="infinite-footer-statusbar">
        <span><strong>Loaded</strong>{info.loaded}</span>
        <span><strong>Boundary</strong>{info.boundary}</span>
        <span><strong>Footer</strong>{info.footer}</span>
      </div>
      <section className="infinite-footer-stream" aria-label="Product stream" aria-busy={info.failed ? "true" : "false"}>
        {items.slice(0, info.compact ? 4 : 6).map((item, index) => (
          <article className="infinite-footer-card" key={item}>
            <span>Item {index + 41}</span>
            <strong>{item}</strong>
            <p>Loaded item keeps a stable position before the footer boundary.</p>
          </article>
        ))}
      </section>
      <div className={info.failed ? "infinite-footer-boundary is-failed" : info.end ? "infinite-footer-boundary is-end" : "infinite-footer-boundary"}>
        <strong>{info.boundary}</strong>
        <p>{info.status}</p>
        <div className="infinite-footer-actions">
          <button type="button" className="demo-button small primary">{info.primary}</button>
          <button type="button" className="demo-button small">Back to top</button>
        </div>
      </div>
      <footer className="infinite-footer-links" aria-label="Demo footer">
        {info.footer.split(", ").map((link) => (
          <a href={`#${link.toLowerCase().replace(/\s+/g, "-")}`} onClick={(event) => event.preventDefault()} key={link}>{link}</a>
        ))}
      </footer>
    </div>
  );
}

function InfiniteScrollFooterBadPanel({ mode }: { mode: InfiniteScrollFooterBadMode }) {
  const details: Record<InfiniteScrollFooterBadMode, {
    loaded: string;
    status: string;
    footer: string;
    note: string;
    cards: string[];
  }> = {
    autoPush: {
      loaded: "120+ items and growing",
      status: "The footer moves down every time the viewport nears it.",
      footer: "Privacy still below another batch",
      note: "Auto-load pushes the footer away.",
      cards: ["Batch 12 inserted", "Batch 13 pending", "Footer displaced"]
    },
    footerOnlyLegal: {
      loaded: "Legal links hidden below stream",
      status: "Privacy, Terms, Cookies, and Accessibility appear only in the unreachable footer.",
      footer: "Footer-only legal links",
      note: "Required links depend on reaching the bottom.",
      cards: ["Products", "More products", "Legal links not repeated"]
    },
    keyboardTrap: {
      loaded: "Tab path grows forever",
      status: "Keyboard users must tab through each inserted card before footer links.",
      footer: "Footer skipped by new cards",
      note: "Keyboard endless trap.",
      cards: ["Card action 198", "Card action 199", "Card action 200"]
    },
    spinnerLoop: {
      loaded: "Loading...",
      status: "The spinner never declares success, failure, or end state.",
      footer: "Footer blocked by spinner",
      note: "Spinner loop no end state.",
      cards: ["Loading row", "Loading row", "Loading row"]
    },
    lostPosition: {
      loaded: "Returned to top",
      status: "Opening an item and going back resets the stream and loses the loaded boundary.",
      footer: "Footer requires rescrolling",
      note: "Lost return position.",
      cards: ["Item 1 again", "Item 2 again", "Item 3 again"]
    },
    mobileMiss: {
      loaded: "Footer flashes then shifts",
      status: "Mobile near-bottom loading moves footer links away before tap.",
      footer: "Footer miss on touch",
      note: "Mobile footer miss.",
      cards: ["Tap target moved", "New card inserted", "Footer below fold"]
    },
    virtualFocusLoss: {
      loaded: "Virtualized boundary",
      status: "The focused footer target unmounts when more items render.",
      footer: "Focus target removed",
      note: "Virtual focus loss.",
      cards: ["Unmounted item", "Focus lost", "No target"]
    },
    noLoadMore: {
      loaded: "No manual control",
      status: "The stream has no Load more, pause, jump-to-footer, or stop-loading control.",
      footer: "No escape",
      note: "No load-more escape.",
      cards: ["Auto only", "Auto only", "Auto only"]
    }
  };

  const info = details[mode];

  return (
    <div className="infinite-footer-shell bad">
      <div className="infinite-footer-statusbar bad">
        <span><strong>Loaded</strong>{info.loaded}</span>
        <span><strong>Footer</strong>{info.footer}</span>
        <span><strong>Status</strong>unreachable</span>
      </div>
      <section className="infinite-footer-stream bad" aria-label="Broken infinite stream">
        {info.cards.map((item, index) => (
          <article className="infinite-footer-card bad" key={`${item}-${index}`}>
            <span>Auto batch {index + 1}</span>
            <strong>{item}</strong>
            <p>{info.status}</p>
          </article>
        ))}
      </section>
      <div className="infinite-footer-boundary bad">
        <strong>{info.note}</strong>
        <p>{info.status}</p>
        <div className="infinite-footer-spinner" aria-hidden="true">Loading more before footer...</div>
      </div>
      <footer className="infinite-footer-links bad" aria-label="Unreachable demo footer">
        <span>Privacy</span>
        <span>Terms</span>
        <span>Contact</span>
        <span>Cookies</span>
      </footer>
    </div>
  );
}

function InfiniteScrollFooterGoodUx() {
  const [mode, setMode] = useState<InfiniteScrollFooterMode>("boundedAutoLoad");
  const status: Record<InfiniteScrollFooterMode, string> = {
    boundedAutoLoad: "Automatic loading pauses before it can hide the footer.",
    loadMore: "Load more is deliberate and inserts one requested batch.",
    jumpFooter: "Jump to footer gives keyboard and screen-reader users a direct route.",
    footerVisible: "Footer links are visible after the bounded stream.",
    endState: "End state replaces the spinner and keeps footer links reachable.",
    failedLoad: "Retry is available without blocking footer access.",
    returnPosition: "Route return restores the loaded boundary and current item.",
    keyboardBypass: "Keyboard users can bypass repeated result cards.",
    mobileFooter: "Mobile controls keep footer links tappable.",
    legalLinks: "Required legal links are not footer-only."
  };

  return (
    <div className="quality-example infinite-footer-demo">
      <InfiniteScrollFooterGoodPanel mode={mode} />
      <div className="infinite-footer-controls" aria-label="Infinite scroll footer access states">
        {infiniteFooterGoodModes.map((item) => (
          <button type="button" className={item.mode === mode ? "demo-button small primary" : "demo-button small"} key={item.mode} onClick={() => setMode(item.mode)}>
            {item.label}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">{status[mode]}</p>
    </div>
  );
}

function InfiniteScrollFooterBadUx() {
  const [mode, setMode] = useState<InfiniteScrollFooterBadMode>("autoPush");
  const status: Record<InfiniteScrollFooterBadMode, string> = {
    autoPush: "Auto-load pushes footer away before it can be used.",
    footerOnlyLegal: "Legal and support routes are footer-only and unreachable.",
    keyboardTrap: "Keyboard users are trapped in a growing card sequence.",
    spinnerLoop: "The bottom spinner never resolves to end, retry, or footer.",
    lostPosition: "Returning from detail loses the loaded position.",
    mobileMiss: "Mobile footer links move before the user can tap them.",
    virtualFocusLoss: "Virtualization removes the focused footer target.",
    noLoadMore: "There is no Load more, pause, or jump-to-footer escape."
  };

  return (
    <div className="quality-example infinite-footer-demo infinite-footer-bad-ux">
      <InfiniteScrollFooterBadPanel mode={mode} />
      <div className="infinite-footer-controls" aria-label="Broken infinite scroll footer states">
        {infiniteFooterBadModes.map((item) => (
          <button type="button" className={item.mode === mode ? "demo-button small primary" : "demo-button small"} key={item.mode} onClick={() => setMode(item.mode)}>
            {item.label}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">{status[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <InfiniteScrollFooterGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <InfiniteScrollFooterBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <InfiniteScrollFooterGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <InfiniteScrollFooterBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
