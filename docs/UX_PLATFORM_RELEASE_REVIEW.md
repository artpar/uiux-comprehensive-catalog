# UX platform release review

**Verdict: ready for editorial review; not ready for public deployment.** The implementation passes the local build and the journeys inspected below. A reviewer independent of the implementation must still assess lesson quality and approve the release. This document is the implementer's audit against `UX_PLATFORM_REVIEW_PROMPT.md`; it does not claim independent editorial sign-off.

## Findings in severity order

1. **Release gate — editorial approval pending.** Twenty new lessons and twenty independent practice cases contain professional guidance and fictional scenarios. The implementer checked links, pattern IDs, structure, and one full lesson in the browser, but has not obtained an independent assessment of instructional quality or domain appropriateness. Review the complete inventory in `UX_PLATFORM_CONTENT_INVENTORY.md`, sample cases, and the running preview before deploying. The local-transit prototype remains unpublished because its transit-domain review is pending.
2. **Editorial judgment — guided-choice difficulty needs an independent read.** All twenty decisions were revised so the alternatives represent closer tradeoffs, and answer positions vary 4/8/8. Learners must explain reasoning and confidence and make an independent artifact. An editor should still identify any item where one option remains conspicuously complete or where two options are equally defensible under the stated conditions. This is a content judgment, not a verified interaction defect.
3. **Product hypothesis — local progress may not support long-term return across devices.** It resumes the most recently active incomplete lesson and saves optional artifacts on one device, with a clear storage explanation. Whether this is enough for sustained professional use needs real user evidence. There is no account or sync in this release.
4. **Build warning — a Vite chunk exceeds 500 kB.** The full build succeeds. The large generated chunk is `QualityPatternDemo`, used by the interactive lab; it is worth a later performance pass and did not block the learning or work journeys inspected here.

## Coverage

| Capability or mode | Status | Evidence |
| --- | --- | --- |
| Understand experience quality | Complete for review | Four lessons cover full tasks, understandable feedback, inclusion, and trust, each with a transfer artifact. |
| Diagnose and frame problems | Complete for review | Four lessons separate observation, evidence, hypotheses, and problem framing. |
| Design and apply | Complete for review | Four lessons cover journeys, alternatives, states, and prototype questions. |
| Test and improve | Complete for review | Four lessons include hypotheses, tasks, findings interpretation, and a revision tied to a supplied voice-study packet. |
| Practice professionally | Complete for review | Four lessons cover constraints, service channels, decision communication, and a cross-channel AI-assisted capstone with a seven-item fictional evidence packet and detailed criteria. |
| Learn | Complete for review | Twenty built lesson pages include instruction, worked example, guided choice and feedback, transfer task, rubric, sources, and local progress. |
| Practice | Complete for review | Twenty independent case pages with skill and context filters, self-review criteria, saved attempts, and links back to instruction. |
| Work | Complete for review | Three guided tools build copyable or downloadable Markdown documents. |
| Reference | Complete for review | Existing 298 patterns, 286 comparisons, 897 sources, lab, agent exports, and search remain available; pattern pages link to lessons and work. |

## Detailed lesson check

`experience-beyond-screen` first teaches how to map a person's goal through a clinic check-in service, then demonstrates why a kiosk's “Checked in” message needs a staff-system acknowledgment. The guided decision asks for a recommendation and a written reason before showing option-specific feedback. The weaker staff-help option receives a contextual explanation rather than only an incorrect label. The independent warehouse scanner task transfers the concept to local capture and remote sync, requiring a handoff map and recovery sequence. The criterion checks whether the learner avoids treating local capture as remote success. This is a credible learning loop; self-marked completion remains practice evidence, not a mastery claim.

## Journey and technical evidence

- The first-visit homepage shows Learn, Practice, Work, and Reference. A returning visitor sees a resume route based on locally saved activity. Direct entry to `/patterns/sync-state/` presents the original answer and contextual lesson/work links.
- Browser inspection at desktop and 390 px mobile widths covered the homepage, learning overview, lesson, practice case, reference search, and all three work tools. A complete lesson, practice attempt, work document, return visit, and reference query were exercised. Semantic labels and focusable controls appeared in the accessibility tree. The guided decision moved focus to feedback. The mobile layout kept the primary actions and status readable.
- Local-storage failure was tested both in a runtime check and in the browser using a development-only blocked-storage query. The lesson, practice case, and work tool remained usable and showed copy/export recovery instructions. The saved-items action also handles a failed write without crashing. Cleared storage returns the first-visit state.
- `npm run check` completed with zero typecheck errors or warnings. It validated 298 patterns, 286 comparisons, 897 sources, 20 lessons, 3 workflows, agent exports, and generated 1,559 static pages. The 47 new Learn, Practice, Work, and Reference URLs appear in the sitemap. All 18 distinct lesson source URLs returned HTTP 200 on 2026-09-24.
- The GitHub Pages workflow builds pull requests without deploying them; deployment runs for pushes to `main`. Umami instrumentation sends lesson and workflow identifiers and choice numbers, not learner prose or artifacts. Live event receipt can only be confirmed after an approved deployment.

## Minimum before public release

Obtain independent editorial review of the published lessons and capstone, address any blocking findings, and secure editorial and production approval. Then merge through the existing GitHub Pages workflow, verify the live journeys and Umami event receipt, and report the public result. Keep the transit prototype unpublished until a transit-domain reviewer approves its evidence and operational assumptions.

## Later opportunities

Use learner research to refine harder guided decisions, evaluate whether account-based cross-device progress is warranted, and profile the existing lab bundle if performance measurements show a problem.
