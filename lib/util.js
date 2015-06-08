module.exports.hasValidConfig = function hasValidConfig(options) {
    options = options || {};
    if (!options.hasOwnProperty('config') || typeof options.config !== 'object') {
        throw new Error('Missing required property "config" object.');
    }
    return true;
};
