# Rethinking Reservoir Pruning: A Dynamical Perspective for Echo State Networks
<p>Echo State Network를 망가뜨리지 않고 작게 만드는 연구 논문이에요. Reservoir 뉴런을 가중치 크기나 그래프 통계로 순위 매기는 대신, Reservoir가 입력에 대해 실제로 만들어 내는 동역학을 보고, 그 동역학이 각 뉴런을 얼마나 지나가는지로 점수를 매기고, 나머지를 한 번에 잘라내요.</p>
<p><strong>키워드</strong></p>
<div class="fact-grid">
<div class="fact"><span class="fact-label">분야</span><span class="fact-value">Reservoir Computing · Echo State Network</span></div>
<div class="fact"><span class="fact-label">아이디어</span><span class="fact-value">가중치가 아니라 Reservoir의 동역학으로 Pruning</span></div>
<div class="fact"><span class="fact-label">점수</span><span class="fact-value">구동 궤적에 대한 Jacobian Gram 행렬</span></div>
<div class="fact"><span class="fact-label">선택</span><span class="fact-value">One shot: 상위 N′개 유지, Rescaling, Readout 재학습</span></div>
<div class="fact"><span class="fact-label">출력</span><span class="fact-value">논문과 코드</span></div>
</div>
<figure class="figure-small">
<img src="images/esn_pruning.png" alt="논문의 방법 그림: 입력으로 구동되는 Reservoir W, 궤적에 대한 Jacobian과 Gram 행렬, 점수로 순위를 매겨 상위 뉴런은 남기고 나머지는 잘라내는 과정, One-shot 선택, Spectral Rescaling, Readout W_out">
<figcaption>방법이에요. Reservoir를 궤적을 따라 구동하고, Jacobian의 Gram 행렬로 뉴런마다 점수를 매기고, 점수가 높은 뉴런을 한 번에 남기고, 잘라낸 Reservoir를 Spectral Rescaling 한 뒤 Readout만 다시 학습해요.</figcaption>
</figure>

---

## 1. 소개
<p>Echo State Network는 고정된 무작위 연결 뉴런의 큰 Reservoir에 학습된 Readout 하나가 있는 구조예요. Reservoir는 보통 과제에 필요한 것보다 훨씬 크고 뉴런 대부분은 기여가 작아요. 그런데 기존 Pruning 규칙은 가중치 크기나 연결성 같은 정적인 성질로 무엇을 뺄지 정해요. 그 성질은 입력이 Reservoir를 구동했을 때 Reservoir가 무엇을 하는지는 말해 주지 않아요. 이 논문은 동역학의 관점을 취해요. Reservoir를 궤적을 따라 구동하고, 단계마다 Jacobian을 만들고, 궤적 전체에 대한 Gram 행렬을 만들어요. 그 주요 모드가 Reservoir의 상태가 실제로 움직이는 방향이에요. 뉴런마다 그 모드에 얼마나 참여하는지로 점수를 받고, 상위 N′개를 한 번에 남기고, 잘라낸 Reservoir의 Spectral Radius를 목표값으로 다시 맞추고, Readout만 다시 학습해요.</p>

---

## 2. 목표
<div class="callout callout-goal">
<h4>목표</h4>
<ul>
<li>가중치 크기나 그래프 통계가 아니라, 실제 입력에 대한 Reservoir 동역학에서의 역할로 뉴런에 점수를 매겨요.</li>
<li>Reservoir를 반복 재학습하지 않고 한 번에 Pruning 하고, Spectral Rescaling으로 Echo State 성질을 지켜요.</li>
<li>Readout 정확도가 떨어지기 전까지 Reservoir를 얼마나 줄일 수 있는지, 흔한 가중치 크기 기준과 비교해서 보여 줘요.</li>
</ul>
</div>

---

## 3. 코드와 자세한 내용은 GitHub에
<p>메인 프로젝트와 기술적인 세부 내용은 GitHub에 올려 두었어요. 작업을 자세히 이해하시려면 저장소를 참고해 주세요.</p>
<p><a href="https://github.com/Laudarisd/dmp_esn" target="_blank" rel="noopener noreferrer">GitHub: https://github.com/Laudarisd/dmp_esn</a></p>
