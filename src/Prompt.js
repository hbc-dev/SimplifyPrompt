const error = require('./utils/moduleError');
const checkTypes = require('./utils/checkTypes');
const replaceStrings = require('./utils/replaceStrings');
const checkProp = require('./utils/checkProp');

/**
 * @typedef CommandOptions
 * @prop {string} name The name of this option
 * @prop {Array<string>} aliases The aliases of this option
 * @prop {string} description The description of this option
 * @prop {"string" | "boolean" | "number" | "any"} type The type of this option
 * @prop {OptionFunction} action The action of this option
 */

/**
 * @callback OptionFunction
 * @param {OptionFunctionProperties} options
 */

/**
 * @typedef OptionFunctionProperties
 * @prop {string | boolean | number} value The value of this option
 * @prop {string | boolean | number} commandValue The value of the interaction
 */

/**
 * @typedef CommandFunctionProperties
 * @prop {Array<undefined> | [string, string | number | boolean][]} args The arguments of this interaction
 * @prop {string | boolean | number} commandValue The value of this interaction 
 */

/**
 * @callback CommandFunction
 * @param {CommandFunctionProperties} options
 */

/**
 * @typedef CommandsOptions
 * @prop {string} name The name of this command
 * @prop {Array<string>} aliases The aliases of this command
 * @prop {boolean} required Select if the value of this command is required
 * @prop {"string" | "boolean" | "number" | "any"} type The type of command value
 * @prop {string} description The description of this command
 * @prop {Array<CommandOptions>} options The options of this command
 * @prop {CommandFunction} action The action of this command
 */

/**
 * @typedef PrefixOptions
 * @prop {string} large For large names
 * @prop {string} sort For aliases
 */

/**
 * @typedef ErrorMessages
 * @prop {string} COMMAND_DOESNT_EXIST Throwed when a command does not exist
 * @prop {string} MALFORMED_COMMAND Throwed when the sintaxis of the command is wrong
 * @prop {string} WRONG_DATA_TYPE Throwed when the type of some option is wrong
 * @prop {string} REQUIRED_VALUE Throwed when the value of the command is undefined
 */

/**
 * @typedef PromptOptions
 * @prop {ErrorMessages} errorMessages
 */

/**
 * @typedef ReplyResponse
 * @prop {string} commandName The name of the launched command
 * @prop {string | undefined} value The value of the launched command
 * @prop {Array<undefined> | [string, string | number | boolean][]} arguments The arguments for this command
 */

/**
 * Make a prompt
 * @module
 */
class Prompt {
    /**
     * The choices of this prompt
     * @type {Array<CommandsOptions>}
     */
    commands = [];
    /**
     * The prefix of this prompt
     * @type {PrefixOptions}
     */
    prefix = {large: '--', sort: '-'};
    /**
     * The options of this prompt
     * @type {PromptOptions}
     */
    #options = {}

    /**
     * Make a prompt
     * @param {object} options
     * @param {Array<CommandsOptions>} options.commands The commands of this prompt
     * @param {PrefixOptions} options.prefix The prefix of this prompt
     * @param {PromptOptions} options.options The options of this prompt
     */
    constructor({commands = [], prefix, options = {}} = {}) {
        if (!Array.isArray(commands))
            throw new error(`The "commands" property must be an array`);
        if (typeof prefix !== 'object')
            throw new error(`The "prefix" property must be an object`);
        if (typeof options !== 'object')
            throw new error(`The "options" property must be an object`);

        this.addCommands(commands);
        this.#options = options;
        this.prefix = {large: prefix.large ?? '--', sort: prefix.sort ?? '-'};
    }

    /**
     * Reply to a prompt interaction
     * @param {Array<string>} args
     * @return {ReplyResponse}
     */
    reply(args = process.argv.slice(2)) {
        if (!Array.isArray(args))
            throw new error(`The args param must be an array`);

        let commandName = args.shift();
        let commandValue =
          (args[0]?.startsWith(this.prefix.large) ||
          args[0]?.startsWith(this.prefix.sort)) ? undefined : args.shift();
        let command = this.commands.find(
            cmd => cmd.name === commandName ||
            cmd.aliases.includes(commandName)
        );

        if (!command) throw new error(
            replaceStrings(
                this.#options.errorMessages?.COMMAND_DOESNT_EXIST ??
                "The command does not exist!",
                {
                    "{command}" : commandName
                }
            )
        );

        if (command.required && !commandValue) throw new error(
                this.#options.errorMessages?.REQUIRED_VALUE ??
                "The command value is required!"
        );
        
        let checkValue = checkTypes(commandValue, command.type ?? 'any')
        if (checkValue == null) throw new error(
            replaceStrings(
                this.#options.errorMessages?.WRONG_DATA_TYPE ??
                `The command "{name}" wants this type for his value: {type}`,
                {
                    "{type}" : command.type,
                    "{name}" : command.name,
                }
            )  
        ); else commandValue = checkValue;
        
        commandName = command.name;
        args = args.map((x, i) => {
            i = i == 0 ? 0 : i*2;

            return !args[i] ? null : [args[i], args[i+1]]
        }).filter(x => x);

        let latestArguments = []; // remove duplicates
        if (command.options?.length > 0 && args.length > 0) {
            for (let argument of args) {
                let {options} = command;
                let option = argument[0];
                let value = argument[1];

                let type = option.startsWith(this.prefix.large) ? "large" :
                option.startsWith(this.prefix.sort) ? "sort" : null;

                if (!type) throw new error(
                    this.#options.errorMessages?.MALFORMED_COMMAND ??
                    "The command sintaxis isn't correct!"
                );

                if (type == 'large') option = option.slice(this.prefix.large.length);
                else option = option.slice(this.prefix.sort.length);

                let optionData = options.find(
                    opt => (type == 'large' && opt.name == option) ||
                    (type == 'sort' && opt.aliases.includes(option))
                );

                if (!optionData) {args.splice(args.indexOf(argument), 1);continue;}
                else {
                    argument[0] = optionData.name;

                    if (latestArguments.includes(optionData.name))
                        {args.splice(args.indexOf(argument));continue};

                    latestArguments.push(optionData.name);

                    let checkedTypes = checkTypes(value, optionData.type ?? 'any');
                    if (checkedTypes == null) throw new error(
                        replaceStrings(
                            this.#options.errorMessages?.WRONG_DATA_TYPE ??
                            `The option "{name}" wants this type: {type}`,
                            {
                                "{type}" : optionData.type,
                                "{name}" : optionData.name,
                                "{command}" : commandName
                            }
                        )
                    );

                    argument[1] = checkedTypes;

                    if (optionData.action) optionData.action({value: argument[1], commandValue});
                }
            }
        } else args = [args[0]?.[0]];

        if (command.action) command.action({args, commandValue});

        return {
            commandName,
            value: commandValue,
            arguments: args
        }
    }

    /**
     * Set commands for this prompt
     * @param  {...CommandsOptions | Array<CommandsOptions>} commands
     */
    addCommands(...commands) {
        if (Array.isArray(commands[0])) return this.#resolveCommands(...commands);
        else {
            for (let cmd of commands) {
                checkProp({obj: cmd, props: ["name"]});

                if (cmd.options) for (let option of cmd.options)
                    checkProp({obj: option, props: ["name"]})
            }

            this.commands.push(...commands);
        }

        return this;
    }

    /**
     * Resolve commands
     * @param {Array<CommandsOptions>} commands
     */
    #resolveCommands(commands) {
        if (!Array.isArray(commands))
            throw new error(`The commands param isn't array`);

        for (let cmd of commands) {
            checkProp({obj: cmd, props: ["name"]});

            if (cmd.options) for (let option of cmd.options)
                checkProp({obj: option, props: ["name"]});
        }

        this.commands.push(...commands);

        return this;
    }
}

module.exports = Prompt;