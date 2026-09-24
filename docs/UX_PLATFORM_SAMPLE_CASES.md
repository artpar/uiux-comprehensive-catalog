# Sample lessons and practice cases for editorial review

These are proposed lesson excerpts and practice cases, not publication-ready course pages. The companion `UX_LEARNING_CURRICULUM.md` defines the instruction that comes before and around them. Each sample below includes a concept to teach and a worked explanation before the learner's independent task. The scenarios are fictional; their guidance should be checked against the linked catalog entries and underlying sources before publication. No case should be graded as a single universal UI answer when user context or test evidence could change the decision.

## How guided practice and assessment work

Each guided decision below presents plausible options. Feedback explains the consequence of each choice and names evidence that could change the recommendation. The later transfer task uses a different setting, gives less help, and produces an artifact for review. Open responses need a rubric and human or carefully bounded review; keyword matching or polished prose alone cannot establish competence.

Score each transfer artifact on five dimensions, 0–2 points each: **evidence** (observations are distinguished from assumptions); **alternatives** (more than one defensible path is considered); **consequences** (success, failure, and recovery are addressed); **accessibility** (affected people and alternative ways to complete the task are considered); and **uncertainty** (limits and what to test next are stated). A 2 requires a specific, justified application in context; a 1 identifies the issue without enough support; a 0 omits it or asserts an unsupported certainty. A high score indicates strong work on this exercise, not professional certification. Reviewers should accept different solutions that satisfy the same criteria.

**Skill-specific review gates:** Apply the shared rubric alongside the criterion for the skill being practiced. For recognizing quality, assess whether the learner connects an interface detail to the user's complete task and service outcome. For diagnosis, assess whether observations, hypotheses, and unknowns remain separate and whether proposed evidence can distinguish causes. For design, assess whether the state model covers roles, current information, consequences, and recovery across the flow. For testing, assess whether participant tasks and observations answer the stated design decision and whether a revision follows from the findings. For professional practice, assess whether the recommendation names owners, dependencies, sequencing, and a way to check outcomes. For AI-assisted experience, assess whether source validity, human authority, uncertainty, and correction are handled explicitly. A fluent answer that misses the relevant skill gate should not receive a high score.

## 1. Recognize quality — appointment check-in kiosk

**Situation:** A clinic's lobby kiosk lets visitors check in. Its buttons are large and the first screen is easy to scan. After a visitor enters their name, the kiosk shows “Done” for two seconds, returns to the start screen, and gives no receipt or indication of whether staff received the check-in. A visitor who pauses while looking for an appointment code loses their entry without warning.

**Teach first — quality follows the whole task:** An interface can look simple and still fail its purpose. Judge quality by whether a particular person can understand the next action, complete the task, know the outcome, and recover when something interrupts them. In a public kiosk, the experience includes the handoff to staff and the visitor's confidence that check-in was recorded. Visual clarity is one dimension; timing, privacy, language, physical reach, and alternatives to touch or audio can be equally decisive.

**Worked explanation:** Imagine an expert reviewing a kiosk that says “Checked in. Please wait near reception. Ask staff if your name is not called within 10 minutes.” The expert can point to the visible outcome and next step, while still asking whether the staff system actually received the check-in. They distinguish what the screen communicates from what the service does. The learner should practice that same distinction in the case below.

**Guided decision:** The kiosk can receive a staff-system acknowledgment, but it has no printer. Which proposal would you test first, and what would you verify? A. Keep the quick reset and add a prominent help button so visitors can ask staff whether check-in succeeded. B. Keep “Done” on screen longer and warn before timeout; staff can confirm check-in verbally. C. Show a privacy-safe acknowledgment only after the staff system responds, let the visitor end the session, and warn before clearing unfinished input.

**Feedback:** C is the strongest provisional design because the acknowledgment represents the staff handoff and gives the visitor control of the session without displaying private details. Verify that the acknowledgment means staff can act on the check-in, not merely that a request reached a server. A is a workable fallback if system acknowledgment cannot be exposed, but it transfers verification work to staff and leaves input loss unresolved. B addresses timeout and visibility, yet a longer “Done” display still may claim success before staff receipt. If lobby observation shows that leaving a confirmation visible exposes sensitive information, shorten its display or use another private confirmation channel; if the staff system has no reliable acknowledgment, C must be revised.

**Learner task:** Mark two elements that appear helpful and two that could prevent a visitor from completing the task confidently. Explain whose needs might be affected and what evidence you would seek before prescribing a redesign.

**Strong reasoning:** The large targets and short initial choice may help, but visual simplicity does not compensate for uncertain completion or lost work. The learner should distinguish the completion signal from the timeout problem, consider privacy in a shared lobby, and avoid assuming that every visitor can read, hear, or act at the same speed. They should ask how check-in confirmation reaches staff and observe actual visitors before settling on a solution.

**Catalog starting points:** `success-confirmation`, `session-timeout-warning`, `autosave-recovery`.

**Skill evidence:** The learner notices both visible interface details and the wider service outcome.

**Independent transfer:** A handheld inventory scanner in a warehouse flashes “Saved” and clears its screen, but network sync can take several minutes. Write a short quality critique that separates local capture from confirmed sync, identifies a recovery path when the device goes offline, and notes one accessibility or environmental constraint. Submit an annotated interaction sequence. Apply the five-dimension rubric above.

## 2. Diagnose — “no trips found” in a mobile journey planner

**Situation:** A commuter searches for a train. The app says “No trips found.” A restrictive filter may still be active, the station may be closed, or the request may have failed because the phone lost connectivity. The screen offers only “Search again.”

**Teach first — separate states before proposing UI:** “There is no content,” “nothing matches this query,” and “we could not retrieve the data” are different claims. A product should state only what it knows. When results are empty because of filters, the user may need to inspect or clear filters. When a request fails, the user needs to know whether saved input is safe and how to retry. When a service is genuinely unavailable, the user needs an alternative path. A diagnosis starts with competing hypotheses, not a chosen component.

**Worked explanation:** Suppose the request log shows a failed network call. An expert would not rewrite the screen to “No trains run at this time,” because that would turn missing evidence into a false fact. They would preserve the route and time, explain that current results could not be loaded, and offer retry or another source. If the request succeeds with zero matches, the explanation and recovery should change. This shows how evidence changes the design response.

**Guided decision:** Monitoring shows the live request timed out. The route and filters remain stored locally, and a cached timetable is available from yesterday. Which response would you use first, and what would you check? A. Explain that live trips could not be loaded, keep the search, offer retry and service status, and offer the cached timetable only if its age and limits are unmistakable. B. Show yesterday's cached departures as ordinary results so the commuter can keep moving. C. Open a contact page with station phone numbers and hide the unavailable results until live service returns.

**Feedback:** A distinguishes unavailable live data from cached information while preserving the user's task. Check whether yesterday's timetable is useful or dangerously misleading during disruptions; it may need to be withheld. B could create confidence in departures that have changed. C offers a human fallback but makes a slow channel the only path even when retry may work. If a new request succeeds with zero matches, shift to a no-results explanation and visible filters; if a confirmed closure explains the absence, show the closure and alternative route. The message must track the evidence, not a preferred component.

**Learner task:** List plausible causes, identify what can and cannot be concluded from the screen, choose the first research or instrumentation questions, and write the problem statement to take into design.

**Strong reasoning:** An empty dataset, zero search results, and a service error require different explanations and recovery actions. A strong answer preserves the user's route and filters, shows the state that is known, and asks which failure accounts for actual occurrences. It does not label the problem “bad empty state” before diagnosis.

**Catalog starting points:** `empty-state`, `no-results-recovery`, `error-state`.

**Skill evidence:** The learner separates observed symptoms from hypotheses and defines a testable problem.

**Independent transfer:** A web-based knowledge base reports “Nothing here” after a support agent searches. The result may reflect an active product filter, missing access permission, or an index outage. Produce a one-page problem statement with known facts, three hypotheses, the evidence needed to distinguish them, and the first safe improvement. Do not prescribe one empty-state component before the cause is known. Apply the five-dimension rubric above.

## 3. Design an improvement — enterprise approval request

**Situation:** A manager receives an approval request for a consequential purchase. The notification contains a title and an “Approve” button, but not the amount breakdown, requester, policy exception, or downstream effect. Some requests can be returned for edits; others need a second approver.

**Teach first — design the decision, roles, and states:** A consequential action needs enough context at the point of decision. Model who may act, what they need to know, what will happen after the action, and which states the work can enter. “Approve” can mean a final commitment, one step in a sequence, or permission for someone else to proceed. The interface must distinguish those meanings. A state model prevents a polished default screen from hiding stale, pending, rejected, or returned work.

**Worked explanation:** Consider a request changed while the manager has an old notification open. A strong design compares the visible request version with the current version and asks the manager to review the change before acting. Merely adding an “Are you sure?” dialog would confirm the manager's click without revealing that the decision context changed. The lesson demonstrates the difference between a confirmation step and a reviewable decision.

**Guided decision:** The team can add one review step before approval. Which approach would you prototype, and what condition could change your choice? A. A concise request summary with amount, requester, and reason, followed by a confirmation dialog; version changes remain handled by the existing notification service. B. A review view that checks the current request version and approver role, explains any policy exception and the next approval step, and blocks action on a stale version. C. A required phone call between requester and approver for every purchase above the threshold, with the interface only recording the outcome.

**Feedback:** B is the strongest provisional prototype because it makes current information and authority part of the decision. Test whether its summary is enough for the approver to identify exceptions without searching elsewhere. A may be adequate if the notification service really guarantees fresh versions and eligible recipients, but that guarantee needs evidence; a confirmation dialog does not supply it. C might suit rare cases that require discussion, but imposing calls on every qualifying request creates operational cost and no clear record of what information was reviewed. Different thresholds or policy requirements could justify a different route.

**Learner task:** Sketch or describe a safer flow in stages: notification, review, decision, and after-decision status. Include rejection, return-for-edit, pending second approval, and stale-request states. Explain which details belong before commitment.

**Strong reasoning:** The learner puts decision-critical context next to the action, distinguishes review from approval, makes authority and current status clear, and provides recovery when a request changes. They should avoid adding a generic confirmation dialog as a substitute for understanding the request.

**Catalog starting points:** `review-before-submit`, `approval-workflow`, `human-approval-gate`, `change-review`.

**Skill evidence:** The learner improves a workflow across states, roles, and consequences rather than polishing a single screen.

**Independent transfer:** A web tool lets an administrator publish a revised public policy. A draft may have unresolved comments, legal review may be pending, and publishing notifies customers. Create an annotated state model from draft to published or returned for edits, with roles, version changes, recovery, and the consequence shown before publication. A simple confirmation modal is insufficient on its own. Apply the five-dimension rubric above; multiple flows are valid if the safeguards and evidence are sound.

## 4. Test and refine — voice control of home heating

**Situation:** A voice assistant accepts “turn off the heat.” In a home with several zones, it sometimes changes the wrong room. The display, when present, briefly shows the chosen zone, but the voice response says only “Okay.” The feature is also used hands-free and in noisy rooms.

**Teach first — a test must answer a decision:** Start by stating what you need to learn: Can people tell which zone the assistant understood, and can they correct a wrong action quickly? Then choose tasks and contexts that exercise that uncertainty. Observe actions and hesitation as well as what participants say. A brief test can reveal failure modes, but a small sample cannot establish a population-wide rate. Distinguish test observations from claims about all users.

**Worked explanation:** In a simulated test, several participants say “turn off the heat” and hear “Okay,” then check the wrong room because they assumed the command affected the whole home. An expert would report the observed ambiguity, revise the response to name the affected zone and provide a correction path, and retest. They would not treat the simulated count as a measured production failure rate.

**Guided decision:** A prototype test shows that users often miss the on-screen zone name while speaking from another room. Which change should be tested next? A. Speak the zone name after every command, but give correction only through the display. B. Ask for the zone before carrying out every command, even when the user's room name was recognized clearly. C. Speak the affected zone and provide a short voice correction path when the command or zone is ambiguous.

**Feedback:** C best addresses the observed missed display and ambiguous action while keeping routine commands efficient. A improves awareness of the outcome, but a person away from the display still cannot correct it through the active modality. B reduces some ambiguity before action, but repeated questions may burden clear, frequent commands. If wrong-zone changes have serious consequences in this setting, asking before action more often may be justified. Retest comprehension, correction success, and unwanted friction rather than treating C as universally correct.

**Learner task:** State the main design hypotheses, propose a small usability test with representative tasks, specify what to observe, and decide how a failed or uncertain command should be handled. Then revise the interaction after hypothetical test evidence shows that users often miss the display confirmation.

**Strong reasoning:** A test should cover ambiguous zone names, background noise, recovery after the wrong zone changes, and use without looking at a screen. The revised interaction should identify the affected zone and make correction possible. The learner should balance confirmation against repeated friction, with the degree of confirmation matched to the consequence of the action.

**Catalog starting points:** `voice-command`, `confirmation-dialog`, `undo`, `haptic-feedback`.

**Skill evidence:** The learner designs an evaluation that can change the proposal and uses findings to revise it.

**Independent transfer and simulated findings:** A smartwatch accepts “pause workout” while the wearer is running; it can pause the workout timer or audio playback. Plan a test with representative running conditions, then interpret this fictional findings packet: of six participants asked to pause the workout, three triggered audio pause while the workout timer continued; two of those noticed only after running another minute; four participants did not look at the watch; one said the spoken “Paused” response sounded like confirmation of the workout timer. Treat these as observations from a small simulation, not a population failure rate. Submit a test plan **and a revised interaction** that identifies what paused, resolves the command ambiguity, and supports correction without visual attention. State which finding drove each change and what you would retest. Apply the five-dimension rubric and the testing gate above.

## 5. Practice professionally — transit disruption across channels

**Situation:** A transit agency announces a service disruption through its app, station kiosk, audio announcement, and staff. The channels disagree on the alternative route and accessibility information. A product lead asks for “a clearer banner” before the next release.

**Teach first — professional UX includes the service system:** A banner can improve visibility, but it cannot make contradictory information true. Map where information originates, who updates it, how it reaches each channel, and what a traveler does when one channel is unavailable. Separate an immediate mitigation from the longer-term fix. Communicate the recommendation as a decision: user problem, evidence, options, tradeoffs, owner, and next test.

**Worked explanation:** An expert might recommend one verified disruption record feeding the app, kiosk, staff tool, and announcement script. Until that exists, they might propose a named owner and a visible last-updated time for each channel, plus a clear way to reach staff. They would present this as a staged proposal with dependencies, not a claim that a new banner alone resolves the service failure.

**Evidence packet for the learner:** The [UK Department for Transport's travel-disruption study and communication toolkit](https://www.gov.uk/government/publications/communicating-during-travel-disruption) concerns **international** travel disruption. Applying its communication findings to this fictional local agency is an inference to examine, not direct evidence about local riders. The [US Federal Transit Administration's ADA guidance](https://www.transit.dot.gov/sites/fta.dot.gov/files/docs/Final_FTA_ADA_Circular_C_4710.1_1.pdf) gives examples of combining website information, signs, recorded announcements, and rider notifications during accessibility outages. Neither source establishes this fictional agency's policy or operating facts. **Fictional operational constraints:** the app updates from a central feed in five minutes; kiosks refresh every 30 minutes; station staff get radio updates; audio announcements are manually recorded; the accessible alternative route is approved by operations. The learner must identify which facts need verification locally and who can authorize public route information. A transit-domain reviewer must verify the final published case and any jurisdiction-specific claims.

**Guided decision:** The app, kiosk, and staff disagree about an alternative route. Operations can verify one route today, but kiosk updates will lag. Which first step would you recommend, and what must be communicated during that lag? A. Name the operations owner and verify the route, update fast channels, mark the kiosk information as potentially stale, and direct riders to a current accessible source or staff while the kiosk refreshes. B. Hold every update until the kiosk catches up so all channels change at once. C. Update the app and station signs now, then ask staff to reconcile differences verbally until the next kiosk refresh.

**Feedback:** A is strongest under the stated update limits because it establishes authority and makes the temporary inconsistency visible to kiosk users. Verify that the current source and staff can actually provide the approved accessible route. B can be appropriate if staggered updates would create a more serious hazard, but withholding verified information also has a cost for riders already traveling. C improves two channels quickly, yet leaves kiosk users seeing an unmarked outdated route and puts the burden on those who can find staff. If operations has not approved an alternative route, none of the options may publish it as fact; communicate the uncertainty and safe next step instead. Accessibility information needs local operational and domain review.

**Learner task:** Present a short professional recommendation: frame the user problem, identify who is at risk, distinguish an immediate mitigation from the systemic fix, propose a cross-channel information and recovery flow, name the evidence needed, and define how to check whether the experience improved.

**Strong reasoning:** The learner addresses consistency and ownership of the underlying service information as well as interface presentation. They consider people already in transit, people who cannot use one channel, and staff who must answer questions. They communicate tradeoffs, uncertainties, and an achievable sequence of work to stakeholders. There is no single correct mockup.

**Catalog starting points:** `banner`, `error-state`, `service-navigation`, `handoff-summary`. Additional evidence about audio announcements and accessible transit information will be needed before publication.

**Skill evidence:** The learner synthesizes diagnosis, design, research, delivery, and communication across interfaces and service touchpoints.

**Independent transfer:** A public library's membership rules differ between its website, self-service kiosk, call center script, and desk staff. A policy change is planned in two weeks. Write a one-page decision memo with the user problem, immediate correction, content owner, channel update plan, accessible fallback, evidence needed, and a measure of whether members can complete enrollment without contradictory advice. Apply the five-dimension rubric above.

## 6. AI-assisted experience — support reply copilot

**Situation:** A web-based support copilot drafts replies about returns. It cites a policy page, but the page is an older version. The generated answer states confidently that an exception applies, and the “Send” button is beside the draft. Agents are expected to handle a high queue volume; some requests involve exceptions that only a supervisor can authorize.

**Teach first — confidence is not evidence or authority:** An AI-generated answer can sound settled while using stale or incomplete material. A good interaction helps the agent inspect the relevant source, recognize uncertainty, correct or reject a draft, and understand when an action needs human authority. The amount of review should match the consequences. The [NIST AI Risk Management Framework](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10) discusses human roles and oversight; the [People + AI Guidebook](https://pair.withgoogle.com/guidebook-v2/) provides design patterns for explanation, feedback, and user control. Neither source alone specifies this organization's return policy.

**Worked explanation:** An expert would separate three claims: what the policy actually says, what the model inferred, and what the agent may authorize. A citation link is useful only if it points to the current relevant passage. The interaction should let the agent revise the response and route an exception for approval; it should not silently treat a fluent draft as an approved decision.

**Guided decision:** The copilot cites a superseded policy and proposes an exception. An approved current policy is available in the supervisor portal, and only supervisors can authorize exceptions. What should the agent-facing flow do now? A. Block all copilot drafting until policy ingestion is repaired, while agents handle replies manually. B. Prevent the draft from being sent as written; show the stale-source warning and current approved policy, let the agent rewrite or discard the draft, and route the exception for supervisor approval. C. Keep the draft editable and require the agent to acknowledge the warning before sending, so the queue can continue moving.

**Feedback:** B is the strongest provisional flow because the policy is available and the agent can correct an ordinary draft, while the exception remains with the authorized supervisor. Test whether agents can identify the stale claim under queue pressure. A is defensible if source failures are widespread or the review control is unreliable, but it removes potentially useful drafting support for every reply. C keeps work moving but lets an acknowledgment stand in for authority; an agent could still send an unapproved exception. If the current policy cannot be verified, pausing relevant drafting or escalation may become the better option.

**Learner task:** Produce a flow for draft review, source check, edit or discard, supervisor escalation, and correction after an incorrect response has already been sent. State which events you would measure and what you would observe in a usability test. Avoid presenting a confidence percentage as proof that the answer is safe.

**Independent transfer:** A research-summary assistant creates a web report from interview notes but omits two participants and presents a contested theme as unanimous. Write a review and recovery plan that lets a researcher inspect source excerpts, identify coverage gaps, revise the summary, and communicate uncertainty to stakeholders. Submit an annotated flow and a short rationale. Apply the five-dimension rubric above.

**Catalog starting points:** `source-grounding-display`, `confidence-uncertainty-display`, `editable-ai-output`, `human-approval-gate`, `correction-feedback`.

**Skill evidence:** The learner calibrates trust, keeps roles clear, and designs recovery for an AI-assisted workflow.

## Review questions

1. Does the teaching explanation before each task give enough substance for a learner to understand the principle, or is any concept still being left to guesswork?
2. Do the worked explanations model the level of professional judgment the product should teach?
3. Are the six interfaces and contexts broad enough for the first path, and where is additional depth needed?
4. Which lesson needs stronger source evidence or a domain expert before publication?
5. Should the final case require a written artifact, a recorded walkthrough, or both?
6. Do the guided options require real reasoning, or does wording still reveal the answer without understanding?
