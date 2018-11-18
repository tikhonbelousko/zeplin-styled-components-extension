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
    // if (
    //   ['font-family', 'font-size', 'line-height', 'letter-spacing', 'font-weight'].find(
    //     v => v === d.name
    //   )
    // ) {
    //   return false
    // }

    return !(d.hasDefaultValue && d.hasDefaultValue())
  })
}

// [ TextStyle {
//     name: 'Sample text style',
//     fontFace: 'SFProText-Regular',
//     fontSize: 20,
//     fontWeight: 400,
//     fontStyle: 'normal',
//     fontFamily: 'SFProText',
//     fontStretch: 'normal',
//     textAlign: 'left',
//     weightText: 'regular',
//     color: Color { r: 0, g: 0, b: 0, a: 1, name: undefined },
//     scaledFontSize: 20 },
function declarationsToString(declarations, variableMap, textStyleMatch) {
  const filteredDeclarations = filterDeclarations(declarations)
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
  let textStyleMatch

  if (selectedLayer.type === 'text' && defaultTextStyle) {
    const declarations = l.getLayerTextStyleDeclarations(defaultTextStyle)
    // console.log(new TextStyle(defaultTextStyle).font)
    const layerTextStyle = new TextStyle(defaultTextStyle).font

    textStyleMatch = projectTextStyles.find(textStyle => {
      return (
        textStyle.fontFamily === layerTextStyle.fontFamily &&
        textStyle.fontSize === layerTextStyle.fontSize &&
        textStyle.lineHeight === layerTextStyle.lineHeight &&
        textStyle.letterSpacing === layerTextStyle.letterSpacing
      )
    })
    // console.log(projectTextStyles[0].fontSize, font.fontSize)
    // console.log(textStyleMatch)
    declarations.forEach(p => layerRuleSet.addDeclaration(p))
  }

  const variableMap = getVariableMap(projectColors)
  const code = declarationsToString(layerRuleSet.declarations, variableMap, textStyleMatch)

  return {
    code: code,
    language: 'js'
  }
}
