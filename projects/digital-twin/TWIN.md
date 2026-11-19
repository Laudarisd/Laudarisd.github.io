# Digital Twin - Floor-Plan Reconstruction and Spatial Intelligence
<p>Building a digital model of a real space and keeping it linked to the physical assets in it: reconstructing floor plans from scans and images, placing objects in them, and answering spatial questions about the result.</p>
<p><strong>Keywords</strong></p>
<div class="fact-grid">
<div class="fact"><span class="fact-label">Domain</span><span class="fact-value">Digital twin · spatial AI</span></div>
<div class="fact"><span class="fact-label">Inputs</span><span class="fact-value">Scans · point clouds · plan images</span></div>
<div class="fact"><span class="fact-label">Output</span><span class="fact-value">Reconstructed plan with linked assets</span></div>
<div class="fact"><span class="fact-label">Language</span><span class="fact-value">Python</span></div>
</div>
<figure class="figure-small">
<img src="images/photo.jpg" alt="A lidar point cloud of a city intersection, buildings and roads rendered as coloured points">
<figcaption>A lidar point cloud: millions of measured points that a digital twin turns back into walls, floors and objects. Photo: Daniel L. Lu, CC BY 4.0, via Wikimedia Commons.</figcaption>
</figure>

---

## 1. Introduction
<p>A digital twin is only useful if it matches the building it stands for. That starts with geometry: taking a scan, a point cloud or a plan image and recovering the walls, rooms and openings as clean, measurable shapes. On top of that geometry sit the assets, each one tied to its real counterpart, so the model can answer questions a person would otherwise walk the building to check: what is in this room, how far is it from that door, what changed since last month.</p>

---

## 2. Goal
<div class="callout callout-goal">
<h4>Goal</h4>
<ul>
<li>Reconstruct a floor plan as clean geometry from scans, point clouds or raster plan images.</li>
<li>Link physical assets to their position in the model so the twin stays in step with the real space.</li>
<li>Answer spatial questions on the model, such as distances, adjacency and what is inside a room, through code rather than by hand.</li>
</ul>
</div>

---

## 3. Code and details on GitHub
<p>The main project and its technical details are uploaded to GitHub, so please refer to the repository to understand the work in detail.</p>
<p><a href="https://github.com/Laudarisd/digital-twin-and-spatial-ai" target="_blank" rel="noopener noreferrer">GitHub: https://github.com/Laudarisd/digital-twin-and-spatial-ai</a></p>
