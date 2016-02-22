var util = require('./util'),
    through = require('through2'),
    gmd = require('maven-deploy'),
    async = require('async');

module.exports = function deploy(options, callback) {

    callback = callback || function() {};
    var firstError = null;

    if (!util.hasValidConfig(options)) {
        throw new Error('Missing required property "config" object.');
    }

    if (!options.config.hasOwnProperty('repositories')) {
        throw new Error('Missing repositories configuration');
    }

    options.config.repositories.forEach(function(repo) {
        if (!repo.hasOwnProperty('id') || !repo.hasOwnProperty('url')) {
            throw new Error('Deploy required "id" and "url".');
        }
    });

    var stream = through.obj(function (file, enc, fileDone) {
        async.each(options.config.repositories, function (repo, repoDone) {
            gmd.config(options.config);
            gmd.deploy(repo.id, options.config.snapshot, repoDone);
        }, fileDone);
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
