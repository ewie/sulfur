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

    initialize: function (file) {
      this._file = file;
    },

    get file() { return this._file },

    get blob() { return this._blob },

    get isLoaded() { return !!this.blob },

    load: function (cb) {
      if (this.isLoaded) {
        cb(this);
      } else {
        var fr = new FileReader();
        fr.onload = function (ev) {
          this._blob = ev.target.result;
          cb && cb(this);
        }.bind(this);
        fr.readAsArrayBuffer(this._file);
      }
    }

  });

});
