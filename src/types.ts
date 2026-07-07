export type StepKey =
  | "step0"
  | "step1"
  | "step2"
  | "step3"
  | "step4"
  | "step5"
  | "step6"
  | "step7"
  | "step8"
  | "step9";

export interface Option {
  id: string;
  label: string;
  description?: string;
  isCustom?: boolean;
}

export interface StepDefinition {
  key: StepKey;
  title: string;
  question: string;
  description: string;
  type: "single" | "multiple" | "text";
  options: Option[];
  icon: string; // Name of Lucide icon
  reactionPrefix: string; // For the 1-sentence marketer reaction
}

export interface SurveyAnswers {
  step0: string; // Campaign goal
  step1: string; // Genre
  step2: string; // Platform
  step3: string; // Target Audience
  step4: string; // Series Stage
  step5: string; // Tone & Manner
  step6: string; // Synopsis, keywords, comparison
  step7: string[]; // Channels (multiple select)
  step8: string; // Weekday
  step9: string; // Promotion schedule
}

export type AppState = 
  | "intro"       // Introduction / start screen
  | "survey"      // Survey question steps
  | "summary"     // Pre-generation summary check (Step C)
  | "generating"  // Loading animation calling Gemini
  | "result";     // Final marketing plan presentation
