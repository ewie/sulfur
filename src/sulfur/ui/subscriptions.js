/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/util/factory',
  'sulfur/util/objectMap'
], function (Factory, ObjectMap) {

  'use strict';

  return Factory.derive({

    initialize: function () {
      this._index = ObjectMap.create();
    },

    subscribe: function (publisher, channel, handler) {
      var s = this._index.get(publisher);
      if (!s) {
        this._index.set(publisher, s = {});
      }
      var t = publisher.subscribe(channel, handler);
      (s[channel] || (s[channel] = [])).push(t);
      return t;
    },

    detach: (function () {

      var d = function (s) {
        s.detach();
      };

      return function (publisher, channel) {
        var idx = this._index;
        var p;
        if (publisher) {
          if (!idx.contains(publisher)) {
            return;
          }
          p = [ publisher ];
        } else {
          p = idx.keys;
        }
        p.forEach(function (p) {
          var s = idx.get(p);
          if (channel) {
            s[channel] && s[channel].forEach(d);
            Object.keys(s).length === 1 && idx.remove(p);
          } else {
            for (var c in s) {
              s[c].forEach(d);
            }
            idx.remove(p);
          }
        });
      };

    }())

  });

});
