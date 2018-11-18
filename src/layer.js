import Layer from 'zeplin-extension-style-kit/elements/layer'
import TextStyle from 'zeplin-extension-style-kit/elements/textStyle'
import Color from 'zeplin-extension-style-kit/values/color'
import { getUniqueLayerTextStyles } from 'zeplin-extension-style-kit/utils'

function getVariableMap(projectColors) {
  return projectColors.reduce((variableMap, color) => {
    variableMap[new Color(color).valueOf()] = '${Colors.' + color.name + '}'
    return variableMap
  }, {})
}

function filterDeclarations(declarations, textStyleMatch) {
  return declarations.filter(d => {
    if (
      textStyleMatch &&
      (d.name === 'font-size' ||
        d.name === 'font-family' ||
        d.name === 'letter-spacing' ||
        d.name === 'line-height')
    ) {
      return false
    }

    return !(d.hasDefaultValue && d.hasDefaultValue())
  })
}

function joinRules(rules) {
  return 'export const Box = styled.div`\n' + rules.join('\n') + '\n`'
}

function declarationsToString(declarations, variableMap, textStyleMatch) {
  const filteredDeclarations = filterDeclarations(declarations, textStyleMatch)
  const textStyleMixins = textStyleMatch ? ['  ${Typography.' + textStyleMatch.name + '};'] : []
  const rules = [
    ...textStyleMixins,
    ...filteredDeclarations.map(
      d => `  ${d.name}: ${d.getValue({ densityDivisor: 1 }, variableMap)};`
    )
  ]

  return joinRules(rules)
}

export default function layer(context, selectedLayer) {
  const l = new Layer(selectedLayer)
  const layerRuleSet = l.style
  const { defaultTextStyle } = selectedLayer
  const isText = selectedLayer.type === 'text' && defaultTextStyle
  const textStyleMatch = isText ? context.project.findTextStyleEqual(defaultTextStyle) : undefined

  if (isText) {
    const declarations = l.getLayerTextStyleDeclarations(defaultTextStyle)
    declarations.forEach(p => layerRuleSet.addDeclaration(p))
  }

  const variableMap = getVariableMap(context.project.colors)
  const code = declarationsToString(layerRuleSet.declarations, variableMap, textStyleMatch)

  return {
    code: code,
    language: 'js'
  }
}
