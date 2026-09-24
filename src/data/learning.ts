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
  evidencePacket?: string[];
  artifact: string;
  assessmentFocus: string;
  assessmentCriteria?: string[];
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
      { label: "Wait for staff-system receipt, then clear the kiosk promptly and send a confirmation to the visitor's phone.", feedback: "This ties confirmation to receipt and protects the shared screen. It depends on visitors having a usable phone and consenting to that channel; test access and privacy before relying on it." },
      { label: "Show a provisional kiosk message immediately, then ask the visitor to check status with reception.", feedback: "The provisional wording is honest and may be necessary without reliable acknowledgment. Here, the system can acknowledge receipt, so this approach adds a staff handoff that may be avoidable. Observe whether the reception route works at busy times." },
      { label: "Wait for staff-system receipt, then show a brief confirmation and next step on the kiosk.", feedback: "This is the strongest first test under the stated conditions because it connects the message to the service outcome without requiring another device. Verify that acknowledgment means staff can act; test visibility, privacy, and how the shared screen resets." }
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
      { label: "Keep one quiet Saved label in the toolbar and put detailed sync status in the document menu.", feedback: "This keeps routine editing calm and may fit a single-device task. It risks hiding a pending remote copy when a collaborator or another device depends on it; test whether people find the detail at the moment it matters." },
      { label: "Distinguish saved-on-device from synced in the toolbar, with a recoverable failure state.", feedback: "This best matches the system's actual transitions while preserving routine editing. Test whether the pending state is noticeable when it matters without making every save feel urgent." },
      { label: "Show separate local and remote status badges persistently beside the document title.", feedback: "This makes both states visible and can suit high-stakes shared work. It may add constant noise to ordinary editing; test comprehension and attention costs before using a persistent dual display." }
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
      { label: "Pair the existing color arrow with a large pictogram and a staff-help route.", feedback: "This may help many visitors and gives a fallback, but the symbol's meaning may vary and staff availability is uncertain. Test comprehension and whether the route works in the real hall." },
      { label: "Add a text direction to the arrow and keep audio automatic for every visitor.", feedback: "Text improves the visual channel, but automatic speech may be missed in noise or reveal private information. Test whether audio can be controlled and whether the text remains usable with glare and at different heights." },
      { label: "Use text and a labeled visual cue, with optional audio and a reachable help route.", feedback: "This is the strongest starting point because essential information is not tied to one sensory channel. The language, reach, privacy, and comprehension still need testing with people using the kiosk in the hall." }
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
      { label: "Pause drafting for policy-sensitive messages while leaving routine drafting available.", feedback: "This is defensible if stale sources are widespread or reviewers cannot reliably detect them. It can also withhold useful drafting when an approved current policy and authorized reviewer are available. Establish the scope of failure first." },
      { label: "Flag the stale source, route the operator to the approved policy, and require approval for exceptions.", feedback: "This is strongest when the current policy and reviewer authority can be verified. Test whether the warning is noticed under realistic workload and whether exceptions actually reach an authorized approver." },
      { label: "Require the operator to compare the draft and current policy, then record their attestation before sending.", feedback: "This adds a meaningful review record, but an attestation alone may not handle exceptions that require another authority. It could fit messages entirely within the operator's remit; define that boundary and test the review." }
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
