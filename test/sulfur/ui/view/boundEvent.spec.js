/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, describe, it */

define([
  'shared',
  'sulfur/ui/view/boundEvent'
], function (shared, BoundEvent) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var returns = shared.returns;

  describe('sulfur/ui/view/boundEvent', function () {

    var element;
    var handler;
    var type;
    var selector;

    beforeEach(function () {
      element = {
        addEventListener: function () {},
        querySelectorAll: function () {},
        removeEventListener: function () {}
      };
      handler = {};
      type = 'foo';
      selector = 'bar';
    });

    describe('#attach()', function () {

      it("should attach the event handler to each matched element when a selector is defined", function () {
        var e = { addEventListener: sinon.spy() };
        var querySpy = sinon.stub(element, 'querySelectorAll').returns({
          length: 1,
          item: returns(e)
        });
        var boundEvent = BoundEvent.create(element, handler, type, selector);
        boundEvent.attach();
        expect(querySpy).to.be.calledWith(selector);
        expect(e.addEventListener)
          .to.be.calledWith(
            type,
            sinon.match.same(handler));
      });

      it("should attach the event handler to the element when no selector is defined", function () {
        var spy = sinon.spy(element, 'addEventListener');
        var boundEvent = BoundEvent.create(element, handler, type);
        boundEvent.attach();
        expect(spy)
          .to.be.calledWith(
            type,
            sinon.match.same(handler));
      });

    });

    describe('#detach()', function () {

      it("should detach the event handler from each matched element", function () {
        var e = { removeEventListener: sinon.spy() };
        var querySpy = sinon.stub(element, 'querySelectorAll').returns({
          length: 1,
          item: returns(e)
        });
        var boundEvent = BoundEvent.create(element, handler, type, selector);
        boundEvent.detach();
        expect(querySpy).to.be.calledWith(selector);
        expect(e.removeEventListener)
          .to.be.calledWith(
            type,
            sinon.match.same(handler));
      });

      it("should detach the event handler from element when no selector is defined", function () {
        var spy = sinon.spy(element, 'removeEventListener');
        var boundEvent = BoundEvent.create(element, handler, type);
        boundEvent.detach();
        expect(spy)
          .to.be.calledWith(
            type,
            sinon.match.same(handler));
      });

    });

  });

});
