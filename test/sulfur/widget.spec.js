/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/widget'
], function (shared, Widget) {

  'use strict';

  var expect = shared.expect;
  var bind = shared.bind;

  describe('sulfur/widget', function () {

    describe('#initialize()', function () {

      it("should reject an empty name", function () {
        expect(bind(Widget, 'create', ''))
          .to.throw("expecting a non-empty name");
      });

    });

    describe('#name', function () {

      it("should return the widget name", function () {
        var w = Widget.create('foo');
        expect(w.name).to.equal('foo');
      });

    });

    describe('#resource', function () {

      it("should return the resource", function () {
        var resource = {};
        var w = Widget.create('foo', resource);
        expect(w.resource).to.equal(resource);
      });

    });

    describe('#icon', function () {

      it("should return the icon when defined", function () {
        var icon = {};
        var w = Widget.create('foo', {}, { icon: icon });
        expect(w.icon).to.equal(icon);
      });

      it("should return undefined when not defined", function () {
        var w = Widget.create('foo');
        expect(w.icon).to.be.undefined;
      });

    });

    describe('#description', function () {

      it("should return the widget description when defined", function () {
        var w = Widget.create('foo', {}, { description: 'blah' });
        expect(w.description).to.equal('blah');
      });

      it("should return undefined when not defined", function () {
        var w = Widget.create('foo');
        expect(w.description).to.be.undefined;
      });

    });

    describe('#authorName', function () {

      it("should return the widget author's name when defined", function () {
        var w = Widget.create('foo', {}, { authorName: 'xyz' });
        expect(w.authorName).to.equal('xyz');
      });

      it("should return undefined when not defined", function () {
        var w = Widget.create('foo');
        expect(w.authorName).to.be.undefined;
      });

    });


    describe('#authorEmail', function () {

      it("should return the widget author's email address when defined", function () {
        var w = Widget.create('foo', {}, { authorEmail: 'x@y.z' });
        expect(w.authorEmail).to.equal('x@y.z');
      });

      it("should return undefined when not defined", function () {
        var w = Widget.create('foo');
        expect(w.authorEmail).to.be.undefined;
      });

    });

  });

});
