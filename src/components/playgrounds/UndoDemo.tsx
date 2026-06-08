import { useEffect, useState } from "react";

const initialItems = ["Inbox cleanup", "Quarterly report", "Vendor renewal"];
const undoWindowSeconds = 6;

export default function UndoDemo() {
  const [items, setItems] = useState(initialItems);
  const [deleted, setDeleted] = useState<{ item: string; index: number } | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [status, setStatus] = useState("All tasks are visible.");

  useEffect(() => {
    if (!deleted) return;
    if (secondsLeft <= 0) {
      setStatus(`${deleted.item} deletion committed. Undo is no longer available.`);
      setDeleted(null);
      return;
    }

    const timeout = window.setTimeout(() => setSecondsLeft((current) => current - 1), 1000);
    return () => window.clearTimeout(timeout);
  }, [deleted, secondsLeft]);

  function deleteItem(item: string, index: number) {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setDeleted({ item, index });
    setSecondsLeft(undoWindowSeconds);
    setStatus(`${item} deleted. Undo is available for ${undoWindowSeconds} seconds.`);
  }

  function undo() {
    if (!deleted) return;
    setItems((current) => {
      const next = [...current];
      next.splice(deleted.index, 0, deleted.item);
      return next;
    });
    setStatus(`${deleted.item} restored.`);
    setDeleted(null);
    setSecondsLeft(0);
  }

  return (
    <div className="demo-surface">
      <ul className="demo-list">
        {items.map((item, index) => (
          <li key={item}>
            <span>{item}</span>
            <button className="demo-button small" disabled={Boolean(deleted)} onClick={() => deleteItem(item, index)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className="demo-message" role="status" aria-live="polite">
        <span>{deleted ? `${status} ${secondsLeft}s left.` : status}</span>
        {deleted && (
          <button className="demo-button small" onClick={undo}>
            Undo
          </button>
        )}
      </div>
    </div>
  );
}
