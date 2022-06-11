/* eslint-disable prettier/prettier */
/* eslint-disable import/first */
const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-as-promised"));

const { ethers, upgrades } = require("hardhat");
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, Contract } from "ethers";
// @ts-ignore
upgrades.silenceWarnings();

async function deploy(name: string, ...params: any) {
  const Contract = await ethers.getContractFactory(name);
  return await Contract.deploy(...params).then((c: Contract) => c.deployed());
}
describe("CircleTest", function () {
  let admin: SignerWithAddress;
  let john: SignerWithAddress;
  let jack: SignerWithAddress;
  let butcher: SignerWithAddress;
  let baker: SignerWithAddress;
  let circleToken: Contract;
  let initReserve: number;
  let chargeRefund: number;
  beforeEach(async () => {
    [admin, john, jack, butcher, baker] = await ethers.getSigners();
    initReserve = 1000000000;
    chargeRefund = 100000;

    circleToken = await deploy("CircleToken", initReserve, 100000);
    await circleToken.connect(admin).whitelistUser(butcher.address);
    await circleToken.connect(admin).whitelistUser(baker.address);
    console.log(await circleToken.getSellerDiscountFund(butcher.address));
  });

  describe("#test token", async function () {
    let amount = 500;
    let offer: any;
    beforeEach(async () => {
      offer = {
        minPrice: 10,
        amount: 10000,
        isFixed: true,
      };

      await circleToken.connect(admin).mint(jack.address, chargeRefund);
      await circleToken.connect(admin).mint(john.address, amount * 2);
      await circleToken.connect(admin).mint(butcher.address, amount * 2);
      await circleToken.connect(admin).setSellerOffer(offer);
    });
    it("test transfer requirement", async function () {
      await expect(circleToken.connect(john).transfer(jack.address, amount)).to
        .be.reverted;
      await circleToken.connect(john).transfer(butcher.address, amount);
    });
    it("test transfer split", async function () {
      await expect(
        circleToken
          .connect(john)
          .transferWithReduction(
            butcher.address,
            ethers.utils.parseUnits("1", "ether"),
            ethers.utils.parseUnits("1", "wei")
          )
      ).to.be.reverted;
      await circleToken.connect(john).transfer(butcher.address, amount);
      let refundUsed = amount / 10;
      await circleToken
        .connect(john)
        .transferWithReduction(baker.address, amount, refundUsed);
      await expect(await circleToken.balanceOf(john.address)).to.be.equal(
        refundUsed
      );
      await expect(
        await circleToken.getSellerDiscountFund(baker.address)
      ).to.be.equal(chargeRefund - refundUsed);
    });
    //     it("test donations",async function(){
    //       console.log("test");
    //       await circleToken.connect(jack).sellerDonation(10000000);
    //       console.log("test");
    //       await circleToken.connect(admin).mint(baker.address, amount * 2);
    // console.log("test");

    //       await circleToken.connect(admin).setSellerPercentageOffer(300000);
    //       await circleToken.connect(baker).reSupplyOffer(amount*2);
    //       await circleToken.connect(admin).setSellerOffer(baker.address, offer);
    //       await expect(await circleToken.sellerReductionFunds(baker.address)).to.be.equal(2*amount*1.3);
    //     })
  });
});
