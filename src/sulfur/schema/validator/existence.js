/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  return Factory.derive({

    /**
     * @param {object} options (optional)
     *
     * @option options {string} errorPrefix (optional) the error message prefix
     */
    initialize: function (options) {
      this._errorPrefix = options && options.errorPrefix || "must be defined";
    },

    /**
     * @return {string} the error message prefix
     */
    get errorPrefix() { return this._errorPrefix },

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
      isValid || errors && errors.push(this.errorPrefix);
      return isValid;
    }

  });

});
