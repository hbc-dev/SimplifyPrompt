const Prompt = require('../src/Prompt');

const test = new Prompt({
    commands: [
        {
            name: 'install',
            aliases: ['i'],
            description: `Install a package`,
            required: true,
            type: 'any',
            options: [
                {
                    name: 'global',
                    aliases: ['g'],
                    description: 'Install a package globaly',
                    type: 'boolean',
                    action: ({value, commandValue}) => console.log(value, commandValue)
                }
            ]
        }
    ],
    prefix: {
        large: '~~',
        short: '@'
    }
});

try {
    let interaction = test.reply();
    console.log(interaction);
} catch(e) {console.log(e.message);process.exit();}