import { expect } from "chai";
import { ethers } from "hardhat";
import { NFTCollection } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("NFTCollection", function () {
  let nftCollection: NFTCollection;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  const NAME = "My NFT Collection";
  const SYMBOL = "MNFT";
  const BASE_URI = "https://api.mynft.com/tokens/";
  const TOKEN_URI = "1.json";

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const NFTCollection = await ethers.getContractFactory("NFTCollection");
    nftCollection = await NFTCollection.deploy(NAME, SYMBOL, BASE_URI);
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await nftCollection.name()).to.equal(NAME);
      expect(await nftCollection.symbol()).to.equal(SYMBOL);
    });

    it("Should set the correct owner", async function () {
      expect(await nftCollection.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint NFTs", async function () {
      await expect(
        nftCollection.mint(
          addr1.address,
          TOKEN_URI,
          "Cool NFT",
          "ipfs://image-hash"
        )
      )
        .to.emit(nftCollection, "Transfer")
        .withArgs(ethers.ZeroAddress, addr1.address, 0)
        .to.emit(nftCollection, "ItemCreated")
        .withArgs(0, "Cool NFT");

      expect(await nftCollection.ownerOf(0)).to.equal(addr1.address);
      expect(await nftCollection.tokenURI(0)).to.equal(BASE_URI + TOKEN_URI);
    });

    it("Should increment token IDs correctly", async function () {
      await nftCollection.mint(
        addr1.address,
        "1.json",
        "First NFT",
        "ipfs://image1"
      );
      await nftCollection.mint(
        addr2.address,
        "2.json",
        "Second NFT",
        "ipfs://image2"
      );

      expect(await nftCollection.ownerOf(0)).to.equal(addr1.address);
      expect(await nftCollection.ownerOf(1)).to.equal(addr2.address);
    });

    it("Should revert when non-owner tries to mint", async function () {
      await expect(
        nftCollection
          .connect(addr1)
          .mint(addr2.address, TOKEN_URI, "Cool NFT", "ipfs://image-hash")
      ).to.be.revertedWithCustomError(
        nftCollection,
        "OwnableUnauthorizedAccount"
      );
    });
  });

  describe("Base URI", function () {
    it("Should allow owner to set base URI", async function () {
      const newBaseURI = "https://new.api.mynft.com/tokens/";
      await nftCollection.setBaseURI(newBaseURI);

      // Mint a token and check its URI
      await nftCollection.mint(
        addr1.address,
        TOKEN_URI,
        "Cool NFT",
        "ipfs://image-hash"
      );
      expect(await nftCollection.tokenURI(0)).to.equal(newBaseURI + TOKEN_URI);
    });

    it("Should revert when non-owner tries to set base URI", async function () {
      await expect(
        nftCollection.connect(addr1).setBaseURI(BASE_URI)
      ).to.be.revertedWithCustomError(
        nftCollection,
        "OwnableUnauthorizedAccount"
      );
    });
  });

  describe("NFT Attributes", function () {
    it("Should create NFT with attributes", async function () {
      const nftData = {
        name: "Cool NFT",
        image: "ipfs://image-hash",
      };

      await nftCollection.mint(
        addr1.address,
        TOKEN_URI,
        nftData.name,
        nftData.image
      );

      const item = await nftCollection.getItem(0);
      expect(item.name).to.equal(nftData.name);
      expect(item.image).to.equal(nftData.image);
    });
  });
});
