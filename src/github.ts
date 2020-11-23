import * as core from '@actions/core'
import {Context} from '@actions/github/lib/context'

export type BaseAndHead = {
  base: string
  head: string
}

export function getBaseAndHead(ctx: Context): BaseAndHead {
  switch (ctx.eventName) {
    case 'pull_request':
      return {
        base: ctx.payload.pull_request?.base?.sha,
        head: ctx.payload.pull_request?.head?.sha
      }
    case 'push':
      return {
        base: ctx.payload.before,
        head: ctx.payload.after
      }
    default:
      core.setFailed(
        `This action only supports pull requests and pushes, ${ctx.eventName} events are not supported. ` +
          "Please submit an issue on this action's GitHub repo if you believe this in correct."
      )
      return {
        base: '',
        head: ''
      }
  }
}
