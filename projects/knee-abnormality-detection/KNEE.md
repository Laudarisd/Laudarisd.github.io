# RSNA Knee Abnormality Detection

> Multimodal detection of twelve clinically important abnormalities on knee MRI examinations, developed for the RSNA Knee Abnormality Detection code competition on Kaggle (Radiological Society of North America, 2026).

<div class="fact-grid">
<div class="fact"><span class="fact-label">Host</span><span class="fact-value">RSNA · Kaggle research code competition</span></div>
<div class="fact"><span class="fact-label">Task</span><span class="fact-value">12 per-study probabilities per knee MRI</span></div>
<div class="fact"><span class="fact-label">Data</span><span class="fact-value">DICOM series + radiology reports, 570 GB</span></div>
<div class="fact"><span class="fact-label">Metric</span><span class="fact-value">Macro-averaged ROC AUC over 12 labels</span></div>
<div class="fact"><span class="fact-label">Constraints</span><span class="fact-value">Notebook only · no internet · ≤ 9 h GPU</span></div>
<div class="fact"><span class="fact-label">Timeline</span><span class="fact-value">Jul 30 – Oct 22, 2026</span></div>
</div>

<figure class="figure-placeholder">
<div class="placeholder-box"><span>Image</span></div>
<figcaption>Sagittal, coronal, and axial knee MRI slices from one study, with the twelve target findings listed beside them.</figcaption>
</figure>

## 1. Overview

<div class="callout callout-problem">
<h4>Problems this competition addresses</h4>
<ul>
<li>The knee is the most commonly injured and imaged joint; osteoarthritis alone affects an estimated 654 million people, and acute knee injuries account for 15 to 40 percent of sports-related trauma.</li>
<li>ACL and MCL tears, meniscal damage, cartilage loss, fractures, and other findings can be subtle on MRI, and radiologists do not always interpret them the same way.</li>
<li>Musculoskeletal radiologists are scarce outside major medical centres, so diagnoses are delayed or inconsistent.</li>
<li>A single scan can hold a dozen different problems, so a model must score every finding at once rather than answer one question.</li>
</ul>
</div>

The competition asks for machine learning models that detect a defined set of clinically important abnormalities on knee MRI examinations. It is the first RSNA AI Challenge dataset that pairs every imaging study with its original radiology report, so models can learn from both the scans and the written diagnostic text. High-performing models are intended as decision-support tools that bring expert-level knee MRI interpretation to clinics without specialist access.

## 2. Data

<div class="callout callout-problem">
<h4>Problems in the data</h4>
<ul>
<li>Only a small subset of training studies carry per-condition labels; for the rest, labels have to be derived from the free-text report, which may be in any of several languages.</li>
<li>Studies come from a diverse international mix of imaging sites, scanners, protocols, and populations; intensities, orientations, and resolutions vary across series.</li>
<li>Each study is a collection of MRI sequences (typically 20–45 slices per series, with a long tail to a few hundred), so a model has to aggregate many slices and several planes into one prediction per study.</li>
<li>DICOMs arrive in a mix of transfer syntaxes (uncompressed Explicit VR Little Endian, JPEG Lossless, JPEG 2000, Implicit VR Little Endian), stripped to an allow-listed set of 86 metadata tags.</li>
<li>The report is not provided at test time, so text can only help during training.</li>
</ul>
</div>

Each study comprises the MRI sequences from a single scanning session, stored as DICOM series. The dataset holds about 820,000 files (570 GB). Around 1,300 studies form the test set.

### 2.1 Files

| File | Contents |
|---|---|
| `train.csv` | One row per training study: `StudyInstanceUID`, the free-text `Report`, and the twelve binary labels |
| `train_series.csv` | One row per training series: `StudyInstanceUID`, `SeriesInstanceUID`, `Fluid_Sensitive` (1 for T2, PD, STIR and similar), `Fat_Suppression` (0/1), `Anatomical_Plane` (Sagittal, Coronal, Axial) |
| `train_series/` | Training DICOMs as `<StudyInstanceUID>/<SeriesInstanceUID>/<SOPInstanceUID>.dcm`, one slice per file |
| `test.csv`, `test_series.csv`, `test_series/` | Same layout for the test studies; replaced with the real test data during scoring, without the report |
| `sample_submission.csv` | A valid submission with every label set to 0.5 |

### 2.2 The twelve targets

| Label | Finding |
|---|---|
| `ACL` | Anterior cruciate ligament injury |
| `MCL` | Medial collateral ligament injury |
| `Medial Meniscus` | Medial meniscus tear |
| `Lateral Meniscus` | Lateral meniscus tear |
| `Medial OA` | Osteoarthritis of the medial tibiofemoral compartment |
| `Lateral OA` | Osteoarthritis of the lateral tibiofemoral compartment |
| `PF OA` | Patellofemoral osteoarthritis |
| `Effusion` | Joint effusion / excess fluid |
| `Synovitis` | Inflammation of the joint lining |
| `Baker's` | Baker's cyst |
| `Contusion` | Bone contusion / bone bruise |
| `Fracture` | Fracture |

Although every abnormality is represented in each split, its prevalence is not guaranteed to match across the training, public leaderboard, and final evaluation sets.

## 3. Evaluation and submission

Submissions are scored by the macro-averaged area under the ROC curve across the twelve targets:

```text
Final Score = (1 / 12) · Σ AUC_i   for i = 0 … 11
```

For each test study, the submission gives a confidence score for every label:

```text
StudyInstanceUID,ACL,MCL,Medial Meniscus,Lateral Meniscus,Medial OA,Lateral OA,PF OA,Effusion,Synovitis,Baker's,Contusion,Fracture
<uid_1>,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5
<uid_2>,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5
```

<div class="callout callout-note">
<h4>Code-competition constraints</h4>
<ul>
<li>Submissions run as Kaggle notebooks: at most 9 hours on CPU or GPU, with internet access disabled.</li>
<li>Freely and publicly available external data and pre-trained models are allowed.</li>
<li>The output file must be named <code>submission.csv</code>.</li>
<li>A separate efficiency track scores runtime together with predictive performance.</li>
</ul>
</div>

## 4. Approach

<div class="callout callout-problem">
<h4>Problems the solution has to solve</h4>
<ul>
<li>The competition gives 4,407 studies but structured labels for only 58 of them; every other study arrives with a free-text radiology report and nothing more.</li>
<li>No two studies look alike: a study holds several DICOM series shot in different planes, the number of series varies, and the number of slices per series varies more, yet the network needs a fixed-size input.</li>
<li>Different sequences show different things, and the twelve findings are split across them: fluid-sensitive sequences show swelling, effusion and acute injury; the others show anatomy and cartilage.</li>
<li>Half a million slices in several transfer syntaxes have to be read fast enough to infer within the nine-hour limit, with no internet.</li>
</ul>
</div>

The solution scores **0.924 on the public leaderboard with a single model**, no ensembling and no test-time augmentation. The model is trained separately; this notebook is the inference half, which loads the attached weights and predicts.

### 4.1 Labels from the radiology reports

Because only 58 studies carry structured labels, the labels behind the weights were made by reading the free-text reports with a language model and turning each into twelve probabilities rather than twelve yes/no answers. A report that says a tear is *suspected* becomes a number near 0.8, not a 1, which is a fairer target than forcing every hedged sentence into a hard label. That yields **4,349 studies to train on**. The 58 real-labelled studies are never trained on and are used to check the result honestly; the model reaches **0.9167 macro-AUC** on them.

### 4.2 A fixed input from studies that are all shaped differently

The hard part is not the network, it is that no two studies look alike. The approach fills five fixed slots per study, always in the same order, into one slice stack. Preferring a fluid-sensitive series for some slots and not for others is deliberate: the twelve findings are split across both kinds of sequence. If a study has no series for a slot, the slot is left as zeros and the model is told to skip it rather than being fed something misleading.

```python
# Five fixed slots per study, always in the same order (plane, prefer-fluid-sensitive, slice count).
# A missing slot stays zeros and is masked out so the model skips it.
SLOTS = [
    ("Sagittal",  1, 26),   # fluid-sensitive sagittal (T2 / PD / STIR): swelling, effusion, acute injury
    ("Sagittal",  0, 22),   # non-fluid sagittal:        anatomy and cartilage
    ("Coronal",   1, 18),   # fluid-sensitive coronal
    ("Coronal",   0, 12),   # non-fluid coronal
    ("Axial",    -1, 18),   # axial (either sequence)
]
```

Within a series, slices are taken evenly across the stack rather than from the middle, because the collateral ligaments and the lateral meniscus sit in the outer slices and cutting them was measurably costing accuracy on exactly those findings. Every slice is cropped to a 140 mm box using the pixel spacing from the DICOM header, then resized, so a knee occupies the same fraction of the frame whether the scan was acquired at 0.3 or 0.5 mm per pixel.

```python
# Even span across the series (not the middle): peripheral slices hold the collateral
# ligaments and the lateral meniscus.
n = len(files)
lo, hi = int(n * 0.02), int(n * 0.98) - 1
picks = np.linspace(lo, hi, k).round().astype(int)

# Crop a fixed 140 mm box using the DICOM pixel spacing, then resize — so scale carries
# no medical information the model has to learn.
cpx = int(round(CROP_MM / pixel_spacing))          # CROP_MM = 140.0
a = a[y0:y0 + cpx, x0:x0 + cpx]
a = cv2.resize(a, (IMG, IMG), interpolation=cv2.INTER_AREA)
```

### 4.3 How the model reads the stack

Three neighbouring slices are stacked into the three channels of one image, so the network sees a little of what lies above and below the middle slice, most of the benefit of a 3D model at the cost of a 2D one. Each three-slice window is passed through a **CoAtNet backbone at 384 pixels**. The windows are combined with an attention layer that has **separate weights for each of the twelve findings** — the part that matters most. A cruciate tear may be visible on two sagittal slices while osteoarthritis is spread across many coronal ones, and a single pooled score forces those two to share one notion of which slices matter; per-finding attention lets each one draw on the slices that actually show it.

### 4.4 Running it

Scoring uses 42 windows per study. Inference runs in half precision and automatically retries a study in full precision if it fails, so no study is ever dropped from the submission. The notebook needs no internet: the backbone is loaded from the attached weights rather than downloaded, and a fast DICOM reader decodes the common uncompressed little-endian sequences directly, falling back to pydicom for anything unusual.

```python
# Scored run: verify the exact checkpoint, require a GPU, keep internet off.
assert torch.cuda.is_available(), "this scored pipeline requires CUDA"
assert sha256(weights) == "7e5315dad125b99fc65b340b3de41de628e9be51ff5835355dd61c86472244ef"
```

## 5. Results

<div class="callout callout-result">
<h4>Outcome</h4>
<ul>
<li><strong>0.924 macro-averaged ROC AUC</strong> on the public leaderboard, from a single model with no ensembling and no test-time augmentation.</li>
<li><strong>0.9167 macro-AUC</strong> on the 58 studies that carry real structured labels, which were held out of training entirely.</li>
<li>Labels for the other 4,349 studies were derived from their radiology reports as soft probabilities, not hard 0/1 targets.</li>
<li>One CoAtNet model over a fixed five-slot slice stack, with per-finding attention across 42 windows per study, inside the nine-hour offline notebook limit.</li>
</ul>
</div>

## 6. Links

- [Competition page](https://www.kaggle.com/competitions/rsna-knee-abnormality-detection): overview, data description, evaluation, and timeline.
- [Notebook](https://www.kaggle.com/code/laudari/notebook247d4dbb42): the inference notebook on Kaggle.
- [Model weights](https://www.kaggle.com/datasets/dreaddevelopment/raptor-knee-widedense): the trained weights the notebook loads.
