var through = require('through2'),
    gmd = require('maven-deploy'),
    temp = require('temp').track();

module.exports = function install(options) {

    var stream = through.obj(function (file, enc, fileDone) {
        var tempFile = temp.createWriteStream();

        tempFile.on('finish', function() {
            gmd.config(options);
            gmd.install(tempFile.path, fileDone);
        });

        file.pipe(tempFile);
        this.push(file);
    });

    stream.on('finish', function() {
        temp.cleanup();
    });

    return stream;
};
