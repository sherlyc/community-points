const BigNumber = require('bn.js')
const { OmgUtil } = require('@omisego/omg-js')
const { Clients, Config } = require(`../config`)
const { convertToSubunit } = require('../helpers')

async function transfer(sender, recipient, amount, currency) {
  const subunitAmount = convertToSubunit(amount)

  /* construct a transaction body */
  const transactionBody = await Clients.Plasma.ChildChain.createTransaction({
    owner: sender.address,
    payments: [
      {
        owner: recipient.address,
        currency: currency,
        amount: new BigNumber(subunitAmount)
      }
    ],
    fee: {
      currency: OmgUtil.transaction.ETH_CURRENCY
    }
  })

  /* sanitize transaction into the correct typedData format */
  /* the second parameter is the address of the RootChain contract */
  const typedData = OmgUtil.transaction.getTypedData(
    transactionBody.transactions[0],
    Config.plasmaContractAddress
  )
  /* define private keys to use for transaction signing */
  const privateKeys = new Array(
    transactionBody.transactions[0].inputs.length
  ).fill(sender.privateKey)

  /*  locally sign typedData with passed private keys, useful for multiple different signatures */
  const signatures = Clients.Plasma.ChildChain.signTransaction(
    typedData,
    privateKeys
  )

  /* return encoded and signed transaction ready to be submitted */
  const signedTxn = Clients.Plasma.ChildChain.buildSignedTransaction(
    typedData,
    signatures
  )

  /* submit to the child chain */
  return Clients.Plasma.ChildChain.submitTransaction(signedTxn)
}

const waitForTransfer = async (
  address,
  initialBalance,
  transferAmount,
  currency
) => {
  const subunitInitialBalance = new BigNumber(convertToSubunit(initialBalance))
  const subunitTransferAmount = new BigNumber(convertToSubunit(transferAmount))
  const expectedAmount = subunitInitialBalance.add(subunitTransferAmount)

  await OmgUtil.waitForChildchainBalance({
    childChain: Clients.Plasma.ChildChain,
    address,
    expectedAmount,
    currency
  })
}

module.exports = { transfer, waitForTransfer }
