module.exports = class {

  persist(domainVoter) {
    throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
  }

  merge(domainVoter) {
    throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
  }

  // TODO: Maybe I should use the voter id here instead  
  get(publicKey) {
    throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
  }

};
