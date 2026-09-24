import type { LearningLesson } from "./learning";

export const designingLessons: LearningLesson[] = [
  {
    id: "shape-the-journey",
    stage: "design",
    title: "Design the journey, not a single screen",
    outcome: "Model entry, action, feedback, interruption, and handoff as one task.",
    context: "A tenant reports a broken heater through a housing-service app.",
    teach: [
      "A task flow describes the steps inside a product; a journey includes what happens before, after, and across channels. To improve a repair request, map how the tenant notices the problem, reports it, learns whether the request was received, receives a visit time, and checks whether the issue was resolved. Each handoff creates a question: who owns the next step and what does the tenant know?",
      "Draw a successful path and at least one interrupted path. Include delayed service, an unavailable appointment slot, a missed visit, and a request that must be escalated. Record information the tenant should not have to enter twice. A good flow makes state and ownership understandable even when the work leaves the app for a technician or call center."
    ],
    misconception: "A shorter sequence of screens is always a better journey. Removing steps can hide essential confirmation, consent, or recovery.",
    workedExample: "An expert maps a repair report through submission, triage, scheduling, and completion. They notice that the app says 'Done' at submission even though triage can reject missing details. They relabel it 'Request received,' show the next review step and a way to add information, then test whether tenants understand the service state.",
    guidedQuestion: "Which flow would you prototype first for a repair request that requires staff triage?",
    options: [
      { label: "Submit → received status → staff triage → staff contacts the tenant when an appointment is arranged.", feedback: "This keeps submission and triage distinct and reduces status work. It leaves the tenant without a way to see missing information, delay, or closure when staff do not contact them; test whether that uncertainty matters." },
      { label: "Submit → received status → triage outcome → appointment or needed-information path → closure and reopening.", feedback: "This best represents the service's real states and gives the tenant a way to follow and recover. Verify that staff can keep these statuses current; false precision would harm trust." },
      { label: "Submit → received status → a staffed phone or message route for every later update.", feedback: "A human route can handle complex cases and unusual access needs. Making it the only status channel increases staff load and may not work after hours; it is stronger when the service cannot maintain reliable digital updates." }
    ],
    strongestOption: 1,
    evidenceShift: "If triage is immediate and automated with reliable decisions, some intermediate status may collapse; if urgent safety issues exist, the flow needs a faster escalation route.",
    transferContext: "A worker books a shared electric vehicle through mobile, then unlocks it with a physical terminal.",
    transferTask: "Map the journey from selection to return, including failed unlock, low battery, and handoff to support. Identify the information that must travel between app and terminal.",
    artifact: "A journey and task-flow diagram with at least one recovery branch and ownership notes.",
    assessmentFocus: "The map includes cross-channel handoffs, honest state transitions, and a recovery route tied to the worker's goal.",
    patternIds: ["step-navigation", "error-state", "handoff-summary", "retry"],
    sources: [{ label: "Nielsen Norman Group: User Journeys vs. User Flows", href: "https://www.nngroup.com/articles/user-journeys-vs-user-flows/" }]
  },
  {
    id: "compare-alternatives",
    stage: "design",
    title: "Compare plausible approaches",
    outcome: "Use patterns as candidates and choose by task fit, risk, and context.",
    context: "A team needs people to choose a delivery time from many changing slots on a phone.",
    teach: [
      "Patterns are reusable approaches, not prescriptions. A date picker, calendar view, and list of available slots may all seem relevant, but they help with different decisions. Start with the user's task: are they choosing any acceptable opening, comparing dates, or coordinating with another schedule? Consider data freshness, screen size, accessibility, and what happens when a slot disappears.",
      "Generate at least two credible alternatives before polishing one. Write the advantage, cost, and failure mode of each. Then choose a provisional direction and state what evidence would make you switch. Reference examples can suggest possibilities, but copying a familiar company's interface does not prove fit for your users."
    ],
    misconception: "Selecting a named component ends the design decision. The component only helps if its behavior and information match the task.",
    workedExample: "An expert learns that most customers want the earliest slot after work, not a specific date. They compare a dense monthly calendar with a short list grouped by evening availability. The list may surface a viable option faster, while a calendar may help people coordinating around a fixed date. They prototype both and test with real scheduling tasks.",
    guidedQuestion: "Most users seek the earliest evening opening, but some must choose a specific date. What should you test first?",
    options: [
      { label: "Group open slots by day, with an earliest-evening shortcut and a way to choose a date.", feedback: "This is a strong provisional fit because it supports the dominant task and preserves the secondary task. Test whether the shortcut adds clutter or hides important constraints." },
      { label: "Open a calendar at the earliest available evening and let people switch to a chronological list.", feedback: "This makes date-specific planning easy and exposes the earliest slot. It may still require more scanning for the dominant 'first evening' task; compare actual task time and comprehension." },
      { label: "Lead with the next available evening, then reveal a short list of alternatives before commitment.", feedback: "This can speed the common task and still offer choice. It may hide specific-date availability until a second step; test whether users notice the alternative route when needed." }
    ],
    strongestOption: 0,
    evidenceShift: "If research shows date-specific planning is the dominant task, a calendar-first approach may be stronger; if availability is sparse, a simple list may be enough.",
    transferContext: "A factory operator selects one machine from a large equipment list on a shared tablet, sometimes with gloves on.",
    transferTask: "Compare two selection approaches, including discoverability, error prevention, physical operation, and recovery from a wrong selection. Recommend one conditionally.",
    artifact: "A two-option decision table and annotated interaction sketch.",
    assessmentFocus: "Alternatives are both plausible, the chosen approach serves the actual task and environment, and the learner states evidence that could reverse the choice.",
    patternIds: ["date-picker", "calendar-view", "list-view", "select"],
    sources: [{ label: "Nielsen Norman Group: The Risks of Imitating Designs", href: "https://www.nngroup.com/articles/risks-imitating-designs/" }]
  },
  {
    id: "design-every-state",
    stage: "design",
    title: "Design every consequential state",
    outcome: "Specify roles, current versions, pending work, failure, success, and recovery.",
    context: "A manager receives a purchase approval request with a title and an Approve button.",
    teach: [
      "An interaction contract names the states a workflow can enter, the events that move it, and who is permitted to act. A purchase request may be draft, submitted, under review, returned for edits, waiting for a second approver, approved, rejected, or stale because the requester changed it. Designing only the default review screen leaves important decisions undefined.",
      "For each state, ask what the actor must know, what actions are allowed, what happens next, and how an error is recovered. The information shown at approval should include decision-critical context and a clear consequence. A generic confirmation after a click cannot compensate for an outdated request or an unauthorized approver. Test how people understand status after their part is complete."
    ],
    misconception: "Every risk can be solved by adding a confirmation dialog. Reviewability, authority, and version validity often matter more than an extra click.",
    workedExample: "An approver opens an old notification after the amount changed. An expert prevents approval of that old version and shows the changed fields before another decision. The request may then continue to a second approver, so the first approver sees 'Your review is complete; final approval pending' rather than 'Approved.' The labels match the workflow state.",
    guidedQuestion: "The team can add one review step. Which approach would you prototype, and what assumption must be checked?",
    options: [
      { label: "Show the current amount and requester, then use a confirmation dialog; rely on the service to reject stale decisions.", feedback: "This can prevent a stale write if the service checks versions. It may leave the approver unaware of policy exceptions or the next approval; verify the service guarantee and decision context." },
      { label: "Check request version and approver role, then summarize exceptions and the next approval before action.", feedback: "This is strongest under the stated uncertainty. Test whether the summary supports a real decision and whether the version check remains correct across devices." },
      { label: "Route above-threshold requests to a second approver before the first person commits.", feedback: "A second role can reduce some errors and may be required by policy. It does not replace showing the current request or prevent both people from reviewing an outdated version; define the handoff and freshness check." }
    ],
    strongestOption: 1,
    evidenceShift: "A verified service guarantee of current version, authorized recipient, and complete summary could justify a lighter interface; a policy requiring dual approval needs an explicit pending state.",
    transferContext: "An administrator publishes a revised public policy; some comments remain unresolved and legal review may be pending.",
    transferTask: "Create a state model from draft to published or returned for edits. Include roles, changed versions, customer notification, and recovery after a mistaken publication.",
    artifact: "An annotated state model and short rationale for the review step.",
    assessmentFocus: "The model covers authority, version changes, downstream consequence, and recovery beyond a generic confirmation modal.",
    patternIds: ["review-before-submit", "approval-workflow", "change-review", "human-approval-gate"],
    sources: [{ label: "U.S. Web Design System: Establish Trust", href: "https://designsystem.digital.gov/patterns/complete-a-complex-form/establish-trust/" }]
  },
  {
    id: "prototype-the-question",
    stage: "design",
    title: "Prototype the decision you need to test",
    outcome: "Choose prototype detail by the question and include the behavior needed for a useful test.",
    context: "A team is deciding whether a voice-assisted appliance needs a physical cancel control.",
    teach: [
      "A prototype is a tool for learning. Its detail should match the uncertainty: a paper flow may test sequence and wording, while timing, speech recognition, haptics, or physical reach require a more realistic simulation. High visual polish does not compensate for missing interaction behavior. Conversely, building a full product to test a label can waste time.",
      "List what the prototype will represent, what it will fake, and which conclusions it cannot support. For a physical or voice interaction, simulate the environment as well as the interface: distance, noise, hands occupied, and recovery after failure. Give participants meaningful tasks, not a tour of the design. Plan how the facilitator will respond consistently when the prototype cannot truly run the service."
    ],
    misconception: "A beautiful high-fidelity prototype is automatically more valid. Fidelity is useful only in the dimensions needed for the decision.",
    workedExample: "To test whether people understand 'Cancel' after a voice command, an expert first uses a scripted speaker and a cardboard control in a noisy room. The prototype can reveal whether people attempt voice or physical cancellation and whether they recognize the result. It cannot establish production speech-recognition accuracy, so that remains a separate test.",
    guidedQuestion: "The decision is whether users can recover from a misheard voice command while their hands are occupied. Which first prototype is most informative?",
    options: [
      { label: "A voice-only scripted simulation that tests whether people hear and use the correction phrase.", feedback: "This directly tests spoken recovery and is cheap to vary. It misses the physical setting and available controls, which may change how a hands-busy person recovers." },
      { label: "A working recognizer in a quiet room with a simple control prototype.", feedback: "This can reveal recognition and control behavior with real technology. It may underestimate the noisy, hands-busy conditions that define the decision; add those before relying on the result." },
      { label: "A scripted voice simulation with a physical control mockup, realistic noise, and a consistent failure script.", feedback: "This best targets the behavioral question quickly. Record which functions are simulated and retest speech-recognition performance later with working technology." }
    ],
    strongestOption: 2,
    evidenceShift: "If the specific uncertainty is speech recognition in noisy conditions rather than recovery behavior, a functioning recognition system becomes necessary.",
    transferContext: "A public-service website team needs to know whether people understand eligibility before starting a long application.",
    transferTask: "Specify a low-cost prototype and task that test comprehension and decision to proceed. Name what the prototype can and cannot prove.",
    artifact: "A prototype brief with fidelity choices, scripted states, participant task, and limitation notes.",
    assessmentFocus: "The prototype represents the behavior needed for the question and avoids claiming evidence about untested dimensions.",
    patternIds: ["voice-command", "confirmation-dialog", "undo", "error-state"],
    sources: [{ label: "Nielsen Norman Group: Paper Prototyping", href: "https://www.nngroup.com/articles/paper-prototyping-cutout-kit/" }]
  }
];
