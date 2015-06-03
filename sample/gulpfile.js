var gulp = require('gulp');
var maven = require('../index');

gulp.task('deploy-remote', function() {
	gulp.src('.')
		.pipe(maven.deploy({
			'config': {
				'groupId': 'com.mygroup',
				'type': 'war',
				'repositories': [{
					'id': 'some-repo-id',
					'url': 'http://some-repo/url'
				}]
			}
		}));
});

gulp.task('deploy-local', function() {
	gulp.src('.')
		.pipe(maven.install({
			'config': {
				'groupId': 'com.mygroup',
				'type': 'war'
			}
		}));
});


gulp.task('default', ['deploy-local']);