module.exports = (credentials, { accessTokenManager }) => {
  return accessTokenManager.generate(credentials);
};
