# Agent Collection - Tool-Using Assistants and Retrieval Pipelines
<p>A collection of small, focused agent systems: assistants that call tools, workflows that run on their own, and retrieval pipelines that give a language model the documents it needs. Each one is a working piece of code that solves one task, built for research and for production use.</p>
<p><strong>Keywords</strong></p>
<div class="fact-grid">
<div class="fact"><span class="fact-label">Domain</span><span class="fact-value">AI agents · LLM</span></div>
<div class="fact"><span class="fact-label">Pieces</span><span class="fact-value">Tool-using assistants · workflows · RAG</span></div>
<div class="fact"><span class="fact-label">Model access</span><span class="fact-value">Hosted APIs and local models</span></div>
<div class="fact"><span class="fact-label">Language</span><span class="fact-value">Python</span></div>
</div>

---

## 1. Introduction
<p>A language model on its own can only write text. An agent is a model with a loop around it: it reads the request, decides which tool to call, reads the result, and keeps going until the task is done. This collection holds the pieces I keep reusing for that loop: a tool-calling assistant, workflow runners that chain steps without a person in between, and retrieval pipelines that fetch the right documents before the model answers.</p>
<pre class="mermaid">flowchart LR
    U[User request]:::input --> A[Agent<br/>plans the steps]:::agent
    A --> T[Tools<br/>search · files · APIs]:::tool
    T --> A
    A --> R[(Retrieval<br/>documents, vectors)]:::store
    R --> A
    A --> O[Answer or<br/>completed task]:::output
</pre>

---

## 2. Goal
<div class="callout callout-goal">
<h4>Goal</h4>
<ul>
<li>Keep one tested, reusable implementation of each agent pattern instead of rewriting it per project.</li>
<li>Make tool use safe and traceable: every call and result is logged, and anything that changes data asks first.</li>
<li>Let the same agent code run against a hosted API or a local model with no other change.</li>
</ul>
</div>

---

## 3. Code and details on GitHub
<p>The main project and its technical details are uploaded to GitHub, so please refer to the repository to understand the work in detail.</p>
<p><a href="https://github.com/Laudarisd/agent-collection" target="_blank" rel="noopener noreferrer">GitHub: https://github.com/Laudarisd/agent-collection</a></p>
