var through = require('through2'),
    gmd = require('maven-deploy'),
    async = require('async'),
    temp = require('temp').track(),
    File = require('vinyl'),
    assertRepositoriesConfig = require('./util/assertRepositoriesConfig'),
    buildFileOptions = require('./util/buildFileOptions');

module.exports = function deploy(options) {

    assertRepositoriesConfig(options);

    var stream = through.obj(function (file, enc, fileDone) {
        file = new File(file);
        var fileOptions = buildFileOptions(file, options);
        var tempFile = temp.createWriteStream({prefix:'.' + {suffix: '.' + fileOptions.type}});

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
