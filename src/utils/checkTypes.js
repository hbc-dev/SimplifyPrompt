/**
 * Return the type of an option value
 * @param {string} value The value
 * @param {"string" | "number" | "boolean" | "any"} type The type of the option
 * @return {string | number | boolean | null}
 */
module.exports = function checkTypes(value, type) {
    value = isNaN(parseInt(value)) ? value : parseInt(value);

    if (value == 'true') value = true;
    else if (value == 'false') value = false;

    if (type == 'any') return value;
    return (typeof value == type ? value : null);
}