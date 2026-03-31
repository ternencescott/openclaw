import { c as resolveAgentWorkspaceDir, r as listAgentIds } from "../../run-with-concurrency-Dz4ZBsiB.js";
import "../../paths-DkxwiA8g.js";
import { a as defaultRuntime, t as createSubsystemLogger } from "../../subsystem-C9Gk4AAH.js";
import { B as resolveAgentIdFromSessionKey } from "../../workspace-N-w3YxwR.js";
import "../../logger-CJbXRTpA.js";
import "../../model-selection-CnF2pQBW.js";
import "../../github-copilot-token-8N63GdbE.js";
import { a as isGatewayStartupEvent } from "../../legacy-names-dyOVyQ4G.js";
import "../../thinking-B5u_yx3b.js";
import { n as SILENT_REPLY_TOKEN } from "../../tokens-C27XM9Ox.js";
import { o as agentCommand, s as createDefaultDeps } from "../../pi-embedded-B0c5DIJ1.js";
import "../../plugins-t6YvGWm1.js";
import "../../accounts-CUa8Spbo.js";
import "../../send-DGH8LETe.js";
import "../../send-mmkvBqY3.js";
import "../../deliver-CPDvmibD.js";
import "../../diagnostic-pTZL3TpG.js";
import "../../accounts-zWCE8P9Y.js";
import "../../image-ops-CQF9fzFw.js";
import "../../send-CgtqdODR.js";
import "../../pi-model-discovery-BxZX-xkZ.js";
import { Dt as resolveAgentMainSessionKey, W as loadSessionStore, Y as updateSessionStore, kt as resolveMainSessionKey } from "../../pi-embedded-helpers-Dnu6ziSz.js";
import "../../chrome-Dk0qSxjT.js";
import "../../frontmatter-DR8lvaM9.js";
import "../../skills-DqXmSYNj.js";
import "../../path-alias-guards-DGYCiXxw.js";
import "../../redact-Cx40Dm28.js";
import "../../errors-DopTfGpy.js";
import "../../fs-safe-oQRM60Ha.js";
import "../../proxy-env-Dty9BoJd.js";
import "../../store-B_05gKeT.js";
import { s as resolveStorePath } from "../../paths-xqWXix_o.js";
import "../../tool-images-Bv0zOZI-.js";
import "../../image-4egOHKt0.js";
import "../../audio-transcription-runner-D2Eu9w1w.js";
import "../../fetch-BWiwxzGk.js";
import "../../fetch-guard-6vGrKY82.js";
import "../../api-key-rotation-M7H1cfcG.js";
import "../../proxy-fetch-53_Tkfsi.js";
import "../../ir-CakXx_IN.js";
import "../../render-7C7EDC8_.js";
import "../../target-errors-CFxterdB.js";
import "../../commands-registry-DQ3DhrFl.js";
import "../../skill-commands-DKNxj22c.js";
import "../../fetch-CONQGbzL.js";
import "../../channel-activity-BSDg2egV.js";
import "../../tables-DjSBT2gK.js";
import "../../send-BHk5cM0Y.js";
import "../../outbound-attachment-BjOdWu-_.js";
import "../../send-C_NZ3Rg0.js";
import "../../proxy-BzwL4n0W.js";
import "../../manager-Dygq94Ij.js";
import "../../query-expansion-CrQZXi2l.js";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
//#region src/gateway/boot.ts
function generateBootSessionId() {
	return `boot-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-").replace("T", "_").replace("Z", "")}-${crypto.randomUUID().slice(0, 8)}`;
}
const log$1 = createSubsystemLogger("gateway/boot");
const BOOT_FILENAME = "BOOT.md";
function buildBootPrompt(content) {
	return [
		"You are running a boot check. Follow BOOT.md instructions exactly.",
		"",
		"BOOT.md:",
		content,
		"",
		"If BOOT.md asks you to send a message, use the message tool (action=send with channel + target).",
		"Use the `target` field (not `to`) for message tool destinations.",
		`After sending with the message tool, reply with ONLY: ${SILENT_REPLY_TOKEN}.`,
		`If nothing needs attention, reply with ONLY: ${SILENT_REPLY_TOKEN}.`
	].join("\n");
}
async function loadBootFile(workspaceDir) {
	const bootPath = path.join(workspaceDir, BOOT_FILENAME);
	try {
		const trimmed = (await fs.readFile(bootPath, "utf-8")).trim();
		if (!trimmed) return { status: "empty" };
		return {
			status: "ok",
			content: trimmed
		};
	} catch (err) {
		if (err.code === "ENOENT") return { status: "missing" };
		throw err;
	}
}
function snapshotMainSessionMapping(params) {
	const agentId = resolveAgentIdFromSessionKey(params.sessionKey);
	const storePath = resolveStorePath(params.cfg.session?.store, { agentId });
	try {
		const entry = loadSessionStore(storePath, { skipCache: true })[params.sessionKey];
		if (!entry) return {
			storePath,
			sessionKey: params.sessionKey,
			canRestore: true,
			hadEntry: false
		};
		return {
			storePath,
			sessionKey: params.sessionKey,
			canRestore: true,
			hadEntry: true,
			entry: structuredClone(entry)
		};
	} catch (err) {
		log$1.debug("boot: could not snapshot main session mapping", {
			sessionKey: params.sessionKey,
			error: String(err)
		});
		return {
			storePath,
			sessionKey: params.sessionKey,
			canRestore: false,
			hadEntry: false
		};
	}
}
async function restoreMainSessionMapping(snapshot) {
	if (!snapshot.canRestore) return;
	try {
		await updateSessionStore(snapshot.storePath, (store) => {
			if (snapshot.hadEntry && snapshot.entry) {
				store[snapshot.sessionKey] = snapshot.entry;
				return;
			}
			delete store[snapshot.sessionKey];
		}, { activeSessionKey: snapshot.sessionKey });
		return;
	} catch (err) {
		return err instanceof Error ? err.message : String(err);
	}
}
async function runBootOnce(params) {
	const bootRuntime = {
		log: () => {},
		error: (message) => log$1.error(String(message)),
		exit: defaultRuntime.exit
	};
	let result;
	try {
		result = await loadBootFile(params.workspaceDir);
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		log$1.error(`boot: failed to read ${BOOT_FILENAME}: ${message}`);
		return {
			status: "failed",
			reason: message
		};
	}
	if (result.status === "missing" || result.status === "empty") return {
		status: "skipped",
		reason: result.status
	};
	const sessionKey = params.agentId ? resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId: params.agentId
	}) : resolveMainSessionKey(params.cfg);
	const message = buildBootPrompt(result.content ?? "");
	const sessionId = generateBootSessionId();
	const mappingSnapshot = snapshotMainSessionMapping({
		cfg: params.cfg,
		sessionKey
	});
	let agentFailure;
	try {
		await agentCommand({
			message,
			sessionKey,
			sessionId,
			deliver: false,
			senderIsOwner: true
		}, bootRuntime, params.deps);
	} catch (err) {
		agentFailure = err instanceof Error ? err.message : String(err);
		log$1.error(`boot: agent run failed: ${agentFailure}`);
	}
	const mappingRestoreFailure = await restoreMainSessionMapping(mappingSnapshot);
	if (mappingRestoreFailure) log$1.error(`boot: failed to restore main session mapping: ${mappingRestoreFailure}`);
	if (!agentFailure && !mappingRestoreFailure) return { status: "ran" };
	return {
		status: "failed",
		reason: [agentFailure ? `agent run failed: ${agentFailure}` : void 0, mappingRestoreFailure ? `mapping restore failed: ${mappingRestoreFailure}` : void 0].filter((part) => Boolean(part)).join("; ")
	};
}
//#endregion
//#region src/hooks/bundled/boot-md/handler.ts
const log = createSubsystemLogger("hooks/boot-md");
const runBootChecklist = async (event) => {
	if (!isGatewayStartupEvent(event)) return;
	if (!event.context.cfg) return;
	const cfg = event.context.cfg;
	const deps = event.context.deps ?? createDefaultDeps();
	const agentIds = listAgentIds(cfg);
	for (const agentId of agentIds) {
		const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
		const result = await runBootOnce({
			cfg,
			deps,
			workspaceDir,
			agentId
		});
		if (result.status === "failed") {
			log.warn("boot-md failed for agent startup run", {
				agentId,
				workspaceDir,
				reason: result.reason
			});
			continue;
		}
		if (result.status === "skipped") log.debug("boot-md skipped for agent startup run", {
			agentId,
			workspaceDir,
			reason: result.reason
		});
	}
};
//#endregion
export { runBootChecklist as default };
