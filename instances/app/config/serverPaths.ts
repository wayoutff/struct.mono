import path from 'path'
import fs from 'fs'

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

const paths = {
  dotenv: resolveApp('.env'),
  clientBuild: resolveApp('build/client'),
  srcClient: resolveApp('Root'),
  srcShared: resolveApp('main'),
  build: resolveApp('dist'),
  publicPath: '/static/'
}

export { paths }
