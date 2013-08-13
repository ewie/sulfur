/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global context, describe, it */

define([
  'shared',
  'sulfur/schema/regex/codeunit'
], function ($shared, $codeunit) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;

  describe('sulfur.schema.regex.codeunit', function () {

    describe('#initialize()', function () {

      context("with a valid codeunit", function () {

        it("should initialize the codeunit with the given value", function () {
          var c = $codeunit.create(0x20);
          expect(c.value).to.equal(0x20);
        });

      });

      context("with an invalid codeunit", function () {

        it("should reject the value", function () {
          expect(bind($codeunit, 'create', 0x10000))
            .to.throw("codeunit value must be a 16-bit integer");
        });

      });

    });

  });

});
