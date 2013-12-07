/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, describe, it */

define([
  'shared',
  'sulfur/ui/view/event/published'
], function (shared, PublishedEvent) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;

  describe('sulfur/ui/event/published', function () {

    describe('#bind()', function () {

      describe("the returned function", function () {

        var fn;
        var channel;
        var view;
        var ev;

        beforeEach(function () {
          channel = 'foo';
          view = {
            publisher: { publish: function () {} }
          };
          ev = { preventDefault: function() {} };
          var e = PublishedEvent.create(channel);
          fn = e.bind(view);
        });

        it("should publish on the channel", function () {
          var spy = sinon.spy(view.publisher, 'publish');
          fn(ev);
          expect(spy).to.be.calledWith('foo');
        });

        it("should call .preventDefault() on the received event object", function () {
          var spy = sinon.spy(ev, 'preventDefault');
          fn(ev);
          expect(spy).to.be.called;
        });

      });

    });

  });

});
