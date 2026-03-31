import { p as theme } from "./globals-Bv4ZcVWM.js";
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
import "./message-channel-Be-gqLbb.js";
import "./tailnet-00rx0H2v.js";
import "./ws-lgJJfM9Q.js";
import "./credentials-DiatshlT.js";
import "./resolve-configured-secret-input-string-BQCPKZxv.js";
import "./call-XXMjkaQj.js";
import "./pairing-token-DSWSMr10.js";
import "./runtime-config-collectors-CvPeIBWe.js";
import "./command-secret-targets-BE9nonvF.js";
import { t as formatDocsLink } from "./links-BvlkOkWs.js";
import { n as registerQrCli } from "./qr-cli-Cu-bbSLv.js";
//#region src/cli/clawbot-cli.ts
function registerClawbotCli(program) {
	registerQrCli(program.command("clawbot").description("Legacy clawbot command aliases").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/clawbot", "docs.openclaw.ai/cli/clawbot")}\n`));
}
//#endregion
export { registerClawbotCli };
