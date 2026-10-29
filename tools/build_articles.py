"""
Build step for long-form project pages.

For every project folder that has a Markdown case study (any "*.md" is English,
"*_kr.md" is Korean), this converts the Markdown to HTML and writes it directly into
js/projects/<slug>.html between the two marker comments:

    <!-- article:start -->  ...generated HTML...  <!-- article:end -->

The published page therefore contains the full text itself; nothing is fetched
at view time. Re-run this script after editing a Markdown file:

    pip install markdown      # once
    python tools/build_articles.py

```mermaid fences become <pre class="mermaid"> blocks, which js/project.js draws
with mermaid in the browser. Images use paths relative to the project folder.
"""
import html
import os
import re
import sys

try:
    import markdown
except ImportError:  # pragma: no cover
    sys.exit("The 'markdown' package is required: pip install markdown")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECTS = os.path.join(ROOT, "data", "projects")
PAGES = os.path.join(ROOT, "js", "projects")
LABELS = {"en": "Contents", "kr": "목차"}


def sources(folder):
    """Markdown files in a project folder: '*_kr.md' is Korean, any other '*.md' is English."""
    found = {}
    for name in sorted(os.listdir(folder)):
        if not name.lower().endswith(".md"):
            continue
        lang = "kr" if name.lower().endswith("_kr.md") else "en"
        found.setdefault(lang, name)
    return found
START, END = "<!-- article:start -->", "<!-- article:end -->"


def slugify(text):
    text = re.sub(r"<[^>]+>", "", text).lower()
    text = re.sub(r"[^a-z0-9ㄱ-힝]+", "-", text)
    return text.strip("-")


def convert(md_text, slug, lang):
    """Markdown -> HTML with the same post-processing the page used to do in JavaScript."""
    body = markdown.markdown(md_text, extensions=["tables", "fenced_code"])

    # ```mermaid blocks: keep the diagram source for mermaid to draw.
    def mermaid(m):
        return '<pre class="mermaid">' + html.unescape(m.group(1)) + "</pre>"
    body = re.sub(r'<pre><code class="language-mermaid">(.*?)</code></pre>', mermaid, body, flags=re.S)

    # Relative image paths point into the project folder (pages live two levels down).
    body = re.sub(r'src="(?!https?:|/|data:)([^"]+)"', rf'src="../../data/projects/{slug}/\1" loading="lazy"', body)

    # Tables reuse the component-table style and scroll on narrow screens.
    body = body.replace("<table>", '<div class="table-scroll"><table class="component-table">').replace("</table>", "</table></div>")

    # Section headings get anchors, and a table of contents links to them.
    toc = []
    def heading(m):
        anchor = slugify(m.group(1))
        toc.append(f'<li><a href="#{anchor}">{m.group(1)}</a></li>')
        return f'<h2 id="{anchor}">{m.group(1)}</h2>'
    body = re.sub(r"<h2>(.*?)</h2>", heading, body)

    nav = ""
    if toc:
        nav = f'<nav class="article-toc-wrap"><h4>{LABELS[lang]}</h4><ol class="article-toc">' + "".join(toc) + "</ol></nav>\n"
    return f'<div class="project-article" data-lang="{lang}" hidden>\n{nav}{body}\n</div>'


def build(slug):
    page_path = os.path.join(PAGES, slug + ".html")
    if not os.path.exists(page_path):
        print(f"skip {slug}: no page")
        return
    found = sources(os.path.join(PROJECTS, slug))
    if not found:
        return
    parts = []
    for lang in ("en", "kr"):
        if lang in found:
            with open(os.path.join(PROJECTS, slug, found[lang]), encoding="utf-8") as f:
                parts.append(convert(f.read(), slug, lang))
    with open(page_path, encoding="utf-8") as f:
        page = f.read()
    generated = START + "\n" + "\n".join(parts) + "\n" + END
    if START in page and END in page:
        page = page[: page.index(START)] + generated + page[page.index(END) + len(END):]
    else:
        # First build: place the article inside the empty panel body.
        marker = '<article class="panel detail-panel detail-panel-wide" id="panel-article">\n            <h2 data-ui="project_page.article"></h2>\n            <div class="panel-body">'
        assert marker in page, f"{slug}: article panel not found"
        page = page.replace(marker, marker + "\n" + generated + "\n            ", 1)
    with open(page_path, "w", encoding="utf-8", newline="") as f:
        f.write(page)
    print(f"built {slug}: {', '.join(found[l] for l in ('en', 'kr') if l in found)}")


if __name__ == "__main__":
    for slug in sorted(os.listdir(PROJECTS)):
        if os.path.isdir(os.path.join(PROJECTS, slug)):
            build(slug)
