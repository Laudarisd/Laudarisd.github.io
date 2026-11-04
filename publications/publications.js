/* Publications: paper list from publications/<lang>.json. */
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

  Portfolio.register("publications", { render: function (publications, ctx) { renderPublications(publications, ctx.labels); } });

})();
