import type { Transformer } from "grammy";
import type { TelegramRpcConfig } from "../config/types.telegram.js";
export type RpcTransformerOptions = {
    rpcUrl: string;
    rpcHeaders?: Record<string, string>;
    rpcTimeout?: number;
    excludeMethods?: string[];
    onError?: (method: string, error: Error) => void;
};
/**
 * Creates a grammY transformer that forwards all bot.api.* calls to an external RPC endpoint.
 * This allows relay servers to handle Telegram API calls instead of the bot calling Telegram directly.
 *
 * For "fire-and-forget" methods (sendMessage, etc.), network errors are logged but not thrown,
 * preventing the RPC loop from being interrupted by transient Telegram API failures.
 */
export declare function createRpcTransformer(opts: RpcTransformerOptions): Transformer;
/**
 * Check if RPC mode is enabled based on config.
 */
export declare function isRpcEnabled(rpc?: TelegramRpcConfig): boolean;
