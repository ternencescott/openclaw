import type { OpenClawConfig } from "../config/config.js";
import type { RuntimeEnv } from "../runtime.js";
export declare function startTelegramWebhook(opts: {
    token: string;
    accountId?: string;
    config?: OpenClawConfig;
    path?: string;
    port?: number;
    host?: string;
    secret?: string;
    runtime?: RuntimeEnv;
    fetch?: typeof fetch;
    abortSignal?: AbortSignal;
    healthPath?: string;
    publicUrl?: string;
    webhookCertPath?: string;
    /**
     * Skip calling setWebhook on Telegram API.
     * Used in RPC mode where the relay-server manages the webhook registration,
     * and the container only needs to listen for forwarded updates.
     */
    skipSetWebhook?: boolean;
}): Promise<{
    server: import("node:http").Server<typeof import("node:http").IncomingMessage, typeof import("node:http").ServerResponse>;
    bot: import("grammy").Bot<import("grammy").Context, import("grammy").Api<import("grammy").RawApi>>;
    stop: () => void;
}>;
