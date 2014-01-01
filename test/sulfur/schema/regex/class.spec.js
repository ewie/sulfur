/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global context, describe, it */

define([
  'shared',
  'sulfur/schema/regex/class'
], function (shared, Class) {

  'use strict';

  var expect = shared.expect;
  var bind = shared.bind;

  describe('sulfur/schema/regex/class', function () {

    describe('#initialize()', function () {

      it("should reject invalid character classes", function () {
        expect(bind(Class, 'create', 'xxx'))
          .to.throw("unknown character class xxx");
      });

      it("should accept valid character classes", function () {
        [
          Class.CHAR,
          Class.DIGIT,
          Class.INITIAL,
          Class.SPACE,
          Class.WORD
        ].forEach(function (cls) {
          var c = Class.create(cls);
          expect(c.name).to.equal(cls);
        });
      });

      context("when called without second argument", function () {

        it("should create a positive character class", function () {
          var c = Class.create(Class.SPACE);
          expect(c.positive).to.be.true;
        });

      });

    });

  });

});
