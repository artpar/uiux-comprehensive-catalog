# Current UI/UX Issues Audit

Date: 2026-06-08

This document lists what is wrong with the current UI/UX of the catalog as implemented in the current worktree. It is intentionally critical because the product claims to catalog good UI/UX patterns; the interface itself needs to demonstrate the same judgment it asks users and LLM agents to apply.

Evidence inspected:

- Homepage workbench implementation: `src/pages/index.astro`, `src/components/CatalogWorkbench.tsx`
- Pattern detail implementation: `src/pages/patterns/[id].astro`
- Live example wrapper: `src/components/PatternPlayground.tsx`
- Global layout and visual system: `src/styles/global.css`
- Latest available rendered screenshot: `/tmp/uiux-home-compact-header.png`
- Live rendered desktop pass on `http://127.0.0.1:4324/`
- Live rendered mobile emulation at `390x844`
- Rendered page checks for pattern detail, comparisons, agent exports, sources, and anti-patterns
- Demo implementation checks for every current playground component
- Additional screenshots captured during audit:
  - `/tmp/uiux-audit-home-desktop.png`
  - `/tmp/uiux-audit-confirmation-dialog-open.png`
  - `/tmp/uiux-audit-compare-index.png`
  - `/tmp/uiux-audit-home-mobile-emulated.png`
  - `/tmp/uiux-audit-detail-mobile-emulated.png`

## Verdict

The current UI is a usable prototype, but it is not good enough for a product that catalogs good UI/UX patterns. It has interactive examples, but the overall experience still behaves like a documentation catalog with a demo embedded inside it. The product promise is "help humans and LLM agents choose better UI/UX patterns"; the current interface mostly helps users browse entries and read guidance.

The biggest problem is not one visual detail. The core issue is that the interface hierarchy is backwards: filters, metadata, borders, and prose compete with the live pattern behavior, while the live example should be the dominant inspection surface.

## Strategic Product UX Problems

1. The UI does not embody the quality bar expected from a UI/UX pattern catalog.
   - A catalog of interaction patterns should make pattern choice, behavior, states, constraints, and failure modes easy to inspect.
   - The current UI shows a selected pattern plus text sections, but does not make pattern selection feel direct or well-supported.

2. The UI does not model the catalog's own subject matter well enough.
   - A UI/UX pattern catalog should demonstrate strong hierarchy, progressive disclosure, task flow, state clarity, and ergonomic interaction.
   - The current page overuses dense panels, labels, chips, borders, and static prose.

3. The UI still reads as a documentation page.
   - The main experience is "browse list, select item, read article."
   - The intended experience should be closer to "choose a user job, try candidate patterns, compare tradeoffs, export guidance."

4. The page does not clearly answer the user's likely first question: "Which pattern should I use?"
   - Search and filtering exist, but there is no decision path.
   - The UI does not ask for context, constraints, user risk, platform, or state requirements.

5. The LLM-agent goal is not integrated into the core workflow.
   - Agent export exists as a link.
   - It is not presented as a first-class output of the pattern decision process.

## Homepage And Workbench Problems

6. The viewport is still not used efficiently.
   - The header, title row, left controls, and selected-pattern chrome consume too much space before the user gets to meaningful interaction.
   - The live example is visible, but the surrounding layout still makes it feel secondary.

7. The left browse panel remains too heavy.
   - Search, job chips, category select, platform select, maturity select, anti-pattern toggle, count, and results all live in one narrow column.
   - Results begin too far down the page, especially for a catalog with only a few seeded items.

8. Advanced filters are open by default.
   - This violates progressive disclosure.
   - Most users need search, task/job filters, and recommendations first; advanced filters should be available but not dominant.

9. The "Agent context" link is placed like secondary navigation.
   - It is small, ambiguous, and disconnected from the selected pattern.
   - For an agent-focused catalog, the export action should be contextual: "Export this pattern guidance" or "Copy agent prompt context."

10. Pattern rows are information-heavy but not decision-rich.
    - Rows show name, problem, category, maturity, and source count.
    - They do not show why the row is a good candidate for the current user job.

11. The selected pattern preview is still article-shaped.
    - The selected area has title, metadata, live example, then text sections.
    - The layout does not communicate "this is the lab where you inspect the pattern."

12. Metadata chips compete with the actual inspection task.
    - Category, maturity, platform, source count, and tags are visually frequent.
    - Metadata should support selection, not dominate the visual rhythm.

13. "Open detail" is a weak primary action.
    - It tells users to leave the workbench for more content.
    - The homepage should be useful enough to compare, try, and export without requiring detail-page navigation.

14. There is no obvious "compare this pattern" action in the selected pattern area.
    - Comparisons exist elsewhere, but the preview does not expose relevant alternatives.
    - Pattern selection requires understanding near misses, not just reading one entry.

15. The workbench has no explicit selected-context state.
    - If a user chooses "Recover" or searches for a risk, the selected pattern does not explain why it matched.
    - This loses the chance to show fit between context and pattern.

16. Empty and no-match states for the catalog workflow are not prominent.
    - Search/filtering can produce no results, but the current workbench does not appear designed around recovery guidance.
    - A pattern catalog should use its own no-results-recovery pattern well.

## Live Example Problems

17. The live examples are present but not central enough.
    - They are framed inside a generic "Live Interactive Example" block.
    - The UI should make the live behavior the main object of inspection.

18. The live example heading is generic for every pattern.
    - "Live Interactive Example" does not explain what the user should test.
    - Each pattern needs a pattern-specific task prompt, such as "Try deleting a billing rule" or "Narrow an inventory list."

19. The demo wrapper adds unnecessary chrome.
    - The heading, helper text, and pattern label take space before the example.
    - The demo needs clearer controls and state, not repeated labels.

20. Some examples are visually too small relative to their importance in the workflow.
    - The bottom navigation demo, for example, appears as a small phone frame in a large bordered region.
    - If the pattern requires a device frame, the frame should be purposeful and annotated with relevant states.

21. Demos do not consistently expose state controls.
    - A good interactive catalog should let users toggle loading, empty, error, selected, destructive, disabled, undo-window, and overflow states where relevant.
    - Current demos are interactive, but not consistently structured as state laboratories.

22. Demos do not consistently show good vs bad variants.
    - Users and LLM agents can evaluate a pattern faster when they can compare a correct implementation against a common misuse.
    - The current UI mainly shows the intended pattern, then describes misuse in prose.

23. The examples are not clearly connected to the decision rules.
    - When a rule says "avoid this when X," the demo does not let the user switch into condition X and see why the pattern fails.

24. The interaction contracts are not visible while interacting.
    - Required focus behavior, dismissal behavior, keyboard behavior, feedback timing, and state transitions are mostly in text below or on detail pages.
    - The live example should surface these as checkable criteria.

## Information Architecture Problems

25. Top navigation is generic and takes attention away from the workbench.
    - Patterns, Agent exports, Compare, Sources, and Anti-patterns are all peers.
    - The homepage task should privilege pattern choice; other pages should be available but less visually dominant.

26. "Sources" and "Anti-patterns" are separated from the decision moment.
    - Sources matter when judging credibility of a selected pattern.
    - Anti-patterns matter when avoiding bad generated UI.
    - Both should be visible in context, not only as separate top-level destinations.

27. Compare flows are not integrated into pattern browsing.
    - Comparisons are a separate section.
    - Users need comparison prompts exactly when they are looking at a pattern with likely alternatives.

28. Detail pages duplicate the documentation problem.
    - The detail page has a titlebar, lab, sidebar, and long guidance stream.
    - The structure is comprehensive, but not sequenced around pattern evaluation.

29. Detail pages have too many separate guidance sections.
    - Problem, solution, agent guidance, use when, avoid when, failure modes, accessibility, keyboard, aliases, variants, sources, verification all appear as stacked blocks.
    - This is complete, but it makes scanning and evaluation harder.

30. Detail-page sidebar content is low-value in the first viewport.
    - "At A Glance," related links, and comparisons are useful, but the sidebar does not guide the user through applying the pattern.

## Visual Hierarchy Problems

31. Borders are overused.
    - Many containers use similar one-pixel borders.
    - This creates a grid of boxes instead of a clear hierarchy of workspace, lab, and guidance.

32. Too many elements have similar visual weight.
    - Search fields, filters, chips, pattern rows, metadata, demo panel, and guidance sections all compete.
    - The eye does not immediately land on the most important action.

33. The accent color is doing too many jobs.
    - It marks active filters, selected rows, links, panels, and emphasis.
    - The result is technically consistent but not meaningfully expressive.

34. The UI has an admin-tool feel.
    - Dense controls, small labels, selects, chips, and bordered panels make it feel like a back-office database browser.
    - The product should feel like a practical pattern inspection and decision environment.

35. Typography hierarchy is underpowered in dense panels.
    - The compact heading fix helped, but inside the workbench many headings and labels are close in scale.
    - The selected pattern, task prompt, and current state should stand out more clearly.

36. The demo surface is visually boxed in.
    - The live example is inside a bordered panel inside a larger bordered preview panel.
    - This weakens the sense that the demo is the primary workspace.

37. The page lacks spatial grouping by task.
    - Controls are grouped by component type, not by user intent.
    - A better grouping would be: find candidates, try selected pattern, judge fit, export context.

## Interaction And State Problems

38. The workbench does not explain what changed after filtering.
    - Selecting a job filter changes results, but the UI does not summarize the chosen job or why patterns remain.

39. There is no guided progression.
    - Users are left to browse, click, and read.
    - A useful catalog should provide a progression such as "1. Pick user job, 2. Try pattern, 3. Check red flags, 4. Export guidance."

40. There is no "decision result" state.
    - After reviewing a pattern, the user cannot mark it as selected, rejected, or compare-worthy.
    - This matters for both human workflow and LLM-agent context generation.

41. There is no workspace memory.
    - The UI does not maintain a shortlist or comparison set.
    - Pattern choice is often comparative, so the current one-selection model is limiting.

42. There is no explicit recovery path for uncertainty.
    - If the user is unsure which pattern applies, the interface does not offer clarifying questions or adjacent pattern suggestions.

43. The current controls are mostly filters, not decision inputs.
    - Category, platform, and maturity are catalog metadata.
    - Decision inputs should include risk level, reversibility, interruption cost, number of choices, user intent, urgency, and system confidence.

## Content Presentation Problems

44. Guidance is presented as static reference material.
    - Use-when, avoid-when, required states, interaction contracts, and critique questions are listed as text.
    - The UI should turn them into checklists, warnings, examples, and testable criteria.

45. Common misuse is underemphasized.
    - Misuse is one of the most important parts for improving generated UI.
    - It should be prominent near the live example, not buried after other content.

46. Accessibility and keyboard behavior are not visible enough.
    - These are core pattern-quality requirements.
    - They should be surfaced as part of the live interaction contract, not relegated to lower detail sections.

47. Source credibility is disconnected from claims.
    - Sources are counted in rows and listed on detail pages.
    - Specific claims are not visibly tied to source-backed guidance in the immediate UI.

48. The copy is too generic.
    - "Try the behavior before reading the guidance" is directionally correct but bland.
    - The UI should use task-specific language that helps users understand what to inspect.

## LLM-Agent Usefulness Problems

49. The UI does not produce a visible compact agent brief for the selected pattern.
    - There are static export files, but the workbench does not show the exact context an agent should use.

50. The UI does not clearly show LLM agents what not to generate in the immediate pattern view.
    - Common generated-UI mistakes exist in the data.
    - They should be elevated into a high-signal "avoid generating this" panel.

51. The UI does not support comparing agent instructions across patterns.
    - For example, modal dialog vs confirmation dialog vs undo should be easy to compare at the decision point.

52. There is no prompt-oriented output for the user's current selection context.
    - A useful agent workflow would combine selected pattern, user job, risk, platform, required states, and avoid rules into a compact export.

53. The UI does not visibly separate human guidance from agent guidance.
    - The detail page has "Agent Decision Guidance," but the homepage preview mixes everything into general guidance.
    - Agents need concise constraints; humans need explanation and examples.

## Responsive And Layout Problems

54. The desktop layout relies on a wide viewport.
    - The workbench uses a two-column grid with large minimums.
    - This can become cramped on medium screens before the mobile breakpoint.

55. Sticky panels can create nested-scroll friction.
    - The browse rail and preview rail are sticky and internally scrollable.
    - Nested scroll regions often make navigation feel constrained, especially when the live example needs space.

56. Mobile falls back to a stacked layout, but the information order is still not ideal.
    - The same search/filter heaviness likely appears before the user reaches the selected live example.
    - Mobile should prioritize the selected pattern lab and use collapsible drawers for browsing and guidance.

57. The current layout does not provide an obvious full-screen or expanded demo mode.
    - Some patterns need room to be understood.
    - The current preview/detail split still constrains examples inside panels.

## Accessibility And Semantics Problems

58. The pattern list uses `role="listbox"` with button children acting as options.
    - This may not match expected listbox keyboard behavior unless full listbox interaction semantics are implemented.
    - A simpler button list or a fully implemented roving-focus listbox would be safer.

59. Filter chips are buttons but do not expose pressed state.
    - The active state is visual through `is-active`.
    - They should expose `aria-pressed` or use appropriate radio-group semantics.

60. The filter disclosure is open by default and may not help screen-reader flow.
    - Its content is large and appears before results.
    - The default should match the primary task and reduce noise.

61. Demo accessibility requirements are not auditable from the workbench.
    - If a dialog demo claims to demonstrate dialog UX, focus management and keyboard behavior should be visible and testable.

## Consistency Problems

62. The homepage and detail page use different mental models.
    - Homepage: browse rail plus selected preview.
    - Detail: titlebar, lab, sidebar, long guidance pane.
    - The product would feel stronger if both used the same "lab plus decision guidance" model.

63. Pattern demos share a generic wrapper, but the interaction needs differ by pattern.
    - A bottom navigation pattern needs mobile destination context.
    - A confirmation dialog needs consequence, cancellation, and reversibility context.
    - Faceted search needs result count and filter recovery context.

64. The catalog taxonomy is visible before the user understands why it matters.
    - Category, platform, and maturity are useful for organization.
    - User jobs, risks, constraints, and outcomes are more useful for decision-making.

## Missing Quality Bar

65. There is no visible success criterion for a pattern choice.
    - The UI should help answer: "Is this the right pattern for this user problem?"
    - Current sections provide information, but not a final judgment.

66. There is no self-critique mode.
    - Since the catalog targets UI/UX quality and LLM agents, it should let users critique a generated UI against the selected pattern.

67. There is no clear distinction between pattern, anti-pattern, failure mode, and misuse.
    - These concepts appear in the data and nav, but the UI does not make their relationship obvious.

68. The current implementation is not yet "comprehensive catalog" ready.
    - With only a few seeded patterns, the UI already feels crowded.
    - At hundreds of patterns, the current filter/list/detail model will become harder to use unless the decision workflow is redesigned.

## Additional Rendered-Site Issues Found In Second Pass

69. Mobile first viewport is dominated by navigation and filters.
    - At `390x844`, the site header is about 128px tall, the workbench heading area is about 123px tall, and browse controls are about 527px tall.
    - The pattern list starts around 837px down the page, and the selected preview starts around 1987px down the page.
    - This means the main live example is more than two mobile screens below the top of the page.

70. Mobile navigation wraps into a large header instead of becoming a compact navigation pattern.
    - The top nav consumes two rows under the brand.
    - This is especially weak for a UI/UX catalog because it demonstrates poor small-screen information priority.

71. Mobile ordering is backwards for the core experience.
    - Users encounter global nav, page heading, search, filters, category select, platform select, maturity select, anti-pattern toggle, count, and result rows before the selected example.
    - The page says it is interactive, but the interaction surface is not early in the mobile flow.

72. Mobile filters are not just open by default; they fully dominate the first screen.
    - This is worse than a desktop density issue.
    - On mobile, advanced filtering should be a collapsible drawer, sheet, or secondary panel.

73. The mobile pattern result list is too verbose for stacked layout.
    - Each row includes title, problem, category, maturity, and source count.
    - This pushes selection and live inspection even farther down.

74. Desktop uses nested scroll regions that make the page feel constrained.
    - The result list scrolls internally.
    - The selected preview rail also scrolls internally.
    - Users can end up managing multiple scroll containers instead of one coherent workspace.

75. Important selected-pattern content is below the first desktop viewport inside the preview rail.
    - On a 1440x900 rendered pass, the selected preview's "Common Misuse" heading was below the viewport.
    - Misuse guidance is too important for generated UI quality to be hidden that far down.

76. The preview rail's own scrollbar competes with the browser scrollbar.
    - The UI shows scroll affordance inside a panel while the overall page also scrolls.
    - This makes the workbench feel boxed-in and less direct.

77. The homepage has no active-nav indication.
    - The primary nav does not mark the current section.
    - A catalog with several sections needs stronger orientation.

78. The header links have no mobile affordance beyond wrapping.
    - There is no menu, tab bar, segmented nav, or priority treatment.
    - The header behaves like desktop links squeezed into mobile.

79. The workbench heading duplicates the brand without adding much actionable value.
    - Brand says "UI/UX Pattern Catalog."
    - H1 says "UI/UX pattern workbench."
    - The repeated labeling consumes space without improving the decision workflow.

80. The current visual design has no clear "current task" area.
    - The user cannot quickly tell whether they are searching, evaluating, comparing, or exporting.
    - Everything is presented as simultaneous controls and content.

## Page-Specific Issues Missed Earlier

81. The compare index is not an interactive comparison surface.
    - It is a static grid of comparison links and summaries.
    - There is no side-by-side table, no criteria selector, no tradeoff matrix, no demo comparison, and no "choose this when" scanning aid.

82. Comparison detail pages are text pages, not decision tools.
    - They list decision rules, compared patterns, failure modes, sources, and verification.
    - They do not show side-by-side pattern behavior, state differences, consequence differences, or direct links into the relevant live examples at the right moment.

83. Comparison pages do not expose the dimensions of comparison.
    - Users need dimensions such as reversibility, interruption cost, consequence severity, frequency, discoverability, accessibility burden, and recovery quality.
    - The current UI makes users infer those from prose.

84. Comparison pages do not support adding compared patterns from the workbench.
    - The homepage has no "compare with" or shortlist action.
    - The compare pages have no way to carry a user's current context into comparison.

85. The agent exports page is just a file index.
    - It links to Markdown and JSON files.
    - It does not preview the content, explain when to use each file, or expose copy actions.

86. Agent exports are disconnected from selected pattern state.
    - A user cannot export the currently selected pattern, current filters, or current comparison context.
    - This weakens the stated LLM-agent usefulness of the catalog.

87. The agent exports page does not show the output shape.
    - Agents and humans need to know what fields exist, what the compact context contains, and what assumptions the export encodes.
    - The page hides this behind raw file links.

88. The agent exports page does not separate use cases.
    - "Pattern guidance," "Decision guide," "Anti-pattern checklist," and JSON are listed, but their operational differences are not clear.
    - There is no guidance for code-generation, critique, pattern selection, or regression review workflows.

89. The sources index is not useful enough during pattern selection.
    - Sources are listed separately from pattern claims.
    - Users cannot filter by source type, see source authority, or jump from a claim to its backing source in context.

90. Source detail pages are too thin.
    - They show source metadata, an external link, and supported patterns.
    - They do not explain which exact pattern decisions the source supports.

91. Source credibility is treated as metadata rather than evidence.
    - A source being a spec, platform guideline, research paper, or service manual should affect how guidance is weighted.
    - The UI does not make those differences operational.

92. The anti-pattern page is underbuilt.
    - It lists anti-pattern cards but does not show severity, detection cues, remediation, safer alternatives, or examples.
    - This is a major gap because anti-pattern detection is central to improving generated UI.

93. Anti-patterns are isolated from normal patterns.
    - The toast-only critical error entry is a separate page link.
    - The catalog should connect anti-patterns directly to replacement patterns and decision rules.

94. The anti-pattern page has no checklist mode.
    - Agents and humans need a fast way to audit a generated UI for known problems.
    - A static card grid does not support that workflow.

95. Detail pages do not provide a return path to the exact workbench context.
    - A user can open a pattern detail, but there is no "back to current comparison," "back to filtered results," or "add to shortlist."
    - This makes details feel like navigation dead ends.

96. Detail pages repeat metadata in multiple places.
    - Metadata appears in the titlebar and again in "At A Glance."
    - Repetition consumes first-viewport space without adding decision value.

97. Detail pages place source and verification content at the bottom.
    - For a source-backed catalog, claim confidence and verification age should be visible near guidance that depends on it.

98. Detail pages do not separate "human-readable explanation" from "agent constraints" cleanly enough.
    - The agent guidance block is large and text-heavy.
    - The UI does not provide a compact agent contract beside the live behavior.

99. The site has no "all patterns" overview that scales.
    - The homepage workbench is the only pattern browsing surface.
    - There is no table, map, grouped index, or matrix for scanning a large catalog.

100. The current taxonomy appears bigger than the actual catalog.
    - Category and platform filters contain many values with no corresponding seeded results.
    - This creates dead-feeling controls and makes the catalog feel emptier than it is.

## Demo-Specific Issues Missed Earlier

101. Confirmation dialog demo does not implement Escape behavior.
     - The guidance says Escape should cancel when cancellation is safe.
     - The demo does not attach Escape handling for the confirmation dialog.

102. Confirmation dialog demo does not implement focus trapping.
     - Focus moves to Cancel when opened, but Tab trapping is not implemented.
     - A dialog example should visibly and functionally model keyboard containment.

103. Confirmation dialog demo does not expose backdrop behavior.
     - The UI does not show whether clicking outside is allowed, ignored, or treated as cancel.
     - This matters because destructive confirmation dismissal behavior is part of the pattern contract.

104. Confirmation dialog demo does not show typed confirmation or high-risk variants.
     - The pattern lists "Typed confirmation" as a variant.
     - The live example does not let users compare normal confirmation against typed confirmation.

105. Modal dialog demo implements focus trap and Escape behavior but does not make those behaviors inspectable.
     - Users have to know to test Tab and Escape.
     - A catalog should surface those behaviors as visible checks or controls.

106. Modal dialog demo does not show non-modal alternatives.
     - It demonstrates a dialog, but not when an inline panel, disclosure, drawer, or page navigation would be better.

107. Faceted search demo cannot demonstrate no-results recovery.
     - Its filter options appear to always produce at least one result.
     - This misses a common and important faceted-search failure state.

108. Faceted search demo uses select boxes instead of richer facet behavior.
     - Real faceted search often needs counts, multi-select facets, active filter chips, clear-all behavior, result preservation, and empty-state recovery.
     - The current demo is closer to two dropdown filters than a strong faceted search pattern.

109. Faceted search demo does not show result count changes next to facet options.
     - Counts are a core part of helping users understand narrowing before committing.
     - The demo only shows the final number of results.

110. No-results recovery demo requires the user to guess how to trigger the state.
     - The input placeholder says "Try zzz," but there is no explicit state control or scenario.
     - The demo should provide direct ways to inspect normal, zero-result, and recovered states.

111. Undo demo has no timeout or commit boundary.
     - Real undo patterns often have an undo window, after which the action commits.
     - The demo makes undo available indefinitely.

112. Undo demo supports only one pending undo.
     - Deleting multiple items overwrites the previous `deleted` state.
     - The demo does not explain whether this is intentional or a limitation.

113. Undo demo does not show what happens after the undo window expires.
     - There is no state for permanent completion, queueing, or irreversible external side effects.

114. Bottom navigation demo hides important constraints.
     - It does not show overflow, more than five destinations, disabled/unavailable destinations, badges, labels, or adaptive behavior.
     - These are exactly the constraints users need when deciding whether bottom navigation fits.

115. Bottom navigation icon treatment is too abstract.
     - Letter-in-circle placeholders do not demonstrate recognizable navigation affordances.
     - This weakens the practical value of the example.

116. Prompt suggestions demo does not show suggestion ranking or dismissal.
     - AI prompt suggestions need capability framing, relevance, user control, and efficient dismissal.
     - The demo only fills a textarea when a suggestion is clicked.

117. Prompt suggestions demo does not show uncertainty or safety boundaries.
     - AI UX patterns often need to communicate limitations and safe use.
     - The demo does not expose that dimension.

118. Toast-only critical error demo is stronger than most demos, but still isolated.
     - It compares anti-pattern and corrected pattern side by side.
     - That useful structure is not reused across the other pattern demos.

119. Demo buttons generally lack visible state histories.
     - The UI changes, but users do not get a trace of state transitions.
     - A pattern catalog should expose before, during, after, recovery, and failure states clearly.

120. Demos are not linked to their own source-backed requirements.
     - A demo can violate or omit requirements while the text below still claims the pattern has those requirements.
     - There is no checklist proving the demo satisfies the pattern contract.

## Search, Filtering, And Catalog Scale Issues

121. Search is simple substring matching with no ranking explanation.
     - Matching includes aliases, category, problem, solution, selection rules, required states, and misuse.
     - The UI does not show what matched or why a result ranked where it did.

122. Search has no typo tolerance, synonyms, or query suggestions.
     - A comprehensive catalog will need users to find patterns without already knowing exact terms.
     - The current search is brittle for discovery.

123. Search results do not highlight matched terms.
     - Users cannot quickly validate whether the result is relevant to their query.

124. Filtering can hide the currently selected pattern without clearly explaining the selection change.
     - The code falls back to the first filtered result.
     - The UI does not announce or visually explain that the selected pattern changed because filters excluded the prior one.

125. Filter controls mix user jobs and catalog metadata.
     - Job chips, category, platform, maturity, and anti-pattern inclusion all appear as one block.
     - These controls represent different decision levels and should not be visually equal.

126. The "Include anti-patterns" control is conceptually backwards.
     - Anti-patterns should be a mode or audit lens, not merely an include/exclude filter beside maturity.
     - Treating them as ordinary results weakens their warning role.

127. Result count is too low-information.
     - "8 patterns" is shown, but there is no summary by category, risk, platform, or why the set changed.

128. There is no bulk view for high-level catalog coverage.
     - Users cannot see which pattern families are empty, thin, or well-covered.
     - This matters for a project aiming to become comprehensive.

## Content And Labeling Issues

129. Several labels use internal catalog language instead of user decision language.
     - "Maturity," "platform," "category," and "agent context" are not as direct as "where it works," "how proven it is," or "copy guidance for agent."

130. The phrase "Agent context" is ambiguous.
     - It could mean global context, selected context, current search context, or static exports.
     - The link actually points to a generated Markdown file.

131. "Open detail" is vague.
     - It does not explain what extra value the detail page provides.
     - Better actions would be tied to user intent, such as "inspect full contract," "compare alternatives," or "copy agent brief."

132. "Live Interactive Example" is repeated as a generic heading across every pattern.
     - The heading names the component type rather than the pattern-specific task.
     - This wastes one of the strongest label positions in the UI.

133. Category names are title-cased and long.
     - Labels like "Disclosure And Attention Management" are heavy in compact chips.
     - They reduce scan speed inside pattern rows.

134. Maturity values are exposed raw.
     - Values like "domain-specific" and "anti-pattern" appear as data labels rather than explained confidence or caution signals.

135. The UI does not distinguish stable patterns from risky, emerging, or deprecated ones with enough visual clarity.
     - Maturity is just another chip.
     - Pattern maturity should affect confidence, warning, and selection affordances.

## Visual And Interaction Polish Issues

136. Controls are visually square and dense in a way that feels unfinished.
     - This can be acceptable for a data tool, but here it undermines confidence in the catalog's UI/UX judgment.

137. The UI lacks icon affordances for common actions.
     - Search, export, compare, copy, expand, shortlist, reset, and open actions are mostly text-only.
     - The site therefore misses familiar visual scanning aids.

138. There are no loading or hydration states.
     - The React workbench and demos hydrate client-side.
     - The UI does not show what happens before interactivity is ready.

139. There are no visible hover/focus design examples beyond basic outlines and background changes.
     - For a catalog that includes interaction behavior, focus and hover states should be deliberate and visible.

140. The design does not use density adaptively.
     - Desktop could use a richer split workspace.
     - Mobile should use collapsible panels and a selected-pattern-first flow.
     - Current styling mostly stacks the same dense controls.

141. The page has no affordance for expanding the live example.
     - Some examples need more space, especially dialogs, faceted search, and mobile navigation.
     - Users are stuck with whatever panel size the page gives them.

142. There is no permalink or share state for a selected pattern in the workbench.
     - Selecting a row does not update the URL.
     - Users cannot share or reload the workbench with the same selected pattern and filters.

143. The site does not expose keyboard shortcuts or efficient repeated-use flows.
     - This is less important than core layout, but a serious catalog/workbench should support quick pattern switching and search focus.

144. The UI does not provide feedback after opening raw export files.
     - Export links navigate away.
     - There is no copy confirmation, download behavior, or preview-in-place action.

## Highest-Priority Fixes

1. Make the live pattern lab the center of the homepage, not a panel inside a preview article.
2. Convert the left rail into a compact finder with collapsed advanced filters.
3. Add a right-side decision guidance panel for use-when, avoid-when, red flags, required states, and agent output.
4. Add contextual compare and shortlist actions for selected patterns.
5. Replace generic demo headings with pattern-specific tasks and state controls.
6. Promote common misuses and accessibility requirements next to the demo.
7. Remove excess borders, chips, and repeated metadata from the primary viewport.
8. Make agent export contextual to the selected pattern and current decision inputs.
9. Align homepage and detail pages around the same lab-and-guidance model.
10. Add a visible "why this pattern fits" explanation when search or job filters produce candidates.
11. Rebuild mobile around selected pattern inspection first, with browse/filter controls behind compact disclosure.
12. Turn compare pages into actual side-by-side decision tools.
13. Turn agent exports from raw file links into copyable contextual briefs.
14. Make anti-patterns an audit/remediation workflow, not a card list.
15. Add demo contract checklists that prove each live example satisfies the pattern's stated requirements.
