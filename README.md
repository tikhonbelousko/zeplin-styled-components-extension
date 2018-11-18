# Zeplin Styled Components Extension


Generates styled-components snippets from colors, text styles and layers.

Sample component output:
```js
styled.div`
  ${Typography.Button};
  width: 69px;
  height: 16px;
  font-weight: 500;
  color: ${Colors.White};
`
```

Sample colors output:
```js
export default {
  White: '#ffffff',
  Blue300: '#4a90e2',
  Gray300: '#9b9b9b',
  Black300: '#000000'
}
```

Sample text style output:
```js
import { css } from 'styled-components'

export default {
  Body: css`
    font-family: OpenSans;
    font-size: 18px;
    line-height: 24px;
  `,

  H1: css`
    font-family: OpenSans;
    font-size: 48px;
    font-weight: bold;
    line-height: 52px;
  `,

  Button: css`
    font-family: OpenSans;
    font-size: 16px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 1px;
  `
}
```

## TODO
- Add parameter for exporting component styles without wrapping them in `styled.div`.
- Add parameter for exporting colors with alpha channel using `hexToRgba` function.
- Add parameter for including breakpoints.
- Describe in README conventions for colors and typography.
- Use number for font-weight instead of string (e.g. bold).
