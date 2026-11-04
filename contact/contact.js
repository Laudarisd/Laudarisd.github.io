/* Contact: footer heading and links from contact/<lang>.json. */
(function () {
  "use strict";
  var el = Portfolio.el, externalLink = Portfolio.externalLink, clear = Portfolio.clear;
  var byId = Portfolio.byId, setText = Portfolio.setText;

  function renderContact(contact) {
    if (!contact) return;
    setText("contact-heading", contact.heading);
    var links = byId("contact-links");
    if (!links) return;
    clear(links);
    (contact.links || []).forEach(function (link) {
      var isMail = /^mailto:/i.test(link.url || "");
      links.appendChild(
        isMail
          ? el("a", { href: link.url, text: link.label })
          : externalLink(link.url, link.label)
      );
    });
  }

  Portfolio.register("contact", { render: function (contact) { renderContact(contact); } });

})();
