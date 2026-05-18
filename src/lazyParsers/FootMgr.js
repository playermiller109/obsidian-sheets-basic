module.exports = class {
  inlineRefs = []; normalRefs = []
  inlineAttr = '[data-footref^="[inline"]'

  retain = (cellEl) => {
    const footEls = cellEl.querySelectorAll('.footnote-ref')

    Array.from(footEls).forEach((el) => {
      const ref = ({
        el,
        cont: el.children[0].dataset.footref,
      })
      if (el.querySelector(':scope > '+this.inlineAttr)) {
        this.inlineRefs.push(ref)
      } else {
        this.normalRefs.push(ref)
      }
    })
  }

  dummy = (text) => {
    return text.replaceAll(this.footRE, (m, cont) => {
      return `<span id="${this.footId}" data-cont="${cont}"></span>`
    })
  }
  footId = 'm-foot'
  footRE = /(?<!\\)\[\^(.+?)\]/g

  handleInline = (cellEl) => {
    const footsSec = cellEl.querySelector('section.footnotes')
    if (footsSec) {
      const inlineFoots = cellEl.querySelectorAll(this.inlineAttr)
      inlineFoots.forEach((child, i) => {
        if (this.inlineRefs[i]) {
          child.parentElement.replaceWith(this.inlineRefs[i].el)
        }
      })
      footsSec.remove()
    }
  }

  restore = (cellEl) => {
    const walker = document.createTreeWalker(cellEl, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (node) => {
        return node.id === this.footId
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP
      },
    })

    const placeholders = []
    let currentNode
    while ((currentNode = walker.nextNode())) {
      placeholders.push(currentNode)
    }

    placeholders.forEach((placeholder) => {
      const cont = placeholder.dataset.cont
      const ref = this.normalRefs.find((r) => r.cont === cont)
      if (ref) {
        placeholder.replaceWith(ref.el)
      } else {
        placeholder.replaceWith(document.createTextNode(`[^${cont}]`))
      }
    })
  }
}
