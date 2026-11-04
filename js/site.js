/*
  Core loader for the portfolio.

  Each section of the page is a folder of its own (hero/, experience/, skills/,
  education/, projects/, publications/, patents/, contact/) holding:
    <section>.html   the markup fragment, pulled into index.html where a
                     <div data-include="..."> placeholder stands
    <section>.js     the renderer, registered with Portfolio.register(...)
    <section>.css    styles that only that section needs (optional)
    en.json, kr.json the content in both languages

  This file provides the shared helpers, loads the fragments, loads ui/<lang>.json
  (labels) and every registered section's JSON, and calls the renderers. To edit
  content, change the JSON; to change a section's layout, edit its own folder.
*/
(function () {
  "use strict";

  // File suffix -> value for <html lang="...">
  var LANGS = { en: "en", kr: "ko" };
  var DEFAULT_LANG = "en";
  var STORAGE_KEY = "portfolio-lang";
  var sections = []; // registered by each <section>/<section>.js

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

  // Load <folder>/<lang>.json; fall back to English if the translation is missing.
  function loadLang(folder, lang) {
    var primary = folder + "/" + lang + ".json";
    return fetchJSON(primary).catch(function (error) {
      if (lang === DEFAULT_LANG) throw error;
      console.warn("[portfolio] " + primary + " missing, falling back to " + DEFAULT_LANG);
      return fetchJSON(folder + "/" + DEFAULT_LANG + ".json");
    });
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

  // Labels first, then every registered section (each either loads <name>/<lang>.json or brings its own loader).
  function loadAll(lang) {
    var loaders = [loadLang("ui", lang)].concat(sections.map(function (section) {
      return section.load ? section.load(lang) : loadLang(section.name, lang);
    }));
    return Promise.all(loaders).then(function (results) {
      return { ui: results[0], sections: results.slice(1) };
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
    fetchJSON: fetchJSON,
    loadLang: loadLang,
    // Portfolio.register("hero", { render: function (data, ctx) {...}, load: optional function (lang) })
    register: function (name, section) {
      sections.push({ name: name, render: section.render, load: section.load });
    }
  };

  // Section scripts register themselves after this file; start once they have all run.
  document.addEventListener("DOMContentLoaded", function () {
    includeFragments()
      .then(function () { return applyLang(initialLang(), false); })
      .catch(function (error) { showLoadError(initialLang(), error); });
  });
})();
