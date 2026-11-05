/* Skills: category rows and chips.
   Everything this section needs is in this folder: skills.html (markup), skills.js (content + renderer), skills.css (styles).
   Edit the text under "content" below; both languages live here. */
(function () {
  "use strict";
  var el = Portfolio.el, externalLink = Portfolio.externalLink, clear = Portfolio.clear;
  var byId = Portfolio.byId, setText = Portfolio.setText;

  function renderSkills(skills) {
    if (!skills) return;
    var container = byId("skills-list");
    if (!container) return;
    clear(container);
    (skills.categories || []).forEach(function (category) {
      var chips = el("ul", { class: "skill-chip-list" });
      (category.items || []).forEach(function (skill) {
        chips.appendChild(el("li", { text: skill }));
      });
      container.appendChild(
        el("section", { class: "skill-section" }, [el("h4", { text: category.name }), chips])
      );
    });
  }

  Portfolio.register("skills", {
    content: {
      en: {
        "categories": [
          {
            "name": "Programming Languages",
            "items": [
              "Python",
              "C#",
              "SQL"
            ]
          },
          {
            "name": "AI, Machine Learning & Computer Vision",
            "items": [
              "Deep Learning",
              "PyTorch",
              "NumPy",
              "scikit-learn",
              "Time-Series Analysis",
              "Anomaly Detection",
              "Computer Vision",
              "OpenCV",
              "Object Detection",
              "Classification",
              "Segmentation",
              "OCR",
              "Remote Sensing",
              "GIS"
            ]
          },
          {
            "name": "Generative AI & Agents",
            "items": [
              "LLMs",
              "RAG",
              "Prompt Engineering",
              "Fine-Tuning",
              "AI Agents",
              "Tool Use",
              "Workflow Orchestration",
              "Task Automation"
            ]
          },
          {
            "name": "Backend & Server-Side",
            "items": [
              "Backend Development",
              "API Integration",
              "ONNX Deployment",
              "Server Deployment",
              "Linux Systems",
              "Docker",
              "AWS"
            ]
          },
          {
            "name": "Engineering, Mathematics & Modelling",
            "items": [
              "Geotechnical Data Analysis",
              "Granular Materials Analysis",
              "DEM Simulation",
              "Digital Twins",
              "Mathematical Modelling",
              "Optimisation",
              "Graph Theory",
              "Matrix Theory"
            ]
          }
        ]
      },
      kr: {
        "categories": [
          {
            "name": "프로그래밍 언어",
            "items": [
              "Python",
              "C#",
              "SQL"
            ]
          },
          {
            "name": "AI, 머신러닝 및 컴퓨터 비전",
            "items": [
              "딥러닝",
              "PyTorch",
              "NumPy",
              "scikit-learn",
              "시계열 분석",
              "이상 탐지",
              "컴퓨터 비전",
              "OpenCV",
              "객체 탐지",
              "분류",
              "분할",
              "OCR",
              "원격탐사",
              "GIS"
            ]
          },
          {
            "name": "생성형 AI 및 에이전트",
            "items": [
              "LLMs",
              "RAG",
              "프롬프트 엔지니어링",
              "파인튜닝",
              "AI 에이전트",
              "도구 사용",
              "워크플로 오케스트레이션",
              "작업 자동화"
            ]
          },
          {
            "name": "백엔드 및 서버 사이드",
            "items": [
              "백엔드 개발",
              "API 통합",
              "ONNX 배포",
              "서버 배포",
              "Linux 시스템",
              "Docker",
              "AWS"
            ]
          },
          {
            "name": "공학, 수학 및 모델링",
            "items": [
              "지반공학 데이터 분석",
              "입상 재료 분석",
              "DEM 시뮬레이션",
              "디지털 트윈",
              "수학적 모델링",
              "최적화",
              "그래프 이론",
              "행렬 이론"
            ]
          }
        ]
      }
    },
    render: function (skills) { renderSkills(skills); }
  });
})();
