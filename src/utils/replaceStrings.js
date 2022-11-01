/**
 * Replace strings with a model
 * @param {string} string 
 * @param {Object<string, string>} model 
 * @returns {string}
 */
module.exports = function replaceStrings(string, model) {
    let keys = Object.keys(model);

    for (let key of keys) {
        let reg = new RegExp(key, 'gm');

        string = string.replace(reg, model[key]);
    }

    return string;
}