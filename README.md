# SimplifyPromptJS

## Introduction
With this package, you will be able to create prompts to interact with the command line in a simple way.

You can customize your indicator with numerous options and create commands too easy.

## `new Prompt(PromptConstructorOptions)`
With this class, you can create your own prompt.

| Param | Description | Default |
| - | - | -
| [PromptConstructorOptions](#promptconstructoroptions) | The constructor options for this prompt | [PromptConstructorOptions](#promptconstructoroptions) (default value)

> Check the [types](#types) part to see more information

## `<prompt>.addCommands(...commands):`[PromptProps](#promptprops)
Add commands to the prompt.

| Param | Description | Default | Type |
| - | - | - | - |
| commands | The list of commands to add | `undefined \| []` | ...[CommandsOptions](#commandsoptions) \| Array\<[CommandsOptions](#commandsoptions)>

**Usage:**
```js
const prompt = new Prompt(/*Options*/);

prompt.addCommands(
    {
        name: 'install',
        aliases: ['i'],
        description: 'Install a package'
    }
);
``` 

## `<prompt>.reply(args?):`[ReplyResponse](#replyresponse)
Reply to a prompt interation.

| Param | Description | Default | Type |
| - | - | - | - |
| args | The args of the prompt | `process.argv` | string |

**Usage:**
```js
const prompt = new Prompt(/*Options*/);

let interaction = prompt.reply();
```

### Types
#### PromptConstructorOptions
| Property | Description | Type | Default | Required
| - | - | - | - | - |
| commands | The commands of this prompt | Array<[CommandsOptions](#commandsoptions)> |`[]` | ❌
| prefix | The prefix options for this prompt | [PrefixOptions](#prefixoptions) | [PrefixOptions](#prefixoptions) (default value) | ❌
| options | The options for this prompt | [PromptOptions](#promptoptions) | `{}` | ❌

#### CommandsOptions
| Property | Description | Type | Default | Required
| - | - | - | - | - |
| name | The name of the command | string | `undefined` | ✅
| aliases | The aliases of this command | Array\<string> | `[]` | ❌
| description | The description of this command | string | `null` | ❌
| options | The options of this command | Array<[CommandOptions](#commandoptions)> | `[]` | ❌
| action | The action of this command. Launched when the command is invoked | [CommandActionParams](#commandactionparams)() | `() => {}` | ❌

#### CommandOptions
| Property | Description | Type | Default | Required
| - | - | - | - | - |
| name | The name of this option | string | `undefined` | ✅
| aliases | The aliases of this option | Array\<string> | `[]` | ❌
| description | The description of this option | string | `null` | ❌
| type | The type of this option | "string" \| "number" \| "boolean" \| "any" | `"any"` | ❌
| action | The action of this option. Launched when the option is invoked | [OptionActionParams](#optionactionparams)() | `() => {}` | ❌

#### CommandActionParams

#### OptionActionParams

#### PrefixOptions
| Property | Description | Type | Default | Required
| - | - | - | - | - |
| large | The large prefix for complete option name | string | `--` | ❌
| sort | The sort prefix for alias option | string | `-` | ❌

#### PromptOptions
| Property | Description | Type | Default | Required
| - | - | - | - | - |
| errorMessages | A object with all error messages | [ErrorMessages](#errormessages) | `{}` | ❌

#### ErrorMessages
| Property | Description | Type | Default | Required
| - | - | - | - | - |
COMMAND_DOESNT_EXIST | Invoked when a command doesn't exist | string | `"The command does not exist!"` | ❌
| MALFORMED_COMMAND | Invoked when a command have bad sintaxis | string | `"The command sintaxis isn't correct!"` | ❌
| WRONG_DATA_TYPE | Invoked when your provide a incorrect data type in a command option | string | `"The option "{name}" wants this type: {type}"` | ❌

#### PromptProps

#### ReplyResponse
| Property | Description | Type |
| - | - | - |
commandName | The name of the launched command | string |
| arguments | The arguments of this interaction | Array\<string> \| \[string, string \| number \| boolean][]