//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract CircleToken is ERC20 {
    address public admin;
    uint96 private percentageSellerOffering;
    uint256 public reserveFunds;
    uint256 public helpSellers;

    mapping(address => bool) private whitelistedAddresses;
    mapping(address => uint256) private reductionTicket;
    mapping(address => sellOffer) sellerOffer;
    mapping(address => uint256) leftToDistribute;

    struct sellOffer {
        uint256 minPrice;
        uint256 amount;
        // reductionType category;
        bool isFixed;
    }
    event OfferSet(
        address user,
        uint256 minPrice,
        uint256 amount,
        bool isFixed
    );
    event ReductionAdded(address client, address seller, uint256 amount);
    event UsedReduction(address client, address seller, uint256 reduction);
    event ReductionFundsFilled(address seller, uint256 amount);
    event ReductionFundsUsed(address seller, uint256 amount);
    event UpdatedSellerAdvantage(uint96 percentage);
    event UserWhiteListed(address user);
    event OutOfDiscount(address seller, uint256 amountLeft);
    event outOfHelpSellers(uint96 percentage,uint256 balance);
    event AddedToHelpingSellersFund(address donator,uint256 amount);
    modifier onlyAdmin() {
        require(
            isAdmin(msg.sender),
            "this function must be called by the admin"
        );
        _;
    }

    constructor(uint256 reserve) ERC20("CircleToken", "LOCAL") {
        _mint(msg.sender, reserve);
        reserveFunds = reserve;
        admin = msg.sender;
        whitelistedAddresses[admin]=true;
    }
    function sellerDonation(uint256 amount)external {
        _transfer(msg.sender,admin,amount);
        helpSellers +=amount;
        emit AddedToHelpingSellersFund(msg.sender,amount);

    }
    function reSupplyOffer(uint256 amount) external {
        uint256 extra = (amount * percentageSellerOffering) / 10000;
    
        if (extra > helpSellers) {
            emit outOfHelpSellers(percentageSellerOffering, helpSellers);
            revert(
                "the admin account doesn't have enough funds to give you the offer"
            );
        }
        require(isWhitelisted(msg.sender), "the user is not whitelisted");
        super._transfer(msg.sender, admin, amount);
        leftToDistribute[msg.sender] += amount+extra;
        helpSellers-=extra;
        emit ReductionFundsFilled(msg.sender, amount);
    }

    function getSellerPercentageOffer() public view returns (uint96) {
        return percentageSellerOffering;
    }

    function setSellerPercentageOffer(uint96 percentage) external onlyAdmin {
        // require(percentage<5000,"faut pas forcer non plus");
        percentageSellerOffering = percentage;
        emit UpdatedSellerAdvantage(percentage);
    }

    function getSellerOffer(address seller)
        public
        view
        returns (sellOffer memory)
    {
        return sellerOffer[seller];
    }

    function setSellerOffer(address seller, sellOffer calldata offer)
        external
        onlyAdmin
    {
        require(isWhitelisted(seller), "user not whitelisted to be seller");
        require(offer.amount > 0, "error : null amount");
        if (leftToDistribute[seller] < 10000) {
            emit OutOfDiscount(seller, leftToDistribute[seller]);
            revert("not enough funds allocated to discounts");
        }
        sellerOffer[seller] = offer;
        emit OfferSet(seller, offer.minPrice, offer.amount, offer.isFixed);
    }

    function lookForOffer(address seller, uint256 amountTransfered)
        internal
        view
        returns (uint256)
    {
        uint256 refunds;
        sellOffer memory offer = getSellerOffer(seller);
        amountTransfered > offer.minPrice
            ? offer.isFixed ? refunds = offer.amount : refunds =
                (offer.amount * amountTransfered) /
                10000
            : refunds = 0;
        return refunds;
    }

    function claimableReduction(address client) public view returns (uint256) {
        return reductionTicket[client];
    }

    function addReduction(
        address client,
        address seller,
        uint256 amount
    ) private {
        reductionTicket[client] += amount;
        emit ReductionAdded(client, seller, amount);
    }

    function isAdmin(address user) internal view returns (bool) {
        return user == admin;
    }

    function isWhitelisted(address user) public view returns (bool) {
        return whitelistedAddresses[user];
    }

    function whitelistUser(address user) external onlyAdmin {
        whitelistedAddresses[user] = true;
        emit UserWhiteListed(user);
    }

    function sellerReductionFunds(address seller)
        public
        view
        returns (uint256)
    {
        return leftToDistribute[seller];
    }

    function transferWithReduction(
        address seller,
        uint256 amount,
        uint256 reduction
    ) public {
        require(amount > 0 && reduction > 0, "null amounts");
        require(
            claimableReduction(msg.sender) >= reduction,
            "yon don't have enough cashback available"
        );

        require(reduction < amount, "reduction is bigger than the price");
        require(
            sellerReductionFunds(seller) > amount,
            "seller can't afford this discount"
        );
        require(
            balanceOf(admin) - reserveFunds -helpSellers> reduction,
            "admin out of token, please try again later"
        );

        _transfer(admin, seller, reduction);
        leftToDistribute[seller] -= reduction;
        _transfer(msg.sender, seller, amount - reduction);

        emit UsedReduction(msg.sender, seller, reduction);
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
        require(
            amount < balanceOf(from) - leftToDistribute[from],
            "not enough available token"
        );
        if (isWhitelisted(to) && !isAdmin(from)) {
            //si le destinataire est un vendeur et si l'envoyeur n'est pas l'admin
            //prendre en compte la balance
            uint256 reductionsAdded = lookForOffer(to, amount);
            addReduction(from, to, reductionsAdded);
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
}
