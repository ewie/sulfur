/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define, postMessage */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  var async = (function () {

    // use a secret to identify messages we're interested in
    var secret = Math.random().toString(36).substr(2);

    var handlers = [];

    addEventListener('message', function (ev) {
      if (ev.source === window && ev.data === secret) {
        ev.stopPropagation();
        if (handlers.length > 0) {
          var fn = handlers.shift();
          fn();
        }
      }
    });

    return function (fn) {
      handlers.push(fn);
      postMessage(secret, '*');
    };

  }());

  function subscriptions(publisher, channel, init) {
    var subs = publisher._subscriptions;
    var s;
    if (subs.hasOwnProperty(channel)) {
      s = subs[channel];
    } else if (init) {
      s = subs[channel] = [];
    }
    return s;
  }

  function wrap(sub, subs) {
    return {
      attach: function () {
        sub.attached || (sub.index = subs.push(sub) - 1);
        sub.attached = true;
      },
      detach: function () {
        sub.attached && subs.splice(subs.lastIndexOf(sub, sub.index), 1);
        sub.attached = false;
      }
    };
  }

  return Factory.derive({

    initialize: function () {
      this._subscriptions = {};
    },

    subscribe: function (channel, handler) {
      var subs = subscriptions(this, channel, true);
      var sub = { handler: handler };
      var w = wrap(sub, subs);
      w.attach();
      return w;
    },

    /**
     * Asynchrounously publish on the given channel.
     *
     * @param {string} channel
     * @param {any...} args zero or more arguments to be passed to each subscriber
     */
    publish: function () {
      var channel = arguments[0];
      var subs = subscriptions(this, channel);
      if (subs) {
        var args = Array.prototype.slice.call(arguments, 1);
        subs.forEach(function (sub) {
          async(function () {
            sub.handler.apply(null, args);
          });
        });
      }
    }

  });

});
