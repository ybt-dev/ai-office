import { ethers } from "hardhat";

async function main() {
  const name = "My NFT Collection";
  const symbol = "MNFT";
  const baseURI = "https://api.mynfts.com/metadata/";

  console.log("Deploying NFTCollection...");
  const NFTCollection = await ethers.getContractFactory("NFTCollection");
  const nftCollection = await NFTCollection.deploy(name, symbol, baseURI);

  await nftCollection.waitForDeployment();
  const contractAddress = await nftCollection.getAddress();

  console.log(`NFTCollection deployed to: ${contractAddress}`);
  console.log(`Name: ${name}`);
  console.log(`Symbol: ${symbol}`);
  console.log(`Base URI: ${baseURI}`);

  console.log("Waiting for block confirmations...");
  await nftCollection.deploymentTransaction()?.wait(5);

  console.log("Verifying contract...");
  try {
    await run();
  } catch (error) {
    if ((error as Error).message.includes("Already Verified")) {
      console.log("Contract is already verified!");
    } else {
      console.error("Error verifying contract:", error);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// # For local testing
// npx hardhat run scripts/deploy.ts --network localhost

// # For testnet (e.g., Sepolia)
// npx hardhat run scripts/deploy.ts --network sepolia

// # For mainnet
// npx hardhat run scripts/deploy.ts --network mainnet
