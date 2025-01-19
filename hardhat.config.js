require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

// Check for required environment variables
if (!process.env.PRIVATE_KEY || !process.env.RPC_URL) {
  throw new Error("Missing PRIVATE_KEY or RPC_URL in .env file");
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    hardhat: {}, // Local Hardhat development network
    avalanche: {
      url: process.env.RPC_URL, // Fuji testnet RPC URL
      chainId: 43113, // Fuji chain ID
      accounts: [process.env.PRIVATE_KEY], // Wallet private key
    },
  },
};
