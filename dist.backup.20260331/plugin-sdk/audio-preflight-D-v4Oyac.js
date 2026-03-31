import "./run-with-concurrency-8rEOAFIb.js";
import "./config-TChktZcS.js";
import { B as shouldLogVerbose, R as logVerbose } from "./logger-Blr-bUxJ.js";
import "./paths-D6tDENa_.js";
import "./accounts-BzOtxN2G.js";
import "./plugins-BH5wDwyt.js";
import "./thinking-RUY0PFjr.js";
import "./image-ops-XDZEi93j.js";
import "./pi-embedded-helpers-CagUabE1.js";
import "./accounts-DxGHqz0J.js";
import "./github-copilot-token-xlpfBCoP.js";
import "./paths-FkFgsZEv.js";
import { i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, p as isAudioAttachment, t as runAudioTranscription } from "./audio-transcription-runner-AmeMESQg.js";
import "./image-B37E-rXY.js";
import "./chrome-DyCBM2NY.js";
import "./skills-CXi1S0lc.js";
import "./path-alias-guards-BRxZnHEh.js";
import "./redact-CvEiyWiO.js";
import "./errors-C3HswBOt.js";
import "./fs-safe-D0d6G8wj.js";
import "./proxy-env-qCc1rrQd.js";
import "./store-CD7UjLt8.js";
import "./tool-images-CGGEZ7Ye.js";
import "./fetch-guard-Bbu60SdB.js";
import "./api-key-rotation-Cgysa2t_.js";
import "./local-roots-wffCalTl.js";
import "./proxy-fetch-CeRC7OhU.js";
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
