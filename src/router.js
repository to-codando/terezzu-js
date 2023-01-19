import { render, eventDrive } from './render.js'

export const router = ({ routes = [], context = null, type = 'component' }) => {
  const _routes = [...routes]
  const validTypes = ['component', 'app']
  let _routerElement = null

  const execute = (validator, callback, errorMessage) => {
    if (validator()) return callback(validator())
    if (errorMessage) throw new Error(errorMessage)
  }

  const _isValidType = (typeValue) =>
    validTypes.some((typeItem) => typeItem === typeValue)

  const _isType = (typeValue) => {
    return validTypes.includes(typeValue) && typeValue === type
  }

  const _bindListeners = () => {
    window.addEventListener('hashchange', () => {
      eventDrive.emit('onDestroy', { destroy: true })
      _mountRouteByHash()
    })
  }

  const _setRouterElement = () => {
    _routerElement = context?.querySelector('[data-component=routerView]')
  }

  const _loadMainRoute = () => {
    const mainRoute = _getMainRoute()
    navigate(mainRoute?.start)
  }

  const _getMainRoute = () => _routes.find((route) => !!route?.start)

  const _getRouteByHash = (hash) => {
    return _routes.find((route) => route.regex.test(hash))
  }

  const _getRouteDefault = () => _routes.find((route) => route?.default)

  const _createComponentElement = (parentElement, selector) => {
    const componentElement = document.createElement('div')
    componentElement.dataset.component = selector
    parentElement.innerHTML = ''
    parentElement.insertAdjacentElement('beforeend', componentElement)
  }

  const _mountRouteByHash = async (hash = null) => {
    const hashValue = hash || window.location.hash || ''
    const route = _getRouteByHash(hashValue) || _getRouteDefault()
    const { component, children } = await route.mount()
    const buildStyles = true

    _createComponentElement(_routerElement, component.name)

    execute(
      () => !_isValidType(type),
      () => {
        throw new Error(
          'router param type in not "component" or "app" and must be.'
        )
      }
    )

    execute(
      () => _isType('component'),
      () => render(component, _routerElement, children, buildStyles)
    )

    execute(
      () => _isType('app'),
      () => component.mount()
    )
  }

  const _getHash = () => window.location.hash

  const _hasActiveRoute = () => !!_getHash()

  const navigate = (path) => (window.location.hash = path)

  const init = () => {
    _bindListeners()
    _setRouterElement()
    _hasActiveRoute() ? _mountRouteByHash(_getHash()) : _loadMainRoute()
  }

  return { init, navigate }
}
