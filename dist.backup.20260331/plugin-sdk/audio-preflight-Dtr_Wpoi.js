import "./run-with-concurrency-B0Wb-l36.js";
import "./model-auth-DF7B1SWS.js";
import { B as shouldLogVerbose, R as logVerbose } from "./logger-Cxu-Klb_.js";
import "./paths-akVZbnot.js";
import "./github-copilot-token-CjEwwa4e.js";
import "./thinking-Dam3RCBg.js";
import "./accounts-DSMMs0Ww.js";
import "./plugins-C1UtRrD8.js";
import "./ssrf-B9BMRDwY.js";
import "./fetch-guard-BWnQdVLu.js";
import "./image-ops-CGOJs1bz.js";
import "./pi-embedded-helpers-VAzxzIPS.js";
import "./accounts-CsfCRtmK.js";
import "./paths-CNBdcyu4.js";
import { i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, p as isAudioAttachment, t as runAudioTranscription } from "./audio-transcription-runner-v4P1LwGU.js";
import "./image-CRHczDDK.js";
import "./chrome-D1lwShkf.js";
import "./skills-Cvb7j9Sf.js";
import "./path-alias-guards-4pesaMWH.js";
import "./redact-BkCa6pJx.js";
import "./errors-DAKeCDdf.js";
import "./fs-safe-DD7dvC_x.js";
import "./store-5DbfnhPa.js";
import "./tool-images-YgXTYLBg.js";
import "./api-key-rotation-CMgJOMlL.js";
import "./local-roots-sCPoluXt.js";
import "./proxy-fetch-o2k_1EOm.js";
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
