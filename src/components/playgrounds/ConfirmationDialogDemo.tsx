import { useEffect, useRef, useState } from "react";

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function ConfirmationDialogDemo() {
  const [open, setOpen] = useState(false);
  const [projectExists, setProjectExists] = useState(true);
  const [status, setStatus] = useState("Project is active.");
  const [highRisk, setHighRisk] = useState(false);
  const [typedValue, setTypedValue] = useState("");
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => cancelRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      const dialog = dialogRef.current;
      if (!dialog) return;

      if (event.key === "Escape") {
        event.preventDefault();
        close("Deletion cancelled with Escape. Project is unchanged.");
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function close(message: string) {
    setOpen(false);
    setStatus(message);
    setTypedValue("");
    window.setTimeout(() => openerRef.current?.focus(), 0);
  }

  return (
    <div className="demo-surface">
      <div className="demo-object">
        <strong>Research archive</strong>
        <span>{projectExists ? "Active project with 14 notes" : "Deleted"}</span>
      </div>
      <div className="demo-row" role="group" aria-label="Confirmation risk variant">
        <button
          className={!highRisk ? "demo-button small primary" : "demo-button small"}
          type="button"
          aria-pressed={!highRisk}
          onClick={() => setHighRisk(false)}
        >
          Standard risk
        </button>
        <button
          className={highRisk ? "demo-button small primary" : "demo-button small"}
          type="button"
          aria-pressed={highRisk}
          onClick={() => setHighRisk(true)}
        >
          Typed confirmation
        </button>
      </div>
      <div className="demo-row">
        <button
          ref={openerRef}
          className="demo-button danger"
          disabled={!projectExists}
          onClick={() => setOpen(true)}
        >
          Delete project
        </button>
        <span className="demo-status" aria-live="polite">
          {status}
        </span>
      </div>

      {open && (
        <div
          className="demo-backdrop is-open"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setStatus("Outside click ignored. Choose Cancel or Delete project.");
            }
          }}
        >
          <div
            ref={dialogRef}
            className="demo-dialog compact"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-description"
          >
            <h3 id="confirm-title">Delete Research archive?</h3>
            <p id="confirm-description">This removes the project and its 14 notes. This demo treats the action as irreversible.</p>
            {highRisk && (
              <label>
                Type DELETE to confirm
                <input name="typed-confirmation" value={typedValue} onChange={(event) => setTypedValue(event.target.value)} />
              </label>
            )}
            <div className="demo-actions">
              <button
                className="demo-button danger"
                disabled={highRisk && typedValue !== "DELETE"}
                onClick={() => {
                  setProjectExists(false);
                  close(highRisk ? "Project deleted after typed confirmation." : "Project deleted. The destructive action was explicit.");
                }}
              >
                Delete project
              </button>
              <button ref={cancelRef} className="demo-button" onClick={() => close("Deletion cancelled. Project is unchanged.")}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
