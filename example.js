const sha1 = require('sha1')

var tree = "00dd089c310aea2b821d23ea0f1a6a6235ad165c"
var parents = ["32f04c7f572bf75a266268c6f4d8c92731dc3b7f"]
var author = "Miguel Mota <hello@miguelmota.com>"
var authorDate = "1560727622 -0700"
var committer = "Miguel Mota <hello@miguelmota.com>"
var commitDate = "1560727622 -0700"
var message = `add license
`

	var gpgSigStr = ''

var gpgSig = `-----BEGIN PGP SIGNATURE-----

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
`
	if (gpgSig != "") {

		// Split all the signature lines and re-write with a left padding and
		// newline. Use join for this so it's clear that a newline should not be
		// added after this section, as it will be added when the message is
		// printed.
		gpgSig = gpgSig.trimRight("\n")
		var lines = gpgSig.split("\n").join("\n ")
		gpgSigStr = "gpgsig " + gpgSig + "\n"
	}

  gpgSigStr = `gpgsig -----BEGIN PGP SIGNATURE-----

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

var treeStr = "tree " + tree + "\n"
var parentStr = ''
for  (var i = 0; i < parents.length; i++) {
  parentStr += "parent " + parents[i] + "\n"
}

var authorStr = "author " + author + " " + authorDate + "\n"
var committerStr = "committer " + committer + " " + commitDate + "\n"
var messageStr = "\n" + message

var data = treeStr + parentStr +  authorStr + committerStr +  gpgSigStr + messageStr

console.log(data)

//console.log(sha1(treeStr))
//console.log(sha1(parentStr))
//console.log(sha1(authorStr))
//console.log(sha1(committerStr))
//console.log(sha1(messageStr))

//console.log(data)
//console.log(sha1(data))

/*
h := newHasher([]byte("commit"), int64(len(data)))
h.Write([]byte(data))
hash := h.Sum(nil)

fmt.Printf("%x", hash[:])

// Hasher ...
type Hasher struct {
	hash.Hash
}

func newHasher(t []byte, size int64) Hasher {
	h := Hasher{sha1.New()}
	h.Write(t)
	h.Write([]byte(" "))
	h.Write([]byte(strconv.FormatInt(size, 10)))
	h.Write([]byte{0})
	return h
}
*/

var buf = Buffer.from('commit ' + data.length + '\0' + data)
console.log(sha1(buf))

//console.log(data.length)

var buf1 = Buffer.from('commit ' + data.length + '\0')
//console.log(sha1(buf1))

//console.log(sha1(data))

// 71423e6e8393d43d1cd568d97f2cd8fccf91fd2a


