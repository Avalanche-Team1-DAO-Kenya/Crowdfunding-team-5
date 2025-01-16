const ethers = window.ethers;

// Contract details
const CONTRACT_ADDRESS = "0xE95223E93E8682a3cd1b749aD0bEf67DF192eA72";
const CONTRACT_ABI = [
  // Add your contract's ABI here
];

let provider, signer, contract;

// Connect Core Wallet
document.getElementById("connectWallet").addEventListener("click", async () => {
  if (!window.ethereum) {
    alert("Please install Core Wallet to connect.");
    return;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    const address = await signer.getAddress();
    document.getElementById("walletAddress").textContent = `Connected Wallet: ${address}`;
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  } catch (error) {
    console.error("Wallet connection failed:", error);
  }
});

// Create a Campaign
document.getElementById("createCampaignForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const target = ethers.utils.parseEther(document.getElementById("target").value);
  const deadline = Math.floor(new Date(document.getElementById("deadline").value).getTime() / 1000);
  const image = document.getElementById("image").value;

  try {
    const tx = await contract.createCampaign(await signer.getAddress(), title, description, target, deadline, image);
    await tx.wait();
    alert("Campaign created successfully!");
  } catch (error) {
    console.error("Failed to create campaign:", error);
  }
});

// Donate to a Campaign
document.getElementById("donateForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const campaignId = document.getElementById("campaignId").value;
  const amount = ethers.utils.parseEther(document.getElementById("donationAmount").value);

  try {
    const tx = await contract.donateToCampaign(campaignId, { value: amount });
    await tx.wait();
    alert("Donation successful!");
  } catch (error) {
    console.error("Donation failed:", error);
  }
});

// Fetch Campaigns
document.getElementById("viewCampaigns").addEventListener("click", async () => {
  try {
    const campaigns = await contract.getCampaigns();
    const campaignList = document.getElementById("campaignList");
    campaignList.innerHTML = "";
    campaigns.forEach((campaign, index) => {
      const campaignElement = document.createElement("div");
      campaignElement.innerHTML = `
        <p><strong>Campaign ID:</strong> ${index}</p>
        <p><strong>Title:</strong> ${campaign.title}</p>
        <p><strong>Description:</strong> ${campaign.description}</p>
        <p><strong>Target:</strong> ${ethers.utils.formatEther(campaign.target)} AVAX</p>
        <p><strong>Deadline:</strong> ${new Date(campaign.deadline * 1000).toLocaleString()}</p>
        <p><strong>Amount Collected:</strong> ${ethers.utils.formatEther(campaign.amountCollected)} AVAX</p>
      `;
      campaignList.appendChild(campaignElement);
    });
  } catch (error) {
    console.error("Failed to fetch campaigns:", error);
  }
});
