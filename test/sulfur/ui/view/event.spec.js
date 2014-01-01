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
  'sulfur/ui/view/boundEvent',
  'sulfur/ui/view/event'
], function (shared, BoundEvent, Event) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var returns = shared.returns;

  describe('sulfur/ui/view/event', function () {

    describe('#initialize()', function () {

      it("should handle missing selector", function () {
        var event = Event.create('', function () {});
        expect(event.selector).to.be.undefined;
      });

    });

    describe('#bind()', function () {

      var sandbox;

      beforeEach(function () {
        sandbox = sinon.sandbox.create();
      });

      afterEach(function () {
        sandbox.restore();
      });

      it("should return a sulfur/ui/view/boundEvent", function () {
        var event = Event.create('', '', function () {});
        var boundEvent = event.bind({});
        expect(BoundEvent.prototype).to.be.prototypeOf(boundEvent);
      });

      it("should initialize the bound event with the event type, selector, handler and view element", function () {
        var type = 'foo';
        var selector = 'div';
        var boundHandler = {};
        var handler = { bind: returns(boundHandler) };
        var event = Event.create(type, selector, handler);
        var spy = sandbox.spy(BoundEvent, 'create');
        var element = {};
        var boundEvent = event.bind(element, null);
        expect(spy)
          .to.be.calledWith(
            sinon.match.same(element),
            sinon.match.same(boundHandler),
            type,
            selector)
          .to.have.returned(sinon.match.same(boundEvent));
      });

      it("should bind the handler to the given view", function () {
        var handler = function () {};
        var event = Event.create('', '', handler);
        var spy = sinon.spy(handler, 'bind');
        var view = {};
        event.bind(null, view);
        expect(spy).to.be.calledWith(sinon.match.same(view));
      });

    });

  });

});
