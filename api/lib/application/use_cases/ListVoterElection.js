/**
 * Gets the elections assigned to the voter's public key.
 */
module.exports = (publicKey, { voterRepository }) => voterRepository.list(publicKey);
