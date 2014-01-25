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

    initialize: function (name, resource, options) {
      if (!name) {
        throw new Error("expecting a non-empty name");
      }
      options || (options = {});
      this._name = name;
      this._resource = resource;
      this._icon = options.icon;
      this._description = options.description;
      this._authorName = options.authorName;
      this._authorEmail = options.authorEmail;
    },

    get name() { return this._name },

    get resource() { return this._resource },

    get icon() { return this._icon },

    get description() { return this._description },

    get authorName() { return this._authorName },

    get authorEmail() { return this._authorEmail }

  });

});
