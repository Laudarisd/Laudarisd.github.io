/* Project detail page renderer (projects/<slug>/index.html).
   The page's content comes from <slug>.js in the same folder (Portfolio.project), labels from ui/ui.js,
   and the footer from contact/. A long case study (built from the folder's Markdown by
   projects/build_articles.py) is embedded in the page itself; this file draws its diagrams
   and highlights its code blocks. */
(function () {
  "use strict";
  var el = Portfolio.el, externalLink = Portfolio.externalLink, clear = Portfolio.clear;
  var byId = Portfolio.byId, setText = Portfolio.setText;

  // Long-form case studies are embedded in the page itself (built from PORTFOLIO*.md by
  // projects/build_articles.py). Mermaid, loaded on demand, draws their ```mermaid diagrams.
  var MERMAID_URL = "https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js";
  var mermaidLoaded = null;

  // Code blocks are highlighted with highlight.js (common languages bundle + nginx), loaded on demand.
  var HLJS_URL = "https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.9.0/highlight.min.js";
  var HLJS_NGINX_URL = "https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.9.0/languages/nginx.min.js";
  var hljsLoaded = null;
  // Fence names used in the Markdown that highlight.js knows under another name.
  var LANG_ALIAS = { html: "xml", dotenv: "ini", env: "ini", text: "plaintext", txt: "plaintext", promql: "plaintext", console: "bash", sh: "bash", shell: "bash" };


  // Bulleted list that reuses the record-list style from the main page.
  function bulletList(items) {
    var list = el("ul", { class: "record-list" });
    (items || []).forEach(function (item) {
      list.appendChild(el("li", { text: item }));
    });
    return list;
  }


  function loadMermaid() {
    if (!mermaidLoaded) {
      mermaidLoaded = new Promise(function (resolve, reject) {
        var script = document.createElement("script");
        script.src = MERMAID_URL;
        script.onload = function () {
          // Stop mermaid drawing on its own (with its default colours) before our theme is set.
          window.mermaid.initialize({ startOnLoad: false });
          resolve();
        };
        script.onerror = function () { reject(new Error("failed to load " + MERMAID_URL)); };
        document.head.appendChild(script);
      });
    }
    return mermaidLoaded;
  }

  // Draw every undrawn <pre class="mermaid"> inside `wrap`, using the site's theme colours.
  function renderMermaid(wrap) {
    var nodes = wrap.querySelectorAll("pre.mermaid:not([data-processed])");
    if (!nodes.length) return Promise.resolve();
    // Wait for web fonts so mermaid measures labels with the final font (otherwise boxes clip text).
    var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    return Promise.all([loadMermaid(), fontsReady]).then(function () {
      var css = getComputedStyle(document.documentElement);
      var pick = function (name, fallback) { return css.getPropertyValue(name).trim() || fallback; };
      window.mermaid.initialize({
        startOnLoad: false,
        deterministicIds: true, // unique, stable ids per diagram instead of clock-based ones
        deterministicIDSeed: "pf",
        theme: "base",
        fontFamily: "Manrope, Noto Sans KR, sans-serif",
        themeVariables: {
          fontSize: "14px",
          primaryColor: pick("--surface", "#fffdf9"),
          primaryTextColor: pick("--text", "#1f2933"),
          primaryBorderColor: pick("--accent", "#284b52"),
          lineColor: pick("--accent", "#284b52"),
          secondaryColor: pick("--surface", "#fffdf9"),
          tertiaryColor: pick("--surface", "#fffdf9")
        }
      });
      return window.mermaid.run({ nodes: nodes });
    });
  }

  function loadScriptOnce(url) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = url;
      script.onload = resolve;
      script.onerror = function () { reject(new Error("failed to load " + url)); };
      document.head.appendChild(script);
    });
  }

  function loadHljs() {
    if (!hljsLoaded) {
      hljsLoaded = loadScriptOnce(HLJS_URL).then(function () { return loadScriptOnce(HLJS_NGINX_URL); });
    }
    return hljsLoaded;
  }

  // Wrap every <pre><code> in a card with a language label and a copy button, then highlight it.
  function renderCode(wrap) {
    var blocks = [];
    wrap.querySelectorAll("pre > code").forEach(function (code) {
      var pre = code.parentNode;
      if (pre.classList.contains("mermaid") || pre.parentNode.classList.contains("code-block")) return;
      var match = /language-([\w-]+)/.exec(code.className || "");
      var lang = match ? match[1].toLowerCase() : "text";
      var hlLang = LANG_ALIAS[lang] || lang;
      code.className = "language-" + hlLang;

      var copy = el("button", { class: "code-copy", type: "button", text: "Copy" });
      copy.addEventListener("click", function () {
        var done = function () { copy.textContent = "Copied"; setTimeout(function () { copy.textContent = "Copy"; }, 1500); };
        if (navigator.clipboard) navigator.clipboard.writeText(code.textContent).then(done);
      });
      var card = el("div", { class: "code-block" }, [
        el("div", { class: "code-head" }, [el("span", { class: "code-lang", text: lang }), copy])
      ]);
      pre.parentNode.insertBefore(card, pre);
      card.appendChild(pre);
      if (hlLang !== "plaintext") blocks.push(code);
    });
    if (!blocks.length) return;
    loadHljs().then(function () {
      blocks.forEach(function (code) { window.hljs.highlightElement(code); });
    }).catch(function (error) { console.error("[portfolio] highlight", error); });
  }

  // Show the embedded article for the current language (if the page has one) and draw its diagrams.
  function renderArticle(lang) {
    var panel = byId("panel-article");
    if (!panel) return null;
    var articles = panel.querySelectorAll(".project-article[data-lang]");
    if (!articles.length) {
      panel.hidden = true;
      return null;
    }
    panel.hidden = false;
    var shown = null;
    articles.forEach(function (article) {
      var match = article.getAttribute("data-lang") === lang;
      article.hidden = !match;
      if (match) shown = article;
    });
    if (!shown) { // no translation: fall back to English
      shown = panel.querySelector('.project-article[data-lang="en"]') || articles[0];
      shown.hidden = false;
    }
    renderMermaid(shown).catch(function (error) { console.error("[portfolio] mermaid", error); });
    renderCode(shown);
    return shown;
  }

  // Collapsible sections: each numbered heading gets a small arrow that hides or shows the text
  // below it (up to the next heading or rule). The wrapping happens once per article.
  function makeCollapsible(article, label) {
    if (!article || article.getAttribute("data-collapsible")) return;
    article.setAttribute("data-collapsible", "true");
    article.querySelectorAll("h2[id]").forEach(function (heading) {
      var body = el("div", { class: "section-body" });
      var next = heading.nextSibling;
      while (next && !(next.nodeType === 1 && (next.tagName === "H2" || next.tagName === "HR"))) {
        var node = next;
        next = next.nextSibling;
        body.appendChild(node);
      }
      heading.parentNode.insertBefore(body, heading.nextSibling);
      var toggle = el("button", { class: "section-toggle", type: "button", "aria-expanded": "true", "aria-label": label, title: label });
      toggle.appendChild(el("span", { "aria-hidden": "true", text: "▾" }));
      toggle.addEventListener("click", function () {
        var open = body.hidden; // currently hidden -> open it
        body.hidden = !open;
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        heading.classList.toggle("is-collapsed", !open);
      });
      heading.appendChild(toggle);
    });
  }

  // A contents link into a collapsed section opens it first.
  function expandHashTarget() {
    var id = decodeURIComponent(window.location.hash.slice(1));
    var heading = id ? document.getElementById(id) : null;
    if (heading && heading.classList.contains("is-collapsed")) heading.querySelector(".section-toggle").click();
  }
  window.addEventListener("hashchange", expandHashTarget);

  // "Back to top" arrow at the bottom right: shows once the page is scrolled, scrolls smoothly to the top.
  function addBackToTop(label) {
    if (byId("back-to-top")) return;
    var button = el("button", { id: "back-to-top", class: "back-to-top", type: "button", "aria-label": label, title: label });
    button.appendChild(el("span", { "aria-hidden": "true", text: "↑" }));
    button.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    document.body.appendChild(button);
    var update = function () { button.classList.toggle("is-visible", window.scrollY > 400); };
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  // Left column: links to the case-study sections (if any) and to every visible panel.
  function renderContents(article) {
    var aside = byId("detail-aside"), list = byId("detail-toc");
    if (!aside || !list) return;
    clear(list);
    if (article) {
      // Reuse the contents list built into the article by projects/build_articles.py.
      article.querySelectorAll(".article-toc li").forEach(function (item) {
        list.appendChild(item.cloneNode(true));
      });
    }
    document.querySelectorAll(".detail-panel:not([hidden])").forEach(function (panel) {
      if (panel.id === "panel-article") return; // its sections are listed above
      var heading = panel.querySelector("h2");
      if (!heading || !heading.textContent) return;
      list.appendChild(el("li", null, [el("a", { href: "#" + panel.id, text: heading.textContent })]));
    });
    aside.hidden = !list.children.length;
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

  // Figures live in the project folder next to the page.
  function figureGrid(figures) {
    if (!figures || !figures.length) return null;
    var grid = el("div", { class: "figure-grid" });
    figures.forEach(function (figure) {
      grid.appendChild(
        el("figure", { class: "figure-card" }, [
          el("img", { src: figure.file, alt: figure.alt || figure.caption || "" }),
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


  // The slug is on <main data-project="...">; its content was registered by <slug>.js.
  function currentContent(lang) {
    var main = document.querySelector("main[data-project]");
    var content = main ? Portfolio.projects[main.getAttribute("data-project")] : null;
    return Promise.resolve(content ? content[lang] || content.en : null);
  }

  Portfolio.register("project", {
    load: currentContent,
    render: function (project, ctx) {
      renderProject(project, ctx.ui);
      var labels = ctx.ui.project_page || {};
      var article = renderArticle(ctx.lang);
      renderContents(article);
      makeCollapsible(article, labels.collapse || "Collapse or expand this section");
      addBackToTop(labels.back_to_top || "Back to top");
    }
  });
})();
