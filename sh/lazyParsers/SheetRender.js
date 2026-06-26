const { tableId, merge } = require('../utils.js')
const FootMgr = require('./FootMgr.js')

module.exports = (app, ob) => class extends ob.MarkdownRenderChild {
  constructor(el, contGrid) {
    super(el)
    const tableEl = el
    tableEl.id = tableId
    this.domGrid = Array.from(tableEl.rows).map((tr, rowIdx) => {
      return Array.from(tr.cells).map((td, colIdx) => ({
        el: td, row: rowIdx, col: colIdx,
        text: contGrid[rowIdx][colIdx],
      }))
    })
    this.buildDomTable()
  }
  onload() {}
  onunload() {}

  buildDomTable() {
    const cells = this.domGrid.flat()
    for (const _cell of cells) {
      const merged = merge(_cell, cells)
      if (!merged) this.normalizeCell(_cell)
    }
  }

  unwrapParagraphs(cellEl) {
    const isP = (el) => el && el.tagName === 'P';

    [cellEl.firstChild, cellEl.lastChild].forEach((el) => {
      if (el && isP(el) && !el.textContent.trim() && !el.children[0]) {
        el.remove()
      }
    })

    const nodes = Array.from(cellEl.childNodes)
    nodes.forEach(node => {
      if (node.nodeType === 3 && node.data === '\n') {
        const br1 = document.createElement('br')
        const br2 = document.createElement('br')
        cellEl.insertBefore(br1, node)
        cellEl.replaceChild(br2, node)
      }
      else if (isP(node)) {
        while (node.firstChild) {
          cellEl.insertBefore(node.firstChild, node)
        }
        node.remove()
      }
    })
  }

  normalizeCell({text, el}) {
    const footMgr = new FootMgr()
    text = text.replaceAll('<br>', '\n')
    text = footMgr.dummy(text)
    footMgr.retain(el)
    const offDom = createDiv()

    ob.MarkdownRenderer.render(
      app, text||'\u200B', offDom, '', this
    ).then(() => {
      footMgr.handleInline(offDom)
      this.unwrapParagraphs(offDom)
      footMgr.restore(offDom)

      el.empty()
      while (offDom.firstChild) {
        el.appendChild(offDom.firstChild)
      }
    })
  }
}
