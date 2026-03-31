import "./run-with-concurrency-B0lSSjmf.js";
import "./accounts-4pIASVMe.js";
import "./paths-eFexkPEh.js";
import "./github-copilot-token-Cxf8QYZb.js";
import "./config-nTkQbTqH.js";
import { B as shouldLogVerbose, R as logVerbose } from "./logger-DnJ6DlYK.js";
import "./thinking-uLECvLX2.js";
import "./image-ops-DJMRJUZF.js";
import "./pi-embedded-helpers-DrRuuvsy.js";
import "./plugins-C5omQoNV.js";
import "./accounts-BRtiuUKY.js";
import "./paths-Bg689P_I.js";
import "./redact-CYYEqr51.js";
import "./errors-CPQaeq5_.js";
import "./path-alias-guards-lWkVroHS.js";
import "./fs-safe-Cw-rxU-z.js";
import "./ssrf-lFpafSUK.js";
import "./fetch-guard-ClPuc_h2.js";
import "./local-roots-B7YIdd6F.js";
import "./tool-images-DCBEnYsh.js";
import { i as normalizeMediaAttachments, m as isAudioAttachment, o as resolveMediaAttachmentLocalRoots, t as runAudioTranscription } from "./audio-transcription-runner-ZqGMMF4_.js";
import "./image-BaOoe67g.js";
import "./chrome-DNNyyzAP.js";
import "./skills-C9C6OM1g.js";
import "./store-BEGuADwf.js";
import "./api-key-rotation-2loM4-sR.js";
import "./proxy-fetch-B_Mh34nZ.js";
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
