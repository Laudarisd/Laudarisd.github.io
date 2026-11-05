/* Publications: paper list.
   Everything this section needs is in this folder: publications.html (markup), publications.js (content + renderer).
   Edit the text under "content" below; both languages live here. */
(function () {
  "use strict";
  var el = Portfolio.el, externalLink = Portfolio.externalLink, clear = Portfolio.clear;
  var byId = Portfolio.byId, setText = Portfolio.setText;

  function renderPublications(publications, labels) {
    if (!publications) return;
    var list = byId("publications-list");
    if (!list) return;
    clear(list);
    (publications.items || []).forEach(function (paper) {
      var sub = el("ul", { class: "record-sublist" }, [
        el("li", null, [el("strong", { text: paper.venue })])
      ]);
      if (paper.code_url) {
        sub.appendChild(
          el("li", null, [
            labels.code + " ",
            externalLink(paper.code_url, labels.view_code, "publication-link")
          ])
        );
      }
      list.appendChild(
        el("li", null, [
          paper.url
            ? externalLink(paper.url, paper.title, "publication-link")
            : document.createTextNode(paper.title),
          sub
        ])
      );
    });
  }

  Portfolio.register("publications", {
    content: {
      en: {
        "items": [
          {
            "title": "Rethinking Reservoir Pruning: A Dynamical Perspective for Echo State Networks",
            "url": "https://arxiv.org/abs/2608.04593",
            "venue": "arXiv, 2026",
            "code_url": "https://github.com/Laudarisd/dmp_esn"
          },
          {
            "title": "Centrality-Based Pruning for Efficient Echo State Networks",
            "url": "https://arxiv.org/abs/2603.20684",
            "venue": "arXiv, 2026",
            "code_url": "https://github.com/Laudarisd"
          },
          {
            "title": "Topology-Preserving Data Augmentation for Ring-Type Polygon Annotations",
            "url": "https://arxiv.org/abs/2603.14764",
            "venue": "arXiv, 2026",
            "code_url": "https://github.com/Laudarisd/polyaug"
          },
          {
            "title": "Understanding student perceptions of flipped linear algebra classrooms via interpretable machine learning",
            "url": "https://arxiv.org/html/2309.16259v2",
            "venue": "arXiv, 2026"
          },
          {
            "title": "Using tracer particle kinematics to sense particle size in rotating drums",
            "url": "https://link.springer.com/article/10.1007/s10035-024-01493-5",
            "venue": "Granular Matter, 2024"
          },
          {
            "title": "Insights on the internal dynamics of bi-disperse granular flows from machine learning",
            "url": "https://link.springer.com/article/10.1007/s10035-023-01357-4",
            "venue": "Granular Matter, 2023"
          },
          {
            "title": "Classifying grains using behaviour-informed machine learning",
            "url": "https://www.nature.com/articles/s41598-022-18250-4",
            "venue": "Scientific Reports, 2022"
          }
        ]
      },
      kr: {
        "items": [
          {
            "title": "Rethinking Reservoir Pruning: A Dynamical Perspective for Echo State Networks",
            "url": "https://arxiv.org/abs/2608.04593",
            "venue": "arXiv, 2026",
            "code_url": "https://github.com/Laudarisd/dmp_esn"
          },
          {
            "title": "Centrality-Based Pruning for Efficient Echo State Networks",
            "url": "https://arxiv.org/abs/2603.20684",
            "venue": "arXiv, 2026",
            "code_url": "https://github.com/Laudarisd"
          },
          {
            "title": "Topology-Preserving Data Augmentation for Ring-Type Polygon Annotations",
            "url": "https://arxiv.org/abs/2603.14764",
            "venue": "arXiv, 2026",
            "code_url": "https://github.com/Laudarisd/polyaug"
          },
          {
            "title": "Understanding student perceptions of flipped linear algebra classrooms via interpretable machine learning",
            "url": "https://arxiv.org/html/2309.16259v2",
            "venue": "arXiv, 2026"
          },
          {
            "title": "Using tracer particle kinematics to sense particle size in rotating drums",
            "url": "https://link.springer.com/article/10.1007/s10035-024-01493-5",
            "venue": "Granular Matter, 2024"
          },
          {
            "title": "Insights on the internal dynamics of bi-disperse granular flows from machine learning",
            "url": "https://link.springer.com/article/10.1007/s10035-023-01357-4",
            "venue": "Granular Matter, 2023"
          },
          {
            "title": "Classifying grains using behaviour-informed machine learning",
            "url": "https://www.nature.com/articles/s41598-022-18250-4",
            "venue": "Scientific Reports, 2022"
          }
        ]
      }
    },
    render: function (publications, ctx) { renderPublications(publications, ctx.labels); }
  });
})();
