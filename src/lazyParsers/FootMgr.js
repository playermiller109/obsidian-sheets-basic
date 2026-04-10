module.exports = class {
  inlineRefs = []; normalRefs = []
  retain = (cellEl) => {
    const footEls = cellEl.querySelectorAll('.footnote-ref')

    Array.from(footEls).map((el) => {
      const ref = ({
        cont: el.children[0].dataset.footref,
        html: el.outerHTML, el,
      })
      if (el.querySelector(':scope > '+this.inlineAttr)) {
        this.inlineRefs.push(ref)
      }
      else this.normalRefs.push(ref)
    })
  }
  dummy = (text) => {
    return text.replaceAll(this.footRE, `↿$1↿`)
  }
  inlineAttr = '[data-footref^="[inline"]'
  footRE = /(?<!\\)\[\^(.+?)\]/g

  handleInline = (cellEl) => {
    const footsSec = cellEl.querySelector('section.footnotes')

    if (footsSec) {
      footsSec.remove()
      cellEl.querySelectorAll(this.inlineAttr).forEach((child, i) => {
        child.parentElement.replaceWith(this.inlineRefs[i].el)
      })
    }
  }
  restore = (text) => {
    return text.replaceAll(
      /↿(.+?)↿/g, (m, p1) => {
        const ref = this.normalRefs.find(ref => ref.cont === p1)
        return ref ? ref.html : p1
      }
    )
  }
}