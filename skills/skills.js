/* Skills: category rows and chips from skills/<lang>.json. */
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

  Portfolio.register("skills", { render: function (skills) { renderSkills(skills); } });

})();
