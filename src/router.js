import { render, eventDrive } from './render.js'

export const router = ({ routes = [], context = null }) => {
  const _routes = [...routes]
  let _routerElement = null

  const _bindListeners = () => {
    window.addEventListener('hashchange', () => {
      eventDrive.emit('onDestroy', { destroy: true, action: _mountRouteByHash })

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

  const _mountRouteByHash = (hash = null) => {
    const hashValue = hash || window.location.hash || ''
    const route = _getRouteByHash(hashValue) || _getRouteDefault()
    const { component, children } = route.mount()
    const buildStyles = true
    _createComponentElement(_routerElement, component.name)
    render(component, _routerElement, children, buildStyles)
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
