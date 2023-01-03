export const headerController = ({model, hooks, eventDrive }) => {

	eventDrive.on('menu-click', (payload) => logger(payload))

	
	const logger = (data) => {
		console.log(data)
	}


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


