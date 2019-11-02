import {
  getRandomImages,
  preloadImage,
  createElement,
  shuffleArray
} from "../lib/utils.js"
import Base from "./Base.js"
import store from "../lib/store.js"
import Tile, { HIDDEN } from "./Tile.js"

export default class App extends Base {
  constructor(props) {
    super(props)
    this.state = {
      message: "Yes, hello!"
    }

    this.root = createElement("div")
    this.grid = createElement("grid", { class: "grid" })
    this.root.append(this.grid)

    store.setState({
      loading: true
    })

    Promise.all(getRandomImages(10).map(preloadImage))
      .then(urls => {
        console.log("All images loaded", urls)

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
  }

  revealTile(tile) {}

  hideTile(tile) {}

  createTiles() {
    store.state.tiles.forEach((_tile, index) => {
      const tile = new Tile({ index })
      this.grid.append(tile.root)
    })
  }

  render() {
    return this.root
  }
}
