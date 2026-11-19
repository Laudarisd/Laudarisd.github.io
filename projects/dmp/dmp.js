/* Rethinking Reservoir Pruning: card and detail-page content in both languages.
   This folder holds everything for the project: index.html (page), dmp.js (content),
   the thumbnail, and any case-study Markdown and images. */
Portfolio.project("dmp", {
  en: {
    "title": "Rethinking Reservoir Pruning",
    "description": "A dynamical perspective on pruning echo state networks: score reservoir neurons by the dynamics they carry, keep the top ones in one shot.",
    "image": "thumbnail.webp",
    "image_alt": "The reservoir pruning method from the paper",
    "image_class": "project-image-paper",
    "url": "https://github.com/Laudarisd/dmp_esn",
    "subtitle": "Rethinking Reservoir Pruning: A Dynamical Perspective for Echo State Networks. Reservoir neurons are scored by a Gram matrix of the reservoir's Jacobians along its driven trajectory, the top N′ are kept in one shot, the pruned reservoir is spectrally rescaled, and only the readout is retrained.",
    "tags": ["Echo State Network", "Reservoir Computing", "Network Pruning", "Dynamical Systems", "Jacobian / Gram Matrix", "Spectral Rescaling", "Python"],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/Laudarisd/dmp_esn"
      }
    ]
  },
  kr: {
    "title": "Rethinking Reservoir Pruning",
    "description": "Echo State Network Pruning을 동역학의 관점에서 다시 봐요. Reservoir 뉴런을 그들이 실어 나르는 동역학으로 점수 매기고, 상위 뉴런을 한 번에 남겨요.",
    "image": "thumbnail.webp",
    "image_alt": "논문의 Reservoir Pruning 방법",
    "image_class": "project-image-paper",
    "url": "https://github.com/Laudarisd/dmp_esn",
    "subtitle": "Rethinking Reservoir Pruning: A Dynamical Perspective for Echo State Networks. 구동 궤적에 대한 Reservoir Jacobian의 Gram 행렬로 뉴런에 점수를 매기고, 상위 N′개를 한 번에 남기고, 잘라낸 Reservoir를 Spectral Rescaling 한 뒤 Readout만 다시 학습해요.",
    "tags": ["Echo State Network", "Reservoir Computing", "Network Pruning", "Dynamical Systems", "Jacobian / Gram Matrix", "Spectral Rescaling", "Python"],
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/Laudarisd/dmp_esn"
      }
    ]
  }
});
