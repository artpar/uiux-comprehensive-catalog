import type { PatternEntry } from "@/schemas/catalog";
import BottomNavigationDemo from "./playgrounds/BottomNavigationDemo";
import ConfirmationDialogDemo from "./playgrounds/ConfirmationDialogDemo";
import FacetedSearchDemo from "./playgrounds/FacetedSearchDemo";
import ModalDialogDemo from "./playgrounds/ModalDialogDemo";
import NoResultsRecoveryDemo from "./playgrounds/NoResultsRecoveryDemo";
import PromptSuggestionsDemo from "./playgrounds/PromptSuggestionsDemo";
import ToastOnlyCriticalErrorDemo from "./playgrounds/ToastOnlyCriticalErrorDemo";
import UndoDemo from "./playgrounds/UndoDemo";

type PatternPlaygroundProps = {
  pattern: PatternEntry;
  variant?: "detail" | "preview";
};

const playgroundPrompts: Record<string, { title: string; prompt: string }> = {
  "bottom-navigation": {
    title: "Switch top-level destinations",
    prompt: "Check whether the active destination and destination content stay in sync."
  },
  "confirmation-dialog": {
    title: "Confirm a destructive action",
    prompt: "Inspect consequence copy, safe cancellation, focus behavior, and the final outcome."
  },
  "faceted-search": {
    title: "Narrow a result set",
    prompt: "Apply facets, inspect counts, remove filters, and recover from zero results."
  },
  "modal-dialog": {
    title: "Complete a focused modal task",
    prompt: "Open the dialog, test Tab and Escape, then verify focus returns to the opener."
  },
  "no-results-recovery": {
    title: "Recover from no results",
    prompt: "Create an empty result set and inspect whether the recovery path is obvious."
  },
  "prompt-suggestions": {
    title: "Choose and revise an AI prompt",
    prompt: "Compare suggestions, edit one, and check whether the user remains in control."
  },
  "toast-only-critical-error": {
    title: "Compare transient vs persistent error handling",
    prompt: "Trigger both outcomes and inspect which one still supports recovery."
  },
  undo: {
    title: "Recover after a completed action",
    prompt: "Delete an item, inspect the undo window, and watch the final committed state."
  }
};

export default function PatternPlayground({ pattern, variant = "detail" }: PatternPlaygroundProps) {
  const demos: Record<string, React.ReactNode> = {
    "bottom-navigation": <BottomNavigationDemo />,
    "confirmation-dialog": <ConfirmationDialogDemo />,
    "faceted-search": <FacetedSearchDemo />,
    "modal-dialog": <ModalDialogDemo />,
    "no-results-recovery": <NoResultsRecoveryDemo />,
    "prompt-suggestions": <PromptSuggestionsDemo />,
    "toast-only-critical-error": <ToastOnlyCriticalErrorDemo />,
    undo: <UndoDemo />
  };
  const copy = playgroundPrompts[pattern.id] ?? {
    title: `Try ${pattern.name}`,
    prompt: "Interact with the pattern and compare the behavior against the guidance."
  };

  return (
    <section
      className={variant === "preview" ? "playground-panel playground-preview" : "detail-panel playground-panel"}
      aria-labelledby={`live-example-title-${pattern.id}-${variant}`}
    >
      <div className="playground-heading">
        <div>
          <h2 id={`live-example-title-${pattern.id}-${variant}`}>{copy.title}</h2>
          <p>{copy.prompt}</p>
        </div>
        <span>{pattern.name}</span>
      </div>
      {demos[pattern.id] ?? (
        <p className="demo-status">No live example has been added for this pattern yet.</p>
      )}
      {variant === "detail" && (
        <div className="demo-contract" aria-label={`${pattern.name} demo contract`}>
          <section>
            <h3>State To Inspect</h3>
            <p>{pattern.requiredStates[0]}</p>
          </section>
          <section>
            <h3>Keyboard / Access</h3>
            <p>{pattern.keyboardBehavior[0] ?? pattern.accessibility[0] ?? "Verify focus, labels, and operable controls."}</p>
          </section>
          <section>
            <h3>Avoid Generating</h3>
            <p>{pattern.commonMisuses[0]}</p>
          </section>
        </div>
      )}
    </section>
  );
}
