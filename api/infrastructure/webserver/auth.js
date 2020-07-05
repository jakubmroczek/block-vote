
const { AuthenticationError } = require('apollo-server-express');

// TODO: Where this should be?
function mustBeSignedIn(resolver) {
  return (root, args, context) => {
    const { user } = context;
    if (!user || !user.isLoggedIn) {
      console.log(user);
      throw new AuthenticationError('You must be signed in');
    }
    return resolver(root, args, context);
  };
}

module.exports = { mustBeSignedIn };
