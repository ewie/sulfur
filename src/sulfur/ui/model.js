/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/ui/publisher',
  'sulfur/ui/subscriptions',
  'sulfur/util/factory'
], function (Publisher, Subscriptions, Factory) {

  'use strict';

  /**
   * Utility to maintain internal and external errors.
   */
  var Errors = Factory.derive({

    initialize: function () {
      this._internal = { errors: Object.create(null) };
      this._external = { errors: Object.create(null) };
    },

    /**
     * @api public
     *
     * @return {array} an array of all names with internal errors
     */
    get internal() {
      return Object.keys(this._internal.errors);
    },

    /**
     * @api public
     *
     * @param {string} name
     *
     * @return {any} the error (internal or external) associated with the given name
     */
    get: function (name) {
      return this._internal.errors[name] || this._external.errors[name];
    },

    /**
     * @api public
     *
     * @return {true} when there are any errors
     * @return {false} when there are no errors
     */
    hasAny: function () {
      return this.hasAnyInternal() || this.hasAnyExternal();
    },

    /**
     * @api public
     *
     * @return {true} when there are any internal errors
     * @return {false} when there are no internal errors
     */
    hasAnyInternal: function () {
      return this._hasAny(this._internal);
    },

    /**
     * @api public
     *
     * @return {true} when there are any external errors
     * @return {false} when there are no external errors
     */
    hasAnyExternal: function () {
      return this._hasAny(this._external);
    },

    /**
     * @api public
     *
     * @param {string} name
     *
     * @return {true} when there's an internal error under the given name
     * @return {false} when there's no internal error under the given name
     */
    hasInternal: function (name) {
      return !!this._internal.errors[name];
    },

    /**
     * @api private
     *
     * @param {object} scope
     */
    _hasAny: function (scope) {
      var errors = scope.errors;
      if (typeof scope.has === 'undefined') {
        // Check if there are any truthy errors.
        for (var name in errors) {
          if (errors[name]) {
            scope.has = true;
            break;
          }
        }
      }
      return scope.has;
    },

    /**
     * @api public
     */
    setInternal: function (name, error) {
      return this._set(this._internal, name, error);
    },

    /**
     * @api public
     */
    setExternal: function (name, error) {
      return this._set(this._external, name, error);
    },

    /**
     * @api private
     *
     * @param {object} scope
     * @param {string} name
     * @param {any} error
     *
     * @return {true} when the error changed to truthy
     * @return {false} when the error changed to falsy
     * @return {undefined} when the error did not change
     */
    _set: function (scope, name, error) {
      // Normalize any falsy error to undefined.
      error || (error = undefined);
      var change;
      var errors = scope.errors;
      if (error !== this.get(name)) {
        // Let `change` indicate whether the error changed to true or not
        change = !!error;
        // Based on the change we can decide if there are definitely errors, or
        // if a check is required
        scope.has = change || (scope.has && undefined);
      }
      if (error !== errors[name]) {
        errors[name] = error;
      }
      return change;
    }

  });

  /**
   * Utility to collection and avoid multiple publications to the same channel.
   */
  var BatchPublisher = Factory.derive({

    initialize: function () {
      this._messages = Object.create(null);
    },

    publish: function (channel) {
      // XXX Overwrite any present message on the given channel despite its
      //   arguments.
      this._messages[channel] = Array.prototype.slice.call(arguments);
    },

    commit: function (model) {
      for (var channel in this._messages) {
        var args = this._messages[channel];
        args.splice(1, 0, model);
        model.publisher.publish.apply(model.publisher, args);
      }
    }

  });

  /**
   * @abstract
   *
   * @implement {object} .attributes
   * @implement {object} ._extract({object})
   * @implement {object} #_construct()
   */
  return Factory.clone({

    createFromObject: function (object) {
      return this.create({}, object);
    }

  }).augment({

    initialize: (function () {

      var isEnumerable = Object.prototype.propertyIsEnumerable;

      function valueOf(x) {
        return typeof x === 'function' ? x() : x;
      }

      function combine(attrs, xattrs, dattrs) {
        return Object.keys(dattrs).reduce(function (_attrs, name) {
          _attrs[name] = isEnumerable.call(attrs, name) ?
            attrs[name] : isEnumerable.call(xattrs, name) ?
              xattrs[name] : valueOf(dattrs[name].default);
          return _attrs;
        }, {});
      }

      return function (attrs, object) {
        attrs || (attrs = {});

        this._subscriptions = Subscriptions.create();
        this._publisher = Publisher.create();
        this._attrs = Object.create(null);
        this._errors = Errors.create();

        attrs = combine(attrs,
          (object ? this.factory._extract(object) : {}),
          this.factory.attributes);

        this.update(attrs);
      };

    }()),

    /**
     * @api public
     */
    get publisher() {
      return this._publisher;
    },

    /**
     * @api public
     *
     * @return {object} an object constructed when the model last changed
     * @return {null} when no object can be constructed
     */
    get object() {
      return this._object;
    },

    /**
     * @api public
     */
    get: function (name) {
      return this._attrs[name];
    },

    /**
     * @api public
     */
    error: function (name) {
      return this._errors.get(name);
    },

    /**
     * @api public
     */
    isValid: function () {
      return !this._errors.hasAny();
    },

    /**
     * Detach all subscriptions to any attribute value's publisher created
     * through this model. Publish on channel "destroy". Subscribers should
     * remove any reference to this model.
     *
     * @api public
     */
    destroy: function () {
      var attrs = this._attrs;
      for (var name in attrs) {
        this._updateSubscriptions(name, null, attrs[name]);
      }
      var b = BatchPublisher.create();
      b.publish('destroy');
      b.commit(this);
    },

    /**
     * Update the attributes, validate the model and construct a new object
     * when the model is valid. When an attribute's new value has a publisher,
     * subscribe's to its "change" channel.
     *
     * Publishes to the following channels:
     *   change                when the model changes
     *   invalid               when the model BECOMES invalid
     *   invalid:{attribute}   when a specific attribute BECOMES invalid
     *   update                when any attribute value changes
     *   update:{attribute}    when a specific attribute value changes
     *   valid                 when the model BECOMES valid
     *   valid:{attribute}     when a specific attribute BECOMES valid
     *
     * @api public
     *
     * @param {object} attrs
     *
     * @return {true} when there are changes
     * @return {false} when  there are no changes
     */
    update: (function () {

      function update(model, attrs, old) {
        var _attrs = model._attrs;
        return Object.keys(attrs).reduce(function (changed, name) {
          var value = attrs[name];
          if (value !== _attrs[name]) {
            changed = true;
            old[name] = _attrs[name];
            _attrs[name] = value;
            model._updateSubscriptions(name, value, old[name]);
          }
          return changed;
        }, false);
      }

      return function (attrs) {
        var old = Object.create(null);
        if (!update(this, attrs, old)) {
          return false;
        }

        var batch = BatchPublisher.create();

        this._updateObject(batch);

        batch.publish('update', old);
        for (var name in old) {
          batch.publish('update:' + name, old[name]);
          batch.publish('change:' + name);
        }

        batch.commit(this);

        return true;
      };

    }()),

    /**
     * @api public
     */
    updateExternalErrors: function (errors) {
      if (Object.keys(errors).some(this._errors.hasInternal.bind(this._errors))) {
        throw new Error("cannot update external errors when there are internal errors");
      }
      var batch = BatchPublisher.create();
      this._updateExternalErrors(errors, batch);
      batch.commit(this);
    },

    /**
     * @api private
     */
    _updateSubscriptions: (function () {

      function destroyer(model, name) {
        return function () {
          var attrs = {};
          attrs[name] = null;
          model.update(attrs);
        };
      }

      function updater(model, name) {
        return function () {
          var b = BatchPublisher.create();
          b.publish('change:' + name);
          model._updateObject(b);
          b.commit(model);
        };
      }

      return function (name, newValue, oldValue) {
        var s = this._subscriptions;
        var p = oldValue && oldValue.publisher;
        var q = newValue && newValue.publisher;
        p && s.detach(p);
        if (q) {
          s.subscribe(q, 'change', updater(this, name));
          s.subscribe(q, 'destroy', destroyer(this, name));

          var attr = this.factory.attributes[name];
          if (attr && attr.channels) {
            Object.keys(attr.channels).forEach(function (name) {
              s.subscribe(q, name, attr.channels[name]);
            });
          }
        }
      };

    }()),

    /**
     * @api private
     */
    _updateObject: function (batch) {
      var errors = Object.create(null);
      this._validate(errors);

      this._errors.internal.reduce(function (errors, name) {
        errors[name] || (errors[name] = undefined);
        return errors;
      }, errors);

      this._updateInternalErrors(errors, batch);
      this._object = this._errors.hasAnyInternal() ? null: this._construct();
      batch.publish('change');
    },

    /**
     * Validate the model and associate errors with attribute names on the
     * given object. Use any truthy value (preferable a non-empty string
     * containing an error message) to indicate an invalid attribute. Any falsy
     * value or the absence of an attribute name indicates a valid attribute.
     *
     * @api protected
     *
     * @param {object} errors an object to map attribute names to errors
     */
    _validate: function (errors) {
      var attrs = this._attrs;
      for (var name in attrs) {
        var value = attrs[name];
        if (value && typeof value.isValid === 'function') {
          errors[name] = !value.isValid();
        }
      }
    },

    /**
     * @api private
     */
    _updateInternalErrors: function (errors, batch) {
      this._updateErrors('setInternal', errors, batch);
    },

    /**
     * @api private
     */
    _updateExternalErrors: function (errors, batch) {
      this._updateErrors('setExternal', errors, batch);
    },

    /**
     * @api private
     */
    _updateErrors: function (method, errors, batch) {
      var wasValid = this.isValid();

      var changes = Object.keys(errors).reduce(function (changes, name) {
        var change = this._errors[method](name, errors[name]);
        if (typeof change !== 'undefined') {
          changes.push([ name, change ]);
        }
        return changes;
      }.bind(this), []);

      if (changes.length > 0) {
        batch.publish('change');

        var isValid = this.isValid();
        if (wasValid !== isValid) {
          batch.publish(isValid ? 'valid' : 'invalid');
        }

        changes.forEach(function (change) {
          var name = change[0];
          var state = change[1] ? 'invalid' : 'valid';
          batch.publish(state + ':' + name);
          batch.publish('change:' + name);
        }.bind(this));
      }
    }

  });

});
