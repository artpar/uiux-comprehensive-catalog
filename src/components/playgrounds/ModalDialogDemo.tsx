import { useEffect, useRef, useState } from "react";

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function ModalDialogDemo() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("Dialog is closed.");
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  function closeDialog(message: string) {
    setOpen(false);
    setStatus(message);
    window.setTimeout(() => openerRef.current?.focus(), 0);
  }

  useEffect(() => {
    if (!open) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector));
    focusable[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDialog("Dialog closed with Escape; focus returned to the opener.");
        return;
      }

      if (event.key !== "Tab" || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
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

  return (
    <div className="demo-surface">
      <div className="demo-row">
        <button
          ref={openerRef}
          className="demo-button"
          onClick={() => {
            setOpen(true);
            setStatus("Dialog opened; focus moved inside.");
          }}
        >
          Open account settings dialog
        </button>
        <span className="demo-status" aria-live="polite">
          {status}
        </span>
      </div>

      <div className={open ? "demo-backdrop is-open" : "demo-backdrop"} aria-hidden={!open}>
        {open && (
          <div
            ref={dialogRef}
            className="demo-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-demo-title"
            aria-describedby="modal-demo-description"
          >
            <h3 id="modal-demo-title">Account settings</h3>
            <p id="modal-demo-description">
              This focused task blocks the page until you save, cancel, press Escape, or close it.
            </p>
            <label>
              Display name
              <input defaultValue="Art" />
            </label>
            <div className="demo-actions">
              <button className="demo-button primary" onClick={() => closeDialog("Settings saved; focus returned to the opener.")}>
                Save settings
              </button>
              <button className="demo-button" onClick={() => closeDialog("Dialog cancelled; focus returned to the opener.")}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
