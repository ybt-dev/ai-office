export const transferTemplate = `You are an AI assistant specialized in processing cryptocurrency transfer requests. Your task is to extract specific information from user messages and format it into a structured JSON response.

First, review the recent messages from the conversation:

<recent_messages>
{{recentMessages}}
</recent_messages>

The supported chain is Base Sepolia testnet.

Your goal is to extract the following information about the requested transfer:
1. Amount to transfer (in ETH, without the coin symbol)
2. Recipient address (must be a valid Ethereum address)

Before providing the final JSON output, show your reasoning process inside <analysis> tags.

After your analysis, provide the final output in a JSON markdown block. The JSON should have this structure:

\`\`\`json
{
    "fromChain": "baseSepolia",
    "amount": string,
    "toAddress": string,
    "data": "0x"
}
\`\`\`

Remember:
- The chain will always be "baseSepolia"
- The amount should be a string representing the number without any currency symbol
- The recipient address must be a valid Ethereum address starting with "0x"
`;

export const bridgeTemplate = `Given the recent messages and wallet information below:

{{recentMessages}}

{{walletInfo}}

Extract the following information about the requested token bridge:
- Token symbol or address to bridge
- Source chain
- Destination chain
- Amount to bridge: Must be a string representing the amount in ether (only number without coin symbol, e.g., "0.1")
- Destination address (if specified)

Respond with a JSON markdown block containing only the extracted values:

\`\`\`json
{
    "token": string | null,
    "fromChain": "ethereum" | "abstract" | "base" | "sepolia" | "bsc" | "arbitrum" | "avalanche" | "polygon" | "optimism" | "cronos" | "gnosis" | "fantom" | "fraxtal" | "klaytn" | "celo" | "moonbeam" | "aurora" | "harmonyOne" | "moonriver" | "arbitrumNova" | "mantle" | "linea" | "scroll" | "filecoin" | "taiko" | "zksync" | "canto" | "alienx" | "gravity" | null,
    "toChain": "ethereum" | "abstract" | "base" | "sepolia" | "bsc" | "arbitrum" | "avalanche" | "polygon" | "optimism" | "cronos" | "gnosis" | "fantom" | "fraxtal" | "klaytn" | "celo" | "moonbeam" | "aurora" | "harmonyOne" | "moonriver" | "arbitrumNova" | "mantle" | "linea" | "scroll" | "filecoin" | "taiko" | "zksync" | "canto" | "alienx" | "gravity" |  null,
    "amount": string | null,
    "toAddress": string | null
}
\`\`\`
`;

export const swapTemplate = `Given the recent messages and wallet information below:

{{recentMessages}}

{{walletInfo}}

Extract the following information about the requested token swap:
- Input token symbol or address (the token being sold)
- Output token symbol or address (the token being bought)
- Amount to swap: Must be a string representing the amount in ether (only number without coin symbol, e.g., "0.1")
- Chain to execute on

Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined:

\`\`\`json
{
    "inputToken": string | null,
    "outputToken": string | null,
    "amount": string | null,
    "chain": "ethereum" | "abstract" | "base" | "sepolia" | "bsc" | "arbitrum" | "avalanche" | "polygon" | "optimism" | "cronos" | "gnosis" | "fantom" | "klaytn" | "celo" | "moonbeam" | "aurora" | "harmonyOne" | "moonriver" | "arbitrumNova" | "mantle" | "linea" | "scroll" | "filecoin" | "taiko" | "zksync" | "canto" | "alienx" | null,
    "slippage": number | null
}
\`\`\`
`;

export const proposeTemplate = `Given the recent messages and wallet information below:

{{recentMessages}}

{{walletInfo}}

Extract the following information about the requested proposal:
- Targets
- Values
- Calldatas
- Description
- Governor address
- Chain to execute on

Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined:

\`\`\`json
{
    "targets": string[] | null,
    "values": string[] | null,
    "calldatas": string[] | null,
    "description": string | null,
    "governor": string | null
    "chain": "ethereum" | "base" | "sepolia" | "bsc" | "arbitrum" | "avalanche" | "polygon" | "optimism" | "cronos" | "gnosis" | "fantom" | "klaytn" | "celo" | "moonbeam" | "aurora" | "harmonyOne" | "moonriver" | "arbitrumNova" | "mantle" | "linea" | "scroll" | "filecoin" | "taiko" | "zksync" | "canto" | null,
}
\`\`\`
`;

export const voteTemplate = `Given the recent messages and wallet information below:

{{recentMessages}}

{{walletInfo}}

Extract the following information about the requested vote:
- Proposal ID
- Support (1 for yes, 2 for no, 3 for abstain)
- Governor address
- Chain to execute on

Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined:

\`\`\`json
{
    "proposalId": string | null,
    "support": number | null,
    "governor": string | null
    "chain": "ethereum" | "base" | "sepolia" | "bsc" | "arbitrum" | "avalanche" | "polygon" | "optimism" | "cronos" | "gnosis" | "fantom" | "klaytn" | "celo" | "moonbeam" | "aurora" | "harmonyOne" | "moonriver" | "arbitrumNova" | "mantle" | "linea" | "scroll" | "filecoin" | "taiko" | "zksync" | "canto" | null,
}
\`\`\`
`;

export const queueProposalTemplate = `Given the recent messages and wallet information below:

{{recentMessages}}

{{walletInfo}}

Extract the following information about the requested proposal:
- Targets
- Values
- Calldatas
- Description
- Governor address
- Chain to execute on

Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined:

\`\`\`json
{
    "targets": string[] | null,
    "values": string[] | null,
    "calldatas": string[] | null,
    "description": string | null,
    "governor": string | null
    "chain": "ethereum" | "base" | "sepolia" | "bsc" | "arbitrum" | "avalanche" | "polygon" | "optimism" | "cronos" | "gnosis" | "fantom" | "klaytn" | "celo" | "moonbeam" | "aurora" | "harmonyOne" | "moonriver" | "arbitrumNova" | "mantle" | "linea" | "scroll" | "filecoin" | "taiko" | "zksync" | "canto" | null,
}
\`\`\`
`;

export const executeProposalTemplate = `Given the recent messages and wallet information below:

{{recentMessages}}

{{walletInfo}}

Extract the following information about the requested proposal:
- Targets
- Values
- Calldatas
- Description
- Governor address
- Chain to execute on

Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined:

\`\`\`json
{
    "targets": string[] | null,
    "values": string[] | null,
    "calldatas": string[] | null,
    "description": string | null,
    "governor": string | null
    "chain": "ethereum" | "base" | "sepolia" | "bsc" | "arbitrum" | "avalanche" | "polygon" | "optimism" | "cronos" | "gnosis" | "fantom" | "klaytn" | "celo" | "moonbeam" | "aurora" | "harmonyOne" | "moonriver" | "arbitrumNova" | "mantle" | "linea" | "scroll" | "filecoin" | "taiko" | "zksync" | "canto" | null,
}
\`\`\`
`;
