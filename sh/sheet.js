const { mergeTable, mergeAllInView } = require('./mergeTable/mergeTable.js')

module.exports = (plg, {ob, ViewPlugin}) => {
  const { app } = plg
  function getActiveTableCell(cm) {
    if (!cm) return
    const view5 = cm.state.field(ob.editorInfoField)
    const eMode = view5?.editMode
    if (!eMode) return
    // when cursor in a table you can get tableCell
    return eMode.tableCell
  }

  let focusedCM
  class liveParser {
    update(update) {
      const { view: cm } = update
      const undo = update.transactions.find(tr => tr.isUserEvent('undo'))

      if (undo) {
        const tableCell = getActiveTableCell(cm)
        if (tableCell) {
          // table.render() is an Ob prototype
          // you can use table.rebuildTable() too
          tableCell.table.render()
          mergeTable(tableCell.table)
        }
      }

      if (
        update.focusChanged && cm.hasFocus
        || update.viewportChanged
      ) {
        focusedCM = cm
        setTimeout(() => mergeAllInView(cm))
      }
    }
  }

  const postParser = require('./lazyParsers/postParser.js')(app, ob)
  const unmergeCell = (tableCell) => {
    const { table, cell } = tableCell
    const { row, col, el: cellEl } = cell
    const rSpan = cellEl.rowSpan
    const cSpan = cellEl.colSpan

    if (rSpan > 1 || cSpan > 1) {
      for (let rIdx = row; rIdx < row + rSpan; rIdx++) {
        for (let cIdx = col; cIdx < col + cSpan; cIdx++) {
          const _cell = table.rows[rIdx][cIdx]
          if (_cell) {
            _cell.el.removeAttribute('id')
            _cell.el.style.display = 'table-cell'
          }
        }
      }
      cellEl.colSpan = cellEl.rowSpan = 1
      return !0
    }
  }
  const blockParser = require('./lazyParsers/blockParser.js')(app, ob)

  plg.registerEditorExtension([ViewPlugin.fromClass(liveParser)])
  plg.registerMarkdownPostProcessor(postParser.main)
  plg.registerEvent(app.workspace.on('file-open', () => {
    postParser.wipe(); focusedCM = null
  }))
  plg.registerMarkdownCodeBlockProcessor('sheet', blockParser)

  plg.addCommand({
    id: 'rebuild', name: 'rebuildCurrent',
    callback: async () => {
      postParser.wipe()
      const tableCell = getActiveTableCell(focusedCM)

      if (tableCell) {
        const checking = unmergeCell(tableCell)
        if (!checking) mergeTable(tableCell.table)
      }
      else {
        const frontView = app.workspace.getActiveFileView()
        const frontViewType = frontView.getViewType()
        const leaves = app.workspace.getLeavesOfType(frontViewType)
          .filter(leaf => leaf.view.file?.path === frontView.file.path)
        for (const leaf of leaves) await leaf.rebuildView()
      }
    },
    hotkeys: [{modifiers: [], key: 'F5'}]
  })
}
