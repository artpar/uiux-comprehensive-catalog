import { z } from "zod";

export const patternCategories = [
  "Navigation And Wayfinding",
  "Search, Browse, And Discovery",
  "Input And Data Entry",
  "Selection And Choice",
  "Feedback, Status, And System State",
  "Error Prevention And Recovery",
  "Disclosure And Attention Management",
  "Data Display And Exploration",
  "Task And Workflow Patterns",
  "Collaboration And Social Interaction",
  "Personalization And Preference",
  "AI And Automation UX",
  "Trust, Safety, And Privacy",
  "Cross-Device And Physical Interaction"
] as const;

export const platforms = [
  "web",
  "mobile",
  "desktop",
  "spatial",
  "voice",
  "game",
  "ai"
] as const;

export const patternMaturities = [
  "standard",
  "established",
  "emerging",
  "domain-specific",
  "deprecated",
  "anti-pattern"
] as const;

export const sourceTypes = [
  "spec",
  "platform-guideline",
  "ux-research",
  "service-manual",
  "product-example",
  "hci-literature",
  "pattern-library"
] as const;

const idSchema = z
  .string()
  .min(2)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase kebab-case IDs.");

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD dates.");

const nonEmptyString = z.string().trim().min(1);

export const sourceRefSchema = z.object({
  id: idSchema,
  note: nonEmptyString
});

export const patternExampleSchema = z.object({
  product: nonEmptyString,
  url: z.string().url().optional(),
  platform: z.enum(platforms),
  notes: nonEmptyString,
  screenshot: z.string().optional(),
  checkedAt: isoDateSchema
});

export const patternEntrySchema = z.object({
  id: idSchema,
  name: nonEmptyString,
  aliases: z.array(nonEmptyString),
  category: z.enum(patternCategories),
  secondaryCategories: z.array(z.enum(patternCategories)),
  platforms: z.array(z.enum(platforms)).min(1),
  problem: nonEmptyString,
  solution: nonEmptyString,
  problemContext: z.array(nonEmptyString).min(1),
  selectionRules: z.array(nonEmptyString).min(3),
  requiredStates: z.array(nonEmptyString).min(3),
  interactionContract: z.array(nonEmptyString).min(1),
  implementationChecklist: z.array(nonEmptyString).min(3),
  commonMisuses: z.array(nonEmptyString).min(2),
  critiqueQuestions: z.array(nonEmptyString).min(1),
  useWhen: z.array(nonEmptyString).min(1),
  avoidWhen: z.array(nonEmptyString).min(1),
  variants: z.array(nonEmptyString),
  accessibility: z.array(nonEmptyString),
  keyboardBehavior: z.array(nonEmptyString),
  failureModes: z.array(nonEmptyString),
  relatedPatterns: z.array(idSchema),
  comparisons: z.array(idSchema),
  examples: z.array(patternExampleSchema),
  sources: z.array(sourceRefSchema).min(1),
  maturity: z.enum(patternMaturities),
  lastVerified: isoDateSchema
});

export const sourceEntrySchema = z.object({
  id: idSchema,
  name: nonEmptyString,
  type: z.enum(sourceTypes),
  url: z.string().url(),
  publisher: nonEmptyString.optional(),
  checkedAt: isoDateSchema,
  notes: nonEmptyString
});

export const comparisonEntrySchema = z.object({
  id: idSchema,
  title: nonEmptyString,
  summary: nonEmptyString,
  patternIds: z.array(idSchema).min(2),
  decisionRules: z.array(nonEmptyString).min(1),
  failureModes: z.array(nonEmptyString),
  sources: z.array(sourceRefSchema).min(1),
  lastVerified: isoDateSchema
});

export type PatternEntry = z.infer<typeof patternEntrySchema>;
export type SourceEntry = z.infer<typeof sourceEntrySchema>;
export type ComparisonEntry = z.infer<typeof comparisonEntrySchema>;
