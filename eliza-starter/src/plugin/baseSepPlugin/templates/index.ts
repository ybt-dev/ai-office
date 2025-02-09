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

export const createCollectionTemplate = `Given the recent messages and wallet information below:

{{recentMessages}}

{{walletInfo}}

Extract the following information about the requested transfer:
- chainName to execute on: Must be one of ["ethereum", "base", ...] (like in viem/chains)

Respond with a JSON markdown block containing only the extracted values. All fields are required:

\`\`\`json
{
    "chainName": SUPPORTED_CHAINS,
}
\`\`\`

Note: Ensure to use the user’s latest instruction to extract data; if it is not within the defined options, use null.

`;

export const collectionImageTemplate = `
Generate a logo with the text "{{collectionName}}", using orange as the main color, with a sci-fi and mysterious background theme
`;

export const mintNFTTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.
Respond with a JSON markdown block containing only the extracted values. All fields are required:
\`\`\`json
{
    "collectionAddress": "D8j4ubQ3MKwmAqiJw83qT7KQNKjhsuoC7zJJdJa5BkvS",
    "chainName": SUPPORTED_CHAINS,
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested mint nft:
- collection contract address


Note: Ensure to use the user’s latest instruction to extract data; if it is not within the defined options, use null.`;
