# AI CE Image Mode — Computer Vision & MLOps Portfolio

> Turning architectural floor-plan images into structured, reviewable information through image analysis, OCR, and observable service operations.
>
> Public project overview. Infrastructure values are placeholders. Model workflows describe engineering responsibilities without exposing proprietary processing logic. Illustrative OCR dimensions do not disclose deployed model configurations.

## 1. Project overview

AI CE Image Mode processes floor-plan images for object detection, classification, segmentation, wall analysis, and text recognition. It supports local batch processing and an API workflow, producing structured JSON and optional visualizations, database records, and transferable result archives.

The engineering challenge spans more than prediction: large drawings need consistent image preparation; different information types need coordinated processing; outputs need traceability; and a long-running service needs deployment controls, failure visibility, and reliable artifact handling.

### Goals

- Convert drawings into structured information that downstream engineering applications can consume.
- Support image rescaling and noise reduction while retaining small text and fine drawing details.
- Recognize symbols, dimensions, and space labels with OCR.
- Keep model execution modular so individual components can evolve independently.
- Support repeatable evaluation, batch experiments, and API-based inference.
- Make service health, request outcomes, database activity, and archive transfers observable.
- Prepare a controlled feedback path from operational results to model evaluation and improvement.

### Portfolio project areas

| Area | Engineering focus | Deliverable |
|---|---|---|
| Floor-plan understanding | Image preparation, detection, classification, segmentation | Structured drawing annotations |
| OCR subsystem | CRNN recognition and Paddle OCR integration | Recognized dimensions, symbols, and space labels |
| Inference service | Request validation, orchestration, result packaging | API and batch workflows |
| Operational observability | Redis-backed state, metrics, event history | Service snapshots and monitoring integration |
| Deployment engineering | Process supervision, reverse proxy, repeatable releases | Deployment templates and operating procedures |
| MLOps foundation | Artifact transfer, evaluation, version tracking | A basis for review and retraining workflows |

These are workstreams within one system, rather than unrelated products.

## 2. Skills and tools

| Skill | Tools / concepts | Application |
|---|---|---|
| Deep learning | Python, PyTorch, torchvision, CUDA | Model development, tensor processing, inference |
| Image engineering | OpenCV, NumPy | Rescaling, noise reduction, image and crop preparation |
| OCR | CRNN, Paddle OCR | Text recognition integration and evaluation |
| API engineering | FastAPI, Pydantic, Uvicorn | Upload handling and operational endpoints |
| Data and geometry | JSON, pandas, geometry utilities | Structured results and evaluation support |
| Persistence | Relational database integration | Optional result persistence |
| Shared operational state | Redis | Counters, recent events, operational snapshots |
| Linux operations | systemd, systemctl, journalctl, nginx | Service lifecycle and reverse proxy |
| Observability | Prometheus, Grafana, JSON snapshots | Metrics collection and dashboard integration |
| Delivery | Git, environment locking, CI checks | Reproducible source and dependency management |
| Artifact transport | Secure remote transfer | Moving approved result archives between environments |

## 3. Project structure

![Project component structure](project-structure.svg)

Sanitized repository map; private configuration, weight filenames, customer inputs, and result identifiers are omitted.

```text
AI-CE-Image-Mode/
├── main_all.py                    # Batch entry point
├── server_run.py                  # API entry point
├── app/
│   ├── api/                       # Request and operational routes
│   ├── utils/                     # Pipeline coordination and output helpers
│   ├── infer/                     # Task-specific inference adapters
│   ├── text_recognition/          # OCR model interfaces and modules
│   ├── postprocess/               # Private domain processing
│   ├── wall_class/                # Wall classification integration
│   ├── get_metric/                # Evaluation utilities
│   ├── db/                        # Persistence integration
│   ├── file_transfer/             # Remote archive synchronization
│   └── ops/                       # Metrics and operational state
├── models/                        # Private model artifacts
├── static/                        # Private runtime configuration
├── original_img/                  # Private inputs
├── results/                       # Generated structured outputs
├── temporary_data/                # Intermediate and visualization outputs
├── ops/
│   ├── systemd/                   # Service template
│   ├── nginx/                     # Reverse-proxy template
│   ├── prometheus/                # Scrape configuration
│   ├── alerts/                    # Alert rules
│   └── grafana/                   # Starter dashboard definition
├── tests/
├── .github/workflows/             # CI configuration
├── pyproject.toml
├── uv.lock
└── portfolio.md
```

## 4. System architecture

![End-to-end processing flowchart](pipeline-flow.svg)

```text
                      DRAWING INPUT
                            │
                 VALIDATION & PREPARATION
                  Rescale · Noise reduction
                            │
           ┌────────────────┼─────────────────┐
           ▼                ▼                 ▼
     DETECTION MODEL  SEGMENTATION MODEL    OCR MODELS
     Classification   Regions and walls    Text recognition
           │                │                 │
           └────────────────┼─────────────────┘
                            ▼
                  STRUCTURED RESULTS
                            │
            ┌───────────────┼────────────────┐
            ▼               ▼                ▼
           JSON        VISUALIZATION     PERSISTENCE
```

The following view communicates responsibilities without exposing processing rules, thresholds, model internals for detection, or result-merging logic.

```mermaid
flowchart TD
    A[Drawing upload or batch input] --> B[Validate input]
    B --> C[Image preparation: rescale and noise reduction]
    C --> D[Analysis orchestration]
    D --> E[Detection and classification]
    D --> F[Segmentation and wall analysis]
    D --> G[OCR: symbols, dimensions, spaces]
    E --> H[Structured output assembly]
    F --> H
    G --> H
    H --> I[JSON and visualizations]
    H --> J[Optional database persistence]
    I --> K[Approved archive transfer]
    D -. operational events .-> L[Observability layer]
    J -. write status .-> L
    K -. transfer status .-> L
    L --> M[Redis or local fallback]
    L --> N[Metrics and JSON snapshot]
```

### Public input/output contract

```json
{
  "request_id": "example-request",
  "model_version": "example-v1",
  "status": "completed",
  "outputs": {
    "objects": "artifact-reference",
    "segmentation": "artifact-reference",
    "ocr": "artifact-reference",
    "visualization": "artifact-reference"
  }
}
```

This is an illustrative response schema, not a promise about the current API's exact field names.

## 5. Model development with PyTorch

### Detection and classification model

The detection component identifies relevant objects in architectural drawings and assigns semantic categories. PyTorch provides the model execution and tensor-processing foundation. The public architecture is described through its input and output contract; private model design, filtering rules, and decision thresholds remain internal.

```text
DRAWING TENSOR → VISUAL FEATURES → DETECTION / CLASSIFICATION → OBJECT RECORDS
   Image data      Learned patterns      Locations and classes     Structured output
```

Model development involves organizing approved annotated drawings, validating class labels, splitting data by source drawing, training candidate models, and evaluating held-out examples. A release pairs approved weights with the preprocessing contract, class vocabulary, dependency environment, and evaluation report. This describes the development workflow; it does not assert that training scripts or measured results are included in this repository.

### Segmentation and wall analysis

The segmentation component represents image regions as structured masks. Wall analysis adds domain-specific categories to drawing elements. Evaluation should include overlap quality, continuity of fine structures, and failure review on complex drawings. Production reconciliation and geometric processing are not disclosed.

### OCR recognition model

![CRNN architecture flowchart](ocr-architecture.svg)

CRNN recognition turns cropped text regions into character sequences. Convolutional layers learn visual features, recurrent layers model reading context, and a character projection produces recognition scores. CRNN and Paddle OCR are supported integration paths for appropriate text categories.

The following is an illustrative CRNN design, not the deployed architecture:

| Stage | Layer / operation | Output shape | Activation |
|---|---|---|---|
| Input | Normalized grayscale crop | B × 1 × 32 × 128 | Normalized image values |
| Visual block 1 | 3×3 convolution, normalization | B × 32 × 32 × 128 | ReLU |
| Spatial reduction | 2×2 pooling | B × 32 × 16 × 64 | — |
| Visual block 2 | 3×3 convolution, normalization | B × 64 × 16 × 64 | ReLU |
| Spatial reduction | 2×2 pooling | B × 64 × 8 × 32 | — |
| Visual block 3 | 3×3 convolution | B × 128 × 8 × 32 | ReLU |
| Height aggregation | Average pooling across height | B × 128 × 1 × 32 | — |
| Sequence formatting | Width becomes reading time | B × 32 × 128 | — |
| Context modeling | Two bidirectional recurrent layers, 128 hidden units per direction | B × 32 × 256 | Internal sigmoid / tanh |
| Character head | Linear projection | B × 32 × K | Logits |
| Training objective | Sequence alignment | Sequence-level loss | Log-softmax |
| Inference | Decode scores | Recognized text | — |

`B` is batch size and `K` includes the vocabulary and alignment blank. Exact Paddle OCR layers and activations depend on the selected configuration and are not inferred from the framework name.

### Architecture plot

![OCR spatial dimension line plot](ocr-spatial-plot.png)

The line plot shows how image height and width change through the illustrative OCR layers.

![OCR layer feature-width plot](ocr-feature-plot.svg)

This plot compares feature dimensions in the illustrative architecture. It is not an accuracy or performance claim.

### PyTorch training lifecycle

```text
APPROVED DATASET
      │
      ▼
SOURCE-GROUPED TRAIN / VALIDATION SPLIT
      │
      ▼
TENSOR PREPARATION & TRAINING AUGMENTATION
      │
      ▼
FORWARD PASS → TRAINING LOSS → BACKPROPAGATION → PARAMETER UPDATE
      │                                              │
      └──────────── REPEAT OVER TRAINING BATCHES ─────┘
      │
      ▼
HELD-OUT EVALUATION → CHECKPOINT SELECTION → VERSIONED MODEL ARTIFACT
```

Training concerns include vocabulary consistency, valid sequence lengths, gradient stability, reproducibility, and validation on unseen drawings. Mixed precision can be evaluated for compatible hardware. Fine-tuning may freeze visual features while adapting recognition layers, with normalization state controlled consistently.

### PyTorch inference lifecycle

```text
APPROVED CHECKPOINT + VERSIONED CONFIGURATION
                    │
                    ▼
          LOAD MODEL → EVALUATION MODE
                    │
                    ▼
          PREPARE INPUT TENSORS
                    │
                    ▼
          INFERENCE WITHOUT GRADIENTS
                    │
                    ▼
          DECODE AND PACKAGE RESULTS
                    │
                    ▼
          RECORD LATENCY & OUTCOME
```

Inference engineering covers device placement, GPU memory use, model reuse, controlled concurrency, and input/output validation. Measure model-forward time separately from end-to-end request latency so upload, preparation, persistence, and transfer costs remain visible.

## 6. OCR training and integration

### CRNN training workflow

```mermaid
flowchart TD
    A[Approved text crops and transcriptions] --> B[Validate vocabulary and labels]
    B --> C[Split by source drawing]
    C --> D[Training-only augmentation]
    D --> E[Normalize and batch crops]
    E --> F[Convolutional feature extraction]
    F --> G[Recurrent sequence modeling]
    G --> H[Character logits and alignment loss]
    H --> I[Backpropagation and optimizer update]
    I --> J[Held-out validation]
    J --> K{Meets release criteria?}
    K -- No --> D
    K -- Yes --> L[Versioned weights and vocabulary]
    L --> M[Staged inference evaluation]
```

Candidate augmentations include mild brightness variation, controlled noise, and small geometric changes. Validate each against drawing-specific text; aggressive transformations can change dimension meaning or erase punctuation.

### Paddle OCR integration

The repository supports Paddle OCR as an alternative for dimension and space text recognition, alongside CRNN paths. Paddle OCR is a framework with multiple model configurations; exact layer sizes, activations, and training objectives depend on the selected configuration and checkpoint. They cannot be inferred from the framework name alone.

A training plan for a selected Paddle OCR configuration follows this public architecture contract:

| Component | Input → output | Training concern |
|---|---|---|
| Crop preparation | Image region → normalized tensor `B × C × H × W` | Match the selected configuration's channel count and size |
| Visual encoder | Tensor → spatial or sequence features | Layer widths and activations come from the approved model configuration |
| Sequence adaptation | Features → ordered text representation | Preserve reading direction and valid sequence lengths |
| Recognition head | Representation → character/token scores | Match vocabulary and prediction objective |
| Decoder | Scores → text | Keep decoding consistent with training |
| Evaluation | Text and references → recognition metrics | Report dimension, symbol, and space subsets separately |

Before training, record the framework version, selected configuration, pretrained artifact provenance, input normalization, vocabulary, train/validation manifests, and evaluation protocol. This portfolio does not claim that a Paddle OCR training run or a particular Paddle architecture was verified in this repository.

### Evaluation plan

- OCR: character error rate, word error rate, exact text match, and errors on punctuation or numeric dimensions.
- Detection and classification: class-level precision and recall, localization quality, and representative failure categories.
- Segmentation: overlap quality and visual checks on fine structures.
- Service: request success rate, end-to-end latency, queue growth, persistence failures, and transfer failures.

Report dataset size, split policy, hardware context, and model version alongside any future results. No fabricated accuracy, speedup, or production-volume claims are included.

## 7. Redis: shared state and operational control

In the inspected application, Redis supports **observability state**: counters, request state, recent events, and history shared across processes. It is not evidence of a Redis inference job queue. Database queue instrumentation and Redis observability should be described separately.

```mermaid
flowchart LR
    A[API and processing events] --> B[Observability adapter]
    C[Database and transfer events] --> B
    B --> D{Redis available?}
    D -- Yes --> E[Shared counters and bounded history]
    D -- No --> F[Local fallback state]
    E --> G[Metrics / snapshot endpoints]
    F --> G
    G --> H[Monitoring consumers]
```

### Control strategy

| Concern | Approach |
|---|---|
| Environment separation | Prefix keys by application and environment |
| Concurrent counters | Use atomic increments rather than read-modify-write |
| Recent activity | Bound event lists and history windows |
| Connection failures | Use short timeouts and observable fallback behavior |
| Retention | Apply explicit retention policies; example temporary keys use TTL |
| Memory | Monitor memory use, evictions, and key growth |
| Access | Use private connectivity, service credentials, and least-privilege ACLs |
| Correctness | Treat fallback snapshots as process-local, potentially incomplete views |

Operational state uses atomic counter updates, bounded recent-event lists, and explicit retention policies. Key naming and connection settings remain private.



Expiration alone does not impose a fixed list size; bounded history and expiration solve different problems. Global counters need an explicit reset/retention policy and should not expire unexpectedly during monitoring windows.

Redis interruption should raise an operational event. A local fallback preserves partial visibility, but it does not provide durable global accounting or cross-worker consistency. Redis recovery and state reconciliation should be tested before relying on combined totals.

## 8. Deployment

![Deployment, Redis, MLOps, and monitoring topology](deployment-flow.svg)

The repository contains systemd, reverse-proxy, Prometheus, alert, and Grafana assets. The examples below are sanitized deployment patterns; they are not a record of a verified live deployment.

### Deployment topology

```mermaid
flowchart TD
    U[Authorized client] --> P[TLS reverse proxy]
    P --> A[API service]
    S[systemd supervisor] --> A
    A --> G[PyTorch runtime and approved model artifacts]
    A --> R[Redis operational state]
    A --> D[Optional result database]
    A --> F[Result artifact storage]
    F --> T[Transfer agent]
    T --> M[Separate MLOps environment]
    A -. private metrics .-> C[Prometheus]
    C --> V[Grafana]
    A -. private JSON snapshot .-> W[Custom dashboard integration]
```

### Release flow

```mermaid
flowchart LR
    A[Reviewed source] --> B[CI checks]
    B --> C[Versioned release bundle]
    C --> D[Install locked environment]
    D --> E[Verify approved model manifest]
    E --> F[Activate candidate release]
    F --> G[Restart supervised service]
    G --> H{Health and smoke checks pass?}
    H -- Yes --> I[Observe candidate]
    H -- No --> J[Restore previous release and restart]
```

A release bundle should pair source revision, dependency lock, model manifest, and configuration schema. Keep environment secrets outside the bundle. A restart may interrupt requests; zero-downtime rollout requires additional routing and draining infrastructure.

### Deployment control flow

```text
REVIEWED RELEASE → CI CHECKS → STAGED INSTALL → MODEL VERIFICATION
                                                     │
                                                     ▼
                                              SERVICE RESTART
                                                     │
                                               HEALTH CHECK
                                                /         \
                                             PASS         FAIL
                                              │             │
                                              ▼             ▼
                                           MONITOR       ROLLBACK
```

The deployment diagram shows control flow rather than invented rollout percentages. Performance graphs can be added when measured latency and service metrics are available.

### systemd service example

Every username and filesystem path below is fictional. The `current` directory represents an activated release. The environment file is supplied privately by the operator.

```ini
# /etc/systemd/system/example-ai-ce.service
[Unit]
Description=Example AI CE Image Mode API
Wants=network-online.target
After=network-online.target
StartLimitIntervalSec=120
StartLimitBurst=5

[Service]
Type=simple
User=xxx
Group=xxx
WorkingDirectory=/opt/xxx/ai-ce/current
EnvironmentFile=/etc/xxx/ai-ce.env
Environment=PYTHONUNBUFFERED=1
ExecStart=/opt/xxx/ai-ce/current/.venv/bin/python server_run.py
Restart=on-failure
RestartSec=5
TimeoutStopSec=60
KillSignal=SIGTERM
UMask=0027
NoNewPrivileges=true
PrivateTmp=true
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Example environment-file **names only**:

```dotenv
# Illustrative names: map these to the application's actual configuration.
EXAMPLE_APP_ENV=staging
EXAMPLE_MODEL_ROOT=/opt/xxx/models
EXAMPLE_RESULTS_ROOT=/var/lib/xxx/results
EXAMPLE_REDIS_URL=redis://xxx:xxx@redis.example.invalid:6379/0
```

Do not copy sample values into a real deployment. Required directories, service identity, dependency environment, approved weights, and private runtime settings must exist before startup.

```bash
# Install the prepared unit; execute on the intended deployment host.
sudo install -m 0644 example-ai-ce.service /etc/systemd/system/example-ai-ce.service
sudo systemd-analyze verify /etc/systemd/system/example-ai-ce.service
sudo systemctl daemon-reload
sudo systemctl enable --now example-ai-ce.service
sudo systemctl status example-ai-ce.service --no-pager
sudo systemctl is-active example-ai-ce.service
sudo systemctl is-enabled example-ai-ce.service

# Apply a prepared application release.
sudo systemctl restart example-ai-ce.service

# Inspect recent logs or follow live events.
sudo journalctl -u example-ai-ce.service -n 100 --no-pager
sudo journalctl -u example-ai-ce.service -f

# Recover from a restart-limit condition after fixing the root cause.
sudo systemctl reset-failed example-ai-ce.service
sudo systemctl start example-ai-ce.service
```

`enable` configures startup at boot; `Restart=on-failure` supervises crashes. Neither command fetches source, trains models, or automatically deploys new releases. Automated deployment requires a separate release job that installs a reviewed bundle, switches the release directory, restarts the service, checks health, and restores the previous release if necessary.

### Reverse-proxy example

```nginx
# Conceptual example. Replace xxx with the configured internal application port.
# TLS certificate configuration and authentication are supplied privately.
location / {
    proxy_pass http://127.0.0.1:xxx;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Monitoring is routed separately through trusted internal access.
location = /metrics { deny all; }
location = /ops/snapshot { deny all; }
```

```bash
sudo nginx -t
sudo systemctl reload nginx
curl --fail https://api.example.invalid/health
```

The nginx fragment contains a deliberately nonnumeric port placeholder and must be completed before validation. Set upload limits, request timeouts, TLS, and monitoring access according to the deployment environment.

## 9. Monitoring: Prometheus, Grafana, and custom dashboards

### What is supported by repository evidence

- A health route for basic availability checks.
- A Prometheus text endpoint at `/metrics`.
- A JSON operational endpoint at `/ops/snapshot`.
- Instrumentation for uploads, request outcomes, database activity, remote transfers, recent events, and system resource snapshots.
- A Grafana starter dashboard, Prometheus scrape configuration, and alert-rule assets.
- An interface suitable for a custom monitoring dashboard.

These assets demonstrate the Grafana integration approach and custom-dashboard foundation. They do not establish that a Grafana connection succeeded in a particular environment or that a finished custom dashboard UI is deployed.

### Grafana integration approach

1. Confirm the service produces valid metrics on a trusted internal route.
2. Configure Prometheus to scrape that route and inspect target health.
3. Add Prometheus as a Grafana data source using a private connection.
4. Import the starter dashboard and map its data-source reference.
5. Compare panel queries with actual metric names and labels.
6. Trigger a controlled example request and verify counter changes.
7. Check missing-data behavior, restart resets, and alert routing.

Example sanitized Prometheus configuration:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: example-ai-ce
    scheme: https
    metrics_path: /metrics
    static_configs:
      - targets: ["metrics.example.invalid:443"]
        labels:
          environment: example
```

The example metrics gateway must authorize the collector; it is separate from the public nginx route denied above. Supply TLS trust and authentication privately.

### Dashboard design

```text
┌──────────────────────────────────────────────────────────────┐
│ AI CE — Operational Overview                                │
├──────────────┬──────────────┬──────────────┬───────────────────┤
│ Availability │ Request rate │ Failure rate │ Active requests  │
├──────────────┴──────────────┼──────────────┴───────────────────┤
│ Request duration over time │ Database backlog / outcomes     │
├───────────────────────────┼──────────────────────────────────┤
│ CPU / memory / GPU         │ Remote transfer outcomes         │
├───────────────────────────┴──────────────────────────────────┤
│ Recent operational events / data freshness / fallback state │
└──────────────────────────────────────────────────────────────┘
```

| Panel | Operational question |
|---|---|
| Availability | Is the service reachable and ready to accept work? |
| Request outcomes | Are requests completing, failing, or remaining active? |
| Duration | Is processing becoming slower for comparable inputs? |
| Database backlog | Is result persistence keeping up with processing? |
| Transfer outcomes | Are archives reaching the separate environment? |
| Resource usage | Are memory pressure or GPU saturation limiting work? |
| Redis state | Is shared telemetry available or running in fallback? |
| Freshness | How old is the latest successful sample? |

Illustrative PromQL below uses **invented metric names**. Map them to the actual exposition before use. A percentile query requires an instrumented histogram; a duration counter alone cannot provide percentiles.

```promql
# Request completion rate.
rate(example_requests_total{status="completed"}[5m])

# Failure ratio; the denominator covers completed + failed outcomes only.
sum(rate(example_requests_total{status="failed"}[5m]))
/
clamp_min(sum(rate(example_requests_total{status=~"completed|failed"}[5m])), 0.001)

# P95 request latency, only when the example histogram exists.
histogram_quantile(
  0.95,
  sum by (le) (rate(example_request_duration_seconds_bucket[5m]))
)
```

### Custom monitoring dashboard approach

A custom frontend can use `/ops/snapshot` for current counters, recent events, and operational status, while using Prometheus-backed queries for historical trends. Poll through an authenticated monitoring gateway. Show stale data explicitly rather than presenting an old successful response as current health.



Suggested UI behavior: cancel overlapping requests, back off after failures, display sample timestamps, distinguish unavailable values from zeros, and allow operators to filter events by category. The actual snapshot schema must be inspected when implementing the UI.

### Alerts and response

| Signal | Candidate response |
|---|---|
| Service unreachable | Inspect systemd state, restart history, and proxy health |
| Sustained failure increase | Review sanitized errors and recent release changes |
| Growing database backlog | Check database availability and writer throughput |
| Repeated transfer failures | Inspect transport reachability, destination permissions, and retries |
| Resource pressure | Review concurrency, input sizes, and available capacity |
| Missing or stale metrics | Check collector reachability and telemetry fallback state |

Alert thresholds should come from an observed baseline and agreed operating goals; this document does not invent service-level results.

## 10. Sending data to another server for MLOps

The repository includes remote archive synchronization and transfer-event instrumentation. That establishes artifact-transfer capability. The full feedback, labeling, retraining, and release loop below is a proposed extension rather than a verified automated training platform.

```mermaid
sequenceDiagram
    participant A as Inference service
    participant L as Local artifact store
    participant T as Transfer agent
    participant R as Separate MLOps environment
    participant V as Validation and review
    participant M as Model release process
    A->>L: Save results and approved artifacts
    L->>T: Discover completed artifact set
    T->>R: Transfer over authenticated encrypted channel
    R->>R: Verify manifest and content integrity
    R-->>T: Confirm durable acceptance
    T->>T: Record transfer outcome
    R->>V: Propose samples for annotation / evaluation
    V->>M: Approved dataset and evaluation report
    M-->>A: Reviewed versioned model release
```

### Transfer contract

A mature receiving environment should validate a manifest such as:

```json
{
  "schema_version": "example-1",
  "artifact_id": "example-artifact",
  "request_ref": "example-pseudonymous-ref",
  "model_version": "example-v1",
  "content_digest": "xxx",
  "artifact_types": ["approved-image", "prediction-json"],
  "review_status": "pending",
  "transfer_state": "awaiting-acknowledgement"
}
```

This is a proposed schema. It does not expose actual filenames, customer identifiers, storage locations, or credentials.

### Reliability and control

- Transfer only completed artifact sets; stage incomplete uploads away from consumers.
- Use stable artifact IDs and content digests to recognize duplicate transfers.
- Retry transient failures with bounded backoff and visible failure status.
- Verify remote integrity and durable acceptance before applying local retention rules.
- Keep failed transfers available for inspection rather than silently dropping data.
- Send approved samples and operational metadata according to the data-sharing agreement.
- Keep prediction outputs separate from human-approved ground truth.
- Version datasets and evaluate candidate weights before release; avoid training automatically on unreviewed predictions.

These are target reliability controls to validate against the transfer implementation, not assertions that every control already exists.

### MLOps lifecycle

```text
Operational artifacts
    └── Approved sample selection
        └── Annotation and quality review
            └── Versioned dataset
                └── PyTorch training / OCR fine-tuning
                    └── Held-out evaluation
                        └── Reviewed model artifact
                            └── Staged deployment
                                └── Monitoring and feedback
```

## 11. Engineering decisions and lessons

| Challenge | Engineering direction | Practical lesson |
|---|---|---|
| Large drawings and small text | Controlled rescaling and OCR crop preparation | Validate legibility, not only image dimensions |
| Multiple prediction tasks | Modular adapters and orchestration | Stable interfaces reduce integration friction |
| Recognition ambiguity | Separate OCR categories and evaluation subsets | Global averages can hide important numeric errors |
| Shared operational state | Redis-backed observability with fallback | Availability and global consistency are separate concerns |
| Repeatable execution | Locked dependencies and versioned model contracts | Weights alone do not reproduce behavior |
| Process recovery | systemd supervision and health checks | Restarting is useful only when failures remain visible |
| Monitoring integration | Prometheus plus JSON snapshots | Historical metrics and recent event detail serve different needs |
| Continuous improvement | Artifact transfer followed by reviewed feedback | Predictions need validation before becoming training labels |

## 12. Results and evidence to add

The repository demonstrates implemented components and operational templates. Quantitative outcomes should be added only after reproducible measurement.

| Evidence item | Value / link to fill |
|---|---|
| Approved evaluation dataset and split | `xxx` |
| Detection / classification evaluation | `xxx` |
| Segmentation evaluation | `xxx` |
| OCR character and exact-match results | `xxx` |
| End-to-end latency distribution | `xxx` |
| Hardware category, without host identity | `xxx` |
| Grafana connection screenshot | `xxx` |
| Custom dashboard screenshot / implementation link | `xxx` |
| Deployment and recovery demonstration | `xxx` |

## 13. Images, videos, and demonstrations

Approved, sanitized media will be added here as it is cleared for publication:

- a project cover,
- an input drawing shown next to its structured result visualization,
- dimension and space text recognition examples,
- a deployment diagram or screenshot, Grafana integration evidence, and the custom monitoring dashboard,
- short videos of end-to-end processing, deployment and recovery, and monitoring.

Before publishing media, remove visible credentials, terminals containing connection strings, browser address bars showing private infrastructure, customer drawing identifiers, and embedded sensitive metadata.

## 14. Public disclosure boundary

This portfolio describes goals, engineering responsibilities, conceptual architecture, and independent educational code. Deployment identities, domains, addresses, ports, private configuration, training datasets, deployed weight details, and proprietary decision rules are intentionally absent. CRNN and Paddle OCR are discussed as permitted OCR technologies; other model capabilities are described generically.
