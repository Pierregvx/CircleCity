//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
 contract CircleId is ERC1155{
     constructor(string memory uri)ERC1155(uri){

     }
     
 }