import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface EnhancePromptRequest {
  prompt: string
  context?: {
    fileName?: string
    language?: string
    codeContent?: string
  }
}

// Initialize the Gemini client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error(
      "GEMINI_API_KEY is not configured. Get a free key at https://aistudio.google.com/apikey"
    )
  }
  return new GoogleGenAI({ apiKey })
}

async function generateAIResponse(messages: ChatMessage[]) {
  const ai = getGeminiClient()

  const systemPrompt = `You are an expert AI coding assistant. You help developers with:
- Code explanations and debugging
- Best practices and architecture advice
- Writing clean, efficient code
- Troubleshooting errors
- Code reviews and optimizations

Always provide clear, practical answers. When showing code, use proper formatting with language-specific syntax.
Keep responses concise but comprehensive. Use code blocks with language specification when providing code examples.`

  // Convert chat history to Gemini format
  // Gemini expects alternating user/model roles
  const geminiHistory = messages.slice(0, -1).map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }))

  // Get the last message as the current prompt
  const lastMessage = messages[messages.length - 1]

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [
        ...geminiHistory,
        {
          role: "user",
          parts: [{ text: lastMessage.content }],
        },
      ],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 2048,
      },
    })

    const text = response.text
    if (!text) {
      throw new Error("No response from Gemini")
    }

    return text.trim()
  } catch (error) {
    console.error("Gemini generation error:", error)
    throw error
  }
}

async function enhancePrompt(request: EnhancePromptRequest) {
  const ai = getGeminiClient()

  const enhancementPrompt = `You are a prompt enhancement assistant. Take the user's basic prompt and enhance it to be more specific, detailed, and effective for a coding AI assistant.

Original prompt: "${request.prompt}"

Context: ${request.context ? JSON.stringify(request.context, null, 2) : "No additional context"}

Enhanced prompt should:
- Be more specific and detailed
- Include relevant technical context
- Ask for specific examples or explanations
- Be clear about expected output format
- Maintain the original intent

Return only the enhanced prompt, nothing else.`

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: enhancementPrompt,
      config: {
        temperature: 0.3,
        maxOutputTokens: 500,
      },
    })

    return response.text?.trim() || request.prompt
  } catch (error) {
    console.error("Prompt enhancement error:", error)
    return request.prompt // Return original if enhancement fails
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Handle prompt enhancement
    if (body.action === "enhance") {
      const enhancedPrompt = await enhancePrompt(body as EnhancePromptRequest)
      return NextResponse.json({ enhancedPrompt })
    }

    // Handle regular chat
    const { message, history } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required and must be a string" }, { status: 400 })
    }

    const validHistory = Array.isArray(history)
      ? history.filter(
          (msg: any) =>
            msg &&
            typeof msg === "object" &&
            typeof msg.role === "string" &&
            typeof msg.content === "string" &&
            ["user", "assistant"].includes(msg.role),
        )
      : []

    const recentHistory = validHistory.slice(-10)
    const messages: ChatMessage[] = [...recentHistory, { role: "user", content: message }]

    const aiResponse = await generateAIResponse(messages)

    if (!aiResponse) {
      throw new Error("Empty response from Gemini")
    }

    return NextResponse.json({
      response: aiResponse,
      model: "gemini-2.5-flash-lite",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in AI chat route:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json(
      {
        error: "Failed to generate AI response",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  // Check if API key is configured
  const apiKey = process.env.GEMINI_API_KEY
  const isConfigured = apiKey && apiKey !== "your_gemini_api_key_here"

  return NextResponse.json({
    status: isConfigured ? "AI Chat API is running (Gemini 2.5 Flash Lite)" : "AI Chat API needs configuration",
    configured: isConfigured,
    model: "gemini-2.5-flash-lite",
    timestamp: new Date().toISOString(),
    info: "Use POST method to send chat messages or enhance prompts",
  })
}
