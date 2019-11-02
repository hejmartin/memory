import { getByPath } from "./utils.js"

class Store {
  constructor(state = {}) {
    this.listeners = {}
    this.state = state
  }

  setState(updates, callback) {
    const previousState = this.state
    const newState = Object.assign({}, previousState, updates)

    this.state = newState

    Object.keys(this.listeners).forEach(path => {
      const previousValue = getByPath(path, previousState)
      const newValue = getByPath(path, this.state)
      if (newValue !== previousValue) {
        this.listeners[path].forEach(callback => callback(newValue))
      }
    })

    if (callback) {
      callback(newState)
    }
  }

  addListener(path, callback) {
    if (!this.listeners[path]) {
      this.listeners[path] = []
    }

    this.listeners[path].push(callback)
  }
}

const store = new Store({
  tiles: []
})

export default store
