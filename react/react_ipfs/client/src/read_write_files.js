
function readWrite ({contract,_coverHash,_title,_artist,_date}){
    const fs = require('fs')

    const content = `
    var Contract = artifacts.require("./${contract}.sol");
    module.exports = function(deployer) {
  deployer.deploy(Contract,${_coverHash},${_title},${_artist},${_date});

};
    `
    fs.writeFile(`./migrations/${contract}.js`, content, err => {
      if (err) {
        console.error(err)
        return
      }
      //file written successfully
    })
}
export default readWrite



