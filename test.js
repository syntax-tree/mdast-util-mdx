var test = require('tape')
var fromMarkdown = require('mdast-util-from-markdown')
var toMarkdown = require('mdast-util-to-markdown')
var syntax = require('micromark-extension-mdxjs')
var mdx = require('.')

test('markdown -> mdast', function (t) {
  t.deepEqual(
    JSON.parse(
      JSON.stringify(
        fromMarkdown('import a from "b"', {
          extensions: [syntax()],
          mdastExtensions: [mdx.fromMarkdown]
        })
      )
    ),
    {
      type: 'root',
      children: [
        {
          type: 'mdxjsEsm',
          value: 'import a from "b"',
          position: {
            start: {line: 1, column: 1, offset: 0},
            end: {line: 1, column: 18, offset: 17}
          },
          data: {
            estree: {
              type: 'Program',
              start: 0,
              end: 17,
              loc: {start: {line: 1, column: 0}, end: {line: 1, column: 17}},
              body: [
                {
                  type: 'ImportDeclaration',
                  start: 0,
                  end: 17,
                  loc: {
                    start: {line: 1, column: 0},
                    end: {line: 1, column: 17}
                  },
                  specifiers: [
                    {
                      type: 'ImportDefaultSpecifier',
                      start: 7,
                      end: 8,
                      loc: {
                        start: {line: 1, column: 7},
                        end: {line: 1, column: 8}
                      },
                      local: {
                        type: 'Identifier',
                        start: 7,
                        end: 8,
                        loc: {
                          start: {line: 1, column: 7},
                          end: {line: 1, column: 8}
                        },
                        name: 'a',
                        range: [7, 8]
                      },
                      range: [7, 8]
                    }
                  ],
                  source: {
                    type: 'Literal',
                    start: 14,
                    end: 17,
                    loc: {
                      start: {line: 1, column: 14},
                      end: {line: 1, column: 17}
                    },
                    value: 'b',
                    raw: '"b"',
                    range: [14, 17]
                  },
                  range: [0, 17]
                }
              ],
              sourceType: 'module',
              comments: [],
              range: [0, 17]
            }
          }
        }
      ],
      position: {
        start: {line: 1, column: 1, offset: 0},
        end: {line: 1, column: 18, offset: 17}
      }
    },
    'should support esm'
  )

  t.deepEqual(
    fromMarkdown('<x/>', {
      extensions: [syntax()],
      mdastExtensions: [mdx.fromMarkdown]
    }),
    {
      type: 'root',
      children: [
        {
          type: 'mdxJsxFlowElement',
          name: 'x',
          attributes: [],
          children: [],
          position: {
            start: {line: 1, column: 1, offset: 0},
            end: {line: 1, column: 5, offset: 4}
          }
        }
      ],
      position: {
        start: {line: 1, column: 1, offset: 0},
        end: {line: 1, column: 5, offset: 4}
      }
    },
    'should support jsx'
  )

  t.deepEqual(
    JSON.parse(
      JSON.stringify(
        fromMarkdown('{1 + 1}', {
          extensions: [syntax()],
          mdastExtensions: [mdx.fromMarkdown]
        })
      )
    ),
    {
      type: 'root',
      children: [
        {
          type: 'mdxFlowExpression',
          value: '1 + 1',
          position: {
            start: {line: 1, column: 1, offset: 0},
            end: {line: 1, column: 8, offset: 7}
          },
          data: {
            estree: {
              type: 'Program',
              start: 1,
              end: 6,
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'BinaryExpression',
                    start: 1,
                    end: 6,
                    left: {
                      type: 'Literal',
                      start: 1,
                      end: 2,
                      value: 1,
                      raw: '1',
                      loc: {
                        start: {line: 1, column: 1},
                        end: {line: 1, column: 2}
                      },
                      range: [1, 2]
                    },
                    operator: '+',
                    right: {
                      type: 'Literal',
                      start: 5,
                      end: 6,
                      value: 1,
                      raw: '1',
                      loc: {
                        start: {line: 1, column: 5},
                        end: {line: 1, column: 6}
                      },
                      range: [5, 6]
                    },
                    loc: {
                      start: {line: 1, column: 1},
                      end: {line: 1, column: 6}
                    },
                    range: [1, 6]
                  },
                  start: 1,
                  end: 6,
                  loc: {start: {line: 1, column: 1}, end: {line: 1, column: 6}},
                  range: [1, 6]
                }
              ],
              sourceType: 'module',
              comments: [],
              loc: {start: {line: 1, column: 1}, end: {line: 1, column: 6}},
              range: [1, 6]
            }
          }
        }
      ],
      position: {
        start: {line: 1, column: 1, offset: 0},
        end: {line: 1, column: 8, offset: 7}
      }
    },
    'should support expressions'
  )

  t.end()
})

test('mdast -> markdown', function (t) {
  t.equal(
    toMarkdown(
      {type: 'mdxjsEsm', value: 'import a from "b"'},
      {extensions: [mdx.toMarkdown]}
    ),
    'import a from "b"\n',
    'should support esm'
  )

  t.equal(
    toMarkdown(
      {type: 'mdxJsxFlowElement', name: 'x'},
      {extensions: [mdx.toMarkdown]}
    ),
    '<x/>\n',
    'should support jsx'
  )

  t.deepEqual(
    toMarkdown(
      {type: 'mdxFlowExpression', value: '1 + 1'},
      {extensions: [mdx.toMarkdown]}
    ),
    '{1 + 1}\n',
    'should support expressions'
  )

  t.deepEqual(
    toMarkdown(
      {
        type: 'link',
        url: 'tel:123',
        children: [{type: 'text', value: 'tel:123'}]
      },
      {extensions: [mdx.toMarkdown]}
    ),
    '[tel:123](tel:123)\n',
    'should use link (resource) instead of link (auto)'
  )

  t.end()
})
