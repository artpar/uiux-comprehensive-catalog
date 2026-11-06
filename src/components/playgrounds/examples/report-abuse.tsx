import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type ReportAbuseMode =
  | "entry"
  | "snapshot"
  | "reason"
  | "affected"
  | "context"
  | "multiple"
  | "route"
  | "pending"
  | "submitted"
  | "failed"
  | "duplicate"
  | "rateLimited"
  | "offline"
  | "safetyActions"
  | "hidden"
  | "followUp"
  | "actionTaken"
  | "noViolation"
  | "privacy"
  | "signedOut"
  | "blockedAccount"
  | "mobile";

type ReportAbuseBadMode =
  | "instantTakedown"
  | "noTarget"
  | "publicReport"
  | "forcedReexposure"
  | "genericReason"
  | "noSafetyActions"
  | "lostFailed";

const reportAbuseGoodLabels: Array<[ReportAbuseMode, string]> = [
  ["entry", "Report entry point"],
  ["snapshot", "Reported object snapshot"],
  ["reason", "Reason selection"],
  ["affected", "Affected person"],
  ["context", "Additional context"],
  ["multiple", "Multiple content selection"],
  ["route", "Route selection"],
  ["pending", "Pending submit"],
  ["submitted", "Submitted receipt"],
  ["failed", "Failed submit"],
  ["duplicate", "Duplicate report"],
  ["rateLimited", "Rate limited report"],
  ["offline", "Offline draft"],
  ["safetyActions", "Post-report safety actions"],
  ["hidden", "Content hidden after report"],
  ["followUp", "Follow-up needed"],
  ["actionTaken", "Action taken"],
  ["noViolation", "No violation found"],
  ["privacy", "Reporter privacy"],
  ["signedOut", "Signed-out reporting"],
  ["blockedAccount", "Blocked-account reporting"],
  ["mobile", "Mobile compact report"]
];

const reportAbuseBadLabels: Array<[ReportAbuseBadMode, string]> = [
  ["instantTakedown", "Instant takedown"],
  ["noTarget", "No target"],
  ["publicReport", "Public report"],
  ["forcedReexposure", "Forced re-exposure"],
  ["genericReason", "Generic reason"],
  ["noSafetyActions", "No safety actions"],
  ["lostFailed", "Lost failed report"]
];

function ReportAbusePanel({ mode, idSuffix }: { mode: ReportAbuseMode; idSuffix: string }) {
  const config: Record<ReportAbuseMode, {
    chip: string;
    title: string;
    body: string;
    target: string;
    reason: string;
    route: string;
    status: string;
    privacy: string;
    action: string;
    secondary: string;
    tone?: "ready" | "warning" | "danger";
    compact?: boolean;
  }> = {
    entry: {
      chip: "Report abuse",
      title: "Report entry point stays attached to the object",
      body: "The comment menu opens a scoped report abuse flow without asking the reporter to copy harmful content by hand.",
      target: "Comment by @northstar, 10:41",
      reason: "Not selected",
      route: "Safety review",
      status: "Ready",
      privacy: "Reporter hidden from reported user",
      action: "Report comment",
      secondary: "Cancel"
    },
    snapshot: {
      chip: "Reported object snapshot",
      title: "Target identity is confirmed before submission",
      body: "The flow shows content type, author, timestamp, selected message count, and permalink so the reporter knows exactly what will be reviewed.",
      target: "Direct message thread, 3 selected messages",
      reason: "Harassment or bullying",
      route: "Trust and safety",
      status: "Snapshot saved",
      privacy: "Message text limited to reviewers",
      action: "Continue",
      secondary: "Change target"
    },
    reason: {
      chip: "Reason selection",
      title: "Policy reasons route the report",
      body: "Reason choices separate harassment, spam, impersonation, privacy, legal issue, child safety, self-harm, and violent threat instead of one vague report type.",
      target: "Profile @fake-support",
      reason: "Impersonation",
      route: "Account integrity",
      status: "Reason selected",
      privacy: "Only selected evidence is shared",
      action: "Next",
      secondary: "Back"
    },
    affected: {
      chip: "Affected person",
      title: "Reporter states who is affected",
      body: "The flow asks whether the report is for myself, someone else, a group, everyone, or the community so policy review receives the right context.",
      target: "Public post P-2048",
      reason: "Abusive or harmful",
      route: "Safety triage",
      status: "Affects someone else",
      privacy: "Reporter identity protected",
      action: "Add context",
      secondary: "Skip"
    },
    context: {
      chip: "Additional context",
      title: "Context field explains what helps review",
      body: "The optional note asks for concise context and warns against adding passwords, payment data, medical data, or unrelated private information.",
      target: "Live chat message",
      reason: "Violent threat",
      route: "Urgent safety",
      status: "Context optional",
      privacy: "Sensitive data warning visible",
      action: "Submit urgent report",
      secondary: "Save draft"
    },
    multiple: {
      chip: "Multiple content selection",
      title: "Related content can be included once",
      body: "The reporter adds two related posts to one abuse report, improving context without submitting separate duplicate reports.",
      target: "3 posts selected",
      reason: "Targeted harassment",
      route: "Behavior pattern review",
      status: "3 items attached",
      privacy: "Attachment list private",
      action: "Review report",
      secondary: "Remove one"
    },
    route: {
      chip: "Route selection",
      title: "Special routes stay distinct",
      body: "Privacy complaint, legal issue, copyright, repository maintainer report, platform support, and emergency guidance are separated from ordinary policy reporting.",
      target: "Repository comment",
      reason: "Code of conduct",
      route: "Repository admins",
      status: "Maintainer route",
      privacy: "Support route still available",
      action: "Report to admins",
      secondary: "Report to platform"
    },
    pending: {
      chip: "Pending submit",
      title: "Submission shows a stable pending state",
      body: "The pending state keeps the target, reason, route, and evidence visible while the report is sent.",
      target: "Ad A-8172",
      reason: "Scam or misleading",
      route: "Ads policy",
      status: "Submitting",
      privacy: "Evidence retained in draft",
      action: "Submitting...",
      secondary: "Keep draft",
      tone: "warning"
    },
    submitted: {
      chip: "Submitted receipt",
      title: "Receipt confirms report, not enforcement",
      body: "The confirmation says the report was received, gives receipt RPT-2048, links report history, and explains review may or may not remove the content.",
      target: "Comment C-117",
      reason: "Harassment",
      route: "Safety review",
      status: "Received RPT-2048",
      privacy: "Other users cannot see who reported",
      action: "View report history",
      secondary: "Block user",
      tone: "ready"
    },
    failed: {
      chip: "Failed submit",
      title: "Failed report keeps evidence and reason",
      body: "A failed submission preserves the selected messages, reason, affected-person answer, and context so the reporter can retry safely.",
      target: "Conversation CV-54",
      reason: "Threatening message",
      route: "Urgent safety",
      status: "Network failed",
      privacy: "Draft stored locally",
      action: "Retry report",
      secondary: "Export copy",
      tone: "danger"
    },
    duplicate: {
      chip: "Duplicate report",
      title: "Duplicate report points to the existing receipt",
      body: "The flow says the same content was already reported, keeps the latest evidence available, and links the existing receipt instead of losing trust.",
      target: "Post P-2048",
      reason: "Spam",
      route: "Spam review",
      status: "Already reported",
      privacy: "No public duplicate marker",
      action: "Open receipt",
      secondary: "Add context",
      tone: "warning"
    },
    rateLimited: {
      chip: "Rate limited report",
      title: "Rate limit explains recovery",
      body: "Abuse prevention slows repeated low-risk reports but preserves urgent threat and child safety paths instead of silently blocking all reporting.",
      target: "Profile @bulk-spam",
      reason: "Spam",
      route: "Spam review",
      status: "Try again in 2 minutes",
      privacy: "Urgent safety routes remain open",
      action: "Save report",
      secondary: "Contact support",
      tone: "warning"
    },
    offline: {
      chip: "Offline draft",
      title: "Offline reporting saves a retryable draft",
      body: "When offline, the flow stores the target snapshot, reason, and context with a visible retry state so evidence is not discarded.",
      target: "Message M-882",
      reason: "Self-harm concern",
      route: "Safety support",
      status: "Saved offline",
      privacy: "Encrypted local draft",
      action: "Retry when online",
      secondary: "View safety resources",
      tone: "warning"
    },
    safetyActions: {
      chip: "Post-report safety actions",
      title: "Report is separate from block, mute, and hide",
      body: "After submission, block, mute, hide, restrict, leave conversation, save evidence, and safety center actions are offered as personal protection, not enforcement claims.",
      target: "User @northstar",
      reason: "Harassment",
      route: "Safety review",
      status: "Report received",
      privacy: "Visibility controls affect only reporter",
      action: "Block user",
      secondary: "Mute thread",
      tone: "ready"
    },
    hidden: {
      chip: "Content hidden after report",
      title: "Reported content can be hidden from view",
      body: "The reported post is replaced by a notice so the reporter does not have to keep seeing harmful content, with a deliberate View anyway option.",
      target: "Reported post P-2048",
      reason: "Hate or harassment",
      route: "Safety review",
      status: "Hidden for you",
      privacy: "Snapshot still available to reviewers",
      action: "Keep hidden",
      secondary: "View anyway",
      tone: "ready"
    },
    followUp: {
      chip: "Follow-up needed",
      title: "Follow-up asks for more context safely",
      body: "The follow-up state asks for one missing detail and deep-links to the receipt without exposing the harmful content in notification text.",
      target: "Report RPT-2048",
      reason: "Impersonation",
      route: "Account integrity",
      status: "More information needed",
      privacy: "Notification redacts content",
      action: "Add detail",
      secondary: "Close"
    },
    actionTaken: {
      chip: "Action taken",
      title: "Outcome update names the report result",
      body: "The status says action was taken on reported content and separates platform enforcement from the reporter's block or mute choices.",
      target: "Report RPT-2048",
      reason: "Scam",
      route: "Safety review",
      status: "Action taken",
      privacy: "No moderator notes exposed",
      action: "Review update",
      secondary: "Manage blocked users",
      tone: "ready"
    },
    noViolation: {
      chip: "No violation found",
      title: "No-violation outcome preserves safety options",
      body: "The report status says review did not find a policy violation, while keeping block, mute, hide, appeal, and safety resources available.",
      target: "Report RPT-2048",
      reason: "Harassment",
      route: "Safety review",
      status: "No violation found",
      privacy: "Report remains private",
      action: "Request review",
      secondary: "Keep hidden",
      tone: "warning"
    },
    privacy: {
      chip: "Reporter privacy",
      title: "Privacy note states who sees report details",
      body: "The report form explains that other users cannot see who reported, while reviewers may see selected evidence and context for policy review.",
      target: "Comment C-117",
      reason: "Bullying",
      route: "Safety review",
      status: "Privacy explained",
      privacy: "Reporter not shown publicly",
      action: "Submit report",
      secondary: "Learn more"
    },
    signedOut: {
      chip: "Signed-out reporting",
      title: "Signed-out and region routes stay available",
      body: "A region-specific signed-out report collects only required contact and content details, then gives a receipt without forcing account creation.",
      target: "Video V-91",
      reason: "Legal or safety issue",
      route: "Signed-out route",
      status: "Contact required",
      privacy: "No account needed",
      action: "Continue signed out",
      secondary: "Sign in"
    },
    blockedAccount: {
      chip: "Blocked-account reporting",
      title: "Blocked relationships do not erase report paths",
      body: "The flow lets users report a blocked account's mention or message while preserving the block and avoiding profile re-exposure.",
      target: "Mention from blocked account",
      reason: "Harassment",
      route: "Safety review",
      status: "Block remains active",
      privacy: "Reported user not notified by UI",
      action: "Submit with block active",
      secondary: "Remove evidence"
    },
    mobile: {
      chip: "Mobile compact report",
      title: "Compact report keeps target, reason, and safety actions visible",
      body: "Mobile layout keeps the reported object, reason, privacy note, submit, and block or mute actions readable without truncating receipt IDs.",
      target: "DM thread, 2 messages",
      reason: "Abusive or harmful",
      route: "Mobile safety",
      status: "Ready on mobile",
      privacy: "Reporter privacy visible",
      action: "Submit report",
      secondary: "Mute conversation",
      compact: true
    }
  };
  const item = config[mode];
  const titleId = `report-abuse-title-${idSuffix}`;
  const descId = `report-abuse-desc-${idSuffix}`;

  return (
    <section className={`report-abuse-panel is-${mode} ${item.tone ? `is-${item.tone}` : ""} ${item.compact ? "is-compact" : ""}`} aria-labelledby={titleId} aria-describedby={descId}>
      <div className="report-abuse-panel-head">
        <div>
          <span>{item.chip}</span>
          <strong id={titleId}>{item.title}</strong>
        </div>
        <b>{item.status}</b>
      </div>
      <p id={descId}>{item.body}</p>
      <div className="report-abuse-evidence-grid" aria-label="Report abuse fields">
        <span><b>Target</b>{item.target}</span>
        <span><b>Reason</b>{item.reason}</span>
        <span><b>Route</b>{item.route}</span>
        <span><b>Status</b>{item.status}</span>
        <span><b>Privacy</b>{item.privacy}</span>
        <span><b>Next action</b>{item.action}</span>
      </div>
      <div className="report-abuse-actions">
        <button type="button" className="demo-button small primary">{item.action}</button>
        <button type="button" className="demo-button small">{item.secondary}</button>
        <button type="button" className="demo-button small">View report history</button>
      </div>
    </section>
  );
}

function ReportAbuseGoodUi() {
  return (
    <div className="quality-example report-abuse-demo">
      <ReportAbusePanel mode="snapshot" idSuffix="good-ui" />
      <p className="demo-status">Report abuse UI turns a safety report flow into named target, reason, route, status, reporter privacy, and next safety action before submission.</p>
    </div>
  );
}

function ReportAbuseBadUi() {
  return (
    <div className="bad-ui-sample report-abuse-bad-demo is-noTarget">
      <div className="report-abuse-broken" aria-label="Broken report abuse">
        <strong>Report</strong>
        <p>No target, no reason selection, no affected person, no evidence, no receipt, no reporter privacy, and no block or mute option.</p>
        <div className="report-abuse-broken-grid">
          <span>No target</span>
          <span>Generic reason</span>
          <span>No receipt</span>
        </div>
        <button type="button" className="demo-button small danger">Submit report</button>
      </div>
      <p className="demo-status">The broken UI makes a safety submission without enough context to review or protect the reporter.</p>
    </div>
  );
}

function ReportAbuseGoodUx() {
  const [mode, setMode] = useState<ReportAbuseMode>("entry");
  return (
    <div className="quality-example report-abuse-demo">
      <div className="report-abuse-controls" aria-label="Report abuse exercise controls">
        {reportAbuseGoodLabels.map(([key, label]) => (
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
      <ReportAbusePanel mode={mode} idSuffix="good-ux" />
      <p className="demo-status" aria-live="polite">Report abuse state: {reportAbuseGoodLabels.find(([key]) => key === mode)?.[1]}.</p>
    </div>
  );
}

function ReportAbuseBadUx() {
  const [mode, setMode] = useState<ReportAbuseBadMode>("instantTakedown");
  const copy: Record<ReportAbuseBadMode, {
    title: string;
    body: string;
    fieldA: string;
    fieldB: string;
    fieldC: string;
    outcome: string;
  }> = {
    instantTakedown: {
      title: "Instant takedown",
      body: "The confirmation claims the account was banned immediately even though the report has only entered review.",
      fieldA: "False enforcement",
      fieldB: "No review status",
      fieldC: "No receipt",
      outcome: "Reporters receive misleading status and moderators inherit confused expectations."
    },
    noTarget: {
      title: "No target",
      body: "The report form does not show whether the target is a post, profile, direct message, repository, ad, or whole conversation.",
      fieldA: "Unknown object",
      fieldB: "No snapshot",
      fieldC: "No permalink",
      outcome: "Reviewers cannot know what content the reporter meant."
    },
    publicReport: {
      title: "Public report",
      body: "The report is posted into the public thread, exposing reporter identity, private context, and selected evidence to the reported user.",
      fieldA: "Reporter exposed",
      fieldB: "Public evidence",
      fieldC: "Retaliation risk",
      outcome: "Reporter privacy is broken before the safety team can review."
    },
    forcedReexposure: {
      title: "Forced re-exposure",
      body: "The reporter must keep reopening the harmful content to add evidence, retry submission, or check status.",
      fieldA: "View again",
      fieldB: "No hidden state",
      fieldC: "No receipt link",
      outcome: "The flow increases harm while trying to collect a safety report."
    },
    genericReason: {
      title: "Generic reason",
      body: "All concerns are routed through Something is wrong, hiding legal, privacy, child safety, violent threat, self-harm, impersonation, and spam paths.",
      fieldA: "Vague category",
      fieldB: "Wrong route",
      fieldC: "No urgency",
      outcome: "High-risk reports are delayed or sent to the wrong review team."
    },
    noSafetyActions: {
      title: "No safety actions",
      body: "After submission, the user gets no block, mute, hide, leave conversation, save evidence, report history, or emergency guidance.",
      fieldA: "No block",
      fieldB: "No mute",
      fieldC: "No hide",
      outcome: "Reporting does not help the reporter reduce immediate exposure."
    },
    lostFailed: {
      title: "Lost failed report",
      body: "A network failure clears selected messages, reason, context, and affected-person answers.",
      fieldA: "Draft lost",
      fieldB: "Evidence gone",
      fieldC: "Retry unsafe",
      outcome: "The reporter must rebuild the report by revisiting harmful content."
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example report-abuse-bad-demo is-${mode}`}>
      <div className="report-abuse-controls" aria-label="Report abuse misuse controls">
        {reportAbuseBadLabels.map(([key, label]) => (
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
      <div className="report-abuse-broken" aria-label={`Broken state: ${item.title}`}>
        <strong>{item.title}</strong>
        <p>{item.body}</p>
        <div className="report-abuse-broken-grid">
          <span>{item.fieldA}</span>
          <span>{item.fieldB}</span>
          <span>{item.fieldC}</span>
        </div>
        <button type="button" className="demo-button small danger">{mode === "instantTakedown" ? "Remove now" : "Submit report"}</button>
      </div>
      <p className="demo-status" aria-live="polite">{item.outcome}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ReportAbuseGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ReportAbuseBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ReportAbuseGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ReportAbuseBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
