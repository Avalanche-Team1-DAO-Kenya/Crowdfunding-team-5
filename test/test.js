const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrowdFunding", function () {
  it("Should create a campaign and allow donations", async function () {
    const [owner, donor1, donor2] = await ethers.getSigners();

    const CrowdFunding = await ethers.getContractFactory("CrowdFunding");
    const crowdFunding = await CrowdFunding.deploy();
    await crowdFunding.deployed();

    const deadline = Math.floor(Date.now() / 1000) + 86400; // 24 hours from now
    const tx = await crowdFunding.createCampaign(
      owner.address,
      "Test Campaign",
      "This is a test campaign.",
      ethers.utils.parseEther("10"), // Target: 10 ETH
      deadline,
      "test_image"
    );
    await tx.wait();

    await crowdFunding.connect(donor1).donateToCampaign(0, { value: ethers.utils.parseEther("1") });
    await crowdFunding.connect(donor2).donateToCampaign(0, { value: ethers.utils.parseEther("2") });

    const [donators, donations] = await crowdFunding.getDonators(0);
    expect(donators.length).to.equal(2);
    expect(donations[0]).to.equal(ethers.utils.parseEther("1"));
    expect(donations[1]).to.equal(ethers.utils.parseEther("2"));
  });
});
