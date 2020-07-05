const CreateUser = require('../../application/use_cases/CreateUser.js');

module.exports = {

  async createUser(request) {
    const { serviceLocator } = request.app;
    const { email } = request.payload;

    const user = await CreateUser(email, serviceLocator);

    // TODO: Should I use GraphQL here?
    return serviceLocator.userSerializer.serialize(user);
  },

};
