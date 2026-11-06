import { useState } from "react";
import { QualityPanel, type PatternMeta } from './shared';

type HiddenDeletionMode =
  | "hiddenSettings"
  | "deactivateOnly"
  | "supportOnly"
  | "exportConfusion"
  | "uninstallTrap"
  | "wrongAccount"
  | "oneClickDelete"
  | "retentionHidden"
  | "subscriptionSurprise"
  | "discoverableEntry"
  | "accountScopeReview"
  | "webDeletionResource";

const hiddenDeletionControls: Array<{ mode: HiddenDeletionMode; label: string }> = [
  { mode: "hiddenSettings", label: "Hidden settings" },
  { mode: "deactivateOnly", label: "Deactivation-only" },
  { mode: "supportOnly", label: "Support-only" },
  { mode: "exportConfusion", label: "Export confusion" },
  { mode: "uninstallTrap", label: "Uninstall trap" },
  { mode: "wrongAccount", label: "Wrong account" },
  { mode: "oneClickDelete", label: "One-click delete" },
  { mode: "retentionHidden", label: "Retention hidden" },
  { mode: "subscriptionSurprise", label: "Subscription surprise" },
  { mode: "discoverableEntry", label: "Discoverable entry" },
  { mode: "accountScopeReview", label: "Account-scope review" },
  { mode: "webDeletionResource", label: "Web deletion resource" }
];

const hiddenDeletionCopy: Record<HiddenDeletionMode, {
  title: string;
  status: string;
  body: string;
  path: string;
  account: string;
  data: string;
  proof: string;
  action: string;
  corrected?: boolean;
}> = {
  hiddenSettings: {
    title: "Delete account is not in settings",
    status: "Hidden settings",
    body: "Users can create an account but must search support articles or privacy text to find account deletion.",
    path: "Settings shows Profile, Sign out, Notifications, and Deactivate, but no Delete account entry.",
    account: "Account identity appears only after support contact.",
    data: "Associated data deletion is not described before the request.",
    proof: "No request ID, status, or web deletion route.",
    action: "Search help"
  },
  deactivateOnly: {
    title: "Deactivation is sold as deletion",
    status: "Deactivation-only",
    body: "The product disables login but keeps profile, messages, tokens, and app data active.",
    path: "Account settings has Deactivate account only.",
    account: "maya.chen@example.com remains in backend identity records.",
    data: "Profile and app data retained as active data.",
    proof: "No erasure request or retained-data explanation.",
    action: "Deactivate"
  },
  supportOnly: {
    title: "Support replaces account control",
    status: "Support-only",
    body: "Users must email a support inbox with no identity verification status, owner, timing, receipt, or case route.",
    path: "Contact support to delete your account.",
    account: "Account identity confirmed later by email.",
    data: "Scope depends on support interpretation.",
    proof: "No case ID until an agent replies.",
    action: "Email support"
  },
  exportConfusion: {
    title: "Export is confused with deletion",
    status: "Export confusion",
    body: "Download data appears where Delete account belongs, implying a portable copy erases source data.",
    path: "Privacy dashboard shows Download data as the final account action.",
    account: "Account stays active after export.",
    data: "Archive created; source profile and messages remain.",
    proof: "No deletion receipt or account closure state.",
    action: "Download data"
  },
  uninstallTrap: {
    title: "Deletion requires reinstalling the app",
    status: "Uninstall trap",
    body: "After uninstall, users cannot request deletion because the only deletion route sits inside the removed native app.",
    path: "No public web deletion resource.",
    account: "Sign-in required in app only.",
    data: "Associated data stays until app is reinstalled.",
    proof: "Store disclosure gives no working URL.",
    action: "Reinstall app"
  },
  wrongAccount: {
    title: "The target account is hidden",
    status: "Wrong account",
    body: "A multi-account session exposes Delete without naming email, provider, workspace, or child-account context.",
    path: "Settings row says Delete.",
    account: "Signed-in account not shown.",
    data: "Data scope could belong to another account.",
    proof: "No wrong-account blocker.",
    action: "Continue"
  },
  oneClickDelete: {
    title: "Low-friction destructive commit",
    status: "One-click delete",
    body: "A small settings-row button can delete an account before users review data, billing, linked apps, or recovery.",
    path: "Danger row uses one Delete button.",
    account: "Account identity appears after commit.",
    data: "Data loss is summarized too late.",
    proof: "No verification, typed confirmation, or receipt preview.",
    action: "Delete now"
  },
  retentionHidden: {
    title: "Retention is hidden",
    status: "Retention hidden",
    body: "The page promises all data is gone while backups, invoices, fraud logs, legal holds, public posts, or recipient copies remain undisclosed.",
    path: "Delete account copy says Everything removed.",
    account: "Account closed claim is stronger than reality.",
    data: "Retained records are not listed.",
    proof: "No backup, legal, or recipient status.",
    action: "Delete account"
  },
  subscriptionSurprise: {
    title: "Billing is not handled",
    status: "Subscription surprise",
    body: "Account closure proceeds without warning about app-store renewal, workspace billing owner, purchase entitlement, or transfer requirement.",
    path: "Delete account skips billing review.",
    account: "Workspace owner removed.",
    data: "Personal data deletion is mixed with billing state.",
    proof: "No subscription transfer or cancellation receipt.",
    action: "Close account"
  },
  discoverableEntry: {
    title: "Delete account is easy to find",
    status: "Discoverable entry",
    body: "The corrected account settings surface shows Delete account beside privacy and export handoffs without hiding it in support.",
    path: "Account settings > Account control > Delete account.",
    account: "maya.chen@example.com visible before review.",
    data: "Deletion opens account-scope review, not instant commit.",
    proof: "Deletion route has status and receipt states.",
    action: "Review deletion",
    corrected: true
  },
  accountScopeReview: {
    title: "Account-scope review repairs the risk",
    status: "Account-scope review",
    body: "The corrected flow names identity, associated data, retained data, billing, linked apps, export first, verification, request status, and recovery window.",
    path: "Delete account opens a dedicated workflow.",
    account: "maya.chen@example.com via Google sign-in.",
    data: "Profile, messages, files deleted; invoices and fraud logs retained.",
    proof: "Request DEL-2048 with 14-day recovery.",
    action: "Delete account",
    corrected: true
  },
  webDeletionResource: {
    title: "Web deletion works after uninstall",
    status: "Web deletion resource",
    body: "The corrected product exposes a web route where users can sign in, request deletion, see retention exceptions, and receive a receipt after uninstall.",
    path: "example.com/account/delete.",
    account: "Sign in to choose the account.",
    data: "Associated account and app data request shown.",
    proof: "Email receipt and status URL issued.",
    action: "Open web request",
    corrected: true
  }
};

function HiddenDestructiveAccountDeletionPanel({ mode, meta }: { mode: HiddenDeletionMode; meta?: PatternMeta }) {
  const item = hiddenDeletionCopy[mode];
  const fixed = Boolean(item.corrected);
  return (
    <div className={`hidden-delete-panel ${fixed ? "is-fixed" : "is-broken"} is-${mode}`}>
      <div className="hidden-delete-head">
        <div>
          <span>{meta?.field ?? "Account deletion obstruction"}</span>
          <strong>{item.title}</strong>
        </div>
        <b>{item.status}</b>
      </div>
      <p>{item.body}</p>
      <div className="hidden-delete-grid" aria-label="Hidden destructive account deletion audit">
        <span><b>Path</b>{item.path}</span>
        <span><b>Account</b>{item.account}</span>
        <span><b>Data scope</b>{item.data}</span>
        <span><b>Proof</b>{item.proof}</span>
      </div>
      <div className="hidden-delete-actions">
        <button type="button" className={fixed ? "demo-button small primary" : "demo-button small danger"}>{item.action}</button>
        <button type="button" className="demo-button small">{fixed ? "Download data first" : "Maybe later"}</button>
        {fixed ? <button type="button" className="demo-button small">Keep account</button> : null}
      </div>
    </div>
  );
}

function HiddenDestructiveAccountDeletionGoodUi() {
  return (
    <div className="quality-example hidden-delete-demo">
      <HiddenDestructiveAccountDeletionPanel mode="accountScopeReview" />
      <p className="demo-status">Corrected UI makes account deletion discoverable and separates Delete account from deactivation, export, sign out, privacy settings, and support contact.</p>
    </div>
  );
}

function HiddenDestructiveAccountDeletionBadUi() {
  return (
    <div className="bad-ui-sample hidden-delete-demo">
      <HiddenDestructiveAccountDeletionPanel mode="hiddenSettings" />
      <p className="demo-status">Broken UI hides destructive account deletion and gives no account identity, deletion scope, retained-data disclosure, web route, or request status.</p>
    </div>
  );
}

function HiddenDestructiveAccountDeletionGoodUx({ meta }: { meta: PatternMeta }) {
  const [mode, setMode] = useState<HiddenDeletionMode>("hiddenSettings");
  return (
    <div className={`quality-example hidden-delete-demo is-${mode}`}>
      <HiddenDestructiveAccountDeletionPanel mode={mode} meta={meta} />
      <div className="hidden-delete-controls" aria-label="Hidden destructive account deletion states">
        {hiddenDeletionControls.map(({ mode: key, label }) => (
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
      <p className="demo-status" aria-live="polite">{hiddenDeletionCopy[mode].body}</p>
    </div>
  );
}

function HiddenDestructiveAccountDeletionBadUx() {
  const [mode, setMode] = useState<HiddenDeletionMode>("deactivateOnly");
  const badModes = hiddenDeletionControls.slice(0, 9);
  return (
    <div className={`quality-example hidden-delete-demo is-${mode}`}>
      <HiddenDestructiveAccountDeletionPanel mode={mode} />
      <div className="hidden-delete-failure-controls" aria-label="Hidden account deletion failure states">
        {badModes.map(({ mode: key, label }) => (
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
      <p className="demo-status" aria-live="polite">{hiddenDeletionCopy[mode].proof} This should not count as a completed account deletion route.</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <HiddenDestructiveAccountDeletionGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <HiddenDestructiveAccountDeletionBadUi />;
}

function GoodUxExample({ meta }: { patternId: string; meta: PatternMeta }) {
  return <HiddenDestructiveAccountDeletionGoodUx meta={meta} />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <HiddenDestructiveAccountDeletionBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
