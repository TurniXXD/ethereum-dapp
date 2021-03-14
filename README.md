# ethereum-dapp
run git push after everything is done: git push -u origin master

Help investors transfer dappTokens or daiTokens to token farm

## Errors
fuck version control, this app uses solidity ^0.5.16

## source
https://www.youtube.com/watch?v=CgXQC4dbGUE

Truffle => framework to create Dapps on ethereum blockchain
Ganache => local and memory blockchain
Metamask => access to ethereum blockchain

## Testing dependencies:
mocha => testing framework
chai => assertion library

# Truffle
deploy app: 
`$ truffle migrate`

TIP: use `--reset` flag to replace smart contracts

start truffle console:
`$ truffle console`

## Truffle console

`Election.deployed().then(function(instance) { app = instance })`

=> copy of deployed abstraction
=> async operation handled with js promises

get app adress:
`app.address`

fetch token to variable:
`tokenFarm = await TokenFarm.deployed()`

get investor's acounts address
`accounts = await web3.eth.getAccounts()`

get investor's account balance and save it into variable (mDai = await DaiToken.deployed()), then the real deal:
`balance = await mDai.balanceOf(accounts[1])`

Account balance is stored and displayed in Wei format.
Format balance into human-readable string:
`formattedBalance = web3.utils.fromWei(balance)`

Or format it the other way around
`web3.utils.toWei('1.5', 'Ether')`