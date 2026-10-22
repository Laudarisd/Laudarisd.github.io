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
├── index.html          # Page layout only (no content)
├── js/site.js          # Loads data/*.json and renders every section
├── data/               # All page content, one JSON file per section and language
├── css/style.css       # Layout, responsive styles, and themes
├── img/                # Portrait and project artwork
├── fonts/              # Local icon and font assets
└── static/             # Supporting generated assets
```

## Editing content (no HTML changes needed)

Every section is rendered from JSON in `data/`. Each section has an English and a Korean file:

| Section | Files |
| --- | --- |
| Header, section titles, labels | `ui_en.json`, `ui_kr.json` |
| Hero (intro, buttons, highlights) | `hero_en.json`, `hero_kr.json` |
| Degrees, honours & scholarships | `education_en.json`, `education_kr.json` |
| Experience timeline | `experience_en.json`, `experience_kr.json` |
| Skill categories and chips | `skills_en.json`, `skills_kr.json` |
| Publications | `publications_en.json`, `publications_kr.json` |
| Patents | `patents_en.json`, `patents_kr.json` |
| Project cards | `projects_en.json`, `projects_kr.json` |
| Footer heading and links | `contact_en.json`, `contact_kr.json` |

To add an item, copy an existing entry in the `items` array and edit its values, in both language files. For example, a new paper in `publications_en.json`:

```json
{
  "title": "Paper title",
  "url": "https://...",
  "venue": "Journal, 2026",
  "code_url": "https://github.com/..."
}
```

`code_url` is optional. For projects, `image_class` can be `""`, `"project-image-logo"` (padded logo), or `"project-image-paper"` (paper figure).

If a Korean file is missing for a section, the English file is used for that section.

## Language switching

The header has an `EN / 한국어` toggle. The chosen language is remembered in the browser and can be linked directly with `?lang=en` or `?lang=kr`. First-time visitors with a Korean browser see the Korean version.

## Local preview

Content is fetched from `data/*.json`, so the site must be served over HTTP (opening `index.html` directly from disk will not load the content):

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
