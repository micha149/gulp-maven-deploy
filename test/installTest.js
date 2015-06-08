var plugin = require('../index.js'),
    expect = require('chai').expect,
    sinon = require('sinon'),
    Vinyl = require('vinyl'),
    mavenDeploy = require('maven-deploy');

describe('gulp-maven-deploy plugin', function () {

    var fileA, fileB;

    beforeEach(function () {
        sinon.stub(mavenDeploy, 'config')
        sinon.stub(mavenDeploy, 'install')

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

    afterEach(function () {
        mavenDeploy.config.restore();
        mavenDeploy.install.restore();
    });

    describe('install method', function () {

        it('is a function', function () {
            expect(plugin).to.have.property('install').that.is.a('function');
        });

        it('throws error if no config was given', function () {
            expect(function () {
                plugin.install();
            }).to.throw('Missing required property "config" object');
        });

        it('passes processed config to maven-deploy module', function () {
            var expectedConfig = {
                'finalName': 'myName.war',
                'groupId': 'com.mygroup',
                'type': 'war'
            };

            var stream = plugin.install({config: expectedConfig});

            stream.write(fileA);
            stream.end();

            expect(mavenDeploy.config).to.be.calledWith(expectedConfig);
        });

        it('calls install function of maven-deploy for each piped file', function () {
            var stream = plugin.install({config: {}});

            // Call install callback with no error
            mavenDeploy.install.yields(null);

            stream.write(fileA);
            stream.write(fileB);
            stream.end();

            expect(mavenDeploy.install).to.be.calledTwice;
        });
    })
});
