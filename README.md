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

Every section of the site is a folder of its own, so a section can be edited, restyled, or extended without touching the rest:

```text
.
├── index.html            # Page shell: header, section wrappers, and a placeholder per section
├── css/style.css         # Shared tokens, base layout, header, panels, footer, themes
├── js/site.js            # Core loader: helpers, fragment includes, language switching
├── ui/                   # Labels, menu text, section titles (en.json, kr.json)
├── hero/                 # hero.html, hero.js, hero.css, en.json, kr.json
├── experience/           # experience.html, experience.js, experience.css, en.json, kr.json
├── skills/               # skills.html, skills.js, skills.css, en.json, kr.json
├── education/            # degrees.html, honours.html, education.js, en.json, kr.json
├── publications/         # publications.html, publications.js, en.json, kr.json
├── patents/              # patents.html, patents.js, en.json, kr.json
├── contact/              # contact.html, contact.js, en.json, kr.json
├── projects/             # projects.html + projects.js + projects.css (card grid), index.json (groups),
│   ├── project.css       #   styles for the detail pages
│   ├── project.js        #   renderer for the detail pages
│   ├── build_articles.py #   embeds each project's Markdown case study into its index.html
│   └── <slug>/           #   index.html, en.json, kr.json, thumbnail, case-study Markdown, images/
├── img/                  # Portrait artwork
└── fonts/                # Local font assets
```

Each section folder contains:

| File | Purpose |
| --- | --- |
| `<section>.html` | The markup fragment. `index.html` pulls it in where `<div data-include="<section>/<section>.html">` stands. |
| `<section>.js` | The renderer. It calls `Portfolio.register("<section>", { render: ... })`, and the core loads `<section>/<lang>.json` and passes it in. |
| `<section>.css` | Styles that only this section uses (present for hero, experience, skills, projects). Shared styles stay in `css/style.css`. |
| `en.json`, `kr.json` | The content in both languages. |

## Editing content (no HTML changes needed)

To add an item, copy an existing entry in the section's `en.json` and `kr.json` and edit its values. For example, a new paper in `publications/en.json`:

```json
{
  "title": "Paper title",
  "url": "https://...",
  "venue": "Journal, 2026",
  "code_url": "https://github.com/..."
}
```

`code_url` is optional. If a Korean file is missing for a section, the English file is used for that section.

### Projects

Each project is a self-contained folder `projects/<slug>/`, named after the project title, containing `index.html` (the detail page), `en.json`, `kr.json`, the thumbnail image, and any case-study Markdown and images. The JSON holds the card (`title`, `description`, `image`, `image_alt`, `image_class`, `url` for the Code button) and the detail page (`subtitle`, `status`, `period`, `role`, `context`, `tags`, `overview`, `problem`, `architecture` (`steps`, or several named `flows`), `process`, `pipeline`, `stack`, `components`, `figures`, `results`, `challenges`, `links`). Sections left empty are hidden. `status` is one of `completed`, `in_development`, `research`, `poc`; `image_class` can be `""`, `"project-image-logo"` (padded logo), or `"project-image-paper"` (paper figure).

`projects/index.json` defines the groups and the display order of the slugs. To add a project: copy an existing folder to `projects/<slug>/`, edit its `index.html` title, `en.json`, `kr.json`, and thumbnail, and add the slug to a group in `index.json`. The page URL is `projects/<slug>/`.

A project can also carry a full case study. Write it as a Markdown file in the project folder (any `*.md` is English; a `*_kr.md` file is Korean), then run `python projects/build_articles.py` (needs `pip install markdown` once). The script converts the Markdown to HTML and embeds both languages directly in that folder's `index.html`, so the published page contains the whole text; nothing is fetched at view time. Markdown supports headings (a table of contents is built from `##` headings), tables, fenced code blocks (syntax-highlighted), images with paths relative to the project folder, and ```mermaid diagrams.

## Language switching

The header has an `EN / 한국어` toggle. The chosen language is remembered in the browser and can be linked directly with `?lang=en` or `?lang=kr`. First-time visitors with a Korean browser see the Korean version.

## Local preview

Content is fetched from the section folders, so the site must be served over HTTP (opening `index.html` directly from disk will not load the content):

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
