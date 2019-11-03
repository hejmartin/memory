import Base from "./Base.js"
import * as store from "../lib/store.js"
import { createElement, getRandomNumber } from "../lib/utils.js"

export const HIDDEN = "HIDDEN"
export const REVEALED = "REVEALED"
export const RESOLVED = "RESOLVED"

export default class Tile extends Base {
  constructor(props) {
    super(props)

    const tile = this.tile

    store.addListener(`tiles.${props.index}`, tile => {
      this.update()
    })

    this.elements.root = createElement("li")
    this.elements.button = createElement(
      "button",
      {
        class: "tile",
        style: `--rotate: ${getRandomNumber(-5, 5)}deg`
      },
      {
        onclick: this.handleTileClick.bind(this)
      }
    )

    this.elements.inner = createElement("div", {
      class: "tile__inner"
    })

    this.elements.front = createElement("img", {
      src: tile.url,
      class: "tile__front",
      alt: ""
    })

    this.elements.back = createElement("div", {
      class: "tile__back"
    })

    this.elements.inner.append(this.elements.front, this.elements.back)
    this.elements.button.append(this.elements.inner)
    this.elements.root.append(this.elements.button)

    this.updateTileDescription()
  }

  get tile() {
    return store.getState().tiles[this.props.index]
  }

  handleTileClick() {
    const tile = this.tile

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

    const newTiles = [...store.getState().tiles]
    newTiles[this.props.index] = Object.assign({}, tile, { state: newState })

    store.setState(() => ({
      tiles: newTiles
    }))
  }

  updateTileDescription() {
    const { state, imageNumber } = this.tile
    let text = `Tile #${this.props.index + 1}. `

    switch (state) {
      case HIDDEN:
        text += "Hidden"
        break
      case REVEALED:
        text += `Revealed, showing image number ${imageNumber}`
        break
      case RESOLVED:
        text += `Resolved, showing image number ${imageNumber}`
    }

    this.elements.front.setAttribute("alt", text)
  }

  update() {
    const { state } = this.tile
    const classList = this.elements.button.classList

    classList.toggle("tile--revealed", state !== HIDDEN)
    classList.toggle("tile--hidden", state === HIDDEN)
    classList.toggle("tile--resolved", state === RESOLVED)

    this.updateTileDescription()
  }
}
