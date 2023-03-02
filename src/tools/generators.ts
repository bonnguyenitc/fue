import * as ejs from "ejs"
import { filesystem, GluegunToolbox, GluegunPatchingPatchOptions, patching, strings } from "gluegun"
import * as YAML from "yaml"
import { FRAMEWORKS, FRAMEWORKS_TYPES } from "./framework"
import { command, direction, heading, igniteHeading, p, warning } from "./pretty"

const NEW_LINE = filesystem.eol

export function runGenerator(
  toolbox: GluegunToolbox,
  generateFunc: (toolbox: GluegunToolbox) => Promise<void>,
  generator?: string,
) {
  const { parameters } = toolbox

  const { react, reactnative, laravel, spring } = parameters.options
  let framework: FRAMEWORKS_TYPES | undefined
  if (react) {
    framework = "react"
  }
  if (reactnative) {
    framework = "react-native"
  }
  if (laravel) {
    framework = "laravel"
  }
  if (spring) {
    framework = "spring"
  }

  if (!framework) {
    p()
    warning(`Please add flag framework`)
    command("", "", [
      "--react for react base",
      "--reactnative for react-native base",
      "--laravel for laravel base",
      "--spring for spring base",
    ])
    process.exit(1)
  }

  p()
  if (parameters.options.help || parameters.options.list) {
    // show help or list generators
    showGeneratorHelp(framework)
  } else {
    if (generator) {
      const isValid = validateGenerator(generator)
      if (!isValid) return
    } else {
      // catch-all, just show help
      showGeneratorHelp(framework)
      return
    }

    generateFunc(toolbox)
  }
}

function validateGenerator(generator?: string) {
  const generators = installedGenerators()

  if (!generators.includes(generator)) {
    warning(`⚠️  Generator "${generator}" isn't installed.`)
    p()

    if (availableGenerators().includes(generator)) {
      direction("Install the generator with:")
      p()
      command(`fue generate ${generator} --update`)
      p()
      direction("... and then try again!")
    } else {
      direction("Check your spelling and try again")
    }

    return false
  }

  return true
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function showGeneratorHelp(framework = "") {
  igniteHeading()
  heading("Generators")
  p()
  showGenerators(framework)
}

function showGenerators(framework: string) {
  if (!isIgniteProject()) {
    warning("⚠️  Not in an fue project root. Go to your fue project root to see generators.")
    return
  }

  const generators = installedGenerators()
  const longestGen = generators.reduce((c, g) => Math.max(c, g.length), 0)
  generators.forEach((g) => {
    // standard generators
    if (framework === FRAMEWORKS[1]) {
      command(g.padEnd(longestGen), `generates a ${g}`, [
        `fue g ${g} demo --react-native`,
        `fue g ${g} demo --react-native --module=auth`,
      ])
      return
    }
    command(g.padEnd(longestGen), `generates a ${g}`, [`fue g ${g} demo`])
  })
}

function isIgniteProject(): boolean {
  return filesystem.exists("./templates") === "dir"
}

function cwd() {
  return process.cwd()
}

function igniteDir() {
  return filesystem.path(cwd(), "")
}

function appDir() {
  return filesystem.path(cwd(), "src")
}

function templatesDir() {
  return filesystem.path(igniteDir(), "templates")
}

function frontMatter(contents: string) {
  const parts = contents.split(`---${NEW_LINE}`)
  if (parts.length === 1 || parts.length === 3) {
    return {
      data: parts[1] ? YAML.parse(parts[1]) : {},
      content: parts[2] ?? parts[0],
    }
  } else {
    return {}
  }
}

/**
 * Patch front matter configuration
 */
type Patch = GluegunPatchingPatchOptions & {
  path: string
  append?: string
  prepend?: string
  replace?: string
  skip?: boolean
}

/**
 * Handles patching files via front matter config
 */
async function handlePatches(data: { patches?: Patch[]; patch?: Patch }, dirIndex: string) {
  const patches = data.patches ?? []

  if (dirIndex) {
    patches.push({
      ...data.patch,
      path: dirIndex,
    })
  }
  for (const patch of patches) {
    const { path: patchPath, skip, ...patchOpts } = patch
    if (patchPath && !skip) {
      if (patchOpts.append) {
        await patching.append(patchPath, patchOpts.append)
      }
      if (patchOpts.prepend) {
        await patching.prepend(patchPath, patchOpts.prepend)
      }
      if (patchOpts.replace) {
        await patching.replace(patchPath, patchOpts.replace, patchOpts.insert)
      }
      await patching.patch(patchPath, patchOpts)
    }
  }
}

/**
 * Finds generator templates installed in the current project
 */
function installedGenerators(): string[] {
  const { subdirectories, separator } = filesystem

  const generators = subdirectories(templatesDir()).map((g) => {
    return g.split(separator).slice(-1)[0]
  })

  return generators
}

type GeneratorOptions = {
  name: string
  skipIndexFile?: boolean
  dir: string
  hasDir: boolean
  module: string
}

/**
 * Generates something using a template
 */
export function generateFromTemplate(
  generator: string,
  options: GeneratorOptions,
  toolbox: GluegunToolbox,
  framework: string,
): Promise<string>[] {
  // check framework
  const isReactNative = framework === FRAMEWORKS[1]
  const isReact = framework === FRAMEWORKS[0]
  const isLaravel = framework === FRAMEWORKS[2]
  const isSpring = framework === FRAMEWORKS[3]

  if (isReactNative) return generateFromTemplateReactNative(generator, options, toolbox)

  if (isReact) {
    warning(`⚠️  Please install generator for ${FRAMEWORKS[0]}`)
    process.exit(1)
  }
  if (isLaravel) {
    warning(`⚠️  Please install generator for ${FRAMEWORKS[2]}`)
    process.exit(1)
  }
  if (isSpring) {
    warning(`⚠️  Please install generator for ${FRAMEWORKS[3]}`)
    process.exit(1)
  }
}

/**
 * Generate for React-Native
 */
export function generateFromTemplateReactNative(
  generator: string,
  options: GeneratorOptions,
  toolbox: GluegunToolbox,
): Promise<string>[] {
  const { find, path, dir, separator } = filesystem
  const { pascalCase, kebabCase, camelCase, pluralize } = strings

  // permutations of the name
  const pascalCaseName = pascalCase(options.name)
  const kebabCaseName = kebabCase(options.name)
  const camelCaseName = camelCase(options.name)

  // passed into the template generator
  const props = { camelCaseName, kebabCaseName, pascalCaseName, ...options }

  // where are we copying from?
  const templateDir = path(templatesDir(), generator)

  // if generator is module and a dir
  if (generator === "module" && options.hasDir) {
    toolbox.print.error("Can not generate module with this dir!")
    process.exit(1)
  }
  // if generator is module so not a dir
  if (generator === "module" && !options.hasDir) {
    filesystem.copy(templateDir, path(appDir(), `${pluralize(generator)}/${options.dir}`))
    return [Promise.resolve(path(appDir(), `${pluralize(generator)}/${options.dir}`))]
  }

  // find the files
  const files = find(templateDir, { matching: "*" })

  // check generator is store
  const isStore = generator === "store"
  const isScreen = generator === "screen"
  const noDirForGenerators = isStore || isScreen

  if (noDirForGenerators && options.hasDir) {
    toolbox.print.error(`Can not generate this ${generator} in this dir!`)
    process.exit(1)
  }

  // loop through the files
  const newFiles = files.map(async (templateFilename: string) => {
    // get the filename and replace `NAME` with the actual name
    let filename = templateFilename
      .split(separator)
      .slice(-1)[0]
      .replace("NAME", isStore ? pascalCaseName : kebabCaseName)

    // strip the .ejs
    if (filename.endsWith(".ejs")) filename = filename.slice(0, -4)

    // read template file
    let templateContents = filesystem.read(templateFilename)

    // render ejs
    if (templateFilename.endsWith(".ejs")) {
      templateContents = ejs.render(templateContents, { props: { ...props, filename } })
    }

    // parse out front matter data and content
    const { data, content } = frontMatter(templateContents)
    if (!content) {
      warning("⚠️  Unable to parse front matter. Please check your delimiters.")
      return ""
    }

    // check generator is store/screen
    const inModule = typeof options.module === "string"

    // where are we copying to?
    let generatorDir = path(appDir(), options.dir)
    let generatorDirIndex = path(
      appDir(),
      options.dir.split("/").slice(0, -1).join("/") + "/index.ts",
    )
    if (!options.hasDir) {
      generatorDir = path(appDir(), `components/${pluralize(generator)}/${options.dir}`)
      generatorDirIndex = path(appDir(), `components/${pluralize(generator)}/index.ts`)
      if (inModule) {
        const isComponent = ["form", "modal", "widget"].includes(generator)
        const generatorName = isComponent ? "components" : pluralize(generator)
        generatorDir = path(appDir(), `modules/${options.module}/${generatorName}/${options.dir}`)
        generatorDirIndex = path(appDir(), `modules/${options.module}/${generatorName}/index.ts`)

        if (noDirForGenerators) {
          generatorDir = path(appDir(), `modules/${options.module}/${pluralize(generator)}`)
          generatorDirIndex = path(
            appDir(),
            `modules/${options.module}/${pluralize(generator)}/index.ts`,
          )
        }
      }
    }

    const isIndexDirExist = filesystem.exists(generatorDirIndex) === "file"

    if (isIndexDirExist) {
      // apply any provided patches
      await handlePatches(data, generatorDirIndex)
    }

    const defaultDestinationDir = generatorDir // e.g. app/components, app/screens, app/models
    const templateDestinationDir = data.destinationDir
    const destinationDir = templateDestinationDir
      ? path(cwd(), templateDestinationDir)
      : defaultDestinationDir
    const destinationPath = path(destinationDir, data.filename ?? filename)

    // ensure destination folder exists
    dir(destinationDir)
    // write to the destination file
    filesystem.write(destinationPath, content)

    return destinationPath
  })

  return newFiles
}

/**
 * Directory where we can find fue CLI generator templates
 */
function sourceDirectory(): string {
  return filesystem.cwd()
}

/**
 * Finds generator templates in fue CLI
 */
function availableGenerators(): string[] {
  const { subdirectories, separator } = filesystem
  return subdirectories(sourceDirectory() + "/templates").map(
    (g) => g.split(separator).slice(-1)[0],
  )
}
