import { GluegunToolbox } from "gluegun"
import { p } from "./pretty"

export const isAndroidInstalled = (toolbox: GluegunToolbox): boolean => {
  const androidHome = process.env.ANDROID_HOME
  const hasAndroidEnv = !toolbox.strings.isBlank(androidHome)
  const hasAndroid = hasAndroidEnv && toolbox.filesystem.exists(`${androidHome}/tools`) === "dir"

  return Boolean(hasAndroid)
}

type PullBoilerplateOptions = {
  gitRepo: string
  targetPath: string
  overwrite?: boolean
}

/**
 * Pull the boilerplate over to the destination folder.
 *
 */
export async function pullBoilerplate(toolbox: GluegunToolbox, options: PullBoilerplateOptions) {
  const { filesystem, system, print } = toolbox
  const { exists } = filesystem
  const { gitRepo, targetPath } = options
  // const { copyAsync, path } = filesystem
  const parentDir = targetPath.split("/").slice(0, -1).join("/")
  const folderName = gitRepo.split("/")?.at(-1)?.replace(".git", "")
  const dirFromGit = `${parentDir}/${folderName}`

  if (exists(targetPath)) {
    const alreadyExists = `Error: There's already a folder name ${folderName}.`
    p(print.colors.yellow(alreadyExists))
    process.exit(1)
  }

  // pull source
  await system.run(`git clone ${gitRepo}`, { trim: true })
  await system.run(`mv ${dirFromGit} ${targetPath}`, { trim: true })
  // ensure the destination folder exists
  return await filesystem.dirAsync(targetPath)
}
