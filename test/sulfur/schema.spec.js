/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema',
  'sulfur/schema/elements'
], function (shared, Schema, Elements) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema', function () {

    var qname;
    var elements;
    var schema;

    beforeEach(function () {
      qname = {};
      elements = Elements.create([ { name: 'name' } ]);
      schema = Schema.create(qname, elements);
    });

    describe('#qname', function () {

      it("should return the qualified name", function () {
        expect(schema.qname).to.equal(qname);
      });

    });

    describe('#elements', function () {

      it("should return the element collection", function () {
        expect(schema.elements).to.equal(elements);
      });

    });

  });

});
