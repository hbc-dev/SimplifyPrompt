const error = require('./moduleError');

/**
 * Check if a property exists or have a value
 * @param {object} options
 * @param {Object<string, any>} options.obj The object to check
 * @param {Array<string>} options.props The name of the properties to check
 * @param {boolean} options.onlyPropsModel Only have props model
 */
module.exports = function checkProp({obj, props, onlyPropsModel} = {obj: {}, props: [], onlyPropsModel: false}) {
    let keys = Object.keys(obj);

    for (let key of keys) {
        if (props.includes(key) && !obj[key])
            throw new error(`The ${key} property isn't provided!`)

        if (onlyPropsModel && !props.includes(key))
            throw new error(`An key isn't provided`)
    }

    return obj;
}