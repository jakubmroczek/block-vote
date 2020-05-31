const Election = artifacts.require("Election");

module.exports = function(deployer) {
    const electionTitle = "Election to the  student government";
    deployer.deploy(Election, electionTitle);
};
