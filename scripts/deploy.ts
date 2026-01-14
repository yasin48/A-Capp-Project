import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  const ProductAuthentication = await ethers.getContractFactory("ProductAuthentication");
  const productAuth = await ProductAuthentication.deploy();

  await productAuth.waitForDeployment();

  const address = await productAuth.getAddress();
  console.log("ProductAuthentication deployed to:", address);
  console.log("\nPlease update CONTRACT_ADDRESS in your .env file with:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
