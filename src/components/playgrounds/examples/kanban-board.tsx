import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type KanbanStatus = "backlog" | "ready" | "progress" | "review" | "done";

type KanbanCard = {
  id: string;
  title: string;
  status: KanbanStatus;
  owner: string;
  priority: "High" | "Medium" | "Low";
  age: string;
  due: string;
  blocked?: string;
  hiddenWhenFiltered?: boolean;
};

const kanbanColumns: Array<{ id: KanbanStatus; label: string; limit?: number; description: string }> = [
  { id: "backlog", label: "Backlog", description: "Not started" },
  { id: "ready", label: "Ready", limit: 4, description: "Ready to pull" },
  { id: "progress", label: "In progress", limit: 3, description: "Active work" },
  { id: "review", label: "Review", limit: 2, description: "Needs review" },
  { id: "done", label: "Done", description: "Completed" }
];

const kanbanCards: KanbanCard[] = [
  { id: "KB-42", title: "Checkout payment retry", status: "progress", owner: "Maya", priority: "High", age: "2d", due: "Jun 13", blocked: "Waiting on gateway logs" },
  { id: "KB-51", title: "Invoice CSV export", status: "progress", owner: "Noah", priority: "Medium", age: "1d", due: "Jun 17" },
  { id: "KB-33", title: "Refund review copy", status: "review", owner: "Aditi", priority: "High", age: "4d", due: "Jun 12" },
  { id: "KB-37", title: "Role audit tooltip", status: "review", owner: "Luis", priority: "Low", age: "6d", due: "Jun 20", hiddenWhenFiltered: true },
  { id: "KB-61", title: "Admin invite polish", status: "review", owner: "Mina", priority: "Medium", age: "5d", due: "Jun 14", hiddenWhenFiltered: true },
  { id: "KB-22", title: "SAML setup checklist", status: "ready", owner: "Iris", priority: "High", age: "3d", due: "Jun 16" },
  { id: "KB-11", title: "Archive stale projects", status: "backlog", owner: "Team", priority: "Low", age: "12d", due: "Later" },
  { id: "KB-05", title: "Billing receipt done", status: "done", owner: "Kai", priority: "Medium", age: "0d", due: "Jun 10" }
];

function KanbanCardView({ card, onMove, compact = false }: { card: KanbanCard; onMove?: (id: string, status: KanbanStatus) => void; compact?: boolean }) {
  return (
    <article className={`kanban-card${card.blocked ? " is-blocked" : ""}${card.age.endsWith("d") && Number.parseInt(card.age, 10) >= 5 ? " is-stale" : ""}`}>
      <div className="kanban-card-head">
        <strong>{card.title}</strong>
        <span>{card.id}</span>
      </div>
      <div className="kanban-card-meta">
        <span>{card.owner}</span>
        <span>{card.priority}</span>
        <span>{card.age} in column</span>
        <span>{card.due}</span>
      </div>
      {card.blocked ? <p className="kanban-blocked">Blocked: {card.blocked}</p> : null}
      {!compact && onMove ? (
        <div className="kanban-card-actions">
          <button type="button" className="demo-button small" onClick={() => onMove(card.id, "review")}>Move to Review</button>
          <button type="button" className="demo-button small" onClick={() => onMove(card.id, "done")}>Move to Done</button>
        </div>
      ) : null}
    </article>
  );
}

function KanbanBoard({
  cards,
  hiddenCount = 0,
  onMove,
  focusedCardId
}: {
  cards: KanbanCard[];
  hiddenCount?: number;
  onMove?: (id: string, status: KanbanStatus) => void;
  focusedCardId?: string;
}) {
  return (
    <div className="kanban-board" aria-label="Product delivery Kanban board">
      {kanbanColumns.map((column) => {
        const columnCards = cards.filter((card) => card.status === column.id);
        const isOverLimit = typeof column.limit === "number" && columnCards.length > column.limit;
        return (
          <section className={`kanban-column${isOverLimit ? " is-over-limit" : ""}`} key={column.id} aria-label={`${column.label}, ${columnCards.length} cards${column.limit ? `, WIP limit ${column.limit}` : ""}`}>
            <header>
              <div>
                <strong>{column.label}</strong>
                <span>{column.description}</span>
              </div>
              <em>{columnCards.length}{column.limit ? ` / ${column.limit}` : ""}</em>
            </header>
            {isOverLimit ? <p className="kanban-wip-warning">Over WIP limit. Finish or unblock work before pulling more.</p> : null}
            {column.id === "review" && hiddenCount > 0 ? <p className="kanban-hidden-count">{hiddenCount} filtered card{hiddenCount === 1 ? "" : "s"} hidden</p> : null}
            <div className="kanban-card-stack">
              {columnCards.length ? columnCards.map((card) => (
                <KanbanCardView card={card} onMove={onMove} compact={focusedCardId !== card.id && Boolean(onMove)} key={card.id} />
              )) : <p className="kanban-empty">No cards in this state</p>}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function KanbanBoardGoodUi() {
  return (
    <div className="quality-example kanban-demo">
      <div className="kanban-toolbar" id="kanban-ui-label">
        <strong>Product delivery board</strong>
        <span>Status columns</span>
        <span>WIP shown</span>
        <span>Blocked visible</span>
        <span>8 cards</span>
      </div>
      <KanbanBoard cards={kanbanCards} hiddenCount={0} focusedCardId="KB-42" />
      <p className="demo-status">The board shows workflow columns, counts, WIP limits, card metadata, blocked and stale work, and over-limit Review state.</p>
    </div>
  );
}

function KanbanBoardBadUi() {
  return (
    <div className="bad-ui-sample kanban-bad-demo is-decorativeColumns">
      <div className="kanban-broken" aria-label="Broken Kanban board">
        <section><strong>Important</strong><span>Sticky</span><span>Thing</span></section>
        <section><strong>Maybe</strong><span>Card</span><span>Idea</span></section>
        <section><strong>Later</strong><span>Stuff</span></section>
      </div>
      <p className="demo-status">The broken board uses vague categories, no workflow status mapping, no WIP signals, and no card identity.</p>
    </div>
  );
}

function KanbanBoardGoodUx() {
  const [cards, setCards] = useState(kanbanCards);
  const [focusedCardId, setFocusedCardId] = useState("KB-42");
  const [filterHigh, setFilterHigh] = useState(false);
  const [lastMove, setLastMove] = useState<{ id: string; from: KanbanStatus; to: KanbanStatus } | null>(null);
  const [message, setMessage] = useState("Board shows all workflow columns with WIP limits, blocked cards, and current counts.");

  const visibleCards = filterHigh ? cards.filter((card) => card.priority === "High") : cards;
  const hiddenReviewCount = filterHigh ? cards.filter((card) => card.status === "review" && card.priority !== "High").length : 0;

  const moveCard = (id: string, to: KanbanStatus) => {
    setCards((currentCards) => {
      const card = currentCards.find((item) => item.id === id);
      if (!card) return currentCards;
      setLastMove({ id, from: card.status, to });
      setFocusedCardId(id);
      setMessage(`${id} moved from ${kanbanColumns.find((column) => column.id === card.status)?.label} to ${kanbanColumns.find((column) => column.id === to)?.label}. Status, count, and WIP signal update together.`);
      return currentCards.map((item) => item.id === id ? { ...item, status: to } : item);
    });
  };

  const undoMove = () => {
    if (!lastMove) {
      setMessage("No move to undo. The board keeps move recovery close to the workflow.");
      return;
    }
    setCards((currentCards) => currentCards.map((card) => card.id === lastMove.id ? { ...card, status: lastMove.from } : card));
    setFocusedCardId(lastMove.id);
    setMessage(`${lastMove.id} restored to ${kanbanColumns.find((column) => column.id === lastMove.from)?.label}.`);
    setLastMove(null);
  };

  return (
    <div className="quality-example kanban-demo">
      <div className="kanban-toolbar" id="kanban-ux-label">
        <strong>Product delivery board</strong>
        <span>{filterHigh ? "High priority filter" : "All cards"}</span>
        <span>{hiddenReviewCount} hidden in Review</span>
        <span>Move menus enabled</span>
      </div>
      <KanbanBoard cards={visibleCards} hiddenCount={hiddenReviewCount} onMove={moveCard} focusedCardId={focusedCardId} />
      <div className="demo-row kanban-controls" aria-label="Kanban board exercise controls">
        <button type="button" className="demo-button small" onClick={() => moveCard("KB-42", "review")}>Move KB-42 to Review</button>
        <button type="button" className={filterHigh ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setFilterHigh((value) => !value);
          setMessage(!filterHigh ? "High-priority filter applied. Hidden Review cards remain counted so WIP is not misread." : "All cards restored with full WIP context.");
        }}>Toggle high filter</button>
        <button type="button" className="demo-button small" onClick={() => {
          setFocusedCardId("KB-42");
          setMessage("Blocked card KB-42 is focused with owner, age, due date, and blocker reason visible.");
        }}>Open blocked card</button>
        <button type="button" className="demo-button small" onClick={() => {
          moveCard(focusedCardId, "done");
          setMessage(`${focusedCardId} moved by keyboard move control to Done with status feedback.`);
        }}>Keyboard move to Done</button>
        <button type="button" className="demo-button small" onClick={undoMove}>Undo move</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function KanbanBoardBadUx() {
  type Mode = "decorativeColumns" | "dragOnly" | "hiddenWip" | "staleCards" | "wrongStatus" | "sortedPriority";
  const [mode, setMode] = useState<Mode>("decorativeColumns");
  const copy: Record<Mode, string> = {
    decorativeColumns: "Columns are arbitrary categories, so moving cards does not mean workflow progress.",
    dragOnly: "Cards can only move by pointer drag; keyboard users have no status-change path.",
    hiddenWip: "A filter hides Review cards but the board still implies capacity is available.",
    staleCards: "Blocked and aging cards look identical to healthy work, hiding bottlenecks.",
    wrongStatus: "A card appears Done but the backend status remains In progress.",
    sortedPriority: "Sorted order is presented as manual priority, so teams misread what to pull next."
  };

  return (
    <div className={`quality-example kanban-bad-demo is-${mode}`}>
      <div className="kanban-broken" aria-label="Broken Kanban behavior">
        <section><strong>{mode === "wrongStatus" ? "Done?" : "Important"}</strong><span>{mode === "dragOnly" ? "Drag me" : "Sticky note"}</span><span>{mode === "hiddenWip" ? "Only 1 visible" : "No status field"}</span></section>
        <section><strong>{mode === "staleCards" ? "In progress" : "Maybe"}</strong><span>{mode === "staleCards" ? "21 days old" : "Card"}</span><span>{mode === "sortedPriority" ? "Sorted by date" : "No WIP"}</span></section>
        <section><strong>{mode === "wrongStatus" ? "Report says Active" : "Later"}</strong><span>{mode === "hiddenWip" ? "6 hidden cards" : "Stuff"}</span></section>
      </div>
      <div className="demo-row kanban-controls">
        <button type="button" className={mode === "decorativeColumns" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("decorativeColumns")}>Decorative columns</button>
        <button type="button" className={mode === "dragOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("dragOnly")}>Drag only</button>
        <button type="button" className={mode === "hiddenWip" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenWip")}>Hidden WIP</button>
        <button type="button" className={mode === "staleCards" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleCards")}>Stale cards</button>
        <button type="button" className={mode === "wrongStatus" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("wrongStatus")}>Wrong status</button>
        <button type="button" className={mode === "sortedPriority" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("sortedPriority")}>Sorted priority</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <KanbanBoardGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <KanbanBoardBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <KanbanBoardGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <KanbanBoardBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
