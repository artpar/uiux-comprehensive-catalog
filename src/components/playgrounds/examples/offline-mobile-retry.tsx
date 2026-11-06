import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type OfflineMobileRetryMode =
  | "offlineSubmit"
  | "queuedLocal"
  | "retryReady"
  | "retrying"
  | "backgroundEligible"
  | "backgroundUnavailable"
  | "appReturn"
  | "meteredPause"
  | "wifiOnly"
  | "lowBattery"
  | "captivePortal"
  | "authExpired"
  | "attachmentRetry"
  | "partialUpload"
  | "duplicateGuard"
  | "success"
  | "failedAgain"
  | "exhausted"
  | "cancelled"
  | "conflictReview"
  | "expiredQueue";

type OfflineMobileRetryBadMode =
  | "falseSent"
  | "hiddenQueue"
  | "duplicateSubmit"
  | "retryLoop"
  | "meteredDrain"
  | "lostBackground"
  | "paymentDuplicate";

const offlineMobileRetryGoodLabels: Array<[OfflineMobileRetryMode, string]> = [
  ["offlineSubmit", "Offline submit"],
  ["queuedLocal", "Queued local"],
  ["retryReady", "Retry ready"],
  ["retrying", "Retrying"],
  ["backgroundEligible", "Background eligible"],
  ["backgroundUnavailable", "Background unavailable"],
  ["appReturn", "App return"],
  ["meteredPause", "Metered pause"],
  ["wifiOnly", "Wi-Fi only"],
  ["lowBattery", "Low battery"],
  ["captivePortal", "Captive portal"],
  ["authExpired", "Auth expired"],
  ["attachmentRetry", "Attachment retry"],
  ["partialUpload", "Partial upload"],
  ["duplicateGuard", "Duplicate guard"],
  ["success", "Success"],
  ["failedAgain", "Failed again"],
  ["exhausted", "Exhausted"],
  ["cancelled", "Cancelled"],
  ["conflictReview", "Conflict review"],
  ["expiredQueue", "Expired queue"]
];

const offlineMobileRetryBadLabels: Array<[OfflineMobileRetryBadMode, string]> = [
  ["falseSent", "False sent"],
  ["hiddenQueue", "Hidden queue"],
  ["duplicateSubmit", "Duplicate submit"],
  ["retryLoop", "Retry loop"],
  ["meteredDrain", "Metered drain"],
  ["lostBackground", "Lost background"],
  ["paymentDuplicate", "Payment duplicate"]
];

type OfflineMobileRetryItem = {
  chip: string;
  title: string;
  queue: string;
  network: string;
  attempt: string;
  next: string;
  action: string;
  status: string;
  tone?: "safe" | "warn" | "neutral";
  pending?: boolean;
};

function OfflineMobileRetryPanel({ mode, idSuffix }: { mode: OfflineMobileRetryMode; idSuffix: string }) {
  const config: Record<OfflineMobileRetryMode, OfflineMobileRetryItem> = {
    offlineSubmit: {
      chip: "Offline",
      title: "Report saved locally, not sent",
      queue: "1 report, 2 photos",
      network: "No connection",
      attempt: "0 of 3",
      next: "Retry when online",
      action: "Retry now",
      status: "The mobile submit is preserved locally and does not claim server success.",
      tone: "warn"
    },
    queuedLocal: {
      chip: "Queued",
      title: "Stored on this device",
      queue: "MOB-1842",
      network: "Waiting",
      attempt: "Queued 10:42",
      next: "Background sync allowed",
      action: "Cancel queue",
      status: "The queue names the stored payload and request ID users can recover after leaving the screen.",
      tone: "neutral"
    },
    retryReady: {
      chip: "Ready",
      title: "Connection returned",
      queue: "MOB-1842",
      network: "Online",
      attempt: "0 of 3",
      next: "Manual or background retry",
      action: "Retry now",
      status: "Retry is available for the same queued action, while the original submit remains guarded.",
      tone: "safe"
    },
    retrying: {
      chip: "Retrying",
      title: "Sending preserved request",
      queue: "MOB-1842",
      network: "Online",
      attempt: "Attempt 1 of 3",
      next: "Disable duplicate submit",
      action: "Sending...",
      status: "The retrying state blocks duplicate sends and keeps the request identity visible.",
      tone: "neutral",
      pending: true
    },
    backgroundEligible: {
      chip: "Background",
      title: "Will retry if app is closed",
      queue: "2 photos queued",
      network: "Online event",
      attempt: "Next background sync",
      next: "OS-managed retry",
      action: "Send now",
      status: "Background retry is explained as eligible rather than guaranteed immediate completion.",
      tone: "safe"
    },
    backgroundUnavailable: {
      chip: "Foreground",
      title: "Background retry unavailable",
      queue: "1 report queued",
      network: "Browser limit",
      attempt: "Manual required",
      next: "Open app to send",
      action: "Retry now",
      status: "When the platform cannot replay in the background, the app gives a foreground retry path.",
      tone: "warn"
    },
    appReturn: {
      chip: "Returned",
      title: "Queue survives app return",
      queue: "MOB-1842 still queued",
      network: "Checking server",
      attempt: "Last tried 10:42",
      next: "Resume retry",
      action: "Resume",
      status: "The queued item remains visible after backgrounding or restarting the mobile app.",
      tone: "neutral"
    },
    meteredPause: {
      chip: "Metered",
      title: "Paused on metered data",
      queue: "18 MB photos",
      network: "Cellular metered",
      attempt: "Paused",
      next: "Retry on Wi-Fi",
      action: "Send anyway",
      status: "Large retry work is paused with a user-controlled override instead of draining data silently.",
      tone: "warn"
    },
    wifiOnly: {
      chip: "Wi-Fi only",
      title: "Waiting for allowed network",
      queue: "Photo upload",
      network: "Cellular",
      attempt: "0 of 3",
      next: "Wi-Fi required",
      action: "Change setting",
      status: "The retry rule explains that the action is preserved but waiting for Wi-Fi.",
      tone: "neutral"
    },
    lowBattery: {
      chip: "Battery",
      title: "Retry paused by battery saver",
      queue: "2 queued items",
      network: "Online",
      attempt: "Paused",
      next: "Resume when charging",
      action: "Retry now",
      status: "Battery constraints are explicit and do not erase the queue.",
      tone: "warn"
    },
    captivePortal: {
      chip: "Portal",
      title: "Network sign-in required",
      queue: "MOB-1842",
      network: "Captive portal",
      attempt: "Attempt blocked",
      next: "Sign in to Wi-Fi",
      action: "Open network login",
      status: "Captive portal is not treated as normal online retry failure.",
      tone: "warn"
    },
    authExpired: {
      chip: "Auth",
      title: "Sign in before retry",
      queue: "MOB-1842 preserved",
      network: "Online",
      attempt: "Token expired",
      next: "Reauthenticate",
      action: "Sign in",
      status: "The app routes through sign-in and returns to the same queued item.",
      tone: "warn"
    },
    attachmentRetry: {
      chip: "Photo",
      title: "Retry failed attachment",
      queue: "1 of 2 photos failed",
      network: "Online",
      attempt: "Attempt 2 of 3",
      next: "Retry photo only",
      action: "Retry photo",
      status: "Attachment retry is scoped to the failed item, not the whole report.",
      tone: "warn"
    },
    partialUpload: {
      chip: "Partial",
      title: "Report saved, attachment pending",
      queue: "Text accepted, photo queued",
      network: "Online",
      attempt: "Photo 0 of 3",
      next: "Keep queue visible",
      action: "Retry photo",
      status: "Partial success does not collapse into a false all-done state.",
      tone: "neutral"
    },
    duplicateGuard: {
      chip: "Guarded",
      title: "Submit disabled for queued request",
      queue: "MOB-1842 pending",
      network: "Checking",
      attempt: "Same idempotency key",
      next: "Wait for result",
      action: "Submit disabled",
      status: "The duplicate guard prevents a second mobile submit while the queued request is unresolved.",
      tone: "safe"
    },
    success: {
      chip: "Sent",
      title: "Server accepted queued report",
      queue: "MOB-1842 sent",
      network: "Online",
      attempt: "Accepted 10:51",
      next: "Remove from queue",
      action: "View receipt",
      status: "Success appears only after server acceptance, not after local queueing.",
      tone: "safe"
    },
    failedAgain: {
      chip: "Failed",
      title: "Retry failed again",
      queue: "MOB-1842 preserved",
      network: "Server timeout",
      attempt: "Attempt 2 of 3",
      next: "Retry in 5 min",
      action: "Retry now",
      status: "Repeated failure updates attempt count and keeps local work recoverable.",
      tone: "warn"
    },
    exhausted: {
      chip: "Exhausted",
      title: "Retry limit reached",
      queue: "MOB-1842 preserved",
      network: "Unstable",
      attempt: "3 of 3",
      next: "Export or support",
      action: "Export local copy",
      status: "After retry is no longer honest, the UI moves to fallback recovery.",
      tone: "warn"
    },
    cancelled: {
      chip: "Cancelled",
      title: "Queued action cancelled",
      queue: "Local copy kept",
      network: "Any",
      attempt: "Stopped",
      next: "Edit or discard",
      action: "Edit draft",
      status: "Cancel explains whether it stopped retry only or discarded local content.",
      tone: "neutral"
    },
    conflictReview: {
      chip: "Conflict",
      title: "Server changed before retry",
      queue: "MOB-1842 needs review",
      network: "Online",
      attempt: "Retry blocked",
      next: "Compare versions",
      action: "Review conflict",
      status: "Conflict is handed to review instead of blind retry overwrite.",
      tone: "warn"
    },
    expiredQueue: {
      chip: "Expired",
      title: "Queued request expired",
      queue: "Request too old",
      network: "Online",
      attempt: "Expired after 24h",
      next: "Resubmit after review",
      action: "Review draft",
      status: "Expired queue state prevents unsafe replay of stale mobile actions.",
      tone: "warn"
    }
  };
  const item = config[mode];
  const titleId = `offline-mobile-retry-title-${idSuffix}`;
  const descId = `offline-mobile-retry-desc-${idSuffix}`;

  return (
    <section className={`offline-mobile-retry-shell is-${item.tone ?? "neutral"}`} aria-labelledby={titleId} aria-describedby={descId}>
      <header className="offline-mobile-retry-header">
        <div>
          <span>{item.chip}</span>
          <strong id={titleId}>{item.title}</strong>
        </div>
        <button type="button" className="offline-mobile-retry-action" disabled={item.pending}>{item.action}</button>
      </header>
      <div className="offline-mobile-retry-phone" id={descId}>
        <div className="offline-mobile-retry-screen">
          <span>{item.chip}</span>
          <strong>{item.queue}</strong>
          <small>{item.next}</small>
        </div>
        <div className="offline-mobile-retry-grid">
          <div><span>Queue</span><strong>{item.queue}</strong></div>
          <div><span>Network</span><strong>{item.network}</strong></div>
          <div><span>Attempt</span><strong>{item.attempt}</strong></div>
          <div><span>Next</span><strong>{item.next}</strong></div>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{item.status}</p>
    </section>
  );
}

function OfflineMobileRetryGoodUi() {
  return (
    <div className="quality-example offline-mobile-retry-demo">
      <OfflineMobileRetryPanel mode="queuedLocal" idSuffix="good-ui" />
    </div>
  );
}

function OfflineMobileRetryBadUi() {
  return (
    <div className="bad-ui-sample offline-mobile-retry-bad-ui">
      <section className="offline-mobile-retry-shell bad" aria-label="Broken offline mobile retry interface">
        <header className="offline-mobile-retry-header">
          <div>
            <span>False sent</span>
            <strong>Airplane-mode submit looks complete</strong>
          </div>
          <button type="button" className="offline-mobile-retry-action danger">Submit again</button>
        </header>
        <p>The phone says Sent, hides the local queue, leaves Submit enabled, and gives no request ID, retry state, or duplicate guard.</p>
        <div className="offline-mobile-retry-grid compact">
          <div><span>Queue</span><strong>Hidden</strong></div>
          <div><span>Network</span><strong>Offline</strong></div>
          <div><span>Duplicate</span><strong>Enabled</strong></div>
          <div><span>Proof</span><strong>No server receipt</strong></div>
        </div>
      </section>
      <p className="demo-status">The broken UI confuses local queueing with server acceptance.</p>
    </div>
  );
}

function OfflineMobileRetryGoodUx() {
  const [mode, setMode] = useState<OfflineMobileRetryMode>("offlineSubmit");

  return (
    <div className="quality-example offline-mobile-retry-demo">
      <div className="demo-row offline-mobile-retry-controls" aria-label="Offline mobile retry exercise controls">
        {offlineMobileRetryGoodLabels.map(([key, label]) => (
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
      <OfflineMobileRetryPanel mode={mode} idSuffix="good-ux" />
      <p className="demo-status" aria-live="polite">Offline mobile retry state: {offlineMobileRetryGoodLabels.find(([key]) => key === mode)?.[1]}.</p>
    </div>
  );
}

function OfflineMobileRetryBadUx() {
  const [mode, setMode] = useState<OfflineMobileRetryBadMode>("falseSent");
  const copy: Record<OfflineMobileRetryBadMode, { title: string; body: string; consequence: string; metric: string }> = {
    falseSent: {
      title: "False sent",
      body: "A report submitted in airplane mode immediately shows Sent with no local queue or server receipt.",
      consequence: "Users trust a task that has not left the device.",
      metric: "No proof"
    },
    hiddenQueue: {
      title: "Hidden queue",
      body: "The app stores a report locally but hides the queued item after the user leaves the page.",
      consequence: "Users cannot retry, cancel, or prove what is pending.",
      metric: "Invisible"
    },
    duplicateSubmit: {
      title: "Duplicate submit",
      body: "Submit stays enabled while the same queued request is waiting for network.",
      consequence: "A reconnect can create duplicate reports.",
      metric: "No guard"
    },
    retryLoop: {
      title: "Retry loop",
      body: "The mobile client retries every few seconds during a service outage with no cap or backoff.",
      consequence: "Retry becomes load amplification instead of recovery.",
      metric: "No backoff"
    },
    meteredDrain: {
      title: "Metered drain",
      body: "A 40 MB photo upload retries on metered cellular data without warning or pause.",
      consequence: "The app spends user data and battery without control.",
      metric: "No pause"
    },
    lostBackground: {
      title: "Lost background work",
      body: "The OS suspends background sync and the app discards the queued upload when reopened.",
      consequence: "Mobile lifecycle loss becomes data loss.",
      metric: "Queue lost"
    },
    paymentDuplicate: {
      title: "Payment duplicate",
      body: "A payment authorization retries automatically after reconnect with no idempotency reference or review.",
      consequence: "A side-effecting action can charge twice.",
      metric: "Unsafe retry"
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example offline-mobile-retry-bad-ux is-${mode}`}>
      <div className="demo-row offline-mobile-retry-controls" aria-label="Offline mobile retry misuse controls">
        {offlineMobileRetryBadLabels.map(([key, label]) => (
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
      <section className="offline-mobile-retry-shell bad" aria-label={`Offline mobile retry failure: ${item.title}`}>
        <header className="offline-mobile-retry-header">
          <div>
            <span>{item.title}</span>
            <strong>{item.metric}</strong>
          </div>
          <button type="button" className="offline-mobile-retry-action danger">Try again</button>
        </header>
        <p>{item.body}</p>
        <div className="offline-mobile-retry-grid compact">
          <div><span>Local work</span><strong>{mode === "lostBackground" || mode === "hiddenQueue" ? "Unrecoverable" : "Unclear"}</strong></div>
          <div><span>Duplicate guard</span><strong>{mode === "duplicateSubmit" || mode === "paymentDuplicate" ? "Missing" : "Weak"}</strong></div>
          <div><span>Retry rule</span><strong>{mode === "retryLoop" ? "Uncapped" : "Hidden"}</strong></div>
          <div><span>Mobile constraint</span><strong>{mode === "meteredDrain" ? "Ignored" : "Not named"}</strong></div>
        </div>
      </section>
      <p className="demo-status" aria-live="polite">{item.consequence}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <OfflineMobileRetryGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <OfflineMobileRetryBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <OfflineMobileRetryGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <OfflineMobileRetryBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
