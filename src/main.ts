import * as core from '@actions/core'
import {context} from '@actions/github'
import {wait} from './wait'

async function run(): Promise<void> {
  try {
    const ms = '1000'
    core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true

    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())

    const eventName = context.eventName
    core.info(eventName)
    let base: string | undefined
    let head: string | undefined

    switch (eventName) {
      case 'pull_request':
        base = context.payload.pull_request?.base?.sha
        head = context.payload.pull_request?.head?.sha
        break
      case 'push':
        base = context.payload.before
        head = context.payload.after
        break
      default:
        core.setFailed(
          `This action only supports pull requests and pushes, ${context.eventName} events are not supported. ` +
            "Please submit an issue on this action's GitHub repo if you believe this in correct."
        )
    }
    core.info(`base: ${base}, head: ${head}`)

    // Ensure that the base and head properties are set on the payload.
    if (!base || !head) {
      core.setFailed(
        `The base and head commits are missing from the payload for this ${context.eventName} event. ` +
          "Please submit an issue on this action's GitHub repo."
      )

      // To satisfy TypeScript, even though this is unreachable.
      base = ''
      head = ''
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
