# Agent Collection - Tool을 쓰는 어시스턴트와 Retrieval Pipeline
<p>작고 목적이 분명한 Agent 시스템 모음이에요. Tool을 호출하는 어시스턴트, 혼자 돌아가는 워크플로, 언어 모델에 필요한 문서를 찾아 주는 Retrieval Pipeline이에요. 하나하나가 과제 하나를 해결하는 동작하는 코드이고, 연구와 실무 둘 다에 써요.</p>
<p><strong>키워드</strong></p>
<div class="fact-grid">
<div class="fact"><span class="fact-label">분야</span><span class="fact-value">AI Agent · LLM</span></div>
<div class="fact"><span class="fact-label">구성</span><span class="fact-value">Tool 어시스턴트 · 워크플로 · RAG</span></div>
<div class="fact"><span class="fact-label">모델</span><span class="fact-value">Hosted API와 로컬 모델</span></div>
<div class="fact"><span class="fact-label">언어</span><span class="fact-value">Python</span></div>
</div>

---

## 1. 소개
<p>언어 모델 혼자서는 글만 써요. Agent는 모델 주위에 루프를 두른 거예요. 요청을 읽고, 어떤 Tool을 부를지 정하고, 결과를 읽고, 일이 끝날 때까지 계속해요. 이 모음에는 그 루프에 계속 다시 쓰는 부품들이 있어요. Tool을 호출하는 어시스턴트, 사람 없이 단계를 이어 가는 워크플로 러너, 모델이 답하기 전에 맞는 문서를 가져오는 Retrieval Pipeline이에요.</p>
<pre class="mermaid">flowchart LR
    U[사용자 요청]:::input --> A[Agent<br/>단계 계획]:::agent
    A --> T[Tool<br/>검색 · 파일 · API]:::tool
    T --> A
    A --> R[(Retrieval<br/>문서, 벡터)]:::store
    R --> A
    A --> O[답 또는<br/>완료된 작업]:::output
</pre>

---

## 2. 목표
<div class="callout callout-goal">
<h4>목표</h4>
<ul>
<li>Agent 패턴마다 테스트된 구현 하나를 두고, 프로젝트마다 다시 만들지 않아요.</li>
<li>Tool 사용을 안전하고 추적 가능하게 해요. 모든 호출과 결과를 기록하고, 데이터를 바꾸는 일은 먼저 물어봐요.</li>
<li>같은 Agent 코드가 Hosted API에서도 로컬 모델에서도 바꾸지 않고 돌아가게 해요.</li>
</ul>
</div>

---

## 3. 코드와 자세한 내용은 GitHub에
<p>메인 프로젝트와 기술적인 세부 내용은 GitHub에 올려 두었어요. 작업을 자세히 이해하시려면 저장소를 참고해 주세요.</p>
<p><a href="https://github.com/Laudarisd/agent-collection" target="_blank" rel="noopener noreferrer">GitHub: https://github.com/Laudarisd/agent-collection</a></p>
