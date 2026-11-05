/* Knee Abnormality Detection: card and detail-page content in both languages.
   This folder holds everything for the project: index.html (page), knee-abnormality-detection.js (content),
   the thumbnail, KNEE.md (case study), and any images. */
Portfolio.project("knee-abnormality-detection", {
  en: {
    "title": "Knee Abnormality Detection",
    "description": "Multimodal detection of twelve knee MRI findings for the RSNA Knee Abnormality Detection competition on Kaggle.",
    "image": "thumbnail.svg",
    "image_alt": "Knee abnormality detection",
    "image_class": "",
    "url": "https://www.kaggle.com/code/laudari/notebook247d4dbb42",
    "status": "research",
    "period": "Jul – Oct 2026",
    "role": "Solo participant",
    "context": "RSNA research code competition on Kaggle",
    "tags": ["Knee MRI", "DICOM", "Multi-label Classification", "Radiology Reports", "ROC AUC", "Kaggle Notebook"],
    "subtitle": "A Kaggle code-competition solution that reads knee MRI studies (DICOM series in three planes) and predicts a probability for each of twelve clinically important findings, from ligament and meniscus tears to osteoarthritis, effusion, and fracture, scored by macro-averaged ROC AUC.",
    "links": [
      { "label": "Kaggle competition", "url": "https://www.kaggle.com/competitions/rsna-knee-abnormality-detection" },
      { "label": "Kaggle notebook", "url": "https://www.kaggle.com/code/laudari/notebook247d4dbb42" }
    ]
  },
  kr: {
    "title": "무릎 이상 탐지",
    "description": "Kaggle의 RSNA Knee Abnormality Detection 대회를 위한, 무릎 MRI 12가지 소견의 Multimodal 탐지예요.",
    "image": "thumbnail.svg",
    "image_alt": "무릎 이상 탐지",
    "image_class": "",
    "url": "https://www.kaggle.com/code/laudari/notebook247d4dbb42",
    "status": "research",
    "period": "2026년 7월 – 10월",
    "role": "단독 참가",
    "context": "Kaggle RSNA 연구 코드 대회",
    "tags": ["Knee MRI", "DICOM", "Multi-label Classification", "Radiology Reports", "ROC AUC", "Kaggle Notebook"],
    "subtitle": "무릎 MRI 검사(세 평면의 DICOM 시리즈)를 읽어 인대·반월판 파열부터 골관절염, 삼출, 골절까지 12가지 주요 소견 각각의 확률을 예측하는 Kaggle 코드 대회 솔루션이에요. 평가 지표는 12개 레이블의 평균 ROC AUC예요.",
    "links": [
      { "label": "Kaggle 대회", "url": "https://www.kaggle.com/competitions/rsna-knee-abnormality-detection" },
      { "label": "Kaggle 노트북", "url": "https://www.kaggle.com/code/laudari/notebook247d4dbb42" }
    ]
  }
});
