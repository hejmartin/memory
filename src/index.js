import App from "./components/App.js"

const app = new App()
document.getElementById("root").appendChild(app.elements.root)

function detectKeyboardInput() {
  document.documentElement.classList.add("keyboarduser")
}

document.addEventListener("keydown", detectKeyboardInput)
document.addEventListener("keyup", detectKeyboardInput)
