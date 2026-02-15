import hre from "hardhat";
const { ethers } = hre;

async function main() {
  console.log("Deploying ProductAuthentication contract...");

  const signers = await hre.ethers.getSigners();
  if (signers.length === 0) {
    throw new Error("No signers available. Check your PRIVATE_KEY in .env");
  }
  const deployer = signers[0];

  console.log("Deploying with account:", deployer.address);
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "MATIC");

  const ProductAuthentication = await hre.ethers.getContractFactory("ProductAuthentication");
  const contract = await ProductAuthentication.deploy();

  // Wait for deployment to complete
  await contract.waitForDeployment();

  // Get the deployed contract address
  const contractAddress = await contract.getAddress();

  console.log("\n✅ ProductAuthentication deployed to:", contractAddress);
  console.log("\nAdd this to your .env.local:");
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
