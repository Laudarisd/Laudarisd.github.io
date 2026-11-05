/* Patents: application list.
   Everything this section needs is in this folder: patents.html (markup), patents.js (content + renderer).
   Edit the text under "content" below; both languages live here. */
(function () {
  "use strict";
  var el = Portfolio.el, externalLink = Portfolio.externalLink, clear = Portfolio.clear;
  var byId = Portfolio.byId, setText = Portfolio.setText;

  function renderPatents(patents, labels) {
    if (!patents) return;
    var list = byId("patents-list");
    if (!list) return;
    clear(list);
    (patents.items || []).forEach(function (patent) {
      var sub = el("ul", { class: "record-sublist" });
      if (patent.country) sub.appendChild(el("li", { text: patent.country }));
      if (patent.application_no) {
        sub.appendChild(
          el("li", null, [
            el("strong", { text: labels.application_no + " " + patent.application_no })
          ])
        );
      }
      if (patent.filed) sub.appendChild(el("li", { text: patent.filed }));
      list.appendChild(el("li", null, [patent.title, sub]));
    });
  }

  Portfolio.register("patents", {
    content: {
      en: {
        "items": [
          {
            "title": "CAD Drawing-Based AI System for Automatic Generation of Structured Models",
            "country": "Republic of Korea",
            "application_no": "10-2025-0147049",
            "filed": "Filed in 2025"
          },
          {
            "title": "Projection Optimization System for Object Mapping Based on CAD Drawing Layers",
            "country": "Republic of Korea",
            "application_no": "10-2025-0147050",
            "filed": "Filed in 2025"
          },
          {
            "title": "Standard Bounding Box Correction System Based on AI Object Detection",
            "country": "Republic of Korea",
            "application_no": "10-2026-0071858",
            "filed": "Filed in 2026"
          },
          {
            "title": "Drawing Style Learning-Based Automatic Dimensioning System",
            "country": "Republic of Korea",
            "application_no": "10-2026-0071859",
            "filed": "Filed in 2026"
          }
        ]
      },
      kr: {
        "items": [
          {
            "title": "CAD 도면 기반 구조화 모델 자동 생성 AI 시스템",
            "country": "대한민국",
            "application_no": "10-2025-0147049",
            "filed": "2025년 출원"
          },
          {
            "title": "CAD 도면 Layer 기반 객체 매핑을 위한 Projection 최적화 시스템",
            "country": "대한민국",
            "application_no": "10-2025-0147050",
            "filed": "2025년 출원"
          },
          {
            "title": "AI Object Detection 기반 표준 Bounding Box 보정 시스템",
            "country": "대한민국",
            "application_no": "10-2026-0071858",
            "filed": "2026년 출원"
          },
          {
            "title": "도면 스타일 학습 기반 자동 치수 기입 시스템",
            "country": "대한민국",
            "application_no": "10-2026-0071859",
            "filed": "2026년 출원"
          }
        ]
      }
    },
    render: function (patents, ctx) { renderPatents(patents, ctx.labels); }
  });
})();
