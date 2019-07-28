const Commits = artifacts.require("Commits");

module.exports = function(deployer) {
  deployer.deploy(Commits);
};
