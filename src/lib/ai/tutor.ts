import { streamText, type ModelMessage } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { lessonSystemPrompt, quizSystemPrompt, codeReviewSystemPrompt } from "./prompts";

// Hosted tutor: Anthropic Claude Haiku 4.5 — fast, low-cost, and deploys to
// Vercel (no GPU). The default `anthropic` provider reads ANTHROPIC_API_KEY
// from the environment automatically.
const HAIKU = "claude-haiku-4-5";

// Local-dev fallback: Ollama via the OpenAI-compatible shim. Used only when no
// ANTHROPIC_API_KEY is present, so offline development stays free and the
// deployed app uses Haiku.
const ollama = createOpenAICompatible({
  name: "ollama",
  baseURL: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1",
});

const useAnthropic = Boolean(process.env.ANTHROPIC_API_KEY);

function getModel() {
  return useAnthropic
    ? anthropic(HAIKU)
    : ollama(process.env.OLLAMA_MODEL ?? "qwen2.5:32b");
}

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

  const system = systemPromptFn(topicContext);

  // Pass the system prompt as a cached system message rather than the top-level
  // `system` string: that's how @ai-sdk/anthropic applies Anthropic prompt
  // caching (cacheControl can't ride on the top-level system param). The system
  // prompt is the large, stable prefix repeated across a topic's turns, so it's
  // the right thing to cache. The `anthropic` providerOptions namespace is
  // ignored by the Ollama provider, so this is safe for both paths.
  // (Caching only activates once the prefix passes Haiku's ~4096-token minimum;
  // below that it's a harmless no-op.)
  const systemMessage: ModelMessage = {
    role: "system",
    content: system,
    ...(useAnthropic
      ? { providerOptions: { anthropic: { cacheControl: { type: "ephemeral" } } } }
      : {}),
  };

  return streamText({
    model: getModel(),
    messages: [systemMessage, ...messages],
  });
}
