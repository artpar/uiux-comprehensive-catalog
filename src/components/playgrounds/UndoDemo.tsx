import { useEffect, useState } from "react";

const initialItems = ["Inbox cleanup", "Quarterly report", "Vendor renewal"];
const undoWindowSeconds = 6;

type PendingUndo = {
  id: string;
  item: string;
  index: number;
  secondsLeft: number;
};

export default function UndoDemo() {
  const [items, setItems] = useState(initialItems);
  const [pending, setPending] = useState<PendingUndo[]>([]);
  const [status, setStatus] = useState("All tasks are visible.");
  const [history, setHistory] = useState<string[]>(["Ready"]);

  useEffect(() => {
    if (pending.length === 0) return;
    const expired = pending.filter((item) => item.secondsLeft <= 0);
    if (expired.length > 0) {
      setPending((current) => current.filter((item) => item.secondsLeft > 0));
      setStatus(`${expired.map((item) => item.item).join(", ")} committed. Undo is no longer available.`);
      setHistory((current) => [...expired.map((item) => `Committed ${item.item}`), ...current].slice(0, 4));
      return;
    }

    const timeout = window.setTimeout(() => {
      setPending((current) => current.map((item) => ({ ...item, secondsLeft: item.secondsLeft - 1 })));
    }, 1000);
    return () => window.clearTimeout(timeout);
  }, [pending]);

  function deleteItem(item: string, index: number) {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setPending((current) => [
      ...current,
      { id: `${item}-${Date.now()}`, item, index, secondsLeft: undoWindowSeconds }
    ]);
    setStatus(`${item} deleted. Undo is available for ${undoWindowSeconds} seconds.`);
    setHistory((current) => [`Deleted ${item}; undo window started`, ...current].slice(0, 4));
  }

  function undo(pendingUndo: PendingUndo) {
    setItems((current) => {
      const next = [...current];
      next.splice(Math.min(pendingUndo.index, next.length), 0, pendingUndo.item);
      return next;
    });
    setPending((current) => current.filter((item) => item.id !== pendingUndo.id));
    setStatus(`${pendingUndo.item} restored.`);
    setHistory((current) => [`Restored ${pendingUndo.item}`, ...current].slice(0, 4));
  }

  return (
    <div className="demo-surface">
      <ul className="demo-list">
        {items.map((item, index) => (
          <li key={item}>
            <span>{item}</span>
            <button className="demo-button small" onClick={() => deleteItem(item, index)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className="demo-message" role="status" aria-live="polite">
        <span>{status}</span>
      </div>
      {pending.length > 0 && (
        <ul className="undo-queue" aria-label="Pending undo actions">
          {pending.map((item) => (
            <li key={item.id}>
              <span>{item.item} commits in {item.secondsLeft}s</span>
              <button className="demo-button small" onClick={() => undo(item)}>
                Undo
              </button>
            </li>
          ))}
        </ul>
      )}
      <ol className="state-history" aria-label="Undo state history">
        {history.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ol>
    </div>
  );
}
