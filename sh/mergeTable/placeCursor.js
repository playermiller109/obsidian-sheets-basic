const { isSign } = require('../utils.js')

module.exports = (table) => new class {
  constructor() {
    this.handleSelect()
    this.handleFocus()
  }
  handleSelect() {
    const _old = table.getClosestCell
    table.getClosestCell = function(clickX, clickY) {
      const rows = this.rows

      // falls right inside
      const elements = document.elementsFromPoint(clickX, clickY)
      for (const el of elements) {
        const td = el.closest('td, th')
        if (td) {
          const tr = td.closest('tr')
          if (tr) {
            const rIdx = tr.rowIndex
            const cIdx = td.cellIndex
            const foundCell = rows[rIdx]?.[cIdx]
            if (foundCell) return foundCell
          }
        }
      }

      // the closest so far
      let closestRow = null
      let minDySq = Infinity

      for (const row of rows) {
        const tr = row[0].el.closest('tr')
        if (!tr) continue
        const rect = tr.getBoundingClientRect()

        let dy = 0
        if (clickY < rect.top) dy = rect.top - clickY
        else if (clickY > rect.bottom) dy = clickY - rect.bottom

        const dySq = dy**2
        if (dySq < minDySq) {
          minDySq = dySq
          closestRow = row
          if (dySq === 0) break
        }
      }

      let closestCell = null
      let minDxSq = Infinity

      if (closestRow) {
        for (const cell of closestRow) {
          if (cell.el.style.display === 'none') continue
          const rect = cell.el.getBoundingClientRect()

          let dx = 0
          if (clickX < rect.left) dx = rect.left - clickX
          else if (clickX > rect.right) dx = clickX - rect.right

          const dxSq = dx**2
          if (dxSq < minDxSq) {
            minDxSq = dxSq
            closestCell = cell
            if (dxSq === 0) break
          }
        }
      }

      if (minDySq + minDxSq > 100**2) {
        return null
      }
      return closestCell
    }
  }
  handleFocus() {
    const _old = table.receiveCellFocus
    table.receiveCellFocus = function(row, col, func, flag) {
      if (table.rows[row]?.[col]?.el.style.display === 'none') {
        const { cell } = table.editor.tableCell
        const { row: maxRow, col: maxCol } = table.rows.at(-1).at(-1)

        if (row === cell.row) {
          while (isSign(table.rows[row]?.[col]?.text)) {
            col += (col < cell.col) ? -1 : 1
          }

          if (col < 0) {
            while (isSign(table.rows[row]?.[0].text)) row--
          }
          if (col > maxCol) {
            col = 0; row++
            if (row > maxRow) table.insertRow(row, col)
          }
        }
        else if (col === cell.col) {
          while (isSign(table.rows[row]?.[col]?.text)) {
            row += (row < cell.row) ? -1 : 1
          }

          if (row < 0) {
            while (isSign(table.rows[0][col]?.text)) col--
          }
        }
        else {
          if (row === cell.row - 1) {
            while (isSign(table.rows[row][col]?.text)) col--
          }
          if (row === cell.row + 1) {
            while (isSign(table.rows[row][col]?.text)) col++
          }
        }
      }
      _old.call(this, row, col, func, flag)
    }
  }
}
