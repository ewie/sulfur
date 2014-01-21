/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/regex/any',
  'sulfur/schema/regex/block',
  'sulfur/schema/regex/branch',
  'sulfur/schema/regex/category',
  'sulfur/schema/regex/codepoint',
  'sulfur/schema/regex/class',
  'sulfur/schema/regex/group',
  'sulfur/schema/regex/parser',
  'sulfur/schema/regex/pattern',
  'sulfur/schema/regex/piece',
  'sulfur/schema/regex/quant',
  'sulfur/schema/regex/range',
  'sulfur/util/unicode'
], function (
    shared,
    Any,
    Block,
    Branch,
    Category,
    Codepoint,
    Class,
    Group,
    Parser,
    Pattern,
    Piece,
    Quant,
    Range,
    unicode
) {

  'use strict';

  var expect = shared.expect;
  var bind = shared.bind;

  describe('sulfur/schema/regex/parser', function () {

    var parser;

    beforeEach(function () {
      parser = Parser.create();
    });

    describe('#parse()', function () {

      it("should parse wildcard", function () {
        var p = parser.parse('.');
        var x = Pattern.create(
          [Branch.create(
            [Piece.create(Any.create())
            ])
          ]);
        expect(p).to.eql(x);
      });

      describe("surrogate pairs", function () {

        it("should consume valid surrogate pairs", function () {
          var p = parser.parse('\ud83d\udca9');
          var x = Pattern.create(
            [Branch.create(
              [Piece.create(
                Codepoint.create(0x1f4a9))
              ])
            ]);
          expect(p).to.eql(x);
        });

        it("should reject missing trail surrogate", function () {
          expect(bind(parser, 'parse', '\ud83d'))
            .to.throw("expecting a trail surrogate after a lead surrogate, but there is no more input");
        });

        it("should reject invalid trail surrogate", function () {
          expect(bind(parser, 'parse', '\ud83d\u0020'))
            .to.throw("expecting a trail surrogate after a lead surrogate");
        });

      });

      it("should reject unknown escapes", function () {
        expect(bind(parser, 'parse', '\\x')).to.throw("unknown escape \\x");
      });

      it("should reject a not fully consumed pattern", function () {
        expect(bind(parser, 'parse', '?'))
          .to.throw("invalid pattern");
      });

      describe("alternations", function () {

        it("should parse alternations", function () {
          var p = parser.parse('a|b');
          var x = Pattern.create(
            [Branch.create(
              [Piece.create(Codepoint.create('a'))
              ]),
             Branch.create(
              [Piece.create(Codepoint.create('b'))
              ])
            ]);
          expect(p).to.eql(x);
        });

        it("should parse empty branches", function () {
          var p = parser.parse('a|');
          var x = Pattern.create(
            [Branch.create(
              [Piece.create(Codepoint.create('a'))
              ]),
             Branch.create()
            ]);
          expect(p).to.eql(x);
        });

      });

      describe("quantifiers", function () {

        it("should parse + as {1,}", function () {
          var p = parser.parse('a+');
          var x = Pattern.create(
            [Branch.create(
              [Piece.create(
                Codepoint.create('a'),
                Quant.create(1, Number.POSITIVE_INFINITY))
              ])
            ]);
          expect(p).to.eql(x);
        });

        it("should parse * as {0,}", function () {
          var p = parser.parse('a*');
          var x = Pattern.create(
            [Branch.create(
              [Piece.create(
                Codepoint.create('a'),
                Quant.create(0, Number.POSITIVE_INFINITY))
              ])
            ]);
          expect(p).to.eql(x);
        });

        it("should parse ? as {0,1}", function () {
          var p = parser.parse('a?');
          var x = Pattern.create(
            [Branch.create(
              [Piece.create(
                Codepoint.create('a'),
                Quant.create(0, 1))
              ])
            ]);
          expect(p).to.eql(x);
        });

        it("should parse {min,max}", function () {
          var p = parser.parse('a{1,3}');
          var x = Pattern.create(
            [Branch.create(
              [Piece.create(
                Codepoint.create('a'),
                Quant.create(1, 3))
              ])
            ]);
          expect(p).to.eql(x);
        });

        it("should parse {n}", function () {
          var p = parser.parse('a{2}');
          var x = Pattern.create(
            [Branch.create(
              [Piece.create(
                Codepoint.create('a'),
                Quant.create(2))
              ])
            ]);
          expect(p).to.eql(x);
        });

        it("should parse {min,}", function () {
          var p = parser.parse('a{2,}');
          var x = Pattern.create(
            [Branch.create(
              [Piece.create(
                Codepoint.create('a'),
                Quant.create(2, Number.POSITIVE_INFINITY))
              ])
            ]);
          expect(p).to.eql(x);
        });

        it("should reject invalid quantifier", function () {
          expect(bind(parser, 'parse', 'a{x}')).to.throw("invalid quantifier {x}");
        });

        it("should reject incomplete quantifier", function () {
          expect(bind(parser, 'parse', 'a{')).to.throw("incomplete quantifier");
        });

      });

      describe("single character escapes", function () {

        it("should accept valid single character escapes", function () {
          SINGLE_CHAR_ESCAPES.forEach(function (pair) {
            var esc = pair[0];
            var chr = pair[1];
            var p = parser.parse(esc);
            var x = Pattern.create(
              [Branch.create(
                [Piece.create(Codepoint.create(chr))
                ])
              ]);
            expect(p).to.eql(x);
          });
        });

      });

      describe("sub pattern", function () {

        it("should parse a pattern in parenthesis", function () {
          var p = parser.parse('(a)');
          var sub = Pattern.create(
            [Branch.create(
              [Piece.create(Codepoint.create('a'))
              ])
            ]);
          var x = Pattern.create(
            [Branch.create(
              [Piece.create(sub)
              ])
            ]);
          expect(p).to.eql(x);
        });

        it("should reject incomplete parenthesis", function () {
          expect(bind(parser, 'parse', '(a'))
            .to.throw("incomplete parenthesis");
        });

      });

      describe("character classes", function () {

        it("should accept valid multi character escapes", function () {
          [
            ['\\c', Class.CHAR, true],
            ['\\C', Class.CHAR, false],
            ['\\d', Class.DIGIT, true],
            ['\\D', Class.DIGIT, false],
            ['\\i', Class.INITIAL, true],
            ['\\I', Class.INITIAL, false],
            ['\\s', Class.SPACE, true],
            ['\\S', Class.SPACE, false],
            ['\\w', Class.WORD, true],
            ['\\W', Class.WORD, false]
          ].forEach(function (tuple) {
            var esc = tuple[0];
            var cls = tuple[1];
            var pos = tuple[2];
            var p = parser.parse(esc);
            var x = Pattern.create(
              [Branch.create(
                [Piece.create(
                  Class.create(cls, pos))
                ])
              ]);
            expect(p).to.eql(x);
          });
        });

        describe("property escape \\p", function () {

          it("should reject when used with no argument", function () {
            expect(bind(parser, 'parse', '\\p'))
              .to.throw("escape \\p expects a Unicode category or block name");
          });

          it("should reject an empty argument", function () {
            expect(bind(parser, 'parse', '\\p{}'))
              .to.throw("escape \\p expects a Unicode category or block name");
          });

          it("should reject when incomplete", function () {
            expect(bind(parser, 'parse', '\\p{'))
              .to.throw("incomplete escape \\p");
          });

          it("should accept supported Unicode categories", function () {
            SUPPORTED_UNICODE_CATEGORIES.forEach(function (name) {
              var p = parser.parse('\\p{' + name + '}');
              var x = Pattern.create(
                [Branch.create(
                  [Piece.create(Category.create(name))
                  ])
                ]);
              expect(p).to.eql(x);
            });
          });

          it("should accept supported Unicode blocks", function () {
            SUPPORTED_UNICODE_BLOCKS.forEach(function (name) {
              var p = parser.parse('\\p{Is' + name + '}');
              var x = Pattern.create(
                [Branch.create(
                  [Piece.create(Block.create(name))
                  ])
                ]);
              expect(p).to.eql(x);
            });
          });

          it("should reject unknown Unicode categories", function () {
            expect(bind(parser, 'parse', '\\p{Xx}'))
              .to.throw("unknown Unicode category Xx");
          });

          it("should reject unsupported Unicode category", function () {
            UNSUPPORTED_UNICODE_CATEGORIES.forEach(function (name) {
              expect(bind(parser, 'parse', '\\p{' + name + '}'))
                .to.throw("unsupported Unicode category " + name);
            });
          });

          it("should reject unknown Unicode block", function () {
            expect(bind(parser, 'parse', '\\p{IsXxx}'))
              .to.throw("unknown Unicode block Xxx");
          });

          it("should reject unsupported Unicode block", function () {
            UNSUPPORTED_UNICODE_BLOCKS.forEach(function (name) {
              expect(bind(parser, 'parse', '\\p{Is' + name + '}'))
                .to.throw("unsupported Unicode block " + name);
            });
          });

          it("should accept the negated form \\P", function () {
            var p = parser.parse('\\P{Ll}');
            var x = Pattern.create(
              [Branch.create(
                [Piece.create(Category.create('Ll', false))
                ])
              ]);
            expect(p).to.eql(x);
          });

        });

        describe("groups", function () {

          it("should reject an incomplete group", function () {
            expect(bind(parser, 'parse', '['))
              .to.throw("incomplete character group");
          });

          it("should reject an empty group", function () {
            expect(bind(parser, 'parse', '[]'))
              .to.throw("empty character group");
          });

          it("should parse a positive group", function () {
            var p = parser.parse('[a]');
            var x = Pattern.create(
              [Branch.create(
                [Piece.create(
                  Group.create(
                   [Codepoint.create('a')
                   ]))
                ])
              ]);
            expect(p).to.eql(x);
          });

          it("should parse a negative group", function () {
            var p = parser.parse('[^a]');
            var x = Pattern.create(
              [Branch.create(
                [Piece.create(
                  Group.create(
                   [Codepoint.create('a')
                   ], { positive: false }))
                ])
              ]);
            expect(p).to.eql(x);
          });

          it("should parse '^' as valid character as first range of a negative group", function () {
            var p = parser.parse('[^^]');
            var x = Pattern.create(
              [Branch.create(
                [Piece.create(
                  Group.create(
                   [Codepoint.create('^')
                   ], { positive: false }))
                ])
              ]);
            expect(p).to.eql(x);
          });

          it("should parse '^' as valid range anywhere within a group", function () {
            var p = parser.parse('[a^]');
            var x = Pattern.create([
              Branch.create([
                Piece.create(
                  Group.create(
                    [Codepoint.create('a'),
                     Codepoint.create('^')
                    ])
                )
              ])
            ]);
            expect(p).to.eql(x);
          });

          '{}().+*?'.split('').forEach(function (chr) {
            it("should parse '" + chr + "' as valid character", function () {
              var p = parser.parse('[' + chr + ']');
              var x = Pattern.create(
                [Branch.create(
                  [Piece.create(
                    Group.create(
                     [Codepoint.create(chr)
                     ]))
                  ])
                ]);
              expect(p).to.eql(x);
            });
          });

          it("should allow U+002D (HYPHEN MINUS) as first item", function () {
            var p = parser.parse('[-a]');
            var x = Pattern.create(
              [Branch.create(
                [Piece.create(
                  Group.create(
                   [Codepoint.create('-'),
                    Codepoint.create('a')
                   ]))
                ])
              ]);
            expect(p).to.eql(x);
          });

          it("should allow U+002D (HYPHEN MINUS) as last item", function () {
            var p = parser.parse('[a-]');
            var x = Pattern.create(
              [Branch.create(
                [Piece.create(
                  Group.create(
                   [Codepoint.create('a'),
                    Codepoint.create('-')
                   ]))
                ])
              ]);
            expect(p).to.eql(x);
          });

          describe("multi character escapes", function () {

            it("should accept valid multi character escapes", function () {
              [
                ['\\c', Class.CHAR, true],
                ['\\C', Class.CHAR, false],
                ['\\d', Class.DIGIT, true],
                ['\\D', Class.DIGIT, false],
                ['\\i', Class.INITIAL, true],
                ['\\I', Class.INITIAL, false],
                ['\\s', Class.SPACE, true],
                ['\\S', Class.SPACE, false],
                ['\\w', Class.WORD, true],
                ['\\W', Class.WORD, false]
              ].forEach(function (tuple) {
                var esc = tuple[0];
                var cls = tuple[1];
                var pos = tuple[2];
                var p = parser.parse('[' + esc + ']');
                var x = Pattern.create(
                  [Branch.create(
                    [Piece.create(
                      Group.create(
                       [Class.create(cls, pos)
                       ]))
                    ])
                  ]);
                expect(p).to.eql(x);
              });
            });

            describe("property escape \\p", function () {

              it("should reject when used with no argument", function () {
                expect(bind(parser, 'parse', '[\\p]'))
                  .to.throw("escape \\p expects a Unicode category or block name");
              });

              it("should reject an empty argument", function () {
                expect(bind(parser, 'parse', '[\\p{}]'))
                  .to.throw("escape \\p expects a Unicode category or block name");
              });

              it("should reject when incomplete", function () {
                expect(bind(parser, 'parse', '[\\p{]'))
                  .to.throw("incomplete escape \\p");
              });

              it("should accept supported Unicode categories", function () {
                SUPPORTED_UNICODE_CATEGORIES.forEach(function (name) {
                  var p = parser.parse('[\\p{' + name + '}]');
                  var x = Pattern.create(
                    [Branch.create(
                      [Piece.create(
                        Group.create(
                         [Category.create(name)
                         ]))
                      ])
                    ]);
                  expect(p).to.eql(x);
                });
              });

              it("should accept supported Unicode blocks", function () {
                SUPPORTED_UNICODE_BLOCKS.forEach(function (name) {
                  var p = parser.parse('[\\p{Is' + name + '}]');
                  var x = Pattern.create(
                    [Branch.create(
                      [Piece.create(
                        Group.create(
                         [Block.create(name)
                         ]))
                      ])
                    ]);
                  expect(p).to.eql(x);
                });
              });

              it("should reject unknown Unicode categories", function () {
                expect(bind(parser, 'parse', '[\\p{Xx}]'))
                  .to.throw("unknown Unicode category Xx");
              });

              it("should reject unsupported Unicode category", function () {
                UNSUPPORTED_UNICODE_CATEGORIES.forEach(function (name) {
                  expect(bind(parser, 'parse', '[\\p{' + name + '}]'))
                    .to.throw("unsupported Unicode category " + name);
                });
              });

              it("should reject unknown Unicode block", function () {
                expect(bind(parser, 'parse', '[\\p{IsXxx}]'))
                  .to.throw("unknown Unicode block Xxx");
              });

              it("should reject unsupported Unicode block", function () {
                UNSUPPORTED_UNICODE_BLOCKS.forEach(function (name) {
                  expect(bind(parser, 'parse', '[\\p{Is' + name + '}]'))
                    .to.throw("unsupported Unicode block " + name);
                });
              });

              it("should accept the negated form \\P", function () {
                var p = parser.parse('[\\P{Ll}]');
                var x = Pattern.create(
                  [Branch.create(
                    [Piece.create(
                      Group.create(
                       [Category.create('Ll', false)
                       ]))
                    ])
                  ]);
                expect(p).to.eql(x);
              });

            });

          });

          describe("ranges", function () {

            it("should parse ranges", function () {
              var p = parser.parse('[a-b]');
              var x = Pattern.create(
                [Branch.create(
                  [Piece.create(
                    Group.create(
                     [Range.create(
                       Codepoint.create('a'),
                       Codepoint.create('b'))
                     ]))
                  ])
                ]);
              expect(p).to.eql(x);
            });

            it("should accept all valid single character escapes", function () {
              SINGLE_CHAR_ESCAPES.forEach(function (pair) {
                var esc = pair[0];
                var chr = pair[1];
                var p = parser.parse('[' + esc + '-' + esc + ']');
                var x = Pattern.create(
                  [Branch.create(
                    [Piece.create(
                      Group.create(
                       [Range.create(
                         Codepoint.create(chr),
                         Codepoint.create(chr))
                       ]))
                    ])
                  ]);
                expect(p).to.eql(x);
              });
            });

            it("should reject empty ranges", function () {
              expect(bind(parser, 'parse', '[b-a]'))
                .to.throw("empty range b-a");
            });

            it("should reject unknown single character escapes", function () {
              expect(bind(parser, 'parse', '[\\x-\\x]'))
                .to.throw("unknown escape \\x");
            });

          });

          describe("subtractions", function () {

            it("should parse subtractions", function () {
              var p = parser.parse('[a-[b]]');
              var x = Pattern.create(
                [Branch.create(
                  [Piece.create(
                    Group.create(
                     [Codepoint.create('a')
                     ], { subtract:
                      Group.create(
                       [Codepoint.create('b')
                       ])
                     }))
                  ])
                ]);
              expect(p).to.eql(x);
            });

            it("should handle a trailing dash and subtractions", function () {
              var p = parser.parse('[a--[b]]');
              var x = Pattern.create(
                [Branch.create(
                  [Piece.create(
                    Group.create(
                     [Codepoint.create('a'),
                      Codepoint.create('-')
                     ], { subtract:
                      Group.create(
                       [Codepoint.create('b')
                       ])
                     }))
                  ])
                ]);
              expect(p).to.eql(x);
            });

          });

        });

      });

    });

  });

  var SINGLE_CHAR_ESCAPES = [
    ['\\n', '\n'],
    ['\\r', '\r'],
    ['\\t', '\t']
  ].concat('\\|.-^?*+{}()[]'.split('').map(function (chr) {
    return ['\\' + chr, chr];
  }));

  var UNSUPPORTED_UNICODE_CATEGORIES = ['Cn'];

  var UNSUPPORTED_UNICODE_BLOCKS = [
    'HighPrivateUseSurrogates',
    'HighSurrogates',
    'LowSurrogates'
  ];

  var SUPPORTED_UNICODE_CATEGORIES = unicode.getCategoryNames().reduce(function (categories, name) {
    if (UNSUPPORTED_UNICODE_CATEGORIES.indexOf(name) === -1) {
      categories.push(name);
    }
    return categories;
  }, []);

  var SUPPORTED_UNICODE_BLOCKS = unicode.getBlockNames().reduce(function (blocks, name) {
    if (UNSUPPORTED_UNICODE_BLOCKS.indexOf(name) === -1) {
      blocks.push(name);
    }
    return blocks;
  }, []);

});
