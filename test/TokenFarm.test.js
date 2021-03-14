const { assert } = require('chai');

const DaiToken = artifacts.require('DaiToken')
const DappToken = artifacts.require('DappToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai')
  .use(require('chai-as-promised'))
  .should()

// helper function for setting amount of ether to tokens and formattng into Wei
function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

//recreate migrations file for testing purposes
contract('TokenFarm', ([owner, investor]) => {
  let daiToken, dappToken, tokenFarm

  //function that is run before every test
  before(async () => {
    //Load contracts
    daiToken = await DaiToken.new()
    dappToken = await DappToken.new()
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

    // Transfer all Dapp tokens to farm (1 million)
    await dappToken.transfer(tokenFarm.address, tokens('1000000'))

    // Send tokens to investor
    await daiToken.transfer(investor, tokens('100'), { from: owner })
  })

  // describe DAI token for token farm for testing, make sure it's deployed
  describe('Mock DAI deployment', async () => {
    it('has a name', async () => {
      //fetch name of daitoken
      const name = await daiToken.name()
      assert.equal(name, 'Mock DAI Token')
    })
  })

  // describe Dapp token for token farm for testing, make sure it's deployed
  describe('Dapp Token deployment', async () => {
    it('has a name', async () => {
      const name = await dappToken.name()
      assert.equal(name, 'DApp Token')
    })
  })

  // describe token farm for testing, make sure it's deployed
  describe('Token Farm deployment', async () => {
    it('has a name', async () => {
      const name = await tokenFarm.name()
      assert.equal(name, 'Dapp Token Farm')
    })

    // make sure that balance matches supply (1000000 tokens)
    it('contract has tokens', async () => {
      let balance = await dappToken.balanceOf(tokenFarm.address)
      assert.equal(balance.toString(), tokens('1000000'))
    })
  })

  // describe token farm real state for 
  describe('Farming tokens', async () => {

    it('rewards investors for staking mDai tokens', async () => {
      let result

      // Check investor balance before staking
      result = await daiToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct before staking')

      // Stake Mock DAI Tokens
      await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor })
      await tokenFarm.stakeTokens(tokens('100'), { from: investor })

      // Check staking result
      // Check if balance is correct
      result = await daiToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('0'), 'investor Mock DAI wallet balance correct after staking')

      // Check if token farm balance is correct
      result = await daiToken.balanceOf(tokenFarm.address)
      assert.equal(result.toString(), tokens('100'), 'Token Farm Mock DAI balance correct after staking')

      // Check if staking balance is correct
      result = await tokenFarm.stakingBalance(investor)
      assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking')

      result = await tokenFarm.isStaking(investor)
      assert.equal(result.toString(), 'true', 'investor staking status correct after staking')

      // Issue Tokens
      await tokenFarm.issueTokens({ from: owner })

      // Check balances after issuance
      result = await dappToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('100'), 'investor DApp Token wallet balance correct affter issuance')

      // Ensure that only onwer can issue tokens
      await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

      // Unstake tokens
      await tokenFarm.unstakeTokens({ from: investor })

      // Check results after unstaking
      result = await daiToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct after staking')

      result = await daiToken.balanceOf(tokenFarm.address)
      assert.equal(result.toString(), tokens('0'), 'Token Farm Mock DAI balance correct after staking')

      result = await tokenFarm.stakingBalance(investor)
      assert.equal(result.toString(), tokens('0'), 'investor staking balance correct after staking')

      result = await tokenFarm.isStaking(investor)
      assert.equal(result.toString(), 'false', 'investor staking status correct after staking')
    })
  })
})