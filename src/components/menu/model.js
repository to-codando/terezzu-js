export const menuModel = (state) => {

	state.merge({ text: 'ok', item: 'iniciado'})

	const initState = (payload) => {
		state.set({ ...payload })
	}

	const setFirstItem = ({ item }) => {
		state.set({ ...state.get(), item })
	}

	const setState = (payload) => {
		state.set({ ...state.get(), ...payload })
	}

	const getState = () => state.get()

	return { initState, setState, getState }
}