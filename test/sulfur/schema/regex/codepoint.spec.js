/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global context, describe, it */

define([
  'shared',
  'sulfur/schema/regex/codepoint'
], function (shared, Codepoint) {

  'use strict';

  var expect = shared.expect;
  var bind = shared.bind;

  describe('sulfur/schema/regex/codepoint', function () {

    describe('#initialize()', function () {

      context("when called with a number", function () {

        context("when its not the codepoint of a valid XML character", function () {

          it("should throw", function () {
            [
              [0x0, 0x8],
              [0xB, 0xC],
              [0xE, 0x1F],
              [0xD800, 0xDFFF],
              [0xFFFE, 0xFFFF]
            ].forEach(function (range) {
              for (var value = range[0]; value <= range[1]; value += 1) {
                expect(bind(Codepoint, 'create', value))
                  .to.throw("expecting a valid XML character");
              }
            });
          });

        });

        context("when its the codepoint of a valid XML character", function () {

          it("should use the codepoint value", function () {
            var c = Codepoint.create(0x20);
            expect(c.value).to.equal(0x20);
          });

        });

      });

      context("when called with a string", function () {

        context("when the string is empty", function () {

          it("should throw", function () {
            expect(bind(Codepoint, 'create', ''))
              .to.throw("expecting a string with exactly one character");
          });

        });

        context("when the string represents a valid XML character", function () {

          it("should use the codepoint value", function () {
            var c = Codepoint.create('a');
            expect(c.value).to.equal('a'.charCodeAt(0));
          });

        });

        context("when the string represents an invalid XML character", function () {

          it("should throw", function () {
            [
              [0x0, 0x8],
              [0xB, 0xC],
              [0xE, 0x1F],
              [0xD800, 0xDFFF],
              [0xFFFE, 0xFFFF]
            ].forEach(function (range) {
              for (var s, value = range[0]; value <= range[1]; value += 1) {
                s = String.fromCharCode(value);
                expect(bind(Codepoint, 'create', s))
                 .to.throw();
              }
            });
          });

        });

        context("when the string represents more than 1 codepoint", function () {

          it("should throw", function () {
            expect(bind(Codepoint, 'create', 'ab'))
              .to.throw("expecting a string with exactly one character");
          });

        });

        context("when the string contains an invalid surrogate pair", function () {

          it("should throw", function () {
            expect(bind(Codepoint, 'create', '\ud800\u0020'))
              .to.throw();
          });

        });

      });

    });

  });

});
