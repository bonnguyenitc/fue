import { GluegunToolbox } from "gluegun"
import { showGeneratorHelp } from "../tools/generators"
import { p, command, heading } from "../tools/pretty"

module.exports = {
  dashed: true,
  alias: ["h"],
  description: "Displays Ignite CLI help",
  run: async (toolbox: GluegunToolbox) => {
    const { meta, parameters } = toolbox
    p()
    if (
      parameters.second &&
      (parameters.second === "g" || parameters.second.startsWith("generat"))
    ) {
      return showGeneratorHelp()
    }
    heading(`Welcome to FUE CLI ${meta.version()}!`)
    p()
    p("fue CLI is a cli that helps you create base for new project")
    p()
    heading("Commands")
    p()
    command("new             ", "Creates a new base source", ["fue new"])
    p()
    command("generate (g)    ", "Generates components and other app features", [
      "ignite generate <generator><form,...>> <name-name-name> --reactnative <--module>",
      "ignite generate <generator> --react",
      "ignite generate <generator> --laravel",
      "ignite generate <generator> --spring",
    ])
  },
}
