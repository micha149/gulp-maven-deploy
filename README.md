gulp-maven-deploy
=================

A [Gulp](//gulpjs.com/) wrapper for the [maven-deploy](https://www.npmjs.org/package/maven-deploy) module.

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
