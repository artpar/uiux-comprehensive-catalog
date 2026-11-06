import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type QrScanMode =
  | "unsupported"
  | "preScan"
  | "delegatedScanner"
  | "permission"
  | "cameraReady"
  | "aimGuide"
  | "torch"
  | "focus"
  | "lowLight"
  | "noCode"
  | "multipleCodes"
  | "decoding"
  | "decodedPreview"
  | "unsafeUrl"
  | "expiredPayload"
  | "duplicateScan"
  | "scanFromPhoto"
  | "manualCode"
  | "success"
  | "cleanup"
  | "offlineValidation";

type QrScanBadMode =
  | "autoOpenUrl"
  | "cameraOnlyDeadEnd"
  | "wrongCodeSelected"
  | "spinnerNoGuidance"
  | "noPayloadPreview"
  | "secretRetained"
  | "repeatedAction";

const qrScanGoodLabels: Array<[QrScanMode, string]> = [
  ["unsupported", "Unsupported"],
  ["preScan", "Pre-scan"],
  ["delegatedScanner", "Delegated scanner"],
  ["permission", "Permission"],
  ["cameraReady", "Camera ready"],
  ["aimGuide", "Aim guide"],
  ["torch", "Torch"],
  ["focus", "Focus"],
  ["lowLight", "Low light"],
  ["noCode", "No code"],
  ["multipleCodes", "Multiple codes"],
  ["decoding", "Decoding"],
  ["decodedPreview", "Decoded preview"],
  ["unsafeUrl", "Unsafe URL"],
  ["expiredPayload", "Expired"],
  ["duplicateScan", "Duplicate"],
  ["scanFromPhoto", "Scan from photo"],
  ["manualCode", "Manual code"],
  ["success", "Success"],
  ["cleanup", "Cleanup"],
  ["offlineValidation", "Offline validation"]
];

const qrScanBadLabels: Array<[QrScanBadMode, string]> = [
  ["autoOpenUrl", "Auto-open URL"],
  ["cameraOnlyDeadEnd", "Camera-only dead end"],
  ["wrongCodeSelected", "Wrong code"],
  ["spinnerNoGuidance", "Spinner only"],
  ["noPayloadPreview", "No preview"],
  ["secretRetained", "Secret retained"],
  ["repeatedAction", "Repeated action"]
];

function QrGlyph({ variant = "target" }: { variant?: "target" | "found" | "warning" }) {
  return (
    <div className={`qr-scan-code is-${variant}`} aria-hidden="true">
      {Array.from({ length: 25 }).map((_, index) => (
        <span key={index}></span>
      ))}
    </div>
  );
}

function QrScanPanel({ mode = "decodedPreview", idSuffix = "static" }: { mode?: QrScanMode; idSuffix?: string }) {
  const config: Record<QrScanMode, {
    chip: string;
    title: string;
    scanner: string;
    payload: string;
    validation: string;
    fallback: string;
    privacy: string;
    action: string;
    status: string;
    tone?: "safe" | "warn" | "neutral";
    variant?: "target" | "found" | "warning";
    scanning?: boolean;
  }> = {
    unsupported: {
      chip: "Unsupported",
      title: "QR detection is not available here",
      scanner: "Detector missing",
      payload: "No decode yet",
      validation: "Format support unknown",
      fallback: "Scan from photo or enter code",
      privacy: "No camera frame collected",
      action: "Enter code",
      status: "The flow checks scanner support and offers a non-camera path before users get stuck.",
      tone: "neutral"
    },
    preScan: {
      chip: "Pre-scan",
      title: "Scan the device-pairing QR code",
      scanner: "Camera starts after tap",
      payload: "Expected: device token",
      validation: "Only thermostat setup codes",
      fallback: "Type pairing key",
      privacy: "Frame discarded after decode",
      action: "Start scan",
      status: "Purpose, payload type, fallback, and privacy copy appear before camera access.",
      tone: "safe"
    },
    delegatedScanner: {
      chip: "Delegated",
      title: "Use the OS code scanner",
      scanner: "Platform scanner handles camera",
      payload: "Barcode object returned",
      validation: "App validates after return",
      fallback: "Manual key",
      privacy: "App never receives raw frames",
      action: "Open scanner",
      status: "Delegated scanner mode distinguishes scanner handoff from app-owned camera permission.",
      tone: "safe"
    },
    permission: {
      chip: "Permission",
      title: "Camera access is requested for scanning",
      scanner: "Camera prompt pending",
      payload: "No decoded value",
      validation: "Waiting for permission",
      fallback: "Choose image",
      privacy: "Only code frames analyzed",
      action: "Allow camera",
      status: "Permission is one step in the QR scan lifecycle, with image and manual fallbacks ready.",
      tone: "neutral"
    },
    cameraReady: {
      chip: "Camera ready",
      title: "Scanner is active and waiting",
      scanner: "Rear camera active",
      payload: "No QR found",
      validation: "Looking for qr_code",
      fallback: "Paste code",
      privacy: "No frames saved",
      action: "Stop scan",
      status: "Active camera, expected format, and stop control stay visible while scanning.",
      tone: "safe",
      scanning: true
    },
    aimGuide: {
      chip: "Aim guide",
      title: "Align the whole code inside the guide",
      scanner: "Target box visible",
      payload: "Corners not locked",
      validation: "Move closer",
      fallback: "Upload photo",
      privacy: "Local frame analysis",
      action: "Hold steady",
      status: "The scanner gives visual and text guidance instead of a silent camera view.",
      tone: "safe",
      scanning: true
    },
    torch: {
      chip: "Torch",
      title: "Low light exposes a torch control",
      scanner: "Rear camera with torch",
      payload: "Code partly visible",
      validation: "Contrast too low",
      fallback: "Choose brighter photo",
      privacy: "No frame retained",
      action: "Turn torch on",
      status: "Lighting repair is a first-class scanner action.",
      tone: "warn",
      scanning: true
    },
    focus: {
      chip: "Focus",
      title: "The scanner explains blur and distance",
      scanner: "Autofocus searching",
      payload: "Raw value unreadable",
      validation: "Hold steady",
      fallback: "Manual key",
      privacy: "Temporary frame only",
      action: "Try again",
      status: "Focus and distance guidance helps users repair a failed decode.",
      tone: "warn",
      scanning: true
    },
    lowLight: {
      chip: "Low light",
      title: "Dim scan conditions are named",
      scanner: "Preview too dark",
      payload: "No stable code",
      validation: "Need more contrast",
      fallback: "Scan from photo",
      privacy: "No decoded secret",
      action: "Improve light",
      status: "The state separates low light from unsupported, invalid, or expired payloads.",
      tone: "warn",
      scanning: true
    },
    noCode: {
      chip: "No code",
      title: "No QR code found in frame",
      scanner: "Camera active",
      payload: "Nothing detected",
      validation: "Still scanning",
      fallback: "Enter code",
      privacy: "No payload collected",
      action: "Move code into view",
      status: "No-code feedback keeps users oriented while the detector waits.",
      tone: "neutral",
      scanning: true
    },
    multipleCodes: {
      chip: "Multiple codes",
      title: "Select the intended code before action",
      scanner: "Two codes detected",
      payload: "Device TH-204 highlighted",
      validation: "Neighbor code ignored",
      fallback: "Tap target code",
      privacy: "Only selected value used",
      action: "Use highlighted code",
      status: "Multiple-code handling prevents the scanner from executing the first decoded value by accident.",
      tone: "warn",
      variant: "found",
      scanning: true
    },
    decoding: {
      chip: "Decoding",
      title: "Detected code is being parsed",
      scanner: "Corners locked",
      payload: "Reading payload",
      validation: "Checking expected type",
      fallback: "Stop scan",
      privacy: "Raw value not shown yet",
      action: "Wait",
      status: "Decoding is distinct from camera active and from validated payload.",
      tone: "neutral",
      variant: "found",
      scanning: true
    },
    decodedPreview: {
      chip: "Decoded",
      title: "Decoded payload is previewed before action",
      scanner: "Scan complete",
      payload: "Pair thermostat TH-204",
      validation: "Trusted setup domain",
      fallback: "Scan another code",
      privacy: "Token hidden after pairing",
      action: "Pair device",
      status: "The decoded summary is visible before pairing, opening, importing, or submitting.",
      tone: "safe",
      variant: "found"
    },
    unsafeUrl: {
      chip: "Unsafe URL",
      title: "Suspicious destination needs review",
      scanner: "Scan complete",
      payload: "paypaI.example/login",
      validation: "Lookalike domain warning",
      fallback: "Cancel scan",
      privacy: "URL not opened",
      action: "Review warning",
      status: "Unsafe QR payloads move to a warning before navigation or credential entry.",
      tone: "warn",
      variant: "warning"
    },
    expiredPayload: {
      chip: "Expired",
      title: "Expired payload is explained immediately",
      scanner: "Ticket code read",
      payload: "Ticket EVT-8821",
      validation: "Expired 14 minutes ago",
      fallback: "Request new code",
      privacy: "Expired value discarded",
      action: "Get new QR",
      status: "Expiry is separated from camera failure so users know the code, not the scanner, failed.",
      tone: "warn",
      variant: "warning"
    },
    duplicateScan: {
      chip: "Duplicate",
      title: "Repeated scans do not repeat the action",
      scanner: "Same code seen again",
      payload: "Pallet A-119",
      validation: "Already attached",
      fallback: "Scan next label",
      privacy: "One event logged",
      action: "Continue",
      status: "Duplicate detection prevents repeated payments, imports, or inventory actions.",
      tone: "neutral",
      variant: "found"
    },
    scanFromPhoto: {
      chip: "Photo fallback",
      title: "Existing image can be decoded",
      scanner: "Camera not required",
      payload: "QR from uploaded photo",
      validation: "Format supported",
      fallback: "Paste code",
      privacy: "Image removed after decode",
      action: "Choose photo",
      status: "Scan from photo is a fallback for decoding, not a normal file upload workflow.",
      tone: "safe"
    },
    manualCode: {
      chip: "Manual code",
      title: "Manual entry keeps the task completeable",
      scanner: "No camera path",
      payload: "12-character pairing key",
      validation: "Checksum on paste",
      fallback: "Try camera again",
      privacy: "No camera access",
      action: "Paste key",
      status: "Manual code entry is available when camera, detector, or image scanning fails.",
      tone: "safe"
    },
    success: {
      chip: "Success",
      title: "QR action completed after confirmation",
      scanner: "Camera stopped",
      payload: "Device TH-204 paired",
      validation: "Token accepted",
      fallback: "Scan another device",
      privacy: "Secret cleared",
      action: "Done",
      status: "Success confirms the decoded result and cleanup, not just that a frame was seen.",
      tone: "safe",
      variant: "found"
    },
    cleanup: {
      chip: "Cleanup",
      title: "Cancel clears frames and raw values",
      scanner: "Stream stopped",
      payload: "No decoded value retained",
      validation: "Task canceled",
      fallback: "Start again",
      privacy: "Frames and secrets cleared",
      action: "Return",
      status: "Scanner cleanup covers camera stream, temporary frames, decoded raw payload, and secret values.",
      tone: "safe"
    },
    offlineValidation: {
      chip: "Offline",
      title: "Offline decode is separated from validation",
      scanner: "Local decode available",
      payload: "Ticket ID read",
      validation: "Server check pending",
      fallback: "Save for later",
      privacy: "Stored locally until online",
      action: "Retry validation",
      status: "The scanner can decode locally while explaining that network validation is still pending.",
      tone: "neutral",
      variant: "found"
    }
  };
  const item = config[mode];
  const titleId = `qr-scan-title-${idSuffix}`;
  const descId = `qr-scan-desc-${idSuffix}`;

  return (
    <section className={`qr-scan-shell is-${item.tone ?? "neutral"} ${item.scanning ? "is-scanning" : ""}`} aria-labelledby={titleId} aria-describedby={descId}>
      <header className="qr-scan-header">
        <div>
          <span>{item.chip}</span>
          <strong id={titleId}>{item.title}</strong>
        </div>
        <button type="button" className="qr-scan-action">{item.action}</button>
      </header>
      <div className="qr-scan-stage" id={descId}>
        <div className="qr-scan-viewfinder" aria-label="QR scanner preview">
          <QrGlyph variant={item.variant ?? "target"} />
          <b>{item.scanning ? "Scanner active" : "Scanner idle"}</b>
        </div>
        <div className="qr-scan-details">
          <div><span>Scanner</span><strong>{item.scanner}</strong></div>
          <div><span>Payload</span><strong>{item.payload}</strong></div>
          <div><span>Validation</span><strong>{item.validation}</strong></div>
          <div><span>Fallback</span><strong>{item.fallback}</strong></div>
          <div><span>Privacy</span><strong>{item.privacy}</strong></div>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{item.status}</p>
    </section>
  );
}

function QrScanGoodUi() {
  return (
    <div className="quality-example qr-scan-demo">
      <QrScanPanel mode="decodedPreview" idSuffix="good-ui" />
    </div>
  );
}

function QrScanBadUi() {
  return (
    <div className="bad-ui-sample qr-scan-bad-ui">
      <section className="qr-scan-shell bad" aria-label="Broken QR scan interface">
        <header className="qr-scan-header">
          <div>
            <span>QR scanner</span>
            <strong>Opening detected link</strong>
          </div>
          <button type="button" className="qr-scan-action danger">Open now</button>
        </header>
        <p>The scanner follows the first decoded QR URL immediately, hides the destination, provides no manual code path, and keeps the camera running after cancel.</p>
        <div className="qr-scan-details compact">
          <div><span>Detection</span><strong>First code wins</strong></div>
          <div><span>Preview</span><strong>Skipped</strong></div>
          <div><span>Fallback</span><strong>Camera only</strong></div>
          <div><span>Cleanup</span><strong>Frame retained</strong></div>
        </div>
      </section>
      <p className="demo-status">The broken UI treats decoding as permission to act, which is unsafe for links, payments, pairing, and secrets.</p>
    </div>
  );
}

function QrScanGoodUx() {
  const [mode, setMode] = useState<QrScanMode>("preScan");

  return (
    <div className="quality-example qr-scan-demo">
      <div className="demo-row qr-scan-controls" aria-label="QR scan exercise controls">
        {qrScanGoodLabels.map(([key, label]) => (
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
      <QrScanPanel mode={mode} idSuffix="good-ux" />
      <p className="demo-status" aria-live="polite">QR scan state: {qrScanGoodLabels.find(([key]) => key === mode)?.[1]}.</p>
    </div>
  );
}

function QrScanBadUx() {
  const [mode, setMode] = useState<QrScanBadMode>("autoOpenUrl");
  const copy: Record<QrScanBadMode, { title: string; body: string; consequence: string; metric: string }> = {
    autoOpenUrl: {
      title: "Auto-open URL",
      body: "The scanner opens a decoded URL immediately, before showing the domain, scheme, action, or external-site warning.",
      consequence: "A malicious or lookalike QR code can move users into a risky flow without review.",
      metric: "No destination review"
    },
    cameraOnlyDeadEnd: {
      title: "Camera-only dead end",
      body: "Camera permission denial leaves a black scanner surface even though paste code or scan from photo would finish setup.",
      consequence: "The scan task fails because the camera path is treated as mandatory.",
      metric: "No fallback"
    },
    wrongCodeSelected: {
      title: "Wrong code selected",
      body: "The frame contains a device QR and a Wi-Fi QR, but the app executes whichever code decodes first.",
      consequence: "Users can pair, pay, or open the wrong target without seeing the selected code.",
      metric: "First decode wins"
    },
    spinnerNoGuidance: {
      title: "Spinner only",
      body: "Low light, blur, glare, and small print all show one spinner with no torch, focus, distance, or photo fallback guidance.",
      consequence: "Users cannot repair the scan because the failure mode is hidden.",
      metric: "No repair cues"
    },
    noPayloadPreview: {
      title: "No payload preview",
      body: "A payment QR jumps from scanned to submitted without showing merchant, amount, account, expiry, or confirmation.",
      consequence: "Consequential decoded values are acted on before users can verify them.",
      metric: "Confirmation skipped"
    },
    secretRetained: {
      title: "Secret retained",
      body: "An authenticator QR seed remains visible in recent scan history and debug logs after enrollment.",
      consequence: "Sensitive setup material survives after it should have been cleared.",
      metric: "Secret in history"
    },
    repeatedAction: {
      title: "Repeated action",
      body: "The scanner keeps detecting the same ticket code and submits the same redeem action on every frame.",
      consequence: "Repeated detections create duplicate actions and confusing failures.",
      metric: "No duplicate guard"
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example qr-scan-bad-ux is-${mode}`}>
      <div className="demo-row qr-scan-controls" aria-label="QR scan misuse controls">
        {qrScanBadLabels.map(([key, label]) => (
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
      <section className="qr-scan-shell bad" aria-label={`QR scan failure: ${item.title}`}>
        <header className="qr-scan-header">
          <div>
            <span>{item.title}</span>
            <strong>{item.metric}</strong>
          </div>
          <button type="button" className="qr-scan-action danger">Continue</button>
        </header>
        <p>{item.body}</p>
        <div className="qr-scan-details compact">
          <div><span>State</span><strong>{mode === "spinnerNoGuidance" ? "Unclear" : "Rushed"}</strong></div>
          <div><span>Payload</span><strong>{mode === "noPayloadPreview" || mode === "autoOpenUrl" ? "Hidden" : "Weak"}</strong></div>
          <div><span>Fallback</span><strong>{mode === "cameraOnlyDeadEnd" ? "Missing" : "Not enough"}</strong></div>
          <div><span>Cleanup</span><strong>{mode === "secretRetained" ? "Broken" : "Unproven"}</strong></div>
        </div>
      </section>
      <p className="demo-status" aria-live="polite">{item.consequence}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <QrScanGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <QrScanBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <QrScanGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <QrScanBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
