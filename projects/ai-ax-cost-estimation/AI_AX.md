# AI AX Cost Estimation - From Floor-Plan Images to Quantitative Analysis
<p>An add-in for a CAD application that reads a floor-plan image, recognizes what is drawn on it, rebuilds it as CAD layers,
and produces a quantity take-off that an estimator can review. Detection, segmentation and OCR models run behind a service,
and every result is written back into the drawing and exported as a table.</p>
<p><strong>Main Process</strong></p>
<div class="fact-grid">
<div class="fact"><span class="fact-label">Input</span><span class="fact-value">Floor-plan images</span></div>
<div class="fact"><span class="fact-label">Models</span><span class="fact-value">Detection · segmentation · OCR</span></div>
<div class="fact"><span class="fact-label">Output</span><span class="fact-value">CAD layers · quantity tables · JSON</span></div>
<div class="fact"><span class="fact-label">Serving</span><span class="fact-value">FastAPI, batch and API</span></div>
<div class="fact"><span class="fact-label">Operations</span><span class="fact-value">systemd · nginx · Redis</span></div>
<div class="fact"><span class="fact-label">Monitoring</span><span class="fact-value">Prometheus · Grafana</span></div>
</div>
<figure class="figure-small">
<img src="2.png" alt="The AI recognition result inside the CAD application: a floor plan with recognized walls, windows, doors and spaces, beside the layer list">
<figcaption>The add-in inside the CAD application: a recognized floor plan on the left, and the layers it was rebuilt into on the right.</figcaption>
</figure>

---

## 1. Introduction
<p>Cost estimation starts from drawings, and many of those drawings arrive as images rather than as CAD files. A person has to read every wall,
window, door and room, measure them, and type the quantities into a sheet. That takes days on a large plan and the numbers are easy to get wrong.</p>
<p>This project does that reading automatically. The goal is the chain below: an image goes in, and a reviewable quantity table comes out,
with every recognized item placed back on the drawing so an estimator can check it.</p>
<pre class="mermaid">flowchart LR
    A[Floor-plan image]:::input --> B[AI recognition<br/>objects, regions, text]:::process
    B --> C[(Structured result<br/>JSON)]:::store
    C --> D[Rebuilt CAD layers]:::agent
    C --> E[Quantity take-off<br/>tables and Excel]:::output
</pre>

<hr />
<div class="part-divider"><span>Input &amp; Data Preprocessing</span></div>
<h2 id="2-input-and-preprocessing">2. Input and preprocessing</h2>
<p>A drawing is added to a project inside the CAD application, either one at a time or as a batch. Before any model runs, each image is validated,
rescaled and cleaned, which is what keeps small dimension text and thin wall lines readable at model resolution.</p>
<figure class="figure-small">
<img src="1.png" alt="The AI recognition dialog inside the CAD application, with an empty project ready to take drawings and the scale and floor settings">
<figcaption>Drawings are added to a project here, with their scale and floor range, then sent for recognition.</figcaption>
</figure>
<div class="callout callout-problem">
<h4>What preprocessing has to solve</h4>
<ul>
<li><strong>Scale varies.</strong> Every drawing is exported at a different size, so results must not depend on the pixel size of the input.</li>
<li><strong>Small text.</strong> Dimensions and room labels are tiny next to the walls, and naive downscaling destroys them.</li>
<li><strong>Noise.</strong> Scans and exports carry speckle, compression artefacts and hatching that confuse edges.</li>
<li><strong>Large sheets.</strong> A block plan does not fit in one pass and has to be processed in parts and reassembled.</li>
</ul>
</div>

<hr />
<div class="part-divider"><span>Model Training &amp; Inference</span></div>
<h2 id="3-models">3. Models</h2>
<p>Three model families run over the prepared image and their outputs are merged into one structured result.</p>
<pre class="mermaid">flowchart LR
    A[Prepared image]:::input --> D[Detection<br/>objects and classes]:::process
    A --> S[Segmentation<br/>regions and walls]:::process
    A --> O[OCR<br/>dimensions, marks, labels]:::process
    D --> R[(Structured result)]:::store
    S --> R
    O --> R
    R --> V[JSON · visualization<br/>· persistence]:::output
</pre>
<div class="table-scroll"><table class="component-table">
<thead>
<tr>
<th>Model</th>
<th>What it recovers</th>
<th>Framework</th>
</tr>
</thead>
<tbody>
<tr><td>Detection and classification</td><td>windows, doors, fixtures, columns and their type</td><td>PyTorch</td></tr>
<tr><td>Segmentation</td><td>rooms, slabs and wall regions, plus wall thickness</td><td>PyTorch</td></tr>
<tr><td>OCR</td><td>dimension text, opening marks and room names</td><td>CRNN and Paddle OCR</td></tr>
</tbody>
</table></div>
<p>The OCR recognizer is a CRNN: a convolutional stack reads the cropped text, a bidirectional sequence layer reads it left to right,
and a CTC head turns that into characters. The diagram below is illustrative and does not expose the deployed configuration.</p>
<pre class="mermaid">flowchart TB
    A[Text crop<br/>1 x 32 x 128]:::input --> B[Convolution + ReLU<br/>32 to 64 to 128 channels]:::process
    B --> C[Height aggregation<br/>32 time steps]:::process
    C --> D[Bidirectional sequence<br/>256 features]:::process
    D --> E[Character projection<br/>K class scores]:::process
    E --> F[CTC decoding]:::agent
    F --> G[Decoded text<br/>dimensions, marks, labels]:::output
</pre>

---

## 4. Recognition results
<p>Recognized items are written back into the drawing as named layers, so walls, openings, fixtures and spaces can each be shown or hidden.
Wall thickness recovered by the model fills the bearing and non-bearing values used when the drawing is rebuilt.</p>
<div class="figure-row figure-row-small figure-row-equal">
<figure>
<img src="1_domain_redraw.png" alt="The drawing regeneration dialog with the recognized layer list and the AI wall thickness values for bearing and non-bearing walls">
<figcaption>Rebuilding the drawing: the recognized layers, and the AI wall thickness used for bearing and non-bearing walls.</figcaption>
</figure>
<figure>
<img src="4_result.png" alt="A multi-unit floor plan rebuilt from a recognized image, with its layer list">
<figcaption>A multi-unit plan rebuilt from an image, with every recognized class on its own layer.</figcaption>
</figure>
</div>
<figure class="figure-small">
<img src="6_result.png" alt="A close-up of a recognized core: hall, elevator, stairs, doors and pipe shafts outlined in their class colours">
<figcaption>A close-up of one core: hall, elevator, stairs, doors and shafts, each recognized as its own object.</figcaption>
</figure>

---

## 5. Quantity take-off
<p>From the recognized drawing the add-in produces quantity tables, grouped by type and by size, with a subtotal per group and a total per sheet.
Walls, windows, doors, general objects, spaces and slabs each get their own tab, and the whole table exports to Excel.</p>
<div class="figure-row figure-row-small figure-row-equal">
<figure>
<img src="1_result.png" alt="The quantity take-off window with a wall table grouped by thickness, listing mark, bearing or non-bearing, construction type, thickness, height and length">
<figcaption>Wall take-off: every wall with its mark, bearing or non-bearing classification, thickness, height and length, subtotalled by thickness.</figcaption>
</figure>
<figure>
<img src="2_result.png" alt="The window tab of the take-off table, listing mark, size, width, height and quantity for each window">
<figcaption>Window take-off: mark, size, width, height and count for every window on the sheet.</figcaption>
</figure>
</div>
<div class="figure-row figure-row-small figure-row-equal">
<figure>
<img src="3_result.png" alt="A recognized drawing annotated with object labels, next to the same take-off table exported into Excel">
<figcaption>The annotated drawing beside the same table exported to Excel, ready for the estimator.</figcaption>
</figure>
<figure>
<img src="5_result.png" alt="The take-off window for a larger block plan, with wall groups and a sheet total">
<figcaption>The same take-off on a larger block plan, grouped by thickness with a sheet total.</figcaption>
</figure>
</div>

<hr />
<div class="part-divider"><span>Deployment</span></div>
<h2 id="6-serving-and-operations">6. Serving and operations</h2>
<p>The models run behind a FastAPI service rather than inside the CAD add-in, so the add-in sends a drawing and receives a structured result.
The service is supervised by systemd, published through a reverse proxy, and uses Redis for shared state such as queue depth and request history.</p>
<pre class="mermaid">flowchart LR
    C[CAD add-in<br/>authorized client]:::input --> N[Reverse proxy<br/>nginx]:::process
    N --> API[FastAPI service<br/>PyTorch inference]:::agent
    MDL[(Approved model<br/>artifacts)]:::store --> API
    SD[systemd supervisor]:::tool -.-> API
    API --> RDS[(Redis<br/>queue and state)]:::store
    API --> ARC[(Result archives)]:::store
    API --> MET[Metrics endpoint]:::output
    MET --> PRM[Prometheus]:::tool
    PRM --> GRF[Grafana and<br/>operator dashboard]:::output
</pre>
<div class="table-scroll"><table class="component-table">
<thead>
<tr>
<th>Component</th>
<th>Role</th>
</tr>
</thead>
<tbody>
<tr><td>FastAPI</td><td>request validation, orchestration, result packaging</td></tr>
<tr><td>systemd</td><td>process supervision, restart and recovery</td></tr>
<tr><td>nginx</td><td>reverse proxy in front of the service</td></tr>
<tr><td>Redis</td><td>shared state: queue depth, request outcomes, event history</td></tr>
</tbody>
</table></div>

---

## 7. Monitoring
<p>A long-running service needs its health to be visible, so request volume, failures, queue usage, database writes, file transfers and GPU memory
are all exported as metrics and shown on a dashboard. Prometheus scrapes the service and Grafana reads it, alongside a custom operator dashboard.</p>
<figure class="figure-small">
<img src="1_monitor.png" alt="The production monitoring dashboard: request count and success rate, active queue, database pipeline, transfers, CPU, memory, disk and GPU memory, with trend charts">
<figcaption>The operator dashboard: requests and success rate, queue usage, database writes and transfers, with host and GPU pressure beside them.</figcaption>
</figure>

---

## 8. Summary
<p>The system turns a floor-plan image into a reviewable quantity take-off. Detection, segmentation and OCR models recover objects, regions and text,
the result is written back into the drawing as CAD layers, and quantities are grouped into tables that export to Excel.
The models run behind a supervised FastAPI service with Redis-backed state, and its request, database and host metrics are visible on a live dashboard.</p>
<blockquote>
<p>Public project overview. Infrastructure values are illustrative. Model workflows describe engineering responsibilities without exposing proprietary processing logic.</p>
</blockquote>
