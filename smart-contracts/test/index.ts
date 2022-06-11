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
  beforeEach(async () => {
    [admin, john, jack, butcher, baker] = await ethers.getSigners();
    circleToken = await deploy("CircleToken",0);
    await circleToken.connect(admin).whitelistUser(butcher.address);
    await circleToken.connect(admin).whitelistUser(baker.address);
  });

  describe("#test token", async function () {
    let amount = 100000;
    let offer: any;
    beforeEach(async () => {
      offer = {
        minPrice: 1000,
        amount: 100,
        isFixed: true,
      };
      await circleToken.connect(admin).mint(jack.address, 1000000000000000);
      await circleToken.connect(admin).mint(john.address, amount * 2);

      await circleToken.connect(admin).mint(butcher.address, amount * 2);
      await circleToken.connect(butcher).reSupplyOffer(amount*2);
      await circleToken.connect(admin).setSellerOffer(butcher.address, offer);
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
      await circleToken
        .connect(john)
        .transferWithReduction(
          butcher.address,
          amount,
          1
        );
        await expect(await circleToken.balanceOf(john.address)).to.be.equal(1);
        await expect(await circleToken.sellerReductionFunds(butcher.address)).to.be.equal(amount*2-1);
    });
    it("test donations",async function(){
      
      await circleToken.connect(jack).sellerDonation(100000);
      await circleToken.connect(admin).mint(baker.address, amount * 2);


      await circleToken.connect(admin).setSellerPercentageOffer(3000);
      await circleToken.connect(baker).reSupplyOffer(amount*2);
      await circleToken.connect(admin).setSellerOffer(baker.address, offer);
      await expect(await circleToken.sellerReductionFunds(baker.address)).to.be.equal(2*amount*1.3);
    })
  });
});
