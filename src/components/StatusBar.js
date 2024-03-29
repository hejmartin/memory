import Base from "./Base.js"
import { createElement } from "../lib/utils.js"
import * as store from "../lib/store.js"
import { RESOLVED } from "./Tile.js"

export default class StatusBar extends Base {
  constructor(props) {
    super(props)

    this.elements.root = createElement("div", {
      class: "status-bar"
    })
    this.elements.heading = createElement(
      "h1",
      { class: "status-bar__heading" },
      { innerText: "Memory!" }
    )
    this.elements.status = createElement("div", {
      class: "status-bar__status",
      "aria-live": "polite"
    })
    this.elements.resolved = createElement("div", {
      class: "status-bar__resolved"
    })
    this.elements.attempts = createElement("div", {
      class: "status-bar__attempts"
    })

    this.elements.status.append(this.elements.resolved, this.elements.attempts)
    this.elements.root.append(this.elements.heading, this.elements.status)

    store.addListener("attempts", this.update.bind(this))
    store.addListener("tiles", this.update.bind(this))

    this.update()
  }

  resetGame() {
    document.location.reload()
  }

  update() {
    const { tiles, attempts } = store.getState()
    const totalPairs = tiles.length / 2
    const resolvedPairs =
      tiles.filter(tile => tile.state === RESOLVED).length / 2

    const allResolved =
      tiles.length > 0 && tiles.every(({ state }) => state === RESOLVED)

    this.elements.resolved.innerText = `Resolved pairs: ${resolvedPairs} / ${totalPairs}`
    this.elements.attempts.innerText = `Attempts: ${attempts}`

    if (allResolved) {
      setTimeout(() => {
        if (
          confirm(`You did it! In just ${attempts} attemps!\n\nPlay again?`)
        ) {
          this.resetGame()
        }
      }, 1000)
    }
  }
}
