# ethereum-dapp
run git push after everything is done: git push -u origin master

# source
https://www.youtube.com/watch?v=8wMKq7HvbKw

Truffle => framework to create Dapps on ethereum blockchain
Ganache => local and memory blockchain
Metamask => access to ethereum blockchain

# Truffle
deploy app: 
$ truffle migrate

start truffle console:
$ truffle console

## Truffle console

Election.deployed().then(function(instance) { app = instance })

=> copy of deployed abstraction
=> async operation handled with js promises

get app adress:
app.address