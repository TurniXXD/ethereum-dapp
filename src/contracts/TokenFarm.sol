pragma solidity ^0.5.16;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    string public name = "Dapp Token Farm";
    address public owner;
    DappToken public dappToken;
    DaiToken public daiToken;

    address[] public stakers;

    // mapping => key that returns value, 
    mapping(address => uint) public stakingBalance;

    // returns true if user has staked
    mapping(address => bool) public hasStaked;

    // returns true if user is staking
    mapping(address => bool) public isStaking;

    // public constructor,([Smart contract type] [_dappToken => variable name]) 
    constructor (DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    // 1. Stakes tokens (Deposit)
    function stakeTokens(uint _amount) public {
        // Check if amount is staked amount is greater then 0
        require(_amount > 0, "amount cannot be 0");

        // transfer Mock DAI tokens to this contract for staking
        // All tokens have declared transferFrom function that let's someone else move tickets for them
        // transfer function gets called any time and only token handlers spares the token
        // msg.sender => the person who's calling the function, address =>  address of this smart contract, amount
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // Add user to stakers array only if they haven't staked already
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Update staking status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // 2. Unstaking tokens (Withdraw)
    function unstakeTokens() public {
        //fetch staking balance
        uint balance = stakingBalance[msg.sender];

        require(balance > 0, "staking balance cannot be 0");

        // Transfer Mock Dai tokens to this contract for staking
        daiToken.transfer(msg.sender, balance);

        // Reset staking balance
        stakingBalance[msg.sender] = 0;

        // Update staking status
        isStaking[msg.sender] = false;
    }

    // 3. Issuing tokens (earning interest => called by owner)
    function issueTokens() public {
        // make sure that only owner can issue tokens
        require(msg.sender == owner, "caller must be the owner");

        // issue tokens to all stakers
        for (uint i = 0; i<stakers.length; i++) {
            address recipient = stakers[i];
            //find out how many tokens they staked and issue them the same amount of Dapp tokens
            uint balance = stakingBalance[recipient];
            // won't send them tokens if they withdrawed from they account
            if(balance > 0) {
                dappToken.transfer(recipient, balance);
            }
        }
    }
}
