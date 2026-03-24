import { z } from "zod/v4";

export const quizQuestionSchema = z.object({
  question: z.string(),
  type: z.enum(["multiple_choice", "short_answer", "code"]),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string(),
  explanation: z.string(),
});

export const quizResultSchema = z.object({
  passed: z.boolean(),
  score: z.number().min(0).max(100),
  totalQuestions: z.number(),
  correctAnswers: z.number(),
  feedback: z.string(),
  questionResults: z.array(
    z.object({
      question: z.string(),
      userAnswer: z.string(),
      correct: z.boolean(),
      explanation: z.string(),
    })
  ),
});

export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
export type QuizResult = z.infer<typeof quizResultSchema>;
