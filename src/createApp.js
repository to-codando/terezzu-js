import { render, eventDrive } from './render.js'
import { router } from './router.js'

export const createApp = ({ appName, mount }) => {
  let _config = null

  if (!mount || typeof mount !== 'function') {
    const mountFailMessage = 'mount method not is a function and must be.'
    throw new Error(mountFailMessage)
  }

  const mounter = (target = document.body) => {
    if (_config) return _config.mount()
    mount(target)
  }

  const unmounter = () => {
    if (_config) return _config.unmount()
    eventDrive.emit('onDestroy', { destroy: true })
  }

  const setuper = (callback) => {
    if (!callback || typeof callback !== 'function') {
      const invalidSetup =
        'setup method is not a callback function and must be.'
      throw new Error(invalidSetup)
    }

    const options = {
      router,
      render,
      eventDrive
    }

    _config = callback(options)
  }

  return {
    name: appName,
    mount: mounter,
    unmount: unmounter,
    setup: setuper
  }
}
