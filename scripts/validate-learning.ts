import { readdirSync } from "node:fs";
import { learningLessons, learningStages } from "../src/data/learning";
import { practiceContexts } from "../src/data/practice-contexts";
import { workflows } from "../src/data/workflows";

const errors: string[] = [];
const patternIds = new Set(readdirSync("src/data/patterns").filter((name) => name.endsWith(".json")).map((name) => name.slice(0, -5)));
const lessonIds = new Set<string>();
const answerPositions = [0, 0, 0];

for (const lesson of learningLessons) {
  if (lessonIds.has(lesson.id)) errors.push(`Duplicate lesson: ${lesson.id}`);
  lessonIds.add(lesson.id);
  if (!learningStages.some((stage) => stage.id === lesson.stage)) errors.push(`${lesson.id}: unknown stage`);
  if (lesson.teach.length < 2 || lesson.teach.some((paragraph) => paragraph.length < 150)) errors.push(`${lesson.id}: teaching is too thin`);
  for (const field of ["workedExample", "misconception", "guidedQuestion", "transferContext", "transferTask", "artifact", "assessmentFocus"] as const) {
    if (!lesson[field]?.trim()) errors.push(`${lesson.id}: missing ${field}`);
  }
  if (lesson.options.length !== 3 || lesson.options.some((option) => !option.label || option.feedback.length < 80)) errors.push(`${lesson.id}: guided options need substantive feedback`);
  if (![0, 1, 2].includes(lesson.strongestOption)) errors.push(`${lesson.id}: invalid answer position`);
  else answerPositions[lesson.strongestOption]++;
  if (lesson.transferContext === lesson.context) errors.push(`${lesson.id}: no transfer context`);
  if (lesson.id === "capstone-ux-decision" && ((lesson.evidencePacket?.length || 0) < 5 || (lesson.assessmentCriteria?.length || 0) < 4)) errors.push(`${lesson.id}: capstone needs an evidence packet and detailed criteria`);
  if (!practiceContexts[lesson.id]) errors.push(`${lesson.id}: no practice context`);
  if (!lesson.sources.length || lesson.sources.some((source) => !source.href.startsWith("https://"))) errors.push(`${lesson.id}: missing HTTPS source`);
  for (const id of lesson.patternIds) if (!patternIds.has(id)) errors.push(`${lesson.id}: unknown pattern ${id}`);
}

for (const stage of learningStages) {
  if (learningLessons.filter((lesson) => lesson.stage === stage.id).length !== 4) errors.push(`${stage.id}: expected four lessons`);
}
if (learningLessons.length !== 20) errors.push(`Expected 20 lessons; found ${learningLessons.length}`);
if (answerPositions.some((count) => count < 3)) errors.push(`Guided answer positions are too concentrated: ${answerPositions.join(", ")}`);
if (workflows.length < 3) errors.push("At least three work tools are required");
for (const workflow of workflows) {
  if (!lessonIds.has(workflow.lessonId)) errors.push(`${workflow.id}: related lesson missing`);
  if (workflow.fields.length < 5 || new Set(workflow.fields.map((field) => field.id)).size !== workflow.fields.length) errors.push(`${workflow.id}: insufficient or duplicate fields`);
  for (const id of workflow.patternIds) if (!patternIds.has(id)) errors.push(`${workflow.id}: unknown pattern ${id}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${learningLessons.length} lessons across ${learningStages.length} stages, ${workflows.length} work tools, and all related pattern IDs. Guided answer positions: ${answerPositions.join("/")}.`);
}
