// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title ParticipationNFT
 * @dev An ERC721 token that serves as a non-transferable proof of participation.
 * The owner of the contract can mint NFTs to participants.
 */
contract ParticipationNFT is ERC721, Ownable {
    using Strings for uint256;
    uint256 private _nextTokenId;

    constructor(address initialOwner) ERC721("Taikai Participation NFT", "TaikaiPoP") Ownable(initialOwner) {}

    /**
     * @dev Mints a new participation NFT to a user for a specific hackathon.
     * @param participant The address of the user who will receive the NFT.
     * @param hackathonId The ID of the hackathon they participated in.
     */
    function safeMint(address participant, uint256 hackathonId) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(participant, tokenId);
        // In a real implementation, you would likely store the hackathonId in the NFT's metadata.
    }

    /**
     * @dev Overrides the transfer functions to make the NFTs non-transferable (soulbound).
     * A user cannot transfer their proof of participation to someone else.
     */
    function _transfer(address from, address to, uint256 tokenId) internal override {
        require(from == address(0), "ParticipationNFT: This NFT is non-transferable.");
        super._transfer(from, to, tokenId);
    }

    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`.
     * The metadata would typically be hosted on IPFS.
     */
    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://<your_metadata_folder_cid>/";
    }
}
