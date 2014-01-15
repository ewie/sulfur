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
  'sulfur/ui/collection',
  'sulfur/ui/publisher'
], function (shared, Collection, Publisher) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var async = shared.async;
  var bind = shared.bind;
  var returns = shared.returns;

  describe('sulfur/ui/collection', function () {

    describe('#initialize()', function () {

      it("should add each given item", function () {
        var items = [ {}, {} ];
        var c = Collection.create(items);
        items.forEach(function (item, i) {
          expect(c.indexOf(item)).to.equal(i);
        });
      });

    });

    describe('#publisher', function () {

      it("should return the publisher", function () {
        var c = Collection.create();
        expect(Publisher.prototype).to.be.prototypeOf(c.publisher);
      });

    });

    describe('#size', function () {

      it("should return the number of items", function () {
        var c = Collection.create();
        expect(c.size).to.equal(0);
      });

    });

    describe('#items', function () {

      it("should return an array containing all items", function () {
        var items = [ {}, {} ];
        var c = Collection.create(items);
        var _items = c.items;
        expect(_items).to.have.lengthOf(2);
        _items.forEach(function (item, i) {
          expect(item).to.equal(items[i]);
        });
      });

      it("should prevent modifications to the internal items array", function () {
        var c = Collection.create();
        var _items = c.items;
        _items.push({});
        expect(c.size).to.equal(0);
      });

    });

    describe('#isValid()', function () {

      function mockModel(isValid) {
        return {
          isValid: returns(isValid),
          publisher: Publisher.create()
        };
      }

      var collection;

      beforeEach(function () {
        collection = Collection.create();
      });

      it("should return true when empty", function () {
        expect(collection.isValid()).to.be.true;
      });

      it("should return true if any item is valid", function () {
        var item = mockModel(true);
        collection.add(item);
        expect(collection.isValid()).to.be.true;
      });

      it("should return true if any item is not valid", function () {
        var item = mockModel(false);
        collection.add(item);
        expect(collection.isValid()).to.be.false;
      });

      it("should ignore items not responding to .isValid()", function () {
        var item = { publisher: Publisher.create() };
        collection.add(item);
        expect(collection.isValid()).to.be.true;
      });

    });

    describe('#item()', function () {

      it("should return the item at the given index", function () {
        var item = {};
        var c = Collection.create();
        c.add(item);
        expect(c.item(0)).to.equal(item);
      });

      it("should reject an index less than zero", function () {
        var c = Collection.create();
        expect(bind(c, 'item', -1))
          .to.throw("index out of bounds");
      });

      it("should reject an index greater than (size-1)", function () {
        var c = Collection.create();
        expect(bind(c, 'item', 0))
          .to.throw("index out of bounds");
      });

    });

    describe('#contains()', function () {

      it("should return true when #indexOf() returns non-negative", function () {
        var c = Collection.create();
        var spy = sinon.stub(c, 'indexOf').returns(0);
        var item = {};
        expect(c.contains(item)).to.be.true;
        expect(spy).to.be.calledWith(sinon.match.same(item));
      });

      it("should return false when #indexOf() returns negative", function () {
        var c = Collection.create();
        var spy = sinon.stub(c, 'indexOf').returns(-1);
        var item = {};
        expect(c.contains(item)).to.be.false;
        expect(spy).to.be.calledWith(sinon.match.same(item));
      });

    });

    describe('#indexOf()', function () {

      it("should return -1 when the given item is not present", function () {
        var c = Collection.create();
        expect(c.indexOf({})).to.equal(-1);
      });

      it("should return the zero-based index of the item when present", function () {
        var c = Collection.create();
        var item = { publisher: Publisher.create() };
        c.add(item);
        expect(c.indexOf(item)).to.equal(0);
      });

    });

    describe('#add()', function () {

      var collection;
      var item;

      beforeEach(function () {
        collection = Collection.create();
        item = {};
      });

      context("when the collection contains the item", function () {

        beforeEach(function () {
          collection.add(item);
        });

        it("should not alter the collection", function () {
          collection.add(item);
          expect(collection.size).to.equal(1);
        });

        it("should not publish", function () {
          var spy = sinon.spy(collection.publisher, 'publish');
          collection.add(item);
          expect(spy).to.not.be.called;
        });

        it("should return false", function () {
          expect(collection.add(item)).to.be.false;
        });

      });

      context("when the collection does not contain the item", function () {

        it("should add the item", function () {
          collection.add(item);
          expect(collection.indexOf(item)).to.equal(0);
        });

        it("should return true", function () {
          expect(collection.add(item)).to.be.true;
        });

        it("should publish on channel 'add'", function () {
          var spy = sinon.spy(collection.publisher, 'publish');
          collection.add(item);
          expect(spy).to.be.calledWith(
            'add',
            sinon.match.same(collection),
            sinon.match.same(item));
        });

        it("should publish on channel 'change'", function () {
          var spy = sinon.spy(collection.publisher, 'publish');
          collection.add(item);
          expect(spy).to.be.calledWith(
            'change',
            sinon.match.same(collection));
        });

        context("when the item has a publisher", function () {

          beforeEach(function () {
            item.publisher = Publisher.create();
          });

          it("should publish on channel 'change' when the item publishes on channel 'change'", function (done) {
            collection.add(item);
            collection.publisher.publish = function (channel) {
              expect(channel).to.equal('change');
              done();
            };
            item.publisher.publish('change');
          });

          it("should remove the item when it publishes on channel 'destroy'", function (done) {
            collection.add(item);
            var spy = sinon.spy(collection, 'remove');
            item.publisher.publish('destroy');
            async(function () {
              expect(spy).to.be.calledWith(sinon.match.same(item));
              done();
            });
          });

        });

      });

    });

    describe('#remove()', function () {

      var collection;
      var item;

      beforeEach(function () {
        collection = Collection.create();
        item = {};
      });

      context("when the collection does not contain the item", function () {

        beforeEach(function () {
          collection.add({});
        });

        it("should not alter the collection", function () {
          collection.remove(item);
          expect(collection.size).to.equal(1);
        });

        it("should not publish", function () {
          var spy = sinon.spy(collection.publisher, 'publish');
          collection.remove(item);
          expect(spy).to.not.be.called;
        });

        it("should return false", function () {
          expect(collection.remove(item)).to.be.false;
        });

      });

      context("when the collection contains the item", function () {

        beforeEach(function () {
          item.publisher = Publisher.create();
          collection.add(item);
        });

        it("should return true", function () {
          expect(collection.remove(item)).to.be.true;
        });

        it("should remove the item", function () {
          collection.remove(item);
          expect(collection.contains(item)).to.be.false;
        });

        it("should unsubscribe from the item's publisher", function (done) {
          collection.remove(item);
          var spy = sinon.spy(collection.publisher, 'publish');
          item.publisher.publish('change');
          async(function() {
            expect(spy).to.not.be.called;
            done();
          });
        });

        it("should publish on chanel 'remove'", function () {
          var spy = sinon.spy(collection.publisher, 'publish');
          collection.remove(item);
          expect(spy).to.be.calledWith(
            'remove',
            sinon.match.same(collection),
            sinon.match.same(item));
        });

        it("should publish on chanel 'change'", function () {
          var spy = sinon.spy(collection.publisher, 'publish');
          collection.remove(item);
          expect(spy).to.be.calledWith(
            'change',
            sinon.match.same(collection));
        });

      });

    });

    describe('#destroy()', function () {

      it("should publish on channel 'destroy'", function () {
        var collection = Collection.create();
        var spy = sinon.spy(collection.publisher, 'publish');
        collection.destroy();
        expect(spy).to.be.calledWith(
          'destroy',
          sinon.match.same(collection));
      });

      it("should remove each item", function () {
        var items = [ {}, {} ];
        var collection = Collection.create(items);
        var spy = sinon.spy(collection, 'remove');
        collection.destroy();
        items.forEach(function (item, i) {
          expect(spy.getCall(i)).to.be.calledWith(sinon.match.same(item));
        });
      });

    });

  });

});
