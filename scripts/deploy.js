require('dotenv').config();
const hre = require("hardhat");

async function main() {
  const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding");
  const CrowdFund = await Project.deploy();

  await CrowdFunding.deployed();
  console.log("Contract deployed to:", CrowdFunding.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
