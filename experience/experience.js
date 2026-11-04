/* Experience: timeline entries from experience/<lang>.json. */
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

  Portfolio.register("experience", { render: function (experience) { renderExperience(experience); } });

})();
