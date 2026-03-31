import "./globals-Bv4ZcVWM.js";
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
import "./message-channel-Be-gqLbb.js";
import "./tailscale-Bxls2k-9.js";
import "./tailnet-00rx0H2v.js";
import "./ws-lgJJfM9Q.js";
import "./auth-IGdehW-m.js";
import "./credentials-DiatshlT.js";
import "./sessions-BqrgkUq8.js";
import "./paths-BCX3TKIK.js";
import "./chat-envelope-B0leI413.js";
import "./call-XXMjkaQj.js";
import "./pairing-token-DSWSMr10.js";
import "./onboard-helpers-BZvS4-ob.js";
import "./prompt-style-Bcr283QM.js";
import "./note-DITQCNUf.js";
import "./daemon-install-plan.shared-D06v-8EB.js";
import "./runtime-guard-CGqgXWWP.js";
import { n as buildGatewayInstallPlan, r as gatewayInstallErrorHint, t as resolveGatewayInstallToken } from "./gateway-install-token-DyPwwfp8.js";
import { r as isGatewayDaemonRuntime } from "./daemon-runtime-BSeNz-AR.js";
import { i as isSystemdUserServiceAvailable } from "./systemd-YuA-rlM2.js";
import { t as resolveGatewayService } from "./service-D4k98v0P.js";
import { n as ensureSystemdUserLingerNonInteractive } from "./systemd-linger-HYaYXryo.js";
//#region src/commands/onboard-non-interactive/local/daemon-install.ts
async function installGatewayDaemonNonInteractive(params) {
	const { opts, runtime, port } = params;
	if (!opts.installDaemon) return;
	const daemonRuntimeRaw = opts.daemonRuntime ?? "node";
	const systemdAvailable = process.platform === "linux" ? await isSystemdUserServiceAvailable() : true;
	if (process.platform === "linux" && !systemdAvailable) {
		runtime.log("Systemd user services are unavailable; skipping service install.");
		return;
	}
	if (!isGatewayDaemonRuntime(daemonRuntimeRaw)) {
		runtime.error("Invalid --daemon-runtime (use node or bun)");
		runtime.exit(1);
		return;
	}
	const service = resolveGatewayService();
	const tokenResolution = await resolveGatewayInstallToken({
		config: params.nextConfig,
		env: process.env
	});
	for (const warning of tokenResolution.warnings) runtime.log(warning);
	if (tokenResolution.unavailableReason) {
		runtime.error([
			"Gateway install blocked:",
			tokenResolution.unavailableReason,
			"Fix gateway auth config/token input and rerun onboarding."
		].join(" "));
		runtime.exit(1);
		return;
	}
	const { programArguments, workingDirectory, environment } = await buildGatewayInstallPlan({
		env: process.env,
		port,
		runtime: daemonRuntimeRaw,
		warn: (message) => runtime.log(message),
		config: params.nextConfig
	});
	try {
		await service.install({
			env: process.env,
			stdout: process.stdout,
			programArguments,
			workingDirectory,
			environment
		});
	} catch (err) {
		runtime.error(`Gateway service install failed: ${String(err)}`);
		runtime.log(gatewayInstallErrorHint());
		return;
	}
	await ensureSystemdUserLingerNonInteractive({ runtime });
}
//#endregion
export { installGatewayDaemonNonInteractive };
