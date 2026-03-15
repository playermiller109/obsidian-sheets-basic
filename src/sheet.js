const { mergeTable, mergeAllInView } = require('./mergeTable/mergeTable.js')

module.exports = (app, {ob, ViewPlugin})=> {
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
      const undo = update.transactions.find(tr=> tr.isUserEvent('undo'))

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
        setTimeout(()=> mergeAllInView(cm))
      }
    }
  }

  const postParser = require('./lazyParsers/postParser.js')(app, ob)
  const unmergeCell = tableCell=> {
    const { table, cell } = tableCell
    const cells = table.rows.flat()
    const { row, col, el: cellEl } = cell

    if (cellEl.rowSpan > 1 || cellEl.colSpan > 1) {
      cells
        .filter(cell2=>
          row <= cell2.row && cell2.row < row + cellEl.rowSpan
          && col <= cell2.col && cell2.col < col + cellEl.colSpan
        )
        .map(cell2=> {
          cell2.el.removeAttribute('id')
          cell2.el.style.display = 'table-cell'
        })
      cellEl.colSpan = cellEl.rowSpan = 1
      return !0
    }
  }
  const blockParser = require('./lazyParsers/blockParser.js')(app, ob)

  return function () {
    this.registerEditorExtension([ViewPlugin.fromClass(liveParser)])
    this.registerMarkdownPostProcessor(postParser.main)
    this.registerEvent(app.workspace.on('file-open', ()=> {
      postParser.wipe(); focusedCM = null
    }))
    this.registerMarkdownCodeBlockProcessor('sheet', blockParser)

    this.addCommand({
      id: 'rebuild', name: 'rebuildCurrent',
      callback: async ()=> {
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
            .filter(leaf=> leaf.view.file?.path === frontView.file.path)
          for (const leaf of leaves) await leaf.rebuildView()
        }
      },
      hotkeys: [{modifiers: [], key: 'F5'}]
    })
  }
}