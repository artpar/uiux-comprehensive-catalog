import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type BlockMuteMode =
  | "blockEntry"
  | "muteEntry"
  | "blockConfirm"
  | "muteNoNotice"
  | "blocked"
  | "muted"
  | "hiddenPerson"
  | "restrict"
  | "temporaryMute"
  | "exceptions"
  | "manage"
  | "reportHandoff"
  | "emergency"
  | "failed"
  | "offline"
  | "permission"
  | "admin"
  | "mobile";

type BlockMuteBadMode =
  | "blendedAction"
  | "noConfirmation"
  | "hiddenUnmute"
  | "unexplainedExceptions"
  | "targetNotified"
  | "wrongScope"
  | "privateNoteLeak";

const blockMuteGoodLabels: Array<[BlockMuteMode, string]> = [
  ["blockEntry", "Block entry point"],
  ["muteEntry", "Mute entry point"],
  ["blockConfirm", "Block confirmation"],
  ["muteNoNotice", "Mute without target notification"],
  ["blocked", "Blocked state"],
  ["muted", "Muted state"],
  ["hiddenPerson", "Hidden person"],
  ["restrict", "Restrict interaction"],
  ["temporaryMute", "Temporary mute"],
  ["exceptions", "Exceptions"],
  ["manage", "Undo and management"],
  ["reportHandoff", "Report abuse handoff"],
  ["emergency", "Emergency route"],
  ["failed", "Failed action"],
  ["offline", "Offline pending"],
  ["permission", "Permission-limited state"],
  ["admin", "Admin-managed state"],
  ["mobile", "Mobile compact boundary"]
];

const blockMuteBadLabels: Array<[BlockMuteBadMode, string]> = [
  ["blendedAction", "Blended action"],
  ["noConfirmation", "No confirmation"],
  ["hiddenUnmute", "Hidden unmute"],
  ["unexplainedExceptions", "Unexplained exceptions"],
  ["targetNotified", "Target notified"],
  ["wrongScope", "Wrong scope"],
  ["privateNoteLeak", "Private note leak"]
];

function BlockMutePanel({ mode, idSuffix }: { mode: BlockMuteMode; idSuffix: string }) {
  const config: Record<BlockMuteMode, {
    chip: string;
    title: string;
    body: string;
    target: string;
    action: string;
    scope: string;
    exceptions: string;
    reversal: string;
    status: string;
    primary: string;
    secondary: string;
    tone?: "ready" | "warning" | "danger";
    compact?: boolean;
  }> = {
    blockEntry: {
      chip: "Block / mute",
      title: "Block entry point names the account",
      body: "The profile and post menus offer Block @northstar separately from Mute and Report so users choose the right personal boundary.",
      target: "@northstar",
      action: "Block account",
      scope: "Account and profile interactions",
      exceptions: "Shared replies may still mention the account",
      reversal: "Blocked accounts list",
      status: "Ready",
      primary: "Block account",
      secondary: "Mute instead"
    },
    muteEntry: {
      chip: "Mute entry point",
      title: "Mute entry point explains reduced exposure",
      body: "Mute @northstar removes their posts from the timeline without unfollowing, blocking, or submitting a safety report.",
      target: "@northstar",
      action: "Mute account",
      scope: "Timeline posts and push notifications",
      exceptions: "Direct messages can still arrive",
      reversal: "Muted accounts list",
      status: "Ready",
      primary: "Mute account",
      secondary: "Cancel"
    },
    blockConfirm: {
      chip: "Block confirmation",
      title: "High-impact block asks for confirmation",
      body: "The confirmation lists contact, tagging, repository collaboration, profile, and list-add effects before committing the block.",
      target: "@northstar",
      action: "Confirm block",
      scope: "Profile, contact, collaboration",
      exceptions: "Existing public mentions may remain visible",
      reversal: "Unblock from profile or list",
      status: "Needs confirmation",
      primary: "Confirm block",
      secondary: "Back",
      tone: "warning"
    },
    muteNoNotice: {
      chip: "Mute without target notification",
      title: "Mute states the target is not notified",
      body: "The account mute state says the muted account will not be notified and can be unmuted later from settings.",
      target: "@northstar",
      action: "Mute account",
      scope: "Home timeline",
      exceptions: "Mentions from followed accounts still show",
      reversal: "Undo banner or muted list",
      status: "Muted",
      primary: "Undo mute",
      secondary: "Manage muted accounts",
      tone: "ready"
    },
    blocked: {
      chip: "Blocked state",
      title: "Blocked profile keeps status and view choice visible",
      body: "The profile replaces Follow with Blocked, hides posts by default, and offers a deliberate View anyway path without removing the unblock control.",
      target: "@northstar profile",
      action: "Blocked",
      scope: "Profile and contact boundary",
      exceptions: "Reported posts may remain in report history",
      reversal: "Unblock",
      status: "Blocked",
      primary: "Unblock",
      secondary: "View anyway",
      tone: "ready"
    },
    muted: {
      chip: "Muted state",
      title: "Muted conversation labels exact scope",
      body: "The muted channel keeps a muted label, hides sidebar noise, and says mentions still produce a numbered badge.",
      target: "#launch-noise",
      action: "Mute and hide",
      scope: "Channel notifications and sidebar",
      exceptions: "Mentions still show a badge",
      reversal: "Unmute channel",
      status: "Muted",
      primary: "Unmute",
      secondary: "Notification settings",
      tone: "ready"
    },
    hiddenPerson: {
      chip: "Hidden person",
      title: "Hidden person suppresses identity and messages",
      body: "Messages from Dana are hidden with name and photo removed, while Show anyway reveals one message without unhiding the person.",
      target: "Dana M.",
      action: "Hide person",
      scope: "Most Slack surfaces",
      exceptions: "Huddle presence warning remains",
      reversal: "Unhide person",
      status: "Hidden",
      primary: "Show anyway",
      secondary: "Unhide",
      tone: "ready"
    },
    restrict: {
      chip: "Restrict interaction",
      title: "Restrict states limited interaction effects",
      body: "Restrict keeps content reviewable while limiting comments, mentions, or message visibility according to the chosen surface.",
      target: "@northstar comments",
      action: "Restrict account",
      scope: "Comments and mentions",
      exceptions: "Existing public replies need separate moderation",
      reversal: "Unrestrict",
      status: "Restricted",
      primary: "Review restrictions",
      secondary: "Unrestrict"
    },
    temporaryMute: {
      chip: "Temporary mute",
      title: "Temporary mute shows expiry",
      body: "The channel can be muted for one hour or until tomorrow, with expiry shown near the muted state.",
      target: "#incident-backfill",
      action: "Temporary mute",
      scope: "Channel notifications",
      exceptions: "Critical mentions still badge",
      reversal: "Ends tomorrow 09:00",
      status: "Muted until tomorrow",
      primary: "End mute now",
      secondary: "Change duration",
      tone: "warning"
    },
    exceptions: {
      chip: "Exceptions",
      title: "Exceptions are visible before trust is lost",
      body: "The muted account state explains DMs, mentions from followed accounts, group conversations, Slackbot, and huddle warnings that may still appear.",
      target: "Muted account and DM",
      action: "Review exceptions",
      scope: "Account + conversations",
      exceptions: "DMs, badges, huddles, shared replies",
      reversal: "Adjust boundary",
      status: "Exceptions visible",
      primary: "Review details",
      secondary: "Mute more"
    },
    manage: {
      chip: "Undo and management",
      title: "Management list makes reversal findable",
      body: "Blocked accounts, muted accounts, muted channels, and hidden people are listed with target, date, note privacy, and one-step reversal.",
      target: "Boundary settings",
      action: "Manage list",
      scope: "All personal boundaries",
      exceptions: "Admin-managed rows are read-only",
      reversal: "Unblock, unmute, unhide",
      status: "3 active boundaries",
      primary: "Open manage list",
      secondary: "Undo last change",
      tone: "ready"
    },
    reportHandoff: {
      chip: "Report abuse handoff",
      title: "Report abuse stays adjacent, not blended",
      body: "After blocking, the user can report harassment with evidence while block remains a personal visibility control.",
      target: "@northstar",
      action: "Report abuse",
      scope: "Safety review",
      exceptions: "Block is not enforcement",
      reversal: "Report history",
      status: "Handoff available",
      primary: "Report abuse",
      secondary: "Keep blocked"
    },
    emergency: {
      chip: "Emergency route",
      title: "Urgent safety gets a separate route",
      body: "For credible threats, the UI keeps block and mute available but points to emergency guidance and evidence-saving before leaving the flow.",
      target: "Threatening DM",
      action: "Emergency help",
      scope: "Immediate safety",
      exceptions: "Platform review is not emergency response",
      reversal: "Save evidence copy",
      status: "Urgent guidance",
      primary: "Open safety help",
      secondary: "Save copy",
      tone: "danger"
    },
    failed: {
      chip: "Failed action",
      title: "Failed boundary does not claim success",
      body: "A failed block keeps the target and selected action visible, offers retry, and warns that contact may still be possible.",
      target: "@northstar",
      action: "Block account",
      scope: "Account boundary",
      exceptions: "Boundary not applied",
      reversal: "Retry or report",
      status: "Block failed",
      primary: "Retry block",
      secondary: "Report abuse",
      tone: "danger"
    },
    offline: {
      chip: "Offline pending",
      title: "Offline mute queues safely",
      body: "The intended mute is queued with local status, but the UI says notifications may continue until sync succeeds.",
      target: "#launch-noise",
      action: "Mute channel",
      scope: "Channel notifications",
      exceptions: "May still notify before sync",
      reversal: "Cancel pending",
      status: "Pending offline",
      primary: "Retry sync",
      secondary: "Cancel",
      tone: "warning"
    },
    permission: {
      chip: "Permission-limited state",
      title: "Permission limits explain unavailable controls",
      body: "The user can mute a channel but cannot remove or ban members, so unavailable admin actions link to the owner route.",
      target: "#general",
      action: "Mute allowed",
      scope: "Personal notifications only",
      exceptions: "Admin removal unavailable",
      reversal: "Ask owner",
      status: "Limited permission",
      primary: "Mute for me",
      secondary: "Ask owner",
      tone: "warning"
    },
    admin: {
      chip: "Admin-managed state",
      title: "Admin-managed boundaries are not reversible locally",
      body: "An organization block or interaction limit says who owns it, how long it lasts, and why the current user cannot override it.",
      target: "Org-level interaction limit",
      action: "Admin managed",
      scope: "Repository interactions",
      exceptions: "Personal mute still available",
      reversal: "Contact owner",
      status: "Managed by org",
      primary: "View policy",
      secondary: "Mute locally"
    },
    mobile: {
      chip: "Mobile compact boundary",
      title: "Compact boundary copy keeps target and effect visible",
      body: "The mobile sheet keeps Block, Mute, Hide, Report, target name, consequences, exceptions, and reversal in a readable stack.",
      target: "@northstar",
      action: "Choose boundary",
      scope: "Profile menu",
      exceptions: "DM and mention rules shown",
      reversal: "Manage later",
      status: "Mobile ready",
      primary: "Mute account",
      secondary: "Block account",
      compact: true
    }
  };
  const item = config[mode];
  const titleId = `block-mute-title-${idSuffix}`;
  const descId = `block-mute-desc-${idSuffix}`;

  return (
    <section className={`block-mute-panel is-${mode} ${item.tone ? `is-${item.tone}` : ""} ${item.compact ? "is-compact" : ""}`} aria-labelledby={titleId} aria-describedby={descId}>
      <div className="block-mute-panel-head">
        <div>
          <span>{item.chip}</span>
          <strong id={titleId}>{item.title}</strong>
        </div>
        <b>{item.status}</b>
      </div>
      <p id={descId}>{item.body}</p>
      <div className="block-mute-evidence-grid" aria-label="Block mute fields">
        <span><b>Target</b>{item.target}</span>
        <span><b>Action</b>{item.action}</span>
        <span><b>Scope</b>{item.scope}</span>
        <span><b>Exceptions</b>{item.exceptions}</span>
        <span><b>Reversal</b>{item.reversal}</span>
        <span><b>Status</b>{item.status}</span>
      </div>
      <div className="block-mute-actions">
        <button type="button" className="demo-button small primary">{item.primary}</button>
        <button type="button" className="demo-button small">{item.secondary}</button>
        <button type="button" className="demo-button small">Manage boundaries</button>
      </div>
    </section>
  );
}

function BlockMuteGoodUi() {
  return (
    <div className="quality-example block-mute-demo">
      <BlockMutePanel mode="blockConfirm" idSuffix="good-ui" />
      <p className="demo-status">Block / mute UI shows target, action, scope, exceptions, reversal, and status before changing a personal boundary.</p>
    </div>
  );
}

function BlockMuteBadUi() {
  return (
    <div className="bad-ui-sample block-mute-bad-demo is-blendedAction">
      <div className="block-mute-broken" aria-label="Broken block mute">
        <strong>Silence</strong>
        <p>One action mutes posts, blocks DMs, reports abuse, unfollows, and hides the person without saying which boundary changed.</p>
        <div className="block-mute-broken-grid">
          <span>Mixed effect</span>
          <span>No scope</span>
          <span>No undo</span>
        </div>
        <button type="button" className="demo-button small danger">Silence user</button>
      </div>
      <p className="demo-status">The broken UI blends block, mute, report, and unfollow into an unpredictable safety action.</p>
    </div>
  );
}

function BlockMuteGoodUx() {
  const [mode, setMode] = useState<BlockMuteMode>("blockEntry");
  return (
    <div className="quality-example block-mute-demo">
      <div className="block-mute-controls" aria-label="Block mute exercise controls">
        {blockMuteGoodLabels.map(([key, label]) => (
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
      <BlockMutePanel mode={mode} idSuffix="good-ux" />
      <p className="demo-status" aria-live="polite">Block / mute state: {blockMuteGoodLabels.find(([key]) => key === mode)?.[1]}.</p>
    </div>
  );
}

function BlockMuteBadUx() {
  const [mode, setMode] = useState<BlockMuteBadMode>("blendedAction");
  const copy: Record<BlockMuteBadMode, {
    title: string;
    body: string;
    fieldA: string;
    fieldB: string;
    fieldC: string;
    outcome: string;
  }> = {
    blendedAction: {
      title: "Blended action",
      body: "Silence combines block, mute, report abuse, unfollow, and hide into one command with no visible owner or effect.",
      fieldA: "Block?",
      fieldB: "Mute?",
      fieldC: "Report?",
      outcome: "Users cannot predict what changed or how to undo it."
    },
    noConfirmation: {
      title: "No confirmation",
      body: "A high-impact block commits immediately without naming contact, profile, DM, repository, or collaboration consequences.",
      fieldA: "No target",
      fieldB: "No effects",
      fieldC: "No cancel",
      outcome: "The user may cut off more interaction than intended."
    },
    hiddenUnmute: {
      title: "Hidden unmute",
      body: "The account is muted, but unmute lives in an unrelated settings page with no muted-list link near the target.",
      fieldA: "Muted",
      fieldB: "No list",
      fieldC: "No undo",
      outcome: "A temporary attention choice becomes hard to reverse."
    },
    unexplainedExceptions: {
      title: "Unexplained exceptions",
      body: "The muted DM still badges, mentions still appear, and huddle warnings still show, but none of those exceptions were disclosed.",
      fieldA: "Badge appears",
      fieldB: "DM arrives",
      fieldC: "No warning",
      outcome: "The user thinks mute failed even when it is working as designed."
    },
    targetNotified: {
      title: "Target notified",
      body: "The UI sends a notification that the target was muted even though the user expected a private personal boundary.",
      fieldA: "Notice sent",
      fieldB: "Retaliation risk",
      fieldC: "No privacy note",
      outcome: "A safety action creates social risk."
    },
    wrongScope: {
      title: "Wrong scope",
      body: "Mute one DM silently applies to every group conversation with the same person and hides work-critical messages.",
      fieldA: "One DM",
      fieldB: "All groups",
      fieldC: "Scope mismatch",
      outcome: "A narrow action changes unrelated conversations."
    },
    privateNoteLeak: {
      title: "Private note leak",
      body: "The private reason for blocking a user appears in public profile UI and analytics payloads.",
      fieldA: "Private note",
      fieldB: "Public UI",
      fieldC: "Logged reason",
      outcome: "The boundary leaks the user's safety context."
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example block-mute-bad-demo is-${mode}`}>
      <div className="block-mute-controls" aria-label="Block mute misuse controls">
        {blockMuteBadLabels.map(([key, label]) => (
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
      <div className="block-mute-broken" aria-label={`Broken state: ${item.title}`}>
        <strong>{item.title}</strong>
        <p>{item.body}</p>
        <div className="block-mute-broken-grid">
          <span>{item.fieldA}</span>
          <span>{item.fieldB}</span>
          <span>{item.fieldC}</span>
        </div>
        <button type="button" className="demo-button small danger">{mode === "privateNoteLeak" ? "Publish note" : "Apply boundary"}</button>
      </div>
      <p className="demo-status" aria-live="polite">{item.outcome}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <BlockMuteGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <BlockMuteBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <BlockMuteGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <BlockMuteBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
