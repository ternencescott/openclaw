import "./run-with-concurrency-BXSUl5Nj.js";
import "./paths-GBpjI3o0.js";
import { B as shouldLogVerbose, R as logVerbose } from "./logger-Bj0Xl6pn.js";
import "./model-selection-DQ0Z0JPw.js";
import "./github-copilot-token-PBo8Vdmp.js";
import "./thinking-DGUHJGw-.js";
import "./plugins-CYmt_3q0.js";
import "./accounts-CKk-G_bw.js";
import "./accounts-CbwflYtB.js";
import "./image-ops-Bx7cfcpZ.js";
import "./pi-embedded-helpers-DDUYNFjm.js";
import "./chrome-0FZNquzw.js";
import "./skills-BTZq2xsK.js";
import "./path-alias-guards-6cS80cow.js";
import "./redact-C-grKXb3.js";
import "./errors-IUnFHymY.js";
import "./fs-safe-B9COjfwE.js";
import "./proxy-env-COiwrWh6.js";
import "./store-DW2t8iMG.js";
import "./paths-CV9f-LYb.js";
import "./tool-images-3ALKTC_Y.js";
import "./image-Ci1Js9ha.js";
import { i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, t as runAudioTranscription, v as isAudioAttachment } from "./audio-transcription-runner-CxpVDgay.js";
import "./fetch-D1ipIHMY.js";
import "./fetch-guard-OiskJOjE.js";
import "./api-key-rotation-Mhds5mZY.js";
import "./proxy-fetch-Cb4oTY_l.js";
//#region src/media-understanding/audio-preflight.ts
/**
* Transcribes the first audio attachment BEFORE mention checking.
* This allows voice notes to be processed in group chats with requireMention: true.
* Returns the transcript or undefined if transcription fails or no audio is found.
*/
async function transcribeFirstAudio(params) {
	const { ctx, cfg } = params;
	const audioConfig = cfg.tools?.media?.audio;
	if (!audioConfig || audioConfig.enabled === false) return;
	const attachments = normalizeMediaAttachments(ctx);
	if (!attachments || attachments.length === 0) return;
	const firstAudio = attachments.find((att) => att && isAudioAttachment(att) && !att.alreadyTranscribed);
	if (!firstAudio) return;
	if (shouldLogVerbose()) logVerbose(`audio-preflight: transcribing attachment ${firstAudio.index} for mention check`);
	try {
		const { transcript } = await runAudioTranscription({
			ctx,
			cfg,
			attachments,
			agentDir: params.agentDir,
			providers: params.providers,
			activeModel: params.activeModel,
			localPathRoots: resolveMediaAttachmentLocalRoots({
				cfg,
				ctx
			})
		});
		if (!transcript) return;
		firstAudio.alreadyTranscribed = true;
		if (shouldLogVerbose()) logVerbose(`audio-preflight: transcribed ${transcript.length} chars from attachment ${firstAudio.index}`);
		return transcript;
	} catch (err) {
		if (shouldLogVerbose()) logVerbose(`audio-preflight: transcription failed: ${String(err)}`);
		return;
	}
}
//#endregion
export { transcribeFirstAudio };
