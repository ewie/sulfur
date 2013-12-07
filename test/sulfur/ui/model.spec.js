/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/ui/model',
  'sulfur/ui/publisher'
], function (shared, Model, Publisher) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var async = shared.async;
  var bind = shared.bind;
  var returns = shared.returns;

  describe('sulfur/ui/model', function () {

    function fail(map) {
      return function (errors) {
        Object.keys(map).reduce(function (errors, name) {
          errors[name] = map[name];
          return errors;
        }, errors);
        return false;
      };
    }

    var DerivedModel;
    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
      DerivedModel = Model.clone({

        attributes: Object.create({
          xxx: undefined
        }, {
          foo: {
            value: {
              default: 0,
              channels: Object.create({
                inherited: undefined
              }, {
                nonEnumerable: {
                  value: function () {},
                  enumerable: false
                },
                xyz: {
                  value: function () {},
                  enumerable: true,
                  writable: true
                }
              })
            },
            enumerable: true
          },
          bar: {
            value: {
              default: returns(42)
            },
            enumerable: true
          },
          nonEnumerable: {
            value: {
              default: 1,
            },
            enumerable: false
          }
        }),

        _extract: function (obj) {
          return Object.create({
            bar: obj._bar
          }, {
            foo: {
              value: obj._foo,
              enumerable: true
            }
          });
        }

      }).augment({

        _construct: function () {
          return {
            _foo: this.get('foo'),
            _bar: this.get('bar')
          };
        }

      });
    });

    afterEach(function () {
      sandbox.restore();
    });

    describe('.createFromObject()', function () {

      it("should call .create() with no direct attributes and the given object", function () {
        var spy = sandbox.spy(DerivedModel, 'create');
        var obj = {};
        DerivedModel.createFromObject(obj);
        expect(spy).to.be.calledWith({}, sinon.match.same(obj));
      });

    });

    describe('#initialize()', function () {

      it("should be callable without attributes", function () {
        var model = DerivedModel.create();
        expect(model.get('foo')).to.equal(0);
      });

      it("should set attributes via #update()", function () {
        var spy = sinon.spy(DerivedModel.prototype, 'update');
        var model = DerivedModel.create({});
        expect(spy)
          .to.be.calledOn(sinon.match.same(model))
          .to.be.calledWith({
            foo: 0,
            bar: 42
          });
      });

      it("should use an extracted attribute when no direct attribute is given", function () {
        var model = DerivedModel.create({}, { _foo: 1 });
        expect(model.get('foo')).to.equal(1);
      });

      it("should use a default attribute when no direct and extracted attribute is given", function () {
        var model = DerivedModel.create({});
        expect(model.get('foo')).to.equal(0);
      });

      it("should use the result a default attribute when callable", function () {
        var model = DerivedModel.create({});
        expect(model.get('bar')).to.equal(42);
      });

      it("should ignore inherited properties within the direct attributes", function () {
        var model = DerivedModel.create(Object.create({ foo: 1 }));
        expect(model.get('foo')).to.equal(DerivedModel.attributes.foo.default);
      });

      it("should ignore non-enumerable properties within the direct attributes", function () {
        var attrs = Object.create(null, {
          foo: {
            value: 1,
            enumerable: false
          }
        });
        var model = DerivedModel.create(attrs);
        expect(model.get('foo')).to.equal(DerivedModel.attributes.foo.default);
      });

      it("should ignore inherited properties within the extracted attributes", function () {
        var model = DerivedModel.create({}, { _bar: 7 });
        expect(model.get('bar')).to.equal(DerivedModel.attributes.bar.default());
      });

      it("should ignore non-enumerable properties within the extracted attributes", function () {
        var obj = Object.create(null, {
          _bar: {
            value: 7,
            enumerable: false
          }
        });
        var model = DerivedModel.create({}, obj);
        expect(model.get('bar')).to.equal(DerivedModel.attributes.bar.default());
      });

      it("should ignore inherited properties within the default attributes", function () {
        var model = DerivedModel.create();
        expect(model.get('inherited')).to.be.undefined;
      });

      it("should ignore non-enumerable properties within the default attributes", function () {
        var model = DerivedModel.create();
        expect(model.get('nonEnumerable')).to.be.undefined;
      });

    });

    describe('#publisher', function () {

      it("should return a publisher", function () {
        var model = DerivedModel.create();
        expect(Publisher.prototype).to.be.prototypeOf(model.publisher);
      });

    });

    describe('#object', function () {

      var model;

      beforeEach(function () {
        model = DerivedModel.create();
      });

      it("should return the object constructed from a valid model", function () {
        model.update({ foo: 1 });
        expect(model.object).to.exist;
      });

      it("should return undefined when the model is internally invalid", function () {
        model._validate = fail({ foo: 'error' });
        model.update({ foo: 1 });
        expect(model.object).to.be.null;
      });

    });

    describe('#get()', function () {

      var model;

      beforeEach(function () {
        model = DerivedModel.create();
      });

      it("should return the value of the attribute with the given name when defined", function () {
        model.update({ foo: '' });
        expect(model.get('foo')).to.equal('');
      });

      it("should return undefined when no attribute with the given name is defined", function () {
        expect(model.get('xxx')).to.be.undefined;
      });

    });

    describe('#error()', function () {

      var model;

      beforeEach(function () {
        model = DerivedModel.create();
      });

      it("should return undefined when the attribute of the given name is valid", function () {
        expect(model.error('foo')).to.be.undefined;
      });

      it("should return the internal error message associated with the attribute of the given name", function () {
        model._validate = function (errors) {
          errors.bar = 'internal error';
          return false;
        };
        model.update({ bar: 1 });
        expect(model.error('bar')).to.equal('internal error');
      });

      it("should return the external error message associated with the attribute of the given name", function () {
        model.updateExternalErrors({ bar: 'external error' });
        expect(model.error('bar')).to.equal('external error');
      });

    });

    describe('#isValid()', function () {

      var model;

      beforeEach(function () {
        model = DerivedModel.create();
      });

      it("should return true when there are no errors", function () {
        expect(model.isValid()).to.be.true;
      });

      it("should return false when there are internal errors", function () {
        model._validate = fail({ foo: 'error' });
        model.update({ foo: 1 });
        expect(model.isValid()).to.be.false;
      });

      it("should return false when there are external errors", function () {
        model.updateExternalErrors({ foo: 'external error' });
        expect(model.isValid()).to.be.false;
      });

    });

    describe('#destroy()', function () {

      var model;

      beforeEach(function () {
        model = DerivedModel.create();
      });

      it("should publish on channel 'destroy'", function () {
        var spy = sinon.spy(model.publisher, 'publish');
        model.destroy();
        expect(spy).to.be.calledWith('destroy', sinon.match.same(model));
      });

      it("should detach all subscriptions based on .attributes[name].channels", function (done) {
        var publisher = Publisher.create();
        var sub = { publisher: publisher };
        var spy = sandbox.spy(DerivedModel.attributes.foo.channels, 'xyz');
        model.update({ foo: sub });
        model.destroy();
        publisher.publish('xyz');
        async(function () {
          expect(spy).to.not.be.called;
          done();
        });
      });

    });

    describe('#update()', function () {

      var model;

      beforeEach(function () {
        model = DerivedModel.create();
      });

      it("should return false when there are no changes", function () {
        model.update({ foo: 1 });
        expect(model.update({ foo: 1 })).to.be.false;
      });

      it("should ignore inherited properties", function () {
        model.update({ foo: 1 });
        model.update(Object.create({ foo: 2 }));
        expect(model.get('foo')).to.equal(1);
      });

      it("should non-enumerable properties", function () {
        model.update({ foo: 1 });
        model.update(Object.create(null, {
          foo: {
            value: 2,
            enumerable: false
          }
        }));
        expect(model.get('foo')).to.equal(1);
      });

      context("when there are changes", function () {

        it("should return true", function () {
          expect(model.update({ foo: 1 })).to.be.true;
        });

        it("should update the changed attributes", function () {
          model.update({ bar: 1 });
          expect(model.get('bar')).to.equal(1);
        });

        it("should validate the updated model", function () {
          var spy = sinon.stub(model, '_validate', function (errors) {
            expect(Object.getPrototypeOf(errors)).to.be.null;
            expect(this.get('foo')).to.equal(1);
          });
          model.update({ foo: 1 });
          expect(spy).to.be.called;
        });

        it("should publish on channel 'change'", function () {
          var spy = sinon.spy(model.publisher, 'publish');
          model.update({ foo: 1 });
          expect(spy).to.be.calledWith('change', sinon.match.same(model));
        });

        it("should publish on channel 'update' with a mapping of attribute names to their old value", function () {
          model.update({ foo: 1 });
          var spy = sinon.spy(model.publisher, 'publish');
          model.update({ foo: 2 });
          expect(spy).to.be.calledWith(
            'update',
            sinon.match.same(model),
            { foo: 1 });
        });

        it("should publish on channel 'update:{attribute}' for each changed attribute with its old value", function () {
          model.update({ foo: 1 });
          var spy = sinon.spy(model.publisher, 'publish');
          model.update({ foo: 2 });
          expect(spy).to.be.calledWith(
            'update:foo',
            sinon.match.same(model),
            1);
        });

        it("should publish on channel 'change:{attribute}' for each changed attribute with its old value", function () {
          model.update({ foo: 1 });
          var spy = sinon.spy(model.publisher, 'publish');
          model.update({ foo: 2 });
          expect(spy).to.be.calledWith(
            'change:foo',
            sinon.match.same(model));
        });

        context("when validation succeeds", function () {

          [
            [ 'undefined', undefined ],
            [ 'null', null ],
            [ 'zero', 0 ],
            [ 'an empty string', '' ]
          ].forEach(function (pair) {

            var name = pair[0];
            var value = pair[1];

            it("should handle " + name + " as error message as no error", function () {
              model._validate = function (errors) {
                errors.foo = value;
                return true;
              };
              model.update({ foo: 1 });
              expect(model.error('foo')).to.be.undefined;
            });

          });

          it("should construct a new #object when the model is valid", function () {
            var spy = sinon.spy(model, '_construct');
            model.update({ foo: 1 });
            expect(spy).to.have.returned(sinon.match.same(model.object));
          });

          it("should construct a new #object when the model is externally invalid", function () {
            var spy = sinon.spy(model, '_construct');
            model.updateExternalErrors({ bar: 'error' });
            model.update({ foo: 1 });
            expect(spy).to.have.returned(sinon.match.same(model.object));
          });

          it("should publish on channel 'valid' when the model becomes valid", function () {
            model._validate = fail({ foo: 'error' });
            model.update({ foo: 1 });
            model._validate = returns(true);
            var spy = sinon.spy(model.publisher, 'publish');
            model.update({ foo: 2 });
            expect(spy).to.be.calledWith('valid', sinon.match.same(model));
          });

          it("should not publish on channel 'valid' when the model still has external errors", function () {
            model.updateExternalErrors({ foo: 'external error' });
            var spy = sinon.spy(model.publisher, 'publish');
            model.update({ foo: 1 });
            expect(spy).to.not.be.calledWith('valid');
          });

          context("when an attribute becomes internally valid", function () {

            it("should publish on channel 'valid:{attribute}' when the attribute has an internal error", function () {
              model._validate = fail({ foo: 'error' });
              model.update({ foo: 1 });
              model._validate = returns(true);
              var spy = sinon.spy(model.publisher, 'publish');
              model.update({ foo: 2 });
              expect(spy).to.be.calledWith('valid:foo', sinon.match.same(model));
            });

            it("should not publish on channel 'valid:{attribute}' when the attribute has an external error", function () {
              model.updateExternalErrors({ foo: 'external error' });
              var spy = sinon.spy(model.publisher, 'publish');
              model.update({ foo: 1 });
              expect(spy).to.not.be.calledWith('valid:foo');
            });

          });

        });

        context("when validation fails", function () {

          it("should set #object to undefined", function () {
            model._validate = fail({ foo: 'error' });
            model.update({ foo: 1 });
            expect(model.object).to.be.null;
          });

          it("should publish on channel 'invalid' when the model becomes invalid", function () {
            model._validate = fail({ foo: 'error' });
            var spy = sinon.spy(model.publisher, 'publish');
            model.update({ foo: 1 });
            expect(spy).to.be.calledWith('invalid', sinon.match.same(model));
          });

          it("should not publish on channel 'invalid' when the model already was invalid", function () {
            model._validate = fail({ foo: 'error' });
            model.update({ foo: 1 });
            var spy = sinon.spy(model.publisher, 'publish');
            model._validate = fail({ foo: 'different error' });
            model.update({ foo: 2 });
            expect(spy).to.not.be.calledWith('invalid');
          });

          context("when another attribute becomes invalid", function () {

            it("should publish on channel 'invalid:{attribute}'", function () {
              model._validate = fail({ bar: 'error' });
              var spy = sinon.spy(model.publisher, 'publish');
              model.update({ foo: 1 });
              expect(spy).to.be.calledWith('invalid:bar', sinon.match.same(model));
            });

            it("should publish on channel 'change:{attribute}'", function () {
              model._validate = fail({ bar: 'error' });
              var spy = sinon.spy(model.publisher, 'publish');
              model.update({ foo: 1 });
              expect(spy).to.be.calledWith('change:bar', sinon.match.same(model));
            });

          });

          context("when an attribute stays invalid", function () {

            context("when its internal error changes", function () {

              it("should publish on channel 'invalid:{attribute}'", function () {
                model._validate = fail({ foo: 'error' });
                model.update({ foo: 1 });
                var spy = sinon.spy(model.publisher, 'publish');
                model._validate = fail({ foo: 'different error' });
                model.update({ foo: 2 });
                expect(spy).to.be.calledWith('invalid:foo', sinon.match.same(model));
              });

              it("should publish on channel 'change:{attribute}'", function () {
                model._validate = fail({ foo: 'error' });
                model.update({ foo: 1 });
                var spy = sinon.spy(model.publisher, 'publish');
                model._validate = fail({ foo: 'different error' });
                model.update({ foo: 2 });
                expect(spy).to.be.calledWith('change:foo', sinon.match.same(model));
              });

            });

            context("when its internal error is the same as its external error", function () {

              it("should not publish on channel 'invalid:{attribute}'", function () {
                model.updateExternalErrors({ foo: 'error' });
                var spy = sinon.spy(model.publisher, 'publish');
                model._validate = fail({ foo: 'error' });
                model.update({ foo: 1 });
                expect(spy).to.not.be.calledWith('invalid:foo');
              });

              it("should properly set its internal error", function () {
                model.updateExternalErrors({ foo: 'error' });
                model._validate = fail({ foo: 'error' });
                model.update({ foo: 1 });
                expect(bind(model, 'updateExternalErrors', { foo: true }))
                  .to.throw("cannot update external errors when there are internal errors");
              });

            });

          });

        });

        context("when an attribute's old value responds to .publisher", function () {

          var sub;
          var publisher;

          beforeEach(function () {
            publisher = Publisher.create();
            sub = { publisher: publisher };
          });

          it("should unsubscribe from the publisher's 'change' channel", function (done) {
            model.update({ foo: sub });
            model.update({ foo: null });
            var obj = model.object;
            var spy = sinon.spy(model.publisher, 'publish');
            publisher.publish('change');
            async(function () {
              expect(model.object).to.equal(obj);
              expect(spy).to.not.be.calledWith('change', sinon.match.same(model));
              done();
            });
          });

          it("should detach all subscriptions based on .attributes[name].channels", function (done) {
            var spy = sandbox.spy(DerivedModel.attributes.foo.channels, 'xyz');
            model.update({ foo: sub });
            model.update({ foo: null });
            publisher.publish('xyz');
            async(function () {
              expect(spy).to.not.be.called;
              done();
            });
          });

        });

        context("when an attribute's new value responds to .publisher", function () {

          var sub;
          var publisher;

          beforeEach(function () {
            publisher = Publisher.create();
            sub = { publisher: publisher };
          });

          it("should subscribe to that publisher's 'destroy' channel", function () {
            var spy = sinon.spy(publisher, 'subscribe');
            model.update({ foo: sub });
            expect(spy).to.be.calledWith('destroy');
          });

          it("should subscribe to that publisher's 'change' channel", function () {
            var spy = sinon.spy(publisher, 'subscribe');
            model.update({ foo: sub });
            expect(spy).to.be.calledWith('change');
          });

          context("when there are channels defined under .attributes[name].channels", function () {

            it("should attach to the defined channels", function () {
              var spy = sinon.spy(publisher, 'subscribe');
              model.update({ foo: sub });
              expect(spy).to.be.calledWith('xyz',
                DerivedModel.attributes.foo.channels.xyz);
            });

            it("should ignore inherited properties", function () {
              var spy = sinon.spy(publisher, 'subscribe');
              model.update({ foo: sub });
              expect(spy).to.not.be.calledWith('inherited');
            });

            it("should ignore non-enumerable properties", function () {
              var spy = sinon.spy(publisher, 'subscribe');
              model.update({ foo: sub });
              expect(spy).to.not.be.calledWith('nonEnumerable');
            });

          });

          context("when that publisher publishes on channel 'destroy'", function () {

            beforeEach(function () {
              model.update({ foo: sub });
            });

            it("should set the attribute value to null", function (done) {
              var spy = sinon.spy(model, 'update');
              publisher.publish('destroy');
              async(function () {
                expect(spy).to.be.calledWith({ foo: null });
                done();
              });
            });

          });

          context("when that publisher publishes on channel 'change'", function () {

            beforeEach(function () {
              model.update({ foo: sub });
            });

            it("should publish on channel 'change'", function (done) {
              var spy = sinon.spy(model.publisher, 'publish');
              publisher.publish('change');
              async(function () {
                expect(spy).to.be.calledWith('change', sinon.match.same(model));
                done();
              });
            });

            it("should construct a new #object when the model is valid", function (done) {
              var spy = sinon.spy(model, '_construct');
              publisher.publish('change');
              async(function () {
                expect(spy).to.have.returned(sinon.match.same(model.object));
                done();
              });
            });

            it("should construct a new #object when the model is only externally invalid", function (done) {
              var spy = sinon.spy(model, '_construct');
              model.updateExternalErrors({ bar: 'error' });
              publisher.publish('change');
              async(function () {
                expect(spy).to.have.returned(sinon.match.same(model.object));
                done();
              });
            });

            it("should not construct a new #object when the model is internally invalid", function (done) {
              publisher.publish('change');
              model._validate = fail({ bar: 'error' });
              model.update({ bar: 1 });
              async(function () {
                expect(model.object).to.be.null;
                done();
              });
            });

            it("should validate the updated model", function (done) {
              var spy = sinon.stub(model, '_validate', function (errors) {
                expect(Object.getPrototypeOf(errors)).to.be.null;
              });
              publisher.publish('change');
              async(function () {
                expect(spy).to.be.called;
                done();
              });
            });

            context("when validation succeeds", function () {

              [
                [ 'undefined', undefined ],
                [ 'null', null ],
                [ 'zero', 0 ],
                [ 'an empty string', '' ]
              ].forEach(function (pair) {

                var name = pair[0];
                var value = pair[1];

                it("should handle " + name + " as error message as no error", function (done) {
                  model._validate = function (errors) {
                    errors.foo = value;
                    return true;
                  };
                  publisher.publish('change');
                  async(function () {
                    expect(model.error('foo')).to.be.undefined;
                    done();
                  });
                });

              });

              it("should construct a new #object when the model is valid", function (done) {
                var spy = sinon.spy(model, '_construct');
                publisher.publish('change');
                async(function () {
                  expect(spy).to.have.returned(sinon.match.same(model.object));
                  done();
                });
              });

              it("should construct a new #object when the model is externally invalid", function (done) {
                var spy = sinon.spy(model, '_construct');
                model.updateExternalErrors({ bar: 'error' });
                publisher.publish('change');
                async(function () {
                  expect(spy).to.have.returned(sinon.match.same(model.object));
                  done();
                });
              });

              it("should publish on channel 'valid' when the model becomes valid", function (done) {
                model._validate = fail({ bar: 'error' });
                model.update({ bar: 1 });
                model._validate = returns(true);
                var spy = sinon.spy(model.publisher, 'publish');
                publisher.publish('change');
                async(function () {
                  expect(spy).to.be.calledWith('valid', sinon.match.same(model));
                  done();
                });
              });

              it("should not publish on channel 'valid' when the model still has external errors", function (done) {
                model.updateExternalErrors({ foo: 'external error' });
                var spy = sinon.spy(model.publisher, 'publish');
                publisher.publish('change');
                async(function () {
                  expect(spy).to.not.be.calledWith('valid');
                  done();
                });
              });

              context("when an attribute becomes internally valid", function () {

                it("should publish on channel 'valid:{attribute}' when the attribute has an internal error", function (done) {
                  model._validate = fail({ bar: 'error' });
                  model.update({ bar: 1 });
                  model._validate = returns(true);
                  var spy = sinon.spy(model.publisher, 'publish');
                  publisher.publish('change');
                  async(function () {
                    expect(spy).to.be.calledWith('valid:bar', sinon.match.same(model));
                    done();
                  });
                });

                it("should not publish on channel 'valid:{attribute}' when the attribute has an external error", function (done) {
                  model.updateExternalErrors({ foo: 'external error' });
                  var spy = sinon.spy(model.publisher, 'publish');
                  publisher.publish('change');
                  async(function () {
                    expect(spy).to.not.be.calledWith('valid:foo');
                    done();
                  });
                });

              });

            });

            context("when validation fails", function () {

              beforeEach(function () {
                sub.isValid = returns(false);
              });

              it("should set #object to undefined", function (done) {
                model._validate = fail({ foo: 'error' });
                publisher.publish('change');
                async(function () {
                  expect(model.object).to.be.null;
                  done();
                });
              });

              it("should publish on channel 'invalid' when the model becomes invalid", function (done) {
                model._validate = fail({ foo: 'error' });
                var spy = sinon.spy(model.publisher, 'publish');
                publisher.publish('change');
                async(function () {
                  expect(spy).to.be.calledWith('invalid', sinon.match.same(model));
                  done();
                });
              });

              it("should not publish on channel 'invalid' when the model already was invalid", function (done) {
                model._validate = fail({ foo: 'error' });
                model.update({ bar: 1 });
                var spy = sinon.spy(model.publisher, 'publish');
                publisher.publish('change');
                async(function () {
                  expect(spy).to.not.be.calledWith('invalid');
                  done();
                });
              });

              it("should publish on channel 'invalid:{attribute}' when an attribute becomes invalid", function (done) {
                model._validate = fail({ bar: 'error' });
                var spy = sinon.spy(model.publisher, 'publish');
                publisher.publish('change');
                async(function () {
                  expect(spy).to.be.calledWith('invalid:bar', sinon.match.same(model));
                  done();
                });
              });

              context("when an attribute stays invalid", function () {

                it("should publish on channel 'invalid:{attribute}' when its internal error changes", function (done) {
                  model._validate = fail({ bar: 'error' });
                  model.update({ bar: 1 });
                  var spy = sinon.spy(model.publisher, 'publish');
                  model._validate = fail({ bar: 'different error' });
                  publisher.publish('change');
                  async(function () {
                    expect(spy).to.be.calledWith('invalid:bar', sinon.match.same(model));
                    done();
                  });
                });

                context("when its internal error is the same as its external error", function () {

                  it("should not publish on channel 'invalid:{attribute}'", function (done) {
                    model.updateExternalErrors({ bar: 'error' });
                    var spy = sinon.spy(model.publisher, 'publish');
                    model._validate = fail({ bar: 'error' });
                    publisher.publish('change');
                    async(function () {
                      expect(spy).to.not.be.calledWith('invalid:foo');
                      done();
                    });
                  });

                  it("should properly set its internal error", function (done) {
                    model.updateExternalErrors({ bar: 'error' });
                    model._validate = fail({ bar: 'error' });
                    publisher.publish('change');
                    async(function () {
                      expect(bind(model, 'updateExternalErrors', { bar: true }))
                        .to.throw("cannot update external errors when there are internal errors");
                      done();
                    });
                  });

                });

              });

            });

          });

        });

      });

    });

    describe('#updateExternalErrors()', function () {

      var model;

      beforeEach(function () {
        model = DerivedModel.create();
      });

      it("should ignore inherited properties", function () {
        model.updateExternalErrors(Object.create({ foo: 'error' }));
        expect(model.error('foo')).to.be.undefined;
      });

      it("should not publish on channel 'change' when no external error changes", function () {
        model.updateExternalErrors({ foo: 'external error' });
        var spy = sinon.spy(model.publisher, 'publish');
        model.updateExternalErrors({ foo: 'external error' });
        expect(spy).to.not.be.calledWith('change');
      });

      context("when internally invalid", function () {

        beforeEach(function () {
          model._validate = fail({ foo: 'error' });
          model.update({ foo: 1 });
        });

        it("should reject when any given attribute has an internal error", function () {
          expect(bind(model, 'updateExternalErrors', { foo: 'external error' }))
            .to.throw("cannot update external errors when there are internal errors");
        });

        it("should allow attributes with no internal error", function () {
          model.updateExternalErrors({ bar: 'external error' });
          expect(model.error('bar')).to.equal('external error');
        });

      });

      context("when an attribute's external error changes", function () {

        it("should set the attribute's external error", function () {
          model.updateExternalErrors({ foo: 'external error' });
          expect(model.error('foo')).to.equal('external error');
        });

        it("should publish on channel 'change'", function () {
          var spy = sinon.spy(model.publisher, 'publish');
          model.updateExternalErrors({ foo: 'external error' });
          expect(spy).to.be.calledWith('change', sinon.match.same(model));
        });

        context("when the attribute becomes valid", function () {

          beforeEach(function () {
            model.updateExternalErrors({ foo: 'external error' });
          });

          [
            [ 'undefined', undefined ],
            [ 'null', null ],
            [ 'zero', 0 ],
            [ 'an empty string', '' ]
          ].forEach(function (pair) {

            var name = pair[0];
            var value = pair[1];

            it("should handle " + name + " as error message as no error", function () {
              model.updateExternalErrors({ foo: value });
              expect(model.error('foo')).to.be.undefined;
            });

          });

          it("should publish on channel 'valid:{attribute}'", function () {
            var spy = sinon.spy(model.publisher, 'publish');
            model.updateExternalErrors({ foo: undefined });
            expect(spy).to.be.calledWith('valid:foo', sinon.match.same(model));
          });

          it("should publish on channel 'valid' when the model becomes valid", function () {
            var spy = sinon.spy(model.publisher, 'publish');
            model.updateExternalErrors({ foo: undefined });
            expect(spy).to.be.calledWith('valid', sinon.match.same(model));
          });

        });

        context("when the attribute becomes invalid", function () {

          it("should publish on channel 'invalid:{attribute}'", function () {
            var spy = sinon.spy(model.publisher, 'publish');
            model.updateExternalErrors({ foo: 'error' });
            expect(spy).to.be.calledWith('invalid:foo', sinon.match.same(model));
          });

          it("should publish on channel 'invalid' when the model becomes invalid", function () {
            var spy = sinon.spy(model.publisher, 'publish');
            model.updateExternalErrors({ foo: 'error' });
            expect(spy).to.be.calledWith('invalid', sinon.match.same(model));
          });

        });

      });

    });

    describe('#_validate()', function () {

      var model;

      beforeEach(function () {
        model = DerivedModel.create();
      });

      it("should ignore attribute values that do not respond to .isValid()", function () {
        var e = {};
        model._validate(e);
        expect(e).to.be.empty;
      });

      context("when an attribute's value responds to .isValid", function () {

        var m;

        beforeEach(function () {
          m = {};
          model.update({ foo: m });
        });

        it("should ignore when non-callable", function () {
          m.isValid = true;
          var e = {};
          model._validate(e);
          expect(e).to.be.empty;
        });

        context("when callable", function () {

          it("should should use true as error when .isValid() returns falsy", function () {
            m.isValid = returns(false);
            var e = {};
            model._validate(e);
            expect(e).to.have.property('foo', true);
          });

          it("should should use false as error when .isValid() returns truthy", function () {
            m.isValid = returns(true);
            var e = {};
            model._validate(e);
            expect(e).to.have.property('foo', false);
          });

        });

      });

    });

  });

});
