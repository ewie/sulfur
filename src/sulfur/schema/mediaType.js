/* Copyright (c) 2013, Erik Wienhold
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

  var TYPE_PATTERN = /^(?:application|audio|image|text|video)$/;
  var SUBTYPE_PATTERN = /^[^\x00-\x20\x7F()<>@,;:\\"/\[\]?.=]+$/;

  var $ = Factory.clone({

    parse: function (s) {
      var p = s.indexOf('/');
      if (p === -1) {
        throw new Error("expecting a string representing a valid media type");
      }
      var type = s.substr(0, p);
      var subtype = s.substr(p + 1);
      return this.create(type, subtype);
    }

  });

  $.augment({

    /**
     * Initialize the media type with a type and subtype.
     *
     * @param {string} type (default '*')
     * @param {string} subtype (default '*')
     *
     * @throw {Error} if `type` is defined and not one of "application", "audio",
     *   "image, "text" or "video"
     * @throw {Error} if `subtype` is invalid
     */
    initialize: function (type, subtype) {
      type === '*' && (type = undefined);
      subtype === '*' && (subtype = undefined);
      if (type && !TYPE_PATTERN.test(type)) {
        throw new Error("media type must be one of 'application', 'audio', 'image', 'text' or 'video'");
      }
      if (subtype && !SUBTYPE_PATTERN.test(subtype)) {
        throw new Error("invalid subtype");
      }
      if (!type && subtype) {
        throw new Error("cannot use a defined subtype with an undefined type");
      }
      this._type = type;
      this._subtype = subtype;
    },

    /**
     * @return {string} the type
     */
    getType: function () {
      return this._type;
    },

    /**
     * @return {string} the subtype
     */
    getSubtype: function () {
      return this._subtype;
    },

    /**
     * @return {string} the string representation
     */
    toString: function () {
      return (this._type || '*') + '/' + (this._subtype || '*');
    },

    /**
     * Check if the media type matches another media type. An undefined type or
     * subtype on the LHS matches any respective type or subtype on the RHS.
     *
     * @param {sulfur/schema/mediaType} other
     *
     * @return {boolean} whether LHS matches RHS or not
     */
    matches: function (other) {
      if (util.isUndefined(this._type)) {
        return true;
      }
      if (this._type !== other._type) {
        return false;
      }
      if (util.isUndefined(this._subtype)) {
        return true;
      }
      return this._subtype === other._subtype;
    }

  });

  return $;

});
