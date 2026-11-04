/* Patents: application list from patents/<lang>.json. */
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

  Portfolio.register("patents", { render: function (patents, ctx) { renderPatents(patents, ctx.labels); } });

})();
