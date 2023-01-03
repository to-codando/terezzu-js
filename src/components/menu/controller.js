export const menuController = ({model, hooks, eventDrive }) => {
	
	const emitEvent = (eventName, payload) => {
		eventDrive.emit(eventName, payload)
	}

	const sendItem = (payload) => {
		emitEvent('menu-click', { item: payload })
	}

	const setFirstItem = () => {
		model.setState({ item: 'teste '})
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

	return { sendItem, setFirstItem, setState, getState, show, emitEvent }
	
}


