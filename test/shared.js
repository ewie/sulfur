/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'chai',
  'chai-changes',
  'chai-things',
  'sinon-chai',
  'sinon'
], function (chai, chaiChanges, chaiThings, sinonChai, sinon) {

  'use strict';

  var expect = chai.expect;

  chai.use(chaiChanges);
  chai.use(chaiThings);
  chai.use(sinonChai);

  chai.use(function (chai) {
    chai.Assertion.addMethod('prototypeOf', function (obj) {
      return chai.assert(this._obj.isPrototypeOf(obj),
        "expect #{this} to be prototype of #{exp}",
        "expect #{this} not to be prototype of #{exp}",
        obj);
    });
  });

  function async(fn) {
    setTimeout(fn, 0);
  }

  function bind() {
    var args = Array.prototype.slice.call(arguments);
    var obj = args.shift();
    var name = args.shift();
    var fn = obj[name];
    return fn.bind.apply(fn, [obj].concat(args));
  }

  function returns(x) {
    return function () {
      return x;
    };
  }

  return {
    expect: expect,
    sinon: sinon,
    async: async,
    bind: bind,
    descriptor: Object.getOwnPropertyDescriptor,
    returns: returns,
  };

});
