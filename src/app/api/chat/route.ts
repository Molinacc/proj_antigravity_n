import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter to prevent spam
interface RateLimitTracker {
  count: number;
  resetTime: number;
}
const rateLimitMap = new Map<string, RateLimitTracker>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60; // 60 requests per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limitInfo = rateLimitMap.get(ip);

  if (!limitInfo) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (now > limitInfo.resetTime) {
    // Reset window
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  limitInfo.count += 1;
  return limitInfo.count > MAX_REQUESTS_PER_WINDOW;
}

// Basic input sanitization
function sanitizeText(text: string): string {
  if (!text) return "";
  // Strip potential script injections while preserving valid markdown characters
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown-client";
    if (isRateLimited(ip)) {
      return new NextResponse(
        JSON.stringify({ error: "Limite de requisições excedido. Por favor, aguarde um minuto." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { messages, settings } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "O histórico de mensagens é obrigatório." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // --- AZURE INTEGRATION (PRIMARY ROUTE) ---
    const azureApiKey = process.env.AZURE_API_KEY;
    const azureProjectEndpoint = process.env.AZURE_PROJECT_ENDPOINT;
    const azureOpenAiEndpoint = process.env.AZURE_OPENAI_ENDPOINT;

    if (azureApiKey && azureOpenAiEndpoint) {
      let systemPrompt = "Você é o Orion AI.";
      let temperature = 1;
      let top_p = 1;
      let modelName = "gpt-4.1";

      // Dynamically fetch Azure Agent settings if endpoint is configured
      if (azureProjectEndpoint) {
        try {
          // 1. Try to fetch details for 'agenteton'
          const agentUrl = `${azureProjectEndpoint}/agents/agenteton?api-version=2025-05-15-preview`;
          const agentRes = await fetch(agentUrl, {
            headers: { "api-key": azureApiKey },
            signal: AbortSignal.timeout(3000),
          });

          let agentData = null;
          if (agentRes.ok) {
            agentData = await agentRes.json();
          } else {
            // 2. If 'agenteton' isn't direct/valid, list and fetch first agent
            const listUrl = `${azureProjectEndpoint}/agents?api-version=2025-05-15-preview`;
            const listRes = await fetch(listUrl, {
              headers: { "api-key": azureApiKey },
              signal: AbortSignal.timeout(3000),
            });
            if (listRes.ok) {
              const listData = await listRes.json();
              const firstAgent = listData?.data?.[0];
              if (firstAgent) {
                const detailUrl = `${azureProjectEndpoint}/agents/${firstAgent.id}?api-version=2025-05-15-preview`;
                const detailRes = await fetch(detailUrl, {
                  headers: { "api-key": azureApiKey },
                  signal: AbortSignal.timeout(3000),
                });
                if (detailRes.ok) {
                  agentData = await detailRes.json();
                }
              }
            }
          }

          // Extract agent definition settings
          const def = agentData?.versions?.latest?.definition;
          if (def) {
            if (def.instructions) systemPrompt = def.instructions;
            if (typeof def.temperature === "number") temperature = def.temperature;
            if (typeof def.top_p === "number") top_p = def.top_p;
            if (def.model) modelName = def.model;
          }
        } catch (err) {
          console.error("Error fetching Azure Agent configuration:", err);
        }
      }

      // Prepare payload for Azure OpenAI completion
      const formattedMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map((m: any) => ({
          role: m.role,
          content: sanitizeText(m.content),
        })),
      ];

      const response = await fetch(`${azureOpenAiEndpoint}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": azureApiKey,
        },
        body: JSON.stringify({
          model: modelName,
          messages: formattedMessages,
          stream: true,
          temperature: temperature,
          top_p: top_p,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Azure OpenAI Error:", errorText);
        throw new Error("Erro na comunicação com a API do Azure OpenAI");
      }

      // Stream the response directly to the client
      return new NextResponse(response.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    // --- STANDARD OPENAI FALLBACK ROUTE ---
    const lastMessage = messages[messages.length - 1];
    const userContent = sanitizeText(lastMessage.content);
    const model = settings?.model || "mock-orion";
    const apiKey = settings?.apiKey || process.env.OPENAI_API_KEY;

    if (model !== "mock-orion" && apiKey) {
      const formattedMessages = [
        { role: "system", content: settings?.systemPrompt || "Você é o Orion AI." },
        ...messages.map((m: any) => ({
          role: m.role,
          content: sanitizeText(m.content),
        })),
      ];

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model.includes("gpt") ? model : "gpt-4o",
          messages: formattedMessages,
          stream: true,
          max_tokens: settings?.maxTokens || 2048,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Erro na OpenAI API");
      }

      return new NextResponse(response.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    // --- SIMULATED MOCK AI FALLBACK ROUTE ---
    let mockResponse = "";
    const lowerContent = userContent.toLowerCase();

    if (
      lowerContent.includes("código") ||
      lowerContent.includes("bug") ||
      lowerContent.includes("react") ||
      lowerContent.includes("typescript")
    ) {
      mockResponse = `Aqui está um exemplo de código funcional:
\`\`\`typescript
const greeting = (name: string): string => \`Olá, \${name}!\`;
console.log(greeting("Orion"));
\`\`\``;
    } else {
      mockResponse = `Olá! Sou o **Orion AI**, seu assistente virtual. Fico feliz em conversar com você!
Como posso te ajudar hoje?`;
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const chunks = mockResponse.split(" ");
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i] + (i === chunks.length - 1 ? "" : " ");
          const payload = JSON.stringify({ text: chunk });
          controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
          await new Promise((resolve) => setTimeout(resolve, 30));
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("API Router Error:", error);
    return new NextResponse(
      JSON.stringify({ error: error.message || "Erro no servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
