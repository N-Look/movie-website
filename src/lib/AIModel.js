const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are an expert movie and TV show recommendation assistant. Your job is to help users find the perfect content to watch based on their preferences, moods, and requests.

Guidelines:
1. When a user asks for recommendations, ALWAYS respond with a JSON object in this exact format:
{
  "message": "Your conversational response explaining your recommendations",
  "recommendations": [
    {
      "title": "Movie/Show Title",
      "year": 2024,
      "type": "movie" or "tv",
      "reason": "Brief reason why this matches their request"
    }
  ]
}

2. Provide 5-8 recommendations per request unless the user asks for more or fewer.
3. Be conversational and friendly in your message.
4. Consider the user's previous messages in the conversation for context.
5. If the user mentions a specific movie/show they liked, recommend similar content.
6. If the user describes a mood or scenario, match recommendations to that vibe.
7. Include a mix of popular and lesser-known gems when appropriate.
8. For anime requests, still use "tv" as the type but mention it's anime in the reason.
9. ALWAYS respond with valid JSON only. No markdown, no code blocks, just the JSON object.
10. If the user's message isn't about recommendations (like greetings or questions), set recommendations to an empty array and just respond conversationally.`;

// Store conversation history for context
let conversationHistory = [];

export function resetConversation() {
  conversationHistory = [];
}

export function setConversationHistory(history) {
  conversationHistory = history;
}

export function getConversationHistory() {
  return [...conversationHistory];
}

export async function sendChatMessage(userMessage) {
  try {
    // Add user message to history
    conversationHistory.push({
      role: "user",
      content: userMessage,
    });

    // Build messages array with system prompt
    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      ...conversationHistory,
    ];

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.7,
        max_tokens: 2048,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

    const data = await response.json();
    const responseText = data.choices?.[0]?.message?.content;

    if (responseText) {
      // Add assistant response to history
      conversationHistory.push({
        role: "assistant",
        content: responseText,
      });

      try {
        return JSON.parse(responseText);
      } catch {
        // If JSON parsing fails, return a fallback
        return {
          message: responseText,
          recommendations: [],
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Error sending chat message: ", error);

    // Remove the failed user message from history
    conversationHistory.pop();

    // Check for rate limit error
    if (error?.message?.includes("429") || error?.message?.includes("rate_limit")) {
      return {
        message: "I'm getting too many requests right now. Please wait a moment and try again.",
        recommendations: [],
        isError: true,
      };
    }

    return null;
  }
}

// Keep the old function for backwards compatibility
export async function getAIRecommendation(prompt) {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get AI recommendation");
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content;
  } catch (error) {
    console.error("Error sending message: ", error);
    return null;
  }
}
