import { z } from "zod";

// ============= Auth Schemas =============
export const signUpSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Au moins 8 caractères"),
  name: z.string().min(2, "Au moins 2 caractères"),
});

export const signInSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Au moins 8 caractères"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
});

// ============= Course Schemas =============
export const createCourseSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  category: z.string(),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]),
  estimatedDuration: z.number().positive(),
  prerequisites: z.string().optional(),
  learningOutcomes: z.string().optional(),
});

export const updateCourseSchema = createCourseSchema.partial();

// ============= Exercise Schemas =============
export const submitExerciseSchema = z.object({
  exerciseId: z.string().uuid(),
  content: z.string().min(1),
  language: z.string().optional(),
});

export const submitCodeSchema = z.object({
  code: z.string().min(1),
  language: z.enum(["javascript", "python", "java", "cpp", "go"]),
});

// ============= Quiz Schemas =============
export const submitQuizSchema = z.object({
  quizId: z.string().uuid(),
  responses: z.array(
    z.object({
      questionId: z.string().uuid(),
      answer: z.string(),
    })
  ),
  timeSpent: z.number().positive(),
});

// ============= Pagination Schema =============
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Type exports
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type SubmitExerciseInput = z.infer<typeof submitExerciseSchema>;
export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
