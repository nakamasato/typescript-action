import * as core from '@actions/core'
import github from '@actions/github'
type FileStatus = 'added' | 'modified' | 'removed' | 'renamed'

async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds')
    core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    const client = github.getOctokit(core.getInput('token', { required: true }))

    core.setOutput('time', new Date().toTimeString())

    const eventName = github.context.eventName
    console.log(eventName)
    let base: string | undefined
    let head: string | undefined

    switch (eventName) {
      case 'pull_request':
        base = github.context.payload.pull_request?.base?.sha
        head = github.context.payload.pull_request?.head?.sha
        break
      case 'push':
        base = github.context.payload.before
        head = github.context.payload.after
        break
      default:
        core.setFailed(
          `This action only supports pull requests and pushes, ${github.context.eventName} events are not supported. ` +
          "Please submit an issue on this action's GitHub repo if you believe this in correct."
        )
    }

    // Ensure that the base and head properties are set on the payload.
    if (!base || !head) {
      core.setFailed(
        `The base and head commits are missing from the payload for this ${github.context.eventName} event. ` +
        "Please submit an issue on this action's GitHub repo."
      )

      // To satisfy TypeScript, even though this is unreachable.
      base = ''
      head = ''
    }
    console.log(`base: ${base}, head: ${head}`);

    const response = await client.repos.compareCommits({
      base,
      head,
      owner: github.context.repo.owner,
      repo: github.context.repo.repo
    })

    // Ensure that the request was successful.
    if (response.status !== 200) {
      core.setFailed(
        `The GitHub API for comparing the base and head commits for this ${github.context.eventName} event returned ${response.status}, expected 200. ` +
        "Please submit an issue on this action's GitHub repo."
      )
    }

    // Ensure that the head commit is ahead of the base commit.
    if (response.data.status !== 'ahead') {
      core.setFailed(
        `The head commit for this ${github.context.eventName} event is not ahead of the base commit. ` +
        "Please submit an issue on this action's GitHub repo."
      )
    }

    // Get the changed files from the response payload.
    const files = response.data.files
    const all = [] as string[],
      added = [] as string[],
      modified = [] as string[],
      removed = [] as string[],
      renamed = [] as string[],
      addedModified = [] as string[]
    for (const file of files) {
      const filename = file.filename
      all.push(filename)
      switch (file.status as FileStatus) {
        case 'added':
          added.push(filename)
          addedModified.push(filename)
          break
        case 'modified':
          modified.push(filename)
          addedModified.push(filename)
          break
        case 'removed':
          removed.push(filename)
          break
        case 'renamed':
          renamed.push(filename)
          break
        default:
          core.setFailed(
            `One of your files includes an unsupported file status '${file.status}', expected 'added', 'modified', 'removed', or 'renamed'.`
          )
      }
    }


  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
