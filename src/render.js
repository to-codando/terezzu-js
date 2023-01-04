import { observerFactory } from "./observer.factory.js"
import { html, css } from "./tagged.function.js"
import { hooksFactory } from "./hooks.factory.js"
import { pubsubFactory } from "./pubsub.factory.js"

const eventDrive = pubsubFactory()
const context = observerFactory({})

const _isObject = (payload) => {
	return (
		typeof payload === "object" && payload !== null && !Array.isArray(payload)
	)
}

const _createElement = (HTM, props) => { 
	const element = document.createElement(HTM.type || "div")
	const attributes = HTM.props ? Object.keys(HTM.props) : []
	_createChildren(element, HTM, props)

	attributes.forEach((key) => {
		const isEvent = /^on/.test(key)
		const isData = /^data-/.test(key)

		if (isEvent) {
			element[key.toLowerCase()] = (event) => HTM.props[key](event)
		}

		if (isData) {
			const dataProp = HTM.props[key]
			const datasetKeys = Object.keys(HTM.props)

			element.setAttribute(key, dataProp)

			const prop = key.replace("data-", "")
			props.set({ ...props.get(), [prop]: dataProp })
		}

		if (!isEvent && !isData) {
			element.setAttribute(key, HTM.props[key])
		}
	})

	return element
}

const _createChildren = (element, HTM, props) => {
	// console.log(element, HTM)

	HTM.children.forEach((child) => {
		let childElement = null

		if (_isObject(child)) {
			element.insertAdjacentElement("beforeend", _createElement(child, props))
			return
		}

		if (Array.isArray(child)) {
			child.map((son) => {
				childElement = _createElement(son, props)
				element.insertAdjacentElement("beforeend", childElement)
			})
			return
		}

		element.append(child)
	})
}

const applyContext = (text, id) => text.replace(/ctx/gi, id)

const _bindStyles = (selector, view) => {
	const styleExists = document.querySelector(`style#${selector}`)
	if (styleExists) return

	const styleElement = document.createElement("style")
	const styles = view.styles()
	styleElement.setAttribute("id", selector)

	styleElement.innerHTML = applyContext(styles, `[data-component=${selector}]`)
	document.querySelector("head").append(styleElement)
}

const _setProps = (props, element) => {
	for (let prop in element.dataset) {
		props.merge({
			...props.get(),
			[prop]: element.dataset[prop],
		})
	}

}

const _removeDataset = (element) => {
	for (let key in element.dataset) {
		if (key !== "component") element.removeAttribute(`data-${key}`)
	}
}

const _componentCreator = (element, componentFactory, callback = () =>{}) => {
	const state = observerFactory({})
	const props = observerFactory({})
	const hooks = hooksFactory()

	_setProps(props, element)
	hooks.afterOnRender(() => {
		if(callback && typeof callback === 'function') callback(element)
		_removeDataset(element)
	})
	const _component = componentFactory(state)
	const _model = _component.model(state)
	const _controller = _component.controller({model: _model, hooks, props: props.get(), eventDrive, context })
	const _view = _component.view({ controller: _controller, state: state.get(), html, css })
	let templateHTML = _view.template({ state: state.get(), props: props.get() })
	let templateElement = _createElement(templateHTML, props)

	_bindStyles(element.dataset.component, _view)

	hooks.emit("beforeOnRender", {})
	element.innerHTML = ""
	element.insertAdjacentElement("afterbegin", templateElement)

	state.on(() => {
		hooks.emit("beforeOnRender", {})
		templateHTML = _view.template({ state: state.get(), props: props.get() })
		templateElement = _createElement(templateHTML, props)
		element.innerHTML = ""
		element.insertAdjacentElement("afterbegin", templateElement)
		hooks.emit("afterOnRender", {})
	})

	hooks.emit("afterOnRender", {})
	hooks.emit("onInit", {})
}

const _createComponent = (componentFactory, _componentCreator, elements, callback) => {
	elements.forEach((element) => {
		_componentCreator(element, componentFactory, callback)
	})
}

export const render = (componentFactory, selector, callback, context = document.body) => {
	const _selector = selector ? `[data-component="${selector}"]` : null
	const _context = context
	const elements = Array.from(_context.querySelectorAll(_selector))
	_createComponent(componentFactory, _componentCreator, elements, callback)
}