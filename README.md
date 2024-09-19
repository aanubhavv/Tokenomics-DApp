# Tokenomics-DApp

Tokenomics-DApp is a decentralized application (DApp) built using Next.js, Solidity, and ethers.js. This project provides a user-friendly interface to manage tokenomics functionalities on the Ethereum blockchain, including registration, stakeholder and vesting management, and withdrawals.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Smart Contracts](#smart-contracts)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Tokenomics-DApp facilitates secure and efficient management of tokenomics using Ethereum smart contracts. The application integrates a Next.js front-end with Solidity smart contracts through ethers.js.

## Features

- **User Registration**: Easy registration process for new users.
- **Stakeholder and Vesting Management**: Add stakeholders and manage vesting periods.
- **Withdrawal Functionality**: Secure withdrawal mechanisms for vested tokens.
- **Timelock Functionality**: Each organization has its own timelocked contracts.
- **Seamless Integration**: Front-end and smart contracts are integrated using ethers.js for efficient interaction.

## Getting Started

### Prerequisites

Ensure you have the following installed on your local development machine:

- Node.js (v14.x or later)
- npm or yarn
- MetaMask browser extension

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/aanubhavv/Tokenomics-DApp.git
   cd Tokenomics-DApp
   ```

2. Install the dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

### Running the Application

1. Start the local development server:
   ```sh
   npm run dev
   # or
   yarn dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Smart Contracts

The smart contracts for this project are located in the `contracts` directory. They provide timelock functionality for each organization. To compile and deploy the contracts, follow these steps:

1. Install Hardhat:
   ```sh
   npm install --save-dev hardhat
   ```

2. Compile the contracts:
   ```sh
   npx hardhat compile
   ```

3. Deploy the contracts:
   ```sh
   npx hardhat run scripts/deploy.js --network <network-name>
   ```

Ensure you have the appropriate network configuration in `hardhat.config.js`.


## License


This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Screenshots

![home](https://github.com/user-attachments/assets/fe147b88-8db0-42f6-877d-c90c902beab8)
![admin](https://github.com/user-attachments/assets/94f95ace-8dd2-4edd-9669-2391c27668d6)
![claim2](https://github.com/user-attachments/assets/96aa789a-24a0-450f-bbb3-767211f030c5)



