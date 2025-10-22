import { openai } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages } from "ai";

// Wellness keywords to detect when user might benefit from exercises
const WELLNESS_KEYWORDS = [
  'stress', 'stressed', 'anxious', 'anxiety', 'breathing', 'meditation',
  'calm', 'relax', 'overwhelmed', 'worried', 'nervous', 'tense', 'panic'
];

function detectWellnessIntent(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return WELLNESS_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // Check if the last user message suggests wellness needs
  const lastUserMessage = messages.filter(m => m.role === 'user').pop();
  const shouldSuggestWellness = lastUserMessage &&
    typeof lastUserMessage.content === 'string' &&
    detectWellnessIntent(lastUserMessage.content);

  // Add system context if wellness is detected
  const modelMessages = convertToModelMessages(messages);
  if (shouldSuggestWellness) {
    modelMessages.unshift({
      role: 'system',
      content: 'The user seems to be experiencing stress or anxiety. After providing your response, suggest they try a breathing exercise by mentioning: "Would you like to try a 1-minute breathing exercise? It can help you feel calmer."'
    });
  }

  const result = streamText({
    model: openai("gpt-5-nano"),
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
