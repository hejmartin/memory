import Base from "./Base.js"
import store from "../lib/store.js"
import { createElement } from "../lib/utils.js"

export const HIDDEN = "HIDDEN"
export const REVEALED = "REVEALED"
export const RESOLVED = "RESOLVED"

export default class Tile extends Base {
  constructor(props) {
    super(props)

    this.handleTileClick = this.handleTileClick.bind(this)

    const tile = store.state.tiles[props.index]

    store.addListener(`tiles.${props.index}`, tile => {
      this.update()
    })

    this.elements.root = createElement("div")
    this.elements.button = createElement(
      "button",
      {
        class: "grid-tile grid-tile--hidden"
      },
      {
        onclick: this.handleTileClick
      }
    )
    this.elements.inner = createElement("div", { class: "grid-tile__inner" })
    this.elements.front = createElement("img", {
      src: tile.url,
      class: "grid-tile__front"
    })
    this.elements.back = createElement("div", {
      class: " grid-tile__back"
    })
    this.elements.inner.append(this.elements.front, this.elements.back)
    this.elements.button.append(this.elements.inner)
    this.elements.root.append(this.elements.button)
  }

  handleTileClick(e) {
    const tile = store.state.tiles[this.props.index]

    let newState
    switch (tile.state) {
      case HIDDEN:
        newState = REVEALED
        break
      case REVEALED:
        newState = HIDDEN
        break
      case RESOLVED:
        newState = RESOLVED
    }

    const newTiles = [...store.state.tiles]
    newTiles[this.props.index] = Object.assign({}, tile, { state: newState })

    store.setState({
      tiles: newTiles
    })
  }

  update() {
    const { url, state } = store.state.tiles[this.props.index]

    this.elements.button.classList.toggle("grid-tile--hidden", state === HIDDEN)
    this.elements.button.classList.toggle(
      "grid-tile--resolved",
      state === RESOLVED
    )
  }
}
