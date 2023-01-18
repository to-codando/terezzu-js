import { observerFactory } from './observer.factory.js'
import { html, css } from './tagged.function.js'
import { hooksFactory } from './hooks.factory.js'
import { pubsubFactory } from './pubsub.factory.js'

export const eventDrive = pubsubFactory()
const context = observerFactory({})
const cacheUUID = observerFactory({ value: '' })

const _isObject = (payload) => {
  return (
    typeof payload === 'object' && payload !== null && !Array.isArray(payload)
  )
}

const execute = (validator, callback) => {
  if (validator()) callback(validator())
}

const _createElement = (HTM, props, scopeId) => {
  const element = document.createElement(HTM.type || 'div')
  const attributes = HTM.props ? Object.keys(HTM.props) : []

  _createChildren(element, HTM, props, scopeId)

  attributes.forEach((key) => {
    const isEvent = () => /^on/.test(key)
    const isData = () => /^data-/.test(key)
    const isOther = () => !isEvent() && !isData()

    execute(isEvent, () => {
      element[key.toLowerCase()] = (event) => HTM.props[key](event)
    })

    execute(isData, () => {
      const dataProp = HTM.props[key]
      const prop = key.replace('data-', '')

      element.setAttribute(key, dataProp)
      props.set({ ...props.get(), [prop]: dataProp })
    })

    execute(isOther, () => {
      element.setAttribute(key, HTM.props[key])
    })
  })

  if (element?.classList?.value && scopeId) {
    element.classList.value = `${scopeId}-${element.classList.value}`
  }

  return element
}

const _createChildren = (element, HTM, props, scopeId) => {
  // console.log(element, HTM)

  HTM.children.forEach((child) => {
    let childElement = null

    const isObject = () => _isObject(child)
    const isArray = () => Array.isArray(child)
    const isElement = () => !isObject() && !isArray()

    execute(isObject, () => {
      element.insertAdjacentElement(
        'beforeend',
        _createElement(child, props, scopeId)
      )
    })

    execute(isArray, () => {
      child.map((son) => {
        childElement = _createElement(son, props, scopeId)
        element.insertAdjacentElement('beforeend', childElement)
      })
    })

    isElement() && element.append(child)
  })
}

const random = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)

const createID = () => `${random()}`

const _applyContext = (text, id) => {
  let textContent = text.replace(/\[scope\]/gi, `[scope=${id}]`)
  return textContent.replace(/\D\.+(\w+)/gi, `.${id}-$1`)
}

const _createSelector = (text) =>
  text
    .split(/(?=[A-Z])/)
    .join('-')
    .toLowerCase()

const _bindStyles = (selector, view, scopeId) => {
  const styleExists = document.querySelector(`style#${scopeId}`)
  if (styleExists) return

  const styleElement = document.createElement('style')
  const styles = view.styles()
  styleElement.setAttribute('id', scopeId)

  styleElement.innerHTML = _applyContext(styles, `${scopeId}`)
  document.querySelector('head').append(styleElement)
}

const _setProps = (props, element) => {
  for (let prop in element.dataset) {
    props.merge({
      ...props.get(),
      [prop]: element.dataset[prop]
    })
  }
}

const _removeDataset = (element) => {
  for (let key in element.dataset) {
    if (key !== 'component') element.removeAttribute(`data-${key}`)
  }
}

const _createElementUUID = (selector) => {
  const scopeId = `${_createSelector(selector)}-${createID()}`
  cacheUUID.set({ value: scopeId })
  return scopeId
}

const _getElementUUID = () => {
  const { value: scopeId } = cacheUUID.get()
  return scopeId
}

const _componentCreator = (
  element,
  componentFactory,
  callback = () => {},
  position = 0
) => {
  const state = observerFactory({})
  const props = observerFactory({})
  const hooks = hooksFactory()

  _setProps(props, element)
  hooks.afterOnRender(() => {
    if (callback && typeof callback === 'function') callback(element)
    _removeDataset(element)
  })

  const _component = componentFactory(state)
  const _model = _component.model(state)
  const _controller = _component.controller({
    model: _model,
    hooks,
    props: props.get(),
    eventDrive,
    context
  })
  const _view = _component.view({
    controller: _controller,
    state: state.get(),
    html,
    css
  })
  const selector = element.dataset.component

  const scopeId = !position ? _createElementUUID(selector) : _getElementUUID()

  let templateHTML = _view.template({ state: state.get(), props: props.get() })
  let templateElement = _createElement(templateHTML, props, scopeId)

  element.setAttribute('scope', scopeId)
  _bindStyles(selector, _view, scopeId)

  hooks.emit('beforeOnRender', {})
  element.innerHTML = ''
  element.insertAdjacentElement('afterbegin', templateElement)

  state.on(() => {
    hooks.emit('beforeOnRender', {})
    templateHTML = _view.template({ state: state.get(), props: props.get() })
    templateElement = _createElement(templateHTML, props, scopeId)
    element.innerHTML = ''
    element.insertAdjacentElement('afterbegin', templateElement)
    hooks.emit('afterOnRender', {})
  })

  hooks.emit('afterOnRender', {})
  hooks.emit('onInit', {})
}

const _createComponent = (
  componentFactory,
  _componentCreator,
  elements,
  callback
) => {
  elements.forEach((element, index) => {
    _componentCreator(element, componentFactory, callback, index)
  })
}

export const render = (componentFactory, context = document.body, callback) => {
  if (!componentFactory?.name) {
    const errorMessage =
      'Componente factory is not a named function and must be.'
    throw new Error(errorMessage)
  }

  const selector = `[data-component=${componentFactory.name}]`
  const elements = Array.from(context.querySelectorAll(selector))
  _createComponent(componentFactory, _componentCreator, elements, callback)
}
