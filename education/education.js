/* Education: degrees and honours from education/<lang>.json. */
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

  Portfolio.register("education", { render: function (education, ctx) { renderEducation(education, ctx.labels); } });

})();
