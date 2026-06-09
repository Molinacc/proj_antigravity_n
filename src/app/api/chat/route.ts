import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter to prevent spam
interface RateLimitTracker {
  count: number;
  resetTime: number;
}
const rateLimitMap = new Map<string, RateLimitTracker>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests per minute

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

    const lastMessage = messages[messages.length - 1];
    const userContent = sanitizeText(lastMessage.content);
    const model = settings?.model || "mock-orion";
    const apiKey = settings?.apiKey || process.env.OPENAI_API_KEY;

    // Check if we need to call real OpenAI API
    if (model !== "mock-orion" && apiKey) {
      // Format messages for OpenAI API
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

      // Return stream from OpenAI back to our frontend
      return new NextResponse(response.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    // --- FALLBACK MOCK AI GENERATION SERVICE (STREAMING) ---
    // Generate responses depending on keywords to simulate advanced intelligence
    let mockResponse = "";
    const lowerContent = userContent.toLowerCase();

    // 1. Programming assistant logic
    if (
      lowerContent.includes("código") ||
      lowerContent.includes("bug") ||
      lowerContent.includes("react") ||
      lowerContent.includes("typescript") ||
      lowerContent.includes("javascript") ||
      lowerContent.includes("função") ||
      lowerContent.includes("css") ||
      lowerContent.includes("html")
    ) {
      mockResponse = `Aqui está uma explicação detalhada e a solução para sua questão de programação:

### Exemplo de Solução
Para criar ou resolver seu problema, podemos seguir um design robusto. Aqui está um exemplo de código funcional:

\`\`\`typescript
// Hook customizado em React para gerenciar requisições assíncronas
import { useState, useEffect, useCallback } from "react";

export function useFetchData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(\`Erro: \${response.statusText} (\${response.status})\`);
      }
      const json = await response.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "Algo deu errado");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
\`\`\`

### Como isso funciona:
1. **\`useState\`**: Gerencia os estados de \`data\`, \`loading\` e \`error\` de forma independente.
2. **\`useCallback\`**: Memoriza a função de busca para evitar renderizações desnecessárias.
3. **Tratamento de Erros**: Captura exceções da requisição e atualiza o estado correspondente.

Espero que este código ajude no seu projeto! Deixe-me saber se precisar de alterações ou explicações extras.`;
    }
    // 2. Study assistant logic
    else if (
      lowerContent.includes("estudo") ||
      lowerContent.includes("resumo") ||
      lowerContent.includes("explica") ||
      lowerContent.includes("história") ||
      lowerContent.includes("guerra") ||
      lowerContent.includes("exercício")
    ) {
      mockResponse = `# Resumo Educacional e Exercícios

Entendido! Aqui está um resumo didático sobre o tema solicitado, seguido de exercícios práticos para fixar o conhecimento:

### Resumo: Segunda Guerra Mundial (Visão Geral)
A Segunda Guerra Mundial (1939–1945) foi um conflito militar global que envolveu a maioria das nações do mundo, organizadas em duas alianças militares opostas: os **Aliados** (liderados por Reino Unido, União Soviética e Estados Unidos) e o **Eixo** (liderado por Alemanha, Itália e Japão). O estopim do conflito foi a invasão da Polônia pela Alemanha nazista em 1º de setembro de 1939. O fim das hostilidades ocorreu em 1945 com a rendição incondicional da Alemanha e o bombardeio atômico sobre Hiroshima e Nagasaki.

---

### Exercícios de Fixação

1. **Qual foi o evento considerado o estopim da Segunda Guerra Mundial em 1939?**
   * *R: A invasão da Polônia por forças alemãs em setembro de 1939.*

2. **Quais eram as duas grandes alianças militares do conflito?**
   * *R: Aliados (EUA, URSS, Reino Unido, etc.) e Eixo (Alemanha, Itália e Japão).*

3. **Explique sucintamente o desfecho militar no teatro do Pacífico.**
   * *R: Ocorreu após o lançamento das bombas atômicas americanas em Hiroshima e Nagasaki em agosto de 1945, forçando o Japão a assinar a rendição incondicional.*

*Dica: Estude os tratados pós-guerra para entender a divisão geopolítica que deu início à Guerra Fria!*`;
    }
    // 3. Content production logic
    else if (
      lowerContent.includes("artigo") ||
      lowerContent.includes("redação") ||
      lowerContent.includes("post") ||
      lowerContent.includes("seo") ||
      lowerContent.includes("linkedin") ||
      lowerContent.includes("email")
    ) {
      mockResponse = `Aqui está o rascunho de texto profissional otimizado para o seu canal de comunicação:

### 🚀 Novidade no Ar: Conheça o Orion AI!

Você já sentiu que o dia precisava ter mais de 24 horas para dar conta de tudo? Nós também. É por isso que criamos o **Orion AI**, um assistente virtual conversacional projetado para maximizar sua eficiência!

Seja você um programador em busca de refatoração rápida, um estudante querendo resumos claros, ou um criador de conteúdo estruturando seu próximo artigo, o Orion AI se adapta às suas necessidades.

**Principais capacidades:**
* 💻 **Coding Helper:** Suporte nativo para TypeScript, React, Python e SQL.
* 📚 **Study Center:** Criação de cronogramas e correção de exercícios.
* ✍️ **SEO Copywriting:** Textos engajadores estruturados para conversão.
* ⚙️ **Modo Escuro & Fluido:** Interface ultrarrápida hospedada na Vercel.

Experimente agora mesmo e eleve sua produtividade a um novo patamar! 💡

*#InteligenciaArtificial #Produtividade #Tech #OrionAI #React #NextJS*`;
    }
    // 4. Productivity and planning logic
    else if (
      lowerContent.includes("tarefa") ||
      lowerContent.includes("cronograma") ||
      lowerContent.includes("planejamento") ||
      lowerContent.includes("todo") ||
      lowerContent.includes("projeto")
    ) {
      mockResponse = `Aqui está uma sugestão de cronograma e lista de tarefas estruturada para organizar seu projeto:

### 📅 Planejamento de Desenvolvimento (Sprint Semanal)

#### **Fase 1: Preparação e Inicialização**
- [x] Configurar ambiente Next.js 15 e Tailwind v4.
- [x] Conectar repositório GitHub e integrar com a Vercel.
- [x] Definir tokens de cores globais.

#### **Fase 2: Core Frontend (UI/UX)**
- [ ] Desenvolver o Sidebar History de sessões.
- [ ] Criar componentes de entrada de mensagens com área elástica.
- [ ] Implementar interruptor de tema (Claro / Escuro / Sistema).

#### **Fase 3: API & Integração de IA**
- [ ] Estruturar a API route para lidar com streamings SSE.
- [ ] Conectar chaves de API com validação e segurança contra spam.

#### **Fase 4: Banco de Dados & Deploy**
- [ ] Criar tabelas no PostgreSQL/Supabase.
- [ ] Rodar testes de build de produção e lançar na Vercel.

*Recomendação: Utilize ferramentas como Trello ou Notion para rastrear o progresso destas tarefas visualmente.*`;
    }
    // 5. Default generic chat response
    else {
      mockResponse = `Olá! Sou o **Orion AI**, seu assistente virtual. Fico feliz em conversar com você!

Como sou um agente conversacional avançado, posso atuar em diferentes frentes para te ajudar:
1. 📚 **Estudos:** Posso explicar teorias, gerar questionários ou criar resumos.
2. 💻 **Programação:** Escrevo códigos em React, TypeScript, Python, SQL, etc., e ajudo a resolver bugs.
3. ✍️ **Textos:** Crio posts, e-mails comerciais ou artigos otimizados para mecanismos de busca (SEO).
4. ⏱️ **Produtividade:** Ajudo a desenhar planejamentos, agendas ou planos de negócios.

Se sua pergunta for sobre algum desses temas, sinta-se à vontade para perguntar de forma mais específica. Em que posso te ajudar hoje?`;
    }

    // Simulate streaming by outputting chunks back to the client
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Splitting into words/small chunks to simulate typing speed
        const chunks = mockResponse.split(" ");
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i] + (i === chunks.length - 1 ? "" : " ");
          const payload = JSON.stringify({ text: chunk });
          controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
          // Wait 30ms between chunks for typing feedback feel
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
