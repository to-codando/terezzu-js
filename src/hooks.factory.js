import { pubsubFactory } from './pubsub.factory.js'

export const hooksFactory = () => {
  const eventDrive = pubsubFactory()

  const beforeOnRender = (callback) => {
    eventDrive.on("beforeOnRender", callback)
  }

  const afterOnRender = (callback) => {
    eventDrive.on("afterOnRender", callback)
  }

  const onInit = (callback) => {
		eventDrive.on("onInit", callback)
	}

  const emit = (eventName, payload) => {
    eventDrive.emit( eventName, payload)
  }

  return {
		beforeOnRender,
		afterOnRender,
		onInit,
		emit,
	}
}