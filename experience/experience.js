/* Experience: timeline entries.
   Everything this section needs is in this folder: experience.html (markup), experience.js (content + renderer), experience.css (styles).
   Edit the text under "content" below; both languages live here. */
(function () {
  "use strict";
  var el = Portfolio.el, externalLink = Portfolio.externalLink, clear = Portfolio.clear;
  var byId = Portfolio.byId, setText = Portfolio.setText;

  function renderExperience(experience) {
    if (!experience) return;
    setText("experience-note", experience.heading_note || "");
    var list = byId("experience-list");
    if (!list) return;
    clear(list);
    (experience.items || []).forEach(function (item) {
      list.appendChild(
        el("div", { class: "timeline-item" }, [
          el("span", { class: "timeline-year", text: item.period }),
          el("h4", { text: item.role }),
          el("p", { text: item.organization }),
          el("p", { text: item.description })
        ])
      );
    });
  }

  Portfolio.register("experience", {
    content: {
      en: {
        "heading_note": "5+ years",
        "items": [
          {
            "period": "Feb 2024 - Present",
            "role": "Researcher",
            "organization": "WIZCORE (CADian Inc.), Seoul, South Korea",
            "description": "Developed mathematical modelling and AI-based pipelines for 2D-to-3D CAD generation, CAD vectorisation, DWG layer standardisation, internal RAG systems, and production-ready tools for engineering automation."
          },
          {
            "period": "2021 - 2022",
            "role": "Data Scientist",
            "organization": "Soul Energy, Seoul, South Korea",
            "description": "Built time-series forecasting, anomaly detection, and GIS-based renewable energy planning models using statistical and deep learning methods."
          },
          {
            "period": "2019 - 2021",
            "role": "AI/ML Engineer",
            "organization": "InterMinds, Seoul, South Korea",
            "description": "Built smart retail AI prototypes, REST-integrated inference services, and reinforcement learning workflows for adaptive traffic control."
          }
        ]
      },
      kr: {
        "heading_note": "5년 이상",
        "items": [
          {
            "period": "2024년 2월 - 현재",
            "role": "연구원 (Researcher)",
            "organization": "위즈코어 (WIZCORE, CADian Inc.), 서울",
            "description": "2D-to-3D CAD 생성, CAD Vectorisation, DWG Layer 표준화, 사내 RAG 시스템 등 엔지니어링 자동화에 바로 쓰이는 Mathematical Modelling과 AI Pipeline을 개발했어요."
          },
          {
            "period": "2021 - 2022",
            "role": "데이터 사이언티스트 (Data Scientist)",
            "organization": "소울에너지 (Soul Energy), 서울",
            "description": "통계와 Deep Learning을 활용해 Time-Series 예측, Anomaly Detection, GIS 기반 재생에너지 계획 모델을 만들었어요."
          },
          {
            "period": "2019 - 2021",
            "role": "AI/ML 엔지니어",
            "organization": "인터마인즈 (InterMinds), 서울",
            "description": "스마트 리테일 AI 프로토타입, REST API 연동 추론 서비스, 적응형 교통 제어를 위한 Reinforcement Learning 워크플로를 개발했어요."
          }
        ]
      }
    },
    render: function (experience) { renderExperience(experience); }
  });
})();
