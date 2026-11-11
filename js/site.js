/*
  Core loader for the portfolio.

  There are no data files: each section of the page is a folder of its own
  (hero/, experience/, skills/, education/, projects/, publications/, patents/,
  contact/) holding
    <section>.html   the markup fragment, pulled into index.html where a
                     <div data-include="..."> placeholder stands
    <section>.js     the content (both languages) and the renderer,
                     registered with Portfolio.register(...)
    <section>.css    styles that only that section needs (optional)
  and every project is a folder projects/<slug>/ with index.html, <slug>.js
  (its content), a thumbnail, and any case-study text and images.

  This file loads the section scripts listed in SECTION_FILES (a page can give
  its own list in the data-sections attribute of its <script> tag), pulls in
  the fragments, and renders every registered section in the active language.
  To edit content, open the section's .js file; to change its layout, edit its
  .html and .css.
*/
(function () {
  "use strict";

  // File suffix -> value for <html lang="...">
  var LANGS = { en: "en", kr: "ko" };
  var DEFAULT_LANG = "en";
  var STORAGE_KEY = "portfolio-lang";

  // Scripts that make up the main page, in render order. Each one registers itself with Portfolio.
  var SECTION_FILES = [
    "ui/ui.js",
    "hero/hero.js",
    "experience/experience.js",
    "skills/skills.js",
    "education/education.js",
    "projects/projects.js",
    "publications/publications.js",
    "patents/patents.js",
    "contact/contact.js"
  ];
  var thisScript = document.currentScript;
  var VERSION = thisScript && /[?&]v=([^&]+)/.test(thisScript.src) ? RegExp.$1 : "";
  if (thisScript && thisScript.getAttribute("data-sections")) {
    SECTION_FILES = thisScript.getAttribute("data-sections").split(",").map(function (s) { return s.trim(); });
  }

  var sections = [];      // registered by each <section>.js, in load order
  var uiContent = {};     // { en: {...}, kr: {...} } from ui/ui.js
  var projects = {};      // { slug: { en: {...}, kr: {...} } } from projects/<slug>/<slug>.js
  var loadedScripts = {}; // url -> promise, so a script is fetched once

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

  /* ---------- loading ---------- */

  // Add a <script> tag once and resolve when it has run.
  function loadScript(url) {
    if (!loadedScripts[url]) {
      loadedScripts[url] = new Promise(function (resolve, reject) {
        var script = document.createElement("script");
        script.src = url + (VERSION && url.indexOf("?") < 0 ? "?v=" + VERSION : "");
        script.onload = resolve;
        script.onerror = function () { reject(new Error("failed to load " + url)); };
        document.head.appendChild(script);
      });
    }
    return loadedScripts[url];
  }

  // Load the section scripts one after another so they register in page order.
  function loadSectionScripts() {
    return SECTION_FILES.reduce(function (chain, url) {
      return chain.then(function () { return loadScript(url); });
    }, Promise.resolve());
  }

  // Replace every <div data-include="path"> with the markup of that file (done once).
  function includeFragments() {
    var holders = Array.prototype.slice.call(document.querySelectorAll("[data-include]"));
    return Promise.all(holders.map(function (holder) {
      var path = holder.getAttribute("data-include");
      return fetch(path, { cache: "no-cache" }).then(function (response) {
        if (!response.ok) throw new Error(path + " -> " + response.status);
        return response.text();
      }).then(function (markup) {
        var template = document.createElement("template");
        template.innerHTML = markup.trim();
        holder.replaceWith(template.content);
      });
    }));
  }

  // Each section either carries its content (content.en / content.kr) or brings its own loader.
  function loadAll(lang) {
    var loaders = sections.map(function (section) {
      if (section.load) return section.load(lang);
      var content = section.content || {};
      return Promise.resolve(content[lang] || content[DEFAULT_LANG] || null);
    });
    return Promise.all(loaders).then(function (results) {
      return { ui: uiContent[lang] || uiContent[DEFAULT_LANG] || {}, sections: results };
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

  function renderAll(data) {
    var ui = data.ui || {};
    var ctx = { ui: ui, labels: ui.labels || {}, lang: currentLang };
    renderUI(ui);
    sections.forEach(function (section, i) {
      section.render(data.sections[i], ctx);
    });
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
        ? "콘텐츠를 불러오지 못했어요. HTTP 서버(예: python -m http.server)로 사이트를 실행한 뒤 새로 고침해 주세요."
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

  /* ---------- public API for the section scripts ---------- */

  window.Portfolio = {
    el: el,
    externalLink: externalLink,
    clear: clear,
    byId: byId,
    setText: setText,
    getPath: getPath,
    loadScript: loadScript,
    projects: projects,
    // Portfolio.ui({ en: {...}, kr: {...} }) from ui/ui.js
    ui: function (content) { uiContent = content || {}; },
    // Portfolio.project("slug", { en: {...}, kr: {...} }) from projects/<slug>/<slug>.js
    project: function (slug, content) { projects[slug] = content; },
    // Portfolio.register("hero", { content: { en, kr }, render: function (data, ctx) {...} })
    // or, for sections that load their own data: { load: function (lang) {...}, render: ... }
    register: function (name, section) {
      sections.push({ name: name, content: section.content, load: section.load, render: section.render });
    }
  };

  /* ---------- anchor links (#resume, #projects, #contact) ---------- */

  // The sticky header would otherwise cover the top of the section a link jumps to,
  // so reserve its height above every scroll target. Re-measured when the width changes.
  function syncScrollPadding() {
    var header = document.querySelector(".site-header");
    if (header) root.style.scrollPaddingTop = header.offsetHeight + 12 + "px";
  }

  // Sections are rendered after the page loads, so a link arriving with #section in the
  // URL has nothing to jump to yet. Jump again once the content is on the page.
  function scrollToHash() {
    var id = decodeURIComponent(window.location.hash.slice(1));
    var target = id ? document.getElementById(id) : null;
    if (target) target.scrollIntoView({ behavior: "instant", block: "start" });
  }

  window.addEventListener("resize", syncScrollPadding);

  // Load the section scripts, pull in the fragments, then render in the active language.
  Promise.all([loadSectionScripts(), includeFragments()])
    .then(function () { return applyLang(initialLang(), false); })
    .then(function () {
      syncScrollPadding();
      scrollToHash();
    })
    .catch(function (error) { showLoadError(initialLang(), error); });
})();
