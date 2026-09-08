
```js
let _ihtml = ''
for (const node of cellEl.childNodes) {
  if (node.nodeType === 3) {
    _ihtml += (node.data === '\n') ? '<br><br>' : node.data
  }
  else _ihtml += isP(node) ? node.innerHTML : node.outerHTML
}
_ihtml = footMgr.restore(_ihtml)
cellEl.innerHTML = _ihtml

/* FootMgr.js */
const ref = ({
  html: el.outerHTML, el,
  cont: // ...
})
restore = (text) => {
  return text.replaceAll(
    /↿(.+?)↿/g, (m, p1) => {
      const ref = this.normalRefs.find(ref => ref.cont === p1)
      return ref ? ref.html : p1
    }
  )
}
```

```js
this.tableHead = tableEl.createEl('thead')
this.tableBody = tableEl.createEl('tbody')
```

```js
if (this.headerRow !== -1) {
  const heads = this.contGrid[this.headerRow]
  this.colStyles = this.getHeaderStyles(heads)
}
getHeaderStyles(heads) {
  return heads.map((head) => {
    const alignment = head.match(this.headerRE), styles = {}
    if (alignment[1] && alignment[2]) styles['textAlign'] = 'center';
    else if (alignment[1]) styles['textAlign'] = 'left';
    else if (alignment[2]) styles['textAlign'] = 'right';
    return { styles }
  })
}
```
