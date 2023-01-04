interface IObject<T> {
	[key: string]: T
}

interface IHandler {
	[key: string]: <T>(payload: IObject<T>) => void;
}

interface IMutator {
    [key: string]: <TState, TPayload>(state: IObject<TState>, payload: IObject<TPayload>) => TState
}

interface IMutations {
    [key: string]: IMutator
}

export function storeFactory<T>({
	state,
	mutations,
}: {
	state: IObject<T>
	mutations: IMutations
}): {
	on: (
		eventName: string,
		callback: IHandler
	) => {
		eventName: string
		handler: IHandler
	}
	off: (handler: IHandler) => void
	emit: <T>(eventName: string, payload: IObject<T>) => void
	onUpdated: (callback: IHandler) => void
	prev: () => void
	next: () => void
	getState: (index?: number) => any
	startNavigator: () => void
}
