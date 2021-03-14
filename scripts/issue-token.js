const TokenFarm = artifacts.require('TokenFarm')

// script for issuing tokens from deployer
module.exports = async function(callback) {
  let tokenFarm = await TokenFarm.deployed()
  await tokenFarm.issueTokens()
  console.log("Tokens issued!")
  callback()
}
