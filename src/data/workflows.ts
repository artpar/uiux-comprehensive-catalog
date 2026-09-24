export type WorkField = { id: string; label: string; help: string; placeholder: string };
export type Workflow = { id: string; title: string; description: string; result: string; fields: WorkField[]; lessonId: string; patternIds: string[] };

export const workflows: Workflow[] = [
  {
    id: "ux-critique",
    title: "UX critique and problem statement",
    description: "Turn an experience concern into a grounded, testable problem statement.",
    result: "A concise critique with observations, hypotheses, user impact, and the next evidence to gather.",
    lessonId: "frame-the-problem",
    patternIds: ["error-state", "success-confirmation"],
    fields: [
      { id: "task", label: "Person, goal, and setting", help: "Name who is trying to do what, and where the task starts and ends.", placeholder: "A first-time visitor is trying to..." },
      { id: "observation", label: "Observed behavior or evidence", help: "Describe what happened without assigning a cause. Include source and limits.", placeholder: "In three observed sessions..." },
      { id: "hypotheses", label: "Possible causes", help: "List at least two explanations. Say what evidence would distinguish them.", placeholder: "One possibility is... Another is..." },
      { id: "impact", label: "Consequence and affected people", help: "What goes wrong, for whom, and how recoverable is it?", placeholder: "If the task fails..." },
      { id: "statement", label: "Problem statement", help: "State the gap between the person's goal and what currently happens, without prescribing a component.", placeholder: "People need to... but currently..." },
      { id: "next", label: "Next check", help: "Choose a check that could change the proposed framing.", placeholder: "We will observe or inspect..." }
    ]
  },
  {
    id: "test-plan",
    title: "Research and usability test plan",
    description: "Design a small study that answers a specific product decision.",
    result: "A shareable plan with decision, participants, realistic tasks, observations, and limits.",
    lessonId: "choose-a-test",
    patternIds: ["review-before-submit", "error-state"],
    fields: [
      { id: "decision", label: "Decision to inform", help: "What will the team do differently based on this study?", placeholder: "Decide whether..." },
      { id: "participants", label: "Participants and context", help: "Describe who should participate, including relevant access and environment conditions.", placeholder: "Recruit people who..." },
      { id: "tasks", label: "Task scenarios", help: "Write realistic goals without naming the controls you want clicked.", placeholder: "You have arrived... What would you do?" },
      { id: "observations", label: "What to observe", help: "Specify behavior and system state that answer the decision.", placeholder: "Record whether the person..." },
      { id: "success", label: "Completion and failure", help: "Define what counts as success, misunderstanding, and recoverable failure.", placeholder: "The task is complete when..." },
      { id: "limits", label: "Study limits and next step", help: "Name what this method and sample cannot establish.", placeholder: "This study cannot tell us..." }
    ]
  },
  {
    id: "decision-memo",
    title: "Design decision memo and state model",
    description: "Make a defensible recommendation for an interaction with real consequences.",
    result: "A memo covering alternatives, key states, authority, uncertainty, and a revision trigger.",
    lessonId: "communicate-a-decision",
    patternIds: ["review-before-submit", "sync-state"],
    fields: [
      { id: "decision", label: "Decision and user outcome", help: "Name the choice and the task outcome it must support.", placeholder: "We need to decide whether..." },
      { id: "evidence", label: "Evidence and uncertainty", help: "Separate observations from assumptions and note their limits.", placeholder: "We observed... We still do not know..." },
      { id: "alternatives", label: "Alternatives and tradeoffs", help: "Compare at least two realistic approaches, including costs.", placeholder: "Option A... Option B..." },
      { id: "states", label: "State and recovery model", help: "Describe initial, pending, success, failure, and recovery states where relevant.", placeholder: "Before action... While pending... If it fails..." },
      { id: "recommendation", label: "Recommendation, owner, and dependencies", help: "Say what to do first and who must make or support the decision.", placeholder: "Recommend... The owner is..." },
      { id: "revision", label: "Test and revision trigger", help: "What evidence would make the team change course?", placeholder: "If we observe... we will..." }
    ]
  }
];
