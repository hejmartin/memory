import Base from "./Base.js"
import { createElement } from "../lib/utils.js"
import * as store from "../lib/store.js"
import { RESOLVED, HIDDEN } from "./Tile.js"

export default class StatusBar extends Base {
  constructor(props) {
    super(props)

    this.elements.root = createElement("div", {
      class: "status-bar",
      "aria-live": "polite"
    })
    this.elements.text = createElement("div")
    this.elements.resetButton = createElement(
      "button",
      {},
      {
        onclick: () => {
          this.resetGame()
        }
      }
    )
    this.elements.resetButton.innerText = "Play again?"
    this.elements.root.append(this.elements.text)

    store.addListener("attempts", this.update.bind(this))
    store.addListener("tiles", this.update.bind(this))

    this.update()
  }

  resetGame() {
    store.setState(({ tiles }) => ({
      attempts: 0,
      tiles: tiles.map(tile => Object.assign({}, tile, { state: HIDDEN }))
    }))
  }

  update() {
    const { tiles, attempts } = store.getState()
    const totalPairs = tiles.length / 2
    const resolvedPairs =
      tiles.filter(tile => tile.state === RESOLVED).length / 2

    const allResolved =
      tiles.length > 0 && tiles.every(({ state }) => state === RESOLVED)

    let text = `Resolved: ${resolvedPairs} / ${totalPairs}`
    text += ` | Attempts: ${attempts}`

    if (allResolved) {
      this.elements.root.append(this.elements.resetButton)
      text += `You did it! In just ${attempts} attemps!`
    }

    this.elements.text.innerHTML = text
  }
}
