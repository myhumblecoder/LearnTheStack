import { streamText, type ModelMessage } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { lessonSystemPrompt, quizSystemPrompt, codeReviewSystemPrompt } from "./prompts";

const ollama = createOpenAICompatible({
  name: "ollama",
  baseURL: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1",
});

const model = ollama(process.env.OLLAMA_MODEL ?? "qwen2.5:32b");

interface TutorOptions {
  mode: "LESSON" | "QUIZ" | "CODE_REVIEW";
  messages: ModelMessage[];
  topicContext: {
    monthNum: number;
    monthTitle: string;
    weekNum: number;
    weekTitle: string;
    topicTitle: string;
    topicContent: string;
    topicType: string;
    resources: string[];
    completedTopics?: string[];
  };
}

export function streamTutorResponse(options: TutorOptions) {
  const { mode, messages, topicContext } = options;

  const systemPromptFn = {
    LESSON: lessonSystemPrompt,
    QUIZ: quizSystemPrompt,
    CODE_REVIEW: codeReviewSystemPrompt,
  }[mode];

  return streamText({
    model,
    system: systemPromptFn(topicContext),
    messages,
  });
}
