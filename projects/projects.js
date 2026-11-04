/* Projects: card grid from projects/index.json and each projects/<slug>/<lang>.json. */
(function () {
  "use strict";
  var el = Portfolio.el, externalLink = Portfolio.externalLink, clear = Portfolio.clear;
  var byId = Portfolio.byId, setText = Portfolio.setText;

  // One project card: thumbnail, title, description, and two buttons.
  // "More" opens projects/<slug>/; "Code" opens the project's "url".
  function projectCard(slug, project, labels) {
    var folder = "projects/" + slug + "/";
    var imageClass = "project-image" + (project.image_class ? " " + project.image_class : "");
    var links = el("div", { class: "project-links" }, [
      el("a", { class: "project-btn project-btn-more", href: folder, text: labels.more })
    ]);
    if (project.url) {
      links.appendChild(externalLink(project.url, labels.code_link, "project-btn project-btn-code"));
    }
    return el("article", { class: "project-card" }, [
      el("img", { src: folder + project.image, alt: project.image_alt || project.title, class: imageClass }),
      el("h3", { text: project.title }),
      el("p", { text: project.description }),
      links
    ]);
  }

  function renderProjects(projects, labels, lang) {
    if (!projects) return;
    var index = projects.index || {};
    var items = projects.items || {};
    var groups = byId("project-groups");
    if (groups) {
      clear(groups);
      // Each group in index.json gets a heading and a grid of the project folders it lists.
      (index.categories || []).forEach(function (category) {
        var grid = el("div", { class: "project-grid" });
        (category.items || []).forEach(function (slug) {
          if (items[slug]) grid.appendChild(projectCard(slug, items[slug], labels));
        });
        var name = category.name[lang] || category.name["en"] || "";
        groups.appendChild(
          el("section", { class: "project-category" }, [
            el("div", { class: "project-category-heading" }, [el("h3", { text: name })]),
            grid
          ])
        );
      });
    }

    var note = byId("projects-note");
    if (note) {
      clear(note);
      note.appendChild(document.createTextNode((labels.projects_note || "") + " "));
      note.appendChild(externalLink(index.more_url, labels.projects_note_link));
    }
  }

  // Read index.json for the groups, then every project folder it lists.
  function loadProjects(lang) {
    return Portfolio.fetchJSON("projects/index.json").then(function (index) {
      var slugs = [];
      (index.categories || []).forEach(function (category) {
        (category.items || []).forEach(function (slug) { slugs.push(slug); });
      });
      return Promise.all(slugs.map(function (slug) { return Portfolio.loadLang("projects/" + slug, lang); }))
        .then(function (results) {
          var items = {};
          slugs.forEach(function (slug, i) { items[slug] = results[i]; });
          return { index: index, items: items };
        });
    });
  }

  Portfolio.register("projects", {
    load: loadProjects,
    render: function (projects, ctx) { renderProjects(projects, ctx.labels, ctx.lang); }
  });

})();
