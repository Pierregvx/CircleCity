//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
 contract CircleToken is ERC20{
     constructor()ERC20("CircleToken","LOCAL"){

     }
     function _transfer(address from,address to)internal virtual override{
         return super._transfer(from,to);

     }
 }