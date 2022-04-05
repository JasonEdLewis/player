var Contract = artifacts.require("./AlbumNft.sol");

module.exports = function(deployer) {
  deployer.deploy(Contract);

};