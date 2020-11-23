import * as core from '@actions/core'
import {context} from '@actions/github'
const github = require('@actions/github')
import {getBaseAndHead} from './github'

async function run(): Promise<void> {
  try {
    if (context.eventName !== 'pull_request') {
      core.setOutput('completed', false)
      core.setOutput('description', 'only support pull_request event')
      return
    }
    const baseAndHead = getBaseAndHead(context)
    core.info(`${baseAndHead.base}, ${baseAndHead.head}`)

    const myToken = core.getInput('myToken')
    const octokit = github.getOctokit(myToken)
    const {data: pullRequest} = await octokit.pulls.get({
      owner: 'nakamasato',
      repo: 'typescript-action',
      pull_number: context.payload.pull_request?.number,
      mediaType: {
        format: 'diff'
      }
    })
    core.info(pullRequest)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
