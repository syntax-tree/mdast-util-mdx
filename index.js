import mdxExpressionFromMarkdown from 'mdast-util-mdx-expression/from-markdown.js'
import mdxExpressionToMarkdown from 'mdast-util-mdx-expression/to-markdown.js'
import mdxJsxFromMarkdown from 'mdast-util-mdx-jsx/from-markdown.js'
import mdxJsxToMarkdown from 'mdast-util-mdx-jsx/to-markdown.js'
import mdxjsEsmFromMarkdown from 'mdast-util-mdxjs-esm/from-markdown.js'
import mdxjsEsmToMarkdown from 'mdast-util-mdxjs-esm/to-markdown.js'

const own = {}.hasOwnProperty

export const mdxFromMarkdown = configure([
  mdxExpressionFromMarkdown,
  mdxJsxFromMarkdown,
  mdxjsEsmFromMarkdown
])

function configure(extensions) {
  const config = {canContainEols: []}
  let index = -1

  while (++index < extensions.length) {
    extension(config, extensions[index])
  }

  return config
}

function extension(config, extension) {
  let key
  let left

  for (key in extension) {
    if (own.call(extension, key)) {
      left = own.call(config, key) ? config[key] : (config[key] = {})
      const right = extension[key]

      if (key === 'canContainEols') {
        config[key] = [].concat(left, right)
      } else {
        Object.assign(left, right)
      }
    }
  }
}

export const mdxToMarkdown = {
  extensions: [mdxExpressionToMarkdown, mdxJsxToMarkdown, mdxjsEsmToMarkdown]
}
