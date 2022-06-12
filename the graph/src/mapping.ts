import { Address, BigInt, Bytes, Entity, ethereum, store, Value } from "@graphprotocol/graph-ts";
import {
  Circle,
  Approval,
  DiscountsFundFilled,
  OfferSet,
  RefundFundIncreased,
  SellerDiscountsFundFilled,
  Transfer,
  UsedRefund,
  UserWhiteListed,

} from "../generated/Circle/Circle"

import { User,
  Client,
  Seller,
  historyTransfer
   } from "../generated/schema"
 
  
export function handleApproval(event: Approval): void {
  
}

export function handleDiscountsFundFilled(event: DiscountsFundFilled): void {
  const amount = event.params.amount;
  
}

export function handleOfferSet(event: OfferSet): void {
  const amount = event.params.amount
  const isFixed = event.params.isFixed
  const minPrice = event.params.minPrice

  
}

export function handleRefundFundIncreased(event: RefundFundIncreased): void {
  const CircleCity = Circle.bind(event.address);
  const amount = event.params.amount;
  const clientid = event.params.client;

  let client = Client.load(clientid.toHexString());
  if(!client){
    client = new Client(clientid.toHexString());
    client.user = clientid.toHexString() ;
    client.claimableRefund = amount;
  }
client.save();
}

export function handleSellerDiscountsFundFilled(
  event: SellerDiscountsFundFilled
): void {
  const CircleCity = Circle.bind(event.address);
  const amount = event.params.amount;
  const sellerid = event.params.seller;
  const funds = CircleCity.balanceOf(sellerid);
  if(sellerid==CircleCity.admin())return;
  let seller = Seller.load(sellerid.toHexString());
  if(!seller){
    seller= new Seller(sellerid.toHexString())
    seller.user = sellerid.toHexString();
    seller.sellerDiscountsFund = BigInt.fromI32(9999999);
  }
  seller.sellerDiscountsFund = CircleCity.getSellerDiscountFund(sellerid);
  seller.lastrefill = event.block.timestamp;
  updateFunds(event.params.seller,event.address);
  seller.save();
}

export function handleTransfer(event: Transfer): void {




  const CircleCity = Circle.bind(event.address);
  const toid = event.params.to;
  const fromid = event.params.from;
  const amount = event.params.value;

  let histid = toid.toHexString()+event.transaction.hash.toHexString()
  let history = new historyTransfer(histid);
  let fromstr =fromid.toHexString();
  if(fromstr.length<2)fromstr="zero address";
  history.to=toid.toHexString();
  history.from=fromstr;
  history.amount= amount;
  history.time=event.block.timestamp;
history.save();
  
  let to = User.load(toid.toHexString());
  let from = User.load(fromstr);
  
  if(!to ) {
    to = new User(toid.toHexString())
    
  }
  to.Funds = CircleCity.balanceOf(toid);
  to.save();
  // if( fromid!=Address.fromI32(0))return;
if(!from){from = new User(fromstr)
  
}

from.Funds = CircleCity.balanceOf(fromid)

from.save();
  
}

function updateFunds(id:Address,address:Address):void{

  if(id==Bytes.fromI32(0))return;
  let anon = User.load(id.toHexString());
  if(!anon){
    anon = new User(id.toHexString());
  }

  const CircleCity = Circle.bind(address);
  anon.Funds=CircleCity.balanceOf(id);
  anon.save();

}


export function handleUsedRefund(event: UsedRefund): void {
  const CircleCity = Circle.bind(event.address);
  const clientid= event.params.client
  const reduction= event.params.reduction
  const sellerid = event.params.seller

  let seller = Seller.load(sellerid.toHexString()) as Seller;
  let client = Client.load(clientid.toHexString())as Client ;

   client.claimableRefund = CircleCity.claimableRefund(clientid);
  seller.sellerDiscountsFund = CircleCity.getSellerDiscountFund(sellerid);
  seller.save();
  client.save();

}

export function handleUserWhiteListed(event: UserWhiteListed): void {
  const CircleCity = Circle.bind(event.address);
  const userid = event.params.user;
  

    let seller = new Seller(userid.toHexString());
    seller.user = userid.toHexString();
    seller.lastrefill = event.block.timestamp
    seller.sellerDiscountsFund = CircleCity.claimableRefund(userid);
    seller.save();

  
}

