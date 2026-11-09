# VECTRA — Local AI Agent Orchestra

### A secure local AI agent system for your own PC, in VS Code and the browser

You choose the model: a local model keeps every file and prompt on your machine, or an API provider when you accept that your data is sent to their service.

**Local models · Cloud providers · Tool orchestration · Multi-agent workflows · Human approval**

<div class="fact-grid">
<div class="fact"><span class="fact-label">Surfaces</span><span class="fact-value">VS Code extension · web workspace</span></div>
<div class="fact"><span class="fact-label">Models</span><span class="fact-value">Local GGUF · Ollama · OpenAI-compatible · cloud</span></div>
<div class="fact"><span class="fact-label">Agents</span><span class="fact-value">Planner · researcher · coder · tester · reviewer · security · docs</span></div>
<div class="fact"><span class="fact-label">Safety</span><span class="fact-value">Risk-scoped tools · plan approval · diff review</span></div>
<div class="fact"><span class="fact-label">Stack</span><span class="fact-value">TypeScript · Node.js · llama.cpp · SSE</span></div>
<div class="fact"><span class="fact-label">Release</span><span class="fact-value">v1.2.2 on the VS Code Marketplace</span></div>
</div>

<figure class="figure-placeholder">
<div class="placeholder-box"><span>Image</span></div>
<figcaption>The Vectra sidebar in VS Code: a plan awaiting approval, with the tool activity log beneath it.</figcaption>
</figure>

---

## 1. Project overview

<div class="callout callout-problem">
<h4>Problems this project addresses</h4>
<ul>
<li>Capable AI agents usually require sending code and documents to a cloud provider; developers lose privacy, control, and the choice of model.</li>
<li>A model with unrestricted access to the host is a risk: every edit, command, and network call needs a boundary and a review.</li>
<li>Large tool collections flood a small local model's context and reduce accuracy.</li>
<li>The same agent concepts have to work in two very different trust environments: an editor with a filesystem and a browser.</li>
</ul>
</div>

Vectra is a full-stack AI agent platform that turns a language model into a practical development and research assistant. It runs as both a **VS Code extension** and a **web application**, while sharing model-runtime, agent, tool, document, and orchestration concepts across the monorepo.

The system can discover and run local GGUF models, connect to Ollama and OpenAI-compatible servers, or use cloud providers. A model does not receive unrestricted access to the host. Instead, it works through typed, searchable tools with workspace boundaries, risk classifications, plan approval, edit review, command confirmation, and observable lifecycle events.

```text
vectra/
├── apps/
│   ├── vscode-extension/   # Coding agent, editor context, guarded workspace tools
│   └── web/                # Browser chat, research, documents, OCR and artifacts
├── packages/
│   ├── agent-core/         # Shared sessions, Deep Agents, contracts and subagents
│   └── local-runtime/      # GGUF/Ollama discovery and llama.cpp runtime profiles
└── docs/                   # Architecture and product documentation
```

## 2. Purpose of development

<div class="callout callout-goal">
<h4>Goals</h4>
<ul>
<li>Run useful AI workflows on local hardware as well as cloud infrastructure.</li>
<li>Support multiple model providers behind one consistent interface.</li>
<li>Convert model intent into safe, reviewable actions.</li>
<li>Keep large tool collections discoverable without filling the model context.</li>
<li>Coordinate specialised agents for coding, research, review, testing, security, and documentation.</li>
<li>Offer the same core experience inside VS Code and a standalone browser workspace.</li>
<li>Keep every long-running operation cancellable, observable, and bounded.</li>
</ul>
</div>

Vectra was developed to make capable AI agents usable without forcing developers to surrender privacy, control, or choice of model. Its goals are to:

- run useful AI workflows on local hardware as well as cloud infrastructure;
- support multiple model providers behind one consistent interface;
- convert model intent into safe, reviewable actions;
- keep large tool collections discoverable without filling the model context;
- coordinate specialized agents for coding, research, review, testing, security, and documentation;
- offer the same core experience inside VS Code and a standalone browser workspace;
- keep every long-running operation cancellable, observable, and bounded.

```ts
// One session owns the lifecycle state for a user request.
const session = new AgentSession({ messages: history });

const answer = await session.run(async ({ runId, signal, events }) => {
  events.emit({ type: 'context.collecting', runId });
  return controller.run({ task, mode: 'agent', signal });
}, abortController.signal);
```

## 3. Skills and tools

| Area              | Skills and technologies                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| Languages         | TypeScript, JavaScript, HTML, CSS, Node.js                                                             |
| AI runtimes       | llama.cpp, GGUF, Ollama, OpenAI-compatible APIs                                                        |
| Model providers   | Local llama.cpp, Ollama, OpenAI, Anthropic, Gemini, self-hosted endpoints                              |
| Agent engineering | tool calling, structured output, iterative loops, subagents, context budgeting, streaming              |
| VS Code           | Extension API, webviews, workspace context, diagnostics, symbols, diff review                          |
| Web               | HTTP/SSE server, browser UI, local persistence, downloadable artifacts                                 |
| Documents         | PDF, DOCX, PPTX, XLSX, RTF, OCR, image and vision processing                                           |
| Safety            | workspace trust, path validation, sensitive-file policy, approvals, risk-scoped tools, SSRF protection |
| Developer tooling | npm workspaces, esbuild, TypeScript, Node test runner, Git                                             |

```ts
type ToolRisk = 'read' | 'write' | 'execute' | 'network' | 'coordination';

interface VectraToolDefinition {
  name: string;
  displayName: string;
  description: string;
  risk: ToolRisk;
  aliases?: readonly string[];
}
```

## 4. Model search and discovery

<div class="callout callout-problem">
<h4>Problems this section addresses</h4>
<ul>
<li>Local models live in many places: GGUF files on disk, Ollama, LM Studio, Jan, llama.cpp, vLLM servers, and remote hubs.</li>
<li>Scanning a whole filesystem is slow and unsafe; discovery has to be tiered, bounded in time, and cancellable.</li>
</ul>
</div>

Vectra searches for models at three levels. It performs bounded filesystem scans for `.gguf` files, queries Ollama for installed models, and probes known local OpenAI-compatible runtimes such as LM Studio, Jan, GPT4All, KoboldCpp, LocalAI, vLLM, and Msty. The web product also provides curated recommendations and keyless Hugging Face GGUF search.

Filesystem discovery is deliberately tiered and time-bounded. User-selected folders are searched first, common model locations second, and broader roots last. Directory-count, depth, wall-clock, cancellation, and per-directory timeout limits prevent an expensive machine-wide crawl.

```ts
const LOCAL_RUNTIME_TARGETS = [
  { name: 'Ollama', baseUrl: 'http://127.0.0.1:11434/v1', discoveryUrl: 'http://127.0.0.1:11434/api/tags' },
  { name: 'LM Studio', baseUrl: 'http://127.0.0.1:1234/v1' },
  { name: 'Jan', baseUrl: 'http://127.0.0.1:1337/v1' },
  { name: 'llama.cpp / LocalAI', baseUrl: 'http://127.0.0.1:8080/v1' },
  { name: 'vLLM', baseUrl: 'http://127.0.0.1:8000/v1' }
];

const inventory = await discoverInstalledModels({
  query: 'qwen',
  roots: selectedFolders,
  timeBudgetMs: 12_000,
  signal
});
```

```js
// Remote GGUF search used by the web workspace.
export async function searchHuggingFace(query) {
  const url = 'https://huggingface.co/api/models?' + new URLSearchParams({
    search: query,
    filter: 'gguf',
    sort: 'downloads',
    limit: '20'
  });
  const models = await fetchJsonWithTimeout(url);
  return models.map(({ id, downloads }) => ({ id, label: id, downloads }));
}
```

<figure class="figure-placeholder">
<div class="placeholder-box"><span>Image</span></div>
<figcaption>Model discovery: local GGUF files, Ollama models, and local servers found in one inventory, with runtime recommendations.</figcaption>
</figure>

## 5. Model management and selection

<div class="callout callout-problem">
<h4>Problems this section addresses</h4>
<ul>
<li>Each provider has its own authentication and transport; the agent must not know the difference.</li>
<li>A local model only runs well when context size, threads, and GPU offload match the machine's RAM, VRAM, and CPU.</li>
</ul>
</div>

The provider manager isolates the agent from provider-specific authentication and transport details. Configuration selects the backend; the manager creates the correct adapter, validates credentials, lists available models, and tests connectivity. Local endpoints receive longer timeouts because model loading, prompt ingestion, and CPU inference may take substantially longer than cloud inference.

```ts
async function selectProvider(config: AgentConfiguration): Promise<TextProvider> {
  switch (config.provider) {
    case 'llamaCpp':
      return new LlamaCppProvider(`http://127.0.0.1:${config.llamaCppPort}/v1`);
    case 'ollama':
      return new OllamaProvider(config.ollamaBaseUrl, config.ollamaContextSize);
    case 'openai':
      return new OpenAIProvider(await credentials.require('openai'));
    case 'anthropic':
      return new AnthropicProvider(await credentials.require('anthropic'));
    case 'gemini':
      return new GeminiProvider(await credentials.require('gemini'));
    case 'openaiCompatible':
      return new OpenAICompatibleProvider(config.openaiCompatibleBaseUrl);
  }
}
```

Model recommendations consider model size, quantization, available RAM/VRAM, CPU/GPU mode, and whether vision is required. For local llama.cpp execution, Vectra calculates context size, GPU layers, threads, batch size, KV-cache settings, and prompt caching before launching `llama-server`.

```ts
const profile = buildLlamaRuntimeProfile({
  modelSizeBytes,
  availableRamMiB,
  availableVramMiB,
  logicalCpuCount,
  physicalCoreCount,
  deviceMode: 'auto',
  requestedContextSize: 16_384
});

await llamaRuntime.start({ modelPath, ...profile });
```

## 6. LLM call

<div class="callout callout-problem">
<h4>Problems this section addresses</h4>
<ul>
<li>Orchestration code must send the same messages, attachments, cancellation signal, and streaming callbacks to every backend.</li>
<li>Streamed tokens have to reach the UI while structured tool traffic stays separate.</li>
</ul>
</div>

Every backend conforms to a common text-provider contract. This allows orchestration code to send the same messages, model settings, attachments, cancellation signal, and optional stream callback to local or cloud models.

```ts
const provider = await providers.getProvider();

const response = await provider.complete({
  model: config.model,
  system: buildSystemPrompt(mode, workspaceContext),
  messages: conversation,
  attachments: mediaAttachments,
  temperature: 0.2,
  signal,
  onDelta: token => events.emit({ type: 'ui.delta', runId, delta: token })
});
```

## 7. Tool collection

<div class="callout callout-problem">
<h4>Problems this section addresses</h4>
<ul>
<li>Tool descriptions scattered through prompts drift out of sync and cannot be searched.</li>
<li>Every tool needs a risk class so policy and subagents can reason about what it may do.</li>
</ul>
</div>

Vectra maintains a canonical catalog rather than scattering tool descriptions through prompts. The extension collection covers workspace summaries, files, documents, search, diagnostics, language symbols, project skills, Git, reviewed edits, path operations, commands, tests, plans, task lists, web research, and delegation.

```ts
export const VECTRA_TOOL_DEFINITIONS = [
  tool('read_file', 'Read File', 'Read a line-numbered text window.', 'read'),
  tool('search_text', 'Search Workspace', 'Search bounded workspace files.', 'read'),
  tool('get_diagnostics', 'Diagnostics', 'Read editor errors and warnings.', 'read'),
  tool('propose_file', 'Propose Change', 'Prepare a file for review.', 'write'),
  tool('run_tests', 'Run Tests', 'Request approval to run tests.', 'execute'),
  tool('web_search', 'Web Search', 'Search the public web safely.', 'network'),
  tool('propose_plan', 'Propose Plan', 'Request plan approval.', 'coordination'),
  tool('delegate_task', 'Delegate', 'Assign bounded exploration.', 'coordination')
] as const;
```

## 8. Tool search, call, and ordering

<div class="callout callout-problem">
<h4>Problems this section addresses</h4>
<ul>
<li>Large tool schemas consume context and reduce accuracy on small local models.</li>
<li>Writes and execution must never run before inspection, a plan, and an approval.</li>
</ul>
</div>

Large tool schemas consume context and can reduce accuracy on small local models. Vectra solves this with two meta-tools: `vectra_search_tools` searches lightweight canonical metadata by intent, and `vectra_invoke_tool` calls the exact selected capability. The allowlist, risk rules, approvals, and host executor remain authoritative.

```ts
// 1. Discover only the capabilities relevant to the current intent.
const matches = searchToolCatalog(toolDefinitions, 'inspect errors and fix file', 8);

// 2. Let the model choose an exact returned name.
const selected = matches.find(tool => tool.name === 'get_diagnostics');

// 3. Execute through the guarded host boundary.
const observation = await executeHostTool(selected!.name, {
  path: 'src/app.ts'
}, runContext);
```

The normal coding order is **inspect → plan → approve → mutate → verify → report**. Read-only inspection can happen immediately. Writes and execution pass through plan/review or confirmation boundaries, and verification happens before the agent claims completion.

```ts
const orderedActions = [
  ['workspace_summary', {}],
  ['search_text', { query: 'createServer' }],
  ['read_file', { path: 'src/server.ts' }],
  ['propose_plan', { steps: ['Patch server', 'Run tests'] }],
  ['propose_file', { path: 'src/server.ts', content: updatedSource }],
  ['run_tests', { command: 'npm test' }],
  ['get_diagnostics', { path: 'src/server.ts' }]
] as const;
```

## 9. Tool orchestra and safety boundary

<div class="callout callout-problem">
<h4>Problems this section addresses</h4>
<ul>
<li>Model decisions have to be connected to concrete host capabilities without bypassing policy.</li>
<li>Human approval must be real runtime state, not a convention the model is asked to respect.</li>
<li>The UI needs start, completion, and failure events for every tool call.</li>
</ul>
</div>

The orchestrator connects model decisions to concrete host capabilities. Tools emit start, completion, and failure events for the UI. The executor applies workspace restrictions and separates low-risk observations from mutations, command execution, and network access.

```ts
async function routeTool(action: AgentAction, context: AgentRunContext) {
  context.events.emit({ type: 'tool.started', tool: action.type });
  try {
    await policy.authorize(action, context);
    const result = await handlers.get(action.type)!(action, context);
    context.events.emit({ type: 'tool.completed', tool: action.type, result });
    return result;
  } catch (error) {
    context.events.emit({ type: 'tool.failed', tool: action.type, error: String(error) });
    throw error;
  }
}
```

```ts
// Human-in-the-loop approval is part of session state, not prompt convention.
const plan = plans.propose([
  'Inspect the affected implementation',
  'Prepare reviewed edits',
  'Run the focused test suite'
]);

const decision = await plans.waitForDecision(plan.id, signal);
if (decision !== 'approved') throw new Error('Plan rejected by user.');
```

<figure class="figure-placeholder">
<div class="placeholder-box"><span>Image</span></div>
<figcaption>A proposed file change shown as a reviewable diff, with approve and reject controls.</figcaption>
</figure>

## 10. Agent skills

<div class="callout callout-problem">
<h4>Problems this section addresses</h4>
<ul>
<li>Project-specific instructions belong to the project, not to the extension.</li>
<li>Loading every skill into the prompt wastes context; instructions should be disclosed only when a task needs them.</li>
</ul>
</div>

Vectra supports project-owned skills at `.vectra/skills/<name>/SKILL.md`. The agent first lists short metadata, then reads full instructions only when a task needs them. Skills are instructions—not executable privilege—and cannot bypass tool policy or approvals.

```md
---
name: api-reviewer
description: Review API changes for compatibility and security.
---

# API Reviewer

1. Read the public contract and its tests.
2. Identify breaking response or schema changes.
3. Check authentication, validation, and error disclosure.
4. Report evidence with file paths and line numbers.
```

```ts
// Progressive disclosure keeps unrelated instructions out of the prompt.
const availableSkills = await skillRegistry.list();
const selectedSkill = await skillRegistry.read('api-reviewer');

messages.push({
  role: 'system',
  content: selectedSkill
});
```

## 11. Specialized agents and agent tool order

<div class="callout callout-problem">
<h4>Problems this section addresses</h4>
<ul>
<li>One general agent does planning, research, coding, testing, review, security, and documentation poorly at once.</li>
<li>Delegated work must not inherit capabilities it does not need.</li>
</ul>
</div>

The orchestra includes specialized roles for planning, research, review, coding, testing, security, and documentation. Each subagent receives only the risk-scoped subset of tools appropriate to its role. Delegated work is bounded, read-only where appropriate, isolated from the parent conversation, and returned as a focused observation.

```ts
const pipeline = [
  { agent: 'planner', task: 'Break the feature into verifiable steps' },
  { agent: 'researcher', task: 'Locate the relevant modules and constraints' },
  { agent: 'coder', task: 'Prepare the implementation through reviewed tools' },
  { agent: 'tester', task: 'Run focused tests and analyze failures' },
  { agent: 'reviewer', task: 'Review the diff for regressions' },
  { agent: 'security', task: 'Check trust boundaries and unsafe inputs' },
  { agent: 'documentation', task: 'Update user-facing documentation' }
];

for (const stage of pipeline) {
  observations.push(await delegate(stage.agent, stage.task, { signal }));
}
```

```ts
const subagents = buildVectraSubagentSpecs(
  hostToolDefinitions,
  guardedHostExecutor,
  provider.supportsNativeToolCalls
);

// Each role is built from its own allowed risk classes.
const toolsForRole = definitions.filter(tool =>
  role.allowedRisk.includes(tool.risk) && tool.name !== 'delegate_task'
);
```

## 12. Agent loop

<div class="callout callout-problem">
<h4>Problems this section addresses</h4>
<ul>
<li>An unbounded loop can run forever or declare completion without evidence.</li>
<li>Models with and without native tool calling need the same loop behaviour.</li>
</ul>
</div>

The classic agent runtime uses a bounded observe–reason–act loop. On every step it builds current context, calls the model, parses a structured envelope, executes allowed actions, appends observations, and continues until the model marks the task complete or the step budget is exhausted. Abort signals, duplicate-call protection, delegation limits, and completion validation prevent uncontrolled loops.

```ts
for (let step = 1; step <= maxSteps; step++) {
  const raw = await provider.complete({
    system: buildSystemPrompt(mode, workspaceContext),
    messages: buildLoopMessages(task, history, observations),
    signal
  });

  const turn = parseAgentEnvelope(raw);
  if (turn.done && completionIsVerified(turn, observations)) {
    return turn.message;
  }

  for (const action of orderActions(turn.actions)) {
    const result = await toolRouter.execute(action, { runId, signal });
    observations.push(formatObservation(action, result));
  }
}

throw new Error('Agent step budget exhausted before verified completion.');
```

Native tool-capable models can use the Deep Agents runtime. Models without reliable native tool support use the discovery/invocation bridge and structured parsing fallback, preserving the same guarded host tools.

```ts
const runtime = new VectraDeepAgentRuntime({
  provider,
  tools: provider.supportsNativeToolCalls ? directTools : discoveryTools,
  subagents,
  maxSteps: 24
});

const result = await runtime.run({
  task,
  messages: history,
  signal,
  onEvent: event => session.events.emit(event)
});
```

## 13. VS Code extension

<div class="callout callout-problem">
<h4>Problems this section addresses</h4>
<ul>
<li>The agent needs editor context (selection, diagnostics, symbols, open files, project instructions) without reading the whole workspace.</li>
<li>Sensitive paths, untrusted workspaces, and arbitrary commands have to be blocked by default.</li>
</ul>
</div>

The extension collects active editor content, selection, cursor location, diagnostics, open files, workspace overview, and project instructions. It exposes language-aware navigation, Git inspection, reviewed diffs, filesystem operations, and approved commands. Sensitive paths are blocked by default, every path is normalized against the open workspace, and untrusted workspaces cannot load skills or launch local runtimes.

```ts
const context = await contextCollector.collect();

const workspaceContext = {
  workspaceFolders: context.workspaceFolders,
  activeFile: context.activeFile,
  selectionText: context.selectionText,
  cursorLine: context.cursorLine,
  diagnostics: context.diagnostics,
  projectInstructions: context.projectInstructions
};

await controller.run({ task: userPrompt, mode: 'agent', workspaceContext, signal });
```

<figure class="figure-placeholder">
<div class="placeholder-box"><span>Image</span></div>
<figcaption>The extension in VS Code: editor context on the left, the agent conversation and tool activity on the right.</figcaption>
</figure>

## 14. Web-based AI workspace

<div class="callout callout-problem">
<h4>Problems this section addresses</h4>
<ul>
<li>A browser has no filesystem or shell; the same agent must work only with uploads and generated artifacts.</li>
<li>Chat, documents, OCR, research, images, and charts need one streaming contract for local and cloud models alike.</li>
</ul>
</div>

Vectra Web brings the same agent concepts to a standalone browser interface. It supports local and cloud models, chat history, token streaming over Server-Sent Events, document uploads, OCR, research, image inspection, visualizations, and generated files. Its safety boundary differs from the extension: the browser agent can work with uploaded files and generated artifacts, but receives no arbitrary server filesystem or shell access.

```js
// One streaming contract is shared by local and cloud-backed chat.
res.writeHead(200, {
  'Content-Type': 'text/event-stream; charset=utf-8',
  'Cache-Control': 'no-store',
  Connection: 'keep-alive'
});

events.subscribe(event => {
  res.write(`data: ${JSON.stringify(event)}\n\n`);
});

const generated = await webSession.run(context =>
  webAgent.run({ messages, attachments, signal: context.signal })
);
```

```ts
export const WEB_TOOL_DEFINITIONS = [
  ...ATTACHMENT_TOOL_DEFINITIONS,
  DOCUMENT_EXTRACTION_TOOL_DEFINITION,
  VISUALIZATION_TOOL_DEFINITION,
  ...ARTIFACT_CREATION_DEFINITIONS,
  ...IMAGE_TOOL_DEFINITIONS,
  tool('web_search', 'Web Search', 'Search public information.', 'network'),
  tool('web_fetch', 'Web Fetch', 'Fetch readable public web content.', 'network')
];
```

```ts
// Generated content becomes a downloadable browser artifact, not a server file.
function addArtifact(path: string, content: string): WebArtifact {
  const safeName = normalizeRelativeArtifactPath(path);
  return {
    name: safeName,
    mime: mimeFor(safeName),
    base64: Buffer.from(content, 'utf8').toString('base64'),
    previewText: content
  };
}
```

<figure class="figure-placeholder">
<div class="placeholder-box"><span>Image</span></div>
<figcaption>The web workspace: chat with an uploaded document, OCR output, and a generated downloadable artifact.</figcaption>
</figure>

## 15. End-to-end orchestration

<div class="callout callout-problem">
<h4>Problems this section addresses</h4>
<ul>
<li>Every request has to pass through the same chain: session, context, model selection, reasoning, tool search or delegation, policy, execution, observation, verification.</li>
</ul>
</div>

```text
User request
    │
    ▼
Session + cancellation + event stream
    │
    ▼
Context collection ─────► model/provider selection
    │                              │
    └──────────────┬───────────────┘
                   ▼
              Agent reasoning
                   │
          ┌────────┴────────┐
          ▼                 ▼
   Search tool catalog   Delegate bounded task
          │                 │
          └────────┬────────┘
                   ▼
        Policy + approval boundary
                   │
                   ▼
             Execute real tool
                   │
                   ▼
       Observation → next loop step
                   │
                   ▼
       Verify result → final response
```

## 16. Engineering highlights

- A shared agent architecture supports very different VS Code and browser trust boundaries.
- Provider adapters allow local, self-hosted, and cloud models to participate in one orchestration flow.
- Searchable tools reduce schema overhead for small-context local models.
- Risk-scoped subagents prevent delegated research from inheriting unnecessary capabilities.
- Human approval is modeled as runtime state rather than relying only on prompt instructions.
- Bounded discovery, context budgeting, timeouts, cancellation, and step limits keep local execution responsive.
- Streaming separates visible output from private reasoning and structured tool traffic.
- Document extraction, OCR, vision, web research, charting, and downloadable artifacts extend the system beyond coding chat.

## 17. Build and run

```sh
# Install all workspace dependencies
npm install

# Build and test the monorepo
npm run build
npm test

# Package the VS Code extension
npm run package:extension

# Start the web workspace
npm run start:web
```

---

<div class="callout callout-note">
<h4>In one sentence</h4>
<p><strong>VECTRA</strong> demonstrates end-to-end AI agent engineering: model discovery, provider abstraction, context construction, tool retrieval, safe execution, multi-agent coordination, streaming interfaces, and verified completion.</p>
</div>
