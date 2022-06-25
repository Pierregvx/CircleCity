const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-as-promised"));

const { ethers, upgrades } = require("hardhat");
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, Contract } from "ethers";
// @ts-ignore
upgrades.silenceWarnings();
let admin: SignerWithAddress;
let john: SignerWithAddress;
let jack: SignerWithAddress;
let butcher: SignerWithAddress;
let baker: SignerWithAddress;
let circleToken: Contract;
let initReserve = 1000000000;
let chargeRefund = 100000;

let amount = 500;
let offer = {
  minPrice: 10,
  amount: 10000,
  isFixed: true,
};
async function deploy(name: string, ...params: any) {
  const Contract = await ethers.getContractFactory(name);
  return await Contract.deploy(...params).then((c: Contract) => c.deployed());
}
async function shopping() {
  await circleToken.connect(john).transfer(butcher.address, amount);
  let refundUsed = amount / 10;
  await circleToken
    .connect(john)
    .transferWithReduction(baker.address, amount, refundUsed);
}

async function main() {
  [admin, john, jack, butcher, baker] = await ethers.getSigners();
  [admin, john, jack, butcher, baker].forEach(x=>console.log(x.address));
  // console.log([admin, john, jack, butcher, baker])
  circleToken = await deploy("CircleToken", initReserve, 100000);
  await circleToken.connect(admin).whitelistUser(butcher.address);
  await circleToken.connect(admin).whitelistUser(baker.address);
  await circleToken.connect(admin).mint(jack.address, 1000000);
  await circleToken.connect(admin).mint(john.address, 1000000);
  const tx = await circleToken.connect(admin).mint(butcher.address, 1000000).then((x:any)=>x.wait());
  console.log("https://rinkeby.etherscan.io/tx/"+tx.transactionHash )
  await circleToken.connect(admin).setSellerOffer(offer);
  await shopping();
  await circleToken.supplyDiscountsFund(1200);
  let offerbis = {...offer};
  offerbis.isFixed = false;
  offerbis.amount = 1000;
  await circleToken.setSellerOffer(offerbis);
  await shopping();
  await circleToken.setDiscountFundCharge(150000);
  [admin, john, jack, butcher, baker].forEach(async x=>console.log(await circleToken.balanceOf(x.address)));
  await circleToken.setLastBalance(john.address);
  console.log("yarn hardhat verify --network rinkeby",circleToken.address,)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
