var assign = require('lodash.assign'),
    File = require('vinyl');

module.exports = function(file, baseOptions) {
    // Ensure file to be of new vinyl version
    file = new File(file);

    var fileOptions = assign({}, {
        artifactId: file.stem,
        type: file.extname.replace(/^\./, '')
    }, baseOptions);

    return fileOptions;
};
