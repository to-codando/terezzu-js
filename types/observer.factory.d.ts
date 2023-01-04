interface IObject<T> {
	[key: string]: T;
}

interface IGenericIdentityFn {
	<T>(arg: T): void;
}

interface IVoidCallback {
	<T>(payload: T): void;
}

interface ISubscriber extends IGenericIdentityFn {}
interface IUnsubscriber extends IGenericIdentityFn {}

export interface IObserver<T> {
	on: (handler: ISubscriber) => ISubscriber;
	off: (targetHandler: IUnsubscriber) => void;
	set: <T>(payload: IObject<T>) => void;
	get: <T>() => IObject<T>;
	handlers: (payload: Array<ISubscriber>) => Array<ISubscriber>;
	merge: <T>(payload: IObject<T>, callback: IVoidCallback) => void;
}

export function observerFactory<T>(value: T): IObserver<T>
