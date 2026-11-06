export type WorkedDecision = {
  path: string;
  title: string;
  description: string;
  question: string;
  answer: string;
  scenario: string;
  caption: string;
  columns: [string, string, string];
  rows: Array<[string, string, string]>;
  reasoning: string;
  boundary: string;
  checks: string[];
  patternIds: string[];
  evidence: Array<{ title: string; url: string; claim: string }>;
  updated: string;
  sourcesChecked: string;
};

const updated = "2026-11-06";
const sourcesChecked = "2026-11-06";

export const priorityEditorial: WorkedDecision[] = [
  {
    path: "/compare/focus-traversal-vs-keyboard-shortcut-vs-skip-link-vs-modal-dialog-vs-toolbar-vs-data-grid/",
    title: "Keyboard navigation: focus order, skip links, and widgets",
    description: "Choose page Tab order, skip links, modal focus, toolbar arrows, and grid navigation using a worked document-review task.",
    question: "Which keyboard behavior belongs to the page, and which belongs inside a widget?",
    answer: "Start with a logical page Tab sequence. Add a skip link for repeated navigation and a managed keyboard model only for the component that needs it. A shortcut accelerates a command; it does not repair a broken route to that command.",
    scenario: "A reviewer opens a document workspace with repeated navigation, a formatting toolbar, an editable data grid, and a Rename dialog. The reviewer needs to reach the document, edit a value, rename the file, and continue where they left off.",
    caption: "One task crosses several keyboard scopes",
    columns: ["Point in the task", "Expected behavior", "Decision it resolves"],
    rows: [
      ["Arrive at the workspace", "An early skip link reaches the main work area.", "Bypass repeated blocks rather than adding many extra Tab presses."],
      ["Move between controls", "Tab and Shift+Tab follow the meaningful page order.", "Arrange the source order to support the task before considering shortcuts."],
      ["Enter the toolbar or grid", "The component supplies its documented arrow-key behavior and a route back out.", "Treat the widget as a keyboard scope rather than making every cell a page stop."],
      ["Rename the file", "Focus enters the modal, remains inside while open, and returns to its opener after cancellation.", "Contain focus for the modal task, then restore the page route."]
    ],
    reasoning: "Each behavior solves a different movement problem. Giving every grid cell a Tab stop makes the page route unnecessarily long. Making arrow keys move across the whole page instead creates a surprising global interaction. Define the boundaries first, then test the transitions between them.",
    boundary: "A normal table of readable values does not acquire a grid keyboard model just because it contains rows and columns. Use a grid when the interaction requires managed cell navigation, and budget for that behavior explicitly.",
    checks: ["Start at the address bar and reach the main task using the keyboard.", "Enter and leave each composite widget without losing visible focus.", "Open Rename, cycle forward and backward, press Escape, and check the return target.", "Repeat after a responsive layout change; visual order and keyboard order should still make sense together."],
    patternIds: ["focus-traversal", "skip-link", "data-grid"],
    evidence: [
      { title: "W3C APG: Keyboard interface", url: "https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/", claim: "APG distinguishes page Tab movement from managed movement inside composite widgets." },
      { title: "MDN: tabindex", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex", claim: "MDN explains sequential focus participation and advises against positive tabindex values for routine ordering." }
    ], updated, sourcesChecked
  },
  {
    path: "/compare/checkbox-group-vs-multi-select/",
    title: "Checkboxes vs multi-select: choosing a selection control",
    description: "Compare visible checkboxes with a searchable multi-select through short service choices and a long location list, including review and keyboard states.",
    question: "Should people see every choice or search for a known item?",
    answer: "Use visible checkboxes when people benefit from comparing a short set of independent choices. Consider a searchable multi-select when the list makes that comparison impractical and people can identify items by name. Keep the selected set reviewable in either design.",
    scenario: "A facilities request has four service options: cleaning, repairs, security, and catering. A second field assigns the request to locations from a list of 180 buildings. Both fields allow several selections, but they present different finding and review problems.",
    caption: "The same multiple-selection rule can need different controls",
    columns: ["Field", "Proposed control", "State to make visible"],
    rows: [
      ["Four services", "A labelled checkbox group with a hint explaining multiple selection.", "All options and checked values remain visible together."],
      ["180 building names", "A searchable multi-select with a persistent selected-items summary.", "Searching changes available matches while previous selections remain reviewable."],
      ["Remove a building", "A named remove action for that selected building.", "Only the intended building leaves the selected set."],
      ["Submit the request", "A review of the chosen services and locations.", "The submitted values match the selections the person could inspect."]
    ],
    reasoning: "There is no universal option-count cutoff. The four services invite comparison, while location assignment is often a known-item search. Prototype both controls if location names are unfamiliar or users need to compare attributes rather than recognize names.",
    boundary: "A native multiple select, a listbox, and a chip-based searchable picker have different interaction models. Specify the actual control rather than treating the word multi-select as a complete accessibility contract. Do not place independently operable buttons or checkboxes inside listbox options.",
    checks: ["Select two services using only the keyboard and verify the group label is available.", "Choose a building, search for another, and verify the first remains selected.", "Remove one selection and confirm the remaining values are preserved.", "Check the chosen control with touch, keyboard, and assistive technology before adopting it."],
    patternIds: ["checkbox-group", "multi-select"],
    evidence: [
      { title: "GOV.UK: Checkboxes", url: "https://design-system.service.gov.uk/components/checkboxes/", claim: "GOV.UK documents grouped multiple choices and explanatory hints." },
      { title: "W3C APG: Listbox", url: "https://www.w3.org/WAI/ARIA/apg/patterns/listbox/", claim: "APG distinguishes focus from selection and warns that listbox options do not support nested interactive controls." }
    ], updated, sourcesChecked
  },
  {
    path: "/compare/filter-reset-that-clears-unrelated-search-vs-filter-panel-vs-basic-search-vs-filter-chips-vs-saved-search/",
    title: "Clear filters without losing the search query",
    description: "Define what Clear filters, chip removal, Clear search, and saved-search reset should change using a worked invoice-search state table.",
    question: "What exactly should Clear filters clear?",
    answer: "Make the reset scope match its label. Clear filters should restore filter defaults while preserving independent search text and sort choices. If the product resets the whole search, name that broader action explicitly.",
    scenario: "An analyst searches invoices for Atlas, applies Status: overdue and Region: north, sorts by amount, and reaches page 3. The current combination returns no rows. The analyst wants to broaden the results while continuing to look for Atlas invoices.",
    caption: "Keep independent state separate from filter state",
    columns: ["Action", "Changed state", "Preserved state"],
    rows: [
      ["Remove Region: north", "Remove that criterion and recompute results from page 1.", "Query Atlas, overdue status, and amount sort remain."],
      ["Clear filters", "Restore all filter defaults and recompute results from page 1.", "Query Atlas and amount sort remain."],
      ["Clear search", "Remove Atlas and recompute results from page 1.", "Applied filters and sort remain unless the action states a broader scope."],
      ["Reset saved search", "Restore the documented saved bundle, which may include query, filters, and sort.", "The selected view and any unsaved changes follow the visible reset contract."]
    ],
    reasoning: "The page reset is a consequence of changing the result set, not permission to erase unrelated choices. Returning to page 1 avoids leaving the analyst on a page that no longer exists. Keep this pagination policy explicit in implementation and review.",
    boundary: "Batch filters have both draft controls and applied criteria. Reset draft and Clear applied filters should be different actions when their effects differ. A saved search can legitimately own a broader bundle, but that ownership must be visible.",
    checks: ["Enter a query, set two filters and a sort, then activate Clear filters.", "Confirm the query and sort remain, the filters return to defaults, and the result summary matches the controls.", "Use browser Back and a copied URL to check state restoration.", "Repeat in the mobile filter drawer and in the no-results recovery path."],
    patternIds: ["filter-panel", "filter-chips", "basic-search"],
    evidence: [
      { title: "Carbon: Filtering", url: "https://www.carbondesignsystem.com/building-blocks/core/patterns/filtering", claim: "Carbon defines clearing filters as restoring their default starting state and distinguishes instant from batch application." },
      { title: "MOJ: Filter", url: "https://design-patterns.service.justice.gov.uk/components/filter/", claim: "The MOJ component exposes selected filters and a scoped clearing action. Preserving the independent invoice query is the design decision in this worked case." }
    ], updated, sourcesChecked
  },
  {
    path: "/patterns/table/",
    title: "Table UX: when to use a table, list, or data grid",
    description: "Use a payment-review example to choose a table, preserve sorting and pagination context, and distinguish readable tables from editable data grids.",
    question: "Does the task need comparison across columns or movement between editable cells?",
    answer: "Use a table when aligned attributes help people compare records. Add a grid interaction model only when cell navigation or editing is part of the task. Sorting and a few row actions alone do not turn a table into a spreadsheet.",
    scenario: "A reviewer compares vendor payments by status, due date, and amount. Atlas Office is pending at $1,240, Blue Harbor is approved at $860, and Civic Print is pending at $2,140. The reviewer needs the largest pending payment and a clear action for that vendor.",
    caption: "Follow the review task rather than choosing a spreadsheet by appearance",
    columns: ["Task step", "Table behavior", "Check the result"],
    rows: [
      ["Compare payments", "Keep each vendor in a row and each shared attribute in its column.", "The caption and headers explain what each value represents."],
      ["Sort by amount", "Reorder the full matching set, then display the current page.", "The active sort and the visible row order agree."],
      ["Filter to pending", "Recompute the matching set and the page count.", "The filter, row count, and displayed payments describe the same set."],
      ["Open Civic Print", "Use a row action labelled for that vendor.", "The opened record matches the action's accessible name."]
    ],
    reasoning: "Aligned columns make the comparison explicit. A card layout may work better when imagery and uneven descriptions drive recognition. An editable budget worksheet is a different task and may justify a data grid with managed keyboard focus.",
    boundary: "Choose a narrow-screen strategy for the actual task. A scrollable comparison table and a stacked record list preserve different scanning relationships. Keep labels available and test access to every column; wrapping values alone is not a responsive strategy.",
    checks: ["In the lab, sort Amount and inspect the announced sort state.", "Filter to Pending, move a page, and check that counts and order remain synchronized.", "Follow a named row action and verify its record context.", "Test headers, sort controls, and horizontal scrolling with keyboard and assistive technology."],
    patternIds: ["table", "data-grid", "list-view"],
    evidence: [
      { title: "W3C APG: Table", url: "https://www.w3.org/WAI/ARIA/apg/patterns/table/", claim: "APG treats tables as tabular structures rather than composite keyboard widgets." },
      { title: "USWDS: Table", url: "https://designsystem.digital.gov/components/table/", claim: "USWDS documents captions, header associations, sort announcements, and focusable scroll regions." },
      { title: "W3C APG: Grid", url: "https://www.w3.org/WAI/ARIA/apg/patterns/grid/", claim: "APG describes the additional focus-management responsibilities of interactive grids." }
    ], updated, sourcesChecked
  },
  {
    path: "/patterns/modal-dialog/",
    title: "Modal dialog UX: focus, Escape, and return behavior",
    description: "Decide when a modal is justified and test focus entry, Tab containment, Escape, cancellation, and return using an edit-display-name example.",
    question: "Does this short task need to pause the page behind it?",
    answer: "Use a modal for a contained task that temporarily suspends the surrounding page. Keep the task short, provide a clear exit, and define where focus goes when the layer opens and closes.",
    scenario: "A teammate chooses Edit display name from an account page. The layer contains one field, Save name, Cancel, and a close control. The person can finish this small edit without losing the account-page context.",
    caption: "The modal contract includes entry, containment, and return",
    columns: ["State", "Expected behavior", "Failure to investigate"],
    rows: [
      ["Open", "Move focus to an appropriate element inside the titled dialog.", "Focus stays on a control behind the layer."],
      ["Tab forward and backward", "Cycle through the modal's available controls.", "Focus escapes to the account page or reaches hidden controls."],
      ["Cancel or press Escape", "Close the edit without applying it and restore the invoking context.", "The name changes on cancellation or focus drops to the document body."],
      ["Save name", "Apply the edit, communicate its outcome, and return to a logical place.", "The layer disappears while the person remains uncertain whether the edit succeeded."]
    ],
    reasoning: "The dimmed background is only a visual cue. Modality also requires behavior that keeps the surrounding page unavailable. Focus placement and the exit path should be designed with the task, rather than patched after the animation is built.",
    boundary: "Use a full page for a long, shareable workflow. Use an inline region or non-modal surface when the person must keep operating the background. If the opener has been removed, return focus to the next logical workflow target.",
    checks: ["Open the Good UX example using the keyboard and locate the focused element.", "Traverse every available control in both directions and check the wrap points.", "Press Escape, reopen, then cancel; compare both exit paths and their return target.", "Complete the edit and check the displayed name and outcome message."],
    patternIds: ["modal-dialog", "popover"],
    evidence: [
      { title: "W3C APG: Modal dialog", url: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/", claim: "APG specifies an inert background, contained tab sequence, Escape dismissal, and logical focus placement and return." },
      { title: "W3C: HTML dialog technique H102", url: "https://www.w3.org/WAI/WCAG22/Techniques/html/H102.html", claim: "The HTML dialog technique supplies implementation and testing guidance. Passing the lab checks alone does not establish full accessibility conformance." }
    ], updated, sourcesChecked
  },
  {
    path: "/patterns/empty-state/",
    title: "Empty-state UX: first use, no results, and failed loading",
    description: "Choose an honest explanation and recovery action for an empty projects area by distinguishing first use, filtering, permissions, and service failure.",
    question: "Is the area genuinely empty, or is the product unable to show its contents?",
    answer: "Choose the message from the known cause. An empty collection, zero matching results, missing access, and a failed request need different explanations and next actions, even when the visible area has the same blank shape.",
    scenario: "A project workspace shows no project cards. An administrator can create a project, a reviewer can only view assigned projects, and a filter can hide projects that already exist. The same Create your first project message would mislead at least two of these situations.",
    caption: "Resolve the cause before writing the empty-state action",
    columns: ["Known cause", "Useful message", "Appropriate next action"],
    rows: [
      ["Successful load; no projects exist", "Explain what a project enables and that the collection is empty.", "Offer Create project to someone with creation permission."],
      ["Projects exist; none match the filters", "Explain that the current criteria have no matches.", "Show or remove the relevant criteria while preserving independent search context."],
      ["The role cannot view projects", "Explain the access boundary without disclosing restricted records.", "Offer an authorized access-request route where one exists."],
      ["The request failed", "State that projects could not be loaded.", "Offer retry or another supported recovery route rather than creation as a remedy."]
    ],
    reasoning: "The next action should address the cause the system actually knows. A decorative illustration cannot distinguish no data from a service failure, and a creation button is not useful to a read-only reviewer.",
    boundary: "Terminology differs between design systems: some group error and permission presentations under empty states. The operational distinction matters more than the label. Keep loading, known absence, and inability to retrieve data separate in the state model.",
    checks: ["Test first use separately from a filter that returns zero matches.", "Repeat with a read-only role and a failed request.", "Check that the primary action is possible for the current person.", "After recovery, verify that the state changes to the actual loaded result."],
    patternIds: ["empty-state", "no-results-recovery", "error-state"],
    evidence: [
      { title: "Carbon: Empty states", url: "https://www.carbondesignsystem.com/building-blocks/core/patterns/empty-states", claim: "Carbon distinguishes causes including no data, user-action results, and error management, and emphasizes contextual next steps." }
    ], updated, sourcesChecked
  },
  {
    path: "/patterns/activity-feed/",
    title: "Activity feed UX: catch-up, notifications, and audit history",
    description: "Design a useful activity feed with actor, action, object, scope, destination, grouping, and honest boundaries around unread state and audit evidence.",
    question: "Is the person catching up, managing attention, or investigating evidence?",
    answer: "Use the feed to make recent changes understandable and actionable. Define unread and clearing behavior when attention management is part of the task, and provide a separate evidence contract when someone needs an audit trail.",
    scenario: "A release reviewer returns after an hour away. The stream includes a failed build, a mention requesting review, a handoff reply, and repeated reactions. The reviewer needs to find the failed run and the decision requiring attention, rather than inspect every reaction individually.",
    caption: "An event needs context and a destination",
    columns: ["Feed item", "Useful presentation", "Promise to keep explicit"],
    rows: [
      ["Build bot marked release-128 failed", "Show the release scope, event time, and an Open run destination.", "The item routes to the actual failed run rather than a generic project page."],
      ["A teammate requested review", "Show who asked, what needs review, and enough preview to decide the next action.", "Opening, marking read, and resolving the underlying request can be different states."],
      ["Repeated reactions", "Group related noise while retaining a way to inspect relevant detail.", "Grouping must not conceal the event that changes the review decision."],
      ["Cleared activity", "Explain what clearing changes in this feed.", "Clearing attention items must not imply deletion of the underlying work or audit record."]
    ],
    reasoning: "A timestamped list is not automatically an audit log. Evidence work needs stated retention, completeness, access, and export behavior. Conversely, a lightweight catch-up surface can be useful without making those guarantees.",
    boundary: "Products combine feed and notification behavior. Microsoft Teams is one example, not a universal taxonomy. Decide which promises your surface makes, especially around unread counts, clearing, retention, and deep-link access.",
    checks: ["Find a mention, a failed run, and a handoff from the stream.", "Follow each destination and confirm its object and scope.", "Group reactions and verify that important events remain findable.", "Clear an item and inspect the distinction between feed state and the underlying record."],
    patternIds: ["activity-feed", "activity-log", "notification-center"],
    evidence: [
      { title: "Microsoft: Activity feed notification design", url: "https://learn.microsoft.com/en-us/microsoftteams/platform/concepts/design/activity-feed-notifications", claim: "Microsoft's anatomy includes the initiating actor, reason, timestamp, location, and a preview. The retention statement on that page is specific to Teams." }
    ], updated, sourcesChecked
  },
  {
    path: "/patterns/success-confirmation/",
    title: "Success confirmation UX: receipt, status, and next steps",
    description: "Distinguish saving, draft saved, evidence accepted, and application submitted so confirmation messages communicate the exact outcome and recovery route.",
    question: "Which outcome has the system actually confirmed?",
    answer: "Name the completed operation precisely and show the next useful action. Saving a draft, accepting an upload, and submitting an application are different outcomes. A success cue should preserve those boundaries.",
    scenario: "A person adds evidence to an application. The interface first saves a draft, then accepts the file with receipt EV-2048. The person still needs to review and submit the application. Calling the upload Application complete would incorrectly collapse these separate commitments.",
    caption: "Confirm the committed outcome, not the furthest possible interpretation",
    columns: ["State", "Message should establish", "What remains"],
    rows: [
      ["Saving", "The request is in progress.", "Wait for the actual result before showing success."],
      ["Draft saved", "The draft and its reference are available.", "Continue review and submit when ready."],
      ["Evidence uploaded", "The named file was accepted and a receipt can be inspected.", "Check the receipt; the application may still be a draft."],
      ["Application submitted", "The final submission was recorded, with durable proof and next steps.", "Explain expected follow-up and how to return to the record."]
    ],
    reasoning: "A transient status message can acknowledge an operation. A completed transaction may also need durable proof. Make the receipt or completed record remain available when the transient message disappears.",
    boundary: "Use proportionate feedback. A copied reference can use a small status update; a consequential submission needs a stronger record of what was received. A visual check mark alone cannot communicate the scope of completion.",
    checks: ["In the lab, move from saving to draft saved and then evidence uploaded.", "Compare the named outcome, reference, and offered next action at each step.", "Dismiss transient feedback and locate the durable record.", "Check status announcements with assistive technology and test the failed-request path separately."],
    patternIds: ["success-confirmation"],
    evidence: [
      { title: "W3C: Status messages", url: "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html", claim: "WCAG explains making qualifying status changes available to assistive technology without moving focus." },
      { title: "GOV.UK: Confirmation pages", url: "https://design-system.service.gov.uk/patterns/confirmation-pages/", claim: "GOV.UK's transaction-completion pattern includes a reference and information about what happens next." }
    ], updated, sourcesChecked
  },
  {
    path: "/principles/forms-and-content/",
    title: "Form UX: clear labels, useful hints, and recoverable errors",
    description: "Design field labels, hints, validation, review, and confirmation using a worked contact-request form that preserves answers through correction.",
    question: "Can someone understand the question and recover from a rejected answer?",
    answer: "Give each question a clear purpose, a persistent label, and guidance at the point of need. When validation rejects an answer, preserve the person's work and make the correction specific.",
    scenario: "A contact-request form asks for a reply email, an order reference, and a description. The order reference is optional because some requests are about access rather than an order. A vague Required fields error would leave the person guessing which answer needs attention.",
    caption: "Design the question and its correction together",
    columns: ["Moment", "Proposed content", "Reasoning"],
    rows: [
      ["Before entry", "Label: Reply email. Hint: We will send the response here.", "Explain the answer's purpose while keeping the label available during typing."],
      ["Optional information", "Label: Order reference (optional).", "Make omission an understandable route for requests without an order."],
      ["Rejected email format", "Name the reply-email problem beside the field and preserve the other answers.", "The person can correct one answer rather than reconstruct the request."],
      ["Review and submission", "Show the destination and request details, then a recorded outcome.", "Help the person recognize what the service is about to receive and what it received."]
    ],
    reasoning: "A hint helps someone answer before a mistake. A validation message explains a specific problem after a check. Repeating generic instructions in both places adds words while leaving the correction unclear.",
    boundary: "Validation timing depends on the field. An incomplete value is not necessarily an error while someone is typing. Test pasted values, autofill, correction, and submission rather than optimizing only the empty form.",
    checks: ["Read only the labels and predict what each answer is for.", "Use the form with a keyboard and check the programmatic field names.", "Submit an invalid reply email with the other fields completed, then correct it.", "Confirm that entered values, the review, and the resulting confirmation stay consistent."],
    patternIds: ["text-input", "inline-validation", "review-before-submit"],
    evidence: [
      { title: "W3C: Labeling controls", url: "https://www.w3.org/WAI/tutorials/forms/labels/", claim: "W3C explains associating labels with controls so their purpose is available visually and programmatically." },
      { title: "W3C: User notification", url: "https://www.w3.org/WAI/tutorials/forms/notifications/", claim: "W3C describes correction guidance and different feedback timings, including checking after submission or focus change." }
    ], updated, sourcesChecked
  },
  {
    path: "/resources/ux-pattern-selection-checklist/",
    title: "UX pattern selection checklist for design and code reviews",
    description: "Review task fit, alternatives, required states, accessibility, and source evidence. Use a worked import-review decision and copy the implementation brief.",
    question: "What evidence makes this pattern choice ready for implementation?",
    answer: "Use the checklist to expose unresolved decisions and assign the next check. A completed count organizes the discussion; approval should depend on the evidence and the consequences of a mistake.",
    scenario: "A team is choosing the interface for importing 200 contact records. The happy-path upload works, but duplicate rows, partial failure, and keyboard recovery still need decisions. An attractive upload area alone does not establish that the workflow is ready.",
    caption: "Turn review gaps into decisions and owners",
    columns: ["Review question", "Evidence in this constructed case", "Next decision"],
    rows: [
      ["What is the person's task?", "Add contacts and know which records were accepted.", "Write that outcome in the implementation brief."],
      ["Which alternatives fit?", "File import and manual entry solve different volumes of work.", "State when the person should choose each route."],
      ["What happens to duplicates?", "The prototype has no defined duplicate policy.", "Assign the product owner to choose skip, merge, or review behavior."],
      ["What happens after partial failure?", "The accepted and rejected counts are not yet reconciled.", "Specify a durable result and a route to correct rejected rows."],
      ["Can everyone recover?", "Keyboard and assistive-technology checks are still outstanding.", "Make those checks part of acceptance rather than marking the flow ready."],
      ["What supports the choice?", "Standards inform control behavior; the task assumptions remain hypotheses.", "Link the sources and test the import task with representative people."]
    ],
    reasoning: "A useful review produces an implementation decision, its evidence, and named follow-up work. The same score can hide very different risks, so discuss the unresolved items individually.",
    boundary: "This is an editorial review aid, not a validated usability scale or an accessibility certification. Use relevant standards and direct task evidence alongside it. Prioritize high-consequence failures even when most boxes are checked.",
    checks: ["Choose a real flow and collect evidence before checking each item.", "Compare at least two plausible approaches and record why one fits better.", "Give every unresolved high-consequence state an owner and a next check.", "Copy the review prompt into the implementation ticket and revisit it after testing."],
    patternIds: ["bulk-import", "error-summary", "success-confirmation"],
    evidence: [
      { title: "W3C: User notification", url: "https://www.w3.org/WAI/tutorials/forms/notifications/", claim: "W3C informs the correction-feedback checks. It does not establish the validity of this checklist or its scoring bands." },
      { title: "GOV.UK: Confirmation pages", url: "https://design-system.service.gov.uk/patterns/confirmation-pages/", claim: "The confirmation pattern informs reviewing a completed transaction and its next steps. The import policy in this example is a separate product decision." }
    ], updated, sourcesChecked
  }
];

export function editorialFor(path: string) {
  return priorityEditorial.find((entry) => entry.path === path);
}
