/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global context, describe, it */

define([
  'shared',
  'sulfur/schema/regex/quant'
], function (shared, Quant) {

  'use strict';

  var expect = shared.expect;
  var bind = shared.bind;

  describe('sulfur/schema/regex/quant', function () {

    describe('#initialize()', function () {

      context("when the first number is negative", function () {

        it("should throw", function () {
          expect(bind(Quant, 'create', -1, 1))
            .to.throw("minimum must not be negative");
        });

      });

      context("with a single number", function () {

        it("should use the number as minimum and maximum", function () {
          var q = Quant.create(1);
          expect(q.min).to.equal(1).and.equal(q.max);
        });

      });

      context("with two numbers", function () {

        it("should use the first as minimum", function () {
          var q = Quant.create(1, 2);
          expect(q.min).to.equal(1);
        });

        it("should use the second as maximum", function () {
          var q = Quant.create(1, 2);
          expect(q.max).to.equal(2);
        });

        context("when the second number is smaller", function () {

          it("should throw", function () {
            expect(bind(Quant, 'create', 2, 1))
              .to.throw("maximum must not be less than minimum");
          });

        });

      });

    });

  });

});
