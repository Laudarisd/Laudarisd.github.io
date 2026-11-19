# PDF-to-CAD Text Processing - 도면 글자를 편집 가능한 CAD로
<p>PDF 도면의 글자, 치수, 라벨, 방 이름, 주석을 추출하고 처리해서, PDF-to-CAD 변환으로 만든 CAD 도면 안에 편집 가능한 글자로, 맞는 위치와 크기와 각도로 들어가게 해요.</p>
<p><strong>키워드</strong></p>
<div class="fact-grid">
<div class="fact"><span class="fact-label">분야</span><span class="fact-value">CAD 변환</span></div>
<div class="fact"><span class="fact-label">입력</span><span class="fact-value">PDF 도면, 벡터와 스캔</span></div>
<div class="fact"><span class="fact-label">출력</span><span class="fact-value">위치와 크기가 맞는 편집 가능한 CAD 글자</span></div>
<div class="fact"><span class="fact-label">기간</span><span class="fact-value">2025년 12월 · 2026년 7월</span></div>
</div>
<figure class="figure-small">
<img src="images/drawing_sample.png" alt="치수, 방 이름, 주석이 있는 세대 평면도. 변환이 옮겨야 하는 종류의 도면 글자">
<figcaption>PDF로 들어온 평면도예요. 그 위의 모든 치수, 방 이름, 주석이 편집 가능한 CAD 글자가 돼야 해요.</figcaption>
</figure>

---

## 1. 소개
<p>PDF 도면을 CAD로 변환하면 선은 넘어오지만 글자가 어려운 부분이에요. 벡터 PDF에는 글자가 있지만 흩어져 있고, 기울어 있고, 조각으로 쪼개져 있어요. 스캔 PDF에는 픽셀뿐이에요. 이 프로젝트는 어느 쪽이든 글자를 읽고, 조각을 다시 온전한 문자열로 잇고, 문자열마다 위치와 높이와 회전을 알아내고, CAD 도면에 맞는 Layer의 진짜 글자 개체로 써요. 그래서 결과를 다시 그리는 게 아니라 편집할 수 있어요.</p>

---

## 2. 목표
<div class="callout callout-goal">
<h4>목표</h4>
<ul>
<li>벡터와 스캔 PDF 도면 둘 다에서 글자를 위치, 높이, 회전과 함께 추출해요.</li>
<li>쪼개지고 기울어진 조각을 온전한 치수 문자열, 라벨, 주석으로 다시 만들어요.</li>
<li>변환된 CAD 도면에 글자를 알맞은 Layer의 편집 가능한 개체로 써요.</li>
</ul>
</div>

---

## 3. 코드와 자세한 내용은 GitHub에
<p>메인 프로젝트와 기술적인 세부 내용은 GitHub에 올려 두었어요. 작업을 자세히 이해하시려면 저장소를 참고해 주세요.</p>
<p><a href="https://github.com/Laudarisd" target="_blank" rel="noopener noreferrer">GitHub: https://github.com/Laudarisd</a></p>
