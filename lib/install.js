var through = require('through2'),
    gmd = require('maven-deploy');

module.exports = function install(options) {

    var stream = through.obj(function (file, enc, cb) {
        gmd.config(options);
        gmd.install(cb);
    });

    return stream;
};
