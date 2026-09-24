import { diagnosingLessons } from "./learning-diagnose";
import { designingLessons } from "./learning-design";
import { testingLessons } from "./learning-test";
import { practicingLessons } from "./learning-practice";

export type LearningStage = {
  id: string;
  title: string;
  outcome: string;
};

export type LessonOption = {
  label: string;
  feedback: string;
};

export type LearningLesson = {
  id: string;
  stage: string;
  title: string;
  outcome: string;
  context: string;
  teach: string[];
  misconception: string;
  workedExample: string;
  guidedQuestion: string;
  options: [LessonOption, LessonOption, LessonOption];
  strongestOption: number;
  evidenceShift: string;
  transferContext: string;
  transferTask: string;
  artifact: string;
  assessmentFocus: string;
  patternIds: string[];
  sources: Array<{ label: string; href: string }>;
};

export const learningStages: LearningStage[] = [
  { id: "understand", title: "Understand experience quality", outcome: "See the whole task, the people involved, and the consequences of an interaction." },
  { id: "diagnose", title: "Diagnose and frame problems", outcome: "Separate what happened from why it happened and define a problem worth solving." },
  { id: "design", title: "Design and apply", outcome: "Create complete interactions with alternatives, states, and recovery paths." },
  { id: "test", title: "Test and improve", outcome: "Choose useful evidence, interpret it carefully, and revise the design." },
  { id: "practice", title: "Practice professionally", outcome: "Make and communicate defensible UX decisions across a service and a team." }
];

export const learningLessons: LearningLesson[] = [
  {
    id: "experience-beyond-screen",
    stage: "understand",
    title: "What counts as an experience?",
    outcome: "Map a person's task across interfaces, people, and time.",
    context: "A visitor checks in at a clinic kiosk and waits to be called.",
    teach: [
      "An interface is only one part of an experience. The visitor's goal is to arrive, be recognized by the clinic, and know what to do next. The kiosk, appointment record, staff handoff, waiting area, and eventual call all affect whether that goal succeeds. A screen can be easy to operate while the overall service remains uncertain.",
      "Start a UX review by naming the person, their goal, the setting, and what happens before and after the visible interaction. Trace each handoff: what information moves, who relies on it, and how the person learns that progress occurred. Include another channel when the primary one is unavailable. This makes it possible to locate a problem in the service rather than treating every problem as a screen-layout issue."
    ],
    misconception: "A polished check-in screen proves that check-in is complete. The visitor needs evidence that the clinic received the action and a clear next step.",
    workedExample: "An expert reviewing a kiosk that says 'Checked in. Please wait near reception' would ask what event triggers that message. If it appears before the staff system acknowledges receipt, the words may create false confidence. The expert maps kiosk submission, staff receipt, and visitor confirmation as separate moments before recommending a change.",
    guidedQuestion: "The kiosk can receive a staff-system acknowledgment, but has no printer. Which first change would you test? Choose one and explain what you would verify.",
    options: [
      { label: "Keep the fast reset and direct visitors to staff when uncertain.", feedback: "This preserves privacy and may work when staff are always available, but it transfers verification to the visitor and does not show whether the handoff succeeded. Observe whether staff can reliably answer and whether visitors notice the help route." },
      { label: "Leave 'Done' visible longer and add a larger next-step message.", feedback: "A longer message may be easier to see, but duration and typography cannot make an unacknowledged submission true. First determine what the system knows and when." },
      { label: "Confirm only after staff-system receipt, show a privacy-safe next step, and allow the visitor to end the session.", feedback: "This is strongest under the stated conditions because it ties the message to the service outcome. Verify that the acknowledgment means staff can act, and test how long a shared-screen confirmation can remain visible safely." }
    ],
    strongestOption: 2,
    evidenceShift: "If the staff system cannot give a reliable acknowledgment, use a clearly provisional status and an alternative confirmation route instead of claiming completion.",
    transferContext: "A warehouse handheld scanner saves a stock count locally, then synchronizes when connectivity returns.",
    transferTask: "Map the worker's full task from scanning to a confirmed inventory update. Distinguish local capture from remote sync and identify who needs to know when either step fails.",
    artifact: "A one-page task and handoff map with an annotated confirmation and recovery sequence.",
    assessmentFocus: "The map connects an interface detail to the worker's actual outcome, includes the offline state, and does not claim remote success from local capture.",
    patternIds: ["success-confirmation", "autosave-recovery", "sync-state"],
    sources: [{ label: "Nielsen Norman Group: What Is User Experience?", href: "https://www.nngroup.com/articles/what-is-user-experience/" }]
  },
  {
    id: "understandable-interaction",
    stage: "understand",
    title: "Make an interaction understandable",
    outcome: "Explain how people discover an action, predict its result, and recover from mistakes.",
    context: "A mobile document editor saves edits automatically but shows a small check mark with no label.",
    teach: [
      "People need a usable mental model of an interaction: what can I do, what will happen, what just happened, and what can I do if it was wrong? A signifier makes an action discoverable; a clear label and placement help people predict its effect; feedback shows the current state. These elements have to agree with the system's actual behavior.",
      "A check mark can mean 'saved on this device,' 'synced to the server,' or 'approved.' Those are different commitments. When an action takes time, show the transition as well as the final state. When it can fail, preserve the person's work and provide a recovery action. Test whether people can explain the state in their own words instead of asking whether they like the icon."
    ],
    misconception: "More feedback always means more notifications. The useful amount depends on the action's consequence, timing, and what the person already understands.",
    workedExample: "A reviewer sees the check mark after a local write while the network is offline. They change the state language to 'Saved on this device; waiting to sync' and design a later 'Synced' state. They also test what happens when the document closes before sync. The wording follows the state model rather than decorating it.",
    guidedQuestion: "The editor has reliable local saving but intermittent sync. Which state treatment would you prototype first? Explain the tradeoff.",
    options: [
      { label: "Use the same check mark for both local save and sync to keep the toolbar quiet.", feedback: "This reduces visual noise, but it merges states with different consequences. It could be acceptable only if remote sync does not matter to the user's next task, which needs evidence." },
      { label: "Name local save and sync separately, show pending sync unobtrusively, and surface failure with recovery.", feedback: "This best matches the system's actual transitions and protects the user's work. Test whether the pending state is noticeable when it matters without interrupting routine editing." },
      { label: "Show a blocking confirmation after every keystroke until remote sync completes.", feedback: "This provides strong certainty but would disrupt the core writing task and may make offline use impossible. A stronger interruption could be justified before a consequential share or handoff, not every edit." }
    ],
    strongestOption: 1,
    evidenceShift: "If the document is used only on one device and never shared, the distinction between local and remote state may be less prominent; the failure path still needs to be honest.",
    transferContext: "A physical parcel locker accepts a package and briefly lights a green indicator while its network is unavailable.",
    transferTask: "Design the immediate and later confirmation states. Explain what the sender can safely infer, what the operator knows, and how a failed registration is recovered.",
    artifact: "An annotated three-state sequence: accepted locally, registered remotely, and registration failed.",
    assessmentFocus: "Labels and feedback correspond to real state, the physical setting is considered, and a failed handoff has a recovery route.",
    patternIds: ["sync-state", "autosave-recovery", "success-confirmation", "error-state"],
    sources: [{ label: "Nielsen Norman Group: Ten Usability Heuristics", href: "https://www.nngroup.com/articles/ten-usability-heuristics/" }]
  },
  {
    id: "inclusive-completion",
    stage: "understand",
    title: "Who can complete the task?",
    outcome: "Identify barriers created by abilities, environment, and channel assumptions.",
    context: "A museum ticket kiosk gives directions through color and spoken prompts while visitors stand in a busy entrance.",
    teach: [
      "Accessibility is part of task completion, not a final visual check. A person may be unable to see color differences, hear a prompt in noise, reach a control, use touch precisely, read the displayed language, or maintain attention during a timeout. These constraints can be permanent, temporary, or situational, and several can occur together.",
      "Review each essential step by asking how a person perceives information, operates the control, understands the result, and recovers from error. Offer more than one usable way to receive critical information when the setting requires it. Do not assume that adding an audio prompt solves every visual barrier: the entrance may be loud, and private information may be unsafe to announce aloud."
    ],
    misconception: "One alternate format makes an experience accessible to everyone. Alternatives must match the task and be tested with people who use them.",
    workedExample: "An expert notices that a red light and a spoken 'payment declined' are the only failure signals. They propose a text status with a clear heading and next action, verify controls can be reached and operated, and ask visitors using assistive technology to test the payment and recovery sequence. They do not infer success from the presence of two modalities alone.",
    guidedQuestion: "A kiosk gives a spoken direction in a noisy hall and also shows a color-coded arrow. Which first revision would you test?",
    options: [
      { label: "Add a large pictogram beside the colored arrow and keep the spoken prompt.", feedback: "A pictogram may help many visitors, but it may still be ambiguous or inaccessible without text. Test comprehension with varied users and conditions." },
      { label: "Increase the spoken volume and lengthen the prompt.", feedback: "Higher volume can help some people but can increase noise and reveal private information. It does not help people who cannot hear or process the announcement." },
      { label: "Provide a text direction and labeled visual cue, retain optional audio, and test reach and comprehension in the actual hall.", feedback: "This is the strongest starting point because it does not make one sensory channel essential. The precise display, language, and audio controls still need testing with the visitors who use the kiosk." }
    ],
    strongestOption: 2,
    evidenceShift: "If the kiosk is used outdoors in bright light, contrast and glare testing may change the visual treatment; if the direction contains private information, the audio path may need individual control.",
    transferContext: "A voice-only smart speaker guides a person through pairing a home device.",
    transferTask: "Identify where a voice-only sequence fails for someone who misses a step or cannot hear it, and propose accessible alternatives without assuming a screen is available.",
    artifact: "A barrier and alternative map for the pairing journey, including a repeat and recovery path.",
    assessmentFocus: "The learner identifies who is excluded, distinguishes the setting from personal ability, and provides an equivalent way to complete the essential task.",
    patternIds: ["voice-command", "haptic-feedback", "error-state", "retry"],
    sources: [{ label: "W3C: Introduction to Web Accessibility", href: "https://www.w3.org/WAI/fundamentals/accessibility-intro/" }]
  },
  {
    id: "trust-and-consequence",
    stage: "understand",
    title: "What makes an experience trustworthy?",
    outcome: "Relate clarity, evidence, control, privacy, and reversibility to the stakes of a decision.",
    context: "An AI assistant drafts a customer message and offers to send it to an entire account list.",
    teach: [
      "Trustworthy UX lets people form accurate expectations and retain appropriate control. The interface should make the proposed action, recipient, source material, and consequence visible before commitment. A fluent draft or confident tone is not proof that the content is correct or that the user has authority to send it.",
      "The amount of review should reflect possible harm and reversibility. A small formatting change may need light feedback; a message to thousands of customers needs a reviewable payload, permissions, and a recovery plan. Privacy also matters: previewing sensitive information to the wrong role can be harmful even if no message is sent. Record uncertainty honestly and test whether users notice material limitations."
    ],
    misconception: "A generic 'Are you sure?' prompt creates informed consent. Confirmation without decision-critical context can increase clicks while leaving understanding unchanged.",
    workedExample: "An expert examines a 'Send now' button next to an AI draft. They add a review step showing recipients, the exact outgoing content, source status, and the operator's authority. If a source is outdated, the flow blocks the unsupported claim and offers editing or escalation. The design is judged by whether the human can actually catch a harmful action, not by the presence of a modal.",
    guidedQuestion: "The draft cites a superseded policy, but the operator can see the approved current policy. Which flow would you test first?",
    options: [
      { label: "Pause all AI drafting until the retrieval system is repaired.", feedback: "This is defensible if stale sources are widespread or reviewers cannot detect them, but it removes useful drafting for low-risk messages. Establish the scope of failure first." },
      { label: "Warn about the stale citation, let the operator check the current policy and edit, and require approval for exceptions.", feedback: "This is strongest when the current policy and reviewer authority can be verified. Test whether the warning is noticed under realistic workload and whether exceptions actually reach an authorized approver." },
      { label: "Let the operator acknowledge the warning and send, since the operator is responsible for the message.", feedback: "Acknowledgment alone may not supply authority or expose the policy difference. It shifts risk to a busy operator without ensuring the review is meaningful." }
    ],
    strongestOption: 1,
    evidenceShift: "If no approved policy can be reached or source errors are systematic, pausing the affected feature becomes more defensible until the source and review path are repaired.",
    transferContext: "A shared physical access terminal lets a supervisor revoke a contractor's building access immediately.",
    transferTask: "Describe the review, authority, confirmation, and reversal or support path for this action. Include what should and should not be displayed on a shared terminal.",
    artifact: "A concise risk and control map with an annotated action sequence.",
    assessmentFocus: "The proposal matches controls to consequence, identifies authority and privacy, and does not treat a generic confirmation as sufficient evidence of understanding.",
    patternIds: ["review-before-submit", "human-approval-gate", "source-grounding-display", "destructive-action-confirmation"],
    sources: [{ label: "NIST: AI Risk Management Framework", href: "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10" }]
  },
  ...diagnosingLessons,
  ...designingLessons,
  ...testingLessons,
  ...practicingLessons
];

export function lessonIndex(id: string) {
  return learningLessons.findIndex((lesson) => lesson.id === id);
}
