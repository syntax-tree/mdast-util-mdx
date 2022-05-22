# mdast-util-mdx

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[mdast][] extensions to parse and serialize [MDX][]: ESM import/exports,
JavaScript expressions, and JSX.

## Contents

*   [What is this?](#what-is-this)
*   [When to use this](#when-to-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`mdxFromMarkdown()`](#mdxfrommarkdown)
    *   [`mdxToMarkdown(options?)`](#mdxtomarkdownoptions)
*   [Syntax tree](#syntax-tree)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package contains extensions for
[`mdast-util-from-markdown`][mdast-util-from-markdown] and
[`mdast-util-to-markdown`][mdast-util-to-markdown] to enable the features that
MDX adds to markdown: import/exports (`export x from 'y'`), expressions
(`{z}`), and JSX (`<Component />`).

## When to use this

These tools are all rather low-level.
In many cases, you’d want to use [`remark-mdx`][remark-mdx] with remark instead.

Use this if you’re dealing with the AST manually and want to support all of MDX.
Instead of this package, you can also use the extensions separately:

*   [`mdast-util-mdx-expression`](https://github.com/syntax-tree/mdast-util-mdx-expression)
    — support MDX expressions
*   [`mdast-util-mdx-jsx`](https://github.com/syntax-tree/mdast-util-mdx-jsx)
    — support MDX JSX
*   [`mdast-util-mdxjs-esm`](https://github.com/syntax-tree/mdast-util-mdxjs-esm)
    — support MDX ESM

When working with `mdast-util-from-markdown`, you must combine this package with
[`micromark/micromark-extension-mdx`][mdx] or
[`micromark/micromark-extension-mdxjs`][mdxjs].

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install mdast-util-mdx
```

In Deno with [`esm.sh`][esmsh]:

```js
import {mdxFromMarkdown, mdxToMarkdown} from 'https://esm.sh/mdast-util-mdx@2'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {mdxFromMarkdown, mdxToMarkdown} from 'https://esm.sh/mdast-util-mdx@2?bundle'
</script>
```

## Use

Say our document `example.mdx` contains:

```markdown
import Box from "place"

Here’s an expression:

{
  1 + 1 /* } */
}

Which you can also put inline: {1+1}.

<Box>
  <SmallerBox>
    - Lists, which can be indented.
  </SmallerBox>
</Box>
```

…and our module `example.js` looks as follows:

```js
import fs from 'node:fs/promises'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {toMarkdown} from 'mdast-util-to-markdown'
import {mdxjs} from 'micromark-extension-mdxjs'
import {mdxFromMarkdown, mdxToMarkdown} from 'mdast-util-mdx'

const doc = await fs.readFile('example.mdx')

const tree = fromMarkdown(doc, {
  extensions: [mdxjs()],
  mdastExtensions: [mdxFromMarkdown()]
})

console.log(tree)

const out = toMarkdown(tree, {extensions: [mdxToMarkdown()]})

console.log(out)
```

…now running `node example.js` yields (positional info removed for brevity):

```js
{
  type: 'root',
  children: [
    {
      type: 'mdxjsEsm',
      value: 'import Box from "place"',
      data: {
        estree: {
          type: 'Program',
          body: [
            {
              type: 'ImportDeclaration',
              specifiers: [
                {
                  type: 'ImportDefaultSpecifier',
                  local: {type: 'Identifier', name: 'Box'}
                }
              ],
              source: {type: 'Literal', value: 'place', raw: '"place"'}
            }
          ],
          sourceType: 'module'
        }
      }
    },
    {
      type: 'paragraph',
      children: [{type: 'text', value: 'Here’s an expression:'}]
    },
    {
      type: 'mdxFlowExpression',
      value: '\n1 + 1 /* } */\n',
      data: {
        estree: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {type: 'Literal', value: 1, raw: '1'},
                operator: '+',
                right: {type: 'Literal', value: 1, raw: '1'}
              }
            }
          ],
          sourceType: 'module'
        }
      }
    },
    {
      type: 'paragraph',
      children: [
        {type: 'text', value: 'Which you can also put inline: '},
        {
          type: 'mdxTextExpression',
          value: '1+1',
          data: {
            estree: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'BinaryExpression',
                    left: {type: 'Literal', value: 1, raw: '1'},
                    operator: '+',
                    right: {type: 'Literal', value: 1, raw: '1'}
                  }
                }
              ],
              sourceType: 'module'
            }
          }
        },
        {type: 'text', value: '.'}
      ]
    },
    {
      type: 'mdxJsxFlowElement',
      name: 'Box',
      attributes: [],
      children: [
        {
          type: 'mdxJsxFlowElement',
          name: 'SmallerBox',
          attributes: [],
          children: [
            {
              type: 'list',
              ordered: false,
              start: null,
              spread: false,
              children: [
                {
                  type: 'listItem',
                  spread: false,
                  checked: null,
                  children: [
                    {
                      type: 'paragraph',
                      children: [
                        {type: 'text', value: 'Lists, which can be indented.'}
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

```markdown
import Box from "place"

Here’s an expression:

{
  1 + 1 /* } */
}

Which you can also put inline: {1+1}.

<Box>
  <SmallerBox>
    *   Lists, which can be indented.
  </SmallerBox>
</Box>
```

## API

This package exports the identifiers `mdxFromMarkdown` and `mdxToMarkdown`.
There is no default export.

### `mdxFromMarkdown()`

Extension for [`mdast-util-from-markdown`][mdast-util-from-markdown].

When using the [syntax extension with `addResult`][mdxjs], nodes will have
a `data.estree` field set to an [ESTree][].

### `mdxToMarkdown(options?)`

Extension for [`mdast-util-to-markdown`][mdast-util-to-markdown].

##### `options`

Configuration (optional).
Currently passes through `quote`, `quoteSmart`, `tightSelfClosing`, and
`printWidth` to [`mdast-util-mdx-jsx`][options].

## Syntax tree

This utility combines several mdast utilities.
See their readmes for the node types supported in the tree:

*   [`mdast-util-mdx-expression`](https://github.com/syntax-tree/mdast-util-mdx-expression#syntax-tree)
    — support MDX expressions
*   [`mdast-util-mdx-jsx`](https://github.com/syntax-tree/mdast-util-mdx-jsx#syntax-tree)
    — support MDX JSX
*   [`mdast-util-mdxjs-esm`](https://github.com/syntax-tree/mdast-util-mdxjs-esm#syntax-tree)
    — support MDX ESM

## Types

This package is fully typed with [TypeScript][].
It exports the additional types `MdxFlowExpression`, `MdxTextExpression`,
`MdxjsEsm`, `MdxJsxAttributeValueExpression`, `MdxJsxAttribute`,
`MdxJsxExpressionAttribute`, `MdxJsxFlowElement`,
`MdxJsxTextElement`, and `ToMarkdownOptions`.

It also registers the node types with `@types/mdast`.
If you’re working with the syntax tree, make sure to import this utility
somewhere in your types, as that registers the new node types in the tree.

```js
/**
 * @typedef {import('mdast-util-mdx')}
 */

import {visit} from 'unist-util-visit'

/** @type {import('mdast').Root} */
const tree = getMdastNodeSomeHow()

visit(tree, (node) => {
  // `node` can now be an expression, JSX, or ESM node.
})
```

## Compatibility

Projects maintained by the unified collective are compatible with all maintained
versions of Node.js.
As of now, that is Node.js 12.20+, 14.14+, and 16.0+.
Our projects sometimes work with older versions, but this is not guaranteed.

This utility works with `mdast-util-from-markdown` version 1+ and
`mdast-util-to-markdown` version 1+.

## Related

*   [`remarkjs/remark-mdx`][remark-mdx]
    — remark plugin to support MDX
*   [`micromark/micromark-extension-mdx`][mdx]
    — micromark extension to parse MDX
*   [`micromark/micromark-extension-mdxjs`][mdxjs]
    — micromark extension to parse JavaScript-aware MDX

## Contribute

See [`contributing.md`][contributing] in [`syntax-tree/.github`][health] for
ways to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/syntax-tree/mdast-util-mdx/workflows/main/badge.svg

[build]: https://github.com/syntax-tree/mdast-util-mdx/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/mdast-util-mdx.svg

[coverage]: https://codecov.io/github/syntax-tree/mdast-util-mdx

[downloads-badge]: https://img.shields.io/npm/dm/mdast-util-mdx.svg

[downloads]: https://www.npmjs.com/package/mdast-util-mdx

[size-badge]: https://img.shields.io/bundlephobia/minzip/mdast-util-mdx.svg

[size]: https://bundlephobia.com/result?p=mdast-util-mdx

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/syntax-tree/unist/discussions

[npm]: https://docs.npmjs.com/cli/install

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[typescript]: https://www.typescriptlang.org

[license]: license

[author]: https://wooorm.com

[health]: https://github.com/syntax-tree/.github

[contributing]: https://github.com/syntax-tree/.github/blob/main/contributing.md

[support]: https://github.com/syntax-tree/.github/blob/main/support.md

[coc]: https://github.com/syntax-tree/.github/blob/main/code-of-conduct.md

[mdast]: https://github.com/syntax-tree/mdast

[mdast-util-from-markdown]: https://github.com/syntax-tree/mdast-util-from-markdown

[mdast-util-to-markdown]: https://github.com/syntax-tree/mdast-util-to-markdown

[mdx]: https://github.com/micromark/micromark-extension-mdx

[mdxjs]: https://github.com/micromark/micromark-extension-mdxjs

[remark-mdx]: https://github.com/mdx-js/mdx/tree/next/packages/remark-mdx

[options]: https://github.com/syntax-tree/mdast-util-mdx-jsx#mdxjsxtomarkdownoptions

[estree]: https://github.com/estree/estree
