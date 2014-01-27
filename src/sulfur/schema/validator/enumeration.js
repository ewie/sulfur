/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/util/factory',
  'sulfur/util'
], function (Factory, util) {

  'use strict';

  var format = (function () {

    return function (ary) {
      var k = ary.length - 1;
      switch(k) {
      case 0:
        return ary[0];
      default:
        return ary.slice(0, k).join(', ') + ' or ' + ary[k];
      }
    };

  }());

  return Factory.derive({

    /**
     * Initialize the validator with one or more allowed values.
     *
     * @param {array} values
     * @param {object} options (optional)
     *
     * @option options {string} testMethod (optional)
     * @option options {string} message (optional)
     *
     * @throw {Error} if any value does not respond to the test method
     */
    initialize: (function () {

      function allRespondTo(objects, name) {
        return objects.every(function (object) {
          return typeof object[name] === 'function';
        });
      }

      return function (values, options) {
        options || (options = {});

        var testMethodName = options.testMethod;

        if (values.length === 0) {
          throw new Error("must specify at least one value");
        }
        if (util.isDefined(testMethodName) && !allRespondTo(values, testMethodName)) {
          throw new Error('each allowed value must respond to method "' + testMethodName + '"');
        }

        this._values = values;
        this._testMethodName = testMethodName;
        this._message = options.message || "must be ???";
      };

    }()),

    /**
     * @return {string} the name of the test method when defined
     * @return {undefined} when no test method is defined
     */
    get testMethodName() { return this._testMethodName },

    /**
     * @return {string} the error message
     */
    get message() { return this._message },

    /**
     * Validate a value against all allowed values by calling the test method
     * when defined or by using a strict equality check.
     *
     * @param {any} value
     * @param {array} errors (optional)
     *
     * @return {boolean} whether `value` satisfies the test method of any
     *   allowed value or strictly equals one of the these values
     */
    validate: function (value, errors) {
      var fn;
      if (util.isDefined(this._testMethodName)) {
        fn = function (allowedValue) {
          return allowedValue[this._testMethodName](value);
        }.bind(this);
      } else {
        fn = function (allowedValue) {
          return allowedValue === value;
        };
      }
      var isValid = this._values.some(fn);
      isValid || errors && errors.push(this.message.replace(/\?{3}/g, format(this._values)));
      return isValid;
    }

  });

});
