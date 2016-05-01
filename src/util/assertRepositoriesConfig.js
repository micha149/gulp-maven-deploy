module.exports = function validateRepositoriesConfig(options) {
    if (!options.hasOwnProperty('repositories')) {
        throw new Error('Missing repositories configuration');
    }

    options.repositories.forEach(function(repo) {
        if (!repo.hasOwnProperty('id') || !repo.hasOwnProperty('url')) {
            throw new Error('Deploy required "id" and "url".');
        }
    });
};
