/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, describe, it */

define([
  'shared',
  'sulfur/ui/publisher'
], function (shared, Publisher) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var async = shared.async;

  describe('sulfur/ui/publisher', function () {

    var publisher;

    beforeEach(function () {
      publisher = Publisher.create();
    });

    describe('#subscribe()', function () {

      it("should return an attached subscription on the given channel", function (done) {
        publisher.subscribe('foo', function () {
          done();
        });
        publisher.publish('foo');
      });

      describe("the returned subscription", function () {

        describe('#attach()', function () {

          it("should attach the subscription to the channel", function (done) {
            var subscription = publisher.subscribe('x', function () {
              done();
            });
            subscription.detach();
            subscription.attach();
            publisher.publish('x');
          });

          it("should attach the subscription after all existing subscriptions", function (done) {
            var spy1 = sinon.spy();
            var spy2 = sinon.spy(function () {
              expect(spy2).to.be.calledAfter(spy1);
              done();
            });
            publisher.subscribe('x', spy1);
            publisher.subscribe('x', spy2);
            publisher.publish('x');
          });

          it("should not attach multiple times", function (done) {
            var spy = sinon.spy();
            var subscription = publisher.subscribe('x', spy);
            subscription.detach();
            subscription.attach();
            subscription.attach();
            publisher.publish('x');
            async(function () {
              expect(spy).to.be.calledOnce;
              done();
            });
          });

        });

        describe('#detach()', function () {

          it("should remove the subscription from the channel", function (done) {
            var spy = sinon.spy();
            var subscription = publisher.subscribe('y', spy);
            subscription.detach();
            publisher.publish('y');
            async(function () {
              expect(spy).to.not.be.called;
              done();
            });
          });

        });

      });

    });

    describe('#publish()', function () {

      it("should call the handler of each subscription attached to the given channel asynchronously", function (done) {
        var arg1 = {};
        var arg2 = {};
        var called = false;
        var handler = function (x, y) {
          called = true;
          expect(x).to.equal(arg1);
          expect(y).to.equal(arg2);
          done();
        };
        publisher.subscribe('foo', handler);
        publisher.publish('foo', arg1, arg2);
        expect(called).to.be.false;
      });

    });

  });

});
