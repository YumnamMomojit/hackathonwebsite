// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TaikaiToken
 * @dev A simple ERC20 token for rewards on the platform.
 * The owner of the contract can mint new tokens.
 */
contract TaikaiToken is ERC20, Ownable {
    constructor(address initialOwner) ERC20("Taikai Token", "TAI") Ownable(initialOwner) {
        // Optionally mint some initial tokens to the deployer
        _mint(msg.sender, 1000000 * (10 ** decimals()));
    }

    /**
     * @dev Creates `amount` new tokens for `to`.
     * See {ERC20-_mint}.
     *
     * Requirements:
     *
     * - the caller must be the owner.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
