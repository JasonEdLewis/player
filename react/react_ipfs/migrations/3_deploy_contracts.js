var Contract = artifacts.require("./AlbumNft.sol");

module.exports = function(deployer) {
  deployer.deploy(Contract,"QmTttgz1gQwiyzt76ayfq7mCW39igtcTGJGooNorsrbsnz", "Just the Facts", "The Factualist",  "June 13, 1972");

};