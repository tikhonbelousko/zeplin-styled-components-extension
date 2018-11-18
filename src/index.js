import layer from './layer'
import styleguideColors from './styleguideColors'
import styleguideTextStyles from './styleguideTextStyles'

function comment(context, text) {
  return `/* ${text} */`
}

export default {
  layer,
  styleguideColors,
  styleguideTextStyles,
  comment
}
