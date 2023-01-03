import { menuModel as model } from './model.js'
import { menuView as view} from './view.js'
import { menuController as controller } from './controller.js'

export const appMenu = (state) => ({
	state,
	view,
	controller,
	model,
})