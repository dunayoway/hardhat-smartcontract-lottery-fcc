# Hardhat Smart Contract Lottery (FCC)

![Solidity](https://img.shields.io/badge/Solidity-%23363636.svg?style=for-the-badge&logo=solidity&logoColor=white)
![Hardhat](https://img.shields.io/badge/Hardhat-FFD43B?style=for-the-badge&logo=hardhat&logoColor=black)
![Chainlink](https://img.shields.io/badge/Chainlink-375BD2?style=for-the-badge&logo=chainlink&logoColor=white)

A decentralized lottery system built with Solidity smart contracts and Hardhat. This project is part of the FreeCodeCamp (FCC) blockchain curriculum. It allows users to participate in a transparent and trustless lottery, with winners selected programmatically using **Chainlink VRF** for randomness and **Chainlink Keepers** for automation.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Testing](#testing)
  - [Deployment](#deployment)
- [Repo Structure](#repo-structure)
- [How It Works](#how-it-works)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Features

- **Decentralized Lottery**: Users can enter the lottery by paying a fee.
- **Fair Randomness**: Winners are selected using **Chainlink VRF** for verifiable randomness.
- **Automation**: **Chainlink Keepers** automate the lottery process (e.g., picking a winner at intervals).
- **Transparency**: Fully on-chain and auditable.
- **Hardhat Framework**: Includes testing, scripting, and deployment tools.

---

## Tech Stack

- **Solidity**: For writing smart contracts.
- **Hardhat**: For development, testing, and deployment.
- **Chainlink**: For randomness (VRF) and automation (Keepers).
- **Ethereum**: Deployed on Ethereum-compatible networks (e.g., Goerli, Sepolia, or Mainnet).

---

## Getting Started

### Prerequisites

- Node.js (v16.x or higher)
- npm or yarn
- MetaMask (or any Ethereum wallet)
- Ethereum testnet ETH (e.g., Goerli or Sepolia)

### Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/hardhat-smartcontract-lottery-fcc.git