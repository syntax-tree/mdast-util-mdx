/**
 * @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
 * @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
 */

import {
  mdxExpressionFromMarkdown,
  mdxExpressionToMarkdown
} from 'mdast-util-mdx-expression'
import {mdxJsxFromMarkdown, mdxJsxToMarkdown} from 'mdast-util-mdx-jsx'
import {mdxjsEsmFromMarkdown, mdxjsEsmToMarkdown} from 'mdast-util-mdxjs-esm'

/** @type {FromMarkdownExtension[]} */
export const mdxFromMarkdown = [
  mdxExpressionFromMarkdown,
  mdxJsxFromMarkdown,
  mdxjsEsmFromMarkdown
]

/** @type {ToMarkdownExtension} */
export const mdxToMarkdown = {
  extensions: [mdxExpressionToMarkdown, mdxJsxToMarkdown, mdxjsEsmToMarkdown]
}
