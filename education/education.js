/* Education: degrees and honours (two fragments: degrees.html, honours.html).
   Everything this section needs is in this folder: degrees.html + honours.html (markup), education.js (content + renderer).
   Edit the text under "content" below; both languages live here. */
(function () {
  "use strict";
  var el = Portfolio.el, externalLink = Portfolio.externalLink, clear = Portfolio.clear;
  var byId = Portfolio.byId, setText = Portfolio.setText;

  function renderEducation(education, labels) {
    if (!education) return;
    var degrees = byId("degrees-list");
    if (degrees) {
      clear(degrees);
      (education.degrees || []).forEach(function (degree) {
        var li = el("li", null, [
          el("strong", { text: degree.title }),
          el("br"),
          degree.institution || ""
        ]);
        if (degree.project) {
          li.appendChild(el("br"));
          li.appendChild(el("strong", { text: labels.project }));
          li.appendChild(document.createTextNode(" " + degree.project));
        }
        if (degree.thesis_title) {
          li.appendChild(el("br"));
          li.appendChild(el("strong", { text: labels.thesis }));
          li.appendChild(document.createTextNode(" "));
          li.appendChild(
            degree.thesis_url
              ? externalLink(degree.thesis_url, degree.thesis_title, "thesis-link")
              : document.createTextNode(degree.thesis_title)
          );
        }
        degrees.appendChild(li);
      });
    }

    var honours = byId("honours-list");
    if (honours) {
      clear(honours);
      (education.honours || []).forEach(function (item) {
        honours.appendChild(el("li", { text: item }));
      });
    }
  }

  Portfolio.register("education", {
    content: {
      en: {
        "degrees": [
          {
            "title": "PhD in Civil Engineering (2020-2024)",
            "institution": "The University of Sydney, Australia",
            "project": "AI-based material sorting and energy optimization in mining using computer vision and statistical modelling.",
            "thesis_title": "Detecting Particles Properties From Their Kinematics in Granular Flows",
            "thesis_url": "https://ses.library.usyd.edu.au/handle/2123/32885?show=full"
          },
          {
            "title": "MSc in Mathematics (2016-2019)",
            "institution": "Sungkyunkwan University, South Korea",
            "project": "AI-based material sorting and energy optimization in mining using computer vision and statistical modelling.",
            "thesis_title": "Application of machine learning knowledge and graph centrality pruning algorithm to echo state network",
            "thesis_url": "https://lib.skku.edu/hsc/search/all/13110235"
          }
        ],
        "honours": [
          "Faculty of Engineering Scholarship, The University of Sydney",
          "International Student Scholarship, Sungkyunkwan University",
          "International Class Scholarship, Sungkyunkwan University",
          "Graduate Assistant Tuition Waiver, Sungkyunkwan University",
          "Excellent Manpower Training Scholarship, Sungkyunkwan University"
        ]
      },
      kr: {
        "degrees": [
          {
            "title": "토목공학 박사 (PhD, 2020-2024)",
            "institution": "The University of Sydney, 호주",
            "project": "Computer Vision과 통계 모델링을 활용한 광업 분야의 AI 기반 재료 분류 및 에너지 최적화.",
            "thesis_title": "Detecting Particles Properties From Their Kinematics in Granular Flows",
            "thesis_url": "https://ses.library.usyd.edu.au/handle/2123/32885?show=full"
          },
          {
            "title": "수학 석사 (MSc, 2016-2019)",
            "institution": "성균관대학교 (Sungkyunkwan University), 대한민국",
            "project": "Computer Vision과 통계 모델링을 활용한 광업 분야의 AI 기반 재료 분류 및 에너지 최적화.",
            "thesis_title": "Application of machine learning knowledge and graph centrality pruning algorithm to echo state network",
            "thesis_url": "https://lib.skku.edu/hsc/search/all/13110235"
          }
        ],
        "honours": [
          "Faculty of Engineering Scholarship, The University of Sydney",
          "International Student Scholarship, 성균관대학교",
          "International Class Scholarship, 성균관대학교",
          "Graduate Assistant 등록금 면제, 성균관대학교",
          "Excellent Manpower Training Scholarship, 성균관대학교"
        ]
      }
    },
    render: function (education, ctx) { renderEducation(education, ctx.labels); }
  });
})();
