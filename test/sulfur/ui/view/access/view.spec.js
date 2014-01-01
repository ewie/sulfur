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
  'sulfur/ui/view/access/view'
], function (shared, ViewAccess) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var descriptor = shared.descriptor;
  var returns = shared.returns;

  describe('sulfur/ui/access/view', function () {

    function mockView(element, hasParent) {
      return {
        element: element,
        hasParent: returns(hasParent || false)
      };
    }

    describe('#view', function () {

      it("should return the view when set", function () {
        var element = { appendChild: function () {} };
        var access = ViewAccess.create(element);
        var view = mockView();
        access.view = view;
        expect(access.view).to.equal(view);
      });

      it("should return undefined when no view is set", function () {
        var access = ViewAccess.create();
        expect(access.view).to.be.undefined;
      });

    });

    describe('#view=', function () {

      var element;
      var view;
      var access;

      beforeEach(function () {
        element = {
          appendChild: function () {},
          replaceChild: function () {}
        };
        view = mockView({});
        access = ViewAccess.create(element);
      });

      it("should ignore when it's the current view", function () {
        access.view = view;
        var setter = descriptor(ViewAccess.prototype, 'view').set;
        expect(setter.bind(access, view)).to.not.throw();
      });

      it("should append the view element when there is no existing view", function () {
        var spy = sinon.spy(element, 'appendChild');
        access.view = view;
        expect(spy).to.be.calledWith(sinon.match.same(view.element));
      });

      it("should replace the current view element with the new view element", function () {
        var oldView = mockView({});
        access.view = oldView;
        var spy = sinon.spy(element, 'replaceChild');
        access.view = view;
        expect(spy)
          .to.be.calledWith(
            sinon.match.same(view.element),
            sinon.match.same(oldView.element));
      });

      it("should set the view", function () {
        access.view = view;
        expect(access.view).to.equal(view);
      });

      it("should reject a view which has a parent", function () {
        var view = mockView(undefined, true);
        var setter = descriptor(ViewAccess.prototype, 'view').set;
        expect(setter.bind(access, view))
          .to.throw("expecting a view without parent");
      });

    });

    describe('#remove()', function () {

      var element;
      var view;
      var access;

      beforeEach(function () {
        element = {
          appendChild: function () {},
          removeChild: function () {}
        };
        view = mockView({});
        access = ViewAccess.create(element);
        access.view = view;
      });

      it("should remove the view element", function () {
        var spy = sinon.spy(element, 'removeChild');
        access.remove();
        expect(spy)
          .to.be.calledWith(sinon.match.same(view.element));
      });

      it("should set the view to undefined", function () {
        access.remove();
        expect(access.view).to.be.undefined;
      });

    });

  });

});
