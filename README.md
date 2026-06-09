# Orion AI - Assistente Virtual Conversacional Avançado

Orion AI é um assistente virtual conversacional de inteligência artificial de alta fidelidade, integrado a um site moderno construído em **Next.js 15**, **React**, **Tailwind CSS v4** e **TypeScript**. O projeto foi estruturado com foco em modularidade, escalabilidade, segurança e estética premium.

## 🚀 Recursos Principais
- **Atendimento Geral:** Respostas de conversação natural mantendo contexto de sessão.
- **Assistente de Estudos:** Geração automática de resumos e exercícios baseados no assunto.
- **Assistente de Programação:** Geração, depuração e explicação de códigos estruturados com realce de sintaxe em Markdown.
- **Produção de Conteúdo:** Textos prontos para e-mails, posts para LinkedIn e otimização para SEO.
- **Produtividade:** Geração rápida de cronogramas semanais e checklists de tarefas de projetos.
- **Interface Premium:** Visual futurista com suporte a tema Dark/Light/System, glassmorphism, layouts responsivos (Mobile-First) e micro-animações.
- **Modo Simulação & API Real:** Funciona gratuitamente por simulação textual inteligente ou real por conexão com a API da OpenAI.
- **Estrutura Supabase:** Tabelas relacionais PostgreSQL preparadas para histórico persistente e auditorias de segurança.

## 🛠️ Tecnologias Utilizadas
- **Framework:** Next.js 15 (App Router)
- **Estilização:** Tailwind CSS v4 & PostCSS
- **Linguagem:** TypeScript
- **Banco de Dados:** Supabase / PostgreSQL (Pronto para conexão)
- **Pacotes Adicionais:** Lucide React (Ícones), React-Markdown (Renderização de texto formatado), Remark-GFM (Suporte a tabelas/listas de tarefas em Markdown).

---

## 💻 Como Executar Localmente

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Configure as Variáveis de Ambiente:**
   Copie o arquivo `.env.local.example` para `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
   *(Opcional: Preencha com sua chave da OpenAI e/ou dados do banco Supabase se desejar integração ativa).*

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🌍 Estrutura do Banco de Dados (Supabase)
O arquivo SQL com a migração completa do banco está localizado em `supabase/schema.sql`. Ele cria as tabelas de:
- `users` (Dados de login e perfil)
- `conversations` (Sessões de bate-papo classificadas por categoria)
- `messages` (Histórico de cada conversa)
- `file_uploads` (Arquivos anexados)
- `audit_logs` (Segurança contra acessos indevidos)

---

## ⚡ Deploy no Vercel

O projeto está totalmente configurado para deploy automático na Vercel a partir do GitHub:

1. Acesse o [Painel da Vercel](https://vercel.com).
2. Clique em **Add New...** > **Project**.
3. Selecione o repositório `proj_antigravity_n` importado no GitHub.
4. (Opcional) Adicione as variáveis de ambiente descritas no `.env.local` na seção de variáveis da Vercel.
5. Clique em **Deploy**.

