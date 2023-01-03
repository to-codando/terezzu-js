export const mainController = ({model, hooks, eventDrive }) => {

	// hooks.afterOnRender(() => {
	// 	eventDrive.emit("onAppMainRender", { ok: true })
	// })

	const setState = () => {
		model.setState({ text: 'Novo texto' })
	}

	const getState = () => {
		return model.getState()
	}

	const show = (data) => {
		return 'asfasf'
	}

	return { setState, getState, show }
	
}


