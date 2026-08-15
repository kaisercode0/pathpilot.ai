import type { RoadmapRequest, RoadmapResponse } from "./schemas";

/**
 * Generate a dynamic fallback roadmap when Anthropic API key is unavailable or encounters 401.
 * This guarantees reliable offline grading, demo resilience, and instant testing.
 */
export function generateCuratedFallbackRoadmap(request: RoadmapRequest): RoadmapResponse {
  const goalLower = request.careerGoal.toLowerCase();
  const weeks =
    request.targetDuration === "1_month"
      ? 4
      : request.targetDuration === "3_months"
      ? 12
      : request.targetDuration === "6_months"
      ? 24
      : 52;
  const totalCalculatedHours = weeks * request.hoursPerWeek;
  const skillsArray = Array.isArray(request.currentSkills)
    ? request.currentSkills
    : [request.currentSkills];

  const durationFormatted =
    request.targetDuration === "1_month"
      ? "1 Month (Intensive)"
      : request.targetDuration === "3_months"
      ? "3 Months (Standard Quarter)"
      : request.targetDuration === "6_months"
      ? "6 Months (In-Depth)"
      : "1 Year (Comprehensive)";

  // Determine domain
  if (goalLower.includes("ai") || goalLower.includes("machine learning") || goalLower.includes("llm") || goalLower.includes("data scientist")) {
    return {
      id: `roadmap-ai-${Date.now()}`,
      careerGoal: request.careerGoal,
      title: `${request.careerGoal} Mastery Path`,
      summary: `A structured learning journey for ${request.careerGoal}, tailored for ${request.experienceLevel} level at ${request.hoursPerWeek} hrs/week over ${durationFormatted}. Bridging your current foundation (${skillsArray.slice(0, 3).join(", ") || "Fundamentals"}) into production-grade machine learning and LLM engineering.`,
      experienceLevel: request.experienceLevel,
      hoursPerWeek: request.hoursPerWeek,
      targetDuration: durationFormatted,
      totalEstimatedHours: totalCalculatedHours,
      isFallback: true,
      generatedAt: new Date().toISOString(),
      careerInsights: {
        inDemandSkills: [
          "Python 3.12+",
          "PyTorch & Hugging Face Transformers",
          "Retrieval-Augmented Generation (RAG)",
          "Vector Databases (Pinecone/Chroma/Qdrant)",
          "LangChain & LlamaIndex",
          "Prompt Engineering & Evaluation",
          "FastAPI Model Serving",
        ],
        recommendedCertifications: [
          "DeepLearning.AI Generative AI for Everyone / LLM Specialization",
          "AWS Certified Machine Learning - Specialty",
          "TensorFlow Developer Certificate",
        ],
        portfolioTips: [
          "Build an end-to-end RAG system with citation sources over custom domain PDFs",
          "Fine-tune an open-source LLM (e.g. LLaMA-3 / Mistral) on domain-specific dataset",
          "Benchmark and publish model latency vs accuracy evaluation metrics on GitHub",
          "Include a live interactive demo hosted on Hugging Face Spaces or Vercel",
        ],
        interviewPrepFocus: [
          "Transformer architecture internals (Self-Attention, KV Cache, Positional Encoding)",
          "RAG chunking strategies, hybrid search, and reranking trade-offs",
          "Handling hallucinations, context window limitations, and latency optimization",
          "Python OOP, asynchronous processing, and API design",
        ],
        potentialJobTitles: [
          "AI Application Engineer",
          "Applied Machine Learning Engineer",
          "LLM Systems Developer",
          "Data Scientist",
        ],
      },
      phases: [
        {
          id: "phase-1",
          phaseNumber: 1,
          title: "Core Foundations & Modern AI Tooling",
          description: "Solidify Pythonic data manipulation, tensor math, API integration, and modern environment setups.",
          estimatedWeeks: Math.max(1, Math.round(weeks * 0.25)),
          estimatedHours: Math.round(totalCalculatedHours * 0.25),
          milestoneProject: {
            title: "Semantic Document Search CLI",
            description: "Build a Python CLI that embeds user documents using sentence-transformers and performs fast semantic similarity queries with Cosine Distance.",
            deliverables: [
              "Python CLI script with Typer/Argparse",
              "Embedding generation and cosine similarity lookup",
              "README with benchmark comparisons vs keyword search",
            ],
            estimatedHours: Math.round(totalCalculatedHours * 0.08),
          },
          tasks: [
            {
              id: "task-1-1",
              title: "Modern Python & Asynchronous Programming",
              description: "Review type hints, pydantic data modeling, async/await event loops, and package management with uv or Poetry.",
              estimatedHours: Math.round(totalCalculatedHours * 0.06),
              category: "concept",
              skillsCovered: ["Python 3.12+", "AsyncIO", "Pydantic"],
              resources: [
                {
                  title: "FastAPI & Pydantic Official Docs",
                  url: "https://fastapi.tiangolo.com/tutorial/",
                  type: "doc",
                  isFree: true,
                },
                {
                  title: "Real Python: Async IO in Python",
                  url: "https://realpython.com/async-io-python/",
                  type: "tutorial",
                  isFree: true,
                },
              ],
              tips: "Focus on understanding how asynchronous I/O prevents blocking when making parallel LLM API calls.",
              completed: false,
            },
            {
              id: "task-1-2",
              title: "Vector Embeddings & Similarity Math",
              description: "Deep dive into word and sentence embeddings, cosine similarity, Euclidean distance, and tokenization techniques.",
              estimatedHours: Math.round(totalCalculatedHours * 0.06),
              category: "concept",
              skillsCovered: ["Embeddings", "HuggingFace", "Linear Algebra"],
              resources: [
                {
                  title: "Hugging Face Course: Embeddings",
                  url: "https://huggingface.co/learn/nlp-course/",
                  type: "course",
                  isFree: true,
                },
              ],
              tips: "Experiment with different embedding dimensions (384 vs 1536) and observe memory vs retrieval precision.",
              completed: false,
            },
            {
              id: "task-1-3",
              title: "Build and Package the Semantic Search Tool",
              description: "Implement the phase milestone project, write pytest unit tests, and publish documentation.",
              estimatedHours: Math.round(totalCalculatedHours * 0.08),
              category: "project",
              skillsCovered: ["PyTest", "Vector Search", "CLI Development"],
              resources: [
                {
                  title: "Sentence Transformers Documentation",
                  url: "https://www.sbert.net/",
                  type: "doc",
                  isFree: true,
                },
              ],
              tips: "Add unit tests verifying edge cases like empty documents or very long input queries.",
              completed: false,
            },
          ],
        },
        {
          id: "phase-2",
          phaseNumber: 2,
          title: "Retrieval-Augmented Generation (RAG) Architecture",
          description: "Design resilient RAG pipelines integrating vector stores, intelligent document chunking, metadata filtering, and re-ranking.",
          estimatedWeeks: Math.max(1, Math.round(weeks * 0.35)),
          estimatedHours: Math.round(totalCalculatedHours * 0.35),
          milestoneProject: {
            title: "Production Domain Knowledge Assistant",
            description: "A production-grade RAG assistant that answers questions over technical PDF documentation with verifiable markdown citations.",
            deliverables: [
              "Document ingestion and recursive character chunking pipeline",
              "Vector storage with ChromaDB or Pinecone",
              "Hybrid search combining BM25 keyword matching and dense vector search",
              "Streamed responses with source attribution",
            ],
            estimatedHours: Math.round(totalCalculatedHours * 0.12),
          },
          tasks: [
            {
              id: "task-2-1",
              title: "Document Ingestion & Chunking Strategies",
              description: "Master sliding window chunking, semantic chunking, and handling PDF tables, markdown headers, and metadata tags.",
              estimatedHours: Math.round(totalCalculatedHours * 0.08),
              category: "practice",
              skillsCovered: ["Document Ingestion", "Chunking", "Unstructured Data"],
              resources: [
                {
                  title: "Pinecone Guide to Chunking Strategies",
                  url: "https://www.pinecone.io/learn/chunking-strategies/",
                  type: "tutorial",
                  isFree: true,
                },
              ],
              tips: "Chunk size is a hyperparameter: test 256 vs 512 vs 1024 tokens with 10% overlap.",
              completed: false,
            },
            {
              id: "task-2-2",
              title: "Vector Databases & Hybrid Search",
              description: "Deploy and query Chroma/Pinecone. Implement reciprocal rank fusion (RRF) for keyword + semantic hybrid search.",
              estimatedHours: Math.round(totalCalculatedHours * 0.09),
              category: "concept",
              skillsCovered: ["Vector Databases", "ChromaDB", "Hybrid Search", "Reranking"],
              resources: [
                {
                  title: "Cohere Rerank Documentation",
                  url: "https://docs.cohere.com/docs/reranking",
                  type: "doc",
                  isFree: true,
                },
              ],
              tips: "Rerankers like Cohere Rerank significantly boost accuracy for top-3 retrieved passages.",
              completed: false,
            },
            {
              id: "task-2-3",
              title: "Build the Interactive RAG Assistant",
              description: "Combine vector store, streaming responses, citation verification, and error boundaries into a polished application.",
              estimatedHours: Math.round(totalCalculatedHours * 0.12),
              category: "project",
              skillsCovered: ["Full-Stack RAG", "Streaming", "Citation Tracking"],
              resources: [
                {
                  title: "LangChain RAG Tutorial",
                  url: "https://python.langchain.com/docs/use_cases/question_answering/",
                  type: "tutorial",
                  isFree: true,
                },
              ],
              tips: "Implement prompt defense against prompt injection in user-uploaded documents.",
              completed: false,
            },
          ],
        },
        {
          id: "phase-3",
          phaseNumber: 3,
          title: "Autonomous Agents & Tool Calling",
          description: "Build multi-step AI agents capable of web searching, SQL database execution, code interpretation, and structured output extraction.",
          estimatedWeeks: Math.max(1, Math.round(weeks * 0.25)),
          estimatedHours: Math.round(totalCalculatedHours * 0.25),
          milestoneProject: {
            title: "Autonomous Market Research Agent",
            description: "An agentic system that accepts a research topic, queries live APIs, executes statistical analysis, and generates an executive PDF summary.",
            deliverables: [
              "Agent workflow with state machine / LangGraph",
              "Tool definitions with strict JSON schema validation",
              "Guardrails and cycle limiters to prevent infinite loops",
            ],
            estimatedHours: Math.round(totalCalculatedHours * 0.1),
          },
          tasks: [
            {
              id: "task-3-1",
              title: "Function Calling & Structured Outputs",
              description: "Implement Anthropic/OpenAI function calling using Pydantic/Zod schemas to guarantee type-safe JSON returns.",
              estimatedHours: Math.round(totalCalculatedHours * 0.07),
              category: "concept",
              skillsCovered: ["Function Calling", "Structured Outputs", "JSON Schema"],
              resources: [
                {
                  title: "Anthropic Tool Use Guide",
                  url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use",
                  type: "doc",
                  isFree: true,
                },
              ],
              tips: "Always validate tool arguments with Pydantic before passing them to backend functions.",
              completed: false,
            },
            {
              id: "task-3-2",
              title: "Agentic Loops & State Machines",
              description: "Learn the ReAct pattern (Reasoning + Acting), LangGraph state graphs, human-in-the-loop approvals, and error recovery.",
              estimatedHours: Math.round(totalCalculatedHours * 0.08),
              category: "practice",
              skillsCovered: ["LangGraph", "ReAct Pattern", "State Machines"],
              resources: [
                {
                  title: "LangGraph Quickstart",
                  url: "https://langchain-ai.github.io/langgraph/",
                  type: "doc",
                  isFree: true,
                },
              ],
              tips: "Add maximum iteration safety caps to prevent runaway API spend.",
              completed: false,
            },
          ],
        },
        {
          id: "phase-4",
          phaseNumber: 4,
          title: "Evaluation, Observability & Production Deployment",
          description: "Establish automated evaluation frameworks (RAGAS/TruLens), tracing (Langfuse/Arize), Docker containerization, and cloud deployment.",
          estimatedWeeks: Math.max(1, Math.round(weeks * 0.15)),
          estimatedHours: Math.round(totalCalculatedHours * 0.15),
          milestoneProject: {
            title: "Production AI Service with CI/CD & Observability",
            description: "Deploy the full system with automated eval regression testing in GitHub Actions, OpenTelemetry tracing, and Docker Compose.",
            deliverables: [
              "Dockerized multi-container app (API + Vector DB + Frontend)",
              "Automated RAG eval script reporting faithfulness and context precision",
              "Live public deployment URL and architecture diagram",
            ],
            estimatedHours: Math.round(totalCalculatedHours * 0.08),
          },
          tasks: [
            {
              id: "task-4-1",
              title: "AI Tracing & LLMOps with Langfuse",
              description: "Instrument token tracking, latency metrics, user feedback thumbs up/down, and trace spans.",
              estimatedHours: Math.round(totalCalculatedHours * 0.04),
              category: "practice",
              skillsCovered: ["LLMOps", "Langfuse", "Telemetry"],
              resources: [
                {
                  title: "Langfuse Open Source Tracing",
                  url: "https://langfuse.com/docs",
                  type: "doc",
                  isFree: true,
                },
              ],
              tips: "Trace every LLM generation with user session IDs for auditing.",
              completed: false,
            },
            {
              id: "task-4-2",
              title: "Automated Evaluation Frameworks",
              description: "Measure Faithfulness, Answer Relevance, and Context Recall using RAGAS benchmark datasets.",
              estimatedHours: Math.round(totalCalculatedHours * 0.04),
              category: "reading",
              skillsCovered: ["RAGAS", "Model Evaluation", "Benchmarking"],
              resources: [
                {
                  title: "RAGAS Documentation",
                  url: "https://docs.ragas.io/",
                  type: "doc",
                  isFree: true,
                },
              ],
              tips: "Never deploy a prompt change without comparing automated eval scores against the baseline.",
              completed: false,
            },
          ],
        },
      ],
    };
  }

  // Default: Full-Stack Web Development & General Software Engineering
  return {
    id: `roadmap-dev-${Date.now()}`,
    careerGoal: request.careerGoal,
    title: `${request.careerGoal} Career Blueprint`,
    summary: `An engineering roadmap targeting ${request.careerGoal} for a ${request.experienceLevel} developer. Scheduled for ${request.hoursPerWeek} hours/week over ${durationFormatted} (${totalCalculatedHours} total hours), focusing on high-impact projects, clean architecture, and modern industry standards.`,
    experienceLevel: request.experienceLevel,
    hoursPerWeek: request.hoursPerWeek,
    targetDuration: durationFormatted,
    totalEstimatedHours: totalCalculatedHours,
    isFallback: true,
    generatedAt: new Date().toISOString(),
    careerInsights: {
      inDemandSkills: [
        "TypeScript & Modern JavaScript (ES2024)",
        "Next.js App Router & Server Components",
        "Tailwind CSS & Component Design Systems",
        "PostgreSQL, Prisma / Drizzle ORM",
        "REST & GraphQL API Design",
        "Authentication & Authorization (OAuth, JWT, NextAuth)",
        "Automated Testing (Vitest, React Testing Library, Playwright)",
        "Docker & CI/CD Pipelines",
      ],
      recommendedCertifications: [
        "AWS Certified Cloud Practitioner or Developer Associate",
        "Meta Front-End / Back-End Professional Certificate",
        "HashiCorp Certified: Terraform Associate",
      ],
      portfolioTips: [
        "Build full-stack applications with real relational data models and user authentication",
        "Implement optimistic UI updates, error boundaries, and empty/loading states",
        "Write comprehensive unit and end-to-end integration test suites with >80% coverage",
        "Host live production demos with clean GitHub READMEs and architectural diagrams",
      ],
      interviewPrepFocus: [
        "JavaScript event loop, closures, promises, and prototyping",
        "React component lifecycle, re-renders, hooks, and server vs client component boundaries",
        "Database indexing, normalization, ACID transactions, and N+1 query prevention",
        "System design for scalable web applications and caching layers (Redis, CDN)",
      ],
      potentialJobTitles: [
        "Full-Stack Software Engineer",
        "Frontend Engineer",
        "Backend Developer",
        "Web Application Engineer",
      ],
    },
    phases: [
      {
        id: "phase-1",
        phaseNumber: 1,
        title: "Modern Frontend Foundations & TypeScript Architecture",
        description: "Master type-safe UI engineering with React 19, TypeScript strict mode, responsive Tailwind styling, and accessibility.",
        estimatedWeeks: Math.max(1, Math.round(weeks * 0.25)),
        estimatedHours: Math.round(totalCalculatedHours * 0.25),
        milestoneProject: {
          title: "Accessible Real-time Dashboard with Data Visualizations",
          description: "Develop a responsive, WCAG 2.1 AA compliant dashboard with live filtering, keyboard navigation, and local storage state persistence.",
          deliverables: [
            "Strict TypeScript data models and Zod runtime schema validators",
            "Accessible UI with keyboard shortcuts and ARIA live regions",
            "Responsive layout tested on mobile, tablet, and widescreen",
          ],
          estimatedHours: Math.round(totalCalculatedHours * 0.08),
        },
        tasks: [
          {
            id: "task-1-1",
            title: "Advanced TypeScript & Type Narrowing",
            description: "Master generics, utility types, discriminated unions, and strict null checks to eliminate runtime bugs.",
            estimatedHours: Math.round(totalCalculatedHours * 0.06),
            category: "concept",
            skillsCovered: ["TypeScript", "Generics", "Type Guards"],
            resources: [
              {
                title: "Total TypeScript Tutorials by Matt Pocock",
                url: "https://www.totaltypescript.com/tutorials",
                type: "interactive",
                isFree: true,
              },
              {
                title: "TypeScript Handbook",
                url: "https://www.typescriptlang.org/docs/handbook/intro.html",
                type: "doc",
                isFree: true,
              },
            ],
            tips: "Practice using discriminated unions for UI state handling (idle, loading, success, error).",
            completed: false,
          },
          {
            id: "task-1-2",
            title: "React 19 Hooks, Server Components & State Patterns",
            description: "Understand Server vs Client Component boundaries, useActionState, useOptimistic, and state colocation.",
            estimatedHours: Math.round(totalCalculatedHours * 0.07),
            category: "practice",
            skillsCovered: ["React 19", "Server Components", "Custom Hooks"],
            resources: [
              {
                title: "React Official Documentation",
                url: "https://react.dev/",
                type: "doc",
                isFree: true,
              },
            ],
            tips: "Keep state as local as possible; avoid global state managers when URL state or component state suffices.",
            completed: false,
          },
          {
            id: "task-1-3",
            title: "WCAG 2.1 AA Accessible Component Design",
            description: "Implement semantic HTML landmarks, focus rings, ARIA roles, color contrast audits, and keyboard traps.",
            estimatedHours: Math.round(totalCalculatedHours * 0.06),
            category: "concept",
            skillsCovered: ["Accessibility", "WCAG 2.1 AA", "ARIA"],
            resources: [
              {
                title: "W3C WAI Web Accessibility Tutorials",
                url: "https://www.w3.org/WAI/tutorials/",
                type: "tutorial",
                isFree: true,
              },
            ],
            tips: "Test your interfaces exclusively with the keyboard (Tab, Enter, Space, Arrow keys) and a screen reader.",
            completed: false,
          },
        ],
      },
      {
        id: "phase-2",
        phaseNumber: 2,
        title: "Serverless Backends, APIs & Database Engineering",
        description: "Design relational database schemas with PostgreSQL, write type-safe queries with Drizzle/Prisma ORM, and build secure API route handlers.",
        estimatedWeeks: Math.max(1, Math.round(weeks * 0.3)),
        estimatedHours: Math.round(totalCalculatedHours * 0.3),
        milestoneProject: {
          title: "Multi-Tenant SaaS API with Authentication & Role-Based Access",
          description: "Build a robust backend service supporting JWT/OAuth authentication, role-based permissions, rate limiting, and database migrations.",
          deliverables: [
            "PostgreSQL schema with foreign keys, indexes, and automated migrations",
            "Next.js App Router Route Handlers with Zod request validation",
            "Unit and integration tests with mock database fixtures",
          ],
          estimatedHours: Math.round(totalCalculatedHours * 0.1),
        },
        tasks: [
          {
            id: "task-2-1",
            title: "Relational Schema Design & SQL Mastery",
            description: "Learn entity-relationship modeling, composite indexes, foreign key constraints, transactions, and ACID principles.",
            estimatedHours: Math.round(totalCalculatedHours * 0.07),
            category: "concept",
            skillsCovered: ["PostgreSQL", "SQL", "Database Design"],
            resources: [
              {
                title: "PostgreSQL Tutorial",
                url: "https://www.postgresqltutorial.com/",
                type: "tutorial",
                isFree: true,
              },
            ],
            tips: "Always run EXPLAIN ANALYZE on complex queries to inspect query execution plans and index scans.",
            completed: false,
          },
          {
            id: "task-2-2",
            title: "Type-Safe ORMs & Database Migrations",
            description: "Model tables, relations, and type-safe query builders using Drizzle ORM or Prisma with automated migration pipelines.",
            estimatedHours: Math.round(totalCalculatedHours * 0.07),
            category: "practice",
            skillsCovered: ["Drizzle ORM", "Prisma", "Database Migrations"],
            resources: [
              {
                title: "Drizzle ORM Documentation",
                url: "https://orm.drizzle.team/docs/overview",
                type: "doc",
                isFree: true,
              },
            ],
            tips: "Prefer lightweight query builders like Drizzle for serverless and edge environments.",
            completed: false,
          },
          {
            id: "task-2-3",
            title: "Secure Authentication & Authorization",
            description: "Implement session management, secure HTTP-only cookies, OAuth 2.0 social logins, and role-based access control (RBAC).",
            estimatedHours: Math.round(totalCalculatedHours * 0.06),
            category: "project",
            skillsCovered: ["Auth.js / NextAuth", "OAuth 2.0", "Security"],
            resources: [
              {
                title: "Auth.js Guide",
                url: "https://authjs.dev/",
                type: "doc",
                isFree: true,
              },
            ],
            tips: "Never store plaintext tokens in localStorage; use secure HTTP-only SameSite cookies.",
            completed: false,
          },
        ],
      },
      {
        id: "phase-3",
        phaseNumber: 3,
        title: "Full-Stack Integration, Testing & Performance",
        description: "Integrate client and server layers, write automated test suites (Vitest, Playwright), optimize Core Web Vitals, and implement caching.",
        estimatedWeeks: Math.max(1, Math.round(weeks * 0.25)),
        estimatedHours: Math.round(totalCalculatedHours * 0.25),
        milestoneProject: {
          title: "Full-Stack Collaborative Productivity Application",
          description: "A complete production application with optimistic mutations, real-time sync, caching, and comprehensive test coverage.",
          deliverables: [
            "Full-stack Next.js app with server actions and revalidation tags",
            "Vitest unit tests and Playwright E2E user journey tests",
            "Lighthouse 95+ score across Performance, Accessibility, and Best Practices",
          ],
          estimatedHours: Math.round(totalCalculatedHours * 0.09),
        },
        tasks: [
          {
            id: "task-3-1",
            title: "Automated Testing with Vitest & React Testing Library",
            description: "Write unit and component tests verifying form inputs, error handling, accessible rendering, and state updates.",
            estimatedHours: Math.round(totalCalculatedHours * 0.06),
            category: "practice",
            skillsCovered: ["Vitest", "React Testing Library", "Mocking"],
            resources: [
              {
                title: "Vitest Official Guide",
                url: "https://vitest.dev/guide/",
                type: "doc",
                isFree: true,
              },
            ],
            tips: "Test user interactions from the perspective of how a user or screen reader interacts with the DOM.",
            completed: false,
          },
          {
            id: "task-3-2",
            title: "End-to-End Testing with Playwright",
            description: "Create automated browser tests covering critical conversion funnels, edge case errors, and axe-core accessibility checks.",
            estimatedHours: Math.round(totalCalculatedHours * 0.06),
            category: "project",
            skillsCovered: ["Playwright", "E2E Testing", "Axe Accessibility"],
            resources: [
              {
                title: "Playwright Documentation",
                url: "https://playwright.dev/docs/intro",
                type: "doc",
                isFree: true,
              },
            ],
            tips: "Run Playwright tests headlessly in CI to catch regression errors before merging.",
            completed: false,
          },
        ],
      },
      {
        id: "phase-4",
        phaseNumber: 4,
        title: "DevOps, CI/CD & Production Deployment",
        description: "Configure GitHub Actions CI/CD pipelines, Docker containerization, custom domain DNS, SSL/TLS, and telemetry monitoring.",
        estimatedWeeks: Math.max(1, Math.round(weeks * 0.2)),
        estimatedHours: Math.round(totalCalculatedHours * 0.2),
        milestoneProject: {
          title: "Production Deployment Portfolio & Case Study",
          description: "Deploy your applications to production with monitoring, environment secrets management, and a technical case study.",
          deliverables: [
            "GitHub Actions pipeline running linter, type-check, and automated tests on pull requests",
            "Production deployment on Vercel / AWS with custom domain and analytics",
            "Detailed engineering README and architecture documentation",
          ],
          estimatedHours: Math.round(totalCalculatedHours * 0.08),
        },
        tasks: [
          {
            id: "task-4-1",
            title: "GitHub Actions CI/CD Pipeline Automation",
            description: "Set up workflow triggers for linting, TypeScript compilation, unit test suites, and automated preview deployments.",
            estimatedHours: Math.round(totalCalculatedHours * 0.05),
            category: "practice",
            skillsCovered: ["GitHub Actions", "CI/CD", "DevOps"],
            resources: [
              {
                title: "GitHub Actions Documentation",
                url: "https://docs.github.com/en/actions",
                type: "doc",
                isFree: true,
              },
            ],
            tips: "Cache npm node_modules in your workflow YAML to speed up CI runs.",
            completed: false,
          },
          {
            id: "task-4-2",
            title: "Production Pre-Flight & Observability",
            description: "Configure Sentry error tracking, OpenGraph meta tags, SEO sitemaps, robots.txt, and security headers (CSP, HSTS).",
            estimatedHours: Math.round(totalCalculatedHours * 0.05),
            category: "reading",
            skillsCovered: ["Observability", "Web Security", "SEO"],
            resources: [
              {
                title: "Next.js Deployment Documentation",
                url: "https://nextjs.org/docs/app/building-your-application/deploying",
                type: "doc",
                isFree: true,
              },
            ],
            tips: "Check your site with securityheaders.com and Lighthouse before sharing with recruiters.",
            completed: false,
          },
        ],
      },
    ],
  };
}
