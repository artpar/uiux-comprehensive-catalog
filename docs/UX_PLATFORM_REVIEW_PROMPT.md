# Review prompt: UX learning and work platform

Review the implemented UX Patterns Guide as a professional UX learning and work platform. Use the running site, source code, curriculum, sample lessons, analytics instrumentation, and deployment configuration as evidence. Read `docs/UX_LEARNING_CURRICULUM.md`, `docs/UX_PLATFORM_SAMPLE_CASES.md`, and `docs/UX_PLATFORM_IMPLEMENTATION_GOAL.md` first. Judge the actual product, not the stated plan. Do not edit the implementation during this review.

## Aspiration to review against

The product should become a place people return to throughout their UX practice: to learn, practice, solve work problems, and consult a trustworthy reference. It should help people develop judgment across web, mobile, enterprise, voice, physical, service, and AI-assisted experiences. The guided learning path is one part of that relationship; the product must also serve someone with an immediate professional question. Retention should come from increasing capability and recurring usefulness, not only streaks, points, quizzes, or longer sessions.

## Review questions

1. **Product promise and scope:** Does the homepage and navigation communicate the broader professional purpose clearly? Can a new learner, a working practitioner, and a returning user each find an appropriate next action? Are Learn, Practice, Work, and Reference genuinely connected, or merely separate labels?
2. **Substantive learning:** Does every published lesson actually teach concepts and methods before testing them? Look for clear explanations, worked examples that reveal expert reasoning, common misconceptions, source-backed reading, guided practice, feedback that explains tradeoffs, and independent application. Identify any lesson that is only a situation, task, quiz, or repackaged catalog entry.
3. **Progression and breadth:** Do the five capabilities build on each other? Does scaffolding decrease as judgment grows? Do later exercises require diagnosis, creation, testing, revision, and communication? Are learners asked to transfer principles to unfamiliar contexts and different interface modalities? Call out overclaims of “mastery” based on shallow completion.
4. **Professional usefulness:** Can someone use the product during real UX work to frame a problem, compare approaches, plan research or testing, and explain a decision? Are tools and templates useful artifacts rather than decorative pages? Does the reference library remain fast to search and credible to cite?
5. **Instructional and editorial quality:** Are examples realistic and internally consistent? Are claims distinguishable from hypotheses and fictional exercise data? Do feedback and rubrics allow for context-dependent answers? Verify that important recommendations link to relevant catalog evidence or authoritative sources. Identify domain claims that require expert review before release.
6. **Journey and interaction quality:** Walk the first visit, a direct entry from search to a pattern page, a complete lesson, a return visit, and a live-work task. Note confusion, unnecessary steps, dead ends, repeated content, and unclear progress or recovery. Check keyboard use, screen-reader semantics, mobile layout, reduced motion, and behavior when local storage is blocked or cleared.
7. **Trust and privacy:** Confirm that optional progress is explained accurately, no account is required for the initial path, and analytics never receive free-form answers, personal data, or private API credentials. Inspect event names and payloads against the privacy copy.
8. **Deployment readiness:** Run the existing repository checks and build, inspect the generated site, and confirm that current catalog URLs, SEO metadata, agent exports, newsletter behavior, and GitHub Pages configuration still work. State whether the implementation is ready for public deployment.

## Required output

- Start with a clear **release verdict**: ready, ready with specific minor fixes, or not ready.
- List findings in severity order. For each finding, give the affected user journey, concrete evidence with file/URL and location, why it conflicts with the aspiration, and the smallest credible fix.
- Include a coverage table for the five learning capabilities and the four product modes. Mark each as complete, partial, or missing, with evidence.
- Review at least one complete lesson in detail, including its teaching material, worked example, practice, feedback, and independent application.
- Distinguish verified defects from editorial judgment and hypotheses that need user research.
- End with the minimum changes required before public release and a short list of later opportunities. Do not mistake increased pageviews, time on site, or a streak for evidence of learned skill or durable professional value.
