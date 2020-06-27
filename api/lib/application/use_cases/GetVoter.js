/**
 * Gets the voter by its's public key.
 */
module.exports = (publicKey, { voterRepository }) => voterRepository.get(publicKey);
