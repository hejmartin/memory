▶️ Play the Memory game at https://hejmartin.github.io/memory/

---

## Summary

I chose to go all-out vanilla on the task, i.e. not using any third-party libraries at all. Since I am using certain modern techniques like JavaScript modules and CSS grid you require a fairly modern browser to run the application.

I’m using a shared state store that components can subscribe to and derive their updates from.

I went with the BEM naming convention for my CSS. My go-to CSS approach these days is usually utility classes, but for such a small project like this it felt like to much initial overhead. The game should work well on all screen sizes.

All components use semantic markup and descriptive texts to aid accessibility, and you can navigate using the keyboard.

You might be able to break the game if you flip a lot of tiles very quickly, but that you could also do when playing a physical game of memory and it would be considered cheating! 😱

## If I had more time…

These are some additional next steps I would want to look into if I had more time:

- Support navigating the tile grid with arrow keys. The current implementation works well with keyboard using the tab key, but that might not be the most ideal way to navigate the grid.

- Refactoring the state store. I would like to consolidate the state updates that are now spread out amongst the different components, probably using a reducer pattern for the updates.

- Handle loading and error states. It turned out the image service I am using has some broken images, so my initial approach with random images was not reliant enough. The current solution is to use an array of images that I know work, but a better solution would be to use random id:s but check that each image is working.

- Add more documentation. Use JsDoc comments for the methods in the lib folder.

- Better accessible image descriptions, e.g. ”A road through a forest” rather than ”Image number two”. This would of course be tricky combined with the random image list, so having a predefined list to pick from might be necessary. Either that or some form of image recognition, which is total overkill.

- Something nicer than an alert box after finishing a game.

- Styling the resolved tiles more than just keeping them face up.
