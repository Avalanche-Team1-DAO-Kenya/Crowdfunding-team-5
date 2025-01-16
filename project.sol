// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CrowdFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
        bool fundsClaimed;
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public donationsByAddress;

    uint256 public numberOfCampaigns = 0;

    // Create a new crowdfunding campaign
    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        require(_deadline > block.timestamp, "The deadline must be in the future.");

        Campaign storage campaign = campaigns[numberOfCampaigns];
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;
        campaign.fundsClaimed = false;

        numberOfCampaigns++;
        return numberOfCampaigns - 1;
    }

    // Donate to a specific campaign
    function donateToCampaign(uint256 _id) public payable {
        require(_id < numberOfCampaigns, "Campaign does not exist.");
        Campaign storage campaign = campaigns[_id];
        require(block.timestamp < campaign.deadline, "The campaign has ended.");

        uint256 amount = msg.value;

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);
        campaign.amountCollected += amount;
        donationsByAddress[_id][msg.sender] += amount;
    }

    // Allow donors to claim a refund if the goal is not met
    function claimRefund(uint256 _id) public {
        Campaign storage campaign = campaigns[_id];
        require(block.timestamp > campaign.deadline, "The campaign is still active.");
        require(campaign.amountCollected < campaign.target, "The target was met.");
        require(donationsByAddress[_id][msg.sender] > 0, "No donations to refund.");

        uint256 refundAmount = donationsByAddress[_id][msg.sender];
        donationsByAddress[_id][msg.sender] = 0;

        (bool sent, ) = payable(msg.sender).call{value: refundAmount}("");
        require(sent, "Refund failed.");
    }

    // Allow the campaign owner to withdraw funds if the target is met
    function withdrawFunds(uint256 _id) public {
        Campaign storage campaign = campaigns[_id];
        require(campaign.owner == msg.sender, "Only the campaign owner can withdraw funds.");
        require(block.timestamp > campaign.deadline, "The campaign has not ended yet.");
        require(campaign.amountCollected >= campaign.target, "The target was not met.");
        require(!campaign.fundsClaimed, "Funds already claimed.");

        campaign.fundsClaimed = true;
        (bool sent, ) = payable(campaign.owner).call{value: campaign.amountCollected}("");
        require(sent, "Withdrawal failed.");
    }

    // Get the list of donors and donations for a specific campaign
    function getDonators(uint256 _id) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    // Get all campaigns
    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);
        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }
        return allCampaigns;
    }
}
