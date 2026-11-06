import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

const carouselAutoSlides = [
  {
    name: "Eligibility",
    title: "Eligibility deadline",
    body: "The current campaign slide includes the appeal date, late evidence rule, and a visible continue action.",
    action: "Review deadline"
  },
  {
    name: "Savings",
    title: "Savings recommendation",
    body: "A ranked recommendation keeps the reason, save button, and feedback controls stable while users decide.",
    action: "Save recommendation"
  },
  {
    name: "Form",
    title: "Contact preference",
    body: "A short form remains on screen while the user types, validates, and reviews the selected contact method.",
    action: "Update preference"
  },
  {
    name: "Disclosure",
    title: "Service terms",
    body: "Long copy is kept still so users can read consent, warning, and support details at their own pace.",
    action: "Open terms"
  }
];

type CarouselAutoPauseMode =
  | "pauseFirst"
  | "userStart"
  | "focusStop"
  | "hoverStop"
  | "reducedMotion"
  | "resumeSafely"
  | "slideActionStable"
  | "readingLock"
  | "formEntryLock"
  | "backgroundReturn";

type CarouselAutoPauseBadMode =
  | "noPause"
  | "hiddenPause"
  | "focusIgnored"
  | "hoverIgnored"
  | "reducedMotionIgnored"
  | "readingInterrupted"
  | "formEntryAdvanced"
  | "constantAnnouncements"
  | "feedbackRailRotated";

const carouselAutoGoodCopy: Record<CarouselAutoPauseMode, string> = {
  pauseFirst: "Pause first is first in tab order before previous, next, slide pickers, and campaign actions.",
  userStart: "User-start rotation keeps the carousel paused until Start rotation is explicitly pressed.",
  focusStop: "Focus stop freezes the current slide as soon as keyboard focus enters the campaign carousel.",
  hoverStop: "Hover stop suspends rotation while the pointer rests on copy, buttons, or recommendation details.",
  reducedMotion: "Reduced motion disables auto-advance and leaves only manual slide controls.",
  resumeSafely: "Resume safely restarts only after a user command and does not skip unread slides.",
  slideActionStable: "Slide action stable keeps focus and the current slide steady while the visible CTA runs.",
  readingLock: "Reading lock holds long disclosure, warning, and eligibility text until the user moves on.",
  formEntryLock: "Form entry lock preserves typed values, validation, and focus without rotating the field away.",
  backgroundReturn: "Background return resumes paused instead of fast-forwarding through missed rotation ticks."
};

const carouselAutoBadCopy: Record<CarouselAutoPauseBadMode, string> = {
  noPause: "No pause: the timer changes visible campaign content and no stop control is reachable.",
  hiddenPause: "Hidden pause: the stop control sits after anonymous dots or appears only on hover.",
  focusIgnored: "Focus ignored: keyboard users land on a slide action while rotation keeps running.",
  hoverIgnored: "Hover ignored: the slide changes while users hold the pointer over details to read.",
  reducedMotionIgnored: "Reduced motion ignored: system motion preference is bypassed and the timer still advances.",
  readingInterrupted: "Reading interrupted: long eligibility copy disappears before the user finishes.",
  formEntryAdvanced: "Form entry advanced: a typed email field rotates away with validation still pending.",
  constantAnnouncements: "Constant announcements: screen readers receive unsolicited timer-driven slide updates.",
  feedbackRailRotated: "Feedback rail rotated: recommendation reasons, sponsored labels, and feedback controls vanish mid-decision."
};

function CarouselAutoPauseGoodUi() {
  const current = carouselAutoSlides[0];

  return (
    <div className="quality-example carousel-auto-static">
      <section className="carousel-auto-shell" aria-label="Campaign carousel with controlled rotation">
        <div className="carousel-auto-toolbar">
          <button type="button" className="demo-button small primary">Pause rotation</button>
          <span>Motion: paused - slide 1 of {carouselAutoSlides.length}</span>
        </div>
        <article className="carousel-auto-slide" aria-labelledby="carousel-auto-good-ui-title">
          <span className="carousel-auto-kicker">{current.name}</span>
          <h3 id="carousel-auto-good-ui-title">{current.title}</h3>
          <p>{current.body}</p>
          <button type="button" className="demo-button small">{current.action}</button>
        </article>
        <div className="carousel-auto-controls-inline" aria-label="Manual slide controls">
          <button type="button" className="demo-button small">Previous slide</button>
          <button type="button" className="demo-button small">Next slide</button>
        </div>
        <div className="carousel-auto-meter">
          <span>Focus stop ready</span>
          <span>Hover stop ready</span>
          <span>Reduced motion honored</span>
        </div>
      </section>
      <p className="demo-status">Rotation is paused by default, the pause control is first, and the visible slide stays stable while users read or act.</p>
    </div>
  );
}

function CarouselAutoPauseBadUi() {
  return (
    <div className="bad-ui-sample carousel-auto-static bad">
      <section className="carousel-auto-bad-hero" aria-label="Uncontrolled rotating campaign">
        <div className="carousel-auto-timer" aria-hidden="true">00:03</div>
        <strong>Timed promotion rail</strong>
        <span>Eligibility, contact form, sponsored recommendation, and consent copy rotate automatically.</span>
        <button type="button">Continue</button>
        <div className="carousel-auto-hidden-dots" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>
      </section>
      <p className="demo-status">The broken UI has no pause path before the timer, hides slide identity, and moves task content without consent.</p>
    </div>
  );
}

function CarouselAutoPauseGoodPanel({ mode }: { mode: CarouselAutoPauseMode }) {
  const slide = mode === "formEntryLock" ? carouselAutoSlides[2] : mode === "readingLock" ? carouselAutoSlides[3] : carouselAutoSlides[0];

  return (
    <section className={`carousel-auto-shell is-${mode}`} aria-label="Controlled carousel state">
      <div className="carousel-auto-toolbar">
        <button type="button" className="demo-button small primary">Pause rotation</button>
        <span>{mode === "userStart" ? "Motion: waiting for Start rotation" : mode === "resumeSafely" ? "Motion: resume available" : "Motion: paused"}</span>
      </div>
      <article className="carousel-auto-slide" aria-labelledby="carousel-auto-good-ux-title">
        <span className="carousel-auto-kicker">{slide.name}</span>
        <h3 id="carousel-auto-good-ux-title">{mode === "reducedMotion" ? "Reduced motion static slide" : slide.title}</h3>
        <p>{carouselAutoGoodCopy[mode]}</p>
        {mode === "formEntryLock" ? (
          <label className="carousel-auto-field">
            Email for updates
            <input value="case.owner@example.com" readOnly />
          </label>
        ) : (
          <button type="button" className="demo-button small">{mode === "slideActionStable" ? "Run slide action" : slide.action}</button>
        )}
      </article>
      <div className="carousel-auto-meter" aria-label="Rotation safeguards">
        <span>Focus stop</span>
        <span>Hover stop</span>
        <span>Reading lock</span>
        <span>Form entry lock</span>
        <span>Background return paused</span>
      </div>
    </section>
  );
}

function CarouselAutoPauseGoodUx() {
  const [mode, setMode] = useState<CarouselAutoPauseMode>("pauseFirst");

  return (
    <div className="quality-example carousel-auto-demo">
      <CarouselAutoPauseGoodPanel mode={mode} />
      <div className="demo-row carousel-auto-controls">
        {(Object.keys(carouselAutoGoodCopy) as CarouselAutoPauseMode[]).map((key) => (
          <button
            key={key}
            type="button"
            className={mode === key ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(key)}
          >
            {{
              pauseFirst: "Pause first",
              userStart: "User-start rotation",
              focusStop: "Focus stop",
              hoverStop: "Hover stop",
              reducedMotion: "Reduced motion",
              resumeSafely: "Resume safely",
              slideActionStable: "Slide action stable",
              readingLock: "Reading lock",
              formEntryLock: "Form entry lock",
              backgroundReturn: "Background return"
            }[key]}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">{carouselAutoGoodCopy[mode]}</p>
    </div>
  );
}

function CarouselAutoPauseBadPanel({ mode }: { mode: CarouselAutoPauseBadMode }) {
  return (
    <section className={`carousel-auto-bad-panel is-${mode}`} aria-label="Broken auto-advance carousel state">
      <div className="carousel-auto-timer" aria-hidden="true">{mode === "readingInterrupted" ? "00:01" : "00:04"}</div>
      <strong>
        {mode === "feedbackRailRotated"
          ? "Rotating recommendation rail"
          : mode === "formEntryAdvanced"
            ? "Rotating form slide"
            : "Unpausable campaign hero"}
      </strong>
      <span>{carouselAutoBadCopy[mode]}</span>
      {mode === "formEntryAdvanced" ? (
        <label className="carousel-auto-field bad">
          Email
          <input value="half typed..." readOnly />
        </label>
      ) : mode === "feedbackRailRotated" ? (
        <div className="carousel-auto-feedback">
          <span>Because you viewed benefits appeal</span>
          <button type="button">Not useful</button>
          <button type="button">Sponsored label vanished</button>
        </div>
      ) : (
        <button type="button">{mode === "focusIgnored" ? "Focused while timer runs" : "Continue"}</button>
      )}
      <div className="carousel-auto-hidden-dots" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
    </section>
  );
}

function CarouselAutoPauseBadUx() {
  const [mode, setMode] = useState<CarouselAutoPauseBadMode>("noPause");

  return (
    <div className={`quality-example carousel-auto-bad-demo is-${mode}`}>
      <CarouselAutoPauseBadPanel mode={mode} />
      <div className="demo-row carousel-auto-controls">
        {(Object.keys(carouselAutoBadCopy) as CarouselAutoPauseBadMode[]).map((key) => (
          <button
            key={key}
            type="button"
            className={mode === key ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(key)}
          >
            {{
              noPause: "No pause",
              hiddenPause: "Hidden pause",
              focusIgnored: "Focus ignored",
              hoverIgnored: "Hover ignored",
              reducedMotionIgnored: "Reduced motion ignored",
              readingInterrupted: "Reading interrupted",
              formEntryAdvanced: "Form entry advanced",
              constantAnnouncements: "Constant announcements",
              feedbackRailRotated: "Feedback rail rotated"
            }[key]}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">{carouselAutoBadCopy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CarouselAutoPauseGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CarouselAutoPauseBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CarouselAutoPauseGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CarouselAutoPauseBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
