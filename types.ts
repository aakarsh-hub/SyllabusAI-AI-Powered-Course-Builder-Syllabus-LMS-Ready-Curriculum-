
export enum BloomLevel {
  Remember = "Remember",
  Understand = "Understand",
  Apply = "Apply",
  Analyze = "Analyze",
  Evaluate = "Evaluate",
  Create = "Create"
}

export enum ActivityType {
  Lecture = "Lecture",
  Seminar = "Seminar",
  Lab = "Lab",
  Project = "Project"
}

export enum AssignmentDifficulty {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced"
}

export interface Slide {
  title: string;
  bullets: string[];
  visualHint: string;
  speakerNotes: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface RubricCriteria {
  criteriaName: string;
  description: string;
  weight: number;
  bands: {
    excellent: string;
    good: string;
    fair: string;
    poor: string;
  };
}

export interface Assignment {
  title: string;
  description: string;
  type: string;
  estimatedHours: number;
  difficulty: AssignmentDifficulty;
  rubric: RubricCriteria[];
}

export interface ReadingResource {
  title: string;
  author: string;
  type: "Textbook" | "Paper" | "Video" | "Article";
  relevance: string;
  link?: string; // Optional generated link placeholder
}

export interface WeeklyModule {
  weekNumber: number;
  title: string;
  focus: string;
  learningObjectives: string[];
  keyConcepts: string[];
  deliveryMode: ActivityType;
  lectureSummary: string; // 800-1200 words summary
  lectureOutline: string[]; // High level topics
  discussionPrompts: string[];
  readings: ReadingResource[];
  assignments: Assignment[];
  quiz: QuizQuestion[];
  slides: Slide[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  targetAudience: string;
  level: string;
  totalWeeks: number;
  modules: WeeklyModule[];
  createdAt: string;
}

export type GenerationStatus = 'idle' | 'generating' | 'success' | 'error';
