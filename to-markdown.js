var expression = require('mdast-util-mdx-expression/to-markdown')
var jsx = require('mdast-util-mdx-jsx/to-markdown')
var esm = require('mdast-util-mdxjs-esm/to-markdown')

module.exports = configure()

function configure() {
  var extensions = [expression, jsx, esm]
  var index = -1
  var unsafe = []
  var handlers = {}
  var extension

  while (++index < extensions.length) {
    extension = extensions[index]
    unsafe = unsafe.concat(extension.unsafe || [])
    // istanbul ignore next - handlers always exists, for now.
    handlers = Object.assign(handlers, extension.handlers || {})
  }

  return {unsafe: unsafe, handlers: handlers}
}
