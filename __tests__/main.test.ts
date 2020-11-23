import {Context} from '@actions/github/lib/context'
import {WebhookPayload} from '@actions/github/lib/interfaces'
import {getBaseAndHead} from '../src/github'

describe('pull_request', () => {
  let context: Context
  let payload: WebhookPayload
  beforeEach(() => {
    context = new Context()
    payload = {}
    payload.pull_request = {
      number: 1,
      base: {
        sha: 'base_sha'
      },
      head: {
        sha: 'head_sha'
      }
    }
    context.eventName = 'pull_request'
    context.payload = payload
  })

  it('returns base_sha and head_sha', () => {
    const baseAndHead = getBaseAndHead(context)
    expect(baseAndHead.base).toEqual('base_sha')
    expect(baseAndHead.head).toEqual('head_sha')
  })
})

describe('push', () => {
  let context: Context
  let payload: WebhookPayload
  beforeEach(() => {
    context = new Context()
    payload = {}
    payload.before = 'before'
    payload.after = 'after'
    context.eventName = 'push'
    context.payload = payload
  })

  it('returns before and after', () => {
    const baseAndHead = getBaseAndHead(context)
    expect(baseAndHead.base).toEqual('before')
    expect(baseAndHead.head).toEqual('after')
  })
})
