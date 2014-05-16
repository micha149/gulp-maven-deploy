gulp-maven-deploy
=================

A [Gulp](//gulpjs.com/) wrapper for the [maven-deploy](https://www.npmjs.org/package/maven-deploy) module.

[![Build Status](https://api.travis-ci.org/finn-no/gulp-maven-deploy.png?branch=master)](https://travis-ci.org/finn-no/gulp-maven-deploy)
[![NPM](https://nodei.co/npm/gulp-maven-deploy.png?stars=true&downloads=true)](https://npmjs.org/package/gulp-maven-deploy)


## Installing

	$ npm install gulp-maven-deploy --save-dev

## Sample usage

Task for deploying to a Maven proxy:

	gulp.task('deploy', function(){
		gulp.src('.')
		.pipe(maven.deploy({
			'config': {
				'groupId': 'com.mygroup',
				'type': 'war',
				'repositories': [
					{
						'id': 'some-repo-id',
						'url': 'http://some-repo/url'
					}
				]
			}
		}))
	});

Task running a local Maven install:

	gulp.task('deploy-local', function(){
		gulp.src('.')
		.pipe(maven.install({
			'config': {
				'groupId': 'com.mygroup',
				'type': 'war'
			}
		}))
	});

## Running tests

	$ npm test
