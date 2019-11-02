import {
  getRandomImages,
  preloadImage,
  createElement,
  shuffleArray
} from "../lib/utils.js"
import Base from "./Base.js"
import * as store from "../lib/store.js"
import Tile, { HIDDEN, REVEALED, RESOLVED } from "./Tile.js"

export default class App extends Base {
  constructor(props) {
    super(props)

    this.elements.root = createElement("div")
    this.elements.grid = createElement("grid", { class: "grid" })
    this.elements.counter = createElement("div", { class: "counter" })
    this.elements.root.append(this.elements.grid, this.elements.counter)

    store.setState(() => ({
      loading: true
    }))

    Promise.all(getRandomImages(10).map(preloadImage))
      .then(urls => {
        const tiles = urls.reduce((tiles, url) => {
          tiles.push({ url, state: HIDDEN })
          tiles.push({ url, state: HIDDEN })
          return tiles
        }, [])

        store.setState(
          () => ({
            loading: false,
            tiles: shuffleArray(tiles)
          }),
          () => {
            this.createTiles()
          }
        )
      })
      .catch(err => {
        // TODO: handle errors
      })

    store.addListener("tiles", this.handleTilesUpdate.bind(this))
    store.addListener("attempts", this.update.bind(this))
  }

  createTiles() {
    store.getState().tiles.forEach((_tile, index) => {
      const tile = new Tile({ index })
      this.elements.grid.append(tile.elements.root)
    })
  }

  handleTilesUpdate() {
    const tiles = store.getState().tiles
    const revealed = tiles.filter(tile => tile.state === REVEALED)

    if (revealed.length > 1) {
      const isMatch = revealed.every(({ url }) => url === revealed[0].url)

      store.setState(({ attempts }) => ({
        attempts: attempts + 1
      }))

      if (isMatch) {
        // If revealed tiles match, mark them as resolved
        store.setState(() => ({
          tiles: tiles.map(tile => {
            if (revealed.includes(tile)) {
              return Object.assign({}, tile, { state: RESOLVED })
            }
            return tile
          })
        }))
      } else {
        // If they don't match, flip them back down
        revealed.forEach((tile, index) => {
          setTimeout(() => {
            store.setState(({ tiles, attempts }) => ({
              tiles: tiles.map(t => {
                if (t !== tile) return t
                return Object.assign({}, t, { state: HIDDEN })
              })
            }))
          }, 500 * (index + 1))
        })
      }
    }

    this.update()
  }

  update() {
    const { tiles, attempts } = store.getState()
    const totalPairs = tiles.length / 2
    const resolvedPairs =
      tiles.filter(tile => tile.state === RESOLVED).length / 2

    this.elements.counter.innerHTML = `Resolved: ${resolvedPairs} / ${totalPairs} | Attempts: ${attempts}`
  }
}
