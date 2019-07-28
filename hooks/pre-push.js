const assert = require('assert')
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const Web3 = require('web3')
const PrivateKeyProvider = require('truffle-privatekey-provider')
const parseCommit = require('git-parse-commit')

const contractJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../build/contracts/Commits.json')))
const { abi } = contractJSON
const networkId = 42 // kovan
const { address: contractAddress } = contractJSON.networks[networkId]

const privateKey = execSync('git config ethereumcheckpoint.privatekey').toString().trim()
const providerUri = execSync('git config ethereumcheckpoint.provideruri').toString().trim()
const provider = new PrivateKeyProvider(privateKey, providerUri)
const web3 = new Web3(provider)

;(async () => {
  const { address: sender } = web3.eth.accounts.privateKeyToAccount(`0x${privateKey}`)

  const commit = execSync('git cat-file -p HEAD').toString().trim()
  const commitHash = execSync('git rev-parse HEAD').toString().trim()
  const tag = execSync('git describe --tags `git rev-list --tags --max-count=1`').toString().trim()
  const tagCommit = execSync(`git rev-list -n 1 "${tag}"`).toString().trim()

  if (tagCommit !== commitHash) {
    console.log('Tag not found for commit, skipping checkpoint.')
    process.exit(0)
  }

  console.log(`Tag ${tag} found, checkpointing commit ${commitHash}`)

  const {
    tree,
    parents,
    author: {
      name: authorName,
      email: authorEmail,
      timestamp: authorDate,
      timezone: authorDateTzOffset
    },
    committer: {
      name: committerName,
      email: committerEmail,
      timestamp: commitDate,
      timezone: commitDateTzOffset
    },
    pgp,
    title,
    description
  } = parseCommit(`${commitHash}\n${commit}`)

  const author = `${authorName} <${authorEmail}>`
  const committer = `${committerName} <${committerEmail}>`
  const message = `${title}${description}
`
  const signature = `-----BEGIN PGP SIGNATURE-----

${pgp}
-----END PGP SIGNATURE-----`.split('\n').join('\n ') + '\n'

  const data = {
    tree,
    parents,
    author,
    authorDate,
    authorDateTzOffset,
    committer,
    commitDate,
    commitDateTzOffset,
    message,
    signature
  }

  const contract = new web3.eth.Contract(abi, contractAddress)

  try {
    console.log('Checkpointing commit to Ethereum...')
    const { status } = await contract.methods.checkpoint(data).send({
      from: sender
    })

    assert.ok(status)

    const _commitDate = await contract.methods.checkpoints(`0x${commitHash}`).call()
    assert.equal(_commitDate.toString(), commitDate.toString())
    console.log('Successfully checkpointed commit to Ethereum.')

    process.exit(0)
  } catch(err) {
    console.error(err.message)
  }
})()
