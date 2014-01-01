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
  'sulfur/ui/view/access/views'
], function (shared, ViewsAccess) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;
  var returns = shared.returns;

  describe('sulfur/ui/access/views', function () {

    function mockView(element, hasParent) {
      return {
        element: element || {},
        hasParent: returns(hasParent || false)
      };
    }

    describe('#contains()', function () {

      it("should return false when it does not contain the view", function () {
        var access = ViewsAccess.create();
        expect(access.contains({})).to.be.false;
      });

      it("should return true when it contains the view", function () {
        var element = { appendChild: function () {} };
        var access = ViewsAccess.create(element);
        var view = mockView();
        access.append(view);
        expect(access.contains(view)).to.be.true;
      });

    });

    describe('#clear()', function () {

      var element;
      var access;
      var views;

      beforeEach(function () {
        element = {
          _children: [],
          appendChild: function (e) { this._children.push(e) },
          removeChild: function (e) {
            var p = this._children.indexOf(e);
            p > -1 && this._children.splice(p, 1);
          },
          get firstElementChild() { return this._children[0] }
        };
        access = ViewsAccess.create(element);
        views = [0, 0].map(function () {
          var v = mockView();
          access.append(v);
          return v;
        });
      });

      it("should remove all views", function () {
        access.clear();
        views.forEach(function (v) {
          expect(access.contains(v)).to.be.false;
        });
      });

      it("should remove all view elements", function () {
        var spy = sinon.spy(element, 'removeChild');
        access.clear();
        expect(spy).to.be.calledTwice;
        views.forEach(function (v, i) {
          expect(spy.getCall(i)).to.be.calledWith(sinon.match.same(v.element));
        });
      });

    });

    describe('#remove()', function () {

      var element;
      var access;
      var view;

      beforeEach(function () {
        element = {
          appendChild: function () {},
          removeChild: function () {}
        };
        access = ViewsAccess.create(element);
        view = mockView();
        access.append(view);
      });

      it("should remove the view", function () {
        access.remove(view);
        expect(access.contains(view)).to.be.false;
      });

      it("should remove the view element", function () {
        var spy = sinon.spy(element, 'removeChild');
        access.remove(view);
        expect(spy).to.be.calledWith(sinon.match.same(view.element));
      });

    });

    describe('#prepend()', function () {

      it("should insert the view element before the very first view element already present", function () {
        var element = {
          insertBefore: sinon.spy(),
          firstElementChild: {}
        };
        var access = ViewsAccess.create(element);
        var view = mockView({});
        access.prepend(view);
        expect(element.insertBefore)
          .to.be.calledWith(
            sinon.match.same(view.element),
            sinon.match.same(element.firstElementChild));
      });

      it("should reject when it contains the given view", function () {
        var element = { insertBefore: function () {} };
        var access = ViewsAccess.create(element);
        var view = mockView();
        access.prepend(view);
        expect(bind(access, 'prepend', view))
          .to.throw("already contains the given view");
      });

      it("should reject a view which has a parent", function () {
        var access = ViewsAccess.create();
        var view = mockView(undefined, true);
        expect(bind(access, 'append', view))
          .to.throw("expecting a view with no parent");
      });

    });

    describe('#append()', function () {

      it("should insert the view element after the very last view element already present", function () {
        var element = { appendChild: sinon.spy() };
        var access = ViewsAccess.create(element);
        var view = mockView({});
        access.append(view);
        expect(element.appendChild).to.be.calledWith(sinon.match.same(view.element));
      });

      it("should reject when it contains the given view", function () {
        var element = { appendChild: function () {} };
        var access = ViewsAccess.create(element);
        var view = mockView();
        access.append(view);
        expect(bind(access, 'append', view))
          .to.throw("already contains the given view");
      });

      it("should reject a view which has a parent", function () {
        var access = ViewsAccess.create();
        var view = mockView(undefined, true);
        expect(bind(access, 'append', view))
          .to.throw("expecting a view with no parent");
      });

    });

    describe('#before()', function () {

      it("should insert the view element before the reference view element", function () {
        var element = { appendChild: sinon.spy() };
        var access = ViewsAccess.create(element);
        var view = mockView({});
        var ref = mockView({ insertBefore: sinon.spy() });
        access.append(ref);
        access.before(view, ref);
        expect(ref.element.insertBefore)
          .to.be.calledWith(
            sinon.match.same(view.element),
            sinon.match.same(ref.element));
      });

      it("should reject when it does not contain the reference view", function () {
        var element = { appendChild: sinon.spy() };
        var access = ViewsAccess.create(element);
        var view = mockView();
        var ref = mockView();
        expect(bind(access, 'before', view, ref))
          .to.throw("expecting a present view as reference");
      });

      it("should reject when it contains the given view", function () {
        var element = { appendChild: function () {} };
        var access = ViewsAccess.create(element);
        var view = mockView();
        access.append(view);
        expect(bind(access, 'before', view))
          .to.throw("already contains the given view");
      });

      it("should reject a view which has a parent", function () {
        var access = ViewsAccess.create();
        var view = mockView(undefined, true);
        expect(bind(access, 'before', view))
          .to.throw("expecting a view with no parent");
      });

    });

    describe('#after()', function () {

      it("should insert the view element after the reference view element", function () {
        var element = { appendChild: sinon.spy() };
        var access = ViewsAccess.create(element);
        var view = mockView({});
        var ref = mockView({
          insertBefore: sinon.spy(),
          nextSibling: {}
        });
        access.append(ref);
        access.after(view, ref);
        expect(ref.element.insertBefore)
          .to.be.calledWith(
            sinon.match.same(view.element),
            sinon.match.same(ref.element.nextSibling));
      });

      it("should reject when it does not contain the reference view", function () {
        var element = { appendChild: sinon.spy() };
        var access = ViewsAccess.create(element);
        var view = mockView();
        var ref = mockView();
        expect(bind(access, 'after', view, ref))
          .to.throw("expecting a present view as reference");
      });

      it("should reject when it contains the given view", function () {
        var element = { appendChild: function () {} };
        var access = ViewsAccess.create(element);
        var view = mockView();
        access.append(view);
        expect(bind(access, 'after', view))
          .to.throw("already contains the given view");
      });

      it("should reject a view which has a parent", function () {
        var access = ViewsAccess.create();
        var view = mockView(undefined, true);
        expect(bind(access, 'after', view))
          .to.throw("expecting a view with no parent");
      });

    });

  });

});
