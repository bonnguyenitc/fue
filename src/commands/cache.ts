import { GluegunToolbox } from "gluegun"
import { cache } from "../tools/cache"
import { command, heading, igniteHeading, p } from "../tools/pretty"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const path = (_toolbox: GluegunToolbox) => {
  console.log(cache.rootdir())
}

const clear = (toolbox: GluegunToolbox) => {
  const { print } = toolbox
  const spinner = print.spin(`Removing the dependency cache at '${cache.rootdir()}'`)
  cache.clear()
  spinner.succeed(`Removed the dependency cache at '${cache.rootdir()}'`)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const help = (_toolbox: GluegunToolbox) => {
  igniteHeading()
  heading("fue cache")
  p()
  p("fue cache is a parent command for interacting with the dependency cache")
  p("fue uses on your machine to speed up the packager installation process.")
  p()
  heading("Subcommands:")
  p()
  const width = 10
  command({ m: "help", width }, "Display this message", ["fue cache help"])
  p()
  command({ m: "path", width }, "Return the path of the dependency cache on your computer", [
    "fue cache path",
  ])
  p()
  command({ m: "clear", width }, "Clear the dependency cache", ["fue cache clear"])
  igniteHeading()
}

const subcommands = {
  help,
  path,
  clear,
} as const
type SubCommand = typeof subcommands[keyof typeof subcommands]

module.exports = {
  alias: ["c"],
  description: "Commands related to the dependency cache for Ignite",
  run: async (toolbox: GluegunToolbox) => {
    const { parameters } = toolbox

    const subcommand: SubCommand | undefined = subcommands[parameters.first]

    if (subcommand === undefined) {
      help(toolbox)
      return
    }

    subcommand(toolbox)
  },
}
