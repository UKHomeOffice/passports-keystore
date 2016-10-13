'use strict';

const deepclone = require('deepclone');

const SESSION_LOCATION = 'keystore';

class Keystore {
    constructor(req, name) {
        if (!req) {
            throw new Error('Request not specified');
        }
        if (!req.session) {
            throw new Error('Session not available');
        }
        if (!name) {
            throw new Error('Name not specified');
        }

        this.location = req.session[SESSION_LOCATION];

        if (!this.location) {
            this.location = req.session[SESSION_LOCATION] = {};
        }

        this.name = name;
    }

    clear() {
        delete this.location[this.name];
    }

    setValue(value) {
        if (value === null) {
            return this.clear();
        }

        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            throw new Error('Value is not an object');
        }

        this.location[this.name] = deepclone(value);
    }

    getValue() {
        if (this.location[this.name]) {
            return deepclone(this.location[this.name]);
        }
        return null;
    }

    toJSON() { return this.getValue(); }
}

module.exports = Keystore;
