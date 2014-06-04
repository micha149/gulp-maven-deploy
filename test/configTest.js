var referee = require('referee');
var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');
var gmdp = require('../index');
var pkg = require('../package');

describe('Gulp Maven Deploy plugin', function() {
	var assert = referee.assert;
	var refute = referee.refute;

	if (!fs.existsSync('./dist')) {
		fs.mkdirSync('./dist');
	}

	it('should expose install and deploy functions', function() {
		assert.isObject(gmdp);
		assert.isFunction(gmdp.install);
		assert.isFunction(gmdp.deploy);
	});

	describe('Required configuration', function() {
		var emptyConfig = {};

		it('should throw error on missing "config" property', function() {
			allFunctions(function(fn) {
				assert.exception(function() {
					fn({});
				}, 'Error', 'Missing required property "config" object.');
			});
		});
	});

	describe('Install', function() {
		it('should provide a install function', function() {
			assert.isFunction(gmdp.install);
		});
		it('should require a config object with a repositories section to be configured', function(done) {
			var stream = gmdp.install({
				'config': {
					'finalName': '' + pkg.name,
					'groupId': 'com.mygroup',
					'type': 'war'
				}
			}, function(err) {
				assert.isNull(err);
				done();
			});
			stream.write();
		});
	});

	describe('Deploy', function() {
		it('should provide a deploy function', function() {
			assert.isFunction(gmdp.deploy);
		});
		it('should require a config object with a repositories section to be configured', function(done) {
			var stream = gmdp.deploy({
				'config': {
					'finalName': '' + pkg.name,
					'groupId': 'com.mygroup',
					'type': 'war',
					'repositories': [{
						'id': 'some-repo-id',
						'url': 'http://some-repo/url'
					}]
				}
			}, function(err) {
				assert.isNull(err);
				done();
			});
			stream.write();
		});
	});

	function allFunctions(testFunction) {
		testFunction(gmdp.install.bind(gmdp));
		testFunction(gmdp.deploy.bind(gmdp));
	}

});