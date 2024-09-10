
## Project Description

Mint Matrix is a Web3 platform that provides an interactive introduction to blockchain technology. It features a wallet connection, token management, and a Solana faucet for developers. The application is built with React, Next.js, and Solana Web3.js, and styled with Tailwind CSS.

  Project Link: [https://mint-matrix.vercel.app/](https://mint-matrix.vercel.app/)



<div align="center">
  <img src="/path/to/mint-matrix-overview.png" alt="Mint Matrix Overview" width="600"/>
</div>

## Table of Contents

1. [Features](#features)
2. [Components](#components)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Technologies Used](#technologies-used)
7. [Contributing](#contributing)
8. [License](#license)

## Features

- 🎓 Interactive learning experience about Web3 technologies
- 👛 Wallet connection and management
- 💰 Token viewing and management
- 🚰 Solana faucet for development token requests
- 📱 Responsive design for various screen sizes

<div align="center">
  <img src="/path/to/features-showcase.gif" alt="Features Showcase" width="600"/>
</div>

## Components

### 1. Homepage (`Homepage.tsx`)

<div align="center">
  <img src="/path/to/homepage-screenshot.png" alt="Homepage Screenshot" width="600"/>
</div>

The homepage serves as the main entry point for users. It features:
- An introduction to Web3 concepts (Blockchain, Smart Contracts, DeFi)
- Wallet connection functionality
- Navigation to other sections of the application

### 2. Token Management (`MyTokens.tsx`)

<div align="center">
  <img src="/path/to/token-management-screenshot.png" alt="Token Management Screenshot" width="600"/>
</div>

This page allows users to view and manage their tokens. Key features include:
- Display of token balances and details
- Token sending functionality (simulated)
- Network switching between mainnet and devnet

### 3. Solana Faucet (`Airdrop.tsx`)

<div align="center">
  <img src="/path/to/solana-faucet-screenshot.png" alt="Solana Faucet Screenshot" width="600"/>
</div>

The faucet page enables developers to request Solana tokens for testing purposes. It includes:
- Airdrop request functionality for various SOL amounts
- Balance display and refresh
- Transaction signature copying

## TODO

### 1. Send Tokens 
  - Integrate the send token logic to enable real token transfers.
  
### 2. Confirmation Modal
  - Add a confirmation modal for token transfers.

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- A Solana wallet (e.g., Phantom, Solflare)

## Installation

1. Clone the repository:

git clone https://github.com/your-username/mint-matrix.git

2. Navigate to the project directory:

cd mint-matrix

3. Install dependencies:

npm install
or

yarn install

<div align="center">
<img src="/path/to/installation-guide.gif" alt="Installation Guide" width="600"/>
</div>

## Usage

1. Start the development server:

npm run dev
or

yarn dev



2. Open your browser and navigate to `http://localhost:3000` (or the port specified in your console).

3. Connect your Solana wallet to interact with the application.

<div align="center">
<img src="/path/to/usage-demo.gif" alt="Usage Demo" width="600"/>
</div>

## Technologies Used

<div align="center">
<img src="https://img.shields.io/badge/-React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
<img src="https://img.shields.io/badge/-Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"/>
<img src="https://img.shields.io/badge/-Solana-9945FF?style=for-the-badge&logo=solana&logoColor=white" alt="Solana"/>
<img src="https://img.shields.io/badge/-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
</div>

- React
- Solana Web3.js
- Tailwind CSS
- shadcn/ui components
- Lucide React icons

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


## License

This project is licensed under the [MIT License](LICENSE).

<div align="center">
<img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License"/>
</div>