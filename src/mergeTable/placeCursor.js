const { isSign } = require('../utils.js')
module.exports = (table)=> new class {
  constructor() {
    this.handleSelect()
    this.handleFocus()
  }
  handleSelect() {
    const _old = table.getClosestCell
    table.getClosestCell = function (clickX, clickY) {
      const rows = this.rows
      let closestRow = null
      let minRowDist = Infinity
      for (const row of rows) {
        const trElement = row[0].el.closest('tr')
        if (!trElement) continue
        const rowRect = trElement.getBoundingClientRect()
        // falls right inside
        if (rowRect.top <= clickY && clickY <= rowRect.bottom) {
          closestRow = row
          minRowDist = 0
          break
        }
        // the closest so far
        const dist = Math.min(
          Math.abs(rowRect.top - clickY),
          Math.abs(rowRect.bottom - clickY)
        )
        if (dist < minRowDist) {
          closestRow = row
          minRowDist = dist
        }
      }
      let closestCell = null
      let minCellDist = Infinity
      if (closestRow) {
        for (const cell of closestRow) {
          const cellRect = cell.el.getBoundingClientRect()
          // falls right inside
          if (cellRect.left <= clickX && clickX <= cellRect.right) {
            closestCell = cell
            minCellDist = 0
            break
          }
          // the closest so far
          const dist = Math.min(
            Math.abs(cellRect.left - clickX),
            Math.abs(cellRect.right - clickX)
          )
          if (dist < minCellDist) {
            minCellDist = dist
            closestCell = cell
          }
        }
      }
      return closestCell || rows[0][0]
    }
  }
  handleFocus() {
    const _old = table.receiveCellFocus
    table.receiveCellFocus = function (row, col, func, flag) {
      if (table.rows[row]?.[col]?.el.style.display == 'none') {
        const { cell } = table.editor.tableCell
        const cells = table.rows.flat()
        const { row: maxRow, col: maxCol } = cells.pop()

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