var plugin = require('../index.js'),
	expect = require('chai').expect,
	sinon = require('sinon'),
	Vinyl = require('vinyl')
	mavenDeploy = require('maven-deploy');

describe('gulp-maven-deploy plugin', function() {

	var fileA, fileB;

	beforeEach(function() {
		sinon.stub(mavenDeploy, 'config')
		sinon.stub(mavenDeploy, 'deploy')

		fileA = new Vinyl({
			cwd: "/home/jdoe/gulp-maven-deploy/",
			base: "/home/jdoe/gulp-maven-deploy/test",
			path: "/home/jdoe/gulp-maven-deploy/test/fileA.txt",
			contents: new Buffer('some content of file A')
		});

		fileB = new Vinyl({
			cwd: "/home/jdoe/gulp-maven-deploy/",
			base: "/home/jdoe/gulp-maven-deploy/test",
			path: "/home/jdoe/gulp-maven-deploy/test/fileB.txt",
			contents: new Buffer('some content of file B')
		});
	});

	afterEach(function() {
		mavenDeploy.config.restore();
		mavenDeploy.deploy.restore();
	});

	describe('deploy method', function() {

		it('is a function', function() {
			expect(plugin).to.have.property('deploy').that.is.a('function');
		});

		it('throws error if no config was given', function() {
			expect(function() {
				plugin.deploy();
			}).to.throw('Missing required property "config" object');
		});

		it('passes processed config to maven-deploy module', function() {
			var expectedConfig = {
				'finalName': 'myPackage.war',
				'groupId': 'com.mygroup',
				'type': 'war',
				'repositories': [{
					'id': 'some-repo-id',
					'url': 'http://some-repo/url'
				}]
			};

			var stream = plugin.deploy({config: expectedConfig});

			stream.write(fileA);
			stream.end();

			expect(mavenDeploy.config).to.be.calledWith(expectedConfig);
		});

		it('calls deploy function of maven-deploy for each piped file', function() {
			var expectedConfig = {
				'finalName': 'myPackage.war',
				'groupId': 'com.mygroup',
				'type': 'war',
				'repositories': [{
					'id': 'some-repo-id',
					'url': 'http://some-repo/url'
				}]
			};

			// Call install callback with no error
			mavenDeploy.deploy.yields(null);

			var stream = plugin.deploy({config: expectedConfig});

			stream.write(fileA);
			stream.write(fileB);
			stream.end();

			expect(mavenDeploy.deploy).to.be.calledTwice;
			expect(mavenDeploy.deploy).to.be.calledWith(expectedConfig.repositories[0].id);
			expect(mavenDeploy.deploy).to.be.calledWith(expectedConfig.repositories[0].id);
		});

		it('calls deploy function of maven-deploy for each configured repository');

		it('throws error if any configured repository id missing id or url property');
	})
})