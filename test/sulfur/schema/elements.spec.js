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
], function (shared, Elements) {

  'use strict';

  var expect = shared.expect;
  var bind = shared.bind;

  describe('sulfur/schema/elements', function () {

    describe('#initialize()', function () {

      it("should initialize with the given elements", function () {
        var element = { name: 'foo' };
        var elements = Elements.create([ element ]);
        expect(elements.getByName('foo')).to.equal(element);
      });

      it("should reject an empty array of elements", function () {
        expect(bind(Elements, 'create', []))
          .to.throw("expecting one or more elements");
      });

      it("should reject elements with duplicate names", function () {
        var elements = [
          { name: 'x' },
          { name: 'x' }
        ];
        expect(bind(Elements, 'create', elements))
          .to.throw('element with duplicate name "x"');
      });

    });

    describe('#getByName()', function () {

      var element;
      var elements;

      beforeEach(function () {
        element = { name: 'bar' };
        elements = Elements.create([ element ]);
      });

      it("should return the element with the given name when existent", function () {
        expect(elements.getByName('bar')).to.equal(element);
      });

      it("should return undefined when no element with the given name exists", function () {
        expect(elements.getByName('xxx')).to.be.undefined;
      });

    });

    describe('#size', function () {

      it("should return the number of elements", function () {
        var element = {
          getName: function () { return 'foo'; }
        };
        var elements = Elements.create([ element ]);
        expect(elements.size).to.equal(1);
      });

    });

    describe('#toArray()', function () {

      it("should return an array of elements in initialization order", function () {
        var els = [
          { name: 'x' },
          { name: 'y' }
        ];
        var elements = Elements.create(els);
        expect(elements.toArray()).to.eql(els);
      });

    });

  });

});
