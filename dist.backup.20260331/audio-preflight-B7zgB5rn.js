import "./run-with-concurrency-Dz4ZBsiB.js";
import "./paths-DkxwiA8g.js";
import { d as logVerbose, m as shouldLogVerbose } from "./subsystem-C9Gk4AAH.js";
import "./workspace-N-w3YxwR.js";
import "./logger-CJbXRTpA.js";
import "./model-selection-CnF2pQBW.js";
import "./github-copilot-token-8N63GdbE.js";
import "./legacy-names-dyOVyQ4G.js";
import "./thinking-B5u_yx3b.js";
import "./plugins-t6YvGWm1.js";
import "./accounts-CUa8Spbo.js";
import "./accounts-zWCE8P9Y.js";
import "./image-ops-CQF9fzFw.js";
import "./pi-embedded-helpers-Dnu6ziSz.js";
import "./chrome-Dk0qSxjT.js";
import "./frontmatter-DR8lvaM9.js";
import "./skills-DqXmSYNj.js";
import "./path-alias-guards-DGYCiXxw.js";
import "./redact-Cx40Dm28.js";
import "./errors-DopTfGpy.js";
import "./fs-safe-oQRM60Ha.js";
import "./proxy-env-Dty9BoJd.js";
import "./store-B_05gKeT.js";
import "./paths-xqWXix_o.js";
import "./tool-images-Bv0zOZI-.js";
import "./image-4egOHKt0.js";
import { i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, t as runAudioTranscription, v as isAudioAttachment } from "./audio-transcription-runner-D2Eu9w1w.js";
import "./fetch-BWiwxzGk.js";
import "./fetch-guard-6vGrKY82.js";
import "./api-key-rotation-M7H1cfcG.js";
import "./proxy-fetch-53_Tkfsi.js";
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
