var util = require('./util'),
	through = require('through2'),
	gmd = require('maven-deploy');

module.exports = function install(options, callback) {
	if (util.hasValidConfig(options)) {
		return through.obj(function(file, enc, cb) {
			gmd.config(options.config);
			gmd.install(function(err) {
				if (cb) {
					cb(err);
				}
			});
			if (callback) {
				callback(null);
			}
		});
	}
	throw new Error('Invalid configuration');
};