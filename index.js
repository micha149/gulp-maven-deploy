'use strict';

var gmd = require('maven-deploy');
var through = require('through2');

function hasValidConfig(options) {
	options = options || {};
	if (!options.hasOwnProperty('config') || typeof options.config !== 'object') {
		throw new Error('Missing required property "config" object.');
	}
	return true;
}

var deploy = function(options, callback) {
	if (hasValidConfig(options)) {
		return through.obj(function(file, enc, cb) {
			gmd.config(options.config);
			if (!options.config.hasOwnProperty('repositories')) {
				callback(new Error('Missing repositories configuration'));
			}
			options.config.repositories.forEach(function(repo) {
				if (!repo.hasOwnProperty('id') || !repo.hasOwnProperty('url')) {
					throw new Error('Deploy required "id" and "url".')
				}
				gmd.deploy(repo.id, repo.url);
				callback(null);
			});
		});
	}
};

var install = function(options, callback) {
	if (hasValidConfig(options)) {
		return through.obj(function(file, enc, cb) {
			gmd.config(options.config);
			gmd.install();
			if (callback) callback(null);
		});
	}
	if (callback) callback(new Error('Invalid configuration'));
}

module.exports.deploy = deploy.bind(this);
module.exports.install = install.bind(this);