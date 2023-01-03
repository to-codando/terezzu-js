import { mainModel as model } from './model.js'
import { mainView as view} from './view.js'
import { mainController as controller } from './controller.js'

export const appMain = (state) => ({
	state,
	view,
	controller,
	model,
})