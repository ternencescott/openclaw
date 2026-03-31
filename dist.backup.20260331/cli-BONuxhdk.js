import "./paths-BJV7vkaX.js";
import "./globals-BM8hKFm0.js";
import "./utils-DC4zYvW0.js";
import "./thinking-BYwvlJ3S.js";
import { _t as loadOpenClawPlugins } from "./reply-BcfVto6Y.js";
import { d as resolveDefaultAgentId, u as resolveAgentWorkspaceDir } from "./agent-scope-Cbp0nOOm.js";
import { t as createSubsystemLogger } from "./subsystem-C9Xgeyrw.js";
import "./openclaw-root-D1FcrxOp.js";
import "./logger-BKkZU9TX.js";
import "./exec-nuW3NMJe.js";
import { rn as loadConfig } from "./model-selection-D5oXKIQF.js";
import "./github-copilot-token-BQoM_VEX.js";
import "./boolean-D8Ha5nYV.js";
import "./env-ByppU_6u.js";
import "./host-env-security-CbFV1gAw.js";
import "./registry-DGVIIthr.js";
import "./manifest-registry-BMEqbkWA.js";
import "./dock-CeHYT_BX.js";
import "./message-channel-DMsTX_8C.js";
import "./send-DuO441jT.js";
import "./plugins-t3ljVB7c.js";
import "./sessions-CKeAXJPm.js";
import "./audio-transcription-runner-P6LCycZB.js";
import "./image-Bu-acOtU.js";
import "./models-config-CJ-JZF5q.js";
import "./pi-embedded-helpers-Cqx5RWFg.js";
import "./sandbox-D_b6eE7U.js";
import "./tool-catalog-DE9Q8xiB.js";
import "./chrome-CZGDIgkv.js";
import "./tailscale-DrDx-3cv.js";
import "./tailnet-zdcfrPFi.js";
import "./ws-BScb-W8k.js";
import "./auth-NyzmHpCz.js";
import "./credentials-DLFMFSug.js";
import "./resolve-configured-secret-input-string-1uhDrMYD.js";
import "./server-context-Drh64o4I.js";
import "./frontmatter-BvLOP38b.js";
import "./env-overrides-Cam0mPAe.js";
import "./path-alias-guards-BxTM8fFt.js";
import "./skills-C5yXLr4m.js";
import "./paths-TP02AE1K.js";
import "./redact-XVjLULTG.js";
import "./errors-Dl9nRyXH.js";
import "./fs-safe-BFrSJTKP.js";
import "./proxy-env-CgT7MSRs.js";
import "./image-ops-v9o00YrC.js";
import "./store-CCWPL_3R.js";
import "./ports-CZeJLe7P.js";
import "./trash-R64jHFGe.js";
import "./server-middleware-B-G2Ftj9.js";
import "./accounts-WRgl0tJ1.js";
import "./channel-config-helpers-BnsIklFT.js";
import "./accounts-BtlgULZC.js";
import "./send-DjARfR0d.js";
import "./paths-BWOXmNIW.js";
import "./chat-envelope-BkySjpPY.js";
import "./tool-images-DSp1Kkra.js";
import "./tool-display-ILkHoY2-.js";
import "./fetch-guard-ghWYLo8V.js";
import "./api-key-rotation-Cidci4b9.js";
import "./local-roots-R12NBqSD.js";
import "./model-catalog-Bk_Isxb-.js";
import "./proxy-fetch-DuABaQ_5.js";
import "./tokens-CJBrcSAT.js";
import "./deliver-Bn1Se2Fx.js";
import "./commands-C1X8NLQZ.js";
import "./commands-registry-DSn3ZhgG.js";
import "./call-DrgnaubX.js";
import "./pairing-token-CVcXi_hV.js";
import "./with-timeout-D-W3AKyc.js";
import "./diagnostic-C987m6M5.js";
import "./send-DhpDxhdS.js";
import "./pi-model-discovery-CpWAjscW.js";
import "./exec-approvals-allowlist-BQVCRQzr.js";
import "./exec-safe-bin-runtime-policy-DyCYAo9H.js";
import "./ir-DFYfpa3w.js";
import "./render-DT-umBSz.js";
import "./target-errors-sfYwjd0h.js";
import "./channel-selection-BPBwgRwR.js";
import "./plugin-auto-enable-CiL7ZZJr.js";
import "./send-DmHgfJZ8.js";
import "./outbound-attachment-NVL-8caq.js";
import "./fetch-v-XU4dvd.js";
import "./delivery-queue-B7XZzp05.js";
import "./send-qJrIs8kx.js";
import "./pairing-store-CndzxHPD.js";
import "./read-only-account-inspect-B0dLsD47.js";
import "./channel-activity-CJY8LQxd.js";
import "./tables-B3H_ZDZF.js";
import "./proxy-Dgknuv4E.js";
import "./timeouts-CC8HwQOZ.js";
import "./skill-commands-BkCSHHj2.js";
import "./workspace-dirs-BqeXQGT4.js";
import "./restart-BzjDMmkD.js";
import "./runtime-config-collectors-BfXUkl5t.js";
import "./command-secret-targets-Cg-fYSaJ.js";
import "./session-cost-usage-CkCo2kVx.js";
import "./connection-auth-DbI_Rn7H.js";
import "./onboard-helpers-Vb5HpP-H.js";
import "./prompt-style-D8LvsnSX.js";
import "./pairing-labels-CAsolhjV.js";
import "./memory-cli-BLJzJ-Pz.js";
import "./manager-B62fhZjP.js";
import "./query-expansion-CjS-pLDf.js";
import "./links-CoNMV1eb.js";
import "./cli-utils-CVpegkfr.js";
import "./help-format-FDT8xd4M.js";
import "./progress-BZWDJTlm.js";
import "./exec-approvals-1t-rSzbk.js";
import "./nodes-screen-BMNs-Tz0.js";
import "./system-run-command-DrcRbjnm.js";
import "./server-lifecycle-vMt68Zt_.js";
import "./stagger-DTvG3eqM.js";
//#region src/plugins/cli.ts
const log = createSubsystemLogger("plugins");
function registerPluginCliCommands(program, cfg) {
	const config = cfg ?? loadConfig();
	const workspaceDir = resolveAgentWorkspaceDir(config, resolveDefaultAgentId(config));
	const logger = {
		info: (msg) => log.info(msg),
		warn: (msg) => log.warn(msg),
		error: (msg) => log.error(msg),
		debug: (msg) => log.debug(msg)
	};
	const registry = loadOpenClawPlugins({
		config,
		workspaceDir,
		logger
	});
	const existingCommands = new Set(program.commands.map((cmd) => cmd.name()));
	for (const entry of registry.cliRegistrars) {
		if (entry.commands.length > 0) {
			const overlaps = entry.commands.filter((command) => existingCommands.has(command));
			if (overlaps.length > 0) {
				log.debug(`plugin CLI register skipped (${entry.pluginId}): command already registered (${overlaps.join(", ")})`);
				continue;
			}
		}
		try {
			const result = entry.register({
				program,
				config,
				workspaceDir,
				logger
			});
			if (result && typeof result.then === "function") result.catch((err) => {
				log.warn(`plugin CLI register failed (${entry.pluginId}): ${String(err)}`);
			});
			for (const command of entry.commands) existingCommands.add(command);
		} catch (err) {
			log.warn(`plugin CLI register failed (${entry.pluginId}): ${String(err)}`);
		}
	}
}
//#endregion
export { registerPluginCliCommands };
