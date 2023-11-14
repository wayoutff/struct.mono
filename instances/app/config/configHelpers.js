import { interpolateName} from 'loader-utils'
import path from 'path'

function normalizeLocalIdentName (pattern, name) {
    return pattern.replace(/\[local\]/gi, name)
}

function normalizePath (context, filePath) {
    return path.relative(context, filePath).replace(/\\/g, "/")
}

export function generateScopedName (pattern) {
  const context = process.cwd()
  return function generate(localName, filepath) {
    const name = normalizeLocalIdentName(pattern, localName)
    const loaderContext = { resourcePath: filepath }

    const request = normalizePath(context, filepath)

    const loaderOptions = {
      content: `${request}\x00${localName}`,
      context,
    }

    const genericName = interpolateName(loaderContext, name, loaderOptions)
    return genericName
      .replace(new RegExp('[^a-zA-Z0-9\\-_\u00A0-\uFFFF]', 'g'), '-')
      .replace(/^((-?[0-9])|--)/, '_$1')
  }
}
  
export function getLocalIdent(loaderContext, localIdentName, localName, options) {
  options.context = process.cwd()
  const name = normalizeLocalIdentName(localIdentName, localName)
  const { context, hashPrefix } = options
  const { resourcePath } = loaderContext

  const request = normalizePath(context, resourcePath)

  options.content = `${hashPrefix + request}\x00${localName}`
  return interpolateName(loaderContext, name, options)
}

export const localIdentName = '[local]_[hash:base64:5]'
