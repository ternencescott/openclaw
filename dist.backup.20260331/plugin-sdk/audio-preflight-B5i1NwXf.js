import "./run-with-concurrency-BMh-rgTO.js";
import "./accounts-BzfpzKCr.js";
import "./paths-eFexkPEh.js";
import "./github-copilot-token-Cxf8QYZb.js";
import "./config-CDswfN1x.js";
import { B as shouldLogVerbose, R as logVerbose } from "./logger-U3s76KST.js";
import "./thinking-By5CwKgC.js";
import "./image-ops-EBEstdQP.js";
import "./pi-embedded-helpers-Bedf-MCR.js";
import "./plugins-CF5VrPKn.js";
import "./accounts-Chtufolf.js";
import "./paths-GZK_LI8c.js";
import "./redact-z6WVaymT.js";
import "./errors-DR1SiaHP.js";
import "./path-alias-guards-XbH-Vt2n.js";
import "./fs-safe-edcds3oU.js";
import "./ssrf-CUIH1v38.js";
import "./fetch-guard-l481otrm.js";
import "./local-roots-BhZMA8rH.js";
import "./tool-images-naTdMh-V.js";
import { i as normalizeMediaAttachments, m as isAudioAttachment, o as resolveMediaAttachmentLocalRoots, t as runAudioTranscription } from "./audio-transcription-runner-CUKncb_p.js";
import "./image-CsCmBmIc.js";
import "./chrome-HIKplW96.js";
import "./skills-B_o0Av9w.js";
import "./store-Hft_RG9k.js";
import "./api-key-rotation-D0eQA9Yn.js";
import "./proxy-fetch-0VcTBuoM.js";
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
