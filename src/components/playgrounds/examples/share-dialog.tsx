import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type ShareDialogMode = "people" | "link" | "role" | "notify" | "copy" | "external" | "expire" | "blockDownload" | "nativeShare" | "stop";

const shareDialogCopy: Record<ShareDialogMode, {
  banner: string;
  scope: string;
  role: string;
  notify: string;
  link: string;
  detail: string;
  warning: string;
}> = {
  people: {
    banner: "2 people will receive Viewer access",
    scope: "Restricted",
    role: "Viewer",
    notify: "Notify people",
    link: "Copy restricted link",
    detail: "maya.finance@example.com and Rahul Patel are resolved before Send is enabled.",
    warning: "Only selected people can open this report."
  },
  link: {
    banner: "Link scope changed to organization",
    scope: "Aster Finance",
    role: "Viewer",
    notify: "Notify people",
    link: "Copy organization link",
    detail: "Anyone in Aster Finance with the link can view; external addresses still need direct access.",
    warning: "This is broader than restricted sharing."
  },
  role: {
    banner: "Editor role requires review",
    scope: "Restricted",
    role: "Editor",
    notify: "Notify people",
    link: "Copy restricted editor link",
    detail: "Editors can change the report, comment, and invite others unless owner settings block resharing.",
    warning: "Review editor access before sending."
  },
  notify: {
    banner: "Notification message ready",
    scope: "Restricted",
    role: "Commenter",
    notify: "Email with message",
    link: "Copy restricted link",
    detail: "The note says: Please review the forecast assumptions before Friday.",
    warning: "Recipients are told why they were added."
  },
  copy: {
    banner: "Copied link matches visible access",
    scope: "Restricted",
    role: "Viewer",
    notify: "No email sent",
    link: "Copied",
    detail: "The copied URL stays restricted; people without access still see the request-access path.",
    warning: "Copy link did not widen access."
  },
  external: {
    banner: "External recipient needs approval",
    scope: "Restricted",
    role: "Viewer",
    notify: "Notify after approval",
    link: "Copy internal link",
    detail: "alex.vendor@example.net is outside Aster Finance and waits for policy approval.",
    warning: "External sharing crosses the organization boundary."
  },
  expire: {
    banner: "Access expires on Jul 12",
    scope: "Specific people",
    role: "Viewer",
    notify: "Notify people",
    link: "Copy expiring link",
    detail: "The share summary states that vendor access ends automatically on Jul 12, 2026.",
    warning: "Expiration is visible before send."
  },
  blockDownload: {
    banner: "Download and copy are blocked",
    scope: "Restricted",
    role: "Viewer",
    notify: "Notify people",
    link: "Copy protected link",
    detail: "Viewers can open the report but cannot download, print, or copy protected sections.",
    warning: "Protection is shown beside the role."
  },
  nativeShare: {
    banner: "Native share uses current access",
    scope: "Restricted",
    role: "Viewer",
    notify: "Device target only",
    link: "Open native share",
    detail: "The system share sheet can send the link to Messages or Mail, but product access remains restricted.",
    warning: "Native share distributes; it does not grant new permission."
  },
  stop: {
    banner: "Stop sharing review",
    scope: "No link",
    role: "Owner only",
    notify: "No new email",
    link: "Link disabled",
    detail: "The access list shows two people and one organization link will lose access after confirmation.",
    warning: "Revocation summarizes affected access before applying."
  }
};

function ShareDialogFrame({
  mode = "people",
  idSuffix = "demo"
}: {
  mode?: ShareDialogMode;
  idSuffix?: string;
}) {
  const copy = shareDialogCopy[mode];
  const titleId = `share-dialog-title-${idSuffix}`;
  const external = mode === "external";
  const stop = mode === "stop";
  const nativeShare = mode === "nativeShare";
  const blockDownload = mode === "blockDownload";
  return (
    <div className={`share-dialog-frame share-dialog-surface is-${mode}`}>
      <section className="share-dialog-panel" aria-labelledby={titleId}>
        <div className="share-dialog-header">
          <span>Quarterly report.pdf</span>
          <strong>{copy.banner}</strong>
        </div>
        <h4 id={titleId}>Share Quarterly report</h4>
        <div className="share-dialog-recipient-row">
          <span className="share-dialog-chip">maya.finance@example.com</span>
          <span className="share-dialog-chip">Rahul Patel</span>
          {external ? <span className="share-dialog-chip is-external">alex.vendor@example.net</span> : null}
          <button type="button" className="demo-button small">Add people</button>
        </div>
        <div className="share-dialog-grid">
          <label>
            <span>Role</span>
            <strong>{copy.role}</strong>
          </label>
          <label>
            <span>Link scope</span>
            <strong>{copy.scope}</strong>
          </label>
          <label>
            <span>Delivery</span>
            <strong>{copy.notify}</strong>
          </label>
          <label>
            <span>Link action</span>
            <strong>{copy.link}</strong>
          </label>
        </div>
        <div className="share-dialog-message">
          <span>Message</span>
          <p>{mode === "notify" ? "Please review the forecast assumptions before Friday." : "The message field is optional and does not change access."}</p>
        </div>
        <div className="share-dialog-actions">
          <button type="button" className="demo-button small">Manage access</button>
          <button type="button" className="demo-button small">{nativeShare ? "Native share" : "Copy link"}</button>
          <button type="button" className="demo-button small primary">{stop ? "Stop sharing" : "Send"}</button>
        </div>
      </section>
      <aside className="share-dialog-access" aria-label="Share dialog access summary">
        <div className="share-dialog-access-card">
          <span>{external ? "Policy warning" : stop ? "Removal review" : nativeShare ? "Device share" : "Access summary"}</span>
          <strong>{copy.warning}</strong>
          <p>{copy.detail}</p>
        </div>
        <div className="share-dialog-access-list">
          <div>
            <b>Current access</b>
            <span>Owner: Priya Shah</span>
          </div>
          <div>
            <b>Finance group</b>
            <span>{stop ? "Will lose link access" : "Viewer via restricted link"}</span>
          </div>
          <div>
            <b>Advanced</b>
            <span>{blockDownload ? "Download blocked" : mode === "expire" ? "Expires Jul 12" : "Editors cannot reshare"}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}

function ShareDialogGoodUi() {
  return (
    <div className="quality-example share-dialog-demo">
      <ShareDialogFrame />
      <p className="demo-status">The dialog names the object, resolves recipients, shows role and link scope, keeps copy-link separate from Send, and keeps manage-access controls visible.</p>
    </div>
  );
}

function ShareDialogBadUi() {
  return (
    <div className="bad-ui-sample share-dialog-bad-demo is-publicDefault">
      <strong>Share</strong>
      <div className="share-dialog-bad-box">
        <span>Paste email or copy link</span>
        <button type="button" className="demo-button small primary">Share now</button>
      </div>
      <p className="demo-status">The broken dialog hides the object, current access, link scope, role, notification behavior, and revoke path.</p>
    </div>
  );
}

function ShareDialogGoodUx() {
  const [mode, setMode] = useState<ShareDialogMode>("people");
  const [message, setMessage] = useState("Recipients are resolved before Send, and the visible role is Viewer.");
  function choose(nextMode: ShareDialogMode, nextMessage: string) {
    setMode(nextMode);
    setMessage(nextMessage);
  }
  return (
    <div className="quality-example share-dialog-demo">
      <ShareDialogFrame mode={mode} idSuffix="good-ux" />
      <div className="demo-row share-dialog-controls" aria-label="Share dialog exercise controls">
        <button type="button" className={mode === "people" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("people", "Recipients are resolved before Send, and the visible role is Viewer.")}>People</button>
        <button type="button" className={mode === "link" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("link", "Link scope changes from restricted to organization and the broader exposure is labelled.")}>Link scope</button>
        <button type="button" className={mode === "role" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("role", "Editor role is separated from Viewer and requires review before sending.")}>Role</button>
        <button type="button" className={mode === "notify" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("notify", "Notification state shows that an email and message will be sent.")}>Notify</button>
        <button type="button" className={mode === "copy" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("copy", "Copy link confirms that the copied URL matches the visible restricted access.")}>Copy link</button>
        <button type="button" className={mode === "external" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("external", "External recipients show policy approval before access is granted.")}>External</button>
        <button type="button" className={mode === "expire" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("expire", "Expiration is summarized before vendor access is sent.")}>Expire</button>
        <button type="button" className={mode === "blockDownload" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("blockDownload", "Block download is shown beside role so users know what Viewer can do.")}>Block download</button>
        <button type="button" className={mode === "nativeShare" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("nativeShare", "Native share sends through device targets while product permissions stay visible.")}>Native share</button>
        <button type="button" className={mode === "stop" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("stop", "Stop sharing summarizes who loses access and disables the link only after confirmation.")}>Stop sharing</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function ShareDialogBadUx() {
  type Mode = "publicDefault" | "hiddenRole" | "noWarning" | "copyMismatch" | "noRevoke" | "nativeOnly";
  const [mode, setMode] = useState<Mode>("publicDefault");
  const copy: Record<Mode, string> = {
    publicDefault: "The first click creates an anyone-with-link editor URL without review.",
    hiddenRole: "Recipients are added without saying whether they can view, comment, edit, or reshare.",
    noWarning: "External domains look the same as internal teammates, so policy risk is invisible.",
    copyMismatch: "The button says restricted, but the copied URL is an organization-wide link.",
    noRevoke: "The dialog can add people but gives no path to remove access or delete the link.",
    nativeOnly: "The native share sheet sends a private URL without granting product access."
  };
  const cells: Record<Mode, string[]> = {
    publicDefault: ["Anyone", "Can edit", "No review"],
    hiddenRole: ["maya@", "rahul@", "sent"],
    noWarning: ["vendor.net", "internal style", "no policy"],
    copyMismatch: ["Restricted label", "Org link copied", "Recipient confused"],
    noRevoke: ["Add people", "Send", "Close"],
    nativeOnly: ["Messages", "Mail", "No access grant"]
  };
  return (
    <div className={`quality-example share-dialog-bad-demo is-${mode}`}>
      <strong>{mode === "nativeOnly" ? "Device share only" : "Broken sharing flow"}</strong>
      <div className="share-dialog-bad-grid">
        {cells[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row share-dialog-controls">
        <button type="button" className={mode === "publicDefault" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("publicDefault")}>Public default</button>
        <button type="button" className={mode === "hiddenRole" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenRole")}>Hidden role</button>
        <button type="button" className={mode === "noWarning" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noWarning")}>No warning</button>
        <button type="button" className={mode === "copyMismatch" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("copyMismatch")}>Copy mismatch</button>
        <button type="button" className={mode === "noRevoke" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noRevoke")}>No revoke</button>
        <button type="button" className={mode === "nativeOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("nativeOnly")}>Native only</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ShareDialogGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ShareDialogBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ShareDialogGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ShareDialogBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
