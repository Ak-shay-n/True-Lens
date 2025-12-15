// SPDX-License-Identifier: MIT
pragma solidity ^0.8.31;

contract ImageRegistry {
    mapping(bytes32 => uint256) private attestations;

    event AttestationStored(
        bytes32 indexed attestationHash,
        uint256 timestamp,
        address indexed submitter
    );

    function storeAttestation(bytes32 attestationHash) external {
        require(attestations[attestationHash] == 0, "Already exists");

        attestations[attestationHash] = block.timestamp;

        emit AttestationStored(
            attestationHash,
            block.timestamp,
            msg.sender
        );
    }

    function exists(bytes32 attestationHash)
        external
        view
        returns (bool)
    {
        return attestations[attestationHash] != 0;
    }

    function getTimestamp(bytes32 attestationHash)
        external
        view
        returns (uint256)
    {
        require(attestations[attestationHash] != 0, "Not found");
        return attestations[attestationHash];
    }
}
