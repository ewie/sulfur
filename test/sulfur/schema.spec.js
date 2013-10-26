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
  var bind = shared.bind;

  describe('sulfur/schema', function () {

    var name;
    var elements;
    var schema;

    beforeEach(function () {
      name = 'bar';
      elements = Elements.create([ { name: 'name' } ]);
      schema = Schema.create(name, elements);
    });

    describe('#initialize()', function () {

      it("should reject an empty name", function () {
        expect(bind(Schema, 'create', ''))
          .to.throw("schema name must not be empty");
      });

    });

    describe('#name', function () {

      it("should return the schema name", function () {
        expect(schema.name).to.equal(name);
      });

    });

    describe('#elements', function () {

      it("should return the element collection", function () {
        expect(schema.elements).to.equal(elements);
      });

    });

  });

});
