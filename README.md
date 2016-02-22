gulp-maven-deploy
=================

***
**Warning** This readme contains changes for the upcoming 1.0.0 release. For using the 0.x versions, have a look into the [0.x support branch](https://github.com/micha149/gulp-maven-deploy/tree/support/0.x)
***

A [Gulp](//gulpjs.com/) wrapper for the [maven-deploy](https://www.npmjs.org/package/maven-deploy) module. Enables you to have projects which are built with Gulp, but deploys to Maven repositories.

[![Build Status](https://travis-ci.org/micha149/gulp-maven-deploy.svg?branch=master)](https://travis-ci.org/micha149/gulp-maven-deploy)
[![Dependency Status](https://david-dm.org/micha149/gulp-maven-deploy.svg)](https://david-dm.org/micha149/gulp-maven-deploy)
[![devDependency Status](https://david-dm.org/micha149/gulp-maven-deploy/dev-status.svg)](https://david-dm.org/micha149/gulp-maven-deploy#info=devDependencies)

[![NPM](https://nodei.co/npm/gulp-maven-deploy.png?stars=true&downloads=true)](https://npmjs.org/package/gulp-maven-deploy)

All the samples below requires a basic understanding of [Gulp](//gulpjs.com/) and [Maven](http://maven.apache.org/). Please look at the documentation for those projects for details.

## Installing

	$ npm install gulp-maven-deploy --save-dev

## Sample usage in a gulpfile.js

Below are two configuration samples:

Configuring a task for deploying to a Maven proxy

	var maven = require('gulp-maven-deploy');

	gulp.task('deploy', function(){
		gulp.src('.')
		.pipe(maven.deploy({
			'groupId': 'com.mygroup',
			'type': 'war',
			'repositories': [
				{
					'id': 'some-repo-id',
					'url': 'http://some-repo/url'
				}
			]
		}))
	});

A task running a local Maven install:

	var maven = require('gulp-maven-deploy');

	gulp.task('deploy-local', function(){
		gulp.src('.')
		.pipe(maven.install({
			'groupId': 'com.mygroup',
			'type': 'war'
		}))
	});

Note: A local install in Maven means it is only available on your machine. A deployment is different as it means you ship the artifact off to some remote repository.

## Upgrading from 0.x to 1.x

With `gulp-maven-deploy` version 1.0.0 we want to go one more step into the
direction of a well performing gulp plugin. ~~Following the single responsibility
principle this plugin will only perform the deploy part in the future.~~

- Remove the additional config level from `options = {config: { ... }}` to `options = { ... }`
- Callback function was removed. Use stream events `finish` or `error` to get notified about successful or unsuccessful deploys

## Sample project

There is a complete sample project if you checkout the [samples](./samples) directory.

	$ npm install
	$ ./node_modules/.bin/gulp

This will install gulp and allow you to run the sample. Gulp will run with with a local deploy configuration. You should see an artifact in the dist folder and a file deployed to your local _M2_HOME_ repository.

## Running tests

	$ npm test

## Contributions

All pull requests and issues are welcome!

Big thanks to [Gregers](https://github.com/gregersrygg) for making the [maven-deploy](https://www.npmjs.org/package/maven-deploy) module.
