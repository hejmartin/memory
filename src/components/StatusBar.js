import Base from "./Base.js"
import { createElement } from "../lib/utils.js"
import * as store from "../lib/store.js"
import { RESOLVED } from "./Tile.js"

export default class StatusBar extends Base {
  constructor(props) {
    super(props)

    this.elements.root = createElement("div", {
      class: "status-bar",
      "aria-live": "polite"
    })

    store.addListener("attempts", this.update.bind(this))
    store.addListener("tiles", this.update.bind(this))

    this.update()
  }

  update() {
    const { tiles, attempts } = store.getState()
    const totalPairs = tiles.length / 2
    const resolvedPairs =
      tiles.filter(tile => tile.state === RESOLVED).length / 2

    this.elements.root.innerHTML = `Resolved: ${resolvedPairs} / ${totalPairs} | Attempts: ${attempts}`
  }
}
