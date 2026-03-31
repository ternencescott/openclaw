import { a as resolveAgentDir, c as resolveAgentWorkspaceDir, l as resolveDefaultAgentId, o as resolveAgentEffectiveModelPrimary } from "./run-with-concurrency-Dz4ZBsiB.js";
import "./paths-DkxwiA8g.js";
import { t as createSubsystemLogger } from "./subsystem-C9Gk4AAH.js";
import "./workspace-N-w3YxwR.js";
import "./logger-CJbXRTpA.js";
import { Mr as DEFAULT_PROVIDER, l as parseModelRef } from "./model-selection-CnF2pQBW.js";
import "./github-copilot-token-8N63GdbE.js";
import "./legacy-names-dyOVyQ4G.js";
import "./thinking-B5u_yx3b.js";
import "./tokens-C27XM9Ox.js";
import { t as runEmbeddedPiAgent } from "./pi-embedded-B0c5DIJ1.js";
import "./plugins-t6YvGWm1.js";
import "./accounts-CUa8Spbo.js";
import "./send-DGH8LETe.js";
import "./send-mmkvBqY3.js";
import "./deliver-CPDvmibD.js";
import "./diagnostic-pTZL3TpG.js";
import "./accounts-zWCE8P9Y.js";
import "./image-ops-CQF9fzFw.js";
import "./send-CgtqdODR.js";
import "./pi-model-discovery-BxZX-xkZ.js";
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
import "./audio-transcription-runner-D2Eu9w1w.js";
import "./fetch-BWiwxzGk.js";
import "./fetch-guard-6vGrKY82.js";
import "./api-key-rotation-M7H1cfcG.js";
import "./proxy-fetch-53_Tkfsi.js";
import "./ir-CakXx_IN.js";
import "./render-7C7EDC8_.js";
import "./target-errors-CFxterdB.js";
import "./commands-registry-DQ3DhrFl.js";
import "./skill-commands-DKNxj22c.js";
import "./fetch-CONQGbzL.js";
import "./channel-activity-BSDg2egV.js";
import "./tables-DjSBT2gK.js";
import "./send-BHk5cM0Y.js";
import "./outbound-attachment-BjOdWu-_.js";
import "./send-C_NZ3Rg0.js";
import "./proxy-BzwL4n0W.js";
import "./manager-Dygq94Ij.js";
import "./query-expansion-CrQZXi2l.js";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
//#region src/hooks/llm-slug-generator.ts
/**
* LLM-based slug generator for session memory filenames
*/
const log = createSubsystemLogger("llm-slug-generator");
/**
* Generate a short 1-2 word filename slug from session content using LLM
*/
async function generateSlugViaLLM(params) {
	let tempSessionFile = null;
	try {
		const agentId = resolveDefaultAgentId(params.cfg);
		const workspaceDir = resolveAgentWorkspaceDir(params.cfg, agentId);
		const agentDir = resolveAgentDir(params.cfg, agentId);
		const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-slug-"));
		tempSessionFile = path.join(tempDir, "session.jsonl");
		const prompt = `Based on this conversation, generate a short 1-2 word filename slug (lowercase, hyphen-separated, no file extension).

Conversation summary:
${params.sessionContent.slice(0, 2e3)}

Reply with ONLY the slug, nothing else. Examples: "vendor-pitch", "api-design", "bug-fix"`;
		const modelRef = resolveAgentEffectiveModelPrimary(params.cfg, agentId);
		const parsed = modelRef ? parseModelRef(modelRef, DEFAULT_PROVIDER) : null;
		const provider = parsed?.provider ?? "anthropic";
		const model = parsed?.model ?? "claude-opus-4-6";
		const result = await runEmbeddedPiAgent({
			sessionId: `slug-generator-${Date.now()}`,
			sessionKey: "temp:slug-generator",
			agentId,
			sessionFile: tempSessionFile,
			workspaceDir,
			agentDir,
			config: params.cfg,
			prompt,
			provider,
			model,
			timeoutMs: 15e3,
			runId: `slug-gen-${Date.now()}`
		});
		if (result.payloads && result.payloads.length > 0) {
			const text = result.payloads[0]?.text;
			if (text) return text.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 30) || null;
		}
		return null;
	} catch (err) {
		const message = err instanceof Error ? err.stack ?? err.message : String(err);
		log.error(`Failed to generate slug: ${message}`);
		return null;
	} finally {
		if (tempSessionFile) try {
			await fs.rm(path.dirname(tempSessionFile), {
				recursive: true,
				force: true
			});
		} catch {}
	}
}
//#endregion
export { generateSlugViaLLM };
