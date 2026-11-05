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
<li>Read hundreds of thousands of DICOM slices in several transfer syntaxes quickly enough to train and to infer within the 9-hour limit.</li>
<li>Turn a variable number of series and slices per study, across three planes, into one fixed representation per study.</li>
<li>Label the unlabelled training studies from reports written in several languages, without using text at test time.</li>
<li>Produce calibrated probabilities for twelve findings whose prevalence differs between splits.</li>
</ul>
</div>

The solution is developed as a Kaggle notebook under the constraints above: DICOM decoding and slice preparation, per-study aggregation across sagittal, coronal, and axial series, a multi-label image model trained on the labelled studies with report-derived labels for the rest, and offline inference that writes `submission.csv`.

<figure class="figure-placeholder">
<div class="placeholder-box"><span>Image</span></div>
<figcaption>Solution pipeline: DICOM series → slice preparation → per-plane encoders → study-level aggregation → twelve probabilities.</figcaption>
</figure>

## 5. Links

- [Competition page](https://www.kaggle.com/competitions/rsna-knee-abnormality-detection): overview, data description, evaluation, and timeline.
- [Notebook](https://www.kaggle.com/code/laudari/notebook247d4dbb42): the solution notebook on Kaggle.
