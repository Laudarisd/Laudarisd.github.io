/*
  Content loader for the portfolio.

  Every section of the page is rendered from a JSON file in /data:
    data/<section>/<lang>.json      e.g. data/hero/en.json, data/hero/kr.json

  Projects are special: data/projects/index.json lists the groups and the
  order of the project folders, and each folder data/projects/<slug>/ holds
  en.json, kr.json, and the thumbnail image.

  To add a paper, patent, project, skill, etc. edit the JSON file for both
  languages. The HTML structure and CSS never need to change.
*/
(function () {
  "use strict";

  var SECTIONS = [
    "ui",
    "hero",
    "education",
    "experience",
    "skills",
    "publications",
    "patents",
    "contact"
  ];

  // File suffix -> value for <html lang="...">
  var LANGS = { en: "en", kr: "ko" };
  var DEFAULT_LANG = "en";
  var STORAGE_KEY = "portfolio-lang";
  var DATA_DIR = "data/";

  var root = document.documentElement;
  var langToggles = document.querySelectorAll(".lang-toggle");
  var themeToggles = document.querySelectorAll(".theme-toggle");
  var currentLang = null;

  /* ---------- small DOM helpers ---------- */

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var value = attrs[key];
        if (value === null || value === undefined || value === "") return;
        if (key === "text") {
          node.textContent = value;
        } else if (key === "class") {
          node.className = value;
        } else {
          node.setAttribute(key, value);
        }
      });
    }
    if (children) {
      children.forEach(function (child) {
        if (child === null || child === undefined) return;
        node.appendChild(
          typeof child === "string" ? document.createTextNode(child) : child
        );
      });
    }
    return node;
  }

  function externalLink(href, label, className) {
    var attrs = { href: href, target: "_blank", rel: "noopener noreferrer" };
    if (className) attrs.class = className;
    attrs.text = label;
    return el("a", attrs);
  }

  function clear(node) {
    while (node && node.firstChild) node.removeChild(node.firstChild);
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function setText(id, value) {
    var node = byId(id);
    if (node && value !== undefined) node.textContent = value;
  }

  function getPath(obj, path) {
    return path.split(".").reduce(function (acc, key) {
      return acc && acc[key] !== undefined ? acc[key] : undefined;
    }, obj);
  }

  /* ---------- data loading ---------- */

  function fetchJSON(url) {
    return fetch(url, { cache: "no-cache" }).then(function (response) {
      if (!response.ok) throw new Error(url + " -> " + response.status);
      return response.json();
    });
  }

  // Load one section from data/<section>/<lang>.json; fall back to English if the translation is missing.
  function loadSection(section, lang) {
    var primary = DATA_DIR + section + "/" + lang + ".json";
    return fetchJSON(primary).catch(function (error) {
      if (lang === DEFAULT_LANG) throw error;
      console.warn("[portfolio] " + primary + " missing, falling back to " + DEFAULT_LANG);
      return fetchJSON(DATA_DIR + section + "/" + DEFAULT_LANG + ".json");
    });
  }

  // Projects: read index.json for the groups, then every project folder listed in it.
  function loadProjects(lang) {
    return fetchJSON(DATA_DIR + "projects/index.json").then(function (index) {
      var slugs = [];
      (index.categories || []).forEach(function (category) {
        (category.items || []).forEach(function (slug) {
          slugs.push(slug);
        });
      });
      return Promise.all(
        slugs.map(function (slug) {
          return loadSection("projects/" + slug, lang);
        })
      ).then(function (results) {
        var items = {};
        slugs.forEach(function (slug, i) {
          items[slug] = results[i];
        });
        return { index: index, items: items };
      });
    });
  }

  function loadAll(lang) {
    var loaders = SECTIONS.map(function (section) {
      return loadSection(section, lang);
    });
    loaders.push(loadProjects(lang));
    return Promise.all(loaders).then(function (results) {
      var data = {};
      SECTIONS.forEach(function (section, index) {
        data[section] = results[index];
      });
      data.projects = results[SECTIONS.length];
      return data;
    });
  }

  /* ---------- renderers (markup mirrors the original static HTML) ---------- */

  function renderUI(ui) {
    if (!ui) return;

    if (ui.page_title) document.title = ui.page_title;
    var meta = document.querySelector('meta[name="description"]');
    if (meta && ui.meta_description) meta.setAttribute("content", ui.meta_description);

    setText("brand", ui.brand);

    // Any element with data-ui="dotted.path" gets its text from ui json.
    document.querySelectorAll("[data-ui]").forEach(function (node) {
      var value = getPath(ui, node.getAttribute("data-ui"));
      if (value !== undefined) node.textContent = value;
    });

    // Theme switcher tooltips / accessible labels.
    if (ui.themes) {
      themeToggles.forEach(function (toggle) {
        var key = toggle.getAttribute("data-theme-target");
        var name = ui.themes[key];
        if (!name) return;
        var aria = (ui.themes.switch_to || "Switch to {name} theme").replace("{name}", name);
        toggle.setAttribute("data-theme-label", name);
        toggle.setAttribute("aria-label", aria);
        toggle.setAttribute("title", name);
      });
    }
  }

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

  // One project card: thumbnail, title, description, and two buttons.
  // "More" opens js/projects/<slug>.html; "Code" opens the project's "url".
  function projectCard(slug, project, labels) {
    var folder = DATA_DIR + "projects/" + slug + "/";
    var imageClass = "project-image" + (project.image_class ? " " + project.image_class : "");
    var links = el("div", { class: "project-links" }, [
      el("a", { class: "project-btn project-btn-more", href: "js/projects/" + slug + ".html", text: labels.more })
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
        var name = category.name[lang] || category.name[DEFAULT_LANG] || "";
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

  function renderAll(data) {
    var ui = data.ui || {};
    var labels = ui.labels || {};
    renderUI(ui);
    renderHero(data.hero);
    renderEducation(data.education, labels);
    renderExperience(data.experience);
    renderSkills(data.skills);
    renderPublications(data.publications, labels);
    renderPatents(data.patents, labels);
    renderProjects(data.projects, labels, currentLang);
    renderContact(data.contact);
  }

  /* ---------- language handling ---------- */

  function normaliseLang(value) {
    if (!value) return null;
    value = String(value).toLowerCase();
    if (value === "ko" || value === "kr" || value.indexOf("ko-") === 0) return "kr";
    if (value === "en" || value.indexOf("en-") === 0) return "en";
    return LANGS[value] ? value : null;
  }

  function initialLang() {
    var fromUrl = normaliseLang(new URLSearchParams(window.location.search).get("lang"));
    if (fromUrl) return fromUrl;
    try {
      var stored = normaliseLang(localStorage.getItem(STORAGE_KEY));
      if (stored) return stored;
    } catch (e) { /* storage unavailable */ }
    var browser = normaliseLang(navigator.language || "");
    return browser || DEFAULT_LANG;
  }

  function markActiveLang(lang) {
    langToggles.forEach(function (toggle) {
      var isActive = toggle.getAttribute("data-lang") === lang;
      toggle.classList.toggle("is-active", isActive);
      toggle.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function showLoadError(lang, error) {
    console.error("[portfolio] failed to load content", error);
    var target = byId("hero-text");
    if (!target) return;
    var message =
      lang === "kr"
        ? "콘텐츠를 불러오지 못했어요. HTTP 서버(예: python3 -m http.server)로 사이트를 실행한 뒤 새로 고침해 주세요."
        : "Content could not be loaded. Please serve this site over HTTP (for example: python3 -m http.server) and reload.";
    target.textContent = message;
  }

  function applyLang(lang, updateUrl) {
    lang = LANGS[lang] ? lang : DEFAULT_LANG;
    currentLang = lang;
    root.setAttribute("lang", LANGS[lang]);
    root.setAttribute("data-lang", lang);
    markActiveLang(lang);

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }

    if (updateUrl && window.history && window.history.replaceState) {
      var url = new URL(window.location.href);
      url.searchParams.set("lang", lang);
      window.history.replaceState(null, "", url.toString());
    }

    return loadAll(lang)
      .then(function (data) {
        if (currentLang !== lang) return; // a newer switch won
        renderAll(data);
        root.classList.add("content-ready");
      })
      .catch(function (error) {
        showLoadError(lang, error);
      });
  }

  langToggles.forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      var lang = toggle.getAttribute("data-lang");
      if (lang !== currentLang) applyLang(lang, true);
    });
  });

  applyLang(initialLang(), false);
})();
