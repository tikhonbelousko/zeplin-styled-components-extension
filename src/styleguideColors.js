import Color from 'zeplin-extension-style-kit/values/color'

function joinRules(rules) {
  return 'export default {\n' + rules.join(',\n') + '\n}'
}

export default function styleguideColors(context, colors) {
  const colorRules = colors.map(color => {
    const colorValue = new Color(color).toStyleValue({ colorFormat: 'hex' })

    return `  ${color.name}: '${colorValue}'`
  })

  return {
    code: joinRules(colorRules),
    language: 'js'
  }
}
