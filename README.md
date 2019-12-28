# Gradient2

> A JavaScript library for creating color gradients using the [color](https://github.com/Qix-/color) library. The project started as an update to [Gradient.js](https://github.com/tstone/Gradient.js) but soon became almost completely rewritten. 

![npm](https://img.shields.io/npm/v/gradient2)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/colossalpercy/gradient2/Test%20NPM%20package)

## Getting Started

Gradient2 can be used both client-side and server-side to generate gradients of colour. Follow the instructions below to get started.

### Installation

Gradient2 can be installed from npm.

```
$ npm install gradient2
```

## Usage

To use the package, simply require it in your code.

```js
let Gradient = require('gradient2')
```

Then use the `new` keyword to create an instance of Gradient with a config object.

```js
let gradient = new Gradient(config)
```

With the gradient created, return an array of Color objects.

```js
gradient.toArray()
```
This array can then be used and manipulated however needed.

### Config
The config object is required in order to generate the gradients.

```js
let gradient = new Gradient({
  colors: ['#f00', '#00f'],
  steps: 3,
  model: 'rgb'
})
```

<center>

| Property | Type  | Default | Required | Description | Accepted Values |
|----------|-------|---------|----------|-------------|-----------------|
| `colors` | Array | `null`  | `true`   | Array of colors to be used in the gradient. | <ul> <li>An array of [color-strings](https://github.com/Qix-/color-string#readme)</li> <li>An array of objects specifying the color-string and position of the stop ```js { color: '#f00', pos: 50 } ``` </li> </ul>|
| `steps` | Number | `null` | `true` | The number of steps to be taken in the gradient | Positive integer |
| `model` | String | `rgb` | `false` | The color model to use when interpolating between colors | `rgb` or `hsl` |
</center>

### Methods

Invoke the `toArray()` method on your gradient instance to return an array of color objects. Pass a string as an argument to denote how the color is returned. Any property of a color object can be passed in, e.g. `hex`, `rgb`, `hsl`, `ansi16` etc.

### Example

```js
let Gradient = require('gradient2')

let gradient = new Gradient({
  colors: [
    { color: '#f00', pos: 0},
    { color: '#0f0', pos: 25},
    { color: '#00f', pos: 100}
  ],
  steps: 20,
  model: 'hsl'
})

let colors = gradient.toArray('hex')

for (let color of colors) {
  let div = document.createElement("div")
  div.style.width = "100px"
  div.style.height = "20px"
  div.style.background = color

  document.body.appendChild(div)
}
```

![alt text](https://imgur.com/OUWrQH7.png "Gradient")

## License

This project is licensed under the MIT License.

## Acknowledgments

* [tstone](https://github.com/tstone/Gradient.js) for original Gradient library
* [Qiz-](https://github.com/Qix-/color) for color libraray
