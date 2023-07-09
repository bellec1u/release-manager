const axios = require('axios');

const gitlabApiUrl = process.env.GITLAB_API_URL
const gitlabToken = process.env.GITLAB_TOKEN
const jiraApiUrl = process.env.JIRA_API_URL
const jiraUsername = process.env.JIRA_USERNAME
const jiraPassword = process.env.JIRA_PASSWORD
const issueRegex = new RegExp(process.env.ISSUE_REGEX, 'g')
const requestMaxResults = 10000
const defaultNumberOfTags = 10

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
 *
 * Function flows:
 * 1. if fromTag & toTag query parameters are mentioned, the function will return the delta tickets between the two releases
 * 2. else, the function will return the numberOfTags latest releases
 *
 */
const handle = async (context) => {

  if (context.method !== 'GET') {
    return { statusCode: 405, message: 'Method not allowed' }
  }

  // query parameter extraction
  let projectId = context.query['projectId']
  if (!projectId) {
    return { statusCode: 400, message: 'The "project" parameter is missing' }
  }

  let fromTagNumber = context.query['fromTag']
  let toTagNumber = context.query['toTag']

  let numberOfTags = Number(context.query['numberOfTags'])
  numberOfTags = numberOfTags ? numberOfTags : defaultNumberOfTags
  // we need to increase the number of tags by one in order to retrieve all requested tags
  numberOfTags++

  // extract gitlab last tags
  let tags
  try {
    if (fromTagNumber && toTagNumber) {
      tags = [
        (await getProjectTag(projectId, toTagNumber)).data,
        (await getProjectTag(projectId, fromTagNumber)).data
      ]
    } else {
      tags = (await getProjectTags(projectId, numberOfTags)).data
    }
  } catch (e) {
    return { statusCode: 500, message: 'An error occurred while retrieving the project tags' }
  }

  let commits
  try {
    if (fromTagNumber && toTagNumber) {
      commits = (await getProjectCommits(projectId, tags[1]['commit']['committed_date'], tags[0]['commit']['committed_date'])).data
    } else {
      commits = (tags.length < numberOfTags
          ? (await getProjectCommits(projectId))
          : (await getProjectCommits(projectId, tags[numberOfTags - 1]['commit']['committed_date'])))
          .data
    }
  } catch (e) {
    return { statusCode: 500, message: 'An error occurred while retrieving the project commits' }
  }

  // mapping tag with commits
  let tagsTickets = {}
  let jiraIssues = []

  let tagIndex = fromTagNumber && toTagNumber ? 0 : -1;
  for (let commit of commits) {

    if (tagIndex + 1 < tags.length && commit['committed_date'] < tags[tagIndex + 1]['commit']['committed_date']) {
      tagIndex++
    }

    let currentTag = tagIndex === -1 ? 'Next release' : tags[tagIndex]['name']
    if (!(currentTag in tagsTickets)) {
      tagsTickets[currentTag] = []
    }

    let tickets = commit['title'].match(issueRegex)
    jiraIssues = tickets ? Array.from(new Set([ ...jiraIssues, ...tickets ])) : jiraIssues
    tagsTickets[currentTag] = tickets ? Array.from(new Set([ ...tagsTickets[currentTag], ...tickets ])) : tagsTickets[currentTag]

  }

  // get jira ticket statuses
  let issues
  try {
    issues = (await getTicketData(jiraIssues)).data['issues']
  } catch (e) {
    return { statusCode: 500, message: 'An error occurred while retrieving the jira issues' }
  }
  let issuesMap = {}
  issues.forEach(issue => issuesMap[issue['key']] = issue['fields']['status']['name'])

  // map jira issue with tag commits
  for (let tagTickets in tagsTickets) {
    for (let ticket in tagsTickets[tagTickets]) {
      let issue = tagsTickets[tagTickets][ticket]
      tagsTickets[tagTickets][ticket] = { key: issue, status: issuesMap[issue] }
    }
  }

  return tagsTickets
}

function getTicketData(jiraTickets) {
  return axios.get(
      `${jiraApiUrl}/search?jql=key in (${jiraTickets})&maxResults=${requestMaxResults}&fields=status,subtasks`,
      { auth: { username: jiraUsername, password: jiraPassword } })
}

function getProjectCommits(projectId, since, until) {
  return axios.get(
      `${gitlabApiUrl}/projects/${projectId}/repository/commits?per_page=${requestMaxResults}` + (since ? `&since=${since}` : ``) + (until ? `&until=${until}` : ``),
      { headers: { Authorization: `Bearer ${gitlabToken}` } })
}

function getProjectTags(projectId, numberOfTags) {
  return axios.get(
      `${gitlabApiUrl}/projects/${projectId}/repository/tags?per_page=${numberOfTags}`,
      { headers: { Authorization: `Bearer ${gitlabToken}` } })
}

function getProjectTag(projectId, tagNumber) {
  return axios.get(
      `${gitlabApiUrl}/projects/${projectId}/repository/tags/${tagNumber}`,
      { headers: { Authorization: `Bearer ${gitlabToken}` } })
}

// Export the function
module.exports = { handle }
