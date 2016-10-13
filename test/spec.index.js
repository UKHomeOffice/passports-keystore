'use strict';

const chai = require('chai');
chai.should();

const Keystore = require('../index');

describe('Keystore', function () {
    let req;

    beforeEach( () => {
        req = {
            session: {
                keystore: {}
            }
        };
    });

    it('should be a class', () => {
        Keystore.should.be.a('function');
    });

    it('should create an instance of Keystore', () => {
        let keystore = new Keystore(req, 'name');
        keystore.should.be.an('object');
        keystore.should.be.instanceof(Keystore);
    });

    it('should throw an error if req is null', () => {
        (() => {
            new Keystore(null, 'name');
        }).should.throw();
    });

    it('should throw an error if req.session is null', () => {
        (() => {
            new Keystore({}, 'name');
        }).should.throw();
    });

    it('should throw an error if a name is not given', () => {
        req = { session: {} };
        (() => {
            new Keystore(req);
        }).should.throw();
    });

    it('should create the keystore location if it doesnt exist', () => {
        req = { session: {} };
        new Keystore(req, 'name');
        req.session.keystore.should.be.an('object');
        req.session.keystore.should.deep.equal({});
    });

    describe('getValue', function () {

        it('should return null if the keystore item doesnt exist', () => {
            let keystore = new Keystore(req, 'name');
            chai.expect(keystore.getValue()).to.be.null;
        });

        it('should return a deep copy of the named keystore value', () => {
            req.session.keystore.name = { foo: 'bar' };
            let keystore = new Keystore(req, 'name');
            let value = keystore.getValue();
            value.should.deep.equal({ foo: 'bar' });
            value.should.deep.equal(req.session.keystore.name);
            value.should.not.equal(req.session.keystore.name);
        });

    });

    describe('setValue', function () {

        it('should clear keystore item if set to null', () => {
            req.session.keystore.name = { foo: 'bar' };
            req.session.keystore.other = { boo: 'baz' };
            let keystore = new Keystore(req, 'name');
            keystore.setValue(null);
            req.session.keystore.should.not.include.keys('name');
            req.session.keystore.should.include.keys('other');
        });

        it('should set the named keystore value to a deep copy of value', () => {
            let keystore = new Keystore(req, 'name');
            let value = { foo: 'bar' };
            keystore.setValue(value);
            req.session.keystore.name.should.deep.equal({ foo: 'bar' });
            req.session.keystore.name.should.deep.equal(value);
            req.session.keystore.name.should.not.equal(value);
        });

        it('should throw if given object is not an object', () => {
            let keystore = new Keystore(req, 'name');

            (() => {
                keystore.setValue(undefined);
            }).should.throw();

            (() => {
                keystore.setValue('string');
            }).should.throw();

            (() => {
                keystore.setValue('number');
            }).should.throw();
            (() => {
                keystore.setValue(['array']);
            }).should.throw();
        });
    });

    describe('clear', function () {

        it('should clear keystore item', () => {
            req.session.keystore.name = { foo: 'bar' };
            req.session.keystore.other = { boo: 'baz' };
            let keystore = new Keystore(req, 'name');
            keystore.clear();
            req.session.keystore.should.not.include.keys('name');
            req.session.keystore.should.include.keys('other');
        });

    });

    describe('toJSON', function () {

        it('should return that same value as getValue', () => {
            req.session.keystore.name = { foo: 'bar' };
            let keystore = new Keystore(req, 'name');
            keystore.toJSON().should.deep.equal(keystore.getValue());
        });

    });

});
