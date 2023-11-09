// import path from 'path'
const path = require('path')
const fs = require('fs')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) =>
  path.resolve(appDirectory, relativePath)

const paths = {
  dotenv: resolveApp('.env'),
  clientBuild: resolveApp('build/client'),
  srcClient: resolveApp('Root'),
  srcShared: resolveApp('main'),
  build: resolveApp('dist'),
  publicPath: '/static/'
}

paths.resolveModules = [paths.srcClient, paths.srcShared, 'node_modules']

module.exports = paths