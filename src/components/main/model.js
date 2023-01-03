export const mainModel = (state) => {

state.merge({ 
	text: 'ok', 
	menuList: [
		'Item 1',
		'Item 2',
		'Item 3'
	]
})

	const initState = (payload) => {
		state.set({ ...payload })
	}

	const setState = (payload) => {
		state.set({ ...state.get(), ...payload })
	}

	const getState = () => state.get()

	return { initState, setState, getState }
}