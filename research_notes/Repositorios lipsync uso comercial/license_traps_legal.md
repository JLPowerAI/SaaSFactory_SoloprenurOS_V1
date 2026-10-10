# License Traps & Legal/Regulatory Considerations for Commercial Lip-Sync / Talking-Head SaaS (as of October 2026)

> NOT LEGAL ADVICE. These are research notes. Where a license is ambiguous or a fact could not be verified in this session, it is flagged.
>
> Method note: huggingface.co, stability.ai, robots.ox.ac.uk, joneswalker.com and praxikon.com were unreachable from the research environment (DNS failure). Claims about components hosted on those domains are marked **[UNVERIFIED THIS SESSION]**. They are based on the researcher's prior knowledge, and the official URL is given so the writer or user can confirm them. Everything not marked was confirmed against the cited page in this session (Oct 10, 2026).

---

## Key Question 1: For each component, what is the license, is commercial use allowed, and what is a safe substitute?

### Takeaway
Most "MIT/Apache" lip-sync repos are permissive only at the **code** layer. The traps sit one layer down: the **pretrained weights** (Wav2Lip, InsightFace, dlib-68, CodeFormer, BiSeNet/face-parsing, many SyncNet checkpoints), **bundled third-party CUDA ops** (NVIDIA StyleGAN2 ops inside GFPGAN), **training datasets** (LRS2, CelebV-HQ, CelebAMask-HQ, FFHQ, 300-W) and **base-model licenses** (OpenRAIL-M use restrictions, the Stability revenue threshold, HunyuanVideo's territory exclusion). In a lip-sync pipeline the face detector, landmarker, parser and restorer are the usual hidden non-commercial pieces, more often than the lip-sync model itself.

### Cited Findings

#### A. Lip-sync models and SyncNet
- **Wav2Lip (Rudrabha):** the README states "This repository can only be used for personal/research/non-commercial purposes" and "As the models are trained on the LRS2 dataset, any form of commercial use is strictly prohibited". For commercial requests it points to Sync Labs ("For HD commercial model, please try out Sync Labs", "We have a turn-key hosted API"). The repo has **no LICENSE file**, and the pretrained weights table (Wav2Lip, Wav2Lip+GAN) carries no separate license. — [Wav2Lip GitHub README](https://github.com/Rudrabha/Wav2Lip)
  - Implication: the Wav2Lip **SyncNet expert discriminator** (lipsync_expert.pth) is covered by the same repo-level non-commercial statement and was also trained on LRS2. — [Wav2Lip GitHub README](https://github.com/Rudrabha/Wav2Lip)
  - Commercial path: license or API from Sync Labs (sync.so). — [Wav2Lip GitHub README](https://github.com/Rudrabha/Wav2Lip)
  - Trap: many forks and derivatives (Wav2Lip-HD, Easy-Wav2Lip, video-retalking, SadTalker's optional enhancer paths, various "MIT" wrappers) put an MIT LICENSE on wrapper code that still downloads `wav2lip.pth`, `wav2lip_gan.pth` or `lipsync_expert.pth`. The MIT notice does not relicense those weights. (Inference from the README terms above.)

#### B. Training datasets
- **LRS2** (BBC / Oxford VGG): access requires a signed BBC data-sharing agreement and is limited to non-commercial academic research. Wav2Lip itself cites LRS2 as the reason commercial use is prohibited. — [Wav2Lip README](https://github.com/Rudrabha/Wav2Lip); dataset page [LRS2 (Oxford VGG)](https://www.robots.ox.ac.uk/~vgg/data/lip_reading/lrs2.html) **[dataset page UNVERIFIED THIS SESSION]**
- **LRS3** (TED/TEDx): **[UNVERIFIED THIS SESSION]** distributed for research; the source TED videos are CC BY-NC-ND 4.0, i.e. non-commercial and no derivatives. — [LRS3 page](https://www.robots.ox.ac.uk/~vgg/data/lip_reading/lrs3.html)
- **VoxCeleb1/2:** **[UNVERIFIED THIS SESSION]** the annotations and metadata are released under CC BY 4.0, but the underlying videos are third-party YouTube content whose rights the dataset does not grant. Commonly used to train SyncNet variants (e.g., LatentSync's StableSyncNet). — [VoxCeleb page](https://www.robots.ox.ac.uk/~vgg/data/voxceleb/)
- **HDTF:** "available to download under a Creative Commons Attribution 4.0 International License". There is no separate commercial-use statement, and the clips themselves are YouTube videos. — [HDTF GitHub README](https://github.com/MRzzm/HDTF)
- **CelebV-HQ:** "available for non-commercial research purposes only". Users may not "sell, trade, resell or exploit for any commercial purposes" any portion of the videos **or derived data**, and may not "further copy, publish or distribute" it. — [CelebV-HQ GitHub README](https://github.com/CelebV-HQ/CelebV-HQ)
- **TalkingHead-1KH (NVIDIA):** the videos "were published in YouTube by their respective authors under Creative Commons BY 3.0 license"; the metadata, scripts and docs are "made available under MIT license". Commercial use is not stated. The README says "For business inquiries, please visit our website and submit the form" (NVIDIA Research Licensing). — [TalkingHead-1KH GitHub README](https://github.com/tcwang0509/TalkingHead-1KH)
- **MEAD:** no license was found in this session. An aggregator dataset card only says to consult MEAD's own license. — [HF 3DTalkingDataset card (secondary)](https://huggingface.co/datasets/EngineeringAI-LAB/3DTalkingDataset/blob/main/README.md)
- **GRID / RAVDESS** (secondary source): GRID is listed as research use only and RAVDESS as CC BY-NC-SA 4.0. — [HF 3DTalkingDataset card (secondary)](https://huggingface.co/datasets/EngineeringAI-LAB/3DTalkingDataset/blob/main/README.md)

#### C. Face detection, landmarks, parsing and swapping
- **InsightFace:** the code is "released under the MIT License. There is no limitation for both academic and commercial usage". The pretrained models and training data, however, "are available for non-commercial research purposes only", including models auto-downloaded through the Python library. Per the 2025-11-24 update, commercial licensing goes to `recognition-oss-pack@insightface.ai` for the open-sourced face recognition models (e.g., the **buffalo_l** pack) and to `contact@insightface.ai` for **inswapper** (inswapper_128.onnx, inswapper-512-live) and the InspireFace SDK. The README does not mention **antelopev2** by name. Because it is distributed as an InsightFace model pack, it presumably falls under the same non-commercial model policy (an inference). — [InsightFace GitHub README](https://github.com/deepinsight/insightface)
  - Trap: InsightFace packs (SCRFD detector, ArcFace recognizer, 2D106 landmarks) are pulled in silently by FaceFusion, LivePortrait-adjacent tools, IP-Adapter-FaceID, InstantID, PuLID, many face-crop utilities and some talking-head preprocessors. (Inference; check each repo's requirements and download scripts.)
- **dlib `shape_predictor_68_face_landmarks.dat`** (trained on iBUG 300-W): "The license for this dataset excludes commercial use", so "the trained model therefore can't be used in a commercial product". The author says to "contact a lawyer or talk to Imperial College London". The 5-point model was trained on dlib's own internet-image dataset and its README section has no restriction statement. — [dlib-models README](https://github.com/davisking/dlib-models)
- **MediaPipe** (Google): Apache-2.0 for code and the bundled Face Detector / Face Landmarker / Face Mesh models. **[UNVERIFIED THIS SESSION; widely documented]** — [MediaPipe GitHub](https://github.com/google-ai-edge/mediapipe). This is the standard commercial-safe substitute for dlib-68 and InsightFace detection and landmarks.
- **face-alignment (FAN, 1adrianb)**, **RetinaFace** (e.g., biubug6/Pytorch_Retinaface), **S3FD** and **BiSeNet face-parsing** (zllrunning/face-parsing.PyTorch, the `79999_iter.pth` weights used by MuseTalk and others): the code is BSD/MIT. The weights were trained on research datasets: WIDER FACE for RetinaFace and S3FD, 300W-LP/300-W-derived data for FAN, and CelebAMask-HQ (non-commercial research) for BiSeNet face-parsing. **[UNVERIFIED THIS SESSION: dataset license texts not fetched]** Treat these weights as "grey" until the dataset licenses are confirmed.

#### D. Face restoration (often bolted on for "HD" lip-sync)
- **GFPGAN (TencentARC):** licensed "Apache License Version 2.0" **except** for the listed third-party components. The LICENSE includes "Terms of the Nvidia License", which covers the StyleGAN2-derived CUDA ops: §3.3 "Use Limitation", where the Work and derivatives "may be used or intended for use non-commercially", defined as "for research or evaluation purposes only". It also includes **DFDNet** under "Creative Commons Attribution-NonCommercial-ShareAlike 4.0". — [GFPGAN LICENSE](https://github.com/TencentARC/GFPGAN/blob/master/LICENSE)
  - Nuance (inference): GFPGAN v1.3/v1.4 "clean" models avoid the custom CUDA ops, which reduces but does not remove the NVIDIA-code exposure. The weights were trained on FFHQ (NVIDIA; dataset collection under CC BY-NC-SA 4.0 **[UNVERIFIED THIS SESSION]**). GFPGAN also pulls in **facexlib**, whose detection and parsing weights are RetinaFace and BiSeNet-type models (see C).
- **CodeFormer (S-Lab, NTU):** licensed under "S-Lab License 1.0", which grants redistribution and use only "for non-commercial purpose". For commercial use: "please contact the contributor(s) of the work". — [CodeFormer LICENSE](https://github.com/sczhou/CodeFormer/blob/master/LICENSE)
- **GPEN** and **RestoreFormer/RestoreFormer++:** licenses were not checked in this session (see Gaps).

#### E. Audio encoders
- **Whisper (OpenAI):** code and weights are MIT. **[UNVERIFIED THIS SESSION; widely documented]** — [openai/whisper LICENSE](https://github.com/openai/whisper/blob/main/LICENSE). Used by MuseTalk, LatentSync and EchoMimic.
- **HuBERT / wav2vec 2.0:** the fairseq code is MIT. The official Facebook checkpoints were trained on LibriSpeech/Libri-Light, and HF ports such as `facebook/hubert-*` and `facebook/wav2vec2-*` are generally tagged Apache-2.0. **[UNVERIFIED THIS SESSION]** — [fairseq LICENSE](https://github.com/facebookresearch/fairseq/blob/main/LICENSE). Trap: community checkpoints used in Chinese-origin talking-head repos (e.g., `TencentGameMate/chinese-hubert-*`, `chinese-wav2vec2-*`, used by Hallo, EchoMimic and MultiTalk/InfiniteTalk) may carry no license or a different one; check each HF card.
- **DeepSpeech (Mozilla):** MPL-2.0 and archived/unmaintained. **[UNVERIFIED THIS SESSION]** — [mozilla/DeepSpeech](https://github.com/mozilla/DeepSpeech)

#### F. Base generative models
- **Stable Diffusion 1.5:** CreativeML OpenRAIL-M. Commercial use is permitted, but the Attachment A use restrictions must be passed through to downstream users in your ToS. **sd-vae-ft-mse** (the VAE used by MuseTalk and LatentSync-1.x) is MIT on its HF card. **[UNVERIFIED THIS SESSION; HF unreachable]** — [SD v1.5 license](https://huggingface.co/spaces/CompVis/stable-diffusion-license), [stabilityai/sd-vae-ft-mse](https://huggingface.co/stabilityai/sd-vae-ft-mse)
- **Stable Video Diffusion (SVD):** Stability AI Community License. It is free for organizations below **US$1M annual revenue**; above that an Enterprise license is required. **[UNVERIFIED THIS SESSION; stability.ai unreachable]** — [Stability AI Community License](https://stability.ai/community-license-agreement)
- **Wan2.1 / Wan2.2:** Apache-2.0. **[UNVERIFIED THIS SESSION]** — [Wan-Video/Wan2.1](https://github.com/Wan-Video/Wan2.1). Note: a Wan-based lip-sync model (e.g., InfiniteTalk/MultiTalk) can inherit separate audio-encoder and dataset issues.
- **HunyuanVideo (Tencent Hunyuan Community License):** "Territory" means "the worldwide territory, **excluding the territory of the European Union, United Kingdom and South Korea**", and "Any such use outside the Territory is unlicensed and unauthorized". Services with **>100 million MAU** must request a license from Tencent. The license also says "You must not use … any Output … to improve any other AI model", so no distilling or training on its outputs. The Acceptable Use Policy prohibits presenting content without "expressly and conspicuously identifying that the information and/or content is machine generated". "Tencent claims no rights in Outputs". — [HunyuanVideo LICENSE.txt](https://github.com/Tencent-Hunyuan/HunyuanVideo/blob/main/LICENSE.txt)
  - Implication (inference): HunyuanVideo-derived avatar/lip-sync models (e.g., HunyuanVideo-Avatar, HunyuanCustom) are likely under the same license family. A SaaS available to EU or UK users is therefore outside the licensed territory, and geo-blocking alone may be inadequate.
- **CogVideoX:** the code is Apache-2.0. CogVideoX-2B (transformer and VAE) is Apache-2.0. **CogVideoX-5B** (T2V and I2V transformer) is under the separate "CogVideoX LICENSE" on HF. The README does not state the license for CogVideoX1.5. — [CogVideo README](https://github.com/THUDM/CogVideo)
- **3DMM models (FLAME, Basel Face Model):** **[UNVERIFIED THIS SESSION]** BFM 2009/2017 (Univ. of Basel) is distributed under a non-commercial research license agreement. FLAME (MPI-IS) was historically under a non-commercial scientific license, and the FLAME 2023 release was reportedly re-licensed CC BY 4.0. DECA/EMOCA/SMIRK-style code from MPI is typically non-commercial. These are used by SadTalker (BFM via Deep3DFaceRecon) and many 3DMM-driven talking heads. — [BFM](https://faces.dmi.unibas.ch/bfm/bfm2019.html), [FLAME](https://flame.is.tue.mpg.de/)

#### G. Summary table (writer can reuse; ✔ = verified this session; ? = unverified)

| Component | License (weights/data) | Commercial? | Safer substitute |
|---|---|---|---|
| Wav2Lip / Wav2Lip-GAN weights ✔ | Repo statement: personal/research/non-commercial; no LICENSE file | No (contact Sync Labs) | Sync Labs API/license; self-trained model on licensed data; check LatentSync/MuseTalk (see caveats) |
| Wav2Lip SyncNet expert ✔ | Same; trained on LRS2 | No | Retrain SyncNet on consented/commercially licensed footage |
| LRS2 ✔(via Wav2Lip) / LRS3 ? | BBC agreement / TED CC BY-NC-ND | No | Licensed or consented in-house corpora |
| VoxCeleb1/2 ? | CC BY 4.0 annotations; YouTube video rights not granted | Grey | Same |
| HDTF ✔ | CC BY 4.0 (stated); YouTube sources | Grey (attribution; underlying rights unclear) | Same |
| CelebV-HQ ✔ | Non-commercial research only; derived data also barred | No | Avoid |
| TalkingHead-1KH ✔ | Videos CC BY 3.0; scripts MIT; business inquiries to NVIDIA | Grey/likely OK with attribution, per stated video license | — |
| MEAD ? | Not found | Unknown | Avoid until confirmed |
| InsightFace models (buffalo_l, antelopev2, inswapper, SCRFD) ✔ | Non-commercial research only | No (paid license available) | MediaPipe (Apache-2.0); OpenCV YuNet/SFace (check opencv_zoo licenses); paid InsightFace license |
| dlib 68-pt ✔ | iBUG 300-W excludes commercial | No | MediaPipe Face Landmarker; dlib 5-pt (no restriction stated) |
| FAN / RetinaFace / S3FD / BiSeNet weights ? | Code BSD/MIT; weights trained on research datasets | Grey | MediaPipe; self-trained parser on licensed data |
| GFPGAN ✔ | Apache-2.0 + NVIDIA NC ops + DFDNet CC BY-NC-SA; FFHQ-trained | Grey/No if NC ops bundled | Skip restoration or license a commercial restorer |
| CodeFormer ✔ | S-Lab License 1.0, non-commercial | No | Same as above |
| Whisper ? | MIT | Yes | — |
| HuBERT/wav2vec2 (official) ? | fairseq MIT; HF ports Apache-2.0 | Yes (verify card) | Official FB checkpoints, not community ports |
| SD 1.5 ? / sd-vae-ft-mse ? | OpenRAIL-M / MIT | Yes with use restrictions | — |
| SVD ? | Stability Community License | Yes < $1M revenue | Wan2.x (Apache) |
| Wan2.1/2.2 ? | Apache-2.0 | Yes | — |
| HunyuanVideo ✔ | Tencent Hunyuan Community License | Yes but **not in EU/UK/KR**; no training on outputs | Wan2.x |
| CogVideoX-2B ✔ / 5B ✔ | Apache-2.0 / CogVideoX LICENSE | Yes / check custom terms | 2B or Wan |
| BFM ? / FLAME ? | NC research / (2023: CC BY 4.0 reportedly) | No / check version | FLAME 2023 if confirmed |

### Inferences
- **The lip-sync model is often not the main problem.** MuseTalk, LatentSync and similar newer repos advertise MIT/Apache code and Whisper + SD-VAE backbones, which are fine. Their preprocessing (face detection via S3FD/InsightFace/dlib, parsing via BiSeNet, pose via DWPose) and optional restorers (GFPGAN/CodeFormer) are where non-commercial weights slip in. The audit unit must be **every downloaded `.pth`/`.onnx`/`.safetensors` file**, not the repo LICENSE.
- **"HDTF CC BY 4.0" does not clear the underlying YouTube footage.** The dataset authors can license their curation and annotations, not the speakers' likeness or the uploaders' copyright. Training-data provenance remains a separate, unresolved risk even when the dataset license looks permissive.
- **The safest commercial architecture for a solopreneur** is a licensed hosted API (e.g., Sync Labs, which inherits Wav2Lip lineage under a commercial license) or an Apache/MIT stack with MediaPipe for face handling, Whisper for audio, Wan2.x or a self-trained model as the generator, and no restoration step, or a restorer with confirmed commercial terms.

### Gaps
- Licenses for **GPEN**, **RestoreFormer/RestoreFormer++**, **MEAD**, **LRS3**, **VoxCeleb**, **WIDER FACE**, **CelebAMask-HQ**, **FFHQ**, **300W-LP**, **LatentSync** (ByteDance), **MuseTalk** (Tencent), the **CogVideoX LICENSE** text, and **antelopev2** specifically were not fetched in this session. Several of these are on huggingface.co or robots.ox.ac.uk, which were unreachable.
- The exact current terms of the Stability AI Community License (revenue threshold, registration) and SD 1.5 OpenRAIL-M could not be re-verified (stability.ai/HF unreachable).
- InsightFace commercial license pricing is not public.

---

## Key Question 2: Are weights trained on non-commercial datasets themselves restricted? (the legal debate)

### Takeaway
It is unsettled. No court ruling was found that decides whether a dataset's non-commercial term "flows through" to trained weights. Two things point the same way in practice: the authors of the most-used components (Wav2Lip, InsightFace, dlib-68, CelebV-HQ) **explicitly assert** that it does, and some dataset agreements (CelebV-HQ) expressly cover "derived data". For a small SaaS, the practical answer is to treat such weights as restricted.

### Cited Findings
- Wav2Lip ties its prohibition directly to training data: "As the models are trained on the LRS2 dataset, any form of commercial use is strictly prohibited." — [Wav2Lip README](https://github.com/Rudrabha/Wav2Lip)
- dlib's author takes the same position for 300-W: "the trained model therefore can't be used in a commercial product", while advising users to ask a lawyer or Imperial College. — [dlib-models README](https://github.com/davisking/dlib-models)
- InsightFace extends the non-commercial restriction from its "training data" to "models trained" on it. — [InsightFace README](https://github.com/deepinsight/insightface)
- CelebV-HQ forbids commercial exploitation of "any portion of the videos **or derived data**". This is contract language that arguably reaches models trained on it, though whether weights count as "derived data" is not defined. — [CelebV-HQ README](https://github.com/CelebV-HQ/CelebV-HQ)
- The "restriction-inheritance" view, plus prevalence data: Black Duck reports that a small set of explicitly non-commercial datasets (15 cases, 6.5%) appeared in over 30% of models it analyzed, and flags Apache-2.0-labelled models trained on that data as inconsistent. — [Black Duck blog](https://www.blackduck.com/blog/open-source-ai-model-licensing-risk.html)
- Practitioner precedent: ESPnet's XEUS model switched its weights from MIT to CC-BY-NC-SA after discussions with its data providers. — [HF discussion, espnet/xeus](https://huggingface.co/espnet/xeus/discussions/4)
- The counter-view, that training is not reproduction so copyright-based dataset licenses may not reach the weights, exists mainly in practitioner commentary and is acknowledged as unsettled. — [Intuition Labs on open-weight licenses](https://intuitionlabs.ai/articles/open-weight-ai-model-licenses); [Black Duck](https://www.blackduck.com/blog/open-source-ai-model-licensing-risk.html)

### Inferences
- There are **two separate legal theories**, and both matter:
  1. **Copyright/database right**: are weights a derivative work of the training data? This is uncertain, with jurisdiction-specific rules (EU TDM exceptions, US fair use).
  2. **Contract**: did the user of the dataset or model agree to terms? This theory is much stronger against the **party who downloaded the weights under a non-commercial notice**, regardless of how the copyright question resolves. A SaaS operator who downloads `wav2lip_gan.pth` from a page saying "commercial use is strictly prohibited" is exposed mainly on contract and notice grounds.
- **Serving over an API is not a loophole.** The restriction concerns commercial *use*, not just distribution, so hosting a non-commercial model behind a paid API is still commercial use (consistent with the NV-Embed analysis summarized in [Black Duck](https://www.blackduck.com/blog/open-source-ai-model-licensing-risk.html)).
- For likeness-heavy datasets (YouTube faces), **personality/publicity and GDPR biometric-data issues** sit on top of copyright. Model licenses cannot cure these issues.

### Gaps
- No case law was found on weight inheritance of dataset licenses in the US, EU or UK as of Oct 2026.
- There is no authoritative legal (law-review or court) source specific to face/lip-sync datasets.

---

## Key Question 3: What legal and regulatory obligations apply to a small SaaS offering lip-sync/dubbing (EU AI Act Art. 50, US digital-replica laws, consent, watermarking)?

### Takeaway
- **EU:** AI Act Art. 50 transparency duties have applied since **2 Aug 2026** and were *not* postponed by the Digital Omnibus. Providers must machine-mark outputs (grace to **2 Dec 2026** for systems already on the market), and deployers must disclose deepfakes.
- **US:** there is no federal digital-replica law yet. The **NO FAKES Act of 2026** (S.4591) was reported out of Senate Judiciary in June 2026 and is pending. State laws already bite: Tennessee's ELVIS Act reaches *tool distributors*, California AB 2602/AB 1836, and New York's synthetic-performer ad disclosure law (effective 9 Jun 2026, with a translation exemption relevant to dubbing).
- **For all markets:** documented consent of the person depicted, labeling and C2PA/watermarking are the baseline.

### Cited Findings

#### EU AI Act, Article 50
- Article 50's core transparency duties, including deepfake labelling, have applied since **2 August 2026**. The Digital Omnibus (cited as Regulation (EU) 2026/1744) moved only high-risk deadlines (Annex III to 2 Dec 2027, Annex I to 2 Aug 2028). — [Usercentrics](https://usercentrics.com/knowledge-hub/eu-ai-act-high-risk-delay-article-50-transparency-consent/); [Jones Walker AI Law Blog](https://www.joneswalker.com/en/insights/blogs/ai-law-blog/yes-august-2-still-matters-the-eu-approved-a-high-risk-ai-delay-but-most-trans.html); [CSA research note](https://labs.cloudsecurityalliance.org/research/csa-research-note-eu-ai-act-article-50-transparency-20260729/)
- **Art. 50(2)** (providers of generative systems must mark output in a machine-readable, detectable way): generative systems placed on the market **before 2 Aug 2026** get until **2 Dec 2026**. One source mentions **2 Feb 2027** for detection-interoperability aspects; sources conflict on this. — [CSA: Watermarking grace period ends Dec 2026](https://labs.cloudsecurityalliance.org/research/csa-research-note-eu-ai-act-article50-watermarking-deadline/); [Certivo](https://www.certivo.com/blog-details/eu-ai-act-august-2026-what-applies-after-the-digital-omnibus)
- **Art. 50(4)** (deployers must disclose that image/audio/video content is a deepfake): enforceable since 2 Aug 2026 with no extension. — [Hello Growth](https://hellogrowth.ai/en/blog/eu-ai-act-2026-omnibus-labelling-ai-content); [Usercentrics](https://usercentrics.com/knowledge-hub/eu-ai-act-high-risk-delay-article-50-transparency-consent/)
- Fines for transparency breaches can reach **€15M or 3% of worldwide annual turnover**, whichever is higher. — [search summary of Usercentrics/Certivo](https://www.certivo.com/blog-details/eu-ai-act-august-2026-what-applies-after-the-digital-omnibus)
- The EU has finalised a Code of Practice on marking and labelling AI-generated content. — [Paul, Weiss memo](https://www.paulweiss.com/insights/client-memos/eu-finalises-transparency-rules-for-ai-generated-content)
- Conflict noted: sources disagree on the Omnibus entry-into-force date (one says 27 July 2026). Verify against the Official Journal. — [Usercentrics](https://usercentrics.com/knowledge-hub/eu-ai-act-high-risk-delay-article-50-transparency-consent/)
- **[UNVERIFIED THIS SESSION, from the AI Act text]** Art. 50(4) contains a lighter regime for "evidently artistic, creative, satirical, fictional or analogous" works, where disclosure must not hamper display or enjoyment. A lip-sync SaaS is both a **provider** (50(2) marking) and often supplies output that its customers deploy (50(4) disclosure). — [EUR-Lex AI Act, Reg. (EU) 2024/1689](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)

#### US federal
- **NO FAKES Act of 2026:** S.4591 was introduced 20 May 2026 (Coons) and ordered reported by Senate Judiciary (June 2026; sources differ on 18 vs 24 June). It is on the Senate Legislative Calendar and **not law** as of Oct 2026. The House companion H.R.8915 (Salazar) is still in committee. It would create a federal right in voice and visual likeness against unauthorized digital replicas, with preemption of some state laws, notice-and-takedown safe harbors for online services, and license-term limits. — [Congress.gov S.4591](https://www.congress.gov/bill/119th-congress/senate-bill/4591); [GovTrack](https://www.govtrack.us/congress/bills/119/s4591); [Holland & Knight](https://www.hklaw.com/en/insights/publications/2026/06/senate-judiciary-committee-advances-legislation-to-protect-name); [ByteBack Law](https://www.bytebacklaw.com/2026/08/a-federal-shift-in-ai-and-the-right-of-publicity-no-fakes-act-advances-in-congress/); [H.R.8915 text](https://www.congress.gov/bill/119th-congress/house-bill/8915/text)
- **[UNVERIFIED THIS SESSION]** The TAKE IT DOWN Act (signed May 2025) criminalizes non-consensual intimate deepfakes and requires covered platforms to run a 48-hour removal process (platform compliance from May 2026). This is relevant if users can upload arbitrary faces. — [Congress.gov S.146](https://www.congress.gov/bill/119th-congress/senate-bill/146)

#### US states
- **Tennessee ELVIS Act** (effective 1 Jul 2024): adds voice to the right of publicity and bars generative-AI vocal replicas without consent. Violations carry civil liability and are a Class A misdemeanor. — [Manatt](https://www.manatt.com/insights/newsletters/client-alert/tennessees-elvis-act-expands-publicity-rights-for)
  - **Tool-provider liability:** the Act reaches anyone who distributes or makes available "an algorithm, software, tool, or other technology, service, or device, the primary purpose or function of which is the production of a particular, identifiable individual's photograph, voice, or likeness", with knowledge that the use was unauthorized. No court has interpreted "primary purpose or function". Single-purpose deepfake tools are likely covered; general-purpose tools are an open question. Firms advise contract terms barring unauthorized likeness use and careful marketing. — [Wilson Sonsini](https://www.wsgr.com/print/v2/content/49022661/The-ELVIS-Act%3A-Setting-the-Stage-for-Policing-Unauthorized-Use-of-AI-Generated-Sound-and-Likeness.pdf); [Latham & Watkins](https://www.lw.com/admin/upload/SiteAttachments/The-ELVIS-Act-Tennessee-Shakes-Up-Its-Right-of-Publicity-Law-and-Takes-On-Generative-AI.pdf); [Proskauer](https://www.proskauer.com/blog/the-king-is-back-in-the-digital-era-the-elvis-act-generative-ai-and-right-of-publicity)
- **California AB 2602** (effective 1 Jan 2025): contract provisions allowing creation or use of a performer's digital replica are unenforceable without informed consent and specific description of uses. **AB 1836** extends the post-mortem right of publicity to digital replicas of deceased persons. — [Davis+Gilbert](https://www.dglaw.com/california-passes-new-legislation-prohibiting-unauthorized-ai-replicas/); [Mondaq](https://www.mondaq.com/unitedstates/new-technology/1523348/california-passes-new-legislation-prohibiting-unauthorized-ai-replicas); [Skadden](https://www.skadden.com/insights/publications/2024/09/california-enacts-host-of-ai-related-bills)
- **New York synthetic-performer law** (N.Y. Gen. Bus. Law § 396-b, effective **9 June 2026**): advertisers must conspicuously disclose synthetic performers in ads when they have actual knowledge. Penalties are $1,000 for a first violation and $5,000 for each subsequent one, with no express private right of action. Exemptions include audio-only ads, **translation services that only translate a human performer's language**, and certain expressive-work promotions. — [Cooley](https://www.cooley.com/news/insight/2026/2026-01-29-new-york-enacts-synthetic-performer-disclosure-law-for-advertisements-including-those-using-generative-ai); [Manatt](https://www.manatt.com/insights/newsletters/client-alert/new-york-synthetic-performer-law-what-advertisers-need-to-know); [Davis Wright Tremaine](https://www.dwt.com/blogs/artificial-intelligence-law-advisor/2026/01/ny-state-consumer-facing-ai-regulation); [Ashurst Perkins Coie](https://www.ashurstperkinscoie.com/en/insights/new-york-requires-disclosure-of-synthetic-performers-in-ads/)
- **[UNVERIFIED THIS SESSION]** New York also amended its post-mortem publicity statute (Civ. Rights Law § 50-f) to cover digital replicas of deceased performers. — [Private Law wiki (secondary)](https://wiki.private.law/en/publicity-rights-ai.md); [DWT](https://www.dwt.com/blogs/artificial-intelligence-law-advisor/2026/01/ny-state-consumer-facing-ai-regulation)
- **[UNVERIFIED THIS SESSION]** California SB 942 (AI Transparency Act) requires "covered providers" (generative AI systems with >1M monthly users in CA) to offer a free detection tool plus latent and optional manifest disclosures. The operative date was reportedly moved to 2 Aug 2026 by AB 853. A small SaaS is likely below the threshold, but its upstream API vendors may not be. — [CA Legislature SB 942](https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202320240SB942)

#### Watermarking / provenance
- **[UNVERIFIED THIS SESSION]** C2PA "Content Credentials" is the main open standard for signed provenance manifests and is widely cited as a way to meet Art. 50(2) and SB 942-type marking duties. It should be combined with an invisible watermark, because metadata is stripped on re-encode. — [C2PA specifications](https://c2pa.org/specifications/)
- Model licenses can add contractual labeling duties. HunyuanVideo's AUP prohibits outputs presented without "expressly and conspicuously identifying that the information and/or content is machine generated". — [HunyuanVideo LICENSE.txt](https://github.com/Tencent-Hunyuan/HunyuanVideo/blob/main/LICENSE.txt)

### Inferences
- **The dubbing use case has a favorable carve-out in New York** (translation-only exemption). It does not have one under ELVIS, AB 2602 or the EU deepfake rules: changing a real person's mouth movements to say something new is a "deepfake" under the AI Act's definition, even when it is a faithful translation.
- **ELVIS Act tool-provider exposure is the biggest US risk for a lip-sync SaaS.** Marketing such as "make anyone say anything" increases the risk under the "primary purpose" test. Marketing focused on "dub your own videos", consent gating and ToS bans reduce it.
- **GDPR (EU users):** face geometry used for identification-like processing can be biometric special-category data, which requires a lawful basis and a DPIA. This was not researched in depth here.

### Gaps
- The Official Journal citation and entry-into-force date of the Digital Omnibus were not verified directly.
- The final text of the EU Code of Practice on AI-content marking was not reviewed.
- The full ELVIS statutory text (Tenn. Code § 47-25-1101 et seq.) was not fetched. Tool-liability language is from law-firm summaries.
- Other state laws (Illinois digital replica amendments, Texas, etc.) and non-US regimes (UK, China's deep synthesis rules, South Korea) were not covered.
- No enforcement actions against lip-sync tool providers were found.

---

## Key Question 4: What practical checklist should a solopreneur run before using any lip-sync repo commercially?

### Takeaway
Audit **every weight file and dataset**, not the repo LICENSE. Prefer hosted APIs with commercial licenses or a fully Apache/MIT chain, and build consent, labeling and provenance into the product from day one. The checklist below is assembled from the cited findings above.

### Cited Findings (basis for each checklist item)
- Repo LICENSE ≠ weights license (Wav2Lip has no LICENSE but a non-commercial README; InsightFace has MIT code but non-commercial models). — [Wav2Lip](https://github.com/Rudrabha/Wav2Lip); [InsightFace](https://github.com/deepinsight/insightface)
- Bundled third-party code can carry non-commercial licenses inside an Apache project (GFPGAN's NVIDIA ops and DFDNet). — [GFPGAN LICENSE](https://github.com/TencentARC/GFPGAN/blob/master/LICENSE)
- Territorial and output-use limits exist in base-model licenses (HunyuanVideo: EU/UK/KR excluded, no training on outputs). — [HunyuanVideo LICENSE](https://github.com/Tencent-Hunyuan/HunyuanVideo/blob/main/LICENSE.txt)
- Non-commercial dataset terms can explicitly cover "derived data" (CelebV-HQ). — [CelebV-HQ](https://github.com/CelebV-HQ/CelebV-HQ)
- License mislabeling is widespread (Black Duck findings). — [Black Duck](https://www.blackduck.com/blog/open-source-ai-model-licensing-risk.html)
- Regulatory duties: EU Art. 50 (in force Aug 2026), ELVIS tool liability, NY § 396-b, CA AB 2602. — sources in Key Question 3.

### Checklist (inferred from the findings above)
1. **Inventory every artifact.** Grep the repo for `wget`, `gdown`, `hf_hub_download`, `from_pretrained`, `insightface`, `dlib`, `facexlib`, `gfpgan`, `codeformer`, `face_alignment`, `retinaface` and `s3fd`, and check `requirements.txt` and auto-download code paths. List every `.pth/.onnx/.bin/.safetensors/.dat` file.
2. **For each artifact, record** the source URL, the license text (README, LICENSE, model card), the training dataset(s), and those datasets' licenses. "No license" means "all rights reserved", not "free".
3. **Red-flag list (block by default):** Wav2Lip/Wav2Lip-GAN/lipsync_expert weights; any InsightFace model pack (buffalo_l, antelopev2, inswapper, SCRFD); dlib 68-pt; CodeFormer; GFPGAN with NVIDIA CUDA ops or DFDNet; anything trained on LRS2/LRS3/CelebV-HQ/CelebAMask-HQ/300-W/BFM; HunyuanVideo-family models if you serve EU/UK/KR users.
4. **Grey list (needs a written decision or counsel):** VoxCeleb/HDTF-trained weights (permissive annotation licenses, unlicensed YouTube likenesses); RetinaFace/S3FD/FAN/BiSeNet weights; FFHQ-trained restorers; community HuBERT/wav2vec2 ports; CogVideoX-5B custom license; SVD above $1M revenue.
5. **Green list:** MediaPipe (Apache-2.0), Whisper (MIT), official fairseq HuBERT/wav2vec2, sd-vae-ft-mse (MIT), Wan2.1/2.2 (Apache-2.0), CogVideoX-2B (Apache-2.0). Re-verify each card at the exact commit or version you pin.
6. **Pin and archive.** Snapshot the license text and model card at the version you use; licenses change (InsightFace added licensing contacts in Nov 2025).
7. **Prefer licensed APIs for the risky layer** (e.g., Sync Labs for Wav2Lip-lineage lip-sync), or buy commercial licenses (InsightFace, Sync Labs), and keep invoices and contracts.
8. **If you self-train:** use consented footage with model releases covering AI training and synthesis, record provenance, and avoid scraped YouTube corpora.
9. **Consent gate in the product:** require uploaders to attest they are the person depicted or hold written authorization (California AB 2602 informed-consent standard; ELVIS). Add a no-public-figure / no-minors / no-sexual-content policy, plus a takedown process (TAKE IT DOWN, NO FAKES safe-harbor model).
10. **Marketing hygiene:** frame the product as dubbing and localization of *your own or authorized* content, never "make anyone say anything" (ELVIS "primary purpose" test).
11. **Labeling and provenance:** embed C2PA Content Credentials plus an invisible watermark on every output (Art. 50(2)). Provide visible "AI-generated/AI-dubbed" labels and pass the disclosure duty to customers in the ToS (Art. 50(4); NY § 396-b for ads; HunyuanVideo AUP if used).
12. **Pass-through terms:** if you use any OpenRAIL-M model (SD 1.5), include its use restrictions in your ToS.
13. **Geography:** geo-check model territorial limits (HunyuanVideo) against your customer base, and decide on EU compliance (AI Act plus GDPR biometric data/DPIA).
14. **Revenue triggers:** set reminders for license thresholds (Stability $1M revenue; Tencent 100M MAU).
15. **Get a one-time lawyer review** of the final bill of materials and ToS before launch. Many items above are legally ambiguous.

### Inferences
- A "clean" 2026 open stack for a small dubbing SaaS could be: MediaPipe (face detection and landmarks), Whisper or official HuBERT (audio features), a generator under Apache/MIT whose *training data* is also verified (or self-trained on consented data), no CodeFormer/GFPGAN, and C2PA plus watermark at output. In practice few public lip-sync checkpoints have fully clean training data, which is why licensed APIs remain the lowest-risk option for a solopreneur.

### Gaps
- No public, maintained "license bill of materials" for MuseTalk, LatentSync, LivePortrait, Hallo, EchoMimic, SadTalker or InfiniteTalk was found or checked in this session. Those repo-level audits should come from the parallel repo-focused research.
- Commercial pricing for Sync Labs and InsightFace licenses was not researched.
