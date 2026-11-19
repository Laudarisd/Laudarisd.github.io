# AX Raster2BOM - From Floor-Plan Images to Quantitative Analysis
<p>An add-in for a CAD application that reads a floor-plan image, recognizes what is drawn on it, rebuilds it as CAD layers,
and produces a quantity take-off that an estimator can review.</p>
<p><strong>Main Goal of the Project</strong></p>
<div class="process-row">
<figure>
<img src="images/input/main_input.png" alt="Input: a floor-plan drawing exported as a plain image, with its dimensions and room labels">
<figcaption>Input: a floor-plan image.</figcaption>
</figure>
<span class="arch-arrow" aria-hidden="true">→</span>
<figure>
<img src="images/results/1_result.png" alt="Output: the same plan recognized inside the CAD application, with the quantity take-off table beside it">
<figcaption>Output: recognized CAD layers and the quantity take-off.</figcaption>
</figure>
</div>

<p><strong>Main Process</strong></p>
<div class="fact-grid">
<div class="fact"><span class="fact-label">Input</span><span class="fact-value">Floor-plan images</span></div>
<div class="fact"><span class="fact-label">Models</span><span class="fact-value">Detection · segmentation · OCR</span></div>
<div class="fact"><span class="fact-label">Output</span><span class="fact-value">CAD layers · quantity tables · JSON</span></div>
<div class="fact"><span class="fact-label">Serving</span><span class="fact-value">FastAPI · on-premises or AWS</span></div>
<div class="fact"><span class="fact-label">Runtime</span><span class="fact-value">PyTorch GPU · ONNX CPU</span></div>
<div class="fact"><span class="fact-label">Database</span><span class="fact-value">MySQL</span></div>
<div class="fact"><span class="fact-label">Operations</span><span class="fact-value">systemd · nginx · Redis</span></div>
<div class="fact"><span class="fact-label">Monitoring</span><span class="fact-value">Prometheus · Grafana</span></div>
</div>
<figure class="figure-small">
<img src="images/results/2.png" alt="The AI recognition result inside the CAD application: a floor plan with recognized walls, windows, doors and spaces, beside the layer list">
<figcaption>The add-in inside the CAD application: a recognized floor plan on the left, and the layers it was rebuilt into on the right.</figcaption>
</figure>

---

## 1. Introduction
<p>Cost estimation starts from drawings, and many of those drawings arrive as images rather than as CAD files. A person has to read every wall,
window, door and room, measure them, and type the quantities into a sheet. That takes days on a large plan and the numbers are easy to get wrong.</p>
<p>This project does that reading automatically. The picture below is the whole system: a user sends a floor-plan image from the CAD add-in
to the inference server, three model branches read it, every result is kept in a database, and three outputs come back.</p>
<pre class="mermaid">flowchart LR
    U[User<br/>CAD add-in]:::input --> S[Inference server<br/>on-premises or AWS<br/>PyTorch GPU · ONNX CPU]:::agent
    S --> D[Detection]:::process
    S --> G[Segmentation]:::process
    S --> O[OCR]:::process
    D --> R[(Structured result)]:::store
    G --> R
    O --> R
    R --> DB[(MySQL<br/>results database)]:::store
    R --> O1[CAD layers]:::output
    R --> O2[Quantity tables<br/>Excel]:::output
    R --> O3[JSON]:::output
</pre>

<hr />
<div class="part-divider"><span>Input &amp; Data Preprocessing</span></div>

## 2. Input and preprocessing
<p>A drawing is added to a project inside the CAD application, either one at a time or as a batch. Before any model runs, each image is validated,
rescaled and cleaned, which is what keeps small dimension text and thin wall lines readable at model resolution.</p>
<figure class="figure-small">
<img src="images/input/1.png" alt="The AI recognition dialog inside the CAD application, with an empty project ready to take drawings and the scale and floor settings">
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

## 3. Models
<p>Three model branches run over the prepared image. Each one recovers a different kind of information, writes its rows into its own
database table, and the three are merged into one structured result.</p>
<table>
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
</table>
<h3>3.1 Detection branch</h3>
<p>Finds every object on the plan and names its type. Each hit is stored with its class, confidence, angle and corner points.</p>
<pre class="mermaid">flowchart LR
    A[Prepared image]:::input --> M[Detection model<br/>PyTorch]:::process
    M --> W[Objects and classes<br/>windows, doors, fixtures, columns]:::agent
    W --> T[(detected_objects)]:::store
</pre>

<h3>3.2 Segmentation branch</h3>
<p>Recovers regions rather than boxes: rooms, slabs and wall areas, and from the wall areas their thickness. Each region is stored as a polygon.</p>
<pre class="mermaid">flowchart LR
    A[Prepared image]:::input --> M[Segmentation model<br/>PyTorch]:::process
    M --> W[Regions and walls<br/>rooms, slabs, wall thickness]:::agent
    W --> T[(segmentation_results)]:::store
</pre>

<h3>3.3 OCR branch</h3>
<p>Reads the text on the plan: dimension strings, opening marks and room names, each kept in its own table so it can be matched back to the object it labels.</p>
<pre class="mermaid">flowchart LR
    A[Prepared image]:::input --> M[OCR<br/>CRNN · Paddle OCR]:::process
    M --> W[Dimensions, marks, labels]:::agent
    W --> T[(dimension_ocr_results<br/>symbol_ocr_results<br/>space_ocr_results)]:::store
</pre>
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

## 4. Results database
<p>Every recognized item is stored in a MySQL database, one table per kind of result, and all of them keyed by the input image.
A row carries who ran it, which image, when, the class, the confidence and the geometry, so a result can be re-opened, compared or audited later.</p>
<div class="figure-row figure-row-small figure-row-equal">
<figure>
<img src="images/db/schema_tables.png" alt="MySQL Workbench showing the results schema: tables for input images, detected objects, wall detections, segmentation results and the three OCR result tables, beside the migration script that adds their foreign keys">
<figcaption>The schema: input_images, detected_objects, wall_detections, segmentation_results, background_dimension_regions and the dimension, symbol and space OCR tables. The script on the right links each result table to its input image.</figcaption>
</figure>
<figure>
<img src="images/db/segmentation_results_ddl.png" alt="The SQL that creates the segmentation_results table: id, user, image name, datetime, class, confidence and the polygon points as JSON, with indexes on id, image name, datetime and class">
<figcaption>One table definition: segmentation polygons and confidence scores, with indexes on image, time and class so a drawing's results can be fetched quickly.</figcaption>
</figure>
</div>
<figure class="figure-small">
<img src="images/db/detected_objects_rows.png" alt="A query over the detected_objects table returning over one million rows: each row has the image id, user, image name, datetime, class name and index, confidence, angle and corner points">
<figcaption>detected_objects in use: over a million rows, one per recognized object, each with its class, confidence, angle and corner points.</figcaption>
</figure>

---

## 5. Recognition results
<p>Recognized items are written back into the drawing as named layers, so walls, openings, fixtures and spaces can each be shown or hidden.
Wall thickness recovered by the model fills the bearing and non-bearing values used when the drawing is rebuilt.</p>
<div class="figure-row figure-row-small figure-row-equal">
<figure>
<img src="images/results/1_domain_redraw.png" alt="The drawing regeneration dialog with the recognized layer list and the AI wall thickness values for bearing and non-bearing walls">
<figcaption>Rebuilding the drawing: the recognized layers, and the AI wall thickness used for bearing and non-bearing walls.</figcaption>
</figure>
<figure>
<img src="images/results/4_result.png" alt="A multi-unit floor plan rebuilt from a recognized image, with its layer list">
<figcaption>A multi-unit plan rebuilt from an image, with every recognized class on its own layer.</figcaption>
</figure>
</div>
<figure class="figure-small">
<img src="images/results/6_result.png" alt="A close-up of a recognized core: hall, elevator, stairs, doors and pipe shafts outlined in their class colours">
<figcaption>A close-up of one core: hall, elevator, stairs, doors and shafts, each recognized as its own object.</figcaption>
</figure>

---

## 6. Quantity take-off
<p>From the recognized drawing the add-in produces quantity tables, grouped by type and by size, with a subtotal per group and a total per sheet.
Walls, windows, doors, general objects, spaces and slabs each get their own tab, and the whole table exports to Excel.</p>
<div class="figure-row figure-row-small figure-row-equal">
<figure>
<img src="images/results/1_result.png" alt="The quantity take-off window with a wall table grouped by thickness, listing mark, bearing or non-bearing, construction type, thickness, height and length">
<figcaption>Wall take-off: every wall with its mark, bearing or non-bearing classification, thickness, height and length, subtotalled by thickness.</figcaption>
</figure>
<figure>
<img src="images/results/2_result.png" alt="The window tab of the take-off table, listing mark, size, width, height and quantity for each window">
<figcaption>Window take-off: mark, size, width, height and count for every window on the sheet.</figcaption>
</figure>
</div>
<div class="figure-row figure-row-small figure-row-equal">
<figure>
<img src="images/results/3_result.png" alt="A recognized drawing annotated with object labels, next to the same take-off table exported into Excel">
<figcaption>The annotated drawing beside the same table exported to Excel, ready for the estimator.</figcaption>
</figure>
<figure>
<img src="images/results/5_result.png" alt="The take-off window for a larger block plan, with wall groups and a sheet total">
<figcaption>The same take-off on a larger block plan, grouped by thickness with a sheet total.</figcaption>
</figure>
</div>

<hr />
<div class="part-divider"><span>Deployment</span></div>

## 7. Serving and operations
<p>The models run behind a FastAPI service rather than inside the CAD add-in, so the add-in sends a drawing and receives a structured result.
The service is supervised by systemd, published through a reverse proxy, and uses Redis for shared state such as queue depth and request history.
The same service runs on-premises or on AWS, and an ONNX-based CPU build serves where no GPU is available.</p>
<pre class="mermaid">flowchart LR
    C[CAD add-in<br/>authorized client]:::input --> N[Reverse proxy<br/>nginx]:::process
    N --> API[FastAPI service<br/>PyTorch GPU · ONNX CPU]:::agent
    MDL[(Approved model<br/>artifacts)]:::store --> API
    SD[systemd supervisor]:::tool -.-> API
    API --> RDS[(Redis<br/>queue and state)]:::store
    API --> DB[(MySQL<br/>results)]:::store
    API --> ARC[(Result archives)]:::store
    API --> MET[Metrics endpoint]:::output
    MET --> PRM[Prometheus]:::tool
    PRM --> GRF[Grafana and<br/>operator dashboard]:::output
</pre>
<table>
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
<tr><td>MySQL</td><td>results: detections, segmentations and OCR rows per input image</td></tr>
<tr><td>ONNX Runtime</td><td>CPU build of the models for hosts without a GPU</td></tr>
</tbody>
</table>

---

## 8. Monitoring
<p>A long-running service needs its health to be visible, so request volume, failures, queue usage, database writes, file transfers and GPU memory
are all exported as metrics and shown on a dashboard. Prometheus scrapes the service and Grafana reads it, alongside a custom operator dashboard.</p>
<figure class="figure-small">
<img src="images/monitor/1_monitor.png" alt="The production monitoring dashboard: request count and success rate, active queue, database pipeline, transfers, CPU, memory, disk and GPU memory, with trend charts">
<figcaption>The operator dashboard: requests and success rate, queue usage, database writes and transfers, with host and GPU pressure beside them.</figcaption>
</figure>

---

## 9. Summary
<p>The system turns a floor-plan image into a reviewable quantity take-off. Detection, segmentation and OCR models recover objects, regions and text,
the result is written back into the drawing as CAD layers, and quantities are grouped into tables that export to Excel.
Every result is kept in MySQL. The models run behind a supervised FastAPI service with Redis-backed state, on-premises or on AWS and on GPU or
ONNX CPU, and its request, database and host metrics are visible on a live dashboard.</p>
<blockquote>
<p>Public project overview. Infrastructure values are illustrative. Model workflows describe engineering responsibilities without exposing proprietary processing logic.</p>
</blockquote>
