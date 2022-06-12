/* eslint-disable prettier/prettier */
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@openzeppelin/hardhat-upgrades";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-contract-sizer";
import * as dotenv from "dotenv";
require("@nomiclabs/hardhat-ganache");
dotenv.config();

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.9",
        settings: {
            // evmVersion: "constantinople",
            evmVersion: "istanbul",
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        mumbai: {
            url: "https://polygon-mumbai.g.alchemy.com/v2/EU6IHhJ9DWNVfHysQNgH1M-2QJUSSg4S",
            accounts: ["c2e3ce0229bb1624a92881c8dd0a7ef154449a01c72f54e0f4d16b0c41508a79"],
        },
        rinkeby: {
            url: "https://eth-rinkeby.alchemyapi.io/v2/t4ekhcTowyYkJYt8sMsDcc6VsTtK8fYT",
            accounts: [
                "1a57200a0f4d469b9ac60b2857a595c5c7b00787e5fb1238a106113fe10b941d",
                "10d4cf8e1163c184883b55f79b79fba78dc06cca4c152da643ee5818c3581e56",
                "3bb16cc58c3652976ca221f25a9536d1cdd37615372db811119355f474649149",
                "b7342c396b70f82fe04e4a891ded0b69187ebd0f7353e626bf0a8616614df2da",
                "3a48da37c9850dd1f94325df485a84aef8081c1cc9d2a78e8ee4e6e22218c0e3"
            ],
            gas: 2100000,
            gasPrice: 8000000000,
        },
        
    },

    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },

    /*
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  */

    etherscan: {
        apiKey: "E875E9XHFVBD2YCBSBTZPE72Q1156U8PEQ",
    },
};

export default config;
