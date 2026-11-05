/* Knee Abnormality Detection: card and detail-page content in both languages.
   This folder holds everything for the project: index.html (page), knee-abnormality-detection.js (content),
   the thumbnail, KNEE.md (case study), and any images. */
Portfolio.project("knee-abnormality-detection", {
  en: {
    "title": "Knee Abnormality Detection",
    "description": "Single CoAtNet model detecting twelve knee MRI findings: 0.924 public-leaderboard macro-AUC in the RSNA Kaggle competition.",
    "image": "thumbnail.svg",
    "image_alt": "Knee abnormality detection",
    "image_class": "",
    "url": "https://www.kaggle.com/code/laudari/notebook247d4dbb42",
    "status": "research",
    "period": "Jul – Oct 2026",
    "role": "Solo participant",
    "context": "RSNA research code competition on Kaggle",
    "tags": ["Knee MRI", "DICOM", "CoAtNet", "Multi-label Classification", "Attention", "PyTorch", "Kaggle Notebook"],
    "subtitle": "A Kaggle code-competition solution that reads knee MRI studies (DICOM series in three planes) into a fixed five-slot slice stack and scores twelve clinically important findings at once with one CoAtNet model and per-finding attention. 0.924 macro-averaged ROC AUC on the public leaderboard, single model, no ensembling or test-time augmentation.",
    "links": [
      { "label": "Kaggle competition", "url": "https://www.kaggle.com/competitions/rsna-knee-abnormality-detection" },
      { "label": "Kaggle notebook", "url": "https://www.kaggle.com/code/laudari/notebook247d4dbb42" }
    ]
  },
  kr: {
    "title": "무릎 이상 탐지",
    "description": "무릎 MRI 12가지 소견을 하나의 CoAtNet 모델로 탐지해요. RSNA Kaggle 대회 Public LB 매크로 AUC 0.924.",
    "image": "thumbnail.svg",
    "image_alt": "무릎 이상 탐지",
    "image_class": "",
    "url": "https://www.kaggle.com/code/laudari/notebook247d4dbb42",
    "status": "research",
    "period": "2026년 7월 – 10월",
    "role": "단독 참가",
    "context": "Kaggle RSNA 연구 코드 대회",
    "tags": ["Knee MRI", "DICOM", "CoAtNet", "Multi-label Classification", "Attention", "PyTorch", "Kaggle Notebook"],
    "subtitle": "무릎 MRI 검사(세 평면의 DICOM 시리즈)를 고정된 5개 슬롯의 슬라이스 스택으로 만들어, 하나의 CoAtNet 모델과 소견별 Attention으로 12가지 주요 소견을 한 번에 점수화하는 Kaggle 코드 대회 솔루션이에요. 단일 모델, 앙상블·TTA 없이 Public LB 평균 ROC AUC 0.924를 기록했어요.",
    "links": [
      { "label": "Kaggle 대회", "url": "https://www.kaggle.com/competitions/rsna-knee-abnormality-detection" },
      { "label": "Kaggle 노트북", "url": "https://www.kaggle.com/code/laudari/notebook247d4dbb42" }
    ]
  }
});
