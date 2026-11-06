import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type DeleteAccountMode =
  | "identity"
  | "services"
  | "associatedData"
  | "retainedData"
  | "linkedApps"
  | "subscription"
  | "exportFirst"
  | "reauth"
  | "typed"
  | "scheduled"
  | "pending"
  | "completed"
  | "cancel"
  | "recovery"
  | "legalRetention"
  | "backupRetention"
  | "webLink"
  | "supportRequired"
  | "wrongAccount"
  | "enterprise"
  | "child"
  | "mobile";

type DeleteAccountBadMode =
  | "hiddenDelete"
  | "deactivateOnly"
  | "exportConfusion"
  | "wrongAccount"
  | "retentionMystery"
  | "subscriptionSurprise"
  | "supportOnly";

const deleteAccountGoodLabels: Array<[DeleteAccountMode, string]> = [
  ["identity", "Account identity"],
  ["services", "Affected services"],
  ["associatedData", "Associated data"],
  ["retainedData", "Retained data"],
  ["linkedApps", "Linked apps"],
  ["subscription", "Subscription warning"],
  ["exportFirst", "Export first"],
  ["reauth", "Reauthentication"],
  ["typed", "Typed confirmation"],
  ["scheduled", "Scheduled deletion"],
  ["pending", "Pending request"],
  ["completed", "Completed deletion"],
  ["cancel", "Cancel deletion"],
  ["recovery", "Recovery window"],
  ["legalRetention", "Legal retention"],
  ["backupRetention", "Backup retention"],
  ["webLink", "Web deletion link"],
  ["supportRequired", "Support-required flow"],
  ["wrongAccount", "Wrong-account block"],
  ["enterprise", "Enterprise-managed account"],
  ["child", "Child account"],
  ["mobile", "Mobile compact deletion"]
];

const deleteAccountBadLabels: Array<[DeleteAccountBadMode, string]> = [
  ["hiddenDelete", "Hidden delete"],
  ["deactivateOnly", "Deactivate only"],
  ["exportConfusion", "Export confusion"],
  ["wrongAccount", "Wrong account"],
  ["retentionMystery", "Retention mystery"],
  ["subscriptionSurprise", "Subscription surprise"],
  ["supportOnly", "Support only"]
];

function DeleteAccountPanel({ mode, idSuffix }: { mode: DeleteAccountMode; idSuffix: string }) {
  const config: Record<DeleteAccountMode, {
    chip: string;
    title: string;
    body: string;
    account: string;
    data: string;
    retained: string;
    billing: string;
    linked: string;
    status: string;
    recovery: string;
    action: string;
    secondary: string;
    tone?: "warning" | "danger" | "ready";
    compact?: boolean;
  }> = {
    identity: {
      chip: "Account identity",
      title: "Delete maya.chen@example.com",
      body: "The review names the exact signed-in account, provider, workspace membership, and account avatar before any deletion request can be submitted.",
      account: "maya.chen@example.com via Google sign-in",
      data: "Profile, messages, files, projects",
      retained: "Invoices and fraud logs retained by policy",
      billing: "Team subscription renews Jun 30",
      linked: "Google sign-in, Slack app, Calendar sync",
      status: "Ready for review",
      recovery: "14-day cancellation window",
      action: "Continue review",
      secondary: "Keep account"
    },
    services: {
      chip: "Affected services",
      title: "Services that stop working",
      body: "The flow distinguishes whole-account deletion from deleting one product, removing a device account, unsubscribing, or signing out.",
      account: "maya.chen@example.com",
      data: "Workspace profile, projects, comments, messages",
      retained: "Public replies anonymized after deletion",
      billing: "Subscription owner must transfer billing",
      linked: "API keys and connected apps revoked",
      status: "Service impact listed",
      recovery: "Recover account before Jun 26",
      action: "Review data",
      secondary: "Delete one service instead"
    },
    associatedData: {
      chip: "Associated data",
      title: "Data categories are explicit",
      body: "Personal data, authentication records, files, messages, posts, app data, and membership records are listed with delete, anonymize, retain, or transfer outcomes.",
      account: "maya.chen@example.com",
      data: "Profile, authentication, files, messages, app data",
      retained: "Security event IDs retained without message bodies",
      billing: "Receipts retained for tax obligations",
      linked: "OAuth tokens revoked",
      status: "Data map reviewed",
      recovery: "Export available before deletion",
      action: "Download data first",
      secondary: "Continue deletion"
    },
    retainedData: {
      chip: "Retained data",
      title: "Retention exceptions are named",
      body: "The request explains that invoices, fraud-prevention events, legal holds, and backup copies may remain for stated policy windows.",
      account: "maya.chen@example.com",
      data: "Account record scheduled for deletion",
      retained: "Invoices 7 years; fraud logs 18 months",
      billing: "Open invoice retained",
      linked: "Linked app receipts kept as audit metadata",
      status: "Retention disclosed",
      recovery: "Request ID ERS-2048",
      action: "View retention policy",
      secondary: "Continue"
    },
    linkedApps: {
      chip: "Linked apps",
      title: "Connected access will be revoked",
      body: "Third-party app tokens, Sign in with Apple or Google tokens, API keys, and calendar integrations are listed as separate effects.",
      account: "maya.chen@example.com",
      data: "App profile and linked-token records",
      retained: "Revocation audit retained",
      billing: "No active app-store purchase",
      linked: "Slack app, Calendar sync, GitHub OAuth",
      status: "Revocation queued",
      recovery: "Reconnect only after recovery",
      action: "Review linked apps",
      secondary: "Keep account"
    },
    subscription: {
      chip: "Subscription warning",
      title: "Billing requires separate handling",
      body: "The account cannot be deleted until the workspace subscription owner is transferred or the renewal is canceled.",
      account: "Owner: maya.chen@example.com",
      data: "Account deletion blocked until billing transfer",
      retained: "Invoices remain after account closure",
      billing: "Active Team plan, 12 seats",
      linked: "Stripe customer and app-store receipt",
      status: "Billing blocker",
      recovery: "Deletion can resume after transfer",
      action: "Transfer owner",
      secondary: "Cancel deletion",
      tone: "warning"
    },
    exportFirst: {
      chip: "Export first",
      title: "Download data before deleting",
      body: "The export route is offered before deletion and clearly states that export keeps a copy but does not delete source data.",
      account: "maya.chen@example.com",
      data: "Export profile, messages, files, projects",
      retained: "Export manifest lists omitted retained records",
      billing: "Receipts available in export",
      linked: "Linked app list included",
      status: "Export EXP-2048 ready",
      recovery: "Delete can continue after download",
      action: "Download data",
      secondary: "Skip export"
    },
    reauth: {
      chip: "Reauthentication",
      title: "Verify identity before request",
      body: "The delete request requires a fresh password, passkey, two-factor code, or provider reauth for the account being closed.",
      account: "maya.chen@example.com",
      data: "Deletion request locked until verified",
      retained: "Retention summary visible before sign-in",
      billing: "Billing blocker checked after reauth",
      linked: "SSO provider: Google",
      status: "Reauthentication required",
      recovery: "No request submitted yet",
      action: "Verify identity",
      secondary: "Keep account",
      tone: "warning"
    },
    typed: {
      chip: "Typed confirmation",
      title: "Type the account email",
      body: "The final destructive gate asks for maya.chen@example.com, keeps the typed value visible, and disables deletion until it matches.",
      account: "Required phrase: maya.chen@example.com",
      data: "All account-owned data categories reviewed",
      retained: "Invoices and fraud logs disclosed",
      billing: "Subscription transfer complete",
      linked: "Tokens ready to revoke",
      status: "Waiting for exact match",
      recovery: "14-day cancellation after submit",
      action: "Delete account",
      secondary: "Cancel"
    },
    scheduled: {
      chip: "Scheduled deletion",
      title: "Deletion scheduled for Jun 26, 2026",
      body: "The account is locked for new activity, cancellation remains available, and the receipt names the deletion date and request ID.",
      account: "maya.chen@example.com",
      data: "Deletion job DEL-2048 scheduled",
      retained: "Retained records listed in receipt",
      billing: "Renewal canceled",
      linked: "Tokens revoke on deletion date",
      status: "Scheduled",
      recovery: "Cancel until Jun 26, 2026",
      action: "View receipt",
      secondary: "Cancel deletion",
      tone: "ready"
    },
    pending: {
      chip: "Pending request",
      title: "Erasure request is being processed",
      body: "The UI shows request status, expected timing, recipient notification, and the reason some systems complete later.",
      account: "Request ERS-2048",
      data: "Live profile deletion in progress",
      retained: "Backup copies beyond use until overwrite",
      billing: "Invoice export prepared",
      linked: "Recipients being notified",
      status: "Pending, 2 of 5 systems complete",
      recovery: "Cancel available until live deletion starts",
      action: "Check status",
      secondary: "Contact privacy team"
    },
    completed: {
      chip: "Completed deletion",
      title: "Account deletion complete",
      body: "The final state confirms the account record was deleted, lists retained records, and provides a receipt without exposing deleted private data.",
      account: "maya.chen@example.com closed",
      data: "Profile and app data deleted",
      retained: "Invoices and fraud log metadata retained",
      billing: "Subscription ended",
      linked: "Tokens revoked",
      status: "Completed Jun 12, 2026",
      recovery: "Recovery window closed after completion",
      action: "Download receipt",
      secondary: "Return home",
      tone: "ready"
    },
    cancel: {
      chip: "Cancel deletion",
      title: "Deletion request canceled",
      body: "The cancellation state confirms no account data was deleted and returns focus to the account page with the request ID.",
      account: "maya.chen@example.com",
      data: "Account preserved",
      retained: "No new retention record created",
      billing: "Subscription unchanged",
      linked: "Linked apps remain active",
      status: "DEL-2048 canceled",
      recovery: "New deletion request required",
      action: "Back to account",
      secondary: "Start deletion again"
    },
    recovery: {
      chip: "Recovery window",
      title: "Recover account before Jun 26",
      body: "The recovery route is shown only because the scheduled deletion has not crossed the irreversible account-erasure boundary.",
      account: "maya.chen@example.com",
      data: "Data held for recovery window",
      retained: "Retention policy unchanged",
      billing: "Plan paused",
      linked: "Tokens suspended",
      status: "Recovery available",
      recovery: "14 days remaining",
      action: "Recover account",
      secondary: "Let deletion continue",
      tone: "warning"
    },
    legalRetention: {
      chip: "Legal retention",
      title: "Some records cannot be erased yet",
      body: "The refusal or partial-erasure state names legal obligations, open investigations, invoices, or safety records that remain.",
      account: "maya.chen@example.com",
      data: "Profile deletion accepted",
      retained: "Legal hold LH-382 and tax invoices",
      billing: "Invoice record locked",
      linked: "Recipients notified where required",
      status: "Partial erasure",
      recovery: "Review retention in policy center",
      action: "View retained records",
      secondary: "Appeal decision",
      tone: "warning"
    },
    backupRetention: {
      chip: "Backup retention",
      title: "Backup copies are beyond use",
      body: "The flow says live systems are erased now and backup copies will be overwritten on the published backup schedule.",
      account: "Request ERS-2048",
      data: "Live account data erased",
      retained: "Backups beyond use until overwrite",
      billing: "Receipts retained separately",
      linked: "No token access in backups",
      status: "Backup overwrite pending",
      recovery: "No account recovery after completion",
      action: "View backup policy",
      secondary: "Download receipt"
    },
    webLink: {
      chip: "Web deletion link",
      title: "Public deletion request page works after uninstall",
      body: "A direct web resource lets users request account and data deletion without reinstalling the app.",
      account: "Sign in to identify account",
      data: "Request account and associated data deletion",
      retained: "Retention disclosed before submit",
      billing: "Billing email required",
      linked: "App name and developer shown",
      status: "Web request form available",
      recovery: "Request receipt by email",
      action: "Open web request",
      secondary: "Back to app"
    },
    supportRequired: {
      chip: "Support-required flow",
      title: "Regulated account needs assisted checks",
      body: "The flow explains why support must verify identity, what data will be reviewed, and how the request can be tracked.",
      account: "Health account: maya.chen@example.com",
      data: "Medical records require assisted erasure review",
      retained: "Regulatory retention applies",
      billing: "No active subscription",
      linked: "Care-team recipients may need notification",
      status: "Support case opened",
      recovery: "Case ID SUP-2048",
      action: "Open support case",
      secondary: "Cancel request",
      tone: "warning"
    },
    wrongAccount: {
      chip: "Wrong-account block",
      title: "Signed-in account changed",
      body: "The final delete action is blocked because the browser switched from maya.chen@example.com to maya.personal@example.com.",
      account: "Expected maya.chen@example.com",
      data: "Deletion scope hidden until account matches",
      retained: "No request submitted",
      billing: "Billing review paused",
      linked: "Provider mismatch",
      status: "Blocked: wrong account",
      recovery: "Sign in as the target account",
      action: "Switch account",
      secondary: "Keep account",
      tone: "danger"
    },
    enterprise: {
      chip: "Enterprise-managed account",
      title: "Deletion is managed by organization policy",
      body: "The account belongs to Aster Finance, so the page shows admin owner, policy route, export limits, and personal data request path.",
      account: "maya.chen@aster.example",
      data: "Workspace-owned data follows admin policy",
      retained: "Audit and compliance data retained",
      billing: "Enterprise seat managed by admin",
      linked: "SSO and SCIM controlled",
      status: "Admin approval required",
      recovery: "Contact workspace owner",
      action: "Request deletion",
      secondary: "View policy",
      tone: "warning"
    },
    child: {
      chip: "Child account",
      title: "Guardian review required",
      body: "The child-account state names guardian consent, data collected from a child, and the special erasure handling before request submission.",
      account: "Child account under family group",
      data: "Child profile and app activity",
      retained: "Safety records reviewed separately",
      billing: "Family subscription active",
      linked: "Guardian notifications",
      status: "Guardian approval required",
      recovery: "Family manager can cancel",
      action: "Request guardian approval",
      secondary: "Keep account",
      tone: "warning"
    },
    mobile: {
      chip: "Mobile compact deletion",
      title: "Account closure remains readable",
      body: "The compact flow keeps identity, affected services, retained data, export-first, confirmation, and recovery window visible without hiding deletion behind support.",
      account: "maya.chen@example.com",
      data: "Profile, files, messages",
      retained: "Invoices retained",
      billing: "Renewal canceled",
      linked: "3 apps revoked",
      status: "Scheduled",
      recovery: "14 days",
      action: "View receipt",
      secondary: "Cancel deletion",
      compact: true
    }
  };
  const item = config[mode];
  const titleId = `delete-account-title-${idSuffix}`;
  const descId = `delete-account-desc-${idSuffix}`;

  return (
    <section className={`delete-account-panel is-${mode} ${item.tone ? `is-${item.tone}` : ""} ${item.compact ? "is-compact" : ""}`} aria-labelledby={titleId} aria-describedby={descId}>
      <div className="delete-account-panel-head">
        <div>
          <span>{item.chip}</span>
          <strong id={titleId}>{item.title}</strong>
        </div>
        <b>{item.status}</b>
      </div>
      <p id={descId}>{item.body}</p>
      <div className="delete-account-evidence-grid" aria-label="Delete account review fields">
        <span><b>Account</b>{item.account}</span>
        <span><b>Deleted data</b>{item.data}</span>
        <span><b>Retained data</b>{item.retained}</span>
        <span><b>Billing/subscription</b>{item.billing}</span>
        <span><b>Linked services</b>{item.linked}</span>
        <span><b>Request status</b>{item.status}</span>
        <span><b>Recovery/cancel</b>{item.recovery}</span>
        <span><b>Receipt</b>Deletion request DEL-2048</span>
      </div>
      <div className="delete-account-actions">
        <button type="button" className="demo-button small primary">{item.action}</button>
        <button type="button" className="demo-button small">{item.secondary}</button>
        <button type="button" className="demo-button small">Download data first</button>
      </div>
    </section>
  );
}

function DeleteAccountGoodUi() {
  return (
    <div className="quality-example delete-account-demo">
      <DeleteAccountPanel mode="identity" idSuffix="good-ui" />
      <p className="demo-status">Account closure workflow UI names the account, affected services, deleted data, retained data, billing state, linked apps, recovery window, and deletion request receipt before commitment.</p>
    </div>
  );
}

function DeleteAccountBadUi() {
  return (
    <div className="bad-ui-sample delete-account-bad-demo is-hiddenDelete">
      <div className="delete-account-broken" aria-label="Broken delete account">
        <strong>Delete</strong>
        <p>No account identity, associated data, retained data, linked apps, subscription warning, export-first route, recovery window, request ID, or status.</p>
        <div className="delete-account-broken-grid">
          <span>Hidden in support</span>
          <span>Deactivate only</span>
          <span>No retention policy</span>
        </div>
        <button type="button" className="demo-button small danger">Delete now</button>
      </div>
      <p className="demo-status">The broken UI hides account deletion scope and gives no proof that personal data deletion was requested.</p>
    </div>
  );
}

function DeleteAccountGoodUx() {
  const [mode, setMode] = useState<DeleteAccountMode>("identity");
  return (
    <div className="quality-example delete-account-demo">
      <div className="delete-account-controls" aria-label="Delete account exercise controls">
        {deleteAccountGoodLabels.map(([key, label]) => (
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
      <DeleteAccountPanel mode={mode} idSuffix="good-ux" />
      <p className="demo-status" aria-live="polite">Delete account state: {deleteAccountGoodLabels.find(([key]) => key === mode)?.[1]}.</p>
    </div>
  );
}

function DeleteAccountBadUx() {
  const [mode, setMode] = useState<DeleteAccountBadMode>("hiddenDelete");
  const copy: Record<DeleteAccountBadMode, {
    title: string;
    body: string;
    fieldA: string;
    fieldB: string;
    fieldC: string;
    outcome: string;
  }> = {
    hiddenDelete: {
      title: "Hidden delete",
      body: "Account deletion is buried in FAQs and support search even though account creation is self-serve.",
      fieldA: "No settings entry",
      fieldB: "No web link",
      fieldC: "No request ID",
      outcome: "Users cannot exercise account deletion without guessing where to ask."
    },
    deactivateOnly: {
      title: "Deactivate only",
      body: "The product disables login but keeps the profile, messages, tokens, and app data active in backend systems.",
      fieldA: "Login disabled",
      fieldB: "Profile retained",
      fieldC: "Tokens active",
      outcome: "Deactivation is misrepresented as account deletion."
    },
    exportConfusion: {
      title: "Export confusion",
      body: "Download my data is placed as the final account deletion action, implying export erases source data.",
      fieldA: "Export button",
      fieldB: "No delete status",
      fieldC: "Source remains",
      outcome: "Users mistake data export for account erasure."
    },
    wrongAccount: {
      title: "Wrong account",
      body: "A multi-account session shows a delete button without the account email, provider, workspace, or child-account identity.",
      fieldA: "Account hidden",
      fieldB: "Provider hidden",
      fieldC: "No blocker",
      outcome: "Users can close the wrong identity-bearing account."
    },
    retentionMystery: {
      title: "Retention mystery",
      body: "The page promises everything is gone immediately while backups, invoices, fraud logs, legal holds, and public recipients remain undisclosed.",
      fieldA: "All gone",
      fieldB: "Backups hidden",
      fieldC: "No exceptions",
      outcome: "The erasure claim is stronger than the actual data lifecycle."
    },
    subscriptionSurprise: {
      title: "Subscription surprise",
      body: "Account closure proceeds without warning that an app-store subscription, workspace billing owner, or purchase entitlement needs separate handling.",
      fieldA: "Plan still renews",
      fieldB: "Owner removed",
      fieldC: "No transfer",
      outcome: "Billing and access break after the account is closed."
    },
    supportOnly: {
      title: "Support only",
      body: "Users must email support with no direct deletion page, no identity verification status, no expected timing, and no receipt.",
      fieldA: "Email us",
      fieldB: "No status",
      fieldC: "No timing",
      outcome: "A support queue replaces a discoverable account-control workflow."
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example delete-account-bad-demo is-${mode}`}>
      <div className="delete-account-controls" aria-label="Delete account misuse controls">
        {deleteAccountBadLabels.map(([key, label]) => (
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
      <div className="delete-account-broken" aria-label={`Broken state: ${item.title}`}>
        <strong>{item.title}</strong>
        <p>{item.body}</p>
        <div className="delete-account-broken-grid">
          <span>{item.fieldA}</span>
          <span>{item.fieldB}</span>
          <span>{item.fieldC}</span>
        </div>
        <button type="button" className="demo-button small danger">{mode === "supportOnly" ? "Email support" : "Continue"}</button>
      </div>
      <p className="demo-status" aria-live="polite">{item.outcome}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DeleteAccountGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DeleteAccountBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DeleteAccountGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DeleteAccountBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
