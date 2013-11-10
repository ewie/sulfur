/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/element'
], function (shared, Element) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/element', function () {

    describe('#initialize()', function () {

      var name = 'name';
      var type = {};

      it("should initialize the element with the given name", function () {
        var element = Element.create(name, type);
        expect(element.name).to.equal(name);
      });

      it("should initialize the element with the given type", function () {
        var element = Element.create(name, type);
        expect(element.type).to.equal(type);
      });

      it("should initialize the element as optional when specified", function () {
        var element = Element.create(name, type, { optional: true });
        expect(element.isOptional()).to.be.true;
      });

      it("should initialize the element as mandatory when specified", function () {
        var element = Element.create(name, type, { optional: false });
        expect(element.isOptional()).to.be.false;
      });

      it("should initialize the element as mandatory by default", function () {
        var element = Element.create(name, type);
        expect(element.isOptional()).to.be.false;
      });

    });

    describe('#name', function () {

      it("should return the name", function () {
        var element = Element.create('foo');
        expect(element.name).to.equal('foo');
      });

    });

    describe('#type', function () {

      it("should return the type", function () {
        var type = {};
        var element = Element.create('', type);
        expect(element.type).to.equal(type);
      });

    });

    describe('#default', function () {

      it("should return the default value when defined", function () {
        var value = {};
        var element = Element.create('', {}, { default: value });
        expect(element.default).to.equal(value);
      });

      it("should return undefined when no default value is defined", function () {
        var element = Element.create('', {});
        expect(element.default).to.be.undefined;
      });

    });

    describe('#isOptional()', function () {

      it("should return true when optional", function () {
        var element = Element.create('', {}, { optional: true });
        expect(element.isOptional()).to.be.true;
      });

      it("should return false when mandatory", function () {
        var element = Element.create('', {}, { optional: false });
        expect(element.isOptional()).to.be.false;
      });

    });

  });

});
