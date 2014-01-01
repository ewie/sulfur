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
  'sulfur/ui/publisher',
  'sulfur/ui/view'
], function (shared, Publisher, View) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;
  var returns = shared.returns;

  describe('sulfur/ui/view', function () {

    var DerivedView;
    var element;
    var accessor;
    var blueprint;
    var boundEvents;

    beforeEach(function () {
      accessor = { name: 'foo', access: {} };
      element = document.createElement('div');
      boundEvents = [
        { attach: function () {},
          detach: function () {} },
        { attach: function () {},
          detach: function () {} }
      ];
      blueprint = {
        bindAccessors: returns([ accessor ]),
        bindEvents: returns(boundEvents),
        createElement: returns(element)
      };
      DerivedView = View.clone({ blueprint: blueprint });
    });

    describe('#initialize()', function () {

      it("should bind blueprint events to this view and its element", function () {
        var spy = sinon.spy(blueprint, 'bindEvents');
        var view = DerivedView.create();
        expect(spy).to.be.calledWith(
          sinon.match.same(view.element),
          sinon.match.same(view));
      });

      it("should bind blueprint accessors to this view element", function () {
        var spy = sinon.spy(blueprint, 'bindAccessors');
        var view = DerivedView.create();
        expect(spy).to.be.calledWith(sinon.match.same(view.element));
      });

      it("should wrap the view element in a document fragment before binding events", function () {
        var spy = sinon.spy(blueprint, 'bindEvents');
        DerivedView.create();
        expect(spy.getCall(0).args[0].parentNode.nodeType)
          .to.equal(Node.DOCUMENT_FRAGMENT_NODE);
      });

      it("should wrap the view element in a document fragment before binding accessors", function () {
        var spy = sinon.spy(blueprint, 'bindAccessors');
        DerivedView.create();
        expect(spy.getCall(0).args[0].parentNode.nodeType)
          .to.equal(Node.DOCUMENT_FRAGMENT_NODE);
      });

      it("should use the element's topmost parent element as view element", function () {
        var spy = sinon.stub(blueprint, 'bindAccessors', function (e) {
          var f = element.ownerDocument.createElement('div');
          var g = element.ownerDocument.createElement('div');
          e.parentNode.replaceChild(g, e);
          g.appendChild(f);
          f.appendChild(e);
          return [];
        });
        var view = DerivedView.create();
        var e = spy.getCall(0).args[0];
        expect(view.element).to.equal(e.parentElement.parentElement);
      });

    });

    describe('#publisher', function () {

      it("should be the view's publisher", function () {
        var view = DerivedView.create();
        expect(Publisher.prototype).to.be.prototypeOf(view.publisher);
      });

    });

    describe('#element', function () {

      it("should be the element created by the blueprint", function () {
        var view = DerivedView.create();
        expect(view.element).to.equal(element);
      });

    });

    describe('#detach()', function () {

      it("should detach each bound event", function () {
        var view = DerivedView.create();
        var spies = boundEvents.map(function (boundEvent) {
          return sinon.spy(boundEvent, 'detach');
        });
        view.detach();
        spies.forEach(function (spy) {
          expect(spy).to.be.called;
        });
      });

    });

    describe('#access()', function () {

      var view;

      beforeEach(function () {
        view = DerivedView.create();
      });

      it("should return the accessor with the given name when defined", function () {
        expect(view.access('foo')).to.equal(accessor.access);
      });

      it("should reject the name when no such accessor is defined", function () {
        expect(bind(view, 'access', 'xxx'))
          .to.throw('unknown accessor for "xxx"');
      });

    });

    describe('#hasParent()', function () {

      it("should return true when the element has a parent", function () {
        var view = DerivedView.create();
        var p = document.createElement('div');
        p.appendChild(view.element);
        expect(view.hasParent()).to.be.true;
      });

      it("should return false when the element has no parent", function () {
        var view = DerivedView.create();
        expect(view.hasParent()).to.be.false;
      });

      it("should return false when the parent node is a document fragment", function () {
        var view = DerivedView.create();
        var df = document.createDocumentFragment();
        df.appendChild(view.element);
        expect(view.hasParent()).to.be.false;
      });

    });

  });

});
