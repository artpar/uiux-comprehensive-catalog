import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type LanguageChoice = "en" | "es" | "fr" | "ja" | "pt" | "partial" | "unavailable" | "hint" | "reset";

type LanguageOption = {
  code: LanguageChoice;
  label: string;
  native: string;
  lang: string;
  state: "current" | "available" | "partial" | "unavailable" | "hint";
};

const languageOptions: LanguageOption[] = [
  { code: "en", label: "English", native: "English", lang: "en", state: "current" },
  { code: "es", label: "Spanish", native: "Español", lang: "es", state: "available" },
  { code: "fr", label: "French", native: "Français", lang: "fr", state: "available" },
  { code: "ja", label: "Japanese", native: "日本語", lang: "ja", state: "available" },
  { code: "pt", label: "Portuguese", native: "Português do Brasil", lang: "pt-BR", state: "partial" }
];

const languageCopy: Record<LanguageChoice, { heading: string; status: string; lang: string; label: string }> = {
  en: {
    heading: "Benefits application",
    status: "Current page language is English. Form draft and selected section are preserved.",
    lang: "en",
    label: "English"
  },
  es: {
    heading: "Solicitud de beneficios",
    status: "Español selected for this page. The same route, draft, and signed-in session remain active.",
    lang: "es",
    label: "Español"
  },
  fr: {
    heading: "Demande de prestations",
    status: "Français selected. Explicit choice is saved and will not be replaced by browser language hints.",
    lang: "fr",
    label: "Français"
  },
  ja: {
    heading: "給付申請",
    status: "日本語 selected with language metadata for the translated heading and option label.",
    lang: "ja",
    label: "日本語"
  },
  pt: {
    heading: "Pedido de benefícios",
    status: "Português do Brasil selected where the page has an equivalent translation.",
    lang: "pt-BR",
    label: "Português do Brasil"
  },
  partial: {
    heading: "Benefits application",
    status: "Português do Brasil is marked partial before selection because support articles are not fully translated.",
    lang: "en",
    label: "Partial translation"
  },
  unavailable: {
    heading: "Benefits application",
    status: "Deutsch is unavailable for this page, so the selector explains the fallback instead of redirecting home.",
    lang: "en",
    label: "Deutsch unavailable"
  },
  hint: {
    heading: "Benefits application",
    status: "Browser hint suggests Español, but explicit English remains selected until the user changes it.",
    lang: "en",
    label: "Accept-Language hint"
  },
  reset: {
    heading: "Benefits application",
    status: "Language reset cleared explicit choice and returned to system default without clearing the form draft.",
    lang: "en",
    label: "System default"
  }
};

function LanguageSelectorPanel({
  current,
  menu = true,
  draft = true
}: {
  current: LanguageChoice;
  menu?: boolean;
  draft?: boolean;
}) {
  const copy = languageCopy[current];

  return (
    <section className={`language-selector-panel is-${current}`} lang={copy.lang} aria-label="Language selector demo page">
      <header className="language-selector-header">
        <div>
          <strong>{copy.heading}</strong>
          <span>{copy.status}</span>
        </div>
        <span className="language-selector-current">Current: <span lang={copy.lang}>{copy.label}</span></span>
      </header>
      {menu ? (
        <div className="language-selector-menu" aria-label="Available languages">
          {languageOptions.map((option) => (
            <button key={option.code} type="button" className={`demo-button small is-${option.state}`}>
              <span lang={option.lang}>{option.native}</span>
              <span>{option.state === "partial" ? "Partial" : option.code === current ? "Current" : "Equivalent"}</span>
            </button>
          ))}
          <button type="button" className="demo-button small is-unavailable">
            <span lang="de">Deutsch</span>
            <span>Unavailable</span>
          </button>
        </div>
      ) : (
        <div className="language-selector-two" aria-label="Two language switch">
          <button type="button" className="demo-button small primary"><span lang="en">English</span></button>
          <button type="button" className="demo-button small"><span lang="es">Español</span></button>
        </div>
      )}
      <div className="language-selector-form">
        <label>
          <span>{current === "es" ? "Nombre del solicitante" : current === "fr" ? "Nom du demandeur" : "Applicant name"}</span>
          <input value="Mira Patel" readOnly />
        </label>
        <label>
          <span>{current === "es" ? "Sección" : current === "fr" ? "Section" : "Selected section"}</span>
          <input value={draft ? "Medical evidence draft" : "Draft cleared"} readOnly />
        </label>
      </div>
    </section>
  );
}

function LanguageSelectorGoodUi() {
  return (
    <div className="quality-example language-selector-demo">
      <LanguageSelectorPanel current="en" menu />
      <p className="demo-status">The selector shows current language, native labels, Accept-Language override behavior, equivalent and partial states, unavailable German, correct language attributes, and a preserved form draft.</p>
    </div>
  );
}

function LanguageSelectorBadUi() {
  return (
    <div className="bad-ui-sample language-selector-bad-demo is-flag-only">
      <div className="language-selector-broken-grid">
        {["🇺🇸", "🇲🇽", "🇧🇷", "??"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <p className="demo-status">The broken UI relies on flags and unclear symbols, so users cannot distinguish language, region, script, availability, or current state.</p>
    </div>
  );
}

function LanguageSelectorGoodUx() {
  const [current, setCurrent] = useState<LanguageChoice>("en");
  const [menu, setMenu] = useState(true);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("Language changes only text language; route, selected section, session, focus, scroll, and draft stay intact.");

  const choose = (next: LanguageChoice, note: string) => {
    setCurrent(next);
    setMessage(note);
  };

  return (
    <div className="quality-example language-selector-demo">
      <div className="language-selector-toolbar" aria-label="Language selector controls">
        <button type="button" className={!menu ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setMenu(false);
          choose("en", "Two-language switch is used when only English and Español are equivalent for this page.");
        }}>Two languages</button>
        <button type="button" className={menu ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setMenu(true);
          choose("en", "Language menu is used when three or more equivalent or labelled partial choices exist.");
        }}>Language menu</button>
        <button type="button" className={current === "es" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("es", "Español selected on the same route with form draft, authentication, and section state preserved.")}>Español</button>
        <button type="button" className={current === "fr" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("fr", "Français selected and stored as explicit user choice for this site.")}>Français</button>
        <button type="button" className={current === "partial" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("partial", "Partial translation is labelled before selection so users understand what remains in English.")}>Partial</button>
        <button type="button" className={current === "unavailable" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("unavailable", "Unavailable translation explains the fallback instead of sending users to the home page.")}>Unavailable</button>
        <button type="button" className={current === "hint" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("hint", "Accept-Language is treated as a hint and does not override explicit English choice.")}>Browser hint</button>
        <button type="button" className="demo-button small" onClick={() => {
          setSaved(true);
          setMessage("Explicit language choice saved and will remain sticky across internal navigation.");
        }}>Save choice</button>
        <button type="button" className="demo-button small" onClick={() => {
          setSaved(false);
          choose("reset", "Reset returned only language to system default; it did not clear draft, session, or page route.");
        }}>Reset language</button>
        <button type="button" className="demo-button small" onClick={() => setMessage("Selected section, form draft, scroll anchor, and focus target remain after the language change.")}>Preserve draft</button>
      </div>
      <LanguageSelectorPanel current={current} menu={menu} />
      <p className="demo-status" aria-live="polite">{saved ? "Saved explicit language. " : ""}{message}</p>
    </div>
  );
}

function LanguageSelectorBadUx() {
  type Mode = "flag-only" | "context-loss" | "auto-override" | "missing-translation" | "preference-confusion" | "no-lang" | "hidden-control";
  const [mode, setMode] = useState<Mode>("flag-only");
  const copy: Record<Mode, string> = {
    "flag-only": "Flags are used as language labels, confusing country, region, script, and language.",
    "context-loss": "Selecting a language sends the user to the home page and clears the active form draft.",
    "auto-override": "Accept-Language overrides the user's explicit choice again on the next page.",
    "missing-translation": "Unavailable languages look selectable and silently fall back to English after activation.",
    "preference-confusion": "Current-page language is mixed with email language, country, currency, and consent settings.",
    "no-lang": "The page text changes, but lang metadata and alternate-language labels remain wrong.",
    "hidden-control": "The only language control is buried inside account settings that users cannot read."
  };
  const labels: Record<Mode, string[]> = {
    "flag-only": ["🇺🇸", "🇲🇽", "🇧🇷", "??"],
    "context-loss": ["Home", "Draft gone", "Signed out", "Start over"],
    "auto-override": ["Browser says es", "User chose en", "Next page es", "No sticky"],
    "missing-translation": ["Deutsch", "Select", "Fallback", "No warning"],
    "preference-confusion": ["Language", "Country", "Currency", "Email opt-in"],
    "no-lang": ["Texto", "lang=en", "Bad speech", "Wrong label"],
    "hidden-control": ["Settings", "Profile", "More", "Language?"]
  };

  return (
    <div className={`quality-example language-selector-bad-demo is-${mode}`}>
      <div className="language-selector-broken-grid">
        {labels[mode].map((label, index) => (
          <span key={`${label}-${index}`}>{label}</span>
        ))}
      </div>
      <strong>{mode === "preference-confusion" ? "Preference mixed up" : mode === "missing-translation" ? "Translation missing" : "Language failure"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row language-selector-controls">
        <button type="button" className={mode === "flag-only" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("flag-only")}>Flag only</button>
        <button type="button" className={mode === "context-loss" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("context-loss")}>Context loss</button>
        <button type="button" className={mode === "auto-override" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("auto-override")}>Auto override</button>
        <button type="button" className={mode === "missing-translation" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("missing-translation")}>Missing translation</button>
        <button type="button" className={mode === "preference-confusion" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("preference-confusion")}>Preference confusion</button>
        <button type="button" className={mode === "no-lang" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("no-lang")}>No lang</button>
        <button type="button" className={mode === "hidden-control" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hidden-control")}>Hidden control</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <LanguageSelectorGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <LanguageSelectorBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <LanguageSelectorGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <LanguageSelectorBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
