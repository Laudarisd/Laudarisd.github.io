/* LLM/VLM Fine-Tuning: card and detail-page content in both languages.
   This folder holds everything for the project: index.html (page), llm-vlm-fine-tuning.js (content),
   the thumbnail, and any case-study Markdown and images. */
Portfolio.project("llm-vlm-fine-tuning", {
  en: {
    "title": "LLM/VLM Fine-Tuning",
    "description": "QLoRA fine-tuning of a 9B vision-language model to answer questions about floor-plan images in structured JSON.",
    "image": "thumbnail.svg",
    "image_alt": "LLM and VLM fine-tuning",
    "image_class": "",
    "url": "https://github.com/Laudarisd/finetune-llm-vllm",
    "subtitle": "Fine-tuning Qwen3.5-9B with QLoRA (Unsloth, TRL, PEFT) so it can read an architectural floor-plan image and answer questions about rooms, counts, junctions, and polygon annotations as structured JSON.",
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/Laudarisd/finetune-llm-vllm"
      }
    ],
    "role": "Researcher and developer (end-to-end)",
    "context": "Industry R&D",
    "tags": [
      "Qwen3.5-9B",
      "VLM",
      "QLoRA / LoRA",
      "Unsloth",
      "TRL",
      "PEFT",
      "PyTorch",
      "Floor-plan understanding"
    ]
  },
  kr: {
    "title": "LLM/VLM Fine-Tuning",
    "description": "9B Vision-Language 모델을 QLoRA로 Fine-Tuning 해 평면도 이미지 질문에 구조화된 JSON으로 답하게 해요.",
    "image": "thumbnail.svg",
    "image_alt": "LLM과 VLM Fine-Tuning",
    "image_class": "",
    "url": "https://github.com/Laudarisd/finetune-llm-vllm",
    "subtitle": "Qwen3.5-9B를 QLoRA(Unsloth, TRL, PEFT)로 Fine-Tuning 해서 건축 평면도 이미지를 읽고 방, 개수, 교차점, 폴리곤 주석에 대한 질문에 구조화된 JSON으로 답하게 하는 프로젝트예요.",
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/Laudarisd/finetune-llm-vllm"
      }
    ],
    "role": "연구 및 개발 (End-to-End)",
    "context": "산업 R&D",
    "tags": [
      "Qwen3.5-9B",
      "VLM",
      "QLoRA / LoRA",
      "Unsloth",
      "TRL",
      "PEFT",
      "PyTorch",
      "Floor-plan understanding"
    ]
  }
});
