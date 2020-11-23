import * as core from '@actions/core'
import {context} from '@actions/github'
import {getBaseAndHead} from './github'

async function run(): Promise<void> {
  try {
    const baseAndHead = getBaseAndHead(context)
    core.info(`${baseAndHead.base}, ${baseAndHead.head}`)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
