import { a as logVerbose, c as shouldLogVerbose } from "./globals-Bv4ZcVWM.js";
import "./paths-BfR2LXbA.js";
import "./subsystem-Cf9yS0UI.js";
import "./boolean-DTgd5CzD.js";
import "./auth-profiles-mTj_3EiL.js";
import "./agent-scope-DF-nzI8H.js";
import "./utils-C5WN6czr.js";
import "./openclaw-root-DFJGXT24.js";
import "./logger-DUUyiuLB.js";
import "./exec-ByKs6PmP.js";
import "./github-copilot-token-CcBrBN3h.js";
import "./host-env-security-blJbxyQo.js";
import "./version-Bxx5bg6l.js";
import "./registry-DoLLbW4m.js";
import "./manifest-registry-Ba187z7Z.js";
import "./dock-CtpWzQ0n.js";
import "./plugins-BkoiCBu-.js";
import "./accounts-LPEl32gb.js";
import "./channel-config-helpers-BDId9EPL.js";
import "./accounts-_PYzdhne.js";
import "./image-ops-CQrO7d64.js";
import "./message-channel-Be-gqLbb.js";
import "./pi-embedded-helpers-CMEderlr.js";
import "./sandbox-Dd2Cr63Z.js";
import "./tool-catalog-CFg6jrp9.js";
import "./chrome-DWEykn-s.js";
import "./tailscale-Bxls2k-9.js";
import "./tailnet-00rx0H2v.js";
import "./ws-lgJJfM9Q.js";
import "./auth-IGdehW-m.js";
import "./credentials-DiatshlT.js";
import "./resolve-configured-secret-input-string-BQCPKZxv.js";
import "./server-context-DzPMAe_K.js";
import "./frontmatter-CDYnjLEC.js";
import "./env-overrides-BeDt30xz.js";
import "./path-alias-guards-D_v2YTP8.js";
import "./skills-B3eXdmA5.js";
import "./paths-DBHbY8ck.js";
import "./redact-SKlSb-Ph.js";
import "./errors-Duls987w.js";
import "./fs-safe-n_u5Hqlt.js";
import "./proxy-env-CQcXW_eY.js";
import "./store-kjkrRAMQ.js";
import "./ports-DOBLq-G-.js";
import "./trash-CsUKAlUm.js";
import "./server-middleware-D36oNYKH.js";
import "./sessions-BqrgkUq8.js";
import "./paths-BCX3TKIK.js";
import "./chat-envelope-B0leI413.js";
import "./tool-images-BnvE1YX0.js";
import "./thinking-DykY2Fzj.js";
import "./models-config-CQ5ytykT.js";
import "./model-catalog-BrnDjT5b.js";
import "./fetch-aEprHAvD.js";
import { i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, t as runAudioTranscription, y as isAudioAttachment } from "./audio-transcription-runner-xUVq32Gp.js";
import "./fetch-guard-DlpOQOcG.js";
import "./image-DCicTb0Y.js";
import "./tool-display-B1jaCPlW.js";
import "./api-key-rotation-CEbP83ZE.js";
import "./proxy-fetch-4FkZfomC.js";
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
