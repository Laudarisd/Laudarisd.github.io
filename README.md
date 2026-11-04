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

```text
.
├── index.html          # Main page layout only (no content)
├── js/site.js          # Loads data/*.json and projects/*, renders the main page
├── js/project.js       # Renders a project detail page
├── css/style.css       # Layout, responsive styles, and themes
├── css/project.css     # Styles used only by the project detail pages
├── data/               # Main-page content: one folder per section, en.json + kr.json inside
├── projects/           # index.json (groups + order) and one self-contained folder per project
│   └── <slug>/         # index.html, en.json, kr.json, thumbnail, case-study Markdown, images/
├── tools/              # build_articles.py: embeds each folder's Markdown into its index.html
├── img/                # Portrait artwork
├── fonts/              # Local icon and font assets
└── static/             # Supporting generated assets
```

## Editing content (no HTML changes needed)

Every section is rendered from JSON in `data/`. Each section is a folder with an English and a Korean file (`en.json`, `kr.json`):

| Section | Folder |
| --- | --- |
| Header, section titles, labels | `data/ui/` |
| Hero (intro, buttons, highlights) | `data/hero/` |
| Degrees, honours & scholarships | `data/education/` |
| Experience timeline | `data/experience/` |
| Skill categories and chips | `data/skills/` |
| Publications | `data/publications/` |
| Patents | `data/patents/` |
| Projects (groups, cards, and detail pages) | `projects/` |
| Footer heading and links | `data/contact/` |

To add an item, copy an existing entry in the `items` array and edit its values, in both language files. For example, a new paper in `data/publications/en.json`:

```json
{
  "title": "Paper title",
  "url": "https://...",
  "venue": "Journal, 2026",
  "code_url": "https://github.com/..."
}
```

`code_url` is optional.

### Projects

Each project is a self-contained folder `projects/<slug>/`, named after the project title, containing `index.html` (the detail page), `en.json`, `kr.json`, the thumbnail image, and any case-study Markdown and images. The JSON holds the card (`title`, `description`, `image`, `image_alt`, `image_class`, `url` for the Code button) and the detail page (`subtitle`, `status`, `period`, `role`, `context`, `tags`, `overview`, `problem`, `architecture` (`steps`, or several named `flows`), `process` (numbered steps), `pipeline`, `stack`, `components` (table rows), `figures` (image files in the same folder with captions), `results`, `challenges`, `links`, ). Sections left empty are hidden on the detail page.

A project can also carry a full case study. Write it as a Markdown file in the project folder (any `*.md` is English; a `*_kr.md` file is Korean), then run `python tools/build_articles.py` (needs `pip install markdown` once). The script converts the Markdown to HTML and embeds both languages directly in that folder's `index.html`, so the published page contains the whole text; nothing is fetched at view time. Markdown supports headings (a table of contents is built from `##` headings), tables, fenced code blocks, images with paths relative to the project folder, and ```mermaid diagrams, which the page draws with mermaid. `status` is one of `completed`, `in_development`, `research`, `poc`; `image_class` can be `""`, `"project-image-logo"` (padded logo), or `"project-image-paper"` (paper figure).

`projects/index.json` defines the groups and the display order of the slugs. To add a project: copy an existing folder to `projects/<slug>/`, edit its `index.html` title, `en.json`, `kr.json`, and thumbnail, and add the slug to a group in `index.json`. The page URL is `projects/<slug>/`.

If a Korean file is missing for a section, the English file is used for that section.

## Language switching

The header has an `EN / 한국어` toggle. The chosen language is remembered in the browser and can be linked directly with `?lang=en` or `?lang=kr`. First-time visitors with a Korean browser see the Korean version.

## Local preview

Content is fetched from `data/`, so the site must be served over HTTP (opening `index.html` directly from disk will not load the content):

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
