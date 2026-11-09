# Agentic CAD Parsing System - Parsing CAD Data

A system that runs inside a CAD application. It reads a DWG drawing, extracts what is in it, organizes the entities and objects,
and answers questions about it. It inspects the whole drawing and prepares reports based on the user's needs and goals.

<!-- **Code files are not available in this repository because of confidentiality** -->

**Main Process**

<div class="fact-grid">
<div class="fact"><span class="fact-label">Input</span><span class="fact-value">Architectural drawings (DWG)</span></div>
<div class="fact"><span class="fact-label">Output</span><span class="fact-value">Structured knowledge · graph · reports</span></div>
<div class="fact"><span class="fact-label">Interface</span><span class="fact-value">Chat agent inside the CAD canvas</span></div>
<div class="fact"><span class="fact-label">Languages</span><span class="fact-value">Korean and English</span></div>
<div class="fact"><span class="fact-label">Safety</span><span class="fact-value">Every change needs human approval</span></div>
<div class="fact"><span class="fact-label">Platform</span><span class="fact-value">C# / .NET, inside the CAD application</span></div>
</div>

<figure class="figure-small">
<img src="1_main_view.png" alt="The system inside the CAD application: floor plan, entity browser, chat, AI log, and the inspection report window">
<figcaption>The system inside the CAD application: the drawing on the left, the entity browser, chat and AI log on the right, and the inspection report window below.</figcaption>
</figure>

---

## 1. Introduction

An architectural drawing contains a lot of information about the building, machinery, piping and HVAC systems, and many other designs.
Understanding such drawings needs a professional. For instance, making a report that lists wall thicknesses and classifies them (as load-bearing or non-load-bearing),
or finding the connections in a piping system, takes a lot of time and effort, and human error cannot be avoided. To minimize such factors we need a system that actually analyzes the
drawings and makes the reports. This project does that, and then puts an AI assistant on top of it, so
that a user can simply analyze and extract the necessary information from complex uploaded drawings.

```mermaid
flowchart LR
    A[DWG drawing]:::input --> B[Parse]:::process
    B --> C[(Structured<br/>knowledge)]:::store
    C --> D[Graph<br/>database]:::store
    C --> E[AI agent]:::agent
    E --> F[Answers,<br/>analysis,<br/>highlights,<br/>reports]:::output
```

<!-- <div class="callout callout-problem">
<h4>Three questions shaped every decision</h4>
<ol>
<li><strong>Does it work on a drawing it has never seen?</strong> A system tuned to one file is a demo, not a product.</li>
<li><strong>Can every answer be traced?</strong> An inspection result that cannot be shown on the drawing is an opinion.</li>
<li><strong>Can it be wrong safely?</strong> It works on a customer's drawing, so uncertainty must be a visible state, and nothing may change without a human decision.</li>
</ol>
</div> -->

---

<div class="part-divider"><span>Data Extraction</span></div>

## 2. The problem: a DWG is not a Model or a Raster Image

<p>A DWG file is vector data stored in a closed binary format, which is difficult to read with simple algorithms or systems.
Nothing in it says "this is a bedroom" or "here is a piping system". For instance, see the following images.</p>

<div class="figure-row figure-row-small figure-row-equal">
<figure>
<img src="1_dwg_example.png" alt="A DWG sample: a unit floor plan with walls, doors, fixtures, marks and dimensions as the CAD canvas draws it">
<figcaption>DWG sample: a unit floor plan as the CAD canvas draws it.</figcaption>
</figure>
<figure>
<img src="1_vector_data.png" alt="The same DWG file opened as text: unreadable binary bytes">
<figcaption>Vector data sample: the same file opened as text. The data is binary, so nothing in it can be read directly.</figcaption>
</figure>
</div>


<!-- ======================================================================= -->

<h3>2.1 What the file actually contains</h3>
<pre><code>A floor plan file
├── Primitives      lines, polylines, arcs, circles, hatches
├── Text            names, sizes, notes, titles, legends, revisions
├── Symbols         reusable blocks: a door, a toilet, an entire flat
│   ├── nested      a symbol inside a symbol inside a symbol
│   └── external    geometry that lives in a different file altogether
├── Layers          groupings chosen by whoever drew it
└── Marks           codes that refer to a door or a window
</code></pre>
<figure class="figure-xsmall">
<img src="1_cad_data_all.png" alt="One parsed line entity as JSON: id, handle, type, layer, start and end points, length, angle and bounds">
<figcaption>What one item in the file becomes once it is read: a single line with its layer, endpoints, length and bounds. Still no meaning attached.</figcaption>
</figure>



<h3>2.2 Why that is hard</h3>
<div class="callout callout-problem">
<h4>Problems in the raw drawing</h4>
<ul>
<li><strong>No meaning.</strong> The file stores shapes and positions, not what anything is or what belongs to what.</li>
<li><strong>Everything overlaps.</strong> Furniture, hatching, dimensions and notes sit on top of the structure.</li>
<li><strong>Symbols hide their position.</strong> Real coordinates appear only after insertion, rotation, scale and mirroring are resolved. Exploding them destroys their identity.</li>
<li><strong>No standard.</strong> Every office draws and names things differently, often in more than one language.</li>
<li><strong>Repeated units.</strong> The same flat appears many times, mirrored or rotated, with the same names.</li>
<li><strong>Imperfect drawings.</strong> Lines miss by a millimetre, content sits on the wrong layer, labels sit outside what they name.</li>
</ul>
</div>

<h3>2.3 Why the obvious approaches fail</h3>

<div class="table-scroll"><table class="component-table">
<thead>
<tr>
<th>Approach</th>
<th>Why it is not enough</th>
</tr>
</thead>
<tbody>
<tr><td>Explode everything and analyse the shapes</td><td>Symbols lose their meaning, and the data multiplies</td></tr>
<tr><td>Send the file to a language model</td><td>Too large, and no exact geometry or counting</td></tr>
<tr><td>Image recognition on a rendered plan</td><td>Loses coordinates, units and identity</td></tr>
<tr><td>Manual templates per project</td><td>Does not scale; every customer draws differently</td></tr>
</tbody>
</table></div>
<p>For instance, analyzing different floor plans gives a different number of entities. See the following table.</p>
<div class="table-scroll"><table class="component-table">
<thead>
<tr>
<th>Drawing</th>
<th>Size</th>
<th>What it contains</th>
<th>Complexity</th>
</tr>
</thead>
<tbody>
<tr><td>Single unit plan (one flat)</td><td>about 6,000 entities</td><td>rooms, doors, fixtures, marks, dimensions</td><td>Low</td></tr>
<tr><td>Multi-unit floor plan</td><td>about 25,000 entities</td><td>about 80 rooms across repeated unit types, mirrored and rotated, plus cores, shafts and stairs</td><td>Medium</td></tr>
<tr><td>Block plan (several buildings on one sheet)</td><td>larger again</td><td>every unit of every building, repeated, with shared site elements</td><td>High</td></tr>
</tbody>
</table></div>

<!-- <div class="table-scroll"><table class="component-table">
<thead>
<tr>
<th>Approach</th>
<th>Why it is not enough</th>
</tr>
</thead>
<tbody>
<tr>
<td>Explode everything and analyse the shapes</td>
<td>Loses the meaning carried by symbols, and multiplies the data</td>
</tr>
<tr>
<td>Send the drawing to a language model</td>
<td>Far too large, and models cannot do exact geometry or counting</td>
</tr>
<tr>
<td>Image recognition on a rendered plan</td>
<td>Loses exact coordinates, units and identity; cannot be traced back</td>
</tr>
<tr>
<td>Manual templates per project</td>
<td>Does not scale, and every customer draws differently</td>
</tr>
</tbody>
</table></div> -->
<!-- <p>The system uses none of these alone. It builds a structured understanding first, and
treats the language model as a reader of that structure rather than of the file.</p> -->
<div class="figure-row figure-row-small figure-row-equal">
<figure>
<img src="2_cad_data_line.png" alt="A raw DWG floor plan as the CAD canvas shows it: lines, text and symbols with no meaning attached">
<figcaption>The drawing as the CAD canvas shows it: lines, text and symbols, with nothing saying what any of them is.</figcaption>
</figure>
<figure>
<img src="1_cad_data_all.png" alt="One extracted line entity as JSON: id, handle, type, layer, start and end points, length, angle and bounds">
<figcaption>The same drawing as data: one line entity with its layer, endpoints, length and bounds. Thousands of these make a plan, and none of them says "wall".</figcaption>
</figure>
</div>

---

## 3. Parsing and storage

<!-- <div class="callout callout-problem">
<h4>Problems this stage solves</h4>
<ul>
<li>Geometry inside nested and external symbols has no real-world coordinates until every insertion, rotation, scale and mirror is resolved.</li>
<li>Exploding symbols to get coordinates destroys their identity.</li>
<li>Drawings come in different units; later numbers must all mean the same thing.</li>
<li>Every later answer must be traceable to the exact entity in the drawing.</li>
</ul>
</div> -->

<p>This stage does two things: it parses the drawing, and it stores the result in a database.
Every entity is read, symbols and external references are resolved to real-world coordinates, and each entity is saved with a stable identifier so it can be found again later.</p>
<pre class="mermaid">flowchart LR
    A[DWG]:::input --> B[Read every entity:<br/>lines, polylines, arcs,<br/>circles, hatches, text]:::process
    B --> C[Resolve symbols and<br/>external references]:::process
    C --> D[Real world coordinates,<br/>in metres]:::process
    D --> E[(Stored per drawing)]:::store
</pre>
<pre><code>Parsing
├── Entities          lines, polylines, arcs, circles, hatches, text
├── Symbols           resolved to the leaf, including nested ones
├── External refs     pulled in and marked with their origin
├── Units             normalised, so every later number is in metres
└── Identity          a stable identifier per drawing and per entity
</code></pre>

<p>An example of what is stored in the database:</p>
<figure class="figure-short">
<img src="db.png" alt="The database browser: a list of parsed drawings with their entity counts, the count of each entity type, the entities on one layer, and the full record of one polyline">
<figcaption>The database browser. Left: parsed drawings and their entity counts. Middle: how many entities of each type. Right: the polylines on one layer, and the full record of one of them with its id, layer, appearance, owner block and geometry.</figcaption>
</figure>

<!-- <p>Two decisions mattered.</p>
<p><strong>Nothing is exploded.</strong> Each piece of geometry keeps a path back to the symbol it
belongs to, so a symbol is still recognisable as itself while its geometry sits in
world coordinates.</p>
<p><strong>Every fact keeps its origin.</strong> The drawing's own identifier for an entity is
carried through the whole pipeline. That is what later lets any number be pointed at
on screen, and lets a reviewer disagree with one line rather than the whole report.</p>
<p>Parsed drawings are stored, not re-read. A drawing is processed once and the result
is reused for every later question, by the assistant, by the inspection, and by the
graph database.</p> -->

---

## 4. Semantic Relationships

<p>Once the entities are parsed and stored, the next step is to find what they mean: which lines form a space, which form a wall,
and how spaces, walls, doors and marks relate to each other. The result is stored in a graph database.</p>

<h3>4.1 Semantic Relation Search</h3>
<pre class="mermaid">flowchart LR
    A[Input<br/>DWG drawing]:::input --> B[Entity parsing<br/>and database]:::process
    B --> C[Semantic search:<br/>spaces, walls, openings]:::process
    C --> D[(Graph database)]:::store
    D --> E[Output<br/>answers, highlights, reports]:::output
</pre>
<h4>4.1.1 Finding polygons for spaces</h4>
<p>Each space is found as a closed polygon on the plan and stored with its name, its area and the drawing entities behind it.</p>
<h4>4.1.2 Finding walls and boundaries</h4>
<p>Wall polygons are found with their thickness and length, and each space is linked to the walls that bound it.</p>
<div class="figure-row figure-row-small figure-row-equal">
<figure>
<img src="2_semantic_info_extraction.png" alt="Room and wall masks drawn over the floor plan in their class colours, with the assistant's explanation in the chat panel">
<figcaption>Spaces: the room and wall masks found in a drawing, drawn over the plan in their class colours.</figcaption>
</figure>
<figure>
<img src="3_inspecting_walls.png" alt="The wall polygon summary in the report window: count, thickness range and length range">
<figcaption>Walls: the wall polygons found in a drawing, summarised with their count, thickness range and length range.</figcaption>
</figure>
</div>

<h3>4.2 Relationship Search</h3>
<p>The recovered items are connected in an ontology: Room, Wall, WallLine, Door, Window, Fixture and Mark, with relations such as
hasWall, hasDoor, hasWindow, adjacent, sharesWall and markedBy. Questions about the drawing are answered by walking these relations.</p>
<figure class="figure-small">
<img src="ontology.png" alt="The ontology graph: Room, Wall, WallLine, Door, Window, Fixture and Mark classes with their properties and the relations between them">
<figcaption>The ontology behind the graph database: each class with its properties, and the relations that connect them.</figcaption>
</figure>

---

<div class="part-divider"><span>Agentic System</span></div>

## 5. Why an AI agent

<p>Users ask open questions such as <em>Which bathrooms have no ventilation?</em>, <em>How many doors of this code are there, and where?</em>
or <em>Put that in the report, in both languages.</em></p>
<p>The agent does not read the drawing. It reads the question, calls the tools below, and the tools read the structured knowledge.
The answer comes back with its evidence highlighted on the drawing.</p>
<pre class="mermaid">flowchart LR
    U[Question]:::input --> M[Agent]:::agent
    M --> T[Tools over the<br/>structured knowledge]:::process
    T --> O[Evidence]:::store
    O --> M
    M --> A[Answer + highlight]:::output
</pre>

<h3>5.1 Why not simply give the model the file</h3>
<div class="table-scroll"><table class="component-table">
<thead>
<tr>
<th></th>
<th>Model reads the file</th>
<th>Model reads the structured knowledge</th>
</tr>
</thead>
<tbody>
<tr><td>Size</td><td>too large for the model</td><td>a small, relevant slice</td></tr>
<tr><td>Exactness</td><td>approximate</td><td>exact and repeatable</td></tr>
<tr><td>Traceability</td><td>none</td><td>every value points back to the drawing</td></tr>
</tbody>
</table></div>
<p>Geometry and counting are done by code. The model is used for language and intent, which is what it is good at.</p>

<h3>5.2 What the agent can reach</h3>
<p>The agent works through a small set of named tools. The tree below shows each tool call and what it gives back.</p>
<pre class="mermaid">%%{init: {"flowchart": {"nodeSpacing": 10, "rankSpacing": 70}}}%%
flowchart LR
    A[AI agent]:::agent --> T[Tool calls]:::process
    T --> Q[Query]:::group
    Q --> find[find<br/>items matching a description]:::tool
    Q --> count[count<br/>how many]:::tool
    Q --> measure[measure<br/>sizes and distances, with source]:::tool
    Q --> relate[relate<br/>how spaces, openings and walls connect]:::tool
    T --> S[Show]:::group
    S --> highlight[highlight<br/>the answer drawn on the canvas]:::tool
    T --> R[Report]:::group
    R --> inspection[inspection<br/>findings written into the report]:::tool
    T --> C[Change]:::group
    C --> draw[draw<br/>new geometry added to the drawing]:::tool
    C --> modify[modify<br/>a proposed change to existing items]:::tool
    C --> delete[delete<br/>removes the selected items]:::tool
    C --> create_block[create_block<br/>a new symbol from a selection]:::tool
    C -.-> AP[every change needs<br/>human approval]:::note
    T --> X[Raw data]:::group
    X --> data_scanner[data_scanner<br/>a sweep of all entities]:::tool
</pre>
<p>What each tool accepts and returns is part of the product and is not described here.</p>

---

## 6. The agent harness
<p>The model is only a small part of the agent. The harness around it runs each question: it sets a budget, keeps the context small,
checks that every claim is backed by drawing evidence, records cost and timing, and keeps a proposed change separate from applying it.</p>
<pre class="mermaid">flowchart LR
    Q[Question]:::input --> B[Budget and scope<br/>for this question]:::process
    B --> L[Agent loop<br/>tool call, result, reason]:::agent
    L --> G{Backed by<br/>drawing evidence?}:::decision
    G -- yes --> A[Answer + highlight]:::output
    G -- no --> U[Reported as unknown]:::note
    L --> T[(Trace: tool calls,<br/>timing, tokens, cost)]:::store
    M[Hosted or<br/>self-hosted model]:::tool -.-> L
</pre>
<ul>
<li><strong>Grounded.</strong> Every claim carries the drawing entities behind it. What cannot be grounded is reported as unknown.</li>
<li><strong>Deterministic.</strong> Numbers come from code, so the same question gives the same numbers on any model.</li>
<li><strong>Observable.</strong> Every tool call is traced with its timing and outcome, and the cost is shown per answer.</li>
<li><strong>Bilingual.</strong> Answers follow the language of the question, and report content is stored in Korean and English.</li>
</ul>

---

## 7. Interaction and safety
<p>The system shows its work on the drawing and never changes the file on its own.</p>
<ul>
<li><strong>Evidence is temporary.</strong> Answers are drawn on the CAD canvas as highlights and see-through masks that disappear when cleared. The drawing itself is not altered.</li>
<li><strong>Changes are proposals.</strong> A change is first shown on the drawing and applied only after a person clicks approve.</li>
<li><strong>Everything is journalled.</strong> Each applied change is recorded, and the outcome is fed back to the agent.</li>
</ul>
<pre class="mermaid">flowchart LR
    A[Change request]:::input --> P[Proposal shown<br/>on the drawing]:::process
    P --> D{Human decision}:::decision
    D -- Approve --> F[Applied and<br/>journalled]:::store
    D -- Reject --> N[Nothing happens]:::note
</pre>

---

## 8. Results
<div class="callout callout-result">
<h4>Measured on an unseen test plan</h4>
<ul>
<li>Roughly 25,000 entities read and resolved.</li>
<li>66 spaces recovered across six repeated unit types; the large majority cleanly, the rest reported as approximate rather than presented as exact.</li>
<li>Identical results in millimetres, in inches, and with the plan rotated.</li>
<li>The same question returns the same numbers across runs and models, in Korean and in English.</li>
</ul>
</div>
<div class="figure-row figure-row-small figure-row-equal">
<figure>
<img src="4_inspecting_doors.png" alt="A door table in chat with code, width, height, source and connected rooms, and the matching doors highlighted on the drawing">
<figcaption>Door inspection: every door with its code, size and the rooms it connects, highlighted on the drawing.</figcaption>
</figure>
<figure>
<img src="5_more_results.png" alt="Only the Bedroom 1 room masks highlighted on a different drawing, with their areas listed in chat">
<figcaption>A follow-up question on another drawing: only the Bedroom 1 spaces are highlighted, with the area of each.</figcaption>
</figure>
</div>
<div class="figure-row figure-row-small figure-row-equal">
<figure>
<img src="3_inspecting_walls.png" alt="The assistant adds a wall polygon summary to the inspection report, shown in Korean in the report window">
<figcaption>Wall inspection: a wall polygon summary added to the report, in Korean and English.</figcaption>
</figure>
<figure>
<img src="non_load_bearing_walls.png" alt="The inspection report listing load-bearing and non-load-bearing walls with thickness, length, type and rooms involved, with the walls highlighted on the drawing">
<figcaption>Wall classification: the report lists load-bearing and non-load-bearing walls with their thickness, length, type and the rooms involved, and highlights them on the drawing.</figcaption>
</figure>
</div>

---

## 9. Graph database foundation
<p>Everything the system recovers is stored as a graph, one per drawing. Each node is a thing on the plan, such as a Room, Wall, Door, Window, Fixture or Mark,
with its properties and the drawing entity it came from. Each edge is a named relation such as hasWall, hasDoor, adjacent or markedBy.
Questions about how things connect are answered by walking this graph, and selecting a node highlights it on the CAD canvas.</p>
<pre class="mermaid">graph LR
    M[Mark<br/>code]:::input -- describes --> D[Door]:::process
    D -- connects --> R1[Space A]:::store
    D -- connects --> R2[Space B]:::store
    R1 -- touches --> R2
    F[Fixture]:::agent -- belongs to --> R1
    W[Window]:::process -- opens from --> R1
</pre>
<div class="figure-row figure-row-small figure-row-equal">
<figure>
<img src="ontology_1.png" alt="The ontology view for one drawing: the Room class with 19 instances, the selected room's properties, and the class diagram">
<figcaption>Ontology view for one drawing: the Room class has 19 instances. Selecting a room lists its properties and highlights it and its connections in CAD.</figcaption>
</figure>
<figure>
<img src="ontology_2.png" alt="Close-up of the Room class with its properties and the relations hasWall, hasWallLine, adjacent and sharesWall">
<figcaption>Relations around Room: hasWall, hasWallLine, adjacent and sharesWall, each with its count in this drawing.</figcaption>
</figure>
</div>
<figure class="figure-small">
<img src="ontology_3_instances.png" alt="The Instances view: rooms, doors, windows, marks and fixtures of a drawing as nodes with relations drawn between them, and the selected room highlighted on the CAD canvas">
<figcaption>Instances view: every room, door, window, mark and fixture of the drawing as a node, with the relations drawn between them. The selected room is highlighted on the canvas.</figcaption>
</figure>

---

## 10. Summary
<p>The system reads a DWG drawing, parses every entity into a database, recovers spaces, walls, openings and marks, and stores their relations in a graph.
An AI agent then answers questions, inspects the drawing and writes bilingual reports through a small set of tools, with every answer highlighted on the drawing as evidence.
Nothing in the drawing changes without human approval.
The project is in development and is tested on real residential drawings, from a single flat to a whole block.</p>
