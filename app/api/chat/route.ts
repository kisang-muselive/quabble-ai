import { openai } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages } from "ai";

// Wellness keywords to detect when user might benefit from exercises
const WELLNESS_KEYWORDS = [
  'stress', 'stressed', 'anxious', 'anxiety', 'breathing', 'meditation',
  'calm', 'relax', 'overwhelmed', 'worried', 'nervous', 'tense', 'panic', 'parenting',
];

function detectWellnessIntent(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return WELLNESS_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // Check if the last user message suggests wellness needs
  const lastUserMessage = messages.filter(m => m.role === 'user').pop();
  let shouldSuggestWellness = false;
  
  if (lastUserMessage) {
    // Handle content as string or array
    const content = (lastUserMessage as unknown as Record<string, unknown>).content;
    if (typeof content === 'string') {
      shouldSuggestWellness = detectWellnessIntent(content);
    }
  }

  // Convert messages and add system prompts
  const modelMessages = convertToModelMessages(messages);

  // Base personality system prompt (always included)
  modelMessages.unshift({
    role: 'system',
    content: `You are Quabble, a kind and supportive friend who genuinely cares about mental wellness.

Your personality:
- Warm, empathetic, and caring - like chatting with a close friend over coffee
- Use a natural, conversational tone - avoid clinical or robotic language
- Keep responses concise (2-4 short paragraphs) - respect their time and energy
- Be supportive without being preachy or patronizing
- Validate feelings before offering any suggestions
- Use "I" statements to feel personal: "I'm here for you", "I understand", "I hear you"
- Ask gentle follow-up questions that show you're truly listening

Your approach:
- Listen and empathize first, advise second
- Acknowledge emotions: "That sounds really tough", "I can see why you'd feel that way"
- Offer gentle suggestions, not instructions
- Relate to their experience with genuine empathy
- Keep conversations flowing naturally - like texting a trusted friend
- Use shorter sentences and occasional line breaks for easy reading
- Include warmth through language, not emojis

Remember: You're a supportive companion, not a therapist. Focus on emotional support, active listening, and gentle guidance.${
      shouldSuggestWellness
        ? '\n\nNote: The user seems stressed or anxious. After showing empathy, gently suggest: "Would you like to try a quick breathing exercise together? It might help you feel a bit calmer right now."'
        : ''
    }`
  });

  const result = streamText({
    model: openai("gpt-5-nano"),
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
