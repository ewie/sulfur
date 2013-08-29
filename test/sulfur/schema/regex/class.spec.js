/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global context, describe, it */

define([
  'shared',
  'sulfur/schema/regex/class'
], function ($shared, $class) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;

  describe('sulfur/schema/regex/class', function () {

    describe('#initialize()', function () {

      it("should reject invalid character classes", function () {
        expect(bind($class, 'create', 'xxx'))
          .to.throw("unknown character class xxx");
      });

      it("should accept valid character classes", function () {
        [
          $class.CHAR,
          $class.DIGIT,
          $class.INITIAL,
          $class.SPACE,
          $class.WORD
        ].forEach(function (cls) {
          var c = $class.create(cls);
          expect(c.name).to.equal(cls);
        });
      });

      context("when called without second argument", function () {

        it("should create a positive character class", function () {
          var c = $class.create($class.SPACE);
          expect(c.positive).to.be.true;
        });

      });

    });

  });

});
