const express = require('express');
const { ApolloServer } = require('apollo-server-express');

let aboutMessage = "Issue Tracke API v1.0";

const typeDefs = `
    type Query {
        about: String!
    }
    type Mutation {
        setAboutMessage(message: String!) : String
    }
`;

const resolvers = {
    Query: {
        about: () => aboutMessage,
    },
    Mutation: {
        setAboutMessage,
    }
};

function setAboutMessage(_, { message }) {
    return aboutMessage = message;
}

const server = new ApolloServer({
    typeDefs,
    resolvers
});


const app = express();

app.use(express.static('public'));

server.applyMiddkeware({ app, path: '/graphql' });s

app.listen(3000, function () {
    console.log('App started on port 3000');
});
