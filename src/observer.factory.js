export const observerFactory = (value) => {
  let _handlers = []
  let _value = value

  const _handlerExists = (handler) => {
    return _handlers.some((subscribedHandler) => {
      return (
        subscribedHandler.toString() === handler.toString() ||
        subscribedHandler.name === handler.name ||
        subscribedHandler === handler
      )
    })
  }

  const on = (handler) => {
    if (typeof handler !== 'function') {
      throw new Error('Handler is not a function and must be.')
    }

    // if (_handlerExists(handler)) {
    //   const positionHandler = _handlers.indexOf(handler)
    //   _handlers.splice(positionHandler, 1, handler)
    //   return _handlerExists[positionHandler]
    // }

    _handlers = [..._handlers, handler]
    return handler
  }

  const off = (targetHandler) => {
    _handlers = _handlers.filter((handler) => {
      if (handler !== targetHandler) return handler
    })
  }

  const set = (payload) => {
    _value = Object.assign({}, _value, payload)
    _handlers.forEach((handler) => handler(_value))
  }

  const get = () => _value

  const handlers = (payload) => {
    if(payload && Array.isArray(payload)) {
      _handlers = [...payload]
      return _handlers
    }
    
    return _handlers
  }

  const merge = (payload, callback) => {
    _value = Object.assign({}, _value, payload)
		if (callback && typeof callback === "function") callback({ ..._value })
  }

  return { on, off, set, get, handlers, merge }
}
