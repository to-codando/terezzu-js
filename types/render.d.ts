interface IObject<T> {
	[key: string]: T;
}

interface IGenericIdentityFn {
	<Type>(arg: Type): Type;
}

interface ISubscriber extends IGenericIdentityFn {}
interface IUnsubscriber extends IGenericIdentityFn {}

interface IVoidCallback {
	<T>(payload: T): void;
}

interface IObserver<T = any> {
	on: (handler: ISubscriber) => ISubscriber;
	off: (targetHandler: IUnsubscriber) => void;
	set: <T>(payload: IObject<T>) => void;
	get: <T>() => IObject<T>;
	handlers: (payload: Array<ISubscriber>) => Array<ISubscriber>;
	merge: <T>(payload: IObject<T>, callback: IVoidCallback) => void;
}

interface IModel {
  [key: string]: (payload?: any) => any;
}

interface IController {
   [key: string]: (payload?: any) => any;
}

interface IView {
	template: <TModel, TData>({ state, props }: { state: IObject<TModel>, props: IObject<TData> }) => string;
  styles: () => string
}

interface IViewProps {
  html: (payload: any) => any;
  css: (payload: any) => any;
  controller: IController;
}

interface IComponent {
	state: IObserver;
	model: <T>(state: IObserver<T>) => IModel;
	view: ({ html, css, controller }: IViewProps) => IView;
	controller: IController;
}

interface IPubsubHandler {
	<T>(arg: T): void;
}

interface IPubsubSubscriber {
	eventName: string;
	handler: IPubsubHandler
}

interface IEvent<T> {
	eventName: string;
	payload: IObject<T>;
}

interface IPubsub {
	on: (eventName: string, handler: IPubsubHandler) => IPubsubSubscriber
	off: ({ eventName, handler }: IPubsubSubscriber) => void
	emit: <T>(event: IEvent<T>) => void
}

export const eventDrive: IPubsub;

export function render(
	componentFactory: <T>(state: IObserver<T>) => IComponent,
	context?: HTMLElement,
	callback?: (element: HTMLElement) => void
): void
