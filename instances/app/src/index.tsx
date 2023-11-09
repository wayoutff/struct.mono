// import { test } from '@struct/bar'

import * as React from 'react'
import { createRoot } from 'react-dom/client'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <div>
    hello
  </div>
)
//@ts-ignore
if (process.env.NODE_ENV === 'development') {
  //@ts-ignore
  if (module.hot) {
    //@ts-ignore
    module.hot.accept()
  }
}
