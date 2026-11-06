import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

const toolbarItems = [
  { id: "undo", label: "Undo", group: "History" },
  { id: "redo", label: "Redo", group: "History" },
  { id: "bold", label: "Bold", group: "Format" },
  { id: "italic", label: "Italic", group: "Format" },
  { id: "align", label: "Align", group: "Layout" },
  { id: "more", label: "More actions", group: "Overflow" }
];

function ToolbarGoodUi() {
  return (
    <div className="quality-example toolbar-static-preview">
      <section className="toolbar-context-card">
        <div>
          <strong>Proposal.docx</strong>
          <span>Selected text: 28 characters - scope: current document</span>
        </div>
      </section>
      <div className="toolbar-shell" role="toolbar" aria-label="Text formatting toolbar">
        <button type="button" className="toolbar-button">Undo</button>
        <button type="button" className="toolbar-button is-disabled" aria-disabled="true">Redo</button>
        <span className="toolbar-separator" aria-hidden="true" />
        <button type="button" className="toolbar-button is-pressed" aria-pressed="true">Bold</button>
        <button type="button" className="toolbar-button">Italic</button>
        <button type="button" className="toolbar-button">Align</button>
        <span className="toolbar-separator" aria-hidden="true" />
        <button type="button" className="toolbar-button">More actions</button>
      </div>
      <p className="demo-status">The toolbar is named, scoped to the document, grouped by command type, and exposes disabled and pressed states.</p>
    </div>
  );
}

function ToolbarBadUi() {
  return (
    <div className="bad-ui-sample toolbar-static-preview bad">
      <div className="toolbar-bad-strip" aria-label="Broken toolbar">
        {["←", "B", "?", "$", "⚙", "×", "..."].map((item) => (
          <button type="button" key={item}>{item}</button>
        ))}
      </div>
      <div className="toolbar-bad-scope">
        <strong>Mixed command row</strong>
        <span>Back, pricing, delete, account settings, format, and submit share one strip with no scope or state.</span>
      </div>
      <p className="demo-status">The broken strip mixes unrelated destinations and commands, hides labels in symbols, and gives no current state.</p>
    </div>
  );
}

function ToolbarGoodUx() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [bold, setBold] = useState(true);
  const [italic, setItalic] = useState(false);
  const [selectedRows, setSelectedRows] = useState(0);
  const [overflowOpen, setOverflowOpen] = useState(false);
  const [status, setStatus] = useState("Toolbar focus starts on Undo. Use arrow-style controls to move within the command strip.");
  const activeItem = toolbarItems[activeIndex] ?? toolbarItems[0];

  const move = (nextIndex: number, reason: string) => {
    const normalized = (nextIndex + toolbarItems.length) % toolbarItems.length;
    setActiveIndex(normalized);
    setStatus(`${toolbarItems[normalized].label} focused. ${reason}`);
  };

  const activate = (itemId = activeItem.id) => {
    if (itemId === "bold") {
      setBold((value) => !value);
      setStatus(`Bold ${bold ? "turned off" : "turned on"} for selected text; focus remains in the toolbar.`);
      return;
    }
    if (itemId === "italic") {
      setItalic((value) => !value);
      setStatus(`Italic ${italic ? "turned off" : "turned on"} for selected text; focus remains in the toolbar.`);
      return;
    }
    if (itemId === "redo") {
      setStatus("Redo is unavailable because there is no redo stack; disabled reason stays discoverable.");
      return;
    }
    if (itemId === "more") {
      setOverflowOpen((open) => !open);
      setStatus(overflowOpen ? "Overflow closed and focus returns to More actions." : "Overflow opened with secondary document commands and the same document scope.");
      return;
    }
    setStatus(`${toolbarItems.find((item) => item.id === itemId)?.label ?? "Command"} ran for Proposal.docx without moving focus away from the toolbar.`);
  };

  const archiveSelection = () => {
    if (selectedRows === 0) {
      setStatus("Archive selected is blocked until rows are selected; the toolbar shows the missing target.");
      return;
    }
    setStatus(`Archive selected opened review for ${selectedRows} selected rows; selection scope stayed visible.`);
  };

  return (
    <div className="quality-example toolbar-demo">
      <section className="toolbar-context-card">
        <div>
          <h3>Proposal.docx</h3>
          <p>{selectedRows > 0 ? `${selectedRows} rows selected in the appendix table.` : "Selected text: 28 characters in the introduction."}</p>
        </div>
        <span>{selectedRows > 0 ? "Selection toolbar" : "Document toolbar"}</span>
      </section>
      <div
        className="toolbar-shell"
        role="toolbar"
        aria-label={selectedRows > 0 ? "Selected rows toolbar" : "Text formatting toolbar"}
      >
        {toolbarItems.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={[
              "toolbar-button",
              activeIndex === index ? "is-active" : "",
              item.id === "redo" ? "is-disabled" : "",
              (item.id === "bold" && bold) || (item.id === "italic" && italic) ? "is-pressed" : ""
            ].filter(Boolean).join(" ")}
            tabIndex={activeIndex === index ? 0 : -1}
            aria-disabled={item.id === "redo" ? "true" : undefined}
            aria-pressed={item.id === "bold" ? bold : item.id === "italic" ? italic : undefined}
            onClick={() => {
              setActiveIndex(index);
              activate(item.id);
            }}
          >
            <span>{item.label}</span>
            <em>{item.group}</em>
          </button>
        ))}
      </div>
      {overflowOpen && (
        <div className="toolbar-overflow-panel" role="menu" aria-label="More document actions">
          <button type="button" onClick={() => setStatus("Insert link chosen from overflow for Proposal.docx.")}>Insert link</button>
          <button type="button" onClick={() => setStatus("Attach file chosen from overflow for Proposal.docx.")}>Attach file</button>
          <button type="button" onClick={archiveSelection}>{selectedRows > 0 ? `Archive ${selectedRows} selected rows` : "Archive selected rows unavailable"}</button>
        </div>
      )}
      <div className="demo-row toolbar-exercise-controls">
        <button type="button" className="demo-button small" onClick={() => move(activeIndex + 1, "Right Arrow style movement stayed inside the toolbar.")}>Arrow right</button>
        <button type="button" className="demo-button small" onClick={() => move(activeIndex - 1, "Left Arrow style movement stayed inside the toolbar.")}>Arrow left</button>
        <button type="button" className="demo-button small" onClick={() => move(0, "Home moved to the first toolbar control.")}>Home</button>
        <button type="button" className="demo-button small" onClick={() => move(toolbarItems.length - 1, "End moved to the last toolbar control.")}>End</button>
        <button type="button" className="demo-button small" onClick={() => activate("bold")}>Toggle bold</button>
        <button type="button" className="demo-button small" onClick={() => activate("more")}>Open overflow</button>
        <button type="button" className="demo-button small" onClick={() => { setSelectedRows(3); setStatus("Selection changed to 3 rows; toolbar scope and available commands updated."); }}>Select 3 rows</button>
        <button type="button" className="demo-button small" onClick={() => { setSelectedRows(0); setStatus("Selection cleared; selection-only archive command is blocked again."); }}>Clear selection</button>
        <button type="button" className="demo-button small primary" onClick={archiveSelection}>Archive selected</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function ToolbarBadUx() {
  type Mode = "mixedScope" | "tabTrap" | "iconOnly" | "staleState" | "hiddenPrimary" | "overflowDump";
  const [mode, setMode] = useState<Mode>("mixedScope");
  const copy: Record<Mode, string> = {
    mixedScope: "The same strip mixes document formatting, account navigation, pricing, and deletion with no shared command scope.",
    tabTrap: "Keyboard users must tab through every control and cannot use arrow movement to cross the toolbar efficiently.",
    iconOnly: "Symbol-only buttons expose no stable names, and hover text is treated as the only label.",
    staleState: "Bold looks active after selection changes, but it no longer matches the selected text.",
    hiddenPrimary: "The only Save command is buried in overflow while decorative actions stay visible.",
    overflowDump: "Overflow contains unrelated forms, long help text, settings, and destructive actions instead of secondary toolbar commands."
  };

  return (
    <div className={`quality-example toolbar-bad-demo is-${mode}`}>
      <div className="toolbar-bad-strip" aria-label="Problematic toolbar">
        {(mode === "iconOnly" ? ["↶", "↷", "B", "I", "≡", "..."] : ["Back", "Bold", "Pricing", "Delete", "Account", "More"]).map((item) => (
          <button type="button" key={item}>{item}</button>
        ))}
      </div>
      <div className="toolbar-bad-scope">
        <strong>{mode === "hiddenPrimary" ? "Save is hidden in More" : mode === "overflowDump" ? "Overflow became a junk panel" : "Broken toolbar behavior"}</strong>
        <span>{copy[mode]}</span>
        {mode === "overflowDump" && (
          <div className="toolbar-junk-overflow">
            <span>Theme picker</span>
            <span>Delete account</span>
            <span>Three paragraph help text</span>
            <span>Billing form</span>
          </div>
        )}
      </div>
      <div className="demo-row toolbar-exercise-controls">
        <button type="button" className={mode === "mixedScope" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mixedScope")}>Mixed scope</button>
        <button type="button" className={mode === "tabTrap" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("tabTrap")}>Tab trap</button>
        <button type="button" className={mode === "iconOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("iconOnly")}>Icon only</button>
        <button type="button" className={mode === "staleState" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleState")}>Stale state</button>
        <button type="button" className={mode === "hiddenPrimary" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenPrimary")}>Hidden primary</button>
        <button type="button" className={mode === "overflowDump" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("overflowDump")}>Overflow dump</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ToolbarGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ToolbarBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ToolbarGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ToolbarBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
