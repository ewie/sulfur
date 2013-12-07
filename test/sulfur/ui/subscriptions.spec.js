/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/ui/publisher',
  'sulfur/ui/subscriptions'
], function (shared, Publisher, Subscriptions) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;

  describe('sulfur/ui/subscriptions', function () {

    describe('#subscribe()', function () {

      var s;
      var p;

      beforeEach(function () {
        s = Subscriptions.create();
        p = Publisher.create();
      });

      it("should subscribe to the channel of the given publisher", function () {
        var spy = sinon.spy(p, 'subscribe');
        var fn = function () {};
        var t = s.subscribe(p, 'foo', fn);
        expect(spy)
          .to.be.calledWith('foo', fn)
          .to.have.returned(sinon.match.same(t));
      });

      it("should remember the subscription to be detached", function () {
        var t = s.subscribe(p, 'bar', function () {});
        var spy = sinon.spy(t, 'detach');
        s.detach(p);
        expect(spy).to.be.called;
      });

    });

    describe('#detach()', function () {

      var s;
      var p;

      beforeEach(function () {
        s = Subscriptions.create();
        p = Publisher.create();
      });

      it("should detach all subscriptions when no publisher is given", function () {
        var q = Publisher.create();
        var t = s.subscribe(p, 'foo', function () {});
        var u = s.subscribe(q, 'bar', function () {});
        var spy1 = sinon.spy(t, 'detach');
        var spy2 = sinon.spy(u, 'detach');
        s.detach();
        expect(spy1).to.be.called;
        expect(spy2).to.be.called;
      });

      context("when a publisher is given", function () {

        context("when no channel is given", function () {

          it("should detach all subscriptions to the given publisher", function () {
            var t = s.subscribe(p, 'foo', function () {});
            var u = s.subscribe(p, 'bar', function () {});
            var spy1 = sinon.spy(t, 'detach');
            var spy2 = sinon.spy(u, 'detach');
            s.detach(p);
            expect(spy1).to.be.called;
            expect(spy2).to.be.called;
          });

          it("should remove the publisher", function () {
            s.subscribe(p, 'bar', function () {});
            var spy = sinon.spy(s._index, 'remove');
            s.detach(p);
            expect(spy).to.be.calledWith(sinon.match.same(p));
          });

        });

        context("when a channel is given", function () {

          it("should detach all subscriptions to the given publisher's channel", function () {
            var t = s.subscribe(p, 'bar', function () {});
            var u = s.subscribe(p, 'bar', function () {});
            var spy1 = sinon.spy(t, 'detach');
            var spy2 = sinon.spy(u, 'detach');
            s.detach(p, 'bar');
            expect(spy1).to.be.called;
            expect(spy2).to.be.called;
          });

          it("should remove the publisher when there are no subscriptions on other channels", function () {
            s.subscribe(p, 'foo', function () {});
            var spy = sinon.spy(s._index, 'remove');
            s.detach(p, 'foo');
            expect(spy).to.be.calledWith(sinon.match.same(p));
          });

          it("should not remove the publisher when there are subscriptions on other channels", function () {
            s.subscribe(p, 'foo', function () {});
            s.subscribe(p, 'bar', function () {});
            var spy = sinon.spy(s._index, 'remove');
            s.detach(p, 'foo');
            expect(spy).to.not.be.called;
          });

        });

      });

    });

  });

});
