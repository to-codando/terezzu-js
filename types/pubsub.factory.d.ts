interface IObject<T> {
	[key: string]: T;
}

interface IHandler {
	<T>(arg: T): void;
}

interface Isubscriber {
	eventName: string;
	handler: IHandler
}

interface IEmitter {
	eventName: string;
	handler: IHandler;
}

interface IEvent<T> {
	eventName: string;
	payload: IObject<T>;
}

export function pubsubFactory(): {
	on: (eventName: string, handler: IHandler) => Isubscriber
	off: ({ eventName, handler }: Isubscriber) => void
	emit: <T>(event: IEvent<T>) => void
}


