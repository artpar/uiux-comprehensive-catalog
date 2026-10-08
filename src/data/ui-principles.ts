export type UiPrinciple = {
  id: string;
  title: string;
  outcome: string;
  opening: string;
  concepts: Array<{ term: string; meaning: string }>;
  explanation: string[];
  method: string[];
  strong: string;
  weak: string;
  reasoning: string;
  practice: string;
  review: string[];
  patternIds: string[];
  readings: Array<{ title: string; url: string; purpose: string }>;
};

export const uiPrinciples: UiPrinciple[] = [
  {
    id: "information-architecture",
    title: "Organize information around the task",
    outcome: "Create names and routes that help people predict where to go.",
    opening: "A person arrives with a goal, a phrase for that goal, and an expectation about where the answer belongs. Information architecture connects those three things to the site's content and actions.",
    concepts: [
      { term: "Information architecture", meaning: "The grouping, naming, and relationships that make content and actions findable." },
      { term: "Navigation", meaning: "The visible routes people use to move through that structure." },
      { term: "Wayfinding", meaning: "The cues that show a person's current location and available next routes." }
    ],
    explanation: [
      "Begin with the tasks people name in their own words. Group content by the decisions they make together, then label each group with language they recognize. A useful label predicts what appears after selection. A useful route gives the person a way back to the broader task.",
      "A site map proposes a structure; a navigation design exposes selected parts of it. Test the proposal with realistic findability tasks. Observe the first category chosen, the route taken, and the point where a person changes course. Those observations show whether the structure and the visible cues support the task."
    ],
    method: ["List the top tasks and the words people use for them.", "Group related destinations and write predictive labels.", "Sketch a route to each task, including location and return cues.", "Test those routes with people using task prompts."],
    strong: "A library visitor chooses Reserve a room, sees the room rules and availability, and returns to the reservation from a clearly labeled confirmation page.",
    weak: "A library visitor sees Services, Facilities, and Community with overlapping room information, then opens several categories to locate the reservation action.",
    reasoning: "The strong route uses the visitor's task as its label and preserves location after the reservation. The weak route asks the visitor to infer the site's internal categories. A findability test should begin from an ordinary library page and record the first label chosen, each detour, and the route to confirmation.",
    practice: "Choose one task on a site you use. Write the person's goal, the first label they would select, the destination they expect, and a findability task that could test your prediction.",
    review: ["The task and starting point come from a plausible visitor goal.", "The label predicts the destination in the visitor's language.", "The test observes the route and the person's ability to return."],
    patternIds: ["global-navigation", "breadcrumbs", "back-link", "tabs"],
    readings: [
      { title: "W3C: Page Structure Tutorial", url: "https://www.w3.org/WAI/tutorials/page-structure/", purpose: "Connect visible structure with semantic regions and headings." },
      { title: "Nielsen Norman Group: Navigation and IA tests", url: "https://www.nngroup.com/articles/navigation-ia-tests/", purpose: "Compare methods for finding the cause of poor findability." }
    ]
  },
  {
    id: "layout-and-hierarchy",
    title: "Give the page a clear visual order",
    outcome: "Place content so the primary task and its supporting information form one readable path.",
    opening: "A page communicates priority before a visitor reads every word. Position, size, grouping, and space show where to begin and which details belong together.",
    concepts: [
      { term: "Visual hierarchy", meaning: "The order in which the design draws attention to information and actions." },
      { term: "Grouping", meaning: "The visual relationship created by proximity, alignment, and a shared boundary." },
      { term: "Spacing scale", meaning: "A small set of repeatable distances used to express relationships consistently." }
    ],
    explanation: [
      "Start with a content outline: the task title, the information needed to act, the primary action, and the supporting details. Arrange those elements in that order on a small screen. Keep related labels, controls, and help close together. Give distinct sections enough space for a reader to recognize the change in topic.",
      "Hierarchy follows meaning. A large heading can identify the task, while a prominent action can identify the next step. Consistent spacing makes this order reliable across pages. Review the page at a glance, at high zoom, and in a narrow viewport to see whether the same task path remains clear."
    ],
    method: ["Write the page's single main task and supporting decisions.", "Order the content before choosing columns or cards.", "Group related elements with consistent spacing and alignment.", "Review the page at mobile width and high zoom."],
    strong: "A booking page presents the room title, availability, essential rules, and Reserve action in one reading path; secondary policies follow the decision.",
    weak: "A booking page gives equal visual weight to marketing cards, policies, recommendations, and availability, so the visitor scans several regions to find Reserve.",
    reasoning: "The strong layout gives the main action the information it depends on: availability and essential rules. The weak layout distributes attention across unrelated regions. A layout review should compare the content outline with the visual order, then repeat the task at a narrow width and high zoom.",
    practice: "Take a busy page and outline its content in reading order. Mark the main task, supporting facts, and secondary material, then sketch a single-column revision.",
    review: ["The main task appears early in the reading order.", "Supporting facts sit close to the decision they inform.", "The same task path remains clear at narrow width and high zoom."],
    patternIds: ["dashboard-layout", "card-grid", "progressive-disclosure", "details-panel"],
    readings: [
      { title: "GOV.UK Design System: Layout", url: "https://design-system.service.gov.uk/styles/layout/", purpose: "Study content width and small-screen page structure." },
      { title: "GOV.UK Design System: Spacing", url: "https://design-system.service.gov.uk/styles/spacing/", purpose: "See how a consistent spacing scale carries hierarchy." }
    ]
  },
  {
    id: "typography-and-reading",
    title: "Make text carry the work",
    outcome: "Use type, headings, and sentence structure to support scanning and close reading.",
    opening: "Interface text gives names to tasks, explains consequences, and helps people recover. Typography makes those words readable and reveals their relationships.",
    concepts: [
      { term: "Type scale", meaning: "A small set of text sizes and roles used across headings, body text, labels, and supporting copy." },
      { term: "Measure", meaning: "The length of a line of text, which affects reading comfort." },
      { term: "Semantic heading", meaning: "A heading that communicates the document outline to visual readers and assistive technology." }
    ],
    explanation: [
      "Choose a body style that supports sustained reading, then give headings a clear relationship to the sections they introduce. Keep labels visible beside their controls. Use sentence case and familiar words where the task allows. A concise heading identifies the subject; a paragraph explains the decision or action.",
      "Review text as a sequence. Read only the headings to check the outline, then read the body to see whether each paragraph adds one idea. Check line length and spacing at several widths. A readable type system supports both quick scanning and careful review."
    ],
    method: ["Write headings as a useful outline of the task.", "Assign consistent styles to heading, body, label, and help roles.", "Set comfortable line length and paragraph spacing.", "Read the page at mobile width, zoom, and with headings navigation."],
    strong: "A form says Bank account for your refund, explains when the refund arrives, and uses clear field labels and short help beside each field.",
    weak: "A form uses a decorative headline, dense small print, and placeholder labels; the person searches for the refund timing and the meaning of each field.",
    reasoning: "The strong copy names the purpose of the form and keeps field meaning visible during entry. The weak copy makes the person remember placeholder text and search dense prose for the consequence. A review should read the headings alone, then complete each field while checking the label and help at the point of use.",
    practice: "Rewrite one screen as a heading outline and three short explanatory paragraphs. Check whether a reader can predict each section from its heading.",
    review: ["The headings form a useful outline when read alone.", "Labels remain visible while the person answers.", "Body copy explains the decision or consequence beside the relevant action."],
    patternIds: ["text-input", "error-summary", "inline-message", "accordion"],
    readings: [
      { title: "USWDS: Typography", url: "https://designsystem.digital.gov/components/typography/", purpose: "Study readable type roles and spacing." },
      { title: "W3C: Writing for Web Accessibility", url: "https://www.w3.org/WAI/tips/writing/", purpose: "Connect headings and clear text with access." }
    ]
  },
  {
    id: "color-and-meaning",
    title: "Use color to reinforce meaning",
    outcome: "Build a color system that keeps actions and states clear across contexts.",
    opening: "Color can draw attention, connect related elements, and signal a state. Words, shape, and position carry the same message when a person sees color differently or uses another display mode.",
    concepts: [
      { term: "Semantic color", meaning: "A color role associated with an action or state, such as focus, success, or error." },
      { term: "Contrast", meaning: "The visible difference between foreground and background that helps content remain perceivable." },
      { term: "Redundant cue", meaning: "A second visible signal, such as text or an icon, that explains the same state." }
    ],
    explanation: [
      "Define a small set of color roles for text, links, focus, borders, surfaces, success, and errors. Apply each role consistently. Pair every consequential color change with a clear label or state message. The color then helps people scan while the text explains exactly what happened.",
      "Check text and interface contrast against the relevant accessibility criteria. Also inspect the page in grayscale, at high zoom, and during keyboard navigation. These views reveal whether meaning and focus remain visible through more than one cue."
    ],
    method: ["Name color roles by purpose rather than by hue.", "Pair state colors with precise text and visible controls.", "Check contrast for text and interface elements.", "Review grayscale, focus, error, and success states."],
    strong: "A reservation form marks a field with a visible border, a field label, and a specific error message; focus remains prominent while the person corrects it.",
    weak: "A reservation form turns a field red and leaves the correction implicit, so the person searches for the reason and the next action.",
    reasoning: "The strong state uses color to draw attention and text to explain the exact correction. The weak state puts the entire message in a color change. Review the same form in grayscale and by keyboard, then check whether the error, focus, and next action remain clear.",
    practice: "Choose one success, one error, and one focus state. Write the text and visual cues that communicate each state, then check contrast.",
    review: ["Each consequential color has a matching text or shape cue.", "Focus and errors remain clear in grayscale.", "Text and interface elements meet the relevant contrast criteria."],
    patternIds: ["inline-validation", "error-state", "success-confirmation", "skip-link"],
    readings: [
      { title: "GOV.UK Design System: Colour", url: "https://design-system.service.gov.uk/styles/colour/", purpose: "See functional color roles in a working design system." },
      { title: "W3C: WCAG 2.2", url: "https://www.w3.org/TR/WCAG22/", purpose: "Check contrast and use-of-color criteria in the standard." }
    ]
  },
  {
    id: "forms-and-content",
    title: "Help people answer one clear question at a time",
    outcome: "Design forms around purpose, understandable labels, and recoverable answers.",
    opening: "A form asks people to translate their knowledge into the system's fields. Good content makes each question relevant, answerable, and safe to correct.",
    concepts: [
      { term: "Field label", meaning: "The visible name of the information a control expects." },
      { term: "Hint", meaning: "Brief guidance that explains a format, purpose, or choice before entry." },
      { term: "Validation", meaning: "A check that helps the person identify and correct an answer." }
    ],
    explanation: [
      "Ask for information at the point where the task requires it. Put a clear label beside each control and explain unusual formats in a nearby hint. Group related questions. Preserve entered answers through validation and return a specific correction message to the relevant field.",
      "A strong form handles more than the ideal response. It provides a route for uncertainty, optional information, interruptions, and correction. Follow the full task from first answer through review and submission, including the confirmation that tells the person what the service received."
    ],
    method: ["State why each question serves the person's task.", "Write a persistent label and useful hint for each field.", "Group questions and choose controls that match the answer.", "Design correction, review, and confirmation states."],
    strong: "A refund form asks for a named account field, accepts common spacing, preserves the answer after a format error, and shows a masked review before submission.",
    weak: "A refund form asks for Bank details in one text box, resets the entry after an error, and moves directly to a generic success message.",
    reasoning: "The strong form separates information according to the service's checks and gives the person a chance to recognize the account before money moves. The weak form makes both entry and correction ambiguous. Test a pasted value, a mistyped value, and an interrupted review to see whether the answer and purpose stay clear.",
    practice: "Pick a three-field form. Record the purpose of each question, rewrite the labels and hints, and describe one correction and review state.",
    review: ["Every question has a clear purpose and visible label.", "Validation preserves the person's answer and explains the correction.", "Review and confirmation show what the service received."],
    patternIds: ["text-input", "select", "inline-validation", "review-before-submit"],
    readings: [
      { title: "W3C: Labeling Controls", url: "https://www.w3.org/WAI/tutorials/forms/labels/", purpose: "Apply visible and programmatic field labels." },
      { title: "GOV.UK Design System: Question pages", url: "https://design-system.service.gov.uk/patterns/question-pages/", purpose: "Study focused questions in a complete service flow." }
    ]
  },
  {
    id: "responsive-interaction",
    title: "Preserve the task across screens and input modes",
    outcome: "Adapt layout and interaction while keeping the essential route available.",
    opening: "People move between narrow and wide screens, touch and keyboard input, zoom levels, and changing network conditions. A responsive design keeps the task recognizable through those changes.",
    concepts: [
      { term: "Reflow", meaning: "The rearrangement of content as available space changes." },
      { term: "Input mode", meaning: "A way to operate an interface, such as touch, keyboard, mouse, or voice." },
      { term: "Task continuity", meaning: "The person's ability to keep making progress as conditions change." }
    ],
    explanation: [
      "Start from the essential content and action in a single column. Add wider arrangements where relationships benefit from side-by-side space. Preserve reading order, labels, focus order, and access to secondary actions as the layout changes.",
      "Test the same task with touch, keyboard, screen reader, high zoom, and a narrow viewport. Also test interruption and a slow connection where they matter. This reveals whether responsive layout and responsive behavior support the same goal."
    ],
    method: ["Identify the essential task and its content order.", "Design the narrow layout first, then add wider arrangements.", "Check controls through touch, keyboard, and assistive technology.", "Test zoom, reflow, interruption, and recovery."],
    strong: "A booking flow keeps room choice, date, price, and confirmation in the same logical sequence on phone and desktop; controls remain reachable by keyboard.",
    weak: "A booking flow moves the confirmation action into an off-screen side panel on a phone while the desktop layout keeps it beside the selected room.",
    reasoning: "The strong flow preserves the order of evidence and action across screen sizes. The weak flow relies on wide-screen adjacency to explain what the confirmation controls. Repeat the full booking task at a narrow width and high zoom, then compare reading order, focus order, and the final outcome.",
    practice: "Trace one task at phone and desktop widths. Write the reading order and action order for each, then check that both lead to the same outcome.",
    review: ["The essential content and action remain available at each width.", "Reading and focus order follow the task.", "Interruption and return preserve the person's progress."],
    patternIds: ["responsive-navigation-adaptation", "bottom-navigation", "drawer-with-no-close-or-return-path", "offline-mobile-retry"],
    readings: [
      { title: "GOV.UK Design System: Layout", url: "https://design-system.service.gov.uk/styles/layout/", purpose: "Study a small-screen starting point and content widths." },
      { title: "W3C: Understanding Reflow", url: "https://www.w3.org/WAI/WCAG21/Understanding/reflow", purpose: "Check the accessibility goal behind responsive reflow." }
    ]
  },
  {
    id: "components-and-systems",
    title: "Build consistent components around behavior",
    outcome: "Define reusable components with shared appearance, states, and access behavior.",
    opening: "A design system helps a team repeat a sound decision. Its value comes from consistent behavior and clear usage guidance as much as from consistent styling.",
    concepts: [
      { term: "Component", meaning: "A reusable interface element with a defined purpose and behavior." },
      { term: "Design token", meaning: "A named value for a shared visual role, such as spacing, type, color, or radius." },
      { term: "Component contract", meaning: "The states, inputs, outputs, and accessibility behavior a component promises." }
    ],
    explanation: [
      "Define a component from a recurring task, then specify its states: idle, focus, active, loading, success, error, disabled where relevant, and recovery. Record the meaning of labels, the keyboard behavior, and the content it accepts. Use shared tokens to keep the visual language coherent.",
      "A pattern operates at a different scale from a component. A booking pattern may combine date input, availability display, review, and confirmation components. Choose the pattern from the user's task, then select or adapt components to fulfill its behavior."
    ],
    method: ["Identify a recurring task and the component's role in it.", "Write its state and keyboard contract.", "Apply named type, spacing, and color tokens.", "Test the component inside a complete workflow."],
    strong: "A shared date input presents the same label, help, validation, keyboard behavior, and recovery across booking and account flows.",
    weak: "Two teams style date inputs alike while giving them different validation timing and correction behavior, so the familiar appearance predicts different outcomes.",
    reasoning: "The strong component lets a familiar appearance predict a familiar behavior. The weak version shares styling while changing the rules of entry and correction. Compare the component contract in two complete workflows, then test the same error and keyboard path in each setting.",
    practice: "Choose a button, input, or dialog. List its states and keyboard behavior, then name one complete task that uses it and a pattern that surrounds it.",
    review: ["The component has a stated task and usage condition.", "Its visual states and keyboard behavior form one contract.", "The same contract holds inside a complete workflow."],
    patternIds: ["date-input", "text-input", "confirmation-dialog", "toast-only-critical-error"],
    readings: [
      { title: "USWDS: Design tokens", url: "https://designsystem.digital.gov/design-tokens/", purpose: "See shared visual roles expressed as reusable tokens." },
      { title: "GOV.UK Design System: Patterns", url: "https://design-system.service.gov.uk/patterns/", purpose: "Compare task patterns with the components that implement them." }
    ]
  },
  {
    id: "accessibility-and-quality",
    title: "Review completion across different abilities",
    outcome: "Check whether people can perceive, understand, operate, and complete the task.",
    opening: "Accessibility becomes concrete when a person can reach the goal through the entire workflow. Labels, structure, focus, contrast, timing, and recovery all contribute to that outcome.",
    concepts: [
      { term: "Keyboard path", meaning: "The sequence of controls and actions available through keyboard operation." },
      { term: "Focus", meaning: "The current interaction target for keyboard and many assistive technology users." },
      { term: "Equivalent outcome", meaning: "A route that lets people complete the same meaningful task through different needs or modes." }
    ],
    explanation: [
      "Choose a real task and follow it from entry through completion. Navigate by keyboard, inspect visible focus, and verify labels and headings with assistive technology. Review text and control contrast, zoom and reflow, error messages, timing, and the confirmation state.",
      "Use the relevant WCAG criteria as a technical baseline and involve people with varied access needs in research. Record the point where the task becomes difficult, the effect on completion, and the change to test. This connects a criterion to the person's experience."
    ],
    method: ["Name one task and its successful outcome.", "Complete it using keyboard, zoom, and assistive technology.", "Check relevant WCAG criteria and record barriers in context.", "Revise and retest the full route with people."],
    strong: "A person reaches a form by keyboard, hears each field label, corrects a specific error, reviews the answer, and receives a clear confirmation.",
    weak: "A person reaches the form, loses focus inside a dialog, hears a generic error, and spends additional steps locating the correction.",
    reasoning: "The strong route supports completion from entry through confirmation. The weak route reveals a focus and recovery barrier at the moment a person needs to correct an answer. Review the entire task, then connect each observed barrier to the relevant accessibility criterion and a retest with people.",
    practice: "Audit one three-step task with keyboard and high zoom. Record the entry point, each focus change, the recovery step, and the final confirmation.",
    review: ["The audit follows a meaningful task from entry to confirmation.", "Each barrier includes the person's action and its consequence.", "The proposed change has a criterion and a full-task retest."],
    patternIds: ["skip-link", "error-summary", "inline-validation", "fallback-path"],
    readings: [
      { title: "W3C: Easy Checks", url: "https://www.w3.org/WAI/test-evaluate/preliminary/", purpose: "Run a first structured review of a page." },
      { title: "W3C: WCAG 2.2", url: "https://www.w3.org/TR/WCAG22/", purpose: "Read the criteria behind the accessibility checks." }
    ]
  },
  {
    id: "content-strategy-and-language",
    title: "Design content around a person's question",
    outcome: "Plan, write, and maintain content that answers a real question at the point of use.",
    opening: "A person reads an interface to decide what an action means, what information to provide, and what happens next. Content design begins with that person's question and follows it through the whole service.",
    concepts: [
      { term: "Content model", meaning: "A repeatable structure for facts, explanations, actions, and ownership across pages." },
      { term: "Plain language", meaning: "Words and sentence structures that help the intended audience act on the first useful reading." },
      { term: "Localization", meaning: "Adapting language, examples, formats, and layout to a specific locale and its conventions." }
    ],
    explanation: [
      "Collect the questions people ask while trying to finish a task. Place the answer beside the decision it informs: eligibility before an application, a fee before payment, and a consequence before confirmation. Give each page one clear purpose and connect it to the next step in the journey. Record an owner and a review trigger for facts that change.",
      "Test the words as part of the interface. Ask a participant to explain what a label predicts, what a message asks them to do, and what they expect after submission. For each locale, review examples, dates, names, number formats, text expansion, and reading direction with people familiar with that context. Treat translated content as part of the design and test it in the complete task."
    ],
    method: ["Write the person's question and the decision they need to make.", "Place the answer before the action that depends on it.", "Use a repeatable content model with an owner and review trigger.", "Test comprehension and task completion in each intended locale."],
    strong: "A refund page explains eligibility, required account details, expected timing, and the confirmation in the order a claimant needs them. A localized version uses familiar date and account formats.",
    weak: "A refund page opens with organizational language, spreads eligibility across several links, and uses one date format for every locale. Claimants need extra visits to interpret the next step.",
    reasoning: "The strong version answers each question before the related action and adapts the format of the answer to its audience. The weak version follows the organization chart and creates interpretation work during an important decision. Observe comprehension before measuring the final submission.",
    practice: "Choose a consequential page. Write three questions a first-time visitor brings, place each answer in the task sequence, and specify one content fact that needs periodic review.",
    review: ["Every major claim serves a named visitor question.", "The answer appears before its dependent action.", "Locale-specific examples and formats work in the full task."],
    patternIds: ["bank-details", "error-summary", "language-selector", "confirmation-page"],
    readings: [
      { title: "GDS: From user needs to content", url: "https://gds.blog.gov.uk/2012/10/22/needs-to-content/", purpose: "Follow the path from a researched need to a published answer." },
      { title: "W3C: Language declarations", url: "https://www.w3.org/TR/i18n-html-tech-lang/", purpose: "Connect content language with correct page markup." }
    ]
  },
  {
    id: "images-icons-and-motion",
    title: "Make visual media explain its purpose",
    outcome: "Choose images, icons, and movement that clarify a task and remain understandable through other modes.",
    opening: "An image can identify an object, explain a process, or set a scene. An icon can shorten a familiar action. Movement can show a transition between states. Each visual choice earns its place through the meaning it carries.",
    concepts: [
      { term: "Informative image", meaning: "An image that conveys information needed to understand a task or outcome." },
      { term: "Text alternative", meaning: "Text that gives another route to the purpose or information conveyed by visual media." },
      { term: "Reduced motion", meaning: "An operating-system or application preference that limits movement for comfort and access." }
    ],
    explanation: [
      "For each image, write the information a person should take away. A photo of a room may help someone recognize a booking choice; a diagram may explain a process; a decorative texture may simply set tone. Give informative media an equivalent text route. Pair unfamiliar icons with visible words, then test whether people can predict the action from the combined label and symbol.",
      "Use movement to explain a change of state, such as a panel opening or an item moving into a saved list. Keep the start and end states clear when motion is reduced. Give people control over ongoing movement and review the interaction with reduced-motion settings. A strong media review asks what the person learns, how they operate it, and how the same task works through another mode."
    ],
    method: ["State the job of each image, icon, or transition.", "Write text that carries the useful information or action.", "Test the visual's meaning with people in the task context.", "Review keyboard operation, media controls, and reduced-motion behavior."],
    strong: "A booking card pairs a room photograph with capacity, access features, and a named Reserve action. Its gallery has controls, and a reduced-motion view keeps each room identifiable.",
    weak: "A booking card uses an unlabeled icon for availability and an automatically moving gallery. A visitor needs extra effort to connect the image with the reservation choice.",
    reasoning: "The strong card gives the image a defined role and supports the same choice through text and controls. The weak card makes availability depend on symbol interpretation and timing. Test the choice with images hidden, keyboard operation, and reduced motion.",
    practice: "Audit one page with three visual elements. Write the purpose of each, the useful text alternative or label, and the behavior at reduced motion.",
    review: ["Each visual element has a task-related purpose.", "Meaningful images and icons have an equivalent text route.", "Movement supports the state change and respects the person's preference."],
    patternIds: ["camera-capture", "icon-only-ambiguous-action", "carousel", "loading-skeleton"],
    readings: [
      { title: "W3C: Images Tutorial", url: "https://www.w3.org/WAI/tutorials/images/", purpose: "Choose a text alternative from the image's purpose in context." },
      { title: "W3C: Animation from Interactions", url: "https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions", purpose: "Review movement and the reduced-motion preference." }
    ]
  },
  {
    id: "data-display-and-interpretation",
    title: "Help people read data as a decision",
    outcome: "Show values, comparisons, and uncertainty in a form that supports the reader's next action.",
    opening: "A dashboard, table, or chart helps someone answer a question about a set of values. The useful design begins with the comparison the reader needs, then selects a view that makes that comparison visible.",
    concepts: [
      { term: "Measure", meaning: "A defined value with a unit, source, and time period." },
      { term: "Comparison", meaning: "The relationship a reader needs to judge, such as change over time or difference between groups." },
      { term: "Data provenance", meaning: "The source, collection method, and update time behind a displayed value." }
    ],
    explanation: [
      "Write the reader's question before choosing a visualization. Use a table when exact values and lookup matter. Use a chart when a shape, trend, or comparison carries the answer. Label axes, units, time ranges, and categories in the view. Explain a meaningful baseline and identify the update time so a reader can judge whether the answer applies to their decision.",
      "Design exploration around the task. Filters should keep their current state visible; sorting should explain its active order; drill-down should preserve a route back to the overview. Give complex visualizations a concise summary and access to the underlying values. Test whether readers can answer a specific question accurately and explain how they reached the answer."
    ],
    method: ["Write the exact question the data view should answer.", "Choose a table, chart, map, or summary from the comparison needed.", "Label values with units, period, source, and current filters.", "Test interpretation and the route from overview to detail."],
    strong: "A clinic dashboard names the reporting period, defines completed appointments, shows the trend with labeled values, and lets staff inspect the underlying weekly table.",
    weak: "A clinic dashboard presents colorful totals with varying periods and unlabeled axes. Staff spend time reconstructing which values can be compared.",
    reasoning: "The strong view makes the comparison and its provenance explicit. The weak view looks scannable while leaving the definition of each value uncertain. Ask staff to identify a change, cite the period, and locate the underlying count.",
    practice: "Take a dashboard card or chart. Write the decision it supports, define every value, and sketch a text or table route to the same information.",
    review: ["The view answers a named question.", "Units, periods, source, and active filters are visible.", "A reader can inspect underlying values and explain the comparison."],
    patternIds: ["table", "data-visualization", "dashboard-layout", "chart-drilldown"],
    readings: [
      { title: "GOV.UK Brand Guidelines: Charts", url: "https://brand.design-system.service.gov.uk/data/charts/", purpose: "Study chart structure and comparison choices." },
      { title: "W3C: Complex Images", url: "https://www.w3.org/WAI/tutorials/images/complex/", purpose: "Provide a full text route to data in graphs and diagrams." }
    ]
  },
  {
    id: "measurement-and-experimentation",
    title: "Measure whether the task became easier",
    outcome: "Combine task evidence and performance data to judge a design change.",
    opening: "A design change becomes useful when it improves a meaningful outcome for people. Measurement begins with the task, a baseline, and a prediction about what the change should improve.",
    concepts: [
      { term: "Task success", meaning: "The proportion of attempted tasks that reach a defined meaningful outcome." },
      { term: "Baseline", meaning: "A measure of the current experience collected in a consistent way for later comparison." },
      { term: "Guardrail", meaning: "A related measure that helps detect a harmful side effect of an improvement." }
    ],
    explanation: [
      "Define success as a real completed task, such as a refund request submitted with a correct account, rather than a button click. Include the denominator: who attempted the task, through which route, and during which period. Pair completion and time measures with observed sessions, feedback, support contacts, and error patterns. The numbers locate a change; the observations explain the work people had to do.",
      "Before an experiment, write the expected effect, the population, and the guardrails. Compare like tasks and segments across rounds. If a new form increases submissions while corrections and support calls also rise, investigate the quality of completion. Report uncertainty, missing cases, and the next research question alongside the headline result."
    ],
    method: ["Define a task and its meaningful success state.", "Collect a baseline with the same task and participant criteria.", "Choose one outcome measure, one guardrail, and qualitative observation.", "Compare the change, investigate differences, and decide the next test."],
    strong: "A team revises a refund form, then measures completed valid requests, correction time, and support contacts while watching people enter an account in a task session.",
    weak: "A team counts clicks on the refund button after launch and treats the increase as proof of a better refund journey. The count leaves completion quality and recovery unexplained.",
    reasoning: "The strong evaluation connects an observed task to valid completion and watches for added recovery work. The weak evaluation measures interest in an action rather than the result people need. A repeated benchmark helps compare the same task over time.",
    practice: "Choose one proposed interface change. Write a success definition with a denominator, a baseline task, a guardrail, and a question for a follow-up observation.",
    review: ["The measure describes a meaningful task outcome.", "The denominator, population, and period are explicit.", "Qualitative evidence and a guardrail help explain the result."],
    patternIds: ["inline-validation", "review-before-submit", "no-results-recovery", "confirmation-page"],
    readings: [
      { title: "GOV.UK: Measuring the success of your service", url: "https://www.gov.uk/service-manual/measuring-success/measuring-the-success-of-your-service", purpose: "Connect performance metrics with research across a whole journey." },
      { title: "GOV.UK: Usability benchmarking", url: "https://www.gov.uk/service-manual/measuring-success/usability-benchmarking-a-website-or-whole-service", purpose: "Repeat realistic tasks to see how completion changes over time." }
    ]
  },
  {
    id: "privacy-consent-and-safety",
    title: "Give people clear control over consequential choices",
    outcome: "Explain data use, risk, and recovery so a person can make an informed choice.",
    opening: "A privacy or safety decision often asks a person to trade information, access, or control for a service outcome. The interface must make the scope and consequence of that choice clear before the person acts.",
    concepts: [
      { term: "Purpose", meaning: "The specific reason a service asks for data, permission, or an action." },
      { term: "Scope", meaning: "The people, information, systems, and duration affected by a choice." },
      { term: "Reversal", meaning: "The route for changing a preference or recovering from a consequential action." }
    ],
    explanation: [
      "Name the immediate purpose of a request and the exact data or capability it affects. Show the meaningful options with equal clarity and explain the outcome of each. Put the explanation beside the choice, using language a person can connect to their task. For sensitive actions, show the affected object and a review step before commitment.",
      "Design the later state as carefully as the first prompt. People need a place to inspect current permissions, change a preference, see an action history where appropriate, and understand the result of a report or deletion request. Test whether a person can explain the scope of the decision, choose deliberately, and find the route to change it."
    ],
    method: ["Name the person's task and the service purpose for the request.", "Describe the data, people, systems, and duration in scope.", "Present each meaningful choice and its consequence clearly.", "Test comprehension, reversal, and recovery across the full journey."],
    strong: "A document-sharing flow names the document, recipient, permission level, and expiration before sharing. The confirmation shows the current access and a route to change it.",
    weak: "A document-sharing flow uses a generic Allow button and reveals the recipient list after submission. A person needs extra steps to discover the audience and change access.",
    reasoning: "The strong flow supports an informed choice at the decision point and makes the later state inspectable. The weak flow separates scope from commitment. Test comprehension before activation, then ask the person to find and change the resulting permission.",
    practice: "Choose a permission or consent request. Write the purpose, scope, options, confirmation, and reversal route in the order a person needs them.",
    review: ["The purpose and scope appear before commitment.", "Each option states its result in concrete terms.", "The person can inspect and revise the choice later."],
    patternIds: ["permission-sharing", "consent-prompt", "privacy-settings", "delete-account"],
    readings: [
      { title: "GOV.UK: Collecting personal information", url: "https://www.gov.uk/service-manual/design/collecting-personal-information-from-users", purpose: "Study clear purpose, specific consent, and later withdrawal in a service." },
      { title: "GOV.UK Service Standard: Protect users' privacy", url: "https://www.gov.uk/service-manual/service-standard/point-9-create-a-secure-service", purpose: "Connect interface choices with privacy and security across a service." }
    ]
  },
  {
    id: "human-control-of-automation",
    title: "Keep people oriented when automation acts",
    outcome: "Show the system's scope, evidence, progress, and approval points during automated work.",
    opening: "Automation can gather information, draft an answer, or act on other systems. The design should tell a person what work is proposed, which sources and tools are involved, and where their judgment changes the outcome.",
    concepts: [
      { term: "Action scope", meaning: "The set of data, tools, and side effects an automated process may use." },
      { term: "Uncertainty", meaning: "A stated limit in the evidence or process that matters to the person's decision." },
      { term: "Approval gate", meaning: "A point where a person reviews an exact proposed action before execution." }
    ],
    explanation: [
      "Begin with the person's goal and the authority the system needs. Before an automated step, preview its target, data access, and likely result. During longer work, show the current step and the tools or sources used. When output contains factual claims, connect the claims to inspectable evidence and indicate uncertainty that affects the next action.",
      "Match the review point to the consequence. A draft can remain editable; an external message, permission change, payment, or publication merits a precise preview and an explicit approval step. After the action, show what actually happened and a route to correct or escalate it. Test the person's ability to predict the side effect, identify a source, interrupt the work, and explain the final state."
    ],
    method: ["State the person's goal and the system's proposed scope.", "Preview tools, data, target, and side effects before action.", "Expose progress, evidence, uncertainty, and a meaningful review point.", "Confirm the result and test correction, interruption, and escalation."],
    strong: "An assistant drafts a customer reply, shows the records used and the exact recipient, then asks for approval of the final message. The sent state shows the message and time.",
    weak: "An assistant opens with a confident answer and sends it from a general chat instruction. The operator spends extra time reconstructing the sources, recipient, and resulting action.",
    reasoning: "The strong flow makes evidence and authority visible before a side effect and confirms the result afterward. The weak flow combines drafting and execution into a single ambiguous moment. A test should ask the operator to predict the next action, inspect its support, and recover from an unsuitable draft.",
    practice: "Map one automated workflow from request to outcome. Mark the source boundary, planned tool action, approval point, visible progress, and correction route.",
    review: ["The proposed scope and side effect are clear before action.", "Evidence and uncertainty are inspectable at the decision point.", "The person can approve, interrupt, correct, and understand the final state."],
    patternIds: ["agent-plan-preview", "source-grounding-display", "human-approval-gate", "agent-progress-trace"],
    readings: [
      { title: "NIST AI RMF Core", url: "https://airc.nist.gov/airmf-resources/airmf/5-sec-core/", purpose: "Connect human oversight, transparency, and accountability with system design." },
      { title: "W3C: Status Messages", url: "https://www.w3.org/WAI/WCAG22/Understanding/status-messages", purpose: "Review how progress and result messages reach people using assistive technology." }
    ]
  }
];

export const principleLearningOrder = [
  "information-architecture",
  "content-strategy-and-language",
  "typography-and-reading",
  "layout-and-hierarchy",
  "color-and-meaning",
  "images-icons-and-motion",
  "forms-and-content",
  "responsive-interaction",
  "components-and-systems",
  "data-display-and-interpretation",
  "accessibility-and-quality",
  "privacy-consent-and-safety",
  "human-control-of-automation",
  "measurement-and-experimentation"
];
uiPrinciples.sort((a, b) => principleLearningOrder.indexOf(a.id) - principleLearningOrder.indexOf(b.id));

export const principleForCategory: Record<string, string> = {
  "Navigation And Wayfinding": "information-architecture",
  "Search, Browse, And Discovery": "information-architecture",
  "Input And Data Entry": "forms-and-content",
  "Selection And Choice": "forms-and-content",
  "Feedback, Status, And System State": "color-and-meaning",
  "Error Prevention And Recovery": "accessibility-and-quality",
  "Disclosure And Attention Management": "layout-and-hierarchy",
  "Data Display And Exploration": "data-display-and-interpretation",
  "Task And Workflow Patterns": "responsive-interaction",
  "Collaboration And Social Interaction": "components-and-systems",
  "Personalization And Preference": "components-and-systems",
  "AI And Automation UX": "human-control-of-automation",
  "Trust, Safety, And Privacy": "privacy-consent-and-safety",
  "Cross-Device And Physical Interaction": "responsive-interaction"
};
