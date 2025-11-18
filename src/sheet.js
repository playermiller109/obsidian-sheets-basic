const { mergeTable, mergeAllInView } = require('./mergeTable/mergeTable.js')
module.exports = (app, {ob, ViewPlugin})=> {
  const viewAccessor = new class {
    get view5() { return app.workspace.getActiveFileView() }
    get eMode() { return this.view5?.editMode }
  }
  class liveParser {
    update(update) {
      const { eMode } = viewAccessor; if (!eMode) return
      // when cursor in a table you can get tableCell
      const { tableCell } = eMode
      const undo = update.transactions.find(tr=> tr.isUserEvent('undo'))
      // table.render() is an Ob prototype
      // you can use table.rebuildTable() too
      if (undo && tableCell) {
        tableCell.table.render()
        mergeTable(tableCell.table)
      }
      const { view } = update
      if (
        update.focusChanged && view.hasFocus
        || update.viewportChanged
      ) setTimeout(()=> mergeAllInView(view))
    }
  }
  const postParser = require('./lazyParsers/postParser.js')(app, ob)
  const updateMerge = ()=> {
    postParser.grid = []
    const { eMode } = viewAccessor; if (!eMode) return
    const view = eMode.cm
    if (view) setTimeout(()=> mergeAllInView(view), 50)
  }
  const unmergeCell = tableCell=> {
    const { table, cell } = tableCell
    const cells = table.rows.flat()
    const { row, col, el: cellEl } = cell
    if (cellEl.rowSpan > 1 || cellEl.colSpan > 1) {
      cells.filter(cell2=>
        row <= cell2.row && cell2.row < row + cellEl.rowSpan
        && col <= cell2.col && cell2.col < col + cellEl.colSpan
      ).map(cell2=> {
        cell2.el.removeAttribute('id')
        cell2.el.style.display = 'table-cell'
      })
      cellEl.colSpan = cellEl.rowSpan = 1; return !0
    }
  }
  const blockParser = require('./lazyParsers/blockParser.js')(app, ob)
  return function () {
    this.registerMarkdownPostProcessor(postParser.main)
    this.registerMarkdownCodeBlockProcessor('sheet', blockParser)
    this.registerEvent(app.workspace.on('file-open', updateMerge))
    app.workspace.onLayoutReady(updateMerge)
    this.addCommand({
      id: 'rebuild', name: 'rebuildCurrent',
      callback: async ()=> {
        postParser.grid = []
        const { view5, eMode } = viewAccessor; if (!view5) return
        const { tableCell } = eMode || {}
        if (tableCell) {
          const checking = unmergeCell(tableCell)
          if (!checking) mergeTable(tableCell.table)
        }
        else {
          const viewType = view5.getViewType()
          const leaves = app.workspace.getLeavesOfType(viewType)
            .filter(leaf=> leaf.view.file?.path == view5.file.path)
          for (const leaf of leaves) await leaf.rebuildView()
        }
      },
      hotkeys: [{modifiers: [], key: 'F5'}]
    })
    this.registerEditorExtension([ViewPlugin.fromClass(liveParser)])
  }
}