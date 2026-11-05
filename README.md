# Sudip Laudari — Academic Portfolio

Source code for [laudarisd.github.io](https://laudarisd.github.io/), the personal academic portfolio of Sudip Laudari.

The site presents my work as an applied mathematician and AI/ML researcher, with a focus on mathematical modelling, computational geometry, computer vision, remote sensing, geospatial analysis, generative AI, agentic systems, and engineering applications.

## Portfolio contents

- Academic degrees, honours, and scholarships
- Technical and research skills
- Professional experience
- Publications and pending patents
- Selected project collections
- Links for research, teaching, and collaboration

## Selected projects

The portfolio highlights work in eight areas:

- [Computer Vision & ML](https://github.com/Laudarisd/Machine-Learning-Projects)
- [Generative AI](https://github.com/Laudarisd/generative-ai)
- [Agent Collection](https://github.com/Laudarisd/agent-collection)
- [Vectra](https://github.com/Laudarisd/vectra)
- [Research](https://github.com/Laudarisd/research)
- [DMP & ESN](https://github.com/Laudarisd/dmp_esn)
- [Data Science](https://github.com/Laudarisd/data-science)
- [Digital Twin & Spatial AI](https://github.com/Laudarisd/digital-twin-and-spatial-ai)

## Built with

- HTML5
- CSS3
- Vanilla JavaScript
- GitHub Pages

The site is responsive, bilingual (English / Korean), and includes four selectable visual themes. Publication and patent panels use contained scrolling to keep the page layout compact.

## Repository structure

There are no data files. Every section of the site is a folder holding its own markup, script, and styles, and the script carries the content in both languages:

```text
.
├── index.html            # Page shell: header, section wrappers, and a placeholder per section
├── css/style.css         # Shared tokens, base layout, header, panels, footer, themes
├── js/site.js            # Core loader: loads the section scripts, pulls in fragments, switches language
├── ui/ui.js              # Labels, menu text, section titles (both languages)
├── hero/                 # hero.html, hero.js, hero.css
├── experience/           # experience.html, experience.js, experience.css
├── skills/               # skills.html, skills.js, skills.css
├── education/            # degrees.html, honours.html, education.js
├── publications/         # publications.html, publications.js
├── patents/              # patents.html, patents.js
├── contact/              # contact.html, contact.js
├── projects/             # projects.html, projects.js (groups + card grid), projects.css,
│   ├── project.css       #   styles for the detail pages
│   ├── project.js        #   renderer for the detail pages
│   ├── build_articles.py #   embeds each project's Markdown case study into its index.html
│   └── <slug>/           #   index.html, <slug>.js (content), thumbnail, case-study Markdown, images/
├── img/                  # Portrait artwork
└── fonts/                # Local font assets
```

Each section folder contains:

| File | Purpose |
| --- | --- |
| `<section>.html` | The markup fragment. `index.html` pulls it in where `<div data-include="<section>/<section>.html">` stands. |
| `<section>.js` | The content for both languages (`content: { en: {...}, kr: {...} }`) and the function that renders it, registered with `Portfolio.register("<section>", {...})`. |
| `<section>.css` | Styles that only this section uses (present for hero, experience, skills, projects). Shared styles stay in `css/style.css`. |

`js/site.js` lists the section scripts in `SECTION_FILES`, loads them in that order, and renders each one. A project page uses the same core with its own list in the `data-sections` attribute of its script tag.

## Editing content (no HTML changes needed)

Open the section's `.js` file and edit the text under `content`. To add an item, copy an existing entry in both `en` and `kr`. For example, a new paper in `publications/publications.js`:

```js
{
  title: "Paper title",
  url: "https://...",
  venue: "Journal, 2026",
  code_url: "https://github.com/..."
}
```

`code_url` is optional. If a section has no `kr` content, the `en` content is shown in both languages.

### Projects

Each project is a self-contained folder `projects/<slug>/`, named after the project title, containing `index.html` (the detail page), `<slug>.js` (the content in both languages, registered with `Portfolio.project("<slug>", { en: {...}, kr: {...} })`), the thumbnail image, and any case-study Markdown and images. The content holds the card (`title`, `description`, `image`, `image_alt`, `image_class`, `url` for the Code button) and the detail page (`subtitle`, `status`, `period`, `role`, `context`, `tags`, `overview`, `problem`, `architecture` (`steps`, or several named `flows`), `process`, `pipeline`, `stack`, `components`, `figures`, `results`, `challenges`, `links`). Sections left empty are hidden. `status` is one of `completed`, `in_development`, `research`, `poc`; `image_class` can be `""`, `"project-image-logo"` (padded logo), or `"project-image-paper"` (paper figure).

`GROUPS` at the top of `projects/projects.js` defines the groups and the display order of the slugs. To add a project: copy an existing folder to `projects/<slug>/`, rename and edit its `<slug>.js`, edit the `<title>` and `data-project` in its `index.html` and the `data-sections` list at the bottom of that file, replace the thumbnail, and add the slug to a group in `GROUPS`. The page URL is `projects/<slug>/`.

A project can also carry a full case study. Write it as a Markdown file in the project folder (any `*.md` is English; a `*_kr.md` file is Korean), then run `python projects/build_articles.py` (needs `pip install markdown` once). The script converts the Markdown to HTML and embeds both languages directly in that folder's `index.html`, so the published page contains the whole text; nothing is fetched at view time. Markdown supports headings (a table of contents is built from `##` headings), tables, fenced code blocks (syntax-highlighted), images with paths relative to the project folder, and ```mermaid diagrams.

## Language switching

The header has an `EN / 한국어` toggle. The chosen language is remembered in the browser and can be linked directly with `?lang=en` or `?lang=kr`. First-time visitors with a Korean browser see the Korean version.

## Local preview

Section fragments are fetched over HTTP, so the site must be served by a web server (opening `index.html` directly from disk will not load the content):

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deployment

GitHub Pages publishes the site from the `main` branch. Changes pushed to `main` are deployed at [laudarisd.github.io](https://laudarisd.github.io/).

## Connect

- [GitHub](https://github.com/Laudarisd)
- [Google Scholar](https://scholar.google.com/citations?user=zMb_f08AAAAJ&hl=en)
- [LinkedIn](https://www.linkedin.com/in/laudari-sudip/)
