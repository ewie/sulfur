/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/ui/view/accessor',
  'sulfur/ui/view/boundAccessor'
], function (shared, Accessor, BoundAccessor) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;
  var returns = shared.returns;

  describe('sulfur/ui/view/accessor', function () {

    describe('#bind()', function () {

      var sandbox;

      beforeEach(function () {
        sandbox = sinon.sandbox.create();
      });

      afterEach(function () {
        sandbox.restore();
      });

      it("should create a bound accessor with the view element when no selector is defined", function () {
        var Access = { create: returns({}) };
        var accessor = Accessor.create('bar', Access);
        var element = {};
        var accessSpy = sinon.spy(Access, 'create');
        var boundAccessorSpy = sandbox.spy(BoundAccessor, 'create');
        var boundAccessor = accessor.bind(element);
        expect(accessSpy).to.be.calledWith(sinon.match.same(element));
        expect(boundAccessorSpy)
          .to.be.calledWith('bar', sinon.match.same(accessSpy.getCall(0).returnValue))
          .to.have.returned(sinon.match.same(boundAccessor));
      });

      context("when a selector is defined", function () {

        it("should create a bound accessor with the element matched by the selector", function () {
          var Access = { create: returns({}) };
          var selector = {};
          var accessor = Accessor.create('foo', selector, Access);
          var e = {};
          var element = {
            querySelectorAll: returns({
              length: 1,
              item: returns(e)
            })
          };
          var accessSpy = sinon.spy(Access, 'create');
          var boundAccessorSpy = sandbox.spy(BoundAccessor, 'create');
          var querySpy = sinon.spy(element, 'querySelectorAll');
          var boundAccessor = accessor.bind(element);
          expect(accessSpy).to.be.calledWith(sinon.match.same(e));
          expect(boundAccessorSpy)
            .to.be.calledWith('foo', sinon.match.same(accessSpy.getCall(0).returnValue))
            .to.have.returned(sinon.match.same(boundAccessor));
          expect(querySpy).to.be.calledWith(selector);
        });

        it("should reject when the selector matches no element", function () {
          var accessor = Accessor.create('bar', 'foo', {});
          var element = { querySelectorAll: returns({ length: 0 }) };
          expect(bind(accessor, 'bind', element))
            .to.throw("no element matching selector {foo}");
        });

        it("should reject when the selector matches multiple elements", function () {
          var accessor = Accessor.create('foo', 'bar', {});
          var element = { querySelectorAll: returns({ length: 2 }) };
          expect(bind(accessor, 'bind', element))
            .to.throw("expecting selector {bar} to match exactly one element");
        });

      });

    });

  });

});
