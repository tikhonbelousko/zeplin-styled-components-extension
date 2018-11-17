import Layer from 'zeplin-extension-style-kit/elements/layer'

function layer(context, selectedLayer) {
  const l = new Layer(selectedLayer)
  const layerStyle = l.style
  console.log(l.style)
  return {
    code: JSON.stringify(layerStyle),
    language: 'js'
  }
}

// function styleguideColors(context, colors) {}
// function styleguideTextStyles(context, textStyles) {}
// function exportStyleguideColors(context, colors) {}
// function exportStyleguideTextStyles(context, textStyles) {}
// function comment(context, text) {}

export default {
  layer
  // styleguideColors,
  // styleguideTextStyles,
  // exportStyleguideColors,
  // exportStyleguideTextStyles,
  // comment
}
