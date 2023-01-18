import { render, eventDrive } from './render.js'
import { router } from './router.js'

export const createApp = ({ appMain, routes }) => {
  let _config = null

  if (!appMain || typeof appMain !== 'function') {
    const appMainNotExist = 'appMain not is a Terezzu component and must be.'
    throw new Error(appMainNotExist)
  }

  const mount = (target = document.body) => {
    if (_config) return _config.mount()

    if (routes && Array.isArray(routes)) {
      return render(appMain, target, (context) => {
        router({ routes, context }).init()
      })
    }

    render(appMain, target)
  }

  const unmount = () => {
    if (_config) return _config.unmount()
    eventDrive.emit('onDestroy', { destroy: true })
  }

  const setup = (callback) => {
    if (!callback || typeof callback !== 'function') {
      const invalidSetup =
        'setup method is not a callback function and must be.'
      throw new Error(invalidSetup)
    }

    const options = {
      appMain,
      router,
      routes,
      render,
      eventDrive
    }

    _config = callback(options)
  }

  return { mount, unmount, setup }
}
