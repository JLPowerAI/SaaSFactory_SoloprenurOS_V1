# Audio-driven portrait animation / talking-head repos (single photo + audio → video): commercial-use audit, state as of October 2026

How this was researched (read before relying on it):
- LICENSE and README files were downloaded directly from `raw.githubusercontent.com` on 2026-10-10. "Last commit" dates come from a shallow `git clone` of each repo's default branch on 2026-10-10.
- **huggingface.co was blocked by the network policy in this research environment.** Weight licenses on HF model cards could therefore NOT be read directly. Where a weights license is stated, it comes from (a) the GitHub README/LICENSE stating the model/weights license, or (b) web-search snippets of the HF page, and is labelled as such. Anything else is marked "unverified (HF blocked)".
- The GitHub API was also blocked, so star counts are not included.
- stability.ai pages were also unreachable, so the SVD license terms are cited from search results and HF metadata snippets.

Verdict legend: **Commercial OK** = code, weights and base model all permissive, with no known NC component in the default pipeline. **Commercial OK with caveats** = permissive core, but with conditions such as revenue/user caps, registration, an NC sub-component that must be swapped, or unverified weight terms. **Non-commercial / risky** = an explicit NC/research-only license on code or weights, or a territory exclusion that blocks core markets.

---

## Q1. Per-candidate fact sheets

### Takeaway
The candidates split into three generations. (1) Older SD1.5/SVD/face-vid2vid-based models (SadTalker, Hallo 1/2, AniPortrait, V-Express, EchoMimic v1/v2, MEMO, Sonic, LivePortrait-derivatives) are mostly encumbered by InsightFace's non-commercial models, NC licenses, or SVD's revenue-capped license. (2) Wan2.1/2.2-based DiT models from 2025-2026 (Wan2.2-S2V, InfiniteTalk/MultiTalk, EchoMimicV3, StableAvatar, OmniAvatar, FantasyTalking, HuMo, Hallo4, LiveAvatar) inherit Apache-2.0 from Wan and are the cleanest commercially, but need 12–80 GB VRAM. (3) Tencent Hunyuan-based models carry an EU/UK/South Korea territory exclusion. Meituan's LongCat-Video-Avatar (MIT code and weights) is the other clean option.

### Cited Findings

#### A. Older / lightweight (non-diffusion or SD1.5-era) models

**SadTalker (OpenTalker / Tencent AI Lab)**: https://github.com/OpenTalker/SadTalker
- Code license: Apache-2.0. The LICENSE begins "SadTalker is licensed under the Apache 2.0 License, except for the third-party components listed below", but no third-party list follows in the file — [LICENSE](https://github.com/OpenTalker/SadTalker/blob/main/LICENSE)
- The README says: "The license has been updated to Apache 2.0, and we've removed the non-commercial restriction" — [README](https://github.com/OpenTalker/SadTalker/blob/main/README.md)
- Weights are distributed as GitHub release assets (`SadTalker_V0.0.2_256/512.safetensors`, mapping models), so they presumably fall under the repo's Apache-2.0. The download script also pulls GFPGANv1.4 and facexlib detection/alignment weights for the enhancer — [download_models.sh](https://github.com/OpenTalker/SadTalker/blob/main/scripts/download_models.sh)
- Components: a 3DMM extractor from Microsoft Deep3DFaceReconstruction (`epoch_20.pth`) and a "BFM 3DMM library file"; the face renderer "borrows heavily" from the face-vid2vid reproduction and PIRender; GFPGAN is the face enhancer; facexlib handles face utilities — [README](https://github.com/OpenTalker/SadTalker/blob/main/README.md)
- The legacy (commented-out) download list included `wav2lip.pth` and `BFM_Fitting.zip` — [download_models.sh](https://github.com/OpenTalker/SadTalker/blob/main/scripts/download_models.sh)
- Base model: none (custom 3DMM + face-vid2vid-style renderer).
- Last commit: 2023-10-11 (unmaintained).
- Verdict: **Commercial OK with caveats.** The SadTalker code and weights are Apache-2.0, but it is unclear whether the GFPGAN enhancer (optional), the BFM files (Basel Face Model, whose license was not verified this session) and the legacy Wav2Lip checkpoint are clean. Run without `--enhancer gfpgan` and audit the BFM/Deep3DFaceRecon files before commercial use.

**LivePortrait (KwaiVGI / Kuaishou)**: https://github.com/KwaiVGI/LivePortrait. It is video/keypoint-driven, not audio-driven, but it is the renderer used by the audio-driven JoyVASA, KDTalker and Ditto.
- Code license: MIT. The LICENSE appends: "The models of InsightFace are for non-commercial research purposes only. If you want to use the LivePortrait project for commercial purposes, you should remove and replace InsightFace's detection models to fully comply with the MIT license." — [LICENSE](https://github.com/KwaiVGI/LivePortrait/blob/main/LICENSE)
- The repo vendors `src/utils/dependencies/insightface/` (verified via the git tree). The README points to the community node ComfyUI-LivePortraitKJ, which uses "MediaPipe as an alternative to Insightface" — [README](https://github.com/KwaiVGI/LivePortrait/blob/main/readme.md)
- Weights license on HF (KwaiVGI/LivePortrait): unverified (HF blocked).
- Speed: per-frame on an RTX 4090 with torch.compile, roughly 0.8 ms (appearance) + 0.8 ms (motion) + 7.6 ms (SPADE generator) + 5.2 ms (warping) + 0.3 ms (stitching), i.e. about 15 ms per frame, which is real-time capable — [speed.md](https://github.com/KwaiVGI/LivePortrait/blob/main/assets/docs/speed.md)
- Last commit: 2026-06-02 (docs only).
- Verdict: **Commercial OK with caveats** (InsightFace detector must be replaced, e.g. with MediaPipe).

**JoyVASA (JD Health)**: https://github.com/jdh-algo/JoyVASA. Audio → motion diffusion, rendered with LivePortrait.
- Code: MIT — [LICENSE](https://github.com/jdh-algo/JoyVASA/blob/main/LICENSE)
- It uses the LivePortrait appearance encoder and motion extractor; the checkpoint tree includes an `insightface` folder; audio encoders are wav2vec2-base or chinese-hubert-base — [README](https://github.com/jdh-algo/JoyVASA/blob/main/README.md)
- Speed/VRAM: "Tested GPUs: RTX 4060 Laptop 8GB VRAM" — [README](https://github.com/jdh-algo/JoyVASA/blob/main/README.md)
- Last commit: 2026-04-16.
- Verdict: **Commercial OK with caveats** (same InsightFace replacement as LivePortrait; weights license unverified because HF was blocked).

**KDTalker (Univ. of Liverpool et al.)**: https://github.com/chaolongy/KDTalker. Implicit keypoints + LivePortrait-style renderer.
- "Our code is under the CC-BY-NC 4.0 license and intended solely for research purposes. If you ... wish to use it for commercial purposes, please contact us" — [README](https://github.com/chaolongy/KDTalker/blob/main/README.md)
- Ships an `insightface` folder; "could be conducted on one RTX4090 or RTX3090" — [README](https://github.com/chaolongy/KDTalker/blob/main/README.md)
- Last commit: 2026-02-06.
- Verdict: **Non-commercial / risky.**

**Ditto (Ant Group)**: https://github.com/antgroup/ditto-talkinghead. Real-time motion-space diffusion talking head (ACM MM 2025).
- Code: Apache-2.0. "This repository is released under the Apache-2.0 license" — [README](https://github.com/antgroup/ditto-talkinghead/blob/main/README.md); [LICENSE](https://github.com/antgroup/ditto-talkinghead/blob/main/LICENSE)
- Weights are on HF `digital-avatar/ditto-talkinghead`; their license was not verified (HF blocked). A third-party aggregator lists Apache-2.0, but this likely refers to the code — [oosmetrics](https://oosmetrics.com/repo/antgroup/ditto-talkinghead)
- The checkpoint bundle includes `insightface_det.onnx`, an InsightFace 106-point landmark model and a MediaPipe 478-point landmark model (`core/aux_models/insightface_det.py`, `insightface_landmark106.py`, `mediapipe_landmark478.py`). The architecture mirrors LivePortrait (appearance extractor, SPADE generator, stitching network) with a HuBERT audio encoder — [README](https://github.com/antgroup/ditto-talkinghead/blob/main/README.md) plus the repo tree.
- Speed: designed for real time, with TensorRT 8.6.1 and engines tested on an A100 ("Ampere_Plus" TRT engines provided) — [README](https://github.com/antgroup/ditto-talkinghead/blob/main/README.md)
- Last commit: 2025-11-12 (training code released).
- Verdict: **Commercial OK with caveats** (InsightFace det/landmark models are NC and must be swapped; weights license unverified).

**FLOAT (DeepBrain AI)**: https://github.com/deepbrainai-research/float
- "This work is licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License. You may not use this work for commercial purposes ... For any commercial inquiries ... contact daniel@deepbrain.io" — [README](https://github.com/deepbrainai-research/float/blob/main/README.md). The LICENSE.md file itself is "Attribution-NonCommercial 4.0", which conflicts slightly with the README's NC-ND; both are NC — [LICENSE.md](https://github.com/deepbrainai-research/float/blob/main/LICENSE.md)
- Tested on A100/V100 Linux — [README](https://github.com/deepbrainai-research/float/blob/main/README.md)
- Last commit: 2025-11-10.
- Verdict: **Non-commercial / risky.**

#### B. SD1.5 / SVD-based diffusion models (2024)

**Hallo (Fudan)**: https://github.com/fudan-generative-vision/hallo
- Code: MIT — [LICENSE](https://github.com/fudan-generative-vision/hallo/blob/main/LICENSE)
- Weights: the HF repo `fudan-generative-ai/hallo` is tagged MIT according to a search-result snippet of the HF page (not directly fetched) — [HF](https://huggingface.co/fudan-generative-ai/hallo/tree/main)
- Base model: Stable Diffusion v1.5 (CreativeML OpenRAIL-M). Also uses wav2vec2-base-960h and InsightFace "2D and 3D Face Analysis" models in `pretrained_models/face_analysis/models/` — [README](https://github.com/fudan-generative-vision/hallo/blob/main/README.md)
- Audio "must be in English since our training datasets are only in this language" — [README](https://github.com/fudan-generative-vision/hallo/blob/main/README.md)
- Tested on A100. Last commit: 2024-09-14.
- Verdict: **Commercial OK with caveats** (InsightFace face-embedding models are NC and are used as a conditioning input, so they are hard to swap without retraining; SD1.5 OpenRAIL-M use restrictions apply).

**Hallo2 (Fudan)**: https://github.com/fudan-generative-vision/hallo2
- Code: MIT — [LICENSE](https://github.com/fudan-generative-vision/hallo2/blob/main/LICENSE). HF tagged MIT (search snippet) — [HF](https://huggingface.co/fudan-generative-ai/hallo2/tree/refs%2Fpr%2F1)
- Base model: SD1.5. Dependencies: InsightFace, CodeFormer "facelib" face-parse models, RealESRGAN, CodeFormer — [README](https://github.com/fudan-generative-vision/hallo2/blob/main/README.md)
- "NOTICE: The High-Resolution animation feature is a modified version of CodeFormer. When using or redistributing this feature, please comply with the S-Lab License 1.0" — [README](https://github.com/fudan-generative-vision/hallo2/blob/main/README.md). S-Lab License 1.0 permits "Redistribution and use for non-commercial purpose" only — [CodeFormer LICENSE](https://github.com/sczhou/CodeFormer/blob/master/LICENSE)
- Video super-resolution is trained on VFHQ — [README](https://github.com/fudan-generative-vision/hallo2/blob/main/README.md)
- Tested on A100. Last commit: 2025-02-27.
- Verdict: **Non-commercial / risky** for the full 4K pipeline because of CodeFormer. The base animation without the hi-res stage has the same caveats as Hallo (InsightFace).

**AniPortrait (Tencent)**: https://github.com/Zejun-Yang/AniPortrait
- Code: Apache-2.0 — [LICENSE](https://github.com/Zejun-Yang/AniPortrait/blob/main/LICENSE)
- Base model: Stable Diffusion v1.5 plus wav2vec2-base-960h. Training data: VFHQ and CelebV-HQ — [README](https://github.com/Zejun-Yang/AniPortrait/blob/main/README.md)
- CelebV-HQ "is available for non-commercial research purposes only" and forbids exploiting "any portion of derived data" commercially — [CelebV-HQ README](https://github.com/CelebV-HQ/CelebV-HQ/blob/main/README.md)
- Weights license on HF (ZJYang/AniPortrait): unverified (HF blocked).
- Last commit: 2024-07-02 (stale).
- Verdict: **Commercial OK with caveats** (permissive code and OpenRAIL-M base; weights unverified; training-data provenance includes an NC dataset).

**V-Express (Tencent AI Lab)**: https://github.com/tencent-ailab/V-Express
- No LICENSE file was found at the repo root (main/master, LICENSE/.txt/.md all 404). README: "The code of V-Express is released for both academic and commercial usage. However, both manual-downloading and auto-downloading models from V-Express are for non-commercial research purposes. Our released checkpoints are also for research purposes only." — [README](https://github.com/tencent-ailab/V-Express/blob/main/README.md)
- Uses the SD1.5 UNet config, wav2vec2-base-960h and `insightface/buffalo_l` — [README](https://github.com/tencent-ailab/V-Express/blob/main/README.md)
- VRAM: a peak of about 7.9 GB for 31 s of audio after optimisation — [README](https://github.com/tencent-ailab/V-Express/blob/main/README.md)
- Last commit: 2025-01-24.
- Verdict: **Non-commercial / risky** (weights are research-only).

**EchoMimic v1 (Ant Group)**: https://github.com/antgroup/echomimic
- Code: Apache-2.0 — [LICENSE](https://github.com/antgroup/echomimic/blob/main/LICENSE)
- Weights: `BadToBest/EchoMimic` is reported as Apache-2.0 via a Gitee mirror of the HF repo (secondary source; HF not fetched) — [Gitee mirror](https://gitee.com/hf-models/EchoMimic)
- Base: SD-based reference/denoising UNets, `sd-vae-ft-mse`, `lambdalabs/sd-image-variations-diffusers` (SD-derived) and a Whisper-tiny audio encoder — [README](https://github.com/antgroup/echomimic/blob/main/README.md)
- Disclaimer: "This project is intended for academic research, and we explicitly disclaim any responsibility for user-generated content" — [README](https://github.com/antgroup/echomimic/blob/main/README.md)
- Speed: about 7 min per 240 frames on a V100, or about 50 s with the accelerated pipeline. Tested on A100 80G, RTX4090D 24G and V100 16G — [README](https://github.com/antgroup/echomimic/blob/main/README.md)
- Last commit: 2026-04-07.
- Verdict: **Commercial OK with caveats** (Apache code; weights reportedly Apache; SD-derived base under OpenRAIL-M; "academic research" disclaimer creates ambiguity).

**EchoMimic v2 (Ant Group)**: https://github.com/antgroup/echomimic_v2. Semi-body animation.
- Code: Apache-2.0 — [LICENSE](https://github.com/antgroup/echomimic_v2/blob/main/LICENSE)
- Same "intended for academic research" disclaimer; uses `sd-vae-ft-mse`, Whisper-tiny and DWPose (`src/models/dwpose`); EMTD dataset scripts released — [README](https://github.com/antgroup/echomimic_v2/blob/main/README.md)
- Speed: the accelerated version is about 9x faster (from ~7 min per 120 frames); tested on A100/4090D/V100 — [README](https://github.com/antgroup/echomimic_v2/blob/main/README.md)
- Weights (`BadToBest/EchoMimicV2`): unverified (HF blocked).
- Last commit: 2026-02-23.
- Verdict: **Commercial OK with caveats** (as v1; DWPose model licensing not verified).

**MEMO (Skywork AI / NUS)**: https://github.com/memoavatar/MEMO
- Code: Apache-2.0 — [LICENSE](https://github.com/memoavatar/MEMO/blob/main/LICENSE). Weights `memoavatar/memo` tagged apache-2.0 per search snippet of the HF page — [HF (search result)](https://huggingface.co/memoavatar/memo/tree/main/misc/face_analysis)
- Uses `stabilityai/sd-vae-ft-mse`, `facebook/wav2vec2-base-960h` and `iic/emotion2vec_plus_large` (config) — [configs/inference.yaml](https://github.com/memoavatar/MEMO/blob/main/configs/inference.yaml). Imports `insightface.app.FaceAnalysis` for face embedding — [vision_utils.py](https://github.com/memoavatar/MEMO/blob/main/memo/utils/vision_utils.py). The HF repo contains `misc/face_analysis` — [HF](https://huggingface.co/memoavatar/memo/tree/main/misc/face_analysis)
- Trained with HDTF, VFHQ and CelebV-HQ (among others) — [README](https://github.com/memoavatar/MEMO/blob/main/README.md)
- Speed: about 1 s per frame on an H100 and about 2 s per frame on an RTX 4090 (30 fps, 20 steps) — [README](https://github.com/memoavatar/MEMO/blob/main/README.md)
- Last commit: 2025-08-06.
- Verdict: **Commercial OK with caveats** (InsightFace NC models in the inference path; NC training data; emotion2vec license not verified).

**Sonic (Tencent / ZJU)**: https://github.com/jixiaozhong/Sonic
- License: CC BY-NC-SA 4.0 — [LICENSE](https://github.com/jixiaozhong/Sonic/blob/main/LICENSE). "Commercialization: Note that our license is non-commercial. If commercialization is required, please use Tencent Cloud Video Creation Large Model" — [README](https://github.com/jixiaozhong/Sonic/blob/main/README.md)
- Base: Stable Video Diffusion `stable-video-diffusion-img2vid-xt`, plus Whisper-tiny and yoloface_v5m. Tested on a single 32 GB GPU — [README](https://github.com/jixiaozhong/Sonic/blob/main/README.md)
- Last commit: 2026-01-08.
- Verdict: **Non-commercial / risky.**

**ACTalker (HKUST / Tencent)**: https://github.com/harlanhong/ACTalker
- No LICENSE file found (404 on LICENSE/.txt/.md). The README says: "If you have any question or collaboration need (research purpose or commercial purpose), please email" — [README](https://github.com/harlanhong/ACTalker/blob/master/README.md)
- Base: SVD-XT-1.1 ("Requires agreement to Stability AI Community License"). Needs 24 GB+ VRAM; about 6 min on an H100 and about 12 min on an RTX 4090 per 25-step run — [README](https://github.com/harlanhong/ACTalker/blob/master/README.md)
- Last commit: 2025-08-20.
- Verdict: **Non-commercial / risky** (no license means all rights reserved by default; SVD dependency).

#### C. CogVideoX / Skywork-based

**Hallo3 (Fudan)**: https://github.com/fudan-generative-vision/hallo3
- Code: MIT — [LICENSE](https://github.com/fudan-generative-vision/hallo3/blob/main/LICENSE). HF tagged MIT (search snippet) — [HF](https://huggingface.co/fudan-generative-ai/hallo3/tree/main/wav2vec)
- "This model is a fine-tuned derivative version based on the CogVideo-5B I2V model ... the use, distribution, and modification of this model must comply with the license terms of CogVideo-5B" — [README](https://github.com/fudan-generative-vision/hallo3/blob/main/README.md)
- CogVideoX License: free for academic research; commercial use requires registering for a "basic commercial license" at open.bigmodel.cn; commercial use is free but "must not exceed 1 million visits per month", above which you must contact their business team — [CogVideo MODEL_LICENSE](https://github.com/THUDM/CogVideo/blob/main/MODEL_LICENSE)
- Also uses T5-v1.1-xxl, wav2vec2 and InsightFace. Training data (70+ hours) is released on HF. Tested on H100 — [README](https://github.com/fudan-generative-vision/hallo3/blob/main/README.md)
- Last commit: 2025-03-13.
- Verdict: **Commercial OK with caveats** (CogVideoX registration plus a 1M visits/month cap, and InsightFace NC). Borderline risky.

**SkyReels-A1 (Skywork)**: https://github.com/SkyworkAI/SkyReels-A1. Expression/portrait animation built on CogVideoX with DiffPoseTalk for the audio path.
- LICENSE.txt is the Skywork Community License wrapper: "The Skywork model supports commercial use. If you plan to use the Skywork model or its derivatives for commercial purposes, you must abide by terms and conditions within Skywork Community License" — [LICENSE.txt](https://github.com/SkyworkAI/SkyReels-A1/blob/main/LICENSE.txt)
- Acknowledges CogVideoX and DiffPoseTalk; uses DiffPoseTalk HDTF_TFHP stats — [README](https://github.com/SkyworkAI/SkyReels-A1/blob/main/README.md)
- Last commit: 2025-06-05.
- Verdict: **Commercial OK with caveats** (custom community license whose PDF was not read in this session, plus CogVideoX license inheritance). Unclear.

#### D. Wan2.1 / Wan2.2-based DiT models (2025-2026), the most commercially permissive group

Base license fact: Wan2.1 and Wan2.2 are Apache-2.0 — [Wan2.1 LICENSE](https://github.com/Wan-Video/Wan2.1/blob/main/LICENSE.txt), [Wan2.2 LICENSE](https://github.com/Wan-Video/Wan2.2/blob/main/LICENSE.txt). Wan2.2 README: "The models in this repository are licensed under the Apache 2.0 License. We claim no rights over the your generated contents" — [README](https://github.com/Wan-Video/Wan2.2/blob/main/README.md). Wan2.1-Fun (alibaba-pai VideoX-Fun) code is Apache-2.0 — [VideoX-Fun LICENSE](https://github.com/aigc-apps/VideoX-Fun/blob/main/LICENSE)

**Wan2.2-S2V-14B (Alibaba Tongyi Wan)**: https://github.com/Wan-Video/Wan2.2
- Code and weights: Apache-2.0 (README license statement above). S2V released 2025-08-26; supports 480P and 720P; single-GPU command "can run on a GPU with at least 80GB VRAM" (with offload flags for less) — [README](https://github.com/Wan-Video/Wan2.2/blob/main/README.md)
- Last commit: 2026-09-21 (active).
- Verdict: **Commercial OK** (heavy hardware).

**MultiTalk (MeiGen-AI / Meituan)**: https://github.com/MeiGen-AI/MultiTalk
- Code: Apache-2.0 — [LICENSE.txt](https://github.com/MeiGen-AI/MultiTalk/blob/main/LICENSE.txt)
- Base: Wan2.1-I2V-14B-480P; audio encoder `TencentGameMate/chinese-wav2vec2-base`. Multi-person; low-VRAM mode enables "480P video generation on a single RTX 4090"; trained on 81-frame 25 FPS clips — [README](https://github.com/MeiGen-AI/MultiTalk/blob/main/README.md)
- Last commit: 2026-05-22.
- Verdict: **Commercial OK** (weights license: see InfiniteTalk; the chinese-wav2vec2-base license is unverified).

**InfiniteTalk (MeiGen-AI / Meituan)**: https://github.com/MeiGen-AI/InfiniteTalk
- Code: Apache-2.0 — [LICENSE.txt](https://github.com/MeiGen-AI/InfiniteTalk/blob/main/LICENSE.txt). "The models in this repository are licensed under the Apache 2.0 License. We claim no rights over the your generated contents" — [README](https://github.com/MeiGen-AI/InfiniteTalk/blob/main/README.md)
- Base: Wan2.1-I2V-14B-480P plus chinese-wav2vec2-base. Unlimited-length image-to-video and video-to-video dubbing; very-low-VRAM mode (`--num_persistent_param_in_dit 0`); FusioniX/lightx2v LoRAs for 4–8 step inference; integrated in Wan2GP — [README](https://github.com/MeiGen-AI/InfiniteTalk/blob/main/README.md)
- Last commit: 2026-05-22.
- Verdict: **Commercial OK** (check the licenses of any third-party acceleration LoRAs you add).

**LongCat-Video-Avatar 1.0 / 1.5 (Meituan LongCat)**: https://github.com/meituan-longcat/LongCat-Video
- Code: MIT — [LICENSE](https://github.com/meituan-longcat/LongCat-Video/blob/main/LICENSE). "The model weights are released under the MIT License" — [README](https://github.com/meituan-longcat/LongCat-Video/blob/main/README.md)
- Base: LongCat-Video (Meituan's own 13.6B-class video foundation model, also MIT). Avatar-1.0 uses wav2vec2; Avatar-1.5 (released 2026-05-21) uses Whisper-large-v3, distillation for fast inference, and INT8 quantisation for lower VRAM. Single- and multi-character — [README](https://github.com/meituan-longcat/LongCat-Video/blob/main/README.md); [InfiniteTalk README news](https://github.com/MeiGen-AI/InfiniteTalk/blob/main/README.md)
- Last commit: 2026-05-27.
- Verdict: **Commercial OK.**

**EchoMimicV3 (Ant Group)**: https://github.com/antgroup/echomimic_v3
- Code: Apache-2.0 — [LICENSE.txt](https://github.com/antgroup/echomimic_v3/blob/main/LICENSE.txt). "The models in this repository are licensed under the Apache 2.0 License" — [README](https://github.com/antgroup/echomimic_v3/blob/main/README.md)
- Base: `alibaba-pai/Wan2.1-Fun-V1.1-1.3B-InP` (1.3B); audio encoders wav2vec2-base-960h and chinese-wav2vec2-base. "12G VRAM Requirement"; runs on 16 GB in ComfyUI — [README](https://github.com/antgroup/echomimic_v3/blob/main/README.md)
- Last commit: 2026-03-18.
- Verdict: **Commercial OK** (lightest Apache-2.0 diffusion option).

**StableAvatar (Fudan / Microsoft et al.)**: https://github.com/Francis-Rings/StableAvatar
- Code: MIT — [LICENSE.txt](https://github.com/Francis-Rings/StableAvatar/blob/main/LICENSE.txt). The README has no license statement for the weights; HF `FrancisRing/StableAvatar` card is unverified (HF blocked).
- Base: Wan2.1-Fun-V1.1-1.3B-InP plus wav2vec2-base-960h. Infinite-length video at 480x832, 832x480 or 512x512. About 18 GB VRAM and about 3 min for a 5 s clip (480x832, 25 fps) on an RTX 4090; `model_cpu_offload` roughly halves VRAM — [README](https://github.com/Francis-Rings/StableAvatar/blob/main/README.md)
- Last commit: 2026-09-25 (active).
- Verdict: **Commercial OK with caveats** (weights license unverified).

**OmniAvatar (ZJU / Alibaba)**: https://github.com/Omni-Avatar/OmniAvatar
- Code: Apache-2.0 — [LICENSE.txt](https://github.com/Omni-Avatar/OmniAvatar/blob/main/LICENSE.txt). The README has no license statement for the weights (HF unverified).
- Base: Wan2.1-T2V-14B or 1.3B (LoRA) plus wav2vec2-base-960h. VRAM/speed on A800 (14B): 36 GB at 16 s/it; 21 GB at 19.4 s/it; 8 GB at 22.1 s/it; 4 GPUs with FSDP at 14.3 GB and 4.8 s/it — [README](https://github.com/Omni-Avatar/OmniAvatar/blob/main/README.md)
- Last commit: 2025-08-06.
- Verdict: **Commercial OK with caveats** (weights license unverified).

**FantasyTalking (AMAP / Alibaba)**: https://github.com/Fantasy-AMAP/fantasy-talking
- Code: Apache-2.0 — [LICENSE](https://github.com/Fantasy-AMAP/fantasy-talking/blob/main/LICENSE). The README has no weights license statement (HF `acvlab/FantasyTalking` unverified).
- Base: Wan2.1-I2V-14B-720P plus wav2vec2-base-960h. On an A100 (512x512, 81 frames): 40 GB at 15.5 s/it; 20 GB at 32.8 s/it; 5 GB at 42.6 s/it — [README](https://github.com/Fantasy-AMAP/fantasy-talking/blob/main/README.md)
- FantasyTalking2 (https://github.com/Fantasy-AMAP/fantasy-talking2) is a paper/README-only repo; no LICENSE file was found. Last commit: 2025-08-18.
- Last commit (v1): 2025-08-20.
- Verdict: **Commercial OK with caveats** (weights license unverified).

**HuMo (ByteDance Research / Tsinghua)**: https://github.com/Phantom-video/HuMo
- Code: Apache-2.0 — [LICENSE](https://github.com/Phantom-video/HuMo/blob/main/LICENSE). The README has no license section for the weights (HF `bytedance-research/HuMo` unverified).
- Base: Wan2.1 (VAE and text encoder from Wan2.1-T2V-1.3B) plus Whisper-large-v3 audio encoder. Text+image+audio → video. 17B weights (2025-09-10) and 1.7B weights (2025-09-16): the 1.7B makes a 480P video in about 8 min on a 32 GB GPU; the 17B runs on a 3090 through ComfyUI-WanVideoWrapper. Trained on 97-frame 25 FPS clips. HuMoSet dataset (670K samples, "curated exclusively from open-source datasets such as OpenHumanVid") released 2025-12-23 — [README](https://github.com/Phantom-video/HuMo/blob/main/README.md)
- Last commit: 2026-01-26.
- Verdict: **Commercial OK with caveats** (weights license unverified).

**Hallo4 (Fudan)**: https://github.com/fudan-generative-vision/hallo4
- No LICENSE file found at the repo root (404). README: "This model is a fine-tuned derivative version based on the WAN2.1-1.3B model ... must comply with the license terms of WAN" — [README](https://github.com/fudan-generative-vision/hallo4/blob/master/README.md)
- English-only audio; tested on H100; data on HF `cuijh26/hallo4_data` — [README](https://github.com/fudan-generative-vision/hallo4/blob/master/README.md)
- Last commit: 2025-11-30.
- Verdict: **Non-commercial / risky** until a license is published (no code license means all rights reserved).

**LiveAvatar (Alibaba Quark), new 2025-12 / 2026 release**: https://github.com/Alibaba-Quark/LiveAvatar
- "The majority of this project is released under the Apache 2.0 license"; base "Wan model ... also released under the Apache 2.0 license" — [README](https://github.com/Alibaba-Quark/LiveAvatar/blob/main/README.md); [LICENSE](https://github.com/Alibaba-Quark/LiveAvatar/blob/main/LICENSE)
- Base: Wan2.2-S2V-14B plus the LiveAvatar LoRA (HF `Quark-Vision/Live-Avatar`). Real-time streaming at 45 FPS on multi-H800. Single-GPU mode needs 80 GB; FP8 (v1.1, 2026-01-20) brings it down to 48 GB GPUs. ECCV 2026 Spotlight — [README](https://github.com/Alibaba-Quark/LiveAvatar/blob/main/README.md)
- Last commit: 2026-08-24.
- Verdict: **Commercial OK with caveats** ("majority" Apache wording means some parts may be under other licenses, and these were not identified).

**AptAvatar (Taobao Live / Alibaba), new 2026**: https://github.com/TaoLiveAIGC/AptAvatar
- Code Apache-2.0, but: "The current release contains inference code. Model weights, datasets, benchmark assets, demo media, and third-party dependencies may be released under separate terms" — [README](https://github.com/TaoLiveAIGC/AptAvatar/blob/main/README.md)
- Builds on InfiniteTalk and Wan; uses chinese-wav2vec2-base — [README](https://github.com/TaoLiveAIGC/AptAvatar/blob/main/README.md)
- Last commit: 2026-08-03.
- Verdict: **Commercial OK with caveats** (weights terms not stated).

**daVinci-MagiHuman (Sand.ai + SII-GAIR), new 2026**: https://github.com/GAIR-NLP/daVinci-MagiHuman. Note that it is not strictly photo+audio driven: input modes are T2V and TI2V (text prompt plus optional reference image), and the model jointly generates the speech audio and the video.
- License: Apache-2.0; "We release the complete model stack: base model, distilled model, super-resolution model, and inference code" — [README](https://github.com/GAIR-NLP/daVinci-MagiHuman/blob/main/README.md)
- Components: t5gemma-9b text encoder, `stabilityai/stable-audio-open-1.0` audio model, Wan2.2-TI2V-5B VAE. Speed on a single H100 for a 5 s clip: 2.0 s at 256p, 8.0 s at 540p, 38.4 s at 1080p — [README](https://github.com/GAIR-NLP/daVinci-MagiHuman/blob/main/README.md)
- Last commit: 2026-04-11.
- Verdict: **Commercial OK with caveats** (the stable-audio-open-1.0 dependency is Stability-licensed, which was not verified here; it does not take your own audio as the driver).

#### E. Tencent Hunyuan-based

**HunyuanVideo-Avatar (Tencent Hunyuan)**: https://github.com/Tencent-Hunyuan/HunyuanVideo-Avatar
- License: Tencent Hunyuan Community License (applies to code and weights). "THIS LICENSE AGREEMENT DOES NOT APPLY IN THE EUROPEAN UNION, UNITED KINGDOM AND SOUTH KOREA"; Territory is "worldwide ... excluding the territory of the European Union, United Kingdom and South Korea". If the licensee's products had more than 100 million monthly active users on the release date, "You must request a license from Tencent". "You must not use ... Output ... to improve any other AI model". "Tencent claims no rights in Outputs" — [LICENSE](https://github.com/Tencent-Hunyuan/HunyuanVideo-Avatar/blob/main/LICENSE)
- Base: HunyuanVideo (same Tencent Hunyuan community license family). Minimum 24 GB VRAM ("very slow"), 96 GB recommended; a 10 GB single-GPU mode is available through Wan2GP/TeaCache. Released 2025-05-28; the README markets e-commerce and streaming use — [README](https://github.com/Tencent-Hunyuan/HunyuanVideo-Avatar/blob/main/README.md)
- Last commit: 2025-12-16.
- Verdict: **Non-commercial / risky** for any business serving EU/UK/KR users. Usable commercially elsewhere, with the anti-model-improvement clause.

#### F. Not released / no open weights
- **OmniHuman (ByteDance)**: no open-weights release found. Coverage from Feb 2025 describes only demos and a project page (omnihuman-lab.github.io), and says it is not available for download — [comfyui-wiki](https://comfyui-wiki.com//en/news/2025-02-03-omnihuman-bytedance-human-animation); [ETV Bharat](https://www.etvbharat.com/en/!technology/omnihuman-1-tiktok-parent-bytedance-picture-to-video-ai-tool-enn25020602114)
- **Loopy (ByteDance)**: not searched in depth; no code or weights repo found in this session. FLOAT's README lists Loopy only as a source of comparison samples — [FLOAT README](https://github.com/deepbrainai-research/float/blob/main/README.md)

### Inferences
- The most commercially usable, actively maintained choices (Oct 2026) are InfiniteTalk/MultiTalk, Wan2.2-S2V, LongCat-Video-Avatar (MIT), EchoMimicV3 (12 GB) and LiveAvatar (real-time, Apache "majority"). StableAvatar, OmniAvatar, FantasyTalking and HuMo are likely Apache/MIT too, but weight-card verification is pending.
- For low-cost or real-time needs, the LivePortrait family (LivePortrait, JoyVASA, Ditto) is fast (about 15 ms per frame for LivePortrait on a 4090), but every member bundles InsightFace NC detectors that must be swapped. Swapping is a detector replacement (e.g. MediaPipe), not a retrain.
- Hallo/MEMO-style models use InsightFace for identity embeddings that feed the network. Replacing those likely requires retraining, so the NC taint is harder to remove there than in LivePortrait-style detectors.

### Gaps
- HF model-card licenses for LivePortrait, Ditto, AniPortrait, EchoMimicV2/V3, OmniAvatar, FantasyTalking, StableAvatar, HuMo, MultiTalk, LiveAvatar and Hallo4 could not be read (HF blocked by network policy). Re-verify each HF card's `license:` field before shipping.
- Output-quality rankings: no independent, verified benchmark was collected. The speed and VRAM figures quoted are the authors' own claims.
- The SadTalker BFM / Deep3DFaceRecon / Wav2Lip component licenses were not verified this session.
- The Skywork Community License PDF and the stable-audio-open-1.0 license were not read.
- Loopy's status was not definitively confirmed.

---

## Q2. Which have BOTH permissive code AND permissive weights AND a permissive base model?

### Takeaway
Fully permissive stacks, with the weights license stated in the GitHub repo itself: **Wan2.2-S2V (Apache), InfiniteTalk and MultiTalk (Apache, Wan2.1 base), EchoMimicV3 (Apache, Wan2.1-Fun base), LongCat-Video-Avatar 1.0/1.5 (MIT, own MIT base)**, plus **LiveAvatar** (Apache "majority", Wan2.2-S2V base). StableAvatar, OmniAvatar, FantasyTalking and HuMo have permissive code and an Apache base, but their weight licenses could not be verified.

### Cited Findings
- Wan2.2 models: "licensed under the Apache 2.0 License. We claim no rights over the your generated contents" — [Wan2.2 README](https://github.com/Wan-Video/Wan2.2/blob/main/README.md)
- InfiniteTalk: "The models in this repository are licensed under the Apache 2.0 License" — [README](https://github.com/MeiGen-AI/InfiniteTalk/blob/main/README.md); base Wan2.1 is Apache-2.0 — [Wan2.1 LICENSE](https://github.com/Wan-Video/Wan2.1/blob/main/LICENSE.txt)
- EchoMimicV3: "The models in this repository are licensed under the Apache 2.0 License" — [README](https://github.com/antgroup/echomimic_v3/blob/main/README.md); base Wan2.1-Fun from VideoX-Fun is Apache-2.0 — [VideoX-Fun LICENSE](https://github.com/aigc-apps/VideoX-Fun/blob/main/LICENSE)
- LongCat-Video(-Avatar): "The model weights are released under the MIT License" — [README](https://github.com/meituan-longcat/LongCat-Video/blob/main/README.md)
- LiveAvatar: "majority of this project is released under the Apache 2.0 license ... The Wan model (Our base model) is also released under the Apache 2.0 license" — [README](https://github.com/Alibaba-Quark/LiveAvatar/blob/main/README.md)
- The InsightFace-free renderers in this group use wav2vec2 / chinese-wav2vec2 / Whisper as audio encoders and no face-restoration models in the default pipeline (based on each README's model table, cited above).
- SD1.5-based options (Hallo, AniPortrait, EchoMimic v1/v2) have a permissive-with-use-restrictions base: CreativeML OpenRAIL-M allows commercial use and redistribution, but requires passing on the use-based restrictions and sharing the license — [CompVis license text](https://huggingface.co/spaces/CompVis/stable-diffusion-license/raw/main/index.html); [BigScience Open RAIL-M explainer](https://www.licenses.ai/blog/2022/8/26/bigscience-open-rail-m-license)

### Inferences
- Wan-based options all need large GPUs: from 12 GB (EchoMimicV3, 1.3B) and about 18 GB (StableAvatar, 1.3B) up to 80 GB (Wan2.2-S2V/LiveAvatar 14B without offload). The cost per minute of video is therefore much higher than for LivePortrait-class models.
- The chinese-wav2vec2-base encoder used by InfiniteTalk, MultiTalk, EchoMimicV3 and AptAvatar has a license that was not verified (one secondary source said ModelScope marks it MIT — [search snippet referencing a repackaged repo](https://huggingface.co/Avdpro/EchoMimicV3-MLX)). This is low risk, but it should be checked.

### Gaps
- HF weight cards were not directly verified (network block) for StableAvatar, OmniAvatar, FantasyTalking, HuMo and LiveAvatar.
- The "majority" wording in LiveAvatar's license section does not say which parts are excluded.

---

## Q3. Which carry research-only / non-commercial restrictions, territory exclusions, or user/revenue thresholds?

### Takeaway
Explicitly non-commercial: **Sonic (CC BY-NC-SA), FLOAT (CC BY-NC-ND / BY-NC), KDTalker (CC BY-NC), V-Express weights ("research purposes only")**. No license (all rights reserved): **ACTalker, Hallo4, FantasyTalking2**. Territory exclusion: **HunyuanVideo-Avatar** (excludes EU/UK/South Korea; 100M MAU threshold). Revenue or user caps: **SVD-based models (Sonic, ACTalker)** via the Stability license (free commercial use only under $1M annual revenue), and **CogVideoX-based Hallo3** (registration required; ≤1M visits/month). Soft ambiguity: EchoMimic v1/v2 READMEs say "intended for academic research" despite the Apache-2.0 license.

### Cited Findings
- Sonic: CC BY-NC-SA 4.0; "our license is non-commercial" — [LICENSE](https://github.com/jixiaozhong/Sonic/blob/main/LICENSE), [README](https://github.com/jixiaozhong/Sonic/blob/main/README.md)
- FLOAT: CC BY-NC-ND 4.0 in the README, while LICENSE.md is BY-NC 4.0 — [README](https://github.com/deepbrainai-research/float/blob/main/README.md), [LICENSE.md](https://github.com/deepbrainai-research/float/blob/main/LICENSE.md)
- KDTalker: CC-BY-NC 4.0, "intended solely for research purposes" — [README](https://github.com/chaolongy/KDTalker/blob/main/README.md)
- V-Express: "Our released checkpoints are also for research purposes only" — [README](https://github.com/tencent-ailab/V-Express/blob/main/README.md)
- HunyuanVideo-Avatar: excludes the EU, UK and South Korea; >100M MAU must request a license; may not use outputs to improve other AI models — [LICENSE](https://github.com/Tencent-Hunyuan/HunyuanVideo-Avatar/blob/main/LICENSE)
- CogVideoX (Hallo3 base): commercial use requires registration, with a 1M visits/month cap — [MODEL_LICENSE](https://github.com/THUDM/CogVideo/blob/main/MODEL_LICENSE)
- SVD: the HF metadata license is "stable-video-diffusion-community" and the card says "For commercial use, please refer to https://stability.ai/license" — [HF SVD-XT README (search snippet)](https://huggingface.co/stabilityai/stable-video-diffusion-img2vid-xt/blob/main/README.md). Stability's Community License covers commercial use for organisations under $1M annual revenue; above that an Enterprise License is required — [Stability membership page (search snippet)](https://stability.ai/membership), [Stability license update (search snippet)](https://stability.ai/news/license-update). ACTalker's README states that SVD-XT-1.1 "Requires agreement to Stability AI Community License" — [README](https://github.com/harlanhong/ACTalker/blob/master/README.md)
- EchoMimic v1/v2: "This project is intended for academic research" — [v1 README](https://github.com/antgroup/echomimic/blob/main/README.md), [v2 README](https://github.com/antgroup/echomimic_v2/blob/main/README.md)
- Training-data NC taint: CelebV-HQ "is available for non-commercial research purposes only" — [CelebV-HQ README](https://github.com/CelebV-HQ/CelebV-HQ/blob/main/README.md). It is used by AniPortrait ([README](https://github.com/Zejun-Yang/AniPortrait/blob/main/README.md)) and MEMO ([README](https://github.com/memoavatar/MEMO/blob/main/README.md)). By contrast, HDTF is CC BY 4.0 — [HDTF README](https://github.com/MRzzm/HDTF/blob/main/README.md)

### Inferences
- The SVD revenue cap means an early-stage SaaS (<$1M revenue) could legally use SVD-based models that are otherwise permissive. However, Sonic is NC regardless of SVD, so this matters mainly for ACTalker-like projects, and ACTalker has no code license at all.
- The legal effect of NC training data (CelebV-HQ) on downstream model weights is unsettled. The writer should flag it as residual risk, not as a hard blocker.

### Gaps
- The exact current text of the Stability Community License as it applies to SVD (including any attribution or registration duties) could not be fetched (stability.ai blocked). A third-party review claims registration and "Powered by Stability AI" display requirements, but this was not verified against primary text — [fast.io review](https://fast.io/resources/stability-ai-review-2026/)

---

## Q4. Which depend on InsightFace / GFPGAN / CodeFormer / face-parsing models with non-commercial licenses?

### Takeaway
InsightFace's pretrained models are non-commercial research only. They are used by **LivePortrait, JoyVASA, KDTalker, Ditto, Hallo, Hallo2, Hallo3, V-Express (buffalo_l) and MEMO**. CodeFormer (S-Lab NC) is used by **Hallo2**'s hi-res stage, together with CodeFormer's facelib face-parsing. GFPGAN (Apache-2.0, but bundling StyleGAN2 NVIDIA-licensed code and DFDNet CC BY-NC-SA code) is the optional enhancer in **SadTalker**. The Wan-based models (Wan2.2-S2V, InfiniteTalk, MultiTalk, EchoMimicV3, StableAvatar, OmniAvatar, FantasyTalking, HuMo, LongCat-Avatar, LiveAvatar) list no InsightFace, GFPGAN or CodeFormer models in their README model tables.

### Cited Findings
- InsightFace: "The pretrained models provided with this library are for non-commercial research only, whether downloaded automatically or manually" — [insightface python-package README](https://github.com/deepinsight/insightface/blob/master/python-package/README.md). For buffalo_l recognition models, "contact recognition-oss-pack@insightface.ai for licensing" — [insightface README](https://github.com/deepinsight/insightface/blob/master/README.md)
- LivePortrait: must "remove and replace InsightFace's detection models" for commercial use — [LICENSE](https://github.com/KwaiVGI/LivePortrait/blob/main/LICENSE)
- Ditto: `insightface_det.onnx` plus an InsightFace 106-point landmark model in the checkpoints/aux models — [README](https://github.com/antgroup/ditto-talkinghead/blob/main/README.md)
- JoyVASA and KDTalker: `insightface` checkpoint folders — [JoyVASA README](https://github.com/jdh-algo/JoyVASA/blob/main/README.md), [KDTalker README](https://github.com/chaolongy/KDTalker/blob/main/README.md)
- Hallo / Hallo2 / Hallo3: InsightFace "2D and 3D Face Analysis" models — [Hallo](https://github.com/fudan-generative-vision/hallo/blob/main/README.md), [Hallo2](https://github.com/fudan-generative-vision/hallo2/blob/main/README.md), [Hallo3](https://github.com/fudan-generative-vision/hallo3/blob/main/README.md)
- V-Express: `insightface/buffalo_l` — [README](https://github.com/tencent-ailab/V-Express/blob/main/README.md)
- MEMO: `from insightface.app import FaceAnalysis` — [vision_utils.py](https://github.com/memoavatar/MEMO/blob/main/memo/utils/vision_utils.py)
- Hallo2 + CodeFormer: the S-Lab License 1.0 permits "Redistribution and use for non-commercial purpose" — [CodeFormer LICENSE](https://github.com/sczhou/CodeFormer/blob/master/LICENSE); Hallo2 notice — [README](https://github.com/fudan-generative-vision/hallo2/blob/main/README.md)
- GFPGAN: "licensed under the Apache License Version 2.0 except for the third-party components", including StyleGAN2 (NVIDIA license) and DFDNet ("Creative Commons Attribution-NonCommercial-ShareAlike 4.0") — [GFPGAN LICENSE](https://github.com/TencentARC/GFPGAN/blob/master/LICENSE)
- facexlib (used by SadTalker): code MIT, but "You need to refer to their original LICENCEs for your intended use" of the bundled detection/parsing models — [facexlib README](https://github.com/xinntao/facexlib/blob/master/README.md)
- Community workaround: ComfyUI-LivePortraitKJ uses "MediaPipe as an alternative to Insightface" — [LivePortrait README](https://github.com/KwaiVGI/LivePortrait/blob/main/readme.md)

### Inferences
- Detector-only usage (LivePortrait, JoyVASA, Ditto) is fixable by swapping in MediaPipe or another permissively licensed detector or landmarker.
- Embedding usage (Hallo family, MEMO, V-Express) is structural, because the network was trained on InsightFace ArcFace embeddings. Removing it likely requires retraining with a different face encoder.
- For SadTalker, skipping `--enhancer gfpgan` avoids the GFPGAN third-party code question. facexlib detection weights (RetinaFace-based) may still be pulled in, and their license is unverified.

### Gaps
- Whether the Wan-based repos pull in InsightFace or face-parsing at runtime outside the README tables (for example in preprocessing scripts) was not code-audited, except for the file-tree checks of Ditto, JoyVASA, KDTalker, MEMO, Sonic, AniPortrait and EchoMimicV2.
- Sonic uses `yoloface_v5m.pt` and EchoMimicV2 uses DWPose; the licenses of those auxiliary models were not verified.
