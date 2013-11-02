/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, describe, it */

define([
  'shared',
  'sulfur/util/xpath'
], function (shared, XPath) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;

  describe('sulfur/util/xpath', function () {

    function parse(s) {
      var p = new DOMParser();
      return p.parseFromString(s, 'text/xml');
    }

    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    describe('#evaluate()', function () {

      it("should evaluate the XPath expression on the document when no context node is given", function () {
        var doc = parse('<foo><bar/></foo>');
        var xpath = XPath.create(doc);
        var spy = sinon.spy(doc, 'evaluate');
        var result = xpath.evaluate('foo/bar', XPathResult.FIRST_ORDERED_NODE_TYPE);

        var call = spy.getCall(0);

        expect(call).to.exist;

        expect(call.thisValue).to.equal(doc);

        expect(call.args[0]).to.equal('foo/bar');
        expect(call.args[1]).to.equal(doc);
        expect(call.args[3]).to.equal(XPathResult.FIRST_ORDERED_NODE_TYPE);
        expect(call.args[4]).to.equal(null);

        expect(call.returnValue).to.equal(result);
      });

      it("should evaluate the XPath expression on a specific context node when given", function () {
        var doc = parse('<foo><bar/></foo>');
        var xpath = XPath.create(doc);
        var spy = sinon.spy(doc, 'evaluate');
        var result = xpath.evaluate('bar', XPathResult.FIRST_ORDERED_NODE_TYPE, doc.documentElement);

        var call = spy.getCall(0);

        expect(call).to.exist;

        expect(call.thisValue).to.equal(doc);

        expect(call.args[0]).to.equal('bar');
        expect(call.args[1]).to.equal(doc.documentElement);
        expect(call.args[3]).to.equal(XPathResult.FIRST_ORDERED_NODE_TYPE);
        expect(call.args[4]).to.equal(null);

        expect(call.returnValue).to.equal(result);
      });

      it("should use the namespaces when given", function () {
        var doc = parse('<foo xmlns:y="urn:bar"><y:bar/></foo>');
        var xpath = XPath.create(doc);
        var spy = sinon.spy(doc, 'evaluate');
        var result = xpath.evaluate('foo/x:bar', XPathResult.FIRST_ORDERED_NODE_TYPE,
          undefined, { x: 'urn:bar' });

        var call = spy.getCall(0);

        expect(call).to.exist;

        expect(call.thisValue).to.equal(doc);

        expect(call.args[0]).to.equal('foo/x:bar');
        expect(call.args[1]).to.equal(doc);
        expect(call.args[3]).to.equal(XPathResult.FIRST_ORDERED_NODE_TYPE);
        expect(call.args[4]).to.equal(null);

        expect(call.returnValue).to.equal(result);
      });

    });

    describe('#all()', function () {

      it("should return an array of nodes matching the XPath expression", function () {
        var doc = parse('<foo><bar/><baz/><bar/></foo>');
        var xpath = XPath.create(doc);
        var nodes = xpath.all('foo/bar');
        expect(nodes).to.have.lengthOf(2);
        expect(nodes[0]).to.equal(doc.documentElement.firstChild);
        expect(nodes[1]).to.equal(doc.documentElement.lastChild);
      });

      it("should use the context node when given", function () {
        var doc = parse('<foo><bar/><baz/><bar/></foo>');
        var xpath = XPath.create(doc);
        var nodes = xpath.all('bar', doc.documentElement);
        expect(nodes).to.have.lengthOf(2);
        expect(nodes[0]).to.equal(doc.documentElement.firstChild);
        expect(nodes[1]).to.equal(doc.documentElement.lastChild);
      });

      it("should use the namespaces when given", function () {
        var doc = parse('<foo xmlns:x="urn:x"><x:bar/><baz/><bar/></foo>');
        var xpath = XPath.create(doc);
        var nodes = xpath.all('x:bar', doc.documentElement, { x: 'urn:x' });
        expect(nodes).to.have.lengthOf(1);
        expect(nodes[0]).to.equal(doc.documentElement.firstChild);
      });

    });

    describe('#first()', function () {

      it("should get the first node matching the XPath expression", function () {
        var doc = parse('<foo><bar/><bar/></foo>');
        var xpath = XPath.create(doc);
        var spy = sinon.spy(xpath, 'evaluate');

        var result = xpath.first('foo/bar');

        var call = spy.getCall(0);

        expect(call).to.exist;

        expect(call.thisValue).to.equal(xpath);

        expect(call.args[0]).to.equal('foo/bar');
        expect(call.args[1]).to.equal(XPathResult.FIRST_ORDERED_NODE_TYPE);

        expect(result).to.equal(call.returnValue.singleNodeValue);
      });

      it("should use the context node when given", function () {
        var doc = parse('<foo><bar/><bar/></foo>');
        var xpath = XPath.create(doc);
        var spy = sinon.spy(xpath, 'evaluate');

        var result = xpath.first('bar', doc.documentElement);

        var call = spy.getCall(0);

        expect(call).to.exist;

        expect(call.thisValue).to.equal(xpath);

        expect(call.args[0]).to.equal('bar');
        expect(call.args[1]).to.equal(XPathResult.FIRST_ORDERED_NODE_TYPE);
        expect(call.args[2]).to.equal(doc.documentElement);

        expect(result).to.equal(call.returnValue.singleNodeValue);
      });

      it("should use the namespaces when given", function () {
        var doc = parse('<foo xmlns:x="urn:x"><x:bar/><bar/></foo>');
        var xpath = XPath.create(doc);
        var spy = sinon.spy(xpath, 'evaluate');

        var namespaces = { x: 'urn:x' };
        var result = xpath.first('x:bar', doc.documentElement, namespaces);

        var call = spy.getCall(0);

        expect(call).to.exist;

        expect(call.thisValue).to.equal(xpath);

        expect(call.args[0]).to.equal('x:bar');
        expect(call.args[1]).to.equal(XPathResult.FIRST_ORDERED_NODE_TYPE);
        expect(call.args[2]).to.equal(doc.documentElement);
        expect(call.args[3]).to.equal(namespaces);

        expect(result).to.equal(call.returnValue.singleNodeValue);
      });

    });

    describe('#count()', function () {

      it("should count the nodes matching the XPath expression", function () {
        var doc = parse('<foo><bar/></foo>');
        var xpath = XPath.create(doc);
        var spy = sinon.spy(xpath, 'evaluate');

        var result = xpath.count('foo/bar');

        var call = spy.getCall(0);

        expect(call).to.exist;

        expect(call.thisValue).to.equal(xpath);

        expect(call.args[0]).to.equal('count(foo/bar)');
        expect(call.args[1]).to.equal(XPathResult.NUMBER_TYPE);

        expect(result).to.equal(call.returnValue.numberValue);
      });

      it("should use the context node when given", function () {
        var doc = parse('<foo><bar/></foo>');
        var xpath = XPath.create(doc);
        var spy = sinon.spy(xpath, 'evaluate');

        var result = xpath.count('bar', doc.documentElement);

        var call = spy.getCall(0);

        expect(call).to.exist;

        expect(call.thisValue).to.equal(xpath);

        expect(call.args[0]).to.equal('count(bar)');
        expect(call.args[1]).to.equal(XPathResult.NUMBER_TYPE);
        expect(call.args[2]).to.equal(doc.documentElement);

        expect(result).to.equal(call.returnValue.numberValue);
      });

      it("should use the namespaces when given", function () {
        var doc = parse('<foo xmlns:x="urn:x"><x:bar/></foo>');
        var xpath = XPath.create(doc);
        var spy = sinon.spy(xpath, 'evaluate');

        var namespaces = { x: 'urn:x' };
        var result = xpath.count('x:bar', doc.documentElement, namespaces);

        var call = spy.getCall(0);

        expect(call).to.exist;

        expect(call.thisValue).to.equal(xpath);

        expect(call.args[0]).to.equal('count(x:bar)');
        expect(call.args[1]).to.equal(XPathResult.NUMBER_TYPE);
        expect(call.args[2]).to.equal(doc.documentElement);
        expect(call.args[3]).to.equal(namespaces);

        expect(result).to.equal(call.returnValue.numberValue);
      });

    });

    describe('#contains()', function () {

      it("should return true when #count() returns non-zero", function () {
        var xpath = XPath.create();
        var spy = sinon.stub(xpath, 'count').returns(1);
        var result = xpath.contains('foo/bar');

        var call = spy.getCall(0);

        expect(call).to.exist;
        expect(call.thisValue).to.equal(xpath);
        expect(call.args[0]).to.equal('foo/bar');
        expect(result).to.be.true;
      });

      it("should return false when #count() returns zero", function () {
        var xpath = XPath.create();
        var spy = sinon.stub(xpath, 'count').returns(0);
        var result = xpath.contains('foo/bar');

        var call = spy.getCall(0);

        expect(call).to.exist;
        expect(call.thisValue).to.equal(xpath);
        expect(call.args[0]).to.equal('foo/bar');
        expect(result).to.be.false;
      });

      it("should use the context node when given", function () {
        var doc = parse('<foo/>');
        var xpath = XPath.create(doc);
        var spy = sinon.spy(xpath, 'count');
        xpath.contains('foo/bar', doc.documentElement);

        var call = spy.getCall(0);

        expect(call).to.exist;
        expect(call.thisValue).to.equal(xpath);
        expect(call.args[0]).to.equal('foo/bar');
        expect(call.args[1]).to.equal(doc.documentElement);
      });

      it("should use the namespaces when given", function () {
        var doc = parse('<foo/>');
        var xpath = XPath.create(doc);
        var spy = sinon.spy(xpath, 'count');

        var namespaces = { x: 'urn:x' };
        xpath.contains('foo/x:bar', doc.documentElement, namespaces);

        var call = spy.getCall(0);

        expect(call).to.exist;
        expect(call.thisValue).to.equal(xpath);
        expect(call.args[0]).to.equal('foo/x:bar');
        expect(call.args[1]).to.equal(doc.documentElement);
        expect(call.args[2]).to.equal(namespaces);
      });

    });

  });

});
