/* Wellbore Geology Prediction: card and detail-page content in both languages.
   This folder holds everything for the project: index.html (page), wellbore-geology-prediction.js (content),
   the thumbnail, WELLBORE.md (case study), and any images. */
Portfolio.project("wellbore-geology-prediction", {
  en: {
    "title": "Wellbore Geology Prediction",
    "description": "Automated geosteering: predicting where a horizontal well sits inside the rock from gamma-ray logs, with a particle-filter, beam-search and spatial-geology ensemble.",
    "image": "thumbnail.svg",
    "image_alt": "Wellbore geology prediction",
    "image_class": "",
    "url": "https://www.kaggle.com/laudari",
    "period": "2026",
    "role": "Solo developer",
    "context": "Geoscience machine-learning research",
    "tags": ["Geosteering", "Gamma-ray Logs", "Particle Filter", "Beam Search", "Spatial KNN", "LightGBM", "CatBoost", "Numba"],
    "subtitle": "A geosteering model that places a horizontal well inside the subsurface. It reads the gamma-ray log along the drilled path, matches it against a vertical reference well, and predicts the true vertical thickness at every point so the bit's position in the rock layers is known. Several physics-style estimators (a particle filter, a beam search, cross-correlation template matching and spatial formation geometry) are blended by a gradient-boosting stack, cross-validated by well.",
    "links": [
      { "label": "Kaggle", "url": "https://www.kaggle.com/laudari" }
    ]
  },
  kr: {
    "title": "시추공 지질 예측",
    "description": "자동 지오스티어링이에요. 감마선 로그로 수평정이 암층 어디에 있는지 예측해요. 파티클 필터, 빔 서치, 공간 지질 추정을 앙상블했어요.",
    "image": "thumbnail.svg",
    "image_alt": "시추공 지질 예측",
    "image_class": "",
    "url": "https://www.kaggle.com/laudari",
    "period": "2026년",
    "role": "단독 개발",
    "context": "지질과학 머신러닝 연구",
    "tags": ["Geosteering", "감마선 로그", "Particle Filter", "Beam Search", "Spatial KNN", "LightGBM", "CatBoost", "Numba"],
    "subtitle": "수평정이 지하 암층 어디를 지나는지 추정하는 지오스티어링 모델이에요. 시추 경로를 따라 측정된 감마선 로그를 수직 기준정과 맞춰, 모든 지점에서 진수직두께(TVT)를 예측해 비트가 어느 지층에 있는지 알 수 있게 해요. 파티클 필터, 빔 서치, 상호상관 템플릿 매칭, 공간 지층 기하 같은 여러 물리 기반 추정값을 그래디언트 부스팅 스택으로 결합하고, 정(well) 단위로 교차검증했어요.",
    "links": [
      { "label": "Kaggle", "url": "https://www.kaggle.com/laudari" }
    ]
  }
});
