import { Plugin } from "@elizaos/core";
import { TokenPriceProvider } from "../providers/index.ts";
import { TokenPriceEvaluator } from "../evaluators/index.ts";
import { TokenPriceAction } from "../action/index.ts";


export const dexScreenerPlugin: Plugin = {
    name: "dexscreener",
    description: "Dex Screener Plugin with Token Price Action",
    actions: [
        new TokenPriceAction()
    ],
    evaluators: [ new TokenPriceEvaluator() ],
    providers: [ new TokenPriceProvider() ]
};

export default dexScreenerPlugin;
