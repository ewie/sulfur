/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  return Factory.derive({

    /**
     * @param {object} options (optional)
     *
     * @option options {string} message (optional) the error message
     */
    initialize: function (options) {
      this._message = options && options.message || "must be defined";
    },

    /**
     * @return {string} the error message
     */
    get message() { return this._message },

    /**
     * Validate a value using the subvalidator if that value is defined.
     *
     * @param {any} value
     * @param {array} errors (optional)
     *
     * @return {true} when the value is not undefined
     * @return {false} when the value is undefined
     */
    validate: function (value, errors) {
      var isValid = typeof value !== 'undefined';
      isValid || errors && errors.push(this.message);
      return isValid;
    }

  });

});
