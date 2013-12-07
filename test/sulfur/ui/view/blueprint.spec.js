/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/ui/view/blueprint'
], function (shared, Blueprint) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;

  describe('sulfur/ui/view/blueprint', function () {

    describe('#initialize()', function () {

      it("should default to an empty array when no events are given", function () {
        var blueprint = Blueprint.create({ html: '' });
        var view = {};
        expect(blueprint.bindEvents(view)).to.have.lengthOf(0);
      });

      it("should default to an empty array when no accessors are given", function () {
        var blueprint = Blueprint.create({ html: '' });
        var view = {};
        expect(blueprint.bindAccessors(view)).to.have.lengthOf(0);
      });

    });

    describe('#createElement()', function () {

      it("should return the element created from the HTML", function () {
        var html = '<div><span></span></div>';
        var blueprint = Blueprint.create({ html: html });
        var h = document.createElement('div');
        h.innerHTML = html;
        var e = blueprint.createElement();
        expect(h.firstChild.isEqualNode(e)).to.be.true;
      });

      it("should resolve placeholder IDs", function () {
        var html = '<div id="{{id:1}}"><span ref="{{id:1}}" id="{{id:2}}"></span></div>';
        var blueprint = Blueprint.create({ html: html });
        var e = blueprint.createElement();
        var f = e.firstChild;
        expect(e.attributes.id.value).to.equal(f.attributes.ref.value);
        expect(e.attributes.id.value).to.not.equal(f.attributes.id.value);
      });

      it("should remove unprotected whitespace between > and <", function () {
        var html = '<div>  <span>  </span>  </div>';
        var blueprint = Blueprint.create({ html: html });
        var e = blueprint.createElement();
        expect(e.firstChild).to.equal(e.lastChild);
        expect(e.firstChild.textContent).to.be.empty;
      });

      it("should reject html containing more than one element", function () {
        var html = '<div></div><div></div>';
        var blueprint = Blueprint.create({ html: html });
        expect(bind(blueprint, 'createElement'))
          .to.throw("expecting HTML specifying only a single element");
      });

    });

    describe('#bindEvents()', function () {

      it("should return an array of events bound to the given context", function () {
        var events = [
          { bind: sinon.stub().returns({}) },
          { bind: sinon.stub().returns({}) }
        ];
        var blueprint = Blueprint.create({ html: '', events: events });
        var element = {};
        var view = {};
        var boundEvents = blueprint.bindEvents(element, view);
        boundEvents.forEach(function (boundEvent, i) {
          expect(events[i].bind)
            .to.be.calledWith(
              sinon.match.same(element),
              sinon.match.same(view))
            .to.have.returned(sinon.match.same(boundEvent));
        });
      });

    });

    describe('#bindAccessors()', function () {

      it("should return an array of accessors bound to the given context", function () {
        var accessors = [
          { bind: sinon.stub().returns({}) },
          { bind: sinon.stub().returns({}) }
        ];
        var blueprint = Blueprint.create({ html: '', accessors: accessors });
        var element = {};
        var boundAccessors = blueprint.bindAccessors(element);
        boundAccessors.forEach(function (boundAccessor, i) {
          expect(accessors[i].bind)
            .to.be.calledWith(sinon.match.same(element))
            .to.have.returned(sinon.match.same(boundAccessor));
        });
      });

    });

  });

});
