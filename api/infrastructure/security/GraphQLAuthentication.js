const { AuthenticationError } = require('apollo-server-express');
const GetUser = require('../../application/use_cases/GetUser.js');

module.exports = {
  mustBeSignedIn(resolver) {
    return (root, args, context) => {
      const { user } = context;
      if (!user || !user.isLoggedIn) {
        console.log(user);
        throw new AuthenticationError('You must be signed in');
      }
      return resolver(root, args, context);
    };
  },

  mustOwnElection(resolver) {
    return async (root, args, context) => {
      const { id } = args;
      const { user, serviceLocator } = context;

      const { email } = user;
      const domainUser = await GetUser(email, serviceLocator);

      const isOnwer = domainUser.electionID === id;
      if (!isOnwer) {
        throw new AuthenticationError(`Election ${id} is not owned by ${email}, thus they can not read/update it.`);
      }

      return resolver(root, args, context);
    };
  },
};
