const JiraApi = require('jira-client');

const jiraService = new JiraApi({
    protocol: 'https',
    host: 'bits.bazaarvoice.com/jira',
    username: 'api-infrateam',
    password: 'LHN&E:Rr49s&p9}z.9P=ed<gG$h<mMDr',
    apiVersion: '2',
    strictSSL: true
});

async function jira(jql: string) {
    const result = await jiraService.searchJira(jql);
    return result.issues.map((issue: any) => {

        // console.log(Object.keys(issue.fields).filter(k => !k.includes('customfield_')));

        //       [ 'resolution',
        // 'lastViewed',
        // 'aggregatetimeoriginalestimate',
        // 'issuelinks',
        // 'assignee',
        // 'subtasks',
        // 'votes',
        // 'issuetype',
        // 'duedate',
        // 'timeestimate',
        // 'status',
        // 'aggregatetimeestimate',
        // 'creator',
        // 'timespent',
        // 'aggregatetimespent',
        // 'workratio',
        // 'labels',
        // 'components',
        // 'reporter',
        // 'progress',
        // 'project',
        // 'resolutiondate',
        // 'watches',
        // 'updated',
        // 'timeoriginalestimate',
        // 'description',
        // 'summary',
        // 'fixVersions',
        // 'priority',
        // 'aggregateprogress',
        // 'created' ]

        // console.log(JSON.stringify(issue.fields.issuelinks));

        return {
            key: issue.key,
            summary: issue.fields.summary,
            status: issue.fields.status.name,
            assignee: {
                name: issue.fields.assignee.name,
                displayName: issue.fields.assignee.displayName
            }
        }
    });
}

export default {
    Query: {
        jira: (parent: any, args: any) => jira(args.jql)
    }
}
