'use strict';
var through = require('through2');
var gmd = require('maven-deploy');

var deploy = function(remote, options){
	options = options || {};
	if (!options.hasOwnProperty('config') || typeof options.config !== 'object') {
		throw new Error('Missing required property "config" object.');
	}

	return through.obj(function (file, enc, cb) {
		gmd.config(options.config);
		if (options.hasOwnProperty('deploy')){
			if (!options.hasOwnProperty('repositoryId') || !options.hasOwnProperty('snapshot')){
				throw new Error('Deploy required "repositoryId" and "snapshot".')
			}
			gmd.deploy(options.repositoryId, options.snapshot);
		} else {
			gmd.install();
		}
	});
};

module.exports.deploy = deploy.bind(null, true);

module.exports.install = deploy.bind(null, false);
