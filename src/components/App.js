import {
  getRandomImages,
  preloadImage,
  createElement,
  shuffleArray
} from "../lib/utils.js"
import Base from "./Base.js"
import * as store from "../lib/store.js"
import Tile, { HIDDEN, REVEALED, RESOLVED } from "./Tile.js"
import StatusBar from "./StatusBar.js"

export default class App extends Base {
  constructor(props) {
    super(props)

    const statusBar = new StatusBar()

    this.elements.root = createElement("div", { class: "app" })
    this.elements.grid = createElement("ul", { class: "grid" })
    this.elements.root.append(statusBar.elements.root, this.elements.grid)

    store.setState(() => ({
      loading: true
    }))

    Promise.all(getRandomImages(10).map(preloadImage))
      .then(urls => {
        const tiles = urls.reduce((tiles, url, index) => {
          tiles.push({ url, state: HIDDEN, imageNumber: index })
          tiles.push({ url, state: HIDDEN, imageNumber: index })
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
        console.error(err)
      })

    store.addListener("tiles", this.handleTilesUpdate.bind(this))
  }

  createTiles() {
    store.getState().tiles.forEach((_tile, index) => {
      const tile = new Tile({ index })
      this.elements.grid.append(tile.elements.root)
    })
  }

  handleTilesUpdate() {
    const { tiles } = store.getState()
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
            store.setState(({ tiles }) => ({
              tiles: tiles.map(t => {
                if (t !== tile) return t
                return Object.assign({}, t, { state: HIDDEN })
              })
            }))
          }, 700 * (index + 1))
        })
      }
    }
  }
}
