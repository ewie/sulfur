/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global context, describe, it */

define([
  'shared',
  'sulfur/schema/regex/category',
  'sulfur/util/unicode'
], function (shared, Category, unicode) {

  'use strict';

  var expect = shared.expect;
  var bind = shared.bind;

  describe('sulfur/schema/regex/category', function () {

    describe('#initialize()', function () {

      context("with an unknown category name", function () {

        it("should reject the category name", function () {
          expect(bind(Category, 'create', 'xx'))
            .to.throw("unknown Unicode category xx");
        });
      });

      context("with an unsupported category name", function () {

        it("should reject the category name", function () {
          UNSUPPORTED_UNICODE_CATEGORIES.forEach(function (name) {
            expect(bind(Category, 'create', name))
              .to.throw("unsupported Unicode category " + name);
          });
        });

      });

      context("with a supported category name", function () {

        it("should initialize the category with the given name", function () {
          SUPPORTED_UNICODE_CATEGORIES.forEach(function (name) {
            var b = Category.create(name);
            expect(b.name).to.equal(name);
          });
        });

      });

      context("when called without second argument", function () {

        it("should initialize the category as positive", function () {
          var c = Category.create('Ll');
          expect(c.positive).to.be.true;
        });

      });

    });

  });

  var UNSUPPORTED_UNICODE_CATEGORIES = ['Cn'];

  var SUPPORTED_UNICODE_CATEGORIES = unicode.getCategoryNames().reduce(
    function (categories, name) {
      if (UNSUPPORTED_UNICODE_CATEGORIES.indexOf(name) === -1) {
        categories.push(name);
      }
      return categories;
    }, []);

});
