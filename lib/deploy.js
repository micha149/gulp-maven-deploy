var util = require('./util'),
    through = require('through2'),
    gmd = require('maven-deploy');

module.exports = function deploy(options, callback) {
    if (util.hasValidConfig(options)) {
        return through.obj(function (file, enc, cb) {
            gmd.config(options.config);
            if (!options.config.hasOwnProperty('repositories')) {
                throw new Error('Missing repositories configuration');
            }
            options.config.repositories.forEach(function (repo) {
                if (!repo.hasOwnProperty('id') || !repo.hasOwnProperty('url')) {
                    throw new Error('Deploy required "id" and "url".');
                }
                gmd.deploy(repo.id, options.config.snapshot, function (err) {
                    if (cb) {
                        cb(err);
                    }
                });
                if (callback) {
                    callback(null);
                }
            });
        });
    }
};
