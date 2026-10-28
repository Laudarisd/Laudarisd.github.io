/*
  Renderer for the project detail pages in js/projects/*.html.

  Each page is an empty shell with data-project="<slug>" on <main>.
  Content comes from its own folder, data/projects/<slug>/<lang>.json, plus
  shared labels from data/ui/<lang>.json, so the EN / 한국어 switch works
  exactly like on the main page.
*/
(function () {
  "use strict";

  var ROOT = "../../"; // pages live in js/projects/, so site assets are two levels up
  var DATA_DIR = ROOT + "data/";

  var LANGS = { en: "en", kr: "ko" };
  var DEFAULT_LANG = "en";
  var STORAGE_KEY = "portfolio-lang"; // same key as site.js so the choice carries over

  var root = document.documentElement;
  var main = document.querySelector("main[data-project]");
  var slug = main ? main.getAttribute("data-project") : "";
  var PROJECT_FILE = "projects/" + slug; // -> data/projects/<slug>/<lang>.json
  var SECTIONS = ["ui", "contact", PROJECT_FILE];
  var langToggles = document.querySelectorAll(".lang-toggle");
  var themeToggles = document.querySelectorAll(".theme-toggle");
  var currentLang = null;

  /* ---------- small DOM helpers (same as site.js) ---------- */

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

  // Bulleted list that reuses the record-list style from the main page.
  function bulletList(items) {
    var list = el("ul", { class: "record-list" });
    (items || []).forEach(function (item) {
      list.appendChild(el("li", { text: item }));
    });
    return list;
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

  function loadAll(lang) {
    return Promise.all(
      SECTIONS.map(function (section) {
        return loadSection(section, lang);
      })
    ).then(function (results) {
      var data = {};
      SECTIONS.forEach(function (section, index) {
        data[section] = results[index];
      });
      return data;
    });
  }

  /* ---------- renderers ---------- */

  function renderUI(ui) {
    if (!ui) return;
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

  // Fill a panel body; hide the whole panel when there is nothing to show.
  function fillPanel(id, children) {
    var panel = byId(id);
    if (!panel) return;
    var body = panel.querySelector(".panel-body");
    clear(body);
    var hasContent = false;
    (children || []).forEach(function (child) {
      if (!child) return;
      body.appendChild(child);
      hasContent = true;
    });
    panel.hidden = !hasContent;
  }

  // Architecture diagram: labelled boxes joined by arrows (see .arch-flow in style.css).
  function flowDiagram(steps) {
    var flow = el("ol", { class: "arch-flow" });
    steps.forEach(function (step, index) {
      if (index > 0) flow.appendChild(el("li", { class: "arch-arrow", "aria-hidden": "true", text: "→" }));
      flow.appendChild(
        el("li", { class: "arch-step" }, [
          el("strong", { text: step.label }),
          step.detail ? el("span", { text: step.detail }) : null
        ])
      );
    });
    return flow;
  }

  // "architecture" is either { steps: [...] } or { flows: [{ title, steps }, ...] } for several pipelines.
  function architectureFlows(architecture) {
    if (!architecture) return [];
    var parts = [];
    (architecture.flows || []).forEach(function (flow) {
      if (flow.title) parts.push(el("h4", { text: flow.title }));
      parts.push(flowDiagram(flow.steps || []));
    });
    if (architecture.steps && architecture.steps.length) parts.push(flowDiagram(architecture.steps));
    return parts;
  }

  // Numbered development steps, each with a short bullet list.
  function processList(steps) {
    if (!steps || !steps.length) return null;
    var list = el("ol", { class: "process-list" });
    steps.forEach(function (step) {
      list.appendChild(el("li", null, [el("h4", { text: step.title }), bulletList(step.items)]));
    });
    return list;
  }

  // Component / role / technology table.
  function componentTable(components, labels) {
    if (!components || !components.length) return null;
    var head = el("tr", null, [
      el("th", { text: labels.component }),
      el("th", { text: labels.component_role }),
      el("th", { text: labels.component_tech })
    ]);
    var body = el("tbody");
    components.forEach(function (row) {
      body.appendChild(el("tr", null, [el("td", { text: row.name }), el("td", { text: row.role }), el("td", { text: row.tech })]));
    });
    return el("div", { class: "table-scroll" }, [el("table", { class: "component-table" }, [el("thead", null, [head]), body])]);
  }

  // Figures live next to the project JSON: data/projects/<slug>/<file>.
  function figureGrid(figures) {
    if (!figures || !figures.length) return null;
    var grid = el("div", { class: "figure-grid" });
    figures.forEach(function (figure) {
      grid.appendChild(
        el("figure", { class: "figure-card" }, [
          el("img", { src: DATA_DIR + PROJECT_FILE + "/" + figure.file, alt: figure.alt || figure.caption || "" }),
          figure.caption ? el("figcaption", { text: figure.caption }) : null
        ])
      );
    });
    return grid;
  }

  function stackGroups(stack) {
    if (!stack || !stack.length) return null;
    var wrap = el("div", { class: "stack-groups" });
    stack.forEach(function (group) {
      var chips = el("ul", { class: "skill-chip-list" });
      (group.items || []).forEach(function (item) {
        chips.appendChild(el("li", { text: item }));
      });
      wrap.appendChild(el("div", { class: "stack-group" }, [el("h4", { text: group.name }), chips]));
    });
    return wrap;
  }

  function renderProject(project, ui) {
    var labels = ui.project_page || {};
    var statusLabels = (ui.labels && ui.labels.status) || {};

    if (!project) {
      setText("detail-title", labels.not_found || "Project not found.");
      return;
    }

    document.title = project.title + " | " + (ui.brand || "");
    setText("detail-title", project.title);
    setText("detail-subtitle", project.subtitle);

    // Status badge, period, role, and project context.
    var meta = byId("detail-meta");
    if (meta) {
      clear(meta);
      if (project.status) {
        var live = project.status === "in_development" || project.status === "research";
        meta.appendChild(
          el("span", {
            class: "project-status" + (live ? " project-status-live" : ""),
            text: statusLabels[project.status] || project.status
          })
        );
      }
      if (project.period) meta.appendChild(el("span", { text: project.period }));
      if (project.role) meta.appendChild(el("span", { text: labels.role + ": " + project.role }));
      if (project.context) meta.appendChild(el("span", { text: labels.context + ": " + project.context }));
    }

    var tags = byId("detail-tags");
    if (tags) {
      clear(tags);
      (project.tags || []).forEach(function (tag) {
        tags.appendChild(el("li", { text: tag }));
      });
    }

    fillPanel("panel-overview", [project.overview ? el("p", { text: project.overview }) : null]);
    fillPanel("panel-problem", [project.problem && project.problem.length ? bulletList(project.problem) : null]);
    fillPanel("panel-contributions", [
      project.contributions && project.contributions.length ? bulletList(project.contributions) : null
    ]);
    fillPanel(
      "panel-architecture",
      architectureFlows(project.architecture).concat([
        project.architecture && project.architecture.note
          ? el("p", { class: "arch-note", text: project.architecture.note })
          : null
      ])
    );
    fillPanel("panel-process", [processList(project.process)]);
    fillPanel("panel-pipeline", [project.pipeline && project.pipeline.length ? bulletList(project.pipeline) : null]);
    fillPanel("panel-stack", [stackGroups(project.stack)]);
    fillPanel("panel-components", [componentTable(project.components, labels)]);
    fillPanel("panel-figures", [figureGrid(project.figures)]);

    // Results and challenges share one panel with two sub-headings.
    var resultChildren = [];
    if (project.results && project.results.length) {
      resultChildren.push(el("h4", { text: labels.results_label }));
      resultChildren.push(bulletList(project.results));
    }
    if (project.challenges && project.challenges.length) {
      resultChildren.push(el("h4", { text: labels.challenges_label }));
      resultChildren.push(bulletList(project.challenges));
    }
    fillPanel("panel-results", resultChildren);

    var linkChildren = null;
    if (project.links && project.links.length) {
      linkChildren = el("div", { class: "detail-links" });
      project.links.forEach(function (link) {
        linkChildren.appendChild(
          link.url
            ? externalLink(link.url, link.label, "button button-secondary")
            : el("span", { class: "button button-secondary", text: link.label })
        );
      });
    }
    fillPanel("panel-links", [linkChildren]);
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
        isMail ? el("a", { href: link.url, text: link.label }) : externalLink(link.url, link.label)
      );
    });
  }

  function renderAll(data) {
    var ui = data.ui || {};
    renderUI(ui);
    renderProject(data[PROJECT_FILE], ui);
    renderContact(data.contact);
  }

  /* ---------- language handling (same behaviour as site.js) ---------- */

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
    var target = byId("detail-subtitle");
    if (!target) return;
    target.textContent =
      lang === "kr"
        ? "콘텐츠를 불러오지 못했어요. HTTP 서버(예: python3 -m http.server)로 사이트를 실행한 뒤 새로 고침해 주세요."
        : "Content could not be loaded. Please serve this site over HTTP (for example: python3 -m http.server) and reload.";
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
