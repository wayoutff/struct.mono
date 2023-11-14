import path from 'path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { getLocalIdent, localIdentName } from './configHelpers.js'

export const isDev = process.env.NODE_ENV === 'development'
export const isProd = process.env.NODE_ENV === 'production'

export const getStyleLoaders = extra => {
  let loader = [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        modules: {
          localIdentName,
          getLocalIdent
        }
      }
    }
  ]

  if (extra) {
    if (Array.isArray(extra)) loader = loader.concat(extra)
    if (typeof extra === 'string') loader.push(extra)
  }

  return loader
}

export const getScriptLoaders = preset => {
  const options = {
    presets: ['@babel/env', '@babel/react'],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-transform-react-jsx'
    ]
  }
  if (preset) {
    options.presets.push(preset)
  }
  const babelLoader = {
    loader: 'babel-loader',
    options
  }
  return [babelLoader]
}

export const getPath = d => path.resolve(__dirname, d)

