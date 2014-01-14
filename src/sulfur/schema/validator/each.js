/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  return Factory.derive({

    /**
     * Initialize the validator with an item validator.
     *
     * @param {.validate()} itemValidator
     */
    initialize: function (itemValidator) {
      this._itemValidator = itemValidator;
    },

    /**
     * Validate an array of items with item validator.
     *
     * @param {array} items an array of items to validate
     * @param {array} errors (optional)
     *
     * @return {boolean} wether all items satisfy the item validator
     */
    validate: function (items, errors) {
      return items.every(function (item) {
        return this._itemValidator.validate(item, errors);
      }.bind(this));
    }

  });

});
