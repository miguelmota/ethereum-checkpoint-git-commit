const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const Web3 = require('web3')
const { MerkleTree } = require('merkletreejs')
const sha1 = require('sha1')

const contractJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../build/contracts/Commits.json')))
const { abi } = contractJSON
const networkId = 42 // kovan
const { address: contractAddress } = contractJSON.networks[networkId]

const providerUri = execSync('git config ethereumcheckpoint.provideruri').toString().trim()
const web3 = new Web3(new Web3.providers.HttpProvider(providerUri))

;(async () => {
  const contract = new web3.eth.Contract(abi, contractAddress)

  const leaves = execSync(`git --no-pager log --pretty=oneline | awk '{print $1}'`).toString().trim().split('\n').map(x => Buffer.from(x, 'hex'))

  const tree = new MerkleTree(leaves, sha1, { sort: true })

  const root = tree.getHexRoot()
  const leaf = Buffer.from('32f04c7f572bf75a266268c6f4d8c92731dc3b7f', 'hex')
  const proof = tree.getHexProof(leaf)

  const verified = await contract.methods.verify(root, leaf, proof).call({
    from: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1'
  })

  console.log(`verified: ${verified}`)
})()
