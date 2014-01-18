/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/common/deserializer',
  'app/widget/config',
  'app/widget/model/record',
  'app/widget/presenter/records',
  'app/widget/proxy',
  'app/widget/view/app',
  'sulfur/record/deserializer',
  'sulfur/record/serializer',
  'sulfur/resource',
  'sulfur/schema/value/simple/fileRef',
  'sulfur/ui/collection',
  'sulfur/ui/presenter',
  'sulfur/util',
  'sulfur/util/xpath'
], function (
    deserializer,
    config,
    RecordModel,
    RecordsPresenter,
    proxy,
    AppView,
    RecordDeserializer,
    RecordSerializer,
    Resource,
    FileRefValue,
    Collection,
    Presenter,
    util,
    XPath
) {

  'use strict';

  function loadRecordIds(presenter, resource, dgs, cb) {
    var status = presenter.view.access('status');

    status.html = "loading resource schema";

    util.request({

      method: 'GET',
      url: proxy.url(dgs.recordCollectionUrl(resource)),
      success: function (xhr) {
        var p = new DOMParser();
        var d = p.parseFromString(xhr.responseText, 'text/xml');

        var xp = XPath.create(d.documentElement);
        var schema = resource.schema;
        var qname = schema.qname;
        var expr = 'x:' + qname.localName + '/@dm:ID';

        var r = xp.all(expr, null, {
          x: qname.namespaceURI,
          dm: 'http://www.webcomposition.net/2008/02/dgs/'
        });

        var ids = Array.prototype.map.call(r, function (r) { return r.value });

        cb(resource, ids);
      }

    });
  }

  function loadSchema(presenter, resource, dgs, success, fail) {
    var status = presenter.view.access('status');

    status.html = "loading record IDs";

    util.request({

      method: 'GET',
      url: proxy.url(dgs.recordCollectionSchemaUrl(resource)),
      success: function (xhr) {
        var p = new DOMParser();
        var d = p.parseFromString(xhr.responseText, 'text/xml');

        var schema = deserializer.deserialize(d);

        resource = Resource.create(schema, resource.recordCollectionName,
          resource.fileCollectionName);

        loadRecordIds(presenter, resource, dgs, success);
      },
      fail: fail

    });
  }

  function loadRecord(resource, dgs, recordId, success) {
    util.request({
      method: 'GET',
      url: proxy.url(dgs.recordUrl(resource, recordId)),
      success: function (xhr) {
        console.log(xhr);
        var p = new DOMParser();
        var d = p.parseFromString(xhr.responseText, 'text/xml');
        var rd = RecordDeserializer.create(resource.schema);
        var record = rd.deserialize(d);
        success(record);
      }
    });
  }

  function deleteRecord(resource, dgs, recordId, cb) {
    util.request({
      method: 'DELETE',
      url: proxy.url(dgs.recordUrl(resource, recordId)),
      success: function (xhr) {
        console.log(xhr);
        cb();
      }
    });
  }

  function saveRecord(resource, dgs, record, cb) {
    var url = record.isNew ?
      dgs.recordCollectionUrl(resource) :
      dgs.recordUrl(resource, record.id);

    var rs = RecordSerializer.create(resource.schema);
    var doc = rs.serialize(record);

    var xs = new XMLSerializer();
    var data = xs.serializeToString(doc);

    util.request({
      method: record.isNew ? 'POST' : 'PUT',
      url: proxy.url(url),
      data: data,
      headers: {
        'content-type': 'text/xml'
      },
      success: function (xhr) {
        console.log(xhr);
        var id = record.isNew ?
          dgs.recordIdFromUrl(resource, xhr.getResponseHeader('location')) :
          record.id;
        cb(id);
      }
    });
  }

  function uploadFile(resource, dgs, file, success, fail) {
    var fr = new FileReader();
    fr.onload = function (ev) {
      util.request({
        method: 'POST',
        url: proxy.url(dgs.fileCollectionUrl(resource)),
        data: ev.target.result,
        headers: {
          'content-type': file.type || 'text/plain'
        },
        success: function (xhr) {
          console.log(xhr);
          var url = xhr.getResponseHeader('location');
          console.log(url);
          var id = dgs.fileIdFromUrl(resource, url);
          success(id);
        },
        fail: function () { fail && fail() }
      });
    };
    fr.readAsArrayBuffer(file);
  }

  function saveFiles(resource, dgs, recordModel, success) {
    var schema = resource.schema;

    var elements = schema.elements;
    var fields = recordModel.get('fields');

    var files = fields.items.reduce(function (files, field) {
      var name = field.get('name');
      var value = field.get('value');

      var element = elements.getByName(name);
      var type = element.type;

      if (type.valueType === FileRefValue) {
        files.push(value);
      } else if (type.valueType.itemValueType === FileRefValue) {
        value.get('values').items.forEach(function (f) { files.push(f) });
      }
      return files;
    }, []);

    var tasks = files.map(function (file) {
      return function (done) {
        uploadFile(resource, dgs, file.get('blob'), function (id) {
          file.update({ id: id });
          done();
        });
      };
    });

    if (tasks.length > 0) {
      parallel(tasks, function () { success() });
    } else {
      success();
    }
  }

  function parallel(tasks, cb) {
    var pending = tasks.length;
    tasks.forEach(function (task) {
      task(function () {
        pending -= 1;
        (pending === 0) && cb();
      });
    });
  }

  function invoke(fn) {
    fn();
    return fn;
  }

  return Presenter.derive({

    initialize: function (model) {
      var view = AppView.create();
      Presenter.prototype.initialize.call(this, view, model);

      var dgs = config.dgs;
      var resource = config.resource;

      function init() {

        view.publisher.subscribe('new', function () {
          var recordModel = RecordModel.createFromSchema(model.get('resource').schema);
          recordModel.update({ loaded: true });
          console.log(recordModel);
          model.get('records').add(recordModel);
        });

        model.publisher.subscribe('update:records', invoke(function () {
          var recordModels = model.get('records');
          var pr = RecordsPresenter.create(recordModels);
          view.access('records').view = pr.view;

          function add(recordModel) {

            recordModel.publisher.subscribe('delete', function () {
              var resource = model.get('resource');
              if (recordModel.get('id')) {
                deleteRecord(resource, dgs, recordModel.get('id'), function () {
                  recordModel.destroy();
                });
              } else {
                recordModel.destroy();
              }
            });

            recordModel.publisher.subscribe('open', function () {
              console.log('-- open', recordModel);

              // toggle "opened" state
              recordModel.update({ opened: !recordModel.get('opened') });

              if (!recordModel.get('loaded')) {
                recordModel.publisher.publish('load');
              }
            });

            recordModel.publisher.subscribe('load', function () {
              var resource = model.get('resource');
              if (recordModel.get('id')) {
                loadRecord(resource, dgs, recordModel.get('id'), function (r) {
                  console.log(r);

                  var _recordModel = RecordModel.createFromSchema(resource.schema, r);
                  recordModel.update({
                    fields: _recordModel.get('fields'),
                    loaded: true,
                    opened: true
                  });
                });
              } else {
                recordModel.update({
                  loaded: true,
                  opened: true
                });
              }
            });


            recordModel.publisher.subscribe('save', function () {
              var resource = model.get('resource');
              // TODO check if valid

              console.log('-- save', recordModel);
              console.log(resource);

              saveFiles(resource, dgs, recordModel, function () {

                saveRecord(resource, dgs, recordModel.object, function (id) {
                  recordModel.update({ id: id });
                });
              });
            });

            recordModel.publisher.subscribe('close', function () {
              recordModel.update({ opened: false });
            });

          }

          recordModels.items.forEach(add);

          recordModels.publisher.subscribe('add', function (_, recordModel) {
            add(recordModel);
          });

        }));

      }

      loadSchema(this, resource, dgs, function (resource, ids) {
        view.access('status').html = "widget successfully loaded";
        var records = Collection.create(ids.map(function (id) {
          return RecordModel.create({ id: id });
        }));

        model.update({
          resource: resource,
          records: records
        });

        config.setSchema(resource.schema);

        init();

        setTimeout(function () { view.hideStatus() }, 2000);

      }, function (xhr) {
        var msg;
        if (xhr.status) {
          msg = "this widget\u2019s resource does no longer exist";
        } else {
          var url = config.get('endpoint');
          msg = 'cannot connect to DataGridService at <a href="' + url + '">' + url + '</a>';
        }
        view.access('status').html = msg;
      });
    }

  });

});
