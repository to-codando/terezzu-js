import { headerModel as model } from './model.js'
import { headerView as view} from './view.js'
import { headerController as controller } from './controller.js'

export const appHeader = (state) => ({
	state,
	view,
	controller,
	model,
})