module.exports.hasValidConfig = function hasValidConfig(options) {
    options = options || {};
    return options.hasOwnProperty('config') && typeof options.config === 'object';
};
