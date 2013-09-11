/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/validator/prototype'
], function ($shared, $prototypeValidator) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;

  describe('sulfur/schema/validator/prototype', function () {

    describe('#validate()', function () {

      it("should return #isPrototypeOf() on the prototype passing the object", function () {
        var prototype = {};
        var object = {};
        var isPrototypeOfSpy = sinon.spy(prototype, 'isPrototypeOf');
        var validator = $prototypeValidator.create(prototype);
        var result = validator.validate(object);
        expect(isPrototypeOfSpy)
          .to.be.calledOn(prototype)
          .and.to.be.calledWith(object)
          .and.to.have.returned(result);
      });

    });

  });

});
