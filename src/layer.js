import Layer from 'zeplin-extension-style-kit/elements/layer'
import Color from 'zeplin-extension-style-kit/values/color'
import { getUniqueLayerTextStyles } from 'zeplin-extension-style-kit/utils'

function getVariableMap(projectColors) {
  const variables = {}

  projectColors.forEach(projectColor => {
    variables[new Color(projectColor).valueOf()] = '${Colors.' + projectColor.name + '}'
  })

  return variables
}

function filterDeclarations(declarations) {
  return declarations.filter(d => {
    return !(d.hasDefaultValue && d.hasDefaultValue())
  })
}

function declarationsToString(declarations, variableMap) {
  return `const Element = styled.div\`\n${declarations
    .map(d => `  ${d.name}: ${d.getValue({ densityDivisor: 1 }, variableMap)};`)
    .join('\n')}\n\``
}

export default function layer(context, selectedLayer) {
  const { colors: projectColors, textStyles: projectTextStyles } = context.project
  const l = new Layer(selectedLayer)
  const layerRuleSet = l.style
  const { defaultTextStyle } = selectedLayer

  if (selectedLayer.type === 'text' && defaultTextStyle) {
    const declarations = l.getLayerTextStyleDeclarations(defaultTextStyle)
    declarations.forEach(p => layerRuleSet.addDeclaration(p))
    console.log(declarations)
  }

  const variableMap = getVariableMap(projectColors)
  const filteredDeclarations = filterDeclarations(layerRuleSet.declarations)
  const code = declarationsToString(filteredDeclarations, variableMap)

  return {
    code: code,
    language: 'js'
  }
}
