require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config(); 
module.exports = {
  solidity: "0.8.21",
  networks: {
    ganache: {
      url: process.env.GANACHE_URL, // URL Ganache
      accounts: [process.env.GANACHE_PRIVATE_KEY], // вставь приватный ключ одного из аккаунтов Ganache
      chainId: parseInt(process.env.GANACHE_CHAIN_ID) // или тот Chain ID, который у тебя в Ganache
    }
  }
};
