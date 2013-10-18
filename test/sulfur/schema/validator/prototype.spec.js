/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/validator/prototype'
], function ($shared, $prototypeValidator) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;

  describe('sulfur/schema/validator/prototype', function () {

    var validator;
    var prototype;

    beforeEach(function () {
      prototype = {};
      validator = $prototypeValidator.create(prototype);
    });

    describe('#getPrototype()', function () {

      it("should return the prototype object", function () {
        expect(validator.getPrototype()).to.equal(prototype);
      });

    });

    describe('#validate()', function () {

      it("should return #isPrototypeOf() on the prototype passing the object", function () {
        var object = {};
        var isPrototypeOfSpy = sinon.spy(prototype, 'isPrototypeOf');
        var result = validator.validate(object);
        expect(isPrototypeOfSpy)
          .to.be.calledOn(prototype)
          .to.be.calledWith(object)
          .to.have.returned(result);
      });

    });

  });

});
