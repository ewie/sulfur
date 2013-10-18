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
], function ($shared, $schema, $elements) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;
  var returns = $shared.returns;

  describe('sulfur/schema', function () {

    var name;
    var elements;
    var schema;

    beforeEach(function () {
      name = 'bar';
      elements = $elements.create([
        { getName: returns('name') }
      ]);
      schema = $schema.create(name, elements);
    });

    describe('#initialize()', function () {

      it("should reject an empty name", function () {
        expect(bind($schema, 'create', ''))
          .to.throw("schema name must not be empty");
      });

    });

    describe('#getName()', function () {

      it("should return the schema name", function () {
        expect(schema.getName()).to.equal(name);
      });

    });

    describe('#getElements()', function () {

      it("should return the element collection", function () {
        expect(schema.getElements()).to.equal(elements);
      });

    });

  });

});
