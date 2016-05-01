var gulp = require('gulp'),
    zip = require('gulp-zip'),
    maven = require('../index');

gulp.task('deploy-remote', function() {
    gulp.src('.')
        .pipe(zip('sillysample.war'))
        .pipe(maven.deploy({
            'groupId': 'com.mygroup',
            'repositories': [{
                'id': 'some-repo-id',
                'url': 'http://some-repo/url'
            }]
        }));
});

gulp.task('deploy-local', function() {
    gulp.src('.')
        .pipe(zip('sillysample.war'))
        .pipe(maven.install({
            'groupId': 'com.mygroup',
        }));
});

gulp.task('default', ['deploy-local']);
