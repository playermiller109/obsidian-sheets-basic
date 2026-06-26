const ob = require('obsidian'), { ViewPlugin } = require('@codemirror/view')

module.exports = class extends ob.Plugin {
  onload() {
    const sheet = require('./sh/sheet.js'); sheet(this, {ob, ViewPlugin})
  }
}
