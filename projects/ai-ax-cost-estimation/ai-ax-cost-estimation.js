/* AI AX Cost Estimation: card and detail-page content in both languages.
   This folder holds everything for the project: index.html (page), ai-ax-cost-estimation.js (content),
   the thumbnail, and any case-study Markdown and images. */
Portfolio.project("ai-ax-cost-estimation", {
  en: {
    "title": "AI AX Cost Estimation",
    "description": "Floor-plan images to quantities: detection, segmentation, OCR, and a quantity take-off.",
    "image": "thumbnail.jpg",
    "image_alt": "A recognized floor plan in the CAD application beside its quantity take-off table in Excel",
    "image_class": "",
    "url": "https://github.com/Laudarisd",
    "subtitle": "A CAD add-in that reads a floor-plan image, recognizes the walls, openings, fixtures and spaces on it, rebuilds them as CAD layers, and produces a quantity take-off an estimator can review. Detection, segmentation and OCR models run behind a supervised service with live monitoring.",
    "period": "Jan 2024 – Apr 2026",
    "role": "Researcher and developer (end-to-end)",
    "context": "Industry AI system",
    "tags": [
      "Computer Vision",
      "PyTorch",
      "OpenCV",
      "CRNN / Paddle OCR",
      "FastAPI",
      "Redis",
      "systemd / nginx",
      "Prometheus / Grafana",
      "MLOps"
    ],
    "links": [
      {
        "label": "Source code: private / proprietary"
      }
    ]
  },
  kr: {
    "title": "AI AX Cost Estimation",
    "description": "평면도 이미지를 수량으로: Detection, Segmentation, OCR, 그리고 수량 산출이에요.",
    "image": "thumbnail.jpg",
    "image_alt": "CAD에서 인식된 평면도와 Excel로 내보낸 수량 산출표",
    "image_class": "",
    "url": "https://github.com/Laudarisd",
    "subtitle": "평면도 이미지를 읽어 벽, 개구부, 기구, 공간을 인식하고, CAD Layer로 다시 그리고, 검토 가능한 수량 산출표를 만드는 CAD 애드인이에요. Detection, Segmentation, OCR 모델이 감시되는 서비스 뒤에서 실행되고, 운영 상태를 실시간으로 모니터링해요.",
    "period": "2024년 1월 – 2026년 4월",
    "role": "연구 및 개발 (End-to-End)",
    "context": "산업용 AI 시스템",
    "tags": [
      "Computer Vision",
      "PyTorch",
      "OpenCV",
      "CRNN / Paddle OCR",
      "FastAPI",
      "Redis",
      "systemd / nginx",
      "Prometheus / Grafana",
      "MLOps"
    ],
    "links": [
      {
        "label": "소스 코드: 비공개 / 사내 자산"
      }
    ]
  }
});
