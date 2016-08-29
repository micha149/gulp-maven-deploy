var plugin = require('../index.js'),
    expect = require('chai').expect,
    sinon = require('sinon'),
    Vinyl = require('vinyl'),
    mavenDeploy = require('maven-deploy'),
    assign = require('lodash.assign'),
    fs = require('fs');

/* globals describe: false, it: false, beforeEach: false, afterEach: false */

describe('gulp-maven-deploy plugin', function () {

    var fileA, fileB, testConfig;

    beforeEach(function () {
        sinon.stub(mavenDeploy, 'config');
        sinon.stub(mavenDeploy, 'install');
        mavenDeploy.install.yields(null);

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

        testConfig = {
            'finalName': 'myPackage.war',
            'groupId': 'com.mygroup'
        };
    });

    afterEach(function () {
        mavenDeploy.config.restore();
        mavenDeploy.install.restore();
    });

    describe('install method', function () {

        it('is a function', function () {
            expect(plugin).to.have.property('install').that.is.a('function');
        });

        it('passes processed config to maven-deploy module', function (done) {
            var expectedConfig = {
                'finalName': 'myName.war',
                'groupId': 'com.mygroup',
            };

            var stream = plugin.install(expectedConfig);

            stream.on('finish', function() {
                expect(mavenDeploy.config).to.be.calledWith(sinon.match(expectedConfig));
                done();
            });

            stream.write(fileA);
            stream.end();
        });

        it('uses file extension as package type', function (done) {
            var stream = plugin.install(testConfig);
            var expectedOptions = {
                type: 'txt'
            };

            stream.on('finish', function() {
                expect(mavenDeploy.config).to.be.calledWith(sinon.match(expectedOptions));
                done();
            });

            stream.write(fileA);
            stream.end();
        });

        it('uses file name as artifact id', function (done) {
            var stream = plugin.install(testConfig);
            var expectedOptions = {
                artifactId: 'fileA'
            };

            stream.on('finish', function() {
                expect(mavenDeploy.config).to.be.calledWith(sinon.match(expectedOptions));
                done();
            });

            stream.write(fileA);
            stream.end();
        });

        it('uses provided artifactId', function (done) {
            var config = assign({}, testConfig);
            config.artifactId = 'file';
            var stream = plugin.install(config);
            var expectedOptions = {
                artifactId: 'file'
            };

            stream.on('finish', function() {
                expect(mavenDeploy.config).to.be.calledWith(sinon.match(expectedOptions));
                done();
            });

            stream.write(fileA);
            stream.end();
        });

        it('ensures to work with old vinyl versions', function (done) {
            var stream = plugin.install(testConfig);
            var expectedOptions = {
                artifactId: 'fileA'
            };

            stream.on('finish', function() {
                expect(mavenDeploy.config).to.be.calledWith(sinon.match(expectedOptions));
                done();
            });

            var oldVinyFile = Object.create(fileA, {stem: {}});

            stream.write(oldVinyFile);
            stream.end();
        });

        it('calls install function of maven-deploy for each piped file', function (done) {
            var stream = plugin.install({});

            stream.on('finish', function() {
                expect(mavenDeploy.install).to.be.calledTwice;
                done();
            });

            stream.write(fileA);
            stream.write(fileB);
            stream.end();
        });

        it('calls install with a temporary file which has correct content', function (done) {
            var stream = plugin.install(testConfig);

            mavenDeploy.install.restore();
            sinon.stub(mavenDeploy, 'install', function(filename, fileDone) {
                fs.readFile(filename, 'utf-8', function(err, content) {
                    expect(content).to.be.equal(fileA.contents.toString());
                    fileDone(null);
                });
            });

            stream.on('finish', function() {
                done();
            });

            stream.write(fileA);
            stream.end();
        });

        it('removes temporary file when finished', function(done) {
            var stream = plugin.install(testConfig);

            stream.on('finish', function() {
                fs.stat(mavenDeploy.install.firstCall.args[0], function(error) {
                    expect(error).not.to.be.null;
                    expect(error.code).to.be.equal('ENOENT');
                    done();
                });
            });

            stream.write(fileA);
            stream.end();
        });

        it('passes files to next stream handler', function(done) {
            var stream = plugin.install(testConfig),
                spy = sinon.spy();

            stream.on('data', spy);

            stream.on('finish', function() {
                expect(spy).to.be.calledTwice;
                expect(spy).to.be.calledWith(fileA);
                expect(spy).to.be.calledWith(fileB);
                done();
            });

            stream.write(fileA);
            stream.write(fileB);
            stream.end();
        });

        it('triggers error event if deploy fails', function(done) {
            var expectedError = 'An error occured',
                stream = plugin.install({});

            // Call install callback with no error
            mavenDeploy.install.yields(expectedError);

            stream.on('error', function(error) {
                expect(error).to.be.equal(expectedError);
                done();
            });

            stream.write(fileA);
            stream.end();
        });
    });
});
