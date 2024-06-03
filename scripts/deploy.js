// scripts/deploy.js

async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", await deployer.getAddress());
  
    // Deploy OrganizationRegistry contract
    const OrganizationRegistry = await ethers.getContractFactory("OrganizationRegistry");
    const organizationRegistry = await OrganizationRegistry.deploy();
    await organizationRegistry.waitForDeployment();
    console.log("OrganizationRegistry deployed to:", await organizationRegistry.getAddress());
  
    // Deploy StakeholderManagement contract
    const StakeholderManagement = await ethers.getContractFactory("StakeholderManagement");
    const stakeholderManagement = await StakeholderManagement.deploy(await organizationRegistry.getAddress());
    await stakeholderManagement.waitForDeployment();
    console.log("StakeholderManagement deployed to:", await stakeholderManagement.getAddress());
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  