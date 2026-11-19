# PDF-to-CAD Text Processing - Carrying Drawing Text into Editable CAD
<p>Extracting the text from PDF drawings, dimensions, labels, room names and notes, and processing it so that it lands in the right place, at the right size and angle, as editable text in the CAD drawing produced by PDF-to-CAD conversion.</p>
<p><strong>Keywords</strong></p>
<div class="fact-grid">
<div class="fact"><span class="fact-label">Domain</span><span class="fact-value">CAD conversion</span></div>
<div class="fact"><span class="fact-label">Input</span><span class="fact-value">PDF drawings, vector and scanned</span></div>
<div class="fact"><span class="fact-label">Output</span><span class="fact-value">Editable CAD text, placed and sized</span></div>
<div class="fact"><span class="fact-label">Period</span><span class="fact-value">Dec 2025 · Jul 2026</span></div>
</div>
<figure class="figure-small">
<img src="images/drawing_sample.png" alt="A unit floor plan with dimension strings, room names and notes, the kind of drawing text the conversion has to carry over">
<figcaption>A floor plan as it arrives in a PDF: every dimension, room name and note on it has to become editable CAD text.</figcaption>
</figure>

---

## 1. Introduction
<p>When a PDF drawing is converted to CAD, the lines come across but the text is the hard part. In a vector PDF the characters are there but scattered, rotated and split into fragments; in a scanned PDF they are only pixels. This project reads the text either way, joins fragments back into whole strings, works out each string's position, height and rotation, and writes it into the CAD drawing as real text entities on the right layers, so the result can be edited rather than redrawn.</p>

---

## 2. Goal
<div class="callout callout-goal">
<h4>Goal</h4>
<ul>
<li>Extract text from both vector and scanned PDF drawings, with position, height and rotation.</li>
<li>Rebuild split and rotated fragments into whole dimension strings, labels and notes.</li>
<li>Write the text into the converted CAD drawing as editable entities on sensible layers.</li>
</ul>
</div>

---

## 3. Code and details on GitHub
<p>The main project and its technical details are uploaded to GitHub, so please refer to the repository to understand the work in detail.</p>
<p><a href="https://github.com/Laudarisd" target="_blank" rel="noopener noreferrer">GitHub: https://github.com/Laudarisd</a></p>
