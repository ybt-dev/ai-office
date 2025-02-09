// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTCollection is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    string private _baseTokenURI;

    struct NFTItem {
        string name;
        string image;
    }

    mapping(uint256 => NFTItem) private _tokenItems;

    event ItemCreated(uint256 indexed tokenId, string name);

    constructor(
        string memory name,
        string memory symbol,
        string memory baseTokenURI
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _baseTokenURI = baseTokenURI;
    }

    function mint(
        address to,
        string memory tokenURI,
        string memory name,
        string memory image
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        _tokenItems[tokenId] = NFTItem({name: name, image: image});

        emit ItemCreated(tokenId, name);
        return tokenId;
    }

    function getItem(uint256 tokenId) public view returns (NFTItem memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _tokenItems[tokenId];
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseTokenURI) public onlyOwner {
        _baseTokenURI = baseTokenURI;
    }
}
