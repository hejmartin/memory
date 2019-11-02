import {
  getRandomImages,
  preloadImage,
  createElement,
  shuffleArray
} from "../lib/utils.js"
import Base from "./Base.js"
import store from "../lib/store.js"
import Tile, { HIDDEN, REVEALED, RESOLVED } from "./Tile.js"

export default class App extends Base {
  constructor(props) {
    super(props)

    this.elements.root = createElement("div")
    this.elements.grid = createElement("grid", { class: "grid" })
    this.elements.counter = createElement("div", { class: "counter" })
    this.elements.root.append(this.elements.grid, this.elements.counter)

    store.setState({
      loading: true
    })

    Promise.all(getRandomImages(10).map(preloadImage))
      .then(urls => {
        const tiles = urls.reduce((tiles, url) => {
          tiles.push({ url, state: HIDDEN })
          tiles.push({ url, state: HIDDEN })
          return tiles
        }, [])

        store.setState(
          {
            loading: false,
            tiles: shuffleArray(tiles)
          },
          () => {
            this.createTiles()
          }
        )
      })
      .catch(err => {
        // FIXME: image #97 seems to bw broken, so this needs to be handled
        console.error("Something broke!", err)
      })

    store.addListener("tiles", this.handleTilesUpdate.bind(this))
  }

  createTiles() {
    store.state.tiles.forEach((_tile, index) => {
      const tile = new Tile({ index })
      this.elements.grid.append(tile.elements.root)
    })
  }

  handleTilesUpdate() {
    const tiles = store.state.tiles
    const revealed = tiles.filter(tile => tile.state === REVEALED)

    if (revealed.length > 1) {
      const isMatch = revealed.every(({ url }) => url === revealed[0].url)

      if (isMatch) {
        // If revealed tiles match, mark them as resolved
        store.setState({
          tiles: tiles.map(tile => {
            if (revealed.includes(tile)) {
              return Object.assign({}, tile, { state: RESOLVED })
            }
            return tile
          })
        })
      } else {
        // If they don't match, flip them back down
        revealed.forEach((tile, index) => {
          setTimeout(() => {
            store.setState({
              tiles: store.state.tiles.map(t => {
                if (t !== tile) return t
                return Object.assign({}, t, { state: HIDDEN })
              })
            })
          }, 500 * (index + 1))
        })
      }
    }

    this.update()
  }

  update() {
    const totalPairs = store.state.tiles.length / 2
    const resolvedPairs =
      store.state.tiles.filter(tile => tile.state === RESOLVED).length / 2

    this.elements.counter.innerHTML = `Resolved: ${resolvedPairs} / ${totalPairs}`
  }
}
