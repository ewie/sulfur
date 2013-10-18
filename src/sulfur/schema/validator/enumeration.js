/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory',
  'sulfur/util'
], function (Factory, util) {

  'use strict';

  return Factory.derive({

    /**
     * Initialize the validator with one or more allowed values.
     *
     * @param [array] values
     * @param [object] options (optional)
     *
     * @option options [string] testMethod (optional)
     *
     * @throw [Error] if any value does not respond to the test method
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
      };

    }()),

    /**
     * @return [string] the name of the test method when defined
     * @return [undefined] when no test method is defined
     */
    getTestMethodName: function () {
      return this._testMethodName;
    },

    /**
     * Validate a value against all allowed values by calling the test method
     * when defined or by using a strict equality check.
     *
     * @param [any] value
     *
     * @return [boolean] whether `value` satisfies the test method of any
     *   allowed value or strictly equals one of the these values
     */
    validate: function (value) {
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
      return this._values.some(fn);
    }

  });

});
