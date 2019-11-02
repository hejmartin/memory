import { getByPath } from "./utils.js"

let state = {
  tiles: []
}
const listeners = {}

export function getState() {
  return state
}

export function setState(updater, callback) {
  const previousState = state
  const newState = Object.assign({}, previousState, updater(state))

  state = newState

  Object.keys(listeners).forEach(path => {
    const previousValue = getByPath(path, previousState)
    const newValue = getByPath(path, state)
    if (newValue !== previousValue) {
      listeners[path].forEach(callback => callback(newValue))
    }
  })

  if (callback) {
    callback(newState)
  }
}

export function addListener(path, callback) {
  if (!listeners[path]) {
    listeners[path] = []
  }

  listeners[path].push(callback)
}
