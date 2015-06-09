var plugin = require('../index.js'),
    expect = require('chai').expect,
    sinon = require('sinon'),
    Vinyl = require('vinyl'),
    mavenDeploy = require('maven-deploy');

describe('gulp-maven-deploy plugin', function () {

    var fileA, fileB, testConfig;

    beforeEach(function () {
        sinon.stub(mavenDeploy, 'config');
        sinon.stub(mavenDeploy, 'deploy');

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
            'groupId': 'com.mygroup',
            'type': 'war',
            'repositories': [{
                'id': 'some-repo-id',
                'url': 'http://some-repo/url'
            }]
        };
    });

    afterEach(function () {
        mavenDeploy.config.restore();
        mavenDeploy.deploy.restore();
    });

    describe('deploy method', function () {

        it('is a function', function () {
            expect(plugin).to.have.property('deploy').that.is.a('function');
        });

        it('throws error if no config was given', function () {
            expect(function () {
                plugin.deploy();
            }).to.throw('Missing required property "config" object');
        });

        it('passes processed config to maven-deploy module', function () {
            var stream = plugin.deploy({config: testConfig});

            stream.write(fileA);
            stream.end();

            expect(mavenDeploy.config).to.be.calledWith(testConfig);
        });

        it('calls deploy function of maven-deploy for each piped file', function () {
            // Call install callback with no error
            mavenDeploy.deploy.yields(null);

            var stream = plugin.deploy({config: testConfig});

            stream.write(fileA);
            stream.write(fileB);
            stream.end();

            expect(mavenDeploy.deploy).to.be.calledTwice;
            expect(mavenDeploy.deploy).to.be.calledWith(testConfig.repositories[0].id);
            expect(mavenDeploy.deploy).to.be.calledWith(testConfig.repositories[0].id);
        });

        it('calls callback with null if deploy is done', function(done) {
            var spy = sinon.spy(),
                stream = plugin.deploy({config: testConfig}, spy);

            // Call install callback with no error
            mavenDeploy.deploy.yields(null);

            stream.write(fileA);
            stream.write(fileB);

            expect(spy).not.to.be.called;

            stream.end();

            process.nextTick(function() {
                expect(spy).to.be.calledOnce.and.calledWith(null);
                done();
            });
        });

        it('calls callback with error if an error occurs', function(done) {
            var spy = sinon.spy(),
                expectedError = 'An error occured',
                stream = plugin.deploy({config: testConfig}, spy);

            // Call install callback with no error
            mavenDeploy.deploy.yields(expectedError);

            stream.write(fileA);
            stream.end();

            process.nextTick(function() {
                expect(spy).to.be.calledOnce.and.calledWith(expectedError);
                done()
            });
        });

        it('calls deploy function of maven-deploy for each configured repository', function() {
            mavenDeploy.deploy.yields(null);

            testConfig.repositories.push({
                id: 'another-repo-id',
                url: 'http://another-repo/url'
            });

            var stream = plugin.deploy({config: testConfig});

            stream.write(fileA);
            stream.end();

            expect(mavenDeploy.deploy).to.be.calledTwice;
            expect(mavenDeploy.deploy).to.be.calledWith(testConfig.repositories[0].id);
            expect(mavenDeploy.deploy).to.be.calledWith(testConfig.repositories[1].id);
        });

        it('throws error if any configured repository id missing id or url property', function() {
            
        });
    })
});
