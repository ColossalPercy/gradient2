let Color = require('color')

module.exports = class Gradient {
  constructor(args) {
    // check for args
    if (!args) throw new Error('No arguments recieved')

    // check for errors
    if (args.steps === undefined || typeof args.steps !== 'number') {
      throw new Error('Must provide number of steps')
    }
    if (args.colors === undefined || args.colors.length < 2) {
      throw new Error('Not enough stops')
    }
    if (args.colors.length > args.steps) {
      throw new Error('More stops than steps')
    }
    if (args.model && !(args.model === 'rgb' || args.model === 'hsl')) {
      throw new Error('Model must be rgb or hsl')
    }

    // check if custom positions provided
    if (typeof args.colors[0].pos !== 'undefined') {
      // extract colors
      this.stops = args.colors.map(x => Color(x.color))
      // extract positions
      this.stopsPos = args.colors.map(x => x.pos)
      this.customSpan = true
      // duplicate first color if not at pos 0%
      if (this.stopsPos[0] !== 0) {
        this.stops.unshift(this.stops[0])
        this.stopsPos.unshift(0)
      }
      // duplicate last color if not at pos 100%
      if (this.stopsPos[this.stops.length - 1] < 100) {
        this.stops.push(this.stops[this.stops.length - 1])
        this.stopsPos.push(100)
      }
      // check positions for errors
      for (let i = 0; i < this.stopsPos.length; i++) {
        // positions wrong order
        if (i > 1 && this.stopsPos[i] < this.stopsPos[i - 1]) {
          throw new Error(`Stop positions in wrong order: ${i} > ${i + 1}`)
        }
        // positions equal
        if (i > 1 && this.stopsPos[i] === this.stopsPos[i - 1]) {
          throw new Error(`Stop positions equal: ${i} = ${i + 1}`)
        }
        // positions out of range
        if (this.stopsPos[i] < 0 || this.stopsPos[i] > 100) {
          throw new Error(`Stop position out of range 0-100: ${i}`)
        }
        // position is decimal
        if (this.stopsPos[i] % 1 !== 0) {
          throw new Error(`Use whole number for stop position: ${i}`)
        }
      }
      // just given array of colors
    } else {
      this.stops = args.colors.map(x => Color(x))
      this.customSpan = false
    }
    // total number of steps
    this.steps = args.steps
    // RGB or HSL interpolation
    this.model = (args.model || 'RGB').toUpperCase()

    if (this.stops.length === this.steps) {
      console.warn('Number of stops equals steps, no extra colors generated')
      this.__cache = this.stops
    }

    // create gradient
    this.create()
  }

  // HSL - build given number of steps, excluding start and end
  buildStepsHSL(start, end, span) {
    // get start color
    let base = {
      h: start.hue(),
      s: start.saturationl(),
      l: start.lightness(),
      a: start.alpha()
    }

    // calculate difference in hue
    let deltaH = start.hue() - end.hue()
    let hueNum
    // if deltaH greather than 180, do gradient in reverse
    if (deltaH > 180) {
      hueNum = end.hue() - base.h + 360
    } else if (deltaH < -180) {
      hueNum = end.hue() - base.h - 360
    } else {
      hueNum = end.hue() - base.h
    }

    // get delta for each step in this span
    let delta = {
      h: hueNum / (span + 1),
      s: (end.saturationl() - base.s) / (span + 1),
      l: (end.lightness() - base.l) / (span + 1),
      a: (end.alpha() - base.a) / (span + 1)
    }

    let steps = []
    // create color for each step in this span
    for (let i = 1; i <= span; i++) {
      // increment the base color by delta
      let h = base.h + delta.h * i
      let s = base.s + delta.s * i
      let l = base.l + delta.l * i
      let a = base.a + delta.a * i

      // build new color object
      let c = Color()
        .hue(h)
        .saturationl(s)
        .lightness(l)
        .alpha(a)
      // add new color to steps
      steps.push(c)
    }
    return steps
  }

  // RGB - build given number of steps, excluding start and end
  buildStepsRGB(start, end, span) {
    // get start color
    let base = {
      r: start.red(),
      g: start.green(),
      b: start.blue()
    }

    // get delta for each step in this span
    let delta = {
      r: (end.red() - base.r) / (span + 1),
      g: (end.green() - base.g) / (span + 1),
      b: (end.blue() - base.b) / (span + 1)
    }

    let steps = []
    // create color for each step in this span
    for (let i = 1; i <= span; i++) {
      // increment the base color by delta
      let r = base.r + delta.r * i
      let g = base.g + delta.g * i
      let b = base.b + delta.b * i

      // build new color object
      let c = Color()
        .red(r)
        .green(g)
        .blue(b)
      // add new color to steps
      steps.push(c)
    }
    return steps
  }

  // to array
  create() {
    // generate gradient steps
    if (typeof this.__cache === 'undefined') {
      // total number of sets of colors
      let sets = this.stops.length - 1

      let span, overflow
      // calculate span and overflow if custom positions provided
      if (this.customSpan === true) {
        span = []
        let total = 0
        for (let i = 0; i < sets; i++) {
          // percentage of total steps in span
          let diff = (this.stopsPos[i + 1] - this.stopsPos[i]) / 100
          // number of points in span
          diff = Math.floor(diff * (this.steps - this.stops.length))
          span.push(diff)
          total += diff
        }
        // extra points that need addings
        overflow = this.steps - this.stops.length - total
      } else {
        // span size to use for each set
        span = Math.floor((this.steps - this.stops.length) / sets)
        // the extra number of steps that don't fit evenly between sets
        overflow = (this.steps - this.stops.length) % sets
      }
      let colors = []

      // loop thorugh sets of colors
      for (let i = 0; i < sets; i++) {
        // add start color to colors array
        // prevents having same color twice
        colors.push(this.stops[i])

        let currSpan = this.customSpan ? span[i] : span
        // if extra step needed in this set
        if (overflow > 0) {
          // build steps with one extra span to get to total steps exactly
          colors = colors.concat(
            this['buildSteps' + this.model](
              this.stops[i],
              this.stops[i + 1],
              currSpan + 1
            )
          )
          overflow--
          // if no extra steps need in this set
        } else {
          // build steps with number of span
          colors = colors.concat(
            this['buildSteps' + this.model](
              this.stops[i],
              this.stops[i + 1],
              currSpan
            )
          )
        }
      }
      // add the final stop that was not included in loop
      colors.push(this.stops[sets])
      // cache gradient array to prevent calculating again
      this.__cache = colors
    }
  }

  toArray(format) {
    // return in specified format
    if (typeof format !== 'undefined') {
      return this.__cache.map(x => {
        return x[format]()
      })
    } else {
      return this.__cache
    }
  }
}
