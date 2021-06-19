import mdxExpressionFromMarkdown from 'mdast-util-mdx-expression/from-markdown.js'
import mdxExpressionToMarkdown from 'mdast-util-mdx-expression/to-markdown.js'
import mdxJsxFromMarkdown from 'mdast-util-mdx-jsx/from-markdown.js'
import mdxJsxToMarkdown from 'mdast-util-mdx-jsx/to-markdown.js'
import mdxjsEsmFromMarkdown from 'mdast-util-mdxjs-esm/from-markdown.js'
import mdxjsEsmToMarkdown from 'mdast-util-mdxjs-esm/to-markdown.js'

var own = {}.hasOwnProperty

export const mdxFromMarkdown = configure([
  mdxExpressionFromMarkdown,
  mdxJsxFromMarkdown,
  mdxjsEsmFromMarkdown
])

function configure(extensions) {
  var config = {canContainEols: []}
  var index = -1

  while (++index < extensions.length) {
    extension(config, extensions[index])
  }

  return config
}

function extension(config, extension) {
  var key
  var left
  var right

  for (key in extension) {
    left = own.call(config, key) ? config[key] : (config[key] = {})
    right = extension[key]

    if (key === 'canContainEols') {
      config[key] = [].concat(left, right)
    } else {
      Object.assign(left, right)
    }
  }
}

export const mdxToMarkdown = {
  extensions: [mdxExpressionToMarkdown, mdxJsxToMarkdown, mdxjsEsmToMarkdown]
}
