import * as dm from 'deepmerge';

import monitors from './resolvers/monitors';
import system from './resolvers/system';
import jira from './resolvers/jira';
import exchange from './resolvers/exchange';

const resolvers = dm.all([monitors, system, jira, exchange]);

console.log(resolvers);

export default resolvers;
