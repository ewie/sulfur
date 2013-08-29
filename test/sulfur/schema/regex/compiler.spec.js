/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/regex/compiler',
  'sulfur/schema/regex/parser',
  'sulfur/schema/regex/translator'
], function ($shared, $compiler, $parser, $translator) {

  'use strict';

  var expect = $shared.expect;

  function forEachInRange(ranges, fn) {
    ranges.forEach(function (range) {
      for (var value = range[0]; value <= range[1]; value += 1) {
        fn(value);
      }
    });
  }

  describe('sulfur/schema/regex/compiler', function () {

    var parse = (function () {
      var parser = $parser.create();
      var translator = $translator.create();
      return function parse(source) {
        return translator.translate(parser.parse(source));
      };
    }());

    var compiler;

    beforeEach(function () {
      compiler = $compiler.create();
    });

    describe('#compile()', function () {

      it("should compile to a RegExp", function () {
        var r = compiler.compile(parse(''));
        expect(r).to.be.an.instanceOf(RegExp);
      });

      it("should compile to an anchored RegExp", function () {
        var r = compiler.compile(parse(''));
        var x = /^$/;
        expect(r).to.eql(x);
      });

      context("characters", function () {

        context("when less than or equal U+00FF", function () {

          context("when printable ASCII", function () {

            it("should compile to printable ASCII", function () {
              forEachInRange([
                [0x20, 0x27],
                [0x2F, 0x39],
                [0x41, 0x5A],
                [0x5E, 0x7A],
                [0x7E, 0x7E]
              ], function (value) {
                var chr = String.fromCharCode(value);
                var r = compiler.compile(parse(chr));
                var x = new RegExp('^' + chr + '$');
                expect(r).to.eql(x);
              });
            });

            it("should escape meta characters", function () {
              '\\()[]{}+*?.'.split('').forEach(function (chr) {
                var r = compiler.compile(parse('\\' + chr));
                var x = new RegExp('^\\' + chr + '$');
                expect(r).to.eql(x);
              });
            });

          });

          context("when not printable ASCII", function () {

            it("should compile to \\xHH", function () {
              forEachInRange([
                [0x7F, 0xFF]
              ], function (value) {
                var hex = value.toString(16).toUpperCase();
                var r = compiler.compile(parse('&#x' + hex + ';'));
                var x = new RegExp('^\\x' + hex + '$');
                expect(r).to.eql(x);
              });

            });

            it("should compile U+0009 to \\t", function () {
              var r = compiler.compile(parse('\\t'));
              var x = /^\t$/;
              expect(r).to.eql(x);
            });

            it("should compile U+000A to \\n", function () {
              var r = compiler.compile(parse('\\n'));
              var x = /^\n$/;
              expect(r).to.eql(x);
            });

            it("should compile U+000D to \\r", function () {
              var r = compiler.compile(parse('\\r'));
              var x = /^\r$/;
              expect(r).to.eql(x);
            });

          });

        });

        context("when greater than U+00FF", function () {

          it("should compile to \\uHHHH", function () {
            var r = compiler.compile(parse('&#x1234;'));
            var x = /^\u1234$/;
            expect(r).to.eql(x);
          });

        });

      });

      context("with multiple branches", function () {

        it("should compile to a non-capturing sub pattern", function () {
          var r = compiler.compile(parse('a|b'));
          var x = /^(?:a|b)$/;
          expect(r).to.eql(x);
        });

        it("should compile to an alternation per branch", function () {
          var r = compiler.compile(parse('a|b|c'));
          var x = /^(?:a|b|c)$/;
          expect(r).to.eql(x);
        });

      });

      context("with a group", function () {

        it("should compile to a group", function () {
          var r = compiler.compile(parse('[ab]'));
          var x = /^[ab]$/;
          expect(r).to.eql(x);
        });

        context("when negative", function () {

          it("should compile to a negative group", function () {
            var r = compiler.compile(parse('[^ab]'));
            var x = /^[^ab]$/;
            expect(r).to.eql(x);
          });

        });

        context("with a range", function () {

          it("should compile to a range", function () {
            var r = compiler.compile(parse('[a-z]'));
            var x = /^[a-z]$/;
            expect(r).to.eql(x);
          });

        });

      });

      context("with a quantifier", function () {

        it("should compile 'one or more' to '+'", function () {
          var r = compiler.compile(parse('a+'));
          var x = /^a+$/;
          expect(r).to.eql(x);
        });

        it("should compile 'zero or more' to '*'", function () {
          var r = compiler.compile(parse('a*'));
          var x = /^a*$/;
          expect(r).to.eql(x);
        });

        it("should compile 'zero or one' to '?'", function () {
          var r = compiler.compile(parse('a?'));
          var x = /^a?$/;
          expect(r).to.eql(x);
        });

        it("should compile 'min or more' to '{min,}'", function () {
          var r = compiler.compile(parse('a{3,}'));
          var x = /^a{3,}$/;
          expect(r).to.eql(x);
        });

        it("should compile 'exactly n' to '{n}'", function () {
          var r = compiler.compile(parse('a{3}'));
          var x = /^a{3}$/;
          expect(r).to.eql(x);
        });

        it("should compile any other to '{min,max}'", function () {
          var r = compiler.compile(parse('a{1,3}'));
          var x = /^a{1,3}$/;
          expect(r).to.eql(x);
        });

      });

    });

  });

});
