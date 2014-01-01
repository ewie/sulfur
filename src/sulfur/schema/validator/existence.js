/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  return Factory.derive({

    /**
     * Validate a value using the subvalidator if that value is defined.
     *
     * @param {any} value
     *
     * @return {true} when the value is not undefined
     * @return {false} when the value is undefined
     */
    validate: function (value) {
      return typeof value !== 'undefined';
    }

  });

});
