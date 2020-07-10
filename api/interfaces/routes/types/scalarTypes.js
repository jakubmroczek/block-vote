const { GraphQLScalarType, Kind } = require('graphql');

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

module.exports = { publicKeyScalarType, secretTokenScalarType };
