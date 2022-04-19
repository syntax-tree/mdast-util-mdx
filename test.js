import test from 'tape'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {toMarkdown} from 'mdast-util-to-markdown'
import {mdxjs} from 'micromark-extension-mdxjs'
import {mdxFromMarkdown, mdxToMarkdown} from './index.js'

test('markdown -> mdast', (t) => {
  t.deepEqual(
    JSON.parse(
      JSON.stringify(
        fromMarkdown('import a from "b"', {
          extensions: [mdxjs()],
          mdastExtensions: [mdxFromMarkdown()]
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
      extensions: [mdxjs()],
      mdastExtensions: [mdxFromMarkdown()]
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
          extensions: [mdxjs()],
          mdastExtensions: [mdxFromMarkdown()]
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

  t.deepEqual(
    JSON.parse(
      JSON.stringify(
        fromMarkdown(
          `<Stuff>
  {{
    template: /* Comment */ '',
  }}
</Stuff>`,
          {
            extensions: [mdxjs()],
            mdastExtensions: [mdxFromMarkdown()]
          }
        )
      )
    ),
    {
      type: 'root',
      children: [
        {
          type: 'mdxJsxFlowElement',
          name: 'Stuff',
          attributes: [],
          children: [
            {
              type: 'mdxFlowExpression',
              value: "{\n  template: /* Comment */ '',\n}",
              position: {
                start: {line: 2, column: 3, offset: 10},
                end: {line: 4, column: 5, offset: 49}
              },
              data: {
                estree: {
                  type: 'Program',
                  start: 11,
                  end: 48,
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'ObjectExpression',
                        start: 11,
                        end: 48,
                        properties: [
                          {
                            type: 'Property',
                            start: 17,
                            end: 43,
                            method: false,
                            shorthand: false,
                            computed: false,
                            key: {
                              type: 'Identifier',
                              start: 17,
                              end: 25,
                              name: 'template',
                              loc: {
                                start: {line: 3, column: 4},
                                end: {line: 3, column: 12}
                              },
                              range: [17, 25]
                            },
                            value: {
                              type: 'Literal',
                              start: 41,
                              end: 43,
                              value: '',
                              raw: "''",
                              loc: {
                                start: {line: 3, column: 28},
                                end: {line: 3, column: 30}
                              },
                              range: [41, 43]
                            },
                            kind: 'init',
                            loc: {
                              start: {line: 3, column: 4},
                              end: {line: 3, column: 30}
                            },
                            range: [17, 43]
                          }
                        ],
                        loc: {
                          start: {line: 2, column: 3},
                          end: {line: 4, column: 3}
                        },
                        range: [11, 48]
                      },
                      start: 11,
                      end: 48,
                      loc: {
                        start: {line: 2, column: 3},
                        end: {line: 4, column: 3}
                      },
                      range: [11, 48]
                    }
                  ],
                  sourceType: 'module',
                  comments: [
                    {
                      type: 'Block',
                      value: ' Comment ',
                      start: 27,
                      end: 40,
                      loc: {
                        start: {line: 3, column: 14},
                        end: {line: 3, column: 27}
                      },
                      range: [27, 40]
                    }
                  ],
                  loc: {
                    start: {line: 2, column: 3},
                    end: {line: 4, column: 3}
                  },
                  range: [11, 48]
                }
              }
            }
          ],
          position: {
            start: {line: 1, column: 1, offset: 0},
            end: {line: 5, column: 9, offset: 58}
          }
        }
      ],
      position: {
        start: {line: 1, column: 1, offset: 0},
        end: {line: 5, column: 9, offset: 58}
      }
    },
    'should add proper positions on estree (1)'
  )

  t.deepEqual(
    JSON.parse(
      JSON.stringify(
        fromMarkdown(
          `export let a = 'a'

export let b = 'b'`,
          {extensions: [mdxjs()], mdastExtensions: [mdxFromMarkdown()]}
        )
      )
    ),
    {
      type: 'root',
      children: [
        {
          type: 'mdxjsEsm',
          value: "export let a = 'a'",
          position: {
            start: {line: 1, column: 1, offset: 0},
            end: {line: 1, column: 19, offset: 18}
          },
          data: {
            estree: {
              type: 'Program',
              start: 0,
              end: 18,
              body: [
                {
                  type: 'ExportNamedDeclaration',
                  start: 0,
                  end: 18,
                  declaration: {
                    type: 'VariableDeclaration',
                    start: 7,
                    end: 18,
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        start: 11,
                        end: 18,
                        id: {
                          type: 'Identifier',
                          start: 11,
                          end: 12,
                          name: 'a',
                          loc: {
                            start: {line: 1, column: 11},
                            end: {line: 1, column: 12}
                          },
                          range: [11, 12]
                        },
                        init: {
                          type: 'Literal',
                          start: 15,
                          end: 18,
                          value: 'a',
                          raw: "'a'",
                          loc: {
                            start: {line: 1, column: 15},
                            end: {line: 1, column: 18}
                          },
                          range: [15, 18]
                        },
                        loc: {
                          start: {line: 1, column: 11},
                          end: {line: 1, column: 18}
                        },
                        range: [11, 18]
                      }
                    ],
                    kind: 'let',
                    loc: {
                      start: {line: 1, column: 7},
                      end: {line: 1, column: 18}
                    },
                    range: [7, 18]
                  },
                  specifiers: [],
                  source: null,
                  loc: {
                    start: {line: 1, column: 0},
                    end: {line: 1, column: 18}
                  },
                  range: [0, 18]
                }
              ],
              sourceType: 'module',
              comments: [],
              loc: {
                start: {line: 1, column: 0},
                end: {line: 1, column: 18}
              },
              range: [0, 18]
            }
          }
        },
        {
          type: 'mdxjsEsm',
          value: "export let b = 'b'",
          position: {
            start: {line: 3, column: 1, offset: 20},
            end: {line: 3, column: 19, offset: 38}
          },
          data: {
            estree: {
              type: 'Program',
              start: 20,
              end: 38,
              body: [
                {
                  type: 'ExportNamedDeclaration',
                  start: 20,
                  end: 38,
                  declaration: {
                    type: 'VariableDeclaration',
                    start: 27,
                    end: 38,
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        start: 31,
                        end: 38,
                        id: {
                          type: 'Identifier',
                          start: 31,
                          end: 32,
                          name: 'b',
                          loc: {
                            start: {line: 3, column: 11},
                            end: {line: 3, column: 12}
                          },
                          range: [31, 32]
                        },
                        init: {
                          type: 'Literal',
                          start: 35,
                          end: 38,
                          value: 'b',
                          raw: "'b'",
                          loc: {
                            start: {line: 3, column: 15},
                            end: {line: 3, column: 18}
                          },
                          range: [35, 38]
                        },
                        loc: {
                          start: {line: 3, column: 11},
                          end: {line: 3, column: 18}
                        },
                        range: [31, 38]
                      }
                    ],
                    kind: 'let',
                    loc: {
                      start: {line: 3, column: 7},
                      end: {line: 3, column: 18}
                    },
                    range: [27, 38]
                  },
                  specifiers: [],
                  source: null,
                  loc: {
                    start: {line: 3, column: 0},
                    end: {line: 3, column: 18}
                  },
                  range: [20, 38]
                }
              ],
              sourceType: 'module',
              comments: [],
              loc: {
                start: {line: 3, column: 0},
                end: {line: 3, column: 18}
              },
              range: [20, 38]
            }
          }
        }
      ],
      position: {
        start: {line: 1, column: 1, offset: 0},
        end: {line: 3, column: 19, offset: 38}
      }
    },
    'should add proper positions on estree (2)'
  )

  t.end()
})

test('mdast -> markdown', (t) => {
  t.equal(
    toMarkdown(
      {type: 'mdxjsEsm', value: 'import a from "b"'},
      {extensions: [mdxToMarkdown()]}
    ),
    'import a from "b"\n',
    'should support esm'
  )

  t.equal(
    toMarkdown(
      {type: 'mdxJsxFlowElement', name: 'x', attributes: [], children: []},
      {extensions: [mdxToMarkdown()]}
    ),
    '<x />\n',
    'should support jsx'
  )

  t.deepEqual(
    toMarkdown(
      {type: 'mdxFlowExpression', value: '1 + 1'},
      {extensions: [mdxToMarkdown()]}
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
      {extensions: [mdxToMarkdown()]}
    ),
    '[tel:123](tel:123)\n',
    'should use link (resource) instead of link (auto)'
  )

  t.end()
})
