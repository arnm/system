// import * as graphql from 'graphql';
import * as fs from 'fs';
import * as util from 'util';

import * as express from 'express';
import * as bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';

import resolvers from './resolvers';

const readFile = util.promisify(fs.readFile);

async function main() {

    const typeDefs = await readFile('./types.graphql', 'utf8');

    const schema = makeExecutableSchema({
        typeDefs,
        resolvers
    });

    const app = express();

    app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

    app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

    app.listen(3000, () => console.log(':3000/graphiql'));
}

main();
