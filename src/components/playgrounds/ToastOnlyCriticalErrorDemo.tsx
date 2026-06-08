import { useEffect, useState } from "react";

export default function ToastOnlyCriticalErrorDemo() {
  const [toastVisible, setToastVisible] = useState(false);
  const [persistentError, setPersistentError] = useState(false);

  useEffect(() => {
    if (!toastVisible) return;
    const timeout = window.setTimeout(() => setToastVisible(false), 2200);
    return () => window.clearTimeout(timeout);
  }, [toastVisible]);

  return (
    <div className="demo-surface">
      <div className="demo-split">
        <div className="demo-mini-panel">
          <h3>Anti-pattern</h3>
          <p>Critical save failure appears only as a disappearing toast.</p>
          <button className="demo-button danger" onClick={() => setToastVisible(true)}>
            Trigger toast-only error
          </button>
          {toastVisible && <div className="demo-toast" role="status">Save failed</div>}
        </div>
        <div className="demo-mini-panel corrected">
          <h3>Corrected pattern</h3>
          <p>Critical failure stays visible and includes recovery.</p>
          <button className="demo-button" onClick={() => setPersistentError(true)}>
            Trigger persistent error
          </button>
          {persistentError && (
            <div className="demo-error" role="alert">
              <strong>Save failed</strong>
              <p>Your changes were not saved. Check the connection and retry.</p>
              <button className="demo-button small" onClick={() => setPersistentError(false)}>
                Retry save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
