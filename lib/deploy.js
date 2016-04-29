var through = require('through2'),
    gmd = require('maven-deploy'),
    async = require('async'),
    assign = require('lodash.assign'),
    temp = require('temp').track(),
    File = require('vinyl');

module.exports = function deploy(options) {

    if (!options.hasOwnProperty('repositories')) {
        throw new Error('Missing repositories configuration');
    }

    options.repositories.forEach(function(repo) {
        if (!repo.hasOwnProperty('id') || !repo.hasOwnProperty('url')) {
            throw new Error('Deploy required "id" and "url".');
        }
    });

    var stream = through.obj(function (file, enc, fileDone) {
        var tempFile = temp.createWriteStream();

        file = new File(file);

        var fileOptions = assign({}, options, {
            //artifactId: file.artifactId || file.stem,
            artifactId: file.stem,
            type: file.extname.replace(/^\./, '')
        });

        tempFile.on('finish', function() {
            async.each(fileOptions.repositories, function (repo, repoDone) {
                gmd.config(fileOptions);
                gmd.deploy(repo.id, tempFile.path, options.snapshot, repoDone);
            }, fileDone);
        });

        file.pipe(tempFile);
        this.push(file);
    });

    stream.on('finish', function() {
        temp.cleanup();
    });

    return stream;
};
