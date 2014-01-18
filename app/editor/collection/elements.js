/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/ui/collection',
  'sulfur/util/objectMap',
  'sulfur/util/stringMap'
], function (Collection, ObjectMap, StringMap) {

  'use strict';

  return Collection.derive({

    initialize: function () {
      this._conflicts = StringMap.create();
      Collection.prototype.initialize.apply(this, arguments);
    },

    _checkUniqueness: function (m, oldName) {
      var ms;
      var conflicts = this._conflicts;
      var name = m.get('name');

      if (conflicts.contains(oldName)) {
        if (conflicts.get(oldName).contains(m)) {
          ms = conflicts.get(oldName).keys;
          if (ms.length === 2) {
            conflicts.remove(oldName);
            ms.forEach(function (m) {
              m.updateExternalErrors({ name: false });
            });
          } else {
            conflicts.get(oldName).remove(m);
            m.updateExternalErrors({ name: false });
          }
        }
      }

      if (conflicts.contains(name)) {
        conflicts.get(name).set(m);
        m.updateExternalErrors({ name: 'must be unique' });
      } else {
        ms = this.items.filter(function (m) {
          return m.get('name') === name;
        });
        if (ms.length > 1) {
          var x = ms.reduce(function (index, m) {
            index.set(m);
            return index;
          }, ObjectMap.create());
          conflicts.set(name, x);
          ms.forEach(function (m) {
            m.updateExternalErrors({ name: 'must be unique' });
          });
        }
      }
    },

    add: function (value) {
      var added = Collection.prototype.add.call(this, value);
      if (added) {
        this._subscribe(value.publisher, 'update:name', function (m, oldName) {
          this._checkUniqueness(m, oldName);
        }.bind(this));

        this._subscribe(value.publisher, 'up', function () {
          var i = this.indexOf(value);
          if (i > 0) {
            this.insertAt(value, i - 1);
          }
        }.bind(this));

        this._subscribe(value.publisher, 'down', function () {
          var i = this.indexOf(value);
          if (i < (this.size - 1)) {
            this.insertAt(value, i + 1);
          }
        }.bind(this));
      }
      return added;
    }

  });

});
