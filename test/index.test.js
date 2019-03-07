/* eslint-disable no-new */
let Gradient = require('..')

// test constructor arguments
test('create gradient with no args', () => {
  expect(() => {
    new Gradient()
  }).toThrow('No arguments recieved')
})

test('create gradient with no steps', () => {
  expect(() => {
    new Gradient({
      colors: ['#f00', '#0f0', '#00f']
    })
  }).toThrow('Must provide number of steps')

  expect(() => {
    new Gradient({
      colors: ['#f00', '#0f0', '#00f'],
      steps: 'foo'
    })
  }).toThrow('Must provide number of steps')
})

test('create gradient with no colors', () => {
  expect(() => {
    new Gradient({
      colors: [],
      steps: 5
    })
  }).toThrow('Not enough stops')

  expect(() => {
    new Gradient({
      steps: 5
    })
  }).toThrow('Not enough stops')
})

test('create gradient with 1 color', () => {
  expect(() => {
    new Gradient({
      colors: ['#f00'],
      steps: 5
    })
  }).toThrow('Not enough stops')

  expect(() => {
    new Gradient({
      colors: [
        { color: '#f00', pos: 50 }
      ],
      steps: 5
    })
  }).toThrow('Not enough stops')
})

test('create gradient with more colors than steps', () => {
  expect(() => {
    new Gradient({
      colors: ['#f00', '#0f0', '#00f'],
      steps: 2
    })
  }).toThrow('More stops than steps')

  expect(() => {
    new Gradient({
      colors: [
        { color: '#f00', pos: 0 },
        { color: '#0f0', pos: 50 },
        { color: '#00f', pos: 100 }
      ],
      steps: 2
    })
  }).toThrow('More stops than steps')
})

test('equal number stops and steps', () => {
  expect(new Gradient({
    colors: ['#f00', '#0f0', '#00f'],
    steps: 3
  }).toArray('hex')).toEqual(['#FF0000', '#00FF00', '#0000FF'])
})

test('incorrect model type', () => {
  expect(() => {
    new Gradient({
      colors: ['#f00', '#0f0', '#00f'],
      steps: 3,
      model: 'f00'
    })
  }).toThrow('Model must be rgb or hsl')
})

// test using custom positions
test('create gradient with custom positions', () => {
  expect(
    new Gradient({
      colors: [
        { color: '#f00', pos: 0 },
        { color: '#00f', pos: 100 }
      ],
      steps: 3
    }).toArray('hex')
  ).toEqual(['#FF0000', '#800080', '#0000FF'])
})

test('create gradient with custom positions, no 0', () => {
  expect(
    new Gradient({
      colors: [
        { color: '#f00', pos: 10 },
        { color: '#00f', pos: 100 }
      ],
      steps: 5
    }).toArray('hex')
  ).toEqual(['#FF0000', '#FF0000', '#FF0000', '#800080', '#0000FF'])
})

test('create gradient with custom positions, no 100', () => {
  expect(
    new Gradient({
      colors: [
        { color: '#f00', pos: 0 },
        { color: '#00f', pos: 90 }
      ],
      steps: 5
    }).toArray('hex')
  ).toEqual(['#FF0000', '#AA0055', '#5500AA', '#0000FF', '#0000FF'])
})

test('create gradient with custom positions in wrong order', () => {
  expect(() => {
    new Gradient({
      colors: [
        { color: '#f00', pos: 100 },
        { color: '#00f', pos: 0 }
      ],
      steps: 3
    })
  }).toThrow('Stop positions in wrong order:')
})

test('create gradient with custom positions, equal positions', () => {
  expect(() => {
    new Gradient({
      colors: [
        { color: '#f00', pos: 50 },
        { color: '#00f', pos: 50 }
      ],
      steps: 3
    })
  }).toThrow('Stop positions equal:')
})

test('create gradient with custom positions out of range', () => {
  expect(() => {
    new Gradient({
      colors: [
        { color: '#f00', pos: -10 },
        { color: '#00f', pos: 100 }
      ],
      steps: 3
    })
  }).toThrow('Stop position out of range 0-100:')

  expect(() => {
    new Gradient({
      colors: [
        { color: '#f00', pos: 0 },
        { color: '#00f', pos: 110 }
      ],
      steps: 3
    })
  }).toThrow('Stop position out of range 0-100:')
})

test('create gradient with custom positions, decimal position', () => {
  expect(() => {
    new Gradient({
      colors: [
        { color: '#f00', pos: 0 },
        { color: '#00f', pos: 50.1 }
      ],
      steps: 3
    })
  }).toThrow('Use whole number for stop position:')
})

// test RGB gradient
test('build rgb gradient', () => {
  expect(new Gradient({
    colors: ['#f00', '#00f'],
    steps: 3,
    model: 'rgb'
  }).toArray('hex')).toEqual(['#FF0000', '#800080', '#0000FF'])
})

// test HSL gradient
test('build hsl gradient, deltaH < -180', () => {
  expect(new Gradient({
    colors: ['#f00', '#00f'],
    steps: 3,
    model: 'hsl'
  }).toArray('hex')).toEqual(['#FF0000', '#FF00FF', '#0000FF'])
})

test('build hsl gradient, deltaH > 180', () => {
  expect(new Gradient({
    colors: ['#00f', '#f00'],
    steps: 3,
    model: 'hsl'
  }).toArray('hex')).toEqual(['#0000FF', '#FF00FF', '#FF0000'])
})

test('build hsl gradient, deltaH small', () => {
  expect(new Gradient({
    colors: ['#f00', '#0f0'],
    steps: 3,
    model: 'hsl'
  }).toArray('hex')).toEqual(['#FF0000', '#FFFF00', '#00FF00'])
})

// test returning cache only
test('return cache of color objects', () => {
  expect(new Gradient({
    colors: ['#f00', '#00f'],
    steps: 3,
    model: 'rgb'
  }).toArray()).toEqual(
    [{
      'color': [255, 0, 0],
      'model': 'rgb',
      'valpha': 1
    },
    {
      'color': [127.5, 0, 127.5],
      'model': 'rgb',
      'valpha': 1
    },
    {
      'color': [0, 0, 255],
      'model': 'rgb',
      'valpha': 1
    }]
  )
})
