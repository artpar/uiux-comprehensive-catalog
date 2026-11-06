import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type OfficialSiteBannerMode =
  | "collapsed"
  | "domainDetails"
  | "httpsDetails"
  | "everyPage"
  | "agencyIdentity"
  | "mobile"
  | "bilingual"
  | "nonEligible"
  | "insecureBlocked"
  | "stagingWarning"
  | "withSiteAlert"
  | "withServiceNav";

type OfficialSiteBannerBadMode =
  | "copiedPrivate"
  | "footerOnly"
  | "dismissibleProof"
  | "maintenanceMessage"
  | "httpSecureClaim"
  | "navigationMix";

const officialSiteGoodLabels: Array<[OfficialSiteBannerMode, string]> = [
  ["collapsed", "Collapsed official identity"],
  ["domainDetails", "Expanded domain details"],
  ["httpsDetails", "Expanded HTTPS details"],
  ["everyPage", "Every-page top placement"],
  ["agencyIdentity", "Agency identity"],
  ["mobile", "Mobile compact banner"],
  ["bilingual", "Bilingual identity"],
  ["nonEligible", "Non-eligible domain"],
  ["insecureBlocked", "Insecure connection blocked"],
  ["stagingWarning", "Staging warning"],
  ["withSiteAlert", "Coexists with site alert"],
  ["withServiceNav", "Coexists with service navigation"]
];

const officialSiteBadLabels: Array<[OfficialSiteBannerBadMode, string]> = [
  ["copiedPrivate", "Copied to private site"],
  ["footerOnly", "Footer-only identity"],
  ["dismissibleProof", "Dismissible proof"],
  ["maintenanceMessage", "Maintenance message"],
  ["httpSecureClaim", "HTTP secure claim"],
  ["navigationMix", "Navigation mix"]
];

function OfficialSiteBannerPanel({ mode, idSuffix }: { mode: OfficialSiteBannerMode; idSuffix: string }) {
  const config: Record<OfficialSiteBannerMode, {
    chip: string;
    title: string;
    body: string;
    domain: string;
    security: string;
    placement: string;
    eligibility: string;
    below: string;
    primary: string;
    secondary: string;
    tone?: "ready" | "warning" | "danger";
    compact?: boolean;
  }> = {
    collapsed: {
      chip: "Official-site banner",
      title: "Collapsed official identity appears before the header",
      body: "The banner is the first surface and tells users this is an official government website before they reach the service.",
      domain: ".gov domain; trusted domain",
      security: "HTTPS required",
      placement: "Top of every page",
      eligibility: "Production government site",
      below: "Header follows below",
      primary: "Here's how you know",
      secondary: "Continue to service"
    },
    domainDetails: {
      chip: "Domain details",
      title: "Expanded domain details teach what users can verify",
      body: "The detail panel explains that an approved trusted domain belongs to an official organization.",
      domain: ".gov or .mil explained",
      security: "Check address bar",
      placement: "Details below banner",
      eligibility: "Approved domain",
      below: "Service remains available",
      primary: "Show domain details",
      secondary: "Open domain policy",
      tone: "ready"
    },
    httpsDetails: {
      chip: "HTTPS details",
      title: "Expanded HTTPS details explain secure connection signs",
      body: "The banner explains lock and HTTPS indicators without claiming safety beyond the current connection.",
      domain: "Official domain",
      security: "HTTPS and lock",
      placement: "Above header",
      eligibility: "Valid certificate",
      below: "Sensitive form below",
      primary: "Show HTTPS details",
      secondary: "Check connection",
      tone: "ready"
    },
    everyPage: {
      chip: "Every-page placement",
      title: "The banner persists across route changes",
      body: "Home, apply, status, and help pages all keep the official identity banner before local service UI.",
      domain: "benefits.gov",
      security: "Secure",
      placement: "Home, Apply, Status, Help",
      eligibility: "All pages eligible",
      below: "Route changed",
      primary: "Go to Status",
      secondary: "Go to Help"
    },
    agencyIdentity: {
      chip: "Agency identity",
      title: "Agency branding stays below official proof",
      body: "The official-site banner proves government status; the agency header and service name appear below it.",
      domain: "agency.gov",
      security: "HTTPS",
      placement: "Above agency header",
      eligibility: "Agency owned",
      below: "Agency header",
      primary: "View agency header",
      secondary: "Open service nav"
    },
    mobile: {
      chip: "Mobile compact banner",
      title: "Compact banner keeps verification readable",
      body: "Domain and HTTPS details stack without horizontal scrolling or pushing the service header into an unreadable layout.",
      domain: ".gov shown",
      security: "Lock explained",
      placement: "Top mobile stack",
      eligibility: "Same rules",
      below: "Mobile service header",
      primary: "Expand details",
      secondary: "Collapse details",
      compact: true
    },
    bilingual: {
      chip: "Bilingual identity",
      title: "Translated official wording keeps the same claim",
      body: "The banner offers bilingual official identity text without changing the legal meaning or domain guidance.",
      domain: ".gov / .gouv",
      security: "HTTPS",
      placement: "Language-aware",
      eligibility: "Approved translation",
      below: "Language selector below",
      primary: "Français",
      secondary: "English"
    },
    nonEligible: {
      chip: "Non-eligible domain",
      title: "Ineligible domains do not render official proof",
      body: "A partner, prototype, or commercial domain gets alternate identity copy instead of an official-site claim.",
      domain: "example.com blocked",
      security: "May be HTTPS",
      placement: "No official banner",
      eligibility: "Not eligible",
      below: "Partner disclosure",
      primary: "Show fallback",
      secondary: "Fix domain",
      tone: "warning"
    },
    insecureBlocked: {
      chip: "Insecure connection blocked",
      title: "HTTP pages cannot claim secure official status",
      body: "The deployment guard suppresses secure-site language and sends the issue to release blocking.",
      domain: ".gov present",
      security: "HTTP blocked",
      placement: "Release gate",
      eligibility: "Certificate required",
      below: "No sensitive form",
      primary: "Block release",
      secondary: "Renew certificate",
      tone: "danger"
    },
    stagingWarning: {
      chip: "Staging warning",
      title: "Prototype and staging surfaces avoid official claims",
      body: "Internal test pages show environment identity instead of official public-service proof.",
      domain: "staging agency host",
      security: "Internal only",
      placement: "Environment label",
      eligibility: "Not production",
      below: "Tester warning",
      primary: "View staging label",
      secondary: "Open live site",
      tone: "warning"
    },
    withSiteAlert: {
      chip: "With site alert",
      title: "Emergency site alerts stay below identity proof",
      body: "The official-site banner remains first, then the urgent site alert communicates the temporary incident.",
      domain: ".gov explained",
      security: "HTTPS",
      placement: "Banner then alert",
      eligibility: "Eligible",
      below: "Emergency site alert",
      primary: "Read alert",
      secondary: "Expand identity"
    },
    withServiceNav: {
      chip: "With service navigation",
      title: "Service navigation stays separate from official proof",
      body: "The service name, current section, and navigation links appear below the official-site banner and header.",
      domain: ".gov",
      security: "HTTPS",
      placement: "Banner above nav",
      eligibility: "Eligible",
      below: "Service navigation",
      primary: "Open service nav",
      secondary: "Expand identity"
    }
  };
  const item = config[mode];
  const titleId = `official-site-banner-title-${idSuffix}`;
  const descId = `official-site-banner-desc-${idSuffix}`;

  return (
    <section className={`official-site-panel is-${mode} ${item.tone ? `is-${item.tone}` : ""} ${item.compact ? "is-compact" : ""}`} aria-labelledby={titleId} aria-describedby={descId}>
      <div className="official-site-strip">
        <span aria-hidden="true">US</span>
        <div>
          <strong id={titleId}>{item.title}</strong>
          <button type="button">{item.primary}</button>
        </div>
      </div>
      <p id={descId}>{item.body}</p>
      <div className="official-site-detail-grid" aria-label="Official-site banner evidence">
        <span><b>Domain</b>{item.domain}</span>
        <span><b>Security</b>{item.security}</span>
        <span><b>Placement</b>{item.placement}</span>
        <span><b>Eligibility</b>{item.eligibility}</span>
        <span><b>Below banner</b>{item.below}</span>
      </div>
      <div className="official-site-service-shell" aria-label="Page order preview">
        <span>{item.chip}</span>
        <strong>{item.below}</strong>
        <small>Official identity is not mixed with alerts, navigation, or marketing.</small>
      </div>
      <div className="official-site-actions">
        <button type="button" className="demo-button small primary">{item.primary}</button>
        <button type="button" className="demo-button small">{item.secondary}</button>
        <button type="button" className="demo-button small">Audit placement</button>
      </div>
    </section>
  );
}

function OfficialSiteBannerGoodUi() {
  return (
    <div className="quality-example official-site-demo">
      <OfficialSiteBannerPanel mode="collapsed" idSuffix="good-ui" />
      <p className="demo-status">Official-site banner UI proves official identity and secure connection before the header or service content.</p>
    </div>
  );
}

function OfficialSiteBannerBadUi() {
  return (
    <div className="bad-ui-sample official-site-bad-demo is-copiedPrivate">
      <div className="official-site-broken" aria-label="Broken official-site banner">
        <strong>Official government checkout</strong>
        <p>A private vendor domain copies official government banner language and asks for payment details.</p>
        <div className="official-site-broken-grid">
          <span>Commercial domain</span>
          <span>Copied proof</span>
          <span>Misleading trust</span>
        </div>
        <button type="button" className="demo-button small danger">Continue payment</button>
      </div>
      <p className="demo-status">The broken UI uses official identity text where the page cannot prove eligibility.</p>
    </div>
  );
}

function OfficialSiteBannerGoodUx() {
  const [mode, setMode] = useState<OfficialSiteBannerMode>("collapsed");
  return (
    <div className="quality-example official-site-demo">
      <div className="official-site-controls" aria-label="Official-site banner exercise controls">
        {officialSiteGoodLabels.map(([key, label]) => (
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
      <OfficialSiteBannerPanel mode={mode} idSuffix="good-ux" />
      <p className="demo-status" aria-live="polite">Official-site banner state: {officialSiteGoodLabels.find(([key]) => key === mode)?.[1]}.</p>
    </div>
  );
}

function OfficialSiteBannerBadUx() {
  const [mode, setMode] = useState<OfficialSiteBannerBadMode>("copiedPrivate");
  const copy: Record<OfficialSiteBannerBadMode, {
    title: string;
    body: string;
    fieldA: string;
    fieldB: string;
    fieldC: string;
    outcome: string;
  }> = {
    copiedPrivate: {
      title: "Copied to private site",
      body: "A commercial, partner, or prototype page copies official banner text even though it is not eligible.",
      fieldA: "Not .gov",
      fieldB: "Private owner",
      fieldC: "Trust copied",
      outcome: "Users may believe an unaffiliated site is an official service."
    },
    footerOnly: {
      title: "Footer-only identity",
      body: "Official ownership appears only in the footer after forms that request personal information.",
      fieldA: "Below fold",
      fieldB: "After form",
      fieldC: "Too late",
      outcome: "Users cannot verify the site before sharing sensitive data."
    },
    dismissibleProof: {
      title: "Dismissible proof",
      body: "The official identity explanation can be dismissed like a marketing message and disappears across routes.",
      fieldA: "Dismissed",
      fieldB: "No recall",
      fieldC: "Route lost",
      outcome: "A required trust signal becomes unavailable when users need it."
    },
    maintenanceMessage: {
      title: "Maintenance message",
      body: "The identity banner is reused for an outage announcement, hiding the .gov and HTTPS explanation.",
      fieldA: "Outage text",
      fieldB: "No domain detail",
      fieldC: "Mixed scope",
      outcome: "Users lose the official-site proof and the outage belongs in a separate alert."
    },
    httpSecureClaim: {
      title: "HTTP secure claim",
      body: "The page says it is secure while it is served over HTTP or with a broken certificate.",
      fieldA: "HTTP",
      fieldB: "False lock",
      fieldC: "Sensitive form",
      outcome: "The banner contradicts the actual connection state."
    },
    navigationMix: {
      title: "Navigation mix",
      body: "The official-site explanation is placed inside service navigation beside Apply, Status, and Help links.",
      fieldA: "Nav row",
      fieldB: "Mixed purpose",
      fieldC: "No top proof",
      outcome: "Identity proof becomes just another destination instead of a page-level trust signal."
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example official-site-bad-demo is-${mode}`}>
      <div className="official-site-controls" aria-label="Official-site banner misuse controls">
        {officialSiteBadLabels.map(([key, label]) => (
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
      <div className="official-site-broken" aria-label={`Broken state: ${item.title}`}>
        <strong>{item.title}</strong>
        <p>{item.body}</p>
        <div className="official-site-broken-grid">
          <span>{item.fieldA}</span>
          <span>{item.fieldB}</span>
          <span>{item.fieldC}</span>
        </div>
        <button type="button" className="demo-button small danger">{mode === "httpSecureClaim" ? "Submit sensitive data" : "Continue"}</button>
      </div>
      <p className="demo-status" aria-live="polite">{item.outcome}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <OfficialSiteBannerGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <OfficialSiteBannerBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <OfficialSiteBannerGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <OfficialSiteBannerBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
