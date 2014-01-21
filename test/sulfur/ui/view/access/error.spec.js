/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/ui/view/access/error'
], function (shared, ErrorAccess) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;

  describe('sulfur/ui/view/access/error', function () {

    describe('#initialize()', function () {

      it("should use the first ancestor element with class 'errorable' when existent", function () {
        var parentElement = document.createElement('div');
        var element = document.createElement('div');
        parentElement.appendChild(element);
        parentElement.className = 'errorable';
        var access = ErrorAccess.create(element);
        access.error = "foo";
        expect(parentElement.attributes['data-error-message'].value).to.equal("foo");
      });

      context("when the element has no ancestor with class 'errorable'", function () {

        it("should wrap the given element in a div.errorable when the element's attribute @data-errorable is not defined", function () {
          var parentElement = document.createElement('div');
          var element = document.createElement('div');
          parentElement.appendChild(element);
          ErrorAccess.create(element);
          var p = element.parentElement;
          expect(p.parentElement).to.equal(parentElement);
          expect(p.tagName).to.equal('DIV');
          expect(p.className).to.equal('errorable');
        });

        it("should wrap the given element in a div.errorable when the element's attribute @data-errorable is 'true'", function () {
          var parentElement = document.createElement('div');
          var element = document.createElement('div');
          element.setAttribute('data-errorable', 'true');
          parentElement.appendChild(element);
          ErrorAccess.create(element);
          var p = element.parentElement;
          expect(p.parentElement).to.equal(parentElement);
          expect(p.tagName).to.equal('DIV');
          expect(p.className).to.equal('errorable');
        });

        it("should not wrap the given element in a div.errorable when the element's attribute @data-errorable is 'false'", function () {
          var parentElement = document.createElement('div');
          var element = document.createElement('div');
          element.setAttribute('data-errorable', 'false');
          parentElement.appendChild(element);
          ErrorAccess.create(element);
          var p = element.parentElement;
          expect(p).to.equal(parentElement);
        });

      });

    });

    describe('#error', function () {

      var element;

      beforeEach(function () {
        element = document.createElement('div');
      });

      it("should return undefined when the element is not errorable", function () {
        element.setAttribute('data-errorable', 'false');
        var access = ErrorAccess.create(element);
        expect(access.error).to.be.undefined;
      });

      context("when the element is errorable", function () {

        var access;

        beforeEach(function () {
          var parentElement = document.createElement('div');
          parentElement.appendChild(element);
          access = ErrorAccess.create(element);
        });

        it("should return the message when set", function () {
          access.error = 'foo';
          expect(access.error).to.equal('foo');
        });

        it("should return undefined when no message is set", function () {
          expect(access.error).to.be.undefined;
        });

      });

    });

    describe('#error=', function () {

      var element;

      beforeEach(function () {
        element = document.createElement('div');
      });

      it("should not set the message when the element is not errorable", function () {
        element.setAttribute('data-errorable', 'false');
        var access = ErrorAccess.create(element);
        access.error = 'foo';
        expect(element.hasAttribute('data-error-message')).to.be.false;
      });

      context("when the element is errorable", function () {

        var access;
        var parentElement;

        beforeEach(function () {
          parentElement = document.createElement('div');
          parentElement.appendChild(element);
          access = ErrorAccess.create(element);
        });

        context("when truthy", function () {

          it("should set the message when the error is a string", function () {
            access.error = 'bar';
            expect(element.parentElement.getAttribute('data-error-message')).to.equal('bar');
          });

          it("should remove the message when the error is not a string", function () {
            access.error = true;
            expect(element.parentElement.hasAttribute('data-error-message')).to.be.false;
          });

          it("should add class 'error' to the parent element", function () {
            var spy = sinon.spy(element.parentElement.classList, 'add');
            access.error = 'bar';
            expect(spy).to.be.calledWith('error');
          });

        });

        context("when falsy", function () {

          it("should clear the message", function () {
            access.error = false;
            expect(element.parentElement.hasAttribute('data-error-message')).to.be.false;
          });

          it("should remove class 'error' from the parent element", function () {
            var spy = sinon.spy(element.parentElement.classList, 'remove');
            access.error = false;
            expect(spy).to.be.calledWith('error');
          });

        });

      });

    });

  });

});
