import { encodeAbiParameters } from "viem";
import { compileWithImports } from "./generateERC721ContractCode.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

// Load the Solidity contract content
function loadContractSource() {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const contractPath = path.resolve(currentDir, "../contract/CustomERC721.sol");
  return fs.readFileSync(contractPath, "utf8");
}

const CustomERC721 = loadContractSource();

// 动态生成 ERC-721 合约代码
export function generateERC721ContractCode(NFTContractName) {
  return CustomERC721.replace("NFTContractName", NFTContractName);
}

// 使用 Solidity 编译器生成 ABI 和 Bytecode
export async function compileContract(contractName, sourceCode) {
  const res = await compileWithImports(contractName, sourceCode);
  const { abi, bytecode, metadata } = res;
  return { abi, bytecode, metadata };
}

// 部署合约
export async function deployContract({
  walletClient,
  publicClient,
  abi,
  bytecode,
  args,
}) {
  console.log("Deploying contract...");

  const txHash = await walletClient.deployContract({
    abi,
    bytecode,
    args,
  });

  console.log(`Deployment transaction hash: ${txHash}`);
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
  console.log(`Contract deployed at address: ${receipt.contractAddress}`);
  return receipt.contractAddress;
}

// 调用 mint 方法

export async function mintNFT({
  walletClient,
  publicClient,
  contractAddress,
  abi,
  recipient,
}: {
  contractAddress: string;
  abi: any;
  recipient: any;
  walletClient: any;
  publicClient: any;
}) {
  console.log("Minting NFT...");
  const txHash = await walletClient.writeContract({
    address: contractAddress,
    abi: abi,
    functionName: "mint",
    args: [recipient],
  });

  console.log(`Mint transaction hash: ${txHash}`);
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
  console.log("Mint successful!");
  return receipt;
}

// 编码构造函数参数
export function encodeConstructorArguments(abi, args) {
  const argsData = encodeAbiParameters(abi[0].inputs, args);

  return argsData.slice(2);
}
