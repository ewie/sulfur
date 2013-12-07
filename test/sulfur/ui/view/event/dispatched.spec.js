/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, describe, it */

define([
  'shared',
  'sulfur/ui/view/event/dispatched'
], function (shared, DispatchedEvent) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;

  describe('sulfur/ui/event/dispatched', function () {

    describe('#bind()', function () {

      var dispatchedEvent;
      var channel;

      beforeEach(function () {
        channel = 'bar';
        dispatchedEvent = DispatchedEvent.create(channel);
      });

      it("should reject a view not responding to the method", function () {
        expect(bind(dispatchedEvent, 'bind', { bar: undefined }))
          .to.throw('expecting a view responding to "bar"');
      });

      describe("the returned function", function () {

        var fn;
        var channel;
        var view;

        beforeEach(function () {
          channel = 'bar';
          view = { bar: function () {} };
          fn = dispatchedEvent.bind(view);
        });

        it("should call the method on the given view", function () {
          var spy = sinon.spy(view, 'bar');
          fn();
          expect(spy).to.be.calledOn(sinon.match.same(view));
        });

        it("should pass all arguments on to the method", function () {
          var spy = sinon.spy(view, 'bar');
          var arg1 = {};
          var arg2 = {};
          fn(arg1, arg2);
          expect(spy).to.be.calledWith(
            sinon.match.same(arg1),
            sinon.match.same(arg2));
        });

      });

    });

  });

});
