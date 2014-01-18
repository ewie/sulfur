/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, describe, it */

define([
  'shared',
  'jszip',
  'sulfur/widget/packer',
  'text!app/common/icon.svg',
  'text!app/common/style.css',
  'text!app/widget/index.html',
  'text!app/widget/main-built.js',
  'text!app/widget/style.css'
], function (
    shared,
    JSZip,
    packer,
    iconSvg,
    commonStyleCss,
    indexHtml,
    mainJs,
    styleCss
) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;

  describe('sulfur/widget/packer', function () {

    describe('.namespaceURI', function () {

      it("should equal 'http://www.w3.org/ns/widgets'", function () {
        expect(packer.namespaceURI).to.equal('http://www.w3.org/ns/widgets');
      });

    });

    describe('#archiveFileName()', function () {

      it("should use the widget name with extension '.wgt'", function () {
        var fileName = packer.archiveFileName({ name: 'foo' });
        expect(fileName).to.equal('foo.wgt');
      });

      it("should replace coninuous non-alphanumeric characters with a single minus hyphen (U+002D)", function () {
        var s = '';
        for (var v = 0; v < 0x80; v += 1) {
          var c = String.fromCharCode(v);
          if (c !== '-' && c !== '_' && !(c >= 'A' && c <= 'Z') &&
              !(c >= 'a' && c <= 'z') && !(c >= '0' && c <= '9'))
          {
            s += c;
          }
        }
        var name = 'A' + s + 'z';
        var fileName = packer.archiveFileName({ name: name });
        expect(fileName).to.equal('A-z.wgt');
      });

      it("should replace coninuous non-ascii characters with a single minus hyphen (U+002D)", function () {
        var s = '';
        for (var v = 0x80; v < 0x100; v += 1) {
          var c = String.fromCharCode(v);
          s += c;
        }
        var name = '_' + s + '_';
        var fileName = packer.archiveFileName({ name: name });
        expect(fileName).to.equal('_-_.wgt');
      });

    });

    describe('#createConfigurationDocument()', function () {

      var widget;
      var dgs;

      beforeEach(function () {
        dgs = { endpoint: 'http://example.org/' };
        widget = {
          name: 'foo',
          resource: {
            recordCollectionName: 'bar',
            fileCollectionName: 'bar-files',
            hasFiles: true
          },
          description: 'bar',
          authorName: 'abc',
          authorEmail: 'x@y.z'
        };
      });

      it("should create a W3C Widget XML configuration document", function () {
        var d = packer.createConfigurationDocument(widget, dgs);
        var e = d.documentElement;
        expect(e.tagName).to.equal('widget');
        expect(e.namespaceURI).to.equal(packer.namespaceURI);
      });

      it("should include element <name> with the widget name", function () {
        var d = packer.createConfigurationDocument(widget, dgs);
        var e = d.querySelector('widget > name');
        expect(e.namespaceURI).to.equal(packer.namespaceURI);
        expect(e.textContent).to.equal(widget.name);
      });

      it('should include element <content src="index.html" type="text/html"/>', function () {
        var d = packer.createConfigurationDocument(widget, dgs);
        var e = d.querySelectorAll('widget > content').item(0);
        expect(e.namespaceURI).to.equal(packer.namespaceURI);
        expect(e.attributes.src.value).to.equal('index.html');
        expect(e.attributes.type.value).to.equal('text/html');
      });

      it('should include element <content src="main.js" type="application/javascript"/>', function () {
        var d = packer.createConfigurationDocument(widget, dgs);
        var e = d.querySelectorAll('widget > content').item(1);
        expect(e.namespaceURI).to.equal(packer.namespaceURI);
        expect(e.attributes.src.value).to.equal('main.js');
        expect(e.attributes.type.value).to.equal('application/javascript');
      });

      it('should include element <content src="style.css" type="text/css"/>', function () {
        var d = packer.createConfigurationDocument(widget, dgs);
        var e = d.querySelectorAll('widget > content').item(2);
        expect(e.namespaceURI).to.equal(packer.namespaceURI);
        expect(e.attributes.src.value).to.equal('style.css');
        expect(e.attributes.type.value).to.equal('text/css');
      });

      it('should include element <icon src="icon.svg"/>', function () {
        var d = packer.createConfigurationDocument(widget, dgs);
        var e = d.querySelector('widget > icon');
        expect(e.namespaceURI).to.equal(packer.namespaceURI);
        expect(e.attributes.src.value).to.equal('icon.svg');
      });

      it("should include element <preference/> defining the endpoint url", function () {
        var d = packer.createConfigurationDocument(widget, dgs);
        var e = d.querySelectorAll('widget > preference').item(0);
        expect(e.namespaceURI).to.equal(packer.namespaceURI);
        expect(e.attributes.name.value).to.equal('endpoint');
        expect(e.attributes.value.value).to.equal(dgs.endpoint);
      });

      it("should include element <preference/> defining the resource's record collection name", function () {
        var d = packer.createConfigurationDocument(widget, dgs);
        var e = d.querySelectorAll('widget > preference').item(1);
        expect(e.namespaceURI).to.equal(packer.namespaceURI);
        expect(e.attributes.name.value).to.equal('recordCollectionName');
        expect(e.attributes.value.value).to.equal(widget.resource.recordCollectionName);
      });

      it("should include element <preference/> defining the resource's file collection name when the resource has files", function () {
        var d = packer.createConfigurationDocument(widget, dgs);
        var e = d.querySelectorAll('widget > preference').item(2);
        expect(e.namespaceURI).to.equal(packer.namespaceURI);
        expect(e.attributes.name.value).to.equal('fileCollectionName');
        expect(e.attributes.value.value).to.equal(widget.resource.fileCollectionName);
      });

      it("should not include element <preference/> defining the resource's file collection name when the resource has no files", function () {
        widget.resource.hasFiles = false;
        var d = packer.createConfigurationDocument(widget, dgs);
        var ee = d.querySelectorAll('widget > preference');
        expect(ee).to.have.lengthOf(2);
      });

      it("should include element <description> when a description is defined", function () {
        var d = packer.createConfigurationDocument(widget, dgs);
        var e = d.querySelector('widget > description');
        expect(e.namespaceURI).to.equal(packer.namespaceURI);
        expect(e.textContent).to.equal(widget.description);
      });

      it("should include element <author> when an author name is defined", function () {
        var d = packer.createConfigurationDocument(widget, dgs);
        var e = d.querySelector('widget > author');
        expect(e.namespaceURI).to.equal(packer.namespaceURI);
        expect(e.textContent).to.equal(widget.authorName);
      });

      it("should include element <author> with attribute @email when an author email address is defined", function () {
        var d = packer.createConfigurationDocument(widget, dgs);
        var e = d.querySelector('widget > author');
        expect(e.namespaceURI).to.equal(packer.namespaceURI);
        expect(e.attributes.email.value).to.equal(widget.authorEmail);
      });

    });

    describe('#createArchive()', function () {

      var sandbox;
      var widget;
      var dgs;

      beforeEach(function () {
        sandbox = sinon.sandbox.create();
        widget = {
          name: 'foo',
          resource: { name: 'bar' }
        };
        dgs = { endpoint: 'http://example.org/' };
      });

      afterEach(function () {
        sandbox.restore();
      });

      it("should create the ZIP archive with JSZip", function () {
        var spy = sandbox.spy(JSZip.prototype, 'generate');
        var blob = packer.createArchive(widget, dgs);
        expect(spy)
          .to.be.calledWith({ type: 'blob', compression: 'DEFLATE' })
          .to.have.returned(sinon.match.same(blob));
      });

      it("should add file config.xml containing the configuration document", function () {
        var spy = sandbox.spy(JSZip.prototype, 'file');
        packer.createArchive(widget, dgs);
        var d = packer.createConfigurationDocument(widget, dgs);
        var xs = new XMLSerializer();
        var s = '<?xml version="1.0" encoding="utf-8"?>' + xs.serializeToString(d);
        expect(spy.getCall(0)).to.be.calledWith('config.xml', s);
      });

      it("should add file index.html", function () {
        var spy = sandbox.spy(JSZip.prototype, 'file');
        packer.createArchive(widget, dgs);
        expect(spy.getCall(1)).to.be.calledWith('index.html', indexHtml);
      });

      it("should add file icon.svg", function () {
        var spy = sandbox.spy(JSZip.prototype, 'file');
        packer.createArchive(widget, dgs);
        expect(spy.getCall(2)).to.be.calledWith('icon.svg', iconSvg);
      });

      it("should add file main.js", function () {
        var spy = sandbox.spy(JSZip.prototype, 'file');
        packer.createArchive(widget, dgs);
        expect(spy.getCall(3)).to.be.calledWith('main.js', mainJs);
      });

      it("should add file style.css", function () {
        var spy = sandbox.spy(JSZip.prototype, 'file');
        packer.createArchive(widget, dgs);
        expect(spy.getCall(4)).to.be.calledWith('style.css',
          commonStyleCss + styleCss);
      });

    });

  });

});
