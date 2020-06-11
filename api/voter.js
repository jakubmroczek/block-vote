require('dotenv').config();

function registerPublicKey(_, { secretToken, publicKey }) {
    return true;
}

module.exports = { registerPublicKey }