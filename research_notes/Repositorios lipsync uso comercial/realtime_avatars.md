# Real-time / Streaming Lip-sync and Interactive Digital-Human Repos: Commercial Usability (as of 2026-10-10)

Method note (read first): Each repo was shallow-cloned from GitHub on 2026-10-10. LICENSE files and READMEs were read directly from the default branch (HEAD). "Last activity" means the date of the last commit on the default branch, from `git log -1`. In this session huggingface.co, modelscope.cn, faces.dmi.unibas.ch, flame.is.tue.mpg.de and developers.meta.com were blocked (proxy 403 / DNS failure). Hugging Face model-card licenses were therefore only verified through search-engine snippets where available. Otherwise they are marked "unclear (HF card not reachable)". Repo license links use `/blob/HEAD/` so they resolve to the default branch.

## Q1. Per-candidate fact sheets (code license, weights license, deps, perf, VRAM, per-person training, last activity, verdict)

### Takeaway
The only options that are clean or near-clean on both code and weights for a commercial SaaS are:
- NVIDIA Audio2Face-3D: SDK is MIT, models are under the NVIDIA Open Model License "ready for commercial use". Output is 3D blendshapes, not video.
- Browser viseme stacks: TalkingHead.js, wawa-lipsync and Rhubarb, all MIT.
- MuseTalk: code is MIT and the weights are explicitly commercial, but you must audit each of its sub-models.

Most "real-time digital human" video repos look permissive (Apache/MIT) at the top level but pull in non-commercial pieces:
- Wav2Lip weights
- InsightFace models
- Basel Face Model
- FLAME
- the Inria Gaussian-Splatting rasterizer

Others carry custom licenses: Duix has a 1,000-MAU cap and SyncTalk is CC BY-NC.

### Cited Findings

#### NVIDIA Audio2Face-3D (open-sourced 2025)
- **GitHub:**
  - Hub: https://github.com/NVIDIA/Audio2Face-3D
  - SDK: https://github.com/NVIDIA/Audio2Face-3D-SDK
  - Training framework: https://github.com/NVIDIA/Audio2Face-3D-training-framework
- **License table in the hub README** — [A2F-3D README](https://github.com/NVIDIA/Audio2Face-3D/blob/HEAD/README.md):
  - SDK (C++ & Python): **MIT**.
  - Training Framework: **Apache**.
  - Maya ACE plugin: **MIT**.
  - Unreal Engine 5 plugin (UE 5.5/5.6): **MIT**.
  - Audio2Face-3D **NIM** container: **NVIDIA Software License Agreement + Product Specific Terms for AI Products**.
  - Audio2Face-3D Models (regression v2.3, diffusion v3.0, i.e. Mark/Claire/James): **"Nvidia Open Model"** license.
  - Audio2Emotion models: **"Custom (use allowed with Audio2Face only)"**.
  - Training Sample Data (Claire dataset): **"Custom (evaluation only)"**.
- SDK LICENSE.txt is MIT, "Copyright (c) 2025, NVIDIA CORPORATION" — [SDK LICENSE](https://github.com/NVIDIA/Audio2Face-3D-SDK/blob/HEAD/LICENSE.txt). Training framework LICENSE is Apache 2.0 — [training LICENSE](https://github.com/NVIDIA/Audio2Face-3D-training-framework/blob/HEAD/LICENSE).
- HF model cards for v3.0 and v2.3-Mark state "This model is ready for commercial/non-commercial use… governed by the NVIDIA Open Model License" — [HF A2F-3D v3.0](https://huggingface.co/nvidia/Audio2Face-3D-v3.0), [HF A2F-3D v2.3 Mark](https://huggingface.co/nvidia/Audio2Face-3D-v2.3-Mark). These were seen via search snippet; the full NVIDIA Open Model License text was not read in this session.
- Audio2Emotion is gated on HF and needs a license click-through — [SDK README](https://github.com/NVIDIA/Audio2Face-3D-SDK/blob/HEAD/README.md). An NGC listing reportedly says it "may not be used for the purpose of emotion recognition" and not outside Audio2Face — [NGC catalog](https://catalog.ngc.nvidia.com/orgs/nim/nvidia/models/audio2face_3d_model/-). This was seen via search snippet only.
- **Dependencies:** CUDA >=12.8 <13.0 and TensorRT >=10.13 <11.0 (NVIDIA proprietary SDKs). Bundled third-party licenses are listed in `licenses/`: eigen (multi-license incl. MPL2/GPL/LGPL notices), nlohmann_json, zlib, gtest, cxxopts, magic_enum, refl-cpp, cnpy, audiofile, TensorRT acknowledgements, cuda-LICENSE — [SDK licenses dir](https://github.com/NVIDIA/Audio2Face-3D-SDK/tree/HEAD/licenses).
- **Performance:** "Faster than 60 FPS frame generation". Requires an NVIDIA GPU with CUDA 12.8+, "4GB+ GPU memory recommended", 8GB+ RAM, Windows 10/11 or Ubuntu 20.04+ — [SDK README](https://github.com/NVIDIA/Audio2Face-3D-SDK/blob/HEAD/README.md).
- **Output:** mesh deformations, transforms or blendshape weights (a 3D rig), not photoreal video — [A2F-3D README](https://github.com/NVIDIA/Audio2Face-3D/blob/HEAD/README.md). No per-person training is required; the pre-trained models drive the character. Custom training is optional.
- **Last activity:** hub 2025-09-24, SDK 2025-08-28, training framework 2025-09-25 (git log).
- **Verdict:** **Commercial OK with caveats.**
  - Read the NVIDIA Open Model License.
  - Do not use Audio2Emotion beyond A2F.
  - The sample dataset is evaluation-only.
  - NIM is under different, proprietary terms.
  - It needs an NVIDIA GPU, since TensorRT is NVIDIA-proprietary.

#### LiveTalking (formerly metahuman-stream), lipku
- **GitHub:** https://github.com/lipku/LiveTalking
- **Code license:** Apache 2.0 — [LICENSE](https://github.com/lipku/LiveTalking/blob/HEAD/LICENSE).
- **Supported models:** ernerf, musetalk, wav2lip, Ultralight-Digital-Human. Quick start uses `wav2lip256.pth` and a `wav2lip256_avatar1`. Models download from Quark cloud drive / Google Drive — [README](https://github.com/lipku/LiveTalking/blob/HEAD/README.md).
- **Weights license:** **unclear**. The README gives no license or training-data provenance for `wav2lip256.pth`. Upstream Wav2Lip says results "should only be used for research/academic/personal purposes… models are trained on the LRS2 dataset, any form of commercial use is strictly prohibited" — [Wav2Lip README](https://github.com/Rudrabha/Wav2Lip/blob/HEAD/README.md). The upstream Wav2Lip repo has no LICENSE file; the restriction is only in its README (git ls-tree).
- **Paid edition:** a "商用版" (paid commercial edition) adds "wav2lipls" and enhancements; the open edition is "Apache 2.0" — [README §7](https://github.com/lipku/LiveTalking/blob/HEAD/README.md).
- **Performance (README table):**

  | Model | GPU | FPS |
  |---|---|---|
  | wav2lip256 | RTX 3060 | 60 |
  | wav2lip256 | RTX 3080Ti | 120 |
  | musetalk | RTX 3080Ti | 42 |
  | musetalk | RTX 3090 | 45 |
  | musetalk | RTX 4090 | 72 |

  - Real-time requires `inferfps` and `finalfps` ≥25.
  - Recommended: wav2lip256 on RTX 3060+, musetalk on RTX 3080Ti+.
  - Concurrency while idle is CPU-bound (video encoding); concurrency while speaking is GPU-bound.
  - Delivered over WebRTC with multi-session support.

  Source: [README](https://github.com/lipku/LiveTalking/blob/HEAD/README.md).
- **Per-person training:** ernerf mode needs per-person training (see ER-NeRF). Wav2lip/MuseTalk modes need only an avatar video preprocessing step.
- **Last activity:** 2026-10-09.
- **Verdict:** **Non-commercial / risky as shipped.** The code is Apache, but the default wav2lip weights have unclear provenance and the Wav2Lip lineage is non-commercial. It is usable commercially only if you run MuseTalk mode and audit MuseTalk's sub-models, or buy the vendor's commercial edition.

#### OpenAvatarChat (HumanAIGC-Engineering / Alibaba)
- **GitHub:** https://github.com/HumanAIGC-Engineering/OpenAvatarChat
- **Code license:** Apache 2.0 — [LICENSE](https://github.com/HumanAIGC-Engineering/OpenAvatarChat/blob/HEAD/LICENSE).
- **Avatar back-ends:** LiteAvatar, LAM, MuseTalk, SoulX-FlashHead (including Duplex). "~2.2s average response time". LiteAvatar supports multiple sessions — [readme_en](https://github.com/HumanAIGC-Engineering/OpenAvatarChat/blob/HEAD/readme_en.md).
- **ASR/LLM/TTS:** SenseVoice, Qwen-Omni, Bailian API, CosyVoice. Several configurations rely on Alibaba Bailian cloud APIs — [readme_en](https://github.com/HumanAIGC-Engineering/OpenAvatarChat/blob/HEAD/readme_en.md). The licenses of those models and services were not verified here.
- **Last activity:** 2026-07-31.
- **Verdict:** **Commercial OK with caveats.** The framework is Apache. The commercial status depends entirely on which avatar back-end you pick (see LiteAvatar, LAM, FlashHead and MuseTalk below).

#### LiteAvatar (HumanAIGC)
- **GitHub:** https://github.com/HumanAIGC/lite-avatar
- **Code license:** MIT — [LICENSE](https://github.com/HumanAIGC/lite-avatar/blob/HEAD/LICENSE).
- **Performance:** "audio2face model for realtime 2D chat avatar, which can run in 30fps on only CPU devices without GPU acceleration". The face generator "can also be deployed on mobile devices". Uses ModelScope Paraformer ASR for audio features — [README](https://github.com/HumanAIGC/lite-avatar/blob/HEAD/README.md).
- **Weights license:** **unclear**. The weights are on ModelScope/HF, which were not reachable. The Paraformer license was not verified.
- **Last activity:** 2025-06-30.
- **Verdict:** **Commercial OK with caveats.** Confirm the weights and Paraformer license. It is the lowest-cost server option because it runs on CPU only.

#### LAM (Large Avatar Model) + LAM_Audio2Expression (aigc3d / Alibaba Tongyi)
- **GitHub:** https://github.com/aigc3d/LAM and https://github.com/aigc3d/LAM_Audio2Expression
- **Code license:** Apache 2.0 for both — [LAM LICENSE](https://github.com/aigc3d/LAM/blob/HEAD/LICENSE), [A2E LICENSE](https://github.com/aigc3d/LAM_Audio2Expression/blob/HEAD/LICENSE).
- **Performance:** one-shot Gaussian head from one image in 1.4 s. Animate & render at 562.9 FPS on A100 and "110+FPS" on a Xiaomi 14 phone. A WebGL renderer is released — [LAM README](https://github.com/aigc3d/LAM/blob/HEAD/README.md).
- **FLAME dependency:** LAM-A2E maps ARKit blendshapes to **FLAME** topology and lists FLAME as a dependency — [A2E README](https://github.com/aigc3d/LAM_Audio2Expression/blob/HEAD/README.md).
- **Weights license:** **unclear**. An open HF discussion says the LAM-20K model card states no license for the weights. It asks about the FLAME version and training-data clearance. No team reply was found — [HF LAM-20K discussion #2](https://huggingface.co/3DAIGC/LAM-20K/discussions/2). Training data is VFHQ + NeRSemble — [LAM README](https://github.com/aigc3d/LAM/blob/HEAD/README.md).
- **Per-person training:** none (one-shot).
- **Last activity:** LAM 2026-06-10, A2E 2025-10-24.
- **Verdict:** **Non-commercial / risky** until the weights license and the FLAME issue are resolved (see Q2).

#### SoulX-FlashHead (Soul-AILab), 2026
- **GitHub:** https://github.com/Soul-AILab/SoulX-FlashHead
- **Code license:** Apache 2.0 — [LICENSE](https://github.com/Soul-AILab/SoulX-FlashHead/blob/HEAD/LICENSE).
- **Model:** 1.3B parameters, on HF at `Soul-AILab/SoulX-FlashHead-1_3B`. The audio encoder is `facebook/wav2vec2-base-960h` — [README](https://github.com/Soul-AILab/SoulX-FlashHead/blob/HEAD/README.md).
- **Weights license:** **unclear** (HF card not reachable).
- **Performance:**
  - Model_Lite: "96 FPS, or 3-concurrent real-time (25+ FPS) streaming on single RTX4090".
  - Model_Pro: 10.8 FPS on one RTX 4090, real-time on two RTX 5090 with SageAttention.

  Source: [README](https://github.com/Soul-AILab/SoulX-FlashHead/blob/HEAD/README.md).
- **Per-person training:** none (one-shot, image-driven).
- **Last activity:** 2026-05-28.
- **Verdict:** **Commercial OK with caveats.** The code is Apache; the weights license must be confirmed on HF.

#### SoulX-FlashTalk (Soul-AILab), 2026
- **GitHub:** https://github.com/Soul-AILab/SoulX-FlashTalk
- **Code license:** Apache 2.0 — [LICENSE](https://github.com/Soul-AILab/SoulX-FlashTalk/blob/HEAD/LICENSE).
- **Model:** 14B, on HF at `Soul-AILab/SoulX-FlashTalk-14B`.
- **Performance:** "Real-time inference speed can only be supported on 8xH800 or higher". The README also mentions "A 4-GPU real-time version" (internal inconsistency) — [README](https://github.com/Soul-AILab/SoulX-FlashTalk/blob/HEAD/README.md).
- **Weights license:** **unclear** (HF not reachable).
- **Last activity:** 2026-07-30.
- **Verdict:** **Commercial OK with caveats** on licensing, but economically impractical for one user per server.

#### Live Avatar (Alibaba-Quark), ECCV'26
- **GitHub:** https://github.com/Alibaba-Quark/LiveAvatar
- **Code license:** Apache 2.0 — [LICENSE](https://github.com/Alibaba-Quark/LiveAvatar/blob/HEAD/LICENSE).
- **Model:** 14B diffusion model on the base `Wan-AI/Wan2.2-S2V-14B`. Weights are at `Quark-Vision/Live-Avatar` — [README](https://github.com/Alibaba-Quark/LiveAvatar/blob/HEAD/README.md). The Wan2.2 repo is Apache 2.0 — [Wan2.2 LICENSE](https://github.com/Wan-Video/Wan2.2/blob/HEAD/LICENSE.txt). The Live-Avatar weights license is **unclear** (HF not reachable).
- **Performance:**
  - "45 FPS on multi-card H800 GPUs with 4-step sampling".
  - FP8 enables inference on 48 GB GPUs (v1.1, 2026-01-20).
  - Single 80 GB GPU for offline generation.
  - Real-time streaming is "experimental… on at least H800 GPUs".

  Source: [README](https://github.com/Alibaba-Quark/LiveAvatar/blob/HEAD/README.md).
- **Last activity:** 2026-08-24.
- **Verdict:** **Commercial OK with caveats** on licensing (confirm the weights), but the hardware is enterprise-class.

#### Duix (duix.ai / duix.com; "HeyGem" open source)
- **GitHub:**
  - https://github.com/duixcom/Duix-Avatar (offline Windows video synthesis and avatar cloning, with a section on real-time interaction)
  - https://github.com/duixcom/Duix-Mobile (on-device Android/iOS SDK)
  - `duixcom/Duix-Heygem` did not clone, so the repo name is not found. A rename to Duix-Avatar is likely but **unconfirmed**.
- **License (both repos):** custom **"DUIX.COM COMMUNITY LICENSE AGREEMENT"** — [Duix-Avatar LICENSE](https://github.com/duixcom/Duix-Avatar/blob/HEAD/LICENSE), [Duix-Mobile LICENSE](https://github.com/duixcom/Duix-Mobile/blob/HEAD/LICENSE). It is royalty-free with these terms:
  - **If your products or services, or affiliates, exceed 1 thousand Monthly Active Users, "you must request a commercial license"**.
  - You must display "Built with DUIX.COM".
  - You must include the agreement and a NOTICE file.
  - Patent/IP litigation terminates the license.
  - You grant DUIX.COM "a perpetual, worldwide… irrevocable license to use… any case studies, examples, applications, or implementations created using the DUIX.COM Materials… including… marketing".
- Duix-Avatar also ships a separate "Duix.Avatar model community Licensing Agreement.pdf" (git ls-tree). Its contents were not read here.
- **Performance:**
  - Duix-Mobile: "AI avatar response latency under 120ms (tested on Snapdragon 8 Gen 2)" — [Duix-Mobile README](https://github.com/duixcom/Duix-Mobile/blob/HEAD/README.md).
  - Duix-Avatar: "fully offline video synthesis tool designed for Windows", needing 30–100 GB disk — [Duix-Avatar README](https://github.com/duixcom/Duix-Avatar/blob/HEAD/README.md).
- **Last activity:** Duix-Avatar 2026-04-21, Duix-Mobile 2026-08-05.
- **Verdict:** **Commercial OK with caveats.** It is free only up to 1,000 MAU. You must comply with the attribution and case-study grant. Beyond 1,000 MAU it needs a negotiated license.

#### MuseTalk (TMElyralab / Tencent Music), with real-time mode
- **GitHub:** https://github.com/TMElyralab/MuseTalk
- **Code license:** MIT — [LICENSE](https://github.com/TMElyralab/MuseTalk/blob/HEAD/LICENSE).
- **Disclaimer/License section of the README:**
  - Code: "no limitation for both academic and commercial usage".
  - Model: "available for any purpose, even commercially".
  - Other open-source models "must comply with their license, such as whisper, ft-mse-vae, dwpose, S3FD".
  - Test data is "non-commercial research purposes only".

  Source: [README](https://github.com/TMElyralab/MuseTalk/blob/HEAD/README.md).
- **Dependencies:**
  - whisper-tiny: MIT — [whisper LICENSE](https://github.com/openai/whisper/blob/HEAD/LICENSE).
  - DWPose: Apache 2.0 — [DWPose LICENSE](https://github.com/IDEA-Research/DWPose/blob/HEAD/LICENSE).
  - S3FD via face-alignment: BSD-3 — [face-alignment LICENSE](https://github.com/1adrianb/face-alignment/blob/HEAD/LICENSE).
  - sd-vae-ft-mse: license **not verified** (HF blocked).
  - face-parse-bisent: hosted on Google Drive; license **not verified**.
- **Performance:** "real-time inference with 30fps+ on an NVIDIA Tesla V100". Single-step latent inpainting, so not a diffusion loop — [README](https://github.com/TMElyralab/MuseTalk/blob/HEAD/README.md). Through LiveTalking it runs at 42 FPS on 3080Ti, 45 on 3090 and 72 on 4090 — [LiveTalking README](https://github.com/lipku/LiveTalking/blob/HEAD/README.md).
- **Per-person training:** none (needs a reference video of the person).
- **Last activity:** 2025-09-26.
- **Verdict:** **Commercial OK with caveats.** Code and weights are explicitly commercial; verify the sd-vae-ft-mse and face-parsing weights.

#### Ditto-talkinghead (Ant Group)
- **GitHub:** https://github.com/antgroup/ditto-talkinghead
- **Code license:** Apache 2.0 — [LICENSE](https://github.com/antgroup/ditto-talkinghead/blob/HEAD/LICENSE).
- **Lineage and checkpoint contents:** "Our implementation is based on S2G-MDDiffusion and LivePortrait". Checkpoints include `hubert.onnx`, **`insightface_det.onnx`** and `lmdm_v0.4_hubert.onnx`, plus TensorRT engines. Tested on an A100 with TensorRT 8.6.1 — [README](https://github.com/antgroup/ditto-talkinghead/blob/HEAD/README.md).
- **Weights license:** **unclear**. The HF card at `digital-avatar/ditto-talkinghead` was not reachable, and a search found no license text — [HF repo](https://huggingface.co/digital-avatar/ditto-talkinghead/tree/main/ditto_pytorch).
- **Performance:** no FPS figure was found in the README grep. Real-time is claimed in the title, "Realtime Talking Head Synthesis".
- **Last activity:** 2025-11-12.
- **Verdict:** **Non-commercial / risky.** It bundles an InsightFace detector model (non-commercial, see Q2), and the weights license is unclear.

#### LivePortrait (Kuaishou), often a component of real-time pipelines
- **GitHub:** https://github.com/KwaiVGI/LivePortrait
- **Code license:** MIT — [LICENSE](https://github.com/KwaiVGI/LivePortrait/blob/HEAD/LICENSE).
- **InsightFace caveat:** secondary sources (Replicate / ComfyUI wrapper) state that LivePortrait uses InsightFace buffalo_l, which "cannot be used commercially". A MediaPipe detector swap makes the pipeline "MIT and Apache-2.0" — [Replicate readme](https://replicate.com/fofr/live-portrait/readme), [ComfyUI-LivePortraitKJ](https://github.com/kijai/ComfyUI-LivePortraitKJ).
- **Last activity:** 2026-06-02.
- **Verdict:** **Commercial OK with caveats** (replace InsightFace).

#### ER-NeRF
- **GitHub:** https://github.com/Fictionarry/ER-NeRF
- **Code license:** MIT, "Copyright (c) 2022 hawkey" — [LICENSE](https://github.com/Fictionarry/ER-NeRF/blob/HEAD/LICENSE).
- **Requirements:**
  - **Basel Face Model 2009** (`convert_BFM.py`).
  - OpenFace FeatureExtraction for AUs.
  - DeepSpeech features (Mozilla DeepSpeech is MPL-2.0 — [DeepSpeech LICENSE](https://github.com/mozilla/DeepSpeech/blob/HEAD/LICENSE)) or HuBERT (fairseq MIT — [fairseq LICENSE](https://github.com/facebookresearch/fairseq/blob/HEAD/LICENSE)).
  - A per-person training video at 25 FPS.

  Source: [README](https://github.com/Fictionarry/ER-NeRF/blob/HEAD/README.md).
- **Per-person training:** yes. Pretrained checkpoints are for Obama only.
- **Last activity:** 2025-02-28.
- **Verdict:** **Non-commercial / risky** because of the BFM (and OpenFace's license, which was not verified here).

#### RAD-NeRF
- **GitHub:** https://github.com/ashawkey/RAD-NeRF
- **Code license:** MIT — [LICENSE](https://github.com/ashawkey/RAD-NeRF/blob/HEAD/LICENSE).
- **Requirements:** a "prepare basel face model" step (`01_MorphableModel.mat`) — [readme](https://github.com/ashawkey/RAD-NeRF/blob/HEAD/readme.md).
- **Per-person training:** yes.
- **Last activity:** 2023-03-15 (stale).
- **Verdict:** **Non-commercial / risky** (BFM).

#### GeneFace / GeneFace++
- **GitHub:** https://github.com/yerfor/GeneFace and https://github.com/yerfor/GeneFacePlusPlus
- **Code license:** MIT for both — [GeneFace LICENSE](https://github.com/yerfor/GeneFace/blob/HEAD/LICENSE), [GeneFace++ LICENSE](https://github.com/yerfor/GeneFacePlusPlus/blob/HEAD/LICENSE).
- **Per-person training:** GeneFace++ trains on a target-person video (the "May" example dataset). The Audio2Motion training code is still unchecked in its TODO list — [README-zh](https://github.com/yerfor/GeneFacePlusPlus/blob/HEAD/README-zh.md).
- **Last activity:** 2024-10-18 (stale).
- **Verdict:** **Non-commercial / risky** (presumed 3DMM/BFM dependency; see Gaps).

#### SyncTalk
- **GitHub:** https://github.com/ZiqiaoPeng/SyncTalk
- **License:** **CC BY-NC 4.0** ("NonCommercial — You may not use the material for commercial purposes") — [LICENSE](https://github.com/ZiqiaoPeng/SyncTalk/blob/HEAD/LICENSE).
- **Requirements:** BFM 2009 and a 4–5 min, 25 FPS, ~512×512 training video — [README](https://github.com/ZiqiaoPeng/SyncTalk/blob/HEAD/README.md).
- **Last activity:** 2025-09-18.
- **Verdict:** **Non-commercial.**

#### SyncTalk_2D
- **GitHub:** https://github.com/ZiqiaoPeng/SyncTalk_2D
- **License:** **no LICENSE file** in the repo (git ls-tree).
- **Origin:** based on SyncTalk (CC BY-NC) and Ultralight-Digital-Human. It claims "commercial-grade digital humans" — [README](https://github.com/ZiqiaoPeng/SyncTalk_2D/blob/HEAD/README.md).
- **Training:** about 5 hours per person (`training_328.sh`) — [README](https://github.com/ZiqiaoPeng/SyncTalk_2D/blob/HEAD/README.md).
- **Last activity:** 2025-06-26.
- **Verdict:** **Non-commercial / risky.** With no license, it is all-rights-reserved by default, and it derives from CC BY-NC.

#### Ultralight-Digital-Human
- **GitHub:** https://github.com/anliyuan/Ultralight-Digital-Human
- **License:** **no LICENSE file** (git ls-tree).
- **Description:** "mobile-friendly"; FeatherHuBERT audio encoder that is "~40x" cheaper than HuBERT Large; MobileOne UNet with ONNX export — [README](https://github.com/anliyuan/Ultralight-Digital-Human/blob/HEAD/README.md).
- **Per-person training:** yes.
- **Last activity:** 2026-07-22.
- **Verdict:** **Non-commercial / risky** (no license grant).

#### TalkingGaussian
- **GitHub:** https://github.com/Fictionarry/TalkingGaussian
- **License:** **no LICENSE file**.
- **Submodules:** `diff-gaussian-rasterization` (ashawkey fork), whose LICENSE is the **Inria/MPII "Gaussian-Splatting License"** — [.gitmodules](https://github.com/Fictionarry/TalkingGaussian/blob/HEAD/.gitmodules), [rasterizer LICENSE](https://github.com/ashawkey/diff-gaussian-rasterization/blob/HEAD/LICENSE.md). Also `simple-knn` from gitlab.inria.fr.
- **Other requirements:** BFM 2009 and DeepSpeech/HuBERT — [README](https://github.com/Fictionarry/TalkingGaussian/blob/HEAD/README.md).
- **Per-person training:** yes (25 FPS video).
- **Last activity:** 2025-03-16.
- **Verdict:** **Non-commercial.**

#### GaussianTalker
- **GitHub:** https://github.com/cvlab-kaist/GaussianTalker
- **License:** LICENSE.md is the **Inria Gaussian-Splatting License**: "may be used 'non-commercially', i.e., for research and/or evaluation purposes only… THE USER CANNOT USE, EXPLOIT OR DISTRIBUTE THE SOFTWARE FOR COMMERCIAL PURPOSES" — [LICENSE.md](https://github.com/cvlab-kaist/GaussianTalker/blob/HEAD/LICENSE.md).
- **Per-person training:** yes.
- **Last activity:** 2025-04-15.
- **Verdict:** **Non-commercial.**

#### Linly-Talker
- **GitHub:** https://github.com/Kedreamix/Linly-Talker
- **Code license:** MIT — [LICENSE](https://github.com/Kedreamix/Linly-Talker/blob/HEAD/LICENSE).
- **What it aggregates:** Wav2Lip, Wav2Lipv2, SadTalker, MuseTalk and ER-NeRF ("coming soon") for the talking head, plus GPT-SoVITS, CosyVoice and Edge-TTS, and FunASR — [README](https://github.com/Kedreamix/Linly-Talker/blob/HEAD/README.md).
- **Last activity:** 2026-02-10.
- **Verdict:** **Non-commercial / risky** as a bundle. It inherits each module's terms, Wav2Lip being non-commercial. A MuseTalk-only path is the cleaner one.

#### Fay
- **GitHub:** https://github.com/xszyou/Fay
- **License:** **GPL-3.0** — [LICENSE](https://github.com/xszyou/Fay/blob/HEAD/LICENSE).
- **Description:** the README claims "完全开源，商用免责" ("fully open source, commercial-use disclaimer"). It is a framework that connects external digital-human models, LLMs, ASR and TTS — [README](https://github.com/xszyou/Fay/blob/HEAD/README.md).
- **Last activity:** 2026-09-21.
- **Verdict:** **Commercial OK with caveats.** GPL-3.0 has copyleft obligations if you distribute it. The avatar renderer is separate and its terms apply.

#### Rhubarb Lip Sync
- **GitHub:** https://github.com/DanielSWolf/rhubarb-lip-sync
- **License:** **MIT**. "All its third-party dependencies… MIT, BSD, or similar permissive license". "The resulting lip sync data belongs to you alone" — [LICENSE.md](https://github.com/DanielSWolf/rhubarb-lip-sync/blob/HEAD/LICENSE.md).
- **Output:** 6–9 Hanna-Barbera-style mouth shapes (A–F, plus G/H/X) — [README](https://github.com/DanielSWolf/rhubarb-lip-sync/blob/HEAD/README.adoc).
- **Last activity:** 2025-04-03.
- **Verdict:** **Commercial OK** (but see Gaps on streaming).

#### TalkingHead.js (met4citizen)
- **GitHub:** https://github.com/met4citizen/TalkingHead
- **License:** **MIT** — [LICENSE](https://github.com/met4citizen/TalkingHead/blob/HEAD/LICENSE).
- **Avatar requirements:** full-body 3D GLB avatars with a Mixamo-compatible rig and ARKit + Oculus viseme blendshapes.
- **Speech and viseme sources:**
  - Built-in viseme generation for languages such as English and Finnish.
  - Works with Google TTS, Microsoft Azure Speech SDK (viseme IDs) or the ElevenLabs WebSocket API.
  - Companion projects: HeadTTS (free/open English TTS with Kokoro voices plus viseme IDs) and HeadAudio (audio-worklet real-time viseme detection, no transcription).

  Source: [README](https://github.com/met4citizen/TalkingHead/blob/HEAD/README.md).
- **Last activity:** 2026-09-25.
- **Verdict:** **Commercial OK.** Separately check the licenses of your avatar asset, Mixamo animations and TTS provider.

#### wawa-lipsync
- **GitHub:** https://github.com/wass08/wawa-lipsync
- **License:** **MIT** — [LICENSE](https://github.com/wass08/wawa-lipsync/blob/HEAD/LICENSE).
- **Description:** a TypeScript library for "real-time lipsyncing with JS and web audio API" that uses an AnalyserNode on an `<audio>` element — [README](https://github.com/wass08/wawa-lipsync/blob/HEAD/README.md).
- **Last activity:** 2025-11-07.
- **Verdict:** **Commercial OK.**

#### Oculus / Meta OVR LipSync
- **License:** governed by the Oculus SDK License, now the Meta Platforms Technologies SDK License. The grant is "limited, royalty-free, non-exclusive… revocable", and the SDK "may only be used to develop Applications in connection with MPT approved hardware and software products". A Meta community responder said use outside Oculus/Quest hardware is "likely unauthorized" — [Meta forum 696843](https://communityforums.atmeta.com/discussions/dev-general/what-is-the-legal-licencing-requirements-with-ovr-lipsync/696843), [Meta forum 1099014](https://communityforums.atmeta.com/discussions/dev-dashboard/why-does-the-oculus-lipsync-for-unity-plugin-not-support-the-ios-app-store%EF%BC%9F/1099014), [Meta forum 969843](https://communityforums.atmeta.com/discussions/dev-unity/does-licence-allow-use-on-other-platforms/969843). These are forum-sourced; the official license page was not reachable.
- **Verdict:** **Non-commercial / risky** for a web or SaaS product outside Meta hardware.

#### Wav2Lip (reference: the most common hidden piece)
- **GitHub:** https://github.com/Rudrabha/Wav2Lip
- **License:** no LICENSE file. The README is headed "Non Commercial Open-source Version" and says "any form of commercial use is strictly prohibited". It mentions an HD model "trained on a dataset allowing commercial usage", available only commercially — [README](https://github.com/Rudrabha/Wav2Lip/blob/HEAD/README.md).
- **Last activity:** 2025-06-22.
- **Verdict:** **Non-commercial.**

#### InsightFace (reference)
- **GitHub:** https://github.com/deepinsight/insightface
- **License:** code is MIT. "The training data… (and the models trained with these data) are available for non-commercial research purposes only". This applies to both manually downloaded and auto-downloaded models. For buffalo_l, contact recognition-oss-pack@insightface.ai for licensing — [README](https://github.com/deepinsight/insightface/blob/HEAD/README.md).
- **Last activity:** 2026-10-04.

### Inferences
- **Clean commercial core:**
  - Audio2Face-3D (MIT SDK + NVIDIA Open Model weights) driving a rigged 3D avatar.
  - TalkingHead.js, wawa-lipsync or Rhubarb (all MIT) driving a 3D or 2D avatar in the browser.

  These avoid neural face-video licensing entirely, because the avatar is your own asset.
- **Most promising 2D photoreal path:** MuseTalk (code MIT and weights explicitly commercial). Before shipping, verify the sd-vae-ft-mse and face-parsing weights.
- **New 2026 one-shot streaming models:** SoulX-FlashHead, LiveAvatar and SoulX-FlashTalk have Apache code. LiveAvatar's base model, Wan2.2, is Apache. Their weights cards must still be checked; this is a cheap check once HF is reachable.

### Gaps
- Hugging Face model cards were blocked in this session, so these weights licenses remain unclear: Ditto, LiteAvatar, LAM-20K, SoulX-FlashHead/FlashTalk, Live-Avatar, MuseTalk HF mirror, sd-vae-ft-mse and wav2vec2-base-960h. The full NVIDIA Open Model License text was also not read.
- Duix-Heygem: the repo URL could not be resolved, and the "Duix.Avatar model community Licensing Agreement.pdf" was not read.
- Ditto: no published FPS or GPU number was found in the README.
- GeneFace / GeneFace++: the README grep did not show which 3DMM is used, so BFM use is presumed, not confirmed.
- OpenFace (used by ER-NeRF/TalkingGaussian): its license was not verified here.
- Rhubarb: whether it can run in streaming/real-time mode was not verified. It is documented as processing audio files.

## Q2. Which have hidden non-commercial pieces?

### Takeaway
The main traps:
- Wav2Lip weights (LRS2-trained, non-commercial) inside LiveTalking and Linly-Talker.
- InsightFace detector/recognition models inside Ditto and LivePortrait.
- Basel Face Model 2009 in nearly every NeRF/3DGS talking head: ER-NeRF, RAD-NeRF, SyncTalk, TalkingGaussian.
- The Inria Gaussian-Splatting rasterizer in TalkingGaussian and GaussianTalker.
- FLAME in LAM.
- Custom MAU caps (Duix) and missing license files: SyncTalk_2D, Ultralight-Digital-Human, TalkingGaussian.

Audio feature extractors are generally fine: DeepSpeech is MPL-2.0, fairseq/HuBERT code is MIT, Whisper is MIT.

### Cited Findings
- **Wav2Lip:** "any form of commercial use is strictly prohibited" (trained on LRS2) — [Wav2Lip README](https://github.com/Rudrabha/Wav2Lip/blob/HEAD/README.md). LiveTalking's default quick start uses `wav2lip256.pth`, distributed via Quark/Google Drive, with no provenance statement — [LiveTalking README](https://github.com/lipku/LiveTalking/blob/HEAD/README.md). Linly-Talker integrates Wav2Lip and Wav2Lipv2 — [Linly-Talker README](https://github.com/Kedreamix/Linly-Talker/blob/HEAD/README.md).
- **InsightFace:** models are "for non-commercial research purposes only" — [InsightFace README](https://github.com/deepinsight/insightface/blob/HEAD/README.md). Ditto ships `insightface_det.onnx` — [Ditto README](https://github.com/antgroup/ditto-talkinghead/blob/HEAD/README.md). LivePortrait uses buffalo_l, and MediaPipe is the commercial-safe swap — [ComfyUI-LivePortraitKJ](https://github.com/kijai/ComfyUI-LivePortraitKJ), [Replicate LivePortrait readme](https://replicate.com/fofr/live-portrait/readme).
- **Basel Face Model:** the BFM 2017/2019 agreements grant use for "internal, non-commercial research, evaluation or testing purposes only", forbid redistribution, and route commercial licensing to Unitectra (mail@unitectra.ch) — [BFM 2017 page](https://faces.dmi.unibas.ch/bfm/bfm2017.html), [BFM2019 NonCommercial License PDF](https://faces.dmi.unibas.ch/bfm/BFM2019_NonCommercial_License_Agreement.pdf), [BFM NonCommercial License PDF](https://faces.dmi.unibas.ch/bfm/content/basel_face_model/downloads/BFM_NonCommercial_License_Agreement.pdf). These were found via search snippets. The 2009-specific text was not retrieved.
- **BFM 2009 is required by:** ER-NeRF — [README](https://github.com/Fictionarry/ER-NeRF/blob/HEAD/README.md); RAD-NeRF — [readme](https://github.com/ashawkey/RAD-NeRF/blob/HEAD/readme.md); SyncTalk — [README](https://github.com/ZiqiaoPeng/SyncTalk/blob/HEAD/README.md); TalkingGaussian — [README](https://github.com/Fictionarry/TalkingGaussian/blob/HEAD/README.md).
- **FLAME:** the official model license restricts use to "non-commercial scientific research, non-commercial education, or non-commercial artistic projects". It defines commercial use as including "incorporation in a commercial product, use in a commercial service", and "prohibits the use of the Software to train methods/algorithms/neural networks" — [FLAME model license](https://flame.is.tue.mpg.de/modellicense.html), seen via search snippet. A developer claim that "FLAME 2023 Open" is commercial-OK is second-hand and was not confirmed — [HF LAM-20K discussion](https://huggingface.co/3DAIGC/LAM-20K/discussions/2). LAM-A2E depends on FLAME — [LAM_Audio2Expression README](https://github.com/aigc3d/LAM_Audio2Expression/blob/HEAD/README.md).
- **Inria Gaussian-Splatting License** (research/evaluation only, no commercial use): GaussianTalker — [LICENSE.md](https://github.com/cvlab-kaist/GaussianTalker/blob/HEAD/LICENSE.md); the rasterizer submodule used by TalkingGaussian — [ashawkey/diff-gaussian-rasterization LICENSE.md](https://github.com/ashawkey/diff-gaussian-rasterization/blob/HEAD/LICENSE.md).
- **Audio features (generally permissive):**
  - DeepSpeech: MPL-2.0 — [DeepSpeech LICENSE](https://github.com/mozilla/DeepSpeech/blob/HEAD/LICENSE).
  - fairseq (HuBERT code): MIT — [fairseq LICENSE](https://github.com/facebookresearch/fairseq/blob/HEAD/LICENSE).
  - Whisper: MIT — [Whisper LICENSE](https://github.com/openai/whisper/blob/HEAD/LICENSE).
- **Custom terms:**
  - NVIDIA Audio2Emotion: "Custom (use allowed with Audio2Face only)".
  - A2F training sample data: "Custom (evaluation only)".

  Source: [A2F-3D README](https://github.com/NVIDIA/Audio2Face-3D/blob/HEAD/README.md).
- **Duix:** a 1,000-MAU cap, attribution, and a perpetual license for DUIX.COM over your case studies — [Duix-Avatar LICENSE](https://github.com/duixcom/Duix-Avatar/blob/HEAD/LICENSE).
- **No LICENSE file** (all rights reserved by default):
  - SyncTalk_2D, Ultralight-Digital-Human, TalkingGaussian: no LICENSE in repo tree (git ls-tree, 2026-10-10).
  - Wav2Lip: no LICENSE file either; the restriction is in its README.

### Inferences
- **Permissive top-level labels mislead:** an "Apache-2.0" or "MIT" badge on the top-level repo (LiveTalking, Linly-Talker, Ditto, ER-NeRF) does not make the runnable pipeline commercial. The weights and 3DMM assets are the binding constraint.
- **NeRF/3DGS approaches:** treat them all as non-commercial unless you replace BFM with a commercially licensed face tracker and swap the Inria rasterizer for a permissive reimplementation. Even then, per-person training (minutes of video plus hours of GPU) makes them a poor fit for multi-tenant SaaS.

### Gaps
- No official statement was found from lipku on the training data or commercial status of `wav2lip256.pth`.
- The exact BFM 2009 license text was not retrieved (the host was blocked). The 2017/2019 terms are used as a proxy.
- Whether permissive reimplementations of the Gaussian rasterizer (e.g., gsplat) are drop-in for TalkingGaussian was not investigated.

## Q3. Hardware cost to serve one concurrent user

### Takeaway
Ordered from cheapest to most expensive per concurrent user:
1. **Client-side viseme/3D** (TalkingHead.js, wawa-lipsync, LAM WebGL, Duix-Mobile): about $0 GPU on the server.
2. **CPU-only 2D** (LiteAvatar): 30 FPS on CPU.
3. **Audio2Face-3D**: >60 FPS, 4 GB+ VRAM recommended, NVIDIA GPU, outputs blendshapes only.
4. **Wav2Lip / MuseTalk on consumer GPUs**: an RTX 3060 runs wav2lip256 at 60 FPS (about 2 streams at 25 FPS); MuseTalk runs at 42–72 FPS on 3080Ti–4090 (about 1–2 streams).
5. **SoulX-FlashHead Lite**: 3 concurrent streams per RTX 4090.
6. **14B diffusion streamers** (LiveAvatar, SoulX-FlashTalk): multi-H800, so impractical for per-user serving.

### Cited Findings
- **LiveTalking:** wav2lip256 runs at 60 FPS on RTX 3060 and 120 FPS on 3080Ti. MuseTalk runs at 42 FPS on 3080Ti, 45 on 3090 and 72 on 4090. Real-time needs ≥25 FPS. Concurrency while speaking is GPU-bound; while idle it is CPU-bound (video encoding) — [LiveTalking README](https://github.com/lipku/LiveTalking/blob/HEAD/README.md).
- **MuseTalk:** 30 FPS+ on a Tesla V100 — [MuseTalk README](https://github.com/TMElyralab/MuseTalk/blob/HEAD/README.md).
- **LiteAvatar:** 30 FPS on CPU only, and mobile-deployable — [lite-avatar README](https://github.com/HumanAIGC/lite-avatar/blob/HEAD/README.md). OpenAvatarChat's end-to-end response is about 2.2 s on average — [OpenAvatarChat readme_en](https://github.com/HumanAIGC-Engineering/OpenAvatarChat/blob/HEAD/readme_en.md).
- **Audio2Face-3D SDK:** >60 FPS, NVIDIA GPU, CUDA 12.8+, 4 GB+ VRAM recommended — [SDK README](https://github.com/NVIDIA/Audio2Face-3D-SDK/blob/HEAD/README.md).
- **LAM:** 562.9 FPS animate+render on A100 and 110+ FPS on a Xiaomi 14 phone through the WebGL renderer — [LAM README](https://github.com/aigc3d/LAM/blob/HEAD/README.md).
- **Duix-Mobile:** under 120 ms response latency on Snapdragon 8 Gen 2, on-device — [Duix-Mobile README](https://github.com/duixcom/Duix-Mobile/blob/HEAD/README.md).
- **SoulX-FlashHead:**
  - Lite: 96 FPS, or 3 concurrent real-time streams, on one RTX 4090.
  - Pro: real-time on 2× RTX 5090.

  Source: [FlashHead README](https://github.com/Soul-AILab/SoulX-FlashHead/blob/HEAD/README.md).
- **Live Avatar:** 45 FPS on multi-H800. FP8 fits 48 GB GPUs. A single 80 GB GPU handles offline generation — [LiveAvatar README](https://github.com/Alibaba-Quark/LiveAvatar/blob/HEAD/README.md).
- **SoulX-FlashTalk:** real-time "only… on 8xH800 or higher" — [FlashTalk README](https://github.com/Soul-AILab/SoulX-FlashTalk/blob/HEAD/README.md).
- **TalkingHead.js and wawa-lipsync:** run in the browser (Web Audio API / three.js), with no server GPU needed for lip-sync — [TalkingHead README](https://github.com/met4citizen/TalkingHead/blob/HEAD/README.md), [wawa-lipsync README](https://github.com/wass08/wawa-lipsync/blob/HEAD/README.md).

### Inferences
- **Streams per GPU:** from the FPS figures, assuming a 25 FPS target and ignoring encode/TTS/LLM overhead:
  - RTX 3060 with wav2lip256: about 2 streams.
  - RTX 4090 with MuseTalk: about 2 streams.
  - RTX 4090 with FlashHead-Lite: 3 streams (as stated).
  - V100 with MuseTalk: about 1 stream.

  CPU video encoding per stream also limits density (per LiveTalking).
- **Server cost for the browser path:** with TalkingHead.js, wawa-lipsync or a LAM WebGL client plus your own permissively licensed avatar, the server only runs LLM + TTS, so avatar GPU cost per user is effectively zero.
- **Audio2Face-3D server cost:** because its output is only a small stream of blendshape data that the client can render, it needs much less bandwidth than video. One GPU can likely serve many users, but no published concurrency figure was found.

### Gaps
- No $/hour cloud GPU prices were gathered (provider pages were not fetched in this session), so dollar cost per concurrent user is not computed.
- No measured multi-session concurrency figures were found for Audio2Face-3D, MuseTalk standalone, Ditto or LiteAvatar beyond the single-stream FPS claims.
- End-to-end latency (ASR → LLM → TTS → avatar) is reported only for OpenAvatarChat (~2.2 s) and Duix-Mobile (<120 ms avatar response). It was not found for the others.
