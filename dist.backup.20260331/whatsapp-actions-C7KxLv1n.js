import "./paths-BJV7vkaX.js";
import "./globals-BM8hKFm0.js";
import "./utils-DC4zYvW0.js";
import "./agent-scope-Cbp0nOOm.js";
import "./subsystem-C9Xgeyrw.js";
import "./openclaw-root-D1FcrxOp.js";
import "./logger-BKkZU9TX.js";
import "./exec-nuW3NMJe.js";
import "./model-selection-D5oXKIQF.js";
import "./github-copilot-token-BQoM_VEX.js";
import "./boolean-D8Ha5nYV.js";
import "./env-ByppU_6u.js";
import "./host-env-security-CbFV1gAw.js";
import "./registry-DGVIIthr.js";
import "./manifest-registry-BMEqbkWA.js";
import "./message-channel-DMsTX_8C.js";
import "./plugins-t3ljVB7c.js";
import "./path-alias-guards-BxTM8fFt.js";
import "./fs-safe-BFrSJTKP.js";
import "./proxy-env-CgT7MSRs.js";
import "./image-ops-v9o00YrC.js";
import { i as resolveWhatsAppAccount } from "./accounts-WRgl0tJ1.js";
import { f as isWhatsAppGroupJid, p as normalizeWhatsAppTarget } from "./channel-config-helpers-BnsIklFT.js";
import "./tool-images-DSp1Kkra.js";
import "./fetch-guard-ghWYLo8V.js";
import "./local-roots-R12NBqSD.js";
import "./ir-DFYfpa3w.js";
import "./render-DT-umBSz.js";
import { f as readReactionParams, h as readStringParam, i as ToolAuthorizationError, l as jsonResult, n as missingTargetError, o as createActionGate } from "./target-errors-sfYwjd0h.js";
import "./tables-B3H_ZDZF.js";
import { r as sendReactionWhatsApp } from "./outbound-Cph39PJY.js";
//#region src/whatsapp/resolve-outbound-target.ts
function resolveWhatsAppOutboundTarget(params) {
	const trimmed = params.to?.trim() ?? "";
	const allowListRaw = (params.allowFrom ?? []).map((entry) => String(entry).trim()).filter(Boolean);
	const hasWildcard = allowListRaw.includes("*");
	const allowList = allowListRaw.filter((entry) => entry !== "*").map((entry) => normalizeWhatsAppTarget(entry)).filter((entry) => Boolean(entry));
	if (trimmed) {
		const normalizedTo = normalizeWhatsAppTarget(trimmed);
		if (!normalizedTo) return {
			ok: false,
			error: missingTargetError("WhatsApp", "<E.164|group JID>")
		};
		if (isWhatsAppGroupJid(normalizedTo)) return {
			ok: true,
			to: normalizedTo
		};
		if (hasWildcard || allowList.length === 0) return {
			ok: true,
			to: normalizedTo
		};
		if (allowList.includes(normalizedTo)) return {
			ok: true,
			to: normalizedTo
		};
		return {
			ok: false,
			error: missingTargetError("WhatsApp", "<E.164|group JID>")
		};
	}
	return {
		ok: false,
		error: missingTargetError("WhatsApp", "<E.164|group JID>")
	};
}
//#endregion
//#region src/agents/tools/whatsapp-target-auth.ts
function resolveAuthorizedWhatsAppOutboundTarget(params) {
	const account = resolveWhatsAppAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const resolution = resolveWhatsAppOutboundTarget({
		to: params.chatJid,
		allowFrom: account.allowFrom ?? [],
		mode: "implicit"
	});
	if (!resolution.ok) throw new ToolAuthorizationError(`WhatsApp ${params.actionLabel} blocked: chatJid "${params.chatJid}" is not in the configured allowFrom list for account "${account.accountId}".`);
	return {
		to: resolution.to,
		accountId: account.accountId
	};
}
//#endregion
//#region src/agents/tools/whatsapp-actions.ts
async function handleWhatsAppAction(params, cfg) {
	const action = readStringParam(params, "action", { required: true });
	const isActionEnabled = createActionGate(cfg.channels?.whatsapp?.actions);
	if (action === "react") {
		if (!isActionEnabled("reactions")) throw new Error("WhatsApp reactions are disabled.");
		const chatJid = readStringParam(params, "chatJid", { required: true });
		const messageId = readStringParam(params, "messageId", { required: true });
		const { emoji, remove, isEmpty } = readReactionParams(params, { removeErrorMessage: "Emoji is required to remove a WhatsApp reaction." });
		const participant = readStringParam(params, "participant");
		const accountId = readStringParam(params, "accountId");
		const fromMeRaw = params.fromMe;
		const fromMe = typeof fromMeRaw === "boolean" ? fromMeRaw : void 0;
		const resolved = resolveAuthorizedWhatsAppOutboundTarget({
			cfg,
			chatJid,
			accountId,
			actionLabel: "reaction"
		});
		const resolvedEmoji = remove ? "" : emoji;
		await sendReactionWhatsApp(resolved.to, messageId, resolvedEmoji, {
			verbose: false,
			fromMe,
			participant: participant ?? void 0,
			accountId: resolved.accountId
		});
		if (!remove && !isEmpty) return jsonResult({
			ok: true,
			added: emoji
		});
		return jsonResult({
			ok: true,
			removed: true
		});
	}
	throw new Error(`Unsupported WhatsApp action: ${action}`);
}
//#endregion
//#region src/browser/pw-ai-state.ts
let pwAiLoaded = false;
function markPwAiLoaded() {
	pwAiLoaded = true;
}
function isPwAiLoaded() {
	return pwAiLoaded;
}
//#endregion
export { handleWhatsAppAction, markPwAiLoaded as n, isPwAiLoaded as t };
