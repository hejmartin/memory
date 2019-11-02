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

    this.root = createElement("div")
    const button = createElement(
      "button",
      {
        class: `grid__tile ${
          tile.state === REVEALED ? "grid__tile--revealed" : ""
        }`
      },
      {
        onclick: this.handleTileClick
      }
    )

    const image = createElement("img", { src: tile.url })

    button.append(image)
    this.root.append(button)
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

    const tiles = [...store.state.tiles]
    tiles[this.props.index] = Object.assign({}, tile, { state: newState })

    store.setState({
      tiles
    })
  }

  update() {
    const { url, state } = store.state.tiles[this.props.index]
    console.log(state)
  }
}
