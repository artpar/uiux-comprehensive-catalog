import type { LearningLesson } from "./learning";

export const testingLessons: LearningLesson[] = [
  {
    id: "state-a-hypothesis",
    stage: "test",
    title: "State a testable design hypothesis",
    outcome: "Name the person, task, change, expected effect, and possible failure.",
    context: "A home voice assistant sometimes turns off heating in the wrong zone after 'turn off the heat.'",
    teach: [
      "A design hypothesis makes a proposed change accountable. State whom it should help, in which task, why, and what evidence would count against it. 'A clearer response will improve UX' is too vague. 'Naming the affected zone aloud will help people who are away from the display notice a wrong-zone action before they leave the room' can be observed and challenged.",
      "Include a competing risk. A longer spoken response may improve awareness yet become tiresome for routine commands. Define what to observe for both effects: whether people can say which zone changed, whether they correct an error, and whether they interrupt or disable the feedback. A hypothesis guides learning; it is not a prediction that must be defended after evidence disagrees."
    ],
    misconception: "A hypothesis is the same as a feature wish. A useful hypothesis states a mechanism and conditions under which it might fail.",
    workedExample: "An expert writes: 'When people issue an ambiguous heating command without viewing the display, a spoken zone name plus a short correction phrase will increase detection and correction of wrong-zone actions. It may slow frequent commands.' They prepare two task conditions and observe comprehension and friction rather than asking only which voice sounds nicer.",
    guidedQuestion: "Which first hypothesis would best balance error detection and routine friction in a useful test?",
    options: [
      { label: "Naming the zone after every command should increase recognition of wrong-zone actions, though extra speech may slow frequent users.", feedback: "This is testable and names a cost. It may burden every routine command when the observed risk centers on ambiguous ones; compare the frequency and consequence of each situation." },
      { label: "Naming the zone and offering correction on ambiguous commands should speed error detection for hands-free users, but may add friction.", feedback: "This is strongest for the stated first test because it specifies the situation, expected behavior, and a possible cost. Choose measures and tasks before testing." },
      { label: "Confirming before every heating action should prevent wrong-zone changes, though repeated prompts may interrupt routine use.", feedback: "This is also testable and may be right when a wrong action has serious consequences. Under the stated uncertainty, test whether a targeted response can reveal and recover errors with less routine interruption." }
    ],
    strongestOption: 1,
    evidenceShift: "If wrong-zone actions are extremely rare but extra speech disrupts every command, a different intervention at the ambiguity point may be preferable.",
    transferContext: "A web form proposes an inline summary of corrections before submission.",
    transferTask: "Write a hypothesis about error detection and a possible cost, then specify an observation that would challenge each part.",
    artifact: "A hypothesis and evidence table with task, expected effect, competing risk, and disconfirming observation.",
    assessmentFocus: "The hypothesis is falsifiable, tied to a user task, and includes both intended benefit and plausible harm.",
    patternIds: ["voice-command", "confirmation-dialog", "review-before-submit"],
    sources: [{ label: "Nielsen Norman Group: Formative vs. Summative Evaluation", href: "https://www.nngroup.com/videos/formative-vs-summative-evaluation/" }]
  },
  {
    id: "choose-a-test",
    stage: "test",
    title: "Choose a method and write useful tasks",
    outcome: "Design an evaluation whose tasks and observations answer a decision.",
    context: "A clinic wants to learn whether people can complete an appointment kiosk check-in without staff help.",
    teach: [
      "Begin with the decision: should the kiosk flow be changed before rollout, and where? A formative usability study can show how people interpret and use the flow. Recruit participants who reflect key users and contexts, including people with access needs. Give them a realistic goal rather than naming the control you want them to click. Observe actions, hesitation, error recovery, and the handoff to staff.",
      "A task scenario should set motivation and starting conditions without revealing the path. 'You have arrived for your appointment and need to let the clinic know' leaves room to see what the participant chooses. 'Tap Check In and enter your code' tests instruction following instead. Plan what will count as task completion, what to do if the prototype cannot truly notify staff, and which claims a small study cannot support."
    ],
    misconception: "Asking users whether a page seems easy proves that they can complete the task. Observe task behavior and use opinions as complementary evidence.",
    workedExample: "An expert brings a participant into a simulated lobby with a ticket kiosk and nearby signs. They ask the participant to arrive for an appointment, then watch whether the person can identify a completion signal without prompting. They note when staff help is requested and ask afterward what the participant thinks happened. The simulation cannot prove the real clinic's staff system works.",
    guidedQuestion: "Which first study task is least likely to lead participants?",
    options: [
      { label: "You have an appointment code. Find a way to check in, and tell us when you believe you are finished.", feedback: "This is realistic and leaves interface discovery open. Asking when the participant believes they are finished is useful, but it does not observe what they do next in the lobby or whether they seek staff help." },
      { label: "You have arrived for an appointment. Use any available route to let the clinic know you are here.", feedback: "This tests the wider service goal and may be useful for comparing channels. If the decision concerns the kiosk specifically, the open route may not produce enough kiosk use without careful setup." },
      { label: "You have arrived for an appointment. Let the clinic know you are here, then show what you would do while waiting.", feedback: "This best represents the user's goal without giving away the interface path and observes the next step. Define what evidence will show staff receipt in the prototype and watch recovery if the task fails." }
    ],
    strongestOption: 2,
    evidenceShift: "If the research question is specifically whether a known control's target can be activated by a motor-impaired user, a more directed task may be appropriate.",
    transferContext: "An enterprise analyst needs to export a report with sensitive fields removed.",
    transferTask: "Write two realistic tasks, define completion and failure, name representative participants, and list observations that reveal whether the export is understood and safe.",
    artifact: "A one-page formative test plan with task scripts, observations, and study limitations.",
    assessmentFocus: "The participant tasks match the decision, avoid naming controls, and the observations can reveal both success and misunderstanding.",
    patternIds: ["review-before-submit", "data-export", "error-state"],
    sources: [{ label: "Nielsen Norman Group: Writing Tasks for Usability Studies", href: "https://www.nngroup.com/articles/test-tasks-quant-qualitative/" }]
  },
  {
    id: "interpret-findings",
    stage: "test",
    title: "Interpret findings without overclaiming",
    outcome: "Separate observed behavior, plausible explanation, severity, and confidence.",
    context: "A smartwatch accepts 'pause workout' while someone runs; it can pause the workout timer or audio playback.",
    teach: [
      "A finding reports what happened, under which task and conditions, and why it matters. Interpretation proposes a cause; it should remain separate from the observation. A small usability study can reveal a failure mechanism and guide revision, but its fraction of participants is not automatically a population failure rate. Look for alternative explanations and record what the prototype could not represent.",
      "Assess severity by consequence, ability to recover, and which users or contexts are affected. A participant saying 'Paused' sounded like workout confirmation is evidence about their interpretation; it does not prove all runners hear it that way. Use the observation to make a targeted change and plan a retest that can disconfirm your explanation."
    ],
    misconception: "A count such as 'three of six' should be reported as a precise percentage for all users. In a small qualitative study, the count describes the sample and the observed failure mode.",
    workedExample: "In a fictional six-person study, three triggered audio pause while the workout timer continued; two noticed only after another minute. An expert writes the observation and consequence, then hypothesizes that the command and 'Paused' response do not distinguish the target. They would inspect recordings and the assistant's intent logs before ruling out recognition errors.",
    guidedQuestion: "Which conclusion is supported by the fictional six-person study?",
    options: [
      { label: "Three of six participants paused audio in this test; prioritize command disambiguation and retest the interaction.", feedback: "This reports the sample accurately and suggests a useful direction. It treats the target choice as the cause before checking whether recognition, context selection, or execution produced the observed result." },
      { label: "Three participants paused audio while trying to pause the workout; target ambiguity is one hypothesis, so inspect intent logs and test clearer responses.", feedback: "This is strongest because it states the observation, labels the explanation as tentative, and identifies a discriminating next check." },
      { label: "Two participants noticed the wrong result only after a minute; revise feedback first and check whether they detect the target sooner.", feedback: "This targets a serious detection delay. It does not yet explain why the wrong action happened; inspect intent and execution logs alongside the feedback test." }
    ],
    strongestOption: 1,
    evidenceShift: "If intent logs show that the system consistently selected 'audio' before speaking, the command-disambiguation design becomes the focus; if it selected 'workout' but the timer kept running, the issue may be execution or feedback instead.",
    transferContext: "A self-service kiosk test finds that two participants leave after a confirmation screen, while one asks staff whether the task succeeded.",
    transferTask: "Write an observation, at least two competing explanations, severity assessment, and a next check. Avoid turning the sample count into a general population rate.",
    artifact: "A finding card with observation, interpretation, impact, uncertainty, and next evidence.",
    assessmentFocus: "The learner distinguishes observed behavior from cause, describes the study's limits, and chooses evidence that could change the conclusion.",
    patternIds: ["voice-command", "success-confirmation", "error-state"],
    sources: [{ label: "Nielsen Norman Group: Qualitative Usability Testing Study Guide", href: "https://www.nngroup.com/articles/qual-usability-testing-study-guide/" }]
  },
  {
    id: "revise-and-retest",
    stage: "test",
    title: "Revise the interaction and retest",
    outcome: "Trace a design revision to findings and state what the next test must resolve.",
    context: "A voice-controlled heating system says 'Okay' after 'turn off the heat,' but sometimes acts on the wrong zone.",
    teach: [
      "A revision is a hypothesis expressed as a design. Link each changed behavior to a finding: what observed failure should it prevent or make recoverable? Preserve what worked. Do not combine so many changes that the team cannot learn which one helped. After revision, choose tasks that expose both the former failure and any new cost.",
      "For voice systems, feedback should work in the modality the person is using. Naming the affected zone aloud can reveal a wrong action; a short correction path can let the person recover. Yet every added spoken phrase takes time and attention, so test routine commands as well as ambiguous ones. An initial positive result does not end iteration if noisy rooms, multiple users, or disabled audio were not represented."
    ],
    misconception: "A design change is justified because it follows a test. It is justified only when the finding and the proposed mechanism are connected and the new tradeoff is evaluated.",
    workedExample: "A fictional prototype test finds that people in another room miss the display and believe 'Okay' confirms a whole-home action. An expert changes the response to 'Bedroom heating off' and supports 'Undo that' for ambiguous actions. They retest whether people identify the zone, correct a wrong one, and tire of extra speech during routine use.",
    guidedQuestion: "Users miss the on-screen zone and have no hands-free correction. Which next revision would you test?",
    options: [
      { label: "Name the zone on the display and add a haptic cue when the system changes a heating zone.", feedback: "This may help people wearing or viewing the device. It still misses those acting from another room with no display or wearable; a visual improvement can complement the spoken path." },
      { label: "Ask for spoken zone confirmation before every heating action, then offer cancellation.", feedback: "This can prevent ambiguity before action and may fit high-consequence settings. Repeated prompts could burden clear routine commands; test that cost and reserve confirmation for uncertain cases if possible." },
      { label: "Speak the affected zone and offer a short voice correction when the target is ambiguous.", feedback: "This best addresses the observed feedback and recovery gaps while limiting routine friction. Retest in noise and with users who cannot or do not use the display." }
    ],
    strongestOption: 2,
    evidenceShift: "If wrong-zone action has serious safety consequences, a confirmation before action may be warranted even at the cost of extra steps.",
    transferContext: "A smartwatch accepts 'pause workout'; a fictional six-person test found three audio pauses instead of workout pauses, two noticed only after another minute, and four never looked at the display.",
    transferTask: "Revise the command, response, and correction behavior. Tie each change to a supplied finding, describe the new tradeoff, and propose a retest with tasks that could disprove the revision.",
    artifact: "A before-and-after interaction script plus a findings-to-change matrix and retest plan.",
    assessmentFocus: "The revision follows specific observations, handles ambiguity without assuming a display, and the retest measures correction and added friction.",
    patternIds: ["voice-command", "undo", "confirmation-dialog", "haptic-feedback"],
    sources: [{ label: "Nielsen Norman Group: Iterative Design", href: "https://www.nngroup.com/articles/iterative-design/" }]
  }
];
