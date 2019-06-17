pragma solidity ^0.5.2;
pragma experimental ABIEncoderV2;

import "./SHA1.sol";

contract Commits {
  mapping (bytes20 => uint256) public checkpoints;

  event Checkpointed(address indexed sender, bytes20 indexed commit);

  struct Commit {
    string tree;
    string[] parents;
    string author;
    uint256 authorDate;
    string authorDateTzOffset;
    string committer;
    uint256 commitDate;
    string commitDateTzOffset;
    string message;
    string signature;
  }

  function checkpoint(
    Commit calldata _commit
  ) external returns (bytes20 commitHash) {
    require(_commit.commitDate <= now + 24 hours);
    require(_commit.commitDate > now - 24 hours);

    string memory treeStr = concat("tree ", _commit.tree, "\n", "", "", "", "");

    string memory parentsStr;
    for (uint256 i = 0; i < _commit.parents.length; i++) {
      parentsStr = concat(parentsStr, "parent ", _commit.parents[i], "\n", "", "", "");
    }

    string memory authorStr = concat("author ", _commit.author, " ", uint2str(_commit.authorDate), " ", _commit.authorDateTzOffset, "\n");

    string memory committerStr = concat("committer ", _commit.committer, " ", uint2str(_commit.commitDate), " ", _commit.commitDateTzOffset, "\n");

    string memory signatureStr = "";
    if (bytes(_commit.signature).length > 0) {
      signatureStr = concat("gpgsig ", _commit.signature, "", "", "", "", "");
    }

    string memory messageStr = concat("\n", _commit.message, "", "", "", "", "");

    string memory data = concat(treeStr, parentsStr, authorStr, committerStr, signatureStr, messageStr, "");

    commitHash = SHA1.sha1(abi.encodePacked("commit ", uint2str(strsize(data)), byte(0), data));

    require(checkpoints[commitHash] == 0);
    checkpoints[commitHash] = _commit.commitDate;

    emit Checkpointed(msg.sender, commitHash);
  }

  function checkpointed(bytes20 commit) public view returns (bool) {

    return checkpoints[commit] != 0;
  }

  function checkpointVerify(bytes20 commit, bytes20 root, bytes20 leaf, bytes20[] memory proof) public view returns (bool) {

    require(checkpoints[commit] != 0);
    return verify(root, leaf, proof);
  }

  function verify(bytes20 root, bytes20 leaf, bytes20[] memory proof) public pure returns (bool) {
    bytes20 computedHash = leaf;

    for (uint256 i = 0; i < proof.length; i++) {
      bytes20 proofElement = proof[i];

      if (computedHash < proofElement) {
        // Hash(current computed hash + current element of the proof)
        computedHash = SHA1.sha1(abi.encodePacked(computedHash, proofElement));
      } else {
        // Hash(current element of the proof + current computed hash)
        computedHash = SHA1.sha1(abi.encodePacked(proofElement, computedHash));
      }
    }

    // Check if the computed hash (root) is equal to the provided root
    return computedHash == root;
  }

  function concat(string memory _a, string memory _b, string memory _c, string memory _d, string memory _e, string memory _f, string memory _g) internal returns (string memory) {
    bytes memory _ba = bytes(_a);
    bytes memory _bb = bytes(_b);
    bytes memory _bc = bytes(_c);
    bytes memory _bd = bytes(_d);
    bytes memory _be = bytes(_e);
    bytes memory _bf = bytes(_f);
    bytes memory _bg = bytes(_g);
    string memory abcdefg = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length + _bf.length + _bg.length);
    bytes memory babcdefg = bytes(abcdefg);
    uint k = 0;
    for (uint i = 0; i < _ba.length; i++) babcdefg[k++] = _ba[i];
    for (uint i = 0; i < _bb.length; i++) babcdefg[k++] = _bb[i];
    for (uint i = 0; i < _bc.length; i++) babcdefg[k++] = _bc[i];
    for (uint i = 0; i < _bd.length; i++) babcdefg[k++] = _bd[i];
    for (uint i = 0; i < _be.length; i++) babcdefg[k++] = _be[i];
    for (uint i = 0; i < _bf.length; i++) babcdefg[k++] = _bf[i];
    for (uint i = 0; i < _bg.length; i++) babcdefg[k++] = _bg[i];
    return string(babcdefg);
  }

  function uint2str(uint v) internal view returns (string memory str) {
    uint256 maxlength = 100;
    bytes memory reversed = new bytes(maxlength);
    uint i = 0;
    while (v != 0) {
      uint remainder = v % 10;
      v = v / 10;

      reversed[i++] = byte(uint8(48 + remainder));
    }

    bytes memory s = new bytes(i);
    for (uint j = 0; j < i; j++) {
      s[j] = reversed[i - j - 1];
    }

    str = string(s);
  }

  function strsize(string memory str) internal view returns (uint length) {
    uint256 i = 0;
    bytes memory strbytes = bytes(str);

    while (i < strbytes.length) {
      if (strbytes[i]>>7 == 0) {
        i+=1;
      } else if (strbytes[i]>>5 == 0x06) {
        i+=2;
      } else if (strbytes[i]>>4 == 0x0E) {
        i+=3;
      } else if (strbytes[i]>>3 == 0x1E) {
        i+=4;
      } else {
        //For safety
        i += 1;
      }

      length++;
    }
  }
}
