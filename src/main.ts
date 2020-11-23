import * as core from '@actions/core'
import {context} from '@actions/github'
import {getOctokitOptions} from '@actions/github/lib/utils'
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
    core.info(`pull_request: ${context.payload.pull_request}`)

    const myToken = core.getInput('token')
    const octokit = getOctokitOptions(myToken)
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
