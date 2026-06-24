const { merge } = require('../utils.js')
const placeCursor = require('./placeCursor.js')

const mergeTable = (table) => {
  requestAnimationFrame(() => {
    const rows = table.rows
    for (const row of rows) {
      for (const _cell of row) {
        merge(_cell, rows)
      }
    }
    placeCursor(table)
  })
}
const mergeAllInView = (cm) => {
  const cmUnits = cm.docView.children
  if (!cmUnits) return
  for (const c of cmUnits) {
    const isTable = c.dom.className.includes('table-widget')
    if (isTable && c.widget) mergeTable(c.widget)
  }
}
module.exports = { mergeTable, mergeAllInView }
