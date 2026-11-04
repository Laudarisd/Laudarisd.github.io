/* Hero: title, intro text, buttons, and highlights from hero/<lang>.json. */
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

  Portfolio.register("hero", { render: function (hero) { renderHero(hero); } });

})();
