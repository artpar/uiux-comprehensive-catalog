import type { LearningLesson } from "./learning";

export const practicingLessons: LearningLesson[] = [
  {
    id: "work-with-constraints",
    stage: "practice",
    title: "Work with real constraints",
    outcome: "Turn a UX concern into a staged decision with owners, dependencies, and honest limits.",
    context: "A public library's self-service renewal kiosk sometimes loses network access during busy hours.",
    teach: [
      "Professional practice involves more than finding the ideal interaction. You must understand what the system can know, who can change it, the release window, and the cost of failure. Separate a minimum safe change from later improvements. State which risks need an operational answer rather than a new component.",
      "A useful proposal includes the user's goal, evidence, alternatives, dependencies, a decision owner, and what will be checked after release. Do not call a locally queued renewal complete when the central account has not accepted it. If a staff-assisted path is proposed, verify that staff can see the relevant state and have capacity to help."
    ],
    misconception: "A constraint automatically justifies a misleading shortcut. Limits should shape scope and sequencing while the status remains truthful.",
    workedExample: "An expert learns that the kiosk cannot synchronously confirm renewals during an outage. They recommend a clearly labeled pending receipt and a way to check status later, while operations defines an exception path for due items. A later release could add reliable sync acknowledgment. They assign ownership for the queued-record service and for visitor communication.",
    guidedQuestion: "The team can change kiosk copy this week, but reliable server acknowledgment needs another release. What do you recommend now?",
    options: [
      { label: "Show 'Renewed' after local queueing, since most requests eventually sync.", feedback: "This may reduce immediate uncertainty but makes a promise the kiosk cannot verify. A later sync failure could have real consequences for a borrower." },
      { label: "Disable all renewals during every network interruption and send visitors to the front desk.", feedback: "This is defensible if pending requests cannot be tracked safely. Before choosing it, check outage frequency, staff capacity, and whether a safe queued route exists." },
      { label: "Label the request pending, provide a status-check route, and agree on an exception process with staff before release.", feedback: "This is the strongest staged recommendation under the stated constraints. It preserves a useful route without claiming success; verify both the later status channel and staff process." }
    ],
    strongestOption: 2,
    evidenceShift: "If queued requests can be lost or the library cannot offer a reliable status check, disable the offline action until those controls exist.",
    transferContext: "An enterprise expense app queues manager approvals during an outage; payroll closes that evening.",
    transferTask: "Write a staged recommendation for the current release and the next release. Identify the manager, employee, finance operator, decision owner, and evidence needed to accept the risk.",
    artifact: "A one-page staged decision memo with constraints, dependencies, owners, and release checks.",
    assessmentFocus: "The memo connects an honest user state to operational ownership and identifies a condition that would change the release decision.",
    patternIds: ["sync-state", "success-confirmation", "retry"],
    sources: [{ label: "Nielsen Norman Group: Service Design 101", href: "https://www.nngroup.com/articles/service-design-101/" }]
  },
  {
    id: "coordinate-channels",
    stage: "practice",
    title: "Coordinate a service across channels",
    outcome: "Align information and recovery across digital, physical, and human touchpoints.",
    context: "A library member reserves a book online, receives a pickup notice, then uses a locker outside branch hours.",
    teach: [
      "A service journey crosses channels with different owners and different access conditions. Map where the person's expectation is formed and where it can be broken: availability online, notice timing, locker assignment, physical access, and support if the locker fails. Each handoff needs a clear source of truth and an owner.",
      "Consistency does not mean identical screens. A locker may have little space and no keyboard, while email can carry detail and staff can resolve exceptions. Keep critical status and terminology aligned. Offer a recovery route appropriate to the time and place, especially outside staffed hours. Test the whole journey, not only a prototype of one touchpoint."
    ],
    misconception: "Sending the same message everywhere creates a coherent service. Messages are useful only when they reflect the same current state and give the person an actionable next step.",
    workedExample: "An expert traces a reservation from shelf scan to locker assignment and pickup. They find that the email is sent when a book is pulled, before the locker is loaded. They change the notice trigger to verified locker loading and propose a status page plus after-hours support instructions. They test what a member sees when the locker code fails.",
    guidedQuestion: "The email says 'Ready for pickup' when staff pull the book, but locker loading can take two hours. What should change first?",
    options: [
      { label: "Send 'Preparing for pickup' at the shelf scan and 'Ready' after confirmed locker loading, with an after-hours failure route.", feedback: "This best aligns the promise with the physical state. Verify that locker loading is recorded reliably and that the failure route is actually staffed or self-service." },
      { label: "Keep 'Ready' and add 'allow two hours' in smaller text so members can plan.", feedback: "This gives a useful estimate but leaves the headline inaccurate and may still send people to an empty locker. It could work only with clear provisional wording and a dependable completion notice." },
      { label: "Remove all email updates and ask members to check the website before travel.", feedback: "A status page is useful, but eliminating notices shifts monitoring to members and may not solve stale status. Fix the event that drives all channels." }
    ],
    strongestOption: 0,
    evidenceShift: "If the locker has no reliable load signal, the team needs a verified staff action or a more conservative promise before claiming availability.",
    transferContext: "A hospital patient receives a telehealth appointment link, then may need an in-person test at a different site.",
    transferTask: "Map the cross-channel handoffs, identify conflicting or stale messages, and propose one failure recovery path for a patient who cannot use the link.",
    artifact: "A service blueprint fragment with touchpoints, backstage events, owners, and recovery messages.",
    assessmentFocus: "The artifact identifies the source of truth at each handoff, accounts for access barriers, and tests the complete task across channels.",
    patternIds: ["sync-state", "notification-center", "error-state"],
    sources: [{ label: "Nielsen Norman Group: Service Blueprints: Definition", href: "https://www.nngroup.com/articles/service-blueprints-definition/" }]
  },
  {
    id: "communicate-a-decision",
    stage: "practice",
    title: "Communicate a defensible decision",
    outcome: "Write a concise decision record that exposes evidence, alternatives, uncertainty, and follow-up.",
    context: "A team wants to replace a detailed enterprise export review screen with a one-click download.",
    teach: [
      "A decision memo helps a team act and revisit a choice later. State the task and risk before the solution. Present the evidence and its limits, compare real alternatives, recommend one with reasons, and say what remains uncertain. Name who owns the decision and what observation would trigger revision.",
      "Do not hide a tradeoff behind a polished mockup. In an export flow, speed may matter, but the user also needs to know which records and sensitive fields leave the system. Different roles may have different authority. If data is not available, say which assumption you are making and how you will check it."
    ],
    misconception: "A decision record must prove there is one perfect answer. It should show why a choice is responsible under known conditions and how the team will detect a wrong assumption.",
    workedExample: "An expert summarizes support tickets showing frequent accidental exports, notes that the sample does not reveal the rate among all users, and compares one-click export, a full review step, and risk-triggered review. They recommend a review summary for sensitive exports, preserve a quick path for low-risk data, and propose measuring correction and cancellation behavior after release.",
    guidedQuestion: "Which recommendation is most defensible given repeated accidental sensitive exports and a time-sensitive analyst workflow?",
    options: [
      { label: "Require the full review screen for every export, regardless of contents.", feedback: "This may be warranted if all exports are consequential, but it adds friction to low-risk work. Segment the data and evaluate whether the same safeguard is needed everywhere." },
      { label: "Use a focused review for sensitive exports, show scope and fields, keep a faster low-risk path, and monitor misexports.", feedback: "This balances the two observed needs and states what to inspect after release. Verify that sensitivity classification and role permissions are reliable." },
      { label: "Keep one-click export and add an undo toast after the file downloads.", feedback: "A downloaded file may already be outside the system, so an undo toast may not reverse exposure. Recovery needs to match the actual consequence." }
    ],
    strongestOption: 1,
    evidenceShift: "If classification is unreliable or every export contains protected information, a universal review step may be necessary until the underlying model improves.",
    transferContext: "A mobile banking team considers showing transaction details before a recurring transfer is scheduled.",
    transferTask: "Write a decision memo comparing at least two flows. State the evidence you have, what you still need, consequences of error, and the signal that would prompt revision.",
    artifact: "A decision memo of at most one page with recommendation, alternatives, uncertainty, owner, and review trigger.",
    assessmentFocus: "The memo ties its recommendation to evidence and consequence, treats alternatives fairly, and makes uncertainty and decision ownership explicit.",
    patternIds: ["review-before-submit", "data-export", "destructive-action-confirmation"],
    sources: [{ label: "Nielsen Norman Group: Three Uses for Analytics in UX Practice", href: "https://www.nngroup.com/articles/analytics-user-experience/" }]
  },
  {
    id: "capstone-ux-decision",
    stage: "practice",
    title: "Capstone: improve a whole experience",
    outcome: "Apply diagnosis, design, evaluation, and professional judgment to one connected service.",
    context: "A fictional city library offers room reservations through a website, mobile confirmation, a lobby kiosk, and staff help. A new AI assistant can suggest rooms but cannot finalize a reservation.",
    teach: [
      "A capstone should integrate methods rather than reward an attractive screen. Begin with the user's outcome and the evidence packet. Make a service map, separate observations from explanations, identify a consequential failure, compare changes, and decide what to test. Explain how you would coordinate the website, kiosk, assistant, and staff without making a channel promise it cannot fulfill.",
      "Treat AI suggestions as proposals whose source, confidence, and limits are visible. The authoritative booking system must confirm availability and completion. Define a human route for unusual accessibility or policy questions. Your recommendation can be staged, but the first stage needs a clear owner, measurement, and stop condition. This exercise assesses a documented decision, not professional certification."
    ],
    misconception: "A capstone is a single final mockup. The reviewable result is a chain from evidence to decision, tested states, and a plan to revise.",
    workedExample: "A fictional team finds that three of eight observed visitors thought the AI's 'room found' message meant a booking existed; two arrived to find the room unavailable. An expert records those observations without estimating a population rate, checks assistant and booking logs, then proposes 'Suggested room—confirm availability' and a real booking acknowledgment. They test whether visitors can distinguish suggestion from reservation and whether staff can recover conflicts.",
    guidedQuestion: "The assistant can suggest a room but the booking service is intermittently unavailable. Which release decision best fits the evidence packet?",
    options: [
      { label: "Show the best room as 'reserved' and quietly retry booking so visitors have a smooth experience.", feedback: "A retry may be useful, but the label falsely claims completion and could send someone to an unavailable room." },
      { label: "Remove all suggestions until the booking service has perfect availability.", feedback: "Pausing may be justified if suggestions routinely mislead or cannot be separated from bookings. Under the stated constraints, a clearly provisional suggestion can still help visitors explore options." },
      { label: "Label suggestions as provisional, require booking-system confirmation, show pending and failure states, and offer a staffed recovery path.", feedback: "This is the strongest starting proposal. Test whether people understand the distinction under realistic time pressure and verify that staff can resolve conflicts." }
    ],
    strongestOption: 2,
    evidenceShift: "If visitors still interpret provisional suggestions as bookings, change the interaction model or pause suggestions in the affected flow; copy alone may be insufficient.",
    transferContext: "A fictional community health center offers class registration through web, phone staff, and an automated chat assistant; classes have limited seats and eligibility rules.",
    transferTask: "Use this evidence packet: in six observed sessions, two people believed a chat suggestion was enrollment; one was ineligible after a staff check; phone staff use a booking ledger that updates every fifteen minutes. Produce a task and service map, observation-versus-hypothesis list, two design alternatives including failure states, a test plan with tasks and observations, a staged decision memo, and one revision rule. State what the small sample cannot establish.",
    artifact: "A compact case dossier: journey map, finding cards, state model, test plan, decision memo, and revision trigger.",
    assessmentFocus: "The dossier distinguishes facts from hypotheses; aligns all channels to the actual enrollment state; handles eligibility, access, authority, and recovery; compares alternatives; and uses test tasks that can overturn the recommendation.",
    patternIds: ["source-grounding-display", "human-approval-gate", "sync-state", "error-state"],
    sources: [
      { label: "NIST: AI Risk Management Framework", href: "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10" },
      { label: "Nielsen Norman Group: Service Blueprints: Definition", href: "https://www.nngroup.com/articles/service-blueprints-definition/" }
    ]
  }
];
