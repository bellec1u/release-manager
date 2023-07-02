const axios = require('axios').default;

/**
 * Your HTTP handling function, invoked with each request. This is an example
 * function that echoes its input to the caller, and returns an error if
 * the incoming request is something other than an HTTP POST or GET.
 *
 * In can be invoked with 'func invoke'
 * It can be tested with 'npm test'
 *
 * @param {Context} context a context object.
 * @param {object} context.body the request body if any
 * @param {object} context.query the query string deserialized as an object, if any
 * @param {object} context.log logging object with methods for 'info', 'warn', 'error', etc.
 * @param {object} context.headers the HTTP request headers
 * @param {string} context.method the HTTP request method
 * @param {string} context.httpVersion the HTTP protocol version
 * See: https://github.com/knative/func/blob/main/docs/function-developers/nodejs.md#the-context-object
 */
const handle = async (context) => {

  // credential extraction
  let authorization = JSON.parse(context.headers['authorization'].split(' ')[1])
  let gitlabToken = authorization['gitlab']
  let jiraCredentials = authorization['jira']

  // test connection to gitlab
  // test connection to jira

  // query parameter extraction
  let projectId = context.query['project']
  if (!projectId) {
    return { statusCode: 400, statusMessage: 'The "project" parameter is missing' }
  }

  let numberOfTags = Number(context.query['tags'])
  numberOfTags = numberOfTags ? numberOfTags : 10

  // extract gitlab last tags
  // latest release + numberOfTags-1 last releases
  let tags = await getProjectTags(gitlabToken, projectId)
  let commits = tags.length < numberOfTags
      ? await getProjectCommits(gitlabToken, projectId)
      : await getProjectCommits(gitlabToken, projectId, tags[numberOfTags - 2]['commit']['committed_date'])

  // mapping tag with commits
  let mappedTagCommits = {}
  let index = -1;
  let jiraTickets = []
  for (let commit of commits) {

    if (commit['committed_date'] <= tags[index]['commit']['committed_date']) {
      index++
    }

    let currentTag = index === -1 ? 'Next release' : tags[index]
    if (!currentTag in mappedTagCommits) {
      mappedTagCommits[currentTag] = []
    }

    let tickets = commits.match(process.env.TICKETS_REGEX)
    jiraTickets = jiraTickets.concat(tickets)
    mappedTagCommits[currentTag] = mappedTagCommits[currentTag].concat(tickets)

  }

  // get jira ticket statuses
  let jiraTicketStatuses = getTicketStatuses(jiraCredentials, jiraTickets)

  // If the request is an HTTP POST, the context will contain the request body
  if (context.method === 'POST') {
    return { body }
  } else if (context.method === 'GET') {
    // If the request is an HTTP GET, the context will include a query string, if it exists
    return {
      query: context.query,
    }
  } else {
    return { statusCode: 405, statusMessage: 'Method not allowed' }
  }
}

function getTicketStatuses(jiraCredentials, jiraTickets) {
  let url = process.env.JIRA_URL + ``
  return axios.get(url, {
    headers: {
      'Authorization': `` // todo
    }
  })
}

function getProjectCommits(gitlabToken, projectId, since) {
    let url = process.env.GITLAB_URL + `/projects/${projectId}/repository/commits?all=true`
      + since ? `&since=${since}` : ``
    return axios.get(url, {
      headers: {
        'Authorization': `Bearer ${gitlabToken}`
      }
    })
}

function getProjectTags(gitlabToken, projectId) {
  let url = process.env.GITLAB_URL + `/projects/${projectId}/repository/tags`;
  return axios.get(url, {
    headers: {
      'Authorization': `Bearer ${gitlabToken}`
    }
  })
}

// Export the function
module.exports = { handle }
