// scripts/deploy.js

const hre = require("hardhat");

async function main() {
  const EduNFT = await hre.ethers.getContractFactory("EduNFT");
  const eduNFT = await EduNFT.deploy();

  await eduNFT.waitForDeployment(); // для Hardhat 2024+

  console.log("Contract deployed to:", await eduNFT.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
