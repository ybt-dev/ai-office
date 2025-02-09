import { createRequire } from "node:module";
import { dirname } from "node:path";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const solc = require("solc");

// Load OpenZeppelin contract source code
export function loadOpenZeppelinFile(contractPath) {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const fullPath = path.resolve(
    currentDir,
    "../../../",
    "node_modules",
    contractPath
  );
  const contents = fs.readFileSync(fullPath, "utf8");
  console.log("loadOpenZeppelinFile returns:", contents);
  return contents;
}

// Update the import resolver to use async/await pattern
// Returns: { contents: string } | { error: string }
export async function importResolver(importPath) {
  if (importPath.startsWith("@openzeppelin/")) {
    const contents = await loadOpenZeppelinFile(importPath);
    const result = { contents };
    console.log("importResolver returns:", result);
    return result;
  }
  const result = { error: "File not found" };
  console.log("importResolver returns:", result);
  return result;
}

// Update compile function to be async
// Returns: {
//   abi: any[], // Contract ABI
//   bytecode: string, // Contract bytecode
//   metadata: any // Contract metadata
// }
export async function compileWithImports(
  contractName: string,
  sourceCode: string
) {
  try {
    const input = {
      language: "Solidity",
      sources: {
        [`${contractName}.sol`]: {
          content: sourceCode,
        },
      },
      settings: {
        outputSelection: {
          "*": {
            "*": ["*"],
          },
        },
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    if (output.errors) {
      for (const err of output.errors) {
        console.error(err);
      }
    }
    const contractFile =
      output.contracts[`${contractName}.sol`][`${contractName}`];

    const metadata = JSON.parse(contractFile.metadata);
    const result = {
      abi: contractFile.abi,
      bytecode: contractFile.evm.bytecode.object,
      metadata,
    };
    console.log("compileWithImports returns:", result);
    return result;
  } catch (error) {
    console.error("Error compiling contract:", error);
    throw error;
  }
}
