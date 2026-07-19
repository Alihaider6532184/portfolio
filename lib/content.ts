// Single source of truth for page content. Edit copy here, not in components.

export const profile = {
  name: "Ali Haider",
  role: "AI & Full-Stack Developer",
  // Punchy value statement for the hero.
  value:
    "I build retrieval systems, autonomous agents, and the full-stack products they live inside — shipped end to end.",
  location: "Pakistan · Remote",
  email: "top043126@gmail.com",
  whatsapp: {
    display: "+92 329 6910150",
    // wa.me needs the number in international format with no symbols.
    href: "https://wa.me/923296910150",
  },
  github: {
    display: "github.com/Alihaider6532184",
    href: "https://github.com/Alihaider6532184",
  },
  linkedin: {
    display: "linkedin.com/in/alihaider65",
    href: "https://www.linkedin.com/in/alihaider65",
  },
};

export const about = {
  lead: "I engineer AI systems that hold up in production.",
  body: [
    "My work sits where machine learning meets shipping software: multimodal RAG pipelines that answer from real documents, voice-driven agents that respond in real time, and the full-stack applications that put them in front of users.",
    "I come from an AI/ML engineering background, so I care about the parts that don't demo well — retrieval quality, latency budgets, streaming transports, and the boundary between a model and a product people actually trust.",
  ],
  // Quiet supporting facts rendered as a mono spec strip.
  facts: [
    { label: "Focus", value: "RAG · Agents · Full-Stack" },
    { label: "Discipline", value: "AI/ML Engineering" },
    { label: "Availability", value: "Open to work" },
  ],
};

export type Project = {
  index: string;
  name: string;
  tagline: string;
  problem: string;
  role: string;
  outcome: string;
  stack: string[];
  // Short label describing the ideal media for the placeholder frame.
  media: string;
};

export const projects: Project[] = [
  {
    index: "01",
    name: "Patho-Assist AI",
    tagline: "Multimodal RAG chatbot for medical Q&A",
    problem:
      "Clinicians and students needed grounded answers to pathology questions that reason over both text and medical imagery — not the confident hallucinations a raw LLM produces.",
    role:
      "Designed the multimodal retrieval pipeline end to end: image + text embedding, vector store, prompt construction, and the answer-with-citations layer.",
    outcome:
      "A chatbot that retrieves from a curated medical corpus and answers from source material, keeping responses traceable back to the documents they came from.",
    stack: ["PaliGemma", "ChromaDB", "Multimodal RAG", "Python", "FastAPI"],
    media: "Chat transcript — image query → cited answer",
  },
  {
    index: "02",
    name: "3D AI Avatar Chatbot",
    tagline: "Real-time voice agent with a lip-synced 3D face",
    problem:
      "Text chat feels flat for conversational products. The goal was a spoken agent you talk to and that talks back — with a face whose mouth actually matches the words, at conversational latency.",
    role:
      "Built the full real-time voice loop and streaming transport connecting speech-to-text, reasoning, and speech-to-face.",
    outcome:
      "Speak into the mic and a 3D avatar answers out loud with synchronized lip movement, streamed over WebSocket for low perceived latency.",
    stack: [
      "Groq Whisper",
      "Gemini",
      "Azure TTS",
      "FastAPI",
      "WebSocket",
      "TalkingHead",
    ],
    media: "Loop — spoken question → avatar replies, lips in sync",
  },
  {
    index: "03",
    name: "DentAssist AI",
    tagline: "B2B SaaS chatbot for dental clinics",
    problem:
      "Dental clinics lose bookings to unanswered questions after hours and spend front-desk time on the same repeated queries about services, hours, and appointments.",
    role:
      "Shipped the product as a multi-tenant SaaS: per-clinic knowledge, embeddable widget, and an admin surface clinics configure themselves.",
    outcome:
      "A deployable assistant clinics drop onto their site to answer patient questions and capture appointment intent around the clock.",
    stack: ["RAG", "Next.js", "FastAPI", "PostgreSQL", "Multi-tenant SaaS"],
    media: "Embedded widget answering a patient on a clinic site",
  },
];

export type SkillGroup = {
  index: string;
  category: string;
  note: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    index: "A",
    category: "AI / ML",
    note: "Where most of my work lives.",
    items: [
      "Retrieval-Augmented Generation",
      "Multimodal RAG",
      "AI Agents",
      "LLM Orchestration",
      "Vector Databases",
      "Prompt Engineering",
      "PaliGemma / Gemini",
      "Whisper STT",
      "Embeddings",
    ],
  },
  {
    index: "B",
    category: "Backend",
    note: "APIs and real-time transports.",
    items: [
      "Python",
      "FastAPI",
      "WebSocket",
      "REST APIs",
      "PostgreSQL",
      "ChromaDB",
      "Async / Streaming",
    ],
  },
  {
    index: "C",
    category: "Frontend",
    note: "The surface users actually touch.",
    items: [
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "Framer Motion",
      "Responsive UI",
    ],
  },
  {
    index: "D",
    category: "DevOps / Cloud",
    note: "Getting it shipped and keeping it up.",
    items: ["Docker", "Vercel", "Azure", "Git / GitHub", "CI/CD", "Linux"],
  },
];

export const navLinks = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];
