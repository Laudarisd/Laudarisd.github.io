/* Contact: footer heading and links.
   Everything this section needs is in this folder: contact.html (markup), contact.js (content + renderer).
   Edit the text under "content" below; both languages live here. */
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

  Portfolio.register("contact", {
    content: {
      en: {
        "heading": "Open to research, teaching, and collaboration",
        "links": [
          {
            "label": "GitHub",
            "url": "https://github.com/Laudarisd"
          },
          {
            "label": "LinkedIn",
            "url": "https://www.linkedin.com/in/laudari-sudip/"
          }
        ]
      },
      kr: {
        "heading": "연구, 강의, 협업 제안은 언제든 환영해요",
        "links": [
          {
            "label": "GitHub",
            "url": "https://github.com/Laudarisd"
          },
          {
            "label": "LinkedIn",
            "url": "https://www.linkedin.com/in/laudari-sudip/"
          }
        ]
      }
    },
    render: function (contact) { renderContact(contact); }
  });
})();
