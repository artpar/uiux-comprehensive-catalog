import understandingContent from "./course-content-understand.json";
import diagnosingContent from "./course-content-diagnose.json";
import designingContent from "./course-content-design.json";
import testingContent from "./course-content-test.json";
import practicingContent from "./course-content-practice.json";
import courseResearch from "./course-research.json";
import courseScaffolds from "./course-scaffolds.json";
import patternLinks from "./course-pattern-links.json";

export type LearningStage = {
  id: string;
  title: string;
  outcome: string;
};

export type LessonOption = {
  label: string;
  feedback: string;
};

export type LearningLesson = {
  id: string;
  stage: string;
  title: string;
  outcome: string;
  context: string;
  teach: string[];
  terms?: Array<{ term: string; meaning: string }>;
  methodSteps?: string[];
  bridge?: string;
  keyDistinction: string;
  workedExample: string;
  guidedQuestion: string;
  options: [LessonOption, LessonOption, LessonOption];
  strongestOption: number;
  evidenceShift: string;
  transferContext: string;
  transferTask: string;
  evidencePacket?: string[];
  artifact: string;
  assessmentFocus: string;
  assessmentCriteria?: string[];
  patternIds: string[];
  sources: Array<{ label: string; href: string; note?: string }>;
};

export const learningStages: LearningStage[] = [
  { id: "understand", title: "Understand experience quality", outcome: "See the whole task, the people involved, and the consequences of an interaction." },
  { id: "diagnose", title: "Diagnose and frame problems", outcome: "Separate what happened from why it happened and define a problem worth solving." },
  { id: "design", title: "Design and apply", outcome: "Create complete interactions with alternatives, states, and recovery paths." },
  { id: "test", title: "Test and improve", outcome: "Choose useful evidence, interpret it carefully, and revise the design." },
  { id: "practice", title: "Practice professionally", outcome: "Make and communicate defensible UX decisions across a service and a team." }
];

const stageContent = [
  ["understand", understandingContent],
  ["diagnose", diagnosingContent],
  ["design", designingContent],
  ["test", testingContent],
  ["practice", practicingContent]
] as const;

export const learningLessons: LearningLesson[] = stageContent.flatMap(([stage, lessons]) => lessons.map((content) => {
  const scaffold = courseScaffolds[content.id as keyof typeof courseScaffolds];
  const patternIds = patternLinks[content.id as keyof typeof patternLinks];
  if (!scaffold || !patternIds) throw new Error(`Missing course support data for ${content.id}`);
  const sources = content.sourceIds.map((sourceId) => {
    const source = courseResearch.sources[sourceId as keyof typeof courseResearch.sources];
    if (!source) throw new Error(`Missing course source ${sourceId} for ${content.id}`);
    return { label: `${source.publisher}: ${source.title}`, href: source.url, note: source.note };
  });
  return { ...content, ...scaffold, stage, patternIds, sources, options: content.options as LearningLesson["options"] };
}));

export function lessonIndex(id: string) {
  return learningLessons.findIndex((lesson) => lesson.id === id);
}
