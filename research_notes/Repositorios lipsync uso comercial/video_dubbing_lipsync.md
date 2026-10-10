# Open-source VIDEO-TO-VIDEO lip-sync / dubbing repos and whether they can be used commercially (as of October 2026)

Method note: LICENSE files, READMEs, configs and code were read directly from raw.githubusercontent.com. Last-commit dates come from shallow git clones run on 2026-10-10. huggingface.co was blocked by the sandbox network policy, so Hugging Face model-card license tags come from search-engine snippets of the card YAML. Those are marked "(HF card via search snippet)" and should be re-checked on the live card before a final decision.

---

## Q1. Which candidates have BOTH permissive code AND permissive weights? (fact sheets for the leading candidates)

### Takeaway
Only **MuseTalk v1.5** (MIT code; the README says the weights are usable "for any purpose, even commercially") and **InfiniteTalk** (Apache-2.0 for code and models) explicitly allow commercial use of both code and weights with no revenue cap. MuseTalk's HF card tag is creativeml-openrail-m, which still allows commercial use. **LatentSync 1.5/1.6** (Apache-2.0 code, OpenRAIL++ weights) is commercial-capable on paper. However, its inference pipeline auto-loads **InsightFace** detection/landmark models, which are "non-commercial research only". **KeySync** is Apache-2.0 for code and weights but is initialized from Stable Video Diffusion. **Lightricks LTX-2.x LipDub/Dub-It** is free for commercial use only for entities with annual revenue under $10M.

### Cited Findings

**MuseTalk (TMElyralab / Tencent Music), v1.0 and v1.5: verdict "Commercial OK with caveats" (strongest overall)**
- URL: https://github.com/TMElyralab/MuseTalk. Code license: MIT, "Copyright (c) 2024 Tencent Music Entertainment Group" — [LICENSE](https://github.com/TMElyralab/MuseTalk/blob/main/LICENSE)
- README Disclaimer/License: "`code`: ... MIT License. There is no limitation for both academic and commercial usage." "`model`: The trained model are available for any purpose, even commercially." "`other opensource model`: Other open-source models used must comply with their license, such as `whisper`, `ft-mse-vae`, `dwpose`, `S3FD`, etc." — [README](https://github.com/TMElyralab/MuseTalk/blob/main/README.md)
- HF model card YAML: `license: creativeml-openrail-m` (HF card via search snippet). This allows commercial use with use-based restrictions, so it does not contradict the README, but the two documents differ in form — [HF card](https://huggingface.co/TMElyralab/MuseTalk/blob/main/README.md)
- Architecture and dependencies: works in the latent space of a frozen VAE (`sd-vae-ft-mse`). Audio is encoded by frozen `whisper-tiny`. The generator UNet architecture is "borrowed from the UNet of the `stable-diffusion-v1-4`". It is NOT a diffusion model; it does single-step latent inpainting — [README](https://github.com/TMElyralab/MuseTalk/blob/main/README.md)
- Weights downloaded at setup: TMElyralab/MuseTalk (v1.0 and v1.5 unet), stabilityai/sd-vae-ft-mse, openai/whisper-tiny, yzd-v/DWPose, a SyncNet from ByteDance/LatentSync, and a face-parse ResNet18 — [download_weights.sh](https://github.com/TMElyralab/MuseTalk/blob/main/download_weights.sh). Preprocessing uses `face_detection.FaceAlignment` (S3FD) and mmpose DWPose — [preprocessing.py](https://github.com/TMElyralab/MuseTalk/blob/main/musetalk/utils/preprocessing.py)
- Training data: "checkpoint available trained on the HDTF and private dataset" — [README](https://github.com/TMElyralab/MuseTalk/blob/main/README.md). HDTF is distributed under CC BY 4.0 — [HDTF README](https://github.com/MRzzm/HDTF)
- Quality and resolution: face region of 256 x 256. The README says the theoretical resolution bound has "not yet" been reached and suggests GFPGAN for higher resolution — [README](https://github.com/TMElyralab/MuseTalk/blob/main/README.md)
- Speed: "real-time inference with 30fps+ on an NVIDIA Tesla V100". Minimum hardware tested: RTX 3050 Ti Laptop with 4 GB VRAM, fp16, where an 8-second video takes about 5 minutes. The models expect 25 fps input — [README](https://github.com/TMElyralab/MuseTalk/blob/main/README.md)
- Timeline: v1.0 project and models released 2024-04-02. Technical report 2024-10-18. **v1.5 released 2025-03-28**. Training code open-sourced 2025-04-05 — [README](https://github.com/TMElyralab/MuseTalk/blob/main/README.md). Last commit: **2025-09-26** ("feat: update download_weights.bat (#372)") — [commits](https://github.com/TMElyralab/MuseTalk/commits/main)

**LatentSync (ByteDance) 1.0 / 1.5 / 1.6: verdict "Commercial OK with caveats" (InsightFace dependency is the main risk)**
- URL: https://github.com/bytedance/LatentSync. Code license: Apache-2.0 — [LICENSE](https://github.com/bytedance/LatentSync/blob/main/LICENSE)
- Weights: the HF cards for LatentSync-1.5 and LatentSync-1.6 declare `license: openrail++` (HF card via search snippet; a third-party Gitee mirror lists Apache-2.0, which applies to the code mirror). OpenRAIL++-M allows commercial use with use-based restrictions — [HF LatentSync-1.5 commit](https://huggingface.co/ByteDance/LatentSync-1.5/commit/711376f04829c9836cf411aef7bd3fe20663eb0e); [HF LatentSync-1.6 README](https://huggingface.co/ByteDance/LatentSync-1.6/blob/main/README.md)
- Architecture: an audio-conditioned latent diffusion model built on Stable Diffusion capabilities, with Whisper audio embeddings fed via cross-attention. Training uses TREPA, LPIPS and SyncNet losses — [README](https://github.com/bytedance/LatentSync/blob/main/README.md). Inference checkpoints are `latentsync_unet.pt` plus `whisper/tiny.pt` from HF ByteDance/LatentSync-1.6 — [setup_env.sh](https://github.com/bytedance/LatentSync/blob/main/setup_env.sh)
- **Non-commercial component in inference:** `latentsync/utils/face_detector.py` instantiates `insightface.app.FaceAnalysis(allowed_modules=["detection","landmark_2d_106"], root="checkpoints/auxiliary")`. `insightface==0.7.3` is pinned in requirements — [face_detector.py](https://github.com/bytedance/LatentSync/blob/main/latentsync/utils/face_detector.py); [requirements.txt](https://github.com/bytedance/LatentSync/blob/main/requirements.txt). InsightFace states: "The pretrained models provided with this library are for non-commercial research only, whether downloaded automatically or manually" — [InsightFace python-package README](https://github.com/deepinsight/insightface/blob/master/python-package/README.md); [InsightFace README](https://github.com/deepinsight/insightface/blob/master/README.md)
- Training data: the released SyncNet has "94% accuracy on both VoxCeleb2 and HDTF datasets". Training preprocessing uses InsightFace landmarks for affine alignment — [README](https://github.com/bytedance/LatentSync/blob/main/README.md). v1.5 "added Chinese data to the training" — [changelog v1.5](https://github.com/bytedance/LatentSync/blob/main/docs/changelog_v1.5.md). Demo videos are "filmed by contracted models" — [README](https://github.com/bytedance/LatentSync/blob/main/README.md)
- Versions: v1.5 (2025-03-14) added a temporal layer, improved Chinese performance, and cut stage-2 training to 20 GB. **v1.6 (2025-06-11)** was trained on 512x512 video to fix blurry teeth and lips, with no structural change, only the training dataset upgraded — [README](https://github.com/bytedance/LatentSync/blob/main/README.md); [changelog v1.6](https://github.com/bytedance/LatentSync/blob/main/docs/changelog_v1.6.md)
- VRAM: minimum inference VRAM is **8 GB (v1.5)** and **18 GB (v1.6)**. Training: stage1 23 GB, stage2 30 GB, stage2_efficient 20 GB (RTX 3090), 512-res stage2 55 GB — [README](https://github.com/bytedance/LatentSync/blob/main/README.md)
- Last commit: **2025-06-20** ("Update the demo in the README.md") — [commits](https://github.com/bytedance/LatentSync/commits/main)

**InfiniteTalk (MeiGen-AI / Meituan): verdict "Commercial OK" (license-wise; heavy compute)**
- URL: https://github.com/MeiGen-AI/InfiniteTalk. LICENSE.txt is Apache-2.0. README: "The models in this repository are licensed under the Apache 2.0 License. We claim no rights over the your generated contents...". It adds use restrictions against harm, misinformation, and targeting vulnerable groups — [README](https://github.com/MeiGen-AI/InfiniteTalk/blob/main/README.md); [LICENSE.txt](https://github.com/MeiGen-AI/InfiniteTalk/blob/main/LICENSE.txt)
- Real video-to-video dubbing: "a novel sparse-frame video dubbing framework. Given an input video and audio track, InfiniteTalk synthesizes a new video with accurate lip synchronization while simultaneously aligning head movements, body posture, and facial expressions". It also supports image-to-video — [README](https://github.com/MeiGen-AI/InfiniteTalk/blob/main/README.md)
- Dependencies: base model **Wan2.1-I2V-14B-480P**; audio encoder **TencentGameMate/chinese-wav2vec2-base** — [README](https://github.com/MeiGen-AI/InfiniteTalk/blob/main/README.md)
- Output: 480P and 720P. Has a "very low VRAM" mode (`--num_persistent_param_in_dit 0`), multi-GPU, and a quantized model. Wan2GP integration is "optimized for low VRAM" — [README](https://github.com/MeiGen-AI/InfiniteTalk/blob/main/README.md)
- Released 2025-08-19 (tech report arXiv 2508.14033, weights, code, ComfyUI branch). Last commit **2026-05-22** — [README](https://github.com/MeiGen-AI/InfiniteTalk/blob/main/README.md); [commits](https://github.com/MeiGen-AI/InfiniteTalk/commits/main)
- Note: it changes head and body motion, not only lips, so it is not a mouth-only re-sync. It is not real-time (14B DiT) — [README](https://github.com/MeiGen-AI/InfiniteTalk/blob/main/README.md)

**KeySync (Imperial College London / Univ. of Wrocław, 2025): verdict "Commercial OK with caveats"**
- URL: https://github.com/antonibigata/keysync. Code: Apache-2.0 (file named `LICENCE`) — [LICENCE](https://github.com/antonibigata/keysync/blob/main/LICENCE). Weights: HF `toninio19/keysync` card YAML says `license: apache-2.0` (HF card via search snippet) — [HF card](https://huggingface.co/toninio19/keysync/blob/main/README.md)
- Purpose: lip sync of an existing video to new audio, targeting "automated dubbing". It addresses expression leakage and occlusions. Two stages: keyframes plus interpolation — [README](https://github.com/antonibigata/keysync/blob/main/README.md); arXiv 2505.00497
- Dependencies: built on Stability AI generative-models. The keyframe config loads `ckpt_path: pretrained_models/checkpoints/svd_no_emb.safetensors`, i.e. a Stable Video Diffusion initialization — [keyframes_dub.yaml](https://github.com/antonibigata/keysync/blob/main/configs/example_training/keyframes/keyframes_dub.yaml). Audio embeddings come from WavLM and HuBERT. SAM2 is optional for occlusion masks — [README](https://github.com/antonibigata/keysync/blob/main/README.md)
- Resolution: the latent VAE is configured at 256 with `resize_size: 512` — [keyframes_dub.yaml](https://github.com/antonibigata/keysync/blob/main/configs/example_training/keyframes/keyframes_dub.yaml). The HF demo is limited to 6 s clips because of GPU limits — [README](https://github.com/antonibigata/keysync/blob/main/README.md)
- Last commit **2026-01-23** — [commits](https://github.com/antonibigata/keysync/commits/main)

**JoyGen (JD / JOY-MM, 2025): verdict "Commercial OK with caveats"**
- URL: https://github.com/JOY-MM/JoyGen. Code: Apache-2.0 — [LICENSE](https://github.com/JOY-MM/JoyGen/blob/main/LICENSE)
- Talking-face video editing (audio-driven 3D-depth-aware). Dependencies: sd-vae-ft-mse, whisper-tiny, DWPose, Real3DPortrait audio2motion (`240210_real3dportrait_orig/audio2secc_vae`), Deep3DFaceRecon. It acknowledges MuseTalk. Image size 256. Tested on V100 and A800 — [README](https://github.com/JOY-MM/JoyGen/blob/main/README.md)
- Last commit **2025-02-27** — [commits](https://github.com/JOY-MM/JoyGen/commits/main)

**Lightricks LTX-2.3 IC-LoRA LipDub / Dub-It (2026): verdict "Commercial OK with caveats" (revenue cap)**
- The LipDub IC-LoRA is trained on top of LTX-2.3-22b, and its HF card points to the LTX-2 community license. Weights are gated (you must accept the license). The sibling `LTX-2.3-22b-IC-LoRA-DubIt` was reportedly released 2026-05-11 (third-party listing) — [HF LipDub/DubIt](https://huggingface.co/Lightricks/LTX-2.3-22b-IC-LoRA-DubIt); [ModelScope mirror](https://modelscope.cn/models/Lightricks/LTX-2.3-22b-IC-LoRA-LipDub); [ltxworkflow listing](https://ltxworkflow.com/models/ltx23-ic-lora-dubit)
- The LTX-2 repo ships a `DubItPipeline`: "Dub-It: rephrasing while matching speaker identity and lip movements (distilled model, single IC-LoRA, two stages)". The pipeline expects the LTX-2.5 22B distilled transformer — [LTX-2 README](https://github.com/Lightricks/LTX-2/blob/main/README.md); [lipdub.py](https://github.com/Lightricks/LTX-2/blob/main/packages/ltx-pipelines/src/ltx_pipelines/lipdub.py)
- License: the LTX-2.x Community License (dated 2026-08-11, applies to LTX-2.5+) grants use "for any purpose", but "Entities with annual revenues of at least $10,000,000 ... are required to obtain a paid license". It includes Attachment A use restrictions. The earlier LTX-2 Community License (2026-01-05) covers LTX-2 through LTX-2.3 until 2026-08-11 — [LICENSE](https://github.com/Lightricks/LTX-2/blob/main/LICENSE); [LICENSE-2_x](https://github.com/Lightricks/LTX-2/blob/main/LICENSE-2_x)
- Related paper: JUST-DUB-IT, "Video Dubbing via Joint Audio-Visual Diffusion" (arXiv 2601.22143; Chen, Korem, ... Cohen-Or). The released weights appear as the LTX IC-LoRA. I found no standalone paper repository — [arXiv](https://arxiv.org/abs/2601.22143)

### Inferences
- For a SaaS dubbing product where mouth-only re-sync of an existing video is needed, MuseTalk v1.5 has the cleanest license chain. MIT code plus explicitly commercial weights. The VAE (sd-vae-ft-mse) and Whisper are widely regarded as MIT-licensed, but that was not re-verified here because HF was blocked. It is also the only one that is real-time.
- LatentSync gives better quality (512 px with v1.6), but a commercial deployment should replace the InsightFace detector/landmark models with a commercially licensed detector (e.g., MediaPipe, which is already in requirements, or S3FD/face-alignment). Alternatively, buy an InsightFace license. The OpenRAIL++ weights themselves allow commercial use with use-restrictions that must be passed on downstream.
- KeySync's Apache-2.0 weights were fine-tuned from a Stable Video Diffusion checkpoint. Whether SVD's own license (Stability AI) flows through to derivative weights is a real caveat. SVD's license history (originally non-commercial, later the Stability Community License with a revenue threshold) was NOT verified in this session.
- InfiniteTalk and LTX Dub-It are generative "re-performance" models (they change head and body, need a large GPU, and are not real-time). They suit offline premium dubbing rather than real-time avatars.

### Gaps
- No exact HF license tags were fetched live. MuseTalk (creativeml-openrail-m), LatentSync (openrail++) and KeySync (apache-2.0) rely on search snippets of the card YAML.
- Licenses for Wan2.1-I2V-14B, chinese-wav2vec2-base, sd-vae-ft-mse, whisper-tiny, DWPose weights and SVD were not verified in this session because huggingface.co was blocked.
- No primary inference FPS numbers were found for LatentSync, KeySync, InfiniteTalk or LTX Dub-It, and no VRAM numbers for KeySync or InfiniteTalk's standard mode.
- MuseTalk's "private dataset" is undisclosed, so its provenance cannot be assessed.

---

## Q2. Which ones explicitly forbid commercial use or say "research only"?

### Takeaway
**Wav2Lip** (official) explicitly prohibits commercial use because the weights are LRS2-trained. **Diff2Lip** is CC BY-NC 4.0. **StyleSync** never released weights (academic demo by request only). Forks that slap MIT on Wav2Lip code (Wav2Lip-HD, wav2lip_288x288) do not cure the restriction on the original Wav2Lip weights or code. Repos with **no license file** (DINet, TalkLip, Easy-Wav2Lip, original Wav2Lip) default to "all rights reserved" in addition to any explicit restriction.

### Cited Findings

**Wav2Lip (Rudrabha / IIIT Hyderabad → Sync Labs): verdict "Non-commercial / risky"**
- URL: https://github.com/Rudrabha/Wav2Lip. There is no LICENSE file in the repo tree (checked via clone). The README now opens with a "Commercial Version" section (Sync Labs API), followed by "Non Commercial Open-source Version" — [README](https://github.com/Rudrabha/Wav2Lip/blob/master/README.md)
- "All results from this open-source code or our demo website should only be used for research/academic/personal purposes only. As the models are trained on the LRS2 dataset, any form of commercial use is strictly prohibited." — [README](https://github.com/Rudrabha/Wav2Lip/blob/master/README.md)
- "This repository can only be used for personal/research/non-commercial purposes. However, for commercial requests, please contact us directly at rudrabha@synclabs.so or prajwal@synclabs.so." — [README](https://github.com/Rudrabha/Wav2Lip/blob/master/README.md)
- "We have an HD model trained on a dataset allowing commercial usage. The size of the generated face will be 192 x 288 in our new model." This model is not released openly; it is offered via Sync Labs — [README](https://github.com/Rudrabha/Wav2Lip/blob/master/README.md)
- Training data: LRS2 (also benchmarked on LRS3). The face detector is S3FD (Adrian Bulat's `s3fd-619a316812.pth`). The README notes the models were trained on low-res faces, so 720p often looks better than 1080p — [README](https://github.com/Rudrabha/Wav2Lip/blob/master/README.md)
- Last commit **2025-06-22** (README update) — [commits](https://github.com/Rudrabha/Wav2Lip/commits/master)

**Wav2Lip derivatives**
- **Wav2Lip-HD (saifhassan)**: an MIT LICENSE was added 2023-08-08 ("Copyright (c) 2023 Saif Hassan"). It combines Wav2Lip with Real-ESRGAN/GFPGAN super-resolution, and its weights are the Wav2Lip and Real-ESRGAN checkpoints on Google Drive — [LICENSE](https://github.com/saifhassan/Wav2Lip-HD/blob/main/LICENSE); [README](https://github.com/saifhassan/Wav2Lip-HD/blob/main/README.md). Verdict: **Non-commercial / risky**, because it still ships LRS2-trained Wav2Lip weights.
- **Easy-Wav2Lip (anothermartz)**: no license file in the tree. It is a wrapper around Wav2Lip with a feathered mouth mask and optional GFPGAN; the GFPGAN code came from wav2lip-hq-updated-ESRGAN. Last commit 2024-04-21 — [README](https://github.com/anothermartz/Easy-Wav2Lip/blob/main/README.md); [commits](https://github.com/anothermartz/Easy-Wav2Lip/commits/main). Verdict: **Non-commercial / risky**.
- **wav2lip_288x288 (primepake)**: MIT LICENSE ("Copyright (c) 2024 Sam Nguyen"). Training code for 288/384/512 Wav2Lip variants with SAM-UNet, a WGAN-GP loss, and its own SyncNet training. The README does not link released pretrained weights, so you train on your own data. Last commit 2025-08-13 — [LICENSE](https://github.com/primepake/wav2lip_288x288/blob/master/LICENSE); [README](https://github.com/primepake/wav2lip_288x288/blob/master/README.md). Verdict: **Commercial OK with caveats** only if you train on commercially licensed data. The code is derived from Wav2Lip, whose README restricts the repository to non-commercial use, so the MIT relicensing is legally questionable.
- **No retrained-from-scratch, MIT-licensed Wav2Lip with commercially clean, released weights was found** in this search.

**Diff2Lip (WACV 2024): verdict "Non-commercial / risky"**
- URL: https://github.com/soumik-kanad/diff2lip. LICENSE.md is CC BY-NC 4.0: "It can be shared and adapted provided that they credit us and don't use our work for commercial purposes." — [LICENSE.md](https://github.com/soumik-kanad/diff2lip/blob/main/LICENSE.md); [README](https://github.com/soumik-kanad/diff2lip/blob/main/README.md)
- Evaluated and trained on VoxCeleb2 (with LRW filelists for evaluation) — [README](https://github.com/soumik-kanad/diff2lip/blob/main/README.md). Last commit 2024-08-16 — [commits](https://github.com/soumik-kanad/diff2lip/commits/main)

**StyleSync (Tsinghua / Baidu, CVPR 2023): verdict "Non-commercial / risky" (no weights)**
- "The decision to suspend the release of the model weights has been made by our team... if you are interested in utilizing our demo for academic purposes... contact me" — [README](https://github.com/guanjz20/StyleSync/blob/main/README.md). There is no LICENSE file in the tree. Last commit 2023-08-08 — [commits](https://github.com/guanjz20/StyleSync/commits/main)

**OmniSync (Renmin Univ. + Kling Team at Kuaishou + Tsinghua, NeurIPS 2025 Spotlight): verdict "Non-commercial / risky" (no code or weights found)**
- Mask-free DiT lip sync with Whisper audio features and a T5 text encoder, trained on 64 A100s for 80 hours. Only a project page and an AIGC-LipSync benchmark dataset were found; no GitHub code or model weights — [project page](https://ziqiaopeng.github.io/OmniSync/); [arXiv 2505.21448](https://arxiv.org/abs/2505.21448); [benchmark dataset](https://huggingface.co/datasets/ZiqiaoPeng/AIGC_LipSync_Benchmark). The `ziqiaopeng/OmniSync` GitHub repo returned 404 on main and master.

### Inferences
- An absent LICENSE file (DINet, TalkLip, Easy-Wav2Lip, StyleSync, original Wav2Lip) means no grant of rights under copyright law. Treat these as non-commercial regardless of README tone.
- Sync Labs (the Wav2Lip authors) monetizes the commercial path, so enforcement risk for Wav2Lip weights is higher than for an abandoned academic repo.

### Gaps
- I did not find GitHub issues on Rudrabha/Wav2Lip, MuseTalk or LatentSync where maintainers answered "commercial use?" directly, because the GitHub API and issue search were blocked. The README statements above are the primary evidence.

---

## Q3. Which rely on a non-commercial component (Wav2Lip SyncNet/discriminator, LRS2-trained models, InsightFace, GFPGAN, BFM, dlib, OpenFace, AV-HuBERT, etc.)?

### Takeaway
Most of the 2022–2023 academic repos have Apache-2.0 code but are **poisoned by components**. VideoReTalking needs BFM, a dlib 68-landmark model (iBUG 300-W, no commercial use), and GPEN/GFPGAN. DINet needs OpenFace landmarks (CMU non-commercial license). TalkLip needs AV-HuBERT (Meta non-commercial) plus LRS2. IP_LAP is LRS2-trained. LatentSync's inference needs InsightFace models (non-commercial). MuseTalk avoids all of these.

### Cited Findings

**VideoReTalking (OpenTalker / Tencent AI Lab and Xidian, SIGGRAPH Asia 2022): verdict "Non-commercial / risky"**
- URL: https://github.com/OpenTalker/video-retalking. Code: Apache-2.0 — [LICENSE](https://github.com/OpenTalker/video-retalking/blob/main/LICENSE). Pretrained models are on Google Drive with no separate weights license stated — [README](https://github.com/OpenTalker/video-retalking/blob/main/README.md)
- Its Tencent disclaimer: "This is not an official product of Tencent... comply with the open-source license... prohibited to use this open-source code for activities that harm... portrait rights" — [README](https://github.com/OpenTalker/video-retalking/blob/main/README.md)
- `inference.py` loads `checkpoints/BFM`, `checkpoints/GFPGANv1.3.pth`, `checkpoints/expression.mat`, and `checkpoints/shape_predictor_68_face_landmarks.dat` — [inference.py](https://github.com/OpenTalker/video-retalking/blob/main/inference.py)
- dlib 68-landmark model: "The license for this dataset [iBUG 300-W] excludes commercial use ... the trained model therefore can't be used in a commercial product" — [dlib-models README](https://github.com/davisking/dlib-models/blob/master/README.md)
- GPEN (used for enhancement): the author took down GPEN-BFR-2048 "due to commercial issues". The released model is "not our best model due to commercial issues" — [GPEN README](https://github.com/yangxy/GPEN/blob/main/README.md)
- GFPGAN code: Apache-2.0 "except for the third-party components listed". Trained on FFHQ — [GFPGAN LICENSE](https://github.com/TencentARC/GFPGAN/blob/master/LICENSE); [GFPGAN README](https://github.com/TencentARC/GFPGAN/blob/master/README.md)
- Last commit **2023-11-04**, so the repo is inactive — [commits](https://github.com/OpenTalker/video-retalking/commits/main)

**DINet (AAAI 2023): verdict "Non-commercial / risky"**
- URL: https://github.com/MRzzm/DINet. No LICENSE file in the tree (checked via clone). The pretrained model is trained on HDTF (363 videos) with "limited" generalization. It requires OpenFace landmarks and DeepSpeech features. The mouth region is 256x256 within a 416x320 face — [README](https://github.com/MRzzm/DINet/blob/master/README.md)
- OpenFace license: "ACADEMIC OR NON-PROFIT ORGANIZATION NONCOMMERCIAL RESEARCH USE ONLY" — [OpenFace-license.txt](https://github.com/TadasBaltrusaitis/OpenFace/blob/master/OpenFace-license.txt)
- Last commit 2023-03-01 — [commits](https://github.com/MRzzm/DINet/commits/master)

**IP_LAP (CVPR 2023): verdict "Non-commercial / risky"**
- URL: https://github.com/Weizhi-Zhong/IP_LAP. Code: Apache-2.0 — [LICENSE](https://github.com/Weizhi-Zhong/IP_LAP/blob/main/LICENSE). "Our models are trained on LRS2" — [README](https://github.com/Weizhi-Zhong/IP_LAP/blob/main/README.md). Last commit 2023-09-12 — [commits](https://github.com/Weizhi-Zhong/IP_LAP/commits/main)

**TalkLip (CVPR 2023): verdict "Non-commercial / risky"**
- URL: https://github.com/Sxjdwang/TalkLip. No LICENSE file. It requires AV-HuBERT, uses an "AV-hubert (large) fine-tuned on LRS2" lip-reading observer, and trains on LRS2. It reuses Wav2Lip's S3FD face detector. Training needs about 24 GB — [README](https://github.com/Sxjdwang/TalkLip/blob/main/README.md)
- AV-HuBERT license: "solely for your non-commercial research purposes" and no use "for (i) any commercial or production purposes ... (iv) biometric processing" — [AV-HuBERT LICENSE](https://github.com/facebookresearch/av_hubert/blob/main/LICENSE)
- Last commit 2023-11-01 — [commits](https://github.com/Sxjdwang/TalkLip/commits/main)

**LatentSync**: inference depends on InsightFace pretrained models, which are non-commercial research only (see Q1) — [face_detector.py](https://github.com/bytedance/LatentSync/blob/main/latentsync/utils/face_detector.py); [InsightFace](https://github.com/deepinsight/insightface/blob/master/python-package/README.md). InsightFace says that for the buffalo_l package you should "contact recognition-oss-pack@insightface.ai for licensing" — [InsightFace README](https://github.com/deepinsight/insightface/blob/master/README.md)

**MuseTalk**: it also downloads a SyncNet from ByteDance/LatentSync (used for training supervision) and points to GFPGAN as an optional upscaler. Neither is required for inference — [download_weights.sh](https://github.com/TMElyralab/MuseTalk/blob/main/download_weights.sh); [README](https://github.com/TMElyralab/MuseTalk/blob/main/README.md)

**Wav2Lip SyncNet / expert discriminator** is LRS2-trained and covered by Wav2Lip's non-commercial notice. Any repo that uses it as a loss (e.g., VideoReTalking, IP_LAP, TalkLip style pipelines) inherits a dataset-provenance question for its weights — [Wav2Lip README](https://github.com/Rudrabha/Wav2Lip/blob/master/README.md)

### Inferences
- Whether the weights of a model trained with a non-commercial loss network or dataset are themselves restricted is legally unsettled. However, the Wav2Lip and dlib authors both state the restriction flows to the trained model, so a conservative SaaS should avoid LRS2-, iBUG- and AV-HuBERT-derived weights.
- GFPGAN code is Apache-2.0, but because it was trained on FFHQ (whose images carry various licenses), its weights are commonly treated as a gray zone. I did not verify the FFHQ license text this session, so treat GFPGAN post-processing as a caveat, not a blocker.
- LatentSync's InsightFace dependency is replaceable in code (MediaPipe and face-alignment are already in its requirements). After such a swap, LatentSync moves closer to "Commercial OK with caveats (OpenRAIL++ use restrictions)".

### Gaps
- FFHQ's license and the exact GFPGANv1.3 weights terms were not retrieved.
- BFM (Basel Face Model) license text was not retrieved this session, though it is widely understood to be registration-gated for non-commercial use (unverified).
- DWPose weights (used by MuseTalk and JoyGen) were trained on COCO-WholeBody/UBody. Their dataset terms were not checked.

---

## Q4. New 2025–2026 releases and license changes over time

### Takeaway
2025–2026 brought: MuseTalk v1.5 (Mar 2025), LatentSync 1.5/1.6 (Mar/Jun 2025), KeySync (2025, updated Jan 2026), InfiniteTalk (Aug 2025), LongCat-Video-Avatar 1.0/1.5 (Dec 2025 / May 2026, MIT), OmniSync (NeurIPS 2025, no code), JoyGen (2025), and Lightricks LTX-2.x LipDub/Dub-It IC-LoRAs (2026, revenue-capped license). The only notable license change found is Lightricks' new LTX-2.x Community License dated 2026-08-11. Wav2Lip's README has been re-framed around a commercial API but remains non-commercial.

### Cited Findings
- **LongCat-Video / LongCat-Video-Avatar (Meituan)**: code is MIT ("Copyright (c) 2025 Meituan"). Avatar v1.0 was released 2025-12-16 (Audio-Text-to-Video, Audio-Text-Image-to-Video, Video Continuation). **v1.5 was released 2026-05-21**: it swaps Wav2Vec2 for Whisper-large-v3, adds 8-step distillation, and supports INT8 quantization for lower VRAM. Last commit 2026-05-27 — [LICENSE](https://github.com/meituan-longcat/LongCat-Video/blob/main/LICENSE); [README](https://github.com/meituan-longcat/LongCat-Video/blob/main/README.md); [commits](https://github.com/meituan-longcat/LongCat-Video/commits/main). The weights license on HF (meituan-longcat/LongCat-Video-Avatar-1.5) was not verified. It is primarily audio-driven generation and continuation rather than a mouth-only re-sync of an existing clip.
- **LTX license change**: LTX-2 Community License dated 2026-01-05 (LTX-2 through LTX-2.3 until 2026-08-11), followed by the LTX-2.x Community License dated 2026-08-11 for LTX-2.5+ and future releases. Both have a $10M annual-revenue paid-license threshold (confirmed in the 2.x text) — [LICENSE](https://github.com/Lightricks/LTX-2/blob/main/LICENSE); [LICENSE-2_x](https://github.com/Lightricks/LTX-2/blob/main/LICENSE-2_x)
- **StableDub** (arXiv 2509.21887, Sep 2025), **TBDub** (arXiv 2609.06144, 2026) and **SyncVoice** (arXiv 2512.05126) are new visual-dubbing papers. Code and weights release status was not confirmed — [StableDub](https://arxiv.org/pdf/2509.21887); [TBDub](https://arxiv.org/pdf/2609.06144); [SyncVoice](https://arxiv.org/pdf/2512.05126)
- **Wav2Lip** README now leads with the Sync Labs commercial API. The open model is labelled "Non Commercial Open-source Version" (last commit 2025-06-22) — [README](https://github.com/Rudrabha/Wav2Lip/blob/master/README.md)
- **MuseTalk** license statement is unchanged across v1.0 to v1.5: MIT code, weights "for any purpose, even commercially" — [README](https://github.com/TMElyralab/MuseTalk/blob/main/README.md)
- A third-party "ShmuelRonen/LipDub" repo mentioned by a May 2026 blog could not be confirmed: its raw README and LICENSE returned 404 — [mindstudio blog (search result only)](https://www.mindstudio.ai/blog/lipdub-open-source-multilingual-lip-sync-ai-video)

### Summary verdict table (as of 2026-10-10)

| Repo | Code license | Weights license | Key non-commercial dependency | Last commit | Verdict |
|---|---|---|---|---|---|
| MuseTalk v1.5 | MIT | "any purpose, even commercially" (README); HF tag creativeml-openrail-m | none required at inference | 2025-09-26 | Commercial OK with caveats (check VAE, Whisper and DWPose terms) |
| LatentSync 1.5/1.6 | Apache-2.0 | OpenRAIL++ (HF tag) | InsightFace detection+landmark models (non-commercial) | 2025-06-20 | Commercial OK with caveats (swap out InsightFace) |
| InfiniteTalk | Apache-2.0 | Apache-2.0 (README) | Wan2.1-14B base and chinese-wav2vec2 (not verified) | 2026-05-22 | Commercial OK |
| KeySync | Apache-2.0 | Apache-2.0 (HF tag) | SVD initialization (Stability license, not verified) | 2026-01-23 | Commercial OK with caveats |
| JoyGen | Apache-2.0 | not stated | Real3DPortrait/Deep3DFaceRecon (BFM likely; unverified) | 2025-02-27 | Commercial OK with caveats / unclear |
| LTX-2.3/2.5 LipDub / Dub-It | LTX-2 repo | LTX Community License | Paid license required if revenue ≥ $10M | 2026 | Commercial OK with caveats |
| LongCat-Video-Avatar 1.5 | MIT | not verified | — | 2026-05-27 | Unclear (not true V2V lip-sync) |
| Wav2Lip (official) | no license file; README non-commercial | non-commercial (LRS2) | LRS2 | 2025-06-22 | Non-commercial / risky |
| Wav2Lip-HD / Easy-Wav2Lip | MIT / none | original Wav2Lip weights | LRS2 | 2023-08 / 2024-04 | Non-commercial / risky |
| wav2lip_288x288 | MIT (Wav2Lip-derived) | none released | — | 2025-08-13 | Caveats (self-train; code provenance) |
| VideoReTalking | Apache-2.0 | unstated (Google Drive) | dlib iBUG 300-W, BFM, GPEN/GFPGAN | 2023-11-04 | Non-commercial / risky |
| DINet | none | unstated (HDTF CC BY 4.0) | OpenFace (CMU non-commercial) | 2023-03-01 | Non-commercial / risky |
| IP_LAP | Apache-2.0 | unstated | LRS2 | 2023-09-12 | Non-commercial / risky |
| TalkLip | none | unstated | AV-HuBERT (Meta non-commercial), LRS2 | 2023-11-01 | Non-commercial / risky |
| Diff2Lip | CC BY-NC 4.0 | CC BY-NC 4.0 (repo-wide) | VoxCeleb2 | 2024-08-16 | Non-commercial / risky |
| StyleSync | none | not released | — | 2023-08-08 | Non-commercial / risky |
| OmniSync | no code found | not released | — | n/a | Non-commercial / risky (unavailable) |

### Inferences
- The field has shifted from small GAN inpainters (Wav2Lip, DINet, IP_LAP; 2020–2023, now dormant) to latent-diffusion and DiT video models (LatentSync, KeySync, InfiniteTalk, LTX Dub-It). The newer models are better licensed (Apache/MIT/OpenRAIL) but much heavier on GPU. MuseTalk remains the only real-time, commercially clean option.
- No major Chinese lab (Alibaba, Tencent, ByteDance, Kuaishou/Kling) released a newer open mouth-only video-to-video lip-sync model after LatentSync 1.6 (June 2025) that I could find. Kling's OmniSync stayed paper-only.

### Gaps
- No release-tag data was collected (only last-commit dates). GitHub stars and issue activity were not collected because the GitHub API was blocked.
- I could not confirm whether StableDub, TBDub, X-Dub or other 2025–2026 papers released weights.
- The HF weights license for LongCat-Video-Avatar-1.5 and JoyGen's checkpoint terms are unknown.
