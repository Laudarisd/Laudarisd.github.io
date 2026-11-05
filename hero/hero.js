/* Hero: title, intro text, buttons, and highlights.
   Everything this section needs is in this folder: hero.html (markup), hero.js (content + renderer), hero.css (styles).
   Edit the text under "content" below; both languages live here. */
(function () {
  "use strict";
  var el = Portfolio.el, externalLink = Portfolio.externalLink, clear = Portfolio.clear;
  var byId = Portfolio.byId, setText = Portfolio.setText;

  function renderHero(hero) {
    if (!hero) return;
    setText("hero-title", hero.title);
    setText("hero-text", hero.text);

    var photo = byId("hero-photo");
    if (photo) {
      if (hero.photo) photo.setAttribute("src", hero.photo);
      if (hero.photo_alt) photo.setAttribute("alt", hero.photo_alt);
    }

    var actions = byId("hero-actions");
    if (actions) {
      clear(actions);
      (hero.actions || []).forEach(function (action) {
        var style = action.style === "secondary" ? "button-secondary" : "button-primary";
        actions.appendChild(
          el("a", { class: "button " + style, href: action.href, text: action.label })
        );
      });
    }

    var highlights = byId("hero-highlights");
    if (highlights) {
      clear(highlights);
      (hero.highlights || []).forEach(function (item) {
        highlights.appendChild(
          el("li", null, [el("strong", { text: item.label }), " " + (item.text || "")])
        );
      });
    }
  }

  Portfolio.register("hero", {
    content: {
      en: {
        "title": "Researcher",
        "text": "Applied mathematician and AI/ML researcher specialising in mathematical modelling, computational geometry, computer vision, remote sensing, geospatial analysis, generative AI, AI agents, and agentic RAG for engineering and built-environment systems. I combine academic rigour with practical implementation to build reproducible, deployable, research-led solutions for complex engineering problems.",
        "photo": "img/github-profile.png",
        "photo_alt": "Sudip Laudari",
        "actions": [
          {
            "label": "View Resume",
            "href": "#resume",
            "style": "primary"
          },
          {
            "label": "Explore Projects",
            "href": "#projects",
            "style": "secondary"
          }
        ],
        "highlights": [
          {
            "label": "Research interests:",
            "text": "Applied Mathematics, Mathematical Modelling, Graph Theory, Matrix Theory, Computer Vision, Deep Learning, Remote Sensing, Geospatial Analysis, Agentic AI Systems, and Geotechnical Data Analysis"
          },
          {
            "label": "Academic direction:",
            "text": "Research-led Teaching, Supervision, Translational Engineering"
          },
          {
            "label": "Professional focus:",
            "text": "Reproducible Pipelines, Deployable AI Systems, Real-world Engineering Applications"
          }
        ]
      },
      kr: {
        "title": "연구자",
        "text": "응용수학과 AI/ML을 연구하고 있어요. Mathematical Modelling, Computational Geometry, Computer Vision, Remote Sensing, Geospatial 분석, Generative AI, AI Agent, Agentic RAG를 주로 다루고, 이를 건설·엔지니어링 분야의 실제 문제에 적용하고 있어요. 이론적인 깊이와 실제 구현 경험을 함께 살려서, 복잡한 공학 문제에 바로 쓸 수 있는 재현 가능한 연구 기반 솔루션을 만드는 것이 목표예요.",
        "photo": "img/github-profile.png",
        "photo_alt": "Sudip Laudari",
        "actions": [
          {
            "label": "이력 보기",
            "href": "#resume",
            "style": "primary"
          },
          {
            "label": "프로젝트 보기",
            "href": "#projects",
            "style": "secondary"
          }
        ],
        "highlights": [
          {
            "label": "연구 관심 분야:",
            "text": "Applied Mathematics, Mathematical Modelling, Graph Theory, Matrix Theory, Computer Vision, Deep Learning, Remote Sensing, Geospatial Analysis, Agentic AI Systems, Geotechnical Data Analysis"
          },
          {
            "label": "학문적 방향:",
            "text": "연구 기반 강의, 학생 지도, 공학 현장 적용 (Translational Engineering)"
          },
          {
            "label": "실무 분야:",
            "text": "재현 가능한 Pipeline, 배포 가능한 AI System, 실제 엔지니어링 문제 해결"
          }
        ]
      }
    },
    render: function (hero) { renderHero(hero); }
  });
})();
