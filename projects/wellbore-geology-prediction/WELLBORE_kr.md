# 시추공 지질 예측 - 수평정이 암층 어디에 있는지
<p>수평정을 지하 안에 놓는 지오스티어링 모델이에요. 시추 경로를 따라 감마선 로그를 읽고, 수직 기준정과 맞추고, 모든 지점에서 진수직두께(TVT)를 예측해요. 그래서 한 번도 측정하지 않은 곳에서도 비트가 암층 어디에 있는지 알 수 있어요.</p>
<p><strong>키워드</strong></p>
<div class="fact-grid">
<div class="fact"><span class="fact-label">분야</span><span class="fact-value">지오스티어링 · 지하 지질</span></div>
<div class="fact"><span class="fact-label">과제</span><span class="fact-value">수평정을 따라 TVT 예측</span></div>
<div class="fact"><span class="fact-label">입력</span><span class="fact-value">감마선 로그 + 수직 기준정</span></div>
<div class="fact"><span class="fact-label">방법</span><span class="fact-value">Particle Filter · Beam Search · Spatial KNN 스택</span></div>
<div class="fact"><span class="fact-label">검증</span><span class="fact-value">정(well) 단위 분할 · TVT RMSE</span></div>
</div>
<figure class="figure-small">
<img src="images/photo.jpg" alt="가을 들판에 서 있는 시추 리그와 그 뒤의 숲이 있는 언덕">
<figcaption>수평 시추 리그예요. 그 아래의 비트는 아무도 볼 수 없는 몇 미터 두께의 암층 안에 머물러야 해요. 사진: Meredithw at English Wikipedia, CC BY-SA 3.0, Wikimedia Commons.</figcaption>
</figure>

---

## 1. 소개
<p>지오스티어링은 옆으로 뚫고 가는 동안 드릴 비트를 얇은 목표 지층 안에 유지하는 일이에요. 시추하는 사람은 암석을 볼 수 없어요. 있는 건 점토 함량에 따라 오르내리는 감마선 곡선과, 같은 지층을 위에서 아래로 기록한 근처의 수직정이에요. 둘을 같이 읽으면 비트가 기준 지층보다 얼마나 위나 아래에 있는지 알 수 있어요. 이 모델은 그 읽기를 자동으로 해요. Particle Filter, Beam Search, 상호상관 템플릿 매칭, 공간 지층 기하 같은 물리 기반 추정기가 각각 추정값을 내고, Gradient Boosting 스택이 그걸 섞어요. 정(well) 단위로 교차검증해서 어떤 정도 자기 테스트에 새지 않아요.</p>

---

## 2. 목표
<div class="callout callout-goal">
<h4>목표</h4>
<ul>
<li>감마선 로그와 기준 수직정으로 수평정의 모든 지점에서 진수직두께를 예측해요.</li>
<li>물리 기반 추정기와 학습된 스택을 결합해서 설명 가능하면서도 정확한 결과를 내요.</li>
<li>행이 아니라 정 단위로 검증해서, 보고하는 오차가 새 정에서 볼 오차가 되게 해요.</li>
</ul>
</div>

---

## 3. 코드와 자세한 내용은 GitHub에
<p>메인 프로젝트와 기술적인 세부 내용은 GitHub에 올려 두었어요. 작업을 자세히 이해하시려면 저장소를 참고해 주세요.</p>
<p><a href="https://www.kaggle.com/laudari" target="_blank" rel="noopener noreferrer">Kaggle: https://www.kaggle.com/laudari</a></p>
