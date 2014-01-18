/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/ui/publisher',
  'sulfur/util/factory',
  'sulfur/util/stringMap'
], function (Publisher, Factory, StringMap) {

  'use strict';

  function mod(a, n) {
    return a - (n * Math.floor(a/n));
  }

  function elementIndex(element) {
    var i = 0;
    while ((element = element.previousElementSibling) !== null) {
      i += 1;
    }
    return i;
  }

  function slices(ary, n) {
    var s = [];
    for (var i = 0; i < ary.length; i += n) {
      s.push(ary.slice(i, i + n));
    }
    return s;
  }

  return Factory.derive({

    initialize: function (element) {
      this._placeholder = element.getAttribute('data-placeholder');
      this._columnCount = parseInt(element.getAttribute('data-columns'), 10);

      this._publisher = Publisher.create();
      this._element = element;

      this._value = document.createElement('span');
      this._list = document.createElement('div');
      this._value.className = 'dropdown-value';
      this._list.className = 'dropdown-values';

      element.classList.add('dropdown');

      element.addEventListener('click', this._click.bind(this));
      element.addEventListener('keydown', this._keydown.bind(this));
      element.addEventListener('focus', this._focus.bind(this));
      element.addEventListener('blur', this._blur.bind(this));
      element.addEventListener('mouseover', this._mouseenter.bind(this));
      element.addEventListener('mouseout', this._mouseleave.bind(this));

      element.appendChild(this._value);
      element.appendChild(this._list);

      this._clearSelection();
    },

    get values() {
      return [].concat(this._values);
    },

    set values(values) {
      var oldValue = this.value;
      this._values = values;
      this._list.textContent = '';

      this._index = slices(values, this._columnCount).reduce(function (index, vals) {
        var row = document.createElement('div');
        row.className = 'dropdown-row';
        vals.reduce(function (index, value) {
          var cell = document.createElement('div');
          cell.textContent = value;
          cell.addEventListener('click', this._clickItem.bind(this));
          cell.className = 'dropdown-cell';
          row.appendChild(cell);
          index.set(value, cell);
          return index;
        }.bind(this), index);
        this._list.appendChild(row);
        return index;
      }.bind(this), StringMap.create());

      if (this._index.contains(oldValue)) {
        this._focusedItem = this._selectedItem = this._index.get(oldValue);
      } else {
        this._unselectItem();
      }

      this._publisher.publish('values');
    },

    get publisher() {
      return this._publisher;
    },

    get value() {
      return this._element.classList.contains('dropdown-empty') ?
        undefined : this._value.textContent;
    },

    set value(value) {
      if (value === null || typeof value === 'undefined') {
        this._unselect();
      } else {
        if (!this._index.contains(value)) {
          throw new Error('unknown value "' + value + '"');
        }
        this._selectItem(this._index.get(value));
      }
    },

    isExpanded: function () {
      return this._element.classList.contains('dropdown-expanded');
    },

    expand: function () {
      this._element.classList.add('dropdown-expanded');
    },

    collapse: function () {
      this._element.classList.remove('dropdown-expanded');
    },

    _unselect: function () {
      this._unselectItem();
      this._publisher.publish('select');
    },

    _select: function (item) {
      this._selectItem(item);
      this._publisher.publish('select');
    },

    _unselectItem: function () {
      this._clearSelection();
    },

    _selectItem: function (item) {
      this._clearSelection();
      this._element.classList.remove('dropdown-empty');
      this._focusItem(item);
      this._selectedItem = item;
      this._value.textContent = item.textContent;
      item.classList.add('dropdown-selected');
    },

    _clearSelection: function () {
      this._selectedItem && this._selectedItem.classList.remove('dropdown-selected');
      this._unfocusItem();
      this._selectedItem = undefined;
      this._value.textContent = this._placeholder;
      this._element.classList.add('dropdown-empty');
    },

    _focusItem: function (item) {
      this._unfocusItem();
      if (item) {
        item.classList.add('dropdown-focus');
        this._focusedItem = item;
      }
    },

    _unfocusItem: function () {
      this._focusedItem && this._focusedItem.classList.remove('dropdown-focus');
      this._focusedItem = undefined;
    },

    _mouseenter: function () {
      this._mouseover = true;
    },

    _mouseleave: function () {
      this._mouseover = false;
    },

    _focus: function () {
      if (!this._mouseover) {
        this.expand();
      }
    },

    _blur: function () {
      this.collapse();
    },

    _click: function () {
      this.isExpanded() ? this.collapse() : this.expand();
    },

    _clickItem: function (ev) {
      var item = ev.target;
      this._select(item);
      this.collapse();
      ev.stopPropagation();
    },

    _keydown: (function () {

      var keys = {
        13: '_enter',
        27: '_esc',
        37: '_left',
        38: '_up',
        39: '_right',
        40: '_down'
      };

      return function (ev) {
        var m = keys[ev.which];
        if (m) {
          ev.preventDefault();
          this[m]();
        }
      };

    }()),

    _enter: function () {
      this._select(this._focusedItem);
      this.collapse();
    },

    _esc: function () {
      this.collapse();
    },

    _down: function () {
      if (this.isExpanded()) {
        var p = this._position() || { row: -1, column: 0 };
        p.row += 1;
        this._focusItem(this._itemAt(p.row, p.column));
      } else {
        this._element.classList.add('dropdown-expanded');
      }
    },

    _right: function () {
      if (this.isExpanded()) {
        var p = this._position() || { row: 0, column: -1 };
        p.column += 1;
        this._focusItem(this._itemAt(p.row, p.column));
      }
    },

    _up: function () {
      if (this.isExpanded()) {
        var p = this._position() || { row: 0, column: 0 };
        p.row -= 1;
        this._focusItem(this._itemAt(p.row, p.column));
      }
    },

    _left: function () {
      if (this.isExpanded()) {
        var p = this._position() || { row: 0, column: 1 };
        p.column -= 1;
        this._focusItem(this._itemAt(p.row, p.column));
      }
    },

    _position: function () {
      if (this._focusedItem) {
        var row = elementIndex(this._focusedItem.parentElement);
        var column = elementIndex(this._focusedItem);
        return {
          row: row,
          column: column
        };
      }
    },

    _itemAt: function (i, j) {
      i = mod(i, this._list.children.length);
      var row = this._list.children.item(i);
      j = mod(j, row.children.length);
      return row.children.item(j);
    }

  });

});
