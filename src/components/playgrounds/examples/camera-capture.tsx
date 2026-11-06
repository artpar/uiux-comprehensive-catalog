import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type CameraCaptureMode =
  | "unsupported"
  | "permission"
  | "preview"
  | "switchCamera"
  | "framing"
  | "lowLight"
  | "blur"
  | "capture"
  | "review"
  | "retake"
  | "crop"
  | "uploadFallback"
  | "denied"
  | "uploadPending"
  | "uploadFailed"
  | "saved"
  | "cancelCleanup"
  | "sensitive";

type CameraCaptureBadMode =
  | "autoStart"
  | "noIndicator"
  | "instantUpload"
  | "noFallback"
  | "streamLeak"
  | "wrongCamera"
  | "noReview"
  | "storedAfterCancel";

const cameraCaptureGoodLabels: Array<[CameraCaptureMode, string]> = [
  ["unsupported", "Unsupported"],
  ["permission", "Permission"],
  ["preview", "Live preview"],
  ["switchCamera", "Switch camera"],
  ["framing", "Framing guide"],
  ["lowLight", "Low light"],
  ["blur", "Blur warning"],
  ["capture", "Capture"],
  ["review", "Review"],
  ["retake", "Retake"],
  ["crop", "Crop"],
  ["uploadFallback", "Upload fallback"],
  ["denied", "Denied permission"],
  ["uploadPending", "Upload pending"],
  ["uploadFailed", "Upload failed"],
  ["saved", "Saved"],
  ["cancelCleanup", "Cancel cleanup"],
  ["sensitive", "Sensitive capture"]
];

const cameraCaptureBadLabels: Array<[CameraCaptureBadMode, string]> = [
  ["autoStart", "Auto start"],
  ["noIndicator", "No indicator"],
  ["instantUpload", "Instant upload"],
  ["noFallback", "No fallback"],
  ["streamLeak", "Stream leak"],
  ["wrongCamera", "Wrong camera"],
  ["noReview", "No review"],
  ["storedAfterCancel", "Stored after cancel"]
];

function CameraCapturePanel({ mode, idSuffix }: { mode: CameraCaptureMode; idSuffix: string }) {
  const config: Record<CameraCaptureMode, {
    chip: string;
    title: string;
    camera: string;
    frame: string;
    quality: string;
    result: string;
    next: string;
    fallback: string;
    privacy: string;
    status: string;
    tone?: "safe" | "warn" | "neutral";
    captured?: boolean;
  }> = {
    unsupported: {
      chip: "Unsupported",
      title: "Camera unavailable, upload remains available",
      camera: "No compatible camera API",
      frame: "No live preview",
      quality: "Cannot evaluate camera image",
      result: "No capture created",
      next: "Choose upload file",
      fallback: "Upload receipt or enter details manually",
      privacy: "No stream requested",
      status: "Unsupported camera state keeps the task completeable without camera access.",
      tone: "neutral"
    },
    permission: {
      chip: "Permission",
      title: "Ask only after Scan receipt",
      camera: "Rear camera requested",
      frame: "Receipt target explained",
      quality: "Purpose before permission",
      result: "Awaiting user choice",
      next: "Allow camera or upload file",
      fallback: "Use saved image",
      privacy: "Camera used only for this claim",
      status: "The permission request is contextual and not triggered by page load.",
      tone: "safe"
    },
    preview: {
      chip: "Live preview",
      title: "Active preview names the camera",
      camera: "Back camera active",
      frame: "Receipt edges inside guide",
      quality: "Ready",
      result: "Stream active, no file yet",
      next: "Capture receipt",
      fallback: "Stop camera or upload",
      privacy: "Active camera indicator shown",
      status: "Users can see the stream, framing guide, and stop control before capture.",
      tone: "safe"
    },
    switchCamera: {
      chip: "Switch camera",
      title: "Device choice is visible",
      camera: "Front camera -> Back camera",
      frame: "Guide rotates with device",
      quality: "Facing mode changed",
      result: "Preview updated",
      next: "Use rear camera",
      fallback: "Keep current camera",
      privacy: "Same permission scope",
      status: "Switching cameras does not discard the task or start another hidden stream."
    },
    framing: {
      chip: "Framing guide",
      title: "The subject must fit the guide",
      camera: "Back camera active",
      frame: "All four receipt corners visible",
      quality: "Edges detected",
      result: "Ready to capture",
      next: "Hold steady",
      fallback: "Upload instead",
      privacy: "Background cropped out in review",
      status: "Framing guidance matches the evidence users need to capture.",
      tone: "safe"
    },
    lowLight: {
      chip: "Low light",
      title: "Quality feedback appears before upload",
      camera: "Back camera active",
      frame: "Receipt visible but dim",
      quality: "Low light warning",
      result: "Capture allowed with warning",
      next: "Move to brighter area",
      fallback: "Use flash or upload file",
      privacy: "No upload yet",
      status: "Low-light feedback gives users a repair path before final submit.",
      tone: "warn"
    },
    blur: {
      chip: "Blur warning",
      title: "Blurry capture is repairable",
      camera: "Back camera active",
      frame: "Text not sharp",
      quality: "Blur detected",
      result: "Review blocked",
      next: "Retake",
      fallback: "Upload clearer image",
      privacy: "Unsaved frame can be discarded",
      status: "Blur is detected in review, not after the whole claim is submitted.",
      tone: "warn",
      captured: true
    },
    capture: {
      chip: "Capture",
      title: "Shutter freezes the preview",
      camera: "Back camera active",
      frame: "Receipt centered",
      quality: "Sharp enough",
      result: "Frozen captured frame",
      next: "Review capture",
      fallback: "Retake or upload",
      privacy: "Stream pauses during review",
      status: "Capture creates a reviewable media object without uploading it immediately.",
      captured: true
    },
    review: {
      chip: "Review",
      title: "Captured media is checked before attach",
      camera: "Stream paused",
      frame: "Crop shows full receipt",
      quality: "Readable merchant, date, total",
      result: "Receipt-1042.jpg",
      next: "Attach to claim",
      fallback: "Retake, crop, or replace",
      privacy: "Only reviewed image will be saved",
      status: "Review separates acquisition from final upload.",
      tone: "safe",
      captured: true
    },
    retake: {
      chip: "Retake",
      title: "Retake keeps the task context",
      camera: "Back camera resumes",
      frame: "Previous image discarded after choice",
      quality: "New preview ready",
      result: "Old capture not submitted",
      next: "Capture again",
      fallback: "Keep previous capture",
      privacy: "Discard decision visible",
      status: "Retake is deliberate and does not silently erase submitted evidence."
    },
    crop: {
      chip: "Crop",
      title: "Crop repairs background and edges",
      camera: "Stream paused",
      frame: "Adjustable crop handles",
      quality: "Receipt edges inside crop",
      result: "Cropped preview",
      next: "Apply crop",
      fallback: "Reset crop",
      privacy: "Private background excluded",
      status: "Editing happens in review, before the captured image is attached.",
      captured: true
    },
    uploadFallback: {
      chip: "Upload fallback",
      title: "Existing image path stays equal",
      camera: "Camera not required",
      frame: "File preview replaces camera",
      quality: "Same validation rules",
      result: "receipt-upload.png",
      next: "Review uploaded image",
      fallback: "Manual entry",
      privacy: "No live stream",
      status: "Upload fallback completes the same task when camera use is not possible.",
      tone: "safe",
      captured: true
    },
    denied: {
      chip: "Denied",
      title: "Denied permission does not dead-end",
      camera: "Permission denied",
      frame: "No preview",
      quality: "Cannot inspect camera",
      result: "No capture",
      next: "Upload file or open settings",
      fallback: "Manual receipt details",
      privacy: "No media captured",
      status: "The workflow remains completeable after camera denial.",
      tone: "neutral"
    },
    uploadPending: {
      chip: "Upload pending",
      title: "Attach state reports progress",
      camera: "Stream stopped",
      frame: "Reviewed capture locked",
      quality: "Validated",
      result: "Uploading 64%",
      next: "Keep page open",
      fallback: "Cancel upload",
      privacy: "Only reviewed file uploads",
      status: "Upload is separate from camera preview and reports progress.",
      captured: true
    },
    uploadFailed: {
      chip: "Upload failed",
      title: "Failed upload preserves capture",
      camera: "Stream stopped",
      frame: "Captured receipt retained locally",
      quality: "Valid image",
      result: "Network error",
      next: "Retry upload",
      fallback: "Download or replace",
      privacy: "No duplicate upload",
      status: "Failure keeps the reviewed capture and offers retry without reopening the camera.",
      tone: "warn",
      captured: true
    },
    saved: {
      chip: "Saved",
      title: "Attached media has a receipt",
      camera: "Stream stopped",
      frame: "Thumbnail attached",
      quality: "Accepted",
      result: "Attached to EXP-1042",
      next: "Continue claim",
      fallback: "Replace image",
      privacy: "Retention notice available",
      status: "The saved state confirms the target record and stops capture resources.",
      tone: "safe",
      captured: true
    },
    cancelCleanup: {
      chip: "Cancel cleanup",
      title: "Cancel discards unsaved media and stops stream",
      camera: "All tracks stopped",
      frame: "Preview cleared",
      quality: "No pending capture",
      result: "Unsaved image discarded",
      next: "Return to claim",
      fallback: "Start again",
      privacy: "No thumbnail retained",
      status: "Stream cleanup is visible after cancel, close, or route change.",
      tone: "safe"
    },
    sensitive: {
      chip: "Sensitive",
      title: "Private content gets extra handling",
      camera: "Back camera active",
      frame: "ID edges inside guide",
      quality: "Glare and crop checked",
      result: "Masked review required",
      next: "Redact ID number",
      fallback: "Assisted upload",
      privacy: "Purpose and retention shown",
      status: "Sensitive captures add retention, redaction, and non-camera alternatives before submission.",
      tone: "warn",
      captured: true
    }
  };
  const item = config[mode];
  const titleId = `camera-capture-title-${idSuffix}`;
  const descId = `camera-capture-desc-${idSuffix}`;

  return (
    <section className={`camera-capture-shell is-${item.tone ?? "standard"} ${item.captured ? "has-capture" : ""}`} aria-labelledby={titleId} aria-describedby={descId}>
      <header className="camera-capture-header">
        <div>
          <span>{item.chip}</span>
          <strong id={titleId}>{item.title}</strong>
        </div>
        <button type="button" className="camera-capture-shutter">{item.captured ? "Review" : "Capture"}</button>
      </header>
      <div className="camera-capture-preview" id={descId} aria-label="Camera capture preview">
        <div className="camera-capture-frame">
          <span></span>
          <strong>{item.captured ? "Frozen capture" : "Live preview"}</strong>
        </div>
        <div className="camera-capture-indicator">
          <span>{item.camera}</span>
          <b>{mode === "preview" || mode === "framing" || mode === "lowLight" || mode === "switchCamera" || mode === "sensitive" ? "Camera active" : "Camera inactive"}</b>
        </div>
      </div>
      <div className="camera-capture-grid">
        <div><span>Framing</span><strong>{item.frame}</strong></div>
        <div><span>Quality</span><strong>{item.quality}</strong></div>
        <div><span>Result</span><strong>{item.result}</strong></div>
        <div><span>Next step</span><strong>{item.next}</strong></div>
        <div><span>Fallback</span><strong>{item.fallback}</strong></div>
        <div><span>Privacy</span><strong>{item.privacy}</strong></div>
      </div>
      <p className="demo-status">{item.status}</p>
    </section>
  );
}

function CameraCaptureGoodUi() {
  return (
    <div className="quality-example camera-capture-demo">
      <CameraCapturePanel mode="review" idSuffix="good-ui" />
    </div>
  );
}

function CameraCaptureBadUi() {
  return (
    <div className="bad-ui-sample camera-capture-bad-ui">
      <section className="camera-capture-shell bad" aria-label="Broken camera capture interface">
        <header className="camera-capture-header">
          <div>
            <span>Auto camera</span>
            <strong>Stream starts before intent</strong>
          </div>
          <button type="button" className="camera-capture-shutter danger">Upload now</button>
        </header>
        <p>The page opens the camera on load, hides the active-stream indicator, uses the front camera for a receipt, and uploads the shutter frame without review, retake, crop, or upload fallback.</p>
        <div className="camera-capture-grid">
          <div><span>Permission</span><strong>Requested on load</strong></div>
          <div><span>Preview</span><strong>No active indicator</strong></div>
          <div><span>Review</span><strong>Skipped</strong></div>
          <div><span>Cleanup</span><strong>Stream still active</strong></div>
        </div>
      </section>
      <p className="demo-status">The broken UI turns camera capture into hidden surveillance and irreversible upload.</p>
    </div>
  );
}

function CameraCaptureGoodUx() {
  const [mode, setMode] = useState<CameraCaptureMode>("permission");
  return (
    <div className="quality-example camera-capture-demo">
      <div className="demo-row camera-capture-controls" aria-label="Camera capture exercise controls">
        {cameraCaptureGoodLabels.map(([key, label]) => (
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
      <CameraCapturePanel mode={mode} idSuffix="good-ux" />
      <p className="demo-status" aria-live="polite">Camera capture state: {cameraCaptureGoodLabels.find(([key]) => key === mode)?.[1]}.</p>
    </div>
  );
}

function CameraCaptureBadUx() {
  const [mode, setMode] = useState<CameraCaptureBadMode>("autoStart");
  const copy: Record<CameraCaptureBadMode, { title: string; body: string; consequence: string; metric: string }> = {
    autoStart: {
      title: "Auto start",
      body: "The route asks for camera access as soon as it loads, before users choose Scan receipt or see the purpose.",
      consequence: "Camera access feels invasive and users cannot avoid the prompt.",
      metric: "Permission on load"
    },
    noIndicator: {
      title: "No indicator",
      body: "A live preview appears without active camera status, selected device, timer, or stop control.",
      consequence: "Users cannot tell whether capture is active or how to stop it.",
      metric: "Hidden stream"
    },
    instantUpload: {
      title: "Instant upload",
      body: "The shutter immediately uploads a blurry receipt to the claim with no frozen preview or retake.",
      consequence: "Bad media becomes official evidence before review.",
      metric: "No review gate"
    },
    noFallback: {
      title: "No fallback",
      body: "Denied camera permission leaves only a blank panel, even though upload or manual receipt entry would work.",
      consequence: "Camera denial blocks the task.",
      metric: "Dead end"
    },
    streamLeak: {
      title: "Stream leak",
      body: "The user closes the capture sheet, but the camera track remains active and the browser indicator stays on.",
      consequence: "Capture continues outside the visible task.",
      metric: "Track not stopped"
    },
    wrongCamera: {
      title: "Wrong camera",
      body: "The receipt scanner opens the front camera, hides switch-camera, and mirrors text so totals are unreadable.",
      consequence: "Users capture the wrong thing with no repair control.",
      metric: "Facing mode wrong"
    },
    noReview: {
      title: "No review",
      body: "The app accepts a cropped ID image without showing the captured frame, crop handles, or sensitive-data notice.",
      consequence: "Private evidence is submitted without a chance to inspect it.",
      metric: "Review absent"
    },
    storedAfterCancel: {
      title: "Stored after cancel",
      body: "After cancel, the thumbnail remains in recent captures and raw EXIF metadata is retained.",
      consequence: "Sensitive media survives a user discard action.",
      metric: "Retained after cancel"
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example camera-capture-bad-ux is-${mode}`}>
      <div className="demo-row camera-capture-controls" aria-label="Camera capture misuse controls">
        {cameraCaptureBadLabels.map(([key, label]) => (
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
      <section className="camera-capture-shell bad" aria-label={`Camera capture failure: ${item.title}`}>
        <header className="camera-capture-header">
          <div>
            <span>{item.title}</span>
            <strong>{item.metric}</strong>
          </div>
          <button type="button" className="camera-capture-shutter danger">Upload</button>
        </header>
        <p>{item.body}</p>
        <div className="camera-capture-grid">
          <div><span>Permission</span><strong>{mode === "autoStart" ? "Too early" : "Unclear"}</strong></div>
          <div><span>Preview</span><strong>{mode === "noIndicator" || mode === "streamLeak" ? "Unsafe" : "Unreviewed"}</strong></div>
          <div><span>Fallback</span><strong>{mode === "noFallback" ? "Missing" : "Weak"}</strong></div>
          <div><span>Cleanup</span><strong>{mode === "streamLeak" || mode === "storedAfterCancel" ? "Broken" : "Not proven"}</strong></div>
        </div>
      </section>
      <p className="demo-status" aria-live="polite">{item.consequence}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CameraCaptureGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CameraCaptureBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CameraCaptureGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CameraCaptureBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
