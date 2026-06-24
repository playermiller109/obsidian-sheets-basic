const SIGN = {up: '^', left: '<'}
const cellId = 'm-sheet-cell'
const disable = (el) => { el.id = cellId; el.style.display = 'none' }

module.exports = new class {
  tableId = 'm-sheet'
  isSign = (text) => Object.values(SIGN).includes(text)
  merge = (_cell, rows) => {
    if (_cell.el.id === cellId) return

    let i = 1, type, stop

    if (_cell.text === SIGN.left && _cell.col > 0) {
      type = 'colSpan'
      stop = SIGN.up
    } else if (_cell.text === SIGN.up && _cell.row > 0) {
      type = 'rowSpan'
      stop = SIGN.left
    } else return

    disable(_cell.el)

    let foundCell, broke
    do {
      const rIdx = type === 'rowSpan' ? _cell.row - i : _cell.row
      const cIdx = type === 'colSpan' ? _cell.col - i : _cell.col
      if (rIdx < 0 || cIdx < 0) { broke = !0; break }

      foundCell = rows[rIdx][cIdx]
      if (!foundCell || foundCell.text === stop) { broke = !0; break }
      i++
    } while (foundCell.el.id === cellId); if (broke) return

    const { el: cellEl } = foundCell
    cellEl[type] || Object.assign(cellEl, { [type]: 1 })
    cellEl[type] += 1
    return !0
  }
}
