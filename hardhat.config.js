/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {}, // Local development
    avalanche: {
      url: process.env.RPC_URL, // Fuji testnet RPC URL
      chainId: 43113, // Fuji chain ID
      accounts: [process.env.PRIVATE_KEY], // Wallet private key
    },
  },
};
