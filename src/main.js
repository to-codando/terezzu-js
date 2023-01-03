import { render } from '../lib/render.js'
import { appMain } from './components/main/index.js'
import { appHeader } from './components/header/index.js'
import { appMenu } from './components/menu/index.js'

render(appMain, 'main', (appMainElement) => {
  render(appHeader, 'header', (appHeaderElement) => {
     render(appMenu, "menu", null, appHeaderElement)
  }, appMainElement)
 
})
