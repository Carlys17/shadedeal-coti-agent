// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title ShadeDeal Deal Registry
/// @notice Public settlement shell for private AI-agent negotiations. Sensitive terms stay in COTI encrypted messages.
contract DealRegistry {
    enum Status { Proposed, Accepted, Settled, Cancelled }

    struct Deal {
        address buyer;
        address seller;
        bytes32 termsHash;
        string messageThreadId;
        Status status;
        uint256 createdAt;
        uint256 updatedAt;
    }

    uint256 public nextDealId = 1;
    mapping(uint256 => Deal) public deals;

    event DealProposed(uint256 indexed dealId, address indexed buyer, address indexed seller, bytes32 termsHash, string messageThreadId);
    event DealAccepted(uint256 indexed dealId, address indexed seller);
    event DealSettled(uint256 indexed dealId, address indexed buyer, address indexed seller);
    event DealCancelled(uint256 indexed dealId, address indexed caller);

    error NotBuyer();
    error NotSeller();
    error NotParticipant();
    error BadStatus(Status expected, Status actual);
    error InvalidCounterparty();

    function proposeDeal(address seller, bytes32 termsHash, string calldata messageThreadId) external returns (uint256 dealId) {
        if (seller == address(0) || seller == msg.sender) revert InvalidCounterparty();
        dealId = nextDealId++;
        deals[dealId] = Deal({
            buyer: msg.sender,
            seller: seller,
            termsHash: termsHash,
            messageThreadId: messageThreadId,
            status: Status.Proposed,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });
        emit DealProposed(dealId, msg.sender, seller, termsHash, messageThreadId);
    }

    function acceptDeal(uint256 dealId) external {
        Deal storage d = deals[dealId];
        if (msg.sender != d.seller) revert NotSeller();
        if (d.status != Status.Proposed) revert BadStatus(Status.Proposed, d.status);
        d.status = Status.Accepted;
        d.updatedAt = block.timestamp;
        emit DealAccepted(dealId, msg.sender);
    }

    function settleDeal(uint256 dealId) external {
        Deal storage d = deals[dealId];
        if (msg.sender != d.buyer) revert NotBuyer();
        if (d.status != Status.Accepted) revert BadStatus(Status.Accepted, d.status);
        d.status = Status.Settled;
        d.updatedAt = block.timestamp;
        emit DealSettled(dealId, d.buyer, d.seller);
    }

    function cancelDeal(uint256 dealId) external {
        Deal storage d = deals[dealId];
        if (msg.sender != d.buyer && msg.sender != d.seller) revert NotParticipant();
        if (d.status == Status.Settled) revert BadStatus(Status.Proposed, d.status);
        d.status = Status.Cancelled;
        d.updatedAt = block.timestamp;
        emit DealCancelled(dealId, msg.sender);
    }
}
