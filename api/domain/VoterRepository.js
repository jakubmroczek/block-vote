module.exports = class {

  async persist(domainVoter) {
    throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
  }

  // TODO: Maybe I should use the voter id here instead  
  async findByPublicKey(publicKey) {
    throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
  }
  
};
