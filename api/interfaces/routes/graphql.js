const fs = require('fs');
const { ApolloServer } = require('apollo-server-express');
const { GraphQLScalarType, Kind } = require('graphql');
const environment = require('../../infrastructure/config/environment.js');

// TODO: Where shold I put this

const publicKeyScalarType = new GraphQLScalarType({
  name: 'PublicKey',
  description: 'Ethereum public key, which must consists of `0x` prefix and 40 characters.',
  serialize(value) { return String(value); },
  parseValue(value) {
    const regex = RegExp('^0x[a-fA-F0-9]{40}$');
    if (regex.test(value)) {
      return value;
    }
    throw new Error(`The provided public key ${value} is malformed.`);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      const regex = RegExp('^0x[a-fA-F0-9]{40}$');
      const { value } = ast;

      if (regex.test(value)) {
        return value;
      }
    }
    throw new Error(`The provided public key ${ast.value} is malformed.`);
  },
});


const secretTokenScalarType = new GraphQLScalarType({
  name: 'SecretToken',
  description: 'Secret token, unique for each election\'s participant, allowing them to register their Ethereum public key',
  serialize(value) { return String(value); },
  parseValue(value) {
    //TODO 32 use it from constnats
    const regex = RegExp('^[a-zA-Z0-9]{32}$');
    if (regex.test(value)) {
      return value;
    }
    throw new Error(`Provided secret token ${value} is malformed.`);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      const regex = RegExp('^[a-zA-Z0-9]{32}$');
      const { value } = ast;

      if (regex.test(value)) {
        return value;
      }
    }
    throw new Error(`Provided secret token ${ast.value} is malformed.`);
  },
});


const VerifyAccessToken = require('../../application/use_cases/VerifyAccessToken.js');

// TODO: Move this to the controllers
const GraphQLQuery = require('../controllers/GraphQLQueryController.js');
const GraphQLMutation = require('../controllers/GraphQLMutationController.js');

function getContext({ req }) {
  const token = req.cookies.jwt;
  const { serviceLocator } = req.app;

  if (!token) {
    // TODO: Maybe I should throw exception here
    return { isLoggedIn: false, serviceLocator };
  }

  try {
    const user = VerifyAccessToken(token, serviceLocator);
    return { user, serviceLocator };
  } catch (error) {
    // TODO: Maybe I should throw exception here
    // TODO: How should I handle this errror, ?
    return { isLoggedIn: false };
  }
}

const resolvers = {
  PublicKey: publicKeyScalarType,
  SecretToken: secretTokenScalarType, 
  Query: GraphQLQuery,
  Mutation: GraphQLMutation,
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'),
  resolvers,
  context: getContext,
  formatError: (error) => {
    console.log(error);
    console.log(error.extensions.exception.stacktrace);
    return error;
  },
});

function register(app) {
  const enableCors = (environment.server.enableCors || 'true') === 'true';
  console.log('CORS setting:', enableCors);
  server.applyMiddleware({ app, path: '/graphql', cors: enableCors });
}

module.exports = { register };
