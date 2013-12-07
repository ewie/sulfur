/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  return Factory.derive({

    initialize: function (channel) {
      this._channel = channel;
    },

    bind: function (view) {
      return function (ev) {
        view.publisher.publish(this._channel);
        ev.preventDefault();
      }.bind(this);
    }

  });

});
