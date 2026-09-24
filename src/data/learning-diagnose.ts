import type { LearningLesson } from "./learning";

export const diagnosingLessons: LearningLesson[] = [
  {
    id: "observe-the-task",
    stage: "diagnose",
    title: "Observe the task before judging the screen",
    outcome: "Capture what a person did, the setting, and what remains unknown.",
    context: "A station kiosk user starts buying a ticket, steps aside to read a route map, then returns to a reset screen.",
    teach: [
      "Observation records behavior in context. Note what the person tried to accomplish, the sequence of actions, interruptions, workarounds, and environmental constraints. Record what you saw separately from your interpretation. 'The screen reset after 45 seconds' is an observation; 'the user was confused' is a hypothesis unless you have further evidence.",
      "A field note should include the trigger, the user's visible action, the system response, and the consequence for the task. Ask neutral follow-up questions when needed, but avoid telling the participant what should have happened. One observed failure does not establish its frequency; it can reveal a mechanism worth investigating. Capture moments that happen outside the screen, such as consulting a sign or asking staff."
    ],
    misconception: "A short video of the screen is a complete account of the experience. It can omit the user's goal, surroundings, and what happened afterward.",
    workedExample: "An expert writes: 'At 14:06 the visitor opened route selection. At 14:06:28 they walked to the wall map. At 14:07:00 they returned; the kiosk showed its start screen. They asked staff whether their fare had been charged.' The expert does not yet claim why the timeout exists or that the fare was charged; those become questions for logs and staff.",
    guidedQuestion: "Which note is most useful for a team diagnosing the failure?",
    options: [
      { label: "The kiosk returned to its start screen after the person stepped away for the wall map.", feedback: "This is a useful observable event. It leaves out the person's return and later question to staff, which connect the reset to uncertainty about task completion." },
      { label: "The person hesitated at the route list, consulted the map, and seemed confused when the kiosk reset.", feedback: "This captures more of the sequence, but 'seemed confused' is an interpretation. Record what the person said or did after the reset before assigning that explanation." },
      { label: "The person consulted the map; the kiosk reset before they returned; they asked staff whether payment occurred.", feedback: "This preserves sequence and context while leaving the cause open. Add timing, visible system state, and a question about payment and timeout policy." }
    ],
    strongestOption: 2,
    evidenceShift: "An interview or recording may show that route labels also caused confusion, but that would be additional evidence rather than a safe inference from this observation alone.",
    transferContext: "An enterprise employee abandons a multi-step access request after a manager calls them into a meeting.",
    transferTask: "Write five observation notes and three follow-up questions. Mark each statement as observation, participant report, or hypothesis.",
    artifact: "A structured observation sheet with a separate question list.",
    assessmentFocus: "The learner preserves the task sequence and interruption, labels inferences, and asks non-leading questions about state and recovery.",
    patternIds: ["session-timeout-warning", "draft-state", "autosave-recovery"],
    sources: [{ label: "Nielsen Norman Group: Field Studies Done Right", href: "https://www.nngroup.com/articles/field-studies-done-right-fast-and-observational/" }]
  },
  {
    id: "choose-evidence",
    stage: "diagnose",
    title: "Choose evidence for the question",
    outcome: "Match an evidence source to the uncertainty it can reduce.",
    context: "A product team sees a high exit rate on an account-recovery page and assumes people dislike its layout.",
    teach: [
      "Different evidence answers different questions. Analytics can show where and how often a measured event occurs, but usually not why. A task observation can reveal how someone interprets a flow, but a small qualitative study does not estimate a population rate. Interviews can uncover expectations and context, while support tickets can expose recurring complaints with selection bias.",
      "Define the decision before selecting a method: what might change if the answer is A versus B? Then collect enough evidence to distinguish plausible causes. For an account-recovery exit, inspect the event definition and technical failures, observe representative people attempting recovery, and compare support themes. Triangulating sources strengthens a conclusion when they agree; conflicting evidence is a reason to investigate, not to pick a favorite number."
    ],
    misconception: "A single metric or a few quotes provide a full explanation. Each source has blind spots that should be named in the recommendation.",
    workedExample: "A team finds that 'exit' includes people who successfully opened their email app to retrieve a code. The metric is not a clean abandonment measure. An expert first repairs the event definition, then tests whether users can return to the flow after switching apps. The change in measurement alters the design question.",
    guidedQuestion: "The team must decide whether to redesign the recovery page next sprint. Which evidence plan best supports that decision?",
    options: [
      { label: "Verify the exit event against logs, then observe recovery across app and email and compare support reports.", feedback: "This plan checks whether the metric means abandonment and observes the task across the channel switch. It is strongest for deciding what to fix, though it will still need enough volume to estimate prevalence." },
      { label: "Interview ticket submitters and review their recovery logs before changing the page.", feedback: "This can reveal severe failures and connect reports to system events. Ticket submitters are a selected group, though; they cannot show whether other exits were successful channel switches." },
      { label: "Instrument email-link completion and run a small layout test using exits and completions together.", feedback: "Adding a completion signal improves the metric. A layout test still assumes the page is the cause before observing the full recovery task; use it after the failure mechanism is clearer." }
    ],
    strongestOption: 0,
    evidenceShift: "If a verified event already distinguishes email-switch success from abandonment, an experiment or narrower usability study becomes more appropriate.",
    transferContext: "A voice assistant's help command is used rarely. The team assumes people do not need help.",
    transferTask: "Write a research plan that separates discoverability, need, recognition failure, and alternative help-seeking. Explain what logs, observation, and interviews can each establish.",
    artifact: "A decision-question-to-evidence matrix with limitations.",
    assessmentFocus: "Each method is tied to a question, measurement validity is checked, and the learner avoids turning absence of use into absence of need.",
    patternIds: ["voice-command", "retry", "error-state"],
    sources: [{ label: "Nielsen Norman Group: Triangulation in UX Research", href: "https://www.nngroup.com/articles/triangulation-better-research-results-using-multiple-ux-methods/" }]
  },
  {
    id: "distinguish-causes",
    stage: "diagnose",
    title: "Separate symptoms from causes",
    outcome: "Build competing hypotheses and seek evidence that discriminates among them.",
    context: "A commuter's mobile journey planner says 'No trips found' after a route search.",
    teach: [
      "The same screen can result from very different states. Zero matches after a successful request, an active filter, missing permission, an unavailable station, and a network timeout should not share an unqualified explanation. Before redesigning the message, map the request, filters, permissions, response, and data freshness. Label which facts are known and which are hypotheses.",
      "Choose evidence that can rule causes in or out: request logs for technical failure, current filter values for no-match causes, service records for closure, and task observation for interpretation. Preserve the person's input while diagnosing. A safe temporary message states the limits of current knowledge and offers an appropriate recovery route. Its wording may change as the system gains evidence."
    ],
    misconception: "The visible message identifies the underlying problem. An inaccurate message may itself be part of the problem.",
    workedExample: "A failed network request is observed in logs. An expert does not say 'No trains run.' They keep the route and time, explain that live trips could not load, and offer retry and verified service status. If a later successful request returns zero matching trips, the message can instead explain the active filters and how to broaden the search.",
    guidedQuestion: "The live request timed out; route and filters remain stored; yesterday's timetable is cached. Which response would you test first?",
    options: [
      { label: "Keep the search, name the live-data failure, offer retry, and show cached times only with age and limits.", feedback: "This is strongest because it separates known failure from stale information while preserving the task. Check whether the cached data is safe to show during disruption; it may need to be withheld." },
      { label: "Show yesterday's timetable with a prominent timestamp and a station-contact route.", feedback: "The timestamp and fallback help, but a traveler may still mistake scheduled departures for current service. Test whether the limits are understood and whether contact information is current." },
      { label: "Keep the search and offer retry plus service status, withholding all cached results.", feedback: "This is safer if stale data could mislead, and it retains a recovery route. It may remove useful schedule context when cache age and limitations can be made clear; establish the disruption risk first." }
    ],
    strongestOption: 0,
    evidenceShift: "A confirmed station closure calls for a service message and alternative route; a successful zero-match response calls for no-results recovery rather than a network-error message.",
    transferContext: "A support knowledge base on the web reports 'Nothing here' after an agent searches; a product filter, access permission, or index outage could explain it.",
    transferTask: "Separate observed facts from three hypotheses, identify evidence that would distinguish them, and write the safest provisional state message.",
    artifact: "A one-page cause map and problem statement with proposed checks.",
    assessmentFocus: "The learner distinguishes empty data, no-match results, and retrieval failure, with targeted checks instead of a premature component choice.",
    patternIds: ["empty-state", "no-results-recovery", "error-state"],
    sources: [{ label: "Nielsen Norman Group: Problem Statements in UX Discovery", href: "https://www.nngroup.com/articles/problem-statements/" }]
  },
  {
    id: "frame-the-problem",
    stage: "diagnose",
    title: "Frame a problem worth solving",
    outcome: "Write a problem statement grounded in users, tasks, evidence, and consequence.",
    context: "A product lead requests a new dashboard because support agents have too many tabs open.",
    teach: [
      "A useful problem statement describes who is affected, the task they are trying to complete, where it breaks down, and what consequence follows. It does not smuggle in a preferred solution. 'Agents need a dashboard' is a feature request. 'Agents cannot reconcile a customer's status across three tools during a live call, increasing hold time and errors' is a problem that can be investigated.",
      "State the evidence supporting the problem and the biggest uncertainty. Prioritize by severity, reach, and reversibility rather than frequency alone. A rare failure that blocks an essential task or exposes private data may deserve more attention than a common cosmetic irritation. Keep the statement revisable: discovery may show that information ownership, not navigation, causes the tab switching."
    ],
    misconception: "A polished 'How might we' phrase is sufficient. The framing is useful only when it directs research and allows more than one plausible solution.",
    workedExample: "An expert observes agents copying account IDs between tools and occasionally using outdated status. They write: 'During live support calls, agents must check status in three systems; the delay and mismatch can lead to incorrect guidance. We need to understand which status is authoritative and how often mismatches occur.' This leaves room for integration, process, or interface changes.",
    guidedQuestion: "Which statement should guide the next discovery step?",
    options: [
      { label: "Agents need a unified status view because switching among three systems slows live calls.", feedback: "This states a plausible task cost but prescribes a view before establishing whether speed or inconsistent data is the main failure. A unified surface could reproduce the same mismatch." },
      { label: "Agents switching among systems may give inconsistent status; observe the handoff and identify the authoritative source.", feedback: "This is strongest because it names the task, consequence, and key uncertainty without locking in a solution. Add evidence of how often and whom it affects." },
      { label: "Agents need a consistent status source during calls; compare the three systems' timestamps and records.", feedback: "This is a credible technical next check. It may miss how agents interpret and communicate status during a live handoff, so pair it with task observation before finalizing the problem." }
    ],
    strongestOption: 1,
    evidenceShift: "If observation shows the data is consistent and the cost lies in repeated navigation, a consolidated view becomes a stronger candidate; if sources disagree, governance may be the primary work.",
    transferContext: "Visitors to a public library website repeatedly call staff while trying to renew a membership.",
    transferTask: "Write a problem statement using call themes and a proposed observation study. State what you know, what you infer, and which evidence would change the priority.",
    artifact: "A one-paragraph problem statement and evidence/uncertainty ledger.",
    assessmentFocus: "The statement is solution-neutral, tied to a user task and consequence, and explicit about the strength and limits of evidence.",
    patternIds: ["handoff-summary", "summary-box", "error-state"],
    sources: [{ label: "Nielsen Norman Group: Problem Statements in UX Discovery", href: "https://www.nngroup.com/articles/problem-statements/" }]
  }
];
