import Layer from 'zeplin-extension-style-kit/elements/layer'
import TextStyle from 'zeplin-extension-style-kit/elements/textStyle'
import Color from 'zeplin-extension-style-kit/values/color'
import { getUniqueLayerTextStyles } from 'zeplin-extension-style-kit/utils'
import _ from 'lodash'

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

function declarationsToString(declarations, variableMap, textStyleMatch) {
  const filteredDeclarations = filterDeclarations(declarations, textStyleMatch)
  const textStyleName = textStyleMatch ? '  ${Typography.' + textStyleMatch.name + '};\n' : ''
  return `styled.div\`\n${textStyleName}${filteredDeclarations
    .map(d => `  ${d.name}: ${d.getValue({ densityDivisor: 1 }, variableMap)};`)
    .join('\n')}\n\``
}

export default function layer(context, selectedLayer) {
  const { colors: projectColors, textStyles: projectTextStyles } = context.project
  const l = new Layer(selectedLayer)
  const layerRuleSet = l.style
  const { defaultTextStyle } = selectedLayer
  const isText = selectedLayer.type === 'text' && defaultTextStyle
  const textStyleMatch = isText ? context.project.findTextStyleEqual(defaultTextStyle) : undefined
  console.log(textStyleMatch)

  if (isText) {
    const declarations = l.getLayerTextStyleDeclarations(defaultTextStyle)
    declarations.forEach(p => layerRuleSet.addDeclaration(p))
  }

  const variableMap = getVariableMap(projectColors)
  const code = declarationsToString(layerRuleSet.declarations, variableMap, textStyleMatch)

  return {
    code: code,
    language: 'js'
  }
}
