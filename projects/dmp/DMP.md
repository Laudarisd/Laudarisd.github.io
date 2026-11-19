# Rethinking Reservoir Pruning: A Dynamical Perspective for Echo State Networks
<p>A research paper on making echo state networks smaller without breaking them. Instead of ranking reservoir neurons by weight size or by graph statistics, the method looks at the dynamics the reservoir actually produces on its input, scores every neuron by how much of that dynamics passes through it, and removes the rest in one shot.</p>
<p><strong>Keywords</strong></p>
<div class="fact-grid">
<div class="fact"><span class="fact-label">Domain</span><span class="fact-value">Reservoir computing · echo state networks</span></div>
<div class="fact"><span class="fact-label">Idea</span><span class="fact-value">Prune by the reservoir's dynamics, not by weights</span></div>
<div class="fact"><span class="fact-label">Scoring</span><span class="fact-value">Jacobian Gram matrix along the driven trajectory</span></div>
<div class="fact"><span class="fact-label">Selection</span><span class="fact-value">One shot: keep the top N′ neurons, rescale, retrain the readout</span></div>
<div class="fact"><span class="fact-label">Output</span><span class="fact-value">Paper and code</span></div>
</div>
<figure class="figure-small">
<img src="images/esn_pruning.png" alt="Method figure from the paper: the reservoir W driven by the input, the Jacobian and Gram matrix over the trajectory, neurons ranked by their score with the top ones kept and the rest pruned, one-shot selection, spectral rescaling and the readout W_out">
<figcaption>The method. The reservoir is driven along a trajectory, a Gram matrix of its Jacobians scores every neuron, the top-scoring neurons are kept in one shot, the pruned reservoir is spectrally rescaled, and only the readout is retrained.</figcaption>
</figure>

---

## 1. Introduction
<p>An echo state network is a large reservoir of fixed, randomly connected neurons with a single trained readout. The reservoir is usually far bigger than the task needs, and most of its neurons contribute little, but existing pruning rules decide which ones to drop from static properties such as weight magnitude or connectivity. Those properties say nothing about what the reservoir does once an input drives it. This paper takes the dynamical view: drive the reservoir along a trajectory, form the Jacobian at each step, and build a Gram matrix over the trajectory. Its leading modes are the directions in which the reservoir's state actually moves. Each neuron gets a score from how much it participates in those modes, the top N′ neurons are kept in a single pass, the pruned reservoir's spectral radius is rescaled back to its target, and only the readout is retrained.</p>

---

## 2. Goal
<div class="callout callout-goal">
<h4>Goal</h4>
<ul>
<li>Score reservoir neurons by their role in the reservoir's dynamics on real inputs rather than by weight size or graph statistics.</li>
<li>Prune in one shot, with no iterative retraining of the reservoir, and keep the echo state property through spectral rescaling.</li>
<li>Show how far a reservoir can be shrunk before readout accuracy drops, against the usual magnitude-based baselines.</li>
</ul>
</div>

---

## 3. Code and details on GitHub
<p>The main project and its technical details are uploaded to GitHub, so please refer to the repository to understand the work in detail.</p>
<p><a href="https://github.com/Laudarisd/dmp_esn" target="_blank" rel="noopener noreferrer">GitHub: https://github.com/Laudarisd/dmp_esn</a></p>
