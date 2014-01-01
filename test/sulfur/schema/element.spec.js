/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/element',
  'sulfur/schema/regex'
], function (shared, Element, Regex) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;

  describe('sulfur/schema/element', function () {

    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    describe('.isValidName()', function () {

      it("should test the given string with the XML regex '[\\i-[:]][\\c-[:]]*'", function () {
        var pattern = Regex.compile('[\\i-[:]][\\c-[:]]*');
        var spy = sandbox.spy(RegExp.prototype, 'test');
        var s = 'foobar';
        Element.isValidName(s);
        expect(spy).to.be.calledWith(s);
        expect(spy.getCall(0).thisValue.source).to.equal(pattern.source);
      });

      it("should return true when it's a valid XML name", function () {
        expect(Element.isValidName('xy')).to.be.true;
      });

      it("should return false when it's not a valid XML name", function () {
        expect(Element.isValidName('x y')).to.be.false;
      });

    });

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
        expect(element.isOptional).to.be.true;
      });

      it("should initialize the element as mandatory when specified", function () {
        var element = Element.create(name, type, { optional: false });
        expect(element.isOptional).to.be.false;
      });

      it("should initialize the element as mandatory by default", function () {
        var element = Element.create(name, type);
        expect(element.isOptional).to.be.false;
      });

      it("should reject when .isValidName() returns false for the given name", function () {
        sandbox.stub(Element, 'isValidName').returns(false);
        expect(bind(Element, 'create', ''))
          .to.throw("expecting name to be an NCName");
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
        var element = Element.create('bar', type);
        expect(element.type).to.equal(type);
      });

    });

    describe('#default', function () {

      it("should return the default value when defined", function () {
        var value = {};
        var element = Element.create('x', {}, { default: value });
        expect(element.default).to.equal(value);
      });

      it("should return undefined when no default value is defined", function () {
        var element = Element.create('y', {});
        expect(element.default).to.be.undefined;
      });

    });

    describe('#isOptional', function () {

      it("should return true when optional", function () {
        var element = Element.create('x', {}, { optional: true });
        expect(element.isOptional).to.be.true;
      });

      it("should return false when mandatory", function () {
        var element = Element.create('y', {}, { optional: false });
        expect(element.isOptional).to.be.false;
      });

    });

  });

});
