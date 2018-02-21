var nano = require('nanochoo')
var x = require('hyperaxe')
var app = nano()

app.view(view)
app.use(store)
app.mount('#app')

function view (state, emit) {
  var gamepads = Object.values(state.controllers)
  var title = x('p.title')

  return x('#app')(
    gamepads.length < 1
      ? 'Press a button on your controller to start'
      : gamepads.map((gamepad, idx) =>
        x('.gamepad')(
          title(`${idx + 1}: ${gamepad.id}`),
          title('Buttons'),
          x('.buttons')(
            buttons(gamepad.buttons)
          ),
          title('Axes'),
          x('.axes')(
            axes(gamepad.axes)
          )
        )
      )
  )
}

function buttons (arr) {
  return arr.map((button, idx) => {
    var pressed = button === 1.0
    var val = button
    if (typeof button === 'object') {
      pressed = button.pressed
      val = button.value
    }
    var pct = `${Math.round(val * 100)}%`
    return x(`.button${pressed ? '.pressed' : ''}`)(
      { style: `background-size: ${pct} ${pct}` },
      idx
    )
  })
}

function axes (arr) {
  return arr.map((axis, idx) => {
    var pressed = axis < -0.15 || axis > 0.15 ? '.pressed' : ''
    return x('.axis')(
      x(`span.button${pressed}`)(idx),
      x(`meter${pressed}`)(
        { min: -1, max: 1, value: axis },
        `${idx}: ${axis.toFixed(4)}`
      )
    )
  })
}
function store (state, emitter) {
  state.controllers = {}
  state.requestId = null

  window.addEventListener('gamepadconnected', ({ gamepad }) => {
    state.controllers[gamepad.index] = gamepad
    emitter.emit('render')
  })

  window.addEventListener('gamepaddisconnected', ({ gamepad }) => {
    delete state.controllers[gamepad.index]
    emitter.emit('render')
  })

  function scanGamepads () {
    var gamepads = navigator.getGamepads()

    Array.from(gamepads).forEach(gamepad => {
      if (gamepad) state.controllers[gamepad.index] = gamepad
    })

    emitter.emit('render')
    window.requestAnimationFrame(scanGamepads)
  }

  scanGamepads()
}
