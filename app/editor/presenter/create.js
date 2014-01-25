/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/editor/serializer',
  'app/editor/settings',
  'app/editor/view/create',
  'sulfur/dataGridService',
  'sulfur/ui/presenter',
  'sulfur/util',
  'sulfur/widget/packer'
], function (
    Serializer,
    settings,
    CreateView,
    DataGridService,
    Presenter,
    util,
    widgetPacker
) {

  'use strict';

  var serializer = Serializer.create();

  function createRecordCollection(dgs, resource, cb) {
    util.request({
      method: 'POST',
      url: settings.url(dgs.endpoint),
      data: dgs.recordCollectionDefinition(resource),
      headers: {
        'content-type': 'text/xml'
      },
      success: function () { cb() }
    });
  }

  function createFileCollection(dgs, resource, cb) {
    util.request({
      method: 'POST',
      url: settings.url(dgs.endpoint),
      data: dgs.fileCollectionDefinition(resource),
      headers: {
        'content-type': 'text/xml'
      },
      success: function () { cb() }
    });
  }

  function setValidationScope(dgs, resource, cb) {
    util.request({
      method: 'POST',
      url: settings.url(dgs.recordCollectionMetaUrl(resource)),
      data: dgs.recordCollectionValidationScopeDefinition(resource),
      headers: {
        'content-type': 'text/n3'
      },
      success: function () { cb() }
    });
  }

  function putRecordSchema(dgs, resource, cb) {
    util.request({
      method: 'PUT',
      url: settings.url(dgs.recordCollectionSchemaUrl(resource)),
      data: serializer.serializeToString(resource.schema),
      headers: {
        'content-type': 'text/xml'
      },
      success: function () { cb() }
    });
  }

  function parallel(tasks, cb) {
    var running = tasks.length;
    tasks.forEach(function (task) {
      task(function (err) {
        running -= 1;
        if (err) {
          cb(err);
        } else if (running === 0) {
          cb();
        }
      });
    });
  }

  function loadWidgetIcon(widget, cb) {
    if (widget.icon) {
      widget.icon.load(cb);
    } else {
      cb();
    }
  }

  function invoke(fn) {
    fn();
    return fn;
  }

  return Presenter.derive({

    initialize: function (model) {
      var view = CreateView.create();
      Presenter.prototype.initialize.call(this, view, model);

      view.publisher.subscribe('create', function () {
        view.setPending(true);

        var widget = model.object;
        if (widget) {
          var dgs = DataGridService.create(settings.endpoint);
          var resource = widget.resource;

          parallel([
            function (done) {
              createRecordCollection(dgs, resource, function () {
                parallel([
                  function (done) { putRecordSchema(dgs, resource, done) },
                  function (done) { setValidationScope(dgs, resource, done) }
                ], done);
              });
            },
            function (done) {
              if (resource.hasFiles) {
                createFileCollection(dgs, resource, done);
              } else {
                done();
              }
            }
          ], function () {
            loadWidgetIcon(widget, function () {
              var blob = widgetPacker.createArchive(widget, dgs);
              var url = window.URL.createObjectURL(blob);
              var filename = widgetPacker.archiveFileName(widget);

              view.enableDownload(url, filename);
              view.triggerDownload();

              view.setPending(false);
            });
          });
        }
      });

      model.publisher.subscribe('change', invoke(function () {
        view.enable(model.isValid());
      }));
    }

  });

});
