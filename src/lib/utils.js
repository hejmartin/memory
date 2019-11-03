export function getByPath(path, obj) {
  const props = path.split(".")

  try {
    return props.reduce((o, prop) => {
      if (o.hasOwnProperty(prop)) {
        return o[prop]
      } else {
        return undefined
      }
    }, obj)
  } catch {
    return undefined
  }
}

export function createElement(type, attributes = {}, props = {}) {
  const el = document.createElement(type)
  Object.keys(attributes).map(attr => el.setAttribute(attr, attributes[attr]))
  Object.keys(props).map(prop => (el[prop] = props[prop]))
  return el
}

export function getRandomImages(_num = 10) {
  // FIXME: It turns out that picsum has a bunch of broken images,
  // so for now this will be a fixes list of images that I know work.
  const ids = [45, 73, 89, 17, 64, 65, 95, 70, 92, 9]
  return ids.map(id => `https://picsum.photos/id/${id}/200/200`)

  // return new Array(num).fill("")
  //   const randomId = Math.floor(Math.random() * (100 - 1)) + 1
  //   return `https://picsum.photos/id/${randomId}/200/200`
  // })
}

export function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()

    const timeout = setTimeout(() => {
      reject()
    }, 3000)

    image.addEventListener("load", () => {
      clearTimeout(timeout)
      resolve(url)
    })

    image.src = url
  })
}

export function shuffleArray(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
