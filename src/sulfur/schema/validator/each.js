/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/factory'], function (Factory) {

  'use strict';

  return Factory.derive({

    /**
     * Initialize the validator with an item validator.
     *
     * @param [#validate()] itemValidator
     */
    initialize: function (itemValidator) {
      this._itemValidator = itemValidator;
    },

    /**
     * Validate an array of items with item validator.
     *
     * @param [array] items an array of items to validate
     *
     * @return [boolean] wether all items satisfy the item validator
     */
    validate: function (items) {
      return items.every(function (item) {
        return this._itemValidator.validate(item);
      }.bind(this));
    }

  });

});
