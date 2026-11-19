# DMP - Dynamical Movement Primitives with Reservoir Computing
<p>Research on teaching robots motions: dynamical movement primitives (DMP) that store a demonstrated movement as a stable dynamical system, driven by an echo state network, and a pruning method that removes the parts of the network that do not contribute.</p>
<p><strong>Keywords</strong></p>
<div class="fact-grid">
<div class="fact"><span class="fact-label">Domain</span><span class="fact-value">Robot motion learning</span></div>
<div class="fact"><span class="fact-label">Method</span><span class="fact-value">DMP + echo state network</span></div>
<div class="fact"><span class="fact-label">Research</span><span class="fact-value">Centrality-based network pruning</span></div>
<div class="fact"><span class="fact-label">Output</span><span class="fact-value">Paper and code</span></div>
</div>
<figure class="figure-small">
<img src="images/esn_pruning.png" alt="Method figure from the paper: the reservoir W driven by the input, the Jacobian and Gram matrix over the trajectory, neurons ranked by their score with the top ones kept and the rest pruned, one-shot selection, spectral rescaling and the readout W_out">
<figcaption>The pruning method from the paper. The reservoir is driven along a trajectory, a Gram matrix of its Jacobians scores every neuron, the top-scoring neurons are kept in one shot, the pruned reservoir is spectrally rescaled, and only the readout is retrained.</figcaption>
</figure>

---

## 1. Introduction
<p>A dynamical movement primitive takes one demonstrated motion and turns it into a differential equation that always converges to its goal, so the same motion can be replayed to a new target, at a new speed, without breaking. The shaping term of that equation has to be learned, and in this work an echo state network, a reservoir of fixed random neurons with one trained readout, does the learning. Reservoirs are large and most of their neurons are redundant, so the second part of the research prunes them by centrality and measures how much can be removed before the motion degrades.</p>

---

## 2. Goal
<div class="callout callout-goal">
<h4>Goal</h4>
<ul>
<li>Learn a demonstrated robot motion as a DMP and reproduce it reliably to new goals and durations.</li>
<li>Use an echo state network as the DMP's function approximator and study how its size affects accuracy.</li>
<li>Prune the reservoir by node centrality and quantify the trade-off between network size and motion error.</li>
</ul>
</div>

---

## 3. Code and details on GitHub
<p>The main project and its technical details are uploaded to GitHub, so please refer to the repository to understand the work in detail.</p>
<p><a href="https://github.com/Laudarisd/dmp_esn" target="_blank" rel="noopener noreferrer">GitHub: https://github.com/Laudarisd/dmp_esn</a></p>
