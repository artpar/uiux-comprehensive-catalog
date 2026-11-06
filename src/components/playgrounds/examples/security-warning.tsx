import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type SecurityWarningMode =
  | "safePath"
  | "phishing"
  | "deceptive"
  | "malware"
  | "download"
  | "certificate"
  | "insecure"
  | "mixedForm"
  | "redirect"
  | "lookalike"
  | "preview"
  | "publisher"
  | "details"
  | "override"
  | "policy"
  | "falsePositive"
  | "safeReturn"
  | "mobile";

type SecurityWarningBadMode =
  | "vague"
  | "continuePrimary"
  | "afterExposure"
  | "noDestination"
  | "fakeUrgency"
  | "reportRequiresVisit"
  | "logsSecrets";

const securityWarningGoodLabels: Array<[SecurityWarningMode, string]> = [
  ["safePath", "Safe path"],
  ["phishing", "Phishing warning"],
  ["deceptive", "Deceptive-site warning"],
  ["malware", "Malware warning"],
  ["download", "Dangerous download warning"],
  ["certificate", "Invalid certificate"],
  ["insecure", "Insecure connection"],
  ["mixedForm", "Mixed-content form"],
  ["redirect", "Suspicious redirect"],
  ["lookalike", "Lookalike domain"],
  ["preview", "File preview blocked"],
  ["publisher", "Unknown publisher"],
  ["details", "Details expanded"],
  ["override", "Override requested"],
  ["policy", "Policy blocked"],
  ["falsePositive", "False-positive report"],
  ["safeReturn", "Safe return"],
  ["mobile", "Mobile compact"]
];

const securityWarningBadLabels: Array<[SecurityWarningBadMode, string]> = [
  ["vague", "Vague security issue"],
  ["continuePrimary", "Continue primary"],
  ["afterExposure", "After exposure"],
  ["noDestination", "No destination"],
  ["fakeUrgency", "Fake urgency"],
  ["reportRequiresVisit", "Report requires visit"],
  ["logsSecrets", "Logs secrets"]
];

function SecurityWarningFrame({ mode = "safePath", idSuffix = "static" }: { mode?: SecurityWarningMode; idSuffix?: string }) {
  const config: Record<SecurityWarningMode, {
    chip: string;
    title: string;
    destination: string;
    body: string;
    evidence: string;
    primary: string;
    secondary: string;
    detail: string;
    state: string;
    compact?: boolean;
    blocked?: boolean;
    override?: boolean;
  }> = {
    safePath: {
      chip: "Safe path",
      title: "Back to safety is the primary action",
      destination: "payroll.example-secure.com",
      body: "The destination has been stopped before any credential, payment, or recovery-code entry.",
      evidence: "Threat verdict: suspicious login page",
      primary: "Back to safety",
      secondary: "View details",
      detail: "The safe path returns to the trusted payroll dashboard and preserves the original link for reporting.",
      state: "Safe return available"
    },
    phishing: {
      chip: "Phishing warning",
      title: "Phishing page may steal passwords",
      destination: "payro11.example-login.net",
      body: "This link looks like a payroll sign-in page but was reported for credential theft.",
      evidence: "Safe Browsing: phishing",
      primary: "Back to safety",
      secondary: "Report link",
      detail: "The warning names the domain mismatch before the page can ask for a password.",
      state: "Credential entry blocked",
      blocked: true
    },
    deceptive: {
      chip: "Deceptive-site warning",
      title: "Deceptive site ahead",
      destination: "benefits-verify.example.org",
      body: "Attackers may try to trick you into giving personal information or installing unwanted software.",
      evidence: "Social engineering signal",
      primary: "Back to safety",
      secondary: "Details",
      detail: "The warning explains the social-engineering risk without asking for any secret.",
      state: "Navigation interrupted",
      blocked: true
    },
    malware: {
      chip: "Malware warning",
      title: "Malware suspected on this site",
      destination: "updates.example-downloads.biz",
      body: "The site may install harmful software or change browser settings without permission.",
      evidence: "Malware host list match",
      primary: "Leave site",
      secondary: "Report site",
      detail: "Site content remains blocked until the user leaves or an allowed administrator path exists.",
      state: "Site blocked",
      blocked: true
    },
    download: {
      chip: "Dangerous download warning",
      title: "File blocked: dangerous download",
      destination: "invoice-viewer.dmg",
      body: "The downloaded file has unsafe reputation and could harm this device.",
      evidence: "File reputation unknown and unsigned",
      primary: "Remove download",
      secondary: "Details",
      detail: "The file is quarantined before open, preview, or install actions are available.",
      state: "Download quarantined",
      blocked: true
    },
    certificate: {
      chip: "Invalid certificate",
      title: "This connection cannot be trusted",
      destination: "admin.finance.example",
      body: "The certificate does not match this site, so another server may be impersonating it.",
      evidence: "Certificate host mismatch",
      primary: "Go back",
      secondary: "Certificate details",
      detail: "The certificate problem is explained before account data can be sent.",
      state: "TLS trust failed",
      blocked: true
    },
    insecure: {
      chip: "Insecure connection",
      title: "Connection is not secure",
      destination: "http://benefits.example",
      body: "Information entered on this page could be seen or changed in transit.",
      evidence: "No HTTPS on public site",
      primary: "Use secure site",
      secondary: "Cancel",
      detail: "The warning routes users to HTTPS or a trusted alternate rather than accepting credentials over HTTP.",
      state: "Transport not protected"
    },
    mixedForm: {
      chip: "Mixed-content form",
      title: "Cancel unsafe form submission",
      destination: "http://forms.example/submit",
      body: "This secure page is about to send personal data to an untrusted form action.",
      evidence: "Form action is not potentially trustworthy",
      primary: "Cancel submission",
      secondary: "Save draft",
      detail: "The draft remains safe while the insecure submission is stopped.",
      state: "Submission aborted"
    },
    redirect: {
      chip: "Suspicious redirect",
      title: "Unexpected redirect stopped",
      destination: "signin.example.com -> signin-example.com.ru",
      body: "The link changed destinations before sign-in and now points outside the expected domain.",
      evidence: "Redirect target changed domain",
      primary: "Stay on trusted site",
      secondary: "Report redirect",
      detail: "The redirect target is visible so users can compare it with the trusted route.",
      state: "Redirect held"
    },
    lookalike: {
      chip: "Lookalike domain",
      title: "Did you mean the trusted site?",
      destination: "micros0ft-support.example",
      body: "This address is visually similar to a site you often use but is not the same domain.",
      evidence: "Lookalike URL detected",
      primary: "Open trusted site",
      secondary: "Details",
      detail: "The warning prevents typo-squatting from looking like routine navigation.",
      state: "Trusted route offered"
    },
    preview: {
      chip: "File preview blocked",
      title: "Preview blocked for internet file",
      destination: "quarterly-report.html",
      body: "Preview is disabled because this file came from the internet and could run active content.",
      evidence: "Downloaded-from-internet mark",
      primary: "Keep blocked",
      secondary: "Open in sandbox",
      detail: "The preview pane explains why content is not rendered directly.",
      state: "Preview blocked"
    },
    publisher: {
      chip: "Unknown publisher",
      title: "Unknown publisher",
      destination: "remote-support.exe",
      body: "The app is unsigned or has no established reputation, so installation is stopped for review.",
      evidence: "Publisher signature missing",
      primary: "Do not run",
      secondary: "Ask admin",
      detail: "The warning separates publisher reputation from ordinary download progress.",
      state: "Install held"
    },
    details: {
      chip: "Details expanded",
      title: "Risk details before override",
      destination: "payro11.example-login.net",
      body: "The destination was reported for phishing and may steal passwords, recovery codes, or card numbers.",
      evidence: "Detection source, domain, redirect target, and report time shown",
      primary: "Back to safety",
      secondary: "Hide details",
      detail: "Details explain why override is risky before any secondary Visit unsafe site action appears.",
      state: "Evidence visible"
    },
    override: {
      chip: "Override requested",
      title: "Visit unsafe site?",
      destination: "payro11.example-login.net",
      body: "Continuing may expose credentials or install unwanted software. This action can be audited.",
      evidence: "Override requires risk acknowledgement",
      primary: "Back to safety",
      secondary: "Visit unsafe site",
      detail: "Override is secondary, explicit, and presented only after the risk details.",
      state: "Override pending",
      override: true
    },
    policy: {
      chip: "Policy blocked",
      title: "Organization blocked this override",
      destination: "remote-support.exe",
      body: "Your organization blocks this file because of malware and unknown-publisher risk.",
      evidence: "Policy: high-risk download block",
      primary: "Contact admin",
      secondary: "Remove file",
      detail: "The state explains policy boundaries instead of leaving a disabled Continue button.",
      state: "Override unavailable",
      blocked: true
    },
    falsePositive: {
      chip: "False-positive report",
      title: "Report a safe-site mistake",
      destination: "benefits-vendor.example",
      body: "You can report that the site was flagged incorrectly without visiting it.",
      evidence: "Report includes URL and warning ID only",
      primary: "Submit report",
      secondary: "Back to safety",
      detail: "False-positive reporting is separated from Visit anyway.",
      state: "Report path available"
    },
    safeReturn: {
      chip: "Safe return",
      title: "Returned to trusted route",
      destination: "payroll.example-secure.com",
      body: "The unsafe tab is closed, the original task remains intact, and the suspicious link is ready to report.",
      evidence: "No credentials sent",
      primary: "Continue payroll",
      secondary: "Report link",
      detail: "Safe return preserves task context while removing dangerous content from view.",
      state: "Trusted route restored"
    },
    mobile: {
      chip: "Mobile compact",
      title: "Deceptive site ahead",
      destination: "payro11.example-login.net",
      body: "Risk, destination, primary safe action, details, and report route remain readable in compact width.",
      evidence: "Phishing, lookalike domain",
      primary: "Back to safety",
      secondary: "Details",
      detail: "Mobile compact keeps the domain, risk, and safe action from truncating.",
      state: "Compact safe path",
      compact: true
    }
  };
  const item = config[mode];
  const titleId = `security-warning-title-${idSuffix}`;
  const descId = `security-warning-desc-${idSuffix}`;

  return (
    <div className={`security-warning-frame is-${mode} ${item.compact ? "is-compact" : ""} ${item.blocked ? "is-blocked" : ""}`}>
      <section className="security-warning-card" aria-labelledby={titleId} aria-describedby={descId}>
        <div className="security-warning-head">
          <span className="security-warning-symbol" aria-hidden="true">!</span>
          <div>
            <span>{item.chip}</span>
            <strong id={titleId}>{item.title}</strong>
          </div>
        </div>
        <p id={descId}>{item.body}</p>
        <div className="security-warning-destination">
          <span>Destination or object</span>
          <strong>{item.destination}</strong>
        </div>
        <div className="security-warning-evidence-grid" aria-label="Security warning evidence">
          <div><span>Evidence</span><strong>{item.evidence}</strong></div>
          <div><span>State</span><strong>{item.state}</strong></div>
          <div><span>Safe action</span><strong>{item.primary}</strong></div>
          <div><span>Risk detail</span><strong>{item.detail}</strong></div>
        </div>
        <div className="security-warning-actions">
          <button type="button" className="demo-button small primary">{item.primary}</button>
          <button type="button" className={item.override ? "demo-button small danger" : "demo-button small"}>{item.secondary}</button>
        </div>
      </section>
      <aside className="security-warning-report" aria-label="Security warning report">
        <span>{item.override ? "Override audit" : item.blocked ? "Protection active" : "Report and recovery"}</span>
        <strong>{item.state}</strong>
        <p>{item.detail}</p>
      </aside>
    </div>
  );
}

function SecurityWarningGoodUi() {
  return (
    <div className="quality-example security-warning-demo-shell">
      <SecurityWarningFrame mode="phishing" idSuffix="good-ui" />
      <p className="demo-status">The UI names the phishing warning, shows the unsafe destination, makes Back to safety primary, and keeps reporting separate from unsafe override.</p>
    </div>
  );
}

function SecurityWarningBadUi() {
  return (
    <div className="bad-ui-sample security-warning-bad-ui">
      <section className="security-warning-card bad" aria-label="Broken security warning">
        <div className="security-warning-head">
          <span className="security-warning-symbol" aria-hidden="true">!</span>
          <div>
            <span>Vague security issue</span>
            <strong>Something may be unsafe</strong>
          </div>
        </div>
        <p>The destination, threat type, evidence, safe path, report route, and policy boundary are hidden.</p>
        <div className="security-warning-actions">
          <button type="button" className="demo-button small primary">Continue</button>
          <button type="button" className="demo-button small">Cancel</button>
        </div>
      </section>
      <p className="demo-status">The broken UI makes Continue primary and never says phishing, malware, certificate, insecure connection, redirect, download, or file preview risk.</p>
    </div>
  );
}

function SecurityWarningGoodUx() {
  const [mode, setMode] = useState<SecurityWarningMode>("safePath");
  return (
    <div className="quality-example security-warning-demo-shell">
      <div className="demo-row security-warning-controls" aria-label="Security warning exercise controls">
        {securityWarningGoodLabels.map(([key, label]) => (
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
      <SecurityWarningFrame mode={mode} idSuffix="good-ux" />
      <p className="demo-status" aria-live="polite">Security warning state: {securityWarningGoodLabels.find(([key]) => key === mode)?.[1]}.</p>
    </div>
  );
}

function SecurityWarningBadUx() {
  const [mode, setMode] = useState<SecurityWarningBadMode>("vague");
  const copy: Record<SecurityWarningBadMode, {
    title: string;
    body: string;
    destination: string;
    outcome: string;
  }> = {
    vague: {
      title: "Vague security issue",
      body: "The warning says Security issue without naming phishing, malware, certificate, insecure connection, dangerous download, redirect, or file preview risk.",
      destination: "Unknown",
      outcome: "Users cannot tell what risk they are accepting."
    },
    continuePrimary: {
      title: "Continue primary",
      body: "Continue is styled as the primary action while Back to safety is a low-contrast link.",
      destination: "payro11.example-login.net",
      outcome: "The UI normalizes unsafe continuation."
    },
    afterExposure: {
      title: "After exposure",
      body: "The warning appears only after the page collects a password and recovery code.",
      destination: "Loaded phishing page",
      outcome: "Credential entry already happened before the interruption."
    },
    noDestination: {
      title: "No destination",
      body: "The warning hides the suspicious domain, file name, redirect target, and publisher.",
      destination: "Hidden",
      outcome: "Users cannot compare the unsafe object to the trusted route."
    },
    fakeUrgency: {
      title: "Fake urgency",
      body: "Marketing copy uses a severe security warning to pressure upgrade payment.",
      destination: "Upgrade modal",
      outcome: "Fake urgency trains users to ignore real security warnings."
    },
    reportRequiresVisit: {
      title: "Report requires visit",
      body: "The false-positive path is available only after visiting the unsafe destination.",
      destination: "Unsafe site required",
      outcome: "Users are pushed through risk just to report a mistake."
    },
    logsSecrets: {
      title: "Logs secrets",
      body: "The warning evidence includes raw password, token, card number, or recovery code values.",
      destination: "Support payload",
      outcome: "The warning creates a new sensitive-data leak."
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example security-warning-bad-ux is-${mode}`}>
      <div className="demo-row security-warning-controls" aria-label="Security warning misuse controls">
        {securityWarningBadLabels.map(([key, label]) => (
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
      <section className="security-warning-card bad" aria-label={`Broken state: ${item.title}`}>
        <div className="security-warning-head">
          <span className="security-warning-symbol" aria-hidden="true">!</span>
          <div>
            <span>{item.title}</span>
            <strong>{item.destination}</strong>
          </div>
        </div>
        <p>{item.body}</p>
        <div className="security-warning-evidence-grid">
          <div><span>Risk type</span><strong>{mode === "vague" ? "Missing" : "Misrepresented"}</strong></div>
          <div><span>Safe path</span><strong>{mode === "continuePrimary" ? "Demoted" : "Unclear"}</strong></div>
          <div><span>Report route</span><strong>{mode === "reportRequiresVisit" ? "Unsafe visit first" : "Not separated"}</strong></div>
          <div><span>Leak control</span><strong>{mode === "logsSecrets" ? "Raw secrets logged" : "Untested"}</strong></div>
        </div>
        <div className="security-warning-actions">
          <button type="button" className={mode === "continuePrimary" ? "demo-button small primary" : "demo-button small danger"}>Continue</button>
          <button type="button" className="demo-button small">Back</button>
        </div>
      </section>
      <p className="demo-status" aria-live="polite">{item.outcome}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SecurityWarningGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SecurityWarningBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SecurityWarningGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SecurityWarningBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
