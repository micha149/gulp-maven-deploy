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

All the samples below require a basic understanding of [Gulp](//gulpjs.com/) and [Maven](http://maven.apache.org/). Please look at the documentation for those projects for details.

## Installing

    $ npm install gulp-maven-deploy --save-dev

## Sample usage in a gulpfile.js

Below are two configuration samples:

Configuring a task for deploying to a Maven proxy

```javascript
var gulp = require('gulp'),
    maven = require('gulp-maven-deploy');
    zip = require('gulp-zip');

gulp.task('deploy', function(){
    gulp.src('.')
        .pipe(zip('my-artifact.war'))
        .pipe(maven.deploy({
            'groupId': 'com.mygroup',
            'repositories': [{
                'id': 'some-repo-id',
                'url': 'http://some-repo/url'
            }]
        }))
});
```

A task running a local Maven install:

```javascript
var gulp = require('gulp'),
    maven = require('gulp-maven-deploy'),
    zip = require('gulp-zip');

gulp.task('deploy-local', function(){
    gulp.src('.')
        .pipe(zip('my-artifact.war'))
        .pipe(maven.install({
            'groupId': 'com.mygroup',
        }))
});
```

Note: A local install in Maven means it is only available on your machine. A deployment is different as it means you ship the artifact off to some remote repository.

## Upgrading from 0.x to 1.x

With `gulp-maven-deploy` version 1.0.0 we want to go one more step into the
direction of a well performing gulp plugin. Following the single responsibility
principle this plugin will only perform the deploy part in the future.

- Implement a packaging logic for your files like [gulp-zip](https://github.com/sindresorhus/gulp-zip)
- Remove the additional config level from `options = {config: { ... }}` to `options = { ... }`
- Remove `artifactId` and `type` from config. They are now extracted from the file name. To influence
them, rename the file in the gulp stream before piping it to `gulp-maven-deploy`
- Callback function was removed. Use stream events `finish` or `error` to get notified about successful or unsuccessful deploys

## Example project

There is a complete example project if you checkout the [example](./example) directory.

    $ cd example
    $ npm install
    $ ./node_modules/.bin/gulp

This will install gulp and allow you to run the sample. Gulp will run with with a local deploy configuration
by default. You should see an artifact deployed to your local `M2_HOME` repository.

## Running tests

    $ npm test

## Contributions

All pull requests and issues are welcome!

Big thanks to [Gregers](https://github.com/gregersrygg) for making the [maven-deploy](https://www.npmjs.org/package/maven-deploy) module.
