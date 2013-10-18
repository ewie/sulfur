/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/elements'
], function ($shared, $elements) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;

  describe('sulfur/schema/elements', function () {

    describe('#initialize()', function () {

      it("should initialize with the given elements", function () {
        var element = {
          getName: function () { return 'foo'; }
        };
        var elements = $elements.create([ element ]);
        expect(elements.getElement('foo')).to.equal(element);
      });

      it("should reject an empty array of elements", function () {
        expect(bind($elements, 'create', []))
          .to.throw("expecting one or more elements");
      });

      it("should reject elements with duplicate names", function () {
        var elements = [
          {
            getName: function () { return 'x'; }
          },
          {
            getName: function () { return 'x'; }
          }
        ];
        expect(bind($elements, 'create', elements))
          .to.throw('element with duplicate name "x"');
      });

    });

    describe('#getElement()', function () {

      var element;
      var elements;

      beforeEach(function () {
        element = {
          getName: function () { return 'bar'; }
        };
        elements = $elements.create([ element ]);
      });

      it("should return the element with the given name when existent", function () {
        expect(elements.getElement('bar')).to.equal(element);
      });

      it("should return undefined when no element with the given name exists", function () {
        expect(elements.getElement('xxx')).to.be.undefined;
      });

    });

    describe('#getSize()', function () {

      it("should return the number of elements", function () {
        var element = {
          getName: function () { return 'foo'; }
        };
        var elements = $elements.create([ element ]);
        expect(elements.getSize()).to.equal(1);
      });

    });

    describe('#toArray()', function () {

      it("should return an array of elements in initialization order", function () {
        var els = [
          {
            getName: function () { return 'x'; }
          },
          {
            getName: function () { return 'y'; }
          }
        ];
        var elements = $elements.create(els);
        expect(elements.toArray()).to.eql(els);
      });

    });

  });

});
