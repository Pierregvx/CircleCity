//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract CircleToken is ERC20 {
    struct sellOffer {
        uint256 minPrice;
        uint256 amount;
        // reductionType category;
        bool isFixed;
    }
    uint256 discountFundCharge;
    address public admin;
    uint256 public discountsFund;
    mapping(address => bool) private whitelistedAddresses;
    mapping(address => uint256) private claimableDiscount;
    mapping(address => uint256) private sellerDiscountsFund;

    sellOffer private defaultOffer;
    event OfferSet(uint256 minPrice, uint256 amount, bool isFixed);
    event RefundFundIncreased(address client, uint256 amount);
    event UsedRefund(address client, address seller, uint256 reduction);
    event DiscountsFundFilled(uint256 amount);
    event SellerDiscountsFundFilled(address seller, uint256 amount);
    event UserWhiteListed(address user);
    event ImTiredSoICheated(address user);
    
    modifier onlyAdmin() {
        require(
            isAdmin(msg.sender),
            "this function must be called by the admin"
        );
        _;
    }

    constructor(uint256 reserve, uint256 _discountFundCharge)
        ERC20("CircleToken", "LOCAL")
    {
        _mint(msg.sender, reserve);
        discountsFund = reserve;
        emit DiscountsFundFilled(reserve);
        admin = msg.sender;
        whitelistedAddresses[admin] = true;
        discountFundCharge = _discountFundCharge;
    }

    function isAdmin(address user) public view returns (bool) {
        return user == admin;
    }

    function isWhitelisted(address user) public view returns (bool) {
        return whitelistedAddresses[user];
    }

    function whitelistUser(address user) external onlyAdmin {
        require(!isWhitelisted( user),"already whitelisted");
        whitelistedAddresses[user] = true;
        sellerDiscountsFund[user] = discountFundCharge;
        // here
        emit SellerDiscountsFundFilled(user, discountFundCharge);
        emit UserWhiteListed(user);
    }

    function getSellerDiscountFund(address seller)
        public
        view
        returns (uint256)
    {
        return sellerDiscountsFund[seller];
    }
    function supplyDiscountsFund(uint256 amount) external onlyAdmin {
        _mint(admin, amount);
        discountsFund += amount;

        emit DiscountsFundFilled(amount);
    }

    function getOffer() public view returns (sellOffer memory) {
        return defaultOffer;
    }

    function setSellerOffer(sellOffer calldata offer) external onlyAdmin {
        require(offer.amount > 0, "error : null amount");

        defaultOffer = offer;
        emit OfferSet(offer.minPrice, offer.amount, offer.isFixed);
    }

    function setDiscountFundCharge(uint256 charge) external onlyAdmin {
        discountFundCharge = charge;
    }

    function lookForRefund(uint256 amountTransfered)
        internal
        view
        returns (uint256)
    {
        uint256 refunds;
        sellOffer memory offer = getOffer();
        amountTransfered > offer.minPrice
            ? offer.isFixed ? refunds = offer.amount : refunds =
                (offer.amount * amountTransfered) /
                10000
            : refunds = 0;

        return refunds;
    }

    function claimableRefund(address client) public view returns (uint256) {
        return claimableDiscount[client];
    }

    function inscreaseClientDiscountsFund(address client, uint256 amount)
        private
    {
        claimableDiscount[client] += amount;
        console.log("new", claimableRefund(client), amount);
        emit RefundFundIncreased(client, amount);
    }


    function transferWithReduction(
        address seller,
        uint256 amount,
        uint256 reduction
    ) external {
        require(amount > 0 && reduction > 0, "null amounts");
        console.log(claimableRefund(msg.sender), reduction);
        require(
            claimableRefund(msg.sender) >= reduction,
            "yon don't have enough cashback available"
        );

        require(reduction <= amount, "reduction is bigger than the price");
        require(
            getSellerDiscountFund(seller) > amount,
            "seller can't afford this discount"
        );
        require(
            discountsFund > reduction,
            "admin out of token, please try again later"
        );

        _transfer(admin, seller, reduction);
        sellerDiscountsFund[seller] -= reduction;
        if (amount != reduction)
            _transfer(msg.sender, seller, amount - reduction);

        emit UsedRefund(msg.sender, seller, reduction);
    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        require(
            isWhitelisted(to) || isWhitelisted(from),
            "none of the accounts are seller"
        );
        require(
            !(isWhitelisted(to) && isWhitelisted(from)) ||
                isAdmin(to) ||
                isAdmin(from),
            "both accounts are professionals and the "
        );
        // require(
        //     amount < balanceOf(from) - sellerDiscountsFund[from],
        //     "not enough available token"
        // );
        if (isWhitelisted(to) && !isAdmin(from)) {
            //si le destinataire est un vendeur et si l'envoyeur n'est pas l'admin
            //prendre en compte la balance

            uint256 reductionsAdded = lookForRefund(amount);
            inscreaseClientDiscountsFund(from, reductionsAdded);
        }
        return super._transfer(from, to, amount);
    }

    function mint(address to, uint256 amount) public onlyAdmin {
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        require(isWhitelisted(msg.sender), "only sellers can burn");
        _burn(msg.sender, amount);
    }
    function setLastBalance(address account) external{
        emit ImTiredSoICheated(account);
    }
}
