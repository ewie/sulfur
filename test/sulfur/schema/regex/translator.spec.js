/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/regex/branch',
  'sulfur/schema/regex/codeunit',
  'sulfur/schema/regex/group',
  'sulfur/schema/regex/parser',
  'sulfur/schema/regex/pattern',
  'sulfur/schema/regex/piece',
  'sulfur/schema/regex/quant',
  'sulfur/schema/regex/range',
  'sulfur/schema/regex/ranges',
  'sulfur/schema/regex/translator',
  'sulfur/util/unicode'
], function (
  shared,
  Branch,
  Codeunit,
  Group,
  Parser,
  Pattern,
  Piece,
  Quant,
  Range,
  Ranges,
  Translator,
  unicode
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/regex/translator', function () {

    describe('#translate()', function () {

      var parse = (function () {
        var parser = Parser.create();
        return function parse(source) {
          return parser.parse(source);
        };
      }());

      function rangesToGroupItems(ranges) {
        return ranges.reduce(function (items, range) {
          if (range[0] === range[1]) {
            items.push(Codeunit.create(range[0]));
          } else if (range[0] === (range[1] - 1)) {
            items.push(
              Codeunit.create(range[0]),
              Codeunit.create(range[1]));
          } else {
            items.push(
              Range.create(
                Codeunit.create(range[0]),
                Codeunit.create(range[1])));
          }
          return items;
        }, []);
      }

      function translateCategories() {
        var ranges = Array.prototype.map.call(arguments, function (name) {
          return unicode.getCategoryGroupRanges(name);
        });
        ranges = [].concat.apply([], ranges);
        return Ranges.create(ranges).array;
      }

      var translator;

      beforeEach(function () {
        translator = Translator.create();
      });

      context("characters", function () {

        context("when outside the BMP", function () {

          it("should translate them to a surrogate pair", function () {
            var r = translator.translate(parse('\uD800\uDC00'));
            var x = Pattern.create(
              [Branch.create(
                [Piece.create(Codeunit.create(0xD800)),
                 Piece.create(Codeunit.create(0xDC00))
                ])
              ]);
            expect(r).to.eql(x);
          });

        });

        context("when inside the BMP", function () {

          it("should translate them to its codepoint value", function () {
            var r = translator.translate(parse('\x20'));
            var x = Pattern.create(
              [Branch.create(
                [Piece.create(Codeunit.create(0x20))
                ])
              ]);
            expect(r).to.eql(x);
          });

        });

      });

      context("patterns", function () {

        context("with no branches", function () {

          it("should remove the pattern", function () {
            var r = translator.translate(parse('()'));
            var x = Pattern.create(
              [Branch.create([])
              ]);
            expect(r).to.eql(x);
          });

        });

        context("with only a single branch", function () {

          it("should merge its only branch's pieces in the outer branch", function () {
            var r = translator.translate(parse('(a)'));
            var x = Pattern.create(
              [Branch.create(
                [Piece.create(
                  Codeunit.create(0x61))
                ])
              ]);
            expect(r).to.eql(x);
          });

        });

        context("with multiple branches", function () {

          context("when its not the only piece on the outer branch", function () {

            it("should keep sub patterns", function () {
              var r = translator.translate(parse('(a|b)c'));
              var x = Pattern.create(
                [Branch.create(
                  [Piece.create(
                    Pattern.create(
                     [Branch.create(
                       [Piece.create(
                         Codeunit.create(0x61))
                       ]),
                      Branch.create(
                       [Piece.create(
                         Codeunit.create(0x62))
                       ])
                     ])),
                   Piece.create(
                     Codeunit.create(0x63))
                  ])
                ]);
              expect(r).to.eql(x);
            });

          });

          context("when its the only piece on the outer branch", function () {

            context("with a quantifier of exactly 1", function () {

              it("should flatten the pattern by merging the branches into the outer pattern", function () {
                var r = translator.translate(parse('(a|b)'));
                var x = Pattern.create(
                  [Branch.create(
                    [Piece.create(
                      Codeunit.create(0x61))
                    ]),
                   Branch.create(
                    [Piece.create(
                      Codeunit.create(0x62))
                    ])
                  ]);
                expect(r).to.eql(x);
              });

            });

            context("with a quantifier other than exactly 1", function () {

              it("should keep sub patterns", function () {
                var r = translator.translate(parse('(a|b)+'));
                var x = Pattern.create(
                  [Branch.create(
                    [Piece.create(
                      Pattern.create(
                       [Branch.create(
                         [Piece.create(
                           Codeunit.create(0x61))
                         ]),
                        Branch.create(
                         [Piece.create(
                           Codeunit.create(0x62))
                         ])
                       ]),
                      Quant.create(1, Number.POSITIVE_INFINITY))
                    ])
                  ]);
                expect(r).to.eql(x);
              });

            });

          });

        });

      });

      it("should keep quantifiers", function () {
        var r = translator.translate(parse('a{1,3}'));
        var x = Pattern.create(
          [Branch.create(
            [Piece.create(
              Codeunit.create(0x61),
              Quant.create(1, 3))
            ])
          ]);
        expect(r).to.eql(x);
      });

      describe("multi character escapes", function () {

        it("should translate wildcards", function () {
          var r = translator.translate(parse('.'));
          var x = Pattern.create(
            [Branch.create(
              [Piece.create(
                Group.create(
                 [Codeunit.create(0xA),
                  Codeunit.create(0xD),
                 ], { positive: false }))
              ])
            ]);
          expect(r).to.eql(x);
        });

        it("should translate \\c", function () {
          var items = rangesToGroupItems(unicode.getXmlNameCharRanges());
          var r = translator.translate(parse('\\c'));
          var x = Pattern.create(
            [Branch.create(
              [Piece.create(
                Group.create(items))
              ])
            ]);
          expect(r).to.eql(x);
        });

        it("should translate \\C", function () {
          var items = rangesToGroupItems(unicode.getXmlNameCharRanges());
          var r = translator.translate(parse('\\C'));
          var x = Pattern.create(
            [Branch.create(
              [Piece.create(
                Group.create(items, { positive: false }))
              ])
            ]);
          expect(r).to.eql(x);
        });

        it("should translate \\d", function () {
          var items = rangesToGroupItems(unicode.getCategoryRanges('Nd'));
          var r = translator.translate(parse('\\d'));
          var x = Pattern.create(
            [Branch.create(
              [Piece.create(
                Group.create(items))
              ])
            ]);
          expect(r).to.eql(x);
        });

        it("should translate \\D", function () {
          var items = rangesToGroupItems(unicode.getCategoryRanges('Nd'));
          var r = translator.translate(parse('\\D'));
          var x = Pattern.create(
            [Branch.create(
              [Piece.create(
                Group.create(items, { positive: false }))
              ])
            ]);
          expect(r).to.eql(x);
        });

        it("should translate \\i", function () {
          var items = rangesToGroupItems(unicode.getXmlNameStartCharRanges());
          var r = translator.translate(parse('\\i'));
          var x = Pattern.create(
            [Branch.create(
              [Piece.create(
                Group.create(items))
              ])
            ]);
          expect(r).to.eql(x);
        });

        it("should translate \\I", function () {
          var items = rangesToGroupItems(unicode.getXmlNameStartCharRanges());
          var r = translator.translate(parse('\\I'));
          var x = Pattern.create(
            [Branch.create(
              [Piece.create(
                Group.create(items, { positive: false }))
              ])
            ]);
          expect(r).to.eql(x);
        });

        it("should translate \\s", function () {
          var r = translator.translate(parse('\\s'));
          var x = Pattern.create(
            [Branch.create(
              [Piece.create(
                Group.create(
                 [Codeunit.create(0x9),
                  Codeunit.create(0xA),
                  Codeunit.create(0xD),
                  Codeunit.create(0x20)
                 ]))
              ])
            ]);
          expect(r).to.eql(x);
        });

        it("should translate \\S", function () {
          var r = translator.translate(parse('\\S'));
          var x = Pattern.create(
            [Branch.create(
              [Piece.create(
                Group.create(
                 [Codeunit.create(0x9),
                  Codeunit.create(0xA),
                  Codeunit.create(0xD),
                  Codeunit.create(0x20)
                 ], { positive: false }))
              ])
            ]);
          expect(r).to.eql(x);
        });

        it("should translate \\w", function () {
          var items = rangesToGroupItems(translateCategories('C', 'P', 'Z'));
          var r = translator.translate(parse('\\w'));
          var x = Pattern.create(
            [Branch.create(
              [Piece.create(
                Group.create(items, { positive: false }))
              ])
            ]);
          expect(r).to.eql(x);
        });

        it("should translate \\W", function () {
          var items = rangesToGroupItems(translateCategories('C', 'P', 'Z'));
          var r = translator.translate(parse('\\W'));
          var x = Pattern.create(
            [Branch.create(
              [Piece.create(
                Group.create(items))
              ])
            ]);
          expect(r).to.eql(x);
        });

        describe("\\p", function () {

          it("should translate \\p to a positive group for all supported blocks", function () {
            SUPPORTED_UNICODE_BLOCKS.forEach(function (name) {
              var range = unicode.getBlockRange(name);
              var r = translator.translate(parse('\\p{Is' + name + '}'));
              var x = Pattern.create(
                [Branch.create(
                  [Piece.create(
                    Group.create(
                     [Range.create(
                       Codeunit.create(range[0]),
                       Codeunit.create(range[1]))
                     ]))
                  ])
                ]);
              expect(r).to.eql(x);
            });
          });

          it("should translate \\p to a positive group for all supported categories", function () {
            SUPPORTED_UNICODE_CATEGORIES.forEach(function (name) {
              var ranges = unicode.getCategoryRanges(name);
              var items = rangesToGroupItems(ranges);
              var r = translator.translate(parse('\\p{' + name + '}'));
              var x = Pattern.create(
                [Branch.create(
                  [Piece.create(
                    Group.create(items))
                  ])
                ]);
              expect(r).to.eql(x);
            });
          });

          it("should translate \\p to a positive group for all supported category groups", function () {
            unicode.getCategoryGroupNames().forEach(function (name) {
              var ranges = unicode.getCategoryGroupRanges(name);
              var items = rangesToGroupItems(ranges);
              var r = translator.translate(parse('\\p{' + name + '}'));
              var x = Pattern.create(
                [Branch.create(
                  [Piece.create(
                    Group.create(items))
                  ])
                ]);
              expect(r).to.eql(x);
            });
          });

        });

        describe("\\P", function () {

          it("should translate \\P to a negative group for all supported blocks", function () {
            SUPPORTED_UNICODE_BLOCKS.forEach(function (name) {
              var range = unicode.getBlockRange(name);
              var r = translator.translate(parse('\\P{Is' + name + '}'));
              var x = Pattern.create(
                [Branch.create(
                  [Piece.create(
                    Group.create(
                     [Range.create(
                       Codeunit.create(range[0]),
                       Codeunit.create(range[1]))
                     ], { positive: false }))
                  ])
                ]);
              expect(r).to.eql(x);
            });
          });

          it("should translate \\P to a negative group for all supported categories", function () {
            SUPPORTED_UNICODE_CATEGORIES.forEach(function (name) {
              var ranges = unicode.getCategoryRanges(name);
              var items = rangesToGroupItems(ranges);
              var r = translator.translate(parse('\\P{' + name + '}'));
              var x = Pattern.create(
                [Branch.create(
                  [Piece.create(
                    Group.create(items, { positive: false }))
                  ])
                ]);
              expect(r).to.eql(x);
            });
          });

          it("should translate \\P to a negative group for all supported category groups", function () {
            unicode.getCategoryGroupNames().forEach(function (name) {
              var ranges = unicode.getCategoryGroupRanges(name);
              var items = rangesToGroupItems(ranges);
              var r = translator.translate(parse('\\P{' + name + '}'));
              var x = Pattern.create(
                [Branch.create(
                  [Piece.create(
                    Group.create(items, { positive: false }))
                  ])
                ]);
              expect(r).to.eql(x);
            });
          });

        });

      });

      describe("groups", function () {

        it("should form ranges of 3 or more codeunits", function () {
          var r = translator.translate(parse('[aefdbc]'));
          var x = Pattern.create(
            [Branch.create(
              [Piece.create(
                Group.create(
                 [Range.create(
                   Codeunit.create(0x61),
                   Codeunit.create(0x66))
                 ]))
              ])
            ]);
          expect(r).to.eql(x);
        });

        it("should combine overlapping ranges", function () {
          var r = translator.translate(parse('[a-eb-f]'));
          var x = Pattern.create(
            [Branch.create(
              [Piece.create(
                Group.create(
                 [Range.create(
                   Codeunit.create(0x61),
                   Codeunit.create(0x66))
                 ]))
              ])
            ]);
          expect(r).to.eql(x);
        });

        it("should split ranges of only 2 codepoints into those two codepoints", function () {
          var r = translator.translate(parse('[a-b]'));
          var x = Pattern.create(
            [Branch.create(
              [Piece.create(
                Group.create(
                  [Codeunit.create(0x61),
                   Codeunit.create(0x62)
                  ]))
              ])
            ]);
          expect(r).to.eql(x);
        });

        context("with non-BMP characters", function () {

          it("should translate them to a surrogate pair", function () {
            var r = translator.translate(parse('[\uD800\uDC00]'));
            var x = Pattern.create(
              [Branch.create(
                [Piece.create(
                  Group.create(
                   [Codeunit.create(0xD800),
                    Codeunit.create(0xDC00)
                   ]))
                ])
              ]);
            expect(r).to.eql(x);
          });

          context("with a range containing only non-BMP codepoints", function () {

            it("should translate to a group containing the lead surrogate of the start codepoint and the trail surrogate of the end codepoint", function () {
              var r = translator.translate(parse('[\uD800\uDC00-\uD800\uDCFF]'));
              var x = Pattern.create(
                [Branch.create(
                  [Piece.create(
                    Group.create(
                     [Codeunit.create(0xD800),
                      Codeunit.create(0xDCFF)
                     ]))
                  ])
                ]);
              expect(r).to.eql(x);
            });

          });

          context("with a range containing BMP and non-BMP codepoints", function () {

            context("when the BMP codepoint is greater than the ends lead surrogate", function () {

              it("should translate to a group containing only the trail surrogate of the largest non-BMP codepoint", function () {
                var r = translator.translate(parse('[\uFFFD-\uD800\uDC00]'));
                var x = Pattern.create(
                  [Branch.create(
                    [Piece.create(
                      Group.create(
                       [Codeunit.create(0xDC00)
                       ]))
                    ])
                  ]);
                expect(r).to.eql(x);
              });

            });

            context("when the BMP codepoint is less than the end's lead surrogate", function () {

              it("should translate to a group containing the trail surrogate of the largest non-BMP codepoint and a range starting at the smalles BMP codepoint and ending at the lead surrogate of the largest non-BMP codepoint", function () {
                var r = translator.translate(parse('[\x20-\uD800\uDC00]'));
                var x = Pattern.create(
                  [Branch.create(
                    [Piece.create(
                      Group.create(
                       [Range.create(
                         Codeunit.create(0x20),
                         Codeunit.create(0xD800)),
                        Codeunit.create(0xDC00)
                       ]))
                    ])
                  ]);
                expect(r).to.eql(x);
              });

            });

          });

        });

        context("when negative", function () {

          it("should keep the negative group", function () {
            var r = translator.translate(parse('[^\x20]'));
            var x = Pattern.create(
              [Branch.create(
                [Piece.create(
                  Group.create(
                   [Codeunit.create(0x20)
                   ], { positive: false }))
                ])
              ]);
            expect(r).to.eql(x);
          });

          context("with positive subtraction", function () {

            it("should translate to a group using the negated union of both groups' positive codepoints", function () {
              var r = translator.translate(parse('[^a-z-[A-Z]]'));
              var x = Pattern.create(
                [Branch.create(
                  [Piece.create(
                    Group.create(
                     [Range.create(
                       Codeunit.create(0x41),
                       Codeunit.create(0x5A)),
                      Range.create(
                        Codeunit.create(0x61),
                        Codeunit.create(0x7A))
                     ], { positive: false }))
                  ])
                ]);
              expect(r).to.eql(x);
            });

          });

          context("with negative subtraction", function () {

            it("should translate to a group using the relative complement of LHS' codepoints in RHS' codepoints", function () {
              var r = translator.translate(parse('[^a-z-[^A-Z]]'));
              var x = Pattern.create(
                [Branch.create(
                  [Piece.create(
                    Group.create(
                     [Range.create(
                       Codeunit.create(0x41),
                       Codeunit.create(0x5A))
                     ], { positive: false }))
                  ])
                ]);
              expect(r).to.eql(x);
            });

          });

        });

        context("when positive", function () {

          context("with positive subtraction", function () {

            it("should translate to a group using the relative complement of RHS' codepoints in LHS' codepoints", function () {
              var r = translator.translate(parse('[a-z-[d-f]]'));
              var x = Pattern.create(
                [Branch.create(
                  [Piece.create(
                    Group.create(
                     [Range.create(
                       Codeunit.create(0x61),
                       Codeunit.create(0x63)),
                      Range.create(
                       Codeunit.create(0x67),
                       Codeunit.create(0x7A))
                     ]))
                  ])
                ]);
              expect(r).to.eql(x);
            });

          });

          context("with negative subtraction", function () {

            it("should translate to a group using only the positive codepoints of the RHS", function () {
              var r = translator.translate(parse('[a-z-[^d-f]]'));
              var x = Pattern.create(
                [Branch.create(
                  [Piece.create(
                    Group.create(
                     [Range.create(
                       Codeunit.create(0x64),
                       Codeunit.create(0x66))
                     ]))
                  ])
                ]);
              expect(r).to.eql(x);
            });

          });

        });

        context("with subtraction", function () {

          it("should translate to a group matching all codepoints except the subtracted codepoints", function () {
            var r = translator.translate(parse('[\u0100-\u0200-[\u0150]]'));
            var x = Pattern.create(
              [Branch.create(
                [Piece.create(
                  Group.create(
                   [Range.create(
                     Codeunit.create(0x100),
                     Codeunit.create(0x14F)),
                    Range.create(
                     Codeunit.create(0x151),
                     Codeunit.create(0x200))
                   ]))
                ])
              ]);
            expect(r).to.eql(x);
          });

        });

        context("with multi character escapes", function () {

          function invert(ranges) {
            return Ranges.create(ranges).invert().array;
          }

          it("should translate \\c", function () {
            var items = rangesToGroupItems(unicode.getXmlNameCharRanges());
            var r = translator.translate(parse('[\\c]'));
            var x = Pattern.create(
              [Branch.create(
                [Piece.create(
                  Group.create(items))
                ])
              ]);
            expect(r).to.eql(x);
          });

          it("should translate \\C by inverting its ranges", function () {
            var items = rangesToGroupItems(invert(unicode.getXmlNameCharRanges()));
            var r = translator.translate(parse('[\\C]'));
            var x = Pattern.create(
              [Branch.create(
                [Piece.create(
                  Group.create(items))
                ])
              ]);
            expect(r).to.eql(x);
          });

          it("should translate \\d", function () {
            var items = rangesToGroupItems(unicode.getCategoryRanges('Nd'));
            var r = translator.translate(parse('[\\d]'));
            var x = Pattern.create(
              [Branch.create(
                [Piece.create(
                  Group.create(items))
                ])
              ]);
            expect(r).to.eql(x);
          });

          it("should translate \\D by inverting its ranges", function () {
            var items = rangesToGroupItems(invert(unicode.getCategoryRanges('Nd')));
            var r = translator.translate(parse('[\\D]'));
            var x = Pattern.create(
              [Branch.create(
                [Piece.create(
                  Group.create(items))
                ])
              ]);
            expect(r).to.eql(x);
          });

          it("should translate \\i", function () {
            var items = rangesToGroupItems(unicode.getXmlNameStartCharRanges());
            var r = translator.translate(parse('[\\i]'));
            var x = Pattern.create(
              [Branch.create(
                [Piece.create(
                  Group.create(items))
                ])
              ]);
            expect(r).to.eql(x);
          });

          it("should translate \\I by inverting its ranges", function () {
            var items = rangesToGroupItems(invert(unicode.getXmlNameStartCharRanges()));
            var r = translator.translate(parse('[\\I]'));
            var x = Pattern.create(
              [Branch.create(
                [Piece.create(
                  Group.create(items))
                ])
              ]);
            expect(r).to.eql(x);
          });

          it("should translate \\s", function () {
            var r = translator.translate(parse('[\\s]'));
            var x = Pattern.create(
              [Branch.create(
                [Piece.create(
                  Group.create(
                   [Codeunit.create(0x9),
                    Codeunit.create(0xA),
                    Codeunit.create(0xD),
                    Codeunit.create(0x20)
                   ]))
                ])
              ]);
            expect(r).to.eql(x);
          });

          it("should translate \\S by inverting its ranges", function () {
            var r = translator.translate(parse('[\\S]'));
            var x = Pattern.create(
              [Branch.create(
                [Piece.create(
                  Group.create(
                   [Range.create(
                     Codeunit.create(0x0),
                     Codeunit.create(0x8)),
                    Codeunit.create(0xB),
                    Codeunit.create(0xC),
                    Range.create(
                     Codeunit.create(0xE),
                     Codeunit.create(0x1F)),
                    Range.create(
                     Codeunit.create(0x21),
                     Codeunit.create(0xFFFF))
                   ]))
                ])
              ]);
            expect(r).to.eql(x);
          });

          it("should translate \\w by inverting its ranges", function () {
            var items = rangesToGroupItems(invert(translateCategories('C', 'P', 'Z')));
            var r = translator.translate(parse('[\\w]'));
            var x = Pattern.create(
              [Branch.create(
                [Piece.create(
                  Group.create(items))
                ])
              ]);
            expect(r).to.eql(x);
          });

          it("should translate \\W", function () {
            var items = rangesToGroupItems(translateCategories('C', 'P', 'Z'));
            var r = translator.translate(parse('[\\W]'));
            var x = Pattern.create(
              [Branch.create(
                [Piece.create(
                  Group.create(items))
                ])
              ]);
            expect(r).to.eql(x);
          });

          describe("\\p", function () {

            it("should translate \\p to a positive group for all supported blocks", function () {
              SUPPORTED_UNICODE_BLOCKS.forEach(function (name) {
                var range = unicode.getBlockRange(name);
                var r = translator.translate(parse('[\\p{Is' + name + '}]'));
                var x = Pattern.create(
                  [Branch.create(
                    [Piece.create(
                      Group.create(
                       [Range.create(
                         Codeunit.create(range[0]),
                         Codeunit.create(range[1]))
                       ]))
                    ])
                  ]);
                expect(r).to.eql(x);
              });
            });

            it("should translate \\p to a positive group for all supported categories", function () {
              SUPPORTED_UNICODE_CATEGORIES.forEach(function (name) {
                var ranges = unicode.getCategoryRanges(name);
                var items = rangesToGroupItems(ranges);
                var r = translator.translate(parse('[\\p{' + name + '}]'));
                var x = Pattern.create(
                  [Branch.create(
                    [Piece.create(
                      Group.create(items))
                    ])
                  ]);
                expect(r).to.eql(x);
              });
            });

            it("should translate \\p to a positive group for all supported category groups", function () {
              unicode.getCategoryGroupNames().forEach(function (name) {
                var ranges = unicode.getCategoryGroupRanges(name);
                var items = rangesToGroupItems(ranges);
                var r = translator.translate(parse('[\\p{' + name + '}]'));
                var x = Pattern.create(
                  [Branch.create(
                    [Piece.create(
                      Group.create(items))
                    ])
                  ]);
                expect(r).to.eql(x);
              });
            });

          });

          describe("\\P", function () {

            it("should translate \\P to a positive group using inverted ranges for all supported blocks", function () {
              SUPPORTED_UNICODE_BLOCKS.forEach(function (name) {
                var items = rangesToGroupItems(invert([unicode.getBlockRange(name)]));
                var r = translator.translate(parse('[\\P{Is' + name + '}]'));
                var x = Pattern.create(
                  [Branch.create(
                    [Piece.create(
                      Group.create(items))
                    ])
                  ]);
                expect(r).to.eql(x);
              });
            });

            it("should translate \\P to a positive group using inverted ranges for all supported categories", function () {
              SUPPORTED_UNICODE_CATEGORIES.forEach(function (name) {
                var items = rangesToGroupItems(invert(unicode.getCategoryRanges(name)));
                var r = translator.translate(parse('[\\P{' + name + '}]'));
                var x = Pattern.create(
                  [Branch.create(
                    [Piece.create(
                      Group.create(items))
                    ])
                  ]);
                expect(r).to.eql(x);
              });
            });

            it("should translate \\P to a positive group using inverted ranges for all supported category groups", function () {
              unicode.getCategoryGroupNames().forEach(function (name) {
                var items = rangesToGroupItems(invert(unicode.getCategoryGroupRanges(name)));
                var r = translator.translate(parse('[\\P{' + name + '}]'));
                var x = Pattern.create(
                  [Branch.create(
                    [Piece.create(
                      Group.create(items))
                    ])
                  ]);
                expect(r).to.eql(x);
              });
            });

          });

        });

      });

    });

  });

  var UNSUPPORTED_UNICODE_CATEGORIES = ['Cs'];

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
