import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type SummaryBoxFact = {
  label: string;
  detail: string;
  bodySection: string;
};

const summaryBoxFacts: SummaryBoxFact[] = [
  {
    label: "Apply by 30 June",
    detail: "Late applications need a support review.",
    bodySection: "Deadline"
  },
  {
    label: "Bring photo ID",
    detail: "Passport, driving licence, or residence permit accepted.",
    bodySection: "Documents"
  },
  {
    label: "Decision in 10 working days",
    detail: "You can track the case after submission.",
    bodySection: "After you apply"
  }
];

function SummaryBoxPanel({
  outdated = false,
  links = "focused"
}: {
  outdated?: boolean;
  links?: "focused" | "none" | "many";
}) {
  const facts = outdated
    ? [{ ...summaryBoxFacts[0], label: "Apply by 15 June", detail: "Outdated date does not match the page body." }, ...summaryBoxFacts.slice(1)]
    : summaryBoxFacts;

  return (
    <section className={`summary-box-panel ${outdated ? "is-outdated" : ""}`} aria-labelledby="summary-box-demo-title">
      <h4 id="summary-box-demo-title">{outdated ? "Before you apply - needs review" : "Before you apply"}</h4>
      <p>Key facts from the full application guide.</p>
      <ul>
        {facts.map((fact) => (
          <li key={fact.bodySection}>
            <strong>{fact.label}</strong>
            <span>{fact.detail}</span>
          </li>
        ))}
      </ul>
      {links === "focused" ? (
        <a href="#summary-box-body">Start application checklist</a>
      ) : links === "many" ? (
        <div className="summary-box-link-dump">
          {["Policy archive", "Office map", "General help", "Partner site", "Appeals", "News"].map((label) => <a key={label} href="#summary-box-body">{label}</a>)}
        </div>
      ) : null}
    </section>
  );
}

function SummaryBoxBody({ highlight = "Deadline" }: { highlight?: string }) {
  return (
    <div id="summary-box-body" className="summary-box-body">
      {summaryBoxFacts.map((fact) => (
        <article key={fact.bodySection} className={highlight === fact.bodySection ? "is-highlighted" : ""}>
          <strong>{fact.bodySection}</strong>
          <span>{fact.label}. {fact.detail}</span>
        </article>
      ))}
    </div>
  );
}

function SummaryBoxGoodUi() {
  return (
    <div className="quality-example summary-box-demo">
      <SummaryBoxPanel />
      <SummaryBoxBody />
      <p className="demo-status">The box has a specific heading, three selective facts, one task link, and matching details in the page body.</p>
    </div>
  );
}

function SummaryBoxBadUi() {
  return (
    <div className="bad-ui-sample summary-box-bad-demo is-tooLong">
      <strong>Important</strong>
      <p>This box repeats the introduction, eligibility rules, office hours, policy background, every document example, contact details, appeal rules, and unrelated page links until it becomes another long page.</p>
      <div className="summary-box-link-dump">
        <a href="#summary-box-body">All forms</a>
        <a href="#summary-box-body">News</a>
        <a href="#summary-box-body">Archive</a>
        <a href="#summary-box-body">Contacts</a>
      </div>
      <p className="demo-status">The broken version is a highlighted dumping ground instead of a short source-faithful summary.</p>
    </div>
  );
}

function SummaryBoxGoodUx() {
  const [outdated, setOutdated] = useState(false);
  const [links, setLinks] = useState<"focused" | "none" | "many">("focused");
  const [highlight, setHighlight] = useState("Deadline");
  const [message, setMessage] = useState("Summary box extracts three key facts from the longer application guide.");

  return (
    <div className="quality-example summary-box-demo">
      <SummaryBoxPanel outdated={outdated} links={links} />
      <SummaryBoxBody highlight={highlight} />
      <div className="demo-row summary-box-controls" aria-label="Summary box exercise controls">
        <button type="button" className="demo-button small" onClick={() => {
          setHighlight("Deadline");
          setMessage("Deadline fact is repeated in the detailed Deadline section.");
        }}>Check deadline</button>
        <button type="button" className="demo-button small" onClick={() => {
          setHighlight("Documents");
          setMessage("Document requirement is summarized first and expanded in the page body.");
        }}>Check documents</button>
        <button type="button" className={outdated ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setOutdated((current) => !current);
          setMessage(outdated ? "Summary date restored to match the detailed page body." : "Editorial review state shown because the summary date no longer matches the body.");
        }}>Toggle review</button>
        <button type="button" className={links === "focused" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setLinks("focused");
          setMessage("Summary keeps one focused task link instead of becoming navigation.");
        }}>Focused link</button>
        <button type="button" className={links === "none" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setLinks("none");
          setMessage("Summary still works without a link when the key facts are the point.");
        }}>No link</button>
        <button type="button" className={links === "many" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setLinks("many");
          setMessage("Too many links turns the summary box into related-links work.");
        }}>Too many links</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function SummaryBoxBadUx() {
  type Mode = "tooLong" | "alertMisuse" | "warningMisuse" | "linkDump" | "hiddenRequired" | "vagueHeading" | "mobileWall";
  const [mode, setMode] = useState<Mode>("tooLong");
  const copy: Record<Mode, string> = {
    tooLong: "The highlighted box repeats the full page and stops reducing scanning effort.",
    alertMisuse: "Static page guidance is styled and announced like an urgent alert.",
    warningMisuse: "A severe consequence is softened into a summary and appears away from the action.",
    linkDump: "Unrelated links turn the box into a navigation dumping ground.",
    hiddenRequired: "A required eligibility rule appears only in the summary and not in the body flow.",
    vagueHeading: "The heading says Important, so users cannot predict what the box helps them do.",
    mobileWall: "Mobile wrapping turns the summary into a wall of highlighted text and links."
  };

  return (
    <div className={`quality-example summary-box-bad-demo is-${mode}`}>
      <strong>{mode === "vagueHeading" ? "Important" : mode === "alertMisuse" ? "Alert" : "Summary"}</strong>
      <p>{copy[mode]}</p>
      <div className="summary-box-link-dump">
        {(mode === "linkDump" || mode === "mobileWall" ? ["Policy", "News", "Archive", "Help", "Office", "Appeal"] : ["Read more", "More details"]).map((label) => (
          <a key={label} href="#summary-box-body">{label}</a>
        ))}
      </div>
      <div className="demo-row summary-box-controls">
        <button type="button" className={mode === "tooLong" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("tooLong")}>Too long</button>
        <button type="button" className={mode === "alertMisuse" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("alertMisuse")}>Alert misuse</button>
        <button type="button" className={mode === "warningMisuse" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("warningMisuse")}>Warning misuse</button>
        <button type="button" className={mode === "linkDump" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("linkDump")}>Link dump</button>
        <button type="button" className={mode === "hiddenRequired" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenRequired")}>Hidden required</button>
        <button type="button" className={mode === "vagueHeading" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("vagueHeading")}>Vague heading</button>
        <button type="button" className={mode === "mobileWall" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mobileWall")}>Mobile wall</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SummaryBoxGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SummaryBoxBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SummaryBoxGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SummaryBoxBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
