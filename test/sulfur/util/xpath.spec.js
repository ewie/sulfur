/* global define */
/* global beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/util/xpath'
], function (shared, XPath) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var returns = shared.returns;

  describe('sulfur/util/xpath', function () {

    function parse(s) {
      var p = new DOMParser();
      return p.parseFromString(s, 'text/xml');
    }

    describe('#evaluate()', function () {

      it("should evaluate the XPath expression on the initial context node when no context node is given", function () {
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
        var result = xpath.evaluate('bar', XPathResult.FIRST_ORDERED_NODE_TYPE,
          doc.documentElement);

        var call = spy.getCall(0);

        expect(call).to.exist;

        expect(call.thisValue).to.equal(doc);

        expect(call.args[0]).to.equal('bar');
        expect(call.args[1]).to.equal(doc.documentElement);
        expect(call.args[3]).to.equal(XPathResult.FIRST_ORDERED_NODE_TYPE);
        expect(call.args[4]).to.equal(null);

        expect(call.returnValue).to.equal(result);
      });

      context("with namespaces", function () {

        it("should use a function when given", function () {
          var doc = parse('<foo xmlns:y="urn:bar"><y:bar/></foo>');
          var xpath = XPath.create(doc);
          var spy = sinon.spy(doc, 'evaluate');
          var namespaces = returns('urn:bar');
          var result = xpath.evaluate('foo/x:bar',
            XPathResult.FIRST_ORDERED_NODE_TYPE, undefined, namespaces);

          var call = spy.getCall(0);

          expect(call).to.exist;

          expect(call.thisValue).to.equal(doc);

          expect(call.args[0]).to.equal('foo/x:bar');
          expect(call.args[1]).to.equal(doc);
          expect(call.args[2]).to.equal(namespaces);
          expect(call.args[3]).to.equal(XPathResult.FIRST_ORDERED_NODE_TYPE);
          expect(call.args[4]).to.equal(null);

          expect(call.returnValue).to.equal(result);
        });

        context("with an object", function () {

          it("should use a function wrapping the namespace object", function () {
            var doc = parse('<foo xmlns:y="urn:bar"><y:bar/></foo>');
            var xpath = XPath.create(doc);
            var spy = sinon.spy(doc, 'evaluate');
            var result = xpath.evaluate('foo/x:bar',
              XPathResult.FIRST_ORDERED_NODE_TYPE, undefined, { x: 'urn:bar' });

            var call = spy.getCall(0);

            expect(call).to.exist;

            expect(call.thisValue).to.equal(doc);

            expect(call.args[0]).to.equal('foo/x:bar');
            expect(call.args[1]).to.equal(doc);
            expect(call.args[3]).to.equal(XPathResult.FIRST_ORDERED_NODE_TYPE);
            expect(call.args[4]).to.equal(null);

            expect(call.returnValue).to.equal(result);
          });

          describe("the used function", function () {

            var doc;
            var xpath;

            beforeEach(function () {
              doc = parse('<foo xmlns:y="urn:bar"><y:bar/></foo>');
              xpath = XPath.create(doc);
            });

            it("should expose own properties", function () {
              var spy = sinon.spy(doc, 'evaluate');
              xpath.evaluate('foo/x:bar',
                XPathResult.FIRST_ORDERED_NODE_TYPE, undefined, { x: 'urn:bar' });

              var call = spy.getCall(0);
              var fn = call.args[2];

              expect(fn('x')).to.equal('urn:bar');
            });

            it("should ignore inherited properties", function () {
              var spy = sinon.spy(doc, 'evaluate');
              xpath.evaluate('foo/x:bar',
                XPathResult.FIRST_ORDERED_NODE_TYPE, undefined,
                Object.create({ y: 'urn:foo' }, { x: { value: 'urn:bar' } }));

              var call = spy.getCall(0);
              var fn = call.args[2];

              expect(fn('y')).to.be.null;
            });

            it("should return null when a property is not defined", function () {
              var spy = sinon.spy(doc, 'evaluate');
              xpath.evaluate('foo/x:bar',
                XPathResult.FIRST_ORDERED_NODE_TYPE, undefined,
                Object.create(null, { x: { value: 'urn:bar' } }));

              var call = spy.getCall(0);
              var fn = call.args[2];

              expect(fn('xxx')).to.be.null;
            });

            it("should return null when a property value is falsy", function () {
              var spy = sinon.spy(doc, 'evaluate');
              xpath.evaluate('foo/x:bar',
                XPathResult.FIRST_ORDERED_NODE_TYPE, undefined,
                Object.create(null, {
                  x: { value: 'urn:bar' },
                  y: { value: '' }
                }));

              var call = spy.getCall(0);
              var fn = call.args[2];

              expect(fn('y')).to.be.null;
            });

          });

        });

      });

    });

    describe('#all()', function () {

      var xpath;
      var snapshot;

      beforeEach(function () {
        xpath = XPath.create();
        var array = [ {}, {}, {} ];
        snapshot = {
          snapshotLength: array.length,
          snapshotItem: function (i) {
            return array[i];
          }
        };
      });

      it("should call #evaluate() with the given expression, context node and namespaces", function () {
        var spy = sinon.stub(xpath, 'evaluate').returns(snapshot);
        var expr = {};
        var contextNode = {};
        var namespaces = {};
        xpath.all(expr, contextNode, namespaces);
        expect(spy).to.be.calledWith(
          sinon.match.same(expr),
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          sinon.match.same(contextNode),
          sinon.match.same(namespaces));
      });

      it("should convert the node snapshot to an array", function () {
        xpath.evaluate = returns(snapshot);
        var result = xpath.all();
        expect(result).to.have.lengthOf(snapshot.snapshotLength);
        result.forEach(function (r, i) {
          expect(r).to.equal(snapshot.snapshotItem(i));
        });
      });

    });

    describe('#first()', function () {

      var xpath;

      beforeEach(function () {
        xpath = XPath.create();
      });

      it("should call #evaluate() with the given expression, context node and namespaces", function () {
        var spy = sinon.stub(xpath, 'evaluate').returns({});
        var expr = {};
        var contextNode = {};
        var namespaces = {};
        xpath.first(expr, contextNode, namespaces);
        expect(spy).to.be.calledWith(
          sinon.match.same(expr),
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          sinon.match.same(contextNode),
          sinon.match.same(namespaces));
      });

      it("should return the node", function () {
        var node = {};
        xpath.evaluate = returns({ singleNodeValue: node });
        var result = xpath.first();
        expect(result).to.equal(node);
      });

    });

    describe('#count()', function () {

      var xpath;

      beforeEach(function () {
        xpath = XPath.create();
      });

      it("should call #evaluate() with the given count(expression), context node and namespaces", function () {
        var spy = sinon.stub(xpath, 'evaluate').returns({});
        var expr = 'foo';
        var contextNode = {};
        var namespaces = {};
        xpath.count(expr, contextNode, namespaces);
        expect(spy).to.be.calledWith(
          'count(foo)',
          XPathResult.NUMBER_TYPE,
          sinon.match.same(contextNode),
          sinon.match.same(namespaces));
      });

      it("should return the number value", function () {
        var value = {};
        xpath.evaluate = returns({ numberValue: value });
        var result = xpath.count();
        expect(result).to.equal(value);
      });

    });

    describe('#contains()', function () {

      var xpath;

      beforeEach(function () {
        xpath = XPath.create();
      });

      it("should call #count() with the given expression, context node and namespaces", function () {
        var spy = sinon.stub(xpath, 'count');
        var expr = {};
        var contextNode = {};
        var namespaces = {};
        xpath.contains(expr, contextNode, namespaces);
        expect(spy).to.be.calledWith(
          sinon.match.same(expr),
          sinon.match.same(contextNode),
          sinon.match.same(namespaces));
      });

      it("should return true when #count() returns non-zero", function () {
        xpath.count = returns(1);
        expect(xpath.contains()).to.be.true;
      });

      it("should return false when #count() returns zero", function () {
        xpath.count = returns(0);
        expect(xpath.contains()).to.be.false;
      });

    });

  });

});
