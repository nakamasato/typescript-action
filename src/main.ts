import * as core from '@actions/core'
import {context} from '@actions/github'
import {wait} from './wait'

type BaseAndHead = {
  base: string
  head: string
}

async function run(): Promise<void> {
  try {
    const ms = '1000'
    core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true

    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())

    const baseAndHead = getBaseAndHead(context.eventName)
    core.info(`${baseAndHead.base}, ${baseAndHead.head}`)
  } catch (error) {
    core.setFailed(error.message)
  }
}

function getBaseAndHead(eventName: string): BaseAndHead {
  switch (eventName) {
    case 'pull_request':
      return {
        base: context.payload.pull_request?.base?.sha,
        head: context.payload.pull_request?.head?.sha
      }
    case 'push':
      return {
        base: context.payload.before,
        head: context.payload.after
      }
    default:
      core.setFailed(
        `This action only supports pull requests and pushes, ${context.eventName} events are not supported. ` +
          "Please submit an issue on this action's GitHub repo if you believe this in correct."
      )
      return {
        base: '',
        head: ''
      }
  }
}

run()
