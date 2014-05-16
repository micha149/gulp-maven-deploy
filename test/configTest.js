var referee = require('referee');
var gmd = require('../index');

describe('Gulp Maven Deploy plugin', function(){
	var assert = referee.assert;
	var refute = referee.refute;

	it('should expose install and deploy functions', function(){
		assert.isObject(gmd);
		assert.isFunction(gmd.install);
		assert.isFunction(gmd.deploy);
	});

	describe('Required configuration', function(){
		var emptyConfig = {};

		it('should throw error on missing "config" property', function () {
			allFunctions(function (fn) {
				assert.exception(function(){
					fn({});
				}, 'Error', 'Missing required property "config" object.');
			});
		});
		it('should require "config" to be an object', function(){
			allFunctions(function (fn) {
				fn({'config': {}});
			}, 'Error', 'fuck you');
		});
	});

	describe('Install', function(){
		it('should provide a install function', function(){
			assert.isFunction(gmd.install);
		});
	});

	describe('Deploy', function(){
		it('should provide a deploy function', function(){
			assert.isFunction(gmd.deploy);
		});
	});

	function allFunctions (testFunction) {
		testFunction(gmd.install.bind(gmd));
		testFunction(gmd.deploy.bind(gmd));
	}

});
