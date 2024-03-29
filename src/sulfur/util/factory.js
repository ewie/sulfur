/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(function () {

  'use strict';

  function handleSpec(base, obj, args) {
    if (typeof args[args.length - 1] === 'function') {
      var spec = args.pop();
      var result = spec.apply(base, [obj].concat(args));
      if (result) {
        args.push(result);
      }
    }
  }

  function argumentsArray(args) {
    return Array.prototype.slice.call(args);
  }

  function eachArgument(args, fn) {
    Array.prototype.forEach.call(args, fn);
  }

  var Factory = Object.create(Object.prototype, {

    /**
     * Create an object from .prototype and call .initialize() on the new
     * object with any arguments.
     *
     * @return {object} the new object
     */
    create: {
      writable: true,
      configurable: true,
      value: function () {
        // XXX A regular invocation causes an error on Chrome 23, because
        //   Object.create would SOMETIMES return undefined for no good reason.
        //   By using .call() we can solve this problem.
        var obj = Object.create.call(Object, this.prototype);
        obj.initialize.apply(obj, arguments);
        return obj;
      }
    },

    /**
     * Clone this factory and set up the prototype chain. Extend the new factory
     * with zero or more extension, with objects to the right having higher
     * precedence.
     *
     * @param {object...} extensions (optional)
     * @param {function} spec (optional) a function to receive the base factory
     *   and all extensions, may return an object to be used as the rightmost
     *   extension
     *
     * @return {object} a new factory using this as prototype
     */
    clone: {
      writable: true,
      configurable: true,
      value: function () {
        var args = argumentsArray(arguments);
        var obj = Object.create(this);
        Object.defineProperty(obj, 'prototype', {
          value: Object.create(this.prototype, {
            factory: { value: obj }
          })
        });
        handleSpec(obj, this, args);
        return obj.extend.apply(obj, args);
      }
    },

    /**
     * Clone this factory and set up the prototype chain. Mix in zero or more
     * objects into the new factory's .prototype property, with objects to the
     * right having higher precedence.
     *
     * @param {object...} mixins (optional)
     * @param {function} spec (optional) a function to receive the base factory
     *   and all mixins, may return an object to be used as the rightmost mixin
     *
     * @return {object} a new factory using this as prototype
     */
    derive: {
      writable: true,
      configurable: true,
      value: function () {
        var args = argumentsArray(arguments);
        var obj = this.clone();
        handleSpec(obj, this, args);
        return obj.augment.apply(obj, args);
      }
    },

    /**
     * Extend this with zero or more extension objects, with objects to the
     * right have higher precedence.
     *
     * @param {object...} extensions (optional)
     *
     * @return {object} this
     */
    extend: {
      writable: true,
      configurable: true,
      value: function () {
        eachArgument(arguments, function (ext) {
          var props = Object.getOwnPropertyNames(ext).reduce(function (props, name) {
            if (name === 'prototype') {
              this.augment(ext.prototype);
            } else {
              props[name] = Object.getOwnPropertyDescriptor(ext, name);
            }
            return props;
          }.bind(this), {});
          Object.defineProperties(this, props);
        }.bind(this));
        return this;
      }
    },

    /**
     * Extend .prototype with properties of the provided mixins.
     *
     * @param {object...} mixins (optional)
     *
     * @return {object} this
     */
    augment: {
      writable: true,
      configurable: true,
      value: function () {
        eachArgument(arguments, function (obj) {
          var props = Object.getOwnPropertyNames(obj).reduce(function (props, name) {
            props[name] = Object.getOwnPropertyDescriptor(obj, name);
            return props;
          }, {});
          Object.defineProperties(this.prototype, props);
        }.bind(this));
        return this;
      }
    }

  });

  /**
   * The prototype used to create new objects.
   */
  Object.defineProperty(Factory, 'prototype', {
    value: Object.create(Object.prototype, {
      /**
       * A dummy initialize function.
       */
      initialize: {
        writable: true,
        configurable: true,
        value: function () {}
      },

      factory: { value: Factory }
    })
  });

  return Factory;

});
