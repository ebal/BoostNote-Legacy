import consts from 'browser/lib/consts'
import isString from 'lodash/isString'

function quoteFontName(name) {
  return name.includes(' ') ? `'${name}'` : name
}

export default function normalizeEditorFontFamily(fontFamily) {
  const defaultEditorFontFamily = consts.DEFAULT_EDITOR_FONT_FAMILY
  return isString(fontFamily) && fontFamily.length > 0
    ? [quoteFontName(fontFamily)]
        .concat(defaultEditorFontFamily.map(quoteFontName))
        .join(', ')
    : defaultEditorFontFamily.map(quoteFontName).join(', ')
}
