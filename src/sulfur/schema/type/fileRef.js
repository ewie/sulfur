/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory',
  'sulfur/schema/mediaType',
  'sulfur/schema/validators',
  'sulfur/util'
], function ($factory, $mediaType, $validators, $util) {

  'use strict';

  var $ = $factory.clone({

    /**
     * @param [object] facets
     * @param [array] errors (optional) an array receiving a pair of facet name
     *   and message for each invalid facet
     *
     * @option facets [array] mediaTypes an array of allowed media types
     *
     * @return [boolean] whether all facets are valid or not
     */
    validateFacets: function (facets, errors) {
      if ($util.isDefined(facets.mediaTypes)) {
        if (facets.mediaTypes.length === 0) {
          if (errors) {
            errors.push([ 'mediaTypes',
              "must specify at least one sulfur/schema/mediaType value" ]);
          }
          return false;
        }
        if (!facets.mediaTypes.every($util.bind($mediaType.prototype, 'isPrototypeOf'))) {
          if (errors) {
            errors.push([ 'mediaTypes',
              "must specify only sulfur/schema/mediaType values" ]);
          }
          return false;
        }
      }
      return true;
    }

  });

  $.augment({

    /**
     * @param [object] facets (optional)
     *
     * @option facets [array] mediaTypes an array of allowed media types
     *
     * @throw [Error] if .validateFacets() returns false
     */
    initialize: function (facets) {
      facets || (facets = {});

      var errors = [];
      if (!this.factory.validateFacets(facets, errors)) {
        throw new Error('facet ' + errors[0][0] + ' ' + errors[0][1]);
      }

      if (facets.mediaTypes) {
        this._mediaTypes = $util.uniq(facets.mediaTypes, $util.method('toString'));
      }
    },

    /**
     * @return [array] an array of valid media types
     */
    getMediaTypeValues: function () {
      return this._mediaTypes;
    },

    /**
     * @return [#validator()] the validator for this type
     */
    validator: function () {
      var validators = [ $validators.prototype.create($mediaType.prototype) ];

      if (this._mediaTypes) {
        validators.push(
          $validators.enumeration.create(
            this._mediaTypes,
            { testMethod: 'matches' }
          )
        );
      }

      return $validators.all.create(validators);
    }

  });

  return $;

});
