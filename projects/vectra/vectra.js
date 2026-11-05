/* Vectra: card and detail-page content in both languages.
   This folder holds everything for the project: index.html (page), vectra.js (content),
   the thumbnail, and any case-study Markdown and images. */
Portfolio.project("vectra", {
  en: {
    "title": "Vectra",
    "description": "Secure local AI agent system for your own PC: run your own models fully offline, or connect an API when you choose.",
    "image": "thumbnail.png",
    "image_alt": "Vectra logo",
    "image_class": "project-image-logo",
    "url": "https://github.com/Laudarisd/vectra",
    "subtitle": "A secure AI agent system that runs on your own PC, inside VS Code and in the browser. You choose the model: local GGUF or Ollama models keep every file and prompt on the machine, while an API provider (OpenAI, Anthropic, Gemini) can be connected when you accept that your data is sent to their service. Either way the agent works through typed, searchable tools and every change needs your approval.",
    "links": [
      {
        "label": "VS Code Marketplace",
        "url": "https://marketplace.visualstudio.com/items?itemName=laudarisd.vectra-ai"
      },
      {
        "label": "GitHub",
        "url": "https://github.com/Laudarisd/vectra"
      }
    ],
    "status": "completed",
    "period": "v1.2.2 on VS Code Marketplace",
    "role": "Independent developer (design, implementation, release)",
    "context": "Independently developed product",
    "tags": [
      "TypeScript",
      "Node.js",
      "VS Code Extension",
      "llama.cpp / GGUF",
      "Ollama",
      "OpenAI / Anthropic / Gemini",
      "Agent Orchestration",
      "Tool Calling",
      "SSE Streaming"
    ]
  },
  kr: {
    "title": "Vectra",
    "description": "내 PC에서 돌아가는 안전한 로컬 AI Agent 시스템이에요. 내 모델을 완전히 오프라인으로 쓰거나, 원할 때만 API를 연결해요.",
    "image": "thumbnail.png",
    "image_alt": "Vectra 로고",
    "image_class": "project-image-logo",
    "url": "https://github.com/Laudarisd/vectra",
    "subtitle": "내 PC에서 VS Code와 브라우저 안에서 동작하는 안전한 AI Agent 시스템이에요. 모델은 직접 고를 수 있어요. 로컬 GGUF·Ollama 모델은 모든 파일과 프롬프트를 내 컴퓨터 안에 두고, API Provider(OpenAI, Anthropic, Gemini)는 데이터가 그 서비스로 전송된다는 점을 감안해 선택적으로 연결해요. 어느 쪽이든 Agent는 타입이 정의된 검색 가능한 Tool로만 일하고, 모든 변경은 사용자의 승인을 거쳐요.",
    "links": [
      {
        "label": "VS Code Marketplace",
        "url": "https://marketplace.visualstudio.com/items?itemName=laudarisd.vectra-ai"
      },
      {
        "label": "GitHub",
        "url": "https://github.com/Laudarisd/vectra"
      }
    ],
    "status": "completed",
    "period": "VS Code Marketplace v1.2.2",
    "role": "개인 개발 (설계, 구현, 배포)",
    "context": "독립적으로 개발한 제품",
    "tags": [
      "TypeScript",
      "Node.js",
      "VS Code Extension",
      "llama.cpp / GGUF",
      "Ollama",
      "OpenAI / Anthropic / Gemini",
      "Agent Orchestration",
      "Tool Calling",
      "SSE Streaming"
    ]
  }
});
