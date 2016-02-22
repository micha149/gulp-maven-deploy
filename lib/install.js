var util = require('./util'),
    through = require('through2'),
    gmd = require('maven-deploy');

module.exports = function install(options, callback) {

    if (!util.hasValidConfig(options)) {
        throw new Error('Missing required property "config" object.');
    }

    callback = callback || function() {};

    var firstError = null;

    var stream = through.obj(function (file, enc, cb) {
        gmd.config(options.config);
        gmd.install(cb);
    });

    stream.on('finish', function() {
        callback(firstError);
    });

    stream.on('error', function(err) {
        if (!firstError) {
            firstError = err;
        }
    });

    return stream;
};
