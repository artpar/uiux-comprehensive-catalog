export type FamilyGuide = {
  question: string;
  principle: string;
  method: string[];
  strong: string;
  weak: string;
  practice: string;
  starterIds: string[];
};

export const familyGuides: Record<string, FamilyGuide> = {
  "Navigation And Wayfinding": {
    question: "How does a person know where they are and which route leads to the task?",
    principle: "Navigation exposes the site's structure at the moment a person needs to move. A useful route has a recognizable label, a predictable destination, and an orientation cue after arrival.",
    method: ["Name the task and the starting page.", "Choose a route whose label predicts the destination.", "Show the current location and a useful return path.", "Observe people finding the destination from a realistic starting point."],
    strong: "A patient opens Appointments from the main navigation, sees Check in on the appointment page, and uses a breadcrumb to return to appointment details.",
    weak: "A patient opens Services, then Account, then Help while looking for check-in because each label appears equally plausible.",
    practice: "Trace one task across three pages and mark every point where the person chooses a route or checks their location.",
    starterIds: ["global-navigation", "breadcrumbs", "back-link"]
  },
  "Search, Browse, And Discovery": {
    question: "How can a person move from an uncertain description to a useful result?",
    principle: "Discovery supports several starting points: a known term, a broad category, a partial memory, or a set of constraints. The interface helps people refine their understanding while they search.",
    method: ["Record the terms and constraints people bring to the task.", "Offer a search or browse route that matches their starting point.", "Make scope and filters visible near results.", "Give each result enough context for a confident next choice."],
    strong: "A visitor searches for a quiet study room, filters by capacity and time, and sees available rooms with location and booking rules.",
    weak: "A visitor searches for quiet space, receives mixed events and rooms, then repeats the query because the result scope stays hidden.",
    practice: "Try three different descriptions of the same goal and record the route each description opens.",
    starterIds: ["basic-search", "filter-panel", "no-results-recovery"]
  },
  "Input And Data Entry": {
    question: "What information does the service need, and how can a person provide it accurately?",
    principle: "An input pattern carries a question, an expected answer, and a consequence. Visible labels, suitable controls, tolerant entry, and specific recovery keep that agreement clear.",
    method: ["State why each answer is needed.", "Choose a field that matches the answer and its format.", "Provide visible help before entry and precise correction after a problem.", "Preserve the answer through review and submission."],
    strong: "A refund form names each bank field, accepts pasted spacing, explains a mismatch, and shows a masked review.",
    weak: "A refund form asks for all bank information in one box, then shows a generic error after submission.",
    practice: "Choose one form field and write its purpose, label, accepted values, error response, and review state.",
    starterIds: ["text-input", "inline-validation", "bank-details"]
  },
  "Selection And Choice": {
    question: "How does the interface help a person understand and commit to a choice?",
    principle: "Choice controls express how many options are available, how many may be selected, and when the selection takes effect. The control should reveal the meaning and consequence of each choice.",
    method: ["List the options and their consequences.", "Choose a control for single or multiple selection.", "Show the current selection and when it takes effect.", "Check keyboard use, labels, and correction."],
    strong: "A booking form shows room types as labeled radio choices with capacity and price beside each option.",
    weak: "A booking form hides price differences inside a compact menu and shows the charge only after the visitor continues.",
    practice: "Take one choice screen and identify the choice set, selection count, default, consequence, and correction route.",
    starterIds: ["radio-group", "checkbox-group", "select"]
  },
  "Feedback, Status, And System State": {
    question: "What has the system received, and what should the person expect next?",
    principle: "Status connects an action to a real system event. A useful message names the current state, its consequence, and the next available action.",
    method: ["List the events that change the person's task.", "Write a distinct message for pending, received, delayed, and failed states.", "Place feedback near the action or result it explains.", "Test whether people infer the correct service status."],
    strong: "A clinic kiosk says Check-in received and gives a receipt number after the appointment service records arrival.",
    weak: "A clinic kiosk says Done while the staff queue still awaits the check-in record, so a patient asks reception whether arrival succeeded.",
    practice: "Map one button press to the real events behind it and write a truthful message for each meaningful state.",
    starterIds: ["loading-spinner", "error-state", "success-confirmation"]
  },
  "Error Prevention And Recovery": {
    question: "How does a person keep control when an action goes wrong?",
    principle: "Recovery begins before the error. Clear consequences, suitable constraints, preserved work, and a visible correction path reduce the cost of a mistake.",
    method: ["Name the likely error and its consequence.", "Add a cue or review step before a consequential action.", "Keep the person's work available for correction.", "Provide a specific route to retry, undo, restore, or contact support."],
    strong: "A document editor keeps the draft, identifies a conflicting change, and lets the person review versions before saving.",
    weak: "A document editor replaces the draft with a generic save error and sends the person back to an empty form.",
    practice: "Choose a task with a meaningful mistake and trace prevention, detection, correction, and confirmation.",
    starterIds: ["error-summary", "undo", "retry"]
  },
  "Disclosure And Attention Management": {
    question: "Which information belongs in view now, and what deserves interruption?",
    principle: "Attention is part of the task. Disclosure reveals supporting detail when it becomes useful; interruption earns prominence when the person must decide or act before continuing.",
    method: ["Identify the decision at the current step.", "Keep essential information visible near that decision.", "Place optional detail behind a clear disclosure label.", "Reserve blocking surfaces for consequential interruptions."],
    strong: "A booking page shows the price and cancellation rule beside Reserve, while a labeled disclosure holds the full venue policy.",
    weak: "A booking page hides the cancellation charge in a tooltip and opens a modal for routine help while the visitor chooses a room.",
    practice: "Mark each item on a page as essential now, useful on request, or requiring an interruption, and explain the task consequence.",
    starterIds: ["progressive-disclosure", "accordion", "modal-dialog"]
  },
  "Data Display And Exploration": {
    question: "What decision should the data display help a person make?",
    principle: "A display makes relationships visible. Its format follows the comparison, trend, detail, or monitoring question that the person needs to answer.",
    method: ["Write the question before selecting a chart or table.", "Choose rows, marks, labels, and units that reveal the relevant comparison.", "Provide sorting, filtering, or detail when the task calls for it.", "Check how the same information works at narrow widths and through assistive technology."],
    strong: "A clinic manager compares check-in delays by hour in a labeled chart and opens a table for exact counts and cases.",
    weak: "A clinic manager sees a colorful dashboard with unlabeled totals and searches elsewhere for the definition of delayed check-in.",
    practice: "Write one question about a dataset, choose a display format, and name the exact value or comparison a reader should find.",
    starterIds: ["table", "data-visualization", "dashboard-layout"]
  },
  "Task And Workflow Patterns": {
    question: "How do several steps become one understandable outcome?",
    principle: "A workflow joins actions across time, people, and systems. Each step gives the person enough context to continue, review, pause, or recover.",
    method: ["Define the end state and the people involved.", "Map steps and handoffs in the order they occur.", "Show progress, saved state, and consequences at decision points.", "Test interruption and return as part of the full task."],
    strong: "A booking flow carries the selected room and date through review, payment, and confirmation, with a clear route back to edit details.",
    weak: "A booking flow resets the room after payment fails and sends the visitor to the beginning of the process.",
    practice: "Map a five-step task and annotate where information is saved, reviewed, transferred, and confirmed.",
    starterIds: ["booking", "review-queue", "task-list"]
  },
  "Collaboration And Social Interaction": {
    question: "How do people understand shared work and each other's actions?",
    principle: "Collaborative interfaces show who changed what, where attention is needed, and how a person can respond. Shared state needs clear ownership and timing.",
    method: ["Name the shared object and the people who can act on it.", "Show authorship, timing, and status for meaningful changes.", "Choose a notification or handoff for the next responsible person.", "Test simultaneous edits and a return after absence."],
    strong: "A reviewer sees the latest document change, its author, an unresolved comment, and the action needed before approval.",
    weak: "A reviewer sees a changed document and an activity feed with vague entries, then asks teammates which version needs approval.",
    practice: "Follow one shared object through an edit, comment, handoff, and decision; record which person needs which information at each point.",
    starterIds: ["comments", "activity-feed", "handoff-summary"]
  },
  "Personalization And Preference": {
    question: "Which choices should the service remember and place under user control?",
    principle: "Preferences help a recurring task when the saved choice is visible, reversible, and scoped to the right person and device. Defaults should preserve a clear starting point.",
    method: ["Identify a repeated choice that has real task value.", "State its scope and expected effect.", "Show the current setting and a clear way to change it.", "Check how the preference behaves across devices and shared contexts."],
    strong: "A user selects compact table density, sees the change immediately, and finds the same labeled setting on the next visit.",
    weak: "A service quietly changes a user's dashboard order after one click, then leaves the reason and reset path unclear.",
    practice: "Choose one saved preference and specify its scope, default, immediate effect, persistence, and reset route.",
    starterIds: ["preference-center", "custom-dashboard", "adaptive-defaults"]
  },
  "AI And Automation UX": {
    question: "How does a person understand and control an automated contribution?",
    principle: "An automated system should expose what it is doing, the evidence behind its output, the limits of its authority, and the action a person can take next.",
    method: ["Name the task delegated to automation and the consequence of its output.", "Show relevant sources, progress, and uncertainty at the point of use.", "Give people a review and correction path before consequential action.", "Record the handoff and test failure or low-confidence cases."],
    strong: "An assistant drafts a reply with cited policy passages, shows the pending action, and asks a staff member to review before sending.",
    weak: "An assistant sends a confident reply from incomplete policy context and leaves staff to discover the action through a later customer complaint.",
    practice: "Map one automated action from request to evidence, proposal, review, execution, and correction.",
    starterIds: ["source-grounding-display", "human-approval-gate", "correction-feedback"]
  },
  "Trust, Safety, And Privacy": {
    question: "What promise does the service make when it asks for information or action?",
    principle: "Trust grows when purpose, consequence, status, and control are visible at the point of decision. Sensitive tasks also need a safe route for correction and exit.",
    method: ["Name the information or action and its purpose.", "Explain the consequence before commitment.", "Provide control over sharing, correction, and withdrawal where relevant.", "Check what the service records and communicates afterward."],
    strong: "A clinic explains why identity details are needed, shows the recipients of a shared record, and offers a clear correction route.",
    weak: "A clinic asks for sensitive details under a generic Continue button and reveals the sharing scope after submission.",
    practice: "Choose a sensitive action and write the purpose, consequence, consent point, confirmation, and correction route.",
    starterIds: ["consent-prompt", "permission-sharing", "sensitive-data-reveal"]
  },
  "Cross-Device And Physical Interaction": {
    question: "How does the task survive a change in device, place, or input mode?",
    principle: "The same outcome may cross touch, camera, voice, keyboard, sensors, and offline moments. Design each transition as part of the task rather than a separate surface.",
    method: ["Map the task and the environments where it occurs.", "Identify the device capabilities and permissions each step uses.", "Provide a visible alternative and recovery route for interruption.", "Test continuity across input modes and connection states."],
    strong: "A visitor starts a room reservation on a phone, scans a lobby code, and sees the same reservation status at the kiosk.",
    weak: "A visitor completes a phone reservation, then the lobby kiosk requests a new booking because the two surfaces show different status.",
    practice: "Trace one task across two devices and identify the shared state, permission request, interruption, and recovery point.",
    starterIds: ["responsive-navigation-adaptation", "offline-mobile-retry", "qr-scan"]
  }
};
