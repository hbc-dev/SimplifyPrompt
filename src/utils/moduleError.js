module.exports = class PromptError extends Error {
    constructor(error) {
        super();

        this.message = error
        this.name = "[PromptError]"
    }
}