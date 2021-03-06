# ethereum-checkpoint-git-commit

> Checkpoint git commits to an Ethereum smart contract and verify commits as Merkle tree

[![status-experimental](https://img.shields.io/badge/status-experimental-orange.svg)](https://github.com/miguelmota/git-checkpoint-ethereum)

## What's this and why?

This is an Ethereum smart contract that allows anyone to checkpoint a commit hash by submitting the commit object data to the smart contract through a transaction. The commit is only accepted if the date of the commit submitted is within a day's range from the current block time. Anyone can then prove that a commit has existed after or before a date by providing a Merkle tree of all the commits under the checkpointed commit.

Blog post: [https://miguelmota.com/blog/checkpoint-git-commit-objects-to-ethereum-and-verify-with-merkle-proofs/](https://miguelmota.com/blog/checkpoint-git-commit-objects-to-ethereum-and-verify-with-merkle-proofs/)

## Example

Print git commit object:

```bash
$ git cat-file -p HEAD
tree 00dd089c310aea2b821d23ea0f1a6a6235ad165c
parent 32f04c7f572bf75a266268c6f4d8c92731dc3b7f
author Miguel Mota <hello@miguelmota.com> 1560727622 -0700
committer Miguel Mota <hello@miguelmota.com> 1560727622 -0700
gpgsig -----BEGIN PGP SIGNATURE-----

 iQIzBAABCAAdFiEEkA8ilwQdtHsQgZEbZ+wRYViKAPkFAl0G0EYACgkQZ+wRYViK
 APmWdxAAgWKOQpz1/QbzYxOXQZ5uT8lTVnxw8HN4KZaZ36ehFTxzRVO0IEniJGr4
 5+sVskMDbkP/aKQyS/UUmeXKGeYQT4Kpwvtih5CZHSLNO2LQ8pz5o0wjWK8OHmx7
 pGuAd83gMqfnQF7+KDqpxqHR63NDmuRo4QQ18rolga16Md4wIRzFNU+JsX7WVIcD
 zPd6PzotAkGD+suqMiYt6ka6cqQT9lB8WN5L88Kdyy8mFsEu7YZBVkWQqB4YCLgu
 7s3vaSuJ9NIGtT3C1Kd2lmEsrDZj84bmEHaP8aOdLAstucNrl8/wSo3NQFeydALQ
 WBpiDhFY2jOYSxcuwI+ZYfeizztr4qGXUaI2VM7/HYSChmWzyvghmP/XmZJDwCKk
 dDgyNSxEjWfM6GD1fmPulvU2MZKabqv6juHpETsPNPdpw7u+Z7om8s2G66erMliU
 WQOfwE4lFcBF0oVoJp2FQQYcme4BERDsqUWJ8C60PW0FELuZlAWRRcUIl49M6gXa
 sSTNfIXubA2LxjHQFS7hy+9+N1Dl1AFcQZP+Md8ai8B4JfDgswf+m1OVuOihDECa
 bMotWVZ+qHeycly9RihDkCas8ICPlCIGZ6PmAPnsMr5Ruzt9oaKuZ5UInB6IRx2k
 H7510dWvJLLZ7w1r78UWdyiT4DH5xRuqQJ8F7erOmtPw5lCmKto=
 =OZk+
 -----END PGP SIGNATURE-----

add license
```

Checkpoint commit object to smart contract:

```javascript
const Commits = artifacts.require('Commits')
const { MerkleTree } = require('merkletreejs')
const sha1 = require('sha1')

const contract = await Commits.new()
const tx  = await contract.checkpoint({
  tree: '00dd089c310aea2b821d23ea0f1a6a6235ad165c',
  parents: [
    '32f04c7f572bf75a266268c6f4d8c92731dc3b7f',
  ],
  author: 'Miguel Mota <hello@miguelmota.com>',
  authorDate: 1560727622,
  authorDateTzOffset: '-0700',
  committer: 'Miguel Mota <hello@miguelmota.com>',
  commitDate: 1560727622,
  commitDateTzOffset: '-0700',
  message: `add license
`,
  signature: `-----BEGIN PGP SIGNATURE-----

iQIzBAABCAAdFiEEkA8ilwQdtHsQgZEbZ+wRYViKAPkFAl0G0EYACgkQZ+wRYViK
APmWdxAAgWKOQpz1/QbzYxOXQZ5uT8lTVnxw8HN4KZaZ36ehFTxzRVO0IEniJGr4
5+sVskMDbkP/aKQyS/UUmeXKGeYQT4Kpwvtih5CZHSLNO2LQ8pz5o0wjWK8OHmx7
pGuAd83gMqfnQF7+KDqpxqHR63NDmuRo4QQ18rolga16Md4wIRzFNU+JsX7WVIcD
zPd6PzotAkGD+suqMiYt6ka6cqQT9lB8WN5L88Kdyy8mFsEu7YZBVkWQqB4YCLgu
7s3vaSuJ9NIGtT3C1Kd2lmEsrDZj84bmEHaP8aOdLAstucNrl8/wSo3NQFeydALQ
WBpiDhFY2jOYSxcuwI+ZYfeizztr4qGXUaI2VM7/HYSChmWzyvghmP/XmZJDwCKk
dDgyNSxEjWfM6GD1fmPulvU2MZKabqv6juHpETsPNPdpw7u+Z7om8s2G66erMliU
WQOfwE4lFcBF0oVoJp2FQQYcme4BERDsqUWJ8C60PW0FELuZlAWRRcUIl49M6gXa
sSTNfIXubA2LxjHQFS7hy+9+N1Dl1AFcQZP+Md8ai8B4JfDgswf+m1OVuOihDECa
bMotWVZ+qHeycly9RihDkCas8ICPlCIGZ6PmAPnsMr5Ruzt9oaKuZ5UInB6IRx2k
H7510dWvJLLZ7w1r78UWdyiT4DH5xRuqQJ8F7erOmtPw5lCmKto=
=OZk+
-----END PGP SIGNATURE-----`.split('\n').join('\n ') + '\n'
})

const {receipt: {logs}} = tx
console.log(logs[0].args.commit.slice(2, 42)) // d89f84d948796605a413e196f40bce1d6294175d

const commitDate = await contract.checkpoints.call('0xd89f84d948796605a413e196f40bce1d6294175d')
console.log(commitDate.toNumber()) // 1560727622
```

Print all commit log hashes:

```bash
$ git --no-pager log --pretty=oneline | awk '{print $1}'
d89f84d948796605a413e196f40bce1d6294175d
32f04c7f572bf75a266268c6f4d8c92731dc3b7f
b80b52d80f5fe940ac2c987044bc439e4218ac94
1553c75a1d637961827f4904a0955e57915d8310
```

Construct a merkle proof and verify onchain:

```javascript
const leaves = [
  'd89f84d948796605a413e196f40bce1d6294175d',
  '32f04c7f572bf75a266268c6f4d8c92731dc3b7f',
  'b80b52d80f5fe940ac2c987044bc439e4218ac94',
  '1553c75a1d637961827f4904a0955e57915d8310',
].map(x => Buffer.from(x, 'hex'))

const tree = new MerkleTree(leaves, sha1, { sort: true })

const root = tree.getHexRoot()
const leaf = Buffer.from('32f04c7f572bf75a266268c6f4d8c92731dc3b7f', 'hex')
const proof = tree.getHexProof(leaf)

const verified = await contract.verify.call(root, leaf, proof)
console.log(verified) // true
```

## Test

```bash
npm test
```

## License

[MIT](LICENSE)
