# Smart Retail AI - Computer Vision for Real-Time Store Analytics
<p>Computer-vision prototypes for retail spaces: cameras that count people, follow movement through the aisles and watch shelf stock, with the models served behind REST endpoints so a dashboard or a store system can read the numbers as they happen.</p>
<p><strong>Keywords</strong></p>
<div class="fact-grid">
<div class="fact"><span class="fact-label">Domain</span><span class="fact-value">Retail analytics</span></div>
<div class="fact"><span class="fact-label">Signals</span><span class="fact-value">People counts · movement · shelf state</span></div>
<div class="fact"><span class="fact-label">Serving</span><span class="fact-value">REST inference services</span></div>
<div class="fact"><span class="fact-label">Latency</span><span class="fact-value">Real time, per camera frame</span></div>
</div>
<figure class="figure-small">
<img src="images/photo.jpg" alt="A grocery store aisle with stocked shelves on both sides and a shopper with a cart at the far end">
<figcaption>A store aisle is the input: shelves to watch, people to count, and movement to follow, all from one camera. Photo: Tessa Bury, CC BY 4.0, via Wikimedia Commons.</figcaption>
</figure>

---

## 1. Introduction
<p>A store already has cameras; what it lacks is the numbers. How many people came in this hour, where did they slow down, which shelf ran empty and when. These prototypes put detection and tracking models on the camera feeds to produce those numbers continuously, and wrap each model in a small REST service so the result is one HTTP call away for whatever system needs it.</p>

---

## 2. Goal
<div class="callout callout-goal">
<h4>Goal</h4>
<ul>
<li>Count and track people in a store from ordinary camera feeds, in real time.</li>
<li>Detect shelf state such as empty slots so restocking can be triggered by the picture rather than by a walk-through.</li>
<li>Serve every model as a REST endpoint with a stable schema, so analytics and store systems integrate without touching the model code.</li>
</ul>
</div>

---

## 3. Code and details on GitHub
<p>The main project and its technical details are uploaded to GitHub, so please refer to the repository to understand the work in detail.</p>
<p><a href="https://github.com/Laudarisd" target="_blank" rel="noopener noreferrer">GitHub: https://github.com/Laudarisd</a></p>
