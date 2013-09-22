/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/factory'], function ($factory) {

  'use strict';

  /**
   * @abstract
   *
   * @implement .getName()
   * @implement .getNamespace()
   * @implement [#validate()] #createValidator()
   * @implement [boolean] #validate()
   *
   * @api private
   */
  return $factory.derive({

    /**
     * Initialize the facet with a value.
     *
     * @param [any] value
     *
     * @api public
     */
    initialize: function (value) {
      this._value = value;
    },

    /**
     * @api public
     *
     * @return [string] the facet's name
     */
    getName: function () {
      return this.factory.getName();
    },

    /**
     * @api public
     *
     * @return [string] the facet's XML namespace
     */
    getNamespace: function () {
      return this.factory.getNamespace();
    },

    /**
     * @api public
     *
     * @return [any] the facet's value
     */
    getValue: function () {
      return this._value;
    }

  });

});
