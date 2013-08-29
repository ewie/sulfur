/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global context, describe, it */

define([
  'shared',
  'sulfur/schema/regex/codepoint',
  'sulfur/schema/regex/range'
], function ($shared, $codepoint, $range) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;

  describe('sulfur/schema/regex/range', function () {

    describe('#initialize()', function () {

      context("when start is greater than end", function () {

        it("should reject", function () {
          var s = $codepoint.create('b');
          var e = $codepoint.create('a');
          expect(bind($range, 'create', s, e))
            .to.throw("non-empty range 0x62, 0x61");
        });

      });

      context("when start is less than or equal to end", function () {

        it("should create a range with the given start and end", function () {
          var s = $codepoint.create('a');
          var e = $codepoint.create('b');
          var r = $range.create(s, e);
          expect(r.start).to.eql(s);
          expect(r.end).to.eql(e);
        });

      });

    });

  });

});
