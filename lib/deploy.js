var util = require('./util'),
    through = require('through2'),
    gmd = require('maven-deploy'),
    async = require('async');

module.exports = function deploy(options, callback) {

    if (!util.hasValidConfig(options)) {
        throw new Error('Missing required property "config" object.');
    }

    callback = callback || function() {};

    var stream = through.obj(function (file, enc, fileDone) {
        gmd.config(options.config);

        if (!options.config.hasOwnProperty('repositories')) {
            throw new Error('Missing repositories configuration');
        }

        async.each(options.config.repositories, function (repo, repoDone) {
            if (!repo.hasOwnProperty('id') || !repo.hasOwnProperty('url')) {
                throw new Error('Deploy required "id" and "url".');
            }
            gmd.deploy(repo.id, options.config.snapshot, repoDone);
        }, fileDone);
    });

    stream.on('finish', function() {
        callback(null);
    });

    stream.on('error', function(err) {
        callback(err);
    });

    return stream;
};
