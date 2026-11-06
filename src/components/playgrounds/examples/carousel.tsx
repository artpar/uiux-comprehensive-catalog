import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

const carouselSlides = [
  {
    name: "Overview",
    title: "One backup view",
    body: "A short product tour slide that introduces the shared backup dashboard.",
    action: "Open overview"
  },
  {
    name: "Backup",
    title: "Nightly recovery point",
    body: "Shows the scheduled backup, last successful run, and a direct recovery action.",
    action: "Review backup"
  },
  {
    name: "Security",
    title: "Encrypted retention",
    body: "Explains encryption and retention controls without hiding required settings.",
    action: "Inspect security"
  },
  {
    name: "Reports",
    title: "Readable report exports",
    body: "Keeps report generation supplemental instead of replacing the full reports page.",
    action: "View reports"
  }
];

function CarouselGoodUi() {
  const current = carouselSlides[1];

  return (
    <div className="quality-example carousel-static-preview">
      <section className="carousel-shell" aria-label="Backup product tour carousel">
        <div className="carousel-toolbar">
          <button type="button" className="demo-button small">Stop rotation</button>
          <span>Slide 2 of {carouselSlides.length}</span>
        </div>
        <article className="carousel-slide">
          <span className="carousel-kicker">{current.name}</span>
          <h3>{current.title}</h3>
          <p>{current.body}</p>
          <button type="button" className="demo-button small primary">{current.action}</button>
        </article>
        <div className="carousel-controls" aria-label="Slide controls">
          <button type="button" className="demo-button small">Previous slide</button>
          <button type="button" className="demo-button small">Next slide</button>
        </div>
        <div className="carousel-picker" aria-label="Choose a slide">
          {carouselSlides.map((slide) => (
            <button
              key={slide.name}
              type="button"
              className={slide.name === current.name ? "carousel-dot is-current" : "carousel-dot"}
              aria-current={slide.name === current.name ? "true" : undefined}
            >
              {slide.name}
            </button>
          ))}
        </div>
      </section>
      <p className="demo-status">The current slide, total count, named pickers, and pause control are all visible before content changes.</p>
    </div>
  );
}

function CarouselBadUi() {
  return (
    <div className="bad-ui-sample carousel-static-preview bad">
      <div className="carousel-bad-hero">
        <strong>Everything important rotates here</strong>
        <span>Required pricing, security, migration, and support steps advance automatically.</span>
        <button type="button">Learn more</button>
      </div>
      <div className="carousel-bad-dots" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <p className="demo-status">The broken treatment uses timed motion, nameless dots, and hidden required content without a pause path.</p>
    </div>
  );
}

function CarouselGoodUx() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hoverStopped, setHoverStopped] = useState(false);
  const [status, setStatus] = useState("Overview slide is visible. Rotation is stopped until the user starts it.");
  const current = carouselSlides[index];

  const showSlide = (nextIndex: number, reason: string) => {
    const normalized = (nextIndex + carouselSlides.length) % carouselSlides.length;
    const wrapped = nextIndex < 0 || nextIndex >= carouselSlides.length;
    setIndex(normalized);
    setStatus(`${carouselSlides[normalized].name} slide shown${wrapped ? " after wrapping at the boundary" : ""}. ${reason}`);
  };

  const stopForFocus = () => {
    setPlaying(false);
    setStatus("Keyboard focus entered the carousel; rotation stopped and focus stays on the active control.");
  };

  const stopForHover = () => {
    setPlaying(false);
    setHoverStopped(true);
    setStatus("Pointer hover stopped rotation so the visible slide can be read.");
  };

  return (
    <div className="quality-example carousel-demo">
      <section
        className="carousel-shell"
        aria-label="Product tour carousel"
        onFocus={stopForFocus}
        onMouseEnter={stopForHover}
        onMouseLeave={() => {
          if (hoverStopped) {
            setHoverStopped(false);
            setStatus("Pointer left the carousel; rotation remains stopped until Start rotation is pressed.");
          }
        }}
      >
        <div className="carousel-toolbar">
          <button
            type="button"
            className="demo-button small primary"
            aria-pressed={!playing}
            onClick={() => {
              setPlaying((active) => !active);
              setHoverStopped(false);
              setStatus(playing ? "Rotation paused by user command." : "Rotation started by user command; focus and hover will stop it again.");
            }}
          >
            {playing ? "Pause rotation" : "Start rotation"}
          </button>
          <span>{playing ? "Playing" : hoverStopped ? "Stopped by hover" : "Paused"} - slide {index + 1} of {carouselSlides.length}</span>
        </div>
        <article className="carousel-slide" aria-labelledby="carousel-current-title">
          <span className="carousel-kicker">{current.name}</span>
          <h3 id="carousel-current-title">{current.title}</h3>
          <p>{current.body}</p>
          <button
            type="button"
            className="demo-button small primary"
            onClick={() => setStatus(`${current.action} activated from the visible slide without changing carousel focus rules.`)}
          >
            {current.action}
          </button>
        </article>
        <div className="carousel-controls" aria-label="Step through slides">
          <button type="button" className="demo-button small" onClick={() => showSlide(index - 1, "Previous keeps focus on its button.")}>Previous slide</button>
          <button type="button" className="demo-button small" onClick={() => showSlide(index + 1, "Next keeps focus on its button.")}>Next slide</button>
        </div>
        <div className="carousel-picker" aria-label="Choose product tour slide">
          {carouselSlides.map((slide, slideIndex) => (
            <button
              key={slide.name}
              type="button"
              className={slideIndex === index ? "carousel-dot is-current" : "carousel-dot"}
              aria-current={slideIndex === index ? "true" : undefined}
              onClick={() => showSlide(slideIndex, "Named slide picker moved directly to the requested slide.")}
            >
              {slide.name}
            </button>
          ))}
        </div>
      </section>
      <div className="demo-row carousel-exercise-controls">
        <button type="button" className="demo-button small" onClick={stopForFocus}>Simulate focus stop</button>
        <button type="button" className="demo-button small" onClick={stopForHover}>Simulate hover stop</button>
        <button type="button" className="demo-button small" onClick={() => showSlide(carouselSlides.length, "Last-to-first wrap is explicit.")}>Test wrap</button>
        <button type="button" className="demo-button small primary" onClick={() => setStatus(`${current.action} followed from ${current.name}; hidden slides were not required.`)}>Open slide action</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function CarouselBadUx() {
  type Mode = "autoAdvance" | "unlabeledDots" | "hiddenRequired" | "swipeOnly" | "focusLoss" | "contentDump";
  const [mode, setMode] = useState<Mode>("autoAdvance");
  const copy: Record<Mode, string> = {
    autoAdvance: "The slide changes while users read text, and the pause control is absent.",
    unlabeledDots: "Dots expose no slide names or current state, so direct navigation is guesswork.",
    hiddenRequired: "A required migration warning lives on a later slide and can be missed before commit.",
    swipeOnly: "Swipe is the only navigation path, blocking keyboard, mouse, and switch users.",
    focusLoss: "Activating Next moves focus into hidden slide content or drops it entirely.",
    contentDump: "Too many unrelated items are squeezed into one slot instead of a scannable list or grid."
  };

  return (
    <div className={`quality-example carousel-bad-demo is-${mode}`}>
      <div className="carousel-bad-panel">
        <strong>{mode === "hiddenRequired" ? "Step 4 contains a required warning" : mode === "contentDump" ? "Twelve stakeholder cards" : "Rotating product hero"}</strong>
        <span>{copy[mode]}</span>
        {mode === "contentDump" ? (
          <div className="carousel-bad-stack">
            {["Backup", "Security", "Billing", "Reports", "Teams", "Storage"].map((item) => <em key={item}>{item}</em>)}
          </div>
        ) : (
          <div className="carousel-bad-dots" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </div>
        )}
        {mode === "swipeOnly" ? <span className="carousel-swipe-note">Swipe to continue</span> : <button type="button">{mode === "focusLoss" ? "Next, then focus vanishes" : "Continue"}</button>}
      </div>
      <div className="demo-row carousel-exercise-controls">
        <button type="button" className={mode === "autoAdvance" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("autoAdvance")}>Auto advance</button>
        <button type="button" className={mode === "unlabeledDots" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("unlabeledDots")}>Unlabeled dots</button>
        <button type="button" className={mode === "hiddenRequired" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenRequired")}>Hidden required</button>
        <button type="button" className={mode === "swipeOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("swipeOnly")}>Swipe only</button>
        <button type="button" className={mode === "focusLoss" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("focusLoss")}>Focus loss</button>
        <button type="button" className={mode === "contentDump" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("contentDump")}>Content dump</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CarouselGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CarouselBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CarouselGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CarouselBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
