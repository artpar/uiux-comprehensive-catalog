import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type InviteUserStage = "recipient" | "role" | "scope" | "review" | "sent" | "pending" | "resend" | "edit" | "cancel" | "approval" | "expired" | "accepted" | "duplicate";

function InviteUserFrame({
  stage = "recipient",
  role = "Member",
  scope = "Workspace + #launch",
  guest = false,
  pending = false,
  idSuffix = "default"
}: {
  stage?: InviteUserStage;
  role?: "Member" | "Guest" | "Admin";
  scope?: string;
  guest?: boolean;
  pending?: boolean;
  idSuffix?: string;
}) {
  const title: Record<InviteUserStage, string> = {
    recipient: "Invite a teammate",
    role: "Choose invitation role",
    scope: "Limit access scope",
    review: "Review before sending",
    sent: "Invitation sent",
    pending: "Pending invitation",
    resend: "Invitation resent",
    edit: "Pending invitation updated",
    cancel: "Invitation canceled",
    approval: "Admin approval requested",
    expired: "Invitation expired",
    accepted: "Invitation accepted",
    duplicate: "Existing pending invite"
  };
  const status: Record<InviteUserStage, string> = {
    recipient: "Recipient resolves to maya.contractor@example.com before role selection.",
    role: "Member role can join the workspace; Guest requires channel scope.",
    scope: "Scope is limited to the workspace and #launch channel.",
    review: "Review shows recipient, role, scope, message, expiry, and billing impact.",
    sent: "Sent creates a trackable pending invitation, not an active member.",
    pending: "Pending invite expires in 30 days and can be managed.",
    resend: "Resend keeps the same invitation record and refreshes delivery.",
    edit: "Role and channel scope were updated before acceptance.",
    cancel: "Canceled invites no longer grant access or appear as active members.",
    approval: "Workspace policy sends this invite request to admins for approval.",
    expired: "Expired invite can be extended or replaced by a new reviewed invite.",
    accepted: "Accepted invite moves Maya from pending to active member.",
    duplicate: "Duplicate attempt opens the existing pending invitation instead of sending another email."
  };
  const inviteRows = [
    { label: "Recipient", value: "maya.contractor@example.com", state: stage === "duplicate" ? "Pending exists" : "Resolved" },
    { label: "Role", value: role, state: role === "Admin" ? "Elevated" : guest ? "Guest" : "Member" },
    { label: "Scope", value: scope, state: guest ? "Required" : "Selected" },
    { label: "Status", value: stage === "accepted" ? "Active" : stage === "cancel" ? "Canceled" : pending || ["sent", "pending", "resend", "edit", "approval", "expired", "duplicate"].includes(stage) ? "Pending" : "Draft", state: stage === "expired" ? "Expired" : stage === "approval" ? "Approval" : "Trackable" }
  ];

  return (
    <div className={`invite-user-frame is-${stage}`}>
      <section className="invite-user-form" aria-labelledby={`invite-user-title-${idSuffix}`}>
        <div className="invite-user-heading">
          <span>{guest ? "External guest" : "Workspace invite"}</span>
          <strong>{stage === "accepted" ? "Accepted" : stage === "cancel" ? "Revoked" : pending ? "Pending" : "Draft"}</strong>
        </div>
        <h4 id={`invite-user-title-${idSuffix}`}>{title[stage]}</h4>
        <p>{status[stage]}</p>
        <div className="invite-user-fields">
          {inviteRows.map((row) => (
            <div className={row.state === "Elevated" || row.state === "Required" ? "needs-review" : row.state === "Expired" || row.state === "Approval" ? "needs-action" : ""} key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
              <em>{row.state}</em>
            </div>
          ))}
        </div>
        <div className="invite-user-note">
          <span>{guest ? "Single-channel guest access is limited to #launch and may affect billing rules." : role === "Admin" ? "Admin invitations require review because they grant organization-wide controls." : "Invitation email includes only the workspace name and selected access scope."}</span>
        </div>
      </section>
      <aside className="invite-user-preview" aria-label="Invitation preview">
        <strong>Invitation preview</strong>
        <span>To: maya.contractor@example.com</span>
        <p>{stage === "approval" ? "Request sent to workspace admins." : stage === "accepted" ? "Maya accepted using the invited email." : stage === "cancel" ? "This invitation can no longer be accepted." : "Join Acme Launch as a workspace member."}</p>
        <dl>
          <div>
            <dt>Expires</dt>
            <dd>{stage === "expired" ? "Expired" : "30 days"}</dd>
          </div>
          <div>
            <dt>Manage</dt>
            <dd>{pending ? "Resend · Edit · Cancel" : "After send"}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}

function InviteUserGoodUi() {
  return (
    <div className="quality-example invite-user-demo">
      <InviteUserFrame idSuffix="good-ui" />
      <p className="demo-status">The invite surface resolves recipient identity, previews role and scope, explains guest or billing impact, and treats sent invitations as pending access.</p>
    </div>
  );
}

function InviteUserBadUi() {
  return (
    <div className="bad-ui-sample invite-user-bad-demo is-broadAccess">
      <strong>Invite people</strong>
      <div className="invite-user-bad-grid">
        {["Email", "Admin default", "All channels", "Send now", "No pending list", "No cancel"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p className="demo-status">The broken invite sends broad access immediately with no recipient resolution, role review, pending status, or cancellation path.</p>
    </div>
  );
}

function InviteUserGoodUx() {
  const [stage, setStage] = useState<InviteUserStage>("recipient");
  const [role, setRole] = useState<"Member" | "Guest" | "Admin">("Member");
  const [scope, setScope] = useState("Workspace + #launch");
  const [guest, setGuest] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("Recipient identity is resolved before the invitation can grant access.");

  function choose(nextStage: InviteUserStage, nextMessage: string) {
    setStage(nextStage);
    setMessage(nextMessage);
  }

  return (
    <div className="quality-example invite-user-demo">
      <InviteUserFrame stage={stage} role={role} scope={scope} guest={guest} pending={pending} idSuffix="good-ux" />
      <div className="demo-row invite-user-controls" aria-label="Invite user exercise controls">
        <button type="button" className={stage === "recipient" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("recipient", "The invite starts by resolving maya.contractor@example.com and checking that the recipient is not already active.")}>Recipient</button>
        <button type="button" className={stage === "role" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setRole("Member");
          setGuest(false);
          choose("role", "Role selection explains what Member can access before the email is sent.");
        }}>Role</button>
        <button type="button" className={guest ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setRole("Guest");
          setGuest(true);
          setScope("#launch only");
          choose("scope", "Guest access requires explicit channel scope and warns about guest and billing rules.");
        }}>Guest scope</button>
        <button type="button" className={stage === "review" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("review", "Review summarizes recipient, role, scope, message, expiry, and side effects before Send invitation.")}>Review</button>
        <button type="button" className={stage === "sent" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setPending(true);
          choose("sent", "Send creates invitation INV-2048 with Pending status rather than showing Maya as an active member.");
        }}>Send</button>
        <button type="button" className={stage === "resend" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setPending(true);
          choose("resend", "Resend refreshes delivery for the same pending invitation without duplicating role or scope.");
        }}>Resend</button>
        <button type="button" className={stage === "edit" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setRole("Admin");
          setScope("Organization");
          setPending(true);
          choose("edit", "Editing a pending invitation updates role and scope before acceptance and keeps it reviewable.");
        }}>Edit pending</button>
        <button type="button" className={stage === "cancel" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setPending(false);
          choose("cancel", "Cancel revokes the pending invitation and prevents the old email link from granting access.");
        }}>Cancel</button>
        <button type="button" className={stage === "approval" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setPending(true);
          choose("approval", "When admin approval is required, the requester sees a tracked approval request instead of a vague failure.");
        }}>Approval</button>
        <button type="button" className={stage === "expired" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setPending(true);
          choose("expired", "Expired invitations move to recovery actions such as extend, resend, cancel, or send a newly reviewed invite.");
        }}>Expired</button>
        <button type="button" className={stage === "accepted" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setPending(false);
          choose("accepted", "Accepted invitation moves the recipient from pending to active member using the invited account.");
        }}>Accepted</button>
        <button type="button" className={stage === "duplicate" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setPending(true);
          choose("duplicate", "Duplicate invite attempts open the existing pending record so the inviter can resend, edit, or cancel it.");
        }}>Duplicate</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function InviteUserBadUx() {
  type Mode = "instantMember" | "broadAccess" | "hiddenPending" | "duplicateSend" | "noCancel" | "leakDetails";
  const [mode, setMode] = useState<Mode>("instantMember");
  const copy: Record<Mode, string> = {
    instantMember: "The interface says member added immediately even though the invite has not been accepted.",
    broadAccess: "The invite defaults to Admin and all channels without explaining scope, billing, or external access.",
    hiddenPending: "After send, the invitation disappears and admins cannot see pending, expired, or accepted state.",
    duplicateSend: "The same address gets multiple invitations with different roles instead of one editable pending record.",
    noCancel: "A pending invitation cannot be canceled, so an old email link may still grant access.",
    leakDetails: "The email exposes a private repository and channel name before the recipient is verified."
  };
  const labels: Record<Mode, string[]> = {
    instantMember: ["Added", "No acceptance", "Active badge"],
    broadAccess: ["Admin", "All channels", "No review"],
    hiddenPending: ["Sent", "No list", "No expiry"],
    duplicateSend: ["Member invite", "Admin invite", "Same email"],
    noCancel: ["Pending", "Resend only", "Old link active"],
    leakDetails: ["Private repo", "#legal-review", "Unverified email"]
  };
  return (
    <div className={`quality-example invite-user-bad-demo is-${mode}`}>
      <strong>{mode === "broadAccess" ? "Send admin invite" : mode === "leakDetails" ? "Invite email" : "Invite user"}</strong>
      <div className="invite-user-bad-grid">
        {labels[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row invite-user-controls">
        <button type="button" className={mode === "instantMember" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("instantMember")}>Instant member</button>
        <button type="button" className={mode === "broadAccess" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("broadAccess")}>Broad access</button>
        <button type="button" className={mode === "hiddenPending" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenPending")}>Hidden pending</button>
        <button type="button" className={mode === "duplicateSend" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("duplicateSend")}>Duplicate send</button>
        <button type="button" className={mode === "noCancel" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noCancel")}>No cancel</button>
        <button type="button" className={mode === "leakDetails" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("leakDetails")}>Leak details</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <InviteUserGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <InviteUserBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <InviteUserGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <InviteUserBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
